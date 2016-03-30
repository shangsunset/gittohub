'use strict';

const exec = require('child_process').exec;
const fs = require('fs');

const fetch = require('node-fetch');
const Promise = require('promise');
const argv = require('minimist')(process.argv.slice(2));
const read = require('read');

function  createRepo(credentials, projectName) {

  const url = 'https://' + credentials.username + ':' + credentials.password + '@api.github.com/user/repos';

  const project = {
    'name': projectName,
    'private': false,
    'has_issues': true,
    'has_wiki': true,
    'has_downloads': true
  };

  return fetch(url, {
    method: 'post',
    headers: {
      'User-Agent': 'gittohub'
    },
    body: JSON.stringify(project)
  })
  .then((res) => {

    if (res.status === 201) {

      return addRemote(credentials.username, projectName);
    } else if (res.status === 442) {
      console.log('Project already exists.');
    } else if (res.status === 401) {
      console.log('Bad credentials');
    } else {
      console.log('Somethings is wrong');
      process.exit();
    } 
  })
  .catch(error => {
    console.error(error);
  });
}

function  initGit(projectName) {

  return new Promise((resolve, reject) => {

    const dir = exec(`mkdir ${projectName}`, (error, stdout, stderr) => {
      if (stderr) {
        reject(stderr);
      }

      const git = exec('git init', {cwd: `${__dirname}/${projectName}`}, (error, stdout, stderr) => {

        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);

      });
    });
  });

}

function addRemote(username, projectName) {
  const command = `
    echo "# ${projectName}" >> README.md
    git add README.md
    git commit -m "first commit"
    git remote add origin https://github.com/${username}/${projectName}.git
    git push -u origin master
  `
  const remote = exec(command, {cwd: `${__dirname}/${projectName}`}, (error, stdout, stderr) => {
    if (error) throw error;
    if (stderr) {
      console.log(stderr);
    }

    console.log(stdout);
  });
}

function getCredentials(cb) {
  
  read({prompt: 'github username: '}, (error, username) => {
    read({prompt: 'github password: ', silent: true}, (error, password) => {
      cb(username, password)
    });
  });
}

function  getUserInfo() {

  const configPath = `${process.env.HOME}/.gittohub`;

  return new Promise((resolve, reject) => {

    fs.stat(configPath, (error, stats) => {

      // if file doesnt exist
      if (error) {

        getCredentials((username, password) => {

          const credentials = { username, password };

          fs.writeFile(configPath, JSON.stringify(credentials, null, 2), (error) => {

            if (error) reject(error);
            resolve(credentials);
          });

        });

      } else {

        fs.readFile(configPath, (error, data) => {
          if (error) reject(error);

          resolve(JSON.parse(data));
        });
      }

    });
  });
}

if (!module.parent) {
  
  const projectName = argv['_'][0];
  if (!projectName) {

    process.exit();

  } else {
  const projectPath = `${__dirname}/${projectName}`;

  initGit(projectName)
    .then((res) => {

      console.log(res);
      return getUserInfo();
    })
    .then(credentials => {

      return createRepo(credentials, projectName);

    })
    .catch(error => {
      console.log(error)
    });

  }
}
