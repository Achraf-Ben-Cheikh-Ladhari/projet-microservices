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
                script {
                    def previousBuildId = BUILD_ID.toInteger() - 1
                    sh "docker rmi achrafladhari/gateway:${previousBuildId} --force"
                    sh "docker rmi achrafladhari/swagger:${previousBuildId} --force"
                    sh "docker rmi achrafladhari/orders:${previousBuildId} --force"
                    sh "docker rmi achrafladhari/games:${previousBuildId} --force"
                    sh "docker rmi achrafladhari/users:${previousBuildId} --force"

                }
            }
        }
        stage ("Building images and containers"){
            steps{
                sh 'docker compose up -d'
            }
        }
    }
}