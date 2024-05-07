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
        stage("Clean up before creating images") {
            steps {
                sh 'ansible-playbook playbook.yml'
            }
        }
        stage ("Building images and containers"){
            steps{
                sh 'docker compose up -d'
            }
        }
    }
}