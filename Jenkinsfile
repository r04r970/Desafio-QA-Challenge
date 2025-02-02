pipeline {
    agent any

    environment {
        // Exemplo de variável de ambiente
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'echo "Installing dependencies..."'
                sh 'npm install'
                sh 'npx playwright install'
            }
        }

        stage('Run UI Tests') {
            steps {
                sh 'echo "Running UI Tests..."'
                sh 'npm run test:ui'
            }
            post {
                always {
                    junit 'test-results/**/*.xml' // Ajuste o caminho conforme a saída dos testes
                    archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                }
            }
        }

        stage('Run API Tests') {
            steps {
                sh 'echo "Running API Tests..."'
                sh 'npm run test:api'
            }
            post {
                always {
                    junit 'test-results/**/*.xml' // Ajuste o caminho conforme a saída dos testes
                    archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}