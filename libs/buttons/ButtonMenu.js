"use strict";

class ButtonMenu extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            focusin: function(e, self) { self.open(); },    //
            focusout: function(e, self) { self.close(); },  //
            secondicon: 'triangle-down', // this is passed up as a secondicon
            items: [] // list of menu item definitions
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
        if (!this.menu) { this.buildMenu(); }
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

    /**
     * Opens the menu
     */
    open() {
        if (this.isopen) { return; }
        this.button.setAttribute('aria-expanded', 'true');
        this.menu.removeAttribute('aria-hidden');
    }

    /**
     * Closes the button
     */
    close() {
        this.button.removeAttribute('aria-expanded');
        this.menu.setAttribute('aria-hidden', 'true');
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the menu.
     * @returns {jQuery} jQuery representation
     */
    buildMenu() {
        const me = this;
        this.menu = document.createElement('ul');
        this.menu.setAttribute('aria-hidden', 'true');
        for (let item of this.items) {
            let menuitem = document.createElement('li');
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
                me.button.blur();
            });

            menuitem.appendChild(anchor);
            this.menu.appendChild(menuitem);
        }
        this.button.appendChild(this.menu);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get items() { return this.config.items; }
    set items(items) { this.config.items = items; }

    get menu() { return this._menu; }
    set menu(menu) { this._menu = menu; }

}
