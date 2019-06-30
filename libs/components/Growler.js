"use strict";

class Growler extends FloatingPanel {

    static get DEFAULT_CONFIG() {
        return {
            text : null, // The growler payload
            closeicon: 'echx',
            duration: 4000, // Length of time in milliseconds to display. If 0 or negative, stays open.
            icon: null, // An optional icon. Position of this depends on whether there is text or a title.
                        // If a title is given but no text, it will be in the titlebar. Else it
                        // gets placed in the text area.
            position: 'bottom-right' // Position for the growler. Valid values:
                        // (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)
        };
    }

    static get GROWLBOX_ID() { return 'gbox-'; }

    /**
     * Quick access to a generic growler, with an optional title.
     * @param text the text to display
     * @param title (optional) a title
     * @return {Growler}
     */
    static growl(text, title) {
        return new Growler({
            text: text,
            title: title
        })
    }

    /**
     * Quick access to a error growler
     * @param text the text to display
     * @return {Growler}
     */
    static error(text) {
        return new Growler({
            text: text,
            title: 'Error',
            icon: 'warn-hex',
            classes: ['error']
        })
    }

    /**
     * Quick access to a warn growler
     * @param text the text to display
     * @return {Growler}
     */
    static warn(text) {
        return new Growler({
            text: text,
            title: 'Warning',
            icon: 'warn-triangle',
            classes: ['warn']
        })
    }

    /**
     * Quick access to a caution growler
     * @param text the text to display
     * @return {Growler}
     */
    static caution(text) {
        return new Growler({
            text: text,
            title: 'Caution',
            icon: 'warn-circle',
            classes: ['caution']
        })
    }

    /**
     * Quick access to a success growler
     * @param text the text to display
     * @return {Growler}
     */
    static success(text) {
        return new Growler({
            text: text,
            title: 'Success',
            icon: 'check-circle',
            classes: ['success']
        })
    }

    /**
     * Builds a growlbox and inserts it into the dom.
     * @param position the position to create it at.
     * @return {jQuery} the growlbox object
     */
    static buildGrowlbox(position) {
        let $gb = $('<div />')
            .addClass('growlbox')
            .attr('id', Growler.GROWLBOX_ID + position)
            .addClass(position);
        $('body').append($gb);
        return $gb;
    }

    /**
     * Define a growler
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, Growler.DEFAULT_CONFIG, config);
        super(config);

        let mygb = `#${Growler.GROWLBOX_ID}${this.position}`;
        if ($(mygb).length > 0) {
            this.growlbox = $(mygb);
        } else {
            this.growlbox = Growler.buildGrowlbox(this.position);
        }
        this.show();
    }

    /**
     * Close the growler
     */
    close() {
        const me = this;
        if (this.timer) { clearTimeout(this.timer); }
        this.container.attr('aria-hidden', true);

        setTimeout(function() {
            me.container.remove()
        }, 2501);

        if ((me.onclose) && (typeof me.onclose === 'function')) {
            me.onclose(me);
        }
    }

    /**
     * Quickly close the growler, no animations.
     */
    quickClose() {
        if (this.timer) { clearTimeout(this.timer); }
        this.container.remove();
        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }
    }

    /**
     * Show the growler
     */
    show() {
        const me = this;
        this.container.removeAttr('aria-hidden');

        if (this.duration > 0) {
            this.timer = setTimeout(function() {
                me.close();
            }, this.duration);
        }
        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }
    }


    buildContainer() {
        const me = this;

        this.container = $('<div />')
            .data('self', me)
            .attr('aria-hidden', true)
            .addClass(this.classes.join(' '))
            .addClass('growler');

        this.closebutton = new SimpleButton({
            icon: 'echx',
            text: "Close",
            shape: "square",
            classes: ["closebutton"],
            action: function(e) {
                e.preventDefault();
                me.quickClose();
            }
        });
        if (this.title) {
            this.container.append($('<h3 />')
                .append($('<span />').addClass('text').html(this.title))
                .append(this.closebutton.button));
        } else {
            this.container.append(this.closebutton.button);
        }

        if (this.text) {
            let $payload = $('<div />').addClass('payload');
            if (this.icon) {
                $payload.append(IconFactory.icon(this.icon).addClass('i'));
            }
            $payload.append(
                $('<div />')
                    .addClass('text')
                    .html(this.text)
            );
            this.container.append($payload);
        }

        this.growlbox.append(this.container);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get duration() { return this.config.duration; }
    set duration(duration) { this.config.duration = duration; }

    get growlbox() { return this._growlbox; }
    set growlbox(growlbox) { this._growlbox = growlbox; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

    get timer() { return this._timer; }
    set timer(timer) { this._timer = timer; }

}

