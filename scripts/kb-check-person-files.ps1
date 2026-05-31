$ErrorActionPreference = "Stop"

$bad = @()
$files = Get-ChildItem -Path persons -Filter *.md -File

foreach ($file in $files) {
  if ($file.BaseName -notmatch '^[0-9]{8}$') {
    $bad += "$($file.FullName): person file name must be 8 digits"
    continue
  }
  $text = Get-Content -Raw -Path $file.FullName
  if ($text -notmatch "staff_id:\s*`"$($file.BaseName)`"") {
    $bad += "$($file.FullName): staff_id must match file name"
  }
  if ($text -notmatch "id:\s*staff:$($file.BaseName)") {
    $bad += "$($file.FullName): id must be staff:$($file.BaseName)"
  }
}

if ($bad.Count -gt 0) {
  $bad | ForEach-Object { Write-Error $_ }
  exit 1
}

Write-Host "person file check passed"
