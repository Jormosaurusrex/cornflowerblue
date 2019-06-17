"use strict";

class Growler {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            title: null, // The growler title
            text : null, // The growler text payload
            duration: 0,
            //duration: 4000, // Length of time in milliseconds to display. If 0 or negative, stays open.
            icon: null, // An optional icon. Position of this depends on whether there is text or a title.
                        // If a title is given but no text, it will be in the titlebar. Else it
                        // gets placed in the text area.
            position: 'bottom-right', // Position for the growler. Valid values:
            // (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)
            classes: [], //Extra css classes to apply,
            onclose: null, // A function to run to when the growler closes. Passed the self.
            onopen: null // A function to run to when the growler opens. Passed the self.

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
        this.config = Object.assign({}, Growler.DEFAULT_CONFIG, config);
        let mygb = `#${Growler.GROWLBOX_ID}${this.position}`;
        if ($(mygb).length > 0) {
            this.growlbox = $(mygb);
        } else {
            this.growlbox = Growler.buildGrowlbox(this.position);
        }
        return this.build();
    }

    /**
     * Close the growler
     */
    close() {
        const me = this;
        if (this.timer) { clearTimeout(this.timer); }
        me.growler.removeClass('showing');

        setTimeout(function() {
            me.growler.remove()
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
        this.growler.remove();
        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }
    }

    /**
     * Show the growler
     */
    show() {
        this.growler.addClass('showing');
        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }
    }

    /**
     * Builds the DOM.
     * @returns {jQuery} jQuery representation
     */
    build() {
        const me = this;
        this.growler = $('<div />')
            .data('self', me)
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
            let $tbox = $('<div />').addClass('title');

            if ((this.icon) && (!this.text)) {
                $tbox.append(IconFactory.makeIcon(this.icon).addClass('i'));
            }
            $tbox.append($('<div />').addClass('t').html(this.title))
                .append(this.closebutton.button);

            this.growler.append($tbox);
        }
        if (this.text) {
            let $payload = $('<div />').addClass('payload');
            if (this.icon) {
                $payload.append(IconFactory.makeIcon(this.icon).addClass('i'));
            }
            $payload.append(
                $('<div />')
                    .addClass('text')
                    .html(this.text)
            );
            if (!this.title) {
                $payload.append(this.closebutton.button);
            }
            this.growler.append($payload);
        }

        this.growlbox.append(this.growler);

        this.show();

        if (this.duration > 0) {
            this.timer = setTimeout(function() {
                me.close();
            }, this.duration);
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get duration() { return this.config.duration; }
    set duration(duration) { this.config.duration = duration; }

    get growlbox() { return this._growlbox; }
    set growlbox(growlbox) { this._growlbox = growlbox; }

    get growler() { return this._growler; }
    set growler(growler) { this._growler = growler; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get onclose() { return this.config.onclose; }
    set onclose(onclose) {
        if (typeof onclose !== 'function') {
            console.error("Action provided for onclose is not a function!");
        }
        this.config.onclose = onclose;
    }

    get onopen() { return this.config.onopen; }
    set onopen(onopen) {
        if (typeof onopen !== 'function') {
            console.error("Action provided for onopen is not a function!");
        }
        this.config.onopen = onopen;
    }

    get position() { return this.config.position; }
    set position(position) { this.config.position = position; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

    get timer() { return this._timer; }
    set timer(timer) { this._timer = timer; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

}

