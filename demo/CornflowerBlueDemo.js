"use strict";

class CornflowerBlueDemo {

    static get SIMPLE_LOGIN_FORM() {
        return {
            instructions: {
                icon: 'help-circle',
                instructions: [TextFactory.get('loginform-instructions-enter_username')]
            },
            elements: [
                new EmailInput({
                    label: TextFactory.get('email'),
                    mute: true,
                    autocomplete: 'off',
                    required: true
                }),
                new PasswordInput({
                    label: TextFactory.get('password'),
                    mute: true,
                    forceconstraints: false,
                    placeholder: TextFactory.get('passwordinput-placeholder-enter_password'),
                    required: true
                }),
                new StateMenu({
                    label: 'state',
                    mute: true,
                    forceconstraints: false,
                    placeholder: TextFactory.get('passwordinput-placeholder-enter_password'),
                    required: true
                }),
                new BooleanToggle({
                    label: TextFactory.get('remember_me'),
                    style: "toggle",
                    labelside: 'right'
                })
            ],
            handler: function(self, callback) {
                let results = {
                    success: false,
                    errors: [TextFactory.get('loginform-error-passwords_dont_match')]
                };
                callback(results);
            },
            actions: [
                new ConstructiveButton({
                    text: TextFactory.get('login'),
                    icon: "lock-open",
                    submits: true,
                    disabled: true  // No action needed.
                }),
                new SimpleButton({
                    text: TextFactory.get('create_account'),
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

    /*
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
            handler: (self, callback) => {
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
     */

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
            handler: (self, callback) => {
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
                    action: () => {
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
                    action: (e, btn) => {
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

        this.main = document.getElementById('articlebox');
        this.build();

        window.setTimeout(() => {
            this.handleURLState();
        }, 100);
    }

    handleURLState() {
        if (window.location.hash.substr(1)) {
            let hash = window.location.hash.substr(1);
            if (hash.indexOf('-') !== -1) {
                let harr = hash.split('-');
                this.switchTab(harr[0]) ;
                this.switchSection(harr[1], harr[0]);
            } else {
                this.switchTab(window.location.hash.substr(1));
            }
        } else {
            this.switchTab('intro');
        }
    }

    /**
     * Switch tabs on the demo page.
     * @param tab
     */
    switchTab(tab) {
        for (let a of document.querySelectorAll('article')) {
            a.setAttribute('aria-hidden', true);
        }

        let t = document.getElementById(`t-${tab}`);
        if (t) {
            this.activearticle = t;
            this.activearticle.removeAttribute('aria-hidden');
        }
        this.navigation.select(tab);

        if (history.pushState) {
            history.pushState(null, null, `#${tab}`);
        } else {
            location.hash = `#${tab}`;
        }
        window.scrollTo(0,0);
    }

    switchSection(tab, type='elements') {
        this.complexnav.container.setAttribute('aria-hidden', true);
        this.elementsnav.container.setAttribute('aria-hidden', true);

        if (this.activearticle) {
            for (let s of this.activearticle.querySelectorAll('section')) {
                s.setAttribute('aria-hidden', true);
            }
        }

        let section = document.getElementById(`section-${tab}`);
        if (section) {
            switch(type) {
                case 'complex':
                    this.complexnav.select(tab);
                    break;
                case 'elements':
                default:
                    this.elementsnav.select(tab);
                    break;
            }
            section.removeAttribute('aria-hidden');
        }

        if (history.pushState) {
            history.pushState(null, null, `#${type}-${tab}`);
        } else {
            location.hash = `#${type}-${tab}`;
        }
        window.scrollTo(0,0);
    }

    build() {
        

        this.skipbutton = new SkipButton(); // defaults are fine
        document.querySelector('header').prepend(this.skipbutton.button);

        this.container = document.getElementById('container');

        let maintabs = [
            { label: 'Intro', id: 'intro' },
            { label: 'cornflowerblue', id: 'wiki' },
            { label: 'Font Glyphs', id: 'fontglyphs' },
            { label: 'Text',  id: 'text' },
            { label: 'Elements',  id: 'elements' },
            { label: 'Complex Components',  id: 'complex' }
        ];
        this.navigation = new TabBar({
            classes: ['demo'],
            navigation: true,
            animation: null,
            tabs: maintabs,
            action: (tab) => {
                this.switchTab(tab);
            }
        });
        this.container.insertBefore(this.navigation.container, this.main);

        let elementtabs = [
            { label: 'Buttons', id: 'buttons', selected: true },
            { label: 'Inputs', id: 'inputs' },
            { label: 'Text Areas', id: 'textareas' },
            { label: 'Select Menus', id: 'selects' },
            { label: 'Radio Buttons', id: 'radiobuttons' },
            { label: 'Toggles', id: 'toggles' }
        ];
        this.elementsnav = new TabBar({
            classes: ['subnav'],
            navigation: true,
            vertical: true,
            animation: null,
            tabs: elementtabs,
            action: (tab) => {
                this.switchSection(tab, 'elements');
            }
        });
        document.getElementById('t-elements').insertBefore(this.elementsnav.container, document.getElementById('elements-sections'));

        let complextabs = [
            { label: 'Message Boxes', id: 'messageboxes', selected: true },
            { label: 'Forms', id: 'forms' },
            { label: 'Data Grids', id: 'datagrid' },
            { label: 'Growlers', id: 'growler' },
            { label: 'Progress Meters', id: 'progressmeters' },
            { label: 'Dialogs', id: 'dialogs' },
            { label: 'Tabs and Menus', id: 'tabsandmenus' }
        ];
        this.complexnav = new TabBar({
            classes: ['subnav'],
            navigation: true,
            vertical: true,
            animation: null,
            tabs: complextabs,
            action: (tab) => {
                this.switchSection(tab, 'complex');
            }
        });
        document.getElementById('t-complex').insertBefore(this.complexnav.container, document.getElementById('complex-sections'));


        document.getElementById('inputs-textarea-docbox').appendChild(this.getOptionGrid(TextArea).container);

        document.getElementById('inputs-textinput-docbox').appendChild(this.getOptionGrid(TextInput).container);
        document.getElementById('inputs-date-docbox').appendChild(this.getOptionGrid(DateInput).container);
        document.getElementById('inputs-file-docbox').appendChild(this.getOptionGrid(FileInput).container);
        document.getElementById('inputs-number-docbox').appendChild(this.getOptionGrid(NumberInput).container);
        document.getElementById('inputs-password-docbox').appendChild(this.getOptionGrid(PasswordInput).container);
        document.getElementById('inputs-email-docbox').appendChild(this.getOptionGrid(EmailInput).container);
        document.getElementById('inputs-uri-docbox').appendChild(this.getOptionGrid(URIInput).container);
        document.getElementById('inputs-selects-docbox').appendChild(this.getOptionGrid(SelectMenu).container);
        document.getElementById('inputs-radiogroup-docbox').appendChild(this.getOptionGrid(RadioGroup).container);
        document.getElementById('inputs-booleantoggle-docbox').appendChild(this.getOptionGrid(BooleanToggle).container);
        document.getElementById('buttons-docbox').appendChild(this.getOptionGrid(SimpleButton).container);

        document.getElementById('growlers-docbox').appendChild(this.getOptionGrid(Growler).container);
        document.getElementById('dialogwindow-docbox').appendChild(this.getOptionGrid(DialogWindow).container);
        document.getElementById('simpleprogress-docbox').appendChild(this.getOptionGrid(SimpleProgressMeter).container);
        document.getElementById('radialprogress-docbox').appendChild(this.getOptionGrid(RadialProgressMeter).container);


        this.grindButtons();
        this.grindCheckboxes();
        this.grindDataGrids();
        this.grindDialogs();
        this.grindForms();
        this.grindGrowlers();
        this.grindInputs();
        this.grindMessageBoxes();
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
        
        let links = document.querySelectorAll('a.internal');
        for (let l of links) {
            let target = l.getAttribute('data-tab-target');
            l.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(target);
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

    /**
     * Get a class's options blob and build the data for documentation. Recurses all the way down.
     * @param obj the object class to start with
     * @return {[]} a dictionary, where key = { definition }
     */
    getOptionsGridData(obj) {
        let instance = new obj(),
            dictionary = {},
            options = obj.DEFAULT_CONFIG,
            docs = obj.DOCUMENTATION,
            parentclass = Object.getPrototypeOf(Object.getPrototypeOf(instance)).constructor;

        if ((parentclass) && (parentclass.name !== 'Object')) {
            dictionary = this.getOptionsGridData(parentclass);
        }
        for (let k of Object.keys(docs)) {
            let defvalue,
                type = typeof options[k],
                working = options[k];

            if (options[k] === null) {
                defvalue = '<span class="null">null</span>';
            } else if (typeof options[k] === 'boolean') {
                defvalue = `<span class="boolean ${options[k]}">${options[k]}</span>`;
                //console.log(`${k} :${options[k]}`);
            } else if (Array.isArray(working)) {
                defvalue = "[&nbsp;";
                if ((working !== null) && (working.length > 0)) {
                    let elements = [];
                    for (let c of working) {
                        if (typeof c === 'string') {
                            elements.push(`"<span class="string">${c}</span>"`);
                        } else {
                            elements.push(`<span class="value">${c}</span>`);
                        }
                    }
                    defvalue += elements.join(", ");
                }
                defvalue += "&nbsp;]";
            } else {
                switch(type) {
                    case 'function':
                        defvalue =  `<span class="function">${working}</span>`;
                        break;
                    case 'number':
                        defvalue = `<span class="number">${working}</span>`;
                        break;
                    case 'string':
                        if (docs[k].datatype === 'enumeration') {
                            defvalue = `<span class="enumeration">${working}</span>`;
                        } else {
                            defvalue = `"<span class="string">${working}</span>"`;
                        }
                        break;
                    case 'object':
                        defvalue = `<span class="object">${working}</span>`;
                        break;
                    default:
                        defvalue = working;
                        break;
                }
            }
            if (!dictionary[k]) {
                dictionary[k] = {
                    key: k,
                    default: defvalue,
                    datatype: docs[k].datatype,
                    inherited: instance.constructor.name,
                    description: docs[k].description
                };
            } else if (options[k]) {
                dictionary[k] = {
                    key: k,
                    default: defvalue,
                    datatype: docs[k].datatype,
                    inherited: instance.constructor.name,
                    description: docs[k].description
                };
            }
        }
        return dictionary;
    }

    getOptionGrid(obj) {
        let instance = new obj(),
            dictionary = this.getOptionsGridData(obj),
            fields = [],
            data = [],
            parentclass = Object.getPrototypeOf(Object.getPrototypeOf(instance)).constructor;

        let title = `${instance.constructor.name} Options`;
        if (parentclass.name !== 'Object') {
            title = `${instance.constructor.name} Options (inherits ${parentclass.name})`;
        }

        // Use the "docs" keys because we only want to display keys we have values for.
        let keys = Object.keys(dictionary).sort(function(a, b){
            let a1 = a.toLowerCase(),
                b1 = b.toLowerCase();
            if (a1 === b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
        for (let k of keys) {
            data.push(dictionary[k]);
        }

        fields.push(new GridField({
            name: "key",
            label: "Key",
            type: "string",
            nodupe: true,
            hidden: false,
            classes: ['nowrap'],
            description: "The programmatic name for the option.",
            renderer: (data) => {
                return data;
            }
        }));
        fields.push(new GridField({
            name: "datatype",
            label: "Datatype",
            type: "enumeration",
            hidden: false,
            nodupe: true,
            classes: ['nowrap'],
            options: [
                { value: "boolean", label: "Boolean" },
                { value: "string", label: "String" },
                { value: "stringarray", label: "String Array" },
                { value: "dictionary", label: "Dictionary" },
                { value: "function", label: "Function" },
                { value: "number", label: "Number" },
                { value: "object", label: "Object" },
                { value: "domobject", label: "DOM Object" },
                { value: "enumeration", label: "Enumeration" },
                { value: "array", label: "Array" },
                { value: "simpleform", label: "SimpleForm" }
            ],
            description: "The datatype of this option",
        }));
        fields.push(new GridField({
            name: "default",
            label: "Default",
            type: "string",
            hidden: false,
            nodupe: true,
            description: "The default value, if any.",
            renderer: (data) => {
                let s = document.createElement('span');
                s.innerHTML = data;
                return s;
            }
        }));
        fields.push(new GridField({
            name: "inherited",
            label: "Inherited From",
            type: "string",
            hidden: false,
            nodupe: true,
            classes: ['nowrap'],
            description: "The class this variable is inherited from."

        }));
        fields.push(new GridField({
            name: "description",
            label: "Description",
            type: "string",
            nodupe: true,
            hidden: false,
            description: "The description of the option"
        }));

        return new DataGrid({
            title: title,
            collapsible: true,
            minimized: true,
            data: data,
            selectable: false,
            searchable: false,
            filterable: false,
            exportable: false,
            rowactions: null,
            fields: fields
        });
    }

    grindButtons() {
        

        let baseconfigs = [
            { text: "Default", type: "normal", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Hover", type: "normal", classes: ['hover'], action: (e, self) => { this.dumpConfig(self); } },
            { text: "Active", type: "normal", classes: ['active'], action: (e, self) => { this.dumpConfig(self); } },
            { text: "Focus", type: "normal", classes: ['focus'], action: (e, self) => { this.dumpConfig(self); } },
            { text: "Disabled", type: "normal", disabled: true, action: (e, self) => { this.dumpConfig(self); } }
        ];
        let secondconfigs = [
            { text: "Normal", type: "normal", icon: "globe", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Two Icons", type: "normal", icon: "globe", secondicon: "legend", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Constructive", type: "constructive", icon: "echx", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Destructive", type: "destructive", icon: "trashcan", action: (e, self) => { this.dumpConfig(self); } }
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
            { text: "Normal", type: "normal", icon: "globe", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Constructive", type: "constructive", icon: "echx", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Destructive", type: "destructive", icon: "minimize", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Normal", type: "normal", ghost: true, icon: "globe", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Constructive", type: "constructive", ghost: true, icon: "echx", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Destructive", type: "destructive", ghost: true, icon: "minimize", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Normal", type: "normal", mute: true, icon: "globe", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Constructive", type: "constructive", mute: true, icon: "echx", action: (e, self) => { this.dumpConfig(self); } },
            { text: "Destructive", type: "destructive", mute: true, icon: "minimize", action: (e, self) => { this.dumpConfig(self); } }
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
                action: (e, self) => { this.dumpConfig(self); }
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

    getCoda() {
        return [
            { track: 1, album: "Coda", released: "1982-11-19", label: "Swan Song", title: "We're Gonna Groove", writers: ["Bethea", "King"], length: "2:37", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Led_Zeppelin_-_Coda.jpg" },
            { track: 2, album: "Coda", released: "1982-11-19", label: "Swan Song", title: "Poor Tom", writers: ["Page", "Plant"], length: "3:02", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Led_Zeppelin_-_Coda.jpg" },
            { track: 3, album: "Coda", released: "1982-11-19", label: "Swan Song", title: "I Can't Quit You Baby", writers: ["Dixon"], length: "4:18", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Led_Zeppelin_-_Coda.jpg" },
            { track: 4, album: "Coda", released: "1982-11-19", label: "Swan Song", title: "Walter's Walk", writers: ["Page", "Plant"], length: "4:31", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Led_Zeppelin_-_Coda.jpg" },
            { track: 5, album: "Coda", released: "1982-11-19", label: "Swan Song", title: "Ozone Baby", writers: ["Page", "Plant"], length: "3:36", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Led_Zeppelin_-_Coda.jpg" },
            { track: 6, album: "Coda", released: "1982-11-19", label: "Swan Song", title: "Darlene", writers: ["Page", "Plant", "Bonham", "Jones"], length: "5:06", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Led_Zeppelin_-_Coda.jpg" },
            { track: 7, album: "Coda", released: "1982-11-19", label: "Swan Song", title: "Bonzo's Montreux", writers: ["Bonham"], length: "4:22", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Led_Zeppelin_-_Coda.jpg" },
            { track: 8, album: "Coda", released: "1982-11-19", label: "Swan Song", title: "Wearing and Tearing", writers: ["Page", "Plant"], length: "5:27", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Led_Zeppelin_-_Coda.jpg" }
        ];
    }

    getLZDiscograpy() {
        return [
            { "track" :  1, "album" :  "Led Zeppelin", "released" :  "1969-01-12", "label" :  "Atlantic", "title" :  "Good Times Bad Times", "writers" :  ["Page", "Jones", "Bonham"], "length" :  "2:46", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png" },
            { "track" :  2, "album" :  "Led Zeppelin", "released" :  "1969-01-12", "label" :  "Atlantic", "title" :  "Babe I'm Gonna Leave You", "writers" :  ["Bredon", "Page", "Plant"], "length" :  "6:42", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png" },
            { "track" :  3, "album" :  "Led Zeppelin", "released" :  "1969-01-12", "label" :  "Atlantic", "title" :  "You Shook Me", "writers" :  ["Dixon", "Lenoir"], "length" :  "6:28", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png" },
            { "track" :  4, "album" :  "Led Zeppelin", "released" :  "1969-01-12", "label" :  "Atlantic", "title" :  "Dazed and Confused", "writers" :  ["Page", "Holmes"], "length" :  "6:28", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png" },
            { "track" :  5, "album" :  "Led Zeppelin", "released" :  "1969-01-12", "label" :  "Atlantic", "title" :  "Your Time is Gonna Come", "writers" :  ["Page", "Jones"], "length" :  "4:34", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png" },
            { "track" :  6, "album" :  "Led Zeppelin", "released" :  "1969-01-12", "label" :  "Atlantic", "title" :  "Black Mountain Side", "writers" :  ["Page"], "length" :  "2:12", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png" },
            { "track" :  7, "album" :  "Led Zeppelin", "released" :  "1969-01-12", "label" :  "Atlantic", "title" :  "Communication Breakdown", "writers" :  ["Page", "Jones", "Bonham"], "length" :  "2:30", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png" },
            { "track" :  8, "album" :  "Led Zeppelin", "released" :  "1969-01-12", "label" :  "Atlantic", "title" :  "I Can't Quit You Baby", "writers" :  ["Dixon"], "length" :  "4:42", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png" },
            { "track" :  9, "album" :  "Led Zeppelin", "released" :  "1969-01-12", "label" :  "Atlantic", "title" :  "How Many More Times", "writers" :  ["Page", "Jones", "Bonham"], "length" :  "8:27", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/ef/Led_Zeppelin_-_Led_Zeppelin_%281969%29_front_cover.png" },

            { "track" :  1, "album" :  "Led Zeppelin II", "released" :  "1969-10-11", "label" :  "Atlantic", "title" :  "Whole Lotta Love", "writers" :  ["Page", "Dixon", "Jones", "Plant"], "length" :  "5:34", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/20/Led_Zeppelin_-_Led_Zeppelin_II.jpg" },
            { "track" :  2, "album" :  "Led Zeppelin II", "released" :  "1969-10-11", "label" :  "Atlantic", "title" :  "What Is and What Should Never Be", "writers" :  ["Page", "Plant"], "length" :  "4:46", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/20/Led_Zeppelin_-_Led_Zeppelin_II.jpg" },
            { "track" :  3, "album" :  "Led Zeppelin II", "released" :  "1969-10-11", "label" :  "Atlantic", "title" :  "The Lemon Song", "writers" :  ["Bonham", "Burnett", "Jones", "Page", "Plant"], "length" :  "6:19", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/20/Led_Zeppelin_-_Led_Zeppelin_II.jpg" },
            { "track" :  4, "album" :  "Led Zeppelin II", "released" :  "1969-10-11", "label" :  "Atlantic", "title" :  "Thank You", "writers" :  ["Page", "Plant"], "length" :  "4:49", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/20/Led_Zeppelin_-_Led_Zeppelin_II.jpg" },
            { "track" :  5, "album" :  "Led Zeppelin II", "released" :  "1969-10-11", "label" :  "Atlantic", "title" :  "Heartbreaker", "writers" :  ["Bonham", "Jones", "Page", "Plant"], "length" :  "4:14", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/20/Led_Zeppelin_-_Led_Zeppelin_II.jpg" },
            { "track" :  6, "album" :  "Led Zeppelin II", "released" :  "1969-10-11", "label" :  "Atlantic", "title" :  "Living Loving Maid (She's Just a Woman)", "writers" :  ["Page", "Plant"], "length" :  "2:39", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/20/Led_Zeppelin_-_Led_Zeppelin_II.jpg" },
            { "track" :  7, "album" :  "Led Zeppelin II", "released" :  "1969-10-11", "label" :  "Atlantic", "title" :  "Ramble On", "writers" :  ["Page", "Plant"], "length" :  "4:34", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/20/Led_Zeppelin_-_Led_Zeppelin_II.jpg" },
            { "track" :  8, "album" :  "Led Zeppelin II", "released" :  "1969-10-11", "label" :  "Atlantic", "title" :  "Moby Dick", "writers" :  ["Bonham", "Jones", "Page"], "length" :  "4:20", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/20/Led_Zeppelin_-_Led_Zeppelin_II.jpg" },
            { "track" :  9, "album" :  "Led Zeppelin II", "released" :  "1969-10-11", "label" :  "Atlantic", "title" :  "Bring It On Home", "writers" :  ["Dixon"], "length" :  "4:19", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/20/Led_Zeppelin_-_Led_Zeppelin_II.jpg" },

            { "track" :  1, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "Immigrant Song", "writers" :  ["Page", "Plant"], "length" :  "2:26", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },
            { "track" :  2, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "Friends", "writers" :  ["Page", "Plant"], "length" :  "3:55", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },
            { "track" :  3, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "Celebration Day", "writers" :  ["Jones", "Page", "Plant"], "length" :  "3:29", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },
            { "track" :  4, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "Since I've Been Loving You", "writers" :  ["Jones", "Page", "Plant"], "length" :  "7:25", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },
            { "track" :  5, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "Out on the Tiles", "writers" :  ["Bonham", "Page", "Plant"], "length" :  "4:04", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },
            { "track" :  6, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "Gallows Pole", "writers" :  ["Page", "Plant"], "length" :  "4:58", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },
            { "track" :  7, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "Tangerine", "writers" :  ["Page"], "length" :  "3:12", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },
            { "track" :  8, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "That's the Way", "writers" :  ["Page", "Plant"], "length" :  "5:38", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },
            { "track" :  9, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "Bron-Y-Aur Stomp", "writers" :  ["Jones", "Page", "Plant"], "length" :  "4:20", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },
            { "track" :  10, "album" :  "Led Zeppelin III", "released" :  "1970-10-05", "label" :  "Atlantic", "title" :  "Hats Off to (Roy) Harper", "writers" :  ["Obscure"], "length" :  "3:41", "image" :  "https://upload.wikimedia.org/wikipedia/en/5/5f/Led_Zeppelin_-_Led_Zeppelin_III.png" },

            { "track" :  1, "album" :  "Led Zeppelin IV", "released" :  "1971-11-08", "label" :  "Atlantic", "title" :  "Black Dog", "writers" :  ["Page", "Plant", "Jones"], "length" :  "4:54", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
            { "track" :  2, "album" :  "Led Zeppelin IV", "released" :  "1971-11-08", "label" :  "Atlantic", "title" :  "Rock and Roll", "writers" :  ["Page", "Plant", "Jones", "Bonham"], "length" :  "3:40", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
            { "track" :  3, "album" :  "Led Zeppelin IV", "released" :  "1971-11-08", "label" :  "Atlantic", "title" :  "The Battle of Evermore", "writers" :  ["Page", "Plant"], "length" :  "5:51", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
            { "track" :  4, "album" :  "Led Zeppelin IV", "released" :  "1971-11-08", "label" :  "Atlantic", "title" :  "Stairway to Heaven", "writers" :  ["Page", "Plant"], "length" :  "8:02", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
            { "track" :  5, "album" :  "Led Zeppelin IV", "released" :  "1971-11-08", "label" :  "Atlantic", "title" :  "Misty Mountain Hop", "writers" :  ["Page", "Plant"], "length" :  "4:38", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
            { "track" :  6, "album" :  "Led Zeppelin IV", "released" :  "1971-11-08", "label" :  "Atlantic", "title" :  "Four Sticks", "writers" :  ["Page", "Plant"], "length" :  "4:44", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
            { "track" :  7, "album" :  "Led Zeppelin IV", "released" :  "1971-11-08", "label" :  "Atlantic", "title" :  "Going to California", "writers" :  ["Page", "Plant"], "length" :  "3:31", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },
            { "track" :  8, "album" :  "Led Zeppelin IV", "released" :  "1971-11-08", "label" :  "Atlantic", "title" :  "When the Levee Breaks", "writers" :  ["Page", "Plant", "Jones", "Bohnam", "Minnie"], "length" :  "7:07", "image" :  "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg" },

            { "track" :  1, "album" :  "Houses of the Holy", "released" :  "1973-03-28", "label" :  "Atlantic", "title" :  "The Song Remains the Same", "writers" :  ["Page", "Plant"], "length" :  "5:32", "image" :  "https://upload.wikimedia.org/wikipedia/en/9/9f/Led_Zeppelin_-_Houses_of_the_Holy.jpg" },
            { "track" :  2, "album" :  "Houses of the Holy", "released" :  "1973-03-28", "label" :  "Atlantic", "title" :  "The Rain Song", "writers" :  ["Page", "Plant"], "length" :  "7:39", "image" :  "https://upload.wikimedia.org/wikipedia/en/9/9f/Led_Zeppelin_-_Houses_of_the_Holy.jpg" },
            { "track" :  3, "album" :  "Houses of the Holy", "released" :  "1973-03-28", "label" :  "Atlantic", "title" :  "Over the Hills and Far Away", "writers" :  ["Page", "Plant"], "length" :  "4:50", "image" :  "https://upload.wikimedia.org/wikipedia/en/9/9f/Led_Zeppelin_-_Houses_of_the_Holy.jpg" },
            { "track" :  4, "album" :  "Houses of the Holy", "released" :  "1973-03-28", "label" :  "Atlantic", "title" :  "The Crunge", "writers" :  ["Bonham", "Page", "Plant", "Jones"], "length" :  "3:17", "image" :  "https://upload.wikimedia.org/wikipedia/en/9/9f/Led_Zeppelin_-_Houses_of_the_Holy.jpg" },
            { "track" :  5, "album" :  "Houses of the Holy", "released" :  "1973-03-28", "label" :  "Atlantic", "title" :  "Dancing Days", "writers" :  ["Page", "Plant"], "length" :  "3:43", "image" :  "https://upload.wikimedia.org/wikipedia/en/9/9f/Led_Zeppelin_-_Houses_of_the_Holy.jpg" },
            { "track" :  6, "album" :  "Houses of the Holy", "released" :  "1973-03-28", "label" :  "Atlantic", "title" :  "D'yer Mak'er", "writers" :  ["Bonham", "Page", "Plant", "Jones"], "length" :  "4:23", "image" :  "https://upload.wikimedia.org/wikipedia/en/9/9f/Led_Zeppelin_-_Houses_of_the_Holy.jpg" },
            { "track" :  7, "album" :  "Houses of the Holy", "released" :  "1973-03-28", "label" :  "Atlantic", "title" :  "No Qauarter", "writers" :  ["Page", "Plant", "Jones"], "length" :  "7:00", "image" :  "https://upload.wikimedia.org/wikipedia/en/9/9f/Led_Zeppelin_-_Houses_of_the_Holy.jpg" },
            { "track" :  8, "album" :  "Houses of the Holy", "released" :  "1973-03-28", "label" :  "Atlantic", "title" :  "The Ocean", "writers" :  ["Bonham", "Page", "Plant", "Jones"], "length" :  "4:31", "image" :  "https://upload.wikimedia.org/wikipedia/en/9/9f/Led_Zeppelin_-_Houses_of_the_Holy.jpg" },


            { "track" :  1, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Custard Pie", "writers" :  ["Page", "Plant"], "length" :  "4:13", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  2, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "The Rover", "writers" :  ["Page", "Plant"], "length" :  "5:36", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  3, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "In My Time of Dying", "writers" :  ["Page", "Plant", "Bonham", "Jones"], "length" :  "11:04", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  4, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Houses of the Holy", "writers" :  ["Page", "Plant"], "length" :  "4:01", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  5, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Trampled Under Foot", "writers" :  ["Page", "Plant", "Jones"], "length" :  "5:35", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  6, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Kashmir", "writers" :  ["Bonham", "Page", "Plant"], "length" :  "8:37", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  7, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "In the Light", "writers" :  ["Page", "Plant", "Jones"], "length" :  "8:44", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  8, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Bron-Yr-Aur", "writers" :  ["Page"], "length" :  "2:06", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  9, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Down by the Seaside", "writers" :  ["Page", "Plant"], "length" :  "5:14", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  10, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Ten Years Gone", "writers" :  ["Page", "Plant"], "length" :  "6:31", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  11, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Night Flight", "writers" :  ["Page", "Plant", "Jones"], "length" :  "3:36", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  12, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "The Wanton Song", "writers" :  ["Page", "Plant"], "length" :  "4:06", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  13, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Boogie with Stu", "writers" :  ["Bonham", "Page", "Plant", "Jones", "Stewart", "Valens"], "length" :  "3:51", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  14, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Black Country Woman", "writers" :  ["Page", "Plant"], "length" :  "4:24", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },
            { "track" :  15, "album" :  "Physical Graffiti", "released" :  "1975-02-24", "label" :  "Swan Song", "title" :  "Sick Again", "writers" :  ["Page", "Plant"], "length" :  "4:43", "image" :  "https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg" },


            { "track" :  1, "album" :  "Presence", "released" :  "1976-03-31", "label" :  "Swan Song", "title" :  "Achilles Last Stand", "writers" :  ["Page", "Plant"], "length" :  "10:26", "image" :  "https://upload.wikimedia.org/wikipedia/en/f/f3/Led_Zeppelin_-_Presence.jpg" },
            { "track" :  2, "album" :  "Presence", "released" :  "1976-03-31", "label" :  "Swan Song", "title" :  "For Your Life", "writers" :  ["Page", "Plant"], "length" :  "6:21", "image" :  "https://upload.wikimedia.org/wikipedia/en/f/f3/Led_Zeppelin_-_Presence.jpg" },
            { "track" :  3, "album" :  "Presence", "released" :  "1976-03-31", "label" :  "Swan Song", "title" :  "Royal Orleans", "writers" :  ["Page", "Plant", "Bonham", "Jones"], "length" :  "2:58", "image" :  "https://upload.wikimedia.org/wikipedia/en/f/f3/Led_Zeppelin_-_Presence.jpg" },
            { "track" :  4, "album" :  "Presence", "released" :  "1976-03-31", "label" :  "Swan Song", "title" :  "Nobody's Fault but Mine", "writers" :  ["Page", "Plant"], "length" :  "6:15", "image" :  "https://upload.wikimedia.org/wikipedia/en/f/f3/Led_Zeppelin_-_Presence.jpg" },
            { "track" :  5, "album" :  "Presence", "released" :  "1976-03-31", "label" :  "Swan Song", "title" :  "Candy Store Rock", "writers" :  ["Page", "Plant"], "length" :  "4:10", "image" :  "https://upload.wikimedia.org/wikipedia/en/f/f3/Led_Zeppelin_-_Presence.jpg" },
            { "track" :  6, "album" :  "Presence", "released" :  "1976-03-31", "label" :  "Swan Song", "title" :  "Host On for Nowhere", "writers" :  ["Page", "Plant"], "length" :  "4:42", "image" :  "https://upload.wikimedia.org/wikipedia/en/f/f3/Led_Zeppelin_-_Presence.jpg" },
            { "track" :  7, "album" :  "Presence", "released" :  "1976-03-31", "label" :  "Swan Song", "title" :  "Tea for One", "writers" :  ["Page", "Plant"], "length" :  "9:27", "image" :  "https://upload.wikimedia.org/wikipedia/en/f/f3/Led_Zeppelin_-_Presence.jpg" },

            { "track" :  1, "album" :  "In Through the Out Door", "released" :  "1979-08-15", "label" :  "Swan Song", "title" :  "In the Evening", "writers" :  ["Page", "Plant", "Jones"], "length" :  "6:48", "image" :  "https://upload.wikimedia.org/wikipedia/en/b/ba/Led_Zeppelin_-_In_Through_the_Out_Door.jpg" },
            { "track" :  2, "album" :  "In Through the Out Door", "released" :  "1979-08-15", "label" :  "Swan Song", "title" :  "South Bound Saurez", "writers" :  ["Jones", "Plant"], "length" :  "4:11", "image" :  "https://upload.wikimedia.org/wikipedia/en/b/ba/Led_Zeppelin_-_In_Through_the_Out_Door.jpg" },
            { "track" :  3, "album" :  "In Through the Out Door", "released" :  "1979-08-15", "label" :  "Swan Song", "title" :  "Fool in the Rain", "writers" :  ["Page", "Plant", "Jones"], "length" :  "6:08", "image" :  "https://upload.wikimedia.org/wikipedia/en/b/ba/Led_Zeppelin_-_In_Through_the_Out_Door.jpg" },
            { "track" :  4, "album" :  "In Through the Out Door", "released" :  "1979-08-15", "label" :  "Swan Song", "title" :  "Hot Dog", "writers" :  ["Page", "Plant"], "length" :  "3:15", "image" :  "https://upload.wikimedia.org/wikipedia/en/b/ba/Led_Zeppelin_-_In_Through_the_Out_Door.jpg" },
            { "track" :  5, "album" :  "In Through the Out Door", "released" :  "1979-08-15", "label" :  "Swan Song", "title" :  "Carouselambra", "writers" :  ["Page", "Plant", "Jones"], "length" :  "10:28", "image" :  "https://upload.wikimedia.org/wikipedia/en/b/ba/Led_Zeppelin_-_In_Through_the_Out_Door.jpg" },
            { "track" :  6, "album" :  "In Through the Out Door", "released" :  "1979-08-15", "label" :  "Swan Song", "title" :  "All My Love", "writers" :  ["Page", "Plant"], "length" :  "5:51", "image" :  "https://upload.wikimedia.org/wikipedia/en/b/ba/Led_Zeppelin_-_In_Through_the_Out_Door.jpg" },
            { "track" :  7, "album" :  "In Through the Out Door", "released" :  "1979-08-15", "label" :  "Swan Song", "title" :  "I'm Gonna Crawl", "writers" :  ["Page", "Plant", "Jones"], "length" :  "5:28", "image" :  "https://upload.wikimedia.org/wikipedia/en/b/ba/Led_Zeppelin_-_In_Through_the_Out_Door.jpg" }
        ]
    }

    grindDataGrids() {

        let dg = new DataGrid({
            id: 'cfb-demo-grid-lz',
            title: 'Songs by Led Zeppelin',
            elementname: 'Song',
            collapsible: false,
            warehouse: new LZSong(),
            //minimized: true,
            //data: this.getLZDiscograpy(),
            rowactions: [
                {
                    label: 'Edit',
                    icon: 'pencil',
                    tooltip: 'Edit this item.',
                    type: 'edit'
                },
                {
                    label: 'Duplicate',
                    icon: 'duplicate',
                    tooltip: 'Duplicate this item.',
                    type: 'duplicate'
                },
                {
                    label: 'Delete',
                    icon: 'trashcan',
                    tooltip: 'Delete this item.',
                    type: 'delete'
                }
            ],
            source: 'demo/data/lz.json'
        });

        document.getElementById('datagrid-basic').appendChild(dg.container);

        let controls = document.createElement('div');
        controls.classList.add('example');
        controls.classList.add('centered');

        controls.appendChild(new SimpleButton({
            text: "Append Data",
            action: () => {
                dg.fetchData('demo/data/coda.json');
            }
        }).container);

        controls.appendChild(new SimpleButton({
            text: "Update Data",
            action: () => {
                dg.mergeData('demo/data/lz-update.json');
            }
        }).container);

        document.getElementById('datagrid-basic').appendChild(controls);
    }

    grindDialogs() {
        

        let dialogs = document.createElement('div');
        dialogs.classList.add('example');
        dialogs.classList.add('centered');
        dialogs.appendChild(new SimpleButton({
            text: "Login Form",
            action: () => {
                this.dialog = new DialogWindow({
                    title: "Login",
                    form: new SimpleForm(CornflowerBlueDemo.DIALOG_LOGIN_FORM)
                }).open();
            }
        }).button);
        dialogs.appendChild(new SimpleButton({
            text: "Kubla Khan",
            action: () => {
                let khan = document.querySelector('#khan').cloneNode(true);
                khan.style.padding = '1.5em';
                this.dialog = new DialogWindow({
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
                    "Make changes to your profile below.",
                    "Click 'Save changes' when done."
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
                    name: 'name',
                    autocomplete: 'off',
                    mute: true,
                    placeholder: "Miyamoto Musashi",
                    help: "Enter your name in whatever manner befits your culture."
                }),
                new TextInput({
                    label: "Nickname",
                    name: 'nickname',
                    autocomplete: 'off',
                    placeholder: "Musashi",
                    help: "What should we call you? This is your short name."
                }),
                new EmailInput({
                    label: "Email",
                    name: 'email',
                    mute: true,
                    autocomplete: 'off',
                    required: true
                })
            ],
            handler: (self, callback) => {
                let results = {
                    success: true,
                    results: ['Your account has been updated successfully!']
                };
                self.pacify();
                callback(results);
            },
            passiveactions: [
                new SimpleButton({
                    text: TextFactory.get('make_changes'),
                    icon: "pencil-circle",
                    action: (e, self) => {
                        e.preventDefault();
                        self.form.activate();
                    }
                })
            ],
            actions: [
                new ConstructiveButton({
                    text: TextFactory.get('save_changes'),
                    icon: "checkmark-circle",
                    submits: true,
                    disabled: true  // No action needed.
                }),
                new DestructiveButton({
                    text: TextFactory.get('cancel_changes'),
                    icon: "echx-circle",
                    mute: true,
                    action: (e, self) => {
                        e.preventDefault();
                        self.form.reset();
                        self.form.pacify();
                    }
                })
            ]
        });
        document.getElementById('forms-passive').appendChild(p.container);

    }

    grindGrowlers() {
        

        let positions = document.createElement('div');
        positions.classList.add('example');
        positions.classList.add('centered');
        positions.appendChild(new SimpleButton({
            text: "Top Left",
            action: () => {
                new Growler({
                    position: 'top-left',
                    icon: 'globe',
                    title: 'Top Left Growler',
                    text: 'A growler is here!',
                    onopen: (g) => { this.dumpConfig(g);}
                });

            }
        }).button);
        positions.appendChild(new SimpleButton({
            text: "Top Center",
            action: () => {
                new Growler({
                    position: 'top-center',
                    icon: 'chat',
                    text: 'A top-center growler with an icon and no title.',
                    onopen: (g) => { this.dumpConfig(g);}
                });
            }
        }).button);
        positions.appendChild(new SimpleButton({
            text: "Top Right",
            action: () => {
                new Growler({
                    position: 'top-right',
                    icon: 'star',
                    title: 'Growler with no text.',
                    onopen: (g) => { this.dumpConfig(g);}
                });
            }
        }).button);
        document.getElementById('growlers-positions').appendChild(positions);

        let positionslower = document.createElement('div');
        positionslower.classList.add('example');
        positionslower.classList.add('centered');
        positionslower.appendChild(new SimpleButton({
            text: "Bottom Left",
            action: () => {
                new Growler({
                    position: 'bottom-left',
                    title: 'Bottom Left Growler',
                    text: 'This growler has duration:0, and will stay until dismissed.',
                    duration: 0,
                    onopen: (g) => { this.dumpConfig(g);}
                });
            }
        }).button);
        positionslower.appendChild(new SimpleButton({
            text: "Bottom Center",
            action: () => {
                new Growler({
                    position: 'bottom-center',
                    icon: 'heart',
                    title: 'Bottom Center Growler',
                    text: 'This growler has duration:0, so will stay until dismissed.',
                    duration: 0,
                    onopen: (g) => { this.dumpConfig(g);}
                });
            }
        }).button);
        positionslower.appendChild(new SimpleButton({
            text: "Bottom Right",
            action: () => {
                new Growler({
                    position: 'bottom-right',
                    title: 'Bottom Right Growler',
                    text: 'Another growler over here!',
                    onopen: (g) => { this.dumpConfig(g);}
                });
            }
        }).button);
        document.getElementById('growlers-positions').appendChild(positionslower);


        let special = document.createElement('div');
        special.classList.add('example');
        special.classList.add('centered');
        special.appendChild(new SimpleButton({
            text: "Quick Growl",
            action: () => {
                Growler.growl('This is a growl message!', 'Growler.growl');
                this.writeConfig("Growler.growl", `Growler.growl('This is a growl message!', 'Growler.growl');`);
            }
        }).button);
        special.appendChild(new SimpleButton({
            text: "Success",
            action: () => {
                Growler.success('This is a success message!');
                this.writeConfig("Growler.success", `Growler.success('This is a success message!');`);
            }
        }).button);
        special.appendChild(new SimpleButton({
            text: "Error",
            action: () => {
                Growler.error('This is an error message!');
                this.writeConfig("Growler.error", `Growler.error('This is an error message!');`);
            }
        }).button);
        special.appendChild(new SimpleButton({
            text: "Warn",
            action: () => {
                Growler.warn('This is a warning message!');
                this.writeConfig("Growler.warn", `Growler.warn('This is a warning message!');`);
            }
        }).button);
        special.appendChild(new SimpleButton({
            text: "Caution",
            action: () => {
                Growler.caution('This is a caution message!');
                this.writeConfig("Growler.caution", `Growler.caution('This is a caution message!');`);

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
        document.getElementById('inputs-text').appendChild(standard);


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
            action: (e, self) => {
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

        let messages = document.createElement('div');
        messages.classList.add('example');
        messages.classList.add('vert');

        let content = document.createElement('p');
        content.innerHTML = 'The content of a message box is raw html or any other element.';
        messages.appendChild(new MessageBox({
            title: 'This is a title',
            content: content
        }).container);
        document.getElementById('boxes-message').appendChild(messages);


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

        responses.appendChild(new SuccessBox({
            results: [
                "The file was imported successfully!"
            ]
        }).container);

        responses.appendChild(new WarningBox({
            warnings: [
                "The file was imported successfully, but some of the data was duplicated.",
                "Duplicate entries have been removed."
            ]
        }).container);

        responses.appendChild(new ErrorBox({
            errors: [
                "The file was not imported.",
                "The file's size was larger than can be accepted."
            ]
        }).container);

        document.getElementById('boxes-responses').appendChild(responses);
    }

    grindProgressMeters() {

        let vert = document.getElementById('progressmeter-simple-vert');
        let simple = document.getElementById('progressmeter-simple');
        let radial = document.getElementById('progressmeter-radial');
        let radial2 = document.getElementById('progressmeter-radial2');

        vert.appendChild(new SimpleProgressMeter({
            label: "Overall Progress",
            direction: 'vertical',
            value: 25
        }).container);
        vert.appendChild(new SimpleProgressMeter({
            label: "Decalposition: interior",
            decalposition: 'interior',
            currentrank: "Bronze",
            nextrank: "Silver",
            direction: 'vertical',
            minvalue: 200,
            maxvalue: 600,
            value: 335
        }).container);
        vert.appendChild(new SimpleProgressMeter({
            label: "Decalposition: exterior",
            decalposition: 'exterior',
            currentrank: "Bronze",
            nextrank: "Silver",
            direction: 'vertical',
            minvalue: 200,
            maxvalue: 600,
            value: 335
        }).container);

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
            action: (e, self) => {
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

        let yearOptions = [
            { label: "2019", value: "2019" },
            { label: "2018", value: "2018" },
            { label: "2017", value: "2017" },
            { label: "2016", value: "2016" },
            { label: "2015", value: "2015" },
            { label: "2014", value: "2014" },
            { label: "2013", value: "2013" },
            { label: "2012", value: "2012" }
        ];
        let albumOptions = [
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
        ];

        let standard = document.getElementById('selects-standard');
        standard.appendChild(new SelectMenu({
            label: "Year",
            name: "year-select",
            required: true,
            prefix: 'Year:',
            unselectedtext: '(No selection)',
            options: yearOptions
        }).container);
        standard.appendChild(new SelectMenu({
            label: "Year",
            name: "year-select",
            required: true,
            prefix: 'Year:',
            unselectedtext: '(No selection)',
            options: yearOptions
        }).container);
        standard.appendChild(new SelectMenu({
            label: "Favorite Album",
            name: "favorite_album",
            mute: true,
            unselectedtext: '(No selection)',
            options: albumOptions
        }).container);
        standard.appendChild(new SelectMenu({
            label: "Favorite Album",
            name: "favorite_album",
            mute: true,
            disabled: true,
            unselectedtext: '(No selection)',
            options: albumOptions
        }).container);

        document.getElementById('selects-state').appendChild(new StateMenu({
            label: 'State',
            value: 'WV',
            mute: true
        }).container);
        document.getElementById('selects-country').appendChild(new CountryMenu({
            value: 'FM'
        }).container);
        document.getElementById('selects-timezone').appendChild(new TimezoneMenu({
            value: 'America/Los_Angeles'
        }).container);

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
        document.getElementById('selects-passive').appendChild(passiveTest.container);
        document.getElementById('selects-passive').appendChild(new SimpleButton({
            text: ".activate()",
            action: (e, self) => {
                passiveTest.toggleActivation();
                if (passiveTest.passive) {
                    self.text = ".activate()";
                } else {
                    self.text = ".pacify()";
                }
            }
        }).button);
    }

    grindTextAreas() {
        document.getElementById('textareas-standard').appendChild(new TextArea({
            label: "Post Content",
            maxlength: 2000,
            placeholder: "Write your post here!"
        }).container);
        document.getElementById('textareas-standard').appendChild(new TextArea({
            label: "Post Content",
            mute: true,
            maxlength: 2000,
            placeholder: "Write your post here!"
        }).container);
        document.getElementById('textareas-standard').appendChild(new TextArea({
            label: "Post Content",
            maxlength: 2000,
            disabled: true,
            placeholder: "Write your post here!"
        }).container);

        let passiveTest = new TextArea({
            label: "Post Content",
            maxlength: 2000,
            passive: true,
            placeholder: "Write your post here!"
        });
        document.getElementById('textareas-passive').appendChild(passiveTest.container);
        document.getElementById('textareas-passive').appendChild(new SimpleButton({
            text: ".activate()",
            action: (e, self) => {
                passiveTest.toggleActivation();
                if (passiveTest.passive) {
                    self.text = ".activate()";
                } else {
                    self.text = ".pacify()";
                }
            }
        }).button);
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
                { label: "Profile", icon: 'user', action: () => { Growler.growl("Clicked 'User'") } },
                { label: "Preferences", icon: 'gear', action: () => { Growler.growl("Clicked 'Preferences'") } },
                { label: "Schedule", icon: 'calendar', action: () => { Growler.growl("Clicked 'Schedule'") } },
                { label: "Log Out", icon: 'lock-open', action: () => { Growler.growl("Clicked 'Log Out'") } }
            ]
        }).container);
        buttonmenu.appendChild(new ButtonMenu({
            text: "User",
            icon: 'user-circle',
            mute: true,
            items: [
                { label: "Profile", icon: 'user', action: () => { Growler.growl("Clicked 'User'") } },
                { label: "Preferences", icon: 'gear', action: () => { Growler.growl("Clicked 'Preferences'") } },
                { label: "Schedule", icon: 'calendar', action: () => { Growler.growl("Clicked 'Schedule'") } },
                { label: "Log Out", icon: 'lock-open', action: () => { Growler.growl("Clicked 'Log Out'") } }
            ]
        }).container);
        buttonmenu.appendChild(new ButtonMenu({
            text: "User",
            icon: 'user-circle',
            disabled: true,
            items: [
                { label: "Profile", icon: 'user', action: () => { Growler.growl("Clicked 'User'") } },
                { label: "Preferences", icon: 'gear', action: () => { Growler.growl("Clicked 'Preferences'") } },
                { label: "Schedule", icon: 'calendar', action: () => { Growler.growl("Clicked 'Schedule'") } },
                { label: "Log Out", icon: 'lock-open', action: () => { Growler.growl("Clicked 'Log Out'") } }
            ]
        }).container);
        document.getElementById('tabsmenus-buttonmenu').appendChild(buttonmenu);

        let tabbar = document.createElement('div');
        tabbar.classList.add('example');
        tabbar.appendChild(new TabBar({
            tabs: [
                { id: 'dt-1-home', label: "Home", selected: true, icon: 'heart', action: () => { Growler.growl("Clicked 'Home'") } },
                { id: 'dt-1-feed', label: "Feed", icon: 'legend', action: () => { Growler.growl("Clicked 'Feed'") } },
                { id: 'dt-1-messages', label: "Messages", icon: 'chat', action: () => { Growler.growl("Clicked 'Messages'") } },
                { id: 'dt-1-profile', label: "Profile", icon: 'user', action: () => { Growler.growl("Clicked 'Profile'") } }
            ]
        }).container);
        document.getElementById('tabsmenus-tabbar').appendChild(tabbar);

    }


    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dumps an object's config.
     * @param o the object to dump.
     */
    dumpConfig(o) {
        this.writeConfig(o.constructor.name, CFBUtils.prettyPrintConfig(o));
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
        return CFBUtils.getConfig(this);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */
    get activearticle() { return this._activearticle; }
    set activearticle(activearticle) { this._activearticle = activearticle; }

    get body() { return this._body; }
    set body(body) { this._body = body; }

    get elementsnav() { return this._elementsnav; }
    set elementsnav(elementsnav) { this._elementsnav = elementsnav; }

    get complexnav() { return this._complexnav; }
    set complexnav(complexnav) { this._complexnav = complexnav; }

    get container() { return this._container; }
    set container(container) { this._container = container; }

    get skipbutton() { return this._skipbutton; }
    set skipbutton(skipbutton) { this._skipbutton = skipbutton; }

    get dialog() { return this._dialog; }
    set dialog(dialog) { this._dialog = dialog; }

    get main() { return this._main; }
    set main(main) { this._main = main; }

    get navigation() { return this._navigation; }
    set navigation(navigation) { this._navigation = navigation; }

}