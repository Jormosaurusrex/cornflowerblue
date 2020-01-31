class HamburgerButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            toggletarget: null, // The menu object to open or close.
            text: "Open Menu",
            shape: 'square',
            naked: true,
            icon: HamburgerButton.MAGIC_HAMBURGER,
            action: function(e, self) { self.toggle(); }
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

    get toggletarget() { return this.config.toggletarget; }
    set toggletarget(toggletarget) { this.config.toggletarget = toggletarget; }

}
