'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-clean');    
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        pkg: require('./package.json'),
        ngdocs: {
            options: {
                html5Mode: false,
                startPage: '/api',
                scripts: [
                    'angular.js',
                    'src/ng-skos.js',
                    'src/directives/skosLabel.js',
                    'src/directives/skosConcept.js',
                    'src/services/skosAccess.js',
                    'demo/lib/angular-resource.min.js',
                    'demo/lib/angular-sanitize.min.js',
                ]
            },
            api: {
                title: 'API Reference',
                src: [
                    'src/*.js',
                    'src/**/*.js',
                    'src/*.ngdoc',
                ],
            },
        },
        connect: {
            options: {
                keepalive: true
            },
            server: {}
        },
        clean: ['docs'],
        karma: {
            unit: { 
                configFile: 'karma.conf.js',
                keepalive: true,
                singleRun: true,
                autoWatch: false,
            },
            watch: {
                configFile: 'karma.conf.js',
                keepalive: true,
                singleRun: false,
                autoWatch: true,
            }
        }
    });

    grunt.registerTask('default',['docs','test','connect']);
    grunt.registerTask('docs',['clean','ngdocs']);
    grunt.registerTask('test',['karma:unit']);
    grunt.registerTask('watch',['karma:watch']);
};
