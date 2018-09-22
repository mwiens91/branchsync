#!/usr/bin/env node

// Load path package
let path = require('path')

// Allow help and version runtime flags with Yargs
let argv = require('yargs')
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

// Execute each branch sync
for (let i in [1, 2, 3]) {
  // Fetch source branch

  // Push to destination branch
}
