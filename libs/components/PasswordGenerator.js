"use strict";


class PasswordGenerator {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            buttontext: 'Generate Password',
            buttonicon: 'refresh',
            length: 15, // how many characters to generate
            autofills: [], // input elements to auto fill.
            sets: ['lc', 'uc', 'num', 'punc']
        };
    }

    static get DATASETS () {
        return {
            lc: { id: 'lc', label: 'Lowercase', set: 'a-z', chars: 'abcdefghijklmnopqrstuvwxyz' },
            uc: { id: 'uc', label: 'Uppercase', set: 'A-Z', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            num: { id: 'num', label: 'Numbers', set: '0-9', chars: '0123456789' },
            punc: { id: 'punc', label: 'Punctuation', set: '#', chars: '![]{}()%&*$#^<>~@|' }
        }
    }


    static getDataSet(id) {
        return PasswordGenerator.DATASETS[id];
    }

    /**
     * Generates a random password string.  Takes an array of character objects to include
     * @param datasets an array of character sets: ['a-z', 'A-Z', '0-9', '#'] (default all)
     * @param length how long of a password to generate (default 10);
     * @returns {string}
     */
    static randomPassword (datasets, length) {
        if (!length) { length = PasswordGenerator.DEFAULT_CONFIG.length; }

        if ((!datasets) || (datasets.length === 0)) { datasets = PasswordGenerator.DEFAULT_CONFIG.sets; }

        let corpus = '';
        for (let ds of datasets) {
            if (ds in PasswordGenerator.DATASETS) {
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
        if (!this.id) { // need to generate an id for label stuff
            this.id = `pwgen-${Utils.getUniqueKey(5)}`;
        }
        this.setactuals = [];
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */


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

    buildContainer() {

        const me = this;
        this.container = $('<div />').addClass('pwgenerator');

        this.datasetblock = $('<ul />');

        if (this.sets.length > 0) {
            for (let ds of this.sets) {
                if (ds in PasswordGenerator.DATASETS) {
                    let set = PasswordGenerator.getDataSet(ds);
                    let cb = new BooleanToggle({
                        name: `dset-${set.id}`,
                        id: `${this.id}-${set.id}`,
                        value: set.set,
                        label: set.label,
                        checked: true,
                        style: 'toggle'
                    });
                    this.setactuals.push(cb);
                    this.datasetblock.append($('<li />').append(cb.container));
                }

            }
        }

        this.button = new SimpleButton({
            icon: this.buttonicon,
            text: this.buttontext,
            action: function(e) {
                e.preventDefault();
                me.generatePassword();
            }

        });

        this.container.append(this.datasetblock).append(this.button);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autofills() { return this.config.autofills; }
    set autofills(autofills) { this.config.autofills = autofills; }

    get button() { return this._button; }
    set button(button) { this._button = button; }

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