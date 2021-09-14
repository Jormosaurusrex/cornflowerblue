class ButtonMenu extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: (e, self) => {
                e.preventDefault();
                e.stopPropagation();
                let focused = (document.activeElement === self.button);
                if ((focused) && (!self.isopen)) {
                    self.open();
                } else {
                    self.close();
                }
            },
            custompositioner: null, // A function that will be used to set the menu's position
                                    // different from the custom one. passed (self)
            focusinside: true,  //
            menuid: 'cfb-menu',    // If present, will only auto-close other menus of this type.

            // killed
            closeopen: true, // if true, force all other open menus closed when this one opens.

            onopen: null,    // Function to execute on open. passed "self" as argument
            onclose: null,   // Function to execute on open. passed "self" as argument
            stayopen: false, // Set true for it to stay open when elements are clicked within.
            gravity: 's', // Gravity direction for the menu
            tooltipgravity: 'e', // Gravity direction for the tooltips
            data: null, // A place to store information that the button actions may need, if the menu is
                        // constructed in a closed setting (like inside of a DataGrid row).
                        // Typically set by the calling system
            secondicon: 'triangle-down', // this is passed up as a secondicon
            autoclose: true, // don't close on outside clicks
            menu: null, // can be passed a dom object to display in the menu. If present, ignores items.
            items: []   // list of menu item definitions
                        // {
                        //    label: "Menu Text", // text
                        //    tooltip: null, // Tooltip text
                        //    icon: null, // Icon to use in the menu, if any
                        //    action: () => { } // what to do when the tab is clicked.
                        // }
        };
    }

    /**
     * Close any open ButtonMenus
     */
    static closeOpen(menuid) {
        if (menuid) {
            for (let menu of document.body.querySelectorAll(`>*[data-menuid="${menuid}"]`)) {
                menu.setAttribute('aria-hidden', 'true');
            }
        } else {
            for (let menu of document.body.querySelectorAll(`>*[data-menuid]`)) {
                menu.setAttribute('aria-hidden', 'true');
            }
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
        this.emsize = CFBUtils.getSingleEmInPixels();
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the button is open
     * @return true if it is!
     */
    get isopen() {
        return !!((this.button.getAttribute('aria-expanded')) && (this.button.getAttribute('aria-expanded') === 'true'));
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
        if (this.isopen) { return; }

        this.menuactual = document.getElementById(`menu-${this.menuid}`);

        if (!this.menuactual) {
            if (this.menu) {
                this.processMenu();
            } else {
                this.buildMenuActual();
                this.buildMenu();
            }
        } else {
            if (this.menu) {
                this.processMenu();
            } else {
                this.buildMenu();
            }
        }


        this.button.setAttribute('aria-expanded', 'true');
        this.menuactual.removeAttribute('aria-hidden');
        this.menuactual.style.opacity = 0;

        // clear classlist, and readd
        this.menuactual.classList.remove(...this.menuactual.classList);
        for (let c of this.classes) {
            this.menuactual.classList.add(c);
        }


        for (let li of this.menuactual.querySelectorAll('li')) {
            li.setAttribute('tabindex', '0');
        }

        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }

        if (this.focusinside) {
            let focusable = this.menuactual.querySelectorAll('[tabindex]:not([tabindex="-1"])');
            window.setTimeout(() => { // Do the focus thing late
                if ((focusable) && (focusable.length > 0)) {
                    focusable[0].focus();
                }
            }, 200);
        }

        if (this.autoclose) {
            window.setTimeout(() => { // Set this after, or else we'll get bouncing.
                this.setCloseListener();
            }, 200);
        }

        /*
            This is gross but:
                1) anonymous functions can't be removed, so we have a problem with "this"
                2) we can't pass this.setPosition as the function because "this" becomes "window"
                3) we can't remove a listener set this way in a different method (e.g., close())
         */
        const me = this;
        window.addEventListener('scroll', function _listener() {
            if (!me.isopen) {
                window.removeEventListener('scroll', _listener, true);
            }
            me.setPosition();
        }, true );

        if (this.autoclose) {
            window.setTimeout(() => { // Set this after, or else we'll get bouncing.
                this.setPosition();
                this.menuactual.style.opacity =  1;
                this.menuactual.style.removeProperty('opacity');
            }, 50);
        }
    }

    /**
     * Position the menu
     */
    setPosition() {
        if ((this.custompositioner) && (typeof this.custompositioner === 'function')) {
            this.custompositioner(this);
            return;
        }
        this.setPositionDefault();
    }

    setPositionDefault() {
        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.button.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top,
            offsetRight = bodyRect.right - elemRect.right,
            offsetBottom = elemRect.bottom - bodyRect.bottom;

        this.menuactual.style.removeProperty('top');
        this.menuactual.style.removeProperty('bottom');
        this.menuactual.style.removeProperty('left');
        this.menuactual.style.removeProperty('right');


        switch(this.gravity) {
            case 'w':
            case 'west':
                this.menuactual.style.top = `${offsetTop}px`;
                this.menuactual.style.left = `${offsetLeft - this.menuactual.clientWidth - (this.emsize / 2)}px`;
                this.gravity = 'w';
                break;
            case 'e':
            case 'east':
                this.menuactual.style.top = `${offsetTop}px`;
                this.menuactual.style.left = `${offsetLeft + this.button.offsetWidth + (this.emsize / 2)}px`;
                this.gravity = 'e';
                break;
            case 'n':
            case 'north':
                this.menuactual.style.top = `${(offsetTop - this.menuactual.clientHeight - (this.emsize / 2))}px`;
                this.menuactual.style.left = `${offsetLeft - (this.menuactual.offsetWidth / 2) + (this.button.offsetWidth / 2)}px`;
                this.gravity = 'n';
                break;
            case 'nw':
            case 'northwest':
                this.menuactual.style.top = `${(offsetTop - this.menuactual.clientHeight - (this.emsize / 2))}px`;
                this.menuactual.style.left = `${offsetLeft}px`;
                this.gravity = 'nw';
                break;
            case 'ne':
            case 'northeast':
                this.menuactual.style.top = `${(offsetTop - this.menuactual.clientHeight - (this.emsize / 2))}px`;
                this.menuactual.style.right = `${offsetRight}px`;
                this.gravity = 'ne';
                break;
            case 's':
            case 'south':
                this.menuactual.style.top = `${(offsetTop + this.button.clientHeight + (this.emsize / 2))}px`;
                this.menuactual.style.left = `${offsetLeft - (this.menuactual.offsetWidth / 2) + (this.button.offsetWidth / 2)}px`;
                this.gravity = 's';
                break;
            case 'se':
            case 'southeast':
                this.menuactual.style.top = `${(offsetTop + this.button.clientHeight + (this.emsize / 2))}px`;
                this.menuactual.style.left = `${offsetLeft}px`;
                this.gravity = 'se';
                break;
            case 'southwest':
            case 'sw':
            default:
                this.menuactual.style.top = `${(offsetTop + this.button.clientHeight + (this.emsize / 2))}px`;
                this.menuactual.style.right = `${offsetRight}px`;
                this.gravity = 'sw';
                break;
        }

        this.menuactual.setAttribute('data-gravity', this.gravity);

    }

    /**
     * Closes the button
     */
    close() {
        this.button.removeAttribute('aria-expanded');
        this.menuactual.setAttribute('aria-hidden', 'true');

        if ((this.items) && (this.items.length > 0)) {
            let items = Array.from(this.menuactual.querySelector('li'));
            for (let li of items) {
                li.setAttribute('tabindex', '-1');
            }
        }

        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }

    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { this.close(); }
        }, { once: true });

        window.addEventListener('click', (e) => {
            let tag = this.menuactual.tagName.toLowerCase();
            if (((this.menuactual.contains(e.target))) && (this.stayopen)) {
                window.setTimeout(() => { this.setCloseListener(); }, 20);
            } else if ((this.menuactual.contains(e.target)) && ((tag === 'form') || (tag === 'div'))) {
                // Do nothing.
            } else if (this.menuactual.contains(e.target)) {
                this.close();
            } else if (this.menuactual.contains(e.target)) {
                // Do nothing.  This will auto close.
            } else {
                this.close();
            }
        }, { once: true, });
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the menu.
     * @returns DOM representation
     */
    buildMenu() {
        let order = 1;
        this.menuactual.innerHTML = "";

        for (let item of this.items) {

            let next = order + 1,
                previous = order - 1;
            if (previous < 1) { previous = 1; }
            if (next > this.items.length) { next = this.items.length; }

            let menuitem = document.createElement('li');
            menuitem.setAttribute('tabindex', '-1');
            menuitem.setAttribute('data-order', `${order}`);

            menuitem.addEventListener('keyup', (e) => {
                switch (e.key) {
                    case 'Tab':
                    case 'Escape':
                        this.close();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.menuactual.querySelector(`[data-order='${previous}']`).focus();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.menuactual.querySelector(`[data-order='${next}']`).focus();
                        break;
                    case 'Enter': // Enter
                    case ' ': // Space
                        this.querySelector('a').click(); // click the one inside
                        break;

                }
            });

            let anchor = document.createElement('a');
            if (item.icon) {
                anchor.appendChild(IconFactory.icon(item.icon));
            }

            if ((item.classes) && (item.classes.length > 0)) {
                for (let c of item.classes) {
                    menuitem.classList.add(c)
                }
            }

            let s = document.createElement('span');
            s.innerHTML = item.label;
            anchor.appendChild(s);

            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                if ((item.action) && (typeof item.action === 'function')) {
                    item.action(e, this);
                }
                this.close();
            });

            menuitem.appendChild(anchor);

            if (item.tooltip) {
                new ToolTip({
                    text: item.tooltip,
                    gravity: this.tooltipgravity
                }).attach(menuitem);
            }

            this.menuactual.appendChild(menuitem);

            order++;
        }
    }

    buildMenuActual() {
        this.menuactual = document.createElement('ul');
        this.menuactual.setAttribute('aria-hidden', 'true');
        this.menuactual.setAttribute('tabindex', '0');
        this.menuactual.setAttribute('id', `menu-${this.menuid}`);
        this.menuactual.setAttribute('data-menuid', `${this.menuid}`);
        document.body.appendChild(this.menuactual);
    }

    /**
     * Applies handlers and classes to a provided menu.
     */
    processMenu() {
        this.menuactual = this.menu;
        this.menuactual.setAttribute('aria-hidden', 'true');
        this.menuactual.setAttribute('tabindex', '0');
        this.menuactual.setAttribute('data-menuid', this.menuid);
        this.menuactual.setAttribute('id', `menu-${this.menuid}`);

        document.body.appendChild(this.menuactual);

        for (let c of this.classes) {
            this.menu.classList.add(c);
        }

        this.menu.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });

    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autoclose() { return this.config.autoclose; }
    set autoclose(autoclose) { this.config.autoclose = autoclose; }

    get custompositioner() { return this.config.custompositioner; }
    set custompositioner(custompositioner) { this.config.custompositioner = custompositioner; }

    get data() { return this.config.data; }
    set data(data) { this.config.data = data; }

    get emsize() { return this._emsize; }
    set emsize(emsize) { this._emsize = emsize; }

    get focusinside() { return this.config.focusinside; }
    set focusinside(focusinside) { this.config.focusinside = focusinside; }

    get gravity() { return this.config.gravity; }
    set gravity(gravity) { this.config.gravity = gravity; }

    get items() { return this.config.items; }
    set items(items) { this.config.items = items; }

    get menuactual() { return this.config.menuactual; }
    set menuactual(menuactual) { this.config.menuactual = menuactual; }

    get menu() { return this.config.menu; }
    set menu(menu) { this.config.menu = menu; }

    get menuid() { return this.config.menuid; }
    set menuid(menuid) { this.config.menuid = menuid; }

    get onclose() { return this.config.onclose; }
    set onclose(onclose) { this.config.onclose = onclose; }

    get onopen() { return this.config.onopen; }
    set onopen(onopen) { this.config.onopen = onopen; }

    get stayopen() { return this.config.stayopen; }
    set stayopen(stayopen) { this.config.stayopen = stayopen; }

    get tooltipgravity() { return this.config.tooltipgravity; }
    set tooltipgravity(tooltipgravity) { this.config.tooltipgravity = tooltipgravity; }

}
window.ButtonMenu = ButtonMenu;