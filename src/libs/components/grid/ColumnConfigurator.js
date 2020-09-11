class ColumnConfigurator {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], //Extra css classes to apply,
            fields: [],
            grid: null, // the datagrid to control.
            instructions: TextFactory.get('datagrid-column-config-instructions')
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, ColumnConfigurator.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `cconfig-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the thing.
     */
    buildContainer() {
        /*
         * This this is gigantic and ugly.  Don't @me.
         * It should really be it's own mini-app/class.  Maybe I'll do it that way one day.
         */
        this.container = document.createElement('div');
        this.container.classList.add('column-configurator');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        // instructions
        if (this.instructions) {
            this.container.appendChild(new InstructionBox({
                instructions: [this.instructions]
            }).container);
        }

        this.elements = document.createElement('ul');
        this.elements.classList.add('column-list');

        for (let f of this.grid.fields) {
            let li = document.createElement('li');

            let cbox = new BooleanToggle({
                label: f.label,
                checked: !f.hidden,
                classes: ['column'],
                onchange: () => {
                    this.grid.toggleColumn(f);
                }
            });

            li.appendChild(cbox.container);

            if (f.description) {
                let desc = document.createElement('div');
                desc.classList.add('description');
                desc.innerHTML = f.description;
                li.appendChild(desc);
            }
            this.elements.appendChild(li);
        }

        this.container.appendChild(this.elements);

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

    get elements() { return this._elements; }
    set elements(elements) { this._elements = elements; }

    get fields() { return this.config.fields; }
    set fields(fields) { this.config.fields = fields; }

    get grid() { return this.config.grid; }
    set grid(grid) { this.config.grid = grid; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }
}
window.ColumnConfigurator = ColumnConfigurator;