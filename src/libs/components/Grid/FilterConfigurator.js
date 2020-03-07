class FilterConfigurator {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], //Extra css classes to apply,
            filters: [], // Existing filters.
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
        this.workingfilters = {};
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

    /**
     * Test each filter in the list and replace the canonical filters with the valid one.
     */
    grindFilters() {
        let flines = this.elements.querySelector('li[data-valid="true"');
        let filters = [];
        for (let li of flines) {
            let f = this.checkValidity(li);
            if (f) { filters.push(f); }
        }
        this.filters = filters;
    }

    /**
     * Check the validity of a filter line.
     * @param li the line of the filter
     * @return a filter definition (if valid) or null (if invalid)
     */
    checkValidity(li) {
        li.setAttribute('data-valid', 'false'); // ensure false at the start.

        let filter,
            filterId = li.getAttribute('data-filterid'),
            fieldField = li.querySelector('input[name="primeselector"]'),
            comparatorField = li.querySelector('input[name="comparator"]'),
            valueField = li.querySelector('input[name="valuefield"]');

        if ((fieldField) && (comparatorField) && (valueField)) {
            let valid = false,
                field = fieldField.value,
                comparator = comparatorField.value,
                value = valueField.value;

            if ((field) && (comparator) && (value)) {
                // XXX To Do: Deep error checking (e.g., does this field exist?)
                valid = true;
            }

            if (valid) {
                li.setAttribute('data-valid', 'true');
                filter = {
                    field: field,
                    comparator: comparator,
                    value: value
                };
                this.workingfilters[filterid] = filter;
            }
        }
        return filter;
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
            for (let f of this.filters) {
                this.addFilter(f);
            }
        }

        this.container.append(this.elements);

    }

    /**
     * Add a filter line to the configurator.
     * @param filter
     */
    addFilter(filter) {

        const me = this;

        let li = document.createElement('li');
        let filterId = `f-tmp-${CFBUtils.getUniqueKey(5)}`;
        li.setAttribute('data-filterid', filterId);
        li.setAttribute('data-valid', 'false');

        if (filter) {
            let field = this.getField(filter.field);
            li.setAttribute('data-field', filter.field);
            li.appendChild(this.makePrimeSelector(filter.field).container);
            li.appendChild(this.makeComparatorSelector(field, filter.comparator).container);
            li.appendChild(this.makeValueSelector(field, filter.value).container);
            this.workingfilters[filterId] = filter; // add; doesn't need validation
        } else {
            li.appendChild(this.makePrimeSelector().container);
            li.setAttribute('data-field', 'unset');
        }

        li.appendChild(new DestructiveButton({
            icon: 'minus',
            shape: 'square',
            ghost: true,
            classes: ['filterkiller'],
            action: function() {
                if ((li.getAttribute('data-field')) && (li.getAttribute('data-field') !== 'unset')) {
                    delete me.workingfilters[li.getAttribute('data-filterid')];
                }
                li.parentNode.removeChild(li);
            }
        }).button);

        this.elements.appendChild(li);
    }

    /**
     * Make a 'field' selector.  This selector controls other selectors.
     * @param fieldname (optional) the name of the field to pre-select.
     * @return {SelectMenu}
     */
    makePrimeSelector(fieldname) {
        const me = this;

        let options = [];

        for (let f of this.fields) {
            if (f.filterable) {
                options.push({ value: f.name, label: f.label });
            }
        }

        let primeSelector = new SelectMenu({
            minimal: true,
            options: options,
            name: 'primeselector',
            value: fieldname,
            placeholder: TextFactory.get('filter-comparator-select_field'),
            classes: ['primeselector'],
            onchange: function(self) {
                let li = self.container.parentElement,
                    button = li.querySelector('button.filterkiller'),
                    comparatorfield = li.querySelector('div.select-container.comparator'),
                    valuefield = li.querySelector('div.input-container.valueinput'),
                    field = me.getField(primeSelector.value);

                li.setAttribute('data-valid', 'false');
                if (comparatorfield) {
                    li.removeChild(comparatorfield);
                }
                if (valuefield) {
                    li.removeChild(valuefield);
                }
                if (field) {
                    li.setAttribute('data-field', field.name);
                    li.insertBefore(me.makeComparatorSelector(field).container, button);
                    li.insertBefore(me.makeValueSelector(field).container, button);
                    me.checkValidity(li);
                }
            }
        });
        return primeSelector;
    }

    /**
     * Make a 'comparator' selector.
     * @param field the field definition we're making one for
     * @param value (optional) the value to prefill with
     * @return {SelectMenu}
     */
    makeComparatorSelector(field, value) {
        const me = this;

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
            name: 'comparator',
            minimal: true,
            classes: ['comparator'],
            onchange: function() {
                let li = self.container.parentElement;
                me.checkValidity(li);
            }
        });
        comparatorSelector.container.setAttribute('data-field', field.name);

        return comparatorSelector;
    }

    /**
     * Make a variable value selector
     * @param field field the field definition we're making one for
     * @param value  (optional) the value to prefill with
     * @return {URLInput|TextInput}
     */
    makeValueSelector(field, value) {
        const me = this;

        let valueSelector;
        switch (field.type) {
            case 'date':
            case 'time':
                valueSelector = new DateInput({
                    value: value,
                    name: 'valuefield',
                    minimal: true,
                    classes: ['valueinput'],
                    onchange: function() {
                        let li = self.container.parentElement;
                        me.checkValidity(li);
                    }
                });
                break;
            case 'number':
                valueSelector = new NumberInput({
                    value: value,
                    name: 'valuefield',
                    minimal: true,
                    classes: ['valueinput'],
                    onchange: function() {
                        let li = self.container.parentElement;
                        me.checkValidity(li);
                    }
                });
                break;
            case 'imageurl':
                valueSelector = new URLInput({
                    value: value,
                    name: 'valuefield',
                    minimal: true,
                    classes: ['valueinput'],
                    onchange: function() {
                        let li = self.container.parentElement;
                        me.checkValidity(li);
                    }
                });
                break;
            case 'string':
            default:
                valueSelector = new TextInput({
                    value: value,
                    name: 'valuefield',
                    minimal: true,
                    classes: ['valueinput'],
                    onchange: function() {
                        let li = self.container.parentElement;
                        me.checkValidity(li);
                    }
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

    get workingfilters() { return this._workingfilters; }
    set workingfilters(workingfilters) { this._workingfilters = workingfilters; }
}