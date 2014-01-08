# VZG Cocoda Server

Cocoda server consists of a JSON API as server and a JavaScript user interface
as client. The server is written in Perl as Dancer2 application. The client is
written with [AngularJS](http://angularjs.org/).

## Requirements

1. Make sure you have at least Perl version 5.14.0

2. Make sure you have installed cpanminus.

## Running the server

Either install required Perl modules in your default Perl
include path with

    cpanm --installdeps . # add sudo if installing to system perl

and start the server with

    perl -Ilib bin/app.psgi

or install required Perl modules to the `local/` directory as required
by the final Debian package. There is a makefile to do so with

    make deps

followed by

    make start

## Running unit tests

With required modules in your default Perl include path:

    prove -l t

With required modules in `local/`:

    make test

## Building a Debian package

The build script `makedpkg` installs all required Perl modules to
`local/`, runs all unit tests and creates a Debian package on success.
The script requires `debuild` and other debhelper tools. The packaing-dev
package contains all requirements among other tools:

    sudo apt-get install git packaging-dev

If using perlbrew, make sure to disable it before installing any modules
to `local/`:

    hash perlbrew 2>/dev/null && perlbrew off

The build script is the called via

    makedpkg

The resulting package is located in directory `debuild/`. It can be installed
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

