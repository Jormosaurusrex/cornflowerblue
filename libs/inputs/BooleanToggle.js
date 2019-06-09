"use strict";

class BooleanToggle {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The button id
            name: null,
            form: null, // A form element this is in
            label: null, // The text for the label.
            checked: false, // Initial state.
            classes: [], // Extra css classes to apply
            disabled: false, // If true, make the checkbox disabled.
            labelside: 'right', // Which side to put the label on.
            style: null, // Default to box
            onchange: null, // The change handler. Passed (event, self).
            validator: null // A function to run to test validity. Passed the self; returns true or false.
        };
    }

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
            this.id = "check-" + Utils.getUniqueKey();
        }
        if (!this.name) { this.name = this.id; }
        this.origval = this.checked;
        
        return this;
    }

    /**
     * Returns the raw element, without any container
     * @return {*} the element.
     */
    get naked() { return this.toggle; }

    /* STATE METHODS____________________________________________________________________ */

    /**
     * Runs validation and returns true or false, depending.
     * @return {boolean}
     */
    validate() {
        let valid = true;
        if ((this.validator) && (typeof this.validator === 'function')) {
            valid = this.validator(this);
        }
        return valid;
    }
    
    /**
     * Has the field been changed or not?
     * @return {boolean} true or false, depending.
     */
    isDirty() {
        return (this.origval !== this.value);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the container
     */
    buildContainer() {
        this.container = $('<div />')
            .data('self', this)
            .addClass('input-container')
            .addClass('checkbox');

        if (this.hidden) { this.container.css('display', 'none'); }
        if (this.disabled) { this.container.addClass('disabled'); }

        if (this.labelside === 'right') {
            this.container
                .addClass('rightside')
                .append(this.toggle).append(this.labelobj);
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
            .attr('tabindex', 0) // always 0
            .attr('aria-label', this.arialabel)
            .attr('aria-invalid', false)
            .attr('aria-checked', this.checked)
            .attr('checked', this.checked)
            .attr('hidden', this.hidden)
            .attr('disabled', this.disabled)
            .attr('role', 'checkbox')
            .addClass(this.classes.join(' '))
            .addClass(this.style)
            .change(function(e) {
                $(this).prop('aria-checked', $(this).prop('checked'));

                if ((me.onchange) && (typeof me.onchange === 'function')) {
                    me.onchange(e, me);
                }
            });
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

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the toggle
     */
    disable() {
        this.toggle.prop('disabled', true);
        this.disabled = true;
        if (this.container) { this.container.addClass('disabled'); }
    }

    /**
     * Disable the toggle
     */
    enable() {
        this.toggle.removeAttr('disabled');
        this.disabled = false;
        if (this.container) { this.container.removeClass('disabled'); }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

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

    get labelside() { return this.config.labelside; }
    set labelside(labelside) { this.config.labelside = labelside; }

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

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

    get toggle() {
        if (!this._toggle) { this.build(); }
        return this._toggle;
    }
    set toggle(toggle) { this._toggle = toggle; }

    get validator() { return this.config.validator; }
    set validator(validator) { this.config.validator = validator; }

}
