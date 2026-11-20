pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/code72694-max/E-TAT-.git'
            }
        }
        stage('Sync & Deploy Frontend Container') {
            steps {
                sh '''
                    cd /opt/etat/repos/frontend && git pull origin main
                    cd /opt/etat
                    docker compose build fe
                    docker compose up -d --no-deps fe
                '''
            }
        }
        stage('Health Check') {
            steps {
                sh '''
                    sleep 3
                    curl -sf http://fe:80/ || curl -sf http://localhost:80/
                '''
            }
        }
    }
}
