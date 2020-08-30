class BusinessObject {

    static get CONFIG() {
        return {
            identifier: 'id', // The name of the identifier field
            source: null,
            //cadence: (1000 * 60 * 10), // Time between update heartbeats in milliseconds
            cadence: (1000 * 60), // Time between update heartbeats in milliseconds
                                  // Set to -1 to disable heartbeat
            dataprocessor: null,
            sourcemethod: 'GET', // the method to get the source from.
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

        /*  This is the model for subclassing
        if (!BusinessObject.instance) {
            BusinessObject.instance = this;
            if ((this.cadence) && (this.cadence > 0)) {
                setInterval(function() {
                    me.update();
                }, this.cadence);
        }
        }
        return BusinessObject.instance;
        */
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Returns an array of option definitions, used in SelectMenus
     * @return an array of option definitions
     */
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

    /**
     * Get a list of the objects in the cache, sorted by the sort function (usually name)
     * @return an array of the objects, sorted
     */
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

    /**
     * Update the cache.  Does basically a load();
     * @param callback
     * @return {Promise<void>}
     */
    async update(callback) {
        this.load(callback);
    }

    /**
     * Does this need to be updated
     * @return {boolean} true or false, depending.
     */
    needsupdate() {
        if ((this.cadence) && (this.cadence < 1)) { return false; }
        if (!this.updated) { return true; }
        return ((new Date().getTime() - this.updated) > this.cadence);
    }

    /**
     * Load data for this business object.
     * @param callback
     * @return {Promise<void>}
     */
    async load(callback) {
        if (this.updating) { return; }
        if (!this.source) { return; }

        this.updating = true;
        await fetch(this.source, {
            method: this.sourcemethod,
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

    /**
     * Get an element from the cache
     * @param id the id of the element
     * @return {*}
     */
    get(id) { return this.cache[id]; }

    /**
     * Put an object in the cache
     * @param obj the object to add
     */
    put(obj) {
        if (!this.cache) { this.cache = {}; }
        this.cache[obj[this.identifier]] = obj;
    }

    /**
     * Remove an element from the data cache
     * @param id the id of the item to remove
     */
    remove(id) {
        if (!id) { return; }
        if (Object.getPrototypeOf(id).isPrototypeOf(Object)) {
            delete this.cache[id[this.identifier]];
            return;
        }
        delete this.cache[id];
    }

    /**
     * Clear the cache completely
     */
    clear() { this.cache = {}; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /* UTILITY METHODS__________________________________________________________________ */

    /* ACCESSOR METHODS_________________________________________________________________ */

    get cache() {
        if (!this._cache) { this._cache = {}; }
        return this._cache;
    }
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

    get sourcemethod() { return this.config.sourcemethod; }
    set sourcemethod(sourcemethod) { this.config.sourcemethod = sourcemethod; }

    get updated() { return this._updated; }
    set updated(updated) { this._updated = updated; }

    get updating() { return this._updating; }
    set updating(updating) { this._updating = updating; }

}
