class Panel {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            dataattributes: null, // A dictionary, key: value, which will end up with data-$key = value on elements
            attributes: null, // A dictionary, key: value, which will end up with $key = value on elements
            contentid : null, // The contentid
            headerid : null, // The headerid
            title: null, // The title
            content : null, // The content payload
            style: 'plain', // Various styles that can be applied to the panel.
                            // - 'plain': simple, spartan, solid.
                            // - 'invisible: panel behaves as normal but the background is transparent
            hidden: false, // set to true to hide
            collapsible: true, // can the panel collapse
            closeicon: 'chevron-up',
            minimized: false, // Start minimized
            classes: [], //Extra css classes to apply,
            onclose: null, // A function to run to when the panel closes. Passed the self.
            onopen: null // A function to run to when the panel opens. Passed the self.
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The panel will have this as it's id." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            dataattributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with data-$key = value on elements." },
            attributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with $key = value on elements" },
            arialabel: { type: 'option', datatype: 'string', description: "The aria-label attribute" },
            hidden: { type: 'option', datatype: 'boolean', description: "If true, start hidden or not." },
            minimized: { type: 'option', datatype: 'boolean', description: "Start collapsed/minimized." },
            collapsible: { type: 'option', datatype: 'boolean', description: "Can the panel collapse? If false, minimized is ignored." },
            onclose: { type: 'option', datatype: 'function', description: "A function to run to when the panel closes. Passed the self." },
            onopen: { type: 'option', datatype: 'function', description: "A function to run to when the panel opens. Passed the self as argument." },
            closeicon: { type: 'option', datatype: 'string', description: "The icon to use in for the close/open button.." },
            contentid: { type: 'option', datatype: 'string', description: "A unique id value. This applies to the panel's content." },
            headerid: { type: 'option', datatype: 'string', description: "A unique id value. This applies to the panel's header." },
            title: { type: 'option', datatype: 'string', description: "The title to use for the panel." },
            content: { type: 'option', datatype: 'object', description: "The panel content payload." },
            style: { type: 'option', datatype: 'enumeration', description: "Various styles that can be applied to the panel. Values are plain' or 'invisible'." }
                             // Various styles that can be applied to the panel.
                            // - 'plain': simple, spartan, solid.
                            // - 'invisible: panel behaves as normal but the background is transparent
        };
    }

    constructor(config) {
        this.config = Object.assign({}, Panel.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `panel-${CFBUtils.getUniqueKey(5)}`; }
        if (!this.contentid) { this.contentid = `panel-c-${CFBUtils.getUniqueKey(5)}`; }
        if (!this.headerid) { this.headerid = `panel-h-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Toggle panel minimization
     */
    toggleClose() {
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
     * Build the header.
     */
    buildHeader() {
        const me = this;
        this.header = document.createElement('h3');
        this.header.classList.add('panelheader');
        if (this.collapsible) {
            this.togglebutton = new SimpleButton({
                id: this.headerid,
                secondicon: this.closeicon,
                text: this.title,
                naked: true,
                iconclasses: ['headerbutton'],
                classes: ['headerbutton'],
                action: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.toggleClose();
                }
            });
            this.header.appendChild(this.togglebutton.button);
        } else {
            this.header.classList.add('nocollapse');
            this.header.innerHTML = this.title;
        }
    }

    /**
     * Build the HTML elements of the Panel
     */
    buildContainer() {

        this.container = document.createElement('div');
        this.container.classList.add('panel');
        this.container.setAttribute('aria-expanded', 'true');

        this.contentbox = document.createElement('div');
        this.contentbox.classList.add('content');
        this.contentbox.setAttribute('role', 'region');

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.title) {
            this.container.append(this.header);
            this.contentbox.setAttribute('aria-labelledby', this.headerid);
        }
        if (this.content) {
            this.contentbox.appendChild(this.content);
        }

        CFBUtils.applyAttributes(this.attributes, this.container);
        CFBUtils.applyDataAttributes(this.dataattributes, this.container);

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
        this.contentbox.innerHTML = '';
        this.content = content;
        this.contentbox.appendChild(this.content);
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get attributes() { return this.config.attributes; }
    set attributes(attributes) { this.config.attributes = attributes; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get dataattributes() { return this.config.dataattributes; }
    set dataattributes(dataattributes) { this.config.dataattributes = dataattributes; }

    get togglebutton() { return this._togglebutton; }
    set togglebutton(togglebutton) { this._togglebutton = togglebutton; }

    get closeicon() { return this.config.closeicon; }
    set closeicon(closeicon) { this.config.closeicon = closeicon; }

    get collapsible() { return this.config.collapsible; }
    set collapsible(collapsible) { this.config.collapsible = collapsible; }

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

    get contentid() { return this.config.contentid; }
    set contentid(contentid) { this.config.contentid = contentid; }

    get contentbox() { return this._contentbox; }
    set contentbox(contentbox) { this._contentbox = contentbox; }

    get header() {
        if (!this._header) { this.buildHeader(); }
        return this._header;
    }
    set header(header) { this._header = header; }

    get headerid() { return this.config.headerid; }
    set headerid(headerid) { this.config.headerid = headerid; }

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
        if (this.togglebutton) {
            this.togglebutton.text = title;
        } else if (this.header) {
            this.header.innerHTML = title;
        }
    }

    get titlecontainer() { return this._titlecontainer; }
    set titlecontainer(titlecontainer) { this._titlecontainer = titlecontainer; }

}
window.Panel = Panel;