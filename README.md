# Requirements

Require AngularJS >= 1.2.

# Development

For development install Node.js, if it is not already installed. Node.js
includes `npm` to install additional packages. For global installation one
might require to call npm via `sudo -H`.

First install Grunt locally

    npm install grunt 

As far as I understand, `Gruntfile.js` is kind of a Makefile for JavaScript
projects. Then install all required npm modules as listed in `package.json`
by calling

    npm install

## Running unit tests

First install Karma using npm:

    npm install -g karma   

Testing is configured in `karma.conf.js` and all tests are located in the
`test` directory.

To execute of all unit tests, as done on travis-ci (see `.travis.yml`), call:

    karma start --no-auto-watch --single-run --reporters=dots --browsers=Firefox

For contious testing (tests are re-run on changes), call:

    karma start --reporters=dots --browsers=Firefox

Unit tests are written with [Jasmine](http://pivotal.github.io/jasmine/).

## Documentation

Documentation is written using
[ngdoc](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation)
with module [grunt-ngdocs](https://www.npmjs.org/package/grunt-ngdoc).

Just call

    grunt
