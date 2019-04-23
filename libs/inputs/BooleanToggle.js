"use strict";

class BooleanToggle {

    static DEFAULT_CONFIG = {
        id : null, // The button id
        name: null,
        label: null, // The text for the label.
        checked: false, // Initial state.
        classes: [], // Extra css classes to apply
        disabled: false, // If true, make the checkbox disabled.
        labelside: 'left', // Which side to put the label on.
        style: null, // Default to box
        onchange: $.noop // The change handler. Passed (event, self).
    };


    /**
     * Define the BooleanToggle
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, BooleanToggle.DEFAULT_CONFIG, config);
        
        if ((!this.arialabel) && (this.label)) { // munch aria label.
            this.arialabel = this.label;
        }

        if (!this.id) { // need to generate an id for label stuff
            this.id = "input-" + Utils.getUniqueKey();
        }
        if (!this.name) { this.name = this.id; }
        this.origval = this.checked;
        
        return this;
    }

    /* STATE METHODS____________________________________________________________________ */

    /**
     * Has the field been changed or not?
     * @return {boolean} true or false, depending.
     */
    isDirty() {
        return (this.origval !== this.value);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = $('<div />')
            .addClass('checkbox');
        if (this.labelside === 'right') {
            this.container.append(this.toggle).append(this.labelobj);
        } else {
            this.container.append(this.labelobj).append(this.toggle);
        }
    }

    /**
     * Builds the DOM.
     * @returns {jQuery} jQuery representation of the BooleanToggle
     */
    build() {
        const me = this;
        
        this.toggle = $('<input />')
            .data('self', this)
            .attr('type', "checkbox")
            .attr('id', this.id)
            .attr('name', this.name)
            .attr('aria-label', this.arialabel)
            .attr('checked', this.checked)
            .attr('hidden', this.hidden)
            .attr('disabled', this.disabled)
            .change(function(e) {
                if ((me.onchange) && (typeof me.onchange === 'function')) {
                    me.onchange(e, me);
                }
            });
        if (this.style) {
            this.toggle.addClass(this.style);
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
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the button
     */
    disable() {
        this.toggle.prop('disabled', true);
        this.disabled = true;
    }

    /**
     * Disable the button
     */
    enable() {
        this.toggle.removeAttr('disabled');
        this.disabled = false;
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () {
        return `BooleanToggle | id: ${this.id} :: label: ${this.label} :: checked: ${this.checked} :: name: ${this.name} :: disabled: ${this.disabled}`;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get checked() { return this.config.checked; }
    set checked(checked) { this.config.checked = checked; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

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

    get labelside() { return this.config.labelside; }
    set labelside(labelside) { this.config.labelside = labelside; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get onchange() { return this.config.onchange; }
    set onchange(onchange) {
        if (typeof onchange != 'function') {
            console.log("Action provided for onchange is not a function!");
        }
        this.config.onchange = onchange;
    }

    get origval() { return this.config.origval; }
    set origval(origval) { this.config.origval = origval; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }


    get toggle() {
        if (!this._toggle) { this.build(); }
        return this._toggle;
    }
    set toggle(toggle) { this._toggle = toggle; }

}