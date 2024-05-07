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
        stage ("Clean up old images and containers"){
            steps{
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