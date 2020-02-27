

class DataGrid {

    static get DEFAULT_CONFIG() {
        return {
            fields: [
                /*
                 * An array of field definition dictionaries:
                 *
                    name: <string>,  // The variable name for this field (computer readable)
                    label: <string>, // The human-readable name for the column
                    width: <number,  // The default width of the column
                    hidden: <boolean>, // Is the column hidden or not.
                    type: <string>,  // The datatype of the column
                                     //   - string
                                     //   - number
                                     //   - date
                                     //   - time
                                     //   - stringarray
                                     //   - paragraph
                    separator: <string>, // Used when rendering array values
                    resize: <boolean>,  // Whether or not to allow resizing of the column (default: false)
                    description: <string>>, // A string that describes the data in the column
                    classes: <string array>, // Additional classes to apply to cells of this field
                    filterable: <null|string|enum> // Is the field filterable? if so, how?
                    renderer: function(data) {  // A function that can be used to
                        return `${data}.`;
                    }
                */
            ], // The data fields for the grid and how they behave.

            data: [], // The data to throw into the grid

            sortable: true, //  Data columns can be sorted

            columnconfigurationlabel: 'Columns',
            columnconfigurationicon: 'table',
            columnconfigurationinstructions: 'Select which columns to show in the grid. This does not hide the columns during export.',
            columnconfigurationtitle: 'Configure Columns',

            savestate: true, // attempt to save the grid's state

            searchable: true, // Data can be filtered
            searchbuttontext: 'Search',
            searchplaceholder: 'Search this data',
            noresultstitle: 'No results',
            noresultstext: 'No entries were found matching your search terms.',

            itemcountlabeltext: 'Items:',

            exportable: true, // Data can be exported
            exportbuttontext: "Export",
            exporticon: "download",
            exportheaderrow: 'readable', // When exporting a CSV file, should a header row
                                         // be included?  Possible values:
                                         // 'readable' : Uses the header labels (human readable)
                                         // 'data' : Uses the data labels
                                         // 'no' or null: don't include a header row
            exportfilename: function() {  // the filename to name the exported data.
                return 'export.csv';      // This can be a string or a function, but must return a string
            },
            exportarrayseparator: "\, ", // What to use when exporting fields with arrays as a separator.  Do not use '\n' as this breaks CSV encoding.

            filterable: true, // Can the datagrid be filtered?
                      // No all fields are filtered by default.
                      // Whether or not a field can be filtered is defined in the field's definition.
            filterbuttontext: 'Filters',
            filterbuttonicon: 'filter',
            filterinstructions: ['Columns that are filterable are shown below. Set the value of the column to filter it.'],
            filterlabel: 'Active Filters:',
            filtertitle: 'Manage Filters',
            filterunselectedvaluetext: '(No filter)',
            filterplaceholder: '(No filter)',
            filterhelpexacttext: 'Match exactly:',
            filterhelpcontaintext: 'Matches contain:',
            applyfilterstext: 'Apply Filters',
            applyfiltersicon: 'checkmark-circle',

            actionsbuttontext: 'Actions',
            actionsbuttonicon: 'menu',

            selectable: true, //  Data rows can be selected.
            selectaction: function(self) {  // What to do when a single row is selected.
                //console.log("row clicked");
            },

            multiselectbuttontext: "Bulk Select",
            multiselect: true, // Can multiple rows be selected? If true, overrides "selectable: false"
            multiactions: [], // Array of button actions to multiselects

            texttotal: 'total',
            sorticon: 'chevron-down',
            id: null, // The id
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define a DataGrid
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, DataGrid.DEFAULT_CONFIG, config);
        if (this.id) {
            this.savekey = `grid-${this.id}`;
        } else {
            this.id = `grid-${Utils.getUniqueKey(5)}`;
        }
        this.activefilters = {};
        this.loadstate();
        console.log(this.state);
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
     * Toggle visibility of the actions panel
     */
    toggleActions() {
        if (this.gridactions.getAttribute('aria-hidden') === 'true') {
            this.openActions();
        } else {
            this.closeActions();
        }
    }

    /**
     * Open the actions panel
     */
    openActions() {
        this.gridactions.removeAttribute('aria-hidden');
        this.actionsbutton.button.setAttribute('aria-expanded', true);
    }

    /**
     * Close the actions panel
     */
    closeActions() {
        this.gridactions.setAttribute('aria-hidden', true);
        this.actionsbutton.button.removeAttribute('aria-expanded');
    }

    /**
     * Export the data in the grid as a CSV
     */
    export() {
        let lineDivider = '\r\n', // line divider
            cellDivider = ',', // cell divider
            rows = [],
            fname;

        this.exportbutton.disable();

        if ((this.exportfilename) && (typeof this.exportfilename === 'function')) {
            fname = this.exportfilename();
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

        this.exportbutton.enable();

    }

    /**
     * Search the grid for the value provided.
     * @param value
     */
    search(value) {
        this.noresultsbox.container.classList.add('hidden');

        let rows = Array.from(this.gridbody.childNodes);

        let matches = 0;
        for (let r of rows) {
            let show = false;
            r.setAttribute('data-search-hidden', true,);

            if ((!value) || (value === '')) {
                show = true;
            } else {
                let cells = Array.from(r.childNodes);
                for (let c of cells) {
                    if (show) { break; }
                    if (!c.classList.contains('selector')) {
                        if (c.innerHTML.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                            show = true;
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
            this.noresultsbox.container.classList.remove('hidden');
        }
    }

    /**
     * Sort the table based on a field.
     * @param field the field to sort
     */
    sortfield(field) {
        let sort = "asc";

        let hCell = this.gridheader.querySelector(`[data-name='${field}']`);

        if ((hCell) && (hCell.getAttribute('data-sort'))) {
            if (hCell.getAttribute('data-sort') === 'asc') {
                sort = "desc";
            }
        }

        let hchildren = this.gridheader.querySelectorAll('th');
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
     * Hide a column from the view.
     * @param field the field to hide.
     */
    hideColumn(field) {
        field.hidden = true;
        let cols = this.grid.querySelectorAll(`[data-name='${field.name}']`);
        for (let c of cols) {
            c.classList.add('hidden');
        }
    }

    /**
     * Show a hidden column in the view.
     * @param field
     */
    showColumn(field) {
        field.hidden = false;
        let cols = this.grid.querySelectorAll(`[data-name='${field.name}']`);
        for (let c of cols) {
            c.classList.remove('hidden');
        }
    }

    /**
     * Configure columns for the datagrid
     */
    columnconfigurator() {
        const me = this;

        let container = document.createElement('div');
        container.classList.add('datagrid-configurator');
        container.classList.add('column');

        // instructions
        if (this.columnconfigurationinstructions) {
            container.append(new InstructionBox({
                instructions: [this.columnconfigurationinstructions]
            }).container);
        }

        let ul = document.createElement('ul');
        ul.classList.add('elements');

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

            ul.append(li);
        }

        container.append(ul);

        let dialog = new DialogWindow({
            title: this.columnconfigurationtitle,
            content: container
        });
        dialog.open();
    }

    /* PERSISTENCE METHODS______________________________________________________________ */

    persist() {
        if (!this.ispersistable) {
            return;
        }
        this.state = this.grindstate(); // get a current copy of it.
        localStorage.setItem(this.savekey, JSON.stringify(this.state));
    }

    loadstate() {
        if (this.ispersistable) {
            this.state = JSON.parse(localStorage.getItem(this.savekey));
        }
        if (!this.state) {
            this.state = this.grindstate(); // this will be the default
        }
    }

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

    filterconfigurator() {

        let instructions;
        if (this.filterinstructions) {
            instructions = {
                instructions: this.filterinstructions
            };
        }

        let elements = [];
        for (let f of this.fields) {
            if (f.filterable) {
                elements.push(this.getFilterLine(f));
            }
        }

        let f = new SimpleForm({
            instructions: instructions,
            elements: elements,
            actions: [
                new SimpleButton({
                    text: "Close",
                    mute: true,
                    action: function(e, btn) {
                        if ((btn.form) && (btn.form.dialog)) {
                            btn.form.dialog.close();
                        }
                    }
                })
            ]
        });

        let dialog = new DialogWindow({
            title: this.filtertitle,
            form: f
        });
        dialog.open();
    }

    buildFilterMenu() {
        let elements = [];
        for (let f of this.fields) {
            if (f.filterable) {
                elements.push(this.getFilterLine(f));
            }
        }
        return new SimpleForm({
            elements: elements,
            action: function() { }
        }).container;
    }

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

    removeFilter(f) {
        console.log(this.activefilters);
        delete this.activefilters[f.field];
        this.persist();
        console.log(this.activefilters);
        this.applyFilters();
    }

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
        this.container.setAttribute('id', this.id);

        this.container.append(this.gridinfo);
        this.container.append(this.gridactions);
        if (this.filterable) {
            this.container.append(this.filterinfo);
        }

        this.grid.appendChild(this.header);
        this.grid.appendChild(this.gridbody);

        let gridwrapper = document.createElement('div');
        gridwrapper.classList.add('grid-wrapper');
        gridwrapper.appendChild(this.grid);
        this.container.append(gridwrapper);

        if (this.searchable) {
            this.noresultsbox = new MessageBox({
                warningstitle: this.noresultstitle,
                warnings: [this.noresultstext],
                classes: ['hidden']
            });
            this.container.append(this.noresultsbox.container);
        }

        setTimeout(function() { // Have to wait until we're sure we're in the DOM
            me.applystate();
        }, 100);

    }

    /**
     * Build the actions for the grid
     */
    buildGridActions() {
        const me = this;

        this.gridactions = document.createElement('div');
        this.gridactions.classList.add('grid-actions');
        this.gridactions.setAttribute('aria-hidden', 'true');

        if (this.multiselect) {
            this.multiselectbutton = new SimpleButton({
                mute: true,
                text: this.multiselectbuttontext,
                classes: ['multiselect'],
                action: function() {
                    me.selectmodetoggle();
                }
            });
            this.gridactions.append(this.multiselectbutton.button);
        }

        this.columnconfigbutton = new SimpleButton({
            mute: true,
            text: this.columnconfigurationlabel,
            icon: this.columnconfigurationicon,
            action: function() {
                me.columnconfigurator();
            }
        });
        this.gridactions.append(this.columnconfigbutton.button);

        if (this.exportable) {
            this.exportbutton  = new SimpleButton({
                mute: true,
                text: this.exportbuttontext,
                icon: this.exporticon,
                classes: ['export'],
                action: function() {
                    me.export();
                }
            });
            this.gridactions.append(this.exportbutton.button);
        }
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
     * Build the grid info bit
     */
    buildGridInfo() {
        const me = this;

        this.gridinfo = document.createElement('div');
        this.gridinfo.classList.add('grid-info');

        this.itemcountlabel = document.createElement('label');
        this.itemcountlabel.innerHTML = this.itemcountlabeltext;

        this.itemcount = document.createElement('span');
        this.itemcount.classList.add('itemcount');
        this.itemcount.innerHTML = this.data.length;

        this.itemcountbox = document.createElement('div');
        this.itemcountbox.classList.add('countbox');
        this.itemcountbox.appendChild(this.itemcountlabel);
        this.itemcountbox.appendChild(this.itemcount);

        this.gridinfo.appendChild(this.itemcountbox);

        if (this.searchable) {
            this.searchcontrol = new SearchControl({
                arialabel: this.searchplaceholder,
                placeholder: this.searchplaceholder,
                searchtext: this.searchbuttontext,
                action: function(value, searchcontrol) {
                    me.search(value);
                }
            });
            this.gridinfo.append(this.searchcontrol.container);
        }

        if (this.filterable) {
            this.filterbutton  = new ButtonMenu({
                mute: true,
                text: this.filterbuttontext,
                icon: this.filterbuttonicon,
                classes: ['filter'],
                menu: this.buildFilterMenu()
            });
            this.gridinfo.append(this.filterbutton.button);
        }

        this.actionsbutton  = new SimpleButton({
            mute: true,
            shape: 'square',
            text: this.actionsbuttontext,
            icon: this.actionsbuttonicon,
            classes: ['actions'],
            action: function() {
                me.toggleActions();
            }
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
    buildHeader() {
        const me = this;
        if (this.multiselect) {
            this.masterselector = new BooleanToggle({
                onchange: function(self) {
                    me.toggleallselect(self.checked);
                }
            });
            let cell = document.createElement('th');
            cell.classList.add('selector');
            cell.appendChild(this.masterselector.naked);
            this.gridheader.appendChild(cell);
        }

        for (let f of this.fields) {
            this.gridheader.appendChild(this.buildHeaderCell(f));
        }

        this.header = document.createElement('thead');
        this.header.appendChild(this.gridheader);
    }

    /**
     * Build a single header cell
     * @param field the field definition dictionary
     * @return {HTMLTableHeaderCellElement}
     */
    buildHeaderCell(field) {
        const me = this;

        let div = document.createElement('div');
        div.innerHTML = field.label;
        if (this.sorticon) { div.classList.add(`cfb-${this.sorticon}`); }

        let cell = document.createElement('th');
        cell.setAttribute('id', `${this.id}-h-c-${field.name}`);
        cell.setAttribute('data-name', field.name);
        cell.setAttribute('data-datatype', field.type);
        cell.classList.add(field.type);
        cell.appendChild(div);

        if (field.resize) {
            cell.classList.add('resize');
        }

        if (field.hidden) {
            cell.classList.add('hidden');
        }

        if (this.sortable) {
            cell.setAttribute('tabindex', '0');
            cell.addEventListener('click', function(e) {
                e.preventDefault();
                me.sortfield(field.name);
            });
        }

        this.headercells[field.name] = cell;

        return cell;
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
                if ((e.keyCode === 37) || (e.keyCode === 38)) { // Left arrow || Up Arrow
                    e.preventDefault();
                    let previous = row.parentNode.rows[row.rowIndex - 2];
                    if (previous) { previous.focus(); }
                } else if ((e.keyCode === 39) || (e.keyCode === 40)) { // Right arrow || Down Arrow
                    e.preventDefault();
                    let next = row.parentNode.rows[row.rowIndex];
                    if (next) { next.focus(); }
                } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                    row.click();
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
                        row.setAttribute('aria-selected', true);
                    }
                }
            });
            let cell = document.createElement('td');
            cell.classList.add('selector');
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

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get actionsbutton() { return this._actionsbutton; }
    set actionsbutton(actionsbutton) { this._actionsbutton = actionsbutton; }

    get actionsbuttonicon() { return this.config.actionsbuttonicon; }
    set actionsbuttonicon(actionsbuttonicon) { this.config.actionsbuttonicon = actionsbuttonicon; }

    get actionsbuttontext() { return this.config.actionsbuttontext; }
    set actionsbuttontext(actionsbuttontext) { this.config.actionsbuttontext = actionsbuttontext; }

    get activefilters() { return this._activefilters; }
    set activefilters(activefilters) { this._activefilters = activefilters; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get columnconfigbutton() { return this._columnconfigbutton; }
    set columnconfigbutton(columnconfigbutton) { this._columnconfigbutton = columnconfigbutton; }

    get columnconfigurationicon() { return this.config.columnconfigurationicon; }
    set columnconfigurationicon(columnconfigurationicon) { this.config.columnconfigurationicon = columnconfigurationicon; }

    get columnconfigurationinstructions() { return this.config.columnconfigurationinstructions; }
    set columnconfigurationinstructions(columnconfigurationinstructions) { this.config.columnconfigurationinstructions = columnconfigurationinstructions; }

    get columnconfigurationlabel() { return this.config.columnconfigurationlabel; }
    set columnconfigurationlabel(columnconfigurationlabel) { this.config.columnconfigurationlabel = columnconfigurationlabel; }

    get columnconfigurationtitle() { return this.config.columnconfigurationtitle; }
    set columnconfigurationtitle(columnconfigurationtitle) { this.config.columnconfigurationtitle = columnconfigurationtitle; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get data() { return this.config.data; }
    set data(data) { this.config.data = data; }

    get exportable() { return this.config.exportable; }
    set exportable(exportable) { this.config.exportable = exportable; }

    get exportarrayseparator() { return this.config.exportarrayseparator; }
    set exportarrayseparator(exportarrayseparator) { this.config.exportarrayseparator = exportarrayseparator; }

    get exportbutton() { return this._exportbutton; }
    set exportbutton(exportbutton) { this._exportbutton = exportbutton; }

    get exportbuttontext() { return this.config.exportbuttontext; }
    set exportbuttontext(exportbuttontext) { this.config.exportbuttontext = exportbuttontext; }

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

    get filterbuttontext() { return this.config.filterbuttontext; }
    set filterbuttontext(filterbuttontext) { this.config.filterbuttontext = filterbuttontext; }

    get filterhelpcontaintext() { return this.config.filterhelpcontaintext; }
    set filterhelpcontaintext(filterhelpcontaintext) { this.config.filterhelpcontaintext = filterhelpcontaintext; }

    get filterhelpexacttext() { return this.config.filterhelpexacttext; }
    set filterhelpexacttext(filterhelpexacttext) { this.config.filterhelpexacttext = filterhelpexacttext; }

    get filterinfo() {
        if (!this._filterinfo) { this.buildFilterInfo(); }
        return this._filterinfo;
    }
    set filterinfo(filterinfo) { this._filterinfo = filterinfo; }

    get filterinstructions() { return this.config.filterinstructions; }
    set filterinstructions(filterinstructions) { this.config.filterinstructions = filterinstructions; }

    get filterlabel() { return this.config.filterlabel; }
    set filterlabel(filterlabel) { this.config.filterlabel = filterlabel; }

    get filterplaceholder() { return this.config.filterplaceholder; }
    set filterplaceholder(filterplaceholder) { this.config.filterplaceholder = filterplaceholder; }

    get filtertitle() { return this.config.filtertitle; }
    set filtertitle(filtertitle) { this.config.filtertitle = filtertitle; }

    get filtertags() { return this._filtertags; }
    set filtertags(filtertags) { this._filtertags = filtertags; }

    get filterunselectedvaluetext() { return this.config.filterunselectedvaluetext; }
    set filterunselectedvaluetext(filterunselectedvaluetext) { this.config.filterunselectedvaluetext = filterunselectedvaluetext; }

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

    get gridactions() {
        if (!this._gridactions) { this.buildGridActions(); }
        return this._gridactions;
    }
    set gridactions(gridactions) { this._gridactions = gridactions; }

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

    get header() {
        if (!this._header) { this.buildHeader(); }
        return this._header;
    }
    set header(header) { this._header = header; }

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

    get itemcountlabeltext()  { return this.config.itemcountlabeltext; }
    set itemcountlabeltext(itemcountlabeltext) { this.config.itemcountlabeltext = itemcountlabeltext; }

    get masterselector() { return this._masterselector; }
    set masterselector(masterselector) { this._masterselector = masterselector; }

    get multiselect() { return this.config.multiselect; }
    set multiselect(multiselect) { this.config.multiselect = multiselect; }

    get multiselectbutton() { return this._multiselectbutton; }
    set multiselectbutton(multiselectbutton) { this._multiselectbutton = multiselectbutton; }

    get multiselectbuttontext() { return this.config.multiselectbuttontext; }
    set multiselectbuttontext(multiselectbuttontext) { this.config.multiselectbuttontext = multiselectbuttontext; }

    get multiactions() { return this.config.multiactions; }
    set multiactions(multiactions) { this.config.multiactions = multiactions; }

    get noresultsbox() { return this._noresultsbox; }
    set noresultsbox(noresultsbox) { this._noresultsbox = noresultsbox; }

    get noresultstext() { return this.config.noresultstext; }
    set noresultstext(noresultstext) { this.config.noresultstext = noresultstext; }

    get noresultstitle() { return this.config.noresultstitle; }
    set noresultstitle(noresultstitle) { this.config.noresultstitle = noresultstitle; }

    get savekey() { return this._savekey; }
    set savekey(savekey) { this._savekey = savekey; }

    get savestate() { return this.config.savestate; }
    set savestate(savestate) { this.config.savestate = savestate; }

    get searchable() { return this.config.searchable; }
    set searchable(searchable) { this.config.searchable = searchable; }

    get searchcontrol() { return this._searchcontrol; }
    set searchcontrol(searchcontrol) { this._searchcontrol = searchcontrol; }

    get searchbuttontext() { return this.config.searchbuttontext; }
    set searchbuttontext(searchbuttontext) { this.config.searchbuttontext = searchbuttontext; }

    get searchplaceholder() { return this.config.searchplaceholder; }
    set searchplaceholder(searchplaceholder) { this.config.searchplaceholder = searchplaceholder; }

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

}
