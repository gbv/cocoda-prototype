# VZG Cocoda Server

Cocoda server consists of a JSON API as server and a JavaScript user interface
as client. The server is written in Perl as Dancer2 application. The client is
written with [AngularJS](http://angularjs.org/).

## Requirements

1. Make sure you have at least Perl version 5.14.0

2. Make sure you have installed cpanminus.

## Local usage

All required commands for local usage can be executed via `Makefile`. Both
perlbrew and default system perl are supported but perlbrew must be switched
off to build a Debian package.

### Install dependencies

Install required Perl modules to perlbrew or to the `local/` directory with:

    make deps

### Run unit tests

    make test

Server tests are located in directory `t/`.

### Start the server

    make start

By default the local server is accessible at <http://localhost:5000/>. 

## Building a Debian package

The build script `makedpkg` installs all required Perl modules to
`local/`, runs all unit tests and creates a Debian package on success.
The script requires `debuild` and other debhelper tools. The packaing-dev
package contains all requirements among other tools:

    sudo apt-get install git packaging-dev

If using perlbrew, make sure to disable it before installing any modules
to `local/`:

    perlbrew off

The build script is the called via

    make build

# Installation

A build Debian package is located in directory `debuild/`. It can be installed
locally for instance with

    sudo dpkg --install debuild/cocoda_0.0.1_amd64.deb

## Administration

As Debian package, the Cocoda server is installed as user `cocoda` in directory
`/srv/cocoda`. The server is automatically started with upstart:

    initctl start cocoda
    initctl status cocoda
    initctl stop cocoda

Error logs are written to `/var/log/upstart/cocoda.log`.

# Cocoda client

To *locally* install test requirements:

    sudo apt-get install nodejs-legacy
    npm install karma bower grunt grunt-cli
    ./node_modules/.bin/grunt

# Build status

[![Build Status](https://travis-ci.org/gbv/Cocoda.png?branch=master)](https://travis-ci.org/gbv/Cocoda)

