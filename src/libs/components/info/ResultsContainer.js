class ResultsContainer {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // Component id
            classes: [], // Extra css classes to apply,

            errors: null, // array of errors
            warnings: null, // array of warning strings
            results: null, // array of result or success message strings
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, ResultsContainer.DEFAULT_CONFIG, config);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full messagebox container
     */
    buildContainer() {
        this.container = document.createElement('div');
        
        this.container.classList.add('resultsbox');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if ((this.errors) && (this.errors.length > 0)) {
            this.container.appendChild(new ErrorBox({
                errors: this.errors,
            }).container);
        }

        if ((this.results) && (this.results.length > 0)) {
            this.container.appendChild(new SuccessBox({
                results: this.results,
            }).container);
        }

        if ((this.warnings) && (this.warnings.length > 0)) {
            this.container.appendChild(new WarningBox({
                warnings: this.warnings,
            }).container);
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get errors() { return this.config.errors; }
    set errors(errors) { this.config.errors = errors; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get results() { return this.config.results; }
    set results(results) { this.config.results = results; }

    get warnings() { return this.config.warnings; }
    set warnings(warnings) { this.config.warnings = warnings; }

    get warningstitle() { return this.config.warningstitle; }
    set warningstitle(warningstitle) { this.config.warningstitle = warningstitle; }

    get warningicon() { return this.config.warningicon; }
    set warningicon(warningicon) { this.config.warningicon = warningicon; }

}
window.ResultsContainer = ResultsContainer;