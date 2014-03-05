'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-clean');    
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg: require('./package.json'),
        ngdocs: {
            options: {
                html5Mode: false,
                navTemplate: 'html/nav.html',
                startPage: '/api',
                scripts: [
                    'angular.js',
                    'demo/lib/angular-resource.min.js',
                    'demo/lib/angular-sanitize.min.js',
                    'ng-skos.js',
                    'src/json-text.js',
                ]
            },
            guide: {
                title: 'Guide',
                src: ['guide/*.ngdoc'],
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
        },
        concat: {
            dist: {
                src: ['src/*.js','src/**/*.js'],                                          
                dest: 'ng-skos.js',
            },
        }
    });

    grunt.registerTask('default',['docs','test','connect']);
    grunt.registerTask('docs',['clean','concat','ngdocs']);
    grunt.registerTask('test',['karma:unit']);
    grunt.registerTask('watch',['karma:watch']);
};
