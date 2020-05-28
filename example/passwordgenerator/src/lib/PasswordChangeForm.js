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

    runChecks(self) {
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
        const me = this;

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
            validator: function(self) {
                return me.runChecks(self);
            },
            handler: function(self, callback) {
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