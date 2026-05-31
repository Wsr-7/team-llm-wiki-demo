$ErrorActionPreference = "Stop"

$required = @("id", "title", "type", "status", "review_state", "confidence", "visibility", "owners", "source_refs", "created_at", "updated_at")
$pages = Get-ChildItem -Recurse -Path wiki -Filter *.md
$bad = @()

foreach ($page in $pages) {
  $text = Get-Content -Raw -Path $page.FullName
  if ($text -notmatch '(?s)^---\s+.*?\s+---') {
    $bad += "$($page.FullName): missing frontmatter"
    continue
  }
  foreach ($field in $required) {
    if ($text -notmatch "(?m)^$field\s*:") {
      $bad += "$($page.FullName): missing $field"
    }
  }
}

if ($bad.Count -gt 0) {
  $bad | ForEach-Object { Write-Error $_ }
  exit 1
}

Write-Host "frontmatter check passed"
