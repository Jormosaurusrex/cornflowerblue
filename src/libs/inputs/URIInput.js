class URIInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            forceconstraints: true
        };
    }
    static get DEFAULT_CONFIG_DOCUMENTATION() {
        return {
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, enforce that the value is a valid web address address." }
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
        if (!config) { config = {}; }
        config = Object.assign({}, URIInput.DEFAULT_CONFIG, config);
        if ((config.value) && (URIInput.isEncoded(config.value))) {
            config.value = decodeURIComponent(config.value); // sometimes the values aren't human readable
        }
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputmode() { return "text"; }

    /* CORE METHODS_____________________________________________________________________ */

    calculatePlaceholder() {
        return TextFactory.get('urlinput-placeholder-default');
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!URIInput.isValid(this.value)) {
                this.errors.push(TextFactory.get('urlinput-error-invalid_web_address'));
            }
        }
    }

}
window.URIInput = URIInput;