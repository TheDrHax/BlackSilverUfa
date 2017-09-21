node('python-requests') {
    String repo = 'git@github.com:TheDrHax/BlackSilverUfa.git'
    String credentials = 'GitHub'

    stage('Pull') {
        git branch: 'master', credentialsId: credentials, url: repo
    }

    stage('Prepare') {
        sh 'git checkout remotes/origin/gh-pages -- chats'
    }

    stage('Build') {
        sh 'sh generate.sh'
    }

    stage('Commit') {
        sh 'git add chats links/*.md README.md'
        sh 'git stash'
        sh 'git branch -D gh-pages || true'
        sh 'git checkout -b gh-pages remotes/origin/gh-pages'
        sh 'git checkout stash -- chats links/*.md README.md'
        sh 'git stash pop'
        sh 'git commit -m "Jenkins: Обновление статических файлов" || true'
    }

    stage('Deploy') {
        sshagent (credentials: [credentials]) {
            sh 'git push origin gh-pages'
        }
    }
}
