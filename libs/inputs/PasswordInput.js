"use strict";

class PasswordInput extends TextInput {

    static DEFAULT_CONFIG = {
        minlength: 5,
        suggestedlength: 8,
        maxlength: 30,
        forceconstraints: true,
        type: 'password'
    };

    /**
     * Define the object
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, PasswordInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Calculate the placeholder
     * @return {string|*}
     */
    calculatePlaceholder() {
        if (this.placeholder) { return this.placeholder; }
        if (this.forceconstraints) {
            return `Must be at least ${this.minlength} characters.`;
        } else if (this.suggestedlength) {
            return `Should be at least ${this.suggestedlength} characters.`;
        }
    }
    
    /**
     * Runs local validation
     * @return {boolean}
     */
    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (this.value.length < this.minlength) {
                this.errors.push(`Password must be at least ${this.minlength} characters.`);
            } else if (this.value.length < this.suggestedlength) {
                this.warnings.push(`Password is less than the suggested length of ${this.suggestedlength} characters.`);
            } else if (this.value.length > this.maxlength) {
                this.errors.push(`Password must be less than ${this.maxlength} characters.`);
            }
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */
    
    get minlength() { return this.config.minlength; }
    set minlength(minlength) { this.config.minlength = minlength; }

    get suggestedlength() { return this.config.suggestedlength; }
    set suggestedlength(suggestedlength) { this.config.suggestedlength = suggestedlength; }

}
