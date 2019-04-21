"use strict";

class DialogWindow {

    static DEFAULT_CONFIG = {
        id: null,
        classes: [],             // apply these classes to the dialog, if any.
        title: null,                // Adds a title to the dialog if present
        resizable: false,           // Allows for dialog to be resized
        content: $('<p />').html("No provided content"), // This is the content of the dialog
        showclose: true      // Show or hide the X button in the corner (requires title != null)
    };
    /**
     * Define a DialogWindow
     * @param config a dictionary object
     * @return DialogWindow
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
        this.container = $('<div />').addClass('window-container');

        this.window = $('<div />').addClass('dialog');

        this.window.attr('id', this.id);

        if (this.config.classes) { this.window.addClass(this.config.classes.join(' ')); }

        if (this.config.title) {
            this.title = $('<h2 />').append( $('<span />').html(this.config.title) );
            this.window.append(this.title);
            if (this.config.showclose) {
                this.closebutton = new SimpleButton({
                    icon: 'echx',
                    text: "Close",
                    shape: "square",
                    classes: ["closebutton"],
                    action: function(e) {
                        e.preventDefault();
                        me.close();
                    }
                });
                this.window.append(this.closebutton.button);
            }
        }

        if (this.config.content) {
            this.content = $('<div />')
                .addClass('content')
                .append(this.config.content);
            this.window.append(this.content);
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
        this.mask = $('<div />')
            .addClass('window-mask')
            .click(function(e) {
                e.preventDefault();
                me.close();
            });
        this.container.append(me.window);

        $('body')
            .append(this.mask)
            .append(this.container)
            .addClass('modalopen');
        return this;
    }

    /**
     * Closes the dialog window
     */
    close() {
        const me = this;
        this.container.animate({ opacity: 0 }, 200, function() {
            me.container.remove();
            me.mask.animate({ opacity: 0 }, 100, function() {
                me.mask.remove();
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
        return `DialogWindow | id: ${this.id} :: title: ${this.title}`;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get container() { return this._container; }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get mask() { return this._mask; }
    set mask(mask) { this._mask = mask; }

    get showclose() { return this.config.showclose; }
    set showclose(showclose) { this.config.showclose = showclose; }

    get title() { return this._title; }
    set title(title) { this._title = title; }

    get window() { return this._window; }
    set window(window) { this._window = window; }

}