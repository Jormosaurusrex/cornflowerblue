class Accordion {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            title: null, // The title
            content : null, // The content payload

            style: 'plain', // Various styles that can be applied to the panel.
                            // - 'plain': simple, spartan, solid.
                            // - 'ghost': similar to 'plain' except that it turns
                            //            translucent when not in focus or hover
                            // - 'invisible: panel behaves as normal but the background is transparent

            hidden: false, // set to true to hide
            togglecontrol: true, // show a visibility toggle
            closetext: "Close",
            closeicon: 'triangle-down-circle',
            minimized: false, // Start minimized
            classes: [], //Extra css classes to apply,

            onclose: null, // A function to run to when the panel closes. Passed the self.
            onopen: null // A function to run to when the panel opens. Passed the self.

        };
    }

    constructor(config) {
        this.config = Object.assign({}, Accordion.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `panel-${Utils.getUniqueKey(5)}`; }
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Toggle panel minimization
     */
    toggleClose() {
        console.log(`toggleclose: ${this.minimized}`);
        if (this.minimized) {
            this.open();
            return;
        }
        this.close();
    }

    /**
     * Unminimize the panel
     */
    open() {
        this.minimized = false;
        this.container.setAttribute('aria-expanded', 'true');
        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }
    }

    /**
     * Minimize the panel
     */
    close() {
        this.container.setAttribute('aria-expanded', 'false');
        this.minimized = true;
        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }
    }

    /**
     * Show the panel
     */
    show() {
        this.container.removeAttribute('aria-hidden');
    }

    /**
     * Hide the panel
     */
    hide() {
        this.container.setAttribute('aria-hidden', 'true');
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the title box section.
     */
    buildTitleBox() {
        const me = this;
        this.titlebox = document.createElement('div');
        this.titlebox.classList.add('titlebox');
        this.titlebox.addEventListener('click', function(e) {
            e.preventDefault();
            me.toggleClose();
        });

        this.header = document.createElement('h3');
        this.header.innerHTML = this.title;
        this.titlebox.appendChild(this.header);

        if (this.togglecontrol) {
            this.togglebutton = new CloseButton({
                icon: this.closeicon,
                text: this.closetext,
                iconclasses: ['togglebutton'],
                action: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.toggleClose();
                }
            });
            this.titlebox.appendChild(this.togglebutton.button);
        }
    }

    /**
     * Build the HTML elements of the Floating Panel
     */
    buildContainer() {

        this.container = document.createElement('div');
        this.container.classList.add('panel');
        this.container.setAttribute('aria-expanded', 'true');

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        this.container.append(this.titlebox);

        this.contentbox = document.createElement('div');
        this.contentbox.classList.add('content');
        if (this.content) {
            this.contentbox.appendChild(this.content);
        }

        this.container.appendChild(this.contentbox);

        if (this.minimized) { // don't call close() to avoid the callbacks.
            this.container.setAttribute('aria-expanded', 'false');
            this.minimized = true;
        }

        if (this.hidden) { this.hide(); }
    }

    /**
     * Replace the content with other content
     * @param content the content to place
     */
    replace(content) {
        this.content.parentNode.removeChild(this.content);
        this.content = content;
        this.container.appendChild(this.content);
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

    get togglebutton() { return this._togglebutton; }
    set togglebutton(togglebutton) { this._togglebutton = togglebutton; }

    get togglecontrol() { return this.config.togglecontrol; }
    set togglecontrol(togglecontrol) { this.config.togglecontrol = togglecontrol; }

    get closeicon() { return this.config.closeicon; }
    set closeicon(closeicon) { this.config.closeicon = closeicon; }

    get closetext() { return this.config.closetext; }
    set closetext(closetext) { this.config.closetext = closetext; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get content() { return this.config.content; }
    set content(content) {
        if (this.pcontent) { this.pcontent.innerHTML = content; }
        this.config.content = content;
    }

    get contentbox() { return this._contentbox; }
    set contentbox(contentbox) { this._contentbox = contentbox; }

    get header() { return this._header; }
    set header(header) { this._header = header; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get minimized() { return this.config.minimized; }
    set minimized(minimized) { this.config.minimized = minimized; }

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

    get pcontent() { return this._pcontent; }
    set pcontent(pcontent) { this._pcontent = pcontent; }

    get position() { return this.config.position; }
    set position(position) { this.config.position = position; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

    get title() { return this.config.title; }
    set title(title) {
        this.config.title = title;
        if (this.titleactual) { this.titleactual.innerHTML = title; }
    }

    get titleactual() { return this._titleactual; }
    set titleactual(titleactual) { this._titleactual = titleactual; }

    get titlebox() {
        if (!this._titlebox) { this.buildTitleBox(); }
        return this._titlebox;
    }
    set titlebox(titlebox) { this._titlebox = titlebox; }

    get titlecontainer() { return this._titlecontainer; }
    set titlecontainer(titlecontainer) { this._titlecontainer = titlecontainer; }

}