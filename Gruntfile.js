'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-clean');    
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        pkg: require('./package.json'),
        ngdocs: {
            all: ['src/*.js','src/directives/*.js'],
            startPage: 'ng-skos',
        },
        connect: {
            options: {
                keepalive: true
            },
            server: {}
        },
        clean: ['docs'],
    });

    grunt.registerTask('default',['clean','ngdocs','connect']);
};
