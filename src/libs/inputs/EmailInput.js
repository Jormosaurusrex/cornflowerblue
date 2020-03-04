class EmailInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            forceconstraints: true,
            pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
        };
    }

    /**
     * Tests whether or not a string is a valid email address.
     * @param email The email address to check
     * @returns {boolean} true or false, depending
     */
    static isValid(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    constructor(config) {
        config = Object.assign({}, EmailInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputmode() { return "email"; }

    /* CORE METHODS_____________________________________________________________________ */

    calculatePlaceholder() {
        return TextFactory.get('emailinput-placeholder-default');
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!EmailInput.isValid(this.value)) {
                this.errors.push(TextFactory.get('emailinput-error-invalid_web_address'));
            }
        }
    }

}

