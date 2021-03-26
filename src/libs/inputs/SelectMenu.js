class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            combobox: false,
            placeholder: TextFactory.get('selectmenu-placeholder-default'),
            unselectedtext: null, // If present, allow for a deselect and use this text.
            icon: "chevron-down",
            prefix: null,   // a prefix to display in the trigger box.
            value: null,    // Use this to set the value of the item
            options: [],    // Array of option dictionary objects.  Printed in order given.
                            // { label: "Label to show", value: "v", checked: true }
            onchange: null  // The change handler. Passed (self).
        };
    }

    static get DOCUMENTATION() {
        return {
            combobox: { type: 'option', datatype: 'boolean', description: "If true, treat the SelectMenu as combobox" },
            unselectedtext: { type: 'option', datatype: 'string', description: "If present, allow for a deselect and use this text for the 'unselect' value." },
            placeholder: { type: 'option', datatype: 'string', description: "Input placeholder. Individual fields can calculate this if it's null. To insure a blank placeholder, set the value to ''." },
            icon: { type: 'option', datatype: 'string', description: "Use to define a specific icon, used in some specific controls." },
            prefix: { type: 'option', datatype: 'string', description: "A prefix to display in the trigger box." },
            value: { type: 'option', datatype: 'string', description: "Value to use for the element. This is the option value not the option label" },
            options: { type: 'option', datatype: 'array', description: "Array of option dictionaries. { label: 'Label to show', value: 'value_to_save', checked: false }" },
            onchange: { type: 'option', datatype: 'function', description: "The change handler. Passed (self)." }
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
        this.triggerbox.value = this.getOptionLabel(value);
        this.setPassiveboxValue(value);
    }

    getOptionLabel(value) {
        let label = "";
        for (let o of this.options) {
            if (o.value === value) {
                label = o.label;
            }
        }
        return label;
    }

    reset() {
        this.value = this.origval;
        if (((!this.value) || ((this.value) && (this.value.trim() !== ''))) && (this.hascontainer)) {
            this.container.classList.add('filled');
        } else if (this.hascontainer) {
            this.container.classList.remove('filled');
        }
    }

    setPassiveboxValue(value) {
        this.passivebox.innerHTML = this.getOptionLabel(value);
    }

    get passivetext() {
        let p = this.unsettext;
        if (this.selectedoption) { p = this.selectedoption.label; }
        if (this.value) { p = this.value; }
        if (this.config.value) { p = this.config.value; }
        return document.createTextNode(this.getOptionLabel(p));
    }

    drawPayload(def) {
        let text = document.createElement('span');
        text.classList.add('text');
        text.innerHTML = def.label;
        return text;
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
        SelectMenu.closeOpen(); // close open menus
        document.body.appendChild(this.listbox);

        this.listbox.removeAttribute('aria-hidden');
        this.wrapper.setAttribute('aria-expanded', true);
        this.container.setAttribute('aria-expanded', true);

        for (let li of Array.from(this.optionlist.querySelectorAll('li'))) {
            li.setAttribute('tabindex', '0');
        }

        if (typeof SelectMenu.activeMenu === 'undefined' ) {
            SelectMenu.activeMenu = this;
        } else {
            SelectMenu.activeMenu = this;
        }

        let x = window.scrollX,
            y = window.scrollY;
        window.onscroll = () => { window.scrollTo(x, y); };

        this.setPosition();

        setTimeout(() => { // Set this after, or else we'll get bouncing.
            this.setCloseListener();
        }, 100);
    }

    /**
     * Set the position of the open menu on the screen
     */
    setPosition() {
        if (!SelectMenu.activeMenu) { return; }

        let self = SelectMenu.activeMenu,
            bodyRect = document.body.getBoundingClientRect(),
            elemRect = self.triggerbox.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top,
            sumHeight = self.triggerbox.clientHeight + self.optionlist.clientHeight;

        self.listbox.style.left = `${offsetLeft}px`;
        self.listbox.style.width = `${self.container.clientWidth}px`;

        if ((elemRect.top + sumHeight) > window.innerHeight) {
            self.listbox.classList.add('vert');
            self.listbox.style.top = `${(offsetTop - self.optionlist.clientHeight)}px`;
            self.listbox.style.bottom = `${offsetTop}px`;
        } else {
            self.listbox.classList.remove('vert');
            self.listbox.style.top = `${(offsetTop + self.triggerbox.clientHeight)}px`;
        }
    }

    /**
     * Closes the option list.
     */
    close() {
        //window.removeEventListener('scroll', this.setPosition, true);
        window.onscroll=() => {};
        this.listbox.style.top = null;
        this.listbox.style.bottom = null;
        this.listbox.style.left = null;
        this.listbox.style.width = null;

        this.listbox.setAttribute('aria-hidden', 'true');
        this.listbox.setAttribute('tabindex', '-1');
        this.wrapper.setAttribute('aria-expanded', false);
        this.container.setAttribute('aria-expanded', false);

        for (let li of Array.from(this.optionlist.querySelectorAll('li'))) {
            li.setAttribute('tabindex', '-1');
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

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container', 'select-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.labelobj) { this.container.appendChild(this.labelobj); }

        this.topline = document.createElement('div');
        this.topline.classList.add('topline');
        if (this.label) { this.topline.appendChild(this.labelobj); }
        this.container.appendChild(this.topline);

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrap');
        this.wrapper.setAttribute('role', 'combobox');
        this.wrapper.setAttribute('aria-haspopup', 'listbox');
        this.wrapper.setAttribute('aria-expanded', false);
        this.wrapper.setAttribute('aria-owns', `${this.id}-options`);
        if (this.icon) { this.wrapper.classList.add(`cfb-${this.icon}`); }
        this.wrapper.appendChild(this.triggerbox);

        this.container.appendChild(this.wrapper);

        this.listbox = document.createElement('div');
        this.listbox.setAttribute('id', `${this.id}-options`);
        this.listbox.setAttribute('aria-hidden', 'true');
        this.listbox.setAttribute('role', 'listbox');
        this.listbox.classList.add('selectmenu-menu');
        for (let c of this.classes) {
            this.listbox.classList.add(c);
        }
        this.listbox.appendChild(this.optionlist);

        CFBUtils.applyDataAttributes(this.attributes, this.listbox);

        this.container.appendChild(this.listbox);

        if (!this.minimal) {
            this.container.appendChild(this.passivebox);
            this.container.appendChild(this.messagebox);
        }
        if (this.minimal) { this.container.classList.add('minimal'); }

        if (this.value) {
            this.select(this.value);
        }

        this.postContainerScrub();
    }

    /**
     * Builds the trigger box for the select.
     */
    buildTriggerBox() {

        this.triggerbox = document.createElement('input');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('type', 'text');
        this.triggerbox.setAttribute('tabindex', '0');
        this.triggerbox.setAttribute('aria-autocomplete', 'none');
        this.triggerbox.setAttribute('aria-activedescendant', '');
        this.triggerbox.setAttribute('placeholder', this.placeholder);

        this.triggerbox.addEventListener('focusin', (e) => {
            if (this.disabled) {
                e.stopPropagation();
                return;
            }
            this.triggerbox.select(); // Select all the text
            this.open();
        });

        this.triggerbox.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Tab':  // Tab
                    // Nothing.
                    console.log('tab');
                    this.close();
                    break;
                default:
                    break;
            }
        });

        this.triggerbox.addEventListener('keyup', (e) => {
            if ((e.shiftKey) && (e.key === 'Tab')) {  // Shift + Tab
                this.close();
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
                    case 'Tab':  // Tab
                        // Nothing.
                        break;
                    case 'Escape': // Escape
                    case 'ArrowUp': // Up
                        this.close();
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        this.open();
                        this.jumptoSelected(true);
                        break;
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        this.updateSearch();
                        break;
                    case ' ': // space
                    default:
                        this.updateSearch();
                        break;
                }
            }
        });

        if (this.mute) { this.triggerbox.classList.add('mute'); }
    }

    buildOptions() {

        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('selectmenu');
        this.optionlist.setAttribute('id', this.id);
        this.optionlist.setAttribute('tabindex', '-1');

        let order = 0;
        if (this.unselectedtext) {
            let unsel = {
                label: this.unselectedtext,
                value: '',
                unselectoption: true
            };
            if (!this.value) {
                unsel.checked = true;
                this.selectedoption = unsel;
            }
            if (this.options) {
                this.options.unshift(unsel);
            } else {
                console.log("NO OPTIONS");
            }
        }

        for (let opt of this.options) {
            if ((this.origval) && (this.origval === opt.value)) {
                opt.checked = true;
                this.selectedoption = opt;
            } else {
                delete opt.checked;
            }

            this.optionlist.appendChild(this.buildOption(opt, order++));
        }
    }

    buildOption(def, order) {

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

        li.addEventListener('keydown', (e) => {
            if ((e.shiftKey) && (e.key === 'Escape')) {  // Shift + Tab
                this.close();
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
                        this.optionlist.querySelector(`[data-menuorder='${previous}']`).focus();
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        this.optionlist.querySelector(`[data-menuorder='${next}']`).focus();
                        break;
                    case 'Enter':
                        li.click(); // click the one inside
                        break;
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        this.triggerbox.value = this.triggerbox.value.substring(0, this.value.length - 1);
                        this.updateSearch();
                        break;
                    case ' ': // space
                    default:
                        e.preventDefault();
                        this.triggerbox.value = this.triggerbox.value + e.key;
                        this.updateSearch();
                        break;
                }
            }

        });

        li.addEventListener('click', () => {
            let listentries = this.optionlist.querySelectorAll('li');
            for (let le of listentries) {
                le.removeAttribute('aria-selected');
                let opt = le.querySelector(`input[name=${this.name}]`);
                if (opt) { opt.removeAttribute('checked') ; }
            }
            li.setAttribute('aria-selected', 'true');
            li.querySelector(`input[name=${this.name}]`).checked = true;

            if (def.unselectoption) {
                this.triggerbox.value = '';
            } else if (this.prefix) {
                this.triggerbox.value = `${this.prefix} ${def.label}`;
            } else {
                this.triggerbox.value = def.label;
            }

            this.selectedoption = def;


            if (def.unselectoption) {
                this.setPassiveboxValue(this.unsettext);
            } else {
                this.setPassiveboxValue(def.label);
            }

            this.close();

            this.validate();

            if (this.form) { this.form.validate(); }

            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(this);
            }
        });

        li.appendChild(this.drawPayload(def));

        if (def.checked) {
            this.origval = def.value;
            if (def.unselectoption) {
                this.triggerbox.value = '';
            } else if (this.prefix) {
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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { this.close(); }
        }, { once: true });

        window.addEventListener('click', (e) => {
            if ((this.wrapper.contains(e.target)) || (this.listbox.contains(e.target))) {
                this.setCloseListener();
            } else {
                this.close();
            }
        }, { once: true });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get combobox() { return this.config.combobox; }
    set combobox(combobox) { this.config.combobox = combobox; }

    get listbox() { return this._listbox; }
    set listbox(listbox) { this._listbox = listbox; }

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

    get wrapper() { return this._wrapper; }
    set wrapper(wrapper) { this._wrapper = wrapper; }

}
window.SelectMenu = SelectMenu;