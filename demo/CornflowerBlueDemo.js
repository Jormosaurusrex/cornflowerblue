"use strict";

class CornflowerBlueDemo {

    constructor() {
        this.body = $('body');

        this.build();
        this.showForms();
    }

    /**
     * Build the main interface.
     */
    build() {
        const me = this;

        this.container = $('<div />').addClass('container');

        this.navigation = new TabBar({
            vertical: true,
            tabs: [
                {
                    label: 'Intro',
                    id: 'intro',
                    action: function() {
                        me.showIntro();
                    }
                },
                {
                    label: 'Headers',
                    id: 'headers',
                    action: function() {
                        me.showHeaders();
                    }
                },
                {
                    label: 'Message Boxes',
                    id: 'messageboxes',
                    action: function() {
                        me.showMessageBoxes();
                    }
                },
                {
                    label: 'Buttons',
                    id: 'buttons',
                    action: function() {
                        me.showButtons();
                    }
                },
                {
                    label: 'Inputs',
                    id: 'inputs',
                    selected: true,
                    action: function() {
                        me.showInputs();
                    }
                },
                {
                    label: 'Text Areas',
                    id: 'textareas',
                    action: function() {
                        me.showTextAreas();
                    }
                },
                {
                    label: 'Toggles',
                    id: 'toggles',
                    action: function() {
                        me.showToggles();
                    }
                },
                {
                    label: 'Forms',
                    id: 'forms',
                    action: function() {
                        me.showForms();
                    }
                },
                {
                    label: 'Dialogs',
                    id: 'dialogs',
                    action: function() {
                        me.showDialogs();
                    }
                },
                {
                    label: 'Growlers',
                    id: 'growlers',
                    action: function() {
                        me.showGrowlers();
                    }
                }
            ]
        });

        this.titlebox = $('<h2 />').addClass('titlebox');
        this.demobox = $('<div />').addClass('demobox');
        this.displaybox = $('<div />').addClass('displaybox').append(this.titlebox).append(this.demobox);

        this.codebox = $('<div />').addClass('codebox');

        this.container
            .append(this.navigation.container)
            .append(this.displaybox)
            .append(this.codebox);

        this.body.append(this.container);

    }

    /**
     * Draw example messageboxes
     */
    showMessageBoxes() {
        const me = this;
        this.navigation.select('messageboxes');

        this.titlebox.html("Message Boxes");

        this.demobox.empty();
        this.demobox.append($('<p />').html("The size of the icons changes based on how many lines of text are present."));

        this.demobox.append($('<h4 />').html("Instructions"));
        this.demobox.append(
            $('<div />').addClass('section').addClass("vert")
                .append(
                    new InstructionBox({
                        instructions: [
                            "Duis mollis, est non commodo luctus.",
                            "Nisi erat porttitor ligula, eget.",
                            "lacinia odio sem nec elit."
                        ]
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );


        this.demobox.append($('<h4 />').html("Form Response"));
        this.demobox.append(
            $('<div />').addClass('section').addClass("vert")
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

    showIntro() {

        this.titlebox.html("Buttons");

        this.demobox.empty();

    }

    showDialogs() {
        this.navigation.select('dialogs');

        this.titlebox.html("Dialogs");

        this.demobox.empty();

    }

    showGrowlers() {
        this.navigation.select('growlers');

        this.titlebox.html("Growlers");

        this.demobox.empty();

        this.demobox.append(
            $('<div />').addClass('section')
                .append(
                    new SimpleButton({
                        text: "Top Left",
                        action: function() {
                            new Growler({
                                position: 'top-left',
                                icon: 'legend',
                                title: 'Top Left Growler',
                                text: 'A growler is here!'
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
                                icon: 'legend',
                                text: 'A top-center growler with an icon and no title.'
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
                                icon: 'legend',
                                title: 'Growler with an icon and no text.'
                            });
                        }
                    }).button
                )
        );

        this.demobox.append(
            $('<div />').addClass('section')
                .append(
                    new SimpleButton({
                        text: "Bottom Left",
                        action: function() {
                            new Growler({
                                position: 'bottom-left',
                                icon: 'legend',
                                title: 'Bottom Left Growler',
                                text: 'This growler has duration:0, and will stay until dismissed.',
                                duration: 0
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
                                icon: 'legend',
                                title: 'Bottom Center Growler',
                                text: 'This growler has duration:0, so will stay until dismissed.',
                                duration: 0
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
                                icon: 'legend',
                                title: 'Bottom Right Growler',
                                text: 'Another growler over here!'
                            });
                        }
                    }).button
                )
        );

    }

    showButtons() {
        const me = this;

        this.navigation.select('buttons');

        this.titlebox.html("Buttons");

        this.demobox.empty();

        this.demobox.append($('<h4 />').html("Standard"));
        this.demobox.append(
            $('<div />').addClass('section')
                .append(
                    new SimpleButton({
                        text: "Normal"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Constructive"
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Destructive"
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
        this.demobox.append(
            $('<div />').addClass('section')
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
        this.demobox.append($('<h4 />').html("Mute"));
        this.demobox.append(
            $('<div />').addClass('section')
                .append(
                    new SimpleButton({
                        text: "Normal",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        mute: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Destructive",
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
        this.demobox.append(
            $('<div />').addClass('section')
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
        this.demobox.append($('<h4 />').html("Hot"));
        this.demobox.append(
            $('<div />').addClass('section')
                .append(
                    new SimpleButton({
                        text: "Normal",
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new ConstructiveButton({
                        text: "Constructive",
                        hot: true
                    }).button
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new DestructiveButton({
                        text: "Destructive",
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
        this.demobox.append(
            $('<div />').addClass('section')
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
        this.demobox.append($('<h4 />').html("Shaped: Square"));
        this.demobox.append(
            $('<div />').addClass('section')
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
        this.demobox.append($('<h4 />').html("Shaped: Circle"));
        this.demobox.append(
            $('<div />').addClass('section')
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
        this.demobox.append($('<h4 />').html("Shaped: Hexagon"));
        this.demobox.append(
            $('<div />').addClass('section')
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

    }

    showInputs() {
        const me = this;
        this.navigation.select('inputs');

        this.titlebox.html("Inputs");

        this.demobox.empty();

        this.demobox.append($('<h4 />').html("Standard"));
        this.demobox.append(
            $('<div />').addClass('section').addClass('vert')
                .append(
                    new TextInput({
                        label: "Element Label",
                        counter: 'remaining',
                        maxlength: 100,
                        placeholder: "An input placeholder."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        this.demobox.append($('<h4 />').html("Mute"));
        this.demobox.append(
            $('<div />').addClass('section').addClass('vert')
                .append(
                    new TextInput({
                        label: "Element Label",
                        mute: true,
                        counter: 'limit',
                        maxlength: 100,
                        placeholder: "An input placeholder."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        this.demobox.append($('<h4 />').html("Password"));
        this.demobox.append(
            $('<div />').addClass('section').addClass('vert')
                .append(
                    new PasswordInput({
                        label: "Password",
                        counter: 'sky',
                        placeholder: "Enter your password."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        this.demobox.append($('<h4 />').html("Mute Password"));
        this.demobox.append(
            $('<div />').addClass('section').addClass('vert')
                .append(
                    new PasswordInput({
                        label: "Password",
                        mute: true,
                        placeholder: "Enter your password."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        this.demobox.append($('<h4 />').html("Disabled"));
        this.demobox.append(
            $('<div />').addClass('section').addClass('vert')
                .append(
                    new TextInput({
                        disabled: true,
                        label: "Element Label",
                        placeholder: "Enter the text."
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        this.demobox.append($('<h4 />').html("Mute Disabled"));
        this.demobox.append(
            $('<div />').addClass('section').addClass('vert')
                .append(
                    new TextInput({
                        disabled: true,
                        label: "Element Label",
                        placeholder: "Enter the text.",
                        mute: true
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );
    }

    /**
     * Show different kinds of text areas
     */
    showTextAreas() {
        this.navigation.select('textareas');

        this.titlebox.html("Text Areas");

        this.demobox.empty();

        this.demobox.append($('<h4 />').html("Standard"));

        this.demobox.append(
            $('<div />').addClass('section').addClass('vert')
                .append(
                    new TextArea({
                        label: "Element Label",
                        placeholder: "An input placeholder."
                    }).container
                )
        );

        this.demobox.append(
            $('<div />').addClass('section').addClass('vert')
                .append(
                    new TextArea({
                        label: "Element Label",
                        disabled: true,
                        placeholder: "An input placeholder."
                    }).container
                )
        );

        this.demobox.append($('<h4 />').html("Mute"));
        this.demobox.append(
            $('<div />').addClass('section').addClass('vert')
                .append(
                    new TextArea({
                        label: "Element Label",
                        mute: true,
                        placeholder: "An input placeholder."
                    }).container
                )
        );

    }

    /**
     * Display a page of example texts
     */
    showHeaders() {
        this.navigation.select('headers');

        this.titlebox.html("Headers");

        this.demobox.empty();

        this.demobox.append($('<h1 />').html("H1 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. <a target=\"_new\" href=\"http://www.does.not.exist\">Aenean</a> eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<h2 />').html("H2 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget <a target=\"_new\" href=\"https://en.wikipedia.org/\">urna mollis</a> ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<h3 />').html("H3 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<h4 />').html("H4 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<h5 />').html("H5 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<h6 />').html("H6 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<h3 />').html("H3 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<h4 />').html("H4 Standard"));
        this.demobox.append($('<h5 />').html("H5 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<h4 />').html("H4 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));
        this.demobox.append($('<h5 />').html("H5 Standard"));
        this.demobox.append($('<p />').html("Vestibulum id ligula porta felis euismod semper. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Vestibulum id ligula porta felis euismod semper."));


    }

    /**
     * Display the page of toggles
     */
    showToggles() {
        const me = this;
        this.navigation.select('toggles');

        this.titlebox.html("Checkboxes and Toggles");

        this.demobox.empty();

        this.demobox.append($('<h4 />').html("Normal/Default"));
        this.demobox.append(
            $('<div />').addClass('section')
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

        this.demobox.append($('<h4 />').html("Normal/Default, Right Sided"));

        this.demobox.append(
            $('<div />').addClass('section')
                .append(
                    new BooleanToggle({
                        labelside: 'right',
                        label: "Normal"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        labelside: 'right',
                        label: "Toggled"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        labelside: 'right',
                        disabled: true,
                        label: "Disabled"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        labelside: 'right',
                        checked: true,
                        disabled: true,
                        label: "Disabled"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        this.demobox.append($('<h4 />').html("Round Style"));

        this.demobox.append(
            $('<div />').addClass('section')
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

        this.demobox.append($('<h4 />').html("Check Style"));

        this.demobox.append(
            $('<div />').addClass('section')
                .append(
                    new BooleanToggle({
                        label: "Normal",
                        style: "check"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        label: "Toggled",
                        style: "check"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        disabled: true,
                        label: "Disabled",
                        style: "check"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
                .append(
                    new BooleanToggle({
                        checked: true,
                        disabled: true,
                        label: "Disabled",
                        style: "check"
                    }).container
                        .click(function() { me.dumpConfig($(this).data('self')); })
                )
        );

        this.demobox.append($('<h4 />').html("Switch Style"));

        this.demobox.append(
            $('<div />').addClass('section')
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

        this.demobox.append($('<h4 />').html("Toggle Style"));

        this.demobox.append(
            $('<div />').addClass('section')
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

    /**
     * Show the forms.
     */
    showForms() {
        this.navigation.select('forms');

        this.titlebox.html("Forms");

        this.demobox.empty();

        this.demobox.append($('<h4 />').html("Complex Form"));

        let f = new SimpleForm({
            instructions: {
                icon: 'help-circle',
                instructions: [
                    "Enter your username and password."
                ]
            },
            elements: [
                new EmailField({
                    label: "Email",
                    autocomplete: 'off',
                    title: "Your email address",
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
                    labelside: 'right'
                })
            ],
            handler: function() {
                return {
                    success: false,
                    errors: ['Email and password do not match.']
                }
            },
            actions: [
                new ConstructiveButton({
                    text: "Login",
                    icon: "lock-open",
                    hot: true,
                    submits: true,
                    disabled: true  // No action needed.
                }),
                new SimpleButton({ text: "Create Account", mute: true }),
                new DestructiveButton({ text: "Cancel", mute: true }),
            ]
        });

        this.demobox.append(f.container);

    }





    dumpConfig(o) {
        this.codebox.empty();
        this.codebox.append($('<h2 />').html(o.constructor.name));

        this.codebox.append($('<div />').addClass('config').html(Utils.prettyPrintConfig(o)));
    }

    /* UTILITY METHODS__________________________________________________________________ */

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

    get displaybox() { return this._displaybox; }
    set displaybox(displaybox) { this._displaybox = displaybox; }

    get navigation() { return this._navigation; }
    set navigation(navigation) { this._navigation = navigation; }

    get titlebox() { return this._titlebox; }
    set titlebox(titlebox) { this._titlebox = titlebox; }


}