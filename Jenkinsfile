// PR / branch validation for the knowledge base (job J1 in docs/ci.md).
// Requirements: Node.js >= 22.6 on the agent. Zero npm dependencies — no
// `npm install` stage needed. Wire this into a Multibranch Pipeline and mark
// the build as a required merge check on the hosting platform.
pipeline {
  agent any // or a label with Node.js, e.g. agent { label 'nodejs' }
  options {
    timestamps()
    disableConcurrentBuilds()
  }
  stages {
    stage('check') {
      steps {
        // Windows agents: replace `sh` with `bat`.
        sh 'node --version'
        sh 'npm run check'
      }
    }
  }
}
