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

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds and returns a container object for all parts.
     * This gets over-ridden in elements that have additional structures, like a character counter
     * @returns {jQuery} jQuery representation of the label and the input together.
     */
    buildContainer() {
        this.container = $('<div />')
            .data('self', this)
            .addClass('input-container')
            .addClass(this.classes.join(' '))
            .append(this.labelobj)
            .append($('<div />').addClass('wrap').append(this.input))
            .append(this.visibilityswitcher)
            .append(this.messagebox);
        if (this.required) { this.container.addClass('required'); }
        if (this.mute) { this.container.addClass('mute'); }
        if (this.hidden) {
            this.container.css('display', 'none');
            this.container.attr('aria-hidden', true);
        }
        if ((this.config.value) && (this.config.value.length > 0)) {
            this.container.addClass('filled');
        }
    }

    /* CORE METHODS_____________________________________________________________________ */

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
                icon: 'eye-slash',
                action: function() {
                    me.setVisibility(false);
                }
            });

            this.showpwbutton = new SimpleButton({
                classes: ['naked'],
                text: "Show Password",
                hidden: true,
                icon: 'eye',
                action: function() {
                    me.setVisibility(true);
                }
            });

            this.visibilityswitcher = $('<div />')
                .addClass('visibilityswitch')
                .append(this.hidepwbutton.button)
                .append(this.showpwbutton.button);

            this.setVisibility(this.startvisible);

        }
    }

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
    }

    /**
     * Calculate the placeholder
     * @return {string|*}
     */
    calculatePlaceholder() {
        if (this.placeholder) { return this.placeholder; }
        if (this.forceconstraints) {
            return `Must be at least ${this.minlength} characters.`;
        } else if (this.suggestedlength) {
            return `Should be at least ${this.suggestedlength} characters.`;
        }
    }
    
    /**
     * Runs local validation
     * @return {boolean}
     */
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
