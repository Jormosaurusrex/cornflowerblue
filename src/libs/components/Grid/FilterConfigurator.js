class FilterConfigurator {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], //Extra css classes to apply,
            filters: {}, // Existing filters.
            fields: [
                /*
                 * An array of field definition dictionaries:
                 *
                    name: <string>,    // The variable name for this field (computer readable)
                    label: <string>,   // The human-readable name for the column
                    type: <string>,    // The datatype of the column
                                       //   - string
                                       //   - number
                                       //   - date
                                       //   - time
                                       //   - stringarray
                                       //   - paragraph
                    description: <string>>,  // A string that describes the data in the column
                    classes: <string array>, // Additional classes to apply to cells of this field
                    filterable: <null|string|enum> // Is the field filterable? if so, how?
                */
            ],
            instructions: TextFactory.get('datagrid-filter-instructions')

        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, FilterConfigurator.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `fconfig-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Get a field definition
     * @param fieldid the id of the field.
     * @return {*}
     */
    getField(fieldid) {
        let rf;
        for (let f of this.fields) {
            if (f.name === fieldid) {
                rf = f;
                break;
            }
        }
        return rf;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the thing.
     */
    buildContainer() {
        /*
         * This this is gigantic and ugly.  Don't @ me.
         * It should really be it's own mini-app/class.  Maybe I'll do it that way one day.
         */
        const me = this;

        this.applyfiltersbutton = new SimpleButton({ // need to pass this to sub-routines
            text: "Apply Filters",
            disabled: true,
            action: function() {

            }
        });

        this.container = document.createElement('div');
        this.container.classList.add('filter-configurator');

        // instructions
        if (this.instructions) {
            this.container.append(new InstructionBox({
                instructions: [this.instructions]
            }).container);
        }

        this.actions = document.createElement('div');
        this.actions.classList.add('filter-actions');

        this.actions.appendChild(new SimpleButton({
            icon: 'cfb-plus',
            text: 'Add filter',
            action: function() {
                let unsets = me.elements.querySelectorAll('[data-field="unset"]');
                console.log(unsets);
                if (unsets.length < 1) {
                    me.addFilter();
                }
            }
        }).button);

        this.actions.appendChild(this.applyfiltersbutton.button);

        this.container.append(this.actions);

        this.elements = document.createElement('ul');
        this.elements.classList.add('filter-list');

        if (this.filters) {
            for (let f of Object.values(this.filters)) {
                this.addFilter(f);
            }
        }

        this.container.append(this.elements);

    }

    addFilter(filter) {
        const me = this;

        let li = document.createElement('li');

        let filtervalues = document.createElement('div');
        filtervalues.classList.add('filtervalues');

        if (filter) {
            let field = this.getField(filter.field);
            li.setAttribute('data-field', filter.field);
            li.appendChild(this.makePrimeSelector(filter.field).container);
            filtervalues.appendChild(this.makeComparatorSelector(field, filter.comparator).container);
            filtervalues.appendChild(this.makeValueSelector(field, filter.value).container);
        } else {
            li.appendChild(this.makePrimeSelector().container);
            li.setAttribute('data-field', 'unset');
        }
        li.appendChild(filtervalues);

        li.appendChild(new SimpleButton({
            icon: 'minus',
            shape: 'square',
            ghost: true,
            classes: ['filterkiller'],
            action: function() {
                if ((li.getAttribute('data-field')) && (li.getAttribute('data-field') !== 'unset')) {
                    me.filters.delete(li.getAttribute('data-field'));
                }
                li.parentNode.removeChild(li);
            }
        }).button);

        this.elements.appendChild(li);
    }

    makePrimeSelector(fieldname) {
        const me = this;
        let options = [];

        for (let f of this.fields) {
            if ((f.filterable) && (!this.filters[f.name])) {
                options.push({ value: f.name, label: f.label });
            } else if ((fieldname) && (f.name === fieldname)) {
                options.push({ value: f.name, label: f.label });
            }
        }

        let primeSelector = new SelectMenu({
            minimal: true,
            options: options,
            value: fieldname,
            placeholder: TextFactory.get('filter-comparator-select_field'),
            classes: ['primeselector'],
            onchange: function(self) {
                let filtervalues = self.container.parentElement.querySelector('.filtervalues');
                let field = me.getField(primeSelector.value);

                filtervalues.innerHTML = '';
                self.container.parentElement.setAttribute('data-field', field.name);

                filtervalues.appendChild(me.makeComparatorSelector(field).container);
                filtervalues.appendChild(me.makeValueSelector(field).container);
            }
        });
        return primeSelector;
    }

    makeComparatorSelector(field, value) {

        let ourValue = 'contains';
        let comparators = [ // Default for strings.
            { value: 'contains', label: TextFactory.get('filter-comparator-contains') },
            { value: 'notcontains', label: TextFactory.get('filter-comparator-notcontains') },
            { value: 'equals', label: TextFactory.get('filter-comparator-equals') },
            { value: 'notequals', label: TextFactory.get('filter-comparator-doesnotequal') },
        ];

        switch (field.type) {
            case 'date':
            case 'time':
                ourValue = 'equals';
                comparators = [
                    { value: 'equals', checked: true, label: TextFactory.get('filter-comparator-equals') },
                    { value: 'notequals', label: TextFactory.get('filter-comparator-doesnotequal') },
                    { value: 'isbefore', label: TextFactory.get('filter-comparator-isbefore') },
                    { value: 'isafter', label: TextFactory.get('filter-comparator-isafter') }
                ];
                break;
            case 'number':
                ourValue = 'equals';
                comparators = [
                    { value: 'equals', checked: true, label: TextFactory.get('filter-comparator-equals') },
                    { value: 'notequals', label: TextFactory.get('filter-comparator-doesnotequal') },
                    { value: 'isgreaterthan', label: TextFactory.get('filter-comparator-greaterthan') },
                    { value: 'islessthan', label: TextFactory.get('filter-comparator-lessthan') }
                ];
                break;
            default:
                break;
        }

        if (value) {
            ourValue = value;
        }

        let comparatorSelector = new SelectMenu({
            options: comparators,
            placeholder: TextFactory.get('filter-comparator-comparator'),
            value: ourValue,
            minimal: true,
            classes: ['comparator']
        });
        comparatorSelector.container.setAttribute('data-field', field.name);

        return comparatorSelector;
    }

    makeValueSelector(field, value) {
        let valueSelector;
        switch (field.type) {
            case 'date':
            case 'time':
                valueSelector = new DateInput({
                    value: value,
                    minimal: true,
                    classes: ['valueinput']
                });
                break;
            case 'number':
                valueSelector = new NumberInput({
                    value: value,
                    minimal: true,
                    classes: ['valueinput']
                });
                break;
            case 'imageurl':
                valueSelector = new URLInput({
                    value: value,
                    minimal: true,
                    classes: ['valueinput']
                });
                break;
            case 'string':
            default:
                valueSelector = new TextInput({
                    value: value,
                    minimal: true,
                    classes: ['valueinput']
                });
                break;
        }

        valueSelector.container.setAttribute('data-field', field.name);
        return valueSelector;

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get actions() { return this._actions; }
    set actions(actions) { this._actions = actions; }

    get applyfiltersbutton() { return this._applyfiltersbutton; }
    set applyfiltersbutton(applyfiltersbutton) { this._applyfiltersbutton = applyfiltersbutton; }

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

    get filters() { return this.config.filters; }
    set filters(filters) { this.config.filters = filters; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

}