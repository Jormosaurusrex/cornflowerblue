class ButtonMenu extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: function(e, self) {
                let focused = (document.activeElement === self.button);
                if ((focused) && (!self.isopen)) {
                    self.open();
                }
            },
            gravity: 's',
            secondicon: 'triangle-down', // this is passed up as a secondicon
            autoclose: true, // don't close on outside clicks
            menu: null, // can be passed a dom object to display in the menu. If present, ignores items.
            items: []   // list of menu item definitions
                        // {
                        //    label: "Menu Text", // text
                        //    tooltip: null, // Tooltip text
                        //    tipicon: null, // Tooltip icon, if any
                        //    icon: null, // Icon to use in the menu, if any
                        //    action: function() { } // what to do when the tab is clicked.
                        // }
        };
    }


    static closeOpen() {
        if (ButtonMenu.activeMenu) {
            ButtonMenu.activeMenu.close();
        }
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

    /**
     * Toggle the menu.
     */
    toggle() {
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

        ButtonMenu.closeOpen(); // close open menus

        document.body.appendChild(this.menu);
        this.button.setAttribute('aria-expanded', 'true');
        this.menu.removeAttribute('aria-hidden');

        if ((this.items) && (this.items.length > 0)) {
            let items = Array.from(this.menu.querySelector('li'));
            for (let li of items) {
                li.setAttribute('tabindex', '0');
            }
        }


        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.button.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top,
            offsetRight = bodyRect.right - elemRect.right,
            offsetBottom = elemRect.bottom - bodyRect.bottom;

        //this.gravity = 's';
        this.menu.classList.add(this.gravity);

        switch(this.gravity) {
            case 'w':
            case 'west':
                this.menu.style.top = `${offsetTop}px`;
                this.menu.style.left = `${offsetLeft - this.menu.clientWidth - (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'e':
            case 'east':
                this.menu.style.top = `${offsetTop}px`;
                this.menu.style.left = `${offsetLeft + this.button.offsetWidth + (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'n':
            case 'north':
                this.menu.style.top = `${(offsetTop - this.menu.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.menu.style.left = `${offsetLeft - this.menu.offsetWidth + this.button.offsetWidth}px`;
                break;
            case 'nw':
            case 'northwest':
                this.menu.style.top = `${(offsetTop - this.menu.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.menu.style.left = `${offsetLeft}px`;
                break;
            case 'se':
            case 'southeast':
                this.menu.style.top = `${(offsetTop + this.button.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.menu.style.left = `${offsetLeft}px`;
                break;
            case 's':
            case 'south':
            case 'southwest':
            default:
                this.menu.style.top = `${(offsetTop + me.button.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.menu.style.right = `${offsetRight}px`;
                break;
        }

        if (typeof ButtonMenu.activeTooltip === 'undefined' ) {
            ButtonMenu.activeTooltip = this;
        } else {
            ButtonMenu.activeTooltip = this;
        }

        let focusable = this.menu.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        if ((focusable) && (focusable.length > 0)) {
            focusable[0].focus();
        }

        if (typeof ButtonMenu.activeMenu === 'undefined' ) {
            ButtonMenu.activeMenu = this;
        } else {
            ButtonMenu.activeMenu = this;
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

        this.button.appendChild(this.menu);
        ButtonMenu.activeMenu = null;

    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') { me.close(); }
        }, { once: true });

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
        }, { once: true, });
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the menu.
     * @returns DOM representation
     */
    buildMenu() {
        const me = this;
        this.menu = document.createElement('ul');
        this.menu.classList.add('button-menu');
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
                switch (e.key) {
                    case 'Tab':
                    case 'Escape':
                        me.close();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        me.menu.querySelector(`[data-order='${previous}']`).focus();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        me.menu.querySelector(`[data-order='${next}']`).focus();
                        break;
                    case 'Enter': // Enter
                    case ' ': // Space
                        me.querySelector('a').click(); // click the one inside
                        break;

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

            if (item.tooltip) {
                new ToolTip({
                    text: item.tooltip,
                    icon: item.tipicon,
                    gravity: 'w'
                }).attach(menuitem);
            }

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
        this.menu.classList.add('button-menu');
        this.button.appendChild(this.menu);
        this.menu.addEventListener('keyup', function(e) {
            if (e.key === 'Escape') {
                me.close();
            }
        });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autoclose() { return this.config.autoclose; }
    set autoclose(autoclose) { this.config.autoclose = autoclose; }

    get gravity() { return this.config.gravity; }
    set gravity(gravity) { this.config.gravity = gravity; }

    get items() { return this.config.items; }
    set items(items) { this.config.items = items; }

    get menu() { return this.config.menu; }
    set menu(menu) { this.config.menu = menu; }

}
