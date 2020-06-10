class HamburgerButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            toggletarget: null, // The menu object to open or close.
            text: TextFactory.get('open_menu'),
            shape: 'square',
            naked: true,
            icon: HamburgerButton.MAGIC_HAMBURGER,
            toggleaction: function(self) { },
            action: function(e, self) { self.toggle(); }
        };
    }
    static get DEFAULT_CONFIG_DOCUMENTATION() {
        return {
            toggletarget: { type: 'option', datatype: 'object', description: "The menu object to open or close." },
            text: { type: 'option', datatype: 'string', description: "The text for the button. This is used as an aria-label only." },
            toggleaction: { type: 'option', datatype: 'function', description: "A function to execute when the button is toggled." },
        };
    }

    static get MAGIC_HAMBURGER() {
        let hb = document.createElement('span');
        hb.classList.add('magichamburger');
        hb.innerHTML = "<span></span><span></span><span></span>";
        return hb;
    }

    constructor(config) {
        config = Object.assign({}, HamburgerButton.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('hamburger');
        } else {
            config.classes = ['hamburger'];
        }
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the button is open
     * @return true if it is!
     */
    get isopen() {
        return this.button.hasAttribute('aria-expanded');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    toggle() {
        if ((this.toggleaction) && (typeof this.toggleaction === 'function')) {
            this.toggleaction(this);
        }
        if (this.isopen) {
            this.close();
            return;
        }
        this.open();
        if ((this.toggletarget) && (this.toggletarget.toggle)) {
            this.toggletarget.toggle();
        }
    }

    /**
     * Opens the menu
     */
    open() {
        if (this.isopen) { return; }
        this.button.setAttribute('aria-expanded', 'true');
    }

    /**
     * Closes the button
     */
    close() {
        this.button.removeAttribute('aria-expanded');
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get toggleaction() { return this.config.toggleaction; }
    set toggleaction(toggleaction) { this.config.toggleaction = toggleaction; }

    get toggletarget() { return this.config.toggletarget; }
    set toggletarget(toggletarget) { this.config.toggletarget = toggletarget; }

}
window.HamburgerButton = HamburgerButton;