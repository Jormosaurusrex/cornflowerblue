"use strict";

class PasswordInput extends TextInput {

    static SUGGESTED_MIN_LENGTH = 8;

    constructor(config) {
        config.type = ['password'];
        super(config);
    }

    /* STATE METHODS____________________________________________________________________ */

    /**
     * Runs local validation
     * @return {boolean}
     */
    localValidator() {
        if (this.value) {
            if (this.value.length < PasswordInput.SUGGESTED_MIN_LENGTH) {
                this.warnings.push("Password is less than the suggested length of " + PasswordInput.SUGGESTED_MIN_LENGTH);
            }
        }
    }
}
