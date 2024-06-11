pipeline {
  agent any

  tools {
    nodejs "Nodejs"
  }

  environment {
    DOCKER_REGISTRY = "docker.io"
    DOCKERHUB_CREDENTIALS = credentials('DOCKER_HUB_CREDENTIAL')
    VERSION = "${env.BUILD_ID}"
  }

  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build Project') {
      steps {
        // Build the Angular project
        sh 'npm run build'
      }
    }

    stage('Docker Build and Push') {
      steps {
        script {
          // Login to DockerHub
          sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
          // Build and push Docker image
          sh '''
            docker build -t canbeaudocker/food-delivery-app-fe:${VERSION} .
            docker push canbeaudocker/food-delivery-app-fe:${VERSION}
          '''
        }
      }
    }

    stage('Cleanup Workspace') {
      steps {
        deleteDir()
      }
    }

    stage('Update Image Tag in GitOps') {
      steps {
        script {
          // Checkout the GitOps repository
          checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'git-ssh', url: 'git@github.com:Gitcanbeau/66_food_app.git']])
          
          // Update the image tag in the manifest file
          sh '''
            sed -i "s/image:.*/image: canbeaudocker\\/food-delivery-app-fe:${VERSION}/" aws/angular-manifest.yml
          '''
          
          // Check for changes and commit if there are any
          sh 'git add aws/angular-manifest.yml'
          sh 'git diff --cached --quiet || git commit -m "Update image tag to ${VERSION}"'

          // Push changes to the repository
          sshagent(['git-ssh']) {
            sh 'git push origin main'
          }
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline finished successfully.'
    }
    failure {
      echo 'Pipeline failed.'
    }
  }
}
