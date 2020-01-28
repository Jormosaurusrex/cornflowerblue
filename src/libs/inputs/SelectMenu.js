class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: "(Select)",
            icon: "chevron-down",
            prefix: null, // a prefix to display in the trigger box.
            searchtext: true, // Show the "searchtext" box.
            options: [], // Array of option dictionary objects.  Printed in order given.
                         // { label: "Label to show", value: "v", checked: true }
            onchange: null // The change handler. Passed (event, self).
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
     * Return the selected radio input.
     * @return {jQuery|HTMLElement}
     */
    get selected() {
        let sel = this.optionlist.querySelector(`input[name=${this.name}]:checked`);
        if (sel.length > 0) { return sel; }
        return null;
    }

    get value() {
        return this.optionlist.querySelector(`input[name=${this.name}]:checked`).value;
    }

    get topcontrol() { return this.searchdisplay; }

    get passivetext() {
        if (this.selectedoption) { return this.selectedoption.label; }
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Opens the option list.
     */
    open() {
        const me = this;

        this.optionlist.removeAttribute('aria-hidden');
        this.triggerbox.setAttribute('aria-expanded', 'true');

        let items = Array.from(this.optionlist.querySelector('li'));
        for (let li of items) {
            li.setAttribute('tabindex', '0');
        }

        let vertpos = (Utils.getSingleEmInPixels() * 15); // menu height
        if (this.container) {
            vertpos += parseInt(this.container.getBoundingClientRect().top);
        } else {
            vertpos += parseInt(this.optionlist.getBoundingClientRect().top);
        }

        if (vertpos > window.innerHeight) {
            this.optionlist.classList.add('vert');
            if (this.container) { this.container.classList.add('vert'); }
        } else {
            this.optionlist.classList.remove('vert');
            if (this.container) { this.container.classList.remove('vert'); }
        }

        setTimeout(function() { // Have to wait until we're sure we're in the DOM
            let sel = me.optionlist.querySelector('li[aria-selected="true"]');
            if (!sel) {
                sel = me.optionlist.querySelector('li:first-child');
            }
            if (sel) {
                me.scrollto(sel);
                sel.focus();
            }
        }, 100);

        setTimeout(function() { // Set this after, or else we'll get bouncing.
            me.setCloseListener();
        }, 200);

    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;
        window.addEventListener('click', function(e) {
            if (e.target === me.optionlist) {
                me.setCloseListener();
            } else if ((e.target === me.triggerbox) && (me.triggerbox.getAttribute('aria-expanded') === 'true')) {
                // Do _nothing_
            } else {
                me.close();
            }
        }, {
            once: true,
        });
    }

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
        element.focus();
        this.scrolleditem = element;
    }

    /**
     * Closes the option list.
     */
    close() {
        this.optionlist.setAttribute('aria-hidden', 'true');
        this.triggerbox.removeAttribute('aria-expanded');

        let items = Array.from(this.optionlist.querySelector('li'));
        for (let li of items) {
            li.setAttribute('tabindex', '-1');
        }

        this.searchkeys = [];
        this.updateSearch();
    }

    disable() {
        let radios = this.optionlist.querySelectorAll("input[type='radio']");
        for (let r of radios) {
            r.setAttribute('disabled', 'disabled');
        }
        this.triggerbox.setAttribute('disabled', 'disabled');
        this.triggerbox.removeAttribute('aria-expanded');
        this.disabled = true;
        if (this.triggerbox) { this.triggerbox.classList.add('disabled'); }
        if (this.container) { this.container.classList.add('disabled'); }
    }

    enable() {
        let radios = this.optionlist.querySelectorAll("input[type='radio']");
        for (let r of radios) {
            r.removeAttribute('disabled');
        }
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

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.triggerbox);
        this.container.append(wrap);

        this.container.appendChild(this.optionlist);
        this.container.appendChild(this.passivebox);
        this.container.appendChild(this.topcontrol);
        this.container.appendChild(this.messagebox);

        this.postContainerScrub();
    }

    /**
     * Builds the trigger box for the select.
     */
    buildTriggerBox() {
        const me = this;
        this.triggerbox = document.createElement('div');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('tabindex', '0');
        this.triggerbox.addEventListener('focus', function(e) {
            if (me.disabled) {
                e.stopPropagation();
                return;
            }
            me.open();
        });
        if (this.mute) { this.triggerbox.classList.add('mute'); }
        if (this.icon) { this.triggerbox.classList.add(`cfb-${this.icon}`); }
    }

    buildOptions() {
        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('selectmenu');
        this.optionlist.setAttribute('id', this.id);
        this.optionlist.setAttribute('aria-hidden', 'true');
        this.optionlist.setAttribute('tabindex', '0');
        this.optionlist.setAttribute('role', 'radiogroup');

        let order = 1;
        for (let opt of this.options) {
            let o = this.buildOption(opt, order);
            if (opt.checked) {
                this.selectedoption = opt;
            }
            order++;
            this.optionlist.appendChild(o);
        }

        if (this.unselectedtext) { // Unselected slots last because we need to select if nothing is selected
            let unselconfig = {
                label: this.unselectedtext,
                value: '',
                checked: !this.selectedoption,
                unselectoption: true
            };
            let o = this.buildOption(unselconfig, 0);
            o.setAttribute('data-menuorder', 0);
            this.optionlist.prepend(o);
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

        li.addEventListener('keydown', function(e) {
            if((e.shiftKey) && (e.keyCode === 9)) {  // Shift + Tab
                me.close();
            } else if (e.keyCode === 9) { // Tab
                me.close();
            } else if (e.keyCode === 27) { // Escape
                me.close();
            } else if (e.keyCode === 38) { // Up arrow
                e.preventDefault();
                me.optionlist.querySelector(`[data-menuorder='${previous}']`).focus();
            } else if (e.keyCode === 40) { // Down arrow
                e.preventDefault();
                me.optionlist.querySelector(`[data-menuorder='${next}']`).focus();
            } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                li.querySelector('input').click(); // click the one inside
            } else if (e.keyCode === 8) { // Backspace
                me.rmSearchKey();
            } else if ((e.keyCode === 17) // ctrl
                || (e.keyCode === 18) // alt
                || (e.keyCode === 91) // command
            ) {
                // do nothing, ignore
            } else { // Anything else
                me.runKeySearch(e.key);
            }
        });
        li.addEventListener('click', function() {
            let opts = me.optionlist.querySelectorAll('li');
            for (let o of opts) {
                o.removeAttribute('aria-selected');
            }
            li.setAttribute('aria-selected', 'true');
        });

        let opLabel = document.createElement('label');
        opLabel.setAttribute('for', lId);
        opLabel.innerHTML = def.label;

        let op = document.createElement('input');
        op.setAttribute('id', lId);
        op.setAttribute('type', 'radio');
        op.setAttribute('name', this.name);
        op.setAttribute('tabindex', '-1');
        op.setAttribute('value', def.value);
        op.setAttribute('aria-labelledby', lId);
        op.setAttribute('aria-label', def.label);
        op.setAttribute('role', 'radio');
        op.addEventListener('change', function() {
            if (me.prefix) {
                me.triggerbox.innerHTML = `${me.prefix} ${def.label}`;
            } else {
                me.triggerbox.innerHTML = def.label;
            }

            me.selectedoption = def;

            if (def.label === me.unselectedtext) {
                me.passivebox.innerHTML = me.unsettext;
            } else {
                me.passivebox.innerHTML = def.label;
            }

            let labels = me.optionlist.querySelectorAll('label');
            for (let l of labels) {
                l.classList.remove('cfb-triangle-down');
            }

            opLabel.classList.add('cfb-triangle-down');

            me.close();

            me.validate();

            if (me.form) { me.form.validate(); }

            if ((me.onchange) && (typeof me.onchange === 'function')) {
                me.onchange(me);
            }
        });

        if (def.checked) {
            this.origval = def.value;
            if (this.prefix) {
                this.triggerbox.innerHTML = `${this.prefix} ${def.label}`;
            } else {
                this.triggerbox.innerHTML = def.label;
            }
            li.setAttribute('aria-selected', 'true');
            op.setAttribute('aria-checked', 'checked');
            op.setAttribute('checked', 'checked');
        }

        li.appendChild(op);
        li.appendChild(opLabel);
        return li;
    }

    /**
     * Draws the search text display.
     */
    buildSearchDisplay() {
        if (this.searchtext) {
            this.searchdisplay = document.createElement('div');
            this.searchdisplay.classList.add('searchdisplay');
            this.searchdisplay.classList.add('topcontrol');
            this.updateSearch();
        }
    }

    /**
     * Updates the counter
     */
    updateSearch() {
        if (this.searchkeys.length === 0) {
            this.searchdisplay.classList.add('hidden');
            this.searchdisplay.innerHTML = '';
            return;
        }
        this.searchdisplay.classList.remove('hidden');
        this.searchdisplay.innerHTML = this.searchkeys.join('');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Delete a search key from the stack
     */
    rmSearchKey() {
        if (this.searchkeys.length === 0) return;
        this.searchkeys.pop();
        if (this.searchkeys.length > 0) {
            this.findByString(this.searchkeys.join(''));
        }
        this.updateSearch();
    }

    /**
     * Search the options from keyboard input
     * @param key the key to add to the stack
     */
    runKeySearch(key) {
        this.searchkeys.push(key);
        if (this.searchkeys.length > 0) {
            this.findByString(this.searchkeys.join(''));
        }
        this.updateSearch();
    }

    /**
     * Search the list of options and scroll to it
     * @param s the string to search
     */
    findByString(s) {
        if ((!s) || (typeof s !== 'string')) { return; }
        let target;

        let lis = this.optionlist.querySelectorAll('li');
        for (let li of lis) {
            let label = li.querySelector('label');
            if (label.innerHTML.toUpperCase().startsWith(s.toUpperCase())) {
                target = li;
                break;
            }
        }
        this.scrollto(target);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get optionlist() {
        if (!this._optionlist) { this.buildOptions(); }
        return this._optionlist;
    }
    set optionlist(optionlist) { this._optionlist = optionlist; }

    get options() { return this.config.options; }
    set options(options) { this.config.options = options; }

    get prefix() { return this.config.prefix; }
    set prefix(prefix) { this.config.prefix = prefix; }

    get searchdisplay() {
        if (!this._searchdisplay) { this.buildSearchDisplay(); }
        return this._searchdisplay;
    }
    set searchdisplay(searchdisplay) { this._searchdisplay = searchdisplay; }

    get searchkeys() {
        if (!this._searchkeys) { this._searchkeys = []; }
        return this._searchkeys;
    }
    set searchkeys(searchkeys) { this._searchkeys = searchkeys; }

    get searchtext() { return this.config.searchtext; }
    set searchtext(searchtext) { this.config.searchtext = searchtext; }

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

}


