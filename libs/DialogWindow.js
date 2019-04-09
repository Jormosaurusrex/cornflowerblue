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
        this._container = $('<div />').addClass('window-container');

        this._window = $('<div />').addClass('dialog');

        if (this.id) {
            this.getWindow().attr('id', this.id);
        }

        if (this.title) {
            this._title = $('<h2 />').append( $('<span />').html(this.title) );
            this.getWindow().append(me.getTitle());
            this._closeButton = new SimpleButton({
                glyph: 'echx',
                text: "Close",
                shape: "square",
                css: "closebutton",
                action: function(e) {
                    e.preventDefault();
                    me.close();
                }
            });
            this.getWindow().append(this.getCloseButton().build());
        }

        if (this.content) {
            this._content = $('<div />')
                .addClass('content')
                .append(this.content);
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