class DataGrid extends Panel {

    static get DEFAULT_CONFIG() {
        return {
            statesaveprefix: 'grid',
            defaultsort: {
                column: 'name',
                direction: 'asc'
            },
            title: null, // the title for the grid
            id: null, // The id. An id is required to save a grid's state.
            sortable: true, //  Data columns can be sorted
            collapsible: true, // can the panel collapse (passed to the Panel)
            elementname: null,
            extraelements: null,
            showfooter: true,
            screen: document.body,
            warehouse: null, // A BusinessObject singleton.  If present,
                             // the grid will ignore any values in fields, data, and source
                             // and will instead pull all information from the warehouse
                             // The grid will be registered with the warehouse and will
                             // be updated when the warehouse updates
            fields: [],  // The data fields for the grid and how they behave.
            data: null,   // The data to throw into the grid on load. This is an array of rows.
            source: null, // the url from which data is drawn.  Ignored if 'data' is not null.
            sourcemethod: 'GET', // the method to get the source from.
            dataprocessor: null, // Data sources may not provide data in a way that the grid prefers.
                                 // This is a function that data is passed through to massage.
                                 // Must accept a JSON blob as it's argument and return an array
                                 // of row definitions.
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
            exportfilename: (self) => { // the filename to name the exported data.
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
            filterbuttonicon: 'filter',
            mute: false, // if true, inputs are set to mute.
            selectable: true, //  Data rows can be selected.
            selectaction: (self, row, rowdata) => {  // What to do when a single row is selected.
                //console.log("row clicked");
            },
            deselectaction: (self, row, rowdata) => {

            },
            doubleclick: null, // Action to take on double click. Passed (e, self); defaults to opening a view
            mouseover: null,  // Mouse events on rows, passed (item, self, e)
            mouseout: null,   // Mouse events on rows, passed (item, self, e)
            spinnerstyle: 'spin', //
            spinnertext: TextFactory.get('datagrid-spinnertext'), //

            multiselect: true, // Can multiple rows be selected? If true, overrides "selectable: false"
            multiselectactions: [], // Array of button actions to multiselects
            multiselecticon: 'checkmark',

            allowedits: true, // If true, the user can edit rows
            instructionsicon: 'help-circle',
            edititeminstructions: 'datagrid-dialog-item-edit-instructions',
            createiteminstructions: 'datagrid-dialog-item-create-instructions',
            deleteiteminstructions: 'datagrid-dialog-item-delete-instructions',
            duplicateiteminstructions: 'datagrid-dialog-item-duplicate-instructions',
            rowactions: null, // an array of row action definition
            //{
            // label: <string>,
            // icon: <iconid>,
            // tooltip: <tooltip string>,
            // tipicon: <iconid>, // if you want to change the tooltip icon
            // type: <string>     // Action types are:
            //                    // view - loads the item into a view window.
            //                    //        If allowedits=true, this window has an edit toggle
            //                    // edit - loads the row into an edit form. Sent to the createhook on save.
            //                    // delete - deletes the row/item (asks for confirmation). Sent to deletehook.
            //                    // duplicate - loads a copy of the item into an edit window.
            //                    //             New item does not have an identifier field.  Sent to createhook.
            //                    // function - passes the row to an external action, defined in the 'action' parameter
            // action: (e, self) => {}  // Only used if type = 'function';  self in this case is the ButtonMenu
            //                               // object, which has the rowdata itself set as it's .data()
            //},
            rowactionsicon: 'menu', // Icon to use for row-actions button
            updatemethod: 'post',
            deletemethod: 'post',
            duplicatemethod: 'post',
            createmethod: 'post',
            updatehook: (rowdata, self) => { // Function fired when a data row is edited and then saved
            },
            deletehook: (rowdata, self) => { // function fired when a data row is deleted
            },
            duplicatehook: (rowdata, self) => { // function fired when a new data row is created
            },
            createhook: (rowdata, self) => { // function fired when a new data row is created
            },
            formsuccess: (form, results) => { // What to do when a form returns success
            },
            createcallback: null, // passed (form, results, identifier)
            updatecalback: null, // passed (form, results, identifier)
            deletecallback: null, // passed (form, results, identifier)
            activitynotifiericon: 'gear-complex',
            activitynotifiertext: TextFactory.get('datagrid-activitynotifier-text'),
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
        this.initialize();
    }

    initialize() {


        // Need to turn these into GridFields if they aren't already
        if (this.warehouse) {
            this.fields = this.warehouse.fields;
            this.identifier = this.warehouse.identifier;
        } else if ((this.fields.length > 0) && (!GridField.prototype.isPrototypeOf(this.fields[0]))) {
            let nf = [];
            for (let f of this.fields) {
                nf.push(new GridField(f));
            }
            this.fields = nf;
            for (let f of this.fields) {
                if (f.identifier) { this.identifier = f.name; }
            }
        }
        if (this.mute) {
            for (let f of this.fields) {
                f.mute = true;
            }
        }

        this.activefilters = [];
        this.finalize();

        setTimeout(() =>{
            this.fillData();
        }, 100);
    }

    finalize() {
        this.shade.activate();
    }

    /**
     * Loads the initial data into the grid.
     */
    fillData() {
        if (this.warehouse) {
            this.warehouse.load((data) => {
                this.update(data);
                this.postLoad();
                this.shade.deactivate();
            });
        } else if (this.source) {
            this.fetchData(this.source, (data) => {
                this.update(data);
                this.postLoad();
                this.shade.deactivate();
            });
        } else if (this.data) {
            for (let rdata of this.data) {
                this.gridbody.appendChild(this.buildRow(rdata));
            }
            setTimeout(() => {
                this.postLoad();
                this.shade.deactivate();
            }, 100);
        }
    }

    /**
     * Do this once we're done loading data.  This only happens once.
     */
    postLoad() {
        this.applystate();
        this.grindDuplicateCells();
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
     * Get all values for a given field key
     * @param key the data key
     * @return {[]} and array of values
     */
    getValues(key) {
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
    getUniqueValues(key) {
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

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Export the data in the grid as a CSV
     * @param obeyView (optional) if true, export the view
     */
    export(obeyView) {
        let fname;

        if (this.exportbutton) {
            this.exportbutton.disable();
        }

        if ((this.exportfilename) && (typeof this.exportfilename === 'function')) {
            fname = this.exportfilename(this);
        } else {
            fname = this.exportfilename;
        }

        let csvdata = this.compileCSV(obeyView);

        let hiddenElement = document.createElement('a');
        hiddenElement.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURI(csvdata)}`);
        hiddenElement.setAttribute('id', 'downloadLink');
        hiddenElement.setAttribute('target', '_blank');
        hiddenElement.setAttribute('download', fname);
        hiddenElement.click();

        if (this.exportbutton) {
            this.exportbutton.enable();
        }
    }

    /**
     * Compile the CSV file
     * @param obeyView if true, only include visible data rows and cells
     * @return {string} a csv clob
     */
    compileCSV(obeyView) {
        let lineDivider = '\r\n', // line divider
            cellDivider = ',', // cell divider
            rows = [];

        // Include the header row, if required.
        if ((this.exportheaderrow) && (this.exportheaderrow !== 'no')) {
            let colTitles = [],
                colData = [];
            for (let f of this.fields) {
                if ((obeyView) && (f.hidden)) {
                    continue; // Skip hidden
                }
                colTitles.push(`\"${f.label.replace(/"/g,"\\\"")}\"`);
                colData.push(`\"${f.name.replace(/"/g,"\\\"")}\"`);
            }
            if (this.exportheaderrow === 'readable') {
                rows.push(`${colTitles.join(cellDivider)}`);
            } else {
                rows.push(`${colData.join(cellDivider)}`);
            }
        }

        // XXX TODO Apply Sort?

        for (let d of this.data) {

            let include = true;
            if ((obeyView) && ((this.activefilters) && (this.activefilters.length > 0))) {
                for (let filter of this.activefilters) {
                    let field = this.getField(filter.field);
                    include = this.testFilter(field, filter, d[filter.field]);
                }
            }

            if (!include) {
                continue;
            }

            let cells = [];
            for (let f of this.fields) { // do mapping by field
                if ((obeyView) && (f.hidden)) {
                    continue; // Skip hidden
                }
                let val;
                if (!d[f.name]) {
                    val = "";
                } else {
                    switch (f.type) {  // XXX Change to GridField
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
                            val = d[f.name].toString().replace(/"/g,"\\\"");
                            break;
                    }

                }
                cells.push(`\"${val}\"`);
            }
            rows.push(cells.join(cellDivider));
        }

        return rows.join(lineDivider);
    }

    /**
     * Search the grid for the value provided.
     * @param value
     */
    search(value) {
        this.messagebox.classList.add('hidden');
        this.gridwrapper.classList.remove('hidden');

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

        if ((matches <= 0) && (value !== '')) {
            this.messagebox.innerHTML = "";
            let warnings = [TextFactory.get('search_noresults')];
            if (matchesHiddenColumns) {
                warnings.push(TextFactory.get('matches_hidden_columns'));
            }
            let mb = new WarningBox({
                title: null,
                warnings: warnings,
                classes: ['hidden']
            });
            this.messagebox.appendChild(mb.container);
            this.messagebox.classList.remove('hidden');
            this.gridwrapper.classList.add('hidden');
        } else {
            this.messagebox.innerHTML = "";
            this.messagebox.classList.add('hidden');
            this.gridwrapper.classList.remove('hidden');
        }
    }

    /**
     * Sort the table based on a field.
     * @param field the field to sort
     */
    sortField(field, sort='asc') {

        let hCell = this.thead.querySelector(`[data-name='${field}']`);

        let hchildren = this.thead.querySelectorAll('th');
        for (let hc of hchildren) {
            hc.removeAttribute('data-sort');
        }

        hCell.setAttribute('data-sort', sort);

        let elements = Array.from(this.gridbody.childNodes);

        elements.sort((a, b) => {
            let textA = a.querySelector(`[data-name='${field}']`).innerHTML.toLowerCase();
            let textB = b.querySelector(`[data-name='${field}']`).innerHTML.toLowerCase();
            if (this.getField(field).type === 'date') {
                let abox = a.querySelector(`[data-name='${field}']`);
                let bbox = b.querySelector(`[data-name='${field}']`);
                textA = abox.getAttribute('data-millis');
                textB = bbox.getAttribute('data-millis');
            }

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
        this.sortField(fieldname, sort);
    }

    /**
     * Opens a configuration dialog.
     * @param type the type of dialog configurator
     */
    configurator(type) {
        let dialogconfig = {
                actions: [],
                screen: this.screen
            };

        switch(type) {
            case 'column':
                dialogconfig.title = TextFactory.get('configure_columns');

                let cc = new ColumnConfigurator({
                    grid: this
                });
                dialogconfig.content = cc.container;
                break;
            case 'filter':
                dialogconfig.title = TextFactory.get('manage_filters');
                let fc = new FilterConfigurator({
                    fields: this.fields,
                    mute: this.mute,
                    filters: this.activefilters
                });
                dialogconfig.content = fc.container;

                dialogconfig.actions.push(new ConstructiveButton({ // need to pass this to sub-routines
                    text: TextFactory.get('apply_filters'),
                    icon: 'disc-check',
                    action: () => {
                        fc.grindFilters();
                        this.activefilters = fc.filters;
                        this.applyFilters();
                        this.persist();
                        this.dialog.close();
                    }
                }));

                break;
            default:
                break;
        }

        dialogconfig.actions.push('closebutton');
        this.dialog = new DialogWindow(dialogconfig);
        this.dialog.open();
    }

    /**
     * Opens a data window about the row for various purposes
     * @param mode the mode of the window (view|edit|create|duplicate|delete)
     *
     * @param rowdata the data for the row
     */
    datawindow(mode, rowdata) {

        let dialogconfig = {
                actions: [],
                screen: this.screen
            };

        switch(mode) {
            case 'edit':
                dialogconfig.title = TextFactory.get('datagrid-dialog-item-edit', this.elementname);
                dialogconfig.form = new SimpleForm(this.buildForm(rowdata, mode));
                dialogconfig.actions = ['cancelbutton'];
                break;
            case 'create':
                dialogconfig.title = TextFactory.get('datagrid-dialog-item-create', this.elementname);
                dialogconfig.form = new SimpleForm(this.buildForm(rowdata, mode));
                dialogconfig.actions = ['cancelbutton'];
                break;
            case 'duplicate':
                dialogconfig.title = TextFactory.get('datagrid-dialog-item-duplicate', this.elementname);
                if (this.identifier) {
                    delete rowdata[this.identifier];
                }
                dialogconfig.actions = ['cancelbutton'];
                dialogconfig.form = new SimpleForm(this.buildForm(rowdata, mode));
                break;
            case 'delete':
                dialogconfig.title = TextFactory.get('datagrid-dialog-item-delete', this.elementname);
                dialogconfig.actions = ['cancelbutton'];
                dialogconfig.form = new SimpleForm(this.buildForm(rowdata, mode));
                break;
            case 'view':
            default:
                dialogconfig.title = TextFactory.get('datagrid-dialog-item-view', this.elementname);
                dialogconfig.actions = ['closebutton'];
                dialogconfig.form = new SimpleForm(this.buildForm(rowdata, mode));
                break;
        }
        this.dialog = new DialogWindow(dialogconfig);
        this.dialog.open();
    }

    /**
     * Build a form for a data row.
     * @param rowdata the row data
     * @param mode the type of form to create (edit|duplicate|create|delete|view)
     * @return a SimpleForm configuration
     */
    buildForm(rowdata, mode) {
        let form = {
            passive: false,
            elements: [],
            actions: [],
            handler: (self, callback) => {
                let results = {
                    success: false,
                    errors: ['Handler is not defined.']
                };
                callback(results);
            }
        };

        if ((this.formsuccess) && (typeof this.formsuccess === 'function')) {
            form.onsuccess = (self, results) => {
                this.formsuccess(self, results)
            }
        }

        for (let f of this.fields) {
            f.hidden = false; // make them all visible first;
            if (mode === 'edit') {
                if (f.readonly) { f.hidden = true; }
            }

            let e = f.getElement(rowdata[f.name]);
            form.elements.push(e);
        }

        if (this.extraelements) {
            for (let el of this.extraelements) {
                form.elements.push(new HiddenField({
                    name: el.name,
                    value: el.value
                }));
            }
        }

        if (!this.allowedits) { mode = 'view'; } // always true in this

        switch(mode) {
            case 'edit':
                if (this.edititeminstructions) {
                    form.instructions = {
                        icon: this.instructionsicon,
                        instructions: [TextFactory.get(this.edititeminstructions, this.elementname)]
                    }
                }

                form.method = this.updatemethod;

                if ((this.updatecallback) && (typeof this.updatecallback === 'function')) {
                    let ourId = rowdata[this.identifier]
                    form.handlercallback = (self, results, ourId) => {
                        this.updatecallback(self, results, ourId)
                    }
                }

                if ((this.updatehook) && (typeof this.updatehook === 'function')) {
                    form.handler = (self) => {
                        this.updatehook(self);
                    };
                } else if (this.updatehook) {
                    form.handler = this.updatehook;
                }

                form.actions = [
                    new ConstructiveButton({
                        text: TextFactory.get('datagrid-dialog-item-save', this.elementname),
                        icon: "check-circle",
                        submits: true,
                        disabled: true  // No action needed.
                    })
                ];
                break;
            case 'duplicate':
                if (this.duplicateiteminstructions) {
                    form.instructions = {
                        icon: this.instructionsicon,
                        instructions: [TextFactory.get(this.duplicateiteminstructions, this.elementname)]
                    }
                }

                form.method = this.duplicatemethod;

                if ((this.createhook) && (typeof this.createhook === 'function')) {
                    form.handler = (self) => {
                        this.createhook(self);
                    };
                }

                if ((this.createcallback) && (typeof this.createcallback === 'function')) {
                    form.handlercallback = (self, results) => {
                        this.createcallback(self, results)
                    }
                } else if (this.createhook) {
                    form.handler = this.createhook;
                }

                form.actions = [
                    new ConstructiveButton({
                        text: TextFactory.get('datagrid-dialog-item-duplicate', this.elementname),
                        icon: "duplicate",
                        submits: true,
                        disabled: true  // No action needed.
                    })
                ];
                break;
            case 'create':
                if (this.createiteminstructions) {
                    form.instructions = {
                        icon: this.instructionsicon,
                        instructions: [TextFactory.get(this.createiteminstructions, this.elementname)]
                    }
                }

                form.method = this.createmethod;

                if ((this.createhook) && (typeof this.createhook === 'function')) {
                    form.handler = (self) => {
                        this.createhook(self);
                    };
                } else if (this.createhook) {
                    form.handler = this.createhook;
                }

                if ((this.createcallback) && (typeof this.createcallback === 'function')) {
                    form.handlercallback = (self, results) => {
                        this.createcallback(self, results)
                    }
                }

                form.actions = [
                    new ConstructiveButton({
                        text: TextFactory.get('datagrid-dialog-item-create', this.elementname),
                        icon: "plus-circle",
                        submits: true,
                        disabled: true  // No action needed.
                    })
                ];
                break;
            case 'delete':
                if (this.deleteiteminstructions) {
                    form.instructions = {
                        icon: this.instructionsicon,
                        instructions: [TextFactory.get(this.deleteiteminstructions, this.elementname)]
                    }
                }

                form.method = this.deletemethod;

                if ((this.deletehook) && (typeof this.deletehook === 'function')) {
                    form.handler = (self) => {
                        this.deletehook(rowdata, self);
                    };
                } else if (this.deletehook) {
                    form.handler = this.deletehook;
                }

                if ((this.deletecallback) && (typeof this.deletecallback === 'function')) {
                    let ourId = rowdata[this.identifier]
                    form.handlercallback = (self, results, ourId) => {
                        this.deletecallback(self, results, ourId);
                    }
                }

                form.passive = false;
                form.elements = [
                    new HiddenField({
                        name: this.identifier,
                        hidden: true,
                        value: rowdata[this.identifier],
                    })
                ];
                if (this.extraelements) {
                    for (let el of this.extraelements) {
                        form.elements.push(new HiddenField({
                            name: el.name,
                            value: el.value
                        }));
                    }
                }

                form.actions = [
                    new ConstructiveButton({
                        text: [TextFactory.get('datagrid-dialog-item-delete', this.elementname)],
                        icon: "trashcan",
                        submits: true,
                        disabled: false  // No action needed.
                    })
                ];
                break;
            case 'view':
                form.passive = true;
                break;
        }

        return form;
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
                let pcells = previousRow.querySelectorAll("td:not(.mechanical)");
                for (let c of pcells) {
                    c.classList.remove('duplicate'); // clear
                }
                continue;
            }
            let pcells = previousRow.querySelectorAll("td:not(.mechanical)");
            let cells = r.querySelectorAll("td:not(.mechanical)");
            for (let i = 0; i < cells.length; i++) {
                if (!this.getField(cells[i].getAttribute('data-name')).nodupe) {
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
     * Clears data from the grid. Completely flattens it.
     */
    clear() {
        this.data = [];
        this.gridbody.innerHTML = "";
        this.postProcess();
    }

    /**
     * Things to do after the data in the grid has been manipulated, like
     *    - Updates row counts
     *    - Applies sort
     *    - Applies filters
     *    - Applies search
     *    - Grinds duplicate cells
     */
    postProcess() {
        this.updateCount();
        if (this.currentsort) {
            this.sortField(this.currentsort.field, this.currentsort.direction);
        }
        this.applyFilters();
        this.search(this.searchcontrol.value);
        this.grindDuplicateCells();
    }

    activity(show = true) {
        for (let node of this.container.querySelectorAll('div.activity')) {
            if (show) {
                node.removeAttribute('aria-hidden');
            } else {
                node.setAttribute('aria-hidden', 'true');
            }
        }
    }

    /**
     * Load data from a URL and put it into the grid. Appends by default.
     * @param url the URL to get the data from. Defaults to the source url
     * @param callback (optional) do this instead of Appending data. Takes data as an argument
     */
    fetchData(url=this.source, callback) {
        this.activity(true);
        if (this.activitynotifier) {
            this.activitynotifier.removeAttribute('aria-hidden');
        }
        fetch(url, {
            method: this.sourcemethod,
            /*
                XXX TO DO NEED TO ALLOW FOR
                body:
                headers:

             */
            headers: { "Content-Type": "application/json; charset=utf-8" }
        })
            .then(response => response.json()) // response -> json
            .then(data => { // do the thing.
                // Expects data in json format like this:
                // { data: [] }, where each row is a table row.
                if ((this.dataprocessor) && (typeof this.dataprocessor === 'function')) {
                    data = this.dataprocessor(data);
                } else {
                    data = data.data; // by default, a data package assumes its rows are in "data"
                                      // e.g.:  { data: [ row array ] }
                }
                if ((callback) && (typeof callback === 'function')) {
                    callback(data);
                } else {
                    this.update(data);
                }
                this.activity(false);
            })
            .catch(err => {
                console.error(`Error while fetching data from ${url}`);
                console.error(err);
            });
    }

    /**
     * Gets data and merges it in.  Updates entries that have changed and inserts new ones.
     * @param url the url to get data from. Defaults to the source url.
     */
    mergeData(url=this.source) {
        this.fetchData(url, (data) => {
            this.update(data);
        });
    }

    /**
     * Get a specific entry from the data set
     * @param id the id of the entry
     * @return the entry dictionary, or null.
     */
    getEntry(id) {
        if (!this.identifier) { return null; }
        let entry;
        for (let e of this.data) {
            if ((e[this.identifier]) && (e[this.identifier] === id)) {
                entry = e;
                break;
            }
        }
        return entry;
    }

    /**
     * Update multiple rows of data.  Inserts if the value isn't there.
     * @param data an array of entry informations
     */
    update(data) {
        //if (!this.data) { this.data = []; }
        this.data = [];
        this.gridbody.innerHTML = '';
        for (let entry of data) { // incoming data
            //this.addEntry(entry); // We can only append
            if (this.identifier) {
                let id = entry[this.identifier];
                let old = this.getEntry(id);
                if (old) {
                    this.updateEntry(entry); // Update the old row
                } else {
                    this.addEntry(entry); // This is a new row, so we append.
                }
            } else {
                this.addEntry(entry); // We can only append
            }
        }
        this.postProcess();
    }

    replace(data) {
        this.data = [];
        this.update(data);
    }

    /**
     * Update a single entry in the data
     * @param entry the entry to update.  MUST contain an identifier field.
     */
    updateEntry(entry) {
        let id = entry[this.identifier];
        let rowDOM = this.gridbody.querySelector(`[data-rowid=${this.id}-r-${id}]`);
        for (let e of this.data) {
            if ((e[this.identifier]) && (e[this.identifier] === id)) {
                for (let k in entry) {
                    e[k] = entry[k];
                }
                break;
            }
        }

        for (let key in entry) {
            let f = this.getField(key);
            if (!f) { continue; } // Sometimes we get keys we don't want to display
            if (key === this.identifier) { continue; }
            let oldCell = rowDOM.querySelector(`[data-name=${key}`);
            let c = this.buildCell(entry, this.getField(key));
            rowDOM.replaceChild(c, oldCell);
        }
        rowDOM.classList.add('updated');
        window.setTimeout(() => {
            rowDOM.classList.remove('updated');
        }, 10000);
    }

    /**
     * Add an entry into the data
     * @param entry the entry to add.
     */
    addEntry(entry) {
        this.gridbody.appendChild(this.buildRow(entry));
        this.data.push(entry);
    }

    /**
     * Delete a row from the grid.
     * @param rowid
     */
    deleteRow(rowid) {

        let index = 0;
        for (let d of this.data) {
            if ((d.rowid) && (d.rowid === rowid)) { break; }
            index++;
        }
        this.data.splice(index, 1);

        this.gridbody.removeChild(this.gridbody.querySelector(`[data-rowid='${rowid}'`));

        this.postProcess();
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
        for (let f of this.fields) {
            if (!f.hidden) {
                colsvisible = true;
                break;
            }
        }
        if (!colsvisible) {
            this.messagebox.innerHTML = "";
            this.messagebox.appendChild(new MessageBox({
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
     * Apply the saved state to the grid
     */
    applystate() {
        if (!this.state) { return; }
        if (this.state.fields) {
            for (let f of Object.values(this.state.fields)) {
                if (f.hidden) {
                    this.hideColumn(this.getField(f.name));
                } else {
                    this.showColumn(this.getField(f.name));
                }
            }
        }
        if (this.state.filters) {
            this.activefilters = this.state.filters;
        }
        this.applyFilters();
        super.applystate();
    }

    /**
     * Figures out the state of the grid and generates the state object
     */
    grindstate() {

        let state = {
            minimized: false,
            fields: {},
            filters: [],
            sort: this.defaultsort,
            search: null
        };

        for (let f of this.fields) {
            if (f.hidden === undefined) { f.hidden = false; }
            state.fields[f.name] = {
                name: f.name,
                hidden: f.hidden
            };
        }
        if (this.activefilters) {
            for (let f of this.activefilters) {
                state.filters.push({
                    filterid: f.filterid,
                    field: f.field,
                    comparator: f.comparator,
                    value: f.value
                });
            }
        }
        return state;
    }

    /* FILTER METHODS___________________________________________________________________ */

    /**
     * Remove a filter from the active filter list
     * @param f the filter to drop
     */
    removeFilter(f) {
        let filters = [];
        for (let af of this.activefilters) {
            if (af.filterid === f.filterid) {
                continue;
            }
            filters.push(af);
        }
        this.activefilters = filters;
        this.persist();
        this.applyFilters();
    }

    /**
     * Apply all filters
     */
    applyFilters() {
        if (!this.filterable) return;
        if (!this.filtertags) return;

        let rows = Array.from(this.gridbody.childNodes);

        this.filtertags.innerHTML = '';

        if ((this.activefilters) && (Object.values(this.activefilters).length > 0)) {
            this.filterinfo.setAttribute('aria-expanded', true);
            for (let f of this.activefilters) {
                f.tagbutton = new TagButton({
                    text: this.getField(f.field).label,
                    tooltip: `${this.getField(f.field).label} ${GridField.getComparatorLabel(f.comparator)} ${f.value}`,
                    action: () => {
                        this.removeFilter(f);
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
            if ((this.activefilters) && (this.activefilters.length > 0)) {
                let matchedfilters = [];

                for (let filter of this.activefilters) {
                    let field = this.getField(filter.field),
                        matches = false,
                        c = r.querySelector(`[data-name='${filter.field}']`);

                    matches = this.testFilter(field, filter, c.innerHTML);

                    if (matches) {
                        matchedfilters.push(filter.field);
                    } else {
                        r.classList.add('filtered');
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
            this.messagebox.appendChild(new MessageBox({
                warningstitle: this.allfilteredtitle,
                warnings: [this.allfilteredtext],
                classes: ['hidden']
            }).container);
            this.messagebox.classList.remove('hidden');
        } else {
            this.messagebox.classList.add('hidden');
        }
    }

    /**
     * Test a value against a field's filters
     * @param field the field definition
     * @param filter the filter definition
     * @param testVal the value to test
     * @return {boolean} true if it matches the filter, false if not.
     */
    testFilter(field, filter, testVal) {
        let matches,
            filterVal = filter.value;

        switch (field.type) {
            case 'date':
            case 'time':
                testVal = new Date(testVal);
                filterVal = new Date(filterVal);

                switch(filter.comparator) {
                    case 'isbefore':
                        matches = (testVal.getTime() < filterVal.getTime());
                        break;
                    case 'isafter':
                        matches = (testVal.getTime() > filterVal.getTime());
                        break;
                    case 'doesnotequal':
                        matches = (testVal.getTime() !== filterVal.getTime());
                        break;
                    case 'equals':
                    default:
                        matches = (testVal.getTime() === filterVal.getTime());
                        break;
                }

                break;
            case 'number':
                testVal = parseInt(testVal);
                filterVal = parseInt(filterVal);
                switch(filter.comparator) {
                    case 'isgreaterthan':
                        matches = (testVal > filterVal);
                        break;
                    case 'islessthan':
                        matches = (testVal < filterVal);
                        break;
                    case 'doesnotequal':
                        matches = (testVal !== filterVal);
                        break;
                    case 'equals':
                    default:
                        matches = (testVal === filterVal);
                        break;
                }
                break;
            case 'boolean':
                switch(filter.comparator) {
                    case 'equals':
                        matches = (testVal === filterVal);
                        break;
                    case 'doesnotequal':
                        matches = (testVal !== filterVal);
                        break;
                }
                break;
            default: // all the others can use raw test comparators
                testVal = testVal.toLowerCase();
                filterVal = filterVal.toLowerCase();
                switch(filter.comparator) {
                    case 'equals':
                        matches = (testVal === filterVal);
                        break;
                    case 'doesnotequal':
                        matches = (testVal !== filterVal);
                        break;
                    case 'startswith':
                        matches = (testVal.startsWith(filterVal));
                        break;
                    case 'endswith':
                        matches = (testVal.endsWith(filterVal));
                        break;
                    case 'notcontains':
                        matches = (testVal.toLowerCase().indexOf(filterVal.toLowerCase()) === -1);
                        break;
                    case 'contains':
                    default:
                        matches = (testVal.toLowerCase().indexOf(filterVal.toLowerCase()) !== -1);
                        break;

                }
                break;
        }
        return matches;
    }

    /* SELECTION METHODS________________________________________________________________ */

    /**
     * Select a row.  This method also handles shift+click selection.
     * @param row the row to select
     * @param event (optional) the click event
     * @param rdata the data from the row
     */
    select(row, event, rdata) {

        if (row.getAttribute('aria-selected') === 'true') {
            this.deselect(row);
            if ((this.deselectaction) && (typeof this.deselectaction === 'function')) {
                this.deselectaction(this, row, rdata);
            }
            return;
        }

        let deselectOthers = true;
        let othersSelected = false;

        if (this.multiselecting) {
            deselectOthers = false;
        } else if ((this.multiselect) && (event) && (event.type === 'click') && ((event.shiftKey) || (event.metaKey))) {
            deselectOthers = false;
        }

        let sels = this.gridbody.querySelectorAll("[aria-selected='true']");

        if ((sels) && (sels.length > 0)) {
            othersSelected = true;
        }

        if (deselectOthers) {
            othersSelected = false;
            for (let r of sels) {
                this.deselect(r);
            }
        }

        if ((event) && (event.shiftKey) && (othersSelected)) {
            // Here there be wyverns, which are much smaller than dragons.
            // This isn't difficult; just tedious and you can get lost in the logic.
            //     - We don't want to do this unless there's already one selected.
            //     - We walk from the top until we find a selected row or ourselves.
            //     - If we find either, that's where we start collecting.
            //     - If the first found row was ourselves:
            //         - Collect until we find a selected row
            //         - Break
            //     - If the first found row was not ourselves:
            //         - Collect until we find ourselves and break - OR -
            //         - If we find another selected row, we:
            //             - Discard all collected ones
            //             - Start collecting again.
            let toBeSelected = [];
            let gathering = false;
            let foundSelf = false;

            let allrows = this.gridbody.querySelectorAll('tr');
            for (let r of allrows) {
                if (r.getAttribute('data-rowid') === row.getAttribute('data-rowid')) {
                    foundSelf = true;
                    if (gathering) {
                        break; // We're done here.
                    }
                    toBeSelected = []; // Reset and start gathering
                    gathering = true;
                } else if (r.getAttribute('aria-selected') === 'true') {
                    if ((gathering) && (foundSelf)) {
                        break; // We're done here.
                    }
                    if (gathering) {
                        toBeSelected = []; // Reset
                    } else {
                        gathering = true;
                    }
                } else if (gathering) {
                    toBeSelected.push(r); // Add it to the pile.
                }
            }

            for (let r of toBeSelected) {
                r.setAttribute('aria-selected', 'true');
                r.querySelector('input.selector').checked = true;
            }
            row.setAttribute('aria-selected', 'true');
            row.querySelector('input.selector').checked = true;
        } else {

            row.setAttribute('aria-selected', 'true');
            row.querySelector('input.selector').checked = true;

            if ((this.selectaction) && (typeof this.selectaction === 'function')) {
                this.selectaction(this, row, rdata);
            }
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
        this.container = document.createElement('div');
        this.container.classList.add('datagrid-container');
        this.container.classList.add('panel');
        this.container.setAttribute('id', this.id);
        this.container.setAttribute('aria-expanded', 'true');

        if (this.title) {
            this.container.appendChild(this.header);
        }

        this.container.appendChild(this.datainfo);

        if (this.filterable) {
            this.container.appendChild(this.filterinfo);
        }

        this.grid.appendChild(this.thead);
        this.grid.appendChild(this.gridbody);

        this.gridwrapper = document.createElement('div');
        this.gridwrapper.classList.add('grid-wrapper');
        this.gridwrapper.appendChild(this.shade.container);
        this.gridwrapper.appendChild(this.grid);
        this.container.appendChild(this.gridwrapper);

        if (this.showfooter) {
            this.container.appendChild(this.footer);
        }

        this.gridwrapper.onscroll = () => {
            if (this.gridwrapper.scrollLeft > 0) {
                this.grid.classList.add('schoriz');
            } else {
                this.grid.classList.remove('schoriz');
            }
            if (this.gridwrapper.scrollTop > 0) {
                this.grid.classList.add('scvert');
            } else {
                this.grid.classList.remove('scvert');
            }
        };

        this.messagebox = document.createElement('div');
        this.messagebox.classList.add('messages');
        this.messagebox.classList.add('hidden');
        this.gridwrapper.appendChild(this.messagebox);

        if (this.minimized) { // don't call close() to avoid the callbacks.
            this.container.setAttribute('aria-expanded', 'false');
            this.minimized = true;
        }

        if (this.hidden) { this.hide(); }

        // FINALLY, we
        this.updateCount();

    }

    /**
     * Build the form shade
     */
    buildShade() {
        this.shade = new LoadingShade({
            spinnertext: this.spinnertext,
            spinnerstyle: this.spinnerstyle
        });
    }

    /**
     * Build the grid filters bit
     */
    buildFilterInfo() {

        this.filterinfo = document.createElement('div');
        this.filterinfo.classList.add('grid-filterinfo');

        let label = document.createElement('label');
        label.innerHTML = TextFactory.get('filters');
        this.filterinfo.appendChild(label);

        this.filtertags = document.createElement('div');
        this.filtertags.classList.add('grid-filtertags');

        this.filterinfo.appendChild(this.filtertags);
    }

    /**
     * Update the count of elements in the data grid.
     */
    updateCount() {
        let empty = true;
        if (this.data) {
            for (let node of this.container.querySelectorAll('span.itemcount')) {
                node.innerHTML = this.data.length;
            }
            if (this.data.length > 0) { empty = false; }
        }
        if (empty) {
            if (this.messagebox) {
                this.messagebox.innerHTML = "";
                let warnings = [TextFactory.get('datagrid-message-empty_grid')];
                let mb = new WarningBox({
                    title: null,
                    warnings: warnings,
                    classes: ['hidden']
                });
                this.messagebox.appendChild(mb.container);
                this.messagebox.classList.remove('hidden');
            }
            this.gridwrapper.classList.add('hidden');
        } else {
            if (this.messagebox) {
                this.messagebox.innerHTML = "";
                this.messagebox.classList.add('hidden');
            }
            this.gridwrapper.classList.remove('hidden');
        }
    }

    buildItemCounter() {
        let box = document.createElement('div');
        box.classList.add('countbox');
        box.innerHTML = `<label>${TextFactory.get('items_label')}</label> <span class="itemcount"></span>`;
        return box;
    }

    buildActivityNotifier() {
        let activitynotifier = document.createElement('div');
        activitynotifier.classList.add('activity');
        activitynotifier.setAttribute('aria-hidden', 'true');
        if (this.activitynotifiericon) {
            activitynotifier.appendChild(IconFactory.icon(this.activitynotifiericon));
        }
        if (this.activitynotifiertext) {
            let s = document.createElement('span');
            s.innerHTML = this.activitynotifiertext;
            activitynotifier.appendChild(s);
        }
        return activitynotifier;
    }

    /**
     * Build the data info bit
     */
    buildDataInfo() {
        this.datainfo = document.createElement('div');
        this.datainfo.classList.add('datainfo');

        this.datainfo.appendChild(this.buildItemCounter());
        this.datainfo.appendChild(this.buildActivityNotifier());

        if (this.searchable) {
            this.searchcontrol = new SearchControl({
                arialabel: TextFactory.get('search_this_data'),
                placeholder: TextFactory.get('search_this_data'),
                mute: this.mute,
                searchtext: TextFactory.get('search'),
                action: (value) => {
                    this.search(value);
                }
            });
            this.datainfo.appendChild(this.searchcontrol.container);
        }

        if (this.filterable) {
            this.filterbutton  = new SimpleButton({
                mute: true,
                text: TextFactory.get('filters'),
                icon: this.filterbuttonicon,
                tooltip: TextFactory.get('datagrid-tooltip-filters'),
                classes: ['filter'],
                action: () => {
                    this.configurator('filter');
                }
            });
            this.datainfo.appendChild(this.filterbutton.button);
        }

        let items = [];

        if ((this.selectable) && (this.multiselect)) {
            items.push({
                label: TextFactory.get('bulk_select'),
                tooltip: TextFactory.get('datagrid-tooltip-bulk_select'),
                icon: this.multiselecticon,
                action: () => {
                    this.selectmodetoggle();
                }
            });
        }
        items.push({
            label: TextFactory.get('columns'),
            icon: this.columnconfigurationicon,
            tooltip: TextFactory.get('datagrid-tooltip-configure_columns'),
            action: () => {
                this.configurator('column');
            }
        });
        if (this.exportable) {
            items.push({
                label: TextFactory.get('export'),
                tooltip: TextFactory.get('datagrid-tooltip-export'),
                icon: this.exporticon,
                action: () => {
                    this.export();
                }
            });
            items.push({
                label: TextFactory.get('export-current_view'),
                tooltip: TextFactory.get('datagrid-tooltip-export-current_view'),
                icon: this.exporticon,
                action: () => {
                    this.export(true);
                }
            });
        }

        this.actionsbutton  = new ButtonMenu({
            mute: true,
            shape: 'square',
            secondicon: null,
            tooltipgravity: 'w',
            text: TextFactory.get('actions'),
            icon: this.actionsbuttonicon,
            classes: ['actions'],
            items: items
        });

        this.datainfo.appendChild(this.actionsbutton.button);
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

        if (this.multiselect) {
            this.masterselector = new BooleanToggle({
                onchange: (self)  =>{
                    this.toggleallselect(self.checked);
                }
            });
            let cell = document.createElement('th');
            cell.classList.add('selector');
            cell.classList.add('mechanical');
            cell.appendChild(this.masterselector.naked);
            this.gridheader.appendChild(cell);
        }

        if ((this.rowactions) && (this.rowactions.length > 0)) {
            let cell = document.createElement('th');
            cell.classList.add('actions');
            cell.classList.add('mechanical');
            cell.innerHTML = "";
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
            new ToolTip({
                text: field.description
            }).attach(div);
        }

        if (this.sortable) {
            // XXX Add "sort this" aria label
            cell.setAttribute('tabindex', '0');
            cell.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglesort(field.name);
            });
            cell.addEventListener('keyup', (e) => {
                e.preventDefault();
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        this.togglesort(field.name);
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
        let row = document.createElement('tr');

        if (this.identifier) {
            row.setAttribute('data-id', rdata[this.identifier]);
        }

        if (this.selectable) {

            row.setAttribute('tabindex', '0');

            if (this.identifier) {
                row.setAttribute('data-rowid', `${this.id}-r-${rdata[this.identifier]}`);
            } else {
                row.setAttribute('data-rowid', `row-${CFBUtils.getUniqueKey(5)}`);
            }
            rdata.rowid = row.getAttribute('data-rowid'); // pop this into the row data.

            row.addEventListener('click', (e) => {

                if (e.target.classList.contains('mechanical')) { return; }

                if (e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getSelection().removeAllRanges(); // remove cursor selection
                }
                if (this.selectable) {
                    this.select(row, e, rdata);
                }
            });

            row.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        let previous = row.parentNode.rows[row.rowIndex - 2];
                        if (previous) { previous.focus(); }
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        let next = row.parentNode.rows[row.rowIndex];
                        if (next) { next.focus(); }
                        break;
                    case 'Enter':
                    case ' ':
                        row.click()
                        break;
                    default:
                        break;
                }
            });
        }

        if (this.multiselect) {
            let selector = new BooleanToggle({
                classes: ['selector'],
                onchange: (toggle) => {
                    if (toggle.checked) {
                        row.setAttribute('aria-selected', 'true');
                    } else {
                        row.removeAttribute('aria-selected');
                    }
                }
            });
            let cell = document.createElement('td');
            cell.classList.add('selector');
            cell.classList.add('mechanical');
            cell.appendChild(selector.naked);
            row.appendChild(cell);
        }

        row.addEventListener('dblclick', (e, self) => {
            if ((this.doubleclick) && (typeof this.doubleclick === 'function')) {
                this.doubleclick(e, self);
            } else {
                this.datawindow('view', rdata);
            }
        });

        if ((this.mouseover) && (typeof this.mouseover === 'function')) {
            row.addEventListener('mouseover', (e) => {
                if ((this.mouseover) && (typeof this.mouseover === 'function')) {
                    this.mouseover(rdata, this, e);
                }
            });
        }

        if ((this.mouseout) && (typeof this.mouseout === 'function')) {
            row.addEventListener('mouseout', (e) => {
                if ((this.mouseout) && (typeof this.mouseout === 'function')) {
                    this.mouseout(rdata, this, e);
                }
            });
        }

        if ((this.rowactions) && (this.rowactions.length > 0)) {

            let cell = document.createElement('td');
            cell.classList.add('actions');
            cell.classList.add('mechanical');

            /*
                        //    label: "Menu Text", // text
                        //    tooltip: null, // Tooltip text
                        //    tipicon: null, // Tooltip icon, if any
                        //    icon: null, // Icon to use in the menu, if any
                        //    action: () => { } // what to do when the tab is clicked.
                        // }
             */
            let rowactions = [];

            for (let ra of this.rowactions) {
                let myaction = {
                    label: ra.label,
                    toolip: ra.tooltip,
                    icon: ra.icon,
                    tipicon: ra.tipicon
                };
                switch(ra.type) {
                    case 'edit':
                        myaction.action = () => {
                            this.datawindow('edit', rdata);
                        };
                        break;
                    case 'delete':
                        myaction.action = () => {
                            this.datawindow('delete', rdata);
                        };
                        break;
                    case 'duplicate':
                        myaction.action = () => {
                            this.datawindow('duplicate', rdata);
                        };
                        break;
                    case 'function':
                        myaction.action = () => {
                            ra.action(rdata);
                        }
                        break;
                    case 'view':
                    default:
                        break;
                }

                rowactions.push(myaction);
            }

            cell.appendChild(new ButtonMenu({
                mute: true,
                shape: 'square',
                data: rdata,
                secondicon: null,
                gravity: 'east',
                text: TextFactory.get('actions'),
                icon: this.rowactionsicon,
                classes: ['actions'],
                items: rowactions
            }).button);
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
     * @param field the GridField object
     * @return {HTMLTableDataCellElement}
     */
    buildCell(data, field) {
        let content;
        let d = data[field.name];

        content = field.renderer(d, data);

        let cell = document.createElement('td');
        cell.setAttribute('data-name', field.name);
        cell.setAttribute('data-datatype', field.type);
        if (field.type === 'date') {
            cell.setAttribute('data-millis', new Date(d).getTime());
            if (d === null) {
                content = "";
            }
        }
        cell.classList.add(field.name);
        cell.classList.add(field.type);
        if (typeof content === 'string') {
            content = document.createTextNode(content);
        }
        cell.appendChild(content);

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
        this.footer.appendChild(this.buildItemCounter());
        this.footer.appendChild(this.buildActivityNotifier());
        this.footer.classList.add('footer');
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get actionsbutton() { return this._actionsbutton; }
    set actionsbutton(actionsbutton) { this._actionsbutton = actionsbutton; }

    get actionsbuttonicon() { return this.config.actionsbuttonicon; }
    set actionsbuttonicon(actionsbuttonicon) { this.config.actionsbuttonicon = actionsbuttonicon; }

    get activefilters() { return this._activefilters; }
    set activefilters(activefilters) { this._activefilters = activefilters; }

    get activitynotifiericon() { return this.config.activitynotifiericon; }
    set activitynotifiericon(activitynotifiericon) { this.config.activitynotifiericon = activitynotifiericon; }

    get activitynotifiertext() { return this.config.activitynotifiertext; }
    set activitynotifiertext(activitynotifiertext) { this.config.activitynotifiertext = activitynotifiertext; }

    get allowedits() { return this.config.allowedits; }
    set allowedits(allowedits) { this.config.allowedits = allowedits; }

    get columnconfigbutton() { return this._columnconfigbutton; }
    set columnconfigbutton(columnconfigbutton) { this._columnconfigbutton = columnconfigbutton; }

    get columnconfigurationicon() { return this.config.columnconfigurationicon; }
    set columnconfigurationicon(columnconfigurationicon) { this.config.columnconfigurationicon = columnconfigurationicon; }

    get createmethod() { return this.config.createmethod; }
    set createmethod(createmethod) { this.config.createmethod = createmethod; }

    get createcallback() { return this.config.createcallback; }
    set createcallback(createcallback) {
        if (typeof createcallback !== 'function') {
            console.error("Value provided to createcallback is not a function!");
        }
        this.config.createcallback = createcallback;
    }

    get createhook() { return this.config.createhook; }
    set createhook(createhook) {
        if (typeof createhook !== 'function') {
            console.error("Value provided to createhook is not a function!");
        }
        this.config.createhook = createhook;
    }

    get createiteminstructions() { return this.config.createiteminstructions; }
    set createiteminstructions(createiteminstructions) { this.config.createiteminstructions = createiteminstructions; }

    get currentsort() { return this._currentsort; }
    set currentsort(currentsort) { this._currentsort = currentsort; }

    get deleteiteminstructions() { return this.config.deleteiteminstructions; }
    set deleteiteminstructions(deleteiteminstructions) { this.config.deleteiteminstructions = deleteiteminstructions; }

    get deletemethod() { return this.config.deletemethod; }
    set deletemethod(deletemethod) { this.config.deletemethod = deletemethod; }

    get duplicatemethod() { return this.config.duplicatemethod; }
    set duplicatemethod(duplicatemethod) { this.config.duplicatemethod = duplicatemethod; }

    get duplicatehook() { return this.config.duplicatehook; }
    set duplicatehook(duplicatehook) {
        if (typeof duplicatehook !== 'function') {
            console.error("Value provided to duplicatehook is not a function!");
        }
        this.config.duplicatehook = duplicatehook;
    }

    get duplicateiteminstructions() { return this.config.duplicateiteminstructions; }
    set duplicateiteminstructions(duplicateiteminstructions) { this.config.duplicateiteminstructions = duplicateiteminstructions; }

    get data() { return this.config.data; }
    set data(data) { this.config.data = data; }

    get datainfo() {
        if (!this._datainfo) { this.buildDataInfo(); }
        return this._datainfo;
    }
    set datainfo(datainfo) { this._datainfo = datainfo; }

    get dataprocessor() { return this.config.dataprocessor; }
    set dataprocessor(dataprocessor) { this.config.dataprocessor = dataprocessor; }

    get defaultsort() { return this.config.defaultsort; }
    set defaultsort(defaultsort) { this.config.defaultsort = defaultsort; }

    get deletehook() { return this.config.deletehook; }
    set deletehook(deletehook) {
        if (typeof deletehook !== 'function') {
            console.error("Value provided to deletehook is not a function!");
        }
        this.config.deletehook = deletehook;
    }

    get deletecallback() { return this.config.deletecallback; }
    set deletecallback(deletecallback) {
        if (typeof deletecallback !== 'function') {
            console.error("Value provided to deletecallback is not a function!");
        }
        this.config.deletecallback = deletecallback;
    }

    get demphasizeduplicates() { return this.config.demphasizeduplicates; }
    set demphasizeduplicates(demphasizeduplicates) { this.config.demphasizeduplicates = demphasizeduplicates; }

    get deselectaction() { return this.config.deselectaction; }
    set deselectaction(deselectaction) {
        if (typeof deselectaction !== 'function') {
            console.error("Value provided to deselectaction is not a function!");
        }
        this.config.deselectaction = deselectaction;
    }

    get dialog() { return this._dialog; }
    set dialog(dialog) { this._dialog = dialog; }

    get doubleclick() { return this.config.doubleclick; }
    set doubleclick(doubleclick) {
        if (typeof doubleclick !== 'function') {
            console.error("Value provided to doubleclick is not a function!");
        }
        this.config.doubleclick = doubleclick;
    }

    get edititeminstructions() { return this.config.edititeminstructions; }
    set edititeminstructions(edititeminstructions) { this.config.edititeminstructions = edititeminstructions; }

    get elementname() { return this.config.elementname; }
    set elementname(elementname) { this.config.elementname = elementname; }

    get extraelements() { return this.config.extraelements; }
    set extraelements(extraelements) { this.config.extraelements = extraelements; }

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

    get formsuccess() { return this.config.formsuccess; }
    set formsuccess(formsuccess) {
        if (typeof formsuccess !== 'function') {
            console.error("Value provided to formsuccess is not a function!");
        }
        this.config.formsuccess = formsuccess;
    }

    get grid() {
        if (!this._grid) { this.buildGrid(); }
        return this._grid;
    }
    set grid(grid) { this._grid = grid; }

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

    get identifier() { return this._identifier; }
    set identifier(identifier) { this._identifier = identifier; }

    get instructionsicon() { return this.config.instructionsicon; }
    set instructionsicon(instructionsicon) { this.config.instructionsicon = instructionsicon; }

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

    get mouseover() { return this.config.mouseover; }
    set mouseover(mouseover) {
        if (typeof mouseover !== 'function') {
            console.error("Value provided to mouseover is not a function!");
        }
        this.config.mouseover = mouseover;
    }

    get mouseout() { return this.config.mouseout; }
    set mouseout(mouseout) {
        if (typeof mouseout !== 'function') {
            console.error("Value provided to mouseout is not a function!");
        }
        this.config.mouseout = mouseout;
    }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get passiveeditinstructions() { return this.config.passiveeditinstructions; }
    set passiveeditinstructions(passiveeditinstructions) { this.config.passiveeditinstructions = passiveeditinstructions; }

    get rowactions() { return this.config.rowactions; }
    set rowactions(rowactions) { this.config.rowactions = rowactions; }

    get rowactionsicon() { return this.config.rowactionsicon; }
    set rowactionsicon(rowactionsicon) { this.config.rowactionsicon = rowactionsicon; }

    get screen() { return this.config.screen; }
    set screen(screen) { this.config.screen = screen; }

    get searchable() { return this.config.searchable; }
    set searchable(searchable) { this.config.searchable = searchable; }

    get searchcontrol() { return this._searchcontrol; }
    set searchcontrol(searchcontrol) { this._searchcontrol = searchcontrol; }

    get selectable() { return this.config.selectable; }
    set selectable(selectable) { this.config.selectable = selectable; }

    get selectaction() { return this.config.selectaction; }
    set selectaction(selectaction) {
        if (typeof selectaction !== 'function') {
            console.error("Value provided to selectaction is not a function!");
        }
        this.config.selectaction = selectaction;
    }

    get shade() {
        if (!this._shade) { this.buildShade(); }
        return this._shade;
    }
    set shade(shade) { this._shade = shade; }

    get showfooter() { return this.config.showfooter; }
    set showfooter(showfooter) { this.config.showfooter = showfooter; }

    get sortable() { return this.config.sortable; }
    set sortable(sortable) { this.config.sortable = sortable; }

    get source() { return this.config.source; }
    set source(source) { this.config.source = source; }

    get sourcemethod() { return this.config.sourcemethod; }
    set sourcemethod(sourcemethod) { this.config.sourcemethod = sourcemethod; }

    get sorticon() { return this.config.sorticon; }
    set sorticon(sorticon) { this.config.sorticon = sorticon; }

    get spinnerstyle() { return this.config.spinnerstyle; }
    set spinnerstyle(spinnerstyle) { this.config.spinnerstyle = spinnerstyle; }

    get spinnertext() { return this.config.spinnertext; }
    set spinnertext(spinnertext) { this.config.spinnertext = spinnertext; }

    get thead() {
        if (!this._thead) { this.buildTableHead(); }
        return this._thead;
    }
    set thead(thead) { this._thead = thead; }

    get updatecallback() { return this.config.updatecallback; }
    set updatecallback(updatecallback) {
        if (typeof updatecallback !== 'function') {
            console.error("Value provided to updatecallback is not a function!");
        }
        this.config.updatecallback = updatecallback;
    }

    get updatehook() { return this.config.updatehook; }
    set updatehook(updatehook) {
        if (typeof updatehook !== 'function') {
            console.error("Value provided to updatehook is not a function!");
        }
        this.config.updatehook = updatehook;
    }

    get updatemethod() { return this.config.updatemethod; }
    set updatemethod(updatemethod) { this.config.updatemethod = updatemethod; }

    get warehouse() { return this.config.warehouse; }
    set warehouse(warehouse) { this.config.warehouse = warehouse; }

}
window.DataGrid = DataGrid;