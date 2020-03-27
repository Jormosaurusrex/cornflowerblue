class BusinessObject {

    static get CONFIG() {
        return {
            identifier: 'id', // The name of the identifier field
            source: null,
            cadence: (1000 * 60 * 10), // Time between update heartbeats in milliseconds
                                       // Set to -1 to disable heartbeat
            dataprocessor: null,
            sortfunction: function(a, b) {
                if (a.name > b.name) { return 1 }
                if (a.name < b.name) { return -1 }
                return 0;
            },
            fields: []
        };
    }

    // static instance;  // Define the local instance

    constructor() {
        this.config = BusinessObject.CONFIG;
        this.initialized = false;

        /*  This is the model you want
        if (!BusinessObject.instance) {
            BusinessObject.instance = this;
        }
        return BusinessObject.instance;
        */
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get options() {
        let options = [];
        for (let o of Object.values(this.cache)) {
            options.push({ value: o[this.identifier], label: o.name });
        }
        options.sort(function(a, b) {
            if (a.label > b.label) { return 1 }
            if (a.label < b.label) { return -1 }
            return 0;
        });
        return options;
    }

    get list() {
        const me = this;
        let list = [];
        for (let o of Object.values(this.cache)) {
            list.push(o);
        }
        list.sort(function(a, b) {
            return me.sortfunction(a, b);
        });
        return list;
    }


    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Search the cache
     * @param text the text to search on.
     */
    static search(text) {
        if ((!text) || (text.length() < 1)) { return []; }

        let results = [];

        for (let o of Object.values(this.cache)) {
            for (let f of this.fields) {
                switch (f.type) {
                    case 'number':
                        if (Number(text) === o[f.name]) {
                            results.push(o);
                        }
                        break;
                    case 'stringarray':
                        for (let s of o[f.name]) {
                            if (s.toUpperCase().indexOf(text.toUpperCase()) >= 0) {
                                results.push(o);
                                break;
                            }
                        }
                        break;
                    case 'string':
                        if (o[f.name].toUpperCase().indexOf(text.toUpperCase()) >= 0) {
                            results.push(o);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return results;
    }

    async update(callback) {
        this.load(callback);
    }

    async load(callback) {
        if (this.updating) { return; }
        if (this.source) { return; }
        this.updating = true;
        await fetch(this.source, {
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
                if (this.identifier) {
                    for (let o of data) { this.put(o); }
                }

                this.updated = new Date().getTime();
                this.initialized = true;
                this.updating = false;

                if ((callback) && (typeof callback === 'function')) {
                    callback(data);
                }
            })
            .catch(err => {
                console.error(`Error while fetching data from ${this.source}`);
                console.error(err);
            });
    }

    /* CACHE METHODS____________________________________________________________________ */

    get(id) { return this.cache[id]; }

    put(obj) {
        if (!this.cache) { this.cache = {}; }
        this.cache[obj[this.identifier]] = obj;
    }

    remove(id) { delete this.cache[id]; }

    clear() { this.cache = {}; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /* UTILITY METHODS__________________________________________________________________ */

    /* ACCESSOR METHODS_________________________________________________________________ */

    get cache() { return this._cache; }
    set cache(cache) { this._cache = cache; }

    get cadence() { return this.config.cadence; }
    set cadence(cadence) { this.config.cadence = cadence; }

    get dataprocessor() { return this.config.dataprocessor; }
    set dataprocessor(dataprocessor) { this.config.dataprocessor = dataprocessor; }

    get identifier() { return this.config.identifier; }
    set identifier(identifier) { this.config.identifier = identifier; }

    get initialized() { return this._initialized; }
    set initialized(initialized) { this._initialized = initialized; }

    get fields() { return this.config.fields; }
    set fields(fields) { this.config.fields = fields; }

    get sortfunction() { return this.config.sortfunction; }
    set sortfunction(sortfunction) { this.config.sortfunction = sortfunction; }

    get source() { return this.config.source; }
    set source(source) { this.config.source = source; }

    get updated() { return this._updated; }
    set updated(updated) { this._updated = updated; }

    get updating() { return this._updating; }
    set updating(updating) { this._updating = updating; }

}
