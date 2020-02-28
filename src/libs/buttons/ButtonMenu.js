class ButtonMenu extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: function(e, self) {
                let focused = (document.activeElement === self.button);
                if ((focused) && (!self.isopen)) {
                    self.open();
                }
            },
            secondicon: 'triangle-down', // this is passed up as a secondicon
            autoclose: true, // don't close on outside clicks
            menu: null, // can be passed a dom object to display in the menu. If present, ignores items.
            items: []   // list of menu item definitions
                        // {
                        //    label: "Menu Text", // text
                        //    tooltip: null, // Tooltip text
                        //    icon: null, // Icon to use, if any
                        //    action: function() { } // what to do when the tab is clicked.
                        // }
        };
    }

    constructor(config) {
        config = Object.assign({}, ButtonMenu.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('menu');
        } else {
            config.classes = ['menu'];
        }
        super(config);
        if (this.menu) {
            this.processMenu();
        } else {
            this.buildMenu();
        }
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
        console.log(`toggle: ${this.isopen}`);
        if (this.isopen) {
            this.close();
            return;
        }
        this.open();
    }

    /**
     * Opens the menu
     */
    open() {
        const me = this;

        if (this.isopen) { return; }

        this.button.setAttribute('aria-expanded', 'true');
        this.menu.removeAttribute('aria-hidden');

        if ((this.items) && (this.items.length > 0)) {
            let items = Array.from(this.menu.querySelector('li'));
            for (let li of items) {
                li.setAttribute('tabindex', '0');
            }
        }

        let focusable = this.menu.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        if ((focusable) && (focusable.length > 0)) {
            focusable[0].focus();
        }

        if (this.autoclose) {
            window.setTimeout(function() { // Set this after, or else we'll get bouncing.
                me.setCloseListener();
            }, 200);
        }
    }

    /**
     * Closes the button
     */
    close() {
        this.button.removeAttribute('aria-expanded');
        this.menu.setAttribute('aria-hidden', 'true');

        if ((this.items) && (this.items.length > 0)) {
            let items = Array.from(this.menu.querySelector('li'));
            for (let li of items) {
                li.setAttribute('tabindex', '-1');
            }
        }
    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;
        window.addEventListener('click', function(e) {
            let tag = me.menu.tagName.toLowerCase();
            if ((me.menu.contains(e.target)) && ((tag === 'form') || (tag === 'div'))) {
                me.setCloseListener();
            } else if (me.menu.contains(e.target)) {
                me.close();
            } else if (me.button.contains(e.target)) {
                me.toggle();
            } else {
                me.close();
            }
        }, {
            once: true,
        });
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the menu.
     * @returns DOM representation
     */
    buildMenu() {
        const me = this;
        this.menu = document.createElement('ul');
        this.menu.classList.add('menu');
        this.menu.setAttribute('aria-hidden', 'true');
        this.menu.setAttribute('tabindex', '0');
        let order = 1;

        for (let item of this.items) {

            let next = order + 1,
                previous = order - 1;
            if (previous < 1) { previous = 1; }
            if (next > this.items.length) { next = this.items.length; }

            let menuitem = document.createElement('li');
            menuitem.setAttribute('tabindex', '-1');
            menuitem.setAttribute('data-order', order);

            menuitem.addEventListener('keyup', function(e) {
                if (e.keyCode === 9) { // Tab
                    me.close();
                } else if (e.keyCode === 27) { // Escape
                    me.close();
                } else if (e.keyCode === 38) { // Up arrow
                    e.preventDefault();
                    me.menu.querySelector(`[data-order='${previous}']`).focus();
                } else if (e.keyCode === 40) { // Down arrow
                    e.preventDefault();
                    me.menu.querySelector(`[data-order='${next}']`).focus();
                } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                    me.querySelector('a').click(); // click the one inside
                }
            });

            let anchor = document.createElement('a');
            if (item.icon) {
                anchor.appendChild(IconFactory.icon(item.icon));
            }

            let s = document.createElement('span');
            s.innerHTML = item.label;
            anchor.appendChild(s);

            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                if ((item.action) && (typeof item.action === 'function')) {
                    item.action(e);
                }
                me.close();
            });

            menuitem.appendChild(anchor);

            this.menu.appendChild(menuitem);

            order++;
        }
        this.button.appendChild(this.menu);
    }

    /**
     * Applies handlers and classes to a provided menu.
     */
    processMenu() {
        const me = this;
        this.menu.setAttribute('aria-hidden', 'true');
        this.menu.setAttribute('tabindex', '0');
        this.menu.classList.add('menu');
        this.button.appendChild(this.menu);
        this.menu.addEventListener('keyup', function(e) {
            if (e.keyCode === 27) { // Escape
                me.close();
            }
        });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autoclose() { return this.config.autoclose; }
    set autoclose(autoclose) { this.config.autoclose = autoclose; }

    get items() { return this.config.items; }
    set items(items) { this.config.items = items; }

    get menu() { return this.config.menu; }
    set menu(menu) { this.config.menu = menu; }

}
