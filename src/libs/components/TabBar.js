class TabBar {

    static get DEFAULT_CONFIG() {
        return {
            id: null, // The id
            navigation: false, // set to true if this is a navigation element, so that it wraps in a <nav /> element.
            responsive: true, // Set to false to disable responsive collapsing.
            menuicon: "menu", // the icon to use for the menu button, if in responsive mode.
            menulabel: "Toggle Menu", // Default text for the menu
            arialabel: 'Primary', // the aria label to use if this is a navigation
            submenuicon: 'triangle-down', // icon to indicate submenu

            vertical: false, // Vertical or horizontal
            animation: 'popin', // Set to null to disable animations
            tabs: [], // An array of tab definitions
            // {
            //    classes: [] // An array of css classes to add
                              // include "mobileonly" to only show item in mobile
            //    label: "Tab Text", // text, optional if given an icon
            //    id: null, // tab id, used with "activate(tabid)"
            //    icon: null, // an icon identifier, optional
            //    selected: false, // if true, start selected
            //    action: function(tab id, self) { } // what to do when the tab is clicked. if empty, uses default action.
            //    subtabs: null  // an array of tab definitions to indicate subtabs
            // }
            action: null, // a function, passed (tab id, self), where tab is the tab id, and self is this TabPanel.
                          // This is what will fire if there is no action defined on the tab definition.
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define a TabBar
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, TabBar.DEFAULT_CONFIG, config);
        this.tabmap = {};
        if (!this.id) { this.id = `tabbar-${Utils.getUniqueKey(5)}`; }
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Marks a specific tab as selected
     * @param tab the tab to select
     */
    select(tab) {
        if (typeof tab === 'string') {
            tab = document.querySelectorAll(`[data-tabid='${tab}']`)[0];
        }
        if (!tab) {
            console.warn(`Tab does not exist: ${tab}`);
            return;
        }
        if (this.selected) {
            this.selected.removeAttribute('aria-selected');
            this.selected.setAttribute('tabindex', '-1');
        }
        this.selected = tab;
        this.selected.setAttribute('aria-selected', 'true');
        this.selected.setAttribute('tabindex', '0');

        if ((this.responsive) && (this.menutitle)) {
            this.menutitle.innerHTML = this.selected.getAttribute('data-tabtext');
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the DOM.
     * @returns the container object
     */
    buildContainer() {
        const me = this;

        this.list = document.createElement('ul');
        this.list.setAttribute('role', 'tablist');
        this.list.classList.add('tabbar');

        for (let c of this.classes) {
            this.list.classList.add(c);
        }

        if (this.vertical) {
            this.list.classList.add('vertical');
        }
        let order = 1;

        for (let tabdef of this.tabs) {
            order = this.buildTab(tabdef, order);
        }

        if (this.navigation) {
            this.container = document.createElement('nav');
            this.list.removeAttribute('role');
            this.container.setAttribute('aria-label', this.arialabel);
        } else {
            this.container = document.createElement('div');
        }

        this.container.classList.add('tablist-container');

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.responsive) {
            this.responsivebox = document.createElement('div');
            this.responsivebox.classList.add('responsivebox');

            this.menubutton = new HamburgerButton({
                text: this.menulabel,
                toggletarget: me
            });
            this.responsivebox.appendChild(this.menubutton.button);

            this.menutitle = document.createElement('div');
            this.menutitle.classList.add('menutitle');
            this.responsivebox.appendChild(this.menutitle);

            this.container.classList.add('responsive');
            this.container.appendChild(this.responsivebox);
        }

        this.container.appendChild(this.list);
    }

    buildTab(tabdef, order, parent) {
        const me = this;
        let next = order + 1,
            previous = order - 1;

        if (previous < 1) {
            previous = 1;
        }
        if (next > this.tabs.length) {
            next = this.tabs.length;
        }

        if ((!tabdef.label) && (!tabdef.icon)) {
            console.warn('TabBar: Element defined but has neither icon or text.  Skipping');
            return null;
        }

        let link = document.createElement('a');
        link.setAttribute('data-tabtext', `${tabdef.label}`);
        link.setAttribute('data-tabno', `${order}`);
        link.setAttribute('id', tabdef.id);
        link.setAttribute('data-tabid', tabdef.id);
        if (!this.navigation) {
            link.setAttribute('role', 'menuitem');
        }

        if (tabdef.icon) {
            link.appendChild(IconFactory.icon(tabdef.icon));
        }
        if (tabdef.label) {
            let linktext = document.createElement('span');
            linktext.innerHTML = tabdef.label;
            link.appendChild(linktext);
        }

        let maplink = document.createElement('li');
        maplink.setAttribute('role', 'none');
        maplink.appendChild(link);
        if (tabdef.classes) {
            for (let c of tabdef.classes) {
                maplink.classList.add(c);
            }
        }

        this.tabmap[tabdef.id] = maplink;

        if (this.animation) {
            this.tabmap[tabdef.id].style.setProperty('--anim-order', `${order}`); // used in animations
            this.tabmap[tabdef.id].classList.add(this.animation);
        }

        if (parent) {
            let clink = parent.querySelector('a');
            link.setAttribute('data-parent', `${clink.getAttribute('data-tabid')}`);
            let plist = parent.querySelector('ul');
            if (!plist) {
                plist = document.createElement('ul');
                plist.setAttribute('role', 'menu');
                plist.setAttribute('aria-label', tabdef.label);
                plist.classList.add('submenu');
                parent.appendChild(plist);
            }
            plist.append(this.tabmap[tabdef.id]); // attach to child list
        } else {
            this.list.appendChild(this.tabmap[tabdef.id]); // attach to root list
        }

        order++;
        link.setAttribute('tabindex', '-1'); // always set this here

        // Is this a master menu item?

        if ((tabdef.subtabs) && (tabdef.subtabs.length > 0)) {
            link.classList.add('mastertab');
            link.setAttribute('aria-haspopup', true);
            link.setAttribute('aria-expanded', false);
            if (this.submenuicon) {
                link.appendChild(IconFactory.icon(this.submenuicon));
            }
            for (let subdef of tabdef.subtabs) {
                order = this.buildTab(subdef, order, this.tabmap[tabdef.id]);
            }
            // XXX SET open/close linking
        } else {
            // set link events here.
            link.addEventListener('keydown', function (e) {
                if ((e.key === 'ArrowLeft') || (e.key === 'ArrowUp')) { // Left arrow || Up Arrow
                    e.preventDefault();
                    e.stopPropagation();
                    me.list.querySelector(`[data-tabno='${previous}']`).focus();
                } else if ((e.key === 'ArrowRight') || (e.key === 'ArrowDown')) { // Right arrow || Down Arrow
                    e.preventDefault();
                    e.stopPropagation();
                    me.list.querySelector(`[data-tabno='${next}']`).focus();
                } else if ((e.key === " ") || (e.key === "Spacebar") || (e.key === 'Enter')) { // return or space
                    link.click();
                }
            });
            link.addEventListener('click', function (e) {
                e.preventDefault();
                me.select(tabdef.id);
                if ((tabdef.action) && (typeof tabdef.action === 'function')) {
                    tabdef.action(tabdef.id, me);
                } else if (me.action) {
                    me.action(tabdef.id, me);
                }
            });
        }

        if (tabdef.selected) {
            window.setTimeout(function() { // Have to wait until we're sure we're in the DOM
                me.select(tabdef.id);
            }, 100);
        }
        return order; // send this back.
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the menu is open
     * @return true if it is!
     */
    get isopen() {
        return this.container.hasAttribute('aria-expanded');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Toggle whether or not the menu is open
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
        this.container.setAttribute('aria-expanded', 'true');
        if (this.menubutton) { this.menubutton.open(); }

        /*
        setTimeout(function() { // Have to wait until we're sure we're in the DOM
            let sel = me.list.querySelector('a[aria-selected="true"]');
            if (!sel) {
                let fc = me.list.querySelector('li:first-child');
                sel = fc.querySelector('a');
            }
            if (sel) {
                me.scrollto(sel);
                //sel.focus();
            }
        }, 100);
         */
        setTimeout(function() { // Set this after, or else we'll get bouncing.
            me.setCloseListener();
        }, 200);
    }

    /**
     * Closes the menu
     */
    close() {
        this.container.removeAttribute('aria-expanded');
        if (this.menubutton) { this.menubutton.close(); }
    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;
        window.addEventListener('click', function(e) {
            if (e.target === me.list) {
                me.setCloseListener();
            } else {
                me.close();
            }
        }, {
            once: true,
        });
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get action() { return this.config.action; }
    set action(action) { this.config.action = action; }

    get animation() { return this.config.animation; }
    set animation(animation) { this.config.animation = animation; }

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get list() { return this._list; }
    set list(list) { this._list = list; }

    get menuicon() { return this.config.menuicon; }
    set menuicon(menuicon) { this.config.menuicon = menuicon; }

    get menulabel() { return this.config.menulabel; }
    set menulabel(menulabel) { this.config.menulabel = menulabel; }

    get menubutton() { return this._menubutton; }
    set menubutton(menubutton) { this._menubutton = menubutton; }

    get menutitle() { return this._menutitle; }
    set menutitle(menutitle) { this._menutitle = menutitle; }

    get navigation() { return this.config.navigation; }
    set navigation(navigation) { this.config.navigation = navigation; }

    get responsive() { return this.config.responsive; }
    set responsive(responsive) { this.config.responsive = responsive; }

    get responsivebox() { return this._responsivebox; }
    set responsivebox(responsivebox) { this._responsivebox = responsivebox; }

    get selected() { return this._selected; }
    set selected(selected) { this._selected = selected; }

    get submenuicon() { return this.config.submenuicon; }
    set submenuicon(submenuicon) { this.config.submenuicon = submenuicon; }

    get tabmap() { return this._tabmap; }
    set tabmap(tabmap) { this._tabmap = tabmap; }

    get tabs() { return this.config.tabs; }
    set tabs(tabs) { this.config.tabs = tabs; }

    get vertical() { return this.config.vertical; }
    set vertical(vertical) { this.config.vertical = vertical; }

}

