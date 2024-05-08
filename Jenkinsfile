pipeline{
    agent any
    
    stages{
        
        stage ("Emailing"){
            steps {
                emailext (attachLog: true, body: "Here is the pipeline logs for microservices project build N° ${BUILD_ID}", to:'achraf.bencheikhladhari@polytechnicien.tn' , subject: "Pipeline Microservices Logs Build N° ${BUILD_ID}")
            }
        }
    
    }
}