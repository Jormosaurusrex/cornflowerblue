class SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            aslink: false,
            href: null,
            payload: null,
            dataattributes: null,
            attributes: null,
            submits: false,
            arialabel: null,
            cansubmit: true,
            text: null,
            shape: null,
            size: 'medium',
            form: null,
            hidden: false,
            tooltip: null,
            iconprefix: 'cfb',
            icon: null,
            iconclasses: [],
            iconprefixsecond: 'cfb',
            tipicon: null,
            tipgravity: 'n',
            classes: [],
            image: null,
            iconside: 'left',
            secondicon : null,
            notab: false,
            disabled: false,
            badgevalue: null,
            mute: false,
            ghost: false,
            link: false,
            naked: false,
            action: null,
            focusin: null,
            focusout: null,
            hoverin: null,
            hoverout: null
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The button object will have this as it's id." },
            aslink: { type: 'option', datatype: 'boolean', description: "Output an <a> object instead of a <button>." },
            href: { type: 'option', datatype: 'url', description: "Use this as the link's href if aslink is true." },
            dataattributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with data-$key = value on elements." },
            payload: { type: 'option', datatype: 'DOM Object',  description: "A complete DOM element, to be used as the button's entire content. If present, this bypasses all other visual options." },
            attributes: { type: 'option', datatype: 'dictionary',  description: "A dictionary, key: value, which will end up with $key = value on elements" },
            arialabel: { type: 'option', datatype: 'string', description: "The aria-label attribute" },
            hidden: { type: 'option', datatype: 'boolean', description: "If true, start hidden or not." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            form: { type: 'option', datatype: 'simpleform', description: "A SimpleForm object this element this is in"},
            image: { type: 'option', datatype: 'url', description: "If provided, use this image for the button." },
            submits: { type: 'option', datatype: 'boolean', description: "If true, forces the button type to be type='submit'" },
            cansubmit: { type: 'option', datatype: 'boolean', description: "If true, advertises to Form objects that it can be used to submit them, if submits is true." },
            text: { type: 'option', datatype: 'string', description: "The text for the button. This is also used as aria-label, if <code>arialabel</code> is unset" },
            shape: { type: 'option', datatype: 'string', description: "Make the button a special shape, with these values: null|square|circle|pill.  Default is null, which makes a rectangle." },
            size: { type: 'option', datatype: 'string', description: "The size of the button: micro, small, medium (default), large, fill" },
            tooltip: { type: 'option', datatype: 'string', description: "An optional tooltip."},
            tipicon: { type: 'option', datatype: 'string', description: "An icon for the tooltip."},
            tipgravity: { type: 'option', datatype: 'string', description: "Tooltip gravity, default 'n'."},
            icon: { type: 'option', datatype: 'string', description: "If present, will be attached to the text inside the button. This can be passed a DOM object." },
            iconprefix: { type: 'option', datatype: 'string', description: "Changes the icon class prefix." },
            iconclasses: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply to ALL icons in the header." },
            iconside: { type: 'option', datatype: 'string', description: "The side the icon displays on - left or right." },
            secondicon: { type: 'option', datatype: 'string', description: "if present, this icon will be placed on the opposite side of the defined 'iconside'.  If this is the only icon defined, it will still be placed.  This is ignored in shaped buttons." },
            notab: {type: 'boolean', datatype: 'string', description: "If true, don't be tabindexed."},
            disabled: {type: 'boolean', datatype: 'string', description: "If true, make the button disabled."},
            badgevalue: {type: 'option', datatype: 'number', description: "If this exists, it adds a badge to the button."},
            mute: {type: 'boolean', datatype: 'string', description: "If true, make the button mute."},
            ghost: {type: 'boolean', datatype: 'string', description: "If true, make the button ghost."},
            link: { type: 'option', datatype: 'boolean', description: "If true, make the button behave like a normal link." },
            naked: {type: 'option', datatype: 'boolean', description: "If true, remove all styles from the button."},
            action: { type: 'option', datatype: 'function', description: "The click handler. Passed (event, self) as arguments. NOT used if 'submits' is true." },
            focusin: { type: 'option', datatype: 'function', description: "The focus in handler. Passed (event, self) as arguments." },
            focusout: { type: 'option', datatype: 'function', description: "The focus out handler. Passed (event, self) as arguments." },
            hoverin: { type: 'option', datatype: 'function', description: "The on hover handler. Passed (event, self) as arguments." },
            hoverout: { type: 'option', datatype: 'function', description: "The off hover handler. Passed (event, self) as arguments." }
        }
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleButton.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `button-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Can this be used to submit a form?
     * Javascript doesn't have great interfaces. This would be on the interface otherwise.
     * Doesn't have a settor.
     * @return {boolean}
     */
    get cansubmit() { return this.config.cansubmit; }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the button
     */
    disable() {
        this.button.setAttribute('aria-disabled', 'true');
        this.disabled = true;
        return this;
    }

    /**
     * Disable the button
     */
    enable() {
        this.button.removeAttribute('aria-disabled');
        this.disabled = false;
        return this;
    }

    /**
     * Show the button
     */
    show() {
        this.button.removeAttribute('aria-hidden');
        this.hidden = false;
        return this;
    }

    /**
     * Hide the button
     */
    hide() {
        this.button.setAttribute('aria-hidden', true);
        this.hidden = true;
        return this;
    }

    /**
     * Open the tooltip.
     */
    openTooltip() {
        if (!this.tooltipobj) { return; }
        this.tooltipobj.open();
    }

    /**
     * Close the tooltip
     */
    closeTooltip() {
        if (!this.tooltipobj) { return; }
        this.tooltipobj.close();
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    setIcon(newicon, iconprefix, secondicon = false) {
        let i = IconFactory.icon(newicon, "", iconprefix);
        if ((this.iconclasses) && (this.iconclasses.length > 0)) {
            for (let ic of this.iconclasses) {
                if (i) { i.classList.add(ic); }
            }
        }
        if (secondicon) {
            i.classList.add('secondicon');
            if (this.secondicon) {
                this.button.replaceChild(i, this.secondiconactual);
                this.secondiconactual = i;
            } else {
                this.secondiconactual = i;
                this.button.appendChild(this.secondiconactual);
            }
        } else {
            if (this.icon) {
                this.button.replaceChild(i, this.iconactual);
                this.iconactual = i;
            } else {
                this.iconactual = i;
                this.button.prepend(this.iconactual);
            }
        }
    }

    /**
     * Builds the button's DOM.
     * @returns DOM representation of the SimpleButton
     */
    buildButton() {

        if (this.text) {
            this.textobj = document.createElement('span');
            this.textobj.classList.add('text');
            this.textobj.innerHTML = this.text;
        }

        if (this.aslink) {
            this.button = document.createElement('a');
            this.button.classList.add('button');
            if (this.href) {
                this.button.setAttribute('href', this.href);
            }
        } else {
            this.button = document.createElement('button');
        }

        if (this.payload) {
            this.payload.classList.add('payload');
            this.button.appendChild(this.payload);
        } else {
            if (this.icon) {
                this.iconactual = IconFactory.icon(this.icon, "", this.iconprefix);
            }
            if (this.secondicon) {
                this.secondiconactual = IconFactory.icon(this.secondicon, "", this.iconprefixsecond);
                this.secondiconactual.classList.add('secondicon');
            }
            if ((this.iconclasses) && (this.iconclasses.length > 0)) {
                for (let ic of this.iconclasses) {
                    if (this.iconactual) { this.iconactual.classList.add(ic); }
                    if (this.secondiconactual) { this.secondiconactual.classList.add(ic); }
                }
            }

            if ((this.iconside) && (this.iconside === 'right')) {
                this.button.classList.add('righticon');
            }
            if (this.iconactual) {
                this.button.appendChild(this.iconactual);
            }
            if (this.textobj) {
                this.button.appendChild(this.textobj);
            }
            if (this.secondiconactual) {
                this.button.appendChild(this.secondiconactual);
            }
        }

        if (this.arialabel) {
            this.button.setAttribute('aria-label', this.arialabel);
        } else if (this.text) {
            this.button.setAttribute('aria-label', this.text);
        }
        this.button.setAttribute('id', this.id);
        this.button.setAttribute('role', 'button');
        this.button.setAttribute('type', (this.submits ? 'submit' : 'button'));
        this.button.classList.add(this.size);

        for (let c of this.classes) {
            this.button.classList.add(c);
        }

        CFBUtils.applyAttributes(this.attributes, this.button);
        CFBUtils.applyDataAttributes(this.dataattributes, this.button);

        this.button.addEventListener('focusin', (e) => {
            if ((this.focusin) && (typeof this.focusin === 'function')) {
                this.focusin(e, this);
            }
        });
        this.button.addEventListener('focusout', (e) => {
            if ((this.focusout) && (typeof this.focusout === 'function')) {
                this.focusout(e, this);
            }
        });
        this.button.addEventListener('mouseover', (e) => {
            if ((this.hoverin) && (typeof this.hoverin === 'function')) {
                this.hoverin(e, this);
            }
        });
        this.button.addEventListener('mouseout', (e) => {
            if ((this.hoverout) && (typeof this.hoverout === 'function')) {
                this.hoverout(e, this);
            }
        });

        if (this.tooltip) {
            this.tooltipobj = new ToolTip({
                id: `${this.id}-tt`,
                text: this.tooltip,
                icon: this.tipicon,
                gravity: this.tipgravity,
            });
            this.tooltipobj.attach(this.button);
        }

        if (this.notab) {
            this.button.setAttribute('tabindex', '-1');
        } else {
            this.button.setAttribute('tabindex', '0');
        }
        if (this.disabled) { this.disable(); }

        if (this.hidden) { this.hide(); }

        if (this.mute) {
            this.button.classList.add('mute');
        } else if (this.ghost) {
            this.button.classList.add('ghost');
        } else if (this.link) {
            this.button.classList.add('link');
        } else if (this.naked) {
            this.button.classList.add('naked');
        }

        if (this.shape) { this.button.classList.add(this.shape); }

        if (this.image) {
            this.button.classList.add('naked');
            this.button.classList.add('image');
            if (!this.shape) { this.button.classList.add('square'); }
            this.button.style.backgroundImage = `url(${this.image})`;
        }

        if ((!this.submits) && (this.action) && (typeof this.action === 'function')) {
            this.button.addEventListener('click', (e) => {
                if (!this.disabled) {
                    this.action(e, this);
                }
            });
        }

        if (this.badgevalue) {
            this.badge = this.badgevalue;
        }
    }

    /**
     * Set the value of a badge on the button. If set to 0 or null, deletes badge.
     * @param value
     */
    set badge(value) {
        if ((value === null) || (value === 0)) {
            if (this.badgeobj) {
                this.button.removeChild(this.badgeobj);
            }
            this.badgeobj = null;
            this.badgevalue = null;
        } else {
            this.badgevalue = value;
            if (!this.badgeobj) {
                this.badgeobj = document.createElement('span');
                this.badgeobj.classList.add('badge');
            }
            this.badgeobj.innerHTML = this.badgevalue;
            this.button.appendChild(this.badgeobj);
        }
    }


    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get action() { return this.config.action; }
    set action(action) {
        if (typeof action !== 'function') {
            console.error("Action provided to button is not a function!");
        }
        this.config.action = action;
    }

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get aslink() { return this.config.aslink; }
    set aslink(aslink) { this.config.aslink = aslink; }

    get attributes() { return this.config.attributes; }
    set attributes(attributes) { this.config.attributes = attributes; }

    get badgeobj() { return this._badgeobj; }
    set badgeobj(badgeobj) { this._badgeobj = badgeobj; }

    get badgevalue() { return this.config.badgevalue; }
    set badgevalue(badgevalue) { this.config.badgevalue = badgevalue; }

    get button() {
        if (!this._button) { this.buildButton(); }
        return this._button;
    }
    set button(button) { this._button = button; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() { return this.button; }
    set container(container) { this.button = container; }

    get dataattributes() { return this.config.dataattributes; }
    set dataattributes(dataattributes) { this.config.dataattributes = dataattributes; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get focusin() { return this.config.focusin; }
    set focusin(focusin) {
        if (typeof focusin !== 'function') {
            console.error("Value provided to focusin is not a function!");
        }
        this.config.focusin = focusin;
    }

    get focusout() { return this.config.focusout; }
    set focusout(focusout) {
        if (typeof focusout !== 'function') {
            console.error("Value provided to focusout is not a function!");
        }
        this.config.focusout = focusout;
    }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get ghost() { return this.config.ghost; }
    set ghost(ghost) { this.config.ghost = ghost; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get hoverin() { return this.config.hoverin; }
    set hoverin(hoverin) {
        if (typeof hoverin !== 'function') {
            console.error("Value provided to hoverin is not a function!");
        }
        this.config.hoverin = hoverin;
    }

    get hoverout() { return this.config.hoverout; }
    set hoverout(hoverout) {
        if (typeof hoverout !== 'function') {
            console.error("Value provided to hoverout is not a function!");
        }
        this.config.hoverout = hoverout;
    }

    get href() { return this.config.href; }
    set href(href) { this.config.href = href; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get iconactual() { return this._iconactual; }
    set iconactual(iconactual) { this._iconactual = iconactual; }

    get iconclasses() { return this.config.iconclasses; }
    set iconclasses(iconclasses) { this.config.iconclasses = iconclasses; }

    get iconprefix() { return this.config.iconprefix; }
    set iconprefix(iconprefix) { this.config.iconprefix = iconprefix; }

    get iconprefixsecond() { return this.config.iconprefixsecond; }
    set iconprefixsecond(iconprefixsecond) { this.config.iconprefixsecond = iconprefixsecond; }

    get iconside() { return this.config.iconside; }
    set iconside(iconside) { this.config.iconside = iconside; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get image() { return this.config.image; }
    set image(image) { this.config.id = image; }

    get link() { return this.config.link; }
    set link(link) { this.config.link = link; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get naked() { return this.config.naked; }
    set naked(naked) { this.config.naked = naked; }

    get notab() { return this.config.notab; }
    set notab(notab) { this.config.notab = notab; }

    get payload() { return this.config.payload; }
    set payload(payload) { this.config.payload = payload; }

    get secondicon() { return this.config.secondicon; }
    set secondicon(secondicon) { this.config.secondicon = secondicon; }

    get secondiconactual() { return this._secondiconactual; }
    set secondiconactual(secondiconactual) { this._secondiconactual = secondiconactual; }

    get shape() { return this.config.shape; }
    set shape(shape) { this.config.shape = shape; }

    get size() { return this.config.size; }
    set size(size) { this.config.size = size; }

    get submits() { return this.config.submits; }
    set submits(submits) { this.config.submits = submits; }

    get text() { return this.config.text; }
    set text(text) {
        if (this.textobj) { this.textobj.innerHTML = text; }
        this.config.text = text;
    }

    get textobj() { return this._textobj; }
    set textobj(textobj) { this._textobj = textobj; }

    get tipgravity() { return this.config.tipgravity; }
    set tipgravity(tipgravity) { this.config.tipgravity = tipgravity; }

    get tipicon() { return this.config.tipicon; }
    set tipicon(tipicon) { this.config.tipicon = tipicon; }

    get tooltip() { return this.config.tooltip; }
    set tooltip(tooltip) { this.config.tooltip = tooltip; }

    get tooltipobj() { return this._tooltipobj; }
    set tooltipobj(tooltipobj) { this._tooltipobj = tooltipobj; }

}
window.SimpleButton = SimpleButton;