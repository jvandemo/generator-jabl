module.exports = function (grunt) {

    grunt.initConfig({
        jablConfig: grunt.file.readJSON('jabl.json'),
        concat: {
            options: {
                separator: ''
            },
            angular: {
                src: [
                    'src/js/src/<%%= jablConfig.angular.appModuleName.camelized %>/<%%= jablConfig.angular.appModuleName.camelized %>.prefix',
                    'src/js/src/<%%= jablConfig.angular.appModuleName.camelized %>/<%%= jablConfig.angular.appModuleName.camelized %>.js',
                    'src/js/src/<%%= jablConfig.angular.appModuleName.camelized %>/controllers/**/*.js',
                    'src/js/src/<%%= jablConfig.angular.appModuleName.camelized %>/directives/**/*.js',
                    'src/js/src/<%%= jablConfig.angular.appModuleName.camelized %>/filters/**/*.js',
                    'src/js/src/<%%= jablConfig.angular.appModuleName.camelized %>/services/**/*.js',
                    'src/js/src/<%%= jablConfig.angular.appModuleName.camelized %>/<%%= jablConfig.angular.appModuleName.camelized %>.suffix'
                ],
                dest: 'public/js/<%%= jablConfig.appTitle.camelized %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%%= jablConfig.appTitle.original %> <%%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            jid: {
                files: {
                    'public/js/<%%= jablConfig.appTitle.camelized %>.min.js': ['<%%= concat.angular.dest %>']
                }
            }
        },
        jshint: {
            beforeConcat: {
                src: ['gruntfile.js', 'src/js/src/<%%= jablConfig.angular.appModuleName.camelized %>/**/*.js']
            },
            afterConcat: {
                src: [
                    '<%%= concat.angular.dest %>'
                ]
            },
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    angular: true
                },
                globalstrict: false
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: [
                'Gruntfile.js',
                'src/**/*'
            ],
            tasks: ['default']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint:beforeConcat', 'concat', 'jshint:afterConcat', 'uglify']);
    grunt.registerTask('build', ['default']);
    grunt.registerTask('livereload', ['default', 'watch']);

};