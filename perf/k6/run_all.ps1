$ErrorActionPreference = "Stop"

# ------------------------------------------------------------
# Environment
# ------------------------------------------------------------

$env:BASE_URL = $env:PERF_BASE_URL
$env:ALLOW_PUBLIC_API = $env:ALLOW_PUBLIC_API

if (-not $env:BASE_URL) {
    Write-Host "ERROR: PERF_BASE_URL is not set." -ForegroundColor Red
    exit 1
}

if ($env:BASE_URL -eq "https://api.practicesoftwaretesting.com" -and
    $env:ALLOW_PUBLIC_API -ne "true") {

    Write-Host "ERROR: Public API execution is disabled." -ForegroundColor Red
    Write-Host "Set ALLOW_PUBLIC_API=true only after explicit authorization." -ForegroundColor Yellow
    exit 1
}

# ------------------------------------------------------------
# Final executable performance scenarios
# ------------------------------------------------------------

$SCRIPTS = @(
    "01_load_products",
    "02_load_product_detail",
    "04_spike_products",
    "05_soak_products"
)

# ------------------------------------------------------------
# Reporting directories
# ------------------------------------------------------------

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

$environmentName = if ($env:BASE_URL -eq "https://api-with-bugs.practicesoftwaretesting.com") {
    "bug-seeded"
} else {
    "non-public"
}

$rawDir = "reports/performance/raw/$environmentName/$timestamp"
$csvDir = "reports/performance/csv"

New-Item -ItemType Directory -Path $rawDir -Force | Out-Null
New-Item -ItemType Directory -Path $csvDir -Force | Out-Null

# ------------------------------------------------------------
# Header
# ------------------------------------------------------------

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       k6 PERFORMANCE TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Target:      $($env:BASE_URL)"
Write-Host "Environment: $environmentName"
# Write-Host "User:        $($env:TEST_USER)"
Write-Host "Raw reports: $rawDir"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------
# Execute tests
# ------------------------------------------------------------

$results = @{}
$overallExecutionSuccess = $true

foreach ($script in $SCRIPTS) {

    Write-Host "Running $script..." -ForegroundColor Yellow

    $outFile = "$rawDir/${script}_result.json"

    k6 run `
        --summary-export="$outFile" `
        "perf/k6/scripts/${script}.js"

    $exitCode = $LASTEXITCODE

    $results[$script] = $exitCode

    if ($exitCode -eq 0) {
        Write-Host "$script : PASS" -ForegroundColor Green
    }
    else {
        Write-Host "$script : FAIL" -ForegroundColor Red
        $overallExecutionSuccess = $false
    }

    Write-Host ""
}

# ------------------------------------------------------------
# Generate consolidated reports
# ------------------------------------------------------------

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       GENERATING REPORTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

python perf/reporting/generate_report.py `
    --input "$rawDir" `
    --csv-output "$csvDir/performance_summary_$timestamp.csv" `
    --environment "$environmentName" `
    --base-url "$($env:BASE_URL)" `
    --timestamp "$timestamp"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Report generation failed." -ForegroundColor Red
    exit 1
}

# ------------------------------------------------------------
# Final execution summary
# ------------------------------------------------------------

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       PERFORMANCE TEST RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

foreach ($script in $SCRIPTS) {

    if ($results[$script] -eq 0) {
        Write-Host "$script : PASS" -ForegroundColor Green
    }
    else {
        Write-Host "$script : FAIL" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Cart flow: BLOCKED (BLK-004)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Raw reports:      $rawDir"
Write-Host "CSV report:       $csvDir/performance_summary_$timestamp.csv"
Write-Host ""

if ($overallExecutionSuccess) {
    Write-Host "OVERALL EXECUTION: PASS" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "OVERALL EXECUTION: ONE OR MORE TESTS FAILED" -ForegroundColor Red
    exit 1
}