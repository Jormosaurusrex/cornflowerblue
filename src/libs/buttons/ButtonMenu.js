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
            menuid: null,    // If present, will only auto-close other menus of this type.
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
                        //    tipicon: null, // Tooltip icon, if any
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
            if ((ButtonMenu.activeMenuTypes) && (ButtonMenu.activeMenuTypes[menuid])) {
                ButtonMenu.activeMenuTypes[menuid].close();
            }
        } else {
            if (ButtonMenu.activeMenu) {
                ButtonMenu.activeMenu.close();
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
        if ((this.button.getAttribute('aria-expanded')) && (this.button.getAttribute('aria-expanded') === 'true')) {
            return true;
        }
        return false;
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

        if (this.closeopen) {
            ButtonMenu.closeOpen(this.menuid); // close open menus
        }

        if (this.menuid) {
            if (typeof ButtonMenu.activeMenuTypes === 'undefined' ) {
                ButtonMenu.activeMenuTypes = {};
            }
            ButtonMenu.activeMenuTypes[this.menuid] = this;
        } else {
            if (typeof ButtonMenu.activeMenu === 'undefined' ) {
                ButtonMenu.activeMenu = this;
            } else {
                ButtonMenu.activeMenu = this;
            }
        }

        this.button.setAttribute('aria-expanded', 'true');
        this.menu.removeAttribute('aria-hidden');
        this.menu.style.opacity = 0;
        document.body.appendChild(this.menu);

        for (let li of this.menu.querySelectorAll('li')) {
            li.setAttribute('tabindex', '0');
        }

        this.menu.classList.add(this.gravity);

        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }

        if (this.focusinside) {
            let focusable = this.menu.querySelectorAll('[tabindex]:not([tabindex="-1"])');
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
                this.menu.style.opacity =  1;
                this.menu.style.removeProperty('opacity');
                this.menu.classList.add('open');
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

        this.menu.style.removeProperty('top');
        this.menu.style.removeProperty('bottom');
        this.menu.style.removeProperty('left');
        this.menu.style.removeProperty('right');

        switch(this.gravity) {
            case 'w':
            case 'west':
                this.menu.style.top = `${offsetTop}px`;
                this.menu.style.left = `${offsetLeft - this.menu.clientWidth - (this.emsize / 2)}px`;
                break;
            case 'e':
            case 'east':
                this.menu.style.top = `${offsetTop - (this.button.clientHeight / 2)}px`;
                this.menu.style.left = `${offsetLeft + this.button.offsetWidth + (this.emsize / 2)}px`;
                break;
            case 'n':
            case 'north':
                this.menu.style.top = `${(offsetTop - this.menu.clientHeight - (this.emsize / 2))}px`;
                this.menu.style.left = `${offsetLeft - this.menu.offsetWidth + this.button.offsetWidth}px`;
                break;
            case 'nw':
            case 'northwest':
                this.menu.style.top = `${(offsetTop - this.menu.clientHeight - (this.emsize / 2))}px`;
                this.menu.style.left = `${offsetLeft - (this.button.clientWidth / 2)}px`;
                break;
            case 'se':
            case 'southeast':
                this.menu.style.top = `${(offsetTop + this.button.clientHeight + (this.emsize / 2))}px`;
                this.menu.style.left = `${offsetLeft - (this.button.clientWidth / 2)}px`;
                break;
            case 's':
            case 'south':
                this.menu.style.top = `${(offsetTop + this.button.clientHeight + (this.emsize / 2))}px`;
                this.menu.style.left = `${offsetLeft - (this.menu.offsetWidth / 2) + this.button.offsetWidth }px`;
                break;
            case 'southwest':
            default:
                this.menu.style.top = `${(offsetTop + this.button.clientHeight + (this.emsize / 2))}px`;
                this.menu.style.left = `${offsetLeft - this.menu.offsetWidth + this.button.offsetWidth}px`;
                break;
        }

    }

    /**
     * Closes the button
     */
    close() {
        this.button.appendChild(this.menu);
        this.button.removeAttribute('aria-expanded');
        this.menu.setAttribute('aria-hidden', 'true');

        if ((this.items) && (this.items.length > 0)) {
            let items = Array.from(this.menu.querySelector('li'));
            for (let li of items) {
                li.setAttribute('tabindex', '-1');
            }
        }

        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }

        if (this.menuid) {
            if (typeof ButtonMenu.activeMenuTypes === 'undefined' ) {
                ButtonMenu.activeMenuTypes = {};
            }
            ButtonMenu.activeMenuTypes[this.menuid] = null;
        } else {
            ButtonMenu.activeMenu = null;
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
            let tag = this.menu.tagName.toLowerCase();
            if (((this.menu.contains(e.target))) && (this.stayopen)) {
                window.setTimeout(() => { this.setCloseListener(); }, 20);
            } else if ((this.menu.contains(e.target)) && ((tag === 'form') || (tag === 'div'))) {
                // Do nothing.
            } else if (this.menu.contains(e.target)) {
                this.close();
            } else if (this.button.contains(e.target)) {
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
        this.menu = document.createElement('ul');
        this.menu.classList.add('button-menu');
        this.menu.setAttribute('aria-hidden', 'true');
        this.menu.setAttribute('tabindex', '0');

        for (let c of this.classes) {
            this.menu.classList.add(c);
        }

        let order = 1;

        for (let item of this.items) {

            let next = order + 1,
                previous = order - 1;
            if (previous < 1) { previous = 1; }
            if (next > this.items.length) { next = this.items.length; }

            let menuitem = document.createElement('li');
            menuitem.setAttribute('tabindex', '-1');
            menuitem.setAttribute('data-order', order);

            menuitem.addEventListener('keyup', (e) => {
                switch (e.key) {
                    case 'Tab':
                    case 'Escape':
                        this.close();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.menu.querySelector(`[data-order='${previous}']`).focus();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.menu.querySelector(`[data-order='${next}']`).focus();
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
                    icon: item.tipicon,
                    gravity: this.tooltipgravity
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
        this.menu.setAttribute('aria-hidden', 'true');
        this.menu.setAttribute('tabindex', '0');
        this.menu.classList.add('button-menu');
        for (let c of this.classes) {
            this.menu.classList.add(c);
        }
        this.button.appendChild(this.menu);
        this.menu.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    setMenu(menu) {
        this.menu.remove();
        this.menu = menu;
        this.processMenu();
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autoclose() { return this.config.autoclose; }
    set autoclose(autoclose) { this.config.autoclose = autoclose; }

    get closeopen() { return this.config.closeopen; }
    set closeopen(closeopen) { this.config.closeopen = closeopen; }

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