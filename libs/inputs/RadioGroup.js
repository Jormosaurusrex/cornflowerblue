"use strict";

class RadioGroup {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The button id
            name: null,
            form: null, // A form element this is in
            label: null, // The text for the label.
            classes: [], // Extra css classes to apply
            disabled: false, // If true, make this disabled.
            options: [], // Array of option dictionary objects.  Printed in order given.
                         // { label: "Label to show", value: "v", checked: true }
            onchange: null, // The change handler. Passed (event, self).
            validator: null // A function to run to test validity. Passed the self; returns true or false.
        };
    }

    /**
     * Define the RadioGroup
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, RadioGroup.DEFAULT_CONFIG, config);

        if ((!this.arialabel) && (this.label)) { // munch aria label.
            this.arialabel = this.label;
        }

        if (!this.id) { // need to generate an id for label stuff
            this.id = "radiogroup-" + Utils.getUniqueKey(5);
        }
        if (!this.name) { this.name = this.id; }

        return this;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = $('<div />')
            .addClass('radiogroup')
            .data('self', this)
            .addClass(this.classes.join(' '))
            .append(this.labelobj)
            .append(this.optionlist);
        if (this.hidden) { this.container.css('display', 'none'); }
    }

    /**
     * Builds an option
     * @param def the definition of the option
     * @return {void | * | jQuery}
     */
    buildOption(def) {
        const me = this;
        const lId = this.id + '-' + Utils.getUniqueKey();
        let $op = $('<input />')
            .data('self', this)
            .attr('id', lId)
            .attr('type', 'radio')
            .attr('name', this.name)
            .attr('tabindex', 0) // always 0
            .attr('value', def.value)
            .attr('aria-label', def.label)
            .attr('aria-checked', def.checked)
            .attr('checked', def.checked)
            .attr('role', 'radio')
            .addClass(this.classes.join(' '))
            .change(function(e) {
                $(this).prop('aria-checked', $(this).prop('checked'));
                if ((me.onchange) && (typeof me.onchange === 'function')) {
                    me.onchange(e, me);
                }
            });
        let $opLabel = $('<label />')
            .attr('for', lId)
            .html(def.label);

        if (def.checked) {
            this.origval = def.value;
        }

        return $('<li />').append($op).append($opLabel);
    }

    /**
     * Build all the options.
     */
    buildOptions() {
        this.optionlist = $('<ul />')
            .attr('role', 'radiogroup');
        for (let opt of this.options) {
            this.optionlist.append(this.buildOption(opt));
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
            .html(this.label);
        if (this.form) {
            this.labelobj.attr('form', this.form.id);
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () {
        return Utils.getConfig(this);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get label() { return this.config.label; }
    set label(label) { this.config.label = label; }

    get labelobj() {
        if (!this._labelobj) { this.buildLabel(); }
        return this._labelobj;
    }
    set labelobj(labelobj) { this._labelobj = labelobj; }

    get optionlist() {
        if (!this._optionlist) { this.buildOptions(); }
        return this._optionlist;
    }
    set optionlist(optionlist) { this._optionlist = optionlist; }

    get options() { return this.config.options; }
    set options(options) { this.config.options = options; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get onchange() { return this.config.onchange; }
    set onchange(onchange) {
        if (typeof onchange !== 'function') {
            console.error("Action provided for onchange is not a function!");
        }
        this.config.onchange = onchange;
    }

    get origval() { return this.config.origval; }
    set origval(origval) { this.config.origval = origval; }

    get validator() { return this.config.validator; }
    set validator(validator) { this.config.validator = validator; }

}
