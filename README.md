# DEV environment for ore-ero
The open source catalog of Canada

### Configuration
 - Make sure you have the [DEV environment for PRB0T](https://github.com/fredericlestage-vdm/PRB0t) installed and configured.
 - In the `_config.yml` file, change line 11 with `github_username: [your github username]` (without the brackets).
 - Still in the `_config.yml` file, change line 13 for `prbot_url: "http"//localhost:[port]`, where `[port]` is either `3000` by default, or the custom one you use for the PRB0T local server.

This will allow the communication between your own local PRB0T with this local version of the project. You'll then be able to test with access to both projects which makes the debugging much easier. Console.log to your heart content.

You also can make these changes directly in your current repository if you don't want to work with multiple occurences of the same project, or you already have made some changes and don't want to have to replicate them. Just don't forget to change them back to their default values.
 - Default github username is `canada-ca`
 - Default PRB0T url is `https://canada-pr-bot.herokuapp.com/`

### Then you can start the project
 - Start with a casual `npm install`
 - Followed by a `bundle install`
 - Then you can `bundle exec jekyll serve` to launch the project on a local server (hosted on http://localhost:4000/ore-ero/)

### FAQ
Getting a Connection closed error while trying to fetch? Make sure your localhost url uses http and not https.
