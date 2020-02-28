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
        this.body = document.body;
        this.displaybox = document.getElementById('displaybox');

        this.build();

        this.body.classList.add('noisy');

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
        let articles = document.querySelectorAll('article');
        for (let a of articles) {
            a.setAttribute('aria-hidden', true);
        }
        document.getElementById(`t-${tab}`).removeAttribute('aria-hidden');

        this.navigation.select(tab);

        if(history.pushState) {
            history.pushState(null, null, `#${tab}`);
        } else {
            location.hash = `#${tab}`;
        }
        window.scrollTo(0,0);
    }

    build() {
        const me = this;

        this.skipbutton = new SkipButton(); // defaults are fine
        this.body.prepend(this.skipbutton.button);

        this.container = document.getElementById('container');

        let tabs = [
            { label: 'Intro', id: 'intro' },
            { label: 'cornflowerblue', id: 'wiki' },
            { label: 'Font Glyphs', id: 'fontglyphs' },
            { label: 'Text',  id: 'text' },
            { label: 'Buttons', id: 'buttons' },
            { label: 'Inputs', id: 'inputs' },
            { label: 'Text Areas', id: 'textareas' },
            { label: 'Select', id: 'selects' },
            { label: 'Radio Buttons', id: 'radiobuttons' },
            { label: 'Toggles', id: 'toggles' },
            { label: 'Message Boxes', id: 'messageboxes' },
            { label: 'Tabs and Menus', id: 'tabsmenus' },
            { label: 'Forms', id: 'forms' },
            { label: 'Dialogs', id: 'dialogs' },
            { label: 'Growlers', id: 'growlers' },
            { label: 'Password Changer', id: 'pwchanger' },
            { label: 'Progress Meters', id: 'progressmeter' },
            { label: 'Data Grid', id: 'datagrid' }
        ];

        let newtabs = [
            { label: 'Intro', id: 'intro' },
            { label: 'cornflowerblue', id: 'wiki' },
            { label: 'Text Playground',  id: 'text' },
            { label: 'Basic Components',  id: 'basiccomponents' },
            { label: 'Complex Components',  id: 'complexcomponents' },
            { label: 'Font Glyphs', id: 'fontglyphs' }
        ];
        let basictabs = [
            { label: 'Buttons', id: 'buttons' },
            { label: 'Inputs', id: 'inputs' },
            { label: 'Text Areas', id: 'textareas' },
            { label: 'Select', id: 'selects' },
            { label: 'Radio Buttons', id: 'radiobuttons' },
            { label: 'Toggles', id: 'toggles' }
        ];
        let complextabs = [
            { label: 'Message Boxes', id: 'messageboxes' },
            { label: 'Tabs and Menus', id: 'tabsmenus' },
            { label: 'Forms', id: 'forms' },
            { label: 'Dialogs', id: 'dialogs' },
            { label: 'Growlers', id: 'growlers' },
            { label: 'Password Changer', id: 'pwchanger' },
            { label: 'Progress Meters', id: 'progressmeter' },
            { label: 'Data Grid', id: 'datagrids' }
        ];

        let tabstight = [
            { label: 'Intro', id: 'intro' },
            { label: 'cornflowerblue', id: 'wiki' },
            { label: 'Font Glyphs', id: 'fontglyphs' },
            { label: 'Text',  id: 'text' },
            {
                label: 'Basic Components',
                id: 'basic',
                subtabs: [
                    { label: 'Buttons', id: 'buttons' },
                    { label: 'Inputs', id: 'inputs' },
                    { label: 'Select', id: 'selects' },
                    { label: 'Radio Buttons', id: 'radiobuttons' },
                    { label: 'Toggles', id: 'toggles' },
                    { label: 'Text Areas', id: 'textareas' },
                    { label: 'Message Boxes', id: 'messageboxes' }
                ]
            },
            {
                label: 'Complex Components',
                id: 'complex',
                subtabs: [
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
                    { label: 'Progress Meters', id: 'progressmeter' },
                    { label: 'Data Grid', id: 'datagrid' }
                ]
            },
        ];

        this.navigation = new TabBar({
            vertical: true,
            classes: ['demo'],
            navigation: true,
            animation: null,
            tabs: tabs,
            action: function(tab) {
                me.switchTab(tab);
            }
        });

        //this.container.insertBefore(this.navigation.container, this.displaybox);
        this.displaybox.prepend(this.navigation.container);

        this.grindButtons();
        this.grindCheckboxes();
        this.grindDataGrids();
        this.grindDialogs();
        this.grindForms();
        this.grindGrowlers();
        this.grindInputs();
        this.grindMessageBoxes();
        this.grindPWChange();
        this.grindProgressMeters();
        this.grindRadioGroups();
        this.grindSelects();
        this.grindStyledCheckboxes();
        this.grindTabsAndMenus();
        this.grindTextAreas();

        this.handleInternalLinks();
        this.handleWikiCitations();

        this.drawFontGlyphs();
    }

    drawFontGlyphs() {
        let glyphs = IconFactory.LIST;
        glyphs.sort();

        let table = document.createElement('table');
        table.classList.add('glyphchart');

        let tbody = document.createElement('tbody');
        let newrow = true;
        let tr;
        for (let g of glyphs) {
            if (newrow) {
                tr = document.createElement('tr');
            }

            let ltd = document.createElement('td');
            ltd.classList.add('label');
            ltd.innerHTML = g;
            tr.appendChild(ltd);

            let vtd = document.createElement('td');
            vtd.classList.add('icon');
            vtd.appendChild(IconFactory.icon(g, g));
            tr.appendChild(vtd);

            if (newrow) {
                newrow = false;
            } else {
                tbody.append(tr);
                newrow = true;
            }
        }
        table.appendChild(tbody);
        document.getElementById('glyphs').appendChild(table);
    }

    handleInternalLinks() {
        const me = this;
        let links = document.querySelectorAll('a.internal');
        for (let l of links) {
            let target = l.getAttribute('data-tab-target');
            l.addEventListener('click', function(e) {
                e.preventDefault();
                me.switchTab(target);
            });
        }
    }

    handleWikiCitations() {

        let citations = document.querySelectorAll('sup.reference');
        for (let cite of citations) {
            let a = cite.querySelector('a');
            let targetID = a.getAttribute('href');
            let target = document.querySelector(targetID);
            let content = target.innerHTML;
            let text = a.innerHTML;
            let b = new HelpButton({
                text: text,
                icon: null,
                classes: ['link'],
                tipicon: 'legend',
                help: content
            });
            cite.innerHTML = '';
            cite.appendChild(b.button);
        }
    }

    grindButtons() {
        const me = this;

        let baseconfigs = [
            { text: "Default", type: "normal", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Hover", type: "normal", classes: ['hover'], action: function(e, self) { me.dumpConfig(self); } },
            { text: "Active", type: "normal", classes: ['active'], action: function(e, self) { me.dumpConfig(self); } },
            { text: "Focus", type: "normal", classes: ['focus'], action: function(e, self) { me.dumpConfig(self); } },
            { text: "Disabled", type: "normal", disabled: true, action: function(e, self) { me.dumpConfig(self); } }
        ];
        let secondconfigs = [
            { text: "Normal", type: "normal", icon: "globe", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Two Icons", type: "normal", icon: "globe", secondicon: "legend", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Constructive", type: "constructive", icon: "echx", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Destructive", type: "destructive", icon: "trashcan", action: function(e, self) { me.dumpConfig(self); } }
        ];

        let types = [
            { type: 'normal', target: 'buttons-normal' },
            { type: 'ghost', target: 'buttons-ghost' },
            { type: 'mute', target: 'buttons-mute' },
            { type: 'link', target: 'buttons-link' },
            { type: 'naked', target: 'buttons-naked' },
            { type: 'pill', target: 'buttons-shaped-pill' },
            { type: 'pill-ghost', target: 'buttons-shaped-pill' },
            { type: 'pill-mute', target: 'buttons-shaped-pill' }
        ];

        for (let t of types) {
            let div1 = document.createElement('div');
            div1.classList.add('example');
            div1.classList.add('centered');
            for (let bcfg of baseconfigs) {
                let cfg = Object.assign({}, {}, bcfg);
                switch (t.type) {
                    case 'mute':
                        cfg.mute = true;
                        break;
                    case 'ghost':
                        cfg.ghost = true;
                        break;
                    case 'link':
                        cfg.link = true;
                        break;
                    case 'naked':
                        cfg.naked = true;
                        break;
                    case 'pill':
                        cfg.shape = 'pill';
                        break;
                    case 'pill-ghost':
                        cfg.shape = 'pill';
                        cfg.ghost = true;
                        break;
                    case 'pill-mute':
                        cfg.shape = 'pill';
                        cfg.mute = true;
                        break;
                    case 'normal':
                    default:
                        break;
                }
                let btn;
                switch (cfg.type) {
                    case 'constructive':
                        btn = new ConstructiveButton(cfg).button;
                        break;
                    case 'destructive':
                        btn = new DestructiveButton(cfg).button;
                        break;
                    default:
                        btn = new SimpleButton(cfg).button;
                        break;
                }
                div1.appendChild(btn);
            }
            document.getElementById(t.target).appendChild(div1);

            let div2 = document.createElement('div');
            div2.classList.add('example');
            div2.classList.add('centered');
            for (let scfg of secondconfigs) {
                let cfg = Object.assign({}, {}, scfg);
                switch (t.type) {
                    case 'mute':
                        cfg.mute = true;
                        break;
                    case 'ghost':
                        cfg.ghost = true;
                        break;
                    case 'link':
                        cfg.link = true;
                        break;
                    case 'naked':
                        cfg.naked = true;
                        break;
                    case 'pill':
                        cfg.shape = 'pill';
                        break;
                    case 'pill-ghost':
                        cfg.shape = 'pill';
                        cfg.ghost = true;
                        break;
                    case 'pill-mute':
                        cfg.shape = 'pill';
                        cfg.mute = true;
                        break;
                    case 'normal':
                    default:
                        break;
                }
                let btn;
                switch (cfg.type) {
                    case 'constructive':
                        btn = new ConstructiveButton(cfg).button;
                        break;
                    case 'destructive':
                        btn = new DestructiveButton(cfg).button;
                        break;
                    default:
                        btn = new SimpleButton(cfg).button;
                        break;
                }
                div2.appendChild(btn);
            }
            document.getElementById(t.target).appendChild(div2);
        }

        let shapes = ['square', 'circle'];
        let shapeconfigs = [
            { text: "Normal", type: "normal", icon: "globe", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Constructive", type: "constructive", icon: "echx", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Destructive", type: "destructive", icon: "minimize", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Normal", type: "normal", ghost: true, icon: "globe", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Constructive", type: "constructive", ghost: true, icon: "echx", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Destructive", type: "destructive", ghost: true, icon: "minimize", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Normal", type: "normal", mute: true, icon: "globe", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Constructive", type: "constructive", mute: true, icon: "echx", action: function(e, self) { me.dumpConfig(self); } },
            { text: "Destructive", type: "destructive", mute: true, icon: "minimize", action: function(e, self) { me.dumpConfig(self); } }
        ];

        for (let shape of shapes) {
            let div1 = document.createElement('div');
            div1.classList.add('example');
            div1.classList.add('centered');

            for (let cfg of shapeconfigs) {
                switch (shape) {
                    case 'square':
                        cfg.shape = 'square';
                        break;
                    case 'circle':
                        cfg.shape = 'circle';
                        break;
                    default:
                        break;
                }
                let btn;
                switch (cfg.type) {
                    case 'constructive':
                        btn = new ConstructiveButton(cfg).button;
                        break;
                    case 'destructive':
                        btn = new DestructiveButton(cfg).button;
                        break;
                    default:
                        btn = new SimpleButton(cfg).button;
                        break;
                }
                div1.appendChild(btn);
            }

            document.getElementById(`buttons-shaped-${shape}`).appendChild(div1);

        }

        let sizediv = document.createElement('div');
        sizediv.classList.add('example');
        sizediv.classList.add('vert');

        let sizes = ['micro', 'small', 'medium', 'large', 'fill'];

        for (let size of sizes) {
            sizediv.appendChild(new SimpleButton({
                text: `Size: ${size}`,
                size: size,
                action: function(e, self) { me.dumpConfig(self); }
            }).button);
        }
        document.getElementById('buttons-sizes').appendChild(sizediv);
    }

    grindCheckboxes() {

        let checkboxes = document.createElement('div');
        checkboxes.classList.add('example');
        checkboxes.classList.add('centered');

        checkboxes.appendChild(new BooleanToggle({
            label: "Normal"
        }).container);
        checkboxes.appendChild(new BooleanToggle({
            checked: true,
            label: "Checked"
        }).container);
        checkboxes.appendChild(new BooleanToggle({
            disabled: true,
            label: "Disabled"
        }).container);
        checkboxes.appendChild(new BooleanToggle({
            checked: true,
            disabled: true,
            label: "Disabled"
        }).container);
        document.getElementById('inputs-checkboxes').appendChild(checkboxes);

        let checkboxes2 = document.createElement('div');
        checkboxes2.classList.add('example');
        checkboxes2.classList.add('centered');
        checkboxes2.appendChild(new BooleanToggle({
            labelside: 'left',
            label: "Normal"
        }).container);
        checkboxes2.appendChild(new BooleanToggle({
            checked: true,
            labelside: 'left',
            label: "Toggled"
        }).container);
        checkboxes2.appendChild(new BooleanToggle({
            labelside: 'left',
            disabled: true,
            label: "Disabled"
        }).container);
        checkboxes2.appendChild(new BooleanToggle({
            labelside: 'left',
            checked: true,
            disabled: true,
            label: "Disabled"
        }).container);
        document.getElementById('inputs-checkboxes').appendChild(checkboxes2);

    }

    grindDataGrids() {

        let dg = new DataGrid({
            id: 'cfb-demo-grid-',
            fields: [
                {
                    name: "track",
                    label: "Track",
                    width: 1,
                    type: "number",
                    description: "The track number of the song.",
                    renderer: function(data) {
                        return `${data}.`;
                    }
                }, {
                    name: "album",
                    label: "Album",
                    width: 3,
                    resize: true,
                    type: "string",
                    filterable: 'enum',
                    description: "The album the song is on.",
                    classes: ['nowrap', 'italic']
                }, {
                    name: "released",
                    label: "Released",
                    width: 1,
                    description: "The date the album was released.",
                    type: "date"
                }, {
                    name: "title",
                    label: "Title",
                    width: 3,
                    resize: true,
                    type: "string",
                    filterable: 'string',
                    description: "The title of the song.",
                    classes: ['nowrap', 'italic']
                }, {
                    name: "writers",
                    label: "Writers",
                    width: 3,
                    resize: true,
                    type: "stringarray",
                    separator: " &middot; ",
                    description: "A list of the song's writers.",
                    classes: ['smaller']
                }, {
                    name: "label",
                    label: "Label",
                    width: 1,
                    description: "The record label the album was released by.",
                    type: "string"
                }, {
                    name: "length",
                    label: "Length",
                    width: 1,
                    description: "The time length of the song.",
                    type: "time"
                }
            ],
            data: [
                { track: 1, album: "Led Zeppelin", released: "1969-01-12", label: "Atlantic", title: "Good Times Bad Times", writers: ["Page", "Jones", "Bonham"], length: "2:46" },
                { track: 2, album: "Led Zeppelin", released: "1969-01-12", label: "Atlantic", title: "Babe I'm Gonna Leave You", writers: ["Bredon", "Page", "Plant"], length: "6:42" },
                { track: 3, album: "Led Zeppelin", released: "1969-01-12", label: "Atlantic", title: "You Shook Me", writers: ["Dixon", "Lenoir"], length: "6:28" },
                { track: 4, album: "Led Zeppelin", released: "1969-01-12", label: "Atlantic", title: "Dazed and Confused", writers: ["Page", "Holmes"], length: "6:28" },
                { track: 5, album: "Led Zeppelin", released: "1969-01-12", label: "Atlantic", title: "Your Time is Gonna Come", writers: ["Page", "Jones"], length: "4:34" },
                { track: 6, album: "Led Zeppelin", released: "1969-01-12", label: "Atlantic", title: "Black Mountain Side", writers: ["Page"], length: "2:12" },
                { track: 7, album: "Led Zeppelin", released: "1969-01-12", label: "Atlantic", title: "Communication Breakdown", writers: ["Page", "Jones", "Bonham"], length: "2:30" },
                { track: 8, album: "Led Zeppelin", released: "1969-01-12", label: "Atlantic", title: "I Can't Quit You Baby", writers: ["Dixon"], length: "4:42" },
                { track: 9, album: "Led Zeppelin", released: "1969-01-12", label: "Atlantic", title: "How Many More Times", writers: ["Page", "Jones", "Bonham"], length: "8:27" },

                { track: 1, album: "Led Zeppelin II", released: "1969-10-11", label: "Atlantic", title: "Whole Lotta Love", writers: ["Page", "Dixon", "Jones", "Plant"], length: "5:34" },
                { track: 2, album: "Led Zeppelin II", released: "1969-10-11", label: "Atlantic", title: "What Is and What Should Never Be", writers: ["Page", "Plant"], length: "4:46" },
                { track: 3, album: "Led Zeppelin II", released: "1969-10-11", label: "Atlantic", title: "The Lemon Song", writers: ["Bonham", "Burnett", "Jones", "Page", "Plant"], length: "6:19" },
                { track: 4, album: "Led Zeppelin II", released: "1969-10-11", label: "Atlantic", title: "Thank You", writers: ["Page", "Plant"], length: "4:49" },
                { track: 5, album: "Led Zeppelin II", released: "1969-10-11", label: "Atlantic", title: "Heartbreaker", writers: ["Bonham", "Jones", "Page", "Plant"], length: "4:14" },
                { track: 6, album: "Led Zeppelin II", released: "1969-10-11", label: "Atlantic", title: "Living Loving Maid (She's Just a Woman)", writers: ["Page", "Plant"], length: "2:39" },
                { track: 7, album: "Led Zeppelin II", released: "1969-10-11", label: "Atlantic", title: "Ramble On", writers: ["Page", "Plant"], length: "4:34" },
                { track: 8, album: "Led Zeppelin II", released: "1969-10-11", label: "Atlantic", title: "Moby Dick", writers: ["Bonham", "Jones", "Page"], length: "4:20" },
                { track: 9, album: "Led Zeppelin II", released: "1969-10-11", label: "Atlantic", title: "Bring It On Home", writers: ["Dixon"], length: "4:19" },

                { track: 1, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "Immigrant Song", writers: ["Page", "Plant"], length: "2:26" },
                { track: 2, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "Friends", writers: ["Page", "Plant"], length: "3:55" },
                { track: 3, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "Celebration Day", writers: ["Jones", "Page", "Plant"], length: "3:29" },
                { track: 4, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "Since I've Been Loving You", writers: ["Jones", "Page", "Plant"], length: "7:25" },
                { track: 5, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "Out on the Tiles", writers: ["Bonham", "Page", "Plant"], length: "4:04" },
                { track: 6, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "Gallows Pole", writers: ["Page", "Plant"], length: "4:58" },
                { track: 7, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "Tangerine", writers: ["Page"], length: "3:12" },
                { track: 8, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "That's the Way", writers: ["Page", "Plant"], length: "5:38" },
                { track: 9, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "Bron-Y-Aur Stomp", writers: ["Jones", "Page", "Plant"], length: "4:20" },
                { track: 10, album: "Led Zeppelin III", released: "1970-10-05", label: "Atlantic", title: "Hats Off to (Roy) Harper", writers: ["Obscure"], length: "3:41" },

                { track: 1, album: "Led Zeppelin IV", released: "1971-11-08", label: "Atlantic", title: "Black Dog", writers: ["Page", "Plant", "Jones"], length: "4:54" },
                { track: 2, album: "Led Zeppelin IV", released: "1971-11-08", label: "Atlantic", title: "Rock and Roll", writers: ["Page", "Plant", "Jones", "Bonham"], length: "3:40" },
                { track: 3, album: "Led Zeppelin IV", released: "1971-11-08", label: "Atlantic", title: "The Battle of Evermore", writers: ["Page", "Plant"], length: "5:51" },
                { track: 4, album: "Led Zeppelin IV", released: "1971-11-08", label: "Atlantic", title: "Stairway to Heaven", writers: ["Page", "Plant"], length: "8:02" },
                { track: 5, album: "Led Zeppelin IV", released: "1971-11-08", label: "Atlantic", title: "Misty Mountain Hop", writers: ["Page", "Plant"], length: "4:38" },
                { track: 6, album: "Led Zeppelin IV", released: "1971-11-08", label: "Atlantic", title: "Four Sticks", writers: ["Page", "Plant"], length: "4:44" },
                { track: 7, album: "Led Zeppelin IV", released: "1971-11-08", label: "Atlantic", title: "Going to California", writers: ["Page", "Plant"], length: "3:31" },
                { track: 8, album: "Led Zeppelin IV", released: "1971-11-08", label: "Atlantic", title: "When the Levee Breaks", writers: ["Page", "Plant", "Jones", "Bohnam", "Minnie"], length: "7:07" },

                { track: 1, album: "Houses of the Holy", released: "1973-03-28", label: "Atlantic", title: "The Song Remains the Same", writers: ["Page", "Plant"], length: "5:32" },
                { track: 2, album: "Houses of the Holy", released: "1973-03-28", label: "Atlantic", title: "The Rain Song", writers: ["Page", "Plant"], length: "7:39" },
                { track: 3, album: "Houses of the Holy", released: "1973-03-28", label: "Atlantic", title: "Over the Hills and Far Away", writers: ["Page", "Plant"], length: "4:50" },
                { track: 4, album: "Houses of the Holy", released: "1973-03-28", label: "Atlantic", title: "The Crunge", writers: ["Bonham", "Page", "Plant", "Jones"], length: "3:17" },
                { track: 5, album: "Houses of the Holy", released: "1973-03-28", label: "Atlantic", title: "Dancing Days", writers: ["Page", "Plant"], length: "3:43" },
                { track: 6, album: "Houses of the Holy", released: "1973-03-28", label: "Atlantic", title: "D'yer Mak'er", writers: ["Bonham", "Page", "Plant", "Jones"], length: "4:23" },
                { track: 7, album: "Houses of the Holy", released: "1973-03-28", label: "Atlantic", title: "No Qauarter", writers: ["Page", "Plant", "Jones"], length: "7:00" },
                { track: 8, album: "Houses of the Holy", released: "1973-03-28", label: "Atlantic", title: "The Ocean", writers: ["Bonham", "Page", "Plant", "Jones"], length: "4:31" },


                { track: 1, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Custard Pie", writers: ["Page", "Plant"], length: "4:13" },
                { track: 2, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "The Rover", writers: ["Page", "Plant"], length: "5:36" },
                { track: 3, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "In My Time of Dying", writers: ["Page", "Plant", "Bonham", "Jones"], length: "11:04" },
                { track: 4, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Houses of the Holy", writers: ["Page", "Plant"], length: "4:01" },
                { track: 5, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Trampled Under Foot", writers: ["Page", "Plant", "Jones"], length: "5:35" },
                { track: 6, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Kashmir", writers: ["Bonham", "Page", "Plant"], length: "8:37" },
                { track: 7, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "In the Light", writers: ["Page", "Plant", "Jones"], length: "8:44" },
                { track: 8, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Bron-Yr-Aur", writers: ["Page"], length: "2:06" },
                { track: 9, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Down by the Seaside", writers: ["Page", "Plant"], length: "5:14" },
                { track: 10, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Ten Years Gone", writers: ["Page", "Plant"], length: "6:31" },
                { track: 11, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Night Flight", writers: ["Page", "Plant", "Jones"], length: "3:36" },
                { track: 12, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "The Wanton Song", writers: ["Page", "Plant"], length: "4:06" },
                { track: 13, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Boogie with Stu", writers: ["Bonham", "Page", "Plant", "Jones", "Stewart", "Valens"], length: "3:51" },
                { track: 14, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Black Country Woman", writers: ["Page", "Plant"], length: "4:24" },
                { track: 15, album: "Physical Graffiti", released: "1975-02-24", label: "Swan Song", title: "Sick Again", writers: ["Page", "Plant"], length: "4:43" },



                { track: 1, album: "Presence", released: "1976-03-31", label: "Swan Song", title: "Achilles Last Stand", writers: ["Page", "Plant"], length: "10:26" },
                { track: 2, album: "Presence", released: "1976-03-31", label: "Swan Song", title: "For Your Life", writers: ["Page", "Plant"], length: "6:21" },
                { track: 3, album: "Presence", released: "1976-03-31", label: "Swan Song", title: "Royal Orleans", writers: ["Page", "Plant", "Bonham", "Jones"], length: "2:58" },
                { track: 4, album: "Presence", released: "1976-03-31", label: "Swan Song", title: "Nobody's Fault but Mine", writers: ["Page", "Plant"], length: "6:15" },
                { track: 5, album: "Presence", released: "1976-03-31", label: "Swan Song", title: "Candy Store Rock", writers: ["Page", "Plant"], length: "4:10" },
                { track: 6, album: "Presence", released: "1976-03-31", label: "Swan Song", title: "Host On for Nowhere", writers: ["Page", "Plant"], length: "4:42" },
                { track: 7, album: "Presence", released: "1976-03-31", label: "Swan Song", title: "Tea for One", writers: ["Page", "Plant"], length: "9:27" },


                { track: 1, album: "In Through the Out Door", released: "1979-08-15", label: "Swan Song", title: "In the Evening", writers: ["Page", "Plant", "Jones"], length: "6:48" },
                { track: 2, album: "In Through the Out Door", released: "1979-08-15", label: "Swan Song", title: "South Bound Saurez", writers: ["Jones", "Plant"], length: "4:11" },
                { track: 3, album: "In Through the Out Door", released: "1979-08-15", label: "Swan Song", title: "Fool in the Rain", writers: ["Page", "Plant", "Jones"], length: "6:08" },
                { track: 4, album: "In Through the Out Door", released: "1979-08-15", label: "Swan Song", title: "Hot Dog", writers: ["Page", "Plant"], length: "3:15" },
                { track: 5, album: "In Through the Out Door", released: "1979-08-15", label: "Swan Song", title: "Carouselambra", writers: ["Page", "Plant", "Jones"], length: "10:28" },
                { track: 6, album: "In Through the Out Door", released: "1979-08-15", label: "Swan Song", title: "All My Love", writers: ["Page", "Plant"], length: "5:51" },
                { track: 7, album: "In Through the Out Door", released: "1979-08-15", label: "Swan Song", title: "I'm Gonna Crawl", writers: ["Page", "Plant", "Jones"], length: "5:28" }
            ]
        });

        document.getElementById('datagrid-basic').appendChild(dg.container);
    }

    grindDialogs() {
        const me = this;

        let dialogs = document.createElement('div');
        dialogs.classList.add('example');
        dialogs.classList.add('centered');
        dialogs.appendChild(new SimpleButton({
            text: "Login Form",
            action: function() {
                me.dialog = new DialogWindow({
                    title: "Login",
                    form: new SimpleForm(CornflowerBlueDemo.DIALOG_LOGIN_FORM)
                }).open();
            }
        }).button);
        dialogs.appendChild(new SimpleButton({
            text: "Kubla Khan",
            action: function() {
                let khan = document.querySelector('#khan').cloneNode(true);
                khan.style.padding = '1.5em';
                me.dialog = new DialogWindow({
                    title: "Kubla Khan",
                    content: khan
                }).open();
            }
        }).button);
        document.getElementById('inputs-dialogs').appendChild(dialogs);
    }

    grindForms() {

        let f = new SimpleForm(CornflowerBlueDemo.SIMPLE_LOGIN_FORM);
        document.getElementById('forms-standard').appendChild(f.container);

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
        document.getElementById('forms-passive').appendChild(p.container);

    }

    grindGrowlers() {
        const me = this;

        let positions = document.createElement('div');
        positions.classList.add('example');
        positions.classList.add('centered');
        positions.appendChild(new SimpleButton({
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
        }).button);
        positions.appendChild(new SimpleButton({
            text: "Top Center",
            action: function() {
                new Growler({
                    position: 'top-center',
                    icon: 'chat',
                    text: 'A top-center growler with an icon and no title.',
                    onopen: function(g) { me.dumpConfig(g);}
                });
            }
        }).button);
        positions.appendChild(new SimpleButton({
            text: "Top Right",
            action: function() {
                new Growler({
                    position: 'top-right',
                    icon: 'star',
                    title: 'Growler with no text.',
                    onopen: function(g) { me.dumpConfig(g);}
                });
            }
        }).button);
        document.getElementById('growlers-positions').appendChild(positions);

        let positionslower = document.createElement('div');
        positionslower.classList.add('example');
        positionslower.classList.add('centered');
        positionslower.appendChild(new SimpleButton({
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
        }).button);
        positionslower.appendChild(new SimpleButton({
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
        }).button);
        positionslower.appendChild(new SimpleButton({
            text: "Bottom Right",
            action: function() {
                new Growler({
                    position: 'bottom-right',
                    title: 'Bottom Right Growler',
                    text: 'Another growler over here!',
                    onopen: function(g) { me.dumpConfig(g);}
                });
            }
        }).button);
        document.getElementById('growlers-positions').appendChild(positionslower);


        let special = document.createElement('div');
        special.classList.add('example');
        special.classList.add('centered');
        special.appendChild(new SimpleButton({
            text: "Quick Growl",
            action: function() {
                Growler.growl('This is a growl message!', 'Growler.growl');
                me.writeConfig("Growler.growl", `Growler.growl('This is a growl message!', 'Growler.growl');`);
            }
        }).button);
        special.appendChild(new SimpleButton({
            text: "Success",
            action: function() {
                Growler.success('This is a success message!');
                me.writeConfig("Growler.success", `Growler.success('This is a success message!');`);
            }
        }).button);
        special.appendChild(new SimpleButton({
            text: "Error",
            action: function() {
                Growler.error('This is an error message!');
                me.writeConfig("Growler.error", `Growler.error('This is an error message!');`);
            }
        }).button);
        special.appendChild(new SimpleButton({
            text: "Warn",
            action: function() {
                Growler.warn('This is a warning message!');
                me.writeConfig("Growler.warn", `Growler.warn('This is a warning message!');`);
            }
        }).button);
        special.appendChild(new SimpleButton({
            text: "Caution",
            action: function() {
                Growler.caution('This is a caution message!');
                me.writeConfig("Growler.caution", `Growler.caution('This is a caution message!');`);

            }
        }).button);
        document.getElementById('growlers-special').appendChild(special);
    }

    grindInputs() {
        let standard = document.createElement('div');
        standard.classList.add('example');
        standard.classList.add('vert');
        standard.appendChild(new TextInput({
            label: "Name",
            maxlength: 50,
            required: true,
            counter: 'remaining',
            placeholder: "Your full name",
            help: "Use your full name, in whatever manner befits your culture."
        }).container);
        document.getElementById('inputs-standard').appendChild(standard);


        let file = document.createElement('div');
        file.classList.add('example');
        file.classList.add('vert');
        file.appendChild(new FileInput({
            label: "File to Upload"
        }).container);
        file.appendChild(new FileInput({
            label: "Portfolio Images",
            mute: true,
            multiple: true
        }).container);
        file.appendChild(new FileInput({
            label: "Your Resume",
            disabled: true,
        }).container);
        document.getElementById('inputs-file').appendChild(file);

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
                passiveTest.toggleActivation();
                if (passiveTest.passive) {
                    self.text = ".activate()";
                } else {
                    self.text = ".pacify()";
                }
            }
        });
        let passive = document.createElement('div');
        passive.classList.add('example');
        passive.classList.add('vert');
        passive.appendChild(passiveTest.container);
        passive.appendChild(toggleButton.button);
        document.getElementById('inputs-passive').appendChild(passive);


        let number = document.createElement('div');
        number.classList.add('example');
        number.classList.add('vert');
        number.appendChild(new NumberInput({
            label: "Amount Requested",
            minnumber: 0,
            maxnumber: 20,
            help: "How many items do you wish to purchase."
        }).container);
        document.getElementById('inputs-number').appendChild(number);


        let mute = document.createElement('div');
        mute.classList.add('example');
        mute.classList.add('vert');
        mute.appendChild(new TextInput({
            label: "Name",
            maxlength: 50,
            counter: 'remaining',
            mute: true,
            placeholder: "Your full name",
            help: "Use your full name, in whatever manner befits your culture."
        }).container);
        document.getElementById('inputs-mute').appendChild(mute);

        let password = document.createElement('div');
        password.classList.add('example');
        password.classList.add('vert');
        password.appendChild(new PasswordInput({
            label: "Password",
            placeholder: "Enter your password."
        }).container);
        password.appendChild(new PasswordInput({
            label: "Password",
            mute: true,
            placeholder: "Enter your password."
        }).container);
        document.getElementById('inputs-password').appendChild(password);

        let dateinput = document.createElement('div');
        dateinput.classList.add('example');
        dateinput.classList.add('vert');
        dateinput.appendChild(new DateInput({
            label: "Date"
        }).container);
        dateinput.appendChild(new DateInput({
            label: "Date",
            value: '1972-11-28'
        }).container);
        dateinput.appendChild(new DateInput({
            label: "Mute Date",
            mute: true,
            value: '1972-11-28'
        }).container);
        document.getElementById('inputs-date').appendChild(dateinput);

        let email = document.createElement('div');
        email.classList.add('example');
        email.classList.add('vert');
        email.appendChild(new EmailInput({
            label: "Email Address (valid required)"
        }).container);
        email.appendChild(new EmailInput({
            label: "Email Address (invalid allowed)",
            forceconstraints: false,
        }).container);
        document.getElementById('inputs-email').appendChild(email);


        let uri = document.createElement('div');
        uri.classList.add('example');
        uri.classList.add('vert');
        uri.appendChild(new URIInput({
            label: "Web Page (valid required)"
        }).container);
        uri.appendChild(new URIInput({
            label: "Web Page (invalid allowed)",
            forceconstraints: false,
        }).container);
        document.getElementById('inputs-uri').appendChild(uri);

        let disabled = document.createElement('div');
        disabled.classList.add('example');
        disabled.classList.add('vert');
        disabled.appendChild(new TextInput({
            label: "Name",
            maxlength: 50,
            counter: 'remaining',
            disabled: true,
            placeholder: "Your full name",
            help: "Use your full name, in whatever manner befits your culture."
        }).container);
        disabled.appendChild(new TextInput({
            label: "Name",
            maxlength: 50,
            counter: 'remaining',
            disabled: true,
            mute: true,
            placeholder: "Your full name",
            help: "Use your full name, in whatever manner befits your culture."
        }).container);
        document.getElementById('inputs-disabled').appendChild(disabled);
    }

    grindMessageBoxes() {

        let instructions = document.createElement('div');
        instructions.classList.add('example');
        instructions.classList.add('vert');
        instructions.appendChild(new InstructionBox({
            instructions: [ "Enter your username and password." ]
        }).container);
        instructions.appendChild(new InstructionBox({
            instructions: [
                "Things have never been so swell",
                "And I have never failed to fail"
            ]
        }).container);
        instructions.appendChild(new InstructionBox({
            instructions: [
                "Angel left wing, right wing, broken wing",
                "Lack of iron and/or sleeping",
                "Protector of the kennel, Ecto-plasma, Ecto-Skeletal, Obituary birthday",
                "Your scent is still here in my place of recovery"
            ]
        }).container);

        document.getElementById('boxes-instructions').appendChild(instructions);

        let responses = document.createElement('div');
        responses.classList.add('example');
        responses.classList.add('vert');

        responses.appendChild(new MessageBox({
            results: [
                "The file was imported successfully!"
            ]
        }).container);

        responses.appendChild(new MessageBox({
            warnings: [
                "The file was imported successfully, but some of the data was duplicated.",
                "Duplicate entries have been removed."
            ]
        }).container);

        responses.appendChild(new MessageBox({
            errors: [
                "The file was not imported.",
                "The file's size was larger than can be accepted."
            ]
        }).container);

        document.getElementById('boxes-responses').appendChild(responses);
    }

    grindProgressMeters() {

        let simple = document.createElement('div');
        simple.classList.add('example');
        simple.classList.add('vert');
        simple.appendChild(new SimpleProgressMeter({
            label: "Overall Progress",
            value: 25
        }).container);
        simple.appendChild(new SimpleProgressMeter({
            label: "Decalposition: interior",
            decalposition: 'interior',
            currentrank: "Bronze",
            nextrank: "Silver",
            minvalue: 200,
            maxvalue: 600,
            value: 335
        }).container);
        simple.appendChild(new SimpleProgressMeter({
            label: "Decalposition: exterior",
            decalposition: 'exterior',
            currentrank: "Bronze",
            nextrank: "Silver",
            minvalue: 200,
            maxvalue: 600,
            value: 335
        }).container);
        simple.appendChild(new SimpleProgressMeter({
            label: "Decalposition: exterior-bottom",
            currentrank: "Bronze",
            nextrank: "Silver",
            decalposition: 'exterior-bottom',
            minvalue: 200,
            maxvalue: 600,
            value: 335
        }).container);
        simple.appendChild(new SimpleProgressMeter({
            label: "Style: roundcap",
            style: 'roundcap',
            value: 89
        }).container);
        simple.appendChild(new SimpleProgressMeter({
            label: "Style: interiorroundcap",
            style: 'interiorroundcap',
            value: 23
        }).container);
        document.getElementById('progressmeter-simple').appendChild(simple);


        let radial = document.createElement('div');
        radial.classList.add('example');
        radial.appendChild(new RadialProgressMeter({
            label: "Overall Progress",
            value: 37
        }).container);
        radial.appendChild(new RadialProgressMeter({
            label: "Overall Progress",
            value: 72,
            badge: 7200,
            stinger: 'Points'

        }).container);
        radial.appendChild(new RadialProgressMeter({
            label: "With Ticks",
            value: 60,
            segments: 10
        }).container);
        document.getElementById('progressmeter-radial').appendChild(radial);

        let radial2 = document.createElement('div');
        radial2.classList.add('example');
        radial2.appendChild(new RadialProgressMeter({
            label: "style: 'ticks'",
            value: 37,
            style: 'ticks'
        }).container);
        radial2.appendChild(new RadialProgressMeter({
            label: "style: 'ticks'",
            value: 72,
            badge: 7200,
            stinger: 'Points',
            style: 'ticks'
        }).container);
        radial2.appendChild(new RadialProgressMeter({
            label: "size: 'small'",
            value: 72,
            badge: 7200,
            stinger: 'Points',
            size: 'small'
        }).container);
        radial2.appendChild(new RadialProgressMeter({
            label: "size: 'small'",
            value: 37,
            size: 'small',
            segments: 10
        }).container);
        document.getElementById('progressmeter-radial').appendChild(radial2);
    }

    grindPWChange() {
        document.getElementById('pwchanger-simple').appendChild(new PasswordChangeForm({
            cannotbe: ['password', '']
        }).container);
    }

    grindRadioGroups() {

        let standard = document.createElement('div');
        standard.classList.add('example');
        standard.classList.add('vert');
        standard.appendChild(new RadioGroup({
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
        }).container);
        document.getElementById('radiogroups-standard').appendChild(standard);

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

        let passive = document.createElement('div');
        passive.classList.add('example');
        passive.classList.add('vert');
        passive.appendChild(passiveTest.container);
        passive.appendChild(toggleButton.button);
        document.getElementById('radiogroups-passive').appendChild(passive);


        let disabled = document.createElement('div');
        disabled.classList.add('example');
        disabled.classList.add('vert');
        disabled.appendChild(new RadioGroup({
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
        }).container);
        document.getElementById('radiogroups-disabled').appendChild(disabled);

    }

    grindSelects() {
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

        let passive = document.createElement('div');
        passive.classList.add('example');
        passive.classList.add('vert');
        passive.appendChild(passiveTest.container);
        passive.appendChild(toggleButton.button);
        document.getElementById('selects-passive').appendChild(passive);

        let state = document.createElement('div');
        state.classList.add('example');
        state.classList.add('vert');
        state.appendChild( new StateMenu({
            value: 'WV'
        }).container);
        document.getElementById('selects-state').appendChild(state);

        let standard = document.createElement('div');
        standard.classList.add('example');
        standard.classList.add('vert');
        standard.appendChild(new SelectMenu({
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
        }).container);
        standard.appendChild(new SelectMenu({
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
        }).container);
        document.getElementById('selects-standard').appendChild(standard);

        let mute = document.createElement('div');
        mute.classList.add('example');
        mute.classList.add('vert');
        mute.appendChild(new SelectMenu({
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
        }).container);
        mute.appendChild(new StateMenu({
            value: 'WV',
            label: 'State',
            mute: true
        }).container);
        document.getElementById('selects-mute').appendChild(mute);

        let disabled = document.createElement('div');
        disabled.classList.add('example');
        disabled.classList.add('vert');
        disabled.appendChild(new SelectMenu({
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
        }).container);
        document.getElementById('selects-disabled').appendChild(disabled);

    }

    grindStyledCheckboxes() {

        let styledsquare = document.createElement('div');
        styledsquare.classList.add('example');
        styledsquare.classList.add('centered');
        styledsquare.appendChild(new BooleanToggle({
            label: "Normal",
            style: "square"
        }).container);
        styledsquare.appendChild(new BooleanToggle({
            checked: true,
            label: "Toggled",
            style: "square"
        }).container);
        styledsquare.appendChild(new BooleanToggle({
            disabled: true,
            label: "Disabled",
            style: "square"
        }).container);
        styledsquare.appendChild(new BooleanToggle({
            checked: true,
            disabled: true,
            label: "Disabled",
            style: "square"
        }).container);
        document.getElementById('inputs-checkboxes-styled').appendChild(styledsquare);

        let styledround = document.createElement('div');
        styledround.classList.add('example');
        styledround.classList.add('centered');
        styledround.appendChild(new BooleanToggle({
            label: "Normal",
            style: "round"
        }).container);
        styledround.appendChild(new BooleanToggle({
            checked: true,
            label: "Toggled",
            style: "round"
        }).container);
        styledround.appendChild(new BooleanToggle({
            disabled: true,
            label: "Disabled",
            style: "round"
        }).container);
        styledround.appendChild(new BooleanToggle({
            checked: true,
            disabled: true,
            label: "Disabled",
            style: "round"
        }).container);
        document.getElementById('inputs-checkboxes-styled').appendChild(styledround);

        let styledswitch = document.createElement('div');
        styledswitch.classList.add('example');
        styledswitch.classList.add('centered');
        styledswitch.appendChild(new BooleanToggle({
            label: "Normal",
            style: "switch"
        }).container);
        styledswitch.appendChild(new BooleanToggle({
            checked: true,
            label: "Toggled",
            style: "switch"
        }).container);
        styledswitch.appendChild(new BooleanToggle({
            disabled: true,
            label: "Disabled",
            style: "switch"
        }).container);
        styledswitch.appendChild(new BooleanToggle({
            checked: true,
            disabled: true,
            label: "Disabled",
            style: "switch"
        }).container);
        document.getElementById('inputs-checkboxes-styled').appendChild(styledswitch);

        let styledtoggle = document.createElement('div');
        styledtoggle.classList.add('example');
        styledtoggle.classList.add('centered');
        styledtoggle.appendChild(new BooleanToggle({
            label: "Normal",
            style: "toggle"
        }).container);
        styledtoggle.appendChild(new BooleanToggle({
            checked: true,
            label: "Toggled",
            style: "toggle"
        }).container);
        styledtoggle.appendChild(new BooleanToggle({
            disabled: true,
            label: "Disabled",
            style: "toggle"
        }).container);
        styledtoggle.appendChild(new BooleanToggle({
            checked: true,
            disabled: true,
            label: "Disabled",
            style: "toggle"
        }).container);
        document.getElementById('inputs-checkboxes-styled').appendChild(styledtoggle);

    }

    grindTabsAndMenus() {
        let buttonmenu = document.createElement('div');
        buttonmenu.classList.add('example');
        buttonmenu.appendChild(new ButtonMenu({
            text: "User",
            icon: 'user-circle',
            items: [
                { label: "Profile", icon: 'user', action: function() { Growler.growl("Clicked 'User'") } },
                { label: "Preferences", icon: 'gear', action: function() { Growler.growl("Clicked 'Preferences'") } },
                { label: "Schedule", icon: 'calendar', action: function() { Growler.growl("Clicked 'Schedule'") } },
                { label: "Log Out", icon: 'lock-open', action: function() { Growler.growl("Clicked 'Log Out'") } }
            ]
        }).container);
        buttonmenu.appendChild(new ButtonMenu({
            text: "User",
            icon: 'user-circle',
            mute: true,
            items: [
                { label: "Profile", icon: 'user', action: function() { Growler.growl("Clicked 'User'") } },
                { label: "Preferences", icon: 'gear', action: function() { Growler.growl("Clicked 'Preferences'") } },
                { label: "Schedule", icon: 'calendar', action: function() { Growler.growl("Clicked 'Schedule'") } },
                { label: "Log Out", icon: 'lock-open', action: function() { Growler.growl("Clicked 'Log Out'") } }
            ]
        }).container);
        buttonmenu.appendChild(new ButtonMenu({
            text: "User",
            icon: 'user-circle',
            disabled: true,
            items: [
                { label: "Profile", icon: 'user', action: function() { Growler.growl("Clicked 'User'") } },
                { label: "Preferences", icon: 'gear', action: function() { Growler.growl("Clicked 'Preferences'") } },
                { label: "Schedule", icon: 'calendar', action: function() { Growler.growl("Clicked 'Schedule'") } },
                { label: "Log Out", icon: 'lock-open', action: function() { Growler.growl("Clicked 'Log Out'") } }
            ]
        }).container);
        document.getElementById('tabsmenus-buttonmenu').appendChild(buttonmenu);

        let tabbar = document.createElement('div');
        tabbar.classList.add('example');
        tabbar.appendChild(new TabBar({
            tabs: [
                { id: 'dt-1-home', label: "Home", selected: true, icon: 'heart', action: function() { Growler.growl("Clicked 'Home'") } },
                { id: 'dt-1-feed', label: "Feed", icon: 'legend', action: function() { Growler.growl("Clicked 'Feed'") } },
                { id: 'dt-1-messages', label: "Messages", icon: 'chat', action: function() { Growler.growl("Clicked 'Messages'") } },
                { id: 'dt-1-profile', label: "Profile", icon: 'user', action: function() { Growler.growl("Clicked 'Profile'") } }
            ]
        }).container);
        document.getElementById('tabsmenus-tabbar').appendChild(tabbar);

    }

    grindTextAreas() {

        let standard = document.createElement('div');
        standard.classList.add('example');
        standard.classList.add('vert');
        standard.appendChild(new TextArea({
            label: "Post Content",
            maxlength: 2000,
            placeholder: "Write your post here!"
        }).container);
        document.getElementById('textareas-standard').appendChild(standard);

        let mute = document.createElement('div');
        mute.classList.add('example');
        mute.classList.add('vert');
        mute.appendChild(new TextArea({
            label: "Post Content",
            mute: true,
            maxlength: 2000,
            placeholder: "Write your post here!"
        }).container);
        document.getElementById('textareas-mute').appendChild(mute);

        let disabled = document.createElement('div');
        disabled.classList.add('example');
        disabled.classList.add('vert');
        disabled.appendChild(new TextArea({
            label: "Post Content",
            maxlength: 2000,
            disabled: true,
            placeholder: "Write your post here!"
        }).container);
        disabled.appendChild(new TextArea({
            label: "Post Content",
            maxlength: 2000,
            disabled: true,
            mute: true,
            placeholder: "Write your post here!"
        }).container);
        document.getElementById('textareas-disabled').appendChild(disabled);

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

        let passive = document.createElement('div');
        passive.classList.add('example');
        passive.classList.add('vert');
        passive.appendChild(passiveTest.container);
        passive.appendChild(toggleButton.button);
        document.getElementById('textareas-passive').appendChild(passive);


    }


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
        return; // fix later
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

    get displaybox() { return this._displaybox; }
    set displaybox(displaybox) { this._displaybox = displaybox; }

    get skipbutton() { return this._skipbutton; }
    set skipbutton(skipbutton) { this._skipbutton = skipbutton; }

    get dialog() { return this._dialog; }
    set dialog(dialog) { this._dialog = dialog; }

    get navigation() { return this._navigation; }
    set navigation(navigation) { this._navigation = navigation; }



}