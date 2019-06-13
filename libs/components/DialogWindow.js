"use strict";

class DialogWindow {

    static get DEFAULT_CONFIG() {
       return {
            id: null,
            form: null,  // takes a SimpleForm.  If present, displays and renders that. If not, uses content.
            content: $('<p />').html("No provided content"), // This is the content of the dialog
            classes: [],             // apply these classes to the dialog, if any.
            header: null, // jQuery object, will be used if passed before title.
            title: null,  // Adds a title to the dialog if present. header must be null.
            clickoutsidetoclose: true, // Allow the window to be closed by clicking outside.
            escapecloses: true, // Allow the window to be closed by the escape key
            showclose: true  // Show or hide the X button in the corner (requires title != null)
        };
    }

    /**
     * Define a DialogWindow
     * @param config a dictionary object
     * @return DialogWindow
     */
    constructor(config) {
        this.config = Object.assign({}, DialogWindow.DEFAULT_CONFIG, config);

        if (!config.id) {
            config.id = "dialog-" + Utils.getUniqueKey(5);
        }

        this.build();
        return this;
    }

    /**
     * Opens the dialog window
     */
    open() {
        const me = this;
        this.mask = $('<div />')
            .addClass('window-mask')
            .addClass(this.classes.join(' '))
            .click(function(e) {
                e.preventDefault();
                if (me.clickoutsidetoclose) {
                    me.close();
                }
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
        // XXX TODO Change this to css animations
        this.container.animate({ opacity: 0 }, 50, function() {
            me.container.remove();
            me.mask.animate({ opacity: 0 }, 50, function() {
                me.mask.remove();
                $(document).bind("keyup.DialogWindow"); // get rid of our keyup
            });
        });
        $('body').removeClass('modalopen');
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Constructs the DialogWindow's DOM elements
     */
    build() {
        const me = this;
        this.container = $('<div />')
            .addClass(this.classes.join(' '))
            .addClass('window-container');

        this.window = $('<div />')
            .addClass('dialog')
            .addClass(this.classes.join(' '))
            .attr('id', this.id);

        if ((this.title) || (this.header)) {

            if (this.header) {
                this.window.append(this.header);
            } else {
                this.title = $('<h2 />').append( $('<span />').addClass('t').html(this.title) );
                this.window.append(this.title);
            }

            if (this.showclose) {
                this.closebutton = new SimpleButton({
                    icon: 'echx',
                    text: "Close",
                    shape: "square",
                    classes: ["naked", "closebutton"],
                    action: function(e) {
                        e.preventDefault();
                        me.close();
                    }
                });
                this.title.append(this.closebutton.button);
            }
        } else if (this.showclose) {
            console.error("Dialog defines 'showclose' but no title is defined.")
        }

        if (this.form) { // it's a SimpleForm

            this.form.dialog = this;

            this.contentbox = $('<div />')
                .addClass('content')
                .append(this.form.form);

            this.window
                .addClass('isform')
                .append(this.contentbox);

        } else if (this.content) { // It's a jQuery object

            this.contentbox = $('<div />')
                .addClass('content')
                .append(this.content);

            this.window.append(this.contentbox);
        }

        if (this.escapecloses) {
            $(document).bind("keyup.DialogWindow", function(e) {
                if (e.keyCode === 27) { // escape key maps to keycode `27`
                    me.close();
                }
            });
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

    get clickoutsidetoclose() { return this.config.clickoutsidetoclose; }
    set clickoutsidetoclose(clickoutsidetoclose) { this.config.clickoutsidetoclose = clickoutsidetoclose; }

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get container() { return this._container; }
    set container(container) { this._container = container; }

    get content() { return this.config.content; }
    set content(content) { this.config.content = content; }

    get contentbox() { return this._contentbox; }
    set contentbox(contentbox) { this._contentbox = contentbox; }

    get escapecloses() { return this.config.escapecloses; }
    set escapecloses(escapecloses) { this.config.escapecloses = escapecloses; }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get header() { return this.config.header; }
    set header(header) { this.config.header = header; }

    get headerbox() { return this._headerbox; }
    set headerbox(headerbox) { this._headerbox = headerbox; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get mask() { return this._mask; }
    set mask(mask) { this._mask = mask; }

    get showclose() { return this.config.showclose; }
    set showclose(showclose) { this.config.showclose = showclose; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get titlebox() { return this._titlebox; }
    set titlebox(titlebox) { this._titlebox = titlebox; }

    get window() { return this._window; }
    set window(window) { this._window = window; }

}
