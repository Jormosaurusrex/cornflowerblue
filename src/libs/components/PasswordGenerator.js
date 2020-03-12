class PasswordGenerator {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            buttontext: TextFactory.get('generate_password'),
            buttonicon: 'refresh',
            length: 15, // how many characters to generate
            autofills: [], // input elements to auto fill.
            sets: ['lc', 'uc', 'num', 'punc']
        };
    }

    static get DATASETS () {
        return {
            lc: { id: 'lc', label: TextFactory.get('lowercase'), set: 'a-z', chars: 'abcdefghijklmnopqrstuvwxyz' },
            uc: { id: 'uc', label: TextFactory.get('uppercase'), set: 'A-Z', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            num: { id: 'num', label: TextFactory.get('numbers'), set: '0-9', chars: '0123456789' },
            punc: { id: 'punc', label: TextFactory.get('punctuation'), set: '#', chars: '![]{}()%&*$#^<>~@|' }
        };
    }

    /**
     * Get a dataset definition by id
     * @param id the id of the dataset
     * @return {*} the dataset definition, or null
     */
    static getDataSet(id) {
        return PasswordGenerator.DATASETS[id];
    }

    /**
     * Generates a random password string.  Takes an array of character objects to include
     * @param datasets an array of dataset identifiers (defaults to all)
     * @param length how long of a password to generate (default 15);
     * @returns {string}
     */
    static randomPassword (datasets = PasswordGenerator.DEFAULT_CONFIG.sets, length = 15) {

        let corpus = '';
        for (let ds of datasets) {
            if (PasswordGenerator.getDataSet(ds)) {
                corpus += PasswordGenerator.getDataSet(ds).chars;
            }
        }

        let pw = '';
        for (let i = 0; i < length; i++) {
            pw += corpus.charAt(Math.floor(Math.random() * corpus.length));
        }
        return pw;
    }

    constructor(config) {
        this.config = Object.assign({}, PasswordGenerator.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `pwgen-${CFBUtils.getUniqueKey(5)}`; }

        this.setactuals = [];
    }

    /* ACTION METHODS___________________________________________________________________ */

    /**
     * Does the actual password generation
     */
    generatePassword() {
        let sets = [];
        if ((!this.sets) || (this.sets.length === 0)){
            sets = PasswordGenerator.DEFAULT_CONFIG.sets;
        } else {
            for (let cb of this.setactuals) {
                if (cb.checked) {
                    sets.push(cb.value);
                }
            }
        }

        let genpw =  PasswordGenerator.randomPassword(sets, this.length);

        if ((this.autofills) && (this.autofills.length > 0)) {
            let theform;
            for (let af of this.autofills) {
                af.value = genpw;
                if (af.form) { theform = af.form; }
            }
            if (theform) {
                theform.validate();
            }
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the container for the generator
     */
    buildContainer() {
        const me = this;
        this.container = document.createElement('div');
        this.container.classList.add('pwgenerator');

        this.datasetblock = document.createElement('ul');
        this.datasetblock.classList.add('datasets');
        this.datasetblock.setAttribute('aria-hidden', 'true');

        if (this.sets.length > 0) {
            for (let ds of this.sets) {
                if (ds in PasswordGenerator.DATASETS) {
                    let set = PasswordGenerator.getDataSet(ds);
                    let cb = new BooleanToggle({
                        name: `dset-${set.id}`,
                        id: `${this.id}-${set.id}`,
                        value: set.id,
                        label: set.label,
                        checked: true
                    });
                    this.setactuals.push(cb);
                    let li = document.createElement('li');
                    li.appendChild(cb.container);
                    this.datasetblock.appendChild(li);
                }
            }
        }

        this.button = new SimpleButton({
            text: this.buttontext,
            naked: true,
            action: function(e) {
                e.preventDefault();
                me.generatePassword();
            }

        });

        this.configbutton = new SimpleButton({
            icon: 'gear',
            naked: true,
            arialabel: TextFactory.get('configure_generator'),
            classes: ['config'],
            action: function(e) {
                e.preventDefault();
                if (me.datasetblock.getAttribute('aria-hidden')) {
                    me.datasetblock.removeAttribute('aria-hidden');
                } else {
                    me.datasetblock.setAttribute('aria-hidden', 'true');
                }
            }

        });
        let controls = document.createElement('div');
        controls.classList.add('controls');
        controls.appendChild(this.button.button);
        controls.appendChild(this.configbutton.button);

        this.container.appendChild(controls);
        this.container.appendChild(this.datasetblock);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autofills() { return this.config.autofills; }
    set autofills(autofills) { this.config.autofills = autofills; }

    get button() { return this._button; }
    set button(button) { this._button = button; }

    get configbutton() { return this._configbutton; }
    set configbutton(configbutton) { this._configbutton = configbutton; }

    get buttonicon() { return this.config.buttonicon; }
    set buttonicon(buttonicon) { this.config.buttonicon = buttonicon; }

    get buttontext() { return this.config.buttontext; }
    set buttontext(buttontext) { this.config.buttontext = buttontext; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get datasetblock() { return this._datasetblock; }
    set datasetblock(datasetblock) { this._datasetblock = datasetblock; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get length() { return this.config.length; }
    set length(length) { this.config.length = length; }

    get sets() { return this.config.sets; }
    set sets(sets) { this.config.sets = sets; }

    get setactuals() { return this._setactuals; }
    set setactuals(setactuals) { this._setactuals = setactuals; }

}
window.PasswordGenerator = PasswordGenerator;