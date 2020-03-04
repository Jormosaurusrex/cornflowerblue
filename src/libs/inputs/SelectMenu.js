class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('selectmenu-placeholder-default'), // Default value to use when unselected
            icon: "chevron-down",
            prefix: null,   // a prefix to display in the trigger box.
            minimal: false, // if true, build with the intent that it is part of a larger component.
                            // this removes things like the search controls and validation boxes.
            options: [],    // Array of option dictionary objects.  Printed in order given.
                            // { label: "Label to show", value: "v", checked: true }
            onchange: null  // The change handler. Passed (self).
        };
    }

    /**
     * Define the SelectMenu
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, SelectMenu.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the button is open
     * @return boolean true if it is!
     */
    get isopen() {
        return (this.wrapper.getAttribute('aria-expanded') === 'true');
    }

    /**
     * Return the selected radio input.
     * @return {HTMLElement}
     */
    get selected() {
        let sel = this.optionlist.querySelector(`input[name=${this.name}]:checked`);
        if (sel.length > 0) { return sel; }
        return null;
    }

    get value() {
        return this.triggerbox.value;
    }

    get passivetext() {
        if (this.selectedoption) { return this.selectedoption.label; }
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Scroll to a specific element in the list
     * @param element the element to scroll to
     */
    scrollto(element) {
        if (!element) return;
        if ((this.scrolleditem) && (element.getAttribute('id') === this.scrolleditem.getAttribute('id'))) {
            return; // this is us, don't reflow.
        }
        this.optionlist.scrollTop = element.offsetHeight;
        this.scrolleditem = element;
    }

    /**
     * Scroll the select to the selected element and optionally set focus there
     * @param andfocus if true, focus on the element.
     */
    jumptoSelected(andfocus) {
        let sel = this.optionlist.querySelector('li[aria-selected="true"]');
        if (!sel) {
            sel = this.optionlist.querySelector('li:first-child');
        }
        if (sel) {
            this.scrollto(sel);
            if (andfocus) {
                sel.focus();
            }
        }
    }

    /**
     * Opens the option list.
     */
    open() {
        const me = this;

        if (SelectMenu.activeMenu) { // close any spuriously open other ones
            SelectMenu.activeMenu.close();
        }

        this.listbox.removeAttribute('aria-hidden');
        this.wrapper.setAttribute('aria-expanded', true);

        for (let li of Array.from(this.optionlist.querySelector('li'))) {
            li.setAttribute('tabindex', '0');
        }

        let vertpos = (Utils.getSingleEmInPixels() * 15); // menu height
        if (this.container) {
            vertpos += parseInt(this.container.getBoundingClientRect().top);
        } else {
            vertpos += parseInt(this.optionlist.getBoundingClientRect().top);
        }

        if (vertpos > window.innerHeight) {
            this.wrapper.classList.add('vert');
            if (this.container) { this.container.classList.add('vert'); }
        } else {
            this.optionlist.classList.remove('vert');
            if (this.container) { this.container.classList.remove('vert'); }
        }

        if (typeof SelectMenu.activeMenu === 'undefined' ) {
            SelectMenu.activeMenu = this;
        } else {
            SelectMenu.activeMenu = this;
        }

        setTimeout(function() { // Set this after, or else we'll get bouncing.
            me.setCloseListener();
        }, 100);

    }

    /**
     * Closes the option list.
     */
    close() {
        this.listbox.setAttribute('aria-hidden', 'true');
        this.listbox.setAttribute('tabindex', '-1');
        this.wrapper.setAttribute('aria-expanded', false);

        for (let li of Array.from(this.optionlist.querySelector('li'))) {
            li.setAttribute('tabindex', '-1');
        }

        this.searchkeys = [];
        this.updateSearch();
        SelectMenu.activeMenu = null;
    }

    disable() {
        this.triggerbox.setAttribute('disabled', 'disabled');
        this.wrapper.removeAttribute('aria-expanded');
        this.disabled = true;
        if (this.triggerbox) { this.triggerbox.classList.add('disabled'); }
        if (this.container) { this.container.classList.add('disabled'); }
    }

    enable() {
        this.triggerbox.removeAttribute('disabled');
        this.disabled = false;
        if (this.triggerbox) { this.triggerbox.classList.remove('disabled'); }
        if (this.container) { this.container.classList.remove('disabled'); }
    }

    pacify() {
        this.container.classList.add('passive');
        this.optionlist.setAttribute('aria-hidden', true);
        this.passive = true;
    }

    activate() {
        this.container.classList.remove('passive');
        this.optionlist.removeAttribute('aria-hidden');
        this.passive = false;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('select-container');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.labelobj) { this.container.appendChild(this.labelobj); }

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrap');
        this.wrapper.setAttribute('role', 'combobox');
        this.wrapper.setAttribute('aria-haspopup', 'listbox');
        this.wrapper.setAttribute('aria-expanded', false);
        this.wrapper.setAttribute('aria-owns', `${this.id}-options`);
        if (this.icon) { this.wrapper.classList.add(`cfb-${this.icon}`); }
        this.wrapper.appendChild(this.triggerbox);

        this.container.append(this.wrapper);

        this.listbox = document.createElement('div');
        this.listbox.setAttribute('id', `${this.id}-options`);
        this.listbox.setAttribute('aria-hidden', 'true');
        this.listbox.setAttribute('role', 'listbox');
        this.listbox.appendChild(this.optionlist);

        this.container.appendChild(this.listbox);

        if (!this.minimal) {
            this.container.appendChild(this.passivebox);
            this.container.appendChild(this.messagebox);
        }
        if (this.minimal) { this.container.classList.add('minimal'); }

        this.postContainerScrub();
    }

    /**
     * Builds the trigger box for the select.
     */
    buildTriggerBox() {
        const me = this;
        this.triggerbox = document.createElement('input');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('type', 'text');
        this.triggerbox.setAttribute('tabindex', '0');
        this.triggerbox.setAttribute('aria-autocomplete', 'none');
        this.triggerbox.setAttribute('aria-activedescendant', '');
        this.triggerbox.setAttribute('placeholder', this.placeholder);

        this.triggerbox.addEventListener('focusin', function(e) {
            if (me.disabled) {
                e.stopPropagation();
                return;
            }
            me.triggerbox.select(); // Select all the text
            me.open();
        });

        this.triggerbox.addEventListener('keyup', function(e) {
            if ((e.shiftKey) && (e.keyCode === 9)) {  // Shift + Tab
                me.close();
            } else {
                switch (e.keyCode) {
                    case 40: // Down
                        e.preventDefault();
                        me.open();
                        me.jumptoSelected(true);
                        break;
                    case 8:  // Backspace
                        me.updateSearch();
                        break;
                    case 17: // ctrl
                    case 18: // alt
                    case 91: // command
                        // Nothing.
                        break;
                    default:
                        me.updateSearch();
                        break;
                }
            }
        });

        if (this.mute) { this.triggerbox.classList.add('mute'); }

    }

    calculatePlaceholder() {
        if (this.unselectedtext) {
            return this.unselectedtext;
        }
        return TextFactory.get('selectmenu-placeholder-default');
    }

    buildOptions() {

        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('selectmenu');
        this.optionlist.setAttribute('id', this.id);
        this.optionlist.setAttribute('tabindex', '-1');

        let order = 1;
        for (let opt of this.options) {
            let o = this.buildOption(opt, order);
            if (opt.checked) {
                this.selectedoption = opt;
            }
            order++;
            this.optionlist.appendChild(o);
        }
    }

    buildOption(def, order) {
        const me = this;

        const lId = `${this.id}-${Utils.getUniqueKey(5)}`;
        let next = order + 1,
            previous = order - 1;
        if (this.unselectedtext) {
            if (previous < 0) { previous = 0; }
        } else {
            if (previous < 1) { previous = 1; }
        }
        if (next > this.options.length) { next = this.options.length; }

        let li = document.createElement('li');
        li.setAttribute('tabindex', '-1');
        li.setAttribute('id', `li-${lId}`);
        li.setAttribute('data-menuorder', order);
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', def.value);

        li.addEventListener('keydown', function(e) {
            if ((e.shiftKey) && (e.keyCode === 9)) {  // Shift + Tab
                me.close();
            } else {
                switch (e.keyCode) {
                    case 9:  // Tab
                    case 27: // Escape
                        me.close();
                        break;
                    case 38: // Up
                        e.preventDefault();
                        me.optionlist.querySelector(`[data-menuorder='${previous}']`).focus();
                        break;
                    case 40: // Down
                        e.preventDefault();
                        me.optionlist.querySelector(`[data-menuorder='${next}']`).focus();
                        break;
                    case 13: // Return
                    case 32: // Space
                        li.click(); // click the one inside
                        break;
                    case 8:  // Backspace
                        me.updateSearch();
                        break;
                    case 17: // ctrl
                    case 18: // alt
                    case 91: // command
                        // Nothing.
                        break;
                    default:
                        me.updateSearch();
                        break;
                }
            }

        });

        li.addEventListener('click', function() {
            let opts = me.optionlist.querySelectorAll('li');
            for (let o of opts) {
                o.removeAttribute('aria-selected');
            }
            li.setAttribute('aria-selected', 'true');

            if (me.prefix) {
                me.triggerbox.value = `${me.prefix} ${def.label}`;
            } else {
                me.triggerbox.value = def.label;
            }

            me.selectedoption = def;

            if (def.label === me.unselectedtext) {
                me.passivebox.innerHTML = me.unsettext;
            } else {
                me.passivebox.innerHTML = def.label;
            }

            me.close();

            me.validate();

            if (me.form) { me.form.validate(); }

            if ((me.onchange) && (typeof me.onchange === 'function')) {
                me.onchange(me);
            }
        });

        li.innerHTML = def.label;

        if (def.checked) {
            this.origval = def.value;
            if (this.prefix) {
                this.triggerbox.value = `${this.prefix} ${def.label}`;
            } else {
                this.triggerbox.value = def.label;
            }
            li.setAttribute('aria-selected', 'true');
        }

        return li;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Search the list of options and scroll to it
     * @param s the string to search
     */
    findByString(s) {
        if ((!s) || (typeof s !== 'string')) { return; }
        for (let li of this.optionlist.querySelectorAll('li')) {
            if (li.innerHTML.toUpperCase().startsWith(s.toUpperCase())) {
                this.scrollto(li);
                li.focus();
                break;
            }
        }
    }

    /**
     * Updates the counter
     */
    updateSearch() {
        this.findByString(this.value);
    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;
        window.addEventListener('click', function(e) {
            if ((me.wrapper.contains(e.target)) || (me.listbox.contains(e.target))) {
                me.setCloseListener();
            } else {
                me.close();
            }
        }, {
            once: true,
        });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get listbox() { return this._listbox; }
    set listbox(listbox) { this._listbox = listbox; }

    get minimal() { return this.config.minimal; }
    set minimal(minimal) { this.config.minimal = minimal; }

    get onchange() { return this.config.onchange; }
    set onchange(onchange) { this.config.onchange = onchange; }

    get optionlist() {
        if (!this._optionlist) { this.buildOptions(); }
        return this._optionlist;
    }
    set optionlist(optionlist) { this._optionlist = optionlist; }

    get options() { return this.config.options; }
    set options(options) { this.config.options = options; }

    get prefix() { return this.config.prefix; }
    set prefix(prefix) { this.config.prefix = prefix; }

    get selectedoption() { return this._selectedoption; }
    set selectedoption(selectedoption) { this._selectedoption = selectedoption; }

    get scrolleditem() { return this._scrolleditem; }
    set scrolleditem(scrolleditem) { this._scrolleditem = scrolleditem; }

    get triggerbox() {
        if (!this._triggerbox) { this.buildTriggerBox(); }
        return this._triggerbox;
    }
    set triggerbox(triggerbox) { this._triggerbox = triggerbox; }

    get unselectedtext() { return this.config.unselectedtext; }
    set unselectedtext(unselectedtext) { this.config.unselectedtext = unselectedtext; }

    get wrapper() { return this._wrapper; }
    set wrapper(wrapper) { this._wrapper = wrapper; }

}


