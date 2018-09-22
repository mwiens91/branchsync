#!/usr/bin/env node

// Load packages
var fs = require('fs')
var path = require('path')
var yaml = require('js-yaml')

// Get runtime args with Yargs
var argv = require('yargs')
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
for (let i in [1, 2, 3]) {
  // Fetch source branch

  // Push to destination branch
}
