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

class SimpleButton {

    /**
     * Define a button
     * @param definition a dictionary object
     */
    constructor(definition) {
        const me = this;
        if ((definition) && (typeof definition === 'object')) {
            Object.keys(definition).forEach(function(k) {
                me[k] = definition[k];
            });
        }
        if (!this.text) { this.text = "No Text"; }
    }

    /**
     * Builds the button's DOM.
     * @returns {jQuery} jQuery representation of the NavButton
     */
    build() {
        const me = this;

        this._button = $('<div />')
            .addClass('btn')
            .attr('aria-label', this.text)
            .data('self', this);

        if (this.id) { this.getButton().attr('id', this.id); }
        if (this.css) { this.getButton().addClass(this.css); }
        if (this.disabled) { this.getButton().addClass('disabled'); }

        if (this.shape) {
            this.getButton().addClass(me.shape);
            if (this.shape === 'hexagon') {
                if (this.glyph) {
                    this.getButton().append($('<span />').append(this.makeGlyph(this.glyph)));
                } else if (me.text) {
                    this.getButton().append($('<span />').html(this.text));
                }
            } else {
                if (this.glyph) {
                    this.getButton().append(this.makeGlyph(this.glyph));
                } else if (this.text) {
                    this.getButton().html(this.text)
                }
            }

        } else {
            if (this.glyph) {
                this.getButton().append(this.makeGlyph(this.glyph));
            }
            if (this.text) {
                this.getButton().append(
                    $('<div />').addClass('text').html(this.text)
                )
            }
        }


        if ((this.action) && (typeof this.action === 'function')) {
            this.getButton().click(function (e) {
                if (!me.disabled) {
                    me.action(e, me);
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
        this.disabled = true;
    }

    /**
     * Disable the NavButton
     */
    enable() {
        this.getButton().removeClass('disabled');
        this.disabled = false;
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
        if (this.shape) {
            g.attr('aria-label', this.text);
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
        return `NavButton | id: ${this.id} :: text: ${this.text} :: shape: ${this.shape} :: setbreak: ${this.setbreak} :: disabled: ${this.disabled}`;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    getButton() { return this._button; }

    getGlyph() { return this._glyph; }

}