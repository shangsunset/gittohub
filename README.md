# quickhub
Creating github project made even easier

Every time you want to start a project, you have to `git init`, create a repo on Github, and type a bunch of commands
to `add remote origin` blah blah.
I can never remember those commands, so I created this little tool - one simple command is all you need.

## Install
```
npm install quickhub -g
```

## Usage

```
quickhub awesomeProject
```

Result from running above command:

```
Initialized empty Git repository in /Users/shangyeshen/Sites/quickhub/awesomeProject/.git/

[master (root-commit) 99605e3] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
Branch master set up to track remote branch master from origin.
```

Or using it as a module:
```javascript
const quickhub = require('quickhub')

const username = 'john';
const password = 'doe';

quickhub('awesomeProject', {username, password}).then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  })
```

Response:
```
{
  'Initialized empty Git repository in /Users/shangyeshen/Sites/quickhub/awesomeProject/.git/\n\n
  [master (root-commit) a2631fb] first commit\n
  1 file changed, 1 insertion(+)\n
  create mode 100644 README.md\n
  Branch master set up to track remote branch master from origin.\n'
}
```


## License
MIT
