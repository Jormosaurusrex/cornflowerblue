class SearchControl {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            autoexecute: true, // Cause the search's action to execute automatically on focusout
                               // or when there number of seed characters is reached
            arialabel: TextFactory.get('searchcontrol-instructions'), // The aria-label value.
            stayopen: false,
            maxlength: null, // Value for maxlength.
            searchtext: TextFactory.get('search'),
            searchicon: 'magnify',
            buttonstyle: 'normal',
            mute: false, // if true, controls are mute
            focusin: null, // action to execute on focus in. Passed (event, self).
            focusout: null, // action to execute on focus out. Passed (event, self).
            action: (value, self) => { // The search action. Passed the value of the input and the self
                console.log(`Executing search action: ${value}`);
            },
            value: '', // Value to use (pre-population).  Used during construction and then discarded.
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SearchControl.DEFAULT_CONFIG, config);
        return this;
    }

    /* CORE METHODS_____________________________________________________________________ */

    /* PSEUDO GETTERS___________________________________________________________________ */

    get isopen() { return this.container.classList.contains('open'); }

    get value() { return this.searchinput.value; }
    set value(value) { this.searchinput.value = value; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full searchcontrol container
     */
    buildContainer() {

        this.container = document.createElement('div');
        this.container.classList.add('searchcontrol');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        this.buildSearchInput();
        this.container.appendChild(this.searchinput);

        this.searchbutton = new SimpleButton({
            text: this.searchtext,
            icon: this.searchicon,
            mute: true,
            focusin: this.focusin,
            focusout: this.focusout,
            action: (e) => {
                e.preventDefault();
                if (this.isopen) {
                    if ((this.action) && (typeof this.action === 'function')) {
                        this.action(this.value, this);
                    }
                }
            }
        });

        // Open the search input if the user clicks on the button when it's not open
        this.container.addEventListener('click', () => {
            if (!this.isopen) {
                this.searchinput.focus();
            }
        });

        if (this.stayopen) {
            this.container.classList.add('open');
        }

        this.container.appendChild(this.searchbutton.button);

    }

    /**
     * Build the search input
     */
    buildSearchInput() {

        this.searchinput = document.createElement('input');

        this.searchinput.setAttribute('type', 'text');
        this.searchinput.setAttribute('role', 'search');
        this.searchinput.setAttribute('tabindex', '0');

        if (this.mute) { this.searchinput.classList.add('mute'); }

        if (this.placeholder) { this.searchinput.setAttribute('placeholder', this.placeholder); }
        if (this.arialabel) { this.searchinput.setAttribute('aria-label', this.arialabel); }
        if (this.maxlength) { this.searchinput.setAttribute('maxlength', this.maxlength); }

        for (let c of this.classes) {
            this.searchinput.classList.add(c);
        }

        this.searchinput.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'Tab':
                    if (this.autoexecute) {
                        if ((this.action) && (typeof this.action === 'function')) {
                            this.action(this.value, this);
                        }
                    }
                    break;
                case 'Enter':
                    if ((this.action) && (typeof this.action === 'function')) {
                        this.action(this.value, this);
                    }
                    break;
                default:
                    if (this.autoexecute) {
                        if ((this.action) && (typeof this.action === 'function')) {
                            this.action(this.value, this);
                        }
                    }
                    break;

            }
        });

        this.searchinput.addEventListener('focusout', (e) => {
            if (((this.value) && (this.value.length > 0)) || (this.stayopen)) {
                this.container.classList.add('open');
                if (this.autoexecute) {
                    if ((this.action) && (typeof this.action === 'function')) {
                        this.action(this.value, this);
                    }
                }
            } else {
                this.container.classList.remove('open');
            }
            if ((this.focusout) && (typeof this.focusout === 'function')) {
                this.focusout(e, this);
            }
        });

        this.searchinput.addEventListener('focusin', (e) => {
            if ((this.focusin) && (typeof this.focusin === 'function')) {
                this.focusin(e, this);
            }
        });

        this.searchinput.value = this.config.value;

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get autoexecute() { return this.config.autoexecute; }
    set autoexecute(autoexecute) { this.config.autoexecute = autoexecute; }

    get action() { return this.config.action; }
    set action(action) { this.config.action = action; }

    get buttonstyle() { return this.config.buttonstyle; }
    set buttonstyle(buttonstyle) { this.config.buttonstyle = buttonstyle; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get focusin() { return this.config.focusin; }
    set focusin(focusin) {
        if (typeof focusin !== 'function') {
            console.error("Action provided for focusin is not a function!");
        }
        this.config.focusin = focusin;
    }

    get focusout() { return this.config.focusout; }
    set focusout(focusout) {
        if (typeof focusout !== 'function') {
            console.error("Action provided for focusout is not a function!");
        }
        this.config.focusout = focusout;
    }

    get maxlength() { return this.config.maxlength; }
    set maxlength(maxlength) { this.config.maxlength = maxlength; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get placeholder() { return this.config.placeholder; }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

    get searchinput() { return this._searchinput; }
    set searchinput(searchinput) { this._searchinput = searchinput; }

    get searchbutton() { return this._searchbutton; }
    set searchbutton(searchbutton) { this._searchbutton = searchbutton; }

    get searchtext() { return this.config.searchtext; }
    set searchtext(searchtext) { this.config.searchtext = searchtext; }

    get searchicon() { return this.config.searchicon; }
    set searchicon(searchicon) { this.config.searchicon = searchicon; }

    get stayopen() { return this.config.stayopen; }
    set stayopen(stayopen) { this.config.stayopen = stayopen; }

}
window.SearchControl = SearchControl;
