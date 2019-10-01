"use strict";

class FloatingPanel {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            title: null, // The title
            content : null, // The content payload
            style: 'plain', // Various styles that can be applied to the panel.
            // - 'plain': simple, spartan, solid.
            // - 'ghost': similar to 'plain' except that it turns translucent when not in focus or hover
            // - 'invisible: panel behaves as normal but the background is transparent

            hidden: false, // set to true to hide
            togglecontrol: true, // show a visibility toggle
            closeicon: 'triangle-down-circle',
            minimized: false, // Start minimized
            position: 'top-left', // Position for the panel. Valid values:
            // (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)
            classes: [], //Extra css classes to apply,

            onclose: null, // A function to run to when the panel closes. Passed the self.
            onopen: null // A function to run to when the panel opens. Passed the self.

        };
    }

    constructor(config) {
        this.config = Object.assign({}, FloatingPanel.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `panel-${Utils.getUniqueKey(5)}`; }
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
        this.container.setAttribute('aria-expanded', 'true');
        this.pcontent.setAttribute('aria-hidden', 'false');
        this.minimized = false;
        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }
    }

    /**
     * Minimize the panel
     */
    close() {
        this.container.setAttribute('aria-expanded', 'false');
        this.pcontent.setAttribute('aria-hidden', 'true');
        this.minimized = true;
        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }
    }

    show() {
        this.container.removeAttribute('aria-hidden');
    }

    hide() {
        this.container.setAttribute('aria-hidden', 'true');
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the HTML elements of the Floating Panel
     * @return {jQuery}
     */
    buildContainer() {

        const me = this;

        this.container = document.createElement('div');
        this.container.classList.add('panel');
        this.container.classList.add(this.style);
        this.container.classList.add(this.position);

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.togglecontrol) {
            this.togglebutton = new SimpleButton({
                icon: this.closeicon,
                text: "Close",
                naked: true,
                shape: "square",
                classes: ["togglebutton"],
                action: function(e) {
                    e.preventDefault();
                }
            });
        }

        if (this.title) {
            this.titlecontainer = document.createElement('h3');
            this.titlecontainer.addEventListener('click', function(e) {
                    e.preventDefault();
                    me.toggleClose();
                });
            if (this.togglecontrol) {
                this.titlecontainer.appendChild(this.togglebutton.button);
            }
            this.titleactual = document.createElement('span');
            this.titleactual.classList.add('text');
            this.titleactual.innerHTML = this.title;
            this.titlecontainer.appendChild(this.titleactual);
        } else {
            if (this.togglecontrol) {
                this.container.appendChild(this.togglebutton.button);
            }
        }

        this.pcontent = document.createElement('div');
        this.pcontent.classList.add('pcontent');
        this.pcontent.appendChild(this.content);

        this.contentbox = document.createElement('div');
        this.contentbox.classList.add('content');
        if (this.title) { this.contentbox.appendChild(this.titlecontainer) };
        this.contentbox.appendChild(this.pcontent);

        this.container.appendChild(this.contentbox);

        if ((Utils.isMobile()) || (this.minimized)) {
            this.close();
        } else {
            this.open();
        }

        if (this.hidden) { this.hide(); }
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

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get minimized() { return this._minimized; }
    set minimized(minimized) { this._minimized = minimized; }

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

    get titlecontainer() { return this._titlecontainer; }
    set titlecontainer(titlecontainer) { this._titlecontainer = titlecontainer; }

}