class SearchControl {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            arialabel: null, // The aria-label value. If null, uses 'searchtext'
            maxlength: null, // Value for maxlength.
            searchtext: 'Search',
            searchicon: 'magnify',
            action: function(value, self) { // The search action. Passed the value of the input and the self
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
        const me = this;
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
            ghost: true,
            action: function(e) {
                e.preventDefault();
                if ((me.action) && (typeof me.action === 'function')) {
                    me.action(me.value, me);
                }
            }
        });

        // Open the search input if the user clicks on the button when it's not open
        this.container.addEventListener('click', function() {
            if (!me.isopen) {
                me.searchinput.focus();
                return;
            }
        });

        this.container.appendChild(this.searchbutton.button);

    }

    buildSearchInput() {
        const me = this;
        this.searchinput = document.createElement('input');

        this.searchinput.setAttribute('type', 'text');
        this.searchinput.setAttribute('role', 'textbox');
        this.searchinput.setAttribute('tabindex', '0');

        if (this.placeholder) { this.searchinput.setAttribute('placeholder', this.placeholder); }
        if (this.arialabel) { this.searchinput.setAttribute('aria-label', this.arialabel); }
        if (this.maxlength) { this.searchinput.setAttribute('maxlength', this.maxlength); }

        for (let c of this.classes) {
            this.searchinput.classList.add(c);
        }
        this.searchinput.addEventListener('keydown', function(e) {

        });
        this.searchinput.addEventListener('keyup', function(e) {
            if (e.keyCode === 9) { // Tab
                //me.searchbutton.button.focus();
            } else if (e.keyCode === 13) { // return or space
                if ((me.action) && (typeof me.action === 'function')) {
                    me.action(me.value, me);
                }
                return;
            }
        });
        this.searchinput.addEventListener('focusin', function(e) {

        });
        this.searchinput.addEventListener('focusout', function(e) {
            if ((me.value) && (me.value.length > 0)) {
                me.container.classList.add('open');
            } else {
                me.container.classList.remove('open');
            }
        });
        this.searchinput.value = this.config.value;

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get autocomplete() { return this.config.autocomplete; }
    set autocomplete(autocomplete) { this.config.autocomplete = autocomplete; }

    get action() { return this.config.action; }
    set action(action) { this.config.action = action; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get maxlength() { return this.config.maxlength; }
    set maxlength(maxlength) { this.config.maxlength = maxlength; }

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

}
