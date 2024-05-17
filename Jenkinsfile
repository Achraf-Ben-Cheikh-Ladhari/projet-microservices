pipeline{
    agent any
    triggers {
        pollSCM('* * * * *') 
    }
    stages{
        stage("Verify tooling"){
            steps{
                sh '''
                  docker version
                  docker info
                  docker compose version
                  jq --version
                '''
            }
        }
         stage("Versioning") {
            steps {
                sh "echo Version: ${BUILD_ID}"
            }
        }
       stage("Clean up before building") {
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
        stage ("Building"){
            steps{
                sh 'docker compose up -d'
            }
        }
        stage("Send Requests") {
            steps {
                script {
                    sleep(time: 30, unit: 'SECONDS')
                }
                sh './requests.sh'
            }
        }
        stage ("Logging Containers"){
            steps{
                sh 'docker logs gateway'
                sh 'docker logs swagger'
                sh 'docker logs users'
                sh 'docker logs games'
                sh 'docker logs orders'
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
        stage ("Emailing"){
            steps {
                emailext (attachLog: true, body: "Here is the pipeline logs for microservices project build N° ${BUILD_ID}", to: 'achraf.bencheikhladhari@polytechnicien.tn' , subject: "Pipeline Microservices Logs Build N° ${BUILD_ID}")
                emailext (attachLog: true, body: "Here is the pipeline logs for microservices project build N° ${BUILD_ID}", to: 'nouralislem.sbaa@polytechnicien.tn' , subject: "Pipeline Microservices Logs Build N° ${BUILD_ID}")
            }
        }
    
    }
}
