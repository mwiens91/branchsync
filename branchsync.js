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
    default: path.resolve('./config.yaml') // is this a sane default?
  })
  .option('silent', {
    alias: 'quiet',
    describe: 'show no output',
    type: 'boolean',
    default: false
  })
  .option('verbose', {
    describe: 'show stdout and stderr',
    type: 'boolean',
    default: false
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
const execClosure = (verbose) => {
  // See
  // https://nodejs.org/api/child_process.html#child_process_options_stdio
  let stdioOption

  if (verbose) {
    stdioOption = 'inherit'
  } else {
    stdioOption = 'ignore'
  }

  return (command) => execSync(command, {'stdio': stdioOption})
}

const exec = execClosure(argv.verbose)

// Execute each branch sync
for (var project in config['projects']) {
  // Unpack variables
  let projectDirectory = config['projects'][project]['repository-directory']
  let sourceRemote = config['projects'][project]['source']['remote']
  let sourceBranch = config['projects'][project]['source']['branch']
  let destinationRemote = config['projects'][project]['destination']['remote']
  let destinationBranch = config['projects'][project]['destination']['branch']

  // Perform the sync
  try {
    exec(`git -C ${projectDirectory} fetch ${sourceRemote} ${sourceBranch}`)
    exec(`git -C ${projectDirectory} checkout ${sourceRemote}/${sourceBranch}`)
    exec(`git -C ${projectDirectory} checkout -B ${sourceBranch}`)
    exec(`git -C ${projectDirectory} push ${destinationRemote} ${sourceBranch}:${destinationBranch}`)
  } catch (e) {
    // Syncing this project failed. Move on to next project.
    if (!argv.silent) {
      console.error(e)
    }
  }
}
