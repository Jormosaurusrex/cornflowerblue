class ButtonMenu extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: (e, self) => {
                let focused = (document.activeElement === self.button);
                if ((focused) && (!self.isopen)) {
                    self.open();
                } else {
                    self.close();
                }
                e.stopPropagation();
            },
            closeopen: true, // if true, force all other open menus closed when this one opens.
            onopen: null, // Function to execute on open. passed "self" as argument
            onclose: null, // Function to execute on open. passed "self" as argument
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
                        //    action: function() { } // what to do when the tab is clicked.
                        // }
        };
    }

    /**
     * Close any open ButtonMenus
     */
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
        console.log(this.config);
        if (this.isopen) { return; }

        if (this.closeopen) {
            console.log(`this.closeopen: ${this.closeopen}`);
            ButtonMenu.closeOpen(); // close open menus
        }

        if (typeof ButtonMenu.activeMenu === 'undefined' ) {
            ButtonMenu.activeMenu = this;
        } else {
            ButtonMenu.activeMenu = this;
        }

        this.button.setAttribute('aria-expanded', 'true');
        this.menu.removeAttribute('aria-hidden');
        ButtonMenu.activeMenu.menu.style.opacity = 0;
        document.body.appendChild(this.menu);

        if ((this.items) && (this.items.length > 0)) {
            let items = Array.from(this.menu.querySelector('li'));
            for (let li of items) {
                li.setAttribute('tabindex', '0');
            }
        }

        this.menu.classList.add(this.gravity);

        if ((this.onopen) && (typeof this.onclose === 'function')) {
            this.onopen(this);
        }

        let focusable = this.menu.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        window.setTimeout(() => { // Do the focus thing late
            if ((focusable) && (focusable.length > 0)) {
                focusable[0].focus();
            }
        }, 200);

        if (this.autoclose) {
            window.setTimeout(() => { // Set this after, or else we'll get bouncing.
                this.setCloseListener();
            }, 200);
        }

        window.addEventListener('scroll', this.setPosition, true);

        if (this.autoclose) {
            window.setTimeout(() => { // Set this after, or else we'll get bouncing.
                this.setPosition();
                ButtonMenu.activeMenu.menu.style.opacity = 1;
            }, 50);
        }
    }

    /**
     * Position the menu
     */
    setPosition() {
        if (!ButtonMenu.activeMenu) { return; }
        let self = ButtonMenu.activeMenu;

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = self.button.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top,
            offsetRight = bodyRect.right - elemRect.right,
            offsetBottom = elemRect.bottom - bodyRect.bottom;

        switch(self.gravity) {
            case 'w':
            case 'west':
                self.menu.style.top = `${offsetTop - (self.button.clientHeight / 2)}px`;
                self.menu.style.left = `${offsetLeft - self.menu.clientWidth - (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'e':
            case 'east':
                self.menu.style.top = `${offsetTop - (self.button.clientHeight / 2)}px`;
                self.menu.style.left = `${offsetLeft + self.button.offsetWidth + (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'n':
            case 'north':
                self.menu.style.top = `${(offsetTop - self.menu.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.menu.style.left = `${offsetLeft - self.menu.offsetWidth + self.button.offsetWidth}px`;
                break;
            case 'nw':
            case 'northwest':
                self.menu.style.top = `${(offsetTop - self.menu.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.menu.style.left = `${offsetLeft - (self.button.clientWidth / 2)}px`;
                break;
            case 'se':
            case 'southeast':
                self.menu.style.top = `${(offsetTop + self.button.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.menu.style.left = `${offsetLeft - (self.button.clientWidth / 2)}px`;
                break;
            case 's':
            case 'south':
            case 'southwest':
            default:
                self.menu.style.top = `${(offsetTop + self.button.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.menu.style.left = `${offsetLeft - self.menu.offsetWidth + self.button.offsetWidth}px`;
                break;
        }

    }

    /**
     * Closes the button
     */
    close() {
        window.removeEventListener('scroll', this.setPosition, true);
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

        ButtonMenu.activeMenu = null;
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
                this.setCloseListener();
            } else if ((this.menu.contains(e.target)) && ((tag === 'form') || (tag === 'div'))) {
            } else if (this.menu.contains(e.target)) {
                this.close();
            } else if (this.button.contains(e.target)) {
                this.toggle();
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

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autoclose() { return this.config.autoclose; }
    set autoclose(autoclose) { this.config.autoclose = autoclose; }

    get closeopen() { return this.config.closeopen; }
    set closeopen(closeopen) { this.config.closeopen = closeopen; }

    get data() { return this.config.data; }
    set data(data) { this.config.data = data; }

    get gravity() { return this.config.gravity; }
    set gravity(gravity) { this.config.gravity = gravity; }

    get items() { return this.config.items; }
    set items(items) { this.config.items = items; }

    get menu() { return this.config.menu; }
    set menu(menu) { this.config.menu = menu; }

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