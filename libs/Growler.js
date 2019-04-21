"use strict";

class Growler {

    static DEFAULT_CONFIG = {
        id : null, // the id
        title: null, // the growler title
        text : null, // the growler text payload
        duration: 4000, // length of time in milliseconds to display,
        icon: null, // optional icon
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

        this.growl = $('<div />')
            .addClass('growler')
            .addClass(this.position);
        if (!$growlbox.length) {
            $growlbox = $('<div />')
                .addClass('growlbox')
                .addClass(me.config.position);
            $('body').append($growlbox);
        }

        me._container = $('<div />')
            .data('self', me)
            .addClass('growler')
            .addClass(me.config.style);

        me._closebutton = new cfb.SimpleButton({
            text: 'Close',
            icon: 'fa-close',
            icononly: true,
            cssclasses: ['dclose'],
            action: function(e) {
                e.preventDefault();
                me.close();
            }
        });
        me.getContainer().append(me._closebutton);

        if (me.config.message) {
            me._title = $('<div />').addClass('title').html(me.config.title);
            me.getContainer().append(me.getTitle());
            me._message = $('<div />').addClass('message');
            if (me.config.icon) {
                me.getMessage().append($('<div />').addClass('fa').addClass('icon').addClass(me.config.icon));
            }
            me.getMessage().append($('<div />').addClass('mtext').html(me.config.message));
            me.getContainer().append(me.getMessage());
        } else {
            me.getContainer().addClass('inline');
            me._title = $('<div />').addClass('title');
            if (me.config.icon) {
                me.getTitle().append($('<div />').addClass('fa').addClass('icon').addClass(me.config.icon));
            }
            me.getTitle().append($('<span />').html(me.config.title));
            me.getContainer().append(me.getTitle());
        }

        $growlbox.append(me.getContainer());
        me.show();

        me._timer = setTimeout(function() {
            me.close();
        }, me.config.duration);


        return this.button;
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Makes an icon object
     * @param glyph the glyph
     * @param hidden whether or not the glyph should be
     * @returns {jQuery} a span element
     */
    makeIcon(glyph, hidden) {
        return $('<span />')
            .attr('aria-hidden', true)
            .addClass("icon-" + glyph);
    }

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () {
        return `Growler | id: ${this.id} :: text: ${this.text} :: shape: ${this.shape} :: disabled: ${this.disabled}`;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get growler() {
        if (!this._growler) { this.growler = this.build(); }
        return this._growler;
    }
    set button(growler) { this._growler = growler; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get position() { return this.config.position; }
    set position(position) { this.config.position = position; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

}