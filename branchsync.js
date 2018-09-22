#!/usr/bin/env node

// Allow help and version runtime flags with Yargs
require('yargs')
  .usage('$0')
  .alias('h', 'help')
  .help()
  .argv
