[![Build Status](https://travis-ci.com/mwiens91/branchsync.svg?branch=master)](https://travis-ci.com/mwiens91/branchsync)
[![codecov](https://codecov.io/gh/mwiens91/branchsync/branch/master/graph/badge.svg)](https://codecov.io/gh/mwiens91/branchsync)
[![npm](https://img.shields.io/npm/v/branchsync.svg)](https://www.npmjs.com/package/branchsync)

# branchsync

A lightweight Node.js script to pull from one Git branch and to push to
another. Useful for syncing master branches of projects hosted on, for
example, both GitHub and Bitbucket. Also useful as a cron job.

## Installation

### npm

To install from npm, run

```
npm install --global branchsync
```

### Source

Clone this repository, then install dependencies with

```
npm install
```

and run the script with

```
./branchsync.js
```

## Usage

**WARNING**: *never* run this script in clones of repositories you are
actively working in! You may lose uncommited changes due to this script!

The first thing you need to do is to fill out the config file. There's
an example config file at the base of the repository called
[config.yaml.example](config.yaml.example). Should be fairly self
explanatory.

When running the script with no arguments, i.e.,

```
branchsync
```

a config file is looked for in `$CWD/config.yaml` where `$CWD` is your
current working directory. To explicitly pass in a config file path, use
the `--config` (or `-c`) flag:

```
branchsync --config /path/to/config.yaml
```

### cron scheduling

There's a good chance you'll want to schedule this task, probably with
cron. A quick Google search (for example, "cron schedule linux") should
point you in the right direction with this.
