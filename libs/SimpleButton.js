/*
    Defines a button object used in the map's navigation system.


    - text=string :: The text of the button. For shaped buttons, you probably want only one character
    - shape=(square|circle|hexagon) :: Make the button one of these shapes.
    - id=string :: An id for the element
    - disabled=boolean :: Disable the button if true. Used only during initialization; to enable/disable
                        the button programmatically, use enable() and disable().
    - setbreak=boolean :: If true, add additional space above/below (in context) so that the button isn't
                        visually grouped with the previous buttons.  Mostly useful with hexagon shapes.
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
    }

    /**
     * Builds the button's DOM.
     * @returns {jQuery} jQuery representation of the NavButton
     */
    build() {
        const me = this;

        me._button = $('<div />').addClass('btn');

        if (me.shape) {
            me.getButton().addClass(me.shape);
            if (me.shape === 'hexagon') {
                if (me.glyph) {
                    me.getButton().append($('<span />').append(SimpleButton.makeGlyph(me.glyph)));
                } else if (me.text) {
                    me.getButton().append($('<span />').html(me.text));
                }
            } else {
                if (me.glyph) {
                    me.getButton().append(SimpleButton.makeGlyph(me.glyph));
                } else if (me.text) {
                    me.getButton().html(me.text)
                }
            }

        } else {
            if (me.glyph) {
                me.getButton().append(SimpleButton.makeGlyph(me.glyph));
            }
            if (me.text) {
                me.getButton().append(
                    $('<div />').addClass('text').html(me.text)
                )
            }
        }

        if (me.id) { me.getButton().attr('id', me.id); }
        if (me.css) { me.getButton().addClass(me.css); }
        if (me.setbreak) { me.getButton().addClass('setbreak'); }
        if (me.disabled) { me.getButton().addClass('disabled'); }

        if ((me.action) && (typeof me.action === 'function')) {
            me.getButton().click(function (e) {
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
     * @returns {jQuery} a span element
     */
    static makeGlyph(glyph) {
        return $('<span />').addClass("icon-" + glyph);
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