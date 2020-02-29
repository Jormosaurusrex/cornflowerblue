class ToolTip {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            icon: 'help-circle',
            tipicon: 'help-circle',
            iconclasses: [], // Classes to apply to the icon
            text: null, // The text to use
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, ToolTip.DEFAULT_CONFIG, config);
        return this;
    }

    attach(parent) {
        if (parent.container) {
           parent = parent.container;
        }
        parent.appendChild(this.container);
        parent.setAttribute('data-tooltip', 'closed');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Force the tooltip to stay open.
     */
    stayopen() {
        this.container.classList.add('stayopen');
        this.open();
    }

    /**
     * Opens the help tooltip
     */
    open() {
        console.log('open');
        const me = this;
        this.container.removeAttribute('aria-hidden');
        setTimeout(function() {
            me.container.style.top = `calc(0px - ${me.container.style.height} - .5em)`;
        },1);
    }

    /**
     * Closes the help tooltip.
     */
    close() {
        if (this.container.classList.contains('stayopen')) { return; }
        this.container.setAttribute('aria-hidden', 'true');
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full container
     */
    buildContainer() {
        const me = this;
        this.container = document.createElement('div');
        this.container.classList.add('tooltip');
        this.container.setAttribute('aria-hidden', 'true');
        if (this.id) { this.container.setAttribute('id', this.id); }

        if ((this.tipicon) && (this.tipicon !== '')) {
            let icon = IconFactory.icon(this.tipicon);
            icon.classList.add('tipicon');
            if ((this.iconclasses) && (this.iconclasses.length > 0)) {
                for (let ic of this.iconclasses) {
                    icon.classList.add(ic);
                }
            }
            this.container.appendChild(icon);
        }

        this.tiptext = document.createElement('div');
        this.tiptext.classList.add('tiptext');
        this.tiptext.setAttribute('id', `${this.id}-tt`);
        if (this.text) {
            this.tiptext.innerHTML = this.text;
        }

        this.closebutton = new CloseButton({
            action: function(e) {
                e.preventDefault();
                e.stopPropagation();
                me.container.classList.remove('stayopen');
                me.close();
            }
        });

        if ((this.iconclasses) && (this.iconclasses.length > 0)) {
            for (let ic of this.iconclasses) {
                if (icon) { icon.classList.add(ic); }
                if (secondicon) { secondicon.classList.add(ic); }
            }
        }

        this.container.appendChild(this.tiptext);
        this.container.appendChild(this.closebutton.button);

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

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helptext() { return this._helptext; }
    set helptext(helptext) { this._helptext = helptext; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get iconclasses() { return this.config.iconclasses; }
    set iconclasses(iconclasses) { this.config.iconclasses = iconclasses; }

    get iconside() { return this.config.iconside; }
    set iconside(iconside) { this.config.iconside = iconside; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

    get tipicon() { return this.config.tipicon; }
    set tipicon(tipicon) { this.config.tipicon = tipicon; }

    get tiptext() { return this._tiptext; }
    set tiptext(tiptext) { this._tiptext = tiptext; }

    get tooltip() { return this._tooltip; }
    set tooltip(tooltip) { this._tooltip = tooltip; }


}
