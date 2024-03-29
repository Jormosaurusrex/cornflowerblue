class InputElement {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            attributes: null,
            dataattributes: null,
            name: null,
            form: null,
            counter: null,
            forceconstraints: null,
            type: 'text',
            label: null,
            placeholder: null,
            hidewhenpassive: false,
            hidewhenactive: false,
            hidepassiveifempty: true,
            preamble: null,
            title: null,
            pattern: null,
            icon: null,
            mute: null,
            vigilant: null,
            minimal: false,
            passive: false,
            unsettext: TextFactory.get('not_set'),
            help: null,
            size: null,
            helpwaittime: 5000,
            required: false,
            requiredtext: TextFactory.get('required_lc'),
            requirederror: TextFactory.get('input-error-required'),
            hidden: false,
            autocomplete: 'off',
            arialabel: null,
            maxlength: null,
            value: null,
            disabled: false,
            classes: [],
            onchange: null,
            onreturn: null,
            ontab: null,
            onkeyup: null,
            onpaste: null,
            onkeydown: null,
            focusin: null,
            focusout: null,
            validator: null,
            renderer: (data) => { return document.createTextNode(data); }

        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The button object will have this as it's id." },
            dataattributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with data-$key = value on elements." },
            attributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with $key = value on elements." },
            form: { type: 'option', datatype: 'simpleform', description: "A SimpleForm object this element this is in." },
            arialabel: { type: 'option', datatype: 'string', description: "The aria-label attribute." },
            name: { type: 'option', datatype: 'string', description: "The name attribute for the input element." },
            label: { type: 'option', datatype: 'string', description: "Input label. If null, no label will be shown." },
            title: { type: 'option', datatype: 'string', description: "The title attribute for the element. Not recommended to be used." },
            pattern: { type: 'option', datatype: 'string', description: "Input pattern attribute." },
            icon: { type: 'option', datatype: 'string', description: "Use to define a specific icon, used in some specific controls." },
            minimal: { type: 'option', datatype: 'boolean', description: "If true, build with the intent that it is part of a larger component. This removes things like the secondary controls and validation boxes." },
            counter: { type: 'option', datatype: 'enumeration', description: "A value for a character counter. Null means 'no counter'. Possible values: null, 'remaining', 'limit', and 'sky'." },
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, force constraints defined in sub classes (many inputs don't have any)." },
            placeholder: { type: 'option', datatype: 'string', description: "Input placeholder. Individual fields can calculate this if it's null. To insure a blank placeholder, set the value to ''." },
            passive: { type: 'option', datatype: 'boolean', description: "Start life in passive mode." },
            preamble: { type: 'option', datatype: 'string', description: "This text will display before the element as additional explanation." },
            unsettext: { type: 'option', datatype: 'string', description: "Text to display in passive mode if the value is empty." },
            help: { type: 'option', datatype: 'string', description: "Help text that appears in tooltips." },
            helpwaittime: { type: 'option', datatype: 'number', description: "How long to wait before automatically showing help tooltip." },
            required: { type: 'option', datatype: 'boolean', description: "Is this a required field or not." },
            hidewhenactive: { type: 'option', datatype: 'boolean', description: "If true, don't display the element when in active mode." },
            hidewhenpassive: { type: 'option', datatype: 'boolean', description: "If true, don't display the element when in passive mode." },
            hidewhenpassivewhenempty: { type: 'option', datatype: 'boolean', description: "If true, don't display the element when in passive mode, but only do this if there is no value." },
            requiredtext: { type: 'option', datatype: 'string', description: "Text to display on required items." },
            requirederror: { type: 'option', datatype: 'string', description: "The error message to display if required item isn't filled." },
            hidden: { type: 'option', datatype: 'boolean', description: "Whether or not to bea hidden element." },
            autocomplete: { type: 'option', datatype: 'boolean', description: "Enable browser autocomplete. Default is off." },
            maxlength: { type: 'option', datatype: 'number', description: "If set, applies a maxlength to the element." },
            value: { type: 'option', datatype: 'string', description: "Value to use for the element." },
            disabled: { type: 'option', datatype: 'boolean', description: "If true, disable the field." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            onchange: { type: 'option', datatype: 'function', description: "The change handler. Passed (self)." },
            onreturn: { type: 'option', datatype: 'function', description: "The action to execute on hitting the return key. Passed (event, self) as arguments." },
            ontab: { type: 'option', datatype: 'function', description: "The action to execute on hitting the tab key. Passed (event, self) as arguments." },
            onkeyup: { type: 'option', datatype: 'function', description: "The action to execute on key up. Passed (event, self) as arguments." },
            onkeydown: { type: 'option', datatype: 'function', description: "The action to execute on key down. Passed (event, self) as arguments." },
            onpaste: { type: 'option', datatype: 'function', description: "The action to execute on paste within. Passed (event, self) as arguments." },
            focusin: { type: 'option', datatype: 'function', description: "The action to execute on focus in. Passed (event, self) as arguments." },
            focusout: { type: 'option', datatype: 'function', description: "The action to execute on focus out. Passed (event, self) as arguments." },
            validator: { type: 'option', datatype: 'function', description: "A function to run to test validity. Passed the self as arguments." },
            renderer: { type: 'option', datatype: 'function', description: "A function that can be used to format the in the field in passive mode." }
        };
    }

    /**
     * Define a the input
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, InputElement.DEFAULT_CONFIG, config);

        if (config.hidepassiveifempty) {
            if (!config.classes) { config.classes = []; }
            config.classes.push('hidepassiveifempty');
        }

        if (!this.arialabel) { // munch aria label.
            if (this.label) {
                this.arialabel = this.label;
            } else if (this.title) {
                this.arialabel = this.title;
            }
        }

        if (!this.id) { this.id = `e-${CFBUtils.getUniqueKey(5)}`; }

        if (!this.name) { this.name = this.id; }

        this.origval = this.config.value;


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

    /**
     * Let us know if there's a container on this.
     * @return {boolean}
     */
    get hascontainer() {
        return !!this._container;
    }

    /**
     * Let us know if there's a passivebox on this.
     * @return {boolean}
     */
    get haspassivebox() {
        return !!this._passivebox;
    }

    /**
     * Get the initial value for the input. Useful for overriding if we want to display things different.
     * @return {string}
     */
    get initialvalue() { return this.config.value; }

    /* CORE METHODS_____________________________________________________________________ */

    setCursorPosition(position) {
        CFBUtils.setCursorPosition(this.input, position);
    }

    /**
     * Reset the component to its original state
     */
    reset() {
        this.value = this.origval;
        this.input.removeAttribute('aria-invalid');
        if (this.hascontainer) {
            this.container.classList.remove('valid');
            this.container.classList.remove('filled');
            this.clearMessages();
        }
        if (this.haspassivebox) {
            this.passivebox.innerHTML = '';
            this.passivebox.appendChild(this.passivetext);
        }
    }

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
            if (this.hascontainer) {
                this.showMessages();
                this.container.classList.remove('valid');
            }
            this.input.removeAttribute('aria-invalid');
            if (this.errors.length > 0) {
                this.input.setAttribute('aria-invalid', 'true');
            }
        } else {
            this.input.removeAttribute('aria-invalid');
            if (this.hascontainer) {
                this.clearMessages();
                if ((!this.value) || ((this.value) && (this.value.length === 0))) { // it's cleared.
                    this.container.classList.remove('valid');
                    this.container.classList.remove('filled');
                } else if ((this.isDirty()) && (!onload)) { // This has to be valid
                    this.container.classList.add('valid');
                    this.container.classList.add('filled');
                } else if (this.value) {
                    this.container.classList.remove('valid');
                    this.container.classList.add('filled');
                } else {
                    this.container.classList.remove('valid');
                }
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
        if ((this.errors.length === 0) && (this.warnings.length === 0)) {
            this.container.classList.remove('error');
            this.container.classList.remove('warning');
            this.messagebox.setAttribute('aria-hidden', 'true');
        }
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

        let ctext;
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
        if (this.hascontainer) { this.container.classList.add('disabled'); }
    }

    /**
     * Disable the element
     */
    enable() {
        this.input.removeAttribute('disabled');
        this.disabled = false;
        if (this.hascontainer) { this.container.classList.remove('disabled'); }
    }

    /**
     * Switch to 'passive' mode.
     */
    pacify() {
        if (!this.hascontainer) { return; }
        this.container.removeAttribute('aria-hidden'); // clear
        if (this.haspassivebox) {
            this.passivebox.innerHTML = '';
            this.passivebox.appendChild(this.passivetext);
        }
        if (this.hidewhenpassive) { this.container.setAttribute('aria-hidden', true)}
        if ((this.hidepassiveifempty) && ((!this.value) || (this.value === ''))) {
            this.container.setAttribute('aria-hidden', true);
        }
        this.container.classList.add('passive');
        this.passive = true;
    }

    /**
     * Switch from 'passive' mode to 'active' mode.
     */
    activate() {
        if (!this.hascontainer) { return; }
        this.container.removeAttribute('aria-hidden');
        this.container.classList.remove('passive');
        this.passive = false;
        if (this.hidewhenactive) { this.container.setAttribute('aria-hidden', true); }
    }

    /**
     * Toggle the passive/active modes
     */
    toggleActivation() {
        if (!this.hascontainer) { return; }
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
            return document.createTextNode(v);
        }
        return document.createTextNode(this.unsettext);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds and returns a container object for all parts.
     * This gets over-ridden in elements that have additional structures, like a character counter
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        if (this.classes) {
            for (let c of this.classes) {
                this.container.classList.add(c);
            }
        }

        if (this.preamble) {
            let p = document.createElement('p');
            p.classList.add('preamble');
            p.innerHTML = this.preamble;
            this.container.appendChild(p);
        }

        this.topline = document.createElement('div');
        this.topline.classList.add('topline');
        if (this.label) { this.topline.appendChild(this.labelobj); }
        if (this.topcontrol) { this.topline.appendChild(this.topcontrol); }
        this.container.appendChild(this.topline);

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.input);
        if (this.inputcontrol) { wrap.appendChild(this.inputcontrol); }
        this.container.appendChild(wrap);

        if (!this.minimal) {
            this.container.appendChild(this.passivebox);
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
        if (this.vigilant) { this.container.classList.add('vigilant'); }
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
        } else {
            this.activate();
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
    buildPassiveBox() {
        this.passivebox = document.createElement('div');
        this.passivebox.classList.add('passivebox');
        this.passivebox.appendChild(this.passivetext);
    }

    /**
     * Builds the input's DOM.
     */
    buildInput() {

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
        if (this.size) {
            this.input.setAttribute('size', this.size);
        }
        if ((this.mute) && (!this.vigilant)) {
            this.input.setAttribute('placeholder', '');
        } else {
            this.input.setAttribute('placeholder', this.placeholder);
        }


        if (this.title) { this.input.setAttribute('title', this.title); }
        if (this.arialabel) { this.input.setAttribute('aria-label', this.arialabel); }
        if (this.autocomplete) { this.input.setAttribute('autocomplete', this.autocomplete); }
        if (this.pattern) { this.input.setAttribute('pattern', this.pattern); }
        if (this.maxlength) { this.input.setAttribute('maxlength', this.maxlength); }

        if (this.classes) {
            for (let c of this.classes) {
                this.input.classList.add(c);
            }
        }


        const paste = (e) => {
            this.input.removeAttribute('aria-invalid');
            if (this.hascontainer) {
                this.updateCounter();
            }
            this.touched = true; // set self as touched.
            if ((this.form) && (this.required) // If this is the only thing required, tell the form.
                && ((this.input.value.length === 0) || (this.input.value.length >= 1))) { // Only these two lengths matter
                if (this.form) { this.form.validate(); }
            }
            if ((this.onpaste) && (typeof this.onpaste === 'function')) {
                this.onpaste(e, this);
            }
        }
        this.input.addEventListener('paste', paste);

        const change = (e) => {
            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(this);
            }
        }

        const keydown = (e) => {
            // Reset this to keep readers from constantly beeping. It will re-validate later.
            this.input.removeAttribute('aria-invalid');
            if (this.hascontainer) {
                this.updateCounter();
            }
            this.touched = true; // set self as touched.
            if ((this.onkeydown) && (typeof this.onkeydown === 'function')) {
                this.onkeydown(e, this);
            }
        }
        const keyup = (e) => {
            this.config.value = this.value;
            if (this.hascontainer) {
                if (this.helptimer) {
                    clearTimeout(this.helptimer);
                    if (this.helpbutton) {
                        this.helpbutton.closeTooltip();
                    }
                }
                if ((this.value) && (this.value.length > 0)) {
                    this.container.classList.add('filled');
                } else {
                    this.container.classList.remove('filled');
                }
                if ((this.form) // If this is the only thing required, tell the form.
                    && ((this.input.value.length === 0) || (this.input.value.length >= 1))) { // Only these two lengths matter
                    if (this.form) { this.form.validate(); }
                }
            }
            if ((e.key === 'Enter') // Return key
                && (this.onreturn) && (typeof this.onreturn === 'function')) {
                e.preventDefault();
                e.stopPropagation();
                this.onreturn(e, this);
            } else if ((e.key === 'Tab') // Tab
                && (this.ontab) && (typeof this.ontab === 'function')) {
                this.ontab(e, this);
            } else if ((this.onkeyup) && (typeof this.onkeyup === 'function')) {
                this.onkeyup(e, this);
            }
        }
        const focusout = (e) => {
            if (this.hascontainer) {
                if (this.passivebox) {
                    this.passivebox.innerHTML = '';
                    this.passivebox.appendChild(this.passivetext);
                }
                if (this.helptimer) {
                    clearTimeout(this.helptimer);
                    if (this.helpbutton) {
                        this.helpbutton.closeTooltip();
                    }
                }
                if ((this.mute) && (!this.vigilant) && (this.label)) {
                    this.input.setAttribute('placeholder', '');
                }
                this.container.classList.remove('active');
                this.validate();

                if (this.form) { this.form.validate(); }

            }
            this.input.removeEventListener('keydown', keydown);
            this.input.removeEventListener('keyup', keyup);
            this.input.removeEventListener('focusout', focusout);
            if (this.onchange) {
                this.input.removeEventListener('change', change);
            }
            if ((this.focusout) && (typeof this.focusout === 'function')) {
                this.focusout(e, this);
            }
        }
        const focusin = (e) => {
            this.input.addEventListener('keydown', keydown);
            this.input.addEventListener('keyup', keyup);
            this.input.addEventListener('focusout', focusout);
            if (this.onchange) {
                this.input.addEventListener('change', change);
            }
            if ((this.mute) && (!this.vigilant) && (this.placeholder) && (this.placeholder !== this.label)) {
                this.input.setAttribute('placeholder', this.placeholder);
            }
            if (this.hascontainer) {
                this.container.classList.add('active');
                if ((this.help) && (this.helpbutton)) {
                    this.helptimer = setTimeout(() => {
                        this.helpbutton.openTooltip();
                    }, this.helpwaittime);
                }
            }
            if ((this.focusin) && (typeof this.focusin === 'function')) {
                this.focusin(e, this);
            }
        }
        this.input.addEventListener('focusin', focusin);

        this.input.value = this.initialvalue;

        if (this.required) {
            this.input.setAttribute('required', 'true');
            if ((this.hascontainer) && (this.label)) {
                this.labelobj.setAttribute('data-required-text', `${this.requiredtext}`);
            }
        }

        CFBUtils.applyDataAttributes(this.attributes, this.input);
        CFBUtils.applyDataAttributes(this.dataattributes, this.input);

        if (this.mute) { this.input.classList.add('mute'); }
        if (this.vigilant) { this.input.classList.add('vigilant'); }

        if (this.hidden) { this.input.setAttribute('hidden', 'hidden'); }
        if (this.disabled) { this.disable(); }

        if (this.icon) { this.input.classList.add(`cfb-${this.icon}`); }

    }

    /**
     * Builds the input's DOM.
     */
    buildLabel() {

        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.setAttribute('id', `${this.id}-label`);
        this.labelobj.innerHTML = this.label;

        if (this.form) {
            this.labelobj.setAttribute('form', this.form.id);
        }

        if (this.help) {
            if (this.mute) {
                let s = document.createElement('span');
                s.classList.add('mutehelp');
                s.innerHTML = this.help;
                this.labelobj.appendChild(s);
            } else {
                this.helpbutton = new HelpButton({
                    id: `${this.id}-help`,
                    tooltip: this.help
                });
                this.labelobj.appendChild(this.helpbutton.button);
            }
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

    get attributes() { return this.config.attributes; }
    set attributes(attributes) { this.config.attributes = attributes; }

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

    get dataattributes() { return this.config.dataattributes; }
    set dataattributes(dataattributes) { this.config.dataattributes = dataattributes; }

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

    get hidewhenactive() { return this.config.hidewhenactive; }
    set hidewhenactive(hidewhenactive) { this.config.hidewhenactive = hidewhenactive; }

    get hidewhenpassive() { return this.config.hidewhenpassive; }
    set hidewhenpassive(hidewhenpassive) { this.config.hidewhenpassive = hidewhenpassive; }

    get hidepassiveifempty() { return this.config.hidepassiveifempty; }
    set hidepassiveifempty(hidepassiveifempty) { this.config.hidepassiveifempty = hidepassiveifempty; }

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

    get onpaste() { return this.config.onpaste; }
    set onpaste(onpaste) {
        if (typeof ontab !== 'function') {
            console.error("Action provided for onpaste is not a function!");
        }
        this.config.onpaste = onpaste;
    }

    get origval() { return this.config.origval; }
    set origval(origval) { this.config.origval = origval; }

    get passive() { return this.config.passive; }
    set passive(passive) { this.config.passive = passive; }

    get passivebox() {
        if (!this._passivebox) { this.buildPassiveBox(); }
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

    get preamble() { return this.config.preamble; }
    set preamble(preamble) { this.config.preamble = preamble; }

    get renderer() { return this.config.renderer; }
    set renderer(renderer) {
        if (typeof renderer !== 'function') {
            console.error("Value provided to renderer is not a function!");
        }
        if (this.config) { this.config.renderer = renderer; }
    }

    get required() { return this.config.required; }
    set required(required) { this.config.required = required; }

    get requirederror() { return this.config.requirederror; }
    set requirederror(requirederror) { this.config.requirederror = requirederror; }

    get requiredtext() { return this.config.requiredtext; }
    set requiredtext(requiredtext) { this.config.requiredtext = requiredtext; }

    get size() { return this.config.size; }
    set size(size) { this.config.size = size; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get topline() { return this._topline; }
    set topline(topline) { this._topline = topline; }

    get touched() { return this._touched; }
    set touched(touched) { this._touched = touched; }

    get type() { return this.config.type; }
    set type(type) { this.config.type = type; }

    get unsettext() { return this.config.unsettext; }
    set unsettext(unsettext) { this.config.unsettext = unsettext; }

    get unselectedtext() { return this.config.unselectedtext; }
    set unselectedtext(unselectedtext) { this.config.unselectedtext = unselectedtext; }

    get validator() { return this.config.validator; }
    set validator(validator) { this.config.validator = validator; }

    get value() { return this.input.value; }
    set value(value) {
        this.config.value = value;
        this.input.value = value;
        if (this.hascontainer) {
            this.passivebox.value = value;
            this.validate();
        }
    }

    get vigilant() { return this.config.vigilant; }
    set vigilant(vigilant) { this.config.vigilant = vigilant; }

    get warnings() { return this._warnings; }
    set warnings(warnings) { this._warnings = warnings; }

}
window.InputElement = InputElement;