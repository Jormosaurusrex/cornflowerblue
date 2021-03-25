class SwitchList extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            prefix: null, // Prefix to use on itemcheckboxes, defaults to name-
            inlist: [],    // Array of option dictionary objects.  Printed in order given.
                            // { label: "Label to show", value: "v", id: (optional) }
            intitle: '',
            addicon: 'arrow-right',
            outlist: [],
            outtitle: '',
            removeicon: 'arrow-left',

        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, SwitchList.DEFAULT_CONFIG, config);
        if (!config.type) { config.type = "switchlist"; }
        super(config);
    }

    /* PSEUDO-ACCESSSORS________________________________________________________________ */


    /* CORE METHODS_____________________________________________________________________ */
    sortList(list) {
        let nodes = Array.prototype.slice.call(list.childNodes).filter((el) => {
            return el.tagName === 'LI';
        });
        nodes.sort((a, b) => {
            let va = a.getAttribute('data-label'),
                vb = b.getAttribute('data-label');
            if (va > vb) { return 1 }
            if (va < vb) { return -1 }
            return 0;
        });
        nodes.forEach(function(node) {
            list.appendChild(node);
        });
    }

    popLists(member, fromlist, tolist) {
        let newfrom = [];

        for (let m of fromlist) {
            if (member.id === m.id) {
                if (tolist) {
                    tolist.push(member);
                }
            } else {
                newfrom.push(member);
            }
        }
        fromlist = newfrom;
    }

    rebuild() {
        this.listboxes.innerHTML = ``;
        this.listboxes.appendChild(this.buildListBox(true));
        this.listboxes.appendChild(this.buildListBox(false));
        this.sortList(this.inlistlist);
        this.sortList(this.outlistlist);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('switchlist-container');
        this.container.classList.add('input-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        if (this.classes) {
            for (let c of this.classes) {
                this.container.classList.add(c);
            }
        }
        if (this.id) {
            this.container.setAttribute("id", this.id);
        }

        this.topline = document.createElement('div');
        this.topline.classList.add('topline');
        if (this.label) { this.topline.appendChild(this.labelobj); }
        if (this.topcontrol) { this.topline.appendChild(this.topcontrol); }
        this.container.appendChild(this.topline);

        this.listboxes = document.createElement('div');
        this.listboxes.classList.add('listboxes');

        this.container.appendChild(this.listboxes);
        this.rebuild();

    }

    buildListElement(m, isin, count) {
        let li = document.createElement('li'),
            label = document.createElement('span'),
            myname = `${(this.prefix) ? this.prefix : this.name}-${m['id'] ? m['id'] : count}`;

        let toggle = new BooleanToggle({
            checked: isin,
            value: m.value,
            hidden: true,
            name: myname
        });

        li.appendChild(IconFactory.icon(this.removeicon));
        li.setAttribute('data-rid', `${this.name}-r-${CFBUtils.getUniqueKey(5)}`);
        li.setAttribute('data-label', m.label);
        li.setAttribute('tabindex', '-1');

        label.classList.add('l');
        label.innerHTML = m.label;
        li.appendChild(label);

        li.appendChild(toggle.naked);
        li.appendChild(IconFactory.icon(this.addicon));

        li.addEventListener('keydown', (e) => {
            let mylist = this.parentNode;
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
                        let prev;
                        for (let i of mylist.getElementsByTagName('li')) {
                            if (i.getAttribute('data-rid') === li.getAttribute('data-rid')) {
                                if (i) {
                                    prev.focus();
                                }
                                break;
                            }
                            prev = i;
                        }
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        let next;
                        for (let i of mylist.getElementsByTagName('li').reverse()) {
                            if (i.getAttribute('data-rid') === li.getAttribute('data-rid')) {
                                if (i) {
                                    next.focus();
                                }
                                break;
                            }
                            next = i;
                        }
                        break;
                    case 'Enter':
                        li.click(); // click the one inside
                        break;
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                    case ' ': // space
                    default:
                        break;
                }
            }

        });

        li.addEventListener('click', () => {
            if (toggle.toggle.checked) {
                toggle.checked = false;
                this.inlistlist.removeChild(li);
                this.outlistlist.appendChild(li);
                this.sortList(this.outlistlist);
                this.popLists(m, this.inlist, this.outlist);
                // pop from one to the other
            } else {
                toggle.toggle.checked = true;
                this.outlistlist.removeChild(li);
                this.inlistlist.appendChild(li);
                this.sortList(this.inlistlist);
                this.popLists(m, this.outlist, this.inlist);
            }

            this.validate();

            if (this.form) { this.form.validate(); }

            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(this);
            }
        });
        return li;
    }


    buildListBox(isin = true) {

        let title = this.intitle,
            members = this.inlist;

        if (!isin) {
            title = this.outtitle;
            members = this.outlist;
        }

        let lbox = document.createElement('div');
        lbox.classList.add('listbox', `${ isin ? "inlist" : "outlist"}`);

        lbox.innerHTML = `<label>${title}</lable>`

        let list = document.createElement('ul'),
            count = 0;
        for (let m of members) {
            list.appendChild(this.buildListElement(m, isin, count++));
        }
        lbox.appendChild(list);

        if (isin) {
            this.inlistbox = lbox;
            this.inlistlist = list;
        } else {
            this.outlistbox = lbox;
            this.outlistlist = list;
        }
        return lbox;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get addicon() { return this.config.addicon; }
    set addicon(addicon) { this.config.addicon = addicon; }

    get inlist() { return this.config.inlist; }
    set inlist(inlist) { this.config.inlist = inlist; }

    get inlistbox() { return this._inlistbox; }
    set inlistbox(inlistbox) { this._inlistbox = inlistbox; }

    get inlistlist() { return this._inlistlist; }
    set inlistlist(inlistlist) { this._inlistlist = inlistlist; }

    get intitle() { return this.config.intitle; }
    set intitle(intitle) { this.config.intitle = intitle; }

    get listboxes() { return this._listboxes; }
    set listboxes(listboxes) { this._listboxes = listboxes; }

    get outicon() { return this.config.outicon; }
    set outicon(outicon) { this.config.outicon = outicon; }

    get outlist() { return this.config.outlist; }
    set outlist(outlist) { this.config.outlist = outlist; }

    get outlistbox() { return this._outlistbox; }
    set outlistbox(outlistbox) { this._outlistbox = outlistbox; }

    get outlistlist() { return this._outlistlist; }
    set outlistlist(outlistlist) { this._outlistlist = outlistlist; }

    get outtitle() { return this.config.outtitle; }
    set outtitle(outtitle) { this.config.outtitle = outtitle; }

    get prefix() { return this.config.prefix; }
    set prefix(prefix) { this.config.prefix = prefix; }

    get removeicon() { return this.config.removeicon; }
    set removeicon(removeicon) { this.config.removeicon = removeicon; }

}
window.SwitchList = SwitchList;
