/*
    Defines a button object used in the map's navigation system.


    - text=string :: The text of the button. If the button is shaped, only displays if a glyph isn't provided.
    - shape=(square|circle|hexagon) :: Make the button one of these shapes. Otherwise, makes a rectangle
    - css=string :: one or more css classes to be applied to the button
    - id=string :: An id for the element
    - disabled=boolean :: Disable the button if true. Used only during initialization; to enable/disable
                        the button programmatically, use enable() and disable().
    - icononly=boolean :: if true
    - action=function(e, button) {} :: What to do if clicked on. Passed this button object as second argument.

 */

"use strict";

class SimpleButton {

    static DEFAULT_CONFIG = {
        id : null, // the button id
        text : 'Button Text', // The text for the button. This is also used as aria-label.
        shape : null, // (null|square|circle|hexagon) :: Make the button one of these shapes. Otherwise, makes a rectangle
        classes: [], //Extra css classes to apply
        glyph : null, // If present, will be attached to the text inside the button
                     // This can be passed a jQuery object
        icononly : false,  // If true, the text will not display on the button, only the icon.
        disabled: false, // if true, make the button disabled.
        purpose: null, // (null|constructive|destructive)
        mute: false, //if true, make the button mute. Otherwise it's bold.
        action: $.noop // The click handler. passed (event, self) as arguments.
    };


    /**
     * Define a button
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleButton.DEFAULT_CONFIG, config);
    }

    /**
     * Builds the button's DOM.
     * @returns {jQuery} jQuery representation of the SimpleButton
     */
    build() {
        const me = this;

        if (this.shape) {
            if (this.shape === 'hexagon') {
                this.button = $('<button />');
                if (this.glyph) {
                    this.button.append($('<span />').append(this.makeIcon(this.glyph)));
                } else if (this.text) {
                    this.button.append($('<span />').html(this.text));
                }
            } else {
                this.button = $('<button />');
                if (this.glyph) {
                    this.button.append(this.makeIcon(this.glyph));
                } else if (this.text) {
                    this.button.html(this.text)
                }
            }
            this.button.addClass(this.shape);
        } else {
            this.button = $('<button />');
            if (this.glyph) {
                this.button.append(this.makeIcon(this.glyph));
            }
            if (this.text) {
                this.button.append(
                    $('<div />').addClass('text').html(this.text)
                )
            }
        }

        this.button
            .attr('aria-label', this.text)
            .data('self', this);

        if (this.id) { this.button.attr('id', this.id); }
        if (this.classes) { this.button.addClass(this.classes.join(' ')); }
        if (this.disabled) { this.button.addClass('disabled'); }


        if ((this.action) && (typeof this.action === 'function')) {
            this.button.click(function (e) {
                if (!me.disabled) {
                    me.action(e, me);
                }
                this.blur();
            });
        }
        return this.button;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the NavButton
     */
    disable() {
        this.button.addClass('disabled');
        this.disabled = true;
    }

    /**
     * Disable the NavButton
     */
    enable() {
        this.button.removeClass('disabled');
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

    get icon() { return this._icon; }
    set icon(icon) { this._icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get shape() { return this.config.shape; }
    set shape(shape) { this.config.shape = shape; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

}