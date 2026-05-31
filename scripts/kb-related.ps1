param(
  [Parameter(Mandatory=$true)][string]$PageId
)

$pages = Get-ChildItem -Recurse -Path wiki -Filter *.md
$items = @()

function Get-Field($text, $name, $fallback) {
  if ($text -match "(?m)^$name\s*:\s*(.+)$") { return $Matches[1].Trim().Trim('"') }
  return $fallback
}

function Get-SourceRefs($text) {
  $refs = @()
  $inBlock = $false
  foreach ($line in ($text -split "`n")) {
    if ($line -match '^source_refs:\s*$') { $inBlock = $true; continue }
    if ($inBlock -and $line -match '^\s*-\s*(.+)$') { $refs += $Matches[1].Trim(); continue }
    if ($inBlock -and $line -match '^[A-Za-z_]+:') { break }
  }
  return $refs
}

foreach ($page in $pages) {
  $text = Get-Content -Raw -Path $page.FullName
  $items += [pscustomobject]@{
    Path = $page.FullName
    Id = Get-Field $text "id" $page.BaseName
    Text = $text
    SourceRefs = Get-SourceRefs $text
  }
}

$target = $items | Where-Object { $_.Id -eq $PageId -or $_.Path -like "*$PageId*" } | Select-Object -First 1
if (-not $target) {
  Write-Error "Page not found: $PageId"
  exit 1
}

$related = @()
$links = [regex]::Matches($target.Text, '\[\[([^\]|]+)(\|[^\]]+)?\]\]')
foreach ($m in $links) {
  $related += [pscustomobject]@{ To = $m.Groups[1].Value; Reason = "direct-wikilink" }
}

foreach ($other in $items | Where-Object { $_.Id -ne $target.Id }) {
  if ($other.Text -match [regex]::Escape("[[$($target.Id)]]")) {
    $related += [pscustomobject]@{ To = $other.Id; Reason = "backlink" }
  }
  $shared = @($target.SourceRefs | Where-Object { $other.SourceRefs -contains $_ })
  foreach ($src in $shared) {
    $related += [pscustomobject]@{ To = $other.Id; Reason = "shared-source $src" }
  }
}

$related | Sort-Object To,Reason -Unique
