// J2: rebuild INDEX.md on main (see docs/ci.md).
// Setup: create a Pipeline job triggered by pushes to main (webhook or SCM
// polling), "Pipeline script from SCM" pointing at this file.
// Requirements: Node.js >= 22.6 on the agent; the checkout credential (or a
// bound credential) must have push access to main — see docs/branch-protection.md
// for the bypass note. No npm install needed.
pipeline {
  agent any // or agent { label 'nodejs' }
  options {
    timestamps()
    disableConcurrentBuilds()
  }
  stages {
    stage('rebuild-index') {
      steps {
        sh 'node --version'
        sh 'npm run build-index'
        sh '''
          if ! git diff --quiet -- INDEX.md; then
            git config user.name  "jenkins-bot"
            git config user.email "jenkins-bot@company.com"
            git add INDEX.md
            git commit -m "chore: rebuild INDEX.md [bot]"
            git push origin HEAD:main
          else
            echo "INDEX.md already up to date."
          fi
        '''
      }
    }
  }
}
