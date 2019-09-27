"use strict";

class PasswordInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            minlength: 5,
            suggestedlength: 8,
            maxlength: 30,
            visibilityswitch: true, // Show the visibility switch
            startvisible: false, // If true, start with password visible already.
            forceconstraints: false,
            type: 'password'
        };
    }

    /**
     * Define the object
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, PasswordInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get topcontrol() { return this.visibilityswitcher; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Draws the visibility switcher.
     */
    buildVisibilitySwitcher() {
        const me = this;
        if (this.visibilityswitch) {
            this.hidepwbutton = new SimpleButton({
                classes: ['naked'],
                text: "Hide Password",
                hidden: true,
                notab: true,
                icon: 'eye-slash',
                action: function() {
                    me.setVisibility(false);
                }
            });
            this.showpwbutton = new SimpleButton({
                classes: ['naked'],
                text: "Show Password",
                hidden: true,
                notab: true,
                icon: 'eye',
                action: function() {
                    me.setVisibility(true);
                }
            });

            this.visibilityswitcher = $('<div />')
                .classList.add('visibilityswitch')
                .classList.add('topcontrol')
                .append(this.hidepwbutton.button)
                .append(this.showpwbutton.button);

            this.setVisibility(this.startvisible);

        }
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Set the visibility of the user's password.
     * @param visible if true, make the password visible.
     */
    setVisibility(visible) {
        if (visible) {
            this.mode = false;
            this.input.attr('type', 'text');
            this.hidepwbutton.show();
            this.showpwbutton.hide();
        } else {
            this.mode = true;
            this.input.attr('type', 'password');
            this.hidepwbutton.hide();
            this.showpwbutton.show();
        }
        this.input.focus();
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (this.value.length < this.minlength) {
                this.errors.push(`Password must be at least ${this.minlength} characters.`);
            } else if (this.value.length < this.suggestedlength) {
                this.warnings.push(`Password is less than the suggested length of ${this.suggestedlength} characters.`);
            } else if (this.value.length > this.maxlength) {
                this.errors.push(`Password must be less than ${this.maxlength} characters.`);
            }
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */
    
    get minlength() { return this.config.minlength; }
    set minlength(minlength) { this.config.minlength = minlength; }

    get hidepwbutton() { return this._hidepwbutton; }
    set hidepwbutton(hidepwbutton) { this._hidepwbutton = hidepwbutton; }

    get showpwbutton() { return this._showpwbutton; }
    set showpwbutton(showpwbutton) { this._showpwbutton = showpwbutton; }

    get mode() { return this._mode; }
    set mode(mode) { this._mode = mode; }

    get startvisible() { return this.config.startvisible; }
    set startvisible(startvisible) { this.config.startvisible = startvisible; }

    get suggestedlength() { return this.config.suggestedlength; }
    set suggestedlength(suggestedlength) { this.config.suggestedlength = suggestedlength; }

    get visibilityswitch() { return this.config.visibilityswitch; }
    set visibilityswitch(visibilityswitch) { this.config.visibilityswitch = visibilityswitch; }

    get visibilityswitcher() {
        if (!this._visibilityswitcher) { this.buildVisibilitySwitcher(); }
        return this._visibilityswitcher;
    }
    set visibilityswitcher(visibilityswitcher) { this._visibilityswitcher = visibilityswitcher; }

}
