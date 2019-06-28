"use strict";

class InputElement {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // Component id
            name: null, // Name attribute
            form: null, // A form element this is in
            counter: null, // A value for a character counter. Null means 'no counter'
            // Possible values: null, 'remaining', 'limit', and 'sky'
            forceconstraints: null, // if true, force constraints defined in sub classes (many inputs don't have any)
            type: 'text', // Type of input, defaults to "text"
            label : null, // Input label. If null, does not show up.
            placeholder: null, // Input placeholder. Individual fields can calculate this if it's null.
                               // To insure a blank placeholder, set the value to ""
            title: null,
            pattern: null,
            icon: null, // Use to define a specific icon, used in some specific controls.


            passive: false, // Start life in "passive" mode.
            unsettext: "(Not Set)", // what to display in passive mode if the value is empty

            help: null, // Help text.
            helpwaittime: 5000, // How long to wait before automatically showing help tooltip
            required: false, // Is this a required field or not
            hidden: false, // Whether or not to be hidden
            autocomplete: 'off', // Enable browser autocomplete. Default is off.
            arialabel: null, // The aria-label value. If null, follows: label > title > null
            maxlength: null, // Value for maxlength.
            value: '', // Value to use (pre-population).  Used during construction and then discarded.
            disabled: false, // If true, disable the field.
            classes: [], // Extra css classes to apply
            onreturn: null, // action to execute on hitting the return key. Passed (event, self).
            ontab: null, // action to execute on hitting the tab key. Passed (event, self).
            onkeyup: null, // action to execute on key up. Passed (event, self).
            onkeydown: null, // action to execute on key down. Passed (event, self).
            focusin: null, // action to execute on focus in. Passed (event, self).
            focusout: null, // action to execute on focus out. Passed (event, self).
            validator: null // A function to run to test validity. Passed the self.
        };
    }

    /**
     * Define a the input
     * @param config a dictionary object
     */
    constructor(config) {

        if (config.type === 'range') {
            console.log(`type: ${config.type}`);
        }
        this.config = Object.assign({}, TextInput.DEFAULT_CONFIG, config);

        if (!this.arialabel) { // munch aria label.
            if (this.label) {
                this.arialabel = this.label;
            } else if (this.title) {
                this.arialabel = this.title;
            }
        }

        if (!this.id) { // need to generate an id for label stuff
            this.id = `e-${Utils.getUniqueKey(5)}`;
        }
        if (!this.name) { this.name = this.id; }

        if (this.config.value) { // store the supplied value if any
            this.origval = this.config.value;
        } else {
            this.origval = '';
        }

        this.touched = false; // set untouched on creation.
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Return the input mode. This is used by mobile devices to select the correct keyboard.
     * This is nearly always overridden.
     * (Valid values are text, none, tel, url, email, numeric, decimal, search
     * @return {string}
     */
    get inputmode() { return "text"; }

    /**
     * Returns a topcontrol, if any.  This is usually a character counter, and is overridden.
     * @return {null}, or the character counter.
     */
    get topcontrol() { return this.charactercounter; }

    /**
     * Return an extra input control, if any. This is things like stepper buttons for numbers.
     * @return {null}, or the input control.
     */
    get inputcontrol() { return null; }

    /**
     * Returns the raw element, without any container
     * @return {*} the element.
     */
    get naked() { return this.input; }


    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Has the field been changed or not?
     * @return {boolean} true or false, depending.
     */
    isDirty() {
        return (this.origval !== this.value);
    }

    /**
     * Runs validation.  Shows errors, if any. Returns true or false, depending.
     * @param onload If true, this validation fires on the loading. This is important to
     * know because some invalidations aren't actually errors until the form is submitted.
     * @return {boolean}
     */
    validate(onload) {
        this.errors = [];
        this.warnings = [];
        if ((!onload) && (this.required) && ((!this.value) || (this.value.length === 0))) {
            this.errors.push('This field is required.');
        }
        if ((this.localValidator) && (typeof this.localValidator === 'function')) {
            this.localValidator(onload);
        }
        if ((this.validator) && (typeof this.validator === 'function')) {
            this.validator(this);
        }
        if ((this.errors.length > 0) || (this.warnings.length > 0)) {
            this.showMessages();
            if (this.errors.length > 0) {
                this.input.attr('aria-invalid', true);
            } else {
                this.input.attr('aria-invalid', false);
            }
        } else {
            this.clearMessages();
            this.input.attr('aria-invalid', false);
            if ((this.isDirty()) && (!onload)) { // This has to be valid
                this.container.addClass('valid');
            } else {
                this.container.removeClass('valid');
            }
        }
        return (this.errors.length < 1);
    }

    /**
     * Local datatype validator, intended for overriding
     * @param onload If true, this validation fires on the loading. This is important to
     * know because some invalidations aren't actually errors until the form is submitted.
     */
    localValidator(onload) { }

    /**
     * Show messages and warnings
     */
    showMessages() {
        this.messagebox.empty();
        for (let error of this.errors) {
            this.addError(error);
        }
        for (let warning of this.warnings) {
            this.addWarning(warning);
        }
        if (this.errors.length > 0) {
            this.container.addClass('error');
        } else if (this.warnings.length > 0) {
            this.container.addClass('warning');
        }
        this.messagebox.removeAttr('aria-hidden');
    }

    /**
     * Clears all messages from the element.
     */
    clearMessages() {
        this.errors = [];
        this.warnings = [];
        this.messagebox.empty().attr('aria-hidden', true);
        this.container.removeClass('error').removeClass('warning');
    }

    /**
     * Add an error.
     * @param error the error to add
     */
    addError(error) {
        this.messagebox.append($('<li />').addClass('error').html(error));
    }

    /**
     * Add a warning
     * @param warning the warning to add
     */
    addWarning(warning) {
        this.messagebox.append($('<li />').addClass('warning').html(warning));
    }

    /**
     * Updates the counter
     */
    updateCounter() {
        if (!this.counter) { return; }

        let ctext = "";
        if (this.counter === 'limit') {
            ctext = `${this.value.length} of ${this.maxlength} characters entered`;
        } else if (this.counter === 'sky') {
            ctext = `${this.value.length} characters entered`;
        } else { // remaining
            ctext = `${(this.maxlength - this.value.length)} characters remaining`;
        }

        this.charactercounter.html(ctext);

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

    /**
     * Calculate what the placeholder should be. This method is often overridden.
     * @return {null|*}
     */
    calculatePlaceholder() {
        return null;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the element
     */
    disable() {
        this.input.prop('disabled', true);
        this.disabled = true;
        if (this.container) { this.container.addClass('disabled'); }
    }

    /**
     * Disable the element
     */
    enable() {
        this.input.removeAttr('disabled');
        this.disabled = false;
        if (this.container) { this.container.removeClass('disabled'); }
    }

    /**
     * Switch to 'passive' mode.
     */
    pacify() {
        this.container.addClass('passive');
        this.passive = true;
    }

    /**
     * Switch from 'passive' mode to 'active' mode.
     */
    activate() {
        this.container.removeClass('passive');
        this.passive = false;
    }

    /**
     * Toggle the passive/active modes
     */
    toggleActivation() {
        if (this.container.hasClass('passive')) {
            this.activate();
            return;
        }
        this.pacify();
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get passivetext() {
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds and returns a container object for all parts.
     * This gets over-ridden in elements that have additional structures, like a character counter
     */
    buildContainer() {
        this.container = $('<div />')
            .data('self', this)
            .addClass('input-container')
            .addClass(this.classes.join(' '))
            .append(this.labelobj)
            .append($('<div />')
                .addClass('wrap')
                .append(this.input)
                .append(this.inputcontrol)
            )
            .append(this.passivebox)
            .append(this.topcontrol)
            .append(this.messagebox);

        this.postContainerScrub();

    }

    /**
     * Apply various things to the container and its children.
     */
    postContainerScrub() {
        if (this.required) {
            this.container.addClass('required');
            this.input.attr('required', 'required');
        }
        if (this.mute) { this.container.addClass('mute'); }
        if (this.disabled) { this.container.addClass('disabled'); }

        if (this.hidden) {
            this.container.css('display', 'none');
            this.container.attr('aria-hidden', true);
        }
        if ((this.config.value) && (this.config.value.length > 0)) {
            this.container.addClass('filled');
        }
        if (this.passive) {
            this.pacify()
        }
        if (this.help) {
            this.input
                .attr('aria-described-by', `${this.help.id}-tt`)
                .attr('aria-labeled-by', `label-${this.id}`);
        }

        this.validate(true);
    }

    /**
     * Build the passive text box.
     */
    buildInactiveBox() {
        this.passivebox = $('<div />')
            .addClass('passivebox')
            .html(this.passivetext);
    }

    /**
     * Builds the input's DOM.
     */
    buildInput() {
        const me = this;

        if (this.type === 'textarea') {
            this.input = $('<textarea />');
        } else {
            this.input = $('<input />');
        }

        this.input
            .data('self', this)
            .attr('type', this.type)
            .attr('id', this.id)
            .attr('name', this.name)
            .attr('title', this.title)
            .attr('inputmode', this.inputmode)
            .attr('autocomplete', this.autocomplete)
            .attr('placeholder', this.placeholder)
            .attr('aria-label', this.arialabel)
            .attr('aria-describedby', `msg-${this.id}`)
            .attr('aria-invalid', false)
            .attr('role', 'textbox')
            .attr('tabindex', 0) // always 0
            .attr('pattern', this.pattern)
            .attr('maxlength', this.maxlength)
            .attr('hidden', this.hidden)
            .attr('aria-hidden', this.hidden)
            .attr('disabled', this.disabled)
            .addClass(this.classes.join(' '))
            .on('keydown', function(e) {
                // Reset this to keep readers from constantly beeping. It will re-validate later.
                me.input.attr('aria-invalid', false);
                me.updateCounter();
                me.touched = true; // set self as touched.
                if ((me.onkeydown) && (typeof me.onkeydown === 'function')) {
                    me.onkeydown(e, me);
                }
            })
            .on('keyup', function(e) {
                if (me.helptimer) {
                    clearTimeout(me.helptimer);
                    me.helpicon.close();
                }

                if ((me.value) && (me.value.length > 0) && (me.container)) {
                    me.container.addClass('filled');
                } else {
                    me.container.removeClass('filled');
                }

                if ((me.form) && (me.required) // If this is the only thing required, tell the form.
                    && (($(this).val().length === 0) || ($(this).val().length === 1))) { // Only these two lengths matter
                    if (me.form) { me.form.validate(); }
                }
                if ((e.keyCode === 13) // Return key
                    && (me.onreturn) && (typeof me.onreturn === 'function')) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.onreturn(e, me);
                } else if ((me.onkeyup) && (typeof me.onkeyup === 'function')) {
                    me.onkeyup(e, me);
                }
            })
            .on('focusin', function(e) {
                if ((me.mute) && (me.placeholder) && (me.placeholder !== me.label)) {
                    $(this).attr('placeholder', me.placeholder);
                }
                if (me.container) {
                    me.container.addClass('active');
                }
                if (me.help) {
                    me.helptimer = setTimeout(function() {
                        me.helpicon.open();
                    }, me.helpwaittime);
                }
                if ((me.focusin) && (typeof me.focusin === 'function')) {
                    me.focusin(e, me);
                }
            })
            .on('focusout', function(e) {

                me.passivebox.html(me.passivetext);

                if (me.helptimer) {
                    clearTimeout(me.helptimer);
                    me.helpicon.close();
                }

                if ((me.mute) && (me.label)) {
                    $(this).attr('placeholder', me.label);
                }

                if (me.container) {
                    me.container.removeClass('active');
                }
                me.validate();

                if (me.form) { me.form.validate(); }

                if ((me.focusout) && (typeof me.focusout === 'function')) {
                    me.focusout(e, me);
                }
            })
            .val(this.config.value);

        if (this.required) {
            this.input.attr('required', true);
        }

        if (this.mute) {
            this.input.addClass('mute');
            if (this.label) { this.input.attr('placeholder', this.label); }
        }

        if (this.icon) { this.input.addClass(`cfb-${this.icon}`); }

    }

    /**
     * Builds the input's DOM.
     */
    buildLabel() {
        const me = this;

        if (!this.label) { return null; }

        this.labelobj = $('<label />')
            .attr('for', this.id)
            .attr('id', `label-${this.id}`)
            .html(this.label)
            .click(function() {
                $('#' + $(this).attr('for')).focus();
            });

        if (this.form) {
            this.labelobj.attr('form', this.form.id);
        }

        if (this.help) {
            this.helpicon = new HelpButton({ help: this.help });
            this.labelobj
                .append(this.helpicon.button)
                .hover(
                    function() { me.helpicon.open(); },
                    function() { me.helpicon.close(); }
                );
        }
    }

    /**
     * Build the message box.
     */
    buildMessagebox() {
        this.messagebox = $('<ul />')
            .attr('id', `msg-${this.id}`)
            .addClass('messagebox');
    }

    /**
     * Draws a text counter in the field
     */
    buildCharacterCounter() {
        if (this.counter) {
            this.charactercounter = $('<div />')
                .addClass('charcounter')
                .addClass('topcontrol')
                .addClass(this.counter);

            if ((!this.maxlength) || (this.maxlength <= 0)) { this.counter = 'sky'; }

            this.updateCounter();
        }
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

    get autocomplete() { return this.config.autocomplete; }
    set autocomplete(autocomplete) { this.config.autocomplete = autocomplete; }

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

    get counter() { return this.config.counter; }
    set counter(counter) { this.config.counter = counter; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get helptimer() { return this._helptimer; }
    set helptimer(helptimer) { this._helptimer = helptimer; }

    get messagebox() {
        if (!this._messagebox) { this.buildMessagebox(); }
        return this._messagebox;
    }
    set messagebox(messagebox) { this._messagebox = messagebox; }

    get errors() { return this._errors; }
    set errors(errors) { this._errors = errors; }

    get focusin() { return this.config.focusin; }
    set focusin(focusin) {
        if (typeof focusin !== 'function') {
            console.error("Action provided for focusin is not a function!");
        }
        this.config.focusin = focusin;
    }

    get focusout() { return this.config.focusout; }
    set focusout(focusout) {
        if (typeof focusout !== 'function') {
            console.error("Action provided for focusout is not a function!");
        }
        this.config.focusout = focusout;
    }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get forceconstraints() { return this.config.forceconstraints; }
    set forceconstraints(forceconstraints) { this.config.forceconstraints = forceconstraints; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helpicon() { return this._helpicon; }
    set helpicon(helpicon) { this._helpicon = helpicon; }

    get helpwaittime() { return this.config.helpwaittime; }
    set helpwaittime(helpwaittime) { this.config.helpwaittime = helpwaittime; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get input() {
        if (!this._input) { this.buildInput(); }
        return this._input;
    }
    set input(input) { this._input = input; }

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

    get onkeydown() { return this.config.onkeydown; }
    set onkeydown(onkeydown) {
        if (typeof onkeydown !== 'function') {
            console.error("Action provided for onkeydown is not a function!");
        }
        this.config.onkeydown = onkeydown;
    }

    get onkeyup() { return this.config.onkeyup; }
    set onkeyup(onkeyup) {
        if (typeof onkeyup !== 'function') {
            console.error("Action provided for onkeyup is not a function!");
        }
        this.config.onkeyup = onkeyup;
    }

    get onreturn() { return this.config.onreturn; }
    set onreturn(onreturn) {
        if (typeof onreturn !== 'function') {
            console.error("Action provided for onreturn is not a function!");
        }
        this.config.onreturn = onreturn;
    }

    get ontab() { return this.config.ontab; }
    set ontab(ontab) {
        if (typeof ontab !== 'function') {
            console.error("Action provided for ontab is not a function!");
        }
        this.config.ontab = ontab;
    }

    get origval() { return this.config.origval; }
    set origval(origval) { this.config.origval = origval; }

    get passive() { return this.config.passive; }
    set passive(passive) { this.config.passive = passive; }

    get passivebox() {
        if (!this._passivebox) { this.buildInactiveBox(); }
        return this._passivebox;
    }
    set passivebox(passivebox) { this._passivebox = passivebox; }

    get pattern() { return this.config.pattern; }
    set pattern(pattern) { this.config.pattern = pattern; }

    get placeholder() {
        if (this.config.placeholder) return this.config.placeholder;
        return this.calculatePlaceholder();
    }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

    get required() { return this.config.required; }
    set required(required) { this.config.required = required; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get touched() { return this._touched; }
    set touched(touched) { this._touched = touched; }

    get type() { return this.config.type; }
    set type(type) { this.config.type = type; }

    get unsettext() { return this.config.unsettext; }
    set unsettext(unsettext) { this.config.unsettext = unsettext; }

    get validator() { return this.config.validator; }
    set validator(validator) { this.config.validator = validator; }

    get value() { return this.input.val(); }
    set value(value) {
        this.config.value = value;
        this.input.val(value);
        this.passivebox.val(value);
    }

    get warnings() { return this._warnings; }
    set warnings(warnings) { this._warnings = warnings; }



}