class GridField {

    static get DEFAULT_CONFIG() {
        return {
            name: null,        // The variable name for this field (computer readable)
            label: null,       // The human-readable name for the column
            readonly: false,   // if true, this value cannot be changed. Useful for identifiers.
            hidden: false,     // Is the column hidden or not.
            identifier: false, // If true, marks the field as the unique identifier for a data set.
                               // An identifier is required in a grid if you want to update entries.
            type: 'string',    // The datatype of the column
                               //   - string
                               //   - url
                               //   - imageurl
                               //   - email
                               //   - boolean
                               //   - number
                               //   - date
                               //   - time
                               //   - stringarray
                               //   - paragraph
                               //   - enumeration
            values: null,      // An array of option values for an enumeration data type. Ignored if not
                               // an enumeration
                               // [
                               //   { label: "Label to show", value: "v", default: false }
                               //  ]
            separator: ', ',   // Used when rendering array values
            placeholder: null, // The placeholder to use in the field
            lightbox: true,    // For image types, if true, open the image in a lightbox
            minnumber: null,   // The minnumber to use in the field
            maxnumber: null,   // The maxnumber to use in the field
            nodupe: false,     // If true, this column is ignored when deemphasizing duplicate rows.
            resize: false,     // Whether or not to allow resizing of the column (default: false)
            mute: false,       // If true, apply to elements.
            required: false,   // If true, elements drawn from this will be required.

            description: null, // A string that describes the data in the column
            classes: [],       // Additional classes to apply to cells of this field
            filterable: false, // Is the field filterable?
            renderer: null     // A function that can be used to format the in the field. Overrides native
                               // renderer.  Takes "data" as an argument.
        };
    }

    /**
     * Supported comparators
     * @return a comparator dictionary.
     * @constructor
     */
    static get COMPARATORS() {
        return {
            'startswith' : TextFactory.get('comparator-startswith'),
            'endswith' : TextFactory.get('comparator-endswith'),
            'contains' : TextFactory.get('comparator-contains'),
            'notcontains' : TextFactory.get('comparator-notcontains'),
            'equals' : TextFactory.get('comparator-equals'),
            'doesnotequal' : TextFactory.get('comparator-doesnotequal'),
            'isbefore' : TextFactory.get('comparator-isbefore'),
            'isafter' : TextFactory.get('comparator-isafter'),
            'isgreaterthan' : TextFactory.get('comparator-greaterthan'),
            'islessthan' : TextFactory.get('comparator-lessthan')
        }
    }

    /**
     * Get a comparator label
     * @param comparator the comparator
     * @return A string, or null
     */
    static getComparatorLabel(comparator) {
        return GridField.COMPARATORS[comparator];
    }

    /**
     * Define the gridfield
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, GridField.DEFAULT_CONFIG, config);
        this.setRenderer();
    }

    /**
     * Set the renderer for the field, if one isn't provided.
     */
    setRenderer() {
        const me = this;
        switch (this.type) {
            case 'number':
                if (!this.renderer) {
                    this.renderer = function(d) { return document.createTextNode(d); }
                }
                break;
            case 'date':
            case 'time':
                if (!this.renderer) {
                    this.renderer = function(d) {
                        return document.createTextNode(d.toString());
                    }
                }
                break;
            case 'boolean':
                if (!this.renderer) {
                    this.renderer = function(d) {
                        if (typeof d === 'number') {
                            if (d > 0) { return document.createTextNode('True'); }
                            return document.createTextNode('False');
                        }
                        return d;
                    }
                }
                break;
            case 'url':
                if (!this.renderer) {
                    this.renderer = function(d) {
                        let a = document.createElement('a');
                        a.setAttribute('href', d);
                        a.innerHTML = d;
                        return a;
                    }
                }
                break;
            case 'imageurl':
                if (!this.renderer) {
                    if (this.lightbox) {
                        this.renderer = function(d) {
                            let img = document.createElement('img');
                            img.setAttribute('src', d);
                            let anchor = document.createElement('a');
                            anchor.append(img);
                            anchor.addEventListener('click', function() {
                                let i = document.createElement('img');
                                i.setAttribute('src', d);
                                new DialogWindow({
                                    lightbox: true,
                                    title: me.label,
                                    content: i
                                }).open();
                            });
                            return anchor;
                        }
                    } else {
                        this.renderer = function(d) {
                            let img = document.createElement('img');
                            img.setAttribute('src', d);
                            let a = document.createElement('a');
                            a.setAttribute('href', d);
                            a.appendChild(img);
                            return a;
                        }
                    }
                }
                break;
            case 'email':
                if (!this.renderer) {
                    this.renderer = function(d) {
                        let a = document.createElement('a');
                        a.setAttribute('href', `mailto:${d}`);
                        a.innerHTML = d;
                        return a;
                    }
                }
                break;
            case 'enumeration':
                if (!this.renderer) {
                    this.renderer = function(d) {
                        console.log(me.values);
                        return document.createTextNode(me.getValue(d));
                    }
                }
                break;
            case 'paragraph':
                if (!this.renderer) {
                    this.renderer = function(d) { return document.createTextNode(d); }
                }
                break;
            case 'stringarray':
                if (!this.renderer) {
                    this.renderer = function(d) {
                        if (Array.isArray(d)) {
                            return document.createTextNode(d.join(me.separator));
                        }
                        return d;
                    }
                }
                break;
            case 'string':
            default:
                if (!this.renderer) {
                    this.renderer = function(d) { return document.createTextNode(d); }
                }
                break;
        }

    }

    getValue(key) {
        let value;
        if ((this.values) && (this.values.length > 0)) {
            for (let def of this.values) {
                if (def['key'] === key) {
                    value = def['value'];
                    console.log(`value! ${value}`);
                    break;
                }
            }
        }
        return value;
    }

    /**
     * Get a form element for this data field.
     * @param value (optional) The value of the input field
     * @param config (optional) the config to use
     * @return {HiddenField|NumberInput|DateInput|BooleanToggle|EmailInput}
     */
    getElement(value, config) {
        let e;
        if (!config) {
            config = {
                name: this.name,
                label: this.label,
                disabled: this.readonly,
                help: this.description,
                placeholder: this.placeholder,
                mute: this.mute,
                maxnumber: this.maxnumber,
                minnumber: this.minnumber,
                classes: this.classes,
                value: value,
                renderer: this.renderer
            };
        }
        if (this.hidden) {
            return new HiddenField(config);
        }

        switch (this.type) {
            case 'number':
                e = new NumberInput(config);
                break;
            case 'date':
            case 'time':
                e = new DateInput(config);
                break;
            case 'enumeration':
                config.options = [];
                for (let o of this.values) {
                    config.options.push({ label: o.label, value: o.value, checked: o.default });
                }
                e = new SelectMenu(config);
                break;
            case 'boolean':
                delete config.value;
                config.checked = value;
                e = new BooleanToggle(config);
                break;
            case 'timezone':
                e = new TimezoneMenu(config);
                break;
            case 'url':
                e = new URIInput(config);
                break;
            case 'imageurl':
                e = new URIInput(config);
                break;
            case 'email':
                e = new EmailInput(config);
                break;
            case 'paragraph':
                e = new TextArea(config);
                break;
            case 'stringarray':
                e = new TextInput(config);
                break;
            case 'string':
            default:
                e = new TextInput(config);
                break;
        }
        return e;
    }

    /**
     * Get the valid comparators for this datatypes
     * @return an array of comparator definitions.
     */
    getComparators() {

        let comparators;

        switch (this.type) {
            case 'number':
                comparators = [
                    { value: 'equals', checked: true, label: GridField.getComparatorLabel('equals') },
                    { value: 'doesnotequal', label: GridField.getComparatorLabel('doesnotequal') },
                    { value: 'isgreaterthan', label: GridField.getComparatorLabel('isgreaterthan') },
                    { value: 'islessthan', label: GridField.getComparatorLabel('islessthan') }
                ];
                break;
            case 'date':
            case 'time':
                comparators = [
                    { value: 'equals', checked: true, label: GridField.getComparatorLabel('equals') },
                    { value: 'doesnotequal', label: GridField.getComparatorLabel('doesnotequal') },
                    { value: 'isbefore', label: GridField.getComparatorLabel('isbefore') },
                    { value: 'isafter', label: GridField.getComparatorLabel('isafter') }
                ];
                break;
            case 'boolean':
            case 'enumeration':
                comparators = [
                    { value: 'equals', checked: true, label: GridField.getComparatorLabel('equals') },
                    { value: 'doesnotequal', label: GridField.getComparatorLabel('doesnotequal') }
                ];
                break;
            case 'url':
            case 'imageurl':
            case 'email':
            case 'paragraph':
            case 'stringarray':
            case 'string':
            default:
                comparators = [ // Default for strings.
                    {value: 'contains', label: GridField.getComparatorLabel('contains')},
                    {value: 'notcontains', label: GridField.getComparatorLabel('notcontains')},
                    {value: 'equals', label: GridField.getComparatorLabel('equals')},
                    {value: 'doesnotequal', label: GridField.getComparatorLabel('doesnotequal')},
                    {value: 'startswith', label: GridField.getComparatorLabel('startswith')},
                    {value: 'endswith', label: GridField.getComparatorLabel('endswith')}
                ];
                break;
        }

        return comparators;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes ; }
    set classes(classes) { this.config.classes = classes; }

    get description() { return this.config.description ; }
    set description(description) { this.config.description = description; }

    get filterable() { return this.config.filterable ; }
    set filterable(filterable) { this.config.filterable = filterable; }

    get hidden() { return this.config.hidden ; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get identifier() { return this.config.identifier ; }
    set identifier(identifier) { this.config.identifier = identifier; }

    get label() { return this.config.label ; }
    set label(label) { this.config.label = label; }

    get lightbox() { return this.config.lightbox ; }
    set lightbox(lightbox) { this.config.lightbox = lightbox; }

    get maxnumber() { return this.config.maxnumber ; }
    set maxnumber(maxnumber) { this.config.maxnumber = maxnumber; }

    get minnumber() { return this.config.minnumber ; }
    set minnumber(minnumber) { this.config.minnumber = minnumber; }

    get mute() { return this.config.mute ; }
    set mute(mute) { this.config.mute = mute; }

    get name() { return this.config.name ; }
    set name(name) { this.config.name = name; }

    get nodupe() { return this.config.nodupe ; }
    set nodupe(nodupe) { this.config.nodupe = nodupe; }

    get placeholder() { return this.config.placeholder ; }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

    get readonly() { return this.config.readonly ; }
    set readonly(readonly) { this.config.readonly = readonly; }

    get renderer() { return this.config.renderer; }
    set renderer(renderer) {
        if (typeof renderer !== 'function') {
            console.error("Value provided to renderer is not a function!");
        }
        this.config.renderer = renderer;
    }

    get required() { return this.config.required ; }
    set required(required) { this.config.required = required; }

    get resize() { return this.config.resize ; }
    set resize(resize) { this.config.resize = resize; }

    get separator() { return this.config.separator ; }
    set separator(separator) { this.config.separator = separator; }

    get type() { return this.config.type ; }
    set type(type) { this.config.type = type; }

    get values() { return this.config.values ; }
    set values(values) { this.config.values = values; }

}
window.GridField = GridField;
