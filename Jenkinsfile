def hostName = 'asia.gcr.io'
def projectId = 'rbh-express-dev'
def imageName = 'secret-m-poc'
def key_jenkins = 'rbh-express'
def appName = 'secret-m-poc'
def branch = 'develop'
def image = "${hostName}/${projectId}/${imageName}"
def imageTag = "${hostName}/${projectId}/${imageName}:${appName}.${branch}.${env.BUILD_NUMBER}"
def app
pipeline {
    agent {
      kubernetes {
        label 'common-deploy'
      }
    }
    environment {
        PROJECT_ID = 'rbh-express-dev'
        CLUSTER_NAME = 'gke-express-dev'
        LOCATION = 'asia-southeast1-a'
        CREDENTIALS_ID = 'rbh-express'
    }
    stages {
        stage ('Checkout') {
          steps {
              script {
                checkout scm
                def commit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
            }
          }
        }
        stage ('Add Project GCP') {
          steps {
            script {
              sh("sed -i.bak 's#gcp*#${projectId}#' .env")
              }
           }
        }
        stage ('Build image') {
          steps {
            script {
              app = docker.build("${imageTag}")
              }
           }
        }
        stage ('Push image to registry') {
          steps {
            script { 
              docker.withRegistry('https://asia.gcr.io', "gcr:${key_jenkins}") {
              app.push()
              }
            }
          }
        }
        stage ('Update image') {
          steps {
            sh("sed -i.bak 's#${hostName}*#${imageTag}#' deployment.yaml")
          }
        }
        stage('Deploy to GKE') {
            steps{
                step([
                $class: 'KubernetesEngineBuilder',
                projectId: env.PROJECT_ID,
                clusterName: env.CLUSTER_NAME,
                location: env.LOCATION,
                manifestPattern: 'deployment.yaml',
                credentialsId: env.CREDENTIALS_ID,
                verifyDeployments: true])
            }
        }
    }
}
