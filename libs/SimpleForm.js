"use strict";

class SimpleForm {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // Component id
            name: null, // Name attribute
            target: null, // Target attribute
            enctype: null, // Encapsulation type.
            autocomplete: 'off', // Autocomplete value
            method: 'get', // Method for the form.  Also used in API calls.
            header: null, // Stuff to put at the header. This is expected to be a jQuery element
            instructions: null, // Instructions configuration.  See InstructionBox.
            spinnericon: 'circle-dashed', //
            spinnertext: '...Please Wait...', //
            classes: [], // Extra css classes to apply,
            submittors: [], // Array of elements that can submit this form.
                            // SimpleButton objects that have submits=true inside of the actions[] array
                            // are automatically added to this.  Only put elements here that are _outside_
                            // of the form and need to be connected.
            elements: [], // An array of form elements. These are the objects, not the rendered dom.
            actions: [], // An array of action elements. This are buttons or keywords.
            handler: null, // Where to submit this form. Can be URL or function.  If a function, passed self.
            onvalid: null, // What do do when the form becomes valid (passed self)
            oninvalid: null // What do do when the form becomes invalid (passed self)
        };
    }

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
     * @param e the event object, passed to handler
     */
    submit(e) {
        if (this.validate()) {
            if ((this.handler) && (typeof this.handler === 'function')) {
                this.handler(this);
            } else if ((this.handler) && (typeof this.handler === 'string')) {
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
        if (valid) {
            this.runValid();
        } else {
            this.runInvalid();
        }

        return valid;
    }

    /**
     * This runs when the all elements in the form are valid.
     * It will enable and heat all elements in this.submittors().
     * It then executes any supplied onvalid function, passing self.
     */
    runValid() {
        for (let submittor of this.submittors) {
            submittor.heat();
            submittor.enable();
        }
        if ((this.onvalid) && (typeof this.onvalid === 'function')) {
            this.onvalid(this);
        }
    }

    /**
     * This runs when the all elements in the form are valid.
     * It will enable and heat all elements in this.submittors().
     * It then executes any supplied onvalid function, passing self.
     */
    runInvalid() {
        for (let submittor of this.submittors) {
            submittor.cool();
            submittor.disable();
        }
        if ((this.oninvalid) && (typeof this.oninvalid === 'function')) {
            this.oninvalid(this);
        }
    }

    handleResults(results) {
        if (this.messagebox) { this.messagebox.remove(); }
        this.messagebox = new MessageBox(results).container;
        this.container.prepend(this.messagebox);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the form object itself
     */
    buildForm() {
        const me = this;
        this.form = $('<form />')
            .attr('id', this.id)
            .attr('novalidate', true) // turn off browser validation 'cause we do it by hand
            .attr('name', this.name)
            .attr('method', this.method)
            .attr('enctype', this.enctype)
            .attr('role', 'form')
            .attr('autocomplete', this.autocomplete)
            .attr('action', this.urlaction)
            .addClass('cornflowerblue')
            .addClass(this.classes.join(' '))
            .on('submit', function(e) {
                e.preventDefault();
                me.submit();
            });

        if ((this.handler) && (typeof this.handler !== 'function')) {
            this.form.attr('target', this.target);
        }

        this.buildHeaderBox();
        this.buildElementBox();
        this.buildActionBox();

        this.contentbox.append(this.headerbox).append(this.elementbox);
        this.form.append(this.shade).append(this.contentbox).append(this.actionbox);
    }

    /**
     * Build the header for the form.
     */
    buildHeaderBox() {
        if ((this.header) || (this.instructions)) {
            this.headerbox = $('<div />').addClass('header');
            if (this.header) { this.headerbox.append(this.header); }

            this.messagebox = $('<div />').addClass('messagebox');
            this.headerbox.append(this.messagebox);

            if (this.instructions) {
                this.headerbox.append(new InstructionBox(this.instructions).container);
            }
        }
    }

    buildShade() {
        this.shade = $('<div />').addClass('shade');

        if (this.spinnericon) {
            this.shade.append(IconFactory.makeIcon(this.spinnericon));
        }

        if (this.spinnertext) {
            this.shade.append($('<div />').addClass('spinnertext').html(this.spinnertext));
        }

    }

    get spinnericon() { return this.config.spinnericon; }
    set spinnericon(spinnericon) { this.config.spinnericon = spinnericon; }

    get spinnertext() { return this.config.spinnertext; }
    set spinnertext(spinnertext) { this.config.spinnertext = spinnertext; }

    /**
     * Draw individual form elements
     */
    buildElementBox() {
        this.elementbox = $('<div />').addClass('elements');
        for (let element of this.elements) {
            element.form = this;
            this.elementbox.append(element.container);
        }

    }

    /**
     * Draw the content box
     */
    buildContentBox() {
        this.contentbox = $('<div />').addClass('contentbox');
    }

    /**
     * Draw the actions on the form, if any.
     */
    buildActionBox() {
        if ((this.actions) && (this.actions.length > 0)) {
            this.actionbox = $('<div />').addClass('actions');
            for (let action of this.actions) {
                if ((action.cansubmit) && (action.submits)) {
                    //if ((SimpleButton.prototype.isPrototypeOf(action)) && (action.submits)) {
                    this.submittors.push(action);
                }
                this.actionbox.append(action.container);
            }
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

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

    get contentbox() {
        if (!this._contentbox) { this.buildContentBox(); }
        return this._contentbox;
    }
    set contentbox(contentbox) { this._contentbox = contentbox; }

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

    get handler() { return this.config.handler; }
    set handler(handler) {
        if (typeof handler !== 'function') {
            console.error("Action provided for handler is not a function!");
        }
        this.config.handler = handler;
    }

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

    get messagebox() { return this._messagebox; }
    set messagebox(messagebox) { this._messagebox = messagebox; }

    get method() { return this.config.method; }
    set method(method) { this.config.method = method; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get onvalid() { return this.config.onvalid; }
    set onvalid(onvalid) {
        if (typeof onvalid !== 'function') {
            console.error("Action provided for onvalid is not a function!");
        }
        this.config.onvalid = onvalid;
    }

    get oninvalid() { return this.config.oninvalid; }
    set oninvalid(oninvalid) {
        if (typeof oninvalid !== 'function') {
            console.error("Action provided for oninvalid is not a function!");
        }
        this.config.oninvalid = oninvalid;
    }

    get shade() {
        if (!this._shade) { this.buildShade(); }
        return this._shade;
    }
    set shade(shade) { this._shade = shade; }


    get submittors() { return this.config.submittors; }
    set submittors(submittors) { this.config.submittors = submittors; }


    get target() { return this.config.target; }
    set target(target) { this.config.target = target; }

}
