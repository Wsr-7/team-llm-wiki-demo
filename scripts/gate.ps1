# 确定性审查门：包装本仓库已有的 schema 校验（npm run check）并附加 git 状态检查。
# 用法: pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/gate.ps1
# exit 0 = PASS，exit 1 = FAIL。
$repo = Split-Path $PSScriptRoot -Parent
Set-Location $repo
$failures = @()
$warnings = @()

Write-Host "[1/2] npm run check (wiki schema + index)..."
$checkOut = npm run check 2>&1
if ($LASTEXITCODE -ne 0) {
    $failures += "npm run check failed"
    $checkOut | Select-Object -Last 25 | Write-Host
} else {
    Write-Host "  OK"
}

Write-Host "[2/2] git state..."
$dirty = git status --porcelain
if ($dirty) {
    $failures += "working tree not clean (worker must commit):`n$($dirty -join "`n")"
} else {
    Write-Host "  clean"
}
git rev-parse --abbrev-ref '@{u}' *> $null
if ($LASTEXITCODE -eq 0) {
    $ahead = git rev-list --count '@{u}..HEAD'
    if ([int]$ahead -gt 0) { $warnings += "$ahead unpushed commit(s) on current branch" }
} else {
    $warnings += "current branch has no upstream"
}

Write-Host ""
$warnings | ForEach-Object { Write-Host "WARN: $_" }
if ($failures) {
    $failures | ForEach-Object { Write-Host "FAIL: $_" }
    Write-Host "GATE: FAIL"
    exit 1
}
Write-Host "GATE: PASS"
exit 0
