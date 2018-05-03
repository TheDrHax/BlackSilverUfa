node('docker && git') {
    String cred_git = 'GitHub'
    String cred_github = 'GitHub-Token'

    String github_account = 'TheDrHax'
    String github_repo = 'BlackSilverUfa'
    String input_branch = 'master'

    String repo_url = 'git@github.com:' + github_account + '/' + github_repo + '.git'


    stage('Pull') {
        git branch: input_branch, credentialsId: cred_git, url: repo_url
    }

    stage('Prepare') {
        sh 'git config --global user.email "the.dr.hax@gmail.com"'
        sh 'git config --global user.name "Jenkins"'
        sh './bsu pages checkout force'
    }

    stage('Build') {
        sh './bsu image build'
        try {
            sh './bsu download-chats'
            sh './bsu build'
        } catch (error) {
            throw error
        } finally {
            sh './bsu image remove'
        }
    }

    stage('Commit') {
        sh './bsu pages commit'
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
            sh './bsu pages push'
        }
    }
}
