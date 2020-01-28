/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        meta: {
            version: '0.1.0'
        },
        banner: '/*! Cornflower Blue - v<%= meta.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* http://www.gaijin.com/cornflowerblue/\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            'Brandon Harris; Licensed MIT */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            sass: {
                src: [
                    'sass/_Variables.scss',
                    'sass/_ChecksAndRadios.scss',
                    'sass/_PasswordGenerator.scss',
                    'sass/_DialogWindow.scss',
                    'sass/_Animations.scss',
                    'sass/cornflowerblue.scss',
                    'sass/_DataGrid.scss',
                    'sass/_SimpleForm.scss',
                    'sass/_Inputs.scss',
                    'sass/_SelectMenu.scss',
                    'sass/_GeneralBehavior.scss',
                    'sass/_Buttons.scss',
                    'sass/_Growler.scss',
                    'sass/_MessageBox.scss',
                    'sass/_Panels.scss',
                    'sass/_FileInput.scss',
                    'sass/_InstructionBox.scss',
                    'sass/_Font.scss',
                    'sass/_Mixins.scss',
                    'sass/_TabBar.scss',
                    'sass/_InputContainers.scss',
                    'sass/_ProgressMeter.scss',
                    'sass/_RadioGroup.scss'
                ],
                dest: 'dist/sass/cornflowerblue.scss'
            },
            dist: {
                src: [
                    './libs/Utils.js',
                    './libs/factory/IconFactory.js',
                    './libs/factory/StateProvince.js',
                    './libs/buttons/SimpleButton.js',
                    './libs/buttons/ConstructiveButton.js',
                    './libs/buttons/DestructiveButton.js',
                    './libs/buttons/ButtonMenu.js',
                    './libs/buttons/HelpButton.js',
                    './libs/buttons/SkipButton.js',
                    './libs/inputs/InputElement.js',
                    './libs/inputs/TextInput.js',
                    './libs/inputs/BooleanToggle.js',
                    './libs/inputs/NumberInput.js',
                    './libs/inputs/EmailInput.js',
                    './libs/inputs/URIInput.js',
                    './libs/inputs/HiddenField.js',
                    './libs/inputs/PasswordInput.js',
                    './libs/inputs/SelectMenu.js',
                    './libs/inputs/RadioGroup.js',
                    './libs/inputs/StateMenu.js',
                    './libs/inputs/TextArea.js',
                    './libs/inputs/FileInput.js',
                    './libs/components/DialogWindow.js',
                    './libs/components/FloatingPanel.js',
                    './libs/components/Growler.js',
                    './libs/components/InstructionBox.js',
                    './libs/components/MessageBox.js',
                    './libs/components/PasswordGenerator.js',
                    './libs/components/PasswordChangeForm.js',
                    './libs/components/TabBar.js',
                    './libs/components/SimpleProgressMeter.js',
                    './libs/components/RadialProgressMeter.js',
                    './libs/SimpleForm.js'
                ],
                dest: 'dist/lib/cornflowerblue.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/lib/cornflowerblue.min.js'
            }
        },
        jshint: {
            options: {
                laxbreak: true,
                browser: true,
                curly: false,
                eqeqeq: true,
                immed: false,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,
                unused: false,
                boss: true,
                eqnull: true,
                esversion: 8,
                globals: {}
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'dist/style/cornflowerblue.css': 'sass/cornflowerblue.scss'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Default task.
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'sass']);

};
