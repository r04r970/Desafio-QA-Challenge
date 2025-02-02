pipeline {
    agent any

    tools {
        nodejs 'NodeJS 14' // Nome da instalação do NodeJS configurada no Jenkins
    }

    stages {
        stage('Clonar Repositório') {
            steps {
                git 'https://github.com/r04r970/desafio-qa-challenge.git'
            }
        }

        stage('Instalar Dependências') {
            steps {
                sh 'npm install'
            }
        }

        stage('Executar Testes') {
            steps {
                sh 'npx cypress run'
            }
        }
    }
}
