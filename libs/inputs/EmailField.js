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

    constructor(config) {
        super(config);
    }
    
    /* STATE METHODS____________________________________________________________________ */

    /**
     * Runs local validation
     * @return {boolean}
     */
    localValidator() {
        if ((this.value) && (!EmailField.isValidEmail(this.value))) {
            this.errors.push("Invalid email address.");
        }
    }

}