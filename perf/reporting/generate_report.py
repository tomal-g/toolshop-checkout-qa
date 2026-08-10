import argparse
import csv
import json
from pathlib import Path


def load_result(path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def get_metric(metrics, metric_name):
    return metrics.get(metric_name, {})


def get_value(metric, key, default=""):
    value = metric.get(key)
    return default if value is None else value


def format_number(value, decimals=2):
    if value == "" or value is None:
        return ""

    if isinstance(value, (int, float)):
        return f"{value:.{decimals}f}"

    return value


def format_rate(value):
    if value == "" or value is None:
        return ""

    return f"{value * 100:.2f}%"


def collect_thresholds(summary):
    """Collect thresholds from the k6 summary export.

    In the k6 --summary-export format, thresholds are NOT at the top
    level. Instead, each metric carries its own `thresholds` dict that
    maps a threshold expression (e.g. "p(95)<500") to a boolean result.

    The boolean result from the summary export is unreliable in some
    k6 versions, so we return the raw expression -> metric value map
    and evaluate the comparison ourselves.
    """
    thresholds = {}

    for metric_name, metric in summary.get("metrics", {}).items():
        metric_thresholds = metric.get("thresholds", {})
        if not metric_thresholds:
            continue

        for expression in metric_thresholds:
            actual_value = get_threshold_value(metric, expression)
            thresholds[expression] = {
                "metric": metric_name,
                "actual": actual_value,
            }

    return thresholds


def get_threshold_value(metric, expression):
    """Extract the actual value for a threshold expression.

    Supported prefixes: p(90), p(95), p(99), avg, med, min, max, rate, count.

    For Rate-type metrics like `http_req_failed`, the summary export
    stores `passes`/`fails`/`value` instead of a `rate` field, so we
    compute the rate from `passes`/`fails`.
    """
    for prefix in ("p(99)", "p(95)", "p(90)"):
        if expression.startswith(prefix):
            return metric.get(prefix)

    for prefix in ("avg", "med", "min", "max", "count"):
        if expression.startswith(prefix):
            return metric.get(prefix)

    if expression.startswith("rate"):
        passes = metric.get("passes")
        fails = metric.get("fails")

        if passes is not None and fails is not None:
            total = passes + fails
            if total > 0:
                return passes / total

        return metric.get("rate")

    return None


def evaluate_expression(expression, actual):
    """Evaluate a threshold expression like 'p(95)<500' against a value."""
    import re

    match = re.match(r"^(.*?)([<>]=?|=)(.*)$", expression.strip())

    if not match or actual is None:
        return None

    _, operator, expected_str = match.groups()

    try:
        expected = float(expected_str)
    except ValueError:
        return None

    actual = float(actual)

    if operator == "<":
        return actual < expected
    if operator == ">":
        return actual > expected
    if operator == "<=":
        return actual <= expected
    if operator == ">=":
        return actual >= expected
    if operator == "=":
        return actual == expected

    return None


def determine_verdict(summary):
    thresholds = collect_thresholds(summary)

    if not thresholds:
        return "NO THRESHOLDS"

    for expression, info in thresholds.items():
        ok = evaluate_expression(expression, info["actual"])
        if ok is False:
            return "FAIL"

    return "PASS"


def threshold_details(summary):
    thresholds = collect_thresholds(summary)

    if not thresholds:
        return "No thresholds configured."

    lines = []

    for expression, info in thresholds.items():
        ok = evaluate_expression(expression, info["actual"])
        status = "PASS" if ok else "FAIL"

        actual = info["actual"]
        if isinstance(actual, float):
            actual_str = f"{actual:.2f}"
        else:
            actual_str = str(actual)

        lines.append(
            f"- `{expression}`: **{status}** "
            f"(actual: {actual_str})"
        )

    return "\n".join(lines)


def error_rate(metric):
    """Compute error rate from http_req_failed.

    The k6 summary export represents http_req_failed with
    `passes`/`fails`/`value` rather than a `rate` field.

    For a Rate metric, `passes` counts `add(true)` calls and
    `fails` counts `add(false)` calls. For `http_req_failed`,
    `add(true)` means the request failed, so the error rate is
    `passes / (passes + fails)`.
    """
    passes = metric.get("passes", 0)
    fails = metric.get("fails", 0)
    total = passes + fails

    if total == 0:
        return ""

    return format_rate(passes / total)


def checks_count(metric):
    """Compute total checks from the `checks` metric.

    The k6 summary export represents `checks` with
    `passes`/`fails`/`value` rather than a `count` field.
    """
    passes = metric.get("passes", 0)
    fails = metric.get("fails", 0)

    if passes == 0 and fails == 0:
        return get_value(metric, "value", "")

    return passes + fails


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--input", required=True)
    parser.add_argument("--csv-output", required=True)
    parser.add_argument("--environment", required=True)
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--timestamp", required=True)

    args = parser.parse_args()

    input_dir = Path(args.input)
    csv_output = Path(args.csv_output)

    csv_output.parent.mkdir(parents=True, exist_ok=True)

    result_files = sorted(input_dir.glob("*_result.json"))

    if not result_files:
        print("ERROR: No k6 result files found.")
        return 1

    rows = []

    for result_file in result_files:

        summary = load_result(result_file)

        metrics = summary.get("metrics", {})

        duration = get_metric(metrics, "http_req_duration")
        failed = get_metric(metrics, "http_req_failed")
        requests = get_metric(metrics, "http_reqs")
        iterations = get_metric(metrics, "iterations")
        vus_max = get_metric(metrics, "vus_max")
        checks = get_metric(metrics, "checks")

        verdict = determine_verdict(summary)

        rows.append({
            "Test": result_file.stem.replace("_result", ""),
            "Max VUs": get_value(vus_max, "max"),
            "Iterations": get_value(iterations, "count"),
            "HTTP Requests": get_value(requests, "count"),
            "Throughput (req/s)": format_number(
                get_value(requests, "rate")
            ),
            "Avg (ms)": format_number(
                get_value(duration, "avg")
            ),
            "Median (ms)": format_number(
                get_value(duration, "med")
            ),
            "P90 (ms)": format_number(
                get_value(duration, "p(90)")
            ),
            "P95 (ms)": format_number(
                get_value(duration, "p(95)")
            ),
            "P99 (ms)": format_number(
                get_value(duration, "p(99)")
            ),
            "Max (ms)": format_number(
                get_value(duration, "max")
            ),
            "HTTP Error Rate": error_rate(failed),
            "Checks": checks_count(checks),
            "Verdict": verdict,
        })

    fieldnames = list(rows[0].keys())

    with csv_output.open(
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()
        writer.writerows(rows)

    print(f"CSV report generated: {csv_output}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())