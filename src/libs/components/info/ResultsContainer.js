class ResultsContainer extends MessageBox {

    static get DEFAULT_CONFIG() {
        return {
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
        config = Object.assign({}, ResultsBox.DEFAULT_CONFIG, config);
        super(config);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full messagebox container
     */
    buildContainer() {
        super.buildContainer();

        this.container.classList.add('resultsbox');

        if ((this.errors) && (this.errors.length > 0)) {
            this.container.appendChild(this.buildBox("errors"));
        }

        if ((this.results) && (this.results.length > 0)) {
            this.container.appendChild(this.buildBox("results"));
        }

        if ((this.warnings) && (this.warnings.length > 0)) {
            this.container.appendChild(this.buildBox("warnings"));
        }

    }

    /**
     * Build the specific box.
     * @param type the type of box to create (errors|warnings|results)
     * @return a DOM element
     */
    buildBox(type = 'results') {
        let list,
            icon,
            title;

        let box = document.createElement('div');
        box.classList.add('box');
        box.classList.add(type);

        switch(type) {
            case 'errors':
                list = this.errors;
                icon = this.erroricon;
                title = this.errorstitle;
                break;
            case 'warnings':
                list = this.warnings;
                icon = this.warningicon;
                title = this.warningstitle;
                break;
            case 'results':
            default:
                list = this.results;
                icon = this.successicon;
                title = this.successtitle;
                break;
        }

        if (title) {
            let telem = document.createElement('h4');
            telem.innerHTML = title;
            box.appendChild(telem);
        }

        let lbox = document.createElement('div');
        lbox.classList.add('lbox');


        if (icon) { lbox.appendChild(IconFactory.icon(icon)); }


        let mlist = document.createElement('ul');
        for (let text of list) {
            let li = document.createElement('li');
            li.innerHTML = text;
            mlist.appendChild(li);
        }

        lbox.appendChild(mlist);

        lbox.classList.add(`size-${list.length}`);

        box.appendChild(lbox);
        return box;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get errors() { return this.config.errors; }
    set errors(errors) { this.config.errors = errors; }

    get errorstitle() { return this.config.errorstitle; }
    set errorstitle(errorstitle) { this.config.errorstitle = errorstitle; }

    get erroricon() { return this.config.erroricon; }
    set erroricon(erroricon) { this.config.erroricon = erroricon; }

    get results() { return this.config.results; }
    set results(results) { this.config.results = results; }

    get successtitle() { return this.config.successtitle; }
    set successtitle(successtitle) { this.config.successtitle = successtitle; }

    get successicon() { return this.config.successicon; }
    set successicon(successicon) { this.config.successicon = successicon; }

    get warnings() { return this.config.warnings; }
    set warnings(warnings) { this.config.warnings = warnings; }

    get warningstitle() { return this.config.warningstitle; }
    set warningstitle(warningstitle) { this.config.warningstitle = warningstitle; }

    get warningicon() { return this.config.warningicon; }
    set warningicon(warningicon) { this.config.warningicon = warningicon; }

}
window.ResultsContainer = ResultsContainer;