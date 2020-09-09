class FilterConfigurator {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], //Extra css classes to apply,
            filters: [], // Existing filters.
            fields: [], // Field definitions
            mute: false, // Draw inputs as mute
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
        let flines = this.elements.querySelectorAll('li.filterline');
        let filters = [];
        for (let li of flines) {
            let f = this.checkValidity(li);
            if (f) {
                filters.push(f);
            }
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
            filterid = li.getAttribute('data-filterid'),
            fieldField = li.querySelector(`input[name="primeselector-${filterid}"]:checked`),
            comparatorField = li.querySelector(`input[name="comparator-${filterid}"]:checked`),
            valueField = li.querySelector(`input[name="valuefield-${filterid}"]`);

        if ((fieldField) && (comparatorField) && (valueField)) {
            let valid = false,
                field = fieldField.value,
                comparator = comparatorField.value,
                value = valueField.value;

            if ((field) && (comparator) && (value)) {
                /*
                 * XXX TO DO: Should do deep error checking
                 *   - Does the field exist in the list
                 *   - Is the value provided valid within its datatype
                 *   - Is the comparator one provided by the datatype
                 *   - Is the comparator allowed
                 */
                valid = true;
            }

            if (valid) {
                li.setAttribute('data-valid', 'true');
                filter = {
                    filterid: filterid,
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

        this.container = document.createElement('div');
        this.container.classList.add('filter-configurator');

        // instructions
        if (this.instructions) {
            this.container.appendChild(new InstructionBox({
                instructions: [this.instructions]
            }).container);
        }

        this.actions = document.createElement('div');
        this.actions.classList.add('filter-actions');

        this.actions.appendChild(new SimpleButton({
            icon: 'cfb-plus',
            text: TextFactory.get('filter-configurator-add_filter'),
            action: function() {
                let unsets = me.elements.querySelectorAll('[data-field="unset"]');
                if (unsets.length < 1) {
                    me.addFilter();
                }
            }
        }).button);

        this.container.appendChild(this.actions);

        this.elements = document.createElement('ul');
        this.elements.classList.add('filter-list');

        if (this.filters) {
            for (let f of this.filters) {
                this.addFilter(f);
            }
        }

        this.container.appendChild(this.elements);

    }

    /**
     * Add a filter line to the configurator.
     * @param filter
     */
    addFilter(filter) {

        const me = this;

        let li = document.createElement('li');
        let filterid = `f-tmp-${CFBUtils.getUniqueKey(5)}`;
        li.classList.add('filterline');
        li.setAttribute('data-filterid', filterid);
        li.setAttribute('data-valid', 'false');

        if (filter) {
            let field = this.getField(filter.field);
            li.setAttribute('data-field', filter.field);
            li.appendChild(this.makePrimeSelector(filterid, filter.field).container);
            li.appendChild(this.makeComparatorSelector(filterid, field, filter.comparator).container);
            li.appendChild(this.makeValueSelector(filterid, field, filter.value).container);
            this.workingfilters[filterid] = filter; // add; doesn't need validation
            li.setAttribute('data-valid', 'true');
        } else {
            li.appendChild(this.makePrimeSelector(filterid).container);
            li.setAttribute('data-field', 'unset');
        }

        let validmarker = document.createElement('div');
        validmarker.classList.add('validmarker');
        validmarker.appendChild(IconFactory.icon('checkmark-circle'));
        li.appendChild(validmarker);

        li.appendChild(new SimpleButton({
            icon: 'minus',
            shape: 'square',
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
     * @param filterid the filter id
     * @param fieldname (optional) the name of the field to pre-select.
     * @return {SelectMenu}
     */
    makePrimeSelector(filterid, fieldname) {
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
            name: `primeselector-${filterid}`,
            value: fieldname,
            mute: this.mute,
            placeholder: TextFactory.get('comparator-select_field'),
            classes: ['primeselector'],
            onchange: function(self) {
                let li = self.container.parentElement,
                    validmarker = li.querySelector('div.validmarker'),
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
                    li.insertBefore(me.makeComparatorSelector(filterid, field).container, validmarker);
                    li.insertBefore(me.makeValueSelector(filterid, field).container, validmarker);
                    me.checkValidity(li);
                }
            }
        });
        return primeSelector;
    }

    /**
     * Make a 'comparator' selector.
     * @param filterid the filter id
     * @param field the field definition we're making one for
     * @param value (optional) the value to prefill with
     * @return {SelectMenu}
     */
    makeComparatorSelector(filterid, field, value) {
        const me = this;

        let ourValue = 'contains';
        let comparators = field.getComparators();

        switch (field.type) {
            case 'date':
            case 'time':
            case 'number':
            case 'enumeration':
                ourValue = 'equals';
                break;
            default:
                break;
        }

        if (value) {
            ourValue = value;
        }

        let comparatorSelector = new SelectMenu({
            options: comparators,
            placeholder: TextFactory.get('comparator-comparator'),
            value: ourValue,
            name: `comparator-${filterid}`,
            minimal: true,
            mute: this.mute,
            classes: ['comparator'],
            onchange: function(self) {
                let li = self.container.parentElement;
                me.checkValidity(li);
            }
        });
        comparatorSelector.container.setAttribute('data-field', field.name);

        return comparatorSelector;
    }

    /**
     * Make a variable value selector
     * @param filterid the filter id
     * @param field field the field definition we're making one for
     * @param value  (optional) the value to prefill with
     * @return {URLInput|TextInput}
     */
    makeValueSelector(filterid, field, value) {
        const me = this;

        let config = {
            value: value,
            name: `valuefield-${filterid}`,
            minimal: true,
            mute: this.mute,
            classes: ['valueinput'],
            onchange: function(self) {
                let li = self.container.parentElement;
                me.checkValidity(li);
            }
        };

        let valueSelector = field.getElement(value, config);

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

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get workingfilters() { return this._workingfilters; }
    set workingfilters(workingfilters) { this._workingfilters = workingfilters; }
}
window.FilterConfigurator = FilterConfigurator;