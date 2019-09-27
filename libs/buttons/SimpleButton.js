"use strict";

class SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            submits: false, // If true, force "type='submit'"
            cansubmit: true, // Advertizes to Forms that it can be used to submit them, if submits is true.
                            // This should be on an interface (e.g., SimpleButton implements Submittor)
                            // but Javascript is poor with regards to that.
            text : null, // The text for the button. This is also used as aria-label.
            shape : null, // (null|square|circle|hexagon|pill) :: Make the button one of these shapes. Otherwise, makes a rectangle
            size : 'medium', // size of the button: micro, small, medium (default), large, fill
            form: null, // A form element this is in
            hidden: false, // Start hidden or not.
            classes: [], //Extra css classes to apply
            icon : null, // If present, will be attached to the text inside the button
                         // This can be passed a jQuery object
            iconside: 'left', // The side the icon displays on
            secondicon : null, // if present, this icon will be placed on the opposite side of the
                                // defined 'iconside'.  If this is the only icon defined, it will
                                // still be placed.  This is ignored in shaped buttons.
            notab: false, // if true, don't be tabindexed.
            disabled: false, // if true, make the button disabled.
            mute: false, //if true, make the button mute.
            ghost: false, //if true, make the button ghost.
            link: false, //if true, make the button behave like a normal link.
            naked: false, //if true, remove all styles from the button.
            action: null, // The click handler. Passed (event, self) as arguments. NOT used if "submits" is true.
            focusin: null, // The focus in handler.  Passed (event, self) as arguments.
            focusout: null, // The focus out handler.  Passed (event, self) as arguments.
            hoverin: null, // The on hover handler.  Passed (event, self) as arguments.
            hoverout: null // The off hover handler.  Passed (event, self) as arguments.
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleButton.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `button-${Utils.getUniqueKey(5)}`; }
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Can this be used to submit a form?
     * Javascript doesn't have great interfaces. This would be on the interface otherwise.
     * Doesn't have a settor.
     * @return {boolean}
     */
    get cansubmit() { return this.config.cansubmit; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the button's DOM.
     * @returns {jQuery} jQuery representation of the SimpleButton
     */
    buildButton() {
        const me = this;

        if (this.text) {
            this.textobj = document.createElement('span');
            this.textobj.classList.add('text');
            this.textobj.innerHTML = this.text;
        }

        if (this.shape) {
            if (this.shape === 'hexagon') {
                this.button = document.createElement('button');
                if (this.icon) {
                    let span = document.createElement('span');
                    span.appendChild(IconFactory.icon(this.icon, this.text));
                    this.button.appendChild(span);
                } else if (this.text) {
                    this.button.appendChild(this.textobj);
                }
            } else {
                this.button = document.createElement('button');
                if (this.icon) {
                    this.button.appendChild(IconFactory.icon(this.icon, this.text));
                } else if (this.text) {
                    this.button.appendChild(this.textobj);
                }
            }
            this.button.classList.add(this.shape);
        } else {
            this.button = document.createElement('button');
            let icon,
                secondicon;
            if (this.icon) {
                icon = IconFactory.icon(this.icon);
            }
            if (this.secondicon) {
                secondicon = IconFactory.icon(this.secondicon);
                secondicon.classList.add('secondicon');
            }

            // XXX TODO: change to flex order
            if ((this.iconside) && (this.iconside === 'right')) {
                this.button.classList.add('righticon');
            }
            if (icon) {
                this.button.appendChild(icon);
            }
            this.button.appendChild(this.textobj);
            if (secondicon) {
                this.button.appendChild(secondicon);
            }
        }


        this.button.setAttribute('aria-label', this.text);
        this.button.setAttribute('id', this.id);
        this.button.setAttribute('role', 'button');
        this.button.setAttribute('type', (this.submits ? 'submit' : 'button'));
        this.button.classList.add(this.size);

        for (let c of this.classes) {
            this.button.classList.add(c);
        }
        this.button.addEventListener('focusin', function(e) {
                if ((me.focusin) && (typeof me.focusin === 'function')) {
                    me.focusin(e, me);
                }
            });
        this.button.addEventListener('focusout', function(e) {
                if ((me.focusout) && (typeof me.focusout === 'function')) {
                    me.focusout(e, me);
                }
            });
        this.button.addEventListener('mouseover', function(e) {
                if ((me.hoverin) && (typeof me.hoverin === 'function')) {
                    me.hoverin(e, me);
                }
            });
        this.button.addEventListener('mouseout', function(e) {
                if ((me.hoverout) && (typeof me.hoverout === 'function')) {
                    me.hoverout(e, me);
                }
            });

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

        if ((!this.submits) && (this.action) && (typeof this.action === 'function')) {
            this.button.addEventListener('click', function (e) {
                if (!me.disabled) {
                    me.action(e, me);
                }
            });
        }
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the button
     */
    disable() {
        this.button.setAttribute('disabled', 'disabled');
        this.disabled = true;
        return this;
    }

    /**
     * Disable the button
     */
    enable() {
        this.button.removeAttribute('disabled');
        this.disabled = false;
        return this;
    }

    /**
     * Show the button
     */
    show() {
        this.button.classList.remove('hidden');
        this.hidden = false;
        return this;
    }

    /**
     * Hide the button
     */
    hide() {
        this.button.classList.add('hidden');
        this.hidden = true;
        return this;
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get action() { return this.config.action; }
    set action(action) {
        if (typeof action !== 'function') {
            console.error("Action provided to button is not a function!");
        }
        this.config.action = action;
    }

    get button() {
        if (!this._button) { this.buildButton(); }
        return this._button;
    }
    set button(button) { this._button = button; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() { return this.button; }
    set container(container) { this.button = container; }

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

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get iconside() { return this.config.iconside; }
    set iconside(iconside) { this.config.iconside = iconside; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get link() { return this.config.link; }
    set link(link) { this.config.link = link; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get naked() { return this.config.naked; }
    set naked(naked) { this.config.naked = naked; }

    get notab() { return this.config.notab; }
    set notab(notab) { this.config.notab = notab; }

    get secondicon() { return this.config.secondicon; }
    set secondicon(secondicon) { this.config.secondicon = secondicon; }

    get shape() { return this.config.shape; }
    set shape(shape) { this.config.shape = shape; }

    get size() { return this.config.size; }
    set size(size) { this.config.size = size; }

    get submits() { return this.config.submits; }
    set submits(submits) { this.config.submits = submits; }

    get text() { return this.config.text; }
    set text(text) {
        if (this.textobj) { this.textobj.html(text); }
        this.config.text = text;
    }

    get textobj() { return this._textobj; }
    set textobj(textobj) { this._textobj = textobj; }

}
