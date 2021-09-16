class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            combobox: false,
            preventscroll: null, // An array containing elements that should not be able to scroll when the thing is open.
            placeholder: TextFactory.get('selectmenu-placeholder-default'),
            unselectedtext: null, // If present, allow for a deselect and use this text.
            icon: "chevron-down",
            prefix: null,   // a prefix to display in the trigger box.
            value: null,    // Use this to set the value of the item
            options: [],    // Array of option dictionary objects.  Printed in order given.
                            // { label: "Label to show", value: "v", checked: true }
            onenter: null,  // With a combobox, fired when the enter key is hit. passed (self)
            onchange: null,  // The change handler. Passed (self, e).
            drawitem: null  // passed (itemdef, self)
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
        let menu = document.getElementById(`cfb-selectmenu`);
        if (menu) {
            menu.setAttribute('aria-hidden', 'true');
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
        this.emsize = CFBUtils.getSingleEmInPixels();
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the button is open
     * @return boolean true if it is!
     */
    get isopen() {
        return (this.optionlist.getAttribute('aria-hidden') !== 'true');
    }

    /**
     * Return the selected radio input.
     * @return {HTMLElement}
     */
    get selected() {
        if (!this.optionlist) {
            this.buildOptionList();
        }
        let sel = this.optionlist.querySelector(`input[name=${this.name}]:checked`);
        if (sel) { return sel; }
        return null;
    }

    get value() {
        return this.input.value;
    }

    set value(value) {
        this.config.value = value;
        this.input.value = value;
        this.triggerbox.value = this.getOptionLabel(value);
        this.setPassiveboxValue(value);
    }

    get passivetext() {
        let p = this.unsettext;
        if (this.selectedoption) { p = this.selectedoption.label; }
        if (this.value) { p = this.value; }
        if (this.config.value) { p = this.config.value; }
        return document.createTextNode(this.getOptionLabel(p));
    }

    getOptionLabel(value) {
        let label = "";
        for (let o of this.options) {
            if (o.value.toString() === value.toString()) {
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

    drawPayload(def) {
        if ((this.drawitem) && (typeof this.drawitem === 'function')) {
            return this.drawitem(def, this);
        }
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
        console.log('OPEN');
        this.optionlist.classList.remove(...this.optionlist.classList);

        for (let c of this.classes) {
            this.optionlist.classList.add(c);
        }
        this.fillOptions();

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

        if (this.preventscroll){
            for (let element of this.preventscroll) {
                let px = element.scrollX,
                    py = element.scrollY;
                element.classList.add('scrollfrozen');
                element.onscroll = () => { element.scrollTo(px, py); };
            }
        }

        this.setPosition();
        this.optionlist.removeAttribute('aria-hidden');

        this.setCloseListener();
        setTimeout(() => { // Set this after, or else we'll get bouncing.
            //
        }, 100);
    }

    fillOptions() {
        this.optionlist.innerHTML = "";

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
            this.optionlist.appendChild(this.buildOption(unsel, order++));
        }

        for (let opt of this.options) {
            if ((this.origval) && (this.origval.toString() === opt.value.toString())) {
                opt.checked = true;
                this.selectedoption = opt;
            } else {
                delete opt.checked;
            }

            this.optionlist.appendChild(this.buildOption(opt, order++));
        }
    }

    /**
     * Set the position of the open menu on the screen
     */
    setPosition() {
        if (!SelectMenu.activeMenu) { return; }

        let self = SelectMenu.activeMenu,
            bodyRect = document.body.getBoundingClientRect(),
            triggerRect = self.triggerbox.getBoundingClientRect(),
            offsetLeft = triggerRect.left - bodyRect.left,
            offsetTop = triggerRect.top - bodyRect.top,
            offsetRight = bodyRect.right - triggerRect.right,
            menuHeight = this.emsize * 15,
            sumHeight = self.triggerbox.clientHeight + menuHeight;
        //console.log(`offsetTop: ${offsetTop} ${elemRect.top} ${bodyRect.top}`);

        self.optionlist.style.height = null;
        self.optionlist.style.width = `${self.container.clientWidth}px`;
        self.optionlist.style.position = 'fixed';
        self.optionlist.style.left = `${triggerRect.x}px`;
        self.optionlist.style.right = `${triggerRect.x + self.container.clientWidth}px`;
        self.optionlist.style.top = `${triggerRect.y + self.triggerbox.clientHeight}px`;
        self.optionlist.style.height = `${menuHeight}px`;

        if (((triggerRect.y + self.triggerbox.clientHeight) + menuHeight) > (window.innerHeight - self.triggerbox.clientHeight)) { // open vert
            self.optionlist.style.bottom = `${triggerRect.y}px`;
            self.optionlist.style.top = `${(triggerRect.y - menuHeight)}px`;
            self.optionlist.style.height = `${menuHeight}px`;

        }

    }

    /**
     * Closes the option list.
     */
    close(callback) {
        //window.removeEventListener('scroll', this.setPosition, true);
        window.onscroll = () => {};
        if (this.preventscroll){
            for (let element of this.preventscroll) {
                element.classList.remove('scrollfrozen');
                element.onscroll = () => { };
            }
        }

        this.optionlist.style.top = null;
        this.optionlist.style.bottom = null;
        this.optionlist.style.left = null;
        this.optionlist.style.width = null;

        this.optionlist.setAttribute('aria-hidden', 'true');
        this.optionlist.setAttribute('tabindex', '-1');
        this.wrapper.setAttribute('aria-expanded', false);
        this.container.setAttribute('aria-expanded', false);

        for (let li of Array.from(this.optionlist.querySelectorAll('li'))) {
            li.setAttribute('tabindex', '-1');
        }
        SelectMenu.activeMenu = null;
        if ((callback) && (typeof callback === 'function')) {
            callback();
        }
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
        let allopts = this.optionlist.querySelectorAll('li');
        for (let o of allopts) {
            if (o.getAttribute('data-value') === value) {
                o.setAttribute('aria-selected', true);
            } else {
                o.removeAttribute('aria-selected');
            }
        }
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

    reduceOptions(s) {
        if ((!s) || (typeof s !== 'string')) { return; }
        for (let li of this.optionlist.querySelectorAll('li')) {
            let optiontext = li.querySelector('span.text').innerHTML.toUpperCase();
            if (optiontext.indexOf(s.toUpperCase()) !== -1) {
                li.setAttribute('data-match', 'true');
            } else {
                li.setAttribute('data-match', 'false');
            }
        }
    }

    /**
     * Updates the counter
     */
    updateSearch() {
        if (this.combobox) {
            this.reduceOptions(this.triggerbox.value);
        } else {
            this.findByString(this.triggerbox.value);
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
            if (this.triggerbox.contains(e.target)) {
                if (!this.isopen) {
                    this.open();
                }
                this.setCloseListener();
            } else if ((this.wrapper.contains(e.target)) || (this.optionlist.contains(e.target))) {
                this.setCloseListener();
            } else {
                if (SelectMenu.activeMenu === this) {
                    this.close();
                }
            }
        }, { once: true });
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildInput() {
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'hidden');
        this.input.setAttribute('name', this.name);
    }

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

        this.wrapper.appendChild(this.input);

        this.container.appendChild(this.wrapper);

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

    buildTriggerBox() {

        this.triggerbox = document.createElement('input');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('type', 'text');
        this.triggerbox.setAttribute('tabindex', '0');
        this.triggerbox.setAttribute('aria-autocomplete', 'none');
        this.triggerbox.setAttribute('aria-activedescendant', '');
        this.triggerbox.setAttribute('placeholder', this.placeholder);

        if (this.mute) { this.triggerbox.classList.add('mute'); }

        this.triggerbox.addEventListener('focusin', (e) => {
            if (this.disabled) {
                e.stopPropagation();
                return;
            }
            if ((SelectMenu.activeMenu) && (SelectMenu.activeMenu.isopen)) {
                SelectMenu.activeMenu.close(() => {
                    if (this.combobox) {
                        this.triggerbox.select(); // Select all the text
                    } else {
                        this.open();
                    }
                });
            } else {
                if (this.combobox) {
                    this.triggerbox.select(); // Select all the text
                } else {
                    this.open();
                }
            }
        });

        this.triggerbox.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Tab':  // Tab
                    // Nothing.
                    this.close();
                    break;
                default:
                    if (this.combobox) {
                        if (this.triggerbox.value.length >=3) {
                            this.open();
                        }
                    }
                    break;
            }
        });

        this.triggerbox.addEventListener('keyup', (e) => {
            if ((e.shiftKey) && (e.key === 'Tab')) {  // Shift + Tab
                this.close();
            } else {
                switch (e.key) {
                    case 'Enter':
                        if (this.combobox) {
                            e.preventDefault();
                            e.stopPropagation();
                            if ((this.onenter) && (typeof this.onenter === 'function')) {
                                this.onenter(this);
                            }
                        }
                        break;
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

    }

    buildOptionList() {
        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('selectmenu');
        this.optionlist.setAttribute('role', 'listbox');
        this.optionlist.setAttribute('aria-hidden', 'true');
        this.optionlist.setAttribute('id', `cfb-selectmenu`);
        this.optionlist.setAttribute('tabindex', '-1');
        document.body.appendChild(this.optionlist);
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

        let li = document.createElement('li');
        li.setAttribute('tabindex', '-1');
        li.setAttribute('id', `li-${lId}`);
        li.setAttribute('data-menuorder', order);
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', def.value);

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
                        this.triggerbox.value = this.triggerbox.value.substring(0, this.triggerbox.value.length - 1);
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

        li.addEventListener('click', (e) => {
            let listentries = this.optionlist.querySelectorAll('li');
            for (let le of listentries) {
                le.removeAttribute('aria-selected');
            }
            li.setAttribute('aria-selected', 'true');
            this.input.value = def.value;

            if (def.unselectoption) {
                this.triggerbox.value = '';
                if ((this.mute) && (this.unsettext)) {
                    this.triggerbox.value = this.unsettext;
                }
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
                this.onchange(this, e);
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

    /* ACCESSOR METHODS_________________________________________________________________ */

    get combobox() { return this.config.combobox; }
    set combobox(combobox) { this.config.combobox = combobox; }

    get drawitem() { return this.config.drawitem; }
    set drawitem(drawitem) { this.config.drawitem = drawitem; }

    get emsize() { return this._emsize; }
    set emsize(emsize) { this._emsize = emsize; }

    get onenter() { return this.config.onenter; }
    set onenter(onenter) {
        if (typeof onenter !== 'function') {
            console.error("Action provided for onenter is not a function!");
        }
        this.config.onenter = onenter;
    }

    get optionlist() {
        if (!this._optionlist) {
            this.optionlist = document.getElementById(`cfb-selectmenu`);
            if (!this._optionlist) {
                this.buildOptionList();
            }
        }
        return this._optionlist;
    }
    set optionlist(optionlist) { this._optionlist = optionlist; }

    get options() { return this.config.options; }
    set options(options) { this.config.options = options; }

    get prefix() { return this.config.prefix; }
    set prefix(prefix) { this.config.prefix = prefix; }

    get preventscroll() { return this.config.preventscroll; }
    set preventscroll(preventscroll) { this.config.preventscroll = preventscroll; }

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