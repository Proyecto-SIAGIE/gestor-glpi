pipeline {

    agent any
    environment{
        HOST_IP = '10.200.8.160'
        HOST_SSH_USER =  credentials('host_ssh_user_8_160')
        HOST_SSH_PASSWORD = credentials('host_ssh_password_8_160')
        PORT = 19206
        PROJECT_NAME="docker_mse_iged_gestor_glpi"
        PROJECT_FOLDER="mse_iged_dockers_images"

    }
    
    stages {

        stage('Docker Building') {
        agent any
        steps {
            sh 'cp .env.sample .env || true'
            sh "rm ${PROJECT_NAME}.tar || true"
            sh "docker build -t ${PROJECT_NAME} ."
            sh "docker save -o  ${PROJECT_NAME}.tar ${PROJECT_NAME}"
            sh 'ls'
        }
        }

        stage('Docker Transfer to Remote Host'){
        agent any
        steps{
            script{
                def remote = [:]
                remote.name = env.HOST_IP
                remote.host = env.HOST_IP
                remote.user = env.HOST_SSH_USER
                remote.password = env.HOST_SSH_PASSWORD
                remote.allowAnyHosts = true

                remote.fileTransfer = "sftp"
                sshCommand remote: remote, command: "pwd"
                sshCommand remote: remote, command: "mkdir -p ${PROJECT_FOLDER}"
                sshCommand remote: remote, command: "cd ${PROJECT_FOLDER} && rm  ${PROJECT_NAME}.tar || true"
                sshCommand remote: remote, command: "docker stop  \$( docker ps -q --filter ancestor=${PROJECT_NAME}) || true"
                sshCommand remote: remote, command: "docker image rm ${PROJECT_NAME} || true"
                remote.fileTransfer = "scp"
                sshPut remote: remote, from: "${PROJECT_NAME}.tar", into: "${PROJECT_FOLDER}"  
                remote.fileTransfer = "sftp"
                sshCommand remote: remote, command: "cd ${PROJECT_FOLDER} && docker load < ${PROJECT_NAME}.tar && docker image ls"
            }  
        }
        }

        stage('Docker Cleaning') {
        agent any
        steps {
            script{
                def remote = [:]
                remote.name = env.HOST_IP
                remote.host = env.HOST_IP
                remote.user = env.HOST_SSH_USER
                remote.password = env.HOST_SSH_PASSWORD
                remote.allowAnyHosts = true
                            
                remote.fileTransfer = "sftp"
                sshCommand remote: remote, command: "docker stop  \$( docker ps -q --filter ancestor=${PROJECT_NAME}) || true"
            }  
        }
        }  



        stage('Docker Run') {
        agent any
        steps {
            script{
                def remote = [:]
                remote.name = env.HOST_IP
                remote.host = env.HOST_IP
                remote.user = env.HOST_SSH_USER
                remote.password = env.HOST_SSH_PASSWORD
                remote.allowAnyHosts = true
                            
                remote.fileTransfer = "sftp"
                sshCommand remote: remote, command: "docker run -d -it --rm --network net.1 --name ${PROJECT_NAME} -p ${PORT}:19211 ${PROJECT_NAME}"
            }  
        }
        }
    }
    
}


