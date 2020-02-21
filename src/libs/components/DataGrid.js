

class DataGrid {

    static get DEFAULT_CONFIG() {
        return {
            fields: [], // The data fields for the grid and how they behave.

            data: [], // The data to throw into the grid

            sortable: true, //  Data columns can be selected

            filterable: true, // Data can be filtered

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

            selectable: true, //  Data rows can be selected.
            selectaction: function(event, self) {  // What to do when a single row is selecte.
                //console.log("row clicked");
            },
            
            multiselectbuttontext: "Bulk Select",
            multiselect: true, // Can multiple rows be selected? If true, overrides "selectable: false"
            multiactions: [], // Array of button actions to multiselects


            sorticon: 'chevron-down',
            id: null, // The id
            classes: [] //Extra css classes to apply
        };
    }

    static get BLANK_STATE() {
        return {
            selected: null, // Holds the identifier for the selected item
            sortfield: null, // a string, holds the a field name
            sortdirection: null, // a string, asc or desc
            filter: null, // a string/filter name
            fields: {} // A dictionary that holds field configuration
        };
    }

    /**
     * Define a DataGrid
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, DataGrid.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `grid-${Utils.getUniqueKey(5)}`; }
    }

    /* PSEUDO GETTERS___________________________________________________________________ */

    get multiselecting() {
        return this.grid.classList.contains('multiselecting');
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

    search(value) {
        let rows = Array.from(this.gridbody.childNodes);

        for (let r of rows) {
            let show = false;

            r.classList.add('hidden');

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
                r.classList.remove('hidden');
            }
        }
    }

    /* SELECTION METHODS________________________________________________________________ */

    /**
     * Sort the table based on a field.
     * @param field the field to sort
     */
    sortField(field) {
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

    /**
     * Select a row
     * @param row the row to select
     */
    select(row) {
        if (!this.multiselecting) {
            this.toggleallselect(false);
        }
        row.setAttribute('aria-selected', 'true');
        row.querySelector('input.selector').checked = true;
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

        if ((this.multiselect) || (this.exportable) || (this.filterable)) {

            this.gridactions = document.createElement('div');
            this.gridactions.classList.add('grid-actions');

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

            if (this.filterable) {
                this.searchcontrol = new SearchControl({
                    action: function(value, searchcontrol) {
                        me.search(value);
                    }
                });
                this.gridactions.append(this.searchcontrol.container);
            }

            if (this.exportable) {
                this.exportbutton  = new SimpleButton({
                    ghost: true,
                    text: this.exportbuttontext,
                    icon: this.exporticon,
                    classes: ['export'],
                    action: function() {
                        me.export();
                    }
                });
                this.gridactions.append(this.exportbutton.button);
            }

            this.container.append(this.gridactions);
        }

        this.grid.appendChild(this.header);
        this.grid.appendChild(this.gridbody);

        let gridwrapper = document.createElement('div');
        gridwrapper.classList.add('grid-wrapper');
        gridwrapper.appendChild(this.grid);

        this.container.append(gridwrapper);

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
     * @param item the field definition dictionary
     * @return {HTMLTableHeaderCellElement}
     */
    buildHeaderCell(item) {
        const me = this;

        let div = document.createElement('div');
        div.innerHTML = item.label;
        if (this.sorticon) { div.classList.add(`cfb-${this.sorticon}`); }

        let cell = document.createElement('th');
        cell.setAttribute('id', `${this.id}-h-c-${item.name}`);
        cell.setAttribute('data-name', item.name);
        cell.setAttribute('data-datatype', item.type);
        cell.classList.add(item.type);
        cell.appendChild(div);

        if (item.resize) {
            cell.classList.add('resize');
        }

        if (this.sortable) {
            cell.setAttribute('tabindex', '0');
            cell.addEventListener('click', function(e) {
                e.preventDefault();
                me.sortField(item.name);
            });
        }

        this.headercells[item.name] = cell;

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
            row.setAttribute('tabindex', '1');
            row.addEventListener('click', function(e) {
                if (me.selectable) { me.select(row); }
                if ((me.selectaction) && (typeof me.selectaction === 'function')) {
                    me.selectaction(e, me);
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
                    if (self.checked) {
                        console.log('checked this');
                        return;
                    }
                    console.log('checked off this');
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

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

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

    get gridactions() { return this._gridactions; }
    set gridactions(gridactions) { this._gridactions = gridactions; }

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

}