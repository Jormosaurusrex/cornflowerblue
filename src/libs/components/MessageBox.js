class MessageBox {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            errors: null, // array of errors
            warnings: null, // array of warning strings
            results: null, // array of result or success message strings
            errorstitle: TextFactory.get('error'),
            successtitle: TextFactory.get('success'),
            warningstitle: TextFactory.get('warning'),
            erroricon: 'warn-hex', // If present, will be displayed large next to texts
            warningicon : 'warn-triangle', // If present, will be displayed large next to texts
            successicon: 'disc-check', // If present, will be displayed large next to texts
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, MessageBox.DEFAULT_CONFIG, config);
        return this;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full messagebox container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('messagebox');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

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

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

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
