"use strict";

class SimpleForm {
    static DEFAULT_CONFIG = {
        id : null, // Component id
        name: null, // Name attribute
        target: null, // Target attribute
        enctype: null, // Encapsulation type.
        autocomplete: 'off', // Autocomplete value
        urlaction: null, // Where to post this form to. If null, assumes to be an xhr action.
        method: 'get', // Method for the form.  Also used in API calls.
        header: null, // Stuff to put at the header. This is expected to be a jQuery element
        instructions: null, // Instructions configuration.  See InstructionBox.
        classes: [], // Extra css classes to apply,
        elements: [], // An array of form elements. These are the objects, not the rendered dom.
        actions: [], // An array of action elements. This are buttons or keywords.
        onsubmit: null, // action to execute on submit.
    };

    /**
     * Define a simple form
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleForm.DEFAULT_CONFIG, config);
        return this;
    }

    /* ACTION METHODS___________________________________________________________________ */

    /**
     * Submits the form.  Runs the validator first.
     * @param e the event object, passed to an onsubmit handler
     */
    submit(e) {
        if (this.validate()) {
            if ((this.onsubmit) && (typeof this.onsubmit === 'function')) {
                this.onsubmit(e);
            } else if (this.urlaction) {
                this.form[0].submit();
            } else {
                console.log(`No action or URL defined for form ${this.id} :: ${this.name}`);
            }
        }
    }

    /**
     * Validates the form. Runs all validators.
     * @return {boolean}
     */
    validate() {
        let valid = true;
        for (let element of this.elements) {
            let localValid = element.validate();
            if (!localValid) { valid = false;}
        }
        return valid;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the form object itself
     */
    buildForm() {
        const me = this;
        this.form = $('<form />')
            .attr('id', this.id)
            .attr('name', this.name)
            .attr('method', this.method)
            .attr('target', this.target)
            .attr('enctype', this.enctype)
            .attr('autocomplete', this.autocomplete)
            .attr('action', this.urlaction)
            .addClass('cornflowerblue')
            .on('submit', function(e) {
                e.preventDefault();
                me.submit();
            });
        this.buildHeaderBox();
        this.buildElementBox();
        this.buildActionBox();
    }

    /**
     * Build the header for the form.
     */
    buildHeaderBox() {
        if ((this.header) || (this.instructions)) {
            this.headerbox = $('<div />').addClass('header');
            if (this.header) { this.headerbox.append(this.header); }
            if (this.instructions) {
                this.headerbox.append(new InstructionBox(this.instructions).container );
            }
            this.form.append(this.headerbox);
        }
    }

    /**
     * Draw individual form elements
     */
    buildElementBox() {
        this.elementbox = $('<div />').addClass('elements');
        for (let element of this.elements) {
            this.elementbox.append(element.container);
        }
        this.form.append(this.elementbox);
    }

    /**
     * Draw the actions on the form, if any.
     */
    buildActionBox() {
        if ((this.actions) && (this.actions.length > 0)) {
            this.actionbox = $('<div />').addClass('actions');
            for (let action of this.actions) {
                this.actionbox.append(action.container);
            }
            this.form.append(this.actionbox);
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get actionbox() {
        if (!this._actionbox) { this.buildActionBox(); }
        return this._actionbox;
    }
    set actionbox(actionbox) { this._actionbox = actionbox; }

    get actions() { return this.config.actions; }
    set actions(actions) { this.config.actions = actions; }

    get autocomplete() { return this.config.autocomplete; }
    set autocomplete(autocomplete) { this.config.autocomplete = autocomplete; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() { return this.form; } // shorthand to form.
    set container(container) { this.form = container; }

    get elementbox() {
        if (!this._elementbox) { this.buildElementBox(); }
        return this._elementbox;
    }
    set elementbox(elementbox) { this._elementbox = elementbox; }

    get elements() { return this.config.elements; }
    set elements(elements) { this.config.elements = elements; }

    get enctype() { return this.config.enctype; }
    set enctype(enctype) { this.config.enctype = enctype; }

    get form() {
        if (!this._form) { this.buildForm(); }
        return this._form;
    }
    set form(form) { this._form = form; }

    get header() { return this.config.header; }
    set header(header) { this.config.header = header; }

    get headerbox() {
        if (!this._headerbox) { this.buildHeaderBox(); }
        return this._headerbox;
    }
    set headerbox(headerbox) { this._headerbox = headerbox; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get method() { return this.config.method; }
    set method(method) { this.config.method = method; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get onsubmit() { return this.config.onsubmit; }
    set onsubmit(onsubmit) {
        if (typeof onsubmit !== 'function') {
            console.log("Action provided for onsubmit is not a function!");
        }
        this.config.onsubmit = onsubmit;
    }

    get target() { return this.config.target; }
    set target(target) { this.config.target = target; }

    get urlaction() { return this.config.urlaction; }
    set urlaction(urlaction) { this.config.urlaction = urlaction; }


}