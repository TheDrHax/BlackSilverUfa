node('docker && git') {
    String cred_git = 'GitHub'
    String cred_github = 'GitHub-Token'

    String github_account = 'TheDrHax'
    String github_repo = 'BlackSilverUfa'
    String input_branch = 'master'
    String output_branch = 'gh-pages'

    String repo_url = 'git@github.com:' + github_account + '/' + github_repo + '.git'

    String docker_image = 'thedrhax/buildenv-blacksilverufa'
    String reused = 'chats'
    String outputs = 'chats links src static index.html'


    stage('Pull') {
        git branch: input_branch, credentialsId: cred_git, url: repo_url
    }

    stage('Prepare') {
        sh 'git config --global user.email "the.dr.hax@gmail.com"'
        sh 'git config --global user.name "Jenkins"'
        sh 'git checkout remotes/origin/' + output_branch + ' -- ' + reused
    }

    stage('Build') {
        sh 'docker build -t ' + docker_image + ' docker/'
        sh 'docker run --rm -v \$(pwd):/bsu --workdir /bsu -u \$(id -u) ' + docker_image + ' ./generate.py'
        sh 'docker rmi ' + docker_image
    }

    stage('Commit') {
        sh 'git add ' + outputs
        sh 'git stash'
        sh 'git branch -D ' + output_branch + ' || true'
        sh 'git checkout -b ' + output_branch + ' remotes/origin/' + output_branch
        sh 'rm -rf ' + outputs
        sh 'git checkout stash -- ' + outputs
        sh 'git stash drop'
        sh 'git add ' + outputs
        sh 'git commit -m "Jenkins: Обновление статических файлов" || true'
    }

    stage('Deploy') {
        githubNotify(
            status: "SUCCESS",
            credentialsId: cred_github,
            account: github_account,
            repo: github_repo,
            sha: input_branch
        )
        sshagent (credentials: [cred_git]) {
            sh 'git push origin ' + output_branch
        }
    }
}
