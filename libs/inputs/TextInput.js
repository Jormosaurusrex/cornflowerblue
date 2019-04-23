"use strict";

class TextInput {

    static DEFAULT_CONFIG = {
        id : null, // Component id
        name: null, // Name attribute
        counter: null, // A value for a character counter. Null means 'no counter'
                    // Possible values: null, 'remaining', 'limit', and 'sky'
        type: 'text', // Type of input, defaults to "text"
        label : null, // Input label. If null, does not show up.
        placeholder: null, // Input placeholder. If null, does not appear
        title: null,
        required: false, // Is this a required field or not
        hidden: false, // Whether or not to be hidden
        autocomplete: 'off', // Enable browser autocomplete. Default is off.
        arialabel: null, // The aria-label value. If null, follows: label > title > null
        maxlength: null, // Value for maxlength.
        value: null, // Value to use (pre-population).  Used during construction and then discarded.
        disabled: false, // If true, disable the field.
        classes: [], // Extra css classes to apply
        onreturn: $.noop, // action to execute on hitting the return key. Passed (event, self).
        ontab: $.noop, // action to execute on hitting the tab key. Passed (event, self).
        keyup: $.noop, // action to execute on key up. Passed (event, self).
        focusin: $.noop, // action to execute on focus in. Passed (event, self).
        focusout: $.noop, // action to execute on focus out. Passed (event, self).
        validator: null // A function to run to test validity. Passed the self.

    };

    /**
     * Define a the input
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, TextInput.DEFAULT_CONFIG, config);

        if (!this.arialabel) { // munch aria label.
            if (this.label) {
                this.arialabel = this.label;
            } else if (this.title) {
                this.arialabel = this.title;
            }
        }

        if (!this.id) { // need to generate an id for label stuff
            this.id = "input-" + Utils.getUniqueKey();
        }

        if (this.config.value) { // store the supplied value if any
            this.origval = this.config.value;
        }

    }

    /* STATE METHODS____________________________________________________________________ */

    /**
     * Runs validation.  Shows errors, if any. Returns true or false, depending.
     * @return {boolean}
     */
    validate() {
        this.errors = [];
        this.warnings = [];
        if ((this.required) && ((!this.value) || (this.value.length === 0))) {
            this.errors.push('This field is required.');
        }
        if ((this.localValidator) && (typeof this.localValidator === 'function')) {
            this.localValidator();
        }
        if ((this.validator) && (typeof this.validator === 'function')) {
            this.validator(this);
        }
        if ((this.errors.length > 0) || (this.warnings.length > 0)) {
            this.showMessages();
        } else {
            this.clearMessages();
        }
        return (this.errors.length < 1);
    }

    showMessages() {
        this.messagebox.empty();
        for (let error of this.errors) {
            this.addError(error);
        }
        for (let warning of this.warnings) {
            this.addWarning(warning);
        }
        this.messagebox.addClass('shown');
    }

    clearMessages() {
        this.errors = [];
        this.warnings = [];
        this.messagebox.empty();
        this.messagebox.removeClass('shown');
    }

    addError(error) {
        this.messagebox.append($('<li />').addClass('error').html(error));
    }

    addWarning(warning) {
        this.messagebox.append($('<li />').addClass('warning').html(warning));
    }

    /**
     * Has the field been changed or not?
     * @return {boolean} true or false, depending.
     */
    isDirty() {
        return (this.origval !== this.value);
    }

    /**
     * Updates the counter
     */
    updateCounter() {
        if (!this.counter) { return; }
        if ((this.counter === 'limit') || (this.counter === 'sky')) {
            this.countchars.html(this.value.length);
        } else {
            this.countchars.html(this.maxlength - this.value.length);
        }
        if ((this.maxlength) && (this.value.length >= this.maxlength)) {
            this.charactercounter.addClass('outofbounds');
        } else if ((this.counter !== 'sky')
            && (this.value.length >= (this.maxlength * .90))) {
            this.charactercounter.removeClass('outofbounds');
            this.charactercounter.addClass('danger');
        } else {
            this.charactercounter.removeClass('danger');
            this.charactercounter.removeClass('outofbounds');
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds and returns a container object for all parts.
     * This gets over-ridden in elements that have additional structures, like a character counter
     * @returns {jQuery} jQuery representation of the label and the input together.
     */
    buildContainer() {
        this.container = $('<div />')
            .addClass('input-container')
            .append(this.labelobj)
            .append(this.input)
            .append(this.charactercounter)
            .append(this.messagebox);

        if (this.required) { this.container.addClass('required'); }
        if (this.mute) { this.container.addClass('mute'); }
    }

    /**
     * Builds the input's DOM.
     * @returns {jQuery} jQuery representation of the input
     */
    buildInput() {
        const me = this;
        this.input = $('<input />')
            .data('self', this)
            .attr('type', this.type)
            .attr('id', this.id)
            .attr('name', this.name)
            .attr('title', this.title)
            .attr('autocomplete', this.autocomplete)
            .attr('placeholder', this.placeholder)
            .attr('aria-label', this.arialabel)
            .attr('maxlength', this.maxlength)
            .attr('hidden', this.hidden)
            .attr('disabled', this.disabled)
            .addClass(this.classes.join(' '))
            .on('keyup', function() {
                me.updateCounter();
            })
            .on('keyup', function(e) {
                if ((me.value) && (me.value.length > 0) && (me.container)) {
                    me.container.addClass('filled');
                } else {
                    me.container.removeClass('filled');
                }

                if (me.isDirty()) {
                    if (me.container) { me.container.addClass('dirty'); }
                    me.input.addClass('dirty');
                } else {
                    if (me.container) { me.container.removeClass('dirty'); }
                    me.input.removeClass('dirty');
                }
                if ((e.keyCode === 13) // Return key
                    && (me.onreturn) && (typeof me.onreturn === 'function')) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.onreturn(e, me);
                } else if (e.keyCode === 9) { // Tab key
                    e.preventDefault();
                    e.stopPropagation();
                    if ((me.ontab) && (typeof me.ontab === 'function')) {
                        me.ontab(e, me);
                    }
                } else if ((me.keyup) && (typeof me.keyup === 'function')) {
                    me.keyup(e, me);
                }
            })
            .focusin(function(e) {
                if ((me.mute) && (me.placeholder)) {
                    $(this).attr('placeholder', me.placeholder);
                }
                if (me.container) {
                    me.container.addClass('active');
                }
                if ((me.focusin) && (typeof me.focusin === 'function')) {
                    me.focusin(e, me);
                }
            })
            .focusout(function(e) {
                if ((me.mute) && (me.label)) {
                    $(this).attr('placeholder', me.label);
                }
                if (me.container) {
                    me.container.removeClass('active');
                }
                if ((me.focusout) && (typeof me.focusout === 'function')) {
                    me.focusout(e, me);
                }
            })
            .val(this.config.value);
        if (this.mute) {
            this.input.addClass('mute');
            if (this.label) { this.input.attr('placeholder', this.label); }
        }
    }

    /**
     * Builds the input's DOM.
     * @returns {jQuery} jQuery representation of the input
     */
    buildLabel() {
        if (!this.label) { return null; }
        this.labelobj = $('<label />')
            .attr('for', this.id)
            .html(this.label)
            .click(function() {
                $('#' + $(this).attr('for')).focus();
            });
    }

    /**
     * Build the error box.
     */
    buildmessagebox() {
        this.messagebox = $('<ul />').addClass('messagebox');
    }

    /**
     * Draws a text counter in the field
     */
    buildCharacterCounter() {
        const me = this;
        if (this.counter) {
            this.countchars = $('<span />');
            this.charactercounter = $('<div />')
                .addClass('charcounter')
                .addClass(this.counter);
            if ((!this.maxlength) || (this.maxlength <= 0)) { this.counter = 'sky'; }
            if (this.counter === 'limit') {
                this.charactercounter.append(this.countchars).append($('<span />').html(" of " + this.maxlength + " characters entered."));
            } else if (this.counter === 'sky') {
                this.charactercounter.append(this.countchars).append($('<span />').html(" characters entered."));
            } else { // remaining
                this.charactercounter.append(this.countchars).append($('<span />').html(" characters remaining."));
            }
            me.updateCounter();
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get autocomplete() { return this.config.autocomplete; }
    set autocomplete(autocomplete) { this.config.autocomplete = autocomplete; }

    get input() {
        if (!this._input) { this.buildInput(); }
        return this._input;
    }
    set input(input) { this._input = input; }

    get charactercounter() {
        if (!this._charactercounter) { this.buildCharacterCounter(); }
        return this._charactercounter;
    }
    set charactercounter(charactercounter) { this._charactercounter = charactercounter; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get countchars() { return this._countchars; }
    set countchars(countchars) { this._countchars = countchars; }

    get counter() { return this.config.counter; }
    set counter(counter) { this.config.counter = counter; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get messagebox() {
        if (!this._messagebox) { this.buildmessagebox(); }
        return this._messagebox;
    }
    set messagebox(messagebox) { this._messagebox = messagebox; }

    get errors() { return this._errors; }
    set errors(errors) { this._errors = errors; }

    get focusin() { return this.config.focusin; }
    set focusin(focusin) {
        if (typeof focusin !== 'function') {
            console.log("Action provided for focusin is not a function!");
        }
        this.config.focusin = focusin;
    }

    get focusout() { return this.config.focusout; }
    set focusout(focusout) {
        if (typeof focusout !== 'function') {
            console.log("Action provided for focusout is not a function!");
        }
        this.config.focusout = focusout;
    }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get label() { return this.config.label; }
    set label(label) { this.config.label = label; }

    get labelobj() {
        if (!this._labelobj) { this.buildLabel(); }
        return this._labelobj;
    }
    set labelobj(labelobj) { this._labelobj = labelobj; }

    get maxlength() { return this.config.maxlength; }
    set maxlength(maxlength) { this.config.maxlength = maxlength; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get onreturn() { return this.config.onreturn; }
    set onreturn(onreturn) {
        if (typeof onreturn !== 'function') {
            console.log("Action provided for onreturn is not a function!");
        }
        this.config.onreturn = onreturn;
    }

    get ontab() { return this.config.ontab; }
    set ontab(ontab) {
        if (typeof ontab !== 'function') {
            console.log("Action provided for ontab is not a function!");
        }
        this.config.ontab = ontab;
    }

    get origval() { return this.config.origval; }
    set origval(origval) { this.config.origval = origval; }

    get placeholder() { return this.config.placeholder; }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

    get required() { return this.config.required; }
    set required(required) { this.config.required = required; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get type() { return this.config.type; }
    set type(type) { this.config.type = type; }

    get validator() { return this.config.validator; }
    set validator(validator) { this.config.validator = validator; }

    get value() { return this.input.val(); }
    set value(value) {
        this.config.value = value;
        this.input.val(value);
    }

    get warnings() { return this._warnings; }
    set warnings(warnings) { this._warnings = warnings; }


}