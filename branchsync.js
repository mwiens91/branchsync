#!/usr/bin/env node

// Load packages
const exec = require('child_process').execSync
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

  // Fetch source branch
  try {
    exec(`git --git-dir=${projectGitDirectory} fetch ${sourceRemote} ${sourceBranch}`,
      (error, stdout, stderr) => {
        // Log stdout and stderr
        console.log(`${stdout}`)
        console.log(`${stderr}`)

        if (error !== null) {
          // Error fetching
          console.log(`fetch error: ${error}`)
        }
      })
  } catch (e) {
    // Source fetching failed. Move on to next project.
    continue
  }

  // Push to destination branch
  exec(`git --git-dir=${projectGitDirectory} push ${destinationRemote} ${destinationBranch}`,
    (error, stdout, stderr) => {
      // Log stdout and stderr
      console.log(`${stdout}`)
      console.log(`${stderr}`)

      if (error !== null) {
        // Error fetching
        console.log(`push error: ${error}`)
      }
    })
}
