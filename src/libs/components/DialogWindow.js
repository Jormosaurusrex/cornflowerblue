class DialogWindow {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            form: null,  // takes a SimpleForm.  If present, displays and renders that. If not, uses content.
            actions: null, // An array of actions. Can be buttons or keyword strings.Only used if form is null.
            // Possible keywords:  closebutton, cancelbutton
            content: null,
            onclose: null,
            screen: document.body,
            classes: [],             // apply these classes to the dialog, if any.
            header: null, // DOM object, will be used if passed before title.
            lightbox: false,    // For image types, if true, open the image in a lightbox
            title: null,  // Adds a title to the dialog if present. header must be null.
            trailer: null, // Adds a trailing chunk of DOM.  Can be provided a full dom object
                           // or a string.  If it's a string, it creates a div at the bottom
                           // with the value of the text.
            clickoutsidetoclose: true, // Allow the window to be closed by clicking outside.
            escapecloses: true, // Allow the window to be closed by the escape key
            nofocus: false, // If true, do not auto focus anything.
            canceltext: TextFactory.get('cancel'),
            closetext: TextFactory.get('close'), // Text for the closebutton, if any
            showclose: true  // Show or hide the X button in the corner (requires title != null)
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The dialog object will have this as it's id." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            form: { type: 'option', datatype: 'simpleform', description: "If present, displays and renders the form as its content. If not, uses the value of <code>content</code>."},
            actions: { type: 'option', datatype: 'array', description: "An array of actions. Can be SimpleButtons or keyword strings. Only used if form is null (actions exist on SimpleForm objects as well).  Possible keywords:  closebutton, cancelbutton" },
            screen: { type: "option", datatype: 'domobject', description: "The DOM element to load the dialog into.  Defaults to the body." },
            content: { type: 'option', datatype: 'domobject', description: "This is the content of the dialog.  Ignored if provided a <code>form</code>."},
            header: { type: 'option', datatype: 'domobject', description: "DOM object, will be used if passed before title."},
            title: { type: 'option', datatype: 'string', description: "Adds a title to the dialog if present. header must be null." },
            trailer: { type: 'option', datatype: 'domobject', description: "Adds a trailing chunk of DOM.  Can be provided a full dom object or a string.  If it's a string, it creates a div at the bottom with the value of the text." },
            canceltext: { type: 'option', datatype: 'string', description: "Text used for cancel buttons provided as keywords." },
            closetext: { type: 'option', datatype: 'string', description: "Text used for close buttons provided as keywords." },
            onclose: { type: 'option', datatype: 'function', description: "What to do when closing. Passed (self) as an argument." },

            lightbox: { type: 'option', datatype: 'boolean', description: "For image types, if true, open the image in a lightbox." },
            clickoutsidetoclose: { type: 'option', datatype: 'boolean', description: "Allow the window to be closed by clicking outside." },
            escapecloses: { type: 'option', datatype: 'boolean', description: "Allow the window to be closed by the escape key." },
            nofocus: { type: 'option', datatype: 'boolean', description: "If true, do not auto focus anything." },
            showclose: { type: 'option', datatype: 'boolean', description: "Show or hide the CloseButton in the corner." }
        };
    }

    /**
     * Define a DialogWindow
     * @param config a dictionary object
     * @return DialogWindow
     */
    constructor(config) {
        this.config = Object.assign({}, DialogWindow.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `dialog-${CFBUtils.getUniqueKey(5)}`; }

        this.build();
    }

    /**
     * Opens the dialog window
     */
    open() {
        CFBUtils.closeOpen();

        this.prevfocus = document.querySelector(':focus');

        this.mask = document.createElement('div');
        this.mask.classList.add('window-mask');
        for (let c of this.classes) {
            this.mask.classList.add(c);
        }
        this.mask.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.clickoutsidetoclose) {
                this.close();
            }
        });
        this.container.appendChild(this.window);

        if ((this.trailer) && (typeof this.trailer === 'string')) {
            let trail = document.createElement('div');
            trail.classList.add('trailer');
            trail.innerHTML = this.trailer;
            this.container.appendChild(trail);
        } else if (this.trailer) { // it's an html object
            this.container.appendChild(this.trailer);
        }

        this.screen.appendChild(this.mask);
        this.screen.appendChild(this.container);
        this.screen.classList.add('modalopen');

        this.escapelistener = (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };

        setTimeout(() => {
            if (!this.nofocus) {
                let focusable = this.contentbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusable[0]) {
                    focusable[0].focus();
                }
            }
            if (this.escapecloses) {
                document.addEventListener('keyup', this.escapelistener);
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
        this.screen.classList.remove('modalopen');
        this.screen.removeEventListener('keyup', this.escapelistener);
        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }
    }

    /**
     * Check to see if escape should close the thing
     * @param e the event.
     */
    escape(e, self) {
        if (e.key === 'Escape') {
            self.close();
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Constructs the DialogWindow's DOM elements
     */
    build() {

        this.container = document.createElement('div');
        this.container.classList.add('window-container');

        this.window = document.createElement('div');
        this.window.classList.add('dialog');
        this.window.setAttribute('id', this.id);

        for (let c of this.classes) {
            this.container.classList.add(c);
            this.window.classList.add(c);
        }
        if (this.lightbox) {
            this.container.classList.add('lightbox');
            this.window.classList.add('lightbox');
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
        }
        if (this.showclose) {
            this.closebutton = new CloseButton({
                action: (e) => {
                    e.preventDefault();
                    this.close();
                }
            });
            if ((this.title) || (this.header)) {
                this.header.appendChild(this.closebutton.button);
            } else {
                this.window.classList.add('noheader');
                this.window.appendChild(this.closebutton.button);
            }
        }

        if (this.form) { // it's a SimpleForm

            this.form.dialog = this;

            if ((this.actions) && (this.actions.length > 0)) {
                for (let a of this.actions) {
                    if (typeof a === 'string') { // it's a keyword
                        switch(a) {
                            case 'closebutton':
                                this.form.actions.push(new SimpleButton({
                                    text: this.closetext,
                                    mute: true,
                                    classes: ['closebutton'],
                                    action: () => {
                                        this.close();
                                    }
                                }));
                                break;
                            case 'cancelbutton':
                                this.form.actions.push(new DestructiveButton({
                                    text: this.canceltext,
                                    mute: true,
                                    classes: ['cancelbutton'],
                                    action: () => {
                                        this.close();
                                    }
                                }));
                                break;
                            default:
                                break;
                        }
                    } else {
                        this.form.actions.push(a);
                    }
                }
            }

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

            if ((this.actions) && (this.actions.length > 0)) {
                this.actionbox = document.createElement('div');
                this.actionbox.classList.add('actions');
                for (let a of this.actions) {
                    if (typeof a === 'string') { // it's a keyword
                        switch(a) {
                            case 'closebutton':
                                this.actionbox.appendChild(new SimpleButton({
                                    text: this.closetext,
                                    mute: true,
                                    action: () => {
                                        this.close();
                                    }
                                }).container);
                                break;
                            case 'cancelbutton':
                                this.actionbox.appendChild(new DestructiveButton({
                                    text: this.canceltext,
                                    mute: true,
                                    action: () => {
                                        this.close();
                                    }
                                }).container);
                                break;
                            default:
                                break;
                        }
                    } else {
                        this.actionbox.appendChild(a.container);
                    }
                }
                this.window.appendChild(this.actionbox);
            }
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get actionbox() { return this._actionbox; }
    set actionbox(actionbox) { this._actionbox = actionbox; }

    get actions() { return this.config.actions; }
    set actions(actions) { this.config.actions = actions; }

    get canceltext() { return this.config.canceltext; }
    set canceltext(canceltext) { this.config.canceltext = canceltext; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get clickoutsidetoclose() { return this.config.clickoutsidetoclose; }
    set clickoutsidetoclose(clickoutsidetoclose) { this.config.clickoutsidetoclose = clickoutsidetoclose; }

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get closetext() { return this.config.closetext; }
    set closetext(closetext) { this.config.closetext = closetext; }

    get container() { return this._container; }
    set container(container) { this._container = container; }

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

    get lightbox() { return this.config.lightbox ; }
    set lightbox(lightbox) { this.config.lightbox = lightbox; }

    get mask() { return this._mask; }
    set mask(mask) { this._mask = mask; }

    get nofocus() { return this.config.nofocus; }
    set nofocus(nofocus) { this.config.nofocus = nofocus; }

    get onclose() { return this.config.onclose; }
    set onclose(onclose) { this.config.onclose = onclose; }

    get prevfocus() { return this._prevfocus; }
    set prevfocus(prevfocus) { this._prevfocus = prevfocus; }

    get screen() { return this.config.screen; }
    set screen(screen) { this.config.screen = screen; }

    get showclose() { return this.config.showclose; }
    set showclose(showclose) { this.config.showclose = showclose; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get trailer() { return this.config.trailer; }
    set trailer(trailer) { this.config.trailer = trailer; }

    get window() { return this._window; }
    set window(window) { this._window = window; }

}
window.DialogWindow = DialogWindow;