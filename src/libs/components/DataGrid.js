class DataGrid extends Panel {

    static get DEFAULT_CONFIG() {
        return {
            title: null, // the title for the grid
            id: null, // The id. An id is required to save a grid's state.
            sortable: true, //  Data columns can be sorted

            fields: [  // The data fields for the grid and how they behave.
                /*
                 * An array of field definition dictionaries:
                 *
                    name: <string>,    // The variable name for this field (computer readable)
                    label: <string>,   // The human-readable name for the column
                    width: <number,    // The default width of the column
                    hidden: <boolean>, // Is the column hidden or not.
                    type: <string>,    // The datatype of the column
                                       //   - string
                                       //   - number
                                       //   - date
                                       //   - time
                                       //   - stringarray
                                       //   - paragraph
                    separator: <string>, // Used when rendering array values
                    nodupe: false, // If true, this column is ignored when deemphasizing duplicate rows.
                    resize: <boolean>,   // Whether or not to allow resizing of the column (default: false)
                    description: <string>>,  // A string that describes the data in the column
                    classes: <string array>, // Additional classes to apply to cells of this field
                    filterable: <null|string|enum> // Is the field filterable? if so, how?
                    renderer: function(data) {     // A function that can be used to
                        return `${data}.`;
                    }
                */
            ],
            data: [], // The data to throw into the grid
            savestate: true, // Attempt to save the grid's state. Will not work unless an ID is defined.
            demphasizeduplicates: true, // de-emphasize cells that are identical to the same cell
                                        // in the previous row.
            columnconfigurationicon: 'table',
            searchable: true, // Data can be searched
            exportable: true, // Data can be exported
            exporticon: "download",
            exportheaderrow: 'readable', // When exporting a CSV file, should a header row
                                         // be included?  Possible values:
                                         // 'readable' : Uses the header labels (human readable)
                                         // 'data' : Uses the data labels
                                         // 'no' or null: don't include a header row
            exportfilename: function(self) { // the filename to name the exported data.
                if (self.title) {
                    return `${self.title}-export.csv`;
                }
                return 'export.csv';     // This can be a string or a function, but must return a string
            },
            exportarrayseparator: "\, ", // What to use when exporting fields with arrays as a separator.  Do not use '\n' as this breaks CSV encoding.

            filterable: true, // Can the datagrid be filtered?
                      // No all fields are filtered by default.
                      // Whether or not a field can be filtered is defined in the field's definition.
            applyfiltersicon: 'checkmark-circle',
            actionsbuttonicon: 'menu',

            selectable: true, //  Data rows can be selected.
            selectaction: function(self) {  // What to do when a single row is selected.
                //console.log("row clicked");
            },

            multiselect: true, // Can multiple rows be selected? If true, overrides "selectable: false"
            multiselectactions: [], // Array of button actions to multiselects
            multiselecticon: 'checkmark',

            texttotal: 'total',
            sorticon: 'chevron-down',
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define a DataGrid
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, DataGrid.DEFAULT_CONFIG, config);
        super(config);

        if (this.id) {
            this.savekey = `grid-${this.id}`;
        } else {
            this.id = `grid-${Utils.getUniqueKey(5)}`;
        }

        this.activefilters = {};
        this.loadstate();
    }

    /* PSEUDO GETTERS___________________________________________________________________ */

    /**
     * Are we in multi-select mode or not?
     * @return {boolean}
     */
    get multiselecting() {
        return this.grid.classList.contains('multiselecting');
    }

    /**
     * Test if the grid can be persisted.
     * @return {boolean}
     */
    get ispersistable() {
        return !!((this.savestate) && (this.savekey) && (window.localStorage));
    }

    /**
     * Get all values for a given field key
     * @param key the data key
     * @return {[]} and array of values
     */
    getvalues(key) {
        let a = [];
        for (let d of this.data) {
            a.push(d[key]);
        }
        return a;
    }

    /**
     * Get all unique values for a given field key
     * @param key the data key
     * @return {[]} and array of values
     */
    getuniquevalues(key) {
        let s = new Set();
        for (let d of this.data) {
            s.add(d[key]);
        }
        return Array.from(s).sort();
    }

    /**
     * Get a field definition
     * @param fieldid the id of the field.
     * @return {*}
     */
    getfield(fieldid) {
        let rf;
        for (let f of this.fields) {
            if (f.name === fieldid) {
                rf = f;
                break;
            }
        }
        return rf;
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Export the data in the grid as a CSV
     */
    export() {
        let lineDivider = '\r\n', // line divider
            cellDivider = ',', // cell divider
            rows = [],
            fname;

        if (this.expoortbutton) {
            this.exportbutton.disable();
        }

        if ((this.exportfilename) && (typeof this.exportfilename === 'function')) {
            fname = this.exportfilename(this);
        } else {
            fname = this.exportfilename;
        }
        // XXX TODO: Don't export hidden fields

        // Include the header row, if required.
        if ((this.exportheaderrow) && (this.exportheaderrow !== 'no')) {
            let colTitles = [],
                colData = [];
            for (let f of this.fields) {
                colTitles.push(`\"${f.label.replace(/"/g,"\\\"")}\"`);
                colData.push(`\"${f.name.replace(/"/g,"\\\"")}\"`);
            }
            if (this.exportheaderrow === 'readable') {
                rows.push(`${colTitles.join(cellDivider)}`);
            } else {
                rows.push(`${colData.join(cellDivider)}`);
            }
        }

        for (let d of this.data) {
            let cells = [];
            for (let f of this.fields) { // do mapping by field
                let val;
                switch (f.type) {
                    case 'date':
                        val = d[f.name].toString().replace(/"/g,"\\\"");
                        break;
                    case 'stringarray':
                        val = d[f.name].join(this.exportarrayseparator).replace(/"/g,"\\\"");
                        break;
                    case 'number':
                    case 'time':
                        val = d[f.name];
                        break;
                    case 'string':
                    case 'paragraph':
                    default:
                        val = d[f.name].replace(/"/g,"\\\"");
                        break;
                }
                cells.push(`\"${val}\"`);
            }
            rows.push(cells.join(cellDivider));
        }

        let csv = rows.join(lineDivider);

        let hiddenElement = document.createElement('a');
        hiddenElement.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURI(csv)}`);
        hiddenElement.setAttribute('id', 'downloadLink');
        hiddenElement.setAttribute('target', '_blank');
        hiddenElement.setAttribute('download', fname);
        hiddenElement.click();

        if (this.exportbutton) {
            this.exportbutton.enable();
        }
    }

    /**
     * Search the grid for the value provided.
     * @param value
     */
    search(value) {
        this.messagebox.classList.add('hidden');

        let rows = Array.from(this.gridbody.childNodes);

        let matches = 0;
        let matchesHiddenColumns = false;
        for (let r of rows) {
            let show = false;
            r.setAttribute('data-search-hidden', true,);

            if ((!value) || (value === '')) {
                show = true;
            } else {
                let cells = Array.from(r.childNodes);
                for (let c of cells) {
                    if (show) { break; }
                    if (!c.classList.contains('mechanical')) {
                        if (c.innerHTML.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                            if (c.classList.contains('hidden')) {
                                matchesHiddenColumns = true;
                            } else {
                                show = true;
                            }
                        }
                    }
                }
            }
            if (show) {
                matches++;
                r.removeAttribute('data-search-hidden');
            }
        }

        if (matches <= 0) {
            this.messagebox.innerHTML = "";
            let warnings = [TextFactory.get('search_noresults')];
            if (matchesHiddenColumns) {
                warnings.push(TextFactory.get('matches_hidden_columns'));
            }
            this.messagebox.append(new MessageBox({
                warningstitle: TextFactory.get('no_results'),
                warnings: warnings,
                classes: ['hidden']
            }).container);
            this.messagebox.classList.remove('hidden');
        }
    }

    /**
     * Sort the table based on a field.
     * @param field the field to sort
     */
    sortfield(field, sort='asc') {

        let hCell = this.thead.querySelector(`[data-name='${field}']`);

        let hchildren = this.thead.querySelectorAll('th');
        for (let hc of hchildren) {
            hc.removeAttribute('data-sort');
        }

        hCell.setAttribute('data-sort', sort);

        let elements = Array.from(this.gridbody.childNodes);

        elements.sort(function(a, b) {
            let textA = a.querySelector(`[data-name='${field}']`).innerHTML;
            let textB = b.querySelector(`[data-name='${field}']`).innerHTML;

            if (sort === 'asc') {
                if (textA < textB) return -1;
                if (textA > textB) return 1;
            } else {
                if (textA > textB) return -1;
                if (textA < textB) return 1;
            }

            return 0;
        });

        this.gridbody.innerHTML = "";

        for (let row of elements) {
            this.gridbody.appendChild(row);
        }

        this.currentsort = {
            field: field,
            direction: sort
        };

        this.grindDuplicateCells();
    }

    /**
     * Opens a configuration dialog.
     * @param type the type of dialog configurator
     */
    configurator(type) {
        const me = this;

        let container = document.createElement('div');
        container.classList.add('datagrid-configurator');
        container.classList.add('column');

        let instructions,
            title,
            content;

        switch(type) {
            case 'column':
                instructions = TextFactory.get('datagrid-column-config-instructions');
                title = TextFactory.get('configure_columns');

                content = document.createElement('ul');
                content.classList.add('elements');
                for (let f of this.fields) {
                    let li = document.createElement('li');

                    let cbox = new BooleanToggle({
                        label: f.label,
                        checked: !f.hidden,
                        classes: ['column'],
                        onchange: function() {
                            me.toggleColumn(f);
                        }
                    });
                    li.appendChild(cbox.container);

                    if (f.description) {
                        let desc = document.createElement('div');
                        desc.classList.add('description');
                        desc.innerHTML = f.description;
                        li.appendChild(desc);
                    }
                    content.appendChild(li);
                }
                break;
            case 'filter':
                instructions = TextFactory.get('datagrid-filter-instructions');
                title = TextFactory.get('manage_filters');

                content = document.createElement('ul');
                content.classList.add('elements');
                for (let f of this.fields) {
                    if (f.filterable) {
                        let li = document.createElement('li');
                        li.appendChild(this.getFilterLine(f).container);
                        content.appendChild(li);
                    }
                }

                break;
            default:
                break;
        }

        // instructions
        if (instructions) {
            container.append(new InstructionBox({
                instructions: [instructions]
            }).container);
        }
        container.append(content);

        let dialog = new DialogWindow({
            title: title,
            content: container,
            actions: ["closebutton"]
        });
        dialog.open();
    }

    /**
     * Grind through duplicate cells if configured to do so.
     */
    grindDuplicateCells() {
        if (!this.demphasizeduplicates) return;
        let previousRow;
        for (let r of this.gridbody.querySelectorAll('tr')) {
            if (!previousRow) {
                previousRow = r;
                continue;
            }
            let pcells = previousRow.querySelectorAll("td:not(.mechanical)");
            let cells = r.querySelectorAll("td:not(.mechanical)");
            for (let i = 0; i < cells.length; i++) {
                if (!this.getfield(cells[i].getAttribute('data-name')).nodupe) {
                    if (cells[i].innerHTML === pcells[i].innerHTML) {
                        cells[i].classList.add('duplicate');
                    } else {
                        cells[i].classList.remove('duplicate');
                    }
                }
            }
            previousRow = r;
        }
    }

    /* DATA METHODS_____________________________________________________________________ */

    /**
     * Append data into the grid.  Does not replace.
     * @param data the data to append (an array of data rows)
     */
    append(data) {
        for (let entry of data) {
            this.gridbody.appendChild(this.buildRow(entry));
            this.data.push(entry);
        }
        this.updateCount();
        if (this.currentsort) {
            this.sortfield(this.currentsort.field, this.currentsort.direction);
        }
        this.updateCount();
        this.applyFilters();
        this.search(this.searchcontrol.value);
        this.grindDuplicateCells();
    }

    /**
     * Load data from a URL and append it.
     * @param url the URL to add.
     */
    loadAndAppend(url) {
        fetch(url, {
            headers: { "Content-Type": "application/json; charset=utf-8" }
        })
            .then(response => response.json()) // response -> json
            .then(data => { // do the thing.
                // Expects data in json format like this:
                // { data: [] }, where each row is a table row.
                this.append(data.data);
            })
            .catch(err => {
                console.error(`Error while fetching data`);
                console.error(err);
            });
    }

    /* COLUMN METHODS___________________________________________________________________ */

    /**
     * Toggle a column on or off
     * @param f
     */
    toggleColumn(f) {
        if (f.hidden) {
            this.showColumn(f);
        } else {
            this.hideColumn(f);
        }
        this.persist();
    }

    /**
     * Check to see that at least one column is visible, and if not, show a warning.
     */
    handleColumnPresences() {
        let colsvisible = false;
        for (let field of Object.values(this.fields)) {
            if (!field.hidden) {
                colsvisible = true;
                break;
            }
        }
        if (!colsvisible) {
            this.messagebox.innerHTML = "";
            this.messagebox.append(new MessageBox({
                warningstitle: TextFactory.get('no_columns'),
                warnings: [TextFactory.get('datagrid-message-no_visible_columns')],
                classes: ['hidden']
            }).container);
            this.messagebox.classList.remove('hidden');
        } else {
            this.messagebox.classList.add('hidden');
        }
    }

    /**
     * Hide a column from the view.
     * @param field the field to hide.
     */
    hideColumn(field) {
        field.hidden = true;
        for (let c of Array.from(this.grid.querySelectorAll(`[data-name='${field.name}']`))) {
            c.classList.add('hidden');
        }
        this.handleColumnPresences();
    }

    /**
     * Show a hidden column in the view.
     * @param field
     */
    showColumn(field) {
        field.hidden = false;
        for (let c of Array.from(this.grid.querySelectorAll(`[data-name='${field.name}']`))) {
            c.classList.remove('hidden');
        }
        this.handleColumnPresences();
    }

    /* PERSISTENCE METHODS______________________________________________________________ */

    /**
     * Persist the grid state
     */
    persist() {
        if (!this.ispersistable) { return; }
        this.state = this.grindstate(); // get a current copy of it.
        localStorage.setItem(this.savekey, JSON.stringify(this.state));
    }

    /**
     * Load a saved state from local storage
     */
    loadstate() {
        if (this.ispersistable) {
            this.state = JSON.parse(localStorage.getItem(this.savekey));
        }
        if (!this.state) {
            this.state = this.grindstate(); // this will be the default
        }
    }

    /**
     * Apply the saved state to the grid
     */
    applystate() {
        if (!this.state) { return; }
        if (this.state.fields) {
            for (let f of Object.values(this.state.fields)) {
                if (f.hidden) {
                    this.hideColumn(this.getfield(f.name));
                } else {
                    this.showColumn(this.getfield(f.name));
                }
            }
        }
        if (this.state.filters) {
            this.activefilters = this.state.filters;
        }
        this.applyFilters();
    }

    /**
     * Figures out the state of the grid and generates the state object
     */
    grindstate() {
        let state = {
            fields: {},
            filters: {},
            search: null
        };

        for (let f of this.fields) {
            if (f.hidden === undefined) { f.hidden = false; }
            state.fields[f.name] = {
                name: f.name,
                hidden: f.hidden
            };
        }
        for (let af of (Object.values(this.activefilters))) {
            state.filters[af.field] = af;
        }
        return state;
    }

    /* FILTER METHODS___________________________________________________________________ */

    /**
     * Builds the filter manipulation controls
     * @param f the field
     * @return {TextInput|SelectMenu}
     */
    getFilterLine(f) {
        const me = this;

        let element;

        let values = me.getuniquevalues(f.name);

        if (f.filterable === 'enum') {
            let options = [];
            for (let v of values) {
                options.push({
                    label: v,
                    value: v
                })
            }
            element = new SelectMenu({
                label: f.label,
                unselectedtext: me.filterunselectedvaluetext,
                options: options,
                onchange: function(self) {
                    me.addFilter(f.name, self.value, true);
                }
            });
        } else {
            element = new TextInput({
                name: 'value',
                label: f.label,
                placeholder: me.filterplaceholder,
                onkeyup: function(e, self) {
                    me.addFilter(f.name, self.value, false);
                }
            });
        }
        return element;
    }

    /**
     * Add a filter to the active filters
     * @param field the field to affect
     * @param value the value of the field to match
     * @param exact whether or not to be an exact match
     */
    addFilter(field, value, exact) {
        if ((!value) || (value === '')) {
            delete this.activefilters[field];
        } else {
            this.activefilters[field] = {
                field: field,
                value: value,
                exact: exact
            };
        }
        this.persist();
        this.applyFilters();
    }

    /**
     * Remove a filter from the active filter list
     * @param f the filter to drop
     */
    removeFilter(f) {
        delete this.activefilters[f.field];
        this.persist();
        this.applyFilters();
    }

    /**
     * Apply all filters
     */
    applyFilters() {
        const me = this;
        let rows = Array.from(this.gridbody.childNodes);

        this.filtertags.innerHTML = '';

        if ((this.activefilters) && (Object.values(this.activefilters).length > 0)) {
            this.filterinfo.setAttribute('aria-expanded', true);
            for (let f of Object.values(this.activefilters)) {
                f.tagbutton = new TagButton({
                    text: this.getfield(f.field).label,
                    help: `${(f.exact ? this.filterhelpexacttext : this.filterhelpcontaintext)} ${f.value}`,
                    action: function() {
                        me.removeFilter(f);
                    }
                });
                this.filtertags.appendChild(f.tagbutton.button);
            }
        } else {
            this.filterinfo.removeAttribute('aria-expanded');
        }

        for (let r of rows) {
            r.removeAttribute('data-matched-filters');
            r.classList.remove('filtered');

            if ((this.activefilters) && (Object.values(this.activefilters).length > 0)) {
                let matchedfilters = [];

                for (let filter of Object.values(this.activefilters)) {

                    let c = r.querySelector(`[data-name='${filter.field}']`);

                    if (filter.exact) {
                        if (c.innerHTML === filter.value) {
                            matchedfilters.push(filter.field);
                        } else {
                            r.classList.add('filtered');
                        }
                    } else {
                        if (c.innerHTML.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1) {
                            matchedfilters.push(filter.field);
                        } else {
                            r.classList.add('filtered');
                        }
                    }
                }

                if (matchedfilters.length > 0) {
                    r.setAttribute('data-matched-filters', matchedfilters.join(','));
                } else {
                    r.removeAttribute('data-matched-filters');
                }
            }
        }


        let visible = this.gridbody.querySelector(`tr:not(.filtered)`);
        if ((!visible) || (visible.length === 0)) {
            this.messagebox.innerHTML = "";
            this.messagebox.append(new MessageBox({
                warningstitle: this.allfilteredtitle,
                warnings: [this.allfilteredtext],
                classes: ['hidden']
            }).container);
            this.messagebox.classList.remove('hidden');
        } else {
            this.messagebox.classList.add('hidden');
        }
       

    }

    /* SELECTION METHODS________________________________________________________________ */

    /**
     * Select a row
     * @param row the row to select
     */
    select(row) {
        row.setAttribute('aria-selected', 'true');
        row.querySelector('input.selector').checked = true;

        if ((this.selectaction) && (typeof this.selectaction === 'function')) {
            this.selectaction(this);
        }
    }

    /**
     * Deselect a row
     * @param row the row to deselect
     */
    deselect(row) {
        row.removeAttribute('aria-selected');
        row.querySelector('input.selector').checked = false;
    }

    /**
     * Toggle all/none selection
     * @param select if true, select all; if false, deselect all.
     */
    toggleallselect(select) {
        let rows = this.gridbody.querySelectorAll('tr');
        for (let r of rows) {
            if (select) {
                this.select(r);
            } else {
                this.deselect(r);
            }
        }
    }

    /**
     * Toggle the select mode
     */
    selectmodetoggle() {
        if (this.multiselecting) {
            this.grid.classList.remove('multiselecting');
            return;
        }
        this.grid.classList.add('multiselecting');
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the total DOM.
     * @returns the grid container
     */
    buildContainer() {
        const me = this;

        for (let rdata of this.data) {
            this.gridbody.appendChild(this.buildRow(rdata));
        }

        this.container = document.createElement('div');
        this.container.classList.add('datagrid-container');
        this.container.classList.add('panel');
        this.container.setAttribute('id', this.id);
        this.container.setAttribute('aria-expanded', 'true');

        if (this.title) {
            this.container.append(this.header);
        }

        this.container.append(this.gridinfo);

        if (this.filterable) {
            this.container.append(this.filterinfo);
        }

        this.grid.appendChild(this.thead);
        this.grid.appendChild(this.gridbody);

        this.gridwrapper = document.createElement('div');
        this.gridwrapper.classList.add('grid-wrapper');
        this.gridwrapper.appendChild(this.grid);
        this.container.append(this.gridwrapper);

        this.messagebox = document.createElement('div');
        this.messagebox.classList.add('messages');
        this.messagebox.classList.add('hidden');
        this.container.append(this.messagebox);

        if (this.minimized) { // don't call close() to avoid the callbacks.
            this.container.setAttribute('aria-expanded', 'false');
            this.minimized = true;
        }

        if (this.hidden) { this.hide(); }

        setTimeout(function() { // Have to wait until we're sure we're in the DOM
            me.applystate();
            me.grindDuplicateCells();
        }, 100);

    }

    /**
     * Build the grid filters bit
     */
    buildFilterInfo() {

        this.filterinfo = document.createElement('div');
        this.filterinfo.classList.add('grid-filterinfo');

        let label = document.createElement('label');
        label.innerHTML = this.filterlabel;
        this.filterinfo.appendChild(label);

        this.filtertags = document.createElement('div');
        this.filtertags.classList.add('grid-filtertags');

        this.filterinfo.appendChild(this.filtertags);
    }

    /**
     * Update the count of elements in the data grid.
     */
    updateCount() {
        this.itemcount.innerHTML = this.data.length;
    }

    /**
     * Build the grid info bit
     */
    buildGridInfo() {
        const me = this;

        this.gridinfo = document.createElement('div');
        this.gridinfo.classList.add('grid-info');

        this.itemcountlabel = document.createElement('label');
        this.itemcountlabel.innerHTML = TextFactory.get('items_label');

        this.itemcount = document.createElement('span');
        this.itemcount.classList.add('itemcount');
        this.updateCount();

        this.itemcountbox = document.createElement('div');
        this.itemcountbox.classList.add('countbox');
        this.itemcountbox.appendChild(this.itemcountlabel);
        this.itemcountbox.appendChild(this.itemcount);

        this.gridinfo.appendChild(this.itemcountbox);

        if (this.searchable) {
            this.searchcontrol = new SearchControl({
                arialabel: TextFactory.get('search_this_data'),
                placeholder: TextFactory.get('search_this_data'),
                searchtext: TextFactory.get('search'),
                action: function(value, searchcontrol) {
                    me.search(value);
                }
            });
            this.gridinfo.append(this.searchcontrol.container);
        }

        if (this.filterable) {
            this.filterbutton  = new SimpleButton({
                mute: true,
                text: TextFactory.get('filters'),
                icon: this.filterbuttonicon,
                classes: ['filter'],
                action: function() {
                    me.configurator('filter');
                }
            });
            this.gridinfo.append(this.filterbutton.button);
        }

        let items = [];
        if (this.multiselect) {
            items.push({
                label: TextFactory.get('bulk_select'),
                icon: this.multiselecticon,
                action: function() {
                    me.selectmodetoggle();
                }
            });
        }
        items.push({
            label: TextFactory.get('columns'),
            icon: this.columnconfigurationicon,
            action: function() {
                me.configurator('column');
            }
        });
        if (this.exportable) {
            items.push({
                label: TextFactory.get('export'),
                icon: this.exporticon,
                action: function() {
                    me.export();
                }
            });
        }

        this.actionsbutton  = new ButtonMenu({
            mute: true,
            shape: 'square',
            secondicon: null,
            text: TextFactory.get('actions'),
            icon: this.actionsbuttonicon,
            classes: ['actions'],
            items: items
        });

        this.gridinfo.append(this.actionsbutton.button);
    }

    /**
     * Build the actual grid table.
     */
    buildGrid() {
        this.grid = document.createElement('table');
        this.grid.classList.add('grid');
        if (this.selectable) {
            this.grid.classList.add('selectable');
        }
    }

    /**
     * Build the table header
     */
    buildTableHead() {
        const me = this;
        if (this.multiselect) {
            this.masterselector = new BooleanToggle({
                onchange: function(self) {
                    me.toggleallselect(self.checked);
                }
            });
            let cell = document.createElement('th');
            cell.classList.add('selector');
            cell.classList.add('mechanical');
            cell.appendChild(this.masterselector.naked);
            this.gridheader.appendChild(cell);
        }

        for (let f of this.fields) {
            this.gridheader.appendChild(this.buildHeaderCell(f));
        }

        this.thead = document.createElement('thead');
        this.thead.appendChild(this.gridheader);
    }

    /**
     * Build a single header cell
     * @param field the field definition dictionary
     * @return {HTMLTableHeaderCellElement}
     */
    buildHeaderCell(field) {
        const me = this;

        let div = document.createElement('div');
        div.classList.add('th');
        div.innerHTML = field.label;
        if (this.sorticon) { div.classList.add(`cfb-${this.sorticon}`); }

        let cell = document.createElement('th');
        cell.setAttribute('id', `${this.id}-h-c-${field.name}`);
        cell.setAttribute('data-name', field.name);
        cell.setAttribute('data-datatype', field.type);
        cell.classList.add(field.type);
        cell.appendChild(div);

        if (field.resize) { cell.classList.add('resize'); }

        if (field.nodupe) { cell.classList.add('nodupe'); }

        if (field.hidden) { cell.classList.add('hidden'); }

        if (field.description) {
            let celltip = new ToolTip({
                text: field.description
            });
            celltip.attach(div);
        }

        if (this.sortable) {
            // XXX Add "sort this" aria label
            cell.setAttribute('tabindex', '0');
            cell.addEventListener('click', function(e) {
                e.preventDefault();
                me.togglesort(field.name);
            });
            cell.addEventListener('keyup', function(e) {
                e.preventDefault();
                switch (e.keyCode) {
                    case 13: // enter
                    case 32: // 32
                        me.togglesort(field.name);
                        break;
                    default:
                        break;

                }
            });
        }

        this.headercells[field.name] = cell;

        return cell;
    }

    /**
     * Toggle sort direction on a header cell
     * @param fieldname
     */
    togglesort(fieldname) {
        let hCell = this.gridheader.querySelector(`[data-name='${fieldname}'`);
        let sort = 'asc';
        if ((hCell) && (hCell.getAttribute('data-sort'))) {
            if (hCell.getAttribute('data-sort') === 'asc') {
                sort = "desc";
            }
        }
        this.sortfield(fieldname, sort);
    }

    /**
     * Builds the table body
     */
    buildGridBody() {
        this.gridbody = document.createElement('tbody');
    }

    /**
     * Builds the table header row.
     */
    buildGridHeader() {
        this.gridheader = document.createElement('tr');
        this.gridheader.classList.add('header');
    }

    /**
     * Build a single row
     * @param rdata the row data
     * @return {HTMLTableRowElement}
     */
    buildRow(rdata) {
        const me = this;
        let row = document.createElement('tr');

        if (this.selectable) {

            row.setAttribute('tabindex', '0');

            row.addEventListener('click', function(e) {
                if ((me.selectable) && (!me.multiselecting)) {
                    me.select(row);
                }
            });

            row.addEventListener('keydown', function(e) {
                switch(e.keyCode) {
                    case 37:
                    case 38:
                        e.preventDefault();
                        let previous = row.parentNode.rows[row.rowIndex - 2];
                        if (previous) { previous.focus(); }
                        break;
                    case 39:
                    case 40:
                        e.preventDefault();
                        let next = row.parentNode.rows[row.rowIndex];
                        if (next) { next.focus(); }
                        break;
                    case 13:
                    case 32:
                        row.click();
                        break;
                    default:
                        break;
                }
            });
        }

        if (this.multiselect) {
            let selector = new BooleanToggle({
                classes: ['selector'],
                onchange: function(self) {
                    if (row.getAttribute('aria-selected') === 'true') {
                        row.removeAttribute('aria-selected');
                    } else {
                        row.setAttribute('aria-selected', 'true');
                    }
                }
            });
            let cell = document.createElement('td');
            cell.classList.add('selector');
            cell.classList.add('mechanical');
            cell.appendChild(selector.naked);
            row.appendChild(cell);
        }

        for (let f of this.fields) {
            row.appendChild(this.buildCell(rdata, f));
        }

        return row;
    }

    /**
     * Builds a single data cell
     * @param data the data dictionary
     * @param field the field definition dictionary
     * @return {HTMLTableDataCellElement}
     */
    buildCell(data, field) {
        let content;
        let d = data[field.name];

        if ((field.renderer) && (typeof field.renderer === 'function')) {
            content = field.renderer(d);
        } else {
            switch(field.type) {
                case 'number':
                    content = d;
                    break;
                case 'time':
                    content = d;
                    break;
                case 'imageurl':
                    content = `<a href="${d}"><img src="${d}" /></a>`;
                    break;
                case 'date':
                    content = d.toString();
                    break;
                case 'stringarray':
                    content = d.join(field.separator);
                    break;
                case 'paragraph':
                    content = d.join(field.separator);
                    break;
                case 'string':
                default:
                    content = d;
                    break;
            }
        }

        let cell = document.createElement('td');
        cell.setAttribute('data-name', field.name);
        cell.setAttribute('data-datatype', field.type);
        cell.classList.add(field.name);
        cell.classList.add(field.type);
        cell.innerHTML = content;

        if (field.classes) {
            for (let c of field.classes) {
                cell.classList.add(c);
            }
        }
        if (field.hidden) {
            cell.classList.add('hidden');
        }

        return cell;
    }

    /**
     * Build the footer element
     */
    buildFooter() {
        this.footer = document.createElement('div');
        this.footer.classList.add('footer');
    }

    /* UTILITY METHODS__________________________________________________________________ */


    /* ACCESSOR METHODS_________________________________________________________________ */

    get actionsbutton() { return this._actionsbutton; }
    set actionsbutton(actionsbutton) { this._actionsbutton = actionsbutton; }

    get actionsbuttonicon() { return this.config.actionsbuttonicon; }
    set actionsbuttonicon(actionsbuttonicon) { this.config.actionsbuttonicon = actionsbuttonicon; }

    get activefilters() { return this._activefilters; }
    set activefilters(activefilters) { this._activefilters = activefilters; }

    get columnconfigbutton() { return this._columnconfigbutton; }
    set columnconfigbutton(columnconfigbutton) { this._columnconfigbutton = columnconfigbutton; }

    get columnconfigurationicon() { return this.config.columnconfigurationicon; }
    set columnconfigurationicon(columnconfigurationicon) { this.config.columnconfigurationicon = columnconfigurationicon; }

    get currentsort() { return this._currentsort; }
    set currentsort(currentsort) { this._currentsort = currentsort; }

    get data() { return this.config.data; }
    set data(data) { this.config.data = data; }

    get demphasizeduplicates() { return this.config.demphasizeduplicates; }
    set demphasizeduplicates(demphasizeduplicates) { this.config.demphasizeduplicates = demphasizeduplicates; }

    get exportable() { return this.config.exportable; }
    set exportable(exportable) { this.config.exportable = exportable; }

    get exportarrayseparator() { return this.config.exportarrayseparator; }
    set exportarrayseparator(exportarrayseparator) { this.config.exportarrayseparator = exportarrayseparator; }

    get exportbutton() { return this._exportbutton; }
    set exportbutton(exportbutton) { this._exportbutton = exportbutton; }

    get exportfilename() { return this.config.exportfilename; }
    set exportfilename(exportfilename) { this.config.exportfilename = exportfilename; }

    get exportheaderrow() { return this.config.exportheaderrow; }
    set exportheaderrow(exportheaderrow) { this.config.exportheaderrow = exportheaderrow; }

    get exporticon() { return this.config.exporticon; }
    set exporticon(exporticon) { this.config.exporticon = exporticon; }

    get fields() { return this.config.fields; }
    set fields(fields) { this.config.fields = fields; }

    get filterable() { return this.config.filterable; }
    set filterable(filterable) { this.config.filterable = filterable; }

    get filterbutton() { return this._filterbutton; }
    set filterbutton(filterbutton) { this._filterbutton = filterbutton; }

    get filterbuttonicon() { return this.config.filterbuttonicon; }
    set filterbuttonicon(filterbuttonicon) { this.config.filterbuttonicon = filterbuttonicon; }

    get filterinfo() {
        if (!this._filterinfo) { this.buildFilterInfo(); }
        return this._filterinfo;
    }
    set filterinfo(filterinfo) { this._filterinfo = filterinfo; }

    get filtertags() { return this._filtertags; }
    set filtertags(filtertags) { this._filtertags = filtertags; }

    get footer() {
        if (!this._footer) { this.buildFooter(); }
        return this._footer;
    }
    set footer(footer) { this._footer = footer; }

    get grid() {
        if (!this._grid) { this.buildGrid(); }
        return this._grid;
    }
    set grid(grid) { this._grid = grid; }

    get gridinfo() {
        if (!this._gridinfo) { this.buildGridInfo(); }
        return this._gridinfo;
    }
    set gridinfo(gridinfo) { this._gridinfo = gridinfo; }

    get gridbody() {
        if (!this._gridbody) { this.buildGridBody(); }
        return this._gridbody;
    }
    set gridbody(gridbody) { this._gridbody = gridbody; }

    get gridheader() {
        if (!this._gridheader) { this.buildGridHeader(); }
        return this._gridheader;
    }
    set gridheader(gridheader) { this._gridheader = gridheader; }

    get gridwrapper() { return this._gridwrapper; }
    set gridwrapper(gridwrapper) { this._gridwrapper = gridwrapper; }

    get headercells() {
        if (!this._headercells) { this._headercells = {} ; }
        return this._headercells;
    }
    set headercells(headercells) { this._headercells = headercells; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get itemcount()  { return this._itemcount; }
    set itemcount(itemcount) { this._itemcount = itemcount; }

    get itemcountbox()  { return this._itemcountbox; }
    set itemcountbox(itemcountbox) { this._itemcountbox = itemcountbox; }

    get itemcountlabel()  { return this._itemcountlabel; }
    set itemcountlabel(itemcountlabel) { this._itemcountlabel = itemcountlabel; }

    get masterselector() { return this._masterselector; }
    set masterselector(masterselector) { this._masterselector = masterselector; }

    get multiselect() { return this.config.multiselect; }
    set multiselect(multiselect) { this.config.multiselect = multiselect; }

    get multiselectbutton() { return this._multiselectbutton; }
    set multiselectbutton(multiselectbutton) { this._multiselectbutton = multiselectbutton; }

    get multiselecticon() { return this.config.multiselecticon; }
    set multiselecticon(multiselecticon) { this.config.multiselecticon = multiselecticon; }

    get multiselectactions() { return this.config.multiselectactions; }
    set multiselectactions(multiselectactions) { this.config.multiselectactions = multiselectactions; }

    get messagebox() { return this._messagebox; }
    set messagebox(messagebox) { this._messagebox = messagebox; }

    get savekey() { return this._savekey; }
    set savekey(savekey) { this._savekey = savekey; }

    get savestate() { return this.config.savestate; }
    set savestate(savestate) { this.config.savestate = savestate; }

    get searchable() { return this.config.searchable; }
    set searchable(searchable) { this.config.searchable = searchable; }

    get searchcontrol() { return this._searchcontrol; }
    set searchcontrol(searchcontrol) { this._searchcontrol = searchcontrol; }

    get selectable() { return this.config.selectable; }
    set selectable(selectable) { this.config.selectable = selectable; }

    get selectaction() { return this.config.selectaction; }
    set selectaction(selectaction) { this.config.selectaction = selectaction; }

    get sortable() { return this.config.sortable; }
    set sortable(sortable) { this.config.sortable = sortable; }

    get sorticon() { return this.config.sorticon; }
    set sorticon(sorticon) { this.config.sorticon = sorticon; }

    get state() { return this._state; }
    set state(state) { this._state = state; }

    get thead() {
        if (!this._thead) { this.buildTableHead(); }
        return this._thead;
    }
    set thead(thead) { this._thead = thead; }

}
