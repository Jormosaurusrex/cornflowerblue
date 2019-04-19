"use strict";

class TextInput {
    static DEFAULT_CONFIG = {
        id : null, // Component id
        name: null,
        type: 'text', // Type of input, defaults to "text"
        label : null, // Input label. If null, does not show up.
        placeholder: null, // Input placeholder. If null, does not appear
        title: null,
        hidden: false, // Whether or not to be hidden
        autocomplete: 'off', // Enable browser autocomplete. Default is off.
        arialabel: null, // The aria-label value. If null, follows: label > title > null
        maxlength: null, // maxlength value
        value: null, // value to use (pre-population).  Used during construction and then discarded.
        disabled: false, // if true, disable the field.
        classes: [], //Extra css classes to apply
        action: $.noop // The click handler. passed (event, self) as arguments.
    };


    /**
     * Define a the input
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, TextInput.DEFAULT_CONFIG, config);

        if (!this.arialabel) {
            if (this.label) {
                this.arialabel = this.label;
            } else if (this.title) {
                this.arialabel = this.title;
            }
        }
        if (!this.id) { // need to generate an id for label stuff
            this.id = "input-" + Utils.getUniqueKey();
        }

    }

    buildContainer() {
        this.container = $('<div />')
            .addClass('input-container')
            .append(this.labelobj)
            .append(this.input);
    }

    /**
     * Builds the input's DOM.
     * @returns {jQuery} jQuery representation of the input
     */
    buildInput() {
        this.input = $('<input />')
            .data('self', this) // attach ourselves to the element
            .attr('type', this.type)
            .attr('name', this.name)
            .attr('autocomplete', this.autocomplete)
            .attr('placeholder', this.placeholder)
            .attr('aria-label', this.arialabel)
            .attr('maxlength', this.maxlength)
            .attr('hidden', this.hidden)
            .attr('disabled', this.disabled)
            .val(this.config.value);
    }

    /**
     * Builds the input's DOM.
     * @returns {jQuery} jQuery representation of the input
     */
    buildLabel() {
        if (!this.label) { return null; }
        this.labelobj = $('<label />')
            .attr('for', this.id)
            .html(this.label);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get autocomplete() { return this.config.autocomplete; }
    set autocomplete(autocomplete) { this.config.autocomplete = autocomplete; }

    get input() {
        if (!this._input) { this.input = this.buildInput(); }
        return this._input;
    }
    set input(input) { this._input = input; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.container = this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get label() { return this.config.label; }
    set label(label) { this.config.label = label; }

    get labelobj() {
        if (!this._labelobj) { this.labelobj = this.buildLabel(); }
        return this._labelobj;
    }
    set labelobj(labelobj) { this._labelobj = labelobj; }

    get maxlength() { return this.config.maxlength; }
    set maxlength(maxlength) { this.config.maxlength = maxlength; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get placeholder() { return this.config.placeholder; }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get type() { return this.config.type; }
    set type(type) { this.config.type = type; }

    get value() { return this.input.val(); }
    set value(value) {
        this.config.value = value;
        this.input.val(value);
    }

}