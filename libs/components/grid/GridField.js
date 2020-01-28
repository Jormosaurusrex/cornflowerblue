class GridField {

    static get DEFAULT_CONFIG() {
        return {
            id: null, //the id
            name: null,
            hidden: false, // Set to true to hide on load
            type: 'text', // A string:  text, number, array, icon
            renderer: null, // a function(value, item, cell) {}
            classes: [] // Extra css classes to apply on itself
        };
    }

    /**
     * Define a GridField
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, GridField.DEFAULT_CONFIG, config);
        return this;
    }

    /* CORE METHODS_____________________________________________________________________ */


    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the header for the .
     * @returns {jQuery} jQuery representation
     */
    buildHeader() {

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get header() {
        if (!this._header) { this.buildHeader(); }
        return this._header;
    }
    set header(header) { this._header = header; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

}
