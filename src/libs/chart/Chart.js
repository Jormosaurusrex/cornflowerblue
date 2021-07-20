class Chart {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            classes: [],
            label: null,
            help: null
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The dialog object will have this as it's id." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            label: { type: 'option', datatype: 'string', description: "The title for the progress meter." }
        };
    }

    constructor(config) {
        this.config = Object.assign({}, Chart.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `chart-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* CORE METHODS_____________________________________________________________________ */


    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('chart-container');

    }

    /**
     * Builds the label
     */
    buildLabel() {

        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.innerHTML = this.label;

        if (this.help) {
            this.helpicon = new HelpButton({ help: this.help });
            this.labelobj.appendChild(this.helpicon.button);
            this.labelobj.addEventListener('onmouseover', () => {
                this.helpicon.open();
            });
            this.labelobj.addEventListener('onmouseout', () => {
                this.helpicon.close();
            });
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

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helpicon() { return this._helpicon; }
    set helpicon(helpicon) { this._helpicon = helpicon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get label() { return this.config.label; }
    set label(label) { this.config.label = label; }

    get labelobj() {
        if (!this._labelobj) { this.buildLabel(); }
        return this._labelobj;
    }
    set labelobj(labelobj) { this._labelobj = labelobj; }

}
window.Chart = Chart;
