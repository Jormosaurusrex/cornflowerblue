"use strict";

class DialogWindow {

    static DEFAULT_CONFIG = {
        id: null,
        classes: [],             // apply these classes to the dialog, if any.
        title: null,                // Adds a title to the dialog if present
        resizable: false,           // Allows for dialog to be resized
        content: $('<p />').html("No provided content"), // This is the content of the dialog
        showCloseButton: true      // Show or hide the X button in the corner (requires title != null)
    };
    /**
     * Define a DialogWindow
     * @param config a dictionary object
     * @return self
     */
    constructor(config) {
        this.config = Object.assign({}, DialogWindow.DEFAULT_CONFIG, config);
        this.build();
        return this;
    }

    /**
     * Constructs the DialogWindow's DOM elements
     */
    build() {
        const me = this;
        this._container = $('<div />').addClass('window-container');

        this._window = $('<div />').addClass('dialog');

        if (this.config.id) {
            this.getWindow().attr('id', this.config.id);
        }

        if (this.config.classes) { this.getWindow().addClass(this.config.classes.join(' ')); }

        if (this.config.title) {
            this._title = $('<h2 />').append( $('<span />').html(this.config.title) );
            this.getWindow().append(this.getTitle());
            if (this.config.showCloseButton) {
                this._closeButton = new SimpleButton({
                    glyph: 'echx',
                    text: "Close",
                    shape: "square",
                    classes: ["closebutton"],
                    action: function(e) {
                        e.preventDefault();
                        me.close();
                    }
                });
                this.getWindow().append(this.getCloseButton().build());
            }
        }

        if (this.config.content) {
            this._content = $('<div />')
                .addClass('content')
                .append(this.config.content);
            this.getWindow().append(this.getContent());
        }

        $(document).bind("keyup.DialogWindow", function(e) {
            if (e.keyCode === 27) { // escape key maps to keycode `27`
                me.close();
            }
        });
    }

    /**
     * Opens the dialog window
     */
    open() {
        const me = this;
        this._mask = $('<div />')
            .addClass('window-mask')
            .click(function(e) {
                e.preventDefault();
                me.close();
            });
        this.getContainer().append(me.getWindow());

        $('body')
            .append(this.getMask())
            .append(this.getContainer())
            .addClass('modalopen');
        return this;
    }

    /**
     * Closes the dialog window
     */
    close() {
        const me = this;
        this.getContainer().animate({ opacity: 0 }, 200, function() {
            me.getContainer().remove();
            me.getMask().animate({ opacity: 0 }, 100, function() {
                me.getMask().remove();
                $(document).bind("keyup.DialogWindow"); // get rid of our keyup
            });
        });
        $('body').removeClass('modalopen');
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () {
        return `DialogWindow | id: ${this.config.id} :: title: ${this.config.title}`;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    getCloseButton() { return this._closeButton; }

    getContainer() { return this._container; }

    getContent() { return this._content; }

    getMask() { return this._mask; }

    getTitle() { return this._title; }

    getWindow() { return this._window; }

}