"use strict";

class EmailField extends TextInput {

    /**
     * Tests whether or not a string is a valid email address.
     * @param email The email address to check
     * @returns {boolean} true or false, depending
     */
    static isValidEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    /**
     * Define the object
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, EmailField.DEFAULT_CONFIG, config);
        super(config);
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Calculate the placeholder
     * @return {string|*}
     */
    calculatePlaceholder() {
        if (this.placeholder) { return this.placeholder; }
        return 'person@myemailaccount.net';
    }

    /**
     * Runs local validation
     * @return {boolean}
     */
    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!EmailField.isValidEmail(this.value)) {
                this.errors.push("Invalid email address.");
            }
        }
    }

}

EmailField.DEFAULT_CONFIG = {
    type: 'text',
    forceconstraints: true
};
