class LoadingShade {
    static get DEFAULT_CONFIG() {
        return {
            id : null,
            size: 'medium',
            spinnerstyle: 'spin',
            spinnertext: TextFactory.get('simpleform-spinnertext'),
            classes: []
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            size: { type: 'option', datatype: 'string', description: "Size of the spinner. Default medium; values tiny, small, medium, large." },
            spinnerstyle: { type: 'option', datatype: 'enumeration', description: "The type of spinner to show (spin|bounce)" },
            spinnertext: { type: 'option', datatype: 'string', description: "The text to show on the loading shade." }
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, LoadingShade.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `shade-${CFBUtils.getUniqueKey(5)}`; }
        return this;
    }

    activate() {
        if (this.container.parentNode) {
            this.container.parentNode.classList.add('shaded');
        }
        this.container.removeAttribute('aria-hidden');
    }

    deactivate() {
        if (this.container.parentNode) {
            this.container.parentNode.classList.remove('shaded');
        }
        this.container.setAttribute('aria-hidden', 'true');
    }

    toggle() {
        if (this.container.getAttribute('aria-hidden') === true) {
            this.activate();
        } else {
            this.deactivate();
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Draw the Form's shade
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('loading-shade', this.size);
        this.container.setAttribute('aria-hidden', true);

        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.spinnerstyle) {
            let d = document.createElement('div');
            d.classList.add('spinner');
            d.classList.add(this.spinnerstyle);
            this.container.appendChild(d);
        }
        if (this.spinnertext) {
            this.textobj = document.createElement('div');
            this.textobj.classList.add('spinnertext');
            this.textobj.innerHTML = this.spinnertext;
            this.container.appendChild(this.textobj);
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get size() { return this.config.size; }
    set size(size) { this.config.size = size; }

    get spinnerstyle() { return this.config.spinnerstyle; }
    set spinnerstyle(spinnerstyle) { this.config.spinnerstyle = spinnerstyle; }

    get spinnertext() {return this.config.spinnertext; }
    set spinnertext(spinnertext) {
        if (this.textobj) { this.textobj.innerHTML = spinnertext; }
        this.config.spinnertext = spinnertext;
    }

    get textobj() { return this._textobj; }
    set textobj(textobj) { this._textobj = textobj; }
}
window.LoadingShade = LoadingShade;