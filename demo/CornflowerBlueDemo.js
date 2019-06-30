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

    static get CREATE_ACCOUNT_FORM() {
        return {
            instructions: {
                icon: 'help-circle',
                instructions: [
                    "We only need an email address and password.",
                    "Don't worry about confirming it; you can reset it with your email."
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
                    placeholder: "Enter a password.",
                    required: true
                })
            ],
            handler: function(self, callback) {
                let results = {
                    success: true,
                    errors: ['Your account was created successfully!']
                };
                callback(results);
            },
            actions: [
                new ConstructiveButton({
                    text: "Create Account",
                    icon: "user-circle",
                    hot: true,
                    submits: true,
                    disabled: true  // No action needed.
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
            this.switchTab('intro');
        }
    }

    /**
     * Switch tabs on the demo page.
     * @param tab
     */
    switchTab(tab) {
        $('article').attr('aria-hiddden', true);

        $(`#t-${tab}`).attr('aria-hidden', false);

        this.navigation.select(tab);

        if(history.pushState) {
            history.pushState(null, null, `#${tab}`);
        } else {
            location.hash = `#${tab}`;
        }

        this.codebox.hide();
    }

    build() {
        const me = this;

        this.skipbutton = new SkipButton(); // defaults are fine

        this.body.prepend(this.skipbutton.button);

        this.container = $('#container');

        this.navigation = new TabBar({
            vertical: true,
            classes: ['demo'],
            navigation: true,
            animation: null,
            tabs: [
                { label: 'Intro', id: 'intro' },
                { label: 'cornflowerblue', id: 'wiki' },
                { label: 'Text',  id: 'text' },
                { label: 'Message Boxes', id: 'messageboxes' },
                { label: 'Buttons', id: 'buttons' },
                { label: 'Inputs', id: 'inputs' },
                { label: 'Text Areas', id: 'textareas' },
                { label: 'Select', id: 'selects' },
                { label: 'Radio Buttons', id: 'radiobuttons' },
                { label: 'Toggles', id: 'toggles' },
                { label: 'Tabs and Menus', id: 'tabsmenus' },
                { label: 'Forms', id: 'forms' },
                { label: 'Dialogs', id: 'dialogs',
                    action: function(tabid, self) {
                        self.action(tabid, self);
                        me.dialog = new DialogWindow({
                            title: "Login",
                            form: new SimpleForm(CornflowerBlueDemo.DIALOG_LOGIN_FORM)
                        }).open();
                    }
                },
                { label: 'Growlers', id: 'growlers' },
                { label: 'Password Changer', id: 'pwchanger' },
                { label: 'Progress Meters', id: 'progressmeter' }
            ],
            action: function(tab, self) {
                $('article')
                    .attr('aria-hiddden', true)
                    .css('display', 'none');

                $(`#t-${tab}`)
                    .css('display', 'block')
                    .attr('aria-hidden', false);

                self.select(tab);

                if(history.pushState) {
                    history.pushState(null, null, `#${tab}`);
                } else {
                    location.hash = `#${tab}`;
                }
                me.codebox.hide();
            }
        });

        this.codebox = new FloatingPanel({
            title: 'Class',
            position: 'top-right',
            content: $('<div />'),
            classes: ['codebox']
        });

        this.container
            .prepend(this.navigation.container)
            .append(this.codebox.container);

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

        this.grindProgressMeters();
        this.grindTabsAndMenus();

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


    grindPWChange() {
        const $target = $('#pwchanger-simple');
        $target.append(new PasswordChangeForm({
            cannotbe: ['password', '']
        }).container);
    }

    grindTabsAndMenus() {
        const me = this;
        const $buttonmenu = $('#tabsmenus-buttonmenu');
        const $tabbar = $('#tabsmenus-tabbar');
        $buttonmenu.append(
            $('<div />').addClass('example')
                .append(
                    new ButtonMenu({
                        text: "User",
                        icon: 'user-circle',
                        items: [
                            { label: "Profile", icon: 'user', action: function() { Growler.growl("Clicked 'User'") } },
                            { label: "Preferences", icon: 'gear', action: function() { Growler.growl("Clicked 'Preferences'") } },
                            { label: "Schedule", icon: 'calendar', action: function() { Growler.growl("Clicked 'Schedule'") } },
                            { label: "Log Out", icon: 'lock-open', action: function() { Growler.growl("Clicked 'Log Out'") } }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ButtonMenu({
                        text: "User",
                        icon: 'user-circle',
                        mute: true,
                        items: [
                            { label: "Profile", icon: 'user', action: function() { Growler.growl("Clicked 'User'") } },
                            { label: "Preferences", icon: 'gear', action: function() { Growler.growl("Clicked 'Preferences'") } },
                            { label: "Schedule", icon: 'calendar', action: function() { Growler.growl("Clicked 'Schedule'") } },
                            { label: "Log Out", icon: 'lock-open', action: function() { Growler.growl("Clicked 'Log Out'") } }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ButtonMenu({
                        text: "User",
                        icon: 'user-circle',
                        disabled: true,
                        items: [
                            { label: "Profile", icon: 'user', action: function() { Growler.growl("Clicked 'User'") } },
                            { label: "Preferences", icon: 'gear', action: function() { Growler.growl("Clicked 'Preferences'") } },
                            { label: "Schedule", icon: 'calendar', action: function() { Growler.growl("Clicked 'Schedule'") } },
                            { label: "Log Out", icon: 'lock-open', action: function() { Growler.growl("Clicked 'Log Out'") } }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
            );

        $tabbar.append(
            $('<div />').addClass('example')
                .append(
                    new TabBar({
                        tabs: [
                            { id: 'dt-1-home', label: "Home", selected: true, icon: 'heart', action: function() { Growler.growl("Clicked 'Home'") } },
                            { id: 'dt-1-feed', label: "Feed", icon: 'legend', action: function() { Growler.growl("Clicked 'Feed'") } },
                            { id: 'dt-1-messages', label: "Messages", icon: 'chat', action: function() { Growler.growl("Clicked 'Messages'") } },
                            { id: 'dt-1-profile', label: "Profile", icon: 'user', action: function() { Growler.growl("Clicked 'Profile'") } }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
    }


    grindProgressMeters() {
        const me = this;
        const $simple = $('#progressmeter-simple');
        const $radial = $('#progressmeter-radial');

        $simple.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new SimpleProgressMeter({
                        label: "Overall Progress",
                        value: 25
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleProgressMeter({
                        label: "Rank 3 Progress",
                        currentrank: "Bronze",
                        nextrank: "Silver",
                        minvalue: 200,
                        maxvalue: 600,
                        value: 335
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleProgressMeter({
                        label: "Decalposition: exterior",
                        currentrank: "Bronze",
                        nextrank: "Silver",
                        decalposition: 'exterior',
                        minvalue: 200,
                        maxvalue: 600,
                        value: 335
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleProgressMeter({
                        label: "Style: roundcap",
                        style: 'roundcap',
                        value: 89
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new SimpleProgressMeter({
                        label: "Style: interiorroundcap",
                        style: 'interiorroundcap',
                        value: 23
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        $radial.append(
            $('<div />').addClass('example')
                .append(
                    new RadialProgressMeter({
                        label: "Overall Progress",
                        value: 37
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new RadialProgressMeter({
                        label: "Overall Progress",
                        value: 72,
                        badge: 7200,
                        stinger: 'Points'

                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new RadialProgressMeter({
                        label: "With Ticks",
                        value: 60,
                        segments: 10
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
        $radial.append(
            $('<div />').addClass('example')
                .append(
                    new RadialProgressMeter({
                        label: "style: 'ticks'",
                        value: 37,
                        style: 'ticks'
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new RadialProgressMeter({
                        label: "style: 'ticks'",
                        value: 72,
                        badge: 7200,
                        stinger: 'Points',
                        style: 'ticks'
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new RadialProgressMeter({
                        label: "size: 'small'",
                        value: 72,
                        badge: 7200,
                        stinger: 'Points',
                        size: 'small'
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new RadialProgressMeter({
                        label: "size: 'small'",
                        value: 37,
                        size: 'small',
                        segments: 10
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )

        );
    }

    grindInputs() {
        const me = this;
        const $standard = $('#inputs-standard');
        const $passive = $('#inputs-passive');
        const $mute = $('#inputs-mute');
        const $password = $('#inputs-password');
        const $email = $('#inputs-email');
        const $uri = $('#inputs-uri');
        const $number = $('#inputs-number');
        const $file = $('#inputs-file');
        const $disabled = $('#inputs-disabled');

        $file.append(
            $('<div />').addClass('example').addClass('vert')
                .append(new FileInput({
                        label: "File to Upload"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })

                )
        ).append(
            $('<div />').addClass('example').addClass('vert')
                .append(new FileInput({
                        label: "Portfolio Images",
                        mute: true,
                        multiple: true
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })

                )
        ).append(
            $('<div />').addClass('example').addClass('vert')
                .append(new FileInput({
                        label: "Your Resume",
                        disabled: true,
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })

                )
        );

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

        let passiveTest = new TextInput({
            label: "Name",
            maxlength: 50,
            required: true,
            passive: true,
            counter: 'remaining',
            placeholder: "Your full name",
            help: "Use your full name, in whatever manner befits your culture."
        });

        let toggleButton = new SimpleButton({
           text: ".activate()",
           action: function(e, self) {
               console.log('click');
               passiveTest.toggleActivation();
               if (passiveTest.passive) {
                   self.text = ".activate()";
               } else {
                   self.text = ".pacify()";
               }
           }
        });

        $passive.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    passiveTest.container
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

        $uri.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new URIInput({
                        label: "Web Page (valid required)"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new URIInput({
                        label: "Web Page (invalid allowed)",
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
                                title: 'Growler with no text.',
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
        const $passive = $('#textareas-passive');

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

        let passiveTest = new TextArea({
            label: "Post Content",
            maxlength: 2000,
            passive: true,
            placeholder: "Write your post here!"
        });

        let toggleButton = new SimpleButton({
            text: ".activate()",
            action: function(e, self) {
                passiveTest.toggleActivation();
                if (passiveTest.passive) {
                    self.text = ".activate()";
                } else {
                    self.text = ".pacify()";
                }
            }
        });

        $passive.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    passiveTest.container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    toggleButton.button
                )
        );

    }
    grindSelects() {
        const me = this;
        const $standard = $('#selects-standard');
        const $mute = $('#selects-mute');
        const $state = $('#selects-state');
        const $passive = $('#selects-passive');
        const $disabled = $('#selects-disabled');


        let passiveTest = new SelectMenu({
            label: "Year",
            name: "year-passive",
            required: true,
            passive: true,
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
            text: ".activate()",
            action: function(e, self) {
                passiveTest.toggleActivation();
                if (passiveTest.passive) {
                    self.text = ".activate()";
                } else {
                    self.text = ".pacify()";
                }
            }
        });

        $passive.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    passiveTest.container
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
                        name: "year-select",
                        required: true,
                        prefix: 'Year:',
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
                        name: "year-select-mute",
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
                        name: "year-select-disabled",
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
        const $passive = $('#radiogroups-passive');
        const $disabled = $('#radiogroups-disabled');

        $disabled.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    new RadioGroup({
                        label: "Year",
                        name: "year-radio-disabled",
                        disabled: true,
                        required: true,
                        help: "Select the year you wish to recieve data for.",
                        options: [
                            { label: "2019", value: "2019" },
                            { label: "2018", value: "2018", checked: true },
                            { label: "2017", value: "2017" },
                            { label: "2016", value: "2016" }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

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
                            { label: "Steve", value: "Steve", checked: true },
                            { label: "Thor", value: "Thor" },
                            { label: "Clint", value: "Clint" },
                            { label: "Bruce", value: "Bruce" }
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        let passiveTest = new RadioGroup({
            label: "Year",
            name: "year-radio-passive",
            required: true,
            passive: true,
            options: [
                { label: "2019", value: "2019" },
                { label: "2018", checked: true, value: "2018" },
                { label: "2017", value: "2017" },
                { label: "2016", value: "2016" }
            ]
        });

        let toggleButton = new SimpleButton({
            text: ".activate()",
            action: function(e, self) {
                passiveTest.toggleActivation();
                if (passiveTest.passive) {
                    self.text = ".activate()";
                } else {
                    self.text = ".pacify()";
                }
            }
        });

        $passive.append(
            $('<div />').addClass('example').addClass('vert')
                .append(
                    passiveTest.container
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
    grindForms() {
        const $standard = $('#forms-standard');
        const $profile = $('#forms-passive');
        let f = new SimpleForm(CornflowerBlueDemo.SIMPLE_LOGIN_FORM);
        $standard.append(f.container);

        let p = new SimpleForm({
            passive: true,
            instructions: {
                icon: 'help-circle',
                instructions: [
                    "Make changes to your profile below."
                ],
            },
            passiveinstructions: {
                instructions: [
                    "Review your profile information below.",
                    "Make changes if you need to!"
                ]
            },
            elements: [
                new TextInput({
                    label: "Name",
                    autocomplete: 'off',
                    placeholder: "Miyamoto Musashi",
                    help: "Enter your name in whatever manner befits your culture."
                }),
                new TextInput({
                    label: "Nickname",
                    autocomplete: 'off',
                    placeholder: "Musashi",
                    help: "What should we call you? This is your short name."
                }),
                new EmailInput({
                    label: "Email",
                    autocomplete: 'off',
                    required: true
                })
            ],
            handler: function(self, callback) {
                let results = {
                    success: true,
                    results: ['Your account has been updated successfully!']
                };
                self.pacify();
                callback(results);
            },
            passiveactions: [
                new SimpleButton({
                    text: "Make Changes",
                    icon: "pencil-circle",
                    action: function(e, self) {
                        e.preventDefault();
                        self.form.activate();
                    }
                })
            ],
            actions: [
                new ConstructiveButton({
                    text: "Save Changes",
                    icon: "check-circle",
                    hot: true,
                    submits: true,
                    disabled: true  // No action needed.
                }),
                new DestructiveButton({
                    text: "Cancel Changes",
                    icon: "echx-circle",
                    mute: true,
                    action: function(e, self) {
                        e.preventDefault();
                        self.form.pacify();
                    }
                })
            ]
        });
        $profile.append(p.container);
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

        this.codebox.title = title;
        this.codebox.content = config;
        this.codebox.show();
        /*
        this.codebox.append(
            $('<div />').addClass('fixbox')
                .append($('<h2 />').html(title))
                .append($('<div />').addClass('config').html(config))
        );
        */
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

    get skipbutton() { return this._skipbutton; }
    set skipbutton(skipbutton) { this._skipbutton = skipbutton; }

    get dialog() { return this._dialog; }
    set dialog(dialog) { this._dialog = dialog; }

    get navigation() { return this._navigation; }
    set navigation(navigation) { this._navigation = navigation; }



}