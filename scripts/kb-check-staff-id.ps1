$ErrorActionPreference = "Stop"

$files = Get-ChildItem -Recurse -Include *.md,*.json,*.yml,*.yaml -File
$bad = @()

foreach ($file in $files) {
  $text = Get-Content -Raw -Path $file.FullName
  $matches = [regex]::Matches($text, 'staff:[0-9A-Za-z_-]+')
  foreach ($m in $matches) {
    if ($m.Value -notmatch '^staff:[0-9]{8}$') {
      $bad += "$($file.FullName): invalid staff id $($m.Value)"
    }
  }
}

if ($bad.Count -gt 0) {
  $bad | ForEach-Object { Write-Error $_ }
  exit 1
}

Write-Host "staff-id check passed"
