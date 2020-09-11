class TabBar {

    static get DEFAULT_CONFIG() {
        return {
            id: null, // The id
            navigation: false, // set to true if this is a navigation element, so that it wraps in a <nav /> element.
            responsive: true, // Set to false to disable responsive collapsing.
            menuicon: "menu", // the icon to use for the menu button, if in responsive mode.
            menulabel: TextFactory.get('toggle_menu'), // Default text for the menu
            arialabel: TextFactory.get('primary'), // the aria label to use if this is a navigation
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
            //    tooltip: null, // an optional tooltip
            //    url: null, // just go to this url,
            //    selected: false, // if true, start selected
            //    action: (tab id, self) => { } // what to do when the tab is clicked. if empty, uses default action.
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
        if (!this.id) { this.id = `tabbar-${CFBUtils.getUniqueKey(5)}`; }
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

    deselectAll() {
        if (this.selected) {
            this.selected.removeAttribute('aria-selected');
            this.selected.setAttribute('tabindex', '-1');
            this.selected = null;
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the DOM.
     */
    buildContainer() {


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
                toggletarget: this
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

    /**
     * Build the actual tab list object
     */
    buildList() {
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
    }

    /**
     * Build an individual tab
     * @param tabdef the tab definition
     * @param order the taborder
     * @param parent the parent tab object, if any (this will be an li)
     * @return the next in the order
     */
    buildTab(tabdef, order, parent) {

        let parentname = 'root',
            next = order + 1,
            previous = order - 1;

        if (previous < 1) { previous = 0; }

        if ((!tabdef.label) && (!tabdef.icon)) {
            console.warn('TabBar: Element defined but has neither icon or text.  Skipping');
            return null;
        }

        let li = document.createElement('li');
        li.setAttribute('role', 'none');
        li.setAttribute('id', `parent-${tabdef.id}`);
        li.setAttribute('data-tabno', `${order}`);
        if (tabdef.classes) {
            for (let c of tabdef.classes) {
                li.classList.add(c);
            }
        }
        if (tabdef.tooltip) {
            new ToolTip({
                text: tabdef.tooltip,
                icon: tabdef.tipicon,
                gravity: (tabdef.tooltipgravity ? tabdef.tooltipgravity : 's')
            }).attach(li);
        }

        let link = document.createElement('a');
        link.setAttribute('data-tabtext', tabdef.label);
        link.setAttribute('data-tabno', order);
        link.setAttribute('id', tabdef.id);
        link.setAttribute('data-tabid', tabdef.id);
        link.setAttribute('tabindex', '-1'); // always set this here
        if (!this.navigation) {
            link.setAttribute('role', 'menuitem');
        }
        if (tabdef.icon) {
            link.appendChild(IconFactory.icon(tabdef.icon));
        }
        if (tabdef.label) {
            let linktext = document.createElement('span');
            linktext.classList.add('t');
            linktext.innerHTML = tabdef.label;
            link.appendChild(linktext);
        }

        li.appendChild(link);

        if (parent) {
            parentname = parent.getAttribute('data-tabid');
            let plist = parent.querySelector('ul');
            if (!plist) {
                plist = document.createElement('ul');
                plist.setAttribute('role', 'menu');
                plist.classList.add('submenu');
                parent.appendChild(plist);
            }
            plist.appendChild(li); // attach to child list
        } else {
            if (this.animation) {
                li.style.setProperty('--anim-order', order); // used in animations
                li.classList.add(this.animation);
            }
            this.list.appendChild(li); // attach to root list
        }
        link.setAttribute('data-parent', parentname);
        li.setAttribute('data-parent', parentname);
        order++;

        // Is this a master menu item?
        if ((tabdef.subtabs) && (tabdef.subtabs.length > 0)) {
            link.classList.add('mastertab');
            link.setAttribute('aria-haspopup', true);
            link.setAttribute('aria-expanded', false);
            if (this.submenuicon) {
                let sicon = IconFactory.icon(this.submenuicon);
                sicon.classList.add('secondicon');
                link.appendChild(sicon);
            }
            // Add the subtabs ins
            let localorder = 1;
            for (let subdef of tabdef.subtabs) {
                localorder = this.buildTab(subdef, localorder, li);
            }

            link.addEventListener('keydown', (e) => {
                let setname = li.getAttribute('data-parent');
                let prevtab = li.parentNode.querySelector(`li[data-parent='${setname}'][data-tabno='${previous}'] a[data-tabno='${previous}']`);
                let nexttab = li.parentNode.querySelector(`li[data-parent='${setname}'][data-tabno='${next}'] a[data-tabno='${next}']`);

                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        e.stopPropagation();
                        if (prevtab) {
                            prevtab.focus();
                        }
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        e.stopPropagation();
                        if (nexttab) {
                            nexttab.focus();
                        }
                        break;
                    case 'ArrowDown':
                    case 'Enter':
                    case 'Space':
                        e.preventDefault();
                        e.stopPropagation();
                        let ul = li.querySelector('ul');
                        if (ul) {
                            let children = ul.querySelectorAll('li a');
                            children[0].focus();
                        }
                        break;
                    default:
                        break;
                }
            });
        } else if (tabdef.url) {
            link.setAttribute('href', tabdef.url);
        } else { // Non-Master Tabs
            link.addEventListener('keydown', (e) => {

                let setname = li.getAttribute('data-parent');
                let prevtab = li.parentNode.querySelector(`li[data-parent='${setname}'][data-tabno='${previous}'] a[data-tabno='${previous}']`);
                let nexttab = li.parentNode.querySelector(`li[data-parent='${setname}'][data-tabno='${next}'] a[data-tabno='${next}']`);
                let parenttab;
                if (parent) {
                    parenttab = parent.querySelector('a');
                }

                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        e.stopPropagation();
                        if ((previous === 0) && (parenttab)) {
                            parenttab.focus();
                        } else if (prevtab) {
                            prevtab.focus();
                        }
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        e.stopPropagation();
                        if (nexttab) {
                            nexttab.focus();
                        }
                        break;
                    case 'Escape':
                        e.preventDefault();
                        e.stopPropagation();
                        if (parenttab) {
                            parenttab.focus();
                        }
                        break;
                    case 'Enter':
                    case 'Space':
                        e.preventDefault();
                        e.stopPropagation();
                        link.click();
                        break;
                    default:
                        break;
                }
            });
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.select(tabdef.id);
                if ((tabdef.action) && (typeof tabdef.action === 'function')) {
                    tabdef.action(tabdef.id, me);
                } else if (this.action) {
                    this.action(tabdef.id, me);
                }
                link.blur();
            });
        }

        if (tabdef.selected) {
            window.setTimeout(()  => { // Have to wait until we're sure we're in the DOM
                this.select(tabdef.id);
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

        if (this.isopen) { return; }
        this.container.setAttribute('aria-expanded', 'true');
        if (this.menubutton) { this.menubutton.open(); }
        setTimeout(()  => { // Set this after, or else we'll get bouncing.
            this.setCloseListener();
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


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { this.close(); }
        }, { once: true });

        window.addEventListener('click', (e) => {
            if (e.target === this.list) {
                this.setCloseListener();
            } else {
                this.close();
            }
        }, { once: true, });
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

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

    get list() {
        if (!this._list) { this.buildList(); }
        return this._list;
    }
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

    get tabs() { return this.config.tabs; }
    set tabs(tabs) { this.config.tabs = tabs; }

    get vertical() { return this.config.vertical; }
    set vertical(vertical) { this.config.vertical = vertical; }

}
window.TabBar = TabBar;
