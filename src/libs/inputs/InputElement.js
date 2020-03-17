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

            minimal: false, // if true, build with the intent that it is part of a larger component.
                            // this removes things like the search controls and validation boxes.

            passive: false, // Start life in "passive" mode.
            unsettext: TextFactory.get('not_set'), // what to display in passive mode if the value is empty

            help: null, // Help text.
            helpwaittime: 5000, // How long to wait before automatically showing help tooltip
            required: false, // Is this a required field or not
            requiredtext: TextFactory.get('required_lc'), // text to display on required items
            requirederror: TextFactory.get('input-error-required'), // error to display if required item isn't filled.
            hidden: false, // Whether or not to be hidden
            autocomplete: 'off', // Enable browser autocomplete. Default is off.
            arialabel: null, // The aria-label value. If null, follows: label > title > null
            maxlength: null, // Value for maxlength.
            value: '', // Value to use (pre-population).  Used during construction and then discarded.
            disabled: false, // If true, disable the field.
            classes: [], // Extra css classes to apply
            onchange: null, // The change handler. Passed (self).
            onreturn: null, // action to execute on hitting the return key. Passed (event, self).
            ontab: null, // action to execute on hitting the tab key. Passed (event, self).
            onkeyup: null, // action to execute on key up. Passed (event, self).
            onkeydown: null, // action to execute on key down. Passed (event, self).
            focusin: null, // action to execute on focus in. Passed (event, self).
            focusout: null, // action to execute on focus out. Passed (event, self).
            validator: null, // A function to run to test validity. Passed the self.
            renderer: function(data) { // A function that can be used to format the in the field in passive mode.
                return `${data}`;
            }

        };
    }

    /**
     * Define a the input
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, TextInput.DEFAULT_CONFIG, config);

        if (!this.arialabel) { // munch aria label.
            if (this.label) {
                this.arialabel = this.label;
            } else if (this.title) {
                this.arialabel = this.title;
            }
        }

        if (!this.id) { this.id = `e-${CFBUtils.getUniqueKey(5)}`; }

        if (!this.name) { this.name = this.id; }

        if (!this.config.value) { this.config.value = ''; }

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
            this.errors.push(this.requirederror);
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
                this.input.setAttribute('aria-invalid', 'true');
            } else {
                this.input.removeAttribute('aria-invalid');
            }
        } else {
            this.clearMessages();
            this.input.removeAttribute('aria-invalid');
            if ((this.isDirty()) && (!onload)) { // This has to be valid
                this.container.classList.add('valid');
            } else {
                this.container.classList.remove('valid');
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
        this.messagebox.innerHTML = "";
        for (let error of this.errors) {
            this.addError(error);
        }
        for (let warning of this.warnings) {
            this.addWarning(warning);
        }
        if (this.errors.length > 0) {
            this.container.classList.add('error');
        } else if (this.warnings.length > 0) {
            this.container.classList.add('warning');
        }
        this.messagebox.removeAttribute('aria-hidden');
    }

    /**
     * Clears all messages from the element.
     */
    clearMessages() {
        this.errors = [];
        this.warnings = [];
        this.messagebox.innerHTML = '';
        this.messagebox.setAttribute('aria-hidden', 'true');
        this.container.classList.remove('error');
        this.container.classList.remove('warning');
    }

    /**
     * Add an error.
     * @param error the error to add
     */
    addError(error) {
        let err = document.createElement('li');
        err.classList.add('error');
        err.innerHTML = error;
        this.messagebox.appendChild(err);
    }

    /**
     * Add a warning
     * @param warning the warning to add
     */
    addWarning(warning) {
        let warn = document.createElement('li');
        warn.classList.add('warning');
        warn.innerHTML = warning;
        this.messagebox.appendChild(warn);
    }

    /**
     * Updates the counter
     */
    updateCounter() {
        if (!this.counter) { return; }

        let ctext = "";
        if (this.counter === 'limit') {
            ctext = TextFactory.get('input-counter-limit', this.value.length, this.maxlength);
        } else if (this.counter === 'sky') {
            ctext = TextFactory.get('input-counter-sky', this.value.length);
        } else { // remaining
            ctext = TextFactory.get('input-counter-remaining', (this.maxlength - this.value.length));
        }

        this.charactercounter.innerHTML = ctext;

        if ((this.maxlength) && (this.value.length >= this.maxlength)) {
            this.charactercounter.classList.add('outofbounds');
        } else if ((this.counter !== 'sky')
            && (this.value.length >= (this.maxlength * 0.90))) {
            this.charactercounter.classList.remove('outofbounds');
            this.charactercounter.classList.add('danger');
        } else {
            this.charactercounter.classList.remove('danger');
            this.charactercounter.classList.remove('outofbounds');
        }
    }

    /**
     * Calculate what the placeholder should be. This method is often overridden.
     * @return {null|*}
     */
    calculatePlaceholder() {
        return '';
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the element
     */
    disable() {
        this.input.setAttribute('disabled', 'true');
        this.disabled = true;
        if (this.container) { this.container.classList.add('disabled'); }
    }

    /**
     * Disable the element
     */
    enable() {
        this.input.removeAttribute('disabled');
        this.disabled = false;
        if (this.container) { this.container.classList.remove('disabled'); }
    }

    /**
     * Switch to 'passive' mode.
     */
    pacify() {
        this.container.classList.add('passive');
        this.passive = true;
    }

    /**
     * Switch from 'passive' mode to 'active' mode.
     */
    activate() {
        this.container.classList.remove('passive');
        this.passive = false;
    }

    /**
     * Toggle the passive/active modes
     */
    toggleActivation() {
        if (this.container.classList.contains('passive')) {
            this.activate();
            return;
        }
        this.pacify();
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get passivetext() {
        let v;
        if (this.value) {
            v = this.value;
        } else if (this.config.value) {
            v = this.config.value;
        }
        if (v) {
            if (this.renderer) {
                return this.renderer(v);
            }
            return v;
        }

        return this.unsettext;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds and returns a container object for all parts.
     * This gets over-ridden in elements that have additional structures, like a character counter
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        if (this.classes) {
            for (let c of this.classes) {
                this.container.classList.add(c);
            }
        }
        if (this.label) { this.container.appendChild(this.labelobj); }

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.input);
        if (this.inputcontrol) { wrap.appendChild(this.inputcontrol); }
        this.container.appendChild(wrap);

        if (!this.minimal) {
            this.container.appendChild(this.passivebox);
            if (this.topcontrol) { this.container.appendChild(this.topcontrol); }
            this.container.appendChild(this.messagebox);
        }
        if (this.minimal) { this.container.classList.add('minimal'); }

        this.postContainerScrub();

    }

    /**
     * Apply various things to the container and its children.
     */
    postContainerScrub() {
        if (this.required) {
            this.container.classList.add('required');
            this.input.setAttribute('required', 'required');
        }
        if (this.mute) { this.container.classList.add('mute'); }
        if (this.disabled) { this.container.classList.add('disabled'); }

        if (this.hidden) {
            this.container.style.display = 'none';
            this.container.setAttribute('aria-hidden', 'true');
        }
        if ((this.config.value) && (this.config.value.length > 0)) {
            this.container.classList.add('filled');
        }
        if (this.passive) {
            this.pacify();
        }
        if (this.help) {
            this.input.setAttribute('aria-describedby', `${this.id}-help-tt`);
            this.input.setAttribute('aria-labelledby', `${this.id}-label`);
        }

        this.validate(true);
    }

    /**
     * Build the passive text box.
     */
    buildInactiveBox() {
        this.passivebox = document.createElement('div');
        this.passivebox.classList.add('passivebox');
        this.passivebox.innerHTML = this.passivetext;
    }

    /**
     * Builds the input's DOM.
     */
    buildInput() {
        const me = this;

        if (this.type === 'textarea') {
            this.input = document.createElement('textarea');
        } else {
            this.input = document.createElement('input');
        }

        this.input.setAttribute('type', this.type);
        this.input.setAttribute('id', this.id);
        this.input.setAttribute('name', this.name);
        this.input.setAttribute('inputmode', this.inputmode);
        this.input.setAttribute('aria-describedby', `msg-${this.id}`);
        this.input.setAttribute('role', 'textbox');
        this.input.setAttribute('tabindex', '0');
        this.input.setAttribute('placeholder', this.placeholder);

        if (this.title) { this.input.setAttribute('title', this.title); }
        if (this.autocomplete) { this.input.setAttribute('autocomplete', this.autocomplete); }
        if (this.arialabel) { this.input.setAttribute('aria-label', this.arialabel); }        if (this.pattern) { this.input.setAttribute('pattern', this.pattern); }
        if (this.maxlength) { this.input.setAttribute('maxlength', this.maxlength); }

        if (this.classes) {
            for (let c of this.classes) {
                this.input.classList.add(c);
            }
        }
        this.input.addEventListener('change', function(e) {
            if ((me.onchange) && (typeof me.onchange === 'function')) {
                me.onchange(me);
            }
        });

        this.input.addEventListener('keydown', function(e) {
            // Reset this to keep readers from constantly beeping. It will re-validate later.
            me.input.removeAttribute('aria-invalid');
            me.updateCounter();
            me.touched = true; // set self as touched.
            if ((me.onkeydown) && (typeof me.onkeydown === 'function')) {
                me.onkeydown(e, me);
            }
        });
        this.input.addEventListener('keyup', function(e) {
            if (me.helptimer) {
                clearTimeout(me.helptimer);
                me.helpbutton.closeTooltip();
            }

            if ((me.value) && (me.value.length > 0) && (me.container)) {
                me.container.classList.add('filled');
            } else {
                me.container.classList.remove('filled');
            }

            if ((me.form) && (me.required) // If this is the only thing required, tell the form.
                && ((me.input.value.length === 0) || (me.input.value.length === 1))) { // Only these two lengths matter
                if (me.form) { me.form.validate(); }
            }
            if ((e.key === 'Enter') // Return key
                && (me.onreturn) && (typeof me.onreturn === 'function')) {
                e.preventDefault();
                e.stopPropagation();
                me.onreturn(e, me);
            } else if ((me.onkeyup) && (typeof me.onkeyup === 'function')) {
                me.onkeyup(e, me);
            }
        });
        this.input.addEventListener('focusin', function(e) {
            if ((me.mute) && (me.placeholder) && (me.placeholder !== me.label)) {
                me.input.setAttribute('placeholder', me.placeholder);
            }
            if (me.container) {
                me.container.classList.add('active');
            }
            if (me.help) {
                me.helptimer = setTimeout(function() {
                    me.helpbutton.openTooltip();
                }, me.helpwaittime);
            }
            if ((me.focusin) && (typeof me.focusin === 'function')) {
                me.focusin(e, me);
            }
        });
        this.input.addEventListener('focusout', function(e) {

            if (me.passivebox) {
                me.passivebox.innerHTML = me.passivetext;
            }

            if (me.helptimer) {
                clearTimeout(me.helptimer);
                me.helpbutton.closeTooltip();
            }

            if ((me.mute) && (me.label)) {
                me.input.setAttribute('placeholder', `${me.label} ${me.required ? '(' + me.requiredtext + ')' : ''}`);
            }

            if (me.container) { me.container.classList.remove('active'); }
            me.validate();

            if (me.form) { me.form.validate(); }

            if ((me.focusout) && (typeof me.focusout === 'function')) {
                me.focusout(e, me);
            }
        });
        this.input.value = this.config.value;

        if (this.required) {
            this.input.setAttribute('required', 'true');
            if (this.label) {
                this.labelobj.setAttribute('data-required-text', `${this.requiredtext}`);
            }
        }

        if (this.mute) {
            this.input.classList.add('mute');
            if (this.label) {
                this.input.setAttribute('placeholder', `${this.label} ${this.required ? '(' + this.requiredtext + ')' : ''}`);
            }
        }

        if (this.hidden) { this.input.setAttribute('hidden', 'hidden'); }
        if (this.disabled) { this.disable(); }

        if (this.icon) { this.input.classList.add(`cfb-${this.icon}`); }

    }

    /**
     * Builds the input's DOM.
     */
    buildLabel() {
        const me = this;

        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.setAttribute('id', `${this.id}-label`);
        this.labelobj.innerHTML = this.label;

        if (this.form) {
            this.labelobj.setAttribute('form', this.form.id);
        }

        if (this.help) {
            this.helpbutton = new HelpButton({
                id: `${this.id}-help`,
                tooltip: this.help
            });
            this.labelobj.appendChild(this.helpbutton.button);
            this.labelobj.addEventListener('mouseover', function() {
                me.helpbutton.openTooltip();
            });
            this.labelobj.addEventListener('mouseout', function() {
                me.helpbutton.closeTooltip();
            });
        }
    }

    /**
     * Build the message box.
     */
    buildMessagebox() {
        this.messagebox = document.createElement('ul');
        this.messagebox.setAttribute('id', `msg-${this.id}`);
        this.messagebox.classList.add('messagebox');
    }

    /**
     * Draws a text counter in the field
     */
    buildCharacterCounter() {
        if (this.counter) {
            this.charactercounter = document.createElement('div');
            this.charactercounter.classList.add('charcounter');
            this.charactercounter.classList.add('topcontrol');
            this.charactercounter.classList.add(this.counter);

            if ((!this.maxlength) || (this.maxlength <= 0)) { this.counter = 'sky'; }

            this.updateCounter();
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

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

    get helpbutton() { return this._helpbutton; }
    set helpbutton(helpbutton) { this._helpbutton = helpbutton; }

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

    get minimal() { return this.config.minimal; }
    set minimal(minimal) { this.config.minimal = minimal; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get onchange() { return this.config.onchange; }
    set onchange(onchange) {
        if (typeof onchange !== 'function') {
            console.error("Action provided for onchange is not a function!");
        }
        this.config.onchange = onchange;
    }

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

    get renderer() { return this.config.renderer; }
    set renderer(renderer) {
        if (typeof renderer !== 'function') {
            console.error("Value provided to renderer is not a function!");
        }
        this.config.renderer = renderer;
    }

    get required() { return this.config.required; }
    set required(required) { this.config.required = required; }

    get requirederror() { return this.config.requirederror; }
    set requirederror(requirederror) { this.config.requirederror = requirederror; }

    get requiredtext() { return this.config.requiredtext; }
    set requiredtext(requiredtext) { this.config.requiredtext = requiredtext; }

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

    get value() { return this.input.value; }
    set value(value) {
        this.config.value = value;
        this.input.value = value;
        this.passivebox.value = value;
    }

    get warnings() { return this._warnings; }
    set warnings(warnings) { this._warnings = warnings; }

}
window.InputElement = InputElement;