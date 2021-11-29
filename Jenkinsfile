node('python3 && git && (tzdata || !alpine)') {
    String cred_git = 'GitHub'
    String cred_github = 'GitHub-Token'

    String github_account = 'BlackSilverUfa'
    String github_repo = 'BlackSilverUfa-Beta'
    String input_branch = 'master'

    String repo_url = 'git@github.com:' + github_account + '/' + github_repo + '.git'


    stage('Prepare') {
        git branch: input_branch, credentialsId: cred_git, url: repo_url

        sh '''
            git config --local user.email "the.dr.hax@gmail.com"
            git config --local user.name "Jenkins"
        '''

        sh './bsu venv update'

        sshagent (credentials: [cred_git]) {
            sh './bsu repo pull --force'
        }
    }

    stage('Build') {
        parallel 'Data': {
            sh './bsu generate --download-chats'
        }, 'Frontend': {
            sh './bsu webpack'
        }
    }

    stage('Deploy') {
        sh './bsu pages commit "Jenkins: Обновление статичных файлов"'

        sshagent (credentials: [cred_git]) {
            sh './bsu pages push'
        }

        githubNotify(
            status: "SUCCESS",
            credentialsId: cred_github,
            account: github_account,
            repo: github_repo,
            sha: input_branch
        )
    }

    stage('Clean') {
        sh './bsu repo prune --optional'
        sh 'git gc --prune=now'
    }
}
