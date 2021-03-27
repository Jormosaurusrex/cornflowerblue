class Panel {

    static get DEFAULT_CONFIG() {
        return {
            id : null,
            savestateprefix: 'panel',
            assection : false,
            dataattributes: null,
            attributes: null,
            contentid : null,
            headerid : null,
            title: null,
            iconprefix: 'cfb',
            icon: null,
            content : null,
            style: 'plain',
            hidden: false,
            collapsible: true,
            stateful: true,
            closeicon: 'echx',
            closeiconclosed: 'chevron-down-thin',
            closeiconprefix: 'cfb',
            closeiconclosedprefix: 'cfb',
            minimized: false,
            classes: [],
            footer: null,
            onclose: null,
            onopen: null
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
            assection: { type: 'option', datatype: 'boolean', description: "If true, use the html element 'section' over 'div'" },
            minimized: { type: 'option', datatype: 'boolean', description: "Start collapsed/minimized." },
            stateful: { type: 'option', datatype: 'boolean', description: "Remember open or closed state. Saves to local storage. Must also have an 'id' set." },
            collapsible: { type: 'option', datatype: 'boolean', description: "Can the panel collapse? If false, minimized is ignored." },
            icon: { type: 'option', datatype: 'string', description: "If present, will be attached to the text inside the button. This can be passed a DOM object." },
            iconprefix: { type: 'option', datatype: 'string', description: "Changes the icon class prefix." },
            onclose: { type: 'option', datatype: 'function', description: "A function to run to when the panel closes. Passed the self." },
            onopen: { type: 'option', datatype: 'function', description: "A function to run to when the panel opens. Passed the self as argument." },
            closeicon: { type: 'option', datatype: 'string', description: "The icon to use in for the close/open button.." },
            contentid: { type: 'option', datatype: 'string', description: "A unique id value. This applies to the panel's content." },
            headerid: { type: 'option', datatype: 'string', description: "A unique id value. This applies to the panel's header." },
            footer: { type: 'option', datatype: 'DOM object', description: "Will be appended at the end." },
            title: { type: 'option', datatype: 'string', description: "The title to use for the panel." },
            content: { type: 'option', datatype: 'object', description: "The panel content payload." },
            style: { type: 'option', datatype: 'enumeration', description: "Various styles that can be applied to the panel. Values are plain' or 'invisible'." }
        };
    }

    constructor(config) {
        this.config = Object.assign({}, Panel.DEFAULT_CONFIG, config);
        if (!this.id) { this.stateful = false; } // turn this off; we can't use random ids.
        if (!this.id) { this.id = `panel-${CFBUtils.getUniqueKey(5)}`; }

        let state = localStorage.getItem(`cfb-panel-minimized-${this.id}`);
        if ((state) && (state === 'true')) {
            this.minimized = true;
        } else if ((state) && (state === 'false')) {
            this.minimized = false;
        }
        if (this.id) {
            this.savekey = `${this.statesaveprefix}-state-${this.id}`;
        } else {
            this.id = `${this.statesaveprefix}-${CFBUtils.getUniqueKey(5)}`;
        }

        if (!this.contentid) { this.contentid = `panel-c-${CFBUtils.getUniqueKey(5)}`; }
        if (!this.headerid) { this.headerid = `panel-h-${CFBUtils.getUniqueKey(5)}`; }

        this.loadstate();

    }

    finalize() {
        this.applystate();
    }

    /* PERSISTENCE METHODS______________________________________________________________ */

    /**
     * Test if this can be persisted.
     * @return {boolean}
     */
    get ispersistable() {
        return !!((this.savestate) && (this.savekey) && (window.localStorage));
    }

    /**
     * Persist the state
     */
    persist() {
        if (!this.ispersistable) { return; }
        this.state = this.grindstate(); // get a current copy of it.
        localStorage.setItem(this.savekey, JSON.stringify(this.state));
    }

    /**
     * Load a saved state from local storage
     */
    loadstate() {
        if (this.ispersistable) {
            this.state = JSON.parse(localStorage.getItem(this.savekey));
            if (!this.state) {
                this.state = this.grindstate();
            }
        } else if (!this.state) {
            this.state = this.grindstate();
        }
    }

    /**
     * Apply the saved state.
     */
    applystate() {
        if (!this.collapsible) { return; }
        if (this.state.minimized) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Figures out the state of the panel and generates the state object
     */
    grindstate() {
        return {
            minimized: this.minimized
        };
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
        this.state.minimized = this.minimized;
        this.persist();
        if ((this.closeicon) && (this.closeiconclosed)) {
            this.togglebutton.setIcon(this.closeicon, this.closeiconprefix, true);
        }
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
        this.state.minimized = this.minimized;
        this.persist();
        if ((this.closeicon) && (this.closeiconclosed)) {
            this.togglebutton.setIcon(this.closeiconclosed, this.closeiconclosedprefix, true);
        }
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
        this.header = document.createElement('h3');
        this.header.classList.add('panelheader');
        if (this.icon) {
            this.header.classList.add('hasicon');
        }
        if (this.collapsible) {
            let closeicon = this.closeicon,
                closeiconprefix = this.closeiconprefix;
            if (this.minimized) {
                closeicon = this.closeiconclosed;
                closeiconprefix = this.closeiconprefix;
            }
            this.togglebutton = new SimpleButton({
                id: this.headerid,
                secondicon: closeicon,
                iconprefixsecond: closeiconprefix,
                icon: this.icon,
                iconprefix: this.iconprefix,
                text: this.title,
                naked: true,
                iconclasses: ['headerbutton'],
                secondiconclasses: ['panelclose'],
                classes: ['headerbutton'],
                action: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleClose();
                }
            });
            if (this.closeicon) {
                let cbutton = this.togglebutton.button.querySelector('span.secondicon');
                if (cbutton) {
                    new ToolTip({
                        icon: null,
                        text: TextFactory.get('close_pane')
                    }).attach(cbutton)
                }
            }
            this.header.appendChild(this.togglebutton.button);
        } else {
            this.header.classList.add('nocollapse');
            this.header.innerHTML = this.title;
        }
    }

    buildContentBox() {
        this.contentbox = document.createElement('div');
        this.contentbox.classList.add('content');
        this.contentbox.setAttribute('role', 'region');
    }

    /**
     * Build the HTML elements of the Panel
     */
    buildContainer() {

        if (this.assection) {
            this.container = document.createElement('section');
        } else {
            this.container = document.createElement('div');
        }
        this.container.classList.add('panel');
        this.container.setAttribute('aria-expanded', 'true');

        this.container.appendChild(this.contentbox);

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.title) {
            this.container.appendChild(this.header);
            this.contentbox.setAttribute('aria-labelledby', this.headerid);
        }
        if (this.content) {
            this.contentbox.appendChild(this.content);
        }

        CFBUtils.applyAttributes(this.attributes, this.container);
        CFBUtils.applyDataAttributes(this.dataattributes, this.container);

        this.container.appendChild(this.contentbox);

        if (this.footer) {
            this.container.appendChild(this.footer);
        }

        if (this.minimized) { // don't call close() to avoid the callbacks.
            this.container.setAttribute('aria-expanded', 'false');
            if ((this.closeicon) && (this.closeiconclosed)) {
                this.togglebutton.setIcon(this.closeiconclosed, this.closeiconclosedprefix, true);
            }
        } else {
            this.container.setAttribute('aria-expanded', 'true');
            if ((this.closeicon) && (this.closeiconclosed)) {
                this.togglebutton.setIcon(this.closeicon, this.closeiconprefix, true);
            }
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

    get assection() { return this.config.assection; }
    set assection(assection) { this.config.assection = assection; }

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

    get closeiconclosed() { return this.config.closeiconclosed; }
    set closeiconclosed(closeiconclosed) { this.config.closeiconclosed = closeiconclosed; }

    get closeiconprefix() { return this.config.closeiconprefix; }
    set closeiconprefix(closeiconprefix) { this.config.closeiconprefix = closeiconprefix; }

    get closeiconclosedprefix() { return this.config.closeiconclosedprefix; }
    set closeiconclosedprefix(closeiconclosedprefix) { this.config.closeiconclosedprefix = closeiconclosedprefix; }

    get collapsible() { return this.config.collapsible; }
    set collapsible(collapsible) { this.config.collapsible = collapsible; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get content() { return this.config.content; }
    set content(content) { this.config.content = content; }

    get contentid() { return this.config.contentid; }
    set contentid(contentid) { this.config.contentid = contentid; }

    get contentbox() {
        if (!this._contentbox) { this.buildContentBox(); }
        return this._contentbox;
    }
    set contentbox(contentbox) { this._contentbox = contentbox; }

    get footer() { return this.config.footer; }
    set footer(footer) { this.config.footer = footer; }

    get header() {
        if (!this._header) { this.buildHeader(); }
        return this._header;
    }
    set header(header) { this._header = header; }

    get headerid() { return this.config.headerid; }
    set headerid(headerid) { this.config.headerid = headerid; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get iconprefix() { return this.config.iconprefix; }
    set iconprefix(iconprefix) { this.config.iconprefix = iconprefix; }

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

    get position() { return this.config.position; }
    set position(position) { this.config.position = position; }

    get savekey() { return this._savekey; }
    set savekey(savekey) { this._savekey = savekey; }

    get savestate() { return this.config.savestate; }
    set savestate(savestate) { this.config.savestate = savestate; }

    get state() { return this._state; }
    set state(state) { this._state = state; }

    get statesaveprefix() { return this.config.statesaveprefix; }
    set statesaveprefix(statesaveprefix) { this.config.statesaveprefix = statesaveprefix; }

    get stateful() { return this.config.stateful; }
    set stateful(stateful) { this.config.stateful = stateful; }

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