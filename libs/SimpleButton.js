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
     * @returns {jQuery} jQuery representation of the NavButton
     */
    build() {
        const me = this;

        if (this.config.shape) {
            if (this.config.shape === 'hexagon') {
                this._button = $('<div />').addClass('btn');
                if (this.config.glyph) {
                    this.getButton().append($('<span />').append(this.makeGlyph(this.config.glyph)));
                } else if (this.config.text) {
                    this.getButton().append($('<span />').html(this.config.text));
                }
            } else {
                this._button = $('<button />');
                if (this.config.glyph) {
                    this.getButton().append(this.makeGlyph(this.config.glyph));
                } else if (this.config.text) {
                    this.getButton().html(this.text)
                }
            }
            this.getButton().addClass(me.config.shape);
        } else {
            this._button = $('<button />');
            if (this.config.glyph) {
                this.getButton().append(this.makeGlyph(this.config.glyph));
            }
            if (this.config.text) {
                this.getButton().append(
                    $('<div />').addClass('text').html(this.config.text)
                )
            }
        }

        this.getButton()
            .attr('aria-label', this.config.text)
            .data('self', this);

        if (this.config.id) { this.getButton().attr('id', this.config.id); }
        if (this.config.classes) { this.getButton().addClass(this.config.classes.join(' ')); }
        if (this.config.disabled) { this.getButton().addClass('disabled'); }


        if ((this.config.action) && (typeof this.config.action === 'function')) {
            this.getButton().click(function (e) {
                if (!me.config.disabled) {
                    me.config.action(e, me);
                }
            });
        }
        return me.getButton();
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the NavButton
     */
    disable() {
        this.getButton().addClass('disabled');
        this.config.disabled = true;
    }

    /**
     * Disable the NavButton
     */
    enable() {
        this.getButton().removeClass('disabled');
        this.config.disabled = false;
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Makes a glyph object
     * @param glyph the glyph
     * @param hidden whether or not the glyph should be
     * @returns {jQuery} a span element
     */
    makeGlyph(glyph, hidden) {
        let g = $('<span />').addClass("icon-" + glyph);
        if (this.config.shape) {
            g.attr('aria-label', this.config.text);
        } else {
            g.attr('aria-hidden', true);
        }
        return g;
    }

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () {
        return `NavButton | id: ${this.config.id} :: text: ${this.config.text} :: shape: ${this.config.shape} :: disabled: ${this.config.disabled}`;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    getButton() { return this._button; }

    getGlyph() { return this._glyph; }

}