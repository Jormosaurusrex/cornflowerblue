"use strict";

class URIInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            forceconstraints: true
        };
    }

    /**
     * Check if the URI is encoded already
     * @param uri the URI to check
     * @returns {boolean}
     */
    static isEncoded(uri) {
        uri = uri || '';
        return uri !== decodeURIComponent(uri);
    }

    /**
     * Tests whether or not a string is a valid URI.
     * @param uri The uri to check
     * @returns {boolean} true or false, depending
     */
    static isValid(uri) {
        return new RegExp(/\w+:(\/?\/?)[^\s]+/).test(uri);
    }

    constructor(config) {
        config = Object.assign({}, URIInput.DEFAULT_CONFIG, config);

        if ((config.value) && (URIInput.isEncoded(config.value))) {
            config.value = decodeURIComponent(config.value); // sometimes the values aren't human readable
        }
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputmode() { return "url"; }

    /* CORE METHODS_____________________________________________________________________ */

    calculatePlaceholder() {
        return 'https://somewhere.cornflower.blue/';
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!URIInput.isValid(this.value)) {
                this.errors.push("This is an invalid web address.");
            }
        }
    }

}

