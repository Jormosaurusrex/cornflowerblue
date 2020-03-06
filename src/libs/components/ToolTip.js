class ToolTip {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            icon: 'help-circle',
            iconclasses: [], // Classes to apply to the icon
            text: null, // The text to use,
            parent: null, // the parent object to fire off
            waittime: 1000, // how long to wait before activating
            classes: [] //Extra css classes to apply
        };
    }


    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, ToolTip.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `tt-${CFBUtils.getUniqueKey(5)}`; }
        return this;
    }

    /**
     * Attach the tooltip to its parent.  Will reset an existing parent if one is provided
     * during construction.
     * @param parent
     */
    attach(parent) {
        const me = this;
        if ((parent) && (parent.container)) {
           parent = parent.container;
        }
        this.parent = parent;
        this.parent.appendChild(this.container);
        this.parent.setAttribute('data-tooltip', 'closed');
        this.parent.addEventListener('mouseover', function() {
            me.timer = setTimeout(function() {
                me.open();
            }, me.waittime);
        });
        this.parent.addEventListener('mouseout', function() {
            clearTimeout(me.timer);
            me.close();
        });
        this.parent.addEventListener('focusin', function() {
            me.timer = setTimeout(function() {
                me.open();
            }, me.waittime);
        });
        this.parent.addEventListener('focusout', function() {
            clearTimeout(me.timer);
            me.close();
        });
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Opens the help tooltip
     */
    open() {
        const me = this;

        if (ToolTip.activeTooltip) {
            ToolTip.activeTooltip.close();
        }

        document.body.appendChild(this.container);
        this.container.removeAttribute('aria-hidden');

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.parent.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top;

        this.container.style.top = `${(offsetTop - me.container.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
        this.container.style.left = `${offsetLeft - CFBUtils.getSingleEmInPixels()}px`;

        if (typeof ToolTip.activeTooltip === 'undefined' ) {
            ToolTip.activeTooltip = this;
        } else {
            ToolTip.activeTooltip = this;
        }
    }

    /**
     * Closes the help tooltip.
     */
    close() {
        this.container.setAttribute('aria-hidden', 'true');
        this.parent.appendChild(this.container);
        ToolTip.activeTooltip = null;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('tooltip');
        this.container.setAttribute('aria-hidden', 'true');
        if (this.id) { this.container.setAttribute('id', this.id); }

        if ((this.classes) && (this.classes.length > 0)) {
            for (let c of this.classes) {
                this.container.classList.add(c);
            }
        }

        if ((this.icon) && (this.icon !== '')) {
            let icon = IconFactory.icon(this.icon);
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
        this.tiptext.setAttribute('id', `${this.id}-text`);
        if (this.text) {
            this.tiptext.innerHTML = this.text;
        }

        this.container.appendChild(this.tiptext);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get iconclasses() { return this.config.iconclasses; }
    set iconclasses(iconclasses) { this.config.iconclasses = iconclasses; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get parent() { return this.config.parent; }
    set parent(parent) { this.config.parent = parent; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

    get timer() { return this._timer; }
    set timer(timer) { this._timer = timer; }

    get tiptext() { return this._tiptext; }
    set tiptext(tiptext) { this._tiptext = tiptext; }

    get tooltip() { return this._tooltip; }
    set tooltip(tooltip) { this._tooltip = tooltip; }

    get waittime() { return this.config.waittime; }
    set waittime(waittime) { this.config.waittime = waittime; }

}
