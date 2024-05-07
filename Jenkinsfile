pipeline{
    agent any
    
    stages{
        stage("Verify tooling"){
            steps{
                sh '''
                  docker version
                  docker info
                  docker compose version
                  curl --version
                  ansible --version
                '''
            }
        }
         stage("Versioning") {
            steps {
                sh './increment_version.sh'
            }
        }

        stage ("Building images and containers"){
            steps{
                sh 'docker compose up -d'
            }
        }
    }
}