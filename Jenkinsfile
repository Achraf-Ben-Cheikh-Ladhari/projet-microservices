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
                    sh "docker compose down -v"
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
        stage("Deploy") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-pwd', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]){
                        sh "docker login -u ${USERNAME} -p ${PASSWORD}"
                        sh "docker push ${USERNAME}/gateway:${BUILD_ID}"
                        sh "docker push ${USERNAME}/swagger:${BUILD_ID}"
                        sh "docker push ${USERNAME}/orders:${BUILD_ID}"
                        sh "docker push ${USERNAME}/games:${BUILD_ID}"
                        sh "docker push ${USERNAME}/users:${BUILD_ID}"

                    }
                }
            }
        }
    
    }
}