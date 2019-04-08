class DialogWindow {

    /**
     * Define a DialogWindow
     * @param definition a dictionary object
     * @return self
     */
    constructor(definition) {
        const me = this;

        if ((definition) && (typeof definition === 'object')) {
            Object.keys(definition).forEach(function(k) {
                me[k] = definition[k];
            });
        }
        me.build();
        return me;
    }

    /**
     * Constructs the DialogWindow's DOM elements
     */
    build() {
        const me = this;
        me._container = $('<div />').addClass('window-container');

        me._window = $('<div />').addClass('dialog');

        if (me.id) {
            me.getWindow().attr('id', me.id);
        }

        if (me.title) {
            me._title = $('<h2 />').append( $('<span />').html(me.title) );
            me.getWindow().append(me.getTitle());
            me._closeButton = new SimpleButton({
                glyph: 'echx',
                css: "closebutton",
                action: function(e) {
                    e.preventDefault();
                    me.close();
                }
            });
            me.getWindow().append(me.getCloseButton());
        }

        if (me.content) {
            me._content = $('<div />')
                .addClass('content')
                .append(me.content);
            me.getWindow().append(me.getContent());
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
        me._mask = $('<div />')
            .addClass('window-mask')
            .click(function(e) {
                e.preventDefault();
                me.close();
            });
        me.getContainer().append(me.getWindow());

        $('body')
            .append(me.getMask())
            .append(me.getContainer())
            .addClass('modalopen');
        return me;
    }

    /**
     * Closes the dialog window
     */
    close() {
        const me = this;
        me.getContainer().animate({ opacity: 0 }, 200, function() {
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
        return `DialogWindow | id: ${this.id} :: title: ${this.title}`;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    getCloseButton() { return this._closeButton; }

    getContainer() { return this._container; }

    getContent() { return this._content; }

    getMask() { return this._mask; }

    getTitle() { return this._title; }

    getWindow() { return this._window; }

}