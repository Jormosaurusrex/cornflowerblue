"use strict";

class DataGrid {

    static get DEFAULT_CONFIG() {
        return {
            fields: [], // The data fields for the grid and how they behave.

            data: [], // The data to throw into the grid

            sortable: true, //  Data columns can be selected
            selectable: true, //  Data rows can be selected
            rowclick: function(event, self) {  // What to do when a row is clicked on.
                //console.log("row clicked");
            },

            sorticon: 'chevron-down',
            id: null, // The id
            classes: [] //Extra css classes to apply
        };
    };

    static get BLANK_STATE() {
        return {
            selected: null, // Holds the identifier for the selected item
            sortfield: null, // a string, holds the a field name
            sortdirection: null, // a string, asc or desc
            filter: null, // a string/filter name
            fields: {} // A dictionary that holds field configuration
        };
    };

    /**
     * Define a DataGrid
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, DataGrid.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = "grid-" + Utils.getUniqueKey(5); }
    }

    /* CORE METHODS_____________________________________________________________________ */

    sortField(field) {
        const me = this;

        let sort = "asc";

        let $hCell = this.gridheader.find(`[data-name='${field}']`);

        if ($hCell.attr('data-sort')) {
            if ($hCell.attr('data-sort') === 'asc') {
                sort = "desc"
            }
        }

        this.gridheader.children('th').removeAttr('data-sort');

        $hCell.attr('data-sort', sort);

        let elements = $.makeArray(this.gridbody.children("tr"));

        elements.sort(function(a, b) {
            let textA = $(a).children(`.${field}`).text();
            let textB = $(b).children(`.${field}`).text();

            if (sort === 'asc') {
                if (textA < textB) return -1;
                if (textA > textB) return 1;
            } else {
                if (textA > textB) return -1;
                if (textA < textB) return 1;
            }

            return 0;
        });

        this.gridbody.empty();

        $.each(elements, function() {
            me.gridbody.append(this);
        });
    }


    select($row) {
        this.gridbody.find('tr').removeAttr('aria-selected');
        $row.attr('aria-selected', true);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the DOM.
     * @returns {jQuery} jQuery representation
     */
    buildContainer() {

        for (let rdata of this.data) {
            this.gridbody.append(this.buildRow(rdata));
        }

        this.container = $('<div />')
            .addClass('datagrid-container')
            .attr('id', this.id)
            .append(
                this.grid
                    .append(this.header)
                    .append(this.gridbody)
            );
    }

    buildGrid() {
        this.grid = $('<table />')
            .addClass('grid');
        if (this.selectable) {
            this.grid.addClass('selectable');
        }
    }

    buildHeader() {
        for (let f of this.fields) {
            this.gridheader.append(this.buildHeaderCell(f));
        }
        this.header = $('<thead />').append(this.gridheader);
    }

    buildHeaderCell(item) {
        const me = this;

        let $div = $('<div />').html(item.label)
        if (this.sorticon) { $div.addClass(`cfb-${this.sorticon}`); }

        let $cell = $('<th />')
            .addClass(item.type)
            .attr('id', `${this.id}-h-c-${item.name}`)
            .attr('data-name', item.name)
            .append($div);

        if (this.sortable) {
            $cell.attr('tabindex', 1)
                .click(function(e) {
                    e.preventDefault();
                    me.sortField(item.name);
                })
                .on('keydown', function(e) {
                    if ((e.keyCode === 37) || (e.keyCode === 38)) { // Left arrow || Up Arrow
                        e.preventDefault();
                        $(this).prev().focus();
                    } else if ((e.keyCode === 39) || (e.keyCode === 40)) { // Right arrow || Down Arrow
                        e.preventDefault();
                        $(this).next().focus();
                    } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                        $(this).trigger('click');
                    }
                });
        }

        this.headercells[item.name] = $cell;

        return $cell;
    }

    buildGridBody() {
        this.gridbody = $('<tbody />');
    }
    buildGridHeader() {
        this.gridheader = $('<tr />').addClass('header');
    }

    buildRow(rdata) {
        const me = this;
        let $row = $('<tr />')
            .data('rdata', rdata);

        if (this.selectable) {
            $row.attr('tabindex', 1)
                .click(function(e) {
                    if (me.selectable) { me.select($row); }
                    if ((me.rowclick) && (typeof me.rowclick === 'function')) {
                        me.rowclick(e, me);
                    }
                })
                .on('keydown', function(e) {
                    console.log('foo');
                    if ((e.keyCode === 37) || (e.keyCode === 38)) { // Left arrow || Up Arrow
                        e.preventDefault();
                        $(this).prev().focus();
                    } else if ((e.keyCode === 39) || (e.keyCode === 40)) { // Right arrow || Down Arrow
                        e.preventDefault();
                        $(this).next().focus();
                    } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                        $(this).trigger('click');
                    }
                });
        }

        for (let f of this.fields) {
            $row.append(this.buildCell(rdata, f));
        }

        return $row;
    }

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

        let $cell = $('<td />')
            .addClass(field.name)
            .addClass(field.type)
            .html(content);

        if (field.classes) {
            $cell.addClass(field.classes.join(' '));
        }

        return $cell;
    }

    buildFooter() {
        this.footer = $('<div />').addClass('footer');
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

    get fields() { return this.config.fields; }
    set fields(fields) { this.config.fields = fields; }

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

    get rowclick() { return this.config.rowclick; }
    set rowclick(rowclick) { this.config.rowclick = rowclick; }

    get selectable() { return this.config.selectable; }
    set selectable(selectable) { this.config.selectable = selectable; }

    get sortable() { return this.config.sortable; }
    set sortable(sortable) { this.config.sortable = sortable; }

    get sorticon() { return this.config.sorticon; }
    set sorticon(sorticon) { this.config.sorticon = sorticon; }

}
