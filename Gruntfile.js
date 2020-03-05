/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        meta: {
            version: '0.1.1'
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
            dist: {
                src: [
                    'src/libs/CFBUtils.js',
                    'src/libs/factory/TextFactory.js',
                    'src/libs/factory/IconFactory.js',
                    'src/libs/factory/StateProvince.js',
                    'src/libs/factory/CountryCodes.js',
                    'src/libs/factory/TimezoneDB.js',
                    'src/libs/components/ToolTip.js',
                    'src/libs/buttons/SimpleButton.js',
                    'src/libs/buttons/ConstructiveButton.js',
                    'src/libs/buttons/DestructiveButton.js',
                    'src/libs/buttons/ButtonMenu.js',
                    'src/libs/buttons/CloseButton.js',
                    'src/libs/buttons/HelpButton.js',
                    'src/libs/buttons/SkipButton.js',
                    'src/libs/buttons/HamburgerButton.js',
                    'src/libs/buttons/TagButton.js',
                    'src/libs/inputs/DatePicker.js',
                    'src/libs/inputs/InputElement.js',
                    'src/libs/inputs/TextInput.js',
                    'src/libs/inputs/BooleanToggle.js',
                    'src/libs/inputs/NumberInput.js',
                    'src/libs/inputs/DateInput.js',
                    'src/libs/inputs/EmailInput.js',
                    'src/libs/inputs/URIInput.js',
                    'src/libs/inputs/HiddenField.js',
                    'src/libs/inputs/PasswordInput.js',
                    'src/libs/inputs/SelectMenu.js',
                    'src/libs/inputs/RadioGroup.js',
                    'src/libs/inputs/StateMenu.js',
                    'src/libs/inputs/CountryMenu.js',
                    'src/libs/inputs/TimezoneMenu.js',
                    'src/libs/inputs/TextArea.js',
                    'src/libs/inputs/FileInput.js',
                    'src/libs/components/LoadingShade.js',
                    'src/libs/components/DialogWindow.js',
                    'src/libs/components/Panel.js',
                    'src/libs/components/FloatingPanel.js',
                    'src/libs/components/DataGrid.js',
                    'src/libs/components/Growler.js',
                    'src/libs/components/InstructionBox.js',
                    'src/libs/components/MessageBox.js',
                    'src/libs/components/PasswordGenerator.js',
                    'src/libs/components/PasswordChangeForm.js',
                    'src/libs/components/TabBar.js',
                    'src/libs/components/SearchControl.js',
                    'src/libs/components/SimpleProgressMeter.js',
                    'src/libs/components/RadialProgressMeter.js',
                    'src/libs/SimpleForm.js'
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
                    'dist/style/cornflowerblue.css': 'src/sass/cornflowerblue.scss'
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
