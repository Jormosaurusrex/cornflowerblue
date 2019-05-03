"use strict";

class ButtonMenu extends SimpleButton {

    constructor(config) {
        config = Object.assign({}, ButtonMenu.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('menu');
        } else {
            config.classes = ['menu'];
        }
        super(config);
    }

    /**
     * Toggle visibility of the menu.
     */
    toggleMenu(e, self) {

        if (!this.menu) { this.buildMenu(); }

        this.button.toggleClass('open');

        e.stopPropagation();

        $(document).one('click', function closeMenu (e){
            if (self.button.has(e.target).length === 0) {
                self.button.removeClass('open');
            } else {
                $(document).one('click', closeMenu);
            }
        });

    }

    /**
     * Builds the menu.
     * @returns {jQuery} jQuery representation
     */
    buildMenu() {
        this.menu = $('<ul />');
        for (let item of this.items) {
            let $menuitem = $('<li />');

            if (item.icon) {
                $menuitem.append(IconFactory.makeIcon(item.icon));
            }

            $menuitem.append($('<span />').html(item.label))
                .click(function(e) {
                    e.preventDefault();
                    if ((item.action) && (typeof item.action === 'function')) {
                        item.action(e);
                    }
                });
            this.menu.append($menuitem);
        }
        this.button.append(this.menu);

    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() { return this._container; }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get items() { return this.config.items; }
    set items(items) { this.config.items = items; }

    get menu() { return this._menu; }
    set menu(menu) { this._menu = menu; }

}

ButtonMenu.DEFAULT_CONFIG = {
    action: function(e, self) { self.toggleMenu(e, self); },
    icon: 'triangle-down',
    items: [] // list of menuitems
    // {
    //    label: "Menu Text", // text
    //    tooltip: null, // Tooltip text
    //    icon: null, // Icon to use, if any
    //    action: function() { } // what to do when the tab is clicked.
    // }
};
