class DataList extends DataGrid {

    static get DEFAULT_CONFIG() {
        return {
            noentriestext: TextFactory.get('datalist-noentries'),
            specialsort: null,
            loadcallback: null,
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

    finalize() {
        // load state in here, etc.
    }

    fillData() {
        if (this.warehouse) {
            this.warehouse.load((data) => {
                this.update(data);
                this.populate();
            });
        } else if (this.source) {
            this.fetchData(this.source, (data) => {
                this.update(data);
                this.populate();
            });
        } else if (this.data) {
            this.populate();
        }
    }

    update(data) {
        this.data = [];
        if (data) {
            for (let entry of data) {
                this.data.push(entry);
            }
        }
        this.populate();
        if ((this.loadcallback) && (typeof this.loadcallback === 'function')) {
            this.loadcallback();
        }
    }

    populate(sort='title', direction = 'asc') {
        let order = 1;
        this.datalist.innerHTML = '';
        let items = this.sortOn(this.data, sort, direction);
        if (items.length === 0) {
            let li = document.createElement('li');
            li.classList.add('noentriestext');
            li.innerHTML = `<div class="noentries">${this.noentriestext}</div>`;
            this.datalist.appendChild(li);
            return;
        }
        for (let item of items) {
            let next = order + 1,
                previous = order - 1;
            if (previous < 1) { previous = 1; }
            if (next > items.length) { next = items.length; }

            let li = this.drawitem(item);

            if ((this.click) && (typeof this.click === 'function')) {
                li.classList.add('clickable');
                li.setAttribute('tabindex', '0');
                li.addEventListener('click', (e) => {
                    if ((this.click) && (typeof this.click === 'function')) {
                        this.click(item, this, e);
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

            li.style.setProperty('--anim-order', `${order}`);
            li.setAttribute('data-order', order);
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
    }

    sortOn(listelements, column='name', direction = 'asc') {
        if ((this.specialsort) && (typeof this.specialsort === 'function')) {
            return this.specialsort(listelements, column, direction);
        }
        listelements.sort((a, b) => {
            if (direction === 'asc') {
                if (a[column] > b[column]) { return 1 }
                if (a[column] < b[column]) { return -1 }
            } else {
                if (b[column] > a[column]) { return 1 }
                if (b[column] < a[column]) { return -1 }
            }
            return 0;
        });
        if (!this.currentsort) { this.currentsort = {}; }
        this.currentsort.field = column;
        this.currentsort.direction = direction;

        return listelements;
    }

    openItem(item) {

    }

    postLoad() {
        //this.applystate();
        //this.grindDuplicateCells();
    }

    gridPostProcess() {
        // nothing.
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('datalist-container');
        this.container.appendChild(this.listheader);
        this.container.appendChild(this.datalist);

        //this.container.appendChild(this.listheader.cloneNode(true));

        this.container.onscroll = () => {
            if (this.container.scrollTop > 0) {
                this.container.classList.add('scrolled');
            } else {
                this.container.classList.remove('scrolled');
            }
        };
    }

    buildListHeader() {
        this.listheader = document.createElement('div');
        this.listheader.classList.add('listheader');

        this.listheader.setAttribute('data-sort-field', 'title');
        this.listheader.setAttribute('data-sort-direction', 'asc');

        for (let col of this.columns) {

            let ndiv = document.createElement('div');
            ndiv.classList.add(col.field);

            if ((col.field === 'space') || (col.field === 'thumbspace') || (col.field === 'avatarspace') || (col.field === 'iconspace')) {
                this.listheader.appendChild(ndiv);
                continue;
            }
            ndiv.setAttribute('data-column', col.field);
            ndiv.classList.add('label');
            ndiv.innerHTML = `<label>${col.label}</label>`;
            ndiv.addEventListener('click', () => {
                let direction = 'asc';
                if ((this.listheader.getAttribute('data-sort-field')) && (this.listheader.getAttribute('data-sort-field') === col.field)) {
                    if ((this.listheader.getAttribute('data-sort-direction')) && (this.listheader.getAttribute('data-sort-direction') === 'asc')) {
                        direction = 'desc';
                    }
                }
                this.listheader.setAttribute('data-sort-field', col.field);
                this.listheader.setAttribute('data-sort-direction', direction);
                this.populate(col.field, direction);
            });
            this.listheader.appendChild(ndiv);
        }

    }

    buildDataList() {
        this.datalist = document.createElement('ul');
        this.datalist.classList.add('datalist');
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

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

    get specialsort() { return this.config.specialsort; }
    set specialsort(specialsort) { this.config.specialsort = specialsort; }

}
window.DataList = DataList;