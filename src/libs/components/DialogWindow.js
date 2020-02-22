class DialogWindow {

    static get DEFAULT_CONFIG() {
       return {
           id: null,
           form: null,  // takes a SimpleForm.  If present, displays and renders that. If not, uses content.
           content: '<p />No provided content</p', // This is the content of the dialog
           classes: [],             // apply these classes to the dialog, if any.
           header: null, // DOM object, will be used if passed before title.
           title: null,  // Adds a title to the dialog if present. header must be null.
           trailer: null, // Adds a trailing chunk of DOM.  Can be provided a full dom object
                          // or a string.  If it's a string, it creates a div at the bottom
                          // with the value of the text.
           closetext: 'Close',
           closeicon: 'echx',
           clickoutsidetoclose: true, // Allow the window to be closed by clicking outside.
           escapecloses: true, // Allow the window to be closed by the escape key
           nofocus: false, // If true, do not auto focus anything.
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

        if (!this.id) { this.id = `dialog-${Utils.getUniqueKey(5)}`; }

        this.build();
    }

    /**
     * Opens the dialog window
     */
    open() {
        const me = this;

        this.prevfocus = document.querySelector(':focus');

        this.mask = document.createElement('div');
        this.mask.classList.add('window-mask');
        for (let c of this.classes) {
            this.mask.classList.add(c);
        }
        this.mask.addEventListener('click', function(e) {
            e.preventDefault();
            if (me.clickoutsidetoclose) {
                me.close();
            }
        });
        this.container.appendChild(me.window);

        if ((this.trailer) && (typeof this.trailer === 'string')) {
            let trail = document.createElement('div');
            trail.classList.add('trailer');
            trail.innerHTML = this.trailer;
            this.container.appendChild(trail);
        } else if (this.trailer) { // it's an html object
            this.container.appendChild(this.trailer);
        }

        document.body.appendChild(this.mask);
        document.body.appendChild(this.container);
        document.body.classList.add('modalopen');

        this.escapelistener = function(e) {
            if (e.key === 'Escape') {
                me.close();
            }
        };

        setTimeout(function() {
            if (!me.nofocus) {
                let focusable = me.contentbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusable[0]) {
                    focusable[0].focus();
                }
            }
            if (me.escapecloses) {
                document.addEventListener('keyup', me.escapelistener);
            }
        }, 100);
    }

    /**
     * Closes the dialog window
     */
    close() {
        this.container.parentNode.removeChild(this.container);
        this.mask.parentNode.removeChild(this.mask);
        if (this.prevfocus) {
            this.prevfocus.focus();
        }
        document.body.classList.remove('modalopen');
        document.removeEventListener('keyup', this.escapelistener);
    }

    /**
     * Check to see if escape should close the thing
     * @param e the event.
     */
    escape(e, self) {
        console.log(e.key);
        if (e.key === 'Escape') {
            console.log("asdfadssadfasdfasdads");
            console.log(self);
            self.close();
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Constructs the DialogWindow's DOM elements
     */
    build() {
        const me = this;

        this.container = document.createElement('div');
        this.container.classList.add('window-container');

        this.window = document.createElement('div');
        this.window.classList.add('dialog');
        this.window.setAttribute('id', this.id);

        for (let c of this.classes) {
            this.container.classList.add(c);
            this.window.classList.add(c);
        }

        if ((this.title) || (this.header)) {
            if (!this.header) {
                this.header = document.createElement('h2');
                let span = document.createElement('span');
                span.classList.add('t');
                span.innerHTML = this.title;
                this.header.appendChild(span);
            }
            this.window.appendChild(this.header);

            if (this.showclose) {
                this.closebutton = new SimpleButton({
                    icon: this.closeicon,
                    text: this.closetext,
                    shape: "square",
                    classes: ["naked", "closebutton"],
                    action: function(e) {
                        e.preventDefault();
                        me.close();
                    }
                });
                this.header.appendChild(this.closebutton.button);
            }
        } else if (this.showclose) {
            console.error("Dialog defines 'showclose' but no title is defined.");
        }

        if (this.form) { // it's a SimpleForm

            this.form.dialog = this;

            this.contentbox = document.createElement('div');
            this.contentbox.classList.add('content');
            this.contentbox.appendChild(this.form.form);

            this.window.classList.add('isform');
            this.window.appendChild(this.contentbox);

        } else if (this.content) { // It's a DOM object

            this.contentbox = document.createElement('div');
            this.contentbox.classList.add('content');
            this.contentbox.appendChild(this.content);

            this.window.appendChild(this.contentbox);
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

    get closeicon() { return this.config.closeicon; }
    set closeicon(closeicon) { this.config.closeicon = closeicon; }

    get closetext() { return this.config.closetext; }
    set closetext(closetext) { this.config.closetext = closetext; }

    get content() { return this.config.content; }
    set content(content) { this.config.content = content; }

    get contentbox() { return this._contentbox; }
    set contentbox(contentbox) { this._contentbox = contentbox; }

    get escapecloses() { return this.config.escapecloses; }
    set escapecloses(escapecloses) { this.config.escapecloses = escapecloses; }

    get escapelistener() { return this._escapelistener; }
    set escapelistener(escapelistener) { this._escapelistener = escapelistener; }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get header() { return this.config.header; }
    set header(header) { this.config.header = header; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get mask() { return this._mask; }
    set mask(mask) { this._mask = mask; }

    get nofocus() { return this.config.nofocus; }
    set nofocus(nofocus) { this.config.nofocus = nofocus; }

    get prevfocus() { return this._prevfocus; }
    set prevfocus(prevfocus) { this._prevfocus = prevfocus; }

    get showclose() { return this.config.showclose; }
    set showclose(showclose) { this.config.showclose = showclose; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get trailer() { return this.config.trailer; }
    set trailer(trailer) { this.config.trailer = trailer; }

    get window() { return this._window; }
    set window(window) { this._window = window; }

}
