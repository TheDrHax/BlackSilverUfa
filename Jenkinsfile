node('python-pip') {
    String cred_git = 'GitHub'
    String cred_github = 'GitHub-Token'

    String github_account = 'TheDrHax'
    String github_repo = 'BlackSilverUfa'
    String branch = 'master'

    String repo_url = 'git@github.com:' + github_account + '/' + github_repo + '.git'

    String reused = 'chats'
    String outputs = 'chats links README.md'


    stage('Pull') {
        git branch: branch, credentialsId: cred_git, url: repo_url
        sh 'pip install -r requirements.txt'
        sh 'pip install -U https://github.com/TheDrHax/Twitch-Chat-Downloader/archive/master.zip'
    }

    stage('Prepare') {
        sh 'git config --global user.email "the.dr.hax@gmail.com"'
        sh 'git config --global user.name "Jenkins"'
        sh 'git checkout remotes/origin/gh-pages -- ' + reused
    }

    stage('Build') {
        sh 'python generate.py'
    }

    stage('Commit') {
        sh 'git add ' + outputs
        sh 'git stash'
        sh 'git branch -D gh-pages || true'
        sh 'git checkout -b gh-pages remotes/origin/gh-pages'
        sh 'rm -rf ' + outputs
        sh 'git checkout stash -- ' + outputs
        sh 'git stash drop'
        sh 'git add ' + outputs
        sh 'git commit -m "Jenkins: Обновление статических файлов" || true'
    }

    stage('Deploy') {
        githubNotify status: "SUCCESS", credentialsId: cred_github, account: github_account, repo: github_repo, sha: branch
        sshagent (credentials: [cred_git]) {
            sh 'git push origin gh-pages'
        }
    }
}
