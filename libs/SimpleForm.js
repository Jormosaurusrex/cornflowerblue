"use strict";

class SimpleForm {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // Component id
            name: null, // Name attribute

            /*
                Only one of 'handler' or 'url'.  If both are present, 'handler' will take precedence.
                The 'handler' can be a function or url.  If a function, it will be passed self.
                If a URL, it will be the target of an internal fetch request
             */
            handler: null, // Where to submit this form. Can be URL or function.
                           // If a function, passed self, and assumes a callback function.
            url: null, // URL to submit the form to.
            target: null, // Target attribute.  Requires a URL.

            dialog: null, // A SimpleDialog window that this form may be included in.
            enctype: null, // Encapsulation type.
            autocomplete: 'off', // Autocomplete value
            method: 'get', // Method for the form.  Also used in API calls.
            header: null, // Stuff to put at the header. This is expected to be a jQuery element

            passive: false, // Start life in "passive" mode. This will set all form elements to "passive" and hide any controls.  This also shows the "passive" instructions, if any.

            instructions: null, // Instructions configuration.  See InstructionBox.
            passiveinstructions: null, // Passive Instructions array.  Shown when the form is set to passive.

            spinnerstyle: 'spin', //
            spinnertext: '...Please Wait...', //
            results: null, // Sometimes you want to pass a form the results from a different form, like with logging out.
            classes: [], // Extra css classes to apply,
            submittors: [], // Array of elements that can submit this form.
                            // SimpleButton objects that have submits=true inside of the actions[] array
                            // are automatically added to this.  Only put elements here that are _outside_
                            // of the form and need to be connected.
            elements: [], // An array of form elements. These are the objects, not the rendered dom.
            actions: [], // An array of action elements. This are buttons or keywords.
            passiveactions: [], // An array of action elements that appear only when the form is in passive mode. This are buttons or keywords.
            handlercallback: null, // If present, the response from the handler will be passed to this
                                // instead of the internal callback. Passed self and results
                                // The internal callback expects JSON with success: true|false, and arrays of strings
                                // for results, errors, and warnings
            onsuccess: null, // What to do if the handlercallback returns success (passed self and results)
            onfailure: null, // What to do if the handlercallback returns failure (passed self and results)
            onvalid: null, // What to do when the form becomes valid (passed self)
            oninvalid: null, // What to do when the form becomes invalid (passed self),
            validator: null // validator function, passed self
        };
    }

    /**
     * Define a simple form
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleForm.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `form-${Utils.getUniqueKey(5)}`; }
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Switch to 'passive' mode.
     */
    pacify() {
        this.form.classList.add('passive');
        this.passive = true;
        for (let e of this.elements) {
            e.pacify();
        }
        if ((this.passiveinstructions) && (this.instructionbox)) {
            this.instructionbox.setInstructions(this.passiveinstructions.instructions);
        }
    }

    /**
     * Switch from 'passive' mode to 'active' mode.
     */
    activate() {
        this.form.classList.remove('passive');
        this.passive = false;
        for (let e of this.elements) {
            e.activate();
        }
        if ((this.instructions) && (this.instructionbox)) {
            this.instructionbox.setInstructions(this.instructions.instructions);
        }

    }

    /**
     * Toggle between active states
     */
    toggleActivation() {
        if (this.form.hasClass('passive')) {
            this.activate();
            return;
        }
        this.pacify();
    }

    /* ACTION METHODS___________________________________________________________________ */

    /**
     * Submits the form.  Runs the validator first.
     * @param e the event object, passed to handler
     */
    submit(e) {
        const me = this;

        if (this.passive) { return; }

        if (this.validate()) {
            if (this.handler) {
                this.form.classList.add('shaded');

                if (typeof this.handler === 'function') {
                    this.handler(me, function(results) {
                        if ((me.handlercallback) && (typeof me.handlercallback === 'function')) {
                            me.handlercallback(me, results);
                            me.container.classList.remove('shaded');
                        } else {
                            me.handleResults(results);
                        }
                    });
                } else { // its an API url
                    this.doAjax(function(results) {
                        if ((me.handlercallback) && (typeof me.handlercallback === 'function')) {
                            me.handlercallback(me, results);
                            me.container.classList.remove('shaded');
                        } else {
                            me.handleResults(results);
                        }
                    });
                }

            } else if (this.url) {
                this.form.submit();
            } else {
                console.log(`No handler defined for form ${this.id} :: ${this.name}`);
            }
        }
    }

    /**
     * Execute an ajax call
     * @param callback the callback to fire when done
     */
    doAjax(callback) {
        // XXX TODO POST AS JSON
        //let body = new FormData(this.form[0]);
        //application/x-www-form-urlencoded
        //multipart/form-data

        const body = new URLSearchParams(new FormData(this.form)).toString();

        fetch(this.handler, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: this.method,
            body: body
        })
            .then(response => response.json()) // response -> json
            .then(data => { // do the thing.
                if ((callback) && (typeof callback === 'function')) {
                    callback(data);
                }
            })
            .catch(err => {
                console.error(`Error while executing ajax call.`);
                console.error(err);
            });
    }

    /**
     * This is the default form results handler
     * @param results the results object to be managed
     * @param noexecution Don't execute onsuccess or onfailure.
     */
    handleResults(results, noexecution) {
        if (this.messagebox) { this.messagebox.remove(); }
        this.messagebox = new MessageBox(results).container;
        this.headerbox.append(this.messagebox);
        this.container.classList.remove('shaded');

        if (!noexecution) {
            if ((results.success) && ((this.onsuccess) && (typeof this.onsuccess === 'function'))) {
                this.onsuccess(this, results);
            } else if ((this.onfailure) && (typeof this.onfailure === 'function')) {
                this.onfailure(this, results);
            }
        }
    }

    /* VALIDATION METHODS_______________________________________________________________ */

    /**
     * Validates the form. Runs all validators on registered elements.
     * @return {boolean}
     */
    validate() {
        let valid = true;

        for (let element of this.elements) {
            if (element.touched) {
                let localValid = element.validate();
                if (!localValid) { valid = false; }
            } else if ((element.required) && (element.value === '')) {
                valid = false; // empty required fields
            }
        }

        if ((valid) && ((this.validator) && (typeof this.validator === 'function'))) {
            valid = this.validator(this);
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
     * It will enable all elements in this.submittors().
     * It then executes any supplied onvalid function, passing self.
     */
    runValid() {
        for (let submittor of this.submittors) {
            submittor.enable();
        }
        if ((this.onvalid) && (typeof this.onvalid === 'function')) {
            this.onvalid(this);
        }
    }

    /**
     * This runs when the all elements in the form are valid.
     * It will enable all elements in this.submittors().
     * It then executes any supplied onvalid function, passing self.
     */
    runInvalid() {
        for (let submittor of this.submittors) {
            submittor.disable();
        }
        if ((this.oninvalid) && (typeof this.oninvalid === 'function')) {
            this.oninvalid(this);
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the form object itself
     */
    buildForm() {
        const me = this;
        this.form = document.createElement('form');
        this.form.setAttribute('id', this.id);
        this.form.setAttribute('novalidate', true); // turn off browser validation 'cause we do it by hand
        this.form.setAttribute('name', this.name);
        this.form.setAttribute('method', this.method);
        this.form.setAttribute('enctype', this.enctype);
        this.form.setAttribute('role', 'form');
        this.form.setAttribute('autocomplete', this.autocomplete);
        this.form.classList.add('cornflowerblue');
        for (let c of this.classes) {
            this.form.classList.add(c);
        }
        this.form.addEventListener('submit', function(e) {
            e.preventDefault();
            me.submit();
        });

        if ((this.handler) && (typeof this.handler !== 'function')) {
            this.form.setAttribute('target', this.target);
        }

        this.contentbox.appendChild(this.headerbox);
        this.contentbox.appendChild(this.elementbox);

        this.form.appendChild(this.shade);
        this.form.appendChild(this.contentbox);
        if (this.actions.length > 0) { this.form.appendChild(this.actionbox); }
        if (this.passiveactions.length > 0) { this.form.appendChild(this.passiveactionbox) };

        this.validate();

        if (this.passive) {
            this.pacify();
        }

    }

    /**
     * Build the header for the form.
     */
    buildHeaderBox() {
        this.headerbox = document.createElement('div');
        this.headerbox.classList.add('header');
        if ((this.header) || ((this.instructions) && (this.instructions.instructions) && (this.instructions.instructions.length > 0))) {
            if (this.header) { this.headerbox.appendChild(this.header); }
            if (this.instructions) {
                this.headerbox.appendChild(this.instructionbox.container);
            }
        }
        if (this.results) {
            this.handleResults(this.results, true);
        }
    }

    /**
     * Build the instruction box for the form.
     */
    buildInstructionBox() {
        if ((!this.instructions) || (this.instructions.length === 0)) {
            return;
        }
        let ins = this.instructions;
        if ((this.passive) && (this.passiveinstructions) && (this.passiveinstructions.length > 0)) {
            ins = this.passiveinstructions;
        }
        this.instructionbox = new InstructionBox(ins);
    }

    /**
     * Draw the Form's shade
     */
    buildShade() {
        this.shade = document.createElement('div');
        this.shade.classList.add('shade');

        if (this.spinnerstyle) {
            let d = document.createElement('div');
            d.classList.add('spinner');
            d.classList.add(this.spinnerstyle);
            this.shade.append(d);
        }

        if (this.spinnertext) {
            let d = document.createElement('div');
            d.classList.add('spinnertext');
            d.classList.innerHTML = this.spinnertext;
            this.shade.append(d);
        }
    }

    /**
     * Draw individual form elements
     */
    buildElementBox() {
        this.elementbox = document.createElement('div');
        this.elementbox.classList.add('elements');
        for (let element of this.elements) {
            element.form = this;
            if (element.type === 'file') {
                this.form.setAttribute('enctype', 'multipart/form-data');
            }
            if ((!element.id) && (element.name)) {
                element.id = `${this.id}-${element.name}`;
            } else if (!element.id) {
                element.id = `${this.id}-e-${Utils.getUniqueKey(5)}`;
            }
            this.addElement(element);
            this.elementbox.appendChild(element.container);
        }
    }

    /**
     * Draw the content box
     */
    buildContentBox() {
        this.contentbox = document.createElement('div');
        this.contentbox.classList.add('contentbox');
    }

    /**
     * Draw the actions on the form, if any.
     */
    buildActionBox() {
        if ((this.actions) && (this.actions.length > 0)) {
            this.actionbox = document.createElement('div');
            this.actionbox.classList.add('actions');
            for (let action of this.actions) {
                if ((action.cansubmit) && (action.submits)) {
                    this.submittors.push(action);
                }
                action.form = this;
                this.actionbox.appendChild(action.container);
            }
        }
    }

    /**
     * Draw the passive actions on the form, if any.
     */
    buildPassiveActionBox() {
        if ((this.passiveactions) && (this.passiveactions.length > 0)) {
            this.passiveactionbox = document.createElement('div');
            this.passiveactionbox.classList.add('passiveactions');
            for (let action of this.passiveactions) {
                if ((action.cansubmit) && (action.submits)) {
                    this.submittors.push(action);
                }
                action.form = this;
                this.passiveactionbox.appendChild(action.container);
            }
        }
    }


    /* ELEMENT MAP METHODS______________________________________________________________ */

    getElement(element) {
        return this.elementmap[element];
    }

    addElement(element) {
        this.elementmap[element.id] = element;
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

    get dialog() { return this.config.dialog; }
    set dialog(dialog) { this.config.dialog = dialog; }

    get elementbox() {
        if (!this._elementbox) { this.buildElementBox(); }
        return this._elementbox;
    }
    set elementbox(elementbox) { this._elementbox = elementbox; }

    get elementmap() {
        if (!this._elementmap) { this._elementmap = {}; }
        return this._elementmap;
    }
    set elementmap(elementmap) { this._elementmap = elementmap; }

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

    get handlercallback() { return this.config.handlercallback; }
    set handlercallback(handlercallback) {
        if (typeof handlercallback !== 'function') {
            console.error("Action provided for handlercallback is not a function!");
        }
        this.config.handlercallback = handlercallback;
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

    get passive() { return this.config.passive; }
    set passive(passive) { this.config.passive = passive; }

    get passiveactionbox() {
        if (!this._passiveactionbox) { this.buildPassiveActionBox(); }
        return this._passiveactionbox;
    }
    set passiveactionbox(passiveactionbox) { this._passiveactionbox = passiveactionbox; }

    get passiveactions() { return this.config.passiveactions; }
    set passiveactions(passiveactions) { this.config.passiveactions = passiveactions; }

    get passiveinstructions() { return this.config.passiveinstructions; }
    set passiveinstructions(passiveinstructions) { this.config.passiveinstructions = passiveinstructions; }

    get instructionbox() {
        if (!this._instructionbox) { this.buildInstructionBox(); }
        return this._instructionbox;
    }
    set instructionbox(instructionbox) { this._instructionbox = instructionbox; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get messagebox() { return this._messagebox; }
    set messagebox(messagebox) { this._messagebox = messagebox; }

    get method() { return this.config.method; }
    set method(method) { this.config.method = method; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get onfailure() { return this.config.onfailure; }
    set onfailure(onfailure) {
        if (typeof onfailure !== 'function') {
            console.error("Action provided for onfailure is not a function!");
        }
        this.config.onfailure = onfailure;
    }

    get onsuccess() { return this.config.onsuccess; }
    set onsuccess(onsuccess) {
        if (typeof onsuccess !== 'function') {
            console.error("Action provided for onsuccess is not a function!");
        }
        this.config.onsuccess = onsuccess;
    }

    get oninvalid() { return this.config.oninvalid; }
    set oninvalid(oninvalid) {
        if (typeof oninvalid !== 'function') {
            console.error("Action provided for oninvalid is not a function!");
        }
        this.config.oninvalid = oninvalid;
    }

    get onvalid() { return this.config.onvalid; }
    set onvalid(onvalid) {
        if (typeof onvalid !== 'function') {
            console.error("Action provided for onvalid is not a function!");
        }
        this.config.onvalid = onvalid;
    }

    get results() { return this.config.results; }
    set results(results) { this.config.results = results; }

    get shade() {
        if (!this._shade) { this.buildShade(); }
        return this._shade;
    }
    set shade(shade) { this._shade = shade; }

    get spinnerstyle() { return this.config.spinnerstyle; }
    set spinnerstyle(spinnerstyle) { this.config.spinnerstyle = spinnerstyle; }

    get spinnertext() { return this.config.spinnertext; }
    set spinnertext(spinnertext) { this.config.spinnertext = spinnertext; }

    get submittors() { return this.config.submittors; }
    set submittors(submittors) { this.config.submittors = submittors; }

    get target() { return this.config.target; }
    set target(target) { this.config.target = target; }

    get url() { return this.config.url; }
    set url(url) { this.config.url = url; }

    get validator() { return this.config.validator; }
    set validator(validator) {
        if (typeof validator !== 'function') {
            console.error("Action provided for validator is not a function!");
        }
        this.config.validator = validator;
    }


}
