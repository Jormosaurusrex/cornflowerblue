class DataList extends DataGrid {

    static get DEFAULT_CONFIG() {
        return {
            statesaveprefix: 'datalist',
            noentriestext: TextFactory.get('datalist-noentries'),
            specialsort: null,
            columnconfigurable: false,
            collapsible: false,
            astable: false,
            exportable: false,
            startsort: 'title',
            startsortdirection: 'asc',
            filterable: false,
            multiselect: false,
            loadcallback: null,
            onpostload: null,
            drawitem: (itemdef, self) => {

            },
            click: (item, self, e) => {

            },
            mouseover: (item, self, e) => {

            },
            mouseout: (item, self, e) => {

            },
            doubleclick: null, // Action to take on double click. Passed (e, self); defaults to opening a view
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, DataList.DEFAULT_CONFIG, config);

        if (!config.id) { // need to generate an id for label stuff
            config.id = `datalist-${CFBUtils.getUniqueKey(5)}`;
        }

        super(config);
    }

    get displaytype() { return 'datalist'; }
    get gridwrapper() { return this.datalist; }
    get gridbody() { return this.datalist; }

    finalize() {
        this.shade.activate();
    }

    fillData() {
        this.activity(true);
        if (this.warehouse) {
            this.warehouse.load((data) => {
                this.update(data);
                this.postLoad();
                //this.shade.deactivate();
                this.activity(false);
            });
        } else if (this.source) {
            this.fetchData(this.source, (data) => {
                this.update(data);
                this.postLoad();
                this.shade.deactivate();
                this.activity(false);
            });
        } else if (this.data) {
            this.populate();
            this.activity(false);
        }
    }

    setHeaderState(column = 'name', direction = 'asc') {
        let headeritem = this.listheader.querySelector(`[data-column='${column}']`);
        if (this.astable) {
            for (let h of this.listheader.querySelectorAll('th')) {
                h.removeAttribute('data-sorted');
            }
        } else {
            for (let h of this.listheader.querySelectorAll('div.label')) {
                h.removeAttribute('data-sorted');
            }
        }
        this.listheader.setAttribute('data-sort-field', column);
        this.listheader.setAttribute('data-sort-direction', direction);

        if (headeritem) {
            headeritem.setAttribute('data-sorted', direction);
        }
    }

    grindstate() {

        let state = {
            minimized: false,
            fields: {},
            filters: [],
            selected: this.selectedrow,
            search: null
        };
        if ((this.state) && (this.state.sort)) {
            state.sort = this.state.sort;
        } else {
            state.sort = this.defaultsort;
        }

/*
        for (let f of this.fields) {
            if (f.hidden === undefined) { f.hidden = false; }
            state.fields[f.name] = {
                name: f.name,
                hidden: f.hidden
            };
        }

        for (let f of this.activefilters) {
            state.filters.push({
                filterid: f.filterid,
                field: f.field,
                comparator: f.comparator,
                value: f.value
            });
        }
*/
        return state;
    }

    update(data) {
        this.data = [];
        if (data) {
            for (let entry of data) {
                this.data.push(entry);
            }
        }
        this.populate(this.state.sort.column, this.state.sort.direction);
        if ((this.loadcallback) && (typeof this.loadcallback === 'function')) {
            this.loadcallback();
        }
        this.postLoad();
    }

    postLoad() {
        this.applystate();
        if ((this.onpostload) && (typeof this.onpostload === 'function')) {
            this.onpostload(this);
        }
    }

    populate(sort= (this.startsort) ? this.startsort : 'title', direction = (this.startsortdirection) ? this.startsortdirection : 'asc') {
        let order = 1,
            items = this.sortOn(this.data, sort, direction);

        this.datalist.innerHTML = '';

        if (items.length === 0) {
            let li = document.createElement('li');
            li.classList.add('noentriestext');
            li.innerHTML = `<div class="noentries">${this.noentriestext}</div>`;
            this.datalist.appendChild(li);
            return;
        }

        this.setHeaderState(sort, direction);

        for (let item of items) {
            let next = order + 1,
                previous = order - 1;
            if (previous < 1) { previous = 1; }
            if (next > items.length) { next = items.length; }

            let li = this.drawitem(item);
            if (li === null) {
                continue;
            }
            if (item['id']) {
                li.setAttribute('data-item-id', item['id']);
                li.setAttribute('data-id', item['id']);
            }

            if ((this.click) && (typeof this.click === 'function')) {
                li.classList.add('clickable');
                li.setAttribute('tabindex', '0');
                li.addEventListener('click', (e) => {
                    if (this.selectable) {
                        this.select(li, e, item);
                    }
                    if ((this.click) && (typeof this.click === 'function')) {
                        this.click(item, this, e);
                    }
                });
            } else if ((this.selectable) && (this.selectaction) && (typeof this.selectaction === 'function')) {
                li.classList.add('clickable');
                li.setAttribute('tabindex', '0');
                li.addEventListener('click', (e) => {
                    this.select(li, e, item);
                    li.setAttribute('aria-selected', 'true');
                    if ((this.selectaction) && (typeof this.selectaction === 'function')) {
                        this.selectaction(this, li, rdata);
                    }
                });
            }

            if ((this.mouseover) && (typeof this.mouseover === 'function')) {
                li.addEventListener('mouseover', (e) => {
                    if ((this.mouseover) && (typeof this.mouseover === 'function')) {
                        this.mouseover(item, this, e);
                    }
                });
            }

            if ((this.mouseout) && (typeof this.mouseout === 'function')) {
                li.addEventListener('mouseout', (e) => {
                    if ((this.mouseout) && (typeof this.mouseout === 'function')) {
                        this.mouseout(item, this, e);
                    }
                });
            }

            li.addEventListener('keyup', (e) => {
                switch (e.key) {
                    case 'Escape':
                        this.close();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        let p = this.datalist.querySelector(`[data-order='${previous}']`);
                        if (p) { p.focus(); }
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        let n = this.datalist.querySelector(`[data-order='${next}']`);
                        if (n) { n.focus(); }
                        break;
                    case 'Enter': // Enter
                    case ' ': // Space
                        li.click(); // click the one inside
                        break;
                }
            });

            this.datalist.appendChild(li);
            order++;
        }
        this.postProcess();
    }

    sortOn(listelements, column='name', direction = 'asc') {
        if ((this.specialsort) && (typeof this.specialsort === 'function')) {
            return this.specialsort(listelements, column, direction, this);
        }
        let sticklist = [],
            sortlist = [];
        for (let le of listelements) {
            if (le.nosort) {
                sticklist.push(le);
            } else {
                sortlist.push(le);
            }
        }

        sticklist.sort((a, b) => {
            let aval = a[column],
                bval = b[column];

            if (typeof aval === 'string') {
                aval = aval.toLowerCase();
            }
            if (typeof bval === 'string') {
                bval = bval.toLowerCase();
            }
            if (direction === 'asc') {
                if (aval > bval) { return 1 }
                if (aval < bval) { return -1 }
            } else {
                if (bval > aval) { return 1 }
                if (bval < aval) { return -1 }
            }
            return 0;
        });
        sortlist.sort((a, b) => {
            let aval = a[column],
                bval = b[column];

            if (typeof aval === 'string') {
                aval = aval.toLowerCase();
            }
            if (typeof bval === 'string') {
                bval = bval.toLowerCase();
            }
            if (direction === 'asc') {
                if (aval > bval) { return 1 }
                if (aval < bval) { return -1 }
            } else {
                if (bval > aval) { return 1 }
                if (bval < aval) { return -1 }
            }
            return 0;
        });

        if (!this.currentsort) { this.currentsort = {}; }
        this.currentsort.field = column;
        this.currentsort.direction = direction;

        return [].concat(sticklist).concat(sortlist);
    }

    openItem(item) {

    }

    postProcess() {
        // nothing.
        this.updateCount();
        if ((this.showinfo) && (this.searchable)) {
            this.search(this.searchcontrol.value);
        }
    }
    applyFilters() { }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('datalist-container');

        if (this.title) {
            this.container.appendChild(this.header);
        }
        if (this.filterable) {
            this.container.appendChild(this.filterinfo);
        }
        if (this.showinfo) {
            this.container.appendChild(this.datainfo);
        }
        if (this.astable) {
            let wrapper = document.createElement('div'),
                table = document.createElement('table');
            wrapper.classList.add('tablewrapper');
            table.appendChild(this.listheader);
            table.appendChild(this.datalist);
            wrapper.appendChild(table);
            this.container.appendChild(wrapper);
        } else {
            this.container.appendChild(this.listheader);
            this.container.appendChild(this.datalist);
        }

        this.messagebox = document.createElement('div');
        this.messagebox.classList.add('messages');
        this.messagebox.classList.add('hidden');
        this.container.appendChild(this.messagebox);

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.showfooter) {
            this.container.appendChild(this.footer);
        }
        this.container.onscroll = () => {
            if (this.container.scrollTop > 0) {
                this.container.classList.add('scrolled');
            } else {
                this.container.classList.remove('scrolled');
            }
        };
    }

    buildListHeader() {
        let row = document.createElement((this.astable) ? 'tr': 'div');

        if (this.astable) {
            this.listheader = document.createElement('thead');
            this.listheader.appendChild(row);
        } else {
            this.listheader = row;
        }

        row.classList.add('listheader');
        row.setAttribute('data-sort-field', 'title');
        row.setAttribute('data-sort-direction', 'asc');

        for (let col of this.columns) {
            let colheader = document.createElement((this.astable) ? 'th': 'div');
            if (col.field) { colheader.classList.add(col.field); }
            if (col.display) { colheader.classList.add(col.display); }
            if (col.data) {
                for (let d of col.data) {
                    colheader.setAttribute(d.k, d.v);
                }
            }
            if (col.field === 'spacer') {
                colheader.classList.add('spacer', 'mechanical');
                colheader.classList.add(`size-${col.type}`);
                if (this.astable) { colheader.innerHTML = "&nbsp;"; }
                row.appendChild(colheader);
                continue;
            }

            if (col.identifier) { colheader.setAttribute('data-identifier', "true"); }
            colheader.setAttribute('data-column', col.field);
            colheader.classList.add('label');
            colheader.innerHTML = `<label>${col.label}</label>`;


            colheader.addEventListener('click', () => {
                let direction = 'asc';
                if ((this.listheader.getAttribute('data-sort-field')) && (this.listheader.getAttribute('data-sort-field') === col.field)) {
                    if ((this.listheader.getAttribute('data-sort-direction')) && (this.listheader.getAttribute('data-sort-direction') === 'asc')) {
                        direction = 'desc';
                    }
                }
                this.state.sort.column = col.field;
                this.state.sort.direction = direction;
                this.persist();
                this.populate(col.field, direction);
            });
            row.appendChild(colheader);
        }

    }

    buildDataList() {
        if (this.astable) {
            this.datalist = document.createElement('tbody');
        } else {
            this.datalist = document.createElement('ul');
        }
        this.datalist.classList.add('datalist');
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get astable() { return this.config.astable; }
    set astable(astable) { this.config.astable = astable; }

    get click() { return this.config.click; }
    set click(click) {
        if (typeof click !== 'function') {
            console.error("Value provided to click is not a function!");
        }
        this.config.click = click;
    }

    get doubleclick() { return this.config.doubleclick; }
    set doubleclick(doubleclick) {
        if (typeof doubleclick !== 'function') {
            console.error("Value provided to doubleclick is not a function!");
        }
        this.config.doubleclick = doubleclick;
    }

    get columns() { return this.config.columns; }
    set columns(columns) { this.config.columns = columns; }

    get drawitem() { return this.config.drawitem; }
    set drawitem(drawitem) { this.config.drawitem = drawitem; }

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

    get noentriestext() { return this.config.noentriestext; }
    set noentriestext(noentriestext) { this.config.noentriestext = noentriestext; }

    get library() { return this.config.library; }
    set library(library) { this.config.library = library; }

    get datalist() {
        if (!this._datalist) { this.buildDataList(); }
        return this._datalist;
    }
    set datalist(datalist) { this._datalist = datalist; }

    get listheader() {
        if (!this._listheader) { this.buildListHeader(); }
        return this._listheader;
    }
    set listheader(listheader) { this._listheader = listheader; }

    get loadcallback() { return this.config.loadcallback; }
    set loadcallback(loadcallback) { this.config.loadcallback = loadcallback; }

    get onpostload() { return this.config.onpostload; }
    set onpostload(onpostload) { this.config.onpostload = onpostload; }

    get specialsort() { return this.config.specialsort; }
    set specialsort(specialsort) { this.config.specialsort = specialsort; }

    get startsort() { return this.config.startsort; }
    set startsort(startsort) { this.config.startsort = startsort; }

    get startsortdirection() { return this.config.startsortdirection; }
    set startsortdirection(startsortdirection) { this.config.startsortdirection = startsortdirection; }

}
window.DataList = DataList;