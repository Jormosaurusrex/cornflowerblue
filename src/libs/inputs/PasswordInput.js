class PasswordInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            minlength: 5,
            suggestedlength: 8,
            maxlength: 250,
            hideicon: 'eye-slash',
            showicon: 'eye',
            obscured: true, // If true, start with password hidden
            forceconstraints: false,
            type: 'password'
        };
    }

    static get DOCUMENTATION() {
        return {
            minlength: { type: 'option', datatype: 'number', description: "The minimum length of a password." },
            suggestedlength: { type: 'option', datatype: 'number', description: "The suggested length for a password." },
            maxlength: { type: 'option', datatype: 'number', description: "The maxlength for the password field." },
            hideicon: { type: 'option', datatype: 'string', description: "The icon to show on the hide/show password control for 'hide'." },
            showicon: { type: 'option', datatype: 'string', description: "The icon to show on the hide/show password control for 'show'." },
            obscured: { type: 'option', datatype: 'boolean', description: "If true, start with password hidden." },
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, enforce that the value meets all other constraints." }
        };
    }

    /**
     * Define the object
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, PasswordInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputcontrol() { return this.visibilitycontrol; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildVisibilityControl() {


        let icon = this.hideicon,
            arialabel = TextFactory.get('hide_password');

        if (this.obscured) {
            icon = this.showicon;
            arialabel = TextFactory.get('show_password');
        }

        this.eyebutton = new SimpleButton({
            classes: ['naked'],
            shape: 'square',
            icon: icon,
            arialabel: arialabel,
            tooltip: TextFactory.get('passwordinput-change_visibility'),
            action: (e, self) => {
                this.toggleVisibility();
                e.stopPropagation();
            },
        });

        this.visibilitycontrol = document.createElement('div');
        this.visibilitycontrol.classList.add('visbutton');
        this.visibilitycontrol.classList.add('inputcontrol');
        this.visibilitycontrol.appendChild(this.eyebutton.button);

        this.visibilitycontrol.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevents focus shifting.
        });

    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Toggle the visibility of the password
     */
    toggleVisibility() {
        if (this.input.getAttribute('type') === 'text') {
            this.setVisibility(false);
        } else {
            this.setVisibility(true);
        }
    }

    /**
     * Set the visibility of the user's password.
     * @param visible if true, make the password visible.
     */
    setVisibility(visible) {
        if (visible) {
            this.obscured = false;
            this.input.setAttribute('type', 'text');
            this.eyebutton.button.setAttribute('aria-label', TextFactory.get('hide_password'));
            this.eyebutton.setIcon(this.hideicon);
        } else {
            this.obscured = true;
            this.input.setAttribute('type', 'password');
            this.eyebutton.button.setAttribute('aria-label', TextFactory.get('show_password'));
            this.eyebutton.setIcon(this.showicon);
        }
        this.input.focus();
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (this.value.length < this.minlength) {
                this.errors.push(TextFactory.get('passwordchanger-error-minlength', this.minlength));
            } else if (this.value.length < this.suggestedlength) {
                this.errors.push(TextFactory.get('passwordchanger-error-suggestedlength', this.suggestedlength));
            } else if (this.value.length > this.maxlength) {
                this.errors.push(TextFactory.get('passwordchanger-error-maxlength', this.maxlength));
            }
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get eyebutton() { return this._eyebutton; }
    set eyebutton(eyebutton) { this._eyebutton = eyebutton; }

    get minlength() { return this.config.minlength; }
    set minlength(minlength) { this.config.minlength = minlength; }

    get hideicon() { return this.config.hideicon; }
    set hideicon(hideicon) { this.config.hideicon = hideicon; }

    get obscured() { return this.config.obscured; }
    set obscured(obscured) { this.config.obscured = obscured; }

    get showicon() { return this.config.showicon; }
    set showicon(showicon) { this.config.showicon = showicon; }

    get suggestedlength() { return this.config.suggestedlength; }
    set suggestedlength(suggestedlength) { this.config.suggestedlength = suggestedlength; }

    get visibilitycontrol() {
        if (!this._visibilitycontrol) { this.buildVisibilityControl(); }
        return this._visibilitycontrol;
    }
    set visibilitycontrol(visibilitycontrol) { this._visibilitycontrol = visibilitycontrol; }


}
window.PasswordInput = PasswordInput;