"use strict";

class SimpleButton {

    static DEFAULT_CONFIG = {
        id : null, // the button id
        text : 'Button Text', // The text for the button. This is also used as aria-label.
        shape : null, // (null|square|circle|hexagon) :: Make the button one of these shapes. Otherwise, makes a rectangle
        classes: [], //Extra css classes to apply
        icon : null, // If present, will be attached to the text inside the button
                     // This can be passed a jQuery object
        icononly : false,  // If true, the text will not display on the button, only the icon.
        disabled: false, // if true, make the button disabled.
        mute: false, //if true, make the button mute.
        hot: false, //if true, make the button hot.
        action: $.noop // The click handler. passed (event, self) as arguments.
    };


    /**
     * Define a button
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleButton.DEFAULT_CONFIG, config);
        return this;
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
                if (this.icon) {
                    this.button.append($('<span />').append(this.makeIcon(this.icon)));
                } else if (this.text) {
                    this.button.append($('<span />').html(this.text));
                }
            } else {
                this.button = $('<button />');
                if (this.icon) {
                    this.button.append(this.makeIcon(this.icon));
                } else if (this.text) {
                    this.button.html(this.text)
                }
            }
            this.button.addClass(this.shape);
        } else {
            this.button = $('<button />');
            if (this.icon) {
                this.button.append(this.makeIcon(this.icon));
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

        if (this.disabled) { this.disable(); }

        if (this.hot) { // hot takes precidence over mute
            this.button.addClass('hot');
        } else if (this.mute) {
            this.button.addClass('mute');
        }


        if ((this.action) && (typeof this.action === 'function')) {
            this.button.click(function (e) {
                if (!me.disabled) {
                    me.action(e, me);
                }
                this.blur();
            });
        }
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
     * @param icon the icon
     * @param hidden whether or not the icon should be
     * @returns {jQuery} a span element
     */
    makeIcon(icon, hidden) {
        let i = $('<span />').addClass("cfb-" + icon);
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
        if (!this._button) { this.build(); }
        return this._button;
    }
    set button(button) { this._button = button; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get hot() { return this.config.hot; }
    set hot(hot) { this.config.hot = hot; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get shape() { return this.config.shape; }
    set shape(shape) { this.config.shape = shape; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

}