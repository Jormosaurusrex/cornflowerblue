/*! Cornflower Blue - v0.1.1 - 2021-02-26
* http://www.gaijin.com/cornflowerblue/
* Copyright (c) 2021 Brandon Harris; Licensed MIT */
class PasswordChangeForm {

    static get DEFAULT_CONFIG() {
        return {
            maxlength: 30,
            minlength: 5,
            suggestedlength: 8,
            cannotbe: [],
            forceconstraints: null, // if true, force constraints defined in sub classes (many inputs don't have any)
            instructions: [TextFactory.get('passwordchanger-form-instructions')],
            placeholder: null,
            buttontext: TextFactory.get('change_password'),
            pwcurrlabel: TextFactory.get('current_password'),
            pwcurrplaceholder: TextFactory.get('passwordchanger-currentpw-placeholder'),
            pwcurrhelp: TextFactory.get('passwordchanger-currentpw-help'),
            pwonelabel: TextFactory.get('new_password'),
            pwoneplaceholder: null,
            pwonehelp: null,
            pwtwolabel: TextFactory.get('confirm_password'),
            pwtwoplaceholder: null,
            pwtwohelp: null,
            badpasswordhook: null // Function used to test the value against an external bad password list, like the one used by NIST.
        };
    }

    constructor(config) {
        this.config = Object.assign({}, PasswordChangeForm.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `pwchange-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* ACTION METHODS___________________________________________________________________ */


    /* VALIDATION METHODS_______________________________________________________________ */

    runChecks() {
        let valid = true;
        if ((this.pwone.value) !== (this.pwtwo.value)) {
            this.pwone.errors.push(TextArea.get('passwordchanger-error-passwords_must_match'));
            this.pwone.showMessages();
            valid = false;
        }
        if ((this.cannotbe) && (this.cannotbe.length > 0)) {
            for (let cbs of this.cannotbe) {
                if (this.pwone.value === cbs) {
                    this.pwone.errors.push(TextArea.get('passwordchanger-error-cannot_be_used_as_pw'));
                    valid = false;
                }
            }
        }
        if ((valid) && (this.badpasswordhook) && (typeof this.badpasswordhook === 'function')) {
            valid = this.badpasswordhook(this.pwone);
        }

        if (valid) {
            this.pwone.clearMessages();
        }

        return valid;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildForm() {

        this.pwcurr = new PasswordInput({
            id: `${this.id}-pwcurr`,
            label: this.pwcurrlabel,
            showpasswordbydefault: true,
            required: true,
            placeholder: this.pwcurrplaceholder,
            help: this.pwcurrhelp
        });
        this.pwone = new PasswordInput({
            id: `${this.id}-pwone`,
            label: this.pwonelabel,
            showpasswordbydefault: true,
            required: true,
            placeholder: this.pwoneplaceholder,
            help: this.pwonehelp
        });
        this.pwtwo = new PasswordInput({
            id: `${this.id}-pwtwo`,
            label: this.pwtwolabel,
            required: true,
            showpasswordbydefault: true,
            placeholder: this.pwtwoplaceholder,
            help: this.pwtwohelp
        });

        this.pwgen = new PasswordGenerator({
            autofills: [this.pwone, this.pwtwo]
        });


        this.form = new SimpleForm({
            instructions: {
                icon: 'help-circle',
                instructions: this.instructions
            },
            elements: [
                new HiddenField({
                    name: this.name
                }),
                this.pwcurr,
                this.pwone,
                this.pwtwo,
                this.pwgen

            ],
            validator: (self) => {
                return this.runChecks(self);
            },
            handler: (self, callback) => {
                let results = {
                    success: true,
                    results: [TextFactory.get('passwordchanger-results-changed_successfully')]
                };
                callback(results);
            },
            actions: [
                new ConstructiveButton({
                    text: this.buttontext,
                    hot: true,
                    submits: true,
                    disabled: true  // No action needed.
                })
            ]

        });

    }

    /**
     * Calculate the placeholder
     * @return {string|*}
     */
    calculatePlaceholder() {
        if (this.placeholder) { return this.placeholder; }
        if (this.forceconstraints) {
            return TextFactory.get('passwordchanger-placeholder-minlength', this.minlength);
        } else if (this.suggestedlength) {
            return TextFactory.get('passwordchanger-placeholder-suggested', this.suggestedlength);
        }
    }


    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get container() {
        return this.form.container;
    }

    get pwonehelp() {
        if (this.config.pwonehelp) { return this.config.pwonehelp; }
        // generate
    }

    get pwoneplaceholder() {
        if (this.config.pwoneplaceholder) { return this.config.pwoneplaceholder; }
        // generate
    }

    get pwtwohelp() {
        if (this.config.pwtwohelp) { return this.config.pwtwohelp; }
        // generate
    }

    get pwtwoplaceholder() {
        if (this.config.pwtwoplaceholder) { return this.config.pwtwoplaceholder; }
        // generate
    }


    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get badpasswordhook() { return this.config.badpasswordhook; }
    set badpasswordhook(badpasswordhook) {
        if (typeof badpasswordhook !== 'function') {
            console.error("Action provided for badpasswordhook is not a function!");
        }
        this.config.badpasswordhook = badpasswordhook;
    }

    get buttontext() { return this.config.buttontext; }
    set buttontext(buttontext) { this.config.buttontext = buttontext; }

    get cannotbe() { return this.config.cannotbe; }
    set cannotbe(cannotbe) { this.config.cannotbe = cannotbe; }

    get forceconstraints() { return this.config.forceconstraints; }
    set forceconstraints(forceconstraints) { this.config.forceconstraints = forceconstraints; }

    get form() {
        if (!this._form) { this.buildForm(); }
        return this._form;
    }
    set form(form) { this._form = form; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get maxlength() { return this.config.maxlength; }
    set maxlength(maxlength) { this.config.maxlength = maxlength; }

    get minlength() { return this.config.minlength; }
    set minlength(minlength) { this.config.minlength = minlength; }

    get placeholder() {
        if (this.config.placeholder) return this.config.placeholder;
        return this.calculatePlaceholder();
    }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

    get pwactual() { return this._pwactual; }
    set pwactual(pwactual) { this._pwactual = pwactual; }

    get pwcurr() { return this._pwcurr; }
    set pwcurr(pwcurr) { this._pwcurr = pwcurr; }

    get pwgen() { return this._pwgen; }
    set pwgen(pwgen) { this._pwgen = pwgen; }

    get pwone() { return this._pwone; }
    set pwone(pwone) { this._pwone = pwone; }

    get pwtwo() { return this._pwtwo; }
    set pwtwo(pwtwo) { this._pwtwo = pwtwo; }

    get pwcurrhelp() { return this.config.pwcurrhelp; }
    set pwcurrhelp(pwcurrhelp) { this.config.pwcurrhelp = pwcurrhelp; }

    get pwcurrlabel() { return this.config.pwcurrlabel; }
    set pwcurrlabel(pwcurrlabel) { this.config.pwcurrlabel = pwcurrlabel; }

    get pwcurrplaceholder() { return this.config.pwcurrplaceholder; }
    set pwcurrplaceholder(pwcurrplaceholder) { this.config.pwcurrplaceholder = pwcurrplaceholder; }

    get pwonelabel() { return this.config.pwonelabel; }
    set pwonelabel(pwonelabel) { this.config.pwonelabel = pwonelabel; }

    get pwtwolabel() { return this.config.pwtwolabel; }
    set pwtwolabel(pwtwolabel) { this.config.pwtwolabel = pwtwolabel; }

    get suggestedlength() { return this.config.suggestedlength; }
    set suggestedlength(suggestedlength) { this.config.suggestedlength = suggestedlength; }

    get value() { return this.pwactual.val(); }
    set value(value) { this.pwactual.val(value); }

}
window.PasswordChangeForm = PasswordChangeForm;
class PasswordGenerator {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            buttontext: TextFactory.get('generate_password'),
            buttonicon: 'refresh',
            length: 15, // how many characters to generate
            autofills: [], // input elements to auto fill.
            sets: ['lc', 'uc', 'num', 'punc']
        };
    }

    static get DATASETS () {
        return {
            lc: { id: 'lc', label: TextFactory.get('lowercase'), set: 'a-z', chars: 'abcdefghijklmnopqrstuvwxyz' },
            uc: { id: 'uc', label: TextFactory.get('uppercase'), set: 'A-Z', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            num: { id: 'num', label: TextFactory.get('numbers'), set: '0-9', chars: '0123456789' },
            punc: { id: 'punc', label: TextFactory.get('punctuation'), set: '#', chars: '![]{}()%&*$#^<>~@|' }
        };
    }

    /**
     * Get a dataset definition by id
     * @param id the id of the dataset
     * @return {*} the dataset definition, or null
     */
    static getDataSet(id) {
        return PasswordGenerator.DATASETS[id];
    }

    /**
     * Generates a random password string.  Takes an array of character objects to include
     * @param datasets an array of dataset identifiers (defaults to all)
     * @param length how long of a password to generate (default 15);
     * @returns {string}
     */
    static randomPassword (datasets = PasswordGenerator.DEFAULT_CONFIG.sets, length = 15) {

        let corpus = '';
        for (let ds of datasets) {
            if (PasswordGenerator.getDataSet(ds)) {
                corpus += PasswordGenerator.getDataSet(ds).chars;
            }
        }

        let pw = '';
        for (let i = 0; i < length; i++) {
            pw += corpus.charAt(Math.floor(Math.random() * corpus.length));
        }
        return pw;
    }

    constructor(config) {
        this.config = Object.assign({}, PasswordGenerator.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `pwgen-${CFBUtils.getUniqueKey(5)}`; }

        this.setactuals = [];
    }

    /* ACTION METHODS___________________________________________________________________ */

    /**
     * Does the actual password generation
     */
    generatePassword() {
        let sets = [];
        if ((!this.sets) || (this.sets.length === 0)){
            sets = PasswordGenerator.DEFAULT_CONFIG.sets;
        } else {
            for (let cb of this.setactuals) {
                if (cb.checked) {
                    sets.push(cb.value);
                }
            }
        }

        let genpw =  PasswordGenerator.randomPassword(sets, this.length);

        if ((this.autofills) && (this.autofills.length > 0)) {
            let theform;
            for (let af of this.autofills) {
                af.value = genpw;
                if (af.form) { theform = af.form; }
            }
            if (theform) {
                theform.validate();
            }
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the container for the generator
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('pwgenerator');

        this.datasetblock = document.createElement('ul');
        this.datasetblock.classList.add('datasets');
        this.datasetblock.setAttribute('aria-hidden', 'true');

        if (this.sets.length > 0) {
            for (let ds of this.sets) {
                if (ds in PasswordGenerator.DATASETS) {
                    let set = PasswordGenerator.getDataSet(ds);
                    let cb = new BooleanToggle({
                        name: `dset-${set.id}`,
                        id: `${this.id}-${set.id}`,
                        value: set.id,
                        label: set.label,
                        checked: true
                    });
                    this.setactuals.push(cb);
                    let li = document.createElement('li');
                    li.appendChild(cb.container);
                    this.datasetblock.appendChild(li);
                }
            }
        }

        this.button = new SimpleButton({
            text: this.buttontext,
            naked: true,
            action: (e) => {
                e.preventDefault();
                this.generatePassword();
            }
        });

        this.configbutton = new ButtonMenu({
            icon: 'gear',
            secondicon: null,
            shape: 'square',
            naked: true,
            stayopen: true,
            arialabel: TextFactory.get('configure_generator'),
            classes: ['config'],
            menu: this.datasetblock
        });

        let controls = document.createElement('div');
        controls.classList.add('controls');
        controls.appendChild(this.button.button);
        controls.appendChild(this.configbutton.button);

        this.container.appendChild(controls);
        this.container.appendChild(this.datasetblock);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autofills() { return this.config.autofills; }
    set autofills(autofills) { this.config.autofills = autofills; }

    get button() { return this._button; }
    set button(button) { this._button = button; }

    get configbutton() { return this._configbutton; }
    set configbutton(configbutton) { this._configbutton = configbutton; }

    get buttonicon() { return this.config.buttonicon; }
    set buttonicon(buttonicon) { this.config.buttonicon = buttonicon; }

    get buttontext() { return this.config.buttontext; }
    set buttontext(buttontext) { this.config.buttontext = buttontext; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get datasetblock() { return this._datasetblock; }
    set datasetblock(datasetblock) { this._datasetblock = datasetblock; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get length() { return this.config.length; }
    set length(length) { this.config.length = length; }

    get sets() { return this.config.sets; }
    set sets(sets) { this.config.sets = sets; }

    get setactuals() { return this._setactuals; }
    set setactuals(setactuals) { this._setactuals = setactuals; }

}
window.PasswordGenerator = PasswordGenerator;