#!/usr/bin/env node

// Load packages
const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

// Get runtime args with Yargs
const argv = require('yargs')
  .usage('$0')
  .alias('h', 'help')
  .help()
  .option('config', {
    alias: 'c',
    describe: 'path to config file',
    type: 'string',
    nargs: 1,
    demand: true,
    default: path.resolve('./config.yaml') // is this a sane default?
  })
  .argv

// Load config file
try {
  var config = yaml.safeLoad(fs.readFileSync(argv.config, 'utf8'))
} catch (e) {
  // Oh no! Print a message about the error
  if (e.code === 'ENOENT') {
    console.log(argv.config + ' not found!')
  } else {
    console.log(e)
  }

  // Exit program
  process.exit(1)
}

// Function to run an executable command
const exec = function (command) {
  execSync(command,
    (error, stdout, stderr) => {
      // Log stdout and stderr
      console.log(`${stdout}`)
      console.log(`${stderr}`)

      if (error !== null) {
        // Error
        console.log(`error: ${error}`)
      }
    })
}

// Execute each branch sync
for (var project in config['projects']) {
  // Unpack variables
  let projectDirectory = config['projects'][project]['repository-directory']
  let sourceRemote = config['projects'][project]['source']['remote']
  let sourceBranch = config['projects'][project]['source']['branch']
  let destinationRemote = config['projects'][project]['destination']['remote']
  let destinationBranch = config['projects'][project]['destination']['branch']

  // Build the path to the .git directory for each project
  let projectGitDirectory = path.resolve(`${projectDirectory.replace(/\/$/, '')}/.git`)

  // Perform the sync
  try {
    exec(`git --git-dir=${projectGitDirectory} fetch ${sourceRemote} ${sourceBranch}`)
    exec(`git --git-dir=${projectGitDirectory} checkout ${sourceRemote}/${sourceBranch}`)
    exec(`git --git-dir=${projectGitDirectory} checkout -B ${sourceBranch}`)
    exec(`git --git-dir=${projectGitDirectory} push ${destinationRemote} ${sourceBranch}:${destinationBranch}`)
  } catch (e) {
    // Syncing this project failed. Move on to next project.
  }
}
