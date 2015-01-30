# cocoda [![Build Status](https://travis-ci.org/gbv/cocoda.svg?branch=master)](https://travis-ci.org/gbv/cocoda)

## Development

First, **clone** the repository from <https://github.com/gbv/cocoda>.

Second, install Node.js unless it is already installed. Node.js includes `npm`
to install additional packages. 

Install required libraries with bower:

    npm install -g bower
    bower install


Testing is configured in `karma.conf.js` and **unit tests** are located in
directory `test` written with [Jasmine](http://pivotal.github.io/jasmine/). 

As configured in `.travis.yml` the tests are automatically 
[executed at travis-ci](https://travis-ci.org/gbv/cocoda)
when pushed to GitHub.
