class BooleanToggle {

    static get DEFAULT_CONFIG() {
        return {
            id : null,
            attributes: null,
            name: null,
            form: null,
            label: null,
            help: null,
            mute: false,
            hidewhenpassive: false,
            passive: false,
            checked: false, // Initial state.
            classes: [], // Extra css classes to apply
            disabled: false, // If true, make the checkbox disabled.
            labelside: 'right', // Which side to put the label on.
            style: null, // Default to box
            onchange: null, // The change handler. Passed (self).
            validator: null, // A function to run to test validity. Passed the self; returns true or false.,
            value: null, // the value of the checkbox
            renderer: (data) => { // A function that can be used to format the in the field in passive mode.
                return `${data}`;
            }
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The button object will have this as it's id." },
            dataattributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with data-$key = value on elements." },
            attributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with $key = value on elements." },
            form: { type: 'option', datatype: 'simpleform', description: "A SimpleForm object this element this is in." },
            help: { type: 'option', datatype: 'string', description: "Help text that appears in tooltips." },
            arialabel: { type: 'option', datatype: 'string', description: "The aria-label attribute." },
            name: { type: 'option', datatype: 'string', description: "The name attribute for the input element." },
            hidewhenpassive: { type: 'option', datatype: 'boolean', description: "If true, don't display the element when in passive mode." },
            label: { type: 'option', datatype: 'string', description: "Input label. If null, no label will be shown." },
            title: { type: 'option', datatype: 'string', description: "The title attribute for the element. Not recommended to be used." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            disabled: { type: 'option', datatype: 'boolean', description: "If true, disable the field." },
            passive: { type: 'option', datatype: 'boolean', description: "Start life in passive mode." },
            onchange: { type: 'option', datatype: 'function', description: "The change handler. Passed (self)." },
            validator: { type: 'option', datatype: 'function', description: "A function to run to test validity. Passed the self as arguments." },
            renderer: { type: 'option', datatype: 'function', description: "A function that can be used to format the in the field in passive mode." },
            value: { type: 'option', datatype: 'string', description: "Value to use for the element." },
            checked: { type: 'option', datatype: 'boolean', description: "Should the toggle be checked or not" },
            labelside: { type: 'option', datatype: 'string', description: "Which side to put the label on." },
            style: { type: 'option', datatype: 'enumeration', description: "The style of the toggle. Options are: square, circle, toggle, and switch. Null means a standard checkbox style" },
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, BooleanToggle.DEFAULT_CONFIG, config);

        if ((!this.arialabel) && (this.label)) { // munch aria label.
            this.arialabel = this.label;
        }

        if (!this.id) { this.id = `check-${CFBUtils.getUniqueKey(5)}`; }
        if (!this.name) { this.name = this.id; }
        this.origval = this.checked;
    }

    /**
     * Returns the raw element, without any container
     * @return {*} the element.
     */
    get naked() { return this.toggle; }

    /**
     * Let us know if there's a container on this.
     * @return {boolean}
     */
    get hascontainer() {
        return !!this._container;
    }

    get touched() {
        return this.checked !== this.origval;
    }

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
     * Switch to 'passive' mode.
     */
    pacify() {
        if (!this.hascontainer) { return; }
        if (this.hidewhenpassive) { this.container.setAttribute('aria-hidden', true)}
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

    get passivetext() {
        if (this.value) { return document.createTextNode('Yes'); }
        return document.createTextNode('No');
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('checkbox-container');

        if (this.hidden) { this.container.style.display = 'none'; }
        if (this.disabled) { this.container.classList.add('disabled'); }
        if (this.mute) { this.container.classList.add('mute'); }

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.labelside === 'left') {
            this.container.classList.add('leftside');
            this.container.appendChild(this.labelobj);
            this.container.appendChild(this.passivebox);
            this.container.appendChild(this.toggle);
        } else {
            this.container.appendChild(this.toggle);
            this.container.appendChild(this.labelobj);
            this.container.appendChild(this.passivebox);
        }
    }

    /**
     * Build the passive text box.
     */
    buildInactiveBox() {
        this.passivebox = document.createElement('div');
        this.passivebox.classList.add('passivebox');
        this.passivebox.appendChild(this.passivetext);
    }

    /**
     * Builds the DOM.
     */
    build() {

        this.toggle = document.createElement('input');
        this.toggle.setAttribute('type', "checkbox");
        this.toggle.setAttribute('id', this.id);
        this.toggle.setAttribute('name', this.name);
        this.toggle.setAttribute('tabindex', '0'); // always 0
        this.toggle.setAttribute('role', 'checkbox');
        this.toggle.setAttribute('value', this.value);
        this.toggle.classList.add(this.style);

        for (let c of this.classes) {
            this.toggle.classList.add(c);
        }

        CFBUtils.applyDataAttributes(this.attributes, this.toggle);
        CFBUtils.applyDataAttributes(this.dataattributes, this.toggle);

        this.toggle.addEventListener('change', () => {
            if (this.toggle.checked) {
                this.toggle.setAttribute('aria-checked','true');
                this.toggle.checked = true;
            } else {
                this.toggle.removeAttribute('aria-checked');
                this.toggle.checked = false;
            }
            this.checked = this.toggle.checked;

            if (this.form) { this.form.validate(); }

            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(this);
            }
        });

        if (this.disabled) { this.disable(); }
        if (this.hidden) { this.toggle.setAttribute('hidden', 'true'); }

        if ((this.checked) || (this.config.value)) {
            this.toggle.checked = true;
            this.checked = true;
            this.toggle.setAttribute('aria-checked', 'true');
        }
    }

    /**
     * Builds the input's DOM.
     */
    buildLabel() {
        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
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

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the toggle
     */
    disable() {
        this.toggle.setAttribute('disabled', 'disabled');
        this.disabled = true;
        if (this.hascontainer) { this.container.classList.add('disabled'); }
    }

    /**
     * Disable the toggle
     */
    enable() {
        this.toggle.removeAttribute('disabled');
        this.disabled = false;
        if (this.hascontainer) { this.container.classList.remove('disabled'); }
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

    get checked() { return this.config.checked; }
    set checked(checked) {
        if (this._toggle) { this.toggle.checked = checked; }
        this.config.checked = checked;
    }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get dataattributes() { return this.config.dataattributes; }
    set dataattributes(dataattributes) { this.config.dataattributes = dataattributes; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get hidewhenpassive() { return this.config.hidewhenpassive; }
    set hidewhenpassive(hidewhenpassive) { this.config.hidewhenpassive = hidewhenpassive; }

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

    get origval() { return this.config.origval; }
    set origval(origval) { this.config.origval = origval; }

    get passive() { return this.config.passive; }
    set passive(passive) { this.config.passive = passive; }

    get passivebox() {
        if (!this._passivebox) { this.buildInactiveBox(); }
        return this._passivebox;
    }
    set passivebox(passivebox) { this._passivebox = passivebox; }

    get renderer() { return this.config.renderer; }
    set renderer(renderer) {
        if (typeof renderer !== 'function') {
            console.error("Value provided to renderer is not a function!");
        }
        this.config.renderer = renderer;
    }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

    get toggle() {
        if (!this._toggle) { this.build(); }
        return this._toggle;
    }
    set toggle(toggle) { this._toggle = toggle; }

    get validator() { return this.config.validator; }
    set validator(validator) { this.config.validator = validator; }

    get value() { return this.checked; }
    set value(value) {
        this.toggle.setAttribute('value', value);
        this.config.value = value;
    }

}
