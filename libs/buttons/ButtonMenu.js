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
        return this.button.attr('aria-expanded');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Opens the menu
     */
    open() {
        if (this.isopen) { return; }
        this.button.attr('aria-expanded', true);
        this.menu.removeAttr('aria-hidden');
    }

    /**
     * Closes the button
     */
    close() {
        this.button.removeAttr('aria-expanded');
        this.menu.attr('aria-hidden', true);

    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the menu.
     * @returns {jQuery} jQuery representation
     */
    buildMenu() {
        const me = this;
        this.menu = $('<ul />')
            .attr('aria-hidden', true);
        for (let item of this.items) {
            let $menuitem = $('<li />');
            let $anchor = $('<a />');

            if (item.icon) {
                $anchor.append(IconFactory.icon(item.icon));
            }
            $anchor
                .append($('<span />').html(item.label))
                .click(function(e) {
                    e.preventDefault();
                    if ((item.action) && (typeof item.action === 'function')) {
                        item.action(e);
                    }
                    me.close();
                });

            this.menu.append($menuitem.append($anchor));
        }
        this.button.append(this.menu);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get items() { return this.config.items; }
    set items(items) { this.config.items = items; }

    get menu() { return this._menu; }
    set menu(menu) { this._menu = menu; }

}
