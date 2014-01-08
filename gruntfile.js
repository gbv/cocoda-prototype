var src = ['public/js/modules/cocoda.js'];

module.exports = function(grunt) {
    grunt.initConfig({
        karma: {
            unit: {
                // 
            },
            travis: {
                configFile: 'karma.conf.js', // TODO 
                singleRun: true,
                browsers: ['PhantomJS'],
            }
        },
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('devmode',['karma:unit']);

    grunt.registerTask("test",['karma:travis']);
}
