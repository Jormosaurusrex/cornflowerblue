class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            combobox: false,
            unselectedtext: TextFactory.get('selectmenu-placeholder-default'), // Default value to use when unselected
            icon: "chevron-down",
            prefix: null,   // a prefix to display in the trigger box.
            value: null,    // Use this to set the value of the item
            options: [],    // Array of option dictionary objects.  Printed in order given.
                            // { label: "Label to show", value: "v", checked: true }
            onchange: null  // The change handler. Passed (self).
        };
    }

    /**
     * Close open menus
     */
    static closeOpen() {
        if (SelectMenu.activeMenu) {
            SelectMenu.activeMenu.close();
        }
    }

    /**
     * Define the SelectMenu
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, SelectMenu.DEFAULT_CONFIG, config);
        if (!config.name) {
            config.name = `sel-name-${CFBUtils.getUniqueKey(5)}`;
        }
        super(config);

        if (config.value) {
            this.origval = config.value;
        }
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
        if (sel) { return sel; }
        return null;
    }

    get value() {
        if (!this.selected) { return null; }
        return this.selected.value;
    }

    set value(value) {
        this.config.value = value;
        this.triggerbox.value = value;
        this.passivebox.value = value;
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

        SelectMenu.closeOpen(); // close open menus

        document.body.appendChild(this.listbox);

        this.listbox.removeAttribute('aria-hidden');
        this.wrapper.setAttribute('aria-expanded', true);

        for (let li of Array.from(this.optionlist.querySelectorAll('li'))) {
            li.setAttribute('tabindex', '0');
        }

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.wrapper.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top;

        this.listbox.style.top = `${(offsetTop + this.wrapper.clientHeight)}px`;
        this.listbox.style.left = `${offsetLeft}px`;
        this.listbox.style.width = `${this.container.clientWidth}px`;


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

        for (let li of Array.from(this.optionlist.querySelectorAll('li'))) {
            li.setAttribute('tabindex', '-1');
        }

        if (!this.combobox) {
            this.triggerbox.value = this.value;
        }

        this.container.appendChild(this.listbox);
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
        this.listbox.classList.add('selectmenu-menu')
        this.listbox.appendChild(this.optionlist);

        this.container.appendChild(this.listbox);

        if (!this.minimal) {
            this.container.appendChild(this.passivebox);
            this.container.appendChild(this.messagebox);
        }
        if (this.minimal) { this.container.classList.add('minimal'); }

        if (this.value) {
            //this.select(this.value);
        }

        this.postContainerScrub();
    }

    /**
     * Select a specific entry, given a value
     * @param value the value to select
     */
    select(value) {
        let allopts = this.listbox.querySelectorAll('li');
        for (let o of allopts) {
            let radio = o.querySelector(`input[name=${this.name}`);
            if (o.getAttribute('data-value') === value) {
                o.setAttribute('aria-selected', true);
                radio.checked = true;
            } else {
                o.removeAttribute('aria-selected');
                radio.checked = false;
            }
        }
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
            if ((e.shiftKey) && (e.key === 'Tab')) {  // Shift + Tab
                me.close();
            } else {
                switch (e.key) {
                    case 'Enter':
                    case 'Shift':
                    case 'Control':
                    case 'Alt':
                    case 'CapsLock':
                    case 'NumLock':
                    case 'ScrollLock':
                    case 'End':
                    case 'Home':
                    case 'Meta':
                    case 'PageUp':
                        // Nothing.
                        break;
                    case 'Tab':  // Tab
                    case 'Escape': // Escape
                    case 'ArrowUp': // Up
                        me.close();
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        me.open();
                        me.jumptoSelected(true);
                        break;
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        me.updateSearch();
                        break;
                    case ' ': // space
                    default:
                        me.updateSearch();
                        break;
                }
            }
        });

        if (this.mute) { this.triggerbox.classList.add('mute'); }

    }

    calculatePlaceholder() {
        if (this.unselectedtext) { return this.unselectedtext; }
        return TextFactory.get('selectmenu-placeholder-default');
    }

    buildOptions() {

        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('selectmenu');
        this.optionlist.setAttribute('id', this.id);
        this.optionlist.setAttribute('tabindex', '-1');

        let order = 1;
        let minchars = 5;
        for (let opt of this.options) {
            if ((this.origval) && (this.origval === opt.value)) {
                opt.checked = true;
                this.selectedoption = opt;
            } else {
                delete opt.checked;
            }

            let o = this.buildOption(opt, order);

            if ((opt.label) && (opt.label.length > minchars)) {
                minchars = opt.label.length;
            }
            order++;
            this.optionlist.appendChild(o);
        }
        this.triggerbox.style.minWidth = `${(minchars * CFBUtils.getSingleEmInPixels())}px`;
    }

    buildOption(def, order) {
        const me = this;

        const lId = `${this.id}-${CFBUtils.getUniqueKey(5)}`;
        let next = order + 1,
            previous = order - 1;
        if (this.unselectedtext) {
            if (previous < 0) { previous = 0; }
        } else {
            if (previous < 1) { previous = 1; }
        }
        if (next > this.options.length) { next = this.options.length; }

        let opt = document.createElement('input');
        opt.setAttribute('type', 'radio');
        opt.setAttribute('name', this.name);
        opt.value = def.value;
        if (def.checked) {
            opt.checked = true;
        }

        let li = document.createElement('li');
        li.setAttribute('tabindex', '-1');
        li.setAttribute('id', `li-${lId}`);
        li.setAttribute('data-menuorder', order);
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', def.value);

        li.appendChild(opt);

        li.addEventListener('keydown', function(e) {
            if ((e.shiftKey) && (e.key === 'Escape')) {  // Shift + Tab
                me.close();
            } else {
                switch (e.key) {
                    case 'Shift':
                    case 'Control':
                    case 'Alt':
                    case 'CapsLock':
                    case 'NumLock':
                    case 'ScrollLock':
                    case 'End':
                    case 'Home':
                    case 'Meta':
                    case 'PageUp':
                        // Nothing.
                        break;
                    case 'Tab':  // Tab
                    case 'Escape': // Escape
                    case 'ArrowUp': // Up
                        e.preventDefault();
                        me.optionlist.querySelector(`[data-menuorder='${previous}']`).focus();
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        me.optionlist.querySelector(`[data-menuorder='${next}']`).focus();
                        break;
                    case 'Enter':
                        li.click(); // click the one inside
                        break;
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        me.triggerbox.value = me.triggerbox.value.substring(0, me.value.length - 1);
                        me.updateSearch();
                        break;
                    case ' ': // space
                    default:
                        e.preventDefault();
                        me.triggerbox.value = me.triggerbox.value + e.key;
                        me.updateSearch();
                        break;
                }
            }

        });

        li.addEventListener('click', function() {
            let listentries = me.optionlist.querySelectorAll('li');
            for (let le of listentries) {
                le.removeAttribute('aria-selected');
                let opt = le.querySelector(`input[name=${me.name}]`);
                if (opt) { opt.removeAttribute('checked') ; }
            }
            li.setAttribute('aria-selected', 'true');
            li.querySelector(`input[name=${me.name}]`).checked = true;

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

        let text = document.createElement('span');
        text.classList.add('text');
        text.innerHTML = def.label;
        li.appendChild(text);

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
            let optiontext = li.querySelector('span.text').innerHTML.toUpperCase();
            if (optiontext.indexOf(s.toUpperCase()) !== -1) {
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
        this.findByString(this.triggerbox.value);
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
            if ((me.wrapper.contains(e.target)) || (me.listbox.contains(e.target))) {
                me.setCloseListener();
            } else {
                me.close();
            }
        }, { once: true });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get combobox() { return this.config.combobox; }
    set combobox(combobox) { this.config.combobox = combobox; }

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
window.SelectMenu = SelectMenu;