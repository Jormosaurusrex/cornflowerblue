"use strict";

class CornflowerBlueDemo {

    static get SIMPLE_LOGIN_FORM() {
        return {
            instructions: {
                icon: 'help-circle',
                instructions: [
                    "Enter your username and password."
                ]
            },
            elements: [
                new EmailInput({
                    label: "Email",
                    autocomplete: 'off',
                    required: true
                }),
                new PasswordInput({
                    label: "Password",
                    forceconstraints: false,
                    placeholder: "Enter your password.",
                    required: true
                }),
                new BooleanToggle({
                    label: "Remember Me",
                    style: "toggle",
                    labelside: 'right'
                })
            ],
            handler: function(self, callback) {
                let results = {
                    success: false,
                    errors: ['Email and password do not match.']
                };
                callback(results);
            },
            actions: [
                new ConstructiveButton({
                    text: "Login",
                    icon: "lock-open",
                    hot: true,
                    submits: true,
                    disabled: true  // No action needed.
                }),
                new SimpleButton({
                    text: "Create Account",
                    mute: true,
                    action: function() {
                        new Growler({
                            position: 'top-left',
                            icon: 'warn-triangle',
                            title: 'Clicked',
                            text: 'Create Account Button Clicked'
                        });
                    }
                })
            ]
        };
    }
    static get DIALOG_LOGIN_FORM() {
        return {
            instructions: {
                icon: 'help-circle',
                instructions: [
                    "Enter your username and password."
                ]
            },
            elements: [
                new EmailInput({
                    label: "Email",
                    autocomplete: 'off',
                    required: true
                }),
                new PasswordInput({
                    label: "Password",
                    forceconstraints: false,
                    placeholder: "Enter your password.",
                    required: true
                }),
                new BooleanToggle({
                    label: "Remember Me",
                    style: "toggle",
                    labelside: 'right'
                })
            ],
            handler: function(self, callback) {
                let results = {
                    success: false,
                    errors: ['Email and password do not match.']
                };
                callback(results);
            },
            actions: [
                new ConstructiveButton({
                    text: "Login",
                    icon: "lock-open",
                    hot: true,
                    submits: true,
                    disabled: true  // No action needed.
                }),
                new SimpleButton({
                    text: "Create Account",
                    mute: true,
                    action: function() {
                        new Growler({
                            position: 'top-left',
                            icon: 'warn-triangle',
                            title: 'Clicked',
                            text: 'Create Account Button Clicked'
                        });
                    }
                }),
                new DestructiveButton({
                    text: "Cancel",
                    mute: true,
                    action: function(e, btn) {
                        if ((btn.form) && (btn.form.dialog)) {
                            btn.form.dialog.close();
                        } else {
                            new Growler({
                                position: 'top-left',
                                icon: 'warn-triangle',
                                title: 'Cancel',
                                text: 'Button clicked in non-dialog mode'
                            });
                        }
                    }
                })
            ]
        };
    }

    /**
     * Builds the demo page.
     */
    constructor() {
        this.body = $('body');

        this.build();

        this.body.addClass('noisy');

        if (window.location.hash.substr(1)) {
            this.switchTab(window.location.hash.substr(1));
        } else {
            this.switchTab('buttons');
        }
    }

    switchTab(tab) {
        $('section').css('display', 'none');
        $(`#t-${tab}`).css('display', 'block');
        this.navigation.select(tab);
        if(history.pushState) {
            history.pushState(null, null, `#${tab}`);
        } else {
            location.hash = `#${tab}`;
        }
        if ((tab === 'wiki') || (tab === 'intro')) {
            this.codebox.css('display', 'none');
        } else {
            this.codebox.css('display', 'block');
        }
    }

    build() {
        const me = this;

        this.container = $('#container');

        this.navigation = new TabBar({
            vertical: true,
            tabs: [
                {
                    label: 'Intro',
                    id: 'intro',
                    action: function() {
                        me.switchTab('intro');
                    }
                },
                {
                    label: 'cornflowerblue',
                    id: 'wiki',
                    action: function() {
                        me.switchTab('wiki');
                    }
                },
                {
                    label: 'Text',
                    id: 'text',
                    action: function() {
                        me.switchTab('text');
                    }
                },
                {
                    label: 'Message Boxes',
                    id: 'messageboxes',
                    action: function() {
                        me.switchTab('messageboxes');
                    }
                },
                {
                    label: 'Buttons',
                    id: 'buttons',
                    action: function() {
                        me.switchTab('buttons');
                    }
                },
                {
                    label: 'Inputs',
                    id: 'inputs',
                    selected: true,
                    action: function() {
                        me.switchTab('inputs');
                    }
                },
                {
                    label: 'Text Areas',
                    id: 'textareas',
                    action: function() {
                        me.switchTab('textareas');
                    }
                },
                {
                    label: 'Select',
                    id: 'selects',
                    action: function() {
                        me.switchTab('selects');
                    }
                },
                {
                    label: 'Radio Buttons',
                    id: 'radiobuttons',
                    action: function() {
                        me.switchTab('radiobuttons');
                    }
                },
                {
                    label: 'Toggles',
                    id: 'toggles',
                    action: function() {
                        me.switchTab('toggles');
                    }
                },
                {
                    label: 'Forms',
                    id: 'forms',
                    action: function() {
                        me.switchTab('forms');
                    }
                },
                {
                    label: 'Dialogs',
                    id: 'dialogs',
                    action: function() {
                        me.switchTab('dialogs');
                        me.dialog = new DialogWindow({
                            title: "Login",
                            form: new SimpleForm(CornflowerBlueDemo.DIALOG_LOGIN_FORM)
                        }).open();

                    }
                },
                {
                    label: 'Growlers',
                    id: 'growlers',
                    action: function() {
                        me.switchTab('growlers');
                    }
                },
                {
                    label: 'Password Changer',
                    id: 'pwchanger',
                    action: function() {
                        me.switchTab('pwchanger');
                    }
                }
            ]
        });

        this.codebox = $('#codebox');
        this.container
            .prepend(this.navigation.container);

        this.grindInputs();
        this.grindSelects();
        this.grindTextAreas();
        this.grindRadioGroups();
        this.grindDialogs();
        this.grindCheckboxes();
        this.grindStyledCheckboxes();
        this.grindGrowlers();
        this.grindButtons();
        this.grindMessageBoxes();
        this.grindForms();

        this.grindPWChange();
        this.handleInternalLinks();
        this.handleWikiCitations();

    }

    handleInternalLinks() {
        const me = this;
        let links = $('a.internal');
        for (let l of links) {
            let target = $(l).attr('data-tab-target');
            $(l).click(function(e) {
               e.preventDefault();
               me.switchTab(target);
            });
        }

    }

    handleWikiCitations() {
        let citations = $('sup.reference');
        for (let cite of citations) {
            let target = $(cite).find('a').attr('href');
            let content = $(target).html();
            let text = $(cite).find('a').html();
            let b = new HelpButton({
                text: text,
                icon: null,
                classes: ['link'],
                tipicon: 'legend',
                help: content
            });
            $(cite).empty().append(b.button);
        }

    }

    grindInputs() {
        const me = this;
        const $standard = $('#inputs-standard');
        const $inactive = $('#inputs-inactive');
        const $mute = $('#inputs-mute');
        const $password = $('#inputs-password');
        const $email = $('#inputs-email');
        const $number = $('#inputs-number');
        const $disabled = $('#inputs-disabled');
        $standard.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new TextInput({
                        label: "Name",
                        maxlength: 50,
                        required: true,
                        counter: 'remaining',
                        placeholder: "Your full name",
                        help: "Use your full name, in whatever manner befits your culture."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        let inactiveTest = new TextInput({
            label: "Name",
            maxlength: 50,
            required: true,
            inactive: true,
            counter: 'remaining',
            placeholder: "Your full name",
            help: "Use your full name, in whatever manner befits your culture."
        });

        let toggleButton = new SimpleButton({
           text: "Enable Element",
           action: function(e, self) {
               inactiveTest.toggleActivation();
               if (inactiveTest.inactive) {
                   self.text = "Enable Element";
               } else {
                   self.text = "Disable Element";
               }
           }
        });

        $inactive.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    inactiveTest.container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    toggleButton.button
                )
        );

        $number.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new NumberInput({
                        label: "Amount Requested",
                        minnumber: 0,
                        maxnumber: 20,
                        help: "How many items do you wish to purchase."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })

                )
        );

        $mute.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new TextInput({
                        label: "Name",
                        maxlength: 50,
                        counter: 'remaining',
                        mute: true,
                        placeholder: "Your full name",
                        help: "Use your full name, in whatever manner befits your culture."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $password.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new PasswordInput({
                        label: "Password",
                        placeholder: "Enter your password."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new PasswordInput({
                        label: "Password",
                        mute: true,
                        placeholder: "Enter your password."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $email.append(

            $('<div />').addClass('example').addClass('vert')
                .append(
                    new EmailInput({
                        label: "Email Address (valid required)"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new EmailInput({
                        label: "Email Address (invalid allowed)",
                        forceconstraints: false,
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $disabled.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new TextInput({
                        label: "Name",
                        maxlength: 50,
                        counter: 'remaining',
                        disabled: true,
                        placeholder: "Your full name",
                        help: "Use your full name, in whatever manner befits your culture."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new TextInput({
                        label: "Name",
                        maxlength: 50,
                        counter: 'remaining',
                        disabled: true,
                        mute: true,
                        placeholder: "Your full name",
                        help: "Use your full name, in whatever manner befits your culture."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

    }
    grindButtons() {
        const me = this;
        const $target = $('#buttons-normal');
        const $mutes = $('#buttons-mute');
        const $links = $('#buttons-link');
        const $nakeds = $('#buttons-naked');
        const $hots = $('#buttons-hot');
        const $squares = $('#buttons-shaped-square');
        const $circles = $('#buttons-shaped-circle');
        const $hexes = $('#buttons-shaped-hex');

        $target.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Default"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Hover",
                        classes: ['hover']
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Active",
                        classes: ['active']
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Focus",
                        classes: ['focus']
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Disabled",
                        disabled: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $target.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Normal",
                        icon: "globe"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        icon: "check"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Destructive",
                        icon: "trashcan"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


        $target.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new ConstructiveButton({
                        text: "Constructive"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Hover",
                        classes: ['hover']
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Active",
                        classes: ['active']
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Focus",
                        classes: ['focus']
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Disabled",
                        disabled: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $target.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new DestructiveButton({
                        text: "Destructive"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Hover",
                        classes: ['hover']
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Active",
                        classes: ['active']
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Focus",
                        classes: ['focus']
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Disabled",
                        disabled: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


        $mutes.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Default",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Hover",
                        classes: ['hover'],
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Active",
                        classes: ['active'],
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Focus",
                        classes: ['focus'],
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Disabled",
                        disabled: true,
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $mutes.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Normal",
                        mute: true,
                        icon: "globe"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        mute: true,
                        icon: "check"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Destructive",
                        mute: true,
                        icon: "trashcan"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


        $mutes.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Hover",
                        classes: ['hover'],
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Active",
                        classes: ['active'],
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Focus",
                        classes: ['focus'],
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Disabled",
                        disabled: true,
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $mutes.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new DestructiveButton({
                        text: "Destructive",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Hover",
                        classes: ['hover'],
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Active",
                        classes: ['active'],
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Focus",
                        classes: ['focus'],
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Disabled",
                        disabled: true,
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


        $links.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Default",
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Hover",
                        classes: ['hover'],
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Active",
                        classes: ['active'],
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Focus",
                        classes: ['focus'],
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Disabled",
                        disabled: true,
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $links.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Normal",
                        link: true,
                        icon: "globe"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        link: true,
                        icon: "check"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Destructive",
                        link: true,
                        icon: "trashcan"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $links.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Hover",
                        classes: ['hover'],
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Active",
                        classes: ['active'],
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Focus",
                        classes: ['focus'],
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Disabled",
                        disabled: true,
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $links.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new DestructiveButton({
                        text: "Destructive",
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Hover",
                        classes: ['hover'],
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Active",
                        classes: ['active'],
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Focus",
                        classes: ['focus'],
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Disabled",
                        disabled: true,
                        link: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


        $hots.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Default",
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Hover",
                        classes: ['hover'],
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Active",
                        classes: ['active'],
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Focus",
                        classes: ['focus'],
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Disabled",
                        disabled: true,
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $hots.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Normal",
                        hot: true,
                        icon: "globe"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        hot: true,
                        icon: "check"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Destructive",
                        hot: true,
                        icon: "trashcan"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $hots.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Hover",
                        classes: ['hover'],
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Active",
                        classes: ['active'],
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Focus",
                        classes: ['focus'],
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Disabled",
                        disabled: true,
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $hots.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new DestructiveButton({
                        text: "Destructive",
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Hover",
                        classes: ['hover'],
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Active",
                        classes: ['active'],
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Focus",
                        classes: ['focus'],
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Disabled",
                        disabled: true,
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


        $squares.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        icon: "echx",
                        shape: "square"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        icon: "plus",
                        shape: "square"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        icon: "minus",
                        shape: "square"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        icon: "legend",
                        shape: "square",
                        disabled: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        icon: "popout",
                        shape: "square",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        icon: "minimize",
                        shape: "square",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        icon: "map",
                        shape: "square",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        icon: "echx",
                        shape: "square",
                        disabled: true,
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $circles.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        icon: "echx",
                        shape: "circle"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        icon: "minus",
                        shape: "circle"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        icon: "plus",
                        shape: "circle"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        icon: "map",
                        shape: "circle",
                        disabled: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        icon: "minimize",
                        shape: "circle",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        icon: "legend",
                        shape: "circle",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        icon: "popout",
                        shape: "circle",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        icon: "echx",
                        shape: "circle",
                        disabled: true,
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $hexes.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        icon: "echx",
                        shape: "hexagon"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        icon: "echx",
                        shape: "hexagon"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        icon: "echx",
                        shape: "hexagon"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        icon: "echx",
                        shape: "hexagon",
                        disabled: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


        $nakeds.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Default",
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Hover",
                        classes: ['hover'],
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Active",
                        classes: ['active'],
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Focus",
                        classes: ['focus'],
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleButton({
                        text: "Disabled",
                        disabled: true,
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $nakeds.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Normal",
                        naked: true,
                        icon: "globe"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        naked: true,
                        icon: "check"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Destructive",
                        naked: true,
                        icon: "trashcan"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $nakeds.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Hover",
                        classes: ['hover'],
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Active",
                        classes: ['active'],
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Focus",
                        classes: ['focus'],
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Disabled",
                        disabled: true,
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $nakeds.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new DestructiveButton({
                        text: "Destructive",
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Hover",
                        classes: ['hover'],
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Active",
                        classes: ['active'],
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Focus",
                        classes: ['focus'],
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Disabled",
                        disabled: true,
                        naked: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


    }
    grindGrowlers() {
        const me = this;
        const $positions = $('#growlers-positions');
        const $special = $('#growlers-special');

        $positions.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Top Left",
                        action: function() {
                            new Growler({
                                position: 'top-left',
                                icon: 'globe',
                                title: 'Top Left Growler',
                                text: 'A growler is here!',
                                onopen: function(g) { me.dumpConfig(g);}
                            });

                        }
                    }).button
                )
                .append(
                    new SimpleButton({
                        text: "Top Center",
                        action: function() {
                            new Growler({
                                position: 'top-center',
                                icon: 'chat',
                                text: 'A top-center growler with an icon and no title.',
                                onopen: function(g) { me.dumpConfig(g);}
                            });
                        }
                    }).button
                )
                .append(
                    new SimpleButton({
                        text: "Top Right",
                        action: function() {
                            new Growler({
                                position: 'top-right',
                                icon: 'star',
                                title: 'Growler with an icon and no text.',
                                onopen: function(g) { me.dumpConfig(g);}
                            });
                        }
                    }).button
                )
        ).append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Bottom Left",
                        action: function() {
                            new Growler({
                                position: 'bottom-left',
                                title: 'Bottom Left Growler',
                                text: 'This growler has duration:0, and will stay until dismissed.',
                                duration: 0,
                                onopen: function(g) { me.dumpConfig(g);}
                            });
                        }
                    }).button
                )
                .append(
                    new SimpleButton({
                        text: "Bottom Center",
                        action: function() {
                            new Growler({
                                position: 'bottom-center',
                                icon: 'heart',
                                title: 'Bottom Center Growler',
                                text: 'This growler has duration:0, so will stay until dismissed.',
                                duration: 0,
                                onopen: function(g) { me.dumpConfig(g);}
                            });
                        }
                    }).button
                )
                .append(
                    new SimpleButton({
                        text: "Bottom Right",
                        action: function() {
                            new Growler({
                                position: 'bottom-right',
                                title: 'Bottom Right Growler',
                                text: 'Another growler over here!',
                                onopen: function(g) { me.dumpConfig(g);}
                            });
                        }
                    }).button
                )
        );
        $special.append(
            $('<div />').addClass('example').addClass('centered')
                .append(
                    new SimpleButton({
                        text: "Quick Growl",
                        action: function() {
                            Growler.growl('This is a growl message!', 'Growler.growl');
                            me.writeConfig("Growler.growl", `Growler.growl('This is a growl message!', 'Growler.growl');`);
                        }
                    }).button
                )
                .append(
                    new SimpleButton({
                        text: "Success",
                        action: function() {
                            Growler.success('This is a success message!');
                            me.writeConfig("Growler.success", `Growler.success('This is a success message!');`);
                        }
                    }).button
                )
                .append(
                    new SimpleButton({
                        text: "Error",
                        action: function() {
                            Growler.error('This is an error message!');
                            me.writeConfig("Growler.error", `Growler.error('This is an error message!');`);
                        }
                    }).button
                )
                .append(
                    new SimpleButton({
                        text: "Warn",
                        action: function() {
                            Growler.warn('This is a warning message!');
                            me.writeConfig("Growler.warn", `Growler.warn('This is a warning message!');`);
                        }
                    }).button
                )
                .append(
                    new SimpleButton({
                        text: "Caution",
                        action: function() {
                            Growler.caution('This is a caution message!');
                            me.writeConfig("Growler.caution", `Growler.caution('This is a caution message!');`);

                        }
                    }).button
                )
        );
    }
    grindCheckboxes() {
        const me = this;
        const $target = $('#inputs-checkboxes');

        $target.append(
            $('<div />').addClass('example').addClass("centered")
                .append(
                    new BooleanToggle({
                        label: "Normal"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        label: "Checked"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        disabled: true,
                        label: "Disabled"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        disabled: true,
                        label: "Disabled"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $target.append(
            $('<div />').addClass('example').addClass("centered")
                .append(
                    new BooleanToggle({
                        labelside: 'left',
                        label: "Normal"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        labelside: 'left',
                        label: "Toggled"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        labelside: 'left',
                        disabled: true,
                        label: "Disabled"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        labelside: 'left',
                        checked: true,
                        disabled: true,
                        label: "Disabled"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
    }
    grindTextAreas() {
        const me = this;
        const $target = $('#textareas-standard');
        const $mute = $('#textareas-mute');
        const $disabled = $('#textareas-disabled');

        $target.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new TextArea({
                        label: "Post Content",
                        maxlength: 2000,
                        placeholder: "Write your post here!"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $mute.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new TextArea({
                        label: "Post Content",
                        mute: true,
                        maxlength: 2000,
                        placeholder: "Write your post here!"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $disabled.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new TextArea({
                        label: "Post Content",
                        maxlength: 2000,
                        disabled: true,
                        placeholder: "Write your post here!"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new TextArea({
                        label: "Post Content",
                        maxlength: 2000,
                        disabled: true,
                        mute: true,
                        placeholder: "Write your post here!"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

    }
    grindSelects() {
        const me = this;
        const $standard = $('#selects-standard');
        const $mute = $('#selects-mute');
        const $state = $('#selects-state');
        const $inactive = $('#selects-inactive');
        const $disabled = $('#selects-disabled');


        let inactiveTest = new SelectMenu({
            label: "Year",
            name: "year",
            required: true,
            inactive: true,
            options: [
                { label: "2019", value: "2019" },
                { label: "2018", value: "2018" },
                { label: "2017", value: "2017" },
                { label: "2016", value: "2016" },
                { label: "2015", value: "2015" },
                { label: "2014", value: "2014" },
                { label: "2013", value: "2013" },
                { label: "2012", value: "2012" }
            ]
        });

        let toggleButton = new SimpleButton({
            text: "Enable Element",
            action: function(e, self) {
                inactiveTest.toggleActivation();
                if (inactiveTest.inactive) {
                    self.text = "Enable Element";
                } else {
                    self.text = "Disable Element";
                }
            }
        });

        $inactive.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    inactiveTest.container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    toggleButton.button
                )
        );

        $state.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new StateMenu({
                        value: 'WV'
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $standard.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new SelectMenu({
                        label: "Year",
                        name: "year",
                        required: true,
                        options: [
                            { label: "2019", value: "2019" },
                            { label: "2018", value: "2018" },
                            { label: "2017", value: "2017" },
                            { label: "2016", value: "2016" },
                            { label: "2015", value: "2015" },
                            { label: "2014", value: "2014" },
                            { label: "2013", value: "2013" },
                            { label: "2012", value: "2012" }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SelectMenu({
                        label: "Favorite Album",
                        name: "favorite_album",
                        options: [
                            { label: "Sgt. Pepper's Lonely Hearts Club Band", value: "Sgt. Pepper's Lonely Hearts Club Band" },
                            { label: "The Nylon Curtain", value: "The Nylon Curtain" },
                            { label: "Reign in Blood", value: "Reign in Blood" },
                            { label: "Back in Black", value: "Back in Black" },
                            { label: "Nevermind", value: "Nevermind" },
                            { label: "Master of Reality", value: "Master of Reality" },
                            { label: "Doolittle", value: "Doolittle" },
                            { label: "Blizzard of Ozz", value: "Blizzard of Ozz" },
                            { label: "Purple Rain", value: "Purple Rain" },
                            { label: "1989", value: "1989" },
                            { label: "Crystal Visions", value: "Crystal Visions" },
                            { label: "Led Zeppelin IV", value: "Led Zeppelin IV", checked: true },
                            { label: "Congregation", value: "Congregation" },
                            { label: "Pet Sounds", value: "Pet Sounds" },
                            { label: "...And Justice for All", value: "...And Justice for All" },
                            { label: "Welcome to Sky Valley", value: "Welcome to Sky Valley" },
                            { label: "Live Through This", value: "Live Through This" },
                            { label: "Nothing's Shocking", value: "Nothing's Shocking" },
                            { label: "Thriller", value: "Thriller" },
                            { label: "Appetite for Destruction", value: "Appetite for Destruction" }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $mute.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new SelectMenu({
                        label: "Year",
                        name: "year",
                        mute: true,
                        options: [
                            { label: "2019", value: "2019" },
                            { label: "2018", value: "2018" },
                            { label: "2017", value: "2017" },
                            { label: "2016", value: "2016" },
                            { label: "2015", value: "2015" },
                            { label: "2014", value: "2014" },
                            { label: "2013", value: "2013" },
                            { label: "2012", value: "2012" }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new StateMenu({
                        value: 'WV',
                        label: 'State',
                        mute: true
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $disabled.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new SelectMenu({
                        label: "Year",
                        name: "year",
                        disabled: true,
                        options: [
                            { label: "2019", value: "2019" },
                            { label: "2018", value: "2018" },
                            { label: "2017", value: "2017" },
                            { label: "2016", value: "2016" },
                            { label: "2015", value: "2015" },
                            { label: "2014", value: "2014" },
                            { label: "2013", value: "2013" },
                            { label: "2012", value: "2012" }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new StateMenu({
                        value: 'WV',
                        label: 'State',
                        disabled: true,
                        mute: true
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


    }
    grindRadioGroups() {
        const me = this;
        const $standard = $('#radiogroups-standard');
        const $inactive = $('#radiogroups-inactive');
        const $disabled = $('#radiogroups-disabled');
        $standard.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new RadioGroup({
                        label: "Best Avenger",
                        name: "avenger",
                        required: true,
                        help: "Stop looking for Tony; he's not in the list.",
                        options: [
                            { label: "Natasha", value: "Natasha" },
                            { label: "Steve", checked: true, value: "Steve" },
                            { label: "Thor", value: "Thor" },
                            { label: "Clint", value: "Clint" },
                            { label: "Bruce", value: "Bruce" }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $disabled.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new RadioGroup({
                        label: "Year",
                        name: "year",
                        disabled: true,
                        required: true,
                        help: "Select the year you wish to recieve data for.",
                        options: [
                            { label: "2019", value: "2019" },
                            { label: "2018", checked: true, value: "2018" },
                            { label: "2017", value: "2017" },
                            { label: "2016", value: "2016" }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        let inactiveTest = new RadioGroup({
            label: "Year",
            name: "year",
            required: true,
            inactive: true,
            options: [
                { label: "2019", value: "2019" },
                { label: "2018", checked: true, value: "2018" },
                { label: "2017", value: "2017" },
                { label: "2016", value: "2016" }
            ]
        });

        let toggleButton = new SimpleButton({
            text: "Enable Element",
            action: function(e, self) {
                inactiveTest.toggleActivation();
                if (inactiveTest.inactive) {
                    self.text = "Enable Element";
                } else {
                    self.text = "Disable Element";
                }
            }
        });

        $inactive.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    inactiveTest.container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    toggleButton.button
                )
        );

    }
    grindDialogs() {
        const me = this;
        const $target = $('#inputs-dialogs');

        $target.append(
            $('<div />').addClass('example')
                .append(
                    new SimpleButton({
                        text: "Login Form"
                    }).button
                        .click(function() {
                            me.dialog = new DialogWindow({
                                title: "Login",
                                form: new SimpleForm(CornflowerBlueDemo.DIALOG_LOGIN_FORM)
                            }).open();
                        })
                )
                .append(
                    new SimpleButton({
                        text: "Kubla Khan"
                    }).button
                        .click(function() {
                            me.dialog = new DialogWindow({
                                title: "Kubla Khan",
                                content: $('#khan').clone().css('padding', '1.5em')
                            }).open();
                        })
                )
        );
    }
    grindStyledCheckboxes() {
        const me = this;
        const $target = $('#inputs-checkboxes-styled');

        $target.append(
            $('<div />').addClass('example').addClass("centered")
                .append(
                    new BooleanToggle({
                        label: "Normal",
                        style: "square"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        label: "Toggled",
                        style: "square"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        disabled: true,
                        label: "Disabled",
                        style: "square"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        disabled: true,
                        label: "Disabled",
                        style: "square"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $target.append(
            $('<div />').addClass('example').addClass("centered")
                .append(
                    new BooleanToggle({
                        label: "Normal",
                        style: "round"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        label: "Toggled",
                        style: "round"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        disabled: true,
                        label: "Disabled",
                        style: "round"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        disabled: true,
                        label: "Disabled",
                        style: "round"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $target.append(
            $('<div />').addClass('example').addClass("centered")
                .append(
                    new BooleanToggle({
                        label: "Normal",
                        style: "switch"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        label: "Toggled",
                        style: "switch"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        disabled: true,
                        label: "Disabled",
                        style: "switch"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        disabled: true,
                        label: "Disabled",
                        style: "switch"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $target.append(
            $('<div />').addClass('example').addClass("centered")
                .append(
                    new BooleanToggle({
                        label: "Normal",
                        style: "toggle"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        label: "Toggled",
                        style: "toggle"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        disabled: true,
                        label: "Disabled",
                        style: "toggle"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        disabled: true,
                        label: "Disabled",
                        style: "toggle"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


    }

    grindMessageBoxes() {
        const me = this;
        const $target = $('#boxes-instructions');
        const $responses = $('#boxes-responses');

        $target.append(
            $('<div />').addClass('example').addClass("vert")
                .append(
                    new InstructionBox({
                        instructions: [ "Enter your username and password." ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new InstructionBox({
                        instructions: [
                            "Things have never been so swell",
                            "And I have never failed to fail"
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new InstructionBox({
                        instructions: [
                            "Angel left wing, right wing, broken wing",
                            "Lack of iron and/or sleeping",
                            "Protector of the kennel, Ecto-plasma, Ecto-Skeletal, Obituary birthday",
                            "Your scent is still here in my place of recovery"
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $responses.append(
            $('<div />').addClass('example').addClass("vert")
                .append(
                    new MessageBox({
                        results: [
                            "The file was imported successfully!"
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new MessageBox({
                        warnings: [
                            "The file was imported successfully, but some of the data was duplicated.",
                            "Duplicate entries have been removed."
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new MessageBox({
                        errors: [
                            "The file was not imported.",
                            "The file's size was larger than can be accepted."
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )

        );
    }

    grindPWChange() {
        const $target = $('#pwchanger-default');
        $target.append(new PasswordChangeForm({

        }).container);
    }

    grindForms() {
        const $target = $('#forms-standard');
        let f = new SimpleForm(CornflowerBlueDemo.SIMPLE_LOGIN_FORM);
        $target.append(f.container);
    }

    /**
     * Show the forms.
     */

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dumps an object's config.
     * @param o the object to dump.
     */
    dumpConfig(o) {
        this.writeConfig(o.constructor.name, Utils.prettyPrintConfig(o));
    }

    /**
     * Writes a config into the config box
     * @param title the title of the section
     * @param config the config string to write.
     */
    writeConfig(title, config) {
        this.codebox.empty();

        this.codebox.append($('<h2 />').html(title));

        this.codebox.append($('<div />').addClass('config').html(config));
    }

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () {
        return Utils.getConfig(this);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get body() { return this._body; }
    set body(body) { this._body = body; }

    get codebox() { return this._codebox; }
    set codebox(codebox) { this._codebox = codebox; }

    get container() { return this._container; }
    set container(container) { this._container = container; }

    get demobox() { return this._demobox; }
    set demobox(demobox) { this._demobox = demobox; }

    get dialog() { return this._dialog; }
    set dialog(dialog) { this._dialog = dialog; }

    get displaybox() { return this._displaybox; }
    set displaybox(displaybox) { this._displaybox = displaybox; }

    get navigation() { return this._navigation; }
    set navigation(navigation) { this._navigation = navigation; }

    get titlebox() { return this._titlebox; }
    set titlebox(titlebox) { this._titlebox = titlebox; }


}