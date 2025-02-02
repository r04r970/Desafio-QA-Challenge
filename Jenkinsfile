pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/r04r970/desafio-qa-challenge.git'
            }
        }

        stage('Build') {
            steps {
                sh 'echo "Building..."'
                // Adicione comandos de build aqui, se necessário
            }
        }

        stage('Test') {
            steps {
                sh 'echo "Running tests..."'
                // Adicione comandos para rodar os testes aqui
                // Exemplo: sh 'mvn test' para projetos Maven
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml' // Publique relatórios de teste JUnit
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'echo "Deploying..."'
                // Adicione comandos de deploy aqui, se necessário
            }
        }
    }
}