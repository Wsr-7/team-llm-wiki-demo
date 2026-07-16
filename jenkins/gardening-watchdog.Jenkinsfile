// J3: gardening dead-man switch (see docs/ci.md).
// Setup: create a Pipeline job, "Pipeline script from SCM" pointing at this
// file; the cron trigger below fires every Monday. The job turns RED when no
// gardening PR has been merged to main for 21 days — wire your normal
// red-build notification (email / Teams) to it, or uncomment the webhook.
// Convention this relies on: gardening PRs are squash-merged keeping the
// "gardening: YYYY-MM-DD" title (prompts/gardening.md).
pipeline {
  agent any
  triggers { cron('H 2 * * 1') }
  options { timestamps() }
  stages {
    stage('watchdog') {
      steps {
        sh '''
          git fetch origin main
          RECENT=$(git log origin/main --since="21 days ago" --grep="^gardening:" --oneline)
          if [ -z "$RECENT" ]; then
            echo "GARDENING OVERDUE: no gardening PR merged to main in 21 days."
            echo "Current gardener: run prompts/gardening.md (rotation: team/people.md notes)."
            # Optional Teams notification:
            # curl -H "Content-Type: application/json" \
            #   -d '{"text":"[team-llm-wiki] Gardening overdue (21 days). See prompts/gardening.md"}' \
            #   "$TEAMS_WEBHOOK"
            exit 1
          fi
          echo "OK: recent gardening activity:"
          echo "$RECENT"
        '''
      }
    }
  }
}
