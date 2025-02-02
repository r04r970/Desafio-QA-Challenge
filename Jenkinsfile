pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'echo "Installing dependencies..."'
                bat 'npm install'
                bat 'npx playwright install'
            }
        }

        stage('Run UI Tests') {
            steps {
                bat 'echo "Running UI Tests..."'
                bat 'npm run test:uije'
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
                bat 'echo "Running API Tests..."'
                bat 'npm run test:api'
            }
            post {
                always {
                    junit '**/test-results.xml' // Ajuste o caminho conforme a saída dos testes
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