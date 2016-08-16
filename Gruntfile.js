module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc: {
            dist: {
                src: ['src/**/*.js'],
                excludePattern: '',
                options: {
                    destination: 'doc',
                    template: 'node_modules/minami'
                }
            }
        },

        jasmine: {
            components: {
                src: [
                    'src/**/*.js',
                    '!src/boot.js'
                ],
                options: {
                    specs: ['specs/**/*.js'],
                    keepRunner: false,
                    display: 'full',
                    summary: true,
                    junit: {
                        path: 'log/jasmine'
                    }
                }
            }
        },

        jsbeautifier: {
            modify: {
                src: [
                    'src/**/*.js',
                    'specs/**/*.js'
                ],
                options: {
                    config: '.jsbeautifyrc'
                }
            }
        },

        concat: {
            options: {},
            dist: {
                src: [
                    'src/virtualDom.js',
                    'src/decorators/*.js',
                    'src/boot.js'
                ],
                dest: 'output/virtualDom.js',
            },
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'src/**/*.js',
                'specs/**/*.js'
            ]
        },

        jscs: {
            all: [
                'src/**/*.js',
                'specs/**/*.js'
            ],
            options: {
                config: 'jscsRules.json'
            }
        },

        watch: {
            test: {
                files: [
                    'src/**/*.js',
                    'specs/**/*.js'
                ],
                tasks: ['jasmine']
            },
            jshint: {
                files: [
                    'src/**/*.js',
                    'specs/**/*.js'
                ],
                tasks: ['jshint']
            },
            jscs: {
                files: [
                    'src/**/*.js',
                    'specs/**/*.js'
                ],
                tasks: ['jscs']
            }
        },

        override: {
            jshint: {
                options: {
                    reporter: 'checkstyle',
                    reporterOutput: 'log/jshint/checkstyle.xml'
                }
            }
        }
    });

    // Init grunt time measurement for tasks
    require('time-grunt')(grunt);
    // Init grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Available tasks
    // 1. grunt (default)
    // 2. grunt dev (watch task)
    // 3. grunt doc (creates js docu)

    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('test', ['jasmine']);
    grunt.registerTask('compile', ['concat']);
    grunt.registerTask('qa', [
        'jshint',
        'jscs',
        'jasmine'
    ]);
    grunt.registerTask('push', [
        'jsbeautifier',
        'qa'
    ]);
};