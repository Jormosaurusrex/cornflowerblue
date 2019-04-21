"use strict";

class Growler {

    static DEFAULT_CONFIG = {
        id : null, // the id
        title: null, // the growler title
        text : null, // the growler text payload
        position: 'topright', // (topright|bottomright|bottomleft|topleft) position for growler
        classes: [] //Extra css classes to apply
    };


    /**
     * Define a growler
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, Growler.DEFAULT_CONFIG, config);
        return this;
    }

    /**
     * Builds the DOM.
     * @returns {jQuery} jQuery representation
     */
    build() {
        const me = this;

        return this.button;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the button
     */
    disable() {
        this.button.prop('disabled', true);
        this.disabled = true;
    }

    /**
     * Disable the button
     */
    enable() {
        this.button.removeAttr('disabled');
        this.disabled = false;
    }


    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Makes an icon object
     * @param glyph the glyph
     * @param hidden whether or not the glyph should be
     * @returns {jQuery} a span element
     */
    makeIcon(glyph, hidden) {
        let i = $('<span />').addClass("icon-" + glyph);
        if (this.shape) {
            i.attr('aria-label', this.text);
        } else {
            i.attr('aria-hidden', true);
        }
        return i;
    }

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () {
        return `SimpleButton | id: ${this.id} :: text: ${this.text} :: shape: ${this.shape} :: disabled: ${this.disabled}`;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get action() { return this.config.action; }
    set action(action) {
        if (typeof action != 'function') {
            console.log("Action provided to button is not a function!");
        }
        this.config.action = action;
    }

    get button() {
        if (!this._button) { this.button = this.build(); }
        return this._button;
    }
    set button(button) { this._button = button; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get glyph() { return this.config.glyph; }
    set glyph(glyph) { this.config.glyph = glyph; }

    get hot() { return this.config.hot; }
    set hot(hot) { this.config.hot = hot; }

    get icon() { return this._icon; }
    set icon(icon) { this._icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get shape() { return this.config.shape; }
    set shape(shape) { this.config.shape = shape; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

}