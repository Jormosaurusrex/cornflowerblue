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

            closecontrol: true, // show a close control (this removes the panel)
            minimized: false, // Start minimized
            minimizecontrol: true, // show a minimize, maximize icon
            minimiziedtitle: null, // Text to show in the panel if the control is minimized to a bar.
                                    // If not supplied, will use 'title' if also supplied.
            position: 'top-left', // Position for the panel. Valid values:
            // (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)
            classes: [], //Extra css classes to apply,

            onclose: null, // A function to run to when the panel closes. Passed the self.
            onopen: null // A function to run to when the panel opens. Passed the self.

        };
    }

    constructor(config) {
        this.config = Object.assign({}, FloatingPanel.DEFAULT_CONFIG, config);

        if (!this.id) {
            this.id = "panel-" + Utils.getUniqueKey(5);
        }
        if ((!this.minimizedtitle) && (this.title)) { this.minimizedtitle = this.title; }
    }

    /**
     * Build the HTML elements of the Floating Panel
     * @return {jQuery}
     */
    buildContainer() {

        const me = this;

        if (this.closecontrol) {
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
        }

        if (this.minimizecontrol) {
            this.minimizebutton = new SimpleButton({
                icon: "minimize",
                text: "Minimize",
                classes: ["minimize"],
                shape: "square",
                action: function(e) {
                    e.preventDefault();
                    me.toggleMinimization();
                }
            });
        }

        this.container = $('<div />')
            .addClass('panel')
            .addClass(this.style)
            .addClass(this.position)
            .append(this.minimizebutton)
            .append(this.closebutton)
            .append(this.content);

        if ((Utils.isMobile()) || (this.minimized)) {
            this.minimize();
        }

    }

    /**
     * Close and remove the panel
     */
    close() {
        this.container.remove();
    }

    toggleMinimization() {
        if (this.minimized) {
            this.maximize();
            return;
        }
        this.minimize();
    }

    /**
     * Unminimizes the panel
     */
    maximize() {
        this.container.attr('aria-expanded', true);
        this.minimized = false;
    }

    /**
     * Minimizes the panel
     */
    minimize() {
        this.container.removeAttr('aria-expanded');
        this.minimized = true;
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

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get closecontrol() { return this.config.closecontrol; }
    set closecontrol(closecontrol) { this.config.closecontrol = closecontrol; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get content() { return this.config.content; }
    set content(content) { this.config.content = content; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get minimizecontrol() { return this.config.minimizecontrol; }
    set minimizecontrol(minimizecontrol) { this.config.minimizecontrol = minimizecontrol; }

    get minimized() { return this._minimized; }
    set minimized(minimized) { this._minimized = minimized; }

    get minimizebutton() { return this._minimizebutton; }
    set minimizebutton(minimizebutton) { this._minimizebutton = minimizebutton; }

    get minimizedtitle() { return this.config.minimizedtitle; }
    set minimizedtitle(minimizedtitle) { this.config.minimizedtitle = minimizedtitle; }

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

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

}