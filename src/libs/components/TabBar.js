class TabBar {

    static get DEFAULT_CONFIG() {
        return {
            id: null, // The id
            navigation: false, // set to true if this is a navigation element, so that it wraps in a <nav /> element.
            responsive: true, // Set to false to disable responsive collapsing.
            menuicon: "menu", // the icon to use for the menu button, if in responsive mode.
            menulabel: "Toggle Menu", // Default text for the menu
            arialabel: 'Primary', // the aria label to use if this is a navigation
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
            let icon,
                linktext,
                next = order + 1,
                previous = order - 1;

            if (previous < 1) {
                previous = 1;
            }
            if (next > this.tabs.length) {
                next = this.tabs.length;
            }

            if ((!tabdef.label) && (!tabdef.icon)) {
                console.warn('TabBar: Element defined but has neither icon or text.  Skipping');
                break;
            }

            if (tabdef.icon) {
                icon = IconFactory.icon(tabdef.icon);
            }
            if (tabdef.label) {
                linktext = document.createElement('span');
                linktext.innerHTML = tabdef.label;
            }

            let link = document.createElement('a');
            link.setAttribute('role', 'tab');
            link.setAttribute('aria-controls', `t-${tabdef.id}`);
            link.setAttribute('tabindex', '-1');
            link.setAttribute('data-tabno', `${order}`);
            link.setAttribute('id', tabdef.id);
            link.setAttribute('data-tabid', tabdef.id);
            if (icon) {
                link.appendChild(icon);
            }
            link.appendChild(linktext);

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

            let maplink = document.createElement('li');
            maplink.setAttribute('role', 'presentation');
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

            this.list.appendChild(this.tabmap[tabdef.id]);

            order++;


            if (tabdef.selected) {
                window.setTimeout(function() { // Have to wait until we're sure we're in the DOM
                    me.select(tabdef.id);
                }, 100);
            }
        }

        this.container = document.createElement('nav');
        this.container.classList.add('tablist-container');

        if (this.navigation) {
            this.container.setAttribute('role', 'navigation');
            this.container.setAttribute('aria-label', this.arialabel);
        }

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.responsive) {
            this.menubutton = new SimpleButton({
                action: function(e, self) { me.toggle(); },
                icon: this.menuicon,
                shape: 'square',
                text: this.menulable,
                classes: ['menuicon']
            });
            this.container.classList.add('responsive');
            this.container.appendChild(this.menubutton.button);
        }

        this.container.appendChild(this.list);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the button is open
     * @return true if it is!
     */
    get isopen() {
        return this.container.hasAttribute('aria-expanded');
    }

    /* CONTROL METHODS__________________________________________________________________ */

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

        setTimeout(function() { // Set this after, or else we'll get bouncing.
            me.setCloseListener();
        }, 200);
    }

    /**
     * Closes the button
     */
    close() {
        this.container.removeAttribute('aria-expanded');
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

    get menulable() { return this.config.menulable; }
    set menulable(menulable) { this.config.menulable = menulable; }

    get menubutton() { return this._menubutton; }
    set menubutton(menubutton) { this._menubutton = menubutton; }

    get navigation() { return this.config.navigation; }
    set navigation(navigation) { this.config.navigation = navigation; }

    get responsive() { return this.config.responsive; }
    set responsive(responsive) { this.config.responsive = responsive; }

    get selected() { return this._selected; }
    set selected(selected) { this._selected = selected; }

    get tabmap() { return this._tabmap; }
    set tabmap(tabmap) { this._tabmap = tabmap; }

    get tabs() { return this.config.tabs; }
    set tabs(tabs) { this.config.tabs = tabs; }

    get vertical() { return this.config.vertical; }
    set vertical(vertical) { this.config.vertical = vertical; }

}

