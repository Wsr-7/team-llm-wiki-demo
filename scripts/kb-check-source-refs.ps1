$ErrorActionPreference = "Stop"

$pages = Get-ChildItem -Recurse -Path wiki -Filter *.md
$bad = @()

foreach ($page in $pages) {
  $text = Get-Content -Raw -Path $page.FullName
  if ($text -match '(?m)^status:\s*active' -and $text -notmatch '(?m)^source_refs:\s*\r?\n\s*-') {
    $bad += "$($page.FullName): active page missing source_refs"
  }
}

if ($bad.Count -gt 0) {
  $bad | ForEach-Object { Write-Error $_ }
  exit 1
}

Write-Host "source_refs check passed"
