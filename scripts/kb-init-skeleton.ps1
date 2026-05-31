$dirs = @(
  "raw/sources",
  "raw/meetings",
  "raw/incidents",
  "raw/sessions",
  "confluence-mirror/glossary",
  "confluence-mirror/pages",
  "confluence-mirror/manifest",
  "inbox/ingest-candidates",
  "inbox/promotion-candidates",
  "inbox/conflict-review",
  "inbox/stale-review",
  "inbox/sync-review",
  "wiki/overview",
  "wiki/glossary",
  "wiki/concepts",
  "wiki/teams",
  "wiki/projects",
  "wiki/systems",
  "wiki/practices",
  "wiki/runbooks",
  "wiki/decisions",
  "wiki/learning",
  "wiki/mirrored",
  "persons",
  "schemas",
  "templates",
  "prompts",
  "scripts",
  "indexes",
  "graph",
  "logs",
  "exports",
  "site"
)

foreach ($dir in $dirs) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $keep = Join-Path $dir ".gitkeep"
  if (-not (Test-Path $keep)) {
    New-Item -ItemType File -Path $keep | Out-Null
  }
}

Write-Host "skeleton directories ensured"
