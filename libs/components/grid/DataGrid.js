"use strict";

class DataGrid {

    static get DEFAULT_CONFIG() {
        return {
            fields: [], // The data fields for the grid and how they behave.

            data: [], // The data to throw into the grid

            rowclick: function(event, args) {  // What to do when a row is clicked on.
                //console.log("row clicked"); // args is an object, has item (json object) and e (event)
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


    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the DOM.
     * @returns {jQuery} jQuery representation
     */
    buildContainer() {

        this.container = $('<div />')
            .addClass('datagrid-container')
            .attr('id', this.id);

        this.container.append(this.header);

        for (let rdata of this.data) {
            this.buildRow(rdata);
        }

        this.container.append(this.grid);
    }

    buildGrid() {
        this.grid = $('<ul />').addClass('grid');
    }

    buildHeader() {
        let templateelements = [];

        this.header = $('<div />')
            .addClass('header');

        for (let f of this.fields) {
            this.header.append(this.buildHeaderCell(f));
            if (f.width) {
                templateelements.push(`${f.width}fr`);
            } else {
                templateelements.push('1fr');
            }
        }
        this.gridtemplate = templateelements.join(" ");

        this.header.css('grid-template-columns', this.gridtemplate);
    }

    buildHeaderCell(item) {
        const me = this;

        let $cell = $('<div />')
            .addClass('cell')
            .attr('id', `${this.id}-h-c-${item.name}`)
            .attr('data-name', item.name)
            .click(function(e) {
                e.preventDefault();
                me.sortField(item.name);
            })
            .html(item.label);

        if (this.sorticon) {$cell.addClass(`cfb-${this.sorticon}`); }

        this.headercells[item.name] = $cell;

        return $cell;
    }

    sortField(field) {
        const me = this;

        let sort = "asc";

        let $hCell = this.header.find(`[data-name='${field}']`);

        if ($hCell.attr('data-sort')) {
            if ($hCell.attr('data-sort') === 'asc') {
                sort = 'desc';
            }
        }

        this.header.children('.cell').removeAttr('data-sort');

        $hCell.attr('data-sort', sort);

        let elements = $.makeArray(this.grid.children("li"));

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

        this.grid.empty();

        $.each(elements, function() {
            me.grid.append(this);
        });
    }


    buildRow(rdata) {
        let $row = $('<li />')
            .addClass('row')
            .data('rdata', rdata)
            .css('grid-template-columns', this.gridtemplate);

        for (let f of this.fields) {
            $row.append(this.buildCell(rdata, f));
        }

        this.grid.append($row);
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
                case 'stringarray':
                    content = d.join(field.separator);
                    break;
                case 'string':
                default:
                    content = d;
                    break;
            }
        }

        let $cell = $('<div />')
            .addClass('cell')
            .addClass(field.name)
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

    get gridtemplate() { return this._gridtemplate; }
    set gridtemplate(gridtemplate) { this._gridtemplate = gridtemplate; }


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

    get selected() { return this._selected; }
    set selected(selected) { this._selected = selected; }

    get sorticon() { return this.config.sorticon; }
    set sorticon(sorticon) { this.config.sorticon = sorticon; }

}
