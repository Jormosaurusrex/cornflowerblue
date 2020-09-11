/*! Cornflower Blue - v0.1.1 - 2020-09-11
* http://www.gaijin.com/cornflowerblue/
* Copyright (c) 2020 Brandon Harris; Licensed MIT */
class CFBUtils {

    /* GLOBAL METHODS___________________________________________________________________ */

    /**
     * Close all open panel elements. This is for things like tooltips or select menu elements which get put in the <body>.
     */
    static closeOpen() {
        // Tooltips
        clearTimeout(ToolTip.timer);
        if (ToolTip.activeTooltip) {
            clearTimeout(ToolTip.activeTooltip.timer);
            ToolTip.activeTooltip.close();
        }

        // SelectMenus
        if (SelectMenu.activeMenu) {
            SelectMenu.activeMenu.close();
        }

        // ButtonMenus
        if (ButtonMenu.activeMenu) {
            ButtonMenu.activeMenu.close();
        }
    }

    /**
     * Sets attributes on a given DOM element
     * @param mapping a dictionary of attributes
     * @param element the DOM element to apply them to.
     */
    static applyAttributes(mapping, element) {
        if ((!mapping) || (!element)) { return; }
        for (let k of Object.keys(mapping)) {
            element.setAttribute(k, mapping[k]);
        }
    }

    /**
     * Sets data-* attributes on a given DOM element
     * @param mapping a dictionary of attributes
     * @param element the DOM element to apply them to.
     */
    static applyDataAttributes(mapping, element) {
        if ((!mapping) || (!element)) { return; }
        for (let k of Object.keys(mapping)) {
            element.setAttribute(`data-${k}`, mapping[k]);
        }
    }

    /* GENERAL METHODS__________________________________________________________________ */

    /**
     * Change the timezone on a date.
     * @param date the original date to change
     * @param tz the timezone to change it to
     * @param locale (optional) a locale (default 'en-US')
     * @return {Date}
     */
    static setTimeZone(date, tz, locale='en-US') {
        let invdate = new Date(date.toLocaleString(locale, {
            timeZone: tz
        }));
        let diff = date.getTime() - invdate.getTime();
        return new Date(date.getTime() + diff);
    }

    /**
     * Get the value of a specific cookie.
     * @param name the name of the cookie
     * @return {string} the value of the cookie
     */
    static getCookie(name) {
        return (`; ${document.cookie}`)
            .split(`; ${name}=`)
            .pop()
            .split(';')
            .shift();
    }

    /**
     * Parses all URL parameters into a dictionary.  Returns the dictionary.
     * Can be used in-line but that may be slow.
     * @param url (optional) an URL to parse. If empty, parses the window's URL.
     * @return {object} a dictionary of the URL params
     */
    static getAllURLParams(url) {

        // get query string from url (optional) or window
        let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        let dict = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            let arr = queryString.split('&');

            for (let i = 0; i < arr.length; i++) {
                // separate the keys and the values
                let a = arr[i].split('=');

                // set parameter name and value (use 'true' if empty)
                let paramName = a[0];
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {

                    // create key if it doesn't exist
                    let key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!dict[key]) dict[key] = [];

                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        let index = /\[(\d+)\]/.exec(paramName)[1];
                        dict[key][index] = paramValue;
                    } else {
                        // otherwise add the value to the end of the array
                        dict[key].push(paramValue);
                    }
                } else {
                    // we're dealing with a string
                    if (!dict[paramName]) {
                        // if it doesn't exist, create property
                        dict[paramName] = paramValue;
                    } else if (dict[paramName] && typeof dict[paramName] === 'string'){
                        // if property does exist and it's a string, convert it to an array
                        dict[paramName] = [dict[paramName]];
                        dict[paramName].push(paramValue);
                    } else {
                        // otherwise add the property
                        dict[paramName].push(paramValue);
                    }
                }
            }
        }
        return dict;
    }

    /**
     * Dumps an objects configuration properties
     * @param obj the object to dump
     * @return {string}
     */
    static getConfig(obj) {
        let keys = Object.keys(obj.config).sort((a, b) =>{
            let a1 = a.toLowerCase(),
                b1 = b.toLowerCase();
            if(a1 === b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
        let vlines = [];
        for (let k of keys) {
            if (typeof obj[k] === 'function') {
                vlines.push(`\t ${k} : (...) => { ... }`);
            } else if (Array.isArray(obj[k])) {
                vlines.push(`\t ${k} : [${obj[k]}]`);
            } else if (typeof obj[k] === 'string') {
                vlines.push(`\t ${k} : "${obj[k]}"`);
            } else {
                vlines.push(`\t ${k} : ${obj[k]}`);
            }
        }
        let config = obj.constructor.name + " {\n";
        config += vlines.join(",\n");
        config += "\n}\n";
        return config;
    }

    /**
     * Dumps a pretty-print version of the configuration
     * @param obj the object to dum
     * @return {string}
     */
    static prettyPrintConfig(obj) {
        let keys = Object.keys(obj.config).sort((a, b) =>{
            let a1 = a.toLowerCase(),
                b1 = b.toLowerCase();
            if (a1 === b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
        let vlines = [];
        for (let k of keys) {
            let line = "";
            if ((k === 'id') || (k === 'name')) {
                line = `    <span class="key">${k}</span> : <span class="value">&lt;string&gt;</span>`;
            } else if (typeof obj[k] === 'function') {
                line = `    <span class="key">${k}</span> : (...) => { ... }`;
            } else if (Array.isArray(obj[k])) {
                line = `    <span class="key">${k}</span> : [`;
                if ((obj[k] !== null) && (obj[k].length > 0)) {
                    let elements = [];
                    for (let c of obj[k]) {
                        if (typeof c === 'string') {
                            elements.push(`"<span class="value">${c}</span>"`);
                        } else {
                            elements.push(`<span class="value">${c}</span>`);
                        }
                    }
                    line += elements.join(", ");
                }
                line += `]`;
            } else if (typeof obj[k] === 'string') {
                line = `    <span class="key">${k}</span> : "<span class="value">${obj[k]}</span>"`;
            } else {
                line = `    <span class="key">${k}</span> : <span class="value">${obj[k]}</span>`;
            }
            if ((Array.isArray(obj[k])) && (CFBUtils.arrayEquals(obj[k], obj.constructor.DEFAULT_CONFIG[k]))) {
                line = `<span class="default">${line}</span>`;
            } else if (obj[k] === obj.constructor.DEFAULT_CONFIG[k]) {
                line = `<span class="default">${line}</span>`;
            }

            vlines.push(line);
        }
        let config = obj.constructor.name + " {\n";
        config += vlines.join(",\n");
        config += "\n}\n";
        return config;
    }

    /**
     * Test if both arrays are equal
     * @param a the one array
     * @param b the other array
     * @return {boolean}
     */
    static arrayEquals(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        a.sort((a, b) => {
            let a1 = a.toLowerCase(),
                b1 = b.toLowerCase();
            if(a1 === b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
        b.sort((a, b) => {
            let a1 = a.toLowerCase(),
                b1 = b.toLowerCase();
            if(a1 === b1) return 0;
            return a1 > b1 ? 1 : -1;
        });

        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    /**
     * Calculates the pixel value of an em.
     * @return {number}
     */
    static getSingleEmInPixels() {
        let low = 0;
        let high = 200;
        let emWidth = Math.round((high - low) / 2) + low;
        let iters = 0;
        const maxIters = 10;
        while (high - low > 1) {
            const match = window.matchMedia(`(min-width: ${emWidth}em)`).matches;
            iters += 1;
            if (match) {
                low = emWidth;
            } else {
                high = emWidth;
            }
            emWidth = Math.round((high - low) / 2) + low;
            if (iters > maxIters) {
                break;
            }
        }
        return Math.ceil(window.innerWidth / emWidth);
    }

    /* CRYPTOGRAPHY METHODS_____________________________________________________________ */

    /**
     * Does this browser support crypto?
     * @return true or false, depending
     */
    static supportsCrypto () {
        return window.crypto && crypto.subtle && window.TextEncoder;
    }

    /**
     * Hash a string with a specific algorithm.
     * @param a the algorithm
     * @param s the string to hash
     * @return {PromiseLike<ArrayBuffer>}
     */
    static hash(a, s) {
        return crypto.subtle.digest(a, new TextEncoder().encode(s));
    }

    /**
     * Turn a buffer into a hex string
     * @param buff the buffer
     * @return {string} a string of hexes
     */
    static hex(buff) {
        return [].map.call(new Uint8Array(buff), b => ('00' + b.toString(16)).slice(-2)).join('');
    }

    /**
     * Encode a buffer in base 64
     * @param buff the buffer to encode
     * @return {string} the encoded string
     */
    static encode64(buff) {
        return btoa(new Uint8Array(buff).reduce((s, b) => s + String.fromCharCode(b), ''));
    }

    /**
     * Hash a text string
     * @param message the string to encrypt
     * @return {Promise<string>}
     */
    static async sha256(message) {
        // encode as UTF-8
        const msgBuffer = new TextEncoder('utf-8').encode(message);

        // hash the message
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // convert bytes to hex string
        return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

    }

    /**
     * Encrypt a text string
     * @param message the string to encrypt
     * @param secret the secret to use.
     * @return {Promise<string>}
     */
    static async sha256Encrypt(message, secret) {
        // encode as UTF-8
        const msgBuffer = new TextEncoder('utf-8').encode(message);

        // hash the message
        const hashBuffer = await crypto.subtle.encrypt('SHA-256', secret, msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // convert bytes to hex string
        return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

    }

    /* FORMAT METHODS___________________________________________________________________ */

    /**
     * Add commas to a number in the right place
     * @param num the number to change
     * @return {string} the number, with commas.
     */
    static readableNumber(num) {
        if ((num === null) || (typeof num === 'undefined')) { return null; }
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Format a number as money.
     * @param value the value to display.
     * @param decPlaces the decimal places (default '2')
     * @param thouSeparator the thousands separator (default ',')
     * @param decSeparator the decimal separator (default '.')
     * @param currencySymbol the currencySymbol (default '$')
     * @return {string} the formatted money string
     */
    static formatMoney(value, decPlaces, thouSeparator, decSeparator, currencySymbol) {
        // check the args and supply defaults:
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
        decSeparator = decSeparator === undefined ? "." : decSeparator;
        thouSeparator = thouSeparator === undefined ? "," : thouSeparator;
        currencySymbol = currencySymbol === undefined ? "$" : currencySymbol;

        let n = value;
        let i;
        let j;
        let sign = n < 0 ? "-" : "";
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "";
        j = (j = i.length) > 3 ? j % 3 : 0;

        return sign + currencySymbol + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
    }

    /* RANDOMIZATION METHODS____________________________________________________________ */

    /**
     * Gets a random number between 1 and max
     * @param max the maximum value (default 20)
     * @return {number} a number
     */
    static randomNumber(max = 100) {
        return Math.floor(1 + (Math.random() * max));
    }

    /**
     * Simple heads or tails, in boolean
     * @return {boolean} true or false, depending
     */
    static coinFlip() {
        return (Math.floor(Math.random() * 2) === 0);
    }

    /**
     * Rolls a die for you.
     * @param dieSize the number of sides on the die.
     * @return {number}
     */
    static dieRoll(dieSize = 6) {
        return Math.floor(Math.random() * dieSize) + 1;
    }

    /**
     * Gets a unique key
     * @param length the length of the key (optional, default 30 characters)
     * @returns {string}
     */
    static getUniqueKey(length = 30) {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        for (let i = 0; i < length; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /* BROWSER AND MOBILE DETECTION METHODS_________________________________________________________ */

    /**
     * Check if the browser is Microsoft Edge
     * @return {boolean} true or false, depending.
     */
    static isEdge() {
        return navigator.userAgent.match(/Edge/i);
    }

    /**
     * Check if the browser is an Android device
     * @return {boolean} true or false, depending.
     */
    static isAndroid() {
        return navigator.userAgent.match(/Android/i);
    }

    /**
     * Check if the browser is a BlackBerry device
     * @return {boolean} true or false, depending.
     */
    static isBlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i);
    }

    /**
     * Check if the browser is an iOS device
     * @return {boolean} true or false, depending.
     */
    static isIOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    }

    /**
     * Check if the browser is an iPhone device (also returns true if it's an iPod).
     * @return {boolean}  true or false, depending.
     */
    static isIPhone() {
        return navigator.userAgent.match(/iPhone|iPod/i);
    }

    /**
     * Check if the browser is an iPad device
     * @return {boolean}  true or false, depending.
     */
    static isIPad() {
        return navigator.userAgent.match(/iPad/i);
    }

    /**
     * Check if the browser is an Opera Mini device
     * @return {boolean} true or false, depending.
     */
    static isOperaMobile() {
        return navigator.userAgent.match(/Opera Mini/i);
    }

    /**
     * Check if the browser is a Windows Mobile device
     * @return {boolean} true or false, depending.
     */
    static isWindowsMobile() {
        return navigator.userAgent.match(/IEMobile/i);
    }

    /**
     * Check if the browser is a mobile or touch device. Includes iPads.
     * @return {boolean} true or false, depending.
     */
    static isMobile() {
        return (this.isAndroid() || this.isBlackBerry() || this.isIOS() || this.isOperaMobile() || this.isWindowsMobile());
    }
}
window.CFBUtils = CFBUtils;
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
            sortfunction: (a, b) => {
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
                setInterval(() => {
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
        options.sort((a, b) => {
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
        let list = [];
        for (let o of Object.values(this.cache)) {
            list.push(o);
        }
        list.sort((a, b) => {
            return this.sortfunction(a, b);
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

class CountryCode extends BusinessObject {
    
    static get CONFIG() {
        return {
            identifier: 'code',
            cadence: -1,
            fields: [
                new GridField({
                    name: "code",
                    label: TextFactory.get('code'),
                    identifier: true,
                    readonly: true,
                    type: "string"
                }),
                new GridField({
                    name: "name",
                    label: TextFactory.get('country'),
                    readonly: true,
                    type: "string"
                })
            ]
        };
    }

    static get MAP() {
        return {
            AF: { code: "AF", name: "Afghanistan" },
            AX: { code: "AX", name: "Åland Islands" },
            AL: { code: "AL", name: "Albania" },
            DZ: { code: "DZ", name: "Algeria" },
            AS: { code: "AS", name: "American Samoa" },
            AD: { code: "AD", name: "Andorra" },
            AO: { code: "AO", name: "Angola" },
            AI: { code: "AI", name: "Anguilla" },
            AQ: { code: "AQ", name: "Antarctica" },
            AG: { code: "AG", name: "Antigua and Barbuda" },
            AR: { code: "AR", name: "Argentina" },
            AM: { code: "AM", name: "Armenia" },
            AW: { code: "AW", name: "Aruba" },
            AU: { code: "AU", name: "Australia" },
            AT: { code: "AT", name: "Austria" },
            AZ: { code: "AZ", name: "Azerbaijan" },
            BS: { code: "BS", name: "Bahamas" },
            BH: { code: "BH", name: "Bahrain" },
            BD: { code: "BD", name: "Bangladesh" },
            BB: { code: "BB", name: "Barbados" },
            BY: { code: "BY", name: "Belarus" },
            BE: { code: "BE", name: "Belgium" },
            BZ: { code: "BZ", name: "Belize" },
            BJ: { code: "BJ", name: "Benin" },
            BM: { code: "BM", name: "Bermuda" },
            BT: { code: "BT", name: "Bhutan" },
            BO: { code: "BO", name: "Bolivia, Plurinational State of" },
            BQ: { code: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
            BA: { code: "BA", name: "Bosnia and Herzegovina" },
            BW: { code: "BW", name: "Botswana" },
            BV: { code: "BV", name: "Bouvet Island" },
            BR: { code: "BR", name: "Brazil" },
            IO: { code: "IO", name: "British Indian Ocean Territory" },
            BN: { code: "BN", name: "Brunei Darussalam" },
            BG: { code: "BG", name: "Bulgaria" },
            BF: { code: "BF", name: "Burkina Faso" },
            BI: { code: "BI", name: "Burundi" },
            KH: { code: "KH", name: "Cambodia" },
            CM: { code: "CM", name: "Cameroon" },
            CA: { code: "CA", name: "Canada" },
            CV: { code: "CV", name: "Cape Verde" },
            KY: { code: "KY", name: "Cayman Islands" },
            CF: { code: "CF", name: "Central African Republic" },
            TD: { code: "TD", name: "Chad" },
            CL: { code: "CL", name: "Chile" },
            CN: { code: "CN", name: "China" },
            CX: { code: "CX", name: "Christmas Island" },
            CC: { code: "CC", name: "Cocos (Keeling) Islands" },
            CO: { code: "CO", name: "Colombia" },
            KM: { code: "KM", name: "Comoros" },
            CG: { code: "CG", name: "Congo" },
            CD: { code: "CD", name: "Congo, the Democratic Republic of the" },
            CK: { code: "CK", name: "Cook Islands" },
            CR: { code: "CR", name: "Costa Rica" },
            CI: { code: "CI", name: "Côte d'Ivoire" },
            HR: { code: "HR", name: "Croatia" },
            CU: { code: "CU", name: "Cuba" },
            CW: { code: "CW", name: "Curaçao" },
            CY: { code: "CY", name: "Cyprus" },
            CZ: { code: "CZ", name: "Czech Republic" },
            DK: { code: "DK", name: "Denmark" },
            DJ: { code: "DJ", name: "Djibouti" },
            DM: { code: "DM", name: "Dominica" },
            DO: { code: "DO", name: "Dominican Republic" },
            EC: { code: "EC", name: "Ecuador" },
            EG: { code: "EG", name: "Egypt" },
            SV: { code: "SV", name: "El Salvador" },
            GQ: { code: "GQ", name: "Equatorial Guinea" },
            ER: { code: "ER", name: "Eritrea" },
            EE: { code: "EE", name: "Estonia" },
            ET: { code: "ET", name: "Ethiopia" },
            FK: { code: "FK", name: "Falkland Islands (Malvinas)" },
            FO: { code: "FO", name: "Faroe Islands" },
            FJ: { code: "FJ", name: "Fiji" },
            FI: { code: "FI", name: "Finland" },
            FR: { code: "FR", name: "France" },
            GF: { code: "GF", name: "French Guiana" },
            PF: { code: "PF", name: "French Polynesia" },
            TF: { code: "TF", name: "French Southern Territories" },
            GA: { code: "GA", name: "Gabon" },
            GM: { code: "GM", name: "Gambia" },
            GE: { code: "GE", name: "Georgia" },
            DE: { code: "DE", name: "Germany" },
            GH: { code: "GH", name: "Ghana" },
            GI: { code: "GI", name: "Gibraltar" },
            GR: { code: "GR", name: "Greece" },
            GL: { code: "GL", name: "Greenland" },
            GD: { code: "GD", name: "Grenada" },
            GP: { code: "GP", name: "Guadeloupe" },
            GU: { code: "GU", name: "Guam" },
            GT: { code: "GT", name: "Guatemala" },
            GG: { code: "GG", name: "Guernsey" },
            GN: { code: "GN", name: "Guinea" },
            GW: { code: "GW", name: "Guinea-Bissau" },
            GY: { code: "GY", name: "Guyana" },
            HT: { code: "HT", name: "Haiti" },
            HM: { code: "HM", name: "Heard Island and McDonald Islands" },
            VA: { code: "VA", name: "Holy See (Vatican City State)" },
            HN: { code: "HN", name: "Honduras" },
            HK: { code: "HK", name: "Hong Kong" },
            HU: { code: "HU", name: "Hungary" },
            IS: { code: "IS", name: "Iceland" },
            IN: { code: "IN", name: "India" },
            ID: { code: "ID", name: "Indonesia" },
            IR: { code: "IR", name: "Iran, Islamic Republic of" },
            IQ: { code: "IQ", name: "Iraq" },
            IE: { code: "IE", name: "Ireland" },
            IM: { code: "IM", name: "Isle of Man" },
            IL: { code: "IL", name: "Israel" },
            IT: { code: "IT", name: "Italy" },
            JM: { code: "JM", name: "Jamaica" },
            JP: { code: "JP", name: "Japan" },
            JE: { code: "JE", name: "Jersey" },
            JO: { code: "JO", name: "Jordan" },
            KZ: { code: "KZ", name: "Kazakhstan" },
            KE: { code: "KE", name: "Kenya" },
            KI: { code: "KI", name: "Kiribati" },
            KP: { code: "KP", name: "Korea, Democratic People's Republic of" },
            KR: { code: "KR", name: "Korea, Republic of" },
            KW: { code: "KW", name: "Kuwait" },
            KG: { code: "KG", name: "Kyrgyzstan" },
            LA: { code: "LA", name: "Lao People's Democratic Republic" },
            LV: { code: "LV", name: "Latvia" },
            LB: { code: "LB", name: "Lebanon" },
            LS: { code: "LS", name: "Lesotho" },
            LR: { code: "LR", name: "Liberia" },
            LY: { code: "LY", name: "Libya" },
            LI: { code: "LI", name: "Liechtenstein" },
            LT: { code: "LT", name: "Lithuania" },
            LU: { code: "LU", name: "Luxembourg" },
            MO: { code: "MO", name: "Macao" },
            MK: { code: "MK", name: "Macedonia, the Former Yugoslav Republic of" },
            MG: { code: "MG", name: "Madagascar" },
            MW: { code: "MW", name: "Malawi" },
            MY: { code: "MY", name: "Malaysia" },
            MV: { code: "MV", name: "Maldives" },
            ML: { code: "ML", name: "Mali" },
            MT: { code: "MT", name: "Malta" },
            MH: { code: "MH", name: "Marshall Islands" },
            MQ: { code: "MQ", name: "Martinique" },
            MR: { code: "MR", name: "Mauritania" },
            MU: { code: "MU", name: "Mauritius" },
            YT: { code: "YT", name: "Mayotte" },
            MX: { code: "MX", name: "Mexico" },
            FM: { code: "FM", name: "Micronesia, Federated States of" },
            MD: { code: "MD", name: "Moldova, Republic of" },
            MC: { code: "MC", name: "Monaco" },
            MN: { code: "MN", name: "Mongolia" },
            ME: { code: "ME", name: "Montenegro" },
            MS: { code: "MS", name: "Montserrat" },
            MA: { code: "MA", name: "Morocco" },
            MZ: { code: "MZ", name: "Mozambique" },
            MM: { code: "MM", name: "Myanmar" },
            NA: { code: "NA", name: "Namibia" },
            NR: { code: "NR", name: "Nauru" },
            NP: { code: "NP", name: "Nepal" },
            NL: { code: "NL", name: "Netherlands" },
            NC: { code: "NC", name: "New Caledonia" },
            NZ: { code: "NZ", name: "New Zealand" },
            NI: { code: "NI", name: "Nicaragua" },
            NE: { code: "NE", name: "Niger" },
            NG: { code: "NG", name: "Nigeria" },
            NU: { code: "NU", name: "Niue" },
            NF: { code: "NF", name: "Norfolk Island" },
            MP: { code: "MP", name: "Northern Mariana Islands" },
            NO: { code: "NO", name: "Norway" },
            OM: { code: "OM", name: "Oman" },
            PK: { code: "PK", name: "Pakistan" },
            PW: { code: "PW", name: "Palau" },
            PS: { code: "PS", name: "Palestine, State of" },
            PA: { code: "PA", name: "Panama" },
            PG: { code: "PG", name: "Papua New Guinea" },
            PY: { code: "PY", name: "Paraguay" },
            PE: { code: "PE", name: "Peru" },
            PH: { code: "PH", name: "Philippines" },
            PN: { code: "PN", name: "Pitcairn" },
            PL: { code: "PL", name: "Poland" },
            PT: { code: "PT", name: "Portugal" },
            PR: { code: "PR", name: "Puerto Rico" },
            QA: { code: "QA", name: "Qatar" },
            RE: { code: "RE", name: "Réunion" },
            RO: { code: "RO", name: "Romania" },
            RU: { code: "RU", name: "Russian Federation" },
            RW: { code: "RW", name: "Rwanda" },
            BL: { code: "BL", name: "Saint Barthélemy" },
            SH: { code: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" },
            KN: { code: "KN", name: "Saint Kitts and Nevis" },
            LC: { code: "LC", name: "Saint Lucia" },
            MF: { code: "MF", name: "Saint Martin (French part)" },
            PM: { code: "PM", name: "Saint Pierre and Miquelon" },
            VC: { code: "VC", name: "Saint Vincent and the Grenadines" },
            WS: { code: "WS", name: "Samoa" },
            SM: { code: "SM", name: "San Marino" },
            ST: { code: "ST", name: "Sao Tome and Principe" },
            SA: { code: "SA", name: "Saudi Arabia" },
            SN: { code: "SN", name: "Senegal" },
            RS: { code: "RS", name: "Serbia" },
            SC: { code: "SC", name: "Seychelles" },
            SL: { code: "SL", name: "Sierra Leone" },
            SG: { code: "SG", name: "Singapore" },
            SX: { code: "SX", name: "Sint Maarten (Dutch part)" },
            SK: { code: "SK", name: "Slovakia" },
            SI: { code: "SI", name: "Slovenia" },
            SB: { code: "SB", name: "Solomon Islands" },
            SO: { code: "SO", name: "Somalia" },
            ZA: { code: "ZA", name: "South Africa" },
            GS: { code: "GS", name: "South Georgia and the South Sandwich Islands" },
            SS: { code: "SS", name: "South Sudan" },
            ES: { code: "ES", name: "Spain" },
            LK: { code: "LK", name: "Sri Lanka" },
            SD: { code: "SD", name: "Sudan" },
            SR: { code: "SR", name: "Suriname" },
            SJ: { code: "SJ", name: "Svalbard and Jan Mayen" },
            SZ: { code: "SZ", name: "Swaziland" },
            SE: { code: "SE", name: "Sweden" },
            CH: { code: "CH", name: "Switzerland" },
            SY: { code: "SY", name: "Syrian Arab Republic" },
            TW: { code: "TW", name: "Taiwan, Province of China" },
            TJ: { code: "TJ", name: "Tajikistan" },
            TZ: { code: "TZ", name: "Tanzania, United Republic of" },
            TH: { code: "TH", name: "Thailand" },
            TL: { code: "TL", name: "Timor-Leste" },
            TG: { code: "TG", name: "Togo" },
            TK: { code: "TK", name: "Tokelau" },
            TO: { code: "TO", name: "Tonga" },
            TT: { code: "TT", name: "Trinidad and Tobago" },
            TN: { code: "TN", name: "Tunisia" },
            TR: { code: "TR", name: "Turkey" },
            TM: { code: "TM", name: "Turkmenistan" },
            TC: { code: "TC", name: "Turks and Caicos Islands" },
            TV: { code: "TV", name: "Tuvalu" },
            UG: { code: "UG", name: "Uganda" },
            UA: { code: "UA", name: "Ukraine" },
            AE: { code: "AE", name: "United Arab Emirates" },
            GB: { code: "GB", name: "United Kingdom" },
            US: { code: "US", name: "United States" },
            UM: { code: "UM", name: "United States Minor Outlying Islands" },
            UY: { code: "UY", name: "Uruguay" },
            UZ: { code: "UZ", name: "Uzbekistan" },
            VU: { code: "VU", name: "Vanuatu" },
            VE: { code: "VE", name: "Venezuela, Bolivarian Republic of" },
            VN: { code: "VN", name: "Viet Nam" },
            VG: { code: "VG", name: "Virgin Islands, British" },
            VI: { code: "VI", name: "Virgin Islands, U.S." },
            WF: { code: "WF", name: "Wallis and Futuna" },
            EH: { code: "EH", name: "Western Sahara" },
            YE: { code: "YE", name: "Yemen" },
            ZM: { code: "ZM", name: "Zambia" },
            ZW: { code: "ZW", name: "Zimbabwe" }
        }
    }

    //static instance;

    constructor() {
        super();
        if (!CountryCode.instance) {
            this.config = Object.assign({}, this.config, CountryCode.CONFIG);
            this.cache = CountryCode.MAP;
            this.initialized = true;
            CountryCode.instance = this;
        }
        return CountryCode.instance;
    }
}

window.CountryCode = CountryCode;
class StateProvince extends BusinessObject {
    static get CONFIG() {
        return {
            identifier: 'id',
            cadence: -1,
            fields: [
                new GridField({
                    name: "id",
                    label: TextFactory.get('code'),
                    identifier: true,
                    readonly: true,
                    type: "string"
                }),
                new GridField({
                    name: "name",
                    label: TextFactory.get('name'),
                    readonly: true,
                    type: "string"
                }),
                new GridField({
                    name: "country",
                    label: TextFactory.get('country'),
                    readonly: true,
                    type: "string"
                }),
                new GridField({
                    name: "alt",
                    label: TextFactory.get('alternate_names'),
                    readonly: true,
                    type: "stringarray"
                })
            ]
        };
    }

    /**
     * A map of states in US and canada
     * @return {*} a dictionary
     */
    static get MAP() {
        return {
            AL: { id: "AL", name: "Alabama", country: "US" },
            AK: { id: "AK", name: "Alaska", country: "US" },
            AZ: { id: "AZ", name: "Arizona", country: "US" },
            AR: { id: "AR", name: "Arkansas", country: "US" },
            CA: { id: "CA", name: "California", country: "US" },
            CO: { id: "CO", name: "Colorado", country: "US" },
            CT: { id: "CT", name: "Connecticut", country: "US" },
            DC: { id: "DC", name: "District of Columbia", country: "US", alt: ["Washington DC", "Washington D.C."] },
            DE: { id: "DE", name: "Delaware", country: "US" },
            FL: { id: "FL", name: "Florida", country: "US" },
            GA: { id: "GA", name: "Georgia", country: "US" },
            HI: { id: "HI", name: "Hawaii", country: "US" },
            ID: { id: "ID", name: "Idaho", country: "US" },
            IL: { id: "IL", name: "Illinois", country: "US" },
            IN: { id: "IN", name: "Indiana", country: "US" },
            IA: { id: "IA", name: "Iowa", country: "US" },
            KS: { id: "KS", name: "Kansas", country: "US" },
            KY: { id: "KY", name: "Kentucky", country: "US" },
            LA: { id: "LA", name: "Louisiana", country: "US" },
            ME: { id: "ME", name: "Maine", country: "US" },
            MD: { id: "MD", name: "Maryland", country: "US" },
            MA: { id: "MA", name: "Massachusetts", country: "US" },
            MI: { id: "MI", name: "Michigan", country: "US" },
            MN: { id: "MN", name: "Minnesota", country: "US" },
            MS: { id: "MS", name: "Mississippi", country: "US" },
            MO: { id: "MO", name: "Missouri", country: "US" },
            MT: { id: "MT", name: "Montana", country: "US" },
            NE: { id: "NE", name: "Nebraska", country: "US" },
            NV: { id: "NV", name: "Nevada", country: "US" },
            NH: { id: "NH", name: "New Hampshire", country: "US" },
            NJ: { id: "NJ", name: "New Jersey", country: "US" },
            NM: { id: "NM", name: "New Mexico", country: "US" },
            NY: { id: "NY", name: "New York", country: "US" },
            NC: { id: "NC", name: "North Carolina", country: "US" },
            ND: { id: "ND", name: "North Dakota", country: "US" },
            OH: { id: "OH", name: "Ohio", country: "US" },
            OK: { id: "OK", name: "Oklahoma", country: "US" },
            OR: { id: "OR", name: "Oregon", country: "US" },
            PA: { id: "PA", name: "Pennsylvania", country: "US" },
            RI: { id: "RI", name: "Rhode Island", country: "US" },
            SC: { id: "SC", name: "South Carolina", country: "US" },
            SD: { id: "SD", name: "South Dakota", country: "US" },
            TN: { id: "TN", name: "Tennessee", country: "US" },
            TX: { id: "TX", name: "Texas", country: "US" },
            UT: { id: "UT", name: "Utah", country: "US" },
            VT: { id: "VT", name: "Vermont", country: "US" },
            VA: { id: "VA", name: "Virginia", country: "US" },
            WA: { id: "WA", name: "Washington", country: "US" },
            WV: { id: "WV", name: "West Virginia", country: "US" },
            WI: { id: "WI", name: "Wisconsin", country: "US" },
            WY: { id: "WY", name: "Wyoming", country: "US" },
            AS: { id: "AS", name: "American Samoa", country: "US" },
            GU: { id: "GU", name: "Guam", country: "US" },
            MP: { id: "MP", name: "Northern Mariana Islands", country: "US" },
            PR: { id: "PR", name: "Puerto Rico", country: "US" },
            UM: { id: "UM", name: "United States Minor Outlying Islands", country: "US" },
            VI: { id: "VI", name: "Virgin Islands", country: "US" },

            AB: { id: "AB", name: "Alberta", country: "CA" },
            BC: { id: "BC", name: "British Columbia", country: "CA" },
            MB: { id: "MB", name: "Manitoba", country: "CA" },
            NB: { id: "NB", name: "New Brunswick", country: "CA" },
            NL: { id: "NL", name: "Newfoundland and Labrador", country: "CA", alt: ["Newfoundland","Labrador"] },
            NS: { id: "NS", name: "Nova Scotia", country: "CA" },
            NU: { id: "NU", name: "Nunavut", country: "CA" },
            NT: { id: "NT", name: "Northwest Territories", country: "CA" },
            ON: { id: "ON", name: "Ontario", country: "CA" },
            PE: { id: "PE", name: "Prince Edward Island", country: "CA" },
            QC: { id: "QC", name: "Quebec", country: "CA" },
            SK: { id: "SK", name: "Saskatchewan", country: "CA" },
            YT: { id: "YT", name: "Yukon", country: "CA" }
        };
    }

    /**
     * An array of United States states
     * @return {string[]}
     */
    static get US_STATES() {
        return ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "AS", "GU", "MP", "PR", "UM", "VI"];
    }

    /**
     * An array of Canadian states
     * @return {string[]}
     */
    static get CA_STATES() {
        return ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "NT", "ON", "PE", "QC", "SK", "YT"];
    }

    /**
     * Get a list of state dictionary elements.
     * @param filter Optional, either US or CA. If empty, returns all.
     * @return {Array} an array of state object definitions
     */
    set(filter) {
        let set = [];
        switch (filter) {
            case 'US':
                for (let s of StateProvince.US_STATES) {
                    set.push(this.get(s));
                }
                break;
            case 'CA':
                for (let s of StateProvince.CA_STATES) {
                    set.push(this.get(s));
                }
                break;
            default:
                for (let s of StateProvince.US_STATES) {
                    set.push(this.get(s));
                }
                for (let s of StateProvince.CA_STATES) {
                    set.push(this.get(s));
                }
                break;
        }

        set.sort((a, b) => {
            return this.sortfunction(a, b);
        });
        return set;
    }

    /**
     * Search the cache
     * @param text the text to search on.
     */
    static search(text) {
        if ((!text) || (text.length() < 1)) { return []; }

        let results = [];

        for (let k of Object.keys(StateProvince.MAP)) {
            let s = StateProvince.MAP[k];
            if (text.toUpperCase() === k) { // if the code matches, just slot it.
                results.push(s);
            } else if (s.name.toUpperCase().indexOf(text.toUpperCase()) >= 0) {
                results.push(s);
            } else if ((s.alt) && (s.alt.length > 0)) {
                let found = false;
                for (let i of s.alt) {
                    if ((!found) && (i.toUpperCase().indexOf(text.toUpperCase()) >= 0)) {
                        results.push(s);
                    }
                }
            }
        }
        return results;
    }

    //static instance;

    constructor() {
        super();
        if (!StateProvince.instance) {
            this.config = Object.assign({}, this.config, StateProvince.CONFIG);
            this.cache = StateProvince.MAP;
            this.initialized = true;
            StateProvince.instance = this;
        }
        return StateProvince.instance;
    }
}

window.StateProvince = StateProvince;
class TimeZoneDefinition extends BusinessObject {
    static get CONFIG() {
        return {
            identifier: 'id',
            cadence: -1,
            fields: [
                new GridField({
                    name: "id",
                    label: TextFactory.get('name'),
                    identifier: true,
                    readonly: true,
                    type: "string"
                }),
                new GridField({
                    name: "countrycode",
                    label: TextFactory.get('country_code'),
                    readonly: true,
                    type: "string"
                }),
                new GridField({
                    name: "country",
                    label: TextFactory.get('country'),
                    readonly: true,
                    type: "string"
                }),
                new GridField({
                    name: "name",
                    label: TextFactory.get('time_zone'),
                    readonly: true,
                    type: "string"
                }),
                new GridField({
                    name: "offset",
                    label: TextFactory.get('offset'),
                    readonly: true,
                    type: "string"
                })
            ],
            sortfunction: (a, b) => {
                if (a.tz > b.tz) { return 1 }
                if (a.tz < b.tz) { return -1 }
                return 0;
            }
        };
    }

    /**
     * Get the dictionary of the timezones.
     * @return a dictionary.
     */
    static get MAP() {
        return {
            "Asia/Kabul": { id: "Asia/Kabul", countrycode: "AF", country: "Afghanistan", name: "Asia/Kabul", offset: "UTC +04:30" },
            "Europe/Tirane": { id: "Europe/Tirane", countrycode: "AL", country: "Albania", name: "Europe/Tirane", offset: "UTC +01:00" },
            "Africa/Algiers": { id: "Africa/Algiers", countrycode: "DZ", country: "Algeria", name: "Africa/Algiers", offset: "UTC +01:00" },
            "Pacific/Pago_Pago": { id: "Pacific/Pago_Pago", countrycode: "AS", country: "American Samoa", name: "Pacific/Pago_Pago", offset: "UTC -11:00" },
            "Europe/Andorra": { id: "Europe/Andorra", countrycode: "AD", country: "Andorra", name: "Europe/Andorra", offset: "UTC +01:00" },
            "Africa/Luanda": { id: "Africa/Luanda", countrycode: "AO", country: "Angola", name: "Africa/Luanda", offset: "UTC +01:00" },
            "America/Anguilla": { id: "America/Anguilla", countrycode: "AI", country: "Anguilla", name: "America/Anguilla", offset: "UTC -04:00" },
            "Antarctica/Casey": { id: "Antarctica/Casey", countrycode: "AQ", country: "Antarctica", name: "Antarctica/Casey", offset: "UTC +08:00" },
            "Antarctica/Davis": { id: "Antarctica/Davis", countrycode: "AQ", country: "Antarctica", name: "Antarctica/Davis", offset: "UTC +07:00" },
            "Antarctica/DumontDUrville": { id: "Antarctica/DumontDUrville", countrycode: "AQ", country: "Antarctica", name: "Antarctica/DumontDUrville", offset: "UTC +10:00" },
            "Antarctica/Mawson": { id: "Antarctica/Mawson", countrycode: "AQ", country: "Antarctica", name: "Antarctica/Mawson", offset: "UTC +05:00" },
            "Antarctica/McMurdo": { id: "Antarctica/McMurdo", countrycode: "AQ", country: "Antarctica", name: "Antarctica/McMurdo", offset: "UTC +13:00" },
            "Antarctica/Palmer": { id: "Antarctica/Palmer", countrycode: "AQ", country: "Antarctica", name: "Antarctica/Palmer", offset: "UTC -03:00" },
            "Antarctica/Rothera": { id: "Antarctica/Rothera", countrycode: "AQ", country: "Antarctica", name: "Antarctica/Rothera", offset: "UTC -03:00" },
            "Antarctica/Syowa": { id: "Antarctica/Syowa", countrycode: "AQ", country: "Antarctica", name: "Antarctica/Syowa", offset: "UTC +03:00" },
            "Antarctica/Troll": { id: "Antarctica/Troll", countrycode: "AQ", country: "Antarctica", name: "Antarctica/Troll", offset: "UTC" },
            "Antarctica/Vostok": { id: "Antarctica/Vostok", countrycode: "AQ", country: "Antarctica", name: "Antarctica/Vostok", offset: "UTC +06:00" },
            "America/Antigua": { id: "America/Antigua", countrycode: "AG", country: "Antigua and Barbuda", name: "America/Antigua", offset: "UTC -04:00" },
            "America/Argentina/Buenos_Aires": { id: "America/Argentina/Buenos_Aires", countrycode: "AR", country: "Argentina", name: "America/Argentina/Buenos_Aires", offset: "UTC -03:00" },
            "America/Argentina/Catamarca": { id: "America/Argentina/Catamarca", countrycode: "AR", country: "Argentina", name: "America/Argentina/Catamarca", offset: "UTC -03:00" },
            "America/Argentina/Cordoba": { id: "America/Argentina/Cordoba", countrycode: "AR", country: "Argentina", name: "America/Argentina/Cordoba", offset: "UTC -03:00" },
            "America/Argentina/Jujuy": { id: "America/Argentina/Jujuy", countrycode: "AR", country: "Argentina", name: "America/Argentina/Jujuy", offset: "UTC -03:00" },
            "America/Argentina/La_Rioja": { id: "America/Argentina/La_Rioja", countrycode: "AR", country: "Argentina", name: "America/Argentina/La_Rioja", offset: "UTC -03:00" },
            "America/Argentina/Mendoza": { id: "America/Argentina/Mendoza", countrycode: "AR", country: "Argentina", name: "America/Argentina/Mendoza", offset: "UTC -03:00" },
            "America/Argentina/Rio_Gallegos": { id: "America/Argentina/Rio_Gallegos", countrycode: "AR", country: "Argentina", name: "America/Argentina/Rio_Gallegos", offset: "UTC -03:00" },
            "America/Argentina/Salta": { id: "America/Argentina/Salta", countrycode: "AR", country: "Argentina", name: "America/Argentina/Salta", offset: "UTC -03:00" },
            "America/Argentina/San_Juan": { id: "America/Argentina/San_Juan", countrycode: "AR", country: "Argentina", name: "America/Argentina/San_Juan", offset: "UTC -03:00" },
            "America/Argentina/San_Luis": { id: "America/Argentina/San_Luis", countrycode: "AR", country: "Argentina", name: "America/Argentina/San_Luis", offset: "UTC -03:00" },
            "America/Argentina/Tucuman": { id: "America/Argentina/Tucuman", countrycode: "AR", country: "Argentina", name: "America/Argentina/Tucuman", offset: "UTC -03:00" },
            "America/Argentina/Ushuaia": { id: "America/Argentina/Ushuaia", countrycode: "AR", country: "Argentina", name: "America/Argentina/Ushuaia", offset: "UTC -03:00" },
            "Asia/Yerevan": { id: "Asia/Yerevan", countrycode: "AM", country: "Armenia", name: "Asia/Yerevan", offset: "UTC +04:00" },
            "America/Aruba": { id: "America/Aruba", countrycode: "AW", country: "Aruba", name: "America/Aruba", offset: "UTC -04:00" },
            "Antarctica/Macquarie": { id: "Antarctica/Macquarie", countrycode: "AU", country: "Australia", name: "Antarctica/Macquarie", offset: "UTC +11:00" },
            "Australia/Adelaide": { id: "Australia/Adelaide", countrycode: "AU", country: "Australia", name: "Australia/Adelaide", offset: "UTC +10:30" },
            "Australia/Brisbane": { id: "Australia/Brisbane", countrycode: "AU", country: "Australia", name: "Australia/Brisbane", offset: "UTC +10:00" },
            "Australia/Broken_Hill": { id: "Australia/Broken_Hill", countrycode: "AU", country: "Australia", name: "Australia/Broken_Hill", offset: "UTC +10:30" },
            "Australia/Currie": { id: "Australia/Currie", countrycode: "AU", country: "Australia", name: "Australia/Currie", offset: "UTC +11:00" },
            "Australia/Darwin": { id: "Australia/Darwin", countrycode: "AU", country: "Australia", name: "Australia/Darwin", offset: "UTC +09:30" },
            "Australia/Eucla": { id: "Australia/Eucla", countrycode: "AU", country: "Australia", name: "Australia/Eucla", offset: "UTC +08:45" },
            "Australia/Hobart": { id: "Australia/Hobart", countrycode: "AU", country: "Australia", name: "Australia/Hobart", offset: "UTC +11:00" },
            "Australia/Lindeman": { id: "Australia/Lindeman", countrycode: "AU", country: "Australia", name: "Australia/Lindeman", offset: "UTC +10:00" },
            "Australia/Lord_Howe": { id: "Australia/Lord_Howe", countrycode: "AU", country: "Australia", name: "Australia/Lord_Howe", offset: "UTC +11:00" },
            "Australia/Melbourne": { id: "Australia/Melbourne", countrycode: "AU", country: "Australia", name: "Australia/Melbourne", offset: "UTC +11:00" },
            "Australia/Perth": { id: "Australia/Perth", countrycode: "AU", country: "Australia", name: "Australia/Perth", offset: "UTC +08:00" },
            "Australia/Sydney": { id: "Australia/Sydney", countrycode: "AU", country: "Australia", name: "Australia/Sydney", offset: "UTC +11:00" },
            "Europe/Vienna": { id: "Europe/Vienna", countrycode: "AT", country: "Austria", name: "Europe/Vienna", offset: "UTC +01:00" },
            "Asia/Baku": { id: "Asia/Baku", countrycode: "AZ", country: "Azerbaijan", name: "Asia/Baku", offset: "UTC +04:00" },
            "America/Nassau": { id: "America/Nassau", countrycode: "BS", country: "Bahamas", name: "America/Nassau", offset: "UTC -05:00" },
            "Asia/Bahrain": { id: "Asia/Bahrain", countrycode: "BH", country: "Bahrain", name: "Asia/Bahrain", offset: "UTC +03:00" },
            "Asia/Dhaka": { id: "Asia/Dhaka", countrycode: "BD", country: "Bangladesh", name: "Asia/Dhaka", offset: "UTC +06:00" },
            "America/Barbados": { id: "America/Barbados", countrycode: "BB", country: "Barbados", name: "America/Barbados", offset: "UTC -04:00" },
            "Europe/Minsk": { id: "Europe/Minsk", countrycode: "BY", country: "Belarus", name: "Europe/Minsk", offset: "UTC +03:00" },
            "Europe/Brussels": { id: "Europe/Brussels", countrycode: "BE", country: "Belgium", name: "Europe/Brussels", offset: "UTC +01:00" },
            "America/Belize": { id: "America/Belize", countrycode: "BZ", country: "Belize", name: "America/Belize", offset: "UTC -06:00" },
            "Africa/Porto-Novo": { id: "Africa/Porto-Novo", countrycode: "BJ", country: "Benin", name: "Africa/Porto-Novo", offset: "UTC +01:00" },
            "Atlantic/Bermuda": { id: "Atlantic/Bermuda", countrycode: "BM", country: "Bermuda", name: "Atlantic/Bermuda", offset: "UTC -04:00" },
            "Asia/Thimphu": { id: "Asia/Thimphu", countrycode: "BT", country: "Bhutan", name: "Asia/Thimphu", offset: "UTC +06:00" },
            "America/La_Paz": { id: "America/La_Paz", countrycode: "BO", country: "Bolivia, Plurinational State of", name: "America/La_Paz", offset: "UTC -04:00" },
            "America/Kralendijk": { id: "America/Kralendijk", countrycode: "BQ", country: "Bonaire, Sint Eustatius and Saba", name: "America/Kralendijk", offset: "UTC -04:00" },
            "Europe/Sarajevo": { id: "Europe/Sarajevo", countrycode: "BA", country: "Bosnia and Herzegovina", name: "Europe/Sarajevo", offset: "UTC +01:00" },
            "Africa/Gaborone": { id: "Africa/Gaborone", countrycode: "BW", country: "Botswana", name: "Africa/Gaborone", offset: "UTC +02:00" },
            "America/Araguaina": { id: "America/Araguaina", countrycode: "BR", country: "Brazil", name: "America/Araguaina", offset: "UTC -03:00" },
            "America/Bahia": { id: "America/Bahia", countrycode: "BR", country: "Brazil", name: "America/Bahia", offset: "UTC -03:00" },
            "America/Belem": { id: "America/Belem", countrycode: "BR", country: "Brazil", name: "America/Belem", offset: "UTC -03:00" },
            "America/Boa_Vista": { id: "America/Boa_Vista", countrycode: "BR", country: "Brazil", name: "America/Boa_Vista", offset: "UTC -04:00" },
            "America/Campo_Grande": { id: "America/Campo_Grande", countrycode: "BR", country: "Brazil", name: "America/Campo_Grande", offset: "UTC -04:00" },
            "America/Cuiaba": { id: "America/Cuiaba", countrycode: "BR", country: "Brazil", name: "America/Cuiaba", offset: "UTC -04:00" },
            "America/Eirunepe": { id: "America/Eirunepe", countrycode: "BR", country: "Brazil", name: "America/Eirunepe", offset: "UTC -05:00" },
            "America/Fortaleza": { id: "America/Fortaleza", countrycode: "BR", country: "Brazil", name: "America/Fortaleza", offset: "UTC -03:00" },
            "America/Maceio": { id: "America/Maceio", countrycode: "BR", country: "Brazil", name: "America/Maceio", offset: "UTC -03:00" },
            "America/Manaus": { id: "America/Manaus", countrycode: "BR", country: "Brazil", name: "America/Manaus", offset: "UTC -04:00" },
            "America/Noronha": { id: "America/Noronha", countrycode: "BR", country: "Brazil", name: "America/Noronha", offset: "UTC -02:00" },
            "America/Porto_Velho": { id: "America/Porto_Velho", countrycode: "BR", country: "Brazil", name: "America/Porto_Velho", offset: "UTC -04:00" },
            "America/Recife": { id: "America/Recife", countrycode: "BR", country: "Brazil", name: "America/Recife", offset: "UTC -03:00" },
            "America/Rio_Branco": { id: "America/Rio_Branco", countrycode: "BR", country: "Brazil", name: "America/Rio_Branco", offset: "UTC -05:00" },
            "America/Santarem": { id: "America/Santarem", countrycode: "BR", country: "Brazil", name: "America/Santarem", offset: "UTC -03:00" },
            "America/Sao_Paulo": { id: "America/Sao_Paulo", countrycode: "BR", country: "Brazil", name: "America/Sao_Paulo", offset: "UTC -03:00" },
            "Indian/Chagos": { id: "Indian/Chagos", countrycode: "IO", country: "British Indian Ocean Territory", name: "Indian/Chagos", offset: "UTC +06:00" },
            "Asia/Brunei": { id: "Asia/Brunei", countrycode: "BN", country: "Brunei Darussalam", name: "Asia/Brunei", offset: "UTC +08:00" },
            "Europe/Sofia": { id: "Europe/Sofia", countrycode: "BG", country: "Bulgaria", name: "Europe/Sofia", offset: "UTC +02:00" },
            "Africa/Ouagadougou": { id: "Africa/Ouagadougou", countrycode: "BF", country: "Burkina Faso", name: "Africa/Ouagadougou", offset: "UTC" },
            "Africa/Bujumbura": { id: "Africa/Bujumbura", countrycode: "BI", country: "Burundi", name: "Africa/Bujumbura", offset: "UTC +02:00" },
            "Asia/Phnom_Penh": { id: "Asia/Phnom_Penh", countrycode: "KH", country: "Cambodia", name: "Asia/Phnom_Penh", offset: "UTC +07:00" },
            "Africa/Douala": { id: "Africa/Douala", countrycode: "CM", country: "Cameroon", name: "Africa/Douala", offset: "UTC +01:00" },
            "America/Atikokan": { id: "America/Atikokan", countrycode: "CA", country: "Canada", name: "America/Atikokan", offset: "UTC -05:00" },
            "America/Blanc-Sablon": { id: "America/Blanc-Sablon", countrycode: "CA", country: "Canada", name: "America/Blanc-Sablon", offset: "UTC -04:00" },
            "America/Cambridge_Bay": { id: "America/Cambridge_Bay", countrycode: "CA", country: "Canada", name: "America/Cambridge_Bay", offset: "UTC -07:00" },
            "America/Creston": { id: "America/Creston", countrycode: "CA", country: "Canada", name: "America/Creston", offset: "UTC -07:00" },
            "America/Dawson": { id: "America/Dawson", countrycode: "CA", country: "Canada", name: "America/Dawson", offset: "UTC -08:00" },
            "America/Dawson_Creek": { id: "America/Dawson_Creek", countrycode: "CA", country: "Canada", name: "America/Dawson_Creek", offset: "UTC -07:00" },
            "America/Edmonton": { id: "America/Edmonton", countrycode: "CA", country: "Canada", name: "America/Edmonton", offset: "UTC -07:00" },
            "America/Fort_Nelson": { id: "America/Fort_Nelson", countrycode: "CA", country: "Canada", name: "America/Fort_Nelson", offset: "UTC -07:00" },
            "America/Glace_Bay": { id: "America/Glace_Bay", countrycode: "CA", country: "Canada", name: "America/Glace_Bay", offset: "UTC -04:00" },
            "America/Goose_Bay": { id: "America/Goose_Bay", countrycode: "CA", country: "Canada", name: "America/Goose_Bay", offset: "UTC -04:00" },
            "America/Halifax": { id: "America/Halifax", countrycode: "CA", country: "Canada", name: "America/Halifax", offset: "UTC -04:00" },
            "America/Inuvik": { id: "America/Inuvik", countrycode: "CA", country: "Canada", name: "America/Inuvik", offset: "UTC -07:00" },
            "America/Iqaluit": { id: "America/Iqaluit", countrycode: "CA", country: "Canada", name: "America/Iqaluit", offset: "UTC -05:00" },
            "America/Moncton": { id: "America/Moncton", countrycode: "CA", country: "Canada", name: "America/Moncton", offset: "UTC -04:00" },
            "America/Nipigon": { id: "America/Nipigon", countrycode: "CA", country: "Canada", name: "America/Nipigon", offset: "UTC -05:00" },
            "America/Pangnirtung": { id: "America/Pangnirtung", countrycode: "CA", country: "Canada", name: "America/Pangnirtung", offset: "UTC -05:00" },
            "America/Rainy_River": { id: "America/Rainy_River", countrycode: "CA", country: "Canada", name: "America/Rainy_River", offset: "UTC -06:00" },
            "America/Rankin_Inlet": { id: "America/Rankin_Inlet", countrycode: "CA", country: "Canada", name: "America/Rankin_Inlet", offset: "UTC -06:00" },
            "America/Regina": { id: "America/Regina", countrycode: "CA", country: "Canada", name: "America/Regina", offset: "UTC -06:00" },
            "America/Resolute": { id: "America/Resolute", countrycode: "CA", country: "Canada", name: "America/Resolute", offset: "UTC -06:00" },
            "America/St_Johns": { id: "America/St_Johns", countrycode: "CA", country: "Canada", name: "America/St_Johns", offset: "UTC -03:30" },
            "America/Swift_Current": { id: "America/Swift_Current", countrycode: "CA", country: "Canada", name: "America/Swift_Current", offset: "UTC -06:00" },
            "America/Thunder_Bay": { id: "America/Thunder_Bay", countrycode: "CA", country: "Canada", name: "America/Thunder_Bay", offset: "UTC -05:00" },
            "America/Toronto": { id: "America/Toronto", countrycode: "CA", country: "Canada", name: "America/Toronto", offset: "UTC -05:00" },
            "America/Vancouver": { id: "America/Vancouver", countrycode: "CA", country: "Canada", name: "America/Vancouver", offset: "UTC -08:00" },
            "America/Whitehorse": { id: "America/Whitehorse", countrycode: "CA", country: "Canada", name: "America/Whitehorse", offset: "UTC -08:00" },
            "America/Winnipeg": { id: "America/Winnipeg", countrycode: "CA", country: "Canada", name: "America/Winnipeg", offset: "UTC -06:00" },
            "America/Yellowknife": { id: "America/Yellowknife", countrycode: "CA", country: "Canada", name: "America/Yellowknife", offset: "UTC -07:00" },
            "Atlantic/Cape_Verde": { id: "Atlantic/Cape_Verde", countrycode: "CV", country: "Cape Verde", name: "Atlantic/Cape_Verde", offset: "UTC -01:00" },
            "America/Cayman": { id: "America/Cayman", countrycode: "KY", country: "Cayman Islands", name: "America/Cayman", offset: "UTC -05:00" },
            "Africa/Bangui": { id: "Africa/Bangui", countrycode: "CF", country: "Central African Republic", name: "Africa/Bangui", offset: "UTC +01:00" },
            "Africa/Ndjamena": { id: "Africa/Ndjamena", countrycode: "TD", country: "Chad", name: "Africa/Ndjamena", offset: "UTC +01:00" },
            "America/Punta_Arenas": { id: "America/Punta_Arenas", countrycode: "CL", country: "Chile", name: "America/Punta_Arenas", offset: "UTC -03:00" },
            "America/Santiago": { id: "America/Santiago", countrycode: "CL", country: "Chile", name: "America/Santiago", offset: "UTC -03:00" },
            "Pacific/Easter": { id: "Pacific/Easter", countrycode: "CL", country: "Chile", name: "Pacific/Easter", offset: "UTC -05:00" },
            "Asia/Shanghai": { id: "Asia/Shanghai", countrycode: "CN", country: "China", name: "Asia/Shanghai", offset: "UTC +08:00" },
            "Asia/Urumqi": { id: "Asia/Urumqi", countrycode: "CN", country: "China", name: "Asia/Urumqi", offset: "UTC +06:00" },
            "Indian/Christmas": { id: "Indian/Christmas", countrycode: "CX", country: "Christmas Island", name: "Indian/Christmas", offset: "UTC +07:00" },
            "Indian/Cocos": { id: "Indian/Cocos", countrycode: "CC", country: "Cocos (Keeling) Islands", name: "Indian/Cocos", offset: "UTC +06:30" },
            "America/Bogota": { id: "America/Bogota", countrycode: "CO", country: "Colombia", name: "America/Bogota", offset: "UTC -05:00" },
            "Indian/Comoro": { id: "Indian/Comoro", countrycode: "KM", country: "Comoros", name: "Indian/Comoro", offset: "UTC +03:00" },
            "Africa/Brazzaville": { id: "Africa/Brazzaville", countrycode: "CG", country: "Congo", name: "Africa/Brazzaville", offset: "UTC +01:00" },
            "Africa/Kinshasa": { id: "Africa/Kinshasa", countrycode: "CD", country: "Congo, the Democratic Republic of the", name: "Africa/Kinshasa", offset: "UTC +01:00" },
            "Africa/Lubumbashi": { id: "Africa/Lubumbashi", countrycode: "CD", country: "Congo, the Democratic Republic of the", name: "Africa/Lubumbashi", offset: "UTC +02:00" },
            "Pacific/Rarotonga": { id: "Pacific/Rarotonga", countrycode: "CK", country: "Cook Islands", name: "Pacific/Rarotonga", offset: "UTC -10:00" },
            "America/Costa_Rica": { id: "America/Costa_Rica", countrycode: "CR", country: "Costa Rica", name: "America/Costa_Rica", offset: "UTC -06:00" },
            "Europe/Zagreb": { id: "Europe/Zagreb", countrycode: "HR", country: "Croatia", name: "Europe/Zagreb", offset: "UTC +01:00" },
            "America/Havana": { id: "America/Havana", countrycode: "CU", country: "Cuba", name: "America/Havana", offset: "UTC -05:00" },
            "America/Curacao": { id: "America/Curacao", countrycode: "CW", country: "Curaçao", name: "America/Curacao", offset: "UTC -04:00" },
            "Asia/Famagusta": { id: "Asia/Famagusta", countrycode: "CY", country: "Cyprus", name: "Asia/Famagusta", offset: "UTC +02:00" },
            "Asia/Nicosia": { id: "Asia/Nicosia", countrycode: "CY", country: "Cyprus", name: "Asia/Nicosia", offset: "UTC +02:00" },
            "Europe/Prague": { id: "Europe/Prague", countrycode: "CZ", country: "Czech Republic", name: "Europe/Prague", offset: "UTC +01:00" },
            "Africa/Abidjan": { id: "Africa/Abidjan", countrycode: "CI", country: "Côte d'Ivoire", name: "Africa/Abidjan", offset: "UTC" },
            "Europe/Copenhagen": { id: "Europe/Copenhagen", countrycode: "DK", country: "Denmark", name: "Europe/Copenhagen", offset: "UTC +01:00" },
            "Africa/Djibouti": { id: "Africa/Djibouti", countrycode: "DJ", country: "Djibouti", name: "Africa/Djibouti", offset: "UTC +03:00" },
            "America/Dominica": { id: "America/Dominica", countrycode: "DM", country: "Dominica", name: "America/Dominica", offset: "UTC -04:00" },
            "America/Santo_Domingo": { id: "America/Santo_Domingo", countrycode: "DO", country: "Dominican Republic", name: "America/Santo_Domingo", offset: "UTC -04:00" },
            "America/Guayaquil": { id: "America/Guayaquil", countrycode: "EC", country: "Ecuador", name: "America/Guayaquil", offset: "UTC -05:00" },
            "Pacific/Galapagos": { id: "Pacific/Galapagos", countrycode: "EC", country: "Ecuador", name: "Pacific/Galapagos", offset: "UTC -06:00" },
            "Africa/Cairo": { id: "Africa/Cairo", countrycode: "EG", country: "Egypt", name: "Africa/Cairo", offset: "UTC +02:00" },
            "America/El_Salvador": { id: "America/El_Salvador", countrycode: "SV", country: "El Salvador", name: "America/El_Salvador", offset: "UTC -06:00" },
            "Africa/Malabo": { id: "Africa/Malabo", countrycode: "GQ", country: "Equatorial Guinea", name: "Africa/Malabo", offset: "UTC +01:00" },
            "Africa/Asmara": { id: "Africa/Asmara", countrycode: "ER", country: "Eritrea", name: "Africa/Asmara", offset: "UTC +03:00" },
            "Europe/Tallinn": { id: "Europe/Tallinn", countrycode: "EE", country: "Estonia", name: "Europe/Tallinn", offset: "UTC +02:00" },
            "Africa/Addis_Ababa": { id: "Africa/Addis_Ababa", countrycode: "ET", country: "Ethiopia", name: "Africa/Addis_Ababa", offset: "UTC +03:00" },
            "Atlantic/Stanley": { id: "Atlantic/Stanley", countrycode: "FK", country: "Falkland Islands (Malvinas)", name: "Atlantic/Stanley", offset: "UTC -03:00" },
            "Atlantic/Faroe": { id: "Atlantic/Faroe", countrycode: "FO", country: "Faroe Islands", name: "Atlantic/Faroe", offset: "UTC" },
            "Pacific/Fiji": { id: "Pacific/Fiji", countrycode: "FJ", country: "Fiji", name: "Pacific/Fiji", offset: "UTC +12:00" },
            "Europe/Helsinki": { id: "Europe/Helsinki", countrycode: "FI", country: "Finland", name: "Europe/Helsinki", offset: "UTC +02:00" },
            "Europe/Paris": { id: "Europe/Paris", countrycode: "FR", country: "France", name: "Europe/Paris", offset: "UTC +01:00" },
            "America/Cayenne": { id: "America/Cayenne", countrycode: "GF", country: "French Guiana", name: "America/Cayenne", offset: "UTC -03:00" },
            "Pacific/Gambier": { id: "Pacific/Gambier", countrycode: "PF", country: "French Polynesia", name: "Pacific/Gambier", offset: "UTC -09:00" },
            "Pacific/Marquesas": { id: "Pacific/Marquesas", countrycode: "PF", country: "French Polynesia", name: "Pacific/Marquesas", offset: "UTC -09:30" },
            "Pacific/Tahiti": { id: "Pacific/Tahiti", countrycode: "PF", country: "French Polynesia", name: "Pacific/Tahiti", offset: "UTC -10:00" },
            "Indian/Kerguelen": { id: "Indian/Kerguelen", countrycode: "TF", country: "French Southern Territories", name: "Indian/Kerguelen", offset: "UTC +05:00" },
            "Africa/Libreville": { id: "Africa/Libreville", countrycode: "GA", country: "Gabon", name: "Africa/Libreville", offset: "UTC +01:00" },
            "Africa/Banjul": { id: "Africa/Banjul", countrycode: "GM", country: "Gambia", name: "Africa/Banjul", offset: "UTC" },
            "Asia/Tbilisi": { id: "Asia/Tbilisi", countrycode: "GE", country: "Georgia", name: "Asia/Tbilisi", offset: "UTC +04:00" },
            "Europe/Berlin": { id: "Europe/Berlin", countrycode: "DE", country: "Germany", name: "Europe/Berlin", offset: "UTC +01:00" },
            "Europe/Busingen": { id: "Europe/Busingen", countrycode: "DE", country: "Germany", name: "Europe/Busingen", offset: "UTC +01:00" },
            "Africa/Accra": { id: "Africa/Accra", countrycode: "GH", country: "Ghana", name: "Africa/Accra", offset: "UTC" },
            "Europe/Gibraltar": { id: "Europe/Gibraltar", countrycode: "GI", country: "Gibraltar", name: "Europe/Gibraltar", offset: "UTC +01:00" },
            "Europe/Athens": { id: "Europe/Athens", countrycode: "GR", country: "Greece", name: "Europe/Athens", offset: "UTC +02:00" },
            "America/Danmarkshavn": { id: "America/Danmarkshavn", countrycode: "GL", country: "Greenland", name: "America/Danmarkshavn", offset: "UTC" },
            "America/Godthab": { id: "America/Godthab", countrycode: "GL", country: "Greenland", name: "America/Godthab", offset: "UTC -03:00" },
            "America/Scoresbysund": { id: "America/Scoresbysund", countrycode: "GL", country: "Greenland", name: "America/Scoresbysund", offset: "UTC -01:00" },
            "America/Thule": { id: "America/Thule", countrycode: "GL", country: "Greenland", name: "America/Thule", offset: "UTC -04:00" },
            "America/Grenada": { id: "America/Grenada", countrycode: "GD", country: "Grenada", name: "America/Grenada", offset: "UTC -04:00" },
            "America/Guadeloupe": { id: "America/Guadeloupe", countrycode: "GP", country: "Guadeloupe", name: "America/Guadeloupe", offset: "UTC -04:00" },
            "Pacific/Guam": { id: "Pacific/Guam", countrycode: "GU", country: "Guam", name: "Pacific/Guam", offset: "UTC +10:00" },
            "America/Guatemala": { id: "America/Guatemala", countrycode: "GT", country: "Guatemala", name: "America/Guatemala", offset: "UTC -06:00" },
            "Europe/Guernsey": { id: "Europe/Guernsey", countrycode: "GG", country: "Guernsey", name: "Europe/Guernsey", offset: "UTC" },
            "Africa/Conakry": { id: "Africa/Conakry", countrycode: "GN", country: "Guinea", name: "Africa/Conakry", offset: "UTC" },
            "Africa/Bissau": { id: "Africa/Bissau", countrycode: "GW", country: "Guinea-Bissau", name: "Africa/Bissau", offset: "UTC" },
            "America/Guyana": { id: "America/Guyana", countrycode: "GY", country: "Guyana", name: "America/Guyana", offset: "UTC -04:00" },
            "America/Port-au-Prince": { id: "America/Port-au-Prince", countrycode: "HT", country: "Haiti", name: "America/Port-au-Prince", offset: "UTC -05:00" },
            "Europe/Vatican": { id: "Europe/Vatican", countrycode: "VA", country: "Holy See (Vatican City State)", name: "Europe/Vatican", offset: "UTC +01:00" },
            "America/Tegucigalpa": { id: "America/Tegucigalpa", countrycode: "HN", country: "Honduras", name: "America/Tegucigalpa", offset: "UTC -06:00" },
            "Asia/Hong_Kong": { id: "Asia/Hong_Kong", countrycode: "HK", country: "Hong Kong", name: "Asia/Hong_Kong", offset: "UTC +08:00" },
            "Europe/Budapest": { id: "Europe/Budapest", countrycode: "HU", country: "Hungary", name: "Europe/Budapest", offset: "UTC +01:00" },
            "Atlantic/Reykjavik": { id: "Atlantic/Reykjavik", countrycode: "IS", country: "Iceland", name: "Atlantic/Reykjavik", offset: "UTC" },
            "Asia/Kolkata": { id: "Asia/Kolkata", countrycode: "IN", country: "India", name: "Asia/Kolkata", offset: "UTC +05:30" },
            "Asia/Jakarta": { id: "Asia/Jakarta", countrycode: "ID", country: "Indonesia", name: "Asia/Jakarta", offset: "UTC +07:00" },
            "Asia/Jayapura": { id: "Asia/Jayapura", countrycode: "ID", country: "Indonesia", name: "Asia/Jayapura", offset: "UTC +09:00" },
            "Asia/Makassar": { id: "Asia/Makassar", countrycode: "ID", country: "Indonesia", name: "Asia/Makassar", offset: "UTC +08:00" },
            "Asia/Pontianak": { id: "Asia/Pontianak", countrycode: "ID", country: "Indonesia", name: "Asia/Pontianak", offset: "UTC +07:00" },
            "Asia/Tehran": { id: "Asia/Tehran", countrycode: "IR", country: "Iran, Islamic Republic of", name: "Asia/Tehran", offset: "UTC +03:30" },
            "Asia/Baghdad": { id: "Asia/Baghdad", countrycode: "IQ", country: "Iraq", name: "Asia/Baghdad", offset: "UTC +03:00" },
            "Europe/Dublin": { id: "Europe/Dublin", countrycode: "IE", country: "Ireland", name: "Europe/Dublin", offset: "UTC" },
            "Europe/Isle_of_Man": { id: "Europe/Isle_of_Man", countrycode: "IM", country: "Isle of Man", name: "Europe/Isle_of_Man", offset: "UTC" },
            "Asia/Jerusalem": { id: "Asia/Jerusalem", countrycode: "IL", country: "Israel", name: "Asia/Jerusalem", offset: "UTC +02:00" },
            "Europe/Rome": { id: "Europe/Rome", countrycode: "IT", country: "Italy", name: "Europe/Rome", offset: "UTC +01:00" },
            "America/Jamaica": { id: "America/Jamaica", countrycode: "JM", country: "Jamaica", name: "America/Jamaica", offset: "UTC -05:00" },
            "Asia/Tokyo": { id: "Asia/Tokyo", countrycode: "JP", country: "Japan", name: "Asia/Tokyo", offset: "UTC +09:00" },
            "Europe/Jersey": { id: "Europe/Jersey", countrycode: "JE", country: "Jersey", name: "Europe/Jersey", offset: "UTC" },
            "Asia/Amman": { id: "Asia/Amman", countrycode: "JO", country: "Jordan", name: "Asia/Amman", offset: "UTC +02:00" },
            "Asia/Almaty": { id: "Asia/Almaty", countrycode: "KZ", country: "Kazakhstan", name: "Asia/Almaty", offset: "UTC +06:00" },
            "Asia/Aqtau": { id: "Asia/Aqtau", countrycode: "KZ", country: "Kazakhstan", name: "Asia/Aqtau", offset: "UTC +05:00" },
            "Asia/Aqtobe": { id: "Asia/Aqtobe", countrycode: "KZ", country: "Kazakhstan", name: "Asia/Aqtobe", offset: "UTC +05:00" },
            "Asia/Atyrau": { id: "Asia/Atyrau", countrycode: "KZ", country: "Kazakhstan", name: "Asia/Atyrau", offset: "UTC +05:00" },
            "Asia/Oral": { id: "Asia/Oral", countrycode: "KZ", country: "Kazakhstan", name: "Asia/Oral", offset: "UTC +05:00" },
            "Asia/Qostanay": { id: "Asia/Qostanay", countrycode: "KZ", country: "Kazakhstan", name: "Asia/Qostanay", offset: "UTC +06:00" },
            "Asia/Qyzylorda": { id: "Asia/Qyzylorda", countrycode: "KZ", country: "Kazakhstan", name: "Asia/Qyzylorda", offset: "UTC +05:00" },
            "Africa/Nairobi": { id: "Africa/Nairobi", countrycode: "KE", country: "Kenya", name: "Africa/Nairobi", offset: "UTC +03:00" },
            "Pacific/Enderbury": { id: "Pacific/Enderbury", countrycode: "KI", country: "Kiribati", name: "Pacific/Enderbury", offset: "UTC +13:00" },
            "Pacific/Kiritimati": { id: "Pacific/Kiritimati", countrycode: "KI", country: "Kiribati", name: "Pacific/Kiritimati", offset: "UTC +14:00" },
            "Pacific/Tarawa": { id: "Pacific/Tarawa", countrycode: "KI", country: "Kiribati", name: "Pacific/Tarawa", offset: "UTC +12:00" },
            "Asia/Pyongyang": { id: "Asia/Pyongyang", countrycode: "KP", country: "Korea, Democratic People's Republic of", name: "Asia/Pyongyang", offset: "UTC +09:00" },
            "Asia/Seoul": { id: "Asia/Seoul", countrycode: "KR", country: "Korea, Republic of", name: "Asia/Seoul", offset: "UTC +09:00" },
            "Asia/Kuwait": { id: "Asia/Kuwait", countrycode: "KW", country: "Kuwait", name: "Asia/Kuwait", offset: "UTC +03:00" },
            "Asia/Bishkek": { id: "Asia/Bishkek", countrycode: "KG", country: "Kyrgyzstan", name: "Asia/Bishkek", offset: "UTC +06:00" },
            "Asia/Vientiane": { id: "Asia/Vientiane", countrycode: "LA", country: "Lao People's Democratic Republic", name: "Asia/Vientiane", offset: "UTC +07:00" },
            "Europe/Riga": { id: "Europe/Riga", countrycode: "LV", country: "Latvia", name: "Europe/Riga", offset: "UTC +02:00" },
            "Asia/Beirut": { id: "Asia/Beirut", countrycode: "LB", country: "Lebanon", name: "Asia/Beirut", offset: "UTC +02:00" },
            "Africa/Maseru": { id: "Africa/Maseru", countrycode: "LS", country: "Lesotho", name: "Africa/Maseru", offset: "UTC +02:00" },
            "Africa/Monrovia": { id: "Africa/Monrovia", countrycode: "LR", country: "Liberia", name: "Africa/Monrovia", offset: "UTC" },
            "Africa/Tripoli": { id: "Africa/Tripoli", countrycode: "LY", country: "Libya", name: "Africa/Tripoli", offset: "UTC +02:00" },
            "Europe/Vaduz": { id: "Europe/Vaduz", countrycode: "LI", country: "Liechtenstein", name: "Europe/Vaduz", offset: "UTC +01:00" },
            "Europe/Vilnius": { id: "Europe/Vilnius", countrycode: "LT", country: "Lithuania", name: "Europe/Vilnius", offset: "UTC +02:00" },
            "Europe/Luxembourg": { id: "Europe/Luxembourg", countrycode: "LU", country: "Luxembourg", name: "Europe/Luxembourg", offset: "UTC +01:00" },
            "Asia/Macau": { id: "Asia/Macau", countrycode: "MO", country: "Macao", name: "Asia/Macau", offset: "UTC +08:00" },
            "Europe/Skopje": { id: "Europe/Skopje", countrycode: "MK", country: "Macedonia, the Former Yugoslav Republic of", name: "Europe/Skopje", offset: "UTC +01:00" },
            "Indian/Antananarivo": { id: "Indian/Antananarivo", countrycode: "MG", country: "Madagascar", name: "Indian/Antananarivo", offset: "UTC +03:00" },
            "Africa/Blantyre": { id: "Africa/Blantyre", countrycode: "MW", country: "Malawi", name: "Africa/Blantyre", offset: "UTC +02:00" },
            "Asia/Kuala_Lumpur": { id: "Asia/Kuala_Lumpur", countrycode: "MY", country: "Malaysia", name: "Asia/Kuala_Lumpur", offset: "UTC +08:00" },
            "Asia/Kuching": { id: "Asia/Kuching", countrycode: "MY", country: "Malaysia", name: "Asia/Kuching", offset: "UTC +08:00" },
            "Indian/Maldives": { id: "Indian/Maldives", countrycode: "MV", country: "Maldives", name: "Indian/Maldives", offset: "UTC +05:00" },
            "Africa/Bamako": { id: "Africa/Bamako", countrycode: "ML", country: "Mali", name: "Africa/Bamako", offset: "UTC" },
            "Europe/Malta": { id: "Europe/Malta", countrycode: "MT", country: "Malta", name: "Europe/Malta", offset: "UTC +01:00" },
            "Pacific/Kwajalein": { id: "Pacific/Kwajalein", countrycode: "MH", country: "Marshall Islands", name: "Pacific/Kwajalein", offset: "UTC +12:00" },
            "Pacific/Majuro": { id: "Pacific/Majuro", countrycode: "MH", country: "Marshall Islands", name: "Pacific/Majuro", offset: "UTC +12:00" },
            "America/Martinique": { id: "America/Martinique", countrycode: "MQ", country: "Martinique", name: "America/Martinique", offset: "UTC -04:00" },
            "Africa/Nouakchott": { id: "Africa/Nouakchott", countrycode: "MR", country: "Mauritania", name: "Africa/Nouakchott", offset: "UTC" },
            "Indian/Mauritius": { id: "Indian/Mauritius", countrycode: "MU", country: "Mauritius", name: "Indian/Mauritius", offset: "UTC +04:00" },
            "Indian/Mayotte": { id: "Indian/Mayotte", countrycode: "YT", country: "Mayotte", name: "Indian/Mayotte", offset: "UTC +03:00" },
            "America/Bahia_Banderas": { id: "America/Bahia_Banderas", countrycode: "MX", country: "Mexico", name: "America/Bahia_Banderas", offset: "UTC -06:00" },
            "America/Cancun": { id: "America/Cancun", countrycode: "MX", country: "Mexico", name: "America/Cancun", offset: "UTC -05:00" },
            "America/Chihuahua": { id: "America/Chihuahua", countrycode: "MX", country: "Mexico", name: "America/Chihuahua", offset: "UTC -07:00" },
            "America/Hermosillo": { id: "America/Hermosillo", countrycode: "MX", country: "Mexico", name: "America/Hermosillo", offset: "UTC -07:00" },
            "America/Matamoros": { id: "America/Matamoros", countrycode: "MX", country: "Mexico", name: "America/Matamoros", offset: "UTC -06:00" },
            "America/Mazatlan": { id: "America/Mazatlan", countrycode: "MX", country: "Mexico", name: "America/Mazatlan", offset: "UTC -07:00" },
            "America/Merida": { id: "America/Merida", countrycode: "MX", country: "Mexico", name: "America/Merida", offset: "UTC -06:00" },
            "America/Mexico_City": { id: "America/Mexico_City", countrycode: "MX", country: "Mexico", name: "America/Mexico_City", offset: "UTC -06:00" },
            "America/Monterrey": { id: "America/Monterrey", countrycode: "MX", country: "Mexico", name: "America/Monterrey", offset: "UTC -06:00" },
            "America/Ojinaga": { id: "America/Ojinaga", countrycode: "MX", country: "Mexico", name: "America/Ojinaga", offset: "UTC -07:00" },
            "America/Tijuana": { id: "America/Tijuana", countrycode: "MX", country: "Mexico", name: "America/Tijuana", offset: "UTC -08:00" },
            "Pacific/Chuuk": { id: "Pacific/Chuuk", countrycode: "FM", country: "Micronesia, Federated States of", name: "Pacific/Chuuk", offset: "UTC +10:00" },
            "Pacific/Kosrae": { id: "Pacific/Kosrae", countrycode: "FM", country: "Micronesia, Federated States of", name: "Pacific/Kosrae", offset: "UTC +11:00" },
            "Pacific/Pohnpei": { id: "Pacific/Pohnpei", countrycode: "FM", country: "Micronesia, Federated States of", name: "Pacific/Pohnpei", offset: "UTC +11:00" },
            "Europe/Chisinau": { id: "Europe/Chisinau", countrycode: "MD", country: "Moldova, Republic of", name: "Europe/Chisinau", offset: "UTC +02:00" },
            "Europe/Monaco": { id: "Europe/Monaco", countrycode: "MC", country: "Monaco", name: "Europe/Monaco", offset: "UTC +01:00" },
            "Asia/Choibalsan": { id: "Asia/Choibalsan", countrycode: "MN", country: "Mongolia", name: "Asia/Choibalsan", offset: "UTC +08:00" },
            "Asia/Hovd": { id: "Asia/Hovd", countrycode: "MN", country: "Mongolia", name: "Asia/Hovd", offset: "UTC +07:00" },
            "Asia/Ulaanbaatar": { id: "Asia/Ulaanbaatar", countrycode: "MN", country: "Mongolia", name: "Asia/Ulaanbaatar", offset: "UTC +08:00" },
            "Europe/Podgorica": { id: "Europe/Podgorica", countrycode: "ME", country: "Montenegro", name: "Europe/Podgorica", offset: "UTC +01:00" },
            "America/Montserrat": { id: "America/Montserrat", countrycode: "MS", country: "Montserrat", name: "America/Montserrat", offset: "UTC -04:00" },
            "Africa/Casablanca": { id: "Africa/Casablanca", countrycode: "MA", country: "Morocco", name: "Africa/Casablanca", offset: "UTC +01:00" },
            "Africa/Maputo": { id: "Africa/Maputo", countrycode: "MZ", country: "Mozambique", name: "Africa/Maputo", offset: "UTC +02:00" },
            "Asia/Yangon": { id: "Asia/Yangon", countrycode: "MM", country: "Myanmar", name: "Asia/Yangon", offset: "UTC +06:30" },
            "Africa/Windhoek": { id: "Africa/Windhoek", countrycode: "NA", country: "Namibia", name: "Africa/Windhoek", offset: "UTC +02:00" },
            "Pacific/Nauru": { id: "Pacific/Nauru", countrycode: "NR", country: "Nauru", name: "Pacific/Nauru", offset: "UTC +12:00" },
            "Asia/Kathmandu": { id: "Asia/Kathmandu", countrycode: "NP", country: "Nepal", name: "Asia/Kathmandu", offset: "UTC +05:45" },
            "Europe/Amsterdam": { id: "Europe/Amsterdam", countrycode: "NL", country: "Netherlands", name: "Europe/Amsterdam", offset: "UTC +01:00" },
            "Pacific/Noumea": { id: "Pacific/Noumea", countrycode: "NC", country: "New Caledonia", name: "Pacific/Noumea", offset: "UTC +11:00" },
            "Pacific/Auckland": { id: "Pacific/Auckland", countrycode: "NZ", country: "New Zealand", name: "Pacific/Auckland", offset: "UTC +13:00" },
            "Pacific/Chatham": { id: "Pacific/Chatham", countrycode: "NZ", country: "New Zealand", name: "Pacific/Chatham", offset: "UTC +13:45" },
            "America/Managua": { id: "America/Managua", countrycode: "NI", country: "Nicaragua", name: "America/Managua", offset: "UTC -06:00" },
            "Africa/Niamey": { id: "Africa/Niamey", countrycode: "NE", country: "Niger", name: "Africa/Niamey", offset: "UTC +01:00" },
            "Africa/Lagos": { id: "Africa/Lagos", countrycode: "NG", country: "Nigeria", name: "Africa/Lagos", offset: "UTC +01:00" },
            "Pacific/Niue": { id: "Pacific/Niue", countrycode: "NU", country: "Niue", name: "Pacific/Niue", offset: "UTC -11:00" },
            "Pacific/Norfolk": { id: "Pacific/Norfolk", countrycode: "NF", country: "Norfolk Island", name: "Pacific/Norfolk", offset: "UTC +12:00" },
            "Pacific/Saipan": { id: "Pacific/Saipan", countrycode: "MP", country: "Northern Mariana Islands", name: "Pacific/Saipan", offset: "UTC +10:00" },
            "Europe/Oslo": { id: "Europe/Oslo", countrycode: "NO", country: "Norway", name: "Europe/Oslo", offset: "UTC +01:00" },
            "Asia/Muscat": { id: "Asia/Muscat", countrycode: "OM", country: "Oman", name: "Asia/Muscat", offset: "UTC +04:00" },
            "Asia/Karachi": { id: "Asia/Karachi", countrycode: "PK", country: "Pakistan", name: "Asia/Karachi", offset: "UTC +05:00" },
            "Pacific/Palau": { id: "Pacific/Palau", countrycode: "PW", country: "Palau", name: "Pacific/Palau", offset: "UTC +09:00" },
            "Asia/Gaza": { id: "Asia/Gaza", countrycode: "PS", country: "Palestine, State of", name: "Asia/Gaza", offset: "UTC +02:00" },
            "Asia/Hebron": { id: "Asia/Hebron", countrycode: "PS", country: "Palestine, State of", name: "Asia/Hebron", offset: "UTC +02:00" },
            "America/Panama": { id: "America/Panama", countrycode: "PA", country: "Panama", name: "America/Panama", offset: "UTC -05:00" },
            "Pacific/Bougainville": { id: "Pacific/Bougainville", countrycode: "PG", country: "Papua New Guinea", name: "Pacific/Bougainville", offset: "UTC +11:00" },
            "Pacific/Port_Moresby": { id: "Pacific/Port_Moresby", countrycode: "PG", country: "Papua New Guinea", name: "Pacific/Port_Moresby", offset: "UTC +10:00" },
            "America/Asuncion": { id: "America/Asuncion", countrycode: "PY", country: "Paraguay", name: "America/Asuncion", offset: "UTC -03:00" },
            "America/Lima": { id: "America/Lima", countrycode: "PE", country: "Peru", name: "America/Lima", offset: "UTC -05:00" },
            "Asia/Manila": { id: "Asia/Manila", countrycode: "PH", country: "Philippines", name: "Asia/Manila", offset: "UTC +08:00" },
            "Pacific/Pitcairn": { id: "Pacific/Pitcairn", countrycode: "PN", country: "Pitcairn", name: "Pacific/Pitcairn", offset: "UTC -08:00" },
            "Europe/Warsaw": { id: "Europe/Warsaw", countrycode: "PL", country: "Poland", name: "Europe/Warsaw", offset: "UTC +01:00" },
            "Atlantic/Azores": { id: "Atlantic/Azores", countrycode: "PT", country: "Portugal", name: "Atlantic/Azores", offset: "UTC -01:00" },
            "Atlantic/Madeira": { id: "Atlantic/Madeira", countrycode: "PT", country: "Portugal", name: "Atlantic/Madeira", offset: "UTC" },
            "Europe/Lisbon": { id: "Europe/Lisbon", countrycode: "PT", country: "Portugal", name: "Europe/Lisbon", offset: "UTC" },
            "America/Puerto_Rico": { id: "America/Puerto_Rico", countrycode: "PR", country: "Puerto Rico", name: "America/Puerto_Rico", offset: "UTC -04:00" },
            "Asia/Qatar": { id: "Asia/Qatar", countrycode: "QA", country: "Qatar", name: "Asia/Qatar", offset: "UTC +03:00" },
            "Europe/Bucharest": { id: "Europe/Bucharest", countrycode: "RO", country: "Romania", name: "Europe/Bucharest", offset: "UTC +02:00" },
            "Asia/Anadyr": { id: "Asia/Anadyr", countrycode: "RU", country: "Russian Federation", name: "Asia/Anadyr", offset: "UTC +12:00" },
            "Asia/Barnaul": { id: "Asia/Barnaul", countrycode: "RU", country: "Russian Federation", name: "Asia/Barnaul", offset: "UTC +07:00" },
            "Asia/Chita": { id: "Asia/Chita", countrycode: "RU", country: "Russian Federation", name: "Asia/Chita", offset: "UTC +09:00" },
            "Asia/Irkutsk": { id: "Asia/Irkutsk", countrycode: "RU", country: "Russian Federation", name: "Asia/Irkutsk", offset: "UTC +08:00" },
            "Asia/Kamchatka": { id: "Asia/Kamchatka", countrycode: "RU", country: "Russian Federation", name: "Asia/Kamchatka", offset: "UTC +12:00" },
            "Asia/Khandyga": { id: "Asia/Khandyga", countrycode: "RU", country: "Russian Federation", name: "Asia/Khandyga", offset: "UTC +09:00" },
            "Asia/Krasnoyarsk": { id: "Asia/Krasnoyarsk", countrycode: "RU", country: "Russian Federation", name: "Asia/Krasnoyarsk", offset: "UTC +07:00" },
            "Asia/Magadan": { id: "Asia/Magadan", countrycode: "RU", country: "Russian Federation", name: "Asia/Magadan", offset: "UTC +11:00" },
            "Asia/Novokuznetsk": { id: "Asia/Novokuznetsk", countrycode: "RU", country: "Russian Federation", name: "Asia/Novokuznetsk", offset: "UTC +07:00" },
            "Asia/Novosibirsk": { id: "Asia/Novosibirsk", countrycode: "RU", country: "Russian Federation", name: "Asia/Novosibirsk", offset: "UTC +07:00" },
            "Asia/Omsk": { id: "Asia/Omsk", countrycode: "RU", country: "Russian Federation", name: "Asia/Omsk", offset: "UTC +06:00" },
            "Asia/Sakhalin": { id: "Asia/Sakhalin", countrycode: "RU", country: "Russian Federation", name: "Asia/Sakhalin", offset: "UTC +11:00" },
            "Asia/Srednekolymsk": { id: "Asia/Srednekolymsk", countrycode: "RU", country: "Russian Federation", name: "Asia/Srednekolymsk", offset: "UTC +11:00" },
            "Asia/Tomsk": { id: "Asia/Tomsk", countrycode: "RU", country: "Russian Federation", name: "Asia/Tomsk", offset: "UTC +07:00" },
            "Asia/Ust-Nera": { id: "Asia/Ust-Nera", countrycode: "RU", country: "Russian Federation", name: "Asia/Ust-Nera", offset: "UTC +10:00" },
            "Asia/Vladivostok": { id: "Asia/Vladivostok", countrycode: "RU", country: "Russian Federation", name: "Asia/Vladivostok", offset: "UTC +10:00" },
            "Asia/Yakutsk": { id: "Asia/Yakutsk", countrycode: "RU", country: "Russian Federation", name: "Asia/Yakutsk", offset: "UTC +09:00" },
            "Asia/Yekaterinburg": { id: "Asia/Yekaterinburg", countrycode: "RU", country: "Russian Federation", name: "Asia/Yekaterinburg", offset: "UTC +05:00" },
            "Europe/Astrakhan": { id: "Europe/Astrakhan", countrycode: "RU", country: "Russian Federation", name: "Europe/Astrakhan", offset: "UTC +04:00" },
            "Europe/Kaliningrad": { id: "Europe/Kaliningrad", countrycode: "RU", country: "Russian Federation", name: "Europe/Kaliningrad", offset: "UTC +02:00" },
            "Europe/Kirov": { id: "Europe/Kirov", countrycode: "RU", country: "Russian Federation", name: "Europe/Kirov", offset: "UTC +03:00" },
            "Europe/Moscow": { id: "Europe/Moscow", countrycode: "RU", country: "Russian Federation", name: "Europe/Moscow", offset: "UTC +03:00" },
            "Europe/Samara": { id: "Europe/Samara", countrycode: "RU", country: "Russian Federation", name: "Europe/Samara", offset: "UTC +04:00" },
            "Europe/Saratov": { id: "Europe/Saratov", countrycode: "RU", country: "Russian Federation", name: "Europe/Saratov", offset: "UTC +04:00" },
            "Europe/Ulyanovsk": { id: "Europe/Ulyanovsk", countrycode: "RU", country: "Russian Federation", name: "Europe/Ulyanovsk", offset: "UTC +04:00" },
            "Europe/Volgograd": { id: "Europe/Volgograd", countrycode: "RU", country: "Russian Federation", name: "Europe/Volgograd", offset: "UTC +04:00" },
            "Africa/Kigali": { id: "Africa/Kigali", countrycode: "RW", country: "Rwanda", name: "Africa/Kigali", offset: "UTC +02:00" },
            "Indian/Reunion": { id: "Indian/Reunion", countrycode: "RE", country: "Réunion", name: "Indian/Reunion", offset: "UTC +04:00" },
            "America/St_Barthelemy": { id: "America/St_Barthelemy", countrycode: "BL", country: "Saint Barthélemy", name: "America/St_Barthelemy", offset: "UTC -04:00" },
            "Atlantic/St_Helena": { id: "Atlantic/St_Helena", countrycode: "SH", country: "Saint Helena, Ascension and Tristan da Cunha", name: "Atlantic/St_Helena", offset: "UTC" },
            "America/St_Kitts": { id: "America/St_Kitts", countrycode: "KN", country: "Saint Kitts and Nevis", name: "America/St_Kitts", offset: "UTC -04:00" },
            "America/St_Lucia": { id: "America/St_Lucia", countrycode: "LC", country: "Saint Lucia", name: "America/St_Lucia", offset: "UTC -04:00" },
            "America/Marigot": { id: "America/Marigot", countrycode: "MF", country: "Saint Martin (French part)", name: "America/Marigot", offset: "UTC -04:00" },
            "America/Miquelon": { id: "America/Miquelon", countrycode: "PM", country: "Saint Pierre and Miquelon", name: "America/Miquelon", offset: "UTC -03:00" },
            "America/St_Vincent": { id: "America/St_Vincent", countrycode: "VC", country: "Saint Vincent and the Grenadines", name: "America/St_Vincent", offset: "UTC -04:00" },
            "Pacific/Apia": { id: "Pacific/Apia", countrycode: "WS", country: "Samoa", name: "Pacific/Apia", offset: "UTC +14:00" },
            "Europe/San_Marino": { id: "Europe/San_Marino", countrycode: "SM", country: "San Marino", name: "Europe/San_Marino", offset: "UTC +01:00" },
            "Africa/Sao_Tome": { id: "Africa/Sao_Tome", countrycode: "ST", country: "Sao Tome and Principe", name: "Africa/Sao_Tome", offset: "UTC" },
            "Asia/Riyadh": { id: "Asia/Riyadh", countrycode: "SA", country: "Saudi Arabia", name: "Asia/Riyadh", offset: "UTC +03:00" },
            "Africa/Dakar": { id: "Africa/Dakar", countrycode: "SN", country: "Senegal", name: "Africa/Dakar", offset: "UTC" },
            "Europe/Belgrade": { id: "Europe/Belgrade", countrycode: "RS", country: "Serbia", name: "Europe/Belgrade", offset: "UTC +01:00" },
            "Indian/Mahe": { id: "Indian/Mahe", countrycode: "SC", country: "Seychelles", name: "Indian/Mahe", offset: "UTC +04:00" },
            "Africa/Freetown": { id: "Africa/Freetown", countrycode: "SL", country: "Sierra Leone", name: "Africa/Freetown", offset: "UTC" },
            "Asia/Singapore": { id: "Asia/Singapore", countrycode: "SG", country: "Singapore", name: "Asia/Singapore", offset: "UTC +08:00" },
            "America/Lower_Princes": { id: "America/Lower_Princes", countrycode: "SX", country: "Sint Maarten (Dutch part)", name: "America/Lower_Princes", offset: "UTC -04:00" },
            "Europe/Bratislava": { id: "Europe/Bratislava", countrycode: "SK", country: "Slovakia", name: "Europe/Bratislava", offset: "UTC +01:00" },
            "Europe/Ljubljana": { id: "Europe/Ljubljana", countrycode: "SI", country: "Slovenia", name: "Europe/Ljubljana", offset: "UTC +01:00" },
            "Pacific/Guadalcanal": { id: "Pacific/Guadalcanal", countrycode: "SB", country: "Solomon Islands", name: "Pacific/Guadalcanal", offset: "UTC +11:00" },
            "Africa/Mogadishu": { id: "Africa/Mogadishu", countrycode: "SO", country: "Somalia", name: "Africa/Mogadishu", offset: "UTC +03:00" },
            "Africa/Johannesburg": { id: "Africa/Johannesburg", countrycode: "ZA", country: "South Africa", name: "Africa/Johannesburg", offset: "UTC +02:00" },
            "Atlantic/South_Georgia": { id: "Atlantic/South_Georgia", countrycode: "GS", country: "South Georgia and the South Sandwich Islands", name: "Atlantic/South_Georgia", offset: "UTC -02:00" },
            "Africa/Juba": { id: "Africa/Juba", countrycode: "SS", country: "South Sudan", name: "Africa/Juba", offset: "UTC +03:00" },
            "Africa/Ceuta": { id: "Africa/Ceuta", countrycode: "ES", country: "Spain", name: "Africa/Ceuta", offset: "UTC +01:00" },
            "Atlantic/Canary": { id: "Atlantic/Canary", countrycode: "ES", country: "Spain", name: "Atlantic/Canary", offset: "UTC" },
            "Europe/Madrid": { id: "Europe/Madrid", countrycode: "ES", country: "Spain", name: "Europe/Madrid", offset: "UTC +01:00" },
            "Asia/Colombo": { id: "Asia/Colombo", countrycode: "LK", country: "Sri Lanka", name: "Asia/Colombo", offset: "UTC +05:30" },
            "Africa/Khartoum": { id: "Africa/Khartoum", countrycode: "SD", country: "Sudan", name: "Africa/Khartoum", offset: "UTC +02:00" },
            "America/Paramaribo": { id: "America/Paramaribo", countrycode: "SR", country: "Suriname", name: "America/Paramaribo", offset: "UTC -03:00" },
            "Arctic/Longyearbyen": { id: "Arctic/Longyearbyen", countrycode: "SJ", country: "Svalbard and Jan Mayen", name: "Arctic/Longyearbyen", offset: "UTC +01:00" },
            "Africa/Mbabane": { id: "Africa/Mbabane", countrycode: "SZ", country: "Swaziland", name: "Africa/Mbabane", offset: "UTC +02:00" },
            "Europe/Stockholm": { id: "Europe/Stockholm", countrycode: "SE", country: "Sweden", name: "Europe/Stockholm", offset: "UTC +01:00" },
            "Europe/Zurich": { id: "Europe/Zurich", countrycode: "CH", country: "Switzerland", name: "Europe/Zurich", offset: "UTC +01:00" },
            "Asia/Damascus": { id: "Asia/Damascus", countrycode: "SY", country: "Syrian Arab Republic", name: "Asia/Damascus", offset: "UTC +02:00" },
            "Asia/Taipei": { id: "Asia/Taipei", countrycode: "TW", country: "Taiwan, Province of China", name: "Asia/Taipei", offset: "UTC +08:00" },
            "Asia/Dushanbe": { id: "Asia/Dushanbe", countrycode: "TJ", country: "Tajikistan", name: "Asia/Dushanbe", offset: "UTC +05:00" },
            "Africa/Dar_es_Salaam": { id: "Africa/Dar_es_Salaam", countrycode: "TZ", country: "Tanzania, United Republic of", name: "Africa/Dar_es_Salaam", offset: "UTC +03:00" },
            "Asia/Bangkok": { id: "Asia/Bangkok", countrycode: "TH", country: "Thailand", name: "Asia/Bangkok", offset: "UTC +07:00" },
            "Asia/Dili": { id: "Asia/Dili", countrycode: "TL", country: "Timor-Leste", name: "Asia/Dili", offset: "UTC +09:00" },
            "Africa/Lome": { id: "Africa/Lome", countrycode: "TG", country: "Togo", name: "Africa/Lome", offset: "UTC" },
            "Pacific/Fakaofo": { id: "Pacific/Fakaofo", countrycode: "TK", country: "Tokelau", name: "Pacific/Fakaofo", offset: "UTC +13:00" },
            "Pacific/Tongatapu": { id: "Pacific/Tongatapu", countrycode: "TO", country: "Tonga", name: "Pacific/Tongatapu", offset: "UTC +13:00" },
            "America/Port_of_Spain": { id: "America/Port_of_Spain", countrycode: "TT", country: "Trinidad and Tobago", name: "America/Port_of_Spain", offset: "UTC -04:00" },
            "Africa/Tunis": { id: "Africa/Tunis", countrycode: "TN", country: "Tunisia", name: "Africa/Tunis", offset: "UTC +01:00" },
            "Europe/Istanbul": { id: "Europe/Istanbul", countrycode: "TR", country: "Turkey", name: "Europe/Istanbul", offset: "UTC +03:00" },
            "Asia/Ashgabat": { id: "Asia/Ashgabat", countrycode: "TM", country: "Turkmenistan", name: "Asia/Ashgabat", offset: "UTC +05:00" },
            "America/Grand_Turk": { id: "America/Grand_Turk", countrycode: "TC", country: "Turks and Caicos Islands", name: "America/Grand_Turk", offset: "UTC -05:00" },
            "Pacific/Funafuti": { id: "Pacific/Funafuti", countrycode: "TV", country: "Tuvalu", name: "Pacific/Funafuti", offset: "UTC +12:00" },
            "Africa/Kampala": { id: "Africa/Kampala", countrycode: "UG", country: "Uganda", name: "Africa/Kampala", offset: "UTC +03:00" },
            "Europe/Kiev": { id: "Europe/Kiev", countrycode: "UA", country: "Ukraine", name: "Europe/Kiev", offset: "UTC +02:00" },
            "Europe/Simferopol": { id: "Europe/Simferopol", countrycode: "UA", country: "Ukraine", name: "Europe/Simferopol", offset: "UTC +03:00" },
            "Europe/Uzhgorod": { id: "Europe/Uzhgorod", countrycode: "UA", country: "Ukraine", name: "Europe/Uzhgorod", offset: "UTC +02:00" },
            "Europe/Zaporozhye": { id: "Europe/Zaporozhye", countrycode: "UA", country: "Ukraine", name: "Europe/Zaporozhye", offset: "UTC +02:00" },
            "Asia/Dubai": { id: "Asia/Dubai", countrycode: "AE", country: "United Arab Emirates", name: "Asia/Dubai", offset: "UTC +04:00" },
            "Europe/London": { id: "Europe/London", countrycode: "GB", country: "United Kingdom", name: "Europe/London", offset: "UTC" },
            "America/Adak": { id: "America/Adak", countrycode: "US", country: "United States", name: "America/Adak", offset: "UTC -10:00" },
            "America/Anchorage": { id: "America/Anchorage", countrycode: "US", country: "United States", name: "America/Anchorage", offset: "UTC -09:00" },
            "America/Boise": { id: "America/Boise", countrycode: "US", country: "United States", name: "America/Boise", offset: "UTC -07:00" },
            "America/Chicago": { id: "America/Chicago", countrycode: "US", country: "United States", name: "America/Chicago", offset: "UTC -06:00" },
            "America/Denver": { id: "America/Denver", countrycode: "US", country: "United States", name: "America/Denver", offset: "UTC -07:00" },
            "America/Detroit": { id: "America/Detroit", countrycode: "US", country: "United States", name: "America/Detroit", offset: "UTC -05:00" },
            "America/Indiana/Indianapolis": { id: "America/Indiana/Indianapolis", countrycode: "US", country: "United States", name: "America/Indiana/Indianapolis", offset: "UTC -05:00" },
            "America/Indiana/Knox": { id: "America/Indiana/Knox", countrycode: "US", country: "United States", name: "America/Indiana/Knox", offset: "UTC -06:00" },
            "America/Indiana/Marengo": { id: "America/Indiana/Marengo", countrycode: "US", country: "United States", name: "America/Indiana/Marengo", offset: "UTC -05:00" },
            "America/Indiana/Petersburg": { id: "America/Indiana/Petersburg", countrycode: "US", country: "United States", name: "America/Indiana/Petersburg", offset: "UTC -05:00" },
            "America/Indiana/Tell_City": { id: "America/Indiana/Tell_City", countrycode: "US", country: "United States", name: "America/Indiana/Tell_City", offset: "UTC -06:00" },
            "America/Indiana/Vevay": { id: "America/Indiana/Vevay", countrycode: "US", country: "United States", name: "America/Indiana/Vevay", offset: "UTC -05:00" },
            "America/Indiana/Vincennes": { id: "America/Indiana/Vincennes", countrycode: "US", country: "United States", name: "America/Indiana/Vincennes", offset: "UTC -05:00" },
            "America/Indiana/Winamac": { id: "America/Indiana/Winamac", countrycode: "US", country: "United States", name: "America/Indiana/Winamac", offset: "UTC -05:00" },
            "America/Juneau": { id: "America/Juneau", countrycode: "US", country: "United States", name: "America/Juneau", offset: "UTC -09:00" },
            "America/Kentucky/Louisville": { id: "America/Kentucky/Louisville", countrycode: "US", country: "United States", name: "America/Kentucky/Louisville", offset: "UTC -05:00" },
            "America/Kentucky/Monticello": { id: "America/Kentucky/Monticello", countrycode: "US", country: "United States", name: "America/Kentucky/Monticello", offset: "UTC -05:00" },
            "America/Los_Angeles": { id: "America/Los_Angeles", countrycode: "US", country: "United States", name: "America/Los_Angeles", offset: "UTC -08:00" },
            "America/Menominee": { id: "America/Menominee", countrycode: "US", country: "United States", name: "America/Menominee", offset: "UTC -06:00" },
            "America/Metlakatla": { id: "America/Metlakatla", countrycode: "US", country: "United States", name: "America/Metlakatla", offset: "UTC -09:00" },
            "America/New_York": { id: "America/New_York", countrycode: "US", country: "United States", name: "America/New_York", offset: "UTC -05:00" },
            "America/Nome": { id: "America/Nome", countrycode: "US", country: "United States", name: "America/Nome", offset: "UTC -09:00" },
            "America/North_Dakota/Beulah": { id: "America/North_Dakota/Beulah", countrycode: "US", country: "United States", name: "America/North_Dakota/Beulah", offset: "UTC -06:00" },
            "America/North_Dakota/Center": { id: "America/North_Dakota/Center", countrycode: "US", country: "United States", name: "America/North_Dakota/Center", offset: "UTC -06:00" },
            "America/North_Dakota/New_Salem": { id: "America/North_Dakota/New_Salem", countrycode: "US", country: "United States", name: "America/North_Dakota/New_Salem", offset: "UTC -06:00" },
            "America/Phoenix": { id: "America/Phoenix", countrycode: "US", country: "United States", name: "America/Phoenix", offset: "UTC -07:00" },
            "America/Sitka": { id: "America/Sitka", countrycode: "US", country: "United States", name: "America/Sitka", offset: "UTC -09:00" },
            "America/Yakutat": { id: "America/Yakutat", countrycode: "US", country: "United States", name: "America/Yakutat", offset: "UTC -09:00" },
            "Pacific/Honolulu": { id: "Pacific/Honolulu", countrycode: "US", country: "United States", name: "Pacific/Honolulu", offset: "UTC -10:00" },
            "Pacific/Midway": { id: "Pacific/Midway", countrycode: "UM", country: "United States Minor Outlying Islands", name: "Pacific/Midway", offset: "UTC -11:00" },
            "Pacific/Wake": { id: "Pacific/Wake", countrycode: "UM", country: "United States Minor Outlying Islands", name: "Pacific/Wake", offset: "UTC +12:00" },
            "America/Montevideo": { id: "America/Montevideo", countrycode: "UY", country: "Uruguay", name: "America/Montevideo", offset: "UTC -03:00" },
            "Asia/Samarkand": { id: "Asia/Samarkand", countrycode: "UZ", country: "Uzbekistan", name: "Asia/Samarkand", offset: "UTC +05:00" },
            "Asia/Tashkent": { id: "Asia/Tashkent", countrycode: "UZ", country: "Uzbekistan", name: "Asia/Tashkent", offset: "UTC +05:00" },
            "Pacific/Efate": { id: "Pacific/Efate", countrycode: "VU", country: "Vanuatu", name: "Pacific/Efate", offset: "UTC +11:00" },
            "America/Caracas": { id: "America/Caracas", countrycode: "VE", country: "Venezuela, Bolivarian Republic of", name: "America/Caracas", offset: "UTC -04:00" },
            "Asia/Ho_Chi_Minh": { id: "Asia/Ho_Chi_Minh", countrycode: "VN", country: "Viet Nam", name: "Asia/Ho_Chi_Minh", offset: "UTC +07:00" },
            "America/Tortola": { id: "America/Tortola", countrycode: "VG", country: "Virgin Islands, British", name: "America/Tortola", offset: "UTC -04:00" },
            "America/St_Thomas": { id: "America/St_Thomas", countrycode: "VI", country: "Virgin Islands, U.S.", name: "America/St_Thomas", offset: "UTC -04:00" },
            "Pacific/Wallis": { id: "Pacific/Wallis", countrycode: "WF", country: "Wallis and Futuna", name: "Pacific/Wallis", offset: "UTC +12:00" },
            "Africa/El_Aaiun": { id: "Africa/El_Aaiun", countrycode: "EH", country: "Western Sahara", name: "Africa/El_Aaiun", offset: "UTC +01:00" },
            "Asia/Aden": { id: "Asia/Aden", countrycode: "YE", country: "Yemen", name: "Asia/Aden", offset: "UTC +03:00" },
            "Africa/Lusaka": { id: "Africa/Lusaka", countrycode: "ZM", country: "Zambia", name: "Africa/Lusaka", offset: "UTC +02:00" },
            "Africa/Harare": { id: "Africa/Harare", countrycode: "ZW", country: "Zimbabwe", name: "Africa/Harare", offset: "UTC +02:00" },
            "Europe/Mariehamn": { id: "Europe/Mariehamn", countrycode: "AX", country: "Åland Islands", name: "Europe/Mariehamn", offset: "UTC +02:00" }
        }
    }

    //static instance;

    constructor() {
        super();
        if (!TimeZoneDefinition.instance) {
            this.config = Object.assign({}, this.config, TimeZoneDefinition.CONFIG);
            this.cache = TimeZoneDefinition.MAP;
            this.initialized = true;
            TimeZoneDefinition.instance = this;
        }
        return TimeZoneDefinition.instance;
    }

    get options() {
        let options = [];
        for (let o of Object.values(this.cache)) {
            options.push({ value: o[this.identifier], label: `${o.name} (${o.offset})` });
        }
        options.sort((a, b) => {
            if (a.label > b.label) { return 1 }
            if (a.label < b.label) { return -1 }
            return 0;
        });
        return options;
    }

}

window.TimeZoneDefinition = TimeZoneDefinition;
class IconFactory {

    static get LIST() {
        return [
            'arrow-down-circle',
            'arrow-up',
            'download',
            'map',
            'arrow-right',
            'upload',
            'arrow-left',
            'arrow-down-circle-1',
            'calendar',
            'trashcan',
            'tag',
            'legend',
            'echx',
            'arrow-down',
            'clock',
            'chat',
            'check-circle-disc',
            'checkmark-circle',
            'chevron-down',
            'checkmark',
            'chevron-left',
            'chevron-right',
            'chevron-up',
            'double-triangle-vertical',
            'heart',
            'no',
            'double-triangle-horizontal',
            'arrow-left-circle',
            'echx-circle',
            'echx-1',
            'spinner-circle',
            'circle-disc-chopped',
            'circle',
            'disc-chopped',
            'gear-complex',
            'gear',
            'globe',
            'help-circle',
            'lightbulb',
            'lock-open',
            'magnify',
            'menu',
            'question',
            'star',
            'user-circle',
            'user',
            'exclaim',
            'shape-hex',
            'shape-rounded-triangle',
            'warn-circle',
            'warn-hex',
            'warn-triangle',
            'eye-slash',
            'microphone-slash',
            'minimize',
            'eye',
            'disc-check',
            'minus-circle',
            'minus',
            'popout',
            'plus',
            'plus-circle',
            'pencil',
            'pencil-circle',
            'refresh',
            'speaker-high',
            'speaker-low',
            'printer',
            'speaker-medium',
            'microphone',
            'speaker-mute',
            'lock-closed',
            'image',
            'folder',
            'document',
            'speaker-slash',
            'triangle-down-small',
            'triangle-down',
            'triangle-left-small',
            'triangle-left',
            'triangle-right-small',
            'triangle-up',
            'triangle-up-small',
            'triangle-right',
            'arrow-right-circle',
            'arrow-up-circle',
            'triangle-down-circle',
            'triangle-left-circle',
            'triangle-right-circle',
            'triangle-up-circle',
            'flag-notched',
            'flag-pointed',
            'flag-rectangle',
            'flag-notched-angle',
            'flag-pointed-angle',
            'flag-rectangle-angle',
            'filter',
            'table',
            'duplicate',
            'dots-horizontal',
            'dots-vertical'
        ];
    }

    /**
     * Gets an icon defined by cornflower blue
     * @param icon the icon id. This is stacked with the cfb prefix.
     * @param arialabel the aria label to use
     * @param iconprefix an option icon prefix, for use with other icon libraries
     * @return {*}
     */
    static icon(icon, arialabel, iconprefix='cfb') {
        if (icon instanceof Object) { // this is probably a pre-defined icon
            return icon;
        }
        let i = document.createElement('span');
        i.classList.add('icon');
        i.classList.add(`${iconprefix}-${icon}`);
        if (arialabel) {
            i.setAttribute('aria-label', arialabel);
        } else {
            i.setAttribute('aria-hidden', "true");
        }
        return i;
    }

    /**
     * Gets an icon NOT defined by cornflower blue (like fontawesome, or a different icon font)
     * @param icon the icon.  This can be an array as well, and if so will apply all elements as classes
     * @param arialabel the aria label to use
     * @return a span DOM object
     */
    static xicon(icon, arialabel) {
        if (icon instanceof Object) { // this is probably a pre-defined icon
            return icon;
        }
        let i = document.createElement('span');
        i.classList.add('icon');

        if (Array.isArray(icon)) {
            for (let c of icon) {
                i.classList.add(c);
            }
        } else {
            i.classList.add(icon);
        }

        if (arialabel) {
            i.setAttribute('aria-label', arialabel);
        } else {
            i.setAttribute('aria-hidden', "true");
        }
        return i;
    }

}
window.IconFactory = IconFactory;
class TextFactory {

    /**
     * This is the actual library of text.  It can be modified through other methods.
     * @private
     */
    static get _libraryBase() {
        return {
            "login" : "Login",
            "password" : "Password",
            "email" : "Email",
            "passwordinput-placeholder-enter_password" : "Enter your password.",
            "remember_me" : "Remember me",
            "loginform-error-passwords_dont_match" : "Email and password do not match.",
            "loginform-instructions-enter_username" : "Enter your username and password.",
            "create_account" : "Create account",

            "actions": 'Actions',
            "apply_filters": 'Apply Filters',
            "bulk_select": 'Bulk select',
            "cancel": 'Cancel',
            "caution": 'Caution',
            "change_password": 'Change Password',
            "close": 'Close',
            "columns": 'Columns',
            "configure_columns": 'Configure Columns',
            "configure_generator": 'Configure generator',
            "confirm_password": 'Confirm Password',
            "countrymenu_select": 'Select country',
            "current_password": 'Current Password',
            "datagrid-dialog-item-save": "Save $1",
            "datagrid-dialog-item-view": "View $1",
            "datagrid-dialog-item-create": "Create $1",
            "datagrid-dialog-item-duplicate": "Duplicate $1",
            "datagrid-dialog-item-edit": "Edit $1",
            "datagrid-dialog-item-delete": "Delete $1",
            "datagrid-dialog-item-edit-instructions": "Edit this $1 using the form below.",
            "datagrid-dialog-item-create-instructions": "Fill out the form below to create a new $1.",
            "datagrid-dialog-item-delete-instructions": "Are you sure you want to delete this $1?",
            "datagrid-dialog-item-duplicate-instructions": "The $1 has been duplicated. Saving it will create a new instance with these values.",
            "datagrid-tooltip-export": "Export all data in this grid as a comma separated value file.",
            "datagrid-tooltip-export-current_view": "Export the data in the current view as a comma separated value file.",
            "datagrid-tooltip-configure_columns": "Configure the visibility of individual columns.",
            "datagrid-tooltip-bulk_select": "Show bulk selection controls.",
            "datagrid-tooltip-filters": "Add, remove, or edit view filters.",
            "datagrid-activitynotifier-text": "Working...",
            "datagrid-column-config-instructions": "Select which columns to show in the grid. This does not hide the columns during export.",
            "datagrid-filter-instructions": "Columns that are filterable are shown below. Set the value of the column to filter it.",
            "datagrid-message-no_visible_columns": 'No columns are visible in this table.',
            "datagrid-message-empty_grid": "There are no rows in this dataset.",
            "dateinput-error-invalid": 'This is an invalid date.',
            "datagrid-spinnertext": 'Loading',
            "dateinput-trigger-arialabel": 'Open date picker',
            "decrement_number": 'Decrement number',
            "emailinput-placeholder-default": 'person@myemailaccount.net',
            "emailinput-error-invalid_web_address": 'This is an invalid email address.',
            "error": 'Error',
            "export": 'Export',
            "export-current_view": "Export current view",
            "fileinput-placeholder-file": 'Select file',
            "fileinput-placeholder-multiple": 'Select files (multiple accepted)',
            "filter-configurator-add_filter": "Add filter",
            "comparator-contains": "Contains",
            "comparator-notcontains": "Does not contain",
            "comparator-equals": "Equals",
            "comparator-doesnotequal": "Does not equal",
            "comparator-isbefore": "Is before",
            "comparator-isafter": "Is after",
            "comparator-greaterthan": "Is greater than",
            "comparator-lessthan": "Is less than",
            "comparator-startswith": "Starts with",
            "comparator-endswith": "Ends with",
            "comparator-select_field": "Select field",
            "comparator-comparator": "Comparator",
            "filters": 'Filters',
            "generate_password": 'Generate password',
            "help": 'Help',
            "hide_password": 'Hide password',
            "increment_number": 'Increment number',
            "input-counter-limit": '$1 of $2 characters entered',
            "input-counter-sky": '$1 characters entered',
            "input-counter-remaining": '$1 characters remaining',
            "input-error-required": 'This field is required',
            "items_label": 'Items:',
            "lowercase": 'Lowercase',
            "manage_filters": 'Manage Filters',
            "matches_hidden_columns": "Your search matches data in hidden columns.",
            "name" : 'Name',
            "new_password": 'New Password',
            "no_columns": 'No columns',
            "no_provided_content": 'No provided content',
            "no_results": 'No results',
            "not_set": "(Not Set)",
            "numberinput-error-maximum_value": "The maximum value for this field is '$1'.",
            "numberinput-error-minimum_value": "The minimum value for this field is '$1'.",
            "numberinput-error-must_be_whole_numbers": 'Values must be whole numbers.',
            "numberinput-error-nan": 'This is not a number.',
            "numberinput-error-values_divisible": 'Values must be divisible by $1',
            "numberinput-placeholder-basic": 'Enter a number',
            "numberinput-placeholder-between_x_y": 'Enter a number between $1 and $2',
            "numberinput-placeholder-fragment_increments": ' (increments of $1)',
            "numberinput-placeholder-larger_than_x": 'Enter a number larger than $1',
            "numberinput-placeholder-smaller_than_y": 'Enter a number smaller than $1',
            "numbers": 'Numbers',
            "open_menu": 'Open menu',
            "passwordchanger-currentpw-help": 'This is your current password. We need to confirm that you are who you are.',
            "passwordchanger-currentpw-placeholder": 'Your current password',
            "passwordchanger-error-cannot_be_used_as_pw": 'This cannot be used as a password.',
            "passwordchanger-error-passwords_must_match": 'Passwords must match.',
            "passwordchanger-form-instructions": 'Change your password here.',
            "passwordchanger-placeholder-minlength": 'Must be at least $1 characters',
            "passwordchanger-placeholder-suggested": 'Should be at least $1 characters',
            "passwordchanger-results-changed_successfully": 'Your password has been changed successfully!',
            "passwordchanger-error-maxlength": 'Password must be less than $1 characters.',
            "passwordchanger-error-minlength": 'Password must be at least $1 characters.',
            "passwordchanger-error-suggestedlength": 'Password is less than the suggested length of $1 characters.',
            "passwordinput-change_visibility": "Toggle value visibility.",
            "primary": 'Primary',
            "punctuation": 'Punctuation',
            "required_lc": 'required',
            "save" : "Save",
            "save_changes" : "Save changes",
            "cancel_changes" : "Cancel changes",
            "make_changes" : "Make changes",
            "save_columns" : "Save columns",
            "search": 'Search',
            "search_noresults": 'No entries were found matching your search terms.',
            "search_this_data": 'Search this data',
            "searchcontrol-instructions": 'Enter search terms',
            "selectmenu-placeholder-default": 'Select value',
            "show_password": 'Show password',
            "simpleform-spinnertext": 'Please wait',
            "skip_to_content": 'Skip to content',
            "statemenu_select": 'Select state or province',
            "success": 'Success',
            "timezone_select": 'Select timezone',
            "toggle_menu": 'Toggle menu',
            "uppercase": 'Uppercase',
            "urlinput-placeholder-default": 'https://somewhere.cornflower.blue/',
            "urlinput-error-invalid_web_address": 'This is an invalid web address.',
            "warning": 'Warning',
            "country_code" : "Country Code",
            "country" : "Country",
            "time_zone" : "Time zone",
            "offset" : "Offset",
            "code" : "Code",
            "alternate_names" : "Alternate names"
        };
    }

    /**
     * Get a text value by key
     * @return {null|*}
     */
    static get() {
        if (!arguments) { return null; }
        if (arguments.length > 1) {
            let t = TextFactory.library[arguments[0]];
            for (let arg = 1; arg <= arguments.length; arg++) {
                t = t.replace(`$${arg}`, arguments[arg]);
            }
            return t;
        }
        if (!TextFactory.library[arguments[0]]) {
            console.error(`Text key not found: ${arguments[0]}`);
            return arguments[0];
        }
        return TextFactory.library[arguments[0]];
    }

    /**
     * Load additional text elements from a url.  This will replace any existing values if the keys
     * are the same.
     * @param url the URL to fetch.
     */
    static load(url) {
        if (!url) {
            console.error('TextFactory.load() called without a URL');
            return;
        }
        fetch(url, {
            headers: { "Content-Type": "application/json; charset=utf-8" }
        })
            .then(response => response.json()) // response -> json
            .then(data => { // do the thing.
                TextFactory.library = Object.assign({}, TextFactory.library, data);
            })
            .catch(err => {
                console.error(`Error while fetching data from ${url}`);
                console.error(err);
            });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    static get library() {
        if (typeof TextFactory._library === 'undefined' ) {
            TextFactory.library = TextFactory._libraryBase;
        }
        return TextFactory._library;
    }
    static set library(library) { TextFactory._library = library; }


}
window.TextFactory = TextFactory;
class SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            aslink: false,
            href: null,
            dataattributes: null,
            attributes: null,
            submits: false,
            arialabel: null,
            cansubmit: true,
            text: null,
            shape: null,
            size: 'medium',
            form: null,
            hidden: false,
            tooltip: null,
            tipicon: null,
            tipgravity: 'n',
            classes: [],
            image: null,
            icon: null,
            iconclasses: [],
            iconside: 'left',
            secondicon : null,
            notab: false,
            disabled: false,
            badgevalue: null,
            mute: false,
            ghost: false,
            link: false,
            naked: false,
            action: null,
            focusin: null,
            focusout: null,
            hoverin: null,
            hoverout: null
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The button object will have this as it's id." },
            aslink: { type: 'option', datatype: 'boolean', description: "Output an <a> object instead of a <button>." },
            href: { type: 'option', datatype: 'url', description: "Use this as the link's href if aslink is true." },
            dataattributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with data-$key = value on elements." },
            attributes: { type: 'option', datatype: 'dictionary',  description: "A dictionary, key: value, which will end up with $key = value on elements" },
            arialabel: { type: 'option', datatype: 'string', description: "The aria-label attribute" },
            hidden: { type: 'option', datatype: 'boolean', description: "If true, start hidden or not." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            form: { type: 'option', datatype: 'simpleform', description: "A SimpleForm object this element this is in"},
            image: { type: 'option', datatype: 'url', description: "If provided, use this image for the button." },
            submits: { type: 'option', datatype: 'boolean', description: "If true, forces the button type to be type='submit'" },
            cansubmit: { type: 'option', datatype: 'boolean', description: "If true, advertises to Form objects that it can be used to submit them, if submits is true." },
            text: { type: 'option', datatype: 'string', description: "The text for the button. This is also used as aria-label, if <code>arialabel</code> is unset" },
            shape: { type: 'option', datatype: 'string', description: "Make the button a special shape, with these values: null|square|circle|pill.  Default is null, which makes a rectangle." },
            size: { type: 'option', datatype: 'string', description: "The size of the button: micro, small, medium (default), large, fill" },
            tooltip: { type: 'option', datatype: 'string', description: "An optional tooltip."},
            tipicon: { type: 'option', datatype: 'string', description: "An icon for the tooltip."},
            tipgravity: { type: 'option', datatype: 'string', description: "Tooltip gravity, default 'n'."},
            icon: { type: 'option', datatype: 'string', description: "If present, will be attached to the text inside the button. This can be passed a DOM object." },
            iconclasses: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply to icons." },
            iconside: { type: 'option', datatype: 'string', description: "The side the icon displays on - left or right." },
            secondicon: { type: 'option', datatype: 'string', description: "if present, this icon will be placed on the opposite side of the defined 'iconside'.  If this is the only icon defined, it will still be placed.  This is ignored in shaped buttons." },
            notab: {type: 'boolean', datatype: 'string', description: "If true, don't be tabindexed."},
            disabled: {type: 'boolean', datatype: 'string', description: "If true, make the button disabled."},
            badgevalue: {type: 'option', datatype: 'number', description: "If this exists, it adds a badge to the button."},
            mute: {type: 'boolean', datatype: 'string', description: "If true, make the button mute."},
            ghost: {type: 'boolean', datatype: 'string', description: "If true, make the button ghost."},
            link: { type: 'option', datatype: 'boolean', description: "If true, make the button behave like a normal link." },
            naked: {type: 'option', datatype: 'boolean', description: "If true, remove all styles from the button."},
            action: { type: 'option', datatype: 'function', description: "The click handler. Passed (event, self) as arguments. NOT used if 'submits' is true." },
            focusin: { type: 'option', datatype: 'function', description: "The focus in handler. Passed (event, self) as arguments." },
            focusout: { type: 'option', datatype: 'function', description: "The focus out handler. Passed (event, self) as arguments." },
            hoverin: { type: 'option', datatype: 'function', description: "The on hover handler. Passed (event, self) as arguments." },
            hoverout: { type: 'option', datatype: 'function', description: "The off hover handler. Passed (event, self) as arguments." }
        }
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleButton.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `button-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Can this be used to submit a form?
     * Javascript doesn't have great interfaces. This would be on the interface otherwise.
     * Doesn't have a settor.
     * @return {boolean}
     */
    get cansubmit() { return this.config.cansubmit; }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the button
     */
    disable() {
        this.button.setAttribute('disabled', 'disabled');
        this.disabled = true;
        return this;
    }

    /**
     * Disable the button
     */
    enable() {
        this.button.removeAttribute('disabled');
        this.disabled = false;
        return this;
    }

    /**
     * Show the button
     */
    show() {
        this.button.classList.remove('hidden');
        this.hidden = false;
        return this;
    }

    /**
     * Hide the button
     */
    hide() {
        this.button.classList.add('hidden');
        this.hidden = true;
        return this;
    }

    /**
     * Open the tooltip.
     */
    openTooltip() {
        if (!this.tooltipobj) { return; }
        this.tooltipobj.open();
    }

    /**
     * Close the tooltip
     */
    closeTooltip() {
        if (!this.tooltipobj) { return; }
        this.tooltipobj.close();
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    setIcon(newicon) {
        let i = IconFactory.icon(newicon);
        if ((this.iconclasses) && (this.iconclasses.length > 0)) {
            for (let ic of this.iconclasses) {
                if (i) { i.classList.add(ic); }
            }
        }
        if (this.icon) {
            this.button.replaceChild(i, this.iconactual);
            this.iconactual = i;
        } else {
            this.iconactual = i;
            this.button.prepend(this.iconactual);
        }
    }

    /**
     * Builds the button's DOM.
     * @returns DOM representation of the SimpleButton
     */
    buildButton() {

        if (this.text) {
            this.textobj = document.createElement('span');
            this.textobj.classList.add('text');
            this.textobj.innerHTML = this.text;
        }

        if (this.aslink) {
            this.button = document.createElement('a');
            this.button.classList.add('button');
            if (this.href) {
                this.button.setAttribute('href', this.href);
            }
        } else {
            this.button = document.createElement('button');
        }

        if (this.icon) {
            this.iconactual = IconFactory.icon(this.icon);
        }
        if (this.secondicon) {
            this.secondiconactual = IconFactory.icon(this.secondicon);
            this.secondiconactual.classList.add('secondicon');
        }
        if ((this.iconclasses) && (this.iconclasses.length > 0)) {
            for (let ic of this.iconclasses) {
                if (this.iconactual) { this.iconactual.classList.add(ic); }
                if (this.secondiconactual) { this.secondiconactual.classList.add(ic); }
            }
        }

        if ((this.iconside) && (this.iconside === 'right')) {
            this.button.classList.add('righticon');
        }
        if (this.iconactual) {
            this.button.appendChild(this.iconactual);
        }
        if (this.textobj) {
            this.button.appendChild(this.textobj);
        }
        if (this.secondiconactual) {
            this.button.appendChild(this.secondiconactual);
        }

        if (this.arialabel) {
            this.button.setAttribute('aria-label', this.arialabel);
        } else if (this.text) {
            this.button.setAttribute('aria-label', this.text);
        }
        this.button.setAttribute('id', this.id);
        this.button.setAttribute('role', 'button');
        this.button.setAttribute('type', (this.submits ? 'submit' : 'button'));
        this.button.classList.add(this.size);

        for (let c of this.classes) {
            this.button.classList.add(c);
        }

        CFBUtils.applyAttributes(this.attributes, this.button);
        CFBUtils.applyDataAttributes(this.dataattributes, this.button);

        this.button.addEventListener('focusin', (e) => {
            if ((this.focusin) && (typeof this.focusin === 'function')) {
                this.focusin(e, this);
            }
        });
        this.button.addEventListener('focusout', (e) => {
            if ((this.focusout) && (typeof this.focusout === 'function')) {
                this.focusout(e, this);
            }
        });
        this.button.addEventListener('mouseover', (e) => {
            if ((this.hoverin) && (typeof this.hoverin === 'function')) {
                this.hoverin(e, this);
            }
        });
        this.button.addEventListener('mouseout', (e) => {
            if ((this.hoverout) && (typeof this.hoverout === 'function')) {
                this.hoverout(e, this);
            }
        });

        if (this.tooltip) {
            this.tooltipobj = new ToolTip({
                id: `${this.id}-tt`,
                text: this.tooltip,
                icon: this.tipicon,
                gravity: this.tipgravity,
            });
            this.tooltipobj.attach(this.button);
        }

        if (this.notab) {
            this.button.setAttribute('tabindex', '-1');
        } else {
            this.button.setAttribute('tabindex', '0');
        }
        if (this.disabled) { this.disable(); }

        if (this.hidden) { this.hide(); }

        if (this.mute) {
            this.button.classList.add('mute');
        } else if (this.ghost) {
            this.button.classList.add('ghost');
        } else if (this.link) {
            this.button.classList.add('link');
        } else if (this.naked) {
            this.button.classList.add('naked');
        }
        if (this.shape) { this.button.classList.add(this.shape); }

        if (this.image) {
            this.button.classList.add('naked');
            this.button.classList.add('image');
            if (!this.shape) { this.button.classList.add('square'); }
            this.button.style.backgroundImage = `url(${this.image})`;
        }


        if ((!this.submits) && (this.action) && (typeof this.action === 'function')) {
            this.button.addEventListener('click', (e) => {
                if (!this.disabled) {
                    this.action(e, this);
                }
            });
        }

        if (this.badgevalue) {
            this.badge = this.badgevalue;
        }
    }


    set badge(value) {
        if ((value === null) || (value === 0)) {
            if (this.badgeobj) {
                this.button.removeChild(this.badgeobj);
            }
            this.badgeobj = null;
            this.badgevalue = null;
        } else {
            this.badgevalue = value;
            if (!this.badgeobj) {
                this.badgeobj = document.createElement('span');
                this.badgeobj.classList.add('badge');
            }
            this.badgeobj.innerHTML = this.badgevalue;
            this.button.appendChild(this.badgeobj);
        }
    }


    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get action() { return this.config.action; }
    set action(action) {
        if (typeof action !== 'function') {
            console.error("Action provided to button is not a function!");
        }
        this.config.action = action;
    }

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get aslink() { return this.config.aslink; }
    set aslink(aslink) { this.config.aslink = aslink; }

    get attributes() { return this.config.attributes; }
    set attributes(attributes) { this.config.attributes = attributes; }

    get badgeobj() { return this._badgeobj; }
    set badgeobj(badgeobj) { this._badgeobj = badgeobj; }

    get badgevalue() { return this.config.badgevalue; }
    set badgevalue(badgevalue) { this.config.badgevalue = badgevalue; }

    get button() {
        if (!this._button) { this.buildButton(); }
        return this._button;
    }
    set button(button) { this._button = button; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() { return this.button; }
    set container(container) { this.button = container; }

    get dataattributes() { return this.config.dataattributes; }
    set dataattributes(dataattributes) { this.config.dataattributes = dataattributes; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get focusin() { return this.config.focusin; }
    set focusin(focusin) {
        if (typeof focusin !== 'function') {
            console.error("Value provided to focusin is not a function!");
        }
        this.config.focusin = focusin;
    }

    get focusout() { return this.config.focusout; }
    set focusout(focusout) {
        if (typeof focusout !== 'function') {
            console.error("Value provided to focusout is not a function!");
        }
        this.config.focusout = focusout;
    }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get ghost() { return this.config.ghost; }
    set ghost(ghost) { this.config.ghost = ghost; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get hoverin() { return this.config.hoverin; }
    set hoverin(hoverin) {
        if (typeof hoverin !== 'function') {
            console.error("Value provided to hoverin is not a function!");
        }
        this.config.hoverin = hoverin;
    }

    get hoverout() { return this.config.hoverout; }
    set hoverout(hoverout) {
        if (typeof hoverout !== 'function') {
            console.error("Value provided to hoverout is not a function!");
        }
        this.config.hoverout = hoverout;
    }

    get href() { return this.config.href; }
    set href(href) { this.config.href = href; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get iconactual() { return this._iconactual; }
    set iconactual(iconactual) { this._iconactual = iconactual; }

    get iconclasses() { return this.config.iconclasses; }
    set iconclasses(iconclasses) { this.config.iconclasses = iconclasses; }

    get iconside() { return this.config.iconside; }
    set iconside(iconside) { this.config.iconside = iconside; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get image() { return this.config.image; }
    set image(image) { this.config.id = image; }

    get link() { return this.config.link; }
    set link(link) { this.config.link = link; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get naked() { return this.config.naked; }
    set naked(naked) { this.config.naked = naked; }

    get notab() { return this.config.notab; }
    set notab(notab) { this.config.notab = notab; }

    get secondicon() { return this.config.secondicon; }
    set secondicon(secondicon) { this.config.secondicon = secondicon; }

    get secondiconactual() { return this._secondiconactual; }
    set secondiconactual(secondiconactual) { this._secondiconactual = secondiconactual; }

    get shape() { return this.config.shape; }
    set shape(shape) { this.config.shape = shape; }

    get size() { return this.config.size; }
    set size(size) { this.config.size = size; }

    get submits() { return this.config.submits; }
    set submits(submits) { this.config.submits = submits; }

    get text() { return this.config.text; }
    set text(text) {
        if (this.textobj) { this.textobj.innerHTML = text; }
        this.config.text = text;
    }

    get textobj() { return this._textobj; }
    set textobj(textobj) { this._textobj = textobj; }

    get tipgravity() { return this.config.tipgravity; }
    set tipgravity(tipgravity) { this.config.tipgravity = tipgravity; }

    get tipicon() { return this.config.tipicon; }
    set tipicon(tipicon) { this.config.tipicon = tipicon; }

    get tooltip() { return this.config.tooltip; }
    set tooltip(tooltip) { this.config.tooltip = tooltip; }

    get tooltipobj() { return this._tooltipobj; }
    set tooltipobj(tooltipobj) { this._tooltipobj = tooltipobj; }

}
window.SimpleButton = SimpleButton;
class ButtonMenu extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: (e, self) => {
                let focused = (document.activeElement === self.button);
                if ((focused) && (!self.isopen)) {
                    self.open();
                }
                e.stopPropagation();
            },
            stayopen: false, // Set true for it to stay open when elements are clicked within.
            gravity: 's', // Gravity direction for the menu
            tooltipgravity: 'e', // Gravity direction for the tooltips
            data: null, // A place to store information that the button actions may need, if the menu is
                        // constructed in a closed setting (like inside of a DataGrid row).
                        // Typically set by the calling system
            secondicon: 'triangle-down', // this is passed up as a secondicon
            autoclose: true, // don't close on outside clicks
            menu: null, // can be passed a dom object to display in the menu. If present, ignores items.
            items: []   // list of menu item definitions
                        // {
                        //    label: "Menu Text", // text
                        //    tooltip: null, // Tooltip text
                        //    tipicon: null, // Tooltip icon, if any
                        //    icon: null, // Icon to use in the menu, if any
                        //    action: function() { } // what to do when the tab is clicked.
                        // }
        };
    }

    /**
     * Close any open ButtonMenus
     */
    static closeOpen() {
        if (ButtonMenu.activeMenu) {
            ButtonMenu.activeMenu.close();
        }
    }

    constructor(config) {
        config = Object.assign({}, ButtonMenu.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('menu');
        } else {
            config.classes = ['menu'];
        }
        super(config);
        if (this.menu) {
            this.processMenu();
        } else {
            this.buildMenu();
        }
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the button is open
     * @return true if it is!
     */
    get isopen() {
        return this.button.hasAttribute('aria-expanded');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Toggle the menu.
     */
    toggle() {
        if (this.isopen) {
            this.close();
            return;
        }
        this.open();
    }

    /**
     * Opens the menu
     */
    open() {
        if (this.isopen) { return; }

        ButtonMenu.closeOpen(); // close open menus

        document.body.appendChild(this.menu);
        this.button.setAttribute('aria-expanded', 'true');
        this.menu.removeAttribute('aria-hidden');

        if ((this.items) && (this.items.length > 0)) {
            let items = Array.from(this.menu.querySelector('li'));
            for (let li of items) {
                li.setAttribute('tabindex', '0');
            }
        }

        this.menu.classList.add(this.gravity);

        if (typeof ButtonMenu.activeMenu === 'undefined' ) {
            ButtonMenu.activeMenu = this;
        } else {
            ButtonMenu.activeMenu = this;
        }

        let focusable = this.menu.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        window.setTimeout(() => { // Do the focus thing late
            if ((focusable) && (focusable.length > 0)) {
                focusable[0].focus();
            }
        }, 200);

        if (this.autoclose) {
            window.setTimeout(() => { // Set this after, or else we'll get bouncing.
                this.setCloseListener();
            }, 200);
        }
        window.addEventListener('scroll', this.setPosition, true);

        if (this.autoclose) {
            window.setTimeout(() => { // Set this after, or else we'll get bouncing.
                this.setPosition();
            }, 50);
        }

    }

    /**
     * Position the menu
     */
    setPosition() {
        if (!ButtonMenu.activeMenu) { return; }
        let self = ButtonMenu.activeMenu;

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = self.button.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top,
            offsetRight = bodyRect.right - elemRect.right,
            offsetBottom = elemRect.bottom - bodyRect.bottom;

        switch(self.gravity) {
            case 'w':
            case 'west':
                self.menu.style.top = `${offsetTop - (self.button.clientHeight / 2)}px`;
                self.menu.style.left = `${offsetLeft - self.menu.clientWidth - (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'e':
            case 'east':
                self.menu.style.top = `${offsetTop - (self.button.clientHeight / 2)}px`;
                self.menu.style.left = `${offsetLeft + self.button.offsetWidth + (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'n':
            case 'north':
                self.menu.style.top = `${(offsetTop - self.menu.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.menu.style.left = `${offsetLeft - self.menu.offsetWidth + self.button.offsetWidth}px`;
                break;
            case 'nw':
            case 'northwest':
                self.menu.style.top = `${(offsetTop - self.menu.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.menu.style.left = `${offsetLeft - (self.button.clientWidth / 2)}px`;
                break;
            case 'se':
            case 'southeast':
                self.menu.style.top = `${(offsetTop + self.button.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.menu.style.left = `${offsetLeft - (self.button.clientWidth / 2)}px`;
                break;
            case 's':
            case 'south':
            case 'southwest':
            default:
                self.menu.style.top = `${(offsetTop + self.button.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.menu.style.left = `${offsetLeft - self.menu.offsetWidth + self.button.offsetWidth}px`;
                break;
        }

    }

    /**
     * Closes the button
     */
    close() {
        window.removeEventListener('scroll', this.setPosition, true);
        this.button.appendChild(this.menu);
        this.button.removeAttribute('aria-expanded');
        this.menu.setAttribute('aria-hidden', 'true');

        if ((this.items) && (this.items.length > 0)) {
            let items = Array.from(this.menu.querySelector('li'));
            for (let li of items) {
                li.setAttribute('tabindex', '-1');
            }
        }
        ButtonMenu.activeMenu = null;
    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { this.close(); }
        }, { once: true });

        window.addEventListener('click', (e) => {
            let tag = this.menu.tagName.toLowerCase();
            if (((this.menu.contains(e.target))) && (this.stayopen)) {
                this.setCloseListener();
            } else if ((this.menu.contains(e.target)) && ((tag === 'form') || (tag === 'div'))) {
            } else if (this.menu.contains(e.target)) {
                this.close();
            } else if (this.button.contains(e.target)) {
                this.toggle();
            } else {
                this.close();
            }
        }, { once: true, });
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the menu.
     * @returns DOM representation
     */
    buildMenu() {
        this.menu = document.createElement('ul');
        this.menu.classList.add('button-menu');
        this.menu.setAttribute('aria-hidden', 'true');
        this.menu.setAttribute('tabindex', '0');

        for (let c of this.classes) {
            this.menu.classList.add(c);
        }

        let order = 1;

        for (let item of this.items) {

            let next = order + 1,
                previous = order - 1;
            if (previous < 1) { previous = 1; }
            if (next > this.items.length) { next = this.items.length; }

            let menuitem = document.createElement('li');
            menuitem.setAttribute('tabindex', '-1');
            menuitem.setAttribute('data-order', order);

            menuitem.addEventListener('keyup', (e) => {
                switch (e.key) {
                    case 'Tab':
                    case 'Escape':
                        this.close();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.menu.querySelector(`[data-order='${previous}']`).focus();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.menu.querySelector(`[data-order='${next}']`).focus();
                        break;
                    case 'Enter': // Enter
                    case ' ': // Space
                        this.querySelector('a').click(); // click the one inside
                        break;

                }
            });

            let anchor = document.createElement('a');
            if (item.icon) {
                anchor.appendChild(IconFactory.icon(item.icon));
            }

            let s = document.createElement('span');
            s.innerHTML = item.label;
            anchor.appendChild(s);

            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                if ((item.action) && (typeof item.action === 'function')) {
                    item.action(e, this);
                }
                this.close();
            });

            menuitem.appendChild(anchor);

            if (item.tooltip) {
                new ToolTip({
                    text: item.tooltip,
                    icon: item.tipicon,
                    gravity: this.tooltipgravity
                }).attach(menuitem);
            }

            this.menu.appendChild(menuitem);

            order++;
        }
        this.button.appendChild(this.menu);
    }

    /**
     * Applies handlers and classes to a provided menu.
     */
    processMenu() {
        this.menu.setAttribute('aria-hidden', 'true');
        this.menu.setAttribute('tabindex', '0');
        this.menu.classList.add('button-menu');
        this.button.appendChild(this.menu);
        this.menu.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autoclose() { return this.config.autoclose; }
    set autoclose(autoclose) { this.config.autoclose = autoclose; }

    get data() { return this.config.data; }
    set data(data) { this.config.data = data; }

    get gravity() { return this.config.gravity; }
    set gravity(gravity) { this.config.gravity = gravity; }

    get items() { return this.config.items; }
    set items(items) { this.config.items = items; }

    get menu() { return this.config.menu; }
    set menu(menu) { this.config.menu = menu; }

    get stayopen() { return this.config.stayopen; }
    set stayopen(stayopen) { this.config.stayopen = stayopen; }

    get tooltipgravity() { return this.config.tooltipgravity; }
    set tooltipgravity(tooltipgravity) { this.config.tooltipgravity = tooltipgravity; }

}
window.ButtonMenu = ButtonMenu;
class ConstructiveButton extends SimpleButton {
    constructor(config) {
        if (config.classes) {
            config.classes.push('constructive');
        } else {
            config.classes = ['constructive'];
        }
        super(config);
    }
}
window.ConstructiveButton = ConstructiveButton;
class DestructiveButton extends SimpleButton {
    constructor(config) {
        if (config.classes) {
            config.classes.push('destructive');
        } else {
            config.classes = ['destructive'];
        }
        super(config);
    }
}
window.DestructiveButton = DestructiveButton;
class CloseButton extends SimpleButton {
    static get DEFAULT_CONFIG() {
        return {
            icon: 'echx',
            text: TextFactory.get('close'),
            shape: "square",
            iconclasses: ['closeicon'],
            classes: ["naked", "closebutton"]
        };
    }
    constructor(config) {
        config = Object.assign({}, CloseButton.DEFAULT_CONFIG, config);
        super(config);
    }
}
window.CloseButton = CloseButton;
class HamburgerButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            toggletarget: null, // The menu object to open or close.
            text: TextFactory.get('open_menu'),
            shape: 'square',
            naked: true,
            icon: HamburgerButton.MAGIC_HAMBURGER,
            toggleaction: () => { },
            action: (e, self) => { self.toggle(); }
        };
    }
    static get DEFAULT_CONFIG_DOCUMENTATION() {
        return {
            toggletarget: { type: 'option', datatype: 'object', description: "The menu object to open or close." },
            text: { type: 'option', datatype: 'string', description: "The text for the button. This is used as an aria-label only." },
            toggleaction: { type: 'option', datatype: 'function', description: "A function to execute when the button is toggled. Passed 'self" },
        };
    }

    static get MAGIC_HAMBURGER() {
        let hb = document.createElement('span');
        hb.classList.add('magichamburger');
        hb.innerHTML = "<span></span><span></span><span></span>";
        return hb;
    }

    constructor(config) {
        config = Object.assign({}, HamburgerButton.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('hamburger');
        } else {
            config.classes = ['hamburger'];
        }
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the button is open
     * @return true if it is!
     */
    get isopen() {
        return this.button.hasAttribute('aria-expanded');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    toggle() {
        if ((this.toggleaction) && (typeof this.toggleaction === 'function')) {
            this.toggleaction(this);
        }
        if (this.isopen) {
            this.close();
            return;
        }
        this.open();
        if ((this.toggletarget) && (this.toggletarget.toggle)) {
            this.toggletarget.toggle();
        }
    }

    /**
     * Opens the menu
     */
    open() {
        if (this.isopen) { return; }
        this.button.setAttribute('aria-expanded', 'true');
    }

    /**
     * Closes the button
     */
    close() {
        this.button.removeAttribute('aria-expanded');
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get toggleaction() { return this.config.toggleaction; }
    set toggleaction(toggleaction) { this.config.toggleaction = toggleaction; }

    get toggletarget() { return this.config.toggletarget; }
    set toggletarget(toggletarget) { this.config.toggletarget = toggletarget; }

}
window.HamburgerButton = HamburgerButton;
class HelpButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: (e, self) => { self.tooltip.open(); },
            icon: 'help-circle',
            tipicon: 'help-circle',
            tipgravity: 'n',
            arialabel: TextFactory.get('help'),
            iconclasses: ['helpicon'],
            tooltip: null // help text to display
        };
    }

    constructor(config) {
        config = Object.assign({}, HelpButton.DEFAULT_CONFIG, config);
        if (config.classes) {
            if (!config.classes.includes('tagbutton')) {
                config.classes.push('naked');
                config.classes.push('help');
            }
        } else {
            config.classes = ['naked', 'help'];
        }
        if (!config.id) { // need to generate an id for aria stuff
            config.id = `${CFBUtils.getUniqueKey(5)}-help`;
        }
        super(config);
    }

}
window.HelpButton = HelpButton;
class SkipButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            text: TextFactory.get('skip_to_content'),
            classes: ['visually-hidden', 'skipbutton'],
            id: 'content-jump',
            contentstart: "#content-start",
            focusin: (e, self) => {
                self.button.classList.remove('visually-hidden');
            },
            focusout: (e, self) => {
                self.button.classList.add('visually-hidden');
            },
            action: (e, self) => {
                let url = location.href;
                location.href = self.contentstart;
                history.replaceState(null,null,url);
            }
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. This is predefined on a SkipButton." },
            contentstart: { type: 'option', datatype: 'string', description: "The id of the element to jump to that marks the start of the content." }
        };
    }
    constructor(config) {
        config = Object.assign({}, SkipButton.DEFAULT_CONFIG, config);
        super(config);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    /**
     * Get the content start identifier
     * @return {string}
     */
    get contentstart() { return this.config.contentstart; }
    set contentstart(contentstart) { this.config.contentstart = contentstart; }

}
window.SkipButton = SkipButton;
class TagButton extends HelpButton {

    static get DEFAULT_CONFIG() {
        return {
            iconside: 'right', // The side the button displays on
            icon: 'echx',  // icon to use in the button,
            iconclasses: ['tagicon'],
            shape: 'pill',
            size: 'small'
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, TagButton.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('tagbutton');
        } else {
            config.classes = ['tagbutton'];
        }
        super(config);
    }

}
window.TagButton = TagButton;
class Panel {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            dataattributes: null, // A dictionary, key: value, which will end up with data-$key = value on elements
            attributes: null, // A dictionary, key: value, which will end up with $key = value on elements
            contentid : null, // The contentid
            headerid : null, // The headerid
            title: null, // The title
            content : null, // The content payload
            style: 'plain', // Various styles that can be applied to the panel.
                            // - 'plain': simple, spartan, solid.
                            // - 'invisible: panel behaves as normal but the background is transparent
            hidden: false, // set to true to hide
            collapsible: true, // can the panel collapse
            closeicon: 'chevron-up',
            minimized: false, // Start minimized
            classes: [], //Extra css classes to apply,
            onclose: null, // A function to run to when the panel closes. Passed the self.
            onopen: null // A function to run to when the panel opens. Passed the self.
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The panel will have this as it's id." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            dataattributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with data-$key = value on elements." },
            attributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with $key = value on elements" },
            arialabel: { type: 'option', datatype: 'string', description: "The aria-label attribute" },
            hidden: { type: 'option', datatype: 'boolean', description: "If true, start hidden or not." },
            minimized: { type: 'option', datatype: 'boolean', description: "Start collapsed/minimized." },
            collapsible: { type: 'option', datatype: 'boolean', description: "Can the panel collapse? If false, minimized is ignored." },
            onclose: { type: 'option', datatype: 'function', description: "A function to run to when the panel closes. Passed the self." },
            onopen: { type: 'option', datatype: 'function', description: "A function to run to when the panel opens. Passed the self as argument." },
            closeicon: { type: 'option', datatype: 'string', description: "The icon to use in for the close/open button.." },
            contentid: { type: 'option', datatype: 'string', description: "A unique id value. This applies to the panel's content." },
            headerid: { type: 'option', datatype: 'string', description: "A unique id value. This applies to the panel's header." },
            title: { type: 'option', datatype: 'string', description: "The title to use for the panel." },
            content: { type: 'option', datatype: 'object', description: "The panel content payload." },
            style: { type: 'option', datatype: 'enumeration', description: "Various styles that can be applied to the panel. Values are plain' or 'invisible'." }
                             // Various styles that can be applied to the panel.
                            // - 'plain': simple, spartan, solid.
                            // - 'invisible: panel behaves as normal but the background is transparent
        };
    }

    constructor(config) {
        this.config = Object.assign({}, Panel.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `panel-${CFBUtils.getUniqueKey(5)}`; }
        if (!this.contentid) { this.contentid = `panel-c-${CFBUtils.getUniqueKey(5)}`; }
        if (!this.headerid) { this.headerid = `panel-h-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Toggle panel minimization
     */
    toggleClose() {
        if (this.minimized) {
            this.open();
            return;
        }
        this.close();
    }

    /**
     * Unminimize the panel
     */
    open() {
        this.minimized = false;
        this.container.setAttribute('aria-expanded', 'true');
        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }
    }

    /**
     * Minimize the panel
     */
    close() {
        this.container.setAttribute('aria-expanded', 'false');
        this.minimized = true;
        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }
    }

    /**
     * Show the panel
     */
    show() {
        this.container.removeAttribute('aria-hidden');
    }

    /**
     * Hide the panel
     */
    hide() {
        this.container.setAttribute('aria-hidden', 'true');
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the header.
     */
    buildHeader() {

        this.header = document.createElement('h3');
        this.header.classList.add('panelheader');
        if (this.collapsible) {
            this.togglebutton = new SimpleButton({
                id: this.headerid,
                secondicon: this.closeicon,
                text: this.title,
                naked: true,
                iconclasses: ['headerbutton'],
                classes: ['headerbutton'],
                action: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleClose();
                }
            });
            this.header.appendChild(this.togglebutton.button);
        } else {
            this.header.classList.add('nocollapse');
            this.header.innerHTML = this.title;
        }
    }

    /**
     * Build the HTML elements of the Panel
     */
    buildContainer() {

        this.container = document.createElement('div');
        this.container.classList.add('panel');
        this.container.setAttribute('aria-expanded', 'true');

        this.contentbox = document.createElement('div');
        this.contentbox.classList.add('content');
        this.contentbox.setAttribute('role', 'region');

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.title) {
            this.container.appendChild(this.header);
            this.contentbox.setAttribute('aria-labelledby', this.headerid);
        }
        if (this.content) {
            this.contentbox.appendChild(this.content);
        }

        CFBUtils.applyAttributes(this.attributes, this.container);
        CFBUtils.applyDataAttributes(this.dataattributes, this.container);

        this.container.appendChild(this.contentbox);

        if (this.minimized) { // don't call close() to avoid the callbacks.
            this.container.setAttribute('aria-expanded', 'false');
            this.minimized = true;
        }

        if (this.hidden) { this.hide(); }
    }

    /**
     * Replace the content with other content
     * @param content the content to place
     */
    replace(content) {
        this.contentbox.innerHTML = '';
        this.content = content;
        this.contentbox.appendChild(this.content);
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get attributes() { return this.config.attributes; }
    set attributes(attributes) { this.config.attributes = attributes; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get dataattributes() { return this.config.dataattributes; }
    set dataattributes(dataattributes) { this.config.dataattributes = dataattributes; }

    get togglebutton() { return this._togglebutton; }
    set togglebutton(togglebutton) { this._togglebutton = togglebutton; }

    get closeicon() { return this.config.closeicon; }
    set closeicon(closeicon) { this.config.closeicon = closeicon; }

    get collapsible() { return this.config.collapsible; }
    set collapsible(collapsible) { this.config.collapsible = collapsible; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get content() { return this.config.content; }
    set content(content) { this.config.content = content; }

    get contentid() { return this.config.contentid; }
    set contentid(contentid) { this.config.contentid = contentid; }

    get contentbox() { return this._contentbox; }
    set contentbox(contentbox) { this._contentbox = contentbox; }

    get header() {
        if (!this._header) { this.buildHeader(); }
        return this._header;
    }
    set header(header) { this._header = header; }

    get headerid() { return this.config.headerid; }
    set headerid(headerid) { this.config.headerid = headerid; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get minimized() { return this.config.minimized; }
    set minimized(minimized) { this.config.minimized = minimized; }

    get onclose() { return this.config.onclose; }
    set onclose(onclose) {
        if (typeof onclose !== 'function') {
            console.error("Action provided for onclose is not a function!");
        }
        this.config.onclose = onclose;
    }

    get onopen() { return this.config.onopen; }
    set onopen(onopen) {
        if (typeof onopen !== 'function') {
            console.error("Action provided for onopen is not a function!");
        }
        this.config.onopen = onopen;
    }

    get position() { return this.config.position; }
    set position(position) { this.config.position = position; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

    get title() { return this.config.title; }
    set title(title) {
        this.config.title = title;
        if (this.togglebutton) {
            this.togglebutton.text = title;
        } else if (this.header) {
            this.header.innerHTML = title;
        }
    }

    get titlecontainer() { return this._titlecontainer; }
    set titlecontainer(titlecontainer) { this._titlecontainer = titlecontainer; }

}
window.Panel = Panel;
class LoadingShade {
    static get DEFAULT_CONFIG() {
        return {
            id : null,
            spinnerstyle: 'spin',
            spinnertext: TextFactory.get('simpleform-spinnertext'),
            classes: []
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            spinnerstyle: { type: 'option', datatype: 'enumeration', description: "The type of spinner to show (spin|bounce)" },
            spinnertext: { type: 'option', datatype: 'string', description: "The text to show on the loading shade." }
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, LoadingShade.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `shade-${CFBUtils.getUniqueKey(5)}`; }
        return this;
    }

    activate() {
        if (this.container.parentNode) {
            this.container.parentNode.classList.add('shaded');
        }
        this.container.removeAttribute('aria-hidden');
    }

    deactivate() {
        if (this.container.parentNode) {
            this.container.parentNode.classList.remove('shaded');
        }
        this.container.setAttribute('aria-hidden', 'true');
    }

    toggle() {
        if (this.container.getAttribute('aria-hidden') === true) {
            this.activate();
        } else {
            this.deactivate();
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Draw the Form's shade
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('loading-shade');
        this.container.setAttribute('aria-hidden', true);

        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.spinnerstyle) {
            let d = document.createElement('div');
            d.classList.add('spinner');
            d.classList.add(this.spinnerstyle);
            this.container.appendChild(d);
        }
        if (this.spinnertext) {
            let d = document.createElement('div');
            d.classList.add('spinnertext');
            d.innerHTML = this.spinnertext;
            this.container.appendChild(d);
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get spinnerstyle() { return this.config.spinnerstyle; }
    set spinnerstyle(spinnerstyle) { this.config.spinnerstyle = spinnerstyle; }

    get spinnertext() { return this.config.spinnertext; }
    set spinnertext(spinnertext) { this.config.spinnertext = spinnertext; }

}
window.LoadingShade = LoadingShade;
class SimpleProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            classes: [],
            label: null,
            help: null,
            style: 'boxed',
            commaseparate: true,
            direction: 'horizontal',
            currentrank: null,
            nextrank: null,
            showcaps: true,
            decalposition: 'interior',
            maxvalue: 100,
            minvalue: 0,
            value: 50,
            fill: null
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The dialog object will have this as it's id." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            label: { type: 'option', datatype: 'string', description: "The title for the progress meter." },
            help: { type: 'option', datatype: 'string', description: "Help text." },
            style: { type: 'option', datatype: 'enmumeration', description: "One of a handful of additional styles: boxed, roundcap or interiorroundcamp" },
            commaseparate: { type: 'option', datatype: 'boolean', description: "Set to false to not comma separate numbers." },
            currentrank: { type: 'option', datatype: 'string', description: "A string, if present, will be displayed inside (along with minvalue)." },
            direction: { type: 'option', datatype: 'enumeration', description: "Which direction does the meter run? Values: 'vertical' or 'horizontal' (default)." },
            nextrank: { type: 'option', datatype: 'string', description: "A string, if present, will be displayed inside (along with maxvalue)." },
            showcaps: { type: 'option', datatype: 'boolean', description: "if true, show the min and max values.  True by default if currentrank or nextrank is set." },

            decalposition: { type: 'option', datatype: 'enumeration', description: "Where should the decals appear. Values: non, exterior, exterior-bottom" },
            maxvalue: { type: 'option', datatype: 'number', description: "The maximum score value for the meter." },
            minvalue: { type: 'option', datatype: 'number', description: "The minimum score value for the meter." },
            value: { type: 'option', datatype: 'number', description: "The current score, absolute." },
            fill: { type: 'option', datatype: 'number', description: "Width of the progressbar to fill.  Used if provided, or else calculated from other values." }
        };
    }


    /**
     * Define a SimpleProgressMeter
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleProgressMeter.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `progress-${CFBUtils.getUniqueKey(5)}`; }
        this.determineFill();
    }

    /* CORE METHODS_____________________________________________________________________ */

    determineFill() {
        if (this.fill) return; // use provided fill

        // Figure out where value lies between minnumber and maxxnumber.
        let pointscale = (this.maxvalue - this.minvalue),
            subjectivevalue = this.value - this.minvalue;

        if (this.value < this.minvalue) {
            subjectivevalue = this.value;
        }

        this.fill = (subjectivevalue / pointscale) * 100;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the container
     */
    buildContainer() {


        this.container = document.createElement('div');
        this.container.classList.add('progressbar-container');
        this.container.classList.add(this.direction);

        this.progress = document.createElement('div');
        this.progress.classList.add('progress');

        this.bar = document.createElement('div');
        this.bar.classList.add('simpleprogress');
        this.bar.classList.add(this.style);
        this.bar.appendChild(this.progress);

        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.label) { this.container.appendChild(this.labelobj); }

        if (((this.currentrank) || (this.nextrank))
            && (this.decalposition) && (this.decalposition === 'exterior')) {
            this.container.appendChild(this.decallayer);
            this.bar.classList.add('exteriordecal');
        }

        this.container.appendChild(this.bar);

        if (((this.currentrank) || (this.nextrank))
            && (this.decalposition) && (this.decalposition !== 'exterior')
            && (this.decalposition !== 'none')) {
            if (this.decalposition === 'exterior-bottom') {
                this.container.appendChild(this.decallayer);
                this.bar.classList.add('exteriordecal-bottom');
            } else {
                this.bar.appendChild(this.decallayer);
                this.bar.classList.add('withdecals');
            }
        }

        // Don't allow the the fill animation to fire until it's in the page
        setTimeout(() => {
            if (this.direction === 'vertical') {
                this.progress.style.height = `${this.fill}%`;
            } else {
                this.progress.style.width = `${this.fill}%`;
            }
        }, 500);
    }

    /**
     * Builds the decal layer
     */
    buildDecalLayer() {
        if ((!this.currentrank) && (!this.nextrank) && (!this.showcaps)) { return null; }
        if (this.decalposition === 'none') { return null; }

        this.decallayer = document.createElement('div');
        this.decallayer.classList.add('decals');
        this.decallayer.classList.add(this.decalposition);

        if ((this.currentrank) || (this.showcaps)) {
            let p = document.createElement('div');
            p.classList.add('current');
            if (this.currentrank) {
                let currrank = document.createElement('div');
                currrank.classList.add('name');
                currrank.innerHTML = this.currentrank;
                p.appendChild(currrank);
            }
            if (this.showcaps) {
                let value = document.createElement('div');
                value.classList.add('value');
                value.innerHTML = (this.commaseparate ? CFBUtils.readableNumber(this.minvalue) : this.minvalue);
                p.appendChild(value);
            }
            this.decallayer.appendChild(p);
        }
        if ((this.nextrank) || (this.showcaps)) {
            let p = document.createElement('div');
            p.classList.add('next');
            if (this.nextrank) {
                let nrank = document.createElement('div');
                nrank.classList.add('name');
                nrank.innerHTML = this.nextrank;
                p.appendChild(nrank);
            }
            if (this.showcaps) {
                let value = document.createElement('div');
                value.classList.add('value');
                value.innerHTML = (this.commaseparate ? CFBUtils.readableNumber(this.maxvalue) : this.maxvalue);
                p.appendChild(value);
            }
            this.decallayer.appendChild(p);
        }
    }

    /**
     * Builds the label
     */
    buildLabel() {

        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.innerHTML = this.label;

        if (this.help) {
            this.helpicon = new HelpButton({ help: this.help });
            this.labelobj.appendChild(this.helpicon.button);
            this.labelobj.addEventListener('onmouseover', () => {
                this.helpicon.open();
            });
            this.labelobj.addEventListener('onmouseout', () => {
                this.helpicon.close();
            });
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get bar() { return this._bar; }
    set bar(bar) { this._bar = bar; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get commaseparate() { return this.config.commaseparate; }
    set commaseparate(commaseparate) { this.config.commaseparate = commaseparate; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get decallayer() {
        if (!this._decallayer) { this.buildDecalLayer(); }
        return this._decallayer;
    }
    set decallayer(decallayer) { this._decallayer = decallayer; }

    get decalposition() { return this.config.decalposition; }
    set decalposition(decalposition) { this.config.decalposition = decalposition; }

    get direction() { return this.config.direction; }
    set direction(direction) { this.config.direction = direction; }

    get fill() { return this.config.fill; }
    set fill(fill) { this.config.fill = fill; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helpicon() { return this._helpicon; }
    set helpicon(helpicon) { this._helpicon = helpicon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get label() { return this.config.label; }
    set label(label) { this.config.label = label; }

    get labelobj() {
        if (!this._labelobj) { this.buildLabel(); }
        return this._labelobj;
    }
    set labelobj(labelobj) { this._labelobj = labelobj; }
    get maxvalue() { return this.config.maxvalue; }
    set maxvalue(maxvalue) { this.config.maxvalue = maxvalue; }

    get minvalue() { return this.config.minvalue; }
    set minvalue(minvalue) { this.config.minvalue = minvalue; }

    get nextrank() { return this.config.nextrank; }
    set nextrank(nextrank) { this.config.nextrank = nextrank; }

    get currentrank() { return this.config.currentrank; }
    set currentrank(currentrank) { this.config.currentrank = currentrank; }

    get progress() { return this._progress; }
    set progress(progress) { this._progress = progress; }

    get value() { return this.config.value; }
    set value(value) { this.config.value = value; }

    get showcaps() { return this.config.showcaps; }
    set showcaps(showcaps) { this.config.showcaps = showcaps; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

}
window.SimpleProgressMeter = SimpleProgressMeter;

class MessageBox {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            icon: null,
            title: null,
            content: null,
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, MessageBox.DEFAULT_CONFIG, config);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('messagebox');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.title) {
            this.header = document.createElement('h3');
            this.header.innerHTML = this.title;
            this.container.appendChild(this.header);
        }
        if (this.content) {
            if (this.icon) {
                this.payload.appendChild(IconFactory.icon(this.icon));
            }
            this.content.classList.add('content');
            this.payload.appendChild(this.content);
            this.container.appendChild(this.payload);
        }
    }

    buildPayload() {
        this.payload = document.createElement('div');
        this.payload.classList.add('payload');
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get content() { return this.config.content; }
    set content(content) { this.config.content = content; }

    get header() { return this._header; }
    set header(header) { this._header = header; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get payload() {
        if (!this._payload) { this.buildPayload(); }
        return this._payload;
    }
    set payload(payload) { this._payload = payload; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

}
window.MessageBox = MessageBox;
class InstructionBox extends MessageBox {

    static get DEFAULT_CONFIG() {
        return {
            icon : 'help-circle', // If present, will be displayed large next to texts
            instructions: [] // An array of instruction texts
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, InstructionBox.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('instructions');
        } else {
            config.classes = ['instructions'];
        }
        super(config);
    }

    /* PSEUDO GETTERS___________________________________________________________________ */

    get infolist() { return this.instructions; }
    set infolist(infolist) { this.instructions = infolist; }

    setInstructions(instructions) {
        this.setInfolist(instructions);
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Replace existing infolist with some different ones
     * @param infolist an array of info items
     */
    setInfolist(infolist) {
        this.container.classList.remove('size-1');
        this.container.classList.remove('size-2');
        this.container.classList.remove('size-3');
        this.list.innerHTML = '';

        for (let text of infolist) {
            let li = document.createElement('li');
            li.innerHTML = text;
            this.list.appendChild(li);
        }

        if ((infolist.length > 0) && (infolist.length < 4)) {
            this.container.classList.add(`size-${infolist.length}`);
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the actual DOM container.
     */
    buildContainer() {
        if ((this.infolist) && (this.infolist.length > 0)) {
            for (let text of this.infolist) {
                let li = document.createElement('li');
                li.innerHTML = text;
                this.list.appendChild(li);
            }
            this.content = this.list;
        }

        super.buildContainer();

        if ((this.infolist.length > 0) && (this.infolist.length < 4)) {
            this.container.classList.add(`size-${this.infolist.length}`);
        }
    }

    /**
     * Build the list object.  This is the dumbest method I've ever written.
     */
    buildList() {
        this.list = document.createElement('ul');
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get list() {
        if (!this._list) { this.buildList(); }
        return this._list;
    }
    set list(list) { this._list = list;  }

}
window.InstructionBox = InstructionBox;
class ResultsContainer {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // Component id
            classes: [], // Extra css classes to apply,
            errors: null, // array of errors
            warnings: null, // array of warning strings
            results: null, // array of result or success message strings
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, ResultsContainer.DEFAULT_CONFIG, config);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full messagebox container
     */
    buildContainer() {
        this.container = document.createElement('div');
        
        this.container.classList.add('resultsbox');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if ((this.errors) && (this.errors.length > 0)) {
            this.container.appendChild(new ErrorBox({
                errors: this.errors,
            }).container);
        }

        if ((this.results) && (this.results.length > 0)) {
            this.container.appendChild(new SuccessBox({
                results: this.results,
            }).container);
        }

        if ((this.warnings) && (this.warnings.length > 0)) {
            this.container.appendChild(new WarningBox({
                warnings: this.warnings,
            }).container);
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get errors() { return this.config.errors; }
    set errors(errors) { this.config.errors = errors; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get results() { return this.config.results; }
    set results(results) { this.config.results = results; }

    get warnings() { return this.config.warnings; }
    set warnings(warnings) { this.config.warnings = warnings; }

    get warningstitle() { return this.config.warningstitle; }
    set warningstitle(warningstitle) { this.config.warningstitle = warningstitle; }

    get warningicon() { return this.config.warningicon; }
    set warningicon(warningicon) { this.config.warningicon = warningicon; }

}
window.ResultsContainer = ResultsContainer;
class ErrorBox extends InstructionBox {

    static get DEFAULT_CONFIG() {
        return {
            title: TextFactory.get('error'),
            icon : 'warn-hex',
            errors: [] // An array of information texts
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, ErrorBox.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('results');
            config.classes.push('errors');
        } else {
            config.classes = ['results', 'errors'];
        }
        super(config);

    }

    /* PSEUDO GETTERS___________________________________________________________________ */

    get infolist() { return this.errors; }
    set infolist(infolist) { this.errors = infolist; }

    setErrors(errors) {
        this.setInfolist(errors);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get errors() { return this.config.errors; }
    set errors(errors) { this.config.errors = errors; }

}
window.ErrorBox = ErrorBox;
class SuccessBox extends InstructionBox {

    static get DEFAULT_CONFIG() {
        return {
            title: TextFactory.get('success'),
            icon : 'disc-check',
            results: [] // An array of information texts
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, SuccessBox.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('results');
            config.classes.push('successes');
        } else {
            config.classes = ['results', 'successes'];
        }
        super(config);
    }

    /* PSEUDO GETTERS___________________________________________________________________ */

    get infolist() { return this.results; }
    set infolist(infolist) { this.results = infolist; }

    setResults(results) {
        this.setInfolist(results);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get results() { return this.config.results; }
    set results(results) { this.config.results = results; }

}
window.SuccessBox = SuccessBox;
class WarningBox extends InstructionBox {

    static get DEFAULT_CONFIG() {
        return {
            title: TextFactory.get('warning'),
            icon : 'warn-triangle',
            warnings: [] // An array of information texts
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, WarningBox.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('results');
            config.classes.push('warnings');
        } else {
            config.classes = ['results', 'warnings'];
        }
        super(config);
    }

    /* PSEUDO GETTERS___________________________________________________________________ */

    get infolist() { return this.warnings; }
    set infolist(infolist) { this.warnings = infolist; }

    setWarnings(warnings) {
        this.setInfolist(warnings);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get warnings() { return this.config.warnings; }
    set warnings(warnings) { this.config.warnings = warnings; }

}
window.WarningBox = WarningBox;
class ColumnConfigurator {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], //Extra css classes to apply,
            fields: [],
            grid: null, // the datagrid to control.
            instructions: TextFactory.get('datagrid-column-config-instructions')
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, ColumnConfigurator.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `cconfig-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the thing.
     */
    buildContainer() {
        /*
         * This this is gigantic and ugly.  Don't @me.
         * It should really be it's own mini-app/class.  Maybe I'll do it that way one day.
         */
        this.container = document.createElement('div');
        this.container.classList.add('column-configurator');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        // instructions
        if (this.instructions) {
            this.container.appendChild(new InstructionBox({
                instructions: [this.instructions]
            }).container);
        }

        this.elements = document.createElement('ul');
        this.elements.classList.add('column-list');

        for (let f of this.grid.fields) {
            let li = document.createElement('li');

            let cbox = new BooleanToggle({
                label: f.label,
                checked: !f.hidden,
                classes: ['column'],
                onchange: () => {
                    this.grid.toggleColumn(f);
                }
            });

            li.appendChild(cbox.container);

            if (f.description) {
                let desc = document.createElement('div');
                desc.classList.add('description');
                desc.innerHTML = f.description;
                li.appendChild(desc);
            }
            this.elements.appendChild(li);
        }

        this.container.appendChild(this.elements);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get elements() { return this._elements; }
    set elements(elements) { this._elements = elements; }

    get fields() { return this.config.fields; }
    set fields(fields) { this.config.fields = fields; }

    get grid() { return this.config.grid; }
    set grid(grid) { this.config.grid = grid; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }
}
window.ColumnConfigurator = ColumnConfigurator;
class DataGrid extends Panel {

    static get DEFAULT_CONFIG() {
        return {
            title: null, // the title for the grid
            id: null, // The id. An id is required to save a grid's state.
            sortable: true, //  Data columns can be sorted
            collapsible: true, // can the panel collapse (passed to the Panel)
            elementname: null,
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
            selectaction: (self) => {  // What to do when a single row is selected.
                //console.log("row clicked");
            },
            doubleclick: null, // Action to take on double click. Passed (e, self); defaults to opening a view
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
            updatehook: (rowdata, self) => { // Function fired when a data row is edited and then saved
            },
            deletehook: (rowdata, self) => { // function fired when a data row is deleted
            },
            duplicatehook: (rowdata, self) => { // function fired when a new data row is created
            },
            createhook: (rowdata, self) => { // function fired when a new data row is created
            },
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

        if (this.id) {
            this.savekey = `grid-test-${this.id}`;
        } else {
            this.id = `grid-${CFBUtils.getUniqueKey(5)}`;
        }

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

        this.activefilters = [];
        this.loadstate();

        this.shade.activate();
        setTimeout(() =>{
           this.fillData();
        }, 100);
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
        } else if (this.data) {
            for (let rdata of this.data) {
                this.gridbody.appendChild(this.buildRow(rdata));
            }
            setTimeout(() => {
                this.postLoad();
                this.shade.deactivate();
            }, 100);
        } else if (this.source) {
            this.fetchData(this.source, (data) => {
                this.update(data);
                this.postLoad();
                this.shade.deactivate();
            });
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
                        val = d[f.name].replace(/"/g,"\\\"");
                        break;
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
                actions: []
            };

        switch(type) {
            case 'column':
                dialogconfig.title = TextFactory.get('configure_columns');

                let cc = new ColumnConfigurator({
                    grid: me
                });
                dialogconfig.content = cc.container;
                dialogconfig.actions.push(new ConstructiveButton({ // need to pass this to sub-routines
                    text: TextFactory.get('save_columns'),
                    icon: 'disc-check',
                    action: () => {
                        dialog.close();
                    }
                }));
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
                        dialog.close();
                    }
                }));

                break;
            default:
                break;
        }

        dialogconfig.actions.push('closebutton');
        let dialog = new DialogWindow(dialogconfig);
        dialog.open();
    }

    /**
     * Opens a data window about the row for various purposes
     * @param mode the mode of the window (view|edit|create|duplicate|delete)
     *
     * @param rowdata the data for the row
     */
    datawindow(mode, rowdata) {

        let dialog,
            dialogconfig = {
            actions: []
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
        dialog = new DialogWindow(dialogconfig);
        dialog.open();
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

        for (let f of this.fields) {
            let e = f.getElement(rowdata[f.name]);
            form.elements.push(e);
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
                if ((this.updatehook) && (typeof this.updatehook === 'function')) {
                    form.handler = (self) => {
                        this.updatehook(self);
                    };
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
                if ((this.createhook) && (typeof this.createhook === 'function')) {
                    form.handler = (self) => {
                        this.createhook(self);
                    };
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
                if ((this.createhook) && (typeof this.createhook === 'function')) {
                    form.handler = (self) => {
                        this.createhook(self);
                    };
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
                if ((this.deletehook) && (typeof this.deletehook === 'function')) {
                    form.handler = (self) => {
                        this.deletehook(rowdata, self);
                    };
                }
                form.passive = false;
                form.elements = [
                    new HiddenField({
                        name: this.identifier,
                        hidden: true,
                        value: rowdata[this.identifier],
                    })
                ];
                form.actions = [
                    new ConstructiveButton({
                        text: [TextFactory.get('datagrid-dialog-item-delete', this.elementname)],
                        icon: "trashcan",
                        submits: true,
                        disabled: true  // No action needed.
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
        this.gridPostProcess();
    }

    /**
     * Things to do after the data in the grid has been manipulated, like
     *    - Updates row counts
     *    - Applies sort
     *    - Applies filters
     *    - Applies search
     *    - Grinds duplicate cells
     */
    gridPostProcess() {
        this.updateCount();
        if (this.currentsort) {
            this.sortField(this.currentsort.field, this.currentsort.direction);
        }
        this.applyFilters();
        this.search(this.searchcontrol.value);
        this.grindDuplicateCells();
    }

    /**
     * Load data from a URL and put it into the grid. Appends by default.
     * @param url the URL to get the data from. Defaults to the source url
     * @param callback (optional) do this instead of Appending data. Takes data as an argument
     */
    fetchData(url=this.source, callback) {
        this.activitynotifier.removeAttribute('aria-hidden');
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
                this.activitynotifier.setAttribute('aria-hidden', 'true');
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
        if (!this.data) { this.data = []; }
        for (let entry of data) {
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
        this.gridPostProcess();
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

        this.gridPostProcess();
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
            if (!this.state) {
                this.state = this.grindstate();
            }
        } else if (!this.state) {
            this.state = this.grindstate();
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
    }

    /**
     * Figures out the state of the grid and generates the state object
     */
    grindstate() {

        let state = {
            fields: {},
            filters: [],
            search: null
        };

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
     */
    select(row, event) {

        if (row.getAttribute('aria-selected') === 'true') {
            this.deselect(row);
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
                this.selectaction(this);
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

        this.container.appendChild(this.gridinfo);

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
            this.itemcount.innerHTML = this.data.length;
            if (this.data.length > 0) { empty = false; }
        }
        if (empty) {
            this.messagebox.innerHTML = "";
            let warnings = [TextFactory.get('datagrid-message-empty_grid')];
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
     * Build the grid info bit
     */
    buildGridInfo() {
        this.gridinfo = document.createElement('div');
        this.gridinfo.classList.add('grid-info');

        this.itemcountlabel = document.createElement('label');
        this.itemcountlabel.innerHTML = TextFactory.get('items_label');

        this.itemcount = document.createElement('span');
        this.itemcount.classList.add('itemcount');

        this.activitynotifier = document.createElement('div');
        this.activitynotifier.classList.add('activity');
        this.activitynotifier.setAttribute('aria-hidden', 'true');
        if (this.activitynotifiericon) {
            this.activitynotifier.appendChild(IconFactory.icon(this.activitynotifiericon));
        }
        if (this.activitynotifiertext) {
            let s = document.createElement('span');
            s.innerHTML = this.activitynotifiertext;
            this.activitynotifier.appendChild(s);
        }

        this.itemcountbox = document.createElement('div');
        this.itemcountbox.classList.add('countbox');
        this.itemcountbox.appendChild(this.itemcountlabel);
        this.itemcountbox.appendChild(this.itemcount);
        this.itemcountbox.appendChild(this.activitynotifier);

        this.gridinfo.appendChild(this.itemcountbox);

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
            this.gridinfo.appendChild(this.searchcontrol.container);
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
            this.gridinfo.appendChild(this.filterbutton.button);
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

        this.gridinfo.appendChild(this.actionsbutton.button);
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
                    this.select(row, e);
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
                onchange: () => {
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

        row.addEventListener('dblclick', (e, self) => {
            if ((this.doubleclick) && (typeof this.doubleclick === 'function')) {
                this.doubleclick(e, self);
            } else {
                this.datawindow('view', rdata);
            }
        });

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
                        myaction.action = ra.action;
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

    get activitynotifier() { return this._activitynotifier; }
    set activitynotifier(activitynotifier) { this._activitynotifier = activitynotifier; }

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

    get deletehook() { return this.config.deletehook; }
    set deletehook(deletehook) {
        if (typeof deletehook !== 'function') {
            console.error("Value provided to deletehook is not a function!");
        }
        this.config.deletehook = deletehook;
    }

    get deleteiteminstructions() { return this.config.deleteiteminstructions; }
    set deleteiteminstructions(deleteiteminstructions) { this.config.deleteiteminstructions = deleteiteminstructions; }

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

    get dataprocessor() { return this.config.dataprocessor; }
    set dataprocessor(dataprocessor) { this.config.dataprocessor = dataprocessor; }

    get deletehook() { return this.config.deletehook; }
    set deletehook(deletehook) {
        if (typeof deletehook !== 'function') {
            console.error("Value provided to deletehook is not a function!");
        }
        this.config.deletehook = deletehook;
    }

    get demphasizeduplicates() { return this.config.demphasizeduplicates; }
    set demphasizeduplicates(demphasizeduplicates) { this.config.demphasizeduplicates = demphasizeduplicates; }

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

    get identifier() { return this._identifier; }
    set identifier(identifier) { this._identifier = identifier; }

    get instructionsicon() { return this.config.instructionsicon; }
    set instructionsicon(instructionsicon) { this.config.instructionsicon = instructionsicon; }

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

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get passiveeditinstructions() { return this.config.passiveeditinstructions; }
    set passiveeditinstructions(passiveeditinstructions) { this.config.passiveeditinstructions = passiveeditinstructions; }

    get rowactions() { return this.config.rowactions; }
    set rowactions(rowactions) { this.config.rowactions = rowactions; }

    get rowactionsicon() { return this.config.rowactionsicon; }
    set rowactionsicon(rowactionsicon) { this.config.rowactionsicon = rowactionsicon; }

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

    get state() { return this._state; }
    set state(state) { this._state = state; }

    get thead() {
        if (!this._thead) { this.buildTableHead(); }
        return this._thead;
    }
    set thead(thead) { this._thead = thead; }

    get updatehook() { return this.config.updatehook; }
    set updatehook(updatehook) {
        if (typeof updatehook !== 'function') {
            console.error("Value provided to updatehook is not a function!");
        }
        this.config.updatehook = updatehook;
    }

    get warehouse() { return this.config.warehouse; }
    set warehouse(warehouse) { this.config.warehouse = warehouse; }

}
window.DataGrid = DataGrid;
class FilterConfigurator {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], //Extra css classes to apply,
            filters: [], // Existing filters.
            fields: [], // Field definitions
            mute: false, // Draw inputs as mute
            instructions: TextFactory.get('datagrid-filter-instructions')

        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, FilterConfigurator.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `fconfig-${CFBUtils.getUniqueKey(5)}`; }
        this.workingfilters = {};
    }

    /* CORE METHODS_____________________________________________________________________ */

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

    /**
     * Test each filter in the list and replace the canonical filters with the valid one.
     */
    grindFilters() {
        let flines = this.elements.querySelectorAll('li.filterline');
        let filters = [];
        for (let li of flines) {
            let f = this.checkValidity(li);
            if (f) {
                filters.push(f);
            }
        }
        this.filters = filters;
    }

    /**
     * Check the validity of a filter line.
     * @param li the line of the filter
     * @return a filter definition (if valid) or null (if invalid)
     */
    checkValidity(li) {
        li.setAttribute('data-valid', 'false'); // ensure false at the start.

        let filter,
            filterid = li.getAttribute('data-filterid'),
            fieldField = li.querySelector(`input[name="primeselector-${filterid}"]:checked`),
            comparatorField = li.querySelector(`input[name="comparator-${filterid}"]:checked`),
            valueField = li.querySelector(`input[name="valuefield-${filterid}"]`);

        if ((fieldField) && (comparatorField) && (valueField)) {
            let valid = false,
                field = fieldField.value,
                comparator = comparatorField.value,
                value = valueField.value;

            if ((field) && (comparator) && (value)) {
                /*
                 * XXX TO DO: Should do deep error checking
                 *   - Does the field exist in the list
                 *   - Is the value provided valid within its datatype
                 *   - Is the comparator one provided by the datatype
                 *   - Is the comparator allowed
                 */
                valid = true;
            }

            if (valid) {
                li.setAttribute('data-valid', 'true');
                filter = {
                    filterid: filterid,
                    field: field,
                    comparator: comparator,
                    value: value
                };
                this.workingfilters[filterid] = filter;
            }
        }
        return filter;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the thing.
     */
    buildContainer() {
        /*
         * This this is gigantic and ugly.  Don't @me.
         * It should really be it's own mini-app/class.  Maybe I'll do it that way one day.
         */

        this.container = document.createElement('div');
        this.container.classList.add('filter-configurator');

        // instructions
        if (this.instructions) {
            this.container.appendChild(new InstructionBox({
                instructions: [this.instructions]
            }).container);
        }

        this.actions = document.createElement('div');
        this.actions.classList.add('filter-actions');

        this.actions.appendChild(new SimpleButton({
            icon: 'cfb-plus',
            text: TextFactory.get('filter-configurator-add_filter'),
            action: () => {
                let unsets = this.elements.querySelectorAll('[data-field="unset"]');
                if (unsets.length < 1) {
                    this.addFilter();
                }
            }
        }).button);

        this.container.appendChild(this.actions);

        this.elements = document.createElement('ul');
        this.elements.classList.add('filter-list');

        if (this.filters) {
            for (let f of this.filters) {
                this.addFilter(f);
            }
        }

        this.container.appendChild(this.elements);

    }

    /**
     * Add a filter line to the configurator.
     * @param filter
     */
    addFilter(filter) {

        let li = document.createElement('li');
        let filterid = `f-tmp-${CFBUtils.getUniqueKey(5)}`;
        li.classList.add('filterline');
        li.setAttribute('data-filterid', filterid);
        li.setAttribute('data-valid', 'false');

        if (filter) {
            let field = this.getField(filter.field);
            li.setAttribute('data-field', filter.field);
            li.appendChild(this.makePrimeSelector(filterid, filter.field).container);
            li.appendChild(this.makeComparatorSelector(filterid, field, filter.comparator).container);
            li.appendChild(this.makeValueSelector(filterid, field, filter.value).container);
            this.workingfilters[filterid] = filter; // add; doesn't need validation
            li.setAttribute('data-valid', 'true');
        } else {
            li.appendChild(this.makePrimeSelector(filterid).container);
            li.setAttribute('data-field', 'unset');
        }

        let validmarker = document.createElement('div');
        validmarker.classList.add('validmarker');
        validmarker.appendChild(IconFactory.icon('checkmark-circle'));
        li.appendChild(validmarker);

        li.appendChild(new SimpleButton({
            icon: 'minus',
            shape: 'square',
            classes: ['filterkiller'],
            action: () => {
                if ((li.getAttribute('data-field')) && (li.getAttribute('data-field') !== 'unset')) {
                    delete this.workingfilters[li.getAttribute('data-filterid')];
                }
                li.parentNode.removeChild(li);
            }
        }).button);

        this.elements.appendChild(li);
    }

    /**
     * Make a 'field' selector.  This selector controls other selectors.
     * @param filterid the filter id
     * @param fieldname (optional) the name of the field to pre-select.
     * @return {SelectMenu}
     */
    makePrimeSelector(filterid, fieldname) {
        let options = [];

        for (let f of this.fields) {
            if (f.filterable) {
                options.push({ value: f.name, label: f.label });
            }
        }

        let primeSelector = new SelectMenu({
            minimal: true,
            options: options,
            name: `primeselector-${filterid}`,
            value: fieldname,
            mute: this.mute,
            placeholder: TextFactory.get('comparator-select_field'),
            classes: ['primeselector'],
            onchange: (self) => {
                let li = self.container.parentElement,
                    validmarker = li.querySelector('div.validmarker'),
                    comparatorfield = li.querySelector('div.select-container.comparator'),
                    valuefield = li.querySelector('div.input-container.valueinput'),
                    field = this.getField(primeSelector.value);

                li.setAttribute('data-valid', 'false');
                if (comparatorfield) {
                    li.removeChild(comparatorfield);
                }
                if (valuefield) {
                    li.removeChild(valuefield);
                }
                if (field) {
                    li.setAttribute('data-field', field.name);
                    li.insertBefore(this.makeComparatorSelector(filterid, field).container, validmarker);
                    li.insertBefore(this.makeValueSelector(filterid, field).container, validmarker);
                    this.checkValidity(li);
                }
            }
        });
        return primeSelector;
    }

    /**
     * Make a 'comparator' selector.
     * @param filterid the filter id
     * @param field the field definition we're making one for
     * @param value (optional) the value to prefill with
     * @return {SelectMenu}
     */
    makeComparatorSelector(filterid, field, value) {

        let ourValue = 'contains';
        let comparators = field.getComparators();

        switch (field.type) {
            case 'date':
            case 'time':
            case 'number':
            case 'enumeration':
                ourValue = 'equals';
                break;
            default:
                break;
        }

        if (value) {
            ourValue = value;
        }

        let comparatorSelector = new SelectMenu({
            options: comparators,
            placeholder: TextFactory.get('comparator-comparator'),
            value: ourValue,
            name: `comparator-${filterid}`,
            minimal: true,
            mute: this.mute,
            classes: ['comparator'],
            onchange: (self) => {
                let li = self.container.parentElement;
                this.checkValidity(li);
            }
        });
        comparatorSelector.container.setAttribute('data-field', field.name);

        return comparatorSelector;
    }

    /**
     * Make a variable value selector
     * @param filterid the filter id
     * @param field field the field definition we're making one for
     * @param value  (optional) the value to prefill with
     * @return {URLInput|TextInput}
     */
    makeValueSelector(filterid, field, value) {
        let config = {
            value: value,
            name: `valuefield-${filterid}`,
            minimal: true,
            mute: this.mute,
            classes: ['valueinput'],
            onchange: (self) => {
                let li = self.container.parentElement;
                this.checkValidity(li);
            }
        };

        let valueSelector = field.getElement(value, config);

        valueSelector.container.setAttribute('data-field', field.name);
        return valueSelector;

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get actions() { return this._actions; }
    set actions(actions) { this._actions = actions; }

    get applyfiltersbutton() { return this._applyfiltersbutton; }
    set applyfiltersbutton(applyfiltersbutton) { this._applyfiltersbutton = applyfiltersbutton; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get elements() { return this._elements; }
    set elements(elements) { this._elements = elements; }

    get fields() { return this.config.fields; }
    set fields(fields) { this.config.fields = fields; }

    get filters() { return this.config.filters; }
    set filters(filters) { this.config.filters = filters; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get workingfilters() { return this._workingfilters; }
    set workingfilters(workingfilters) { this._workingfilters = workingfilters; }
}
window.FilterConfigurator = FilterConfigurator;
class GridField {

    static get DEFAULT_CONFIG() {
        return {
            name: null,        // The variable name for this field (computer readable)
            label: null,       // The human-readable name for the column
            readonly: false,   // if true, this value cannot be changed. Useful for identifiers.
            hidden: false,     // Is the column hidden or not.
            identifier: false, // If true, marks the field as the unique identifier for a data set.
                               // An identifier is required in a grid if you want to update entries.
            type: 'string',    // The datatype of the column
                               //   - string
                               //   - url
                               //   - imageurl
                               //   - email
                               //   - boolean
                               //   - number
                               //   - date
                               //   - time
                               //   - stringarray
                               //   - paragraph
                               //   - enumeration
            values: null,      // An array of option values for an enumeration data type. Ignored if not
                               // an enumeration
                               // [
                               //   { label: "Label to show", value: "v", default: false }
                               //  ]
            separator: ', ',   // Used when rendering array values
            placeholder: null, // The placeholder to use in the field
            preamble: null,
            lightbox: true,    // For image types, if true, open the image in a lightbox
            minnumber: null,   // The minnumber to use in the field
            maxnumber: null,   // The maxnumber to use in the field
            nodupe: false,     // If true, this column is ignored when deemphasizing duplicate rows.
            resize: false,     // Whether or not to allow resizing of the column (default: false)
            mute: false,       // If true, apply to elements.
            required: false,   // If true, elements drawn from this will be required.

            description: null, // A string that describes the data in the column
            classes: [],       // Additional classes to apply to cells of this field
            filterable: false, // Is the field filterable?
            renderer: null     // A function that can be used to format the in the field. Overrides native
                               // renderer.  Takes "data" as an argument.
        };
    }

    /**
     * Supported comparators
     * @return a comparator dictionary.
     * @constructor
     */
    static get COMPARATORS() {
        return {
            'startswith' : TextFactory.get('comparator-startswith'),
            'endswith' : TextFactory.get('comparator-endswith'),
            'contains' : TextFactory.get('comparator-contains'),
            'notcontains' : TextFactory.get('comparator-notcontains'),
            'equals' : TextFactory.get('comparator-equals'),
            'doesnotequal' : TextFactory.get('comparator-doesnotequal'),
            'isbefore' : TextFactory.get('comparator-isbefore'),
            'isafter' : TextFactory.get('comparator-isafter'),
            'isgreaterthan' : TextFactory.get('comparator-greaterthan'),
            'islessthan' : TextFactory.get('comparator-lessthan')
        }
    }

    /**
     * Get a comparator label
     * @param comparator the comparator
     * @return A string, or null
     */
    static getComparatorLabel(comparator) {
        return GridField.COMPARATORS[comparator];
    }

    /**
     * Define the gridfield
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, GridField.DEFAULT_CONFIG, config);
        this.setRenderer();
    }

    /**
     * Set the renderer for the field, if one isn't provided.
     */
    setRenderer() {
        switch (this.type) {
            case 'number':
                if (!this.renderer) {
                    this.renderer = (d) => { return document.createTextNode(d); }
                }
                break;
            case 'date':
            case 'time':
                if (!this.renderer) {
                    this.renderer = (d) => {
                        return document.createTextNode(d.toString());
                    }
                }
                break;
            case 'boolean':
                if (!this.renderer) {
                    this.renderer = (d) => {
                        if (typeof d === 'number') {
                            if (d > 0) { return document.createTextNode('True'); }
                            return document.createTextNode('False');
                        }
                        return d;
                    }
                }
                break;
            case 'url':
                if (!this.renderer) {
                    this.renderer = (d) => {
                        let a = document.createElement('a');
                        a.setAttribute('href', d);
                        a.innerHTML = d;
                        return a;
                    }
                }
                break;
            case 'imageurl':
                if (!this.renderer) {
                    if (this.lightbox) {
                        this.renderer = (d) => {
                            let img = document.createElement('img');
                            img.setAttribute('src', d);
                            let anchor = document.createElement('a');
                            anchor.appendChild(img);
                            anchor.addEventListener('click', () => {
                                let i = document.createElement('img');
                                i.setAttribute('src', d);
                                new DialogWindow({
                                    lightbox: true,
                                    title: this.label,
                                    content: i
                                }).open();
                            });
                            return anchor;
                        }
                    } else {
                        this.renderer = (d) => {
                            let img = document.createElement('img');
                            img.setAttribute('src', d);
                            let a = document.createElement('a');
                            a.setAttribute('href', d);
                            a.appendChild(img);
                            return a;
                        }
                    }
                }
                break;
            case 'email':
                if (!this.renderer) {
                    this.renderer = (d) => {
                        let a = document.createElement('a');
                        a.setAttribute('href', `mailto:${d}`);
                        a.innerHTML = d;
                        return a;
                    }
                }
                break;
            case 'enumeration':
                if (!this.renderer) {
                    this.renderer = (d) => {
                        return document.createTextNode(this.getValue(d));
                    }
                }
                break;
            case 'paragraph':
                if (!this.renderer) {
                    this.renderer = (d) => {
                        if (!d) { d = ""; }
                        return document.createTextNode(d);
                    }
                }
                break;
            case 'stringarray':
                if (!this.renderer) {
                    this.renderer = (d) => {
                        if (Array.isArray(d)) {
                            return document.createTextNode(d.join(this.separator));
                        }
                        return d;
                    }
                }
                break;
            case 'string':
            default:
                if (!this.renderer) {
                    this.renderer = (d) => { return document.createTextNode(d); }
                }
                break;
        }

    }

    /**
     * Get the value of a key in an enumeration options.
     * @param key
     * @return {*}
     */
    getValue(key) {
        let value;
        if ((this.values) && (this.values.length > 0)) {
            for (let def of this.values) {
                if (def['key'] === key) {
                    value = def['value'];
                    break;
                }
            }
        }
        return value;
    }

    /**
     * Get a form element for this data field.
     * @param value (optional) The value of the input field
     * @param config (optional) the config to use
     * @return {HiddenField|NumberInput|DateInput|BooleanToggle|EmailInput}
     */
    getElement(value, config) {
        let e;
        if (!config) {
            config = {
                name: this.name,
                label: this.label,
                disabled: this.readonly,
                help: this.description,
                placeholder: this.placeholder,
                mute: this.mute,
                required: this.required,
                preamble: this.preamble,
                maxnumber: this.maxnumber,
                minnumber: this.minnumber,
                classes: this.classes,
                value: value,
                renderer: this.renderer
            };
        }
        if (this.hidden) {
            return new HiddenField(config);
        }

        switch (this.type) {
            case 'number':
                e = new NumberInput(config);
                break;
            case 'date':
            case 'time':
                e = new DateInput(config);
                break;
            case 'enumeration':
                config.options = [];
                for (let o of this.values) {
                    config.options.push({ label: o.label, value: o.value, checked: o.default });
                }
                e = new SelectMenu(config);
                break;
            case 'boolean':
                delete config.value;
                config.checked = value;
                e = new BooleanToggle(config);
                break;
            case 'timezone':
                e = new TimezoneMenu(config);
                break;
            case 'url':
                e = new URIInput(config);
                break;
            case 'imageurl':
                e = new URIInput(config);
                break;
            case 'email':
                e = new EmailInput(config);
                break;
            case 'paragraph':
                e = new TextArea(config);
                break;
            case 'stringarray':
                e = new TextInput(config);
                break;
            case 'string':
            default:
                e = new TextInput(config);
                break;
        }
        return e;
    }

    /**
     * Get the valid comparators for this datatypes
     * @return an array of comparator definitions.
     */
    getComparators() {

        let comparators;

        switch (this.type) {
            case 'number':
                comparators = [
                    { value: 'equals', checked: true, label: GridField.getComparatorLabel('equals') },
                    { value: 'doesnotequal', label: GridField.getComparatorLabel('doesnotequal') },
                    { value: 'isgreaterthan', label: GridField.getComparatorLabel('isgreaterthan') },
                    { value: 'islessthan', label: GridField.getComparatorLabel('islessthan') }
                ];
                break;
            case 'date':
            case 'time':
                comparators = [
                    { value: 'equals', checked: true, label: GridField.getComparatorLabel('equals') },
                    { value: 'doesnotequal', label: GridField.getComparatorLabel('doesnotequal') },
                    { value: 'isbefore', label: GridField.getComparatorLabel('isbefore') },
                    { value: 'isafter', label: GridField.getComparatorLabel('isafter') }
                ];
                break;
            case 'boolean':
            case 'enumeration':
                comparators = [
                    { value: 'equals', checked: true, label: GridField.getComparatorLabel('equals') },
                    { value: 'doesnotequal', label: GridField.getComparatorLabel('doesnotequal') }
                ];
                break;
            case 'url':
            case 'imageurl':
            case 'email':
            case 'paragraph':
            case 'stringarray':
            case 'string':
            default:
                comparators = [ // Default for strings.
                    {value: 'contains', label: GridField.getComparatorLabel('contains')},
                    {value: 'notcontains', label: GridField.getComparatorLabel('notcontains')},
                    {value: 'equals', label: GridField.getComparatorLabel('equals')},
                    {value: 'doesnotequal', label: GridField.getComparatorLabel('doesnotequal')},
                    {value: 'startswith', label: GridField.getComparatorLabel('startswith')},
                    {value: 'endswith', label: GridField.getComparatorLabel('endswith')}
                ];
                break;
        }

        return comparators;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes ; }
    set classes(classes) { this.config.classes = classes; }

    get description() { return this.config.description ; }
    set description(description) { this.config.description = description; }

    get filterable() { return this.config.filterable ; }
    set filterable(filterable) { this.config.filterable = filterable; }

    get hidden() { return this.config.hidden ; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get identifier() { return this.config.identifier ; }
    set identifier(identifier) { this.config.identifier = identifier; }

    get label() { return this.config.label ; }
    set label(label) { this.config.label = label; }

    get lightbox() { return this.config.lightbox ; }
    set lightbox(lightbox) { this.config.lightbox = lightbox; }

    get maxnumber() { return this.config.maxnumber ; }
    set maxnumber(maxnumber) { this.config.maxnumber = maxnumber; }

    get minnumber() { return this.config.minnumber ; }
    set minnumber(minnumber) { this.config.minnumber = minnumber; }

    get mute() { return this.config.mute ; }
    set mute(mute) { this.config.mute = mute; }

    get name() { return this.config.name ; }
    set name(name) { this.config.name = name; }

    get nodupe() { return this.config.nodupe ; }
    set nodupe(nodupe) { this.config.nodupe = nodupe; }

    get placeholder() { return this.config.placeholder ; }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

    get preamble() { return this.config.preamble; }
    set preamble(preamble) { this.config.preamble = preamble; }

    get readonly() { return this.config.readonly ; }
    set readonly(readonly) { this.config.readonly = readonly; }

    get renderer() { return this.config.renderer; }
    set renderer(renderer) {
        if (typeof renderer !== 'function') {
            console.error("Value provided to renderer is not a function!");
        }
        this.config.renderer = renderer;
    }

    get required() { return this.config.required ; }
    set required(required) { this.config.required = required; }

    get resize() { return this.config.resize ; }
    set resize(resize) { this.config.resize = resize; }

    get separator() { return this.config.separator ; }
    set separator(separator) { this.config.separator = separator; }

    get type() { return this.config.type ; }
    set type(type) { this.config.type = type; }

    get values() { return this.config.values ; }
    set values(values) { this.config.values = values; }

}
window.GridField = GridField;

class DatePicker {

    static get DEFAULT_CONFIG() {
        return {
            startdate: null,
            value: null,
            timezone: 'GMT',
            basetime: '12:00:00', // Time to set dates on
            locale: 'en-US',
            weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            onselect: null,
            classes: []
        };
    }

    static get DOCUMETATION() {
        return {
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            startdate: { type: 'option', datatype: 'date', description: "The date to start the calendar on. Can also be a readable string." },
            value: { type: 'option', datatype: 'date', description: "The date to preselect. Can also be a readable string." },
            onselect: { type: 'option', datatype: 'function', description: "A function to be called on selection. Passed the date selected, as a string." }
        }
    }

    /**
     * Define a DataGrid
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, DatePicker.DEFAULT_CONFIG, config);
    }

    /**
     * Get the month name.
     * @param m month id
     * @return {*} string
     */
    getMonthName(m) {
        return this.months[m];
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('datepicker');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        this.monthbox = document.createElement('div');
        this.monthbox.classList.add('monthbox');

        this.renderMonth(this.startdate); // initial

        this.container.appendChild(this.monthbox);
    }

    /**
     * Render a month
     * @param startDate the date to center the month around. If null, uses today.
     */
    renderMonth(startDate) {


        // XXX there has to be a better way to do this.

        let now = new Date();
        let today = new Date(`${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()} ${this.basetime}`);

        if (!startDate) {
            startDate = today;
        } else if (typeof startDate === 'string') {
            startDate = new Date(`${startDate} ${this.basetime}`);
            this.value = startDate;
            this.startdate = startDate;
        }

        let startDay = new Date(startDate.getFullYear(), startDate.getMonth()).getDay();

        // Many additional dates or things
        let daysInMonth = (32 - new Date(startDate.getFullYear(), startDate.getMonth(), 32).getDate()),
            previousMonth = new Date(startDate.getFullYear(), (startDate.getMonth() - 1)),
            daysInPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 0).getDate(),
            nextMonth = new Date(startDate.getFullYear(), (startDate.getMonth() + 1));

        let month = document.createElement('div');
        month.classList.add('month');

        let header = document.createElement('div');
        header.classList.add('datepicker-header');

        let pMonthButton = new SimpleButton({
            shape: 'square',
            mute: true,
            size: 'small',
            icon: 'triangle-left',
            action: (e) => {
                e.preventDefault();
                this.renderMonth(previousMonth);
            }
        });

        let nMonthButton = new SimpleButton({
            shape: 'square',
            mute: true,
            size: 'small',
            icon: 'triangle-right',
            action: (e) => {
                e.preventDefault();
                this.renderMonth(nextMonth);
            }
        });

        let mname = document.createElement('div');
        mname.classList.add('name');
        mname.innerHTML = `${this.getMonthName(startDate.getMonth())}, ${startDate.getFullYear()}`;

        header.appendChild(mname);
        header.appendChild(pMonthButton.button);
        header.appendChild(nMonthButton.button);

        month.appendChild(header);

        let calendar = document.createElement('table');
        calendar.classList.add('month');

        let thead = document.createElement('thead');
        let hr = document.createElement('tr');
        for (let weekday of this.weekdays) {
            let th = document.createElement('th');
            th.innerHTML = weekday.charAt(0);
            let celltip = new ToolTip({
                tipicon: '',
                classes: ['unfixed'],
                text: weekday
            });
            celltip.attach(th);
            hr.appendChild(th);
        }
        thead.appendChild(hr);
        calendar.appendChild(thead);

        let tbody = document.createElement('tbody');

        let dayOfMonth = 1,
            dayOfNextMonth = 1,
            dayOfPreviousMonth = daysInPreviousMonth - startDay;

        let cellCount = 0;
        for (let rc = 0; rc <= 5; rc++) {
            let tr = document.createElement('tr');
            for (let d = 0; d <= 6; d++) {

                let td = document.createElement('td'),
                    link = document.createElement('a'),
                    thisDay;

                link.setAttribute('data-cellno', cellCount);

                if ((cellCount >= startDay) && (dayOfMonth <= daysInMonth)) {
                    // startDay or into the future until the end of the month
                    link.innerHTML = dayOfMonth;
                    link.classList.add('cmonth');
                    link.setAttribute('data-day', `${startDate.getFullYear()}-${(startDate.getMonth() + 1)}-${dayOfMonth}`);
                    thisDay = new Date(`${startDate.getFullYear()}-${(startDate.getMonth() +1)}-${dayOfMonth} ${this.basetime}`);
                    dayOfMonth++;
                } else if ((cellCount < startDay)) {
                    // before the startDay, so last month
                    link.innerHTML = dayOfPreviousMonth;
                    thisDay = new Date(`${previousMonth.getFullYear()}-${(previousMonth.getMonth()+ 1)}-${dayOfPreviousMonth} ${this.basetime}`);
                    link.setAttribute('data-day', `${previousMonth.getFullYear()}-${(previousMonth.getMonth()+ 1)}-${dayOfPreviousMonth}`);
                    dayOfPreviousMonth++;
                } else {
                    // after this month, so next month
                    thisDay = new Date(`${nextMonth.getFullYear()}-${(nextMonth.getMonth() +2)}-${dayOfNextMonth} ${this.basetime}`);
                    link.innerHTML = dayOfNextMonth;
                    link.setAttribute('data-day', `${nextMonth.getFullYear()}-${(nextMonth.getMonth() +2)}-${dayOfNextMonth}`);
                    dayOfNextMonth++;
                }

                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.select(link);
                });
                link.addEventListener('keydown', (e) => {

                    let pcell = parseInt(link.getAttribute('data-cellno')) - 1;
                    let ncell = parseInt(link.getAttribute('data-cellno')) + 1;

                    switch (e.key) {
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            let p = tbody.querySelector(`[data-cellno='${pcell}'`);
                            if (p) {
                                p.focus();
                            }
                            e.stopPropagation();
                            break;
                        case 'ArrowRight':
                        case 'ArrowDown':
                            let n = tbody.querySelector(`[data-cellno='${ncell}'`);
                            if (n) {
                                n.focus();
                            }
                            e.stopPropagation();
                            break;
                        case 'Enter':
                        case ' ':
                            this.select(link);
                            e.stopPropagation();
                            break;
                        default:
                            break;
                    }
                    return false;
                });

                link.setAttribute('aria-label', link.getAttribute('data-day'));
                link.setAttribute('tabindex', 0);

                if (thisDay.getTime() === today.getTime()) {
                    link.classList.add('today');
                } else if (thisDay.getTime() < today.getTime()) {
                    link.classList.add('past');
                } else if (thisDay.getTime() > today.getTime()) {
                    link.classList.add('future');
                }

                if ((this.value) && (
                    (this.startdate.getFullYear() === thisDay.getFullYear()) &&
                    (this.startdate.getMonth() === thisDay.getMonth()) &&
                    (this.startdate.getDate() === thisDay.getDate())
                )) {
                    link.setAttribute('aria-selected', true);
                }

                td.appendChild(link);

                tr.appendChild(td);
                cellCount++;
            }
            tbody.appendChild(tr);
        }
        calendar.appendChild(tbody);

        month.appendChild(calendar);

        this.monthbox.innerHTML = "";
        this.monthbox.appendChild(month);
    }

    /**
     * Select a date.
     * @param link the date with the link
     */
    select(link) {
        this.startdate = new Date(link.getAttribute('data-day'));
        if ((this.onselect) && (typeof this.onselect === 'function')) {
            this.onselect(link.getAttribute('data-day'));
        }
    }


    /* ACCESSOR METHODS_________________________________________________________________ */

    get basetime() { return this.config.basetime; }
    set basetime(basetime) { this.config.basetime = basetime; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get locale() { return this.config.locale; }
    set locale(locale) { this.config.locale = locale; }

    get monthbox() { return this._monthbox; }
    set monthbox(monthbox) { this._monthbox = monthbox; }

    get months() { return this.config.months; }
    set months(months) { this.config.months = months; }

    get onselect() { return this.config.onselect; }
    set onselect(onselect) { this.config.onselect = onselect; }

    get startdate() { return this.config.startdate; }
    set startdate(startdate) { this.config.startdate = startdate; }

    get timezone() { return this.config.timezone; }
    set timezone(timezone) { this.config.timezone = timezone; }

    get weekdays() { return this.config.weekdays; }
    set weekdays(weekdays) { this.config.weekdays = weekdays; }

    get value() { return this.config.value; }
    set value(value) { this.config.value = value; }


}
window.DatePicker = DatePicker;
class DialogWindow {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            form: null,  // takes a SimpleForm.  If present, displays and renders that. If not, uses content.
            actions: null, // An array of actions. Can be buttons or keyword strings.Only used if form is null.
            // Possible keywords:  closebutton, cancelbutton
            content: null,
            onclose: null,
            classes: [],             // apply these classes to the dialog, if any.
            header: null, // DOM object, will be used if passed before title.
            lightbox: false,    // For image types, if true, open the image in a lightbox
            title: null,  // Adds a title to the dialog if present. header must be null.
            trailer: null, // Adds a trailing chunk of DOM.  Can be provided a full dom object
                           // or a string.  If it's a string, it creates a div at the bottom
                           // with the value of the text.
            clickoutsidetoclose: true, // Allow the window to be closed by clicking outside.
            escapecloses: true, // Allow the window to be closed by the escape key
            nofocus: false, // If true, do not auto focus anything.
            canceltext: TextFactory.get('cancel'),
            closetext: TextFactory.get('close'), // Text for the closebutton, if any
            showclose: true  // Show or hide the X button in the corner (requires title != null)
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The dialog object will have this as it's id." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            form: { type: 'option', datatype: 'simpleform', description: "If present, displays and renders the form as its content. If not, uses the value of <code>content</code>."},
            actions: { type: 'option', datatype: 'array', description: "An array of actions. Can be SimpleButtons or keyword strings. Only used if form is null (actions exist on SimpleForm objects as well).  Possible keywords:  closebutton, cancelbutton" },
            content: { type: 'option', datatype: 'domobject', description: "This is the content of the dialog.  Ignored if provided a <code>form</code>."},
            header: { type: 'option', datatype: 'domobject', description: "DOM object, will be used if passed before title."},
            title: { type: 'option', datatype: 'string', description: "Adds a title to the dialog if present. header must be null." },
            trailer: { type: 'option', datatype: 'domobject', description: "Adds a trailing chunk of DOM.  Can be provided a full dom object or a string.  If it's a string, it creates a div at the bottom with the value of the text." },
            canceltext: { type: 'option', datatype: 'string', description: "Text used for cancel buttons provided as keywords." },
            closetext: { type: 'option', datatype: 'string', description: "Text used for close buttons provided as keywords." },
            onclose: { type: 'option', datatype: 'function', description: "What to do when closing. Passed (self) as an argument." },

            lightbox: { type: 'option', datatype: 'boolean', description: "For image types, if true, open the image in a lightbox." },
            clickoutsidetoclose: { type: 'option', datatype: 'boolean', description: "Allow the window to be closed by clicking outside." },
            escapecloses: { type: 'option', datatype: 'boolean', description: "Allow the window to be closed by the escape key." },
            nofocus: { type: 'option', datatype: 'boolean', description: "If true, do not auto focus anything." },
            showclose: { type: 'option', datatype: 'boolean', description: "Show or hide the CloseButton in the corner." }
        };
    }

    /**
     * Define a DialogWindow
     * @param config a dictionary object
     * @return DialogWindow
     */
    constructor(config) {
        this.config = Object.assign({}, DialogWindow.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `dialog-${CFBUtils.getUniqueKey(5)}`; }

        this.build();
    }

    /**
     * Opens the dialog window
     */
    open() {
        CFBUtils.closeOpen();

        this.prevfocus = document.querySelector(':focus');

        this.mask = document.createElement('div');
        this.mask.classList.add('window-mask');
        for (let c of this.classes) {
            this.mask.classList.add(c);
        }
        this.mask.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.clickoutsidetoclose) {
                this.close();
            }
        });
        this.container.appendChild(this.window);

        if ((this.trailer) && (typeof this.trailer === 'string')) {
            let trail = document.createElement('div');
            trail.classList.add('trailer');
            trail.innerHTML = this.trailer;
            this.container.appendChild(trail);
        } else if (this.trailer) { // it's an html object
            this.container.appendChild(this.trailer);
        }

        document.body.appendChild(this.mask);
        document.body.appendChild(this.container);
        document.body.classList.add('modalopen');

        this.escapelistener = (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };

        setTimeout(() => {
            if (!this.nofocus) {
                let focusable = this.contentbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusable[0]) {
                    focusable[0].focus();
                }
            }
            if (this.escapecloses) {
                document.addEventListener('keyup', this.escapelistener);
            }
        }, 100);
    }

    /**
     * Closes the dialog window
     */
    close() {
        this.container.parentNode.removeChild(this.container);
        this.mask.parentNode.removeChild(this.mask);
        if (this.prevfocus) {
            this.prevfocus.focus();
        }
        document.body.classList.remove('modalopen');
        document.removeEventListener('keyup', this.escapelistener);
        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }
    }

    /**
     * Check to see if escape should close the thing
     * @param e the event.
     */
    escape(e, self) {
        if (e.key === 'Escape') {
            self.close();
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Constructs the DialogWindow's DOM elements
     */
    build() {


        this.container = document.createElement('div');
        this.container.classList.add('window-container');

        this.window = document.createElement('div');
        this.window.classList.add('dialog');
        this.window.setAttribute('id', this.id);

        for (let c of this.classes) {
            this.container.classList.add(c);
            this.window.classList.add(c);
        }
        if (this.lightbox) {
            this.container.classList.add('lightbox');
            this.window.classList.add('lightbox');
        }

        if ((this.title) || (this.header)) {
            if (!this.header) {
                this.header = document.createElement('h2');
                let span = document.createElement('span');
                span.classList.add('t');
                span.innerHTML = this.title;
                this.header.appendChild(span);
            }
            this.window.appendChild(this.header);
        }
        if (this.showclose) {
            this.closebutton = new CloseButton({
                action: (e) => {
                    e.preventDefault();
                    this.close();
                }
            });
            if ((this.title) || (this.header)) {
                this.header.appendChild(this.closebutton.button);
            } else {
                this.window.classList.add('noheader');
                this.window.appendChild(this.closebutton.button);
            }
        }

        if (this.form) { // it's a SimpleForm

            this.form.dialog = this;

            if ((this.actions) && (this.actions.length > 0)) {
                for (let a of this.actions) {
                    if (typeof a === 'string') { // it's a keyword
                        switch(a) {
                            case 'closebutton':
                                this.form.actions.push(new SimpleButton({
                                    text: this.closetext,
                                    ghost: true,
                                    action: () => {
                                        this.close();
                                    }
                                }));
                                break;
                            case 'cancelbutton':
                                this.form.actions.push(new DestructiveButton({
                                    text: this.canceltext,
                                    mute: true,
                                    action: () => {
                                        this.close();
                                    }
                                }));
                                break;
                            default:
                                break;
                        }
                    } else {
                        this.form.actions.push(a);
                    }
                }
            }

            this.contentbox = document.createElement('div');
            this.contentbox.classList.add('content');
            this.contentbox.appendChild(this.form.form);

            this.window.classList.add('isform');
            this.window.appendChild(this.contentbox);

        } else if (this.content) { // It's a DOM object
            this.contentbox = document.createElement('div');
            this.contentbox.classList.add('content');
            this.contentbox.appendChild(this.content);

            this.window.appendChild(this.contentbox);

            if ((this.actions) && (this.actions.length > 0)) {
                this.actionbox = document.createElement('div');
                this.actionbox.classList.add('actions');
                for (let a of this.actions) {
                    if (typeof a === 'string') { // it's a keyword
                        switch(a) {
                            case 'closebutton':
                                this.actionbox.appendChild(new SimpleButton({
                                    text: this.closetext,
                                    ghost: true,
                                    action: () => {
                                        this.close();
                                    }
                                }).container);
                                break;
                            case 'cancelbutton':
                                this.actionbox.appendChild(new DestructiveButton({
                                    text: this.canceltext,
                                    mute: true,
                                    action: () => {
                                        this.close();
                                    }
                                }).container);
                                break;
                            default:
                                break;
                        }
                    } else {
                        this.actionbox.appendChild(a.container);
                    }
                }
                this.window.appendChild(this.actionbox);
            }
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get actionbox() { return this._actionbox; }
    set actionbox(actionbox) { this._actionbox = actionbox; }

    get actions() { return this.config.actions; }
    set actions(actions) { this.config.actions = actions; }

    get canceltext() { return this.config.canceltext; }
    set canceltext(canceltext) { this.config.canceltext = canceltext; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get clickoutsidetoclose() { return this.config.clickoutsidetoclose; }
    set clickoutsidetoclose(clickoutsidetoclose) { this.config.clickoutsidetoclose = clickoutsidetoclose; }

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get closetext() { return this.config.closetext; }
    set closetext(closetext) { this.config.closetext = closetext; }

    get container() { return this._container; }
    set container(container) { this._container = container; }

    get content() { return this.config.content; }
    set content(content) { this.config.content = content; }

    get contentbox() { return this._contentbox; }
    set contentbox(contentbox) { this._contentbox = contentbox; }

    get escapecloses() { return this.config.escapecloses; }
    set escapecloses(escapecloses) { this.config.escapecloses = escapecloses; }

    get escapelistener() { return this._escapelistener; }
    set escapelistener(escapelistener) { this._escapelistener = escapelistener; }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get header() { return this.config.header; }
    set header(header) { this.config.header = header; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get lightbox() { return this.config.lightbox ; }
    set lightbox(lightbox) { this.config.lightbox = lightbox; }

    get mask() { return this._mask; }
    set mask(mask) { this._mask = mask; }

    get nofocus() { return this.config.nofocus; }
    set nofocus(nofocus) { this.config.nofocus = nofocus; }

    get onclose() { return this.config.onclose; }
    set onclose(onclose) { this.config.onclose = onclose; }

    get prevfocus() { return this._prevfocus; }
    set prevfocus(prevfocus) { this._prevfocus = prevfocus; }

    get showclose() { return this.config.showclose; }
    set showclose(showclose) { this.config.showclose = showclose; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get trailer() { return this.config.trailer; }
    set trailer(trailer) { this.config.trailer = trailer; }

    get window() { return this._window; }
    set window(window) { this._window = window; }

}
window.DialogWindow = DialogWindow;
class FloatingPanel extends Panel {

    static get DEFAULT_CONFIG() {
        return {
            style: 'plain',
            position: 'top-left'
        };
    }

    static get DOCUMENTATION() {
        return {
            position: { type: 'option', datatype: 'enumeration', description: "Position for the panel. Valid values: (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)" }
        };
    }

    constructor(config) {
        config = Object.assign({}, FloatingPanel.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('floating');
        } else {
            config.classes = ['floating'];
        }
        config.classes.push(config.position);
        config.classes.push(config.style);
        super(config);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get position() { return this.config.position; }
    set position(position) { this.config.position = position; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

}
window.FloatingPanel = FloatingPanel;
class Growler extends FloatingPanel {

    static get DEFAULT_CONFIG() {
        return {
            text : null,
            closeicon: 'echx',
            duration: 4000,
            icon: null,
            position: 'bottom-right'
        };
    }

    static get DOCUMENTATION() {
        return {
            icon: { type: 'option', datatype: 'string', description: "The icon to use in the growler." },
            closeicon: { type: 'option', datatype: 'string', description: "The icon to use in the growler's CloseButton." },
            iconclasses: { type: 'option', datatype: 'stringarray', description: "An array of css classes to apply to the icon." },
            text: { type: 'option', datatype: 'string', description: "The growler payload" },
            duration: { type: 'option', datatype: 'number', description: "Length of time in milliseconds to display. If 0 or negative, stays open." }
        };
    }

    static get GROWLBOX_ID() { return 'gbox-'; }

    /**
     * Quick access to a generic growler, with an optional title.
     * @param text the text to display
     * @param title (optional) a title
     * @return {Growler}
     */
    static growl(text, title) {
        return new Growler({
            text: text,
            title: title
        });
    }

    /**
     * Quick access to a error growler
     * @param text the text to display
     * @return {Growler}
     */
    static error(text) {
        return new Growler({
            text: text,
            title: TextFactory.get('error'),
            icon: 'warn-hex',
            classes: ['error']
        });
    }

    /**
     * Quick access to a warn growler
     * @param text the text to display
     * @return {Growler}
     */
    static warn(text) {
        return new Growler({
            text: text,
            title: TextFactory.get('warning'),
            icon: 'warn-triangle',
            classes: ['warn']
        });
    }

    /**
     * Quick access to a caution growler
     * @param text the text to display
     * @return {Growler}
     */
    static caution(text) {
        return new Growler({
            text: text,
            title: TextFactory.get('caution'),
            icon: 'warn-circle',
            classes: ['caution']
        });
    }

    /**
     * Quick access to a success growler
     * @param text the text to display
     * @return {Growler}
     */
    static success(text) {
        return new Growler({
            text: text,
            title: TextFactory.get('success'),
            icon: 'check-circle',
            classes: ['success']
        });
    }

    /**
     * Builds a growlbox and inserts it into the dom.
     * @param position the position to create it at.
     * @return HTMLDivElement growlbox object
     */
    static buildGrowlbox(position) {
        let gb = document.createElement('div');
        gb.classList.add('growlbox');
        gb.setAttribute('id', `${Growler.GROWLBOX_ID}${position}`);
        gb.classList.add(position);
        document.querySelector('body').appendChild(gb);
        return gb;
    }

    /**
     * Define a growler
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, Growler.DEFAULT_CONFIG, config);
        super(config);

        this.growlbox = document.getElementById(`${Growler.GROWLBOX_ID}${this.position}`);
        if (!this.growlbox) {
            this.growlbox = Growler.buildGrowlbox(this.position);
        }
        this.show();
    }

    /**
     * Close the growler
     */
    close() {

        if (this.timer) { clearTimeout(this.timer); }
        this.container.setAttribute('aria-hidden', 'true');

        setTimeout(()  => {
            if ((this.onclose) && (typeof this.onclose === 'function')) {
                this.onclose(me);
            }
            this.container.parentNode.removeChild(this.container);
        }, 100);

    }

    /**
     * Quickly close the growler, no animations.
     */
    quickClose() {
        if (this.timer) { clearTimeout(this.timer); }
        this.container.parentNode.removeChild(this.container);
        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }
    }

    /**
     * Show the growler
     */
    show() {

        this.container.removeAttribute('aria-hidden');

        if (this.duration > 0) {
            this.timer = setTimeout(()  => {
                this.close();
            }, this.duration);
        }
        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }
    }

    buildContainer() {


        this.container = document.createElement('div');
        this.container.setAttribute('aria-hidden', 'true');
        this.container.classList.add('growler');

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        this.closebutton = new CloseButton({
            action: (e) => {
                e.preventDefault();
                this.quickClose();
            }
        });

        if (this.title) {
            let h3 = document.createElement('h3');
            let span = document.createElement('span');
            span.classList.add('text');
            span.innerHTML = this.title;
            h3.appendChild(span);
            h3.appendChild(this.closebutton.button);
            this.container.appendChild(h3);
        } else {
            this.container.appendChild(this.closebutton.button);
        }

        if (this.text) {
            let payload = document.createElement('div');
            payload.classList.add('payload');
            if (this.icon) {
                let i = IconFactory.icon(this.icon);
                i.classList.add('i');
                payload.appendChild(i);
            }

            let d = document.createElement('div');
            d.classList.add('text');
            d.innerHTML = this.text;
            payload.appendChild(d);

            this.container.appendChild(payload);
        }

        this.growlbox.appendChild(this.container);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get duration() { return this.config.duration; }
    set duration(duration) { this.config.duration = duration; }

    get growlbox() { return this._growlbox; }
    set growlbox(growlbox) { this._growlbox = growlbox; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

    get timer() { return this._timer; }
    set timer(timer) { this._timer = timer; }

}
window.Growler = Growler;
class RadialProgressMeter extends SimpleProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            numberposition: 'center',
            badge: null,
            stinger: null,
            size: 'medium',
            style: 'solid',
            segments: null,
            strokewidth: null
        };
    }

    static get DOCUMENTATION() {
        return {
            numberposition: { type: 'option', datatype: 'enumeration', description: "Where to display the badge and stinger. Values: center, bottomleft, bottomright, topleft, topright" },
            badge: { type: 'option', datatype: 'number', description: "The central number to show. If left empty, it will display the percentage." },
            stinger: { type: 'option', datatype: 'string', description: "Text to display below the main badge." },
            size: { type: 'option', datatype: 'enumeration', description: "Can be one of several values or metrics. Accepts: 'small', 'medium', 'large', 'huge' as strings; Numbers in pixels and ems, as strings ('300px' or '5em'). If given a number, assumes pixels" },
            style: { type: 'option', datatype: 'enumeration', description: "'solid' or 'ticks'. If set to 'ticks', disables any 'segments' value." },
            segments: { type: 'option', datatype: 'number', description: "Displays tick marks in the circle. Takes a number; this is the number of divisions. If you want segments of 10%, set it.to 10.  If you want segments of 25%, set it to 4." },
            strokewidth: { type: 'option', datatype: 'number', description: "If provided, the stroke will be this wide. If not provided, the width will be 5% of the circle's whole size" }
        };
    }

    /**
     * Define the RadialProgresMeter
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, RadialProgressMeter.DEFAULT_CONFIG, config);
        super(config);

        this.calculateSize();

        if (!this.strokewidth) {
            this.strokewidth = this.actualsize * 0.07;
        }
        if (this.style === 'ticks') {
            this.segments = null;
        }

        this.radius = (this.actualsize / 2) - (this.strokewidth * 2); // have to cut the stroke
        this.circumference = this.radius * 2 * Math.PI; // pie are round
    }

    /**
     * Calculates the size of the SVG to use.
     * - Parses the 'size' attribute into 'actualsize'
     * - Determines the 'sizeclass'
     */
    calculateSize() {
        if (typeof this.size === 'number') {
            this.actualsize = this.size;
        } else if (this.size.toLowerCase().endsWith('px')) {
            this.actualsize = parseInt(this.size);
            if (isNaN(this.actualsize)) {
                console.error(`RadialProgressMeter: provided invalid size: ${this.size}`);
                this.actualsize = 200;
            }
        } else if (this.size.toLowerCase().endsWith('em')) {
            this.actualsize = (CFBUtils.getSingleEmInPixels() * parseInt(this.size));
            if (isNaN(this.actualsize)) {
                console.error(`RadialProgressMeter: provided invalid size: ${this.size}`);
                this.actualsize = 200;
            }
        } else {
            switch(this.size) {
                case 'small':
                    this.actualsize = 100;
                    break;
                case 'large':
                    this.actualsize = 400;
                    break;
                case 'huge':
                    this.actualsize = 800;
                    break;
                case 'medium':
                default:
                    this.actualsize = 200;
                    break;
            }
        }

        // Now we parse a size class
        if (this.actualsize >= 800) {
            this.sizeclass = 'huge';
        } else if (this.actualsize >= 400) {
            this.sizeclass = 'large';
        } else if (this.actualsize >= 200) {
            this.sizeclass = 'medium';
        } else if (this.actualsize >= 100) {
            this.sizeclass = 'small';
        } else  {
            this.sizeclass = 'tiny';
        }
    }

    /**
     * Set the progress value of the meter
     * @param percent the percent to set it to.
     */
    setProgress(percent) {
        const offset = this.circumference - percent / 100 * this.circumference;

        let circle = this.container.querySelector('.radialcircle');
        circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        circle.style.strokeDashoffset = offset;

        if (this.segments) {

            let tickwidth = this.segments * 2;

            let seglength = (((this.radius * 2) * Math.PI) - tickwidth) / (this.segments);

            let tickmarks = this.container.querySelector('.tickmarks');
            tickmarks.style.strokeDasharray = `2px ${seglength}px`;
            tickmarks.style.strokeDashoffset = 0;

        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build a circle template
     * @param target the class to apply
     * @return {*|null|undefined}
     */
    circleTemplate(target) {
        let c = document.createElement('circle');
        c.classList.add(target);
        c.setAttribute('stroke-width', this.strokewidth);
        c.setAttribute('r', this.radius);
        c.setAttribute('cx', this.actualsize / 2);
        c.setAttribute('cy', this.actualsize / 2);

        return c;
    }

    buildContainer() {



        this.container = document.createElement('div');
        this.container.classList.add(this.sizeclass);
        this.container.classList.add('progressbar-container');
        if (this.label) { this.container.appendChild(this.labelobj); }

        let wrap = document.createElement('div');
        wrap.classList.add('circlewrap');
        wrap.style.width = `${this.actualsize}`;
        wrap.style.height = `${this.actualsize}`;

        let svg = document.createElement('svg'); // the background gutter circle
        svg.setAttribute('height', this.actualsize);
        svg.setAttribute('width', this.actualsize);
        svg.classList.add('progressgutter');
        svg.classList.add(this.style);
        svg.appendChild(this.circleTemplate('gutter'));
        svg.appendChild(this.circleTemplate('radialcircle'));

        if ((this.segments) || (this.style === 'ticks')) {
            svg.appendChild(this.circleTemplate('tickmarks'));
        }

        wrap.appendChild(svg);
        wrap.appendChild(this.decallayer);
        this.container.appendChild(wrap);

        this.container.innerHTML = this.container.innerHTML; // this is funky but necessary ¯\_(ツ)_/¯

        this.setProgress(0); // flatten

        // Don't allow the the width animation to fire until it's in the page
        let animtimer = window.setTimeout(()  => {
            this.setProgress(this.value);
        }, 500);
    }


    buildDecalLayer() {
        if (!this.badge) { this.badge = `${this.value}<sup>%</sup>`; }

        this.badgeobj = document.createElement('div');
        this.badgeobj.classList.add('badge');
        this.badgeobj.innerHTML = this.badge;

        if (this.stinger) {
            this.stingerobj = document.createElement('div');
            this.stingerobj.classList.add('stinger');
            this.stingerobj.innerHTML = this.stinger;
        }

        this.decallayer = document.createElement('div');
        this.decallayer.classList.add('decals');
        this.decallayer.classList.add(this.numberposition);
        this.decallayer.appendChild(this.badgeobj);
        if (this.stinger) { this.decallayer.appendChild(this.stingerobj); }

    }


    /* ACCESSOR METHODS_________________________________________________________________ */

    get actualsize() { return this._actualsize; }
    set actualsize(actualsize) { this._actualsize = actualsize; }

    get badge() { return this.config.badge; }
    set badge(badge) { this.config.badge = badge; }

    get badgeobj() { return this._badgeobj; }
    set badgeobj(badgeobj) { this._badgeobj = badgeobj; }

    get circumference() { return this._circumference; }
    set circumference(circumference) { this._circumference = circumference; }

    get numberposition() { return this.config.numberposition; }
    set numberposition(numberposition) { this.config.numberposition = numberposition; }

    get radius() { return this._radius; }
    set radius(radius) { this._radius = radius; }

    get size() { return this.config.size; }
    set size(size) { this.config.size = size; }

    get sizeclass() { return this._sizeclass; }
    set sizeclass(sizeclass) { this._sizeclass = sizeclass; }

    get stinger() { return this.config.stinger; }
    set stinger(stinger) { this.config.stinger = stinger; }

    get stingerobj() { return this._stingerobj; }
    set stingerobj(stingerobj) { this._stingerobj = stingerobj; }

    get strokewidth() { return this.config.strokewidth; }
    set strokewidth(strokewidth) { this.config.strokewidth = strokewidth; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

    get segments() { return this.config.segments; }
    set segments(segments) { this.config.segments = segments; }

    get wrap() { return this._wrap; }
    set wrap(wrap) { this._wrap = wrap; }


}
window.RadialProgressMeter = RadialProgressMeter;

class SearchControl {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            autoexecute: true, // Cause the search's action to execute automatically on focusout
                               // or when there number of seed characters is reached
            arialabel: TextFactory.get('searchcontrol-instructions'), // The aria-label value.
            stayopen: false,
            maxlength: null, // Value for maxlength.
            searchtext: TextFactory.get('search'),
            searchicon: 'magnify',
            mute: false, // if true, controls are mute
            focusin: null, // action to execute on focus in. Passed (event, self).
            focusout: null, // action to execute on focus out. Passed (event, self).
            action: (value, self) => { // The search action. Passed the value of the input and the self
                console.log(`Executing search action: ${value}`);
            },
            value: '', // Value to use (pre-population).  Used during construction and then discarded.
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SearchControl.DEFAULT_CONFIG, config);
        return this;
    }

    /* CORE METHODS_____________________________________________________________________ */

    /* PSEUDO GETTERS___________________________________________________________________ */

    get isopen() { return this.container.classList.contains('open'); }

    get value() { return this.searchinput.value; }
    set value(value) { this.searchinput.value = value; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full searchcontrol container
     */
    buildContainer() {

        this.container = document.createElement('div');
        this.container.classList.add('searchcontrol');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        this.buildSearchInput();
        this.container.appendChild(this.searchinput);

        this.searchbutton = new SimpleButton({
            text: this.searchtext,
            icon: this.searchicon,
            mute: true,
            focusin: this.focusin,
            focusout: this.focusout,
            action: (e) => {
                e.preventDefault();
                if (this.isopen) {
                    if ((this.action) && (typeof this.action === 'function')) {
                        this.action(this.value, me);
                    }
                }
            }
        });

        // Open the search input if the user clicks on the button when it's not open
        this.container.addEventListener('click', () => {
            if (!this.isopen) {
                this.searchinput.focus();
            }
        });

        if (this.stayopen) {
            this.container.classList.add('open');
        }

        this.container.appendChild(this.searchbutton.button);

    }

    /**
     * Build the search input
     */
    buildSearchInput() {

        this.searchinput = document.createElement('input');

        this.searchinput.setAttribute('type', 'text');
        this.searchinput.setAttribute('role', 'search');
        this.searchinput.setAttribute('tabindex', '0');

        if (this.mute) { this.searchinput.classList.add('mute'); }

        if (this.placeholder) { this.searchinput.setAttribute('placeholder', this.placeholder); }
        if (this.arialabel) { this.searchinput.setAttribute('aria-label', this.arialabel); }
        if (this.maxlength) { this.searchinput.setAttribute('maxlength', this.maxlength); }

        for (let c of this.classes) {
            this.searchinput.classList.add(c);
        }

        this.searchinput.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'Tab':
                    if (this.autoexecute) {
                        if ((this.action) && (typeof this.action === 'function')) {
                            this.action(this.value, me);
                        }
                    }
                    break;
                case 'Enter':
                    if ((this.action) && (typeof this.action === 'function')) {
                        this.action(this.value, me);
                    }
                    break;
                default:
                    if (this.autoexecute) {
                        if ((this.action) && (typeof this.action === 'function')) {
                            this.action(this.value, me);
                        }
                    }
                    break;

            }
        });

        this.searchinput.addEventListener('focusout', (e) => {
            if (((this.value) && (this.value.length > 0)) || (this.stayopen)) {
                this.container.classList.add('open');
                if (this.autoexecute) {
                    if ((this.action) && (typeof this.action === 'function')) {
                        this.action(this.value, me);
                    }
                }
            } else {
                this.container.classList.remove('open');
            }
            if ((this.focusout) && (typeof this.focusout === 'function')) {
                this.focusout(e, me);
            }
        });

        this.searchinput.addEventListener('focusin', (e) => {
            if ((this.focusin) && (typeof this.focusin === 'function')) {
                this.focusin(e, me);
            }
        });

        this.searchinput.value = this.config.value;

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get autoexecute() { return this.config.autoexecute; }
    set autoexecute(autoexecute) { this.config.autoexecute = autoexecute; }

    get action() { return this.config.action; }
    set action(action) { this.config.action = action; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get focusin() { return this.config.focusin; }
    set focusin(focusin) {
        if (typeof focusin !== 'function') {
            console.error("Action provided for focusin is not a function!");
        }
        this.config.focusin = focusin;
    }

    get focusout() { return this.config.focusout; }
    set focusout(focusout) {
        if (typeof focusout !== 'function') {
            console.error("Action provided for focusout is not a function!");
        }
        this.config.focusout = focusout;
    }

    get maxlength() { return this.config.maxlength; }
    set maxlength(maxlength) { this.config.maxlength = maxlength; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get placeholder() { return this.config.placeholder; }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

    get searchinput() { return this._searchinput; }
    set searchinput(searchinput) { this._searchinput = searchinput; }

    get searchbutton() { return this._searchbutton; }
    set searchbutton(searchbutton) { this._searchbutton = searchbutton; }

    get searchtext() { return this.config.searchtext; }
    set searchtext(searchtext) { this.config.searchtext = searchtext; }

    get searchicon() { return this.config.searchicon; }
    set searchicon(searchicon) { this.config.searchicon = searchicon; }

    get stayopen() { return this.config.stayopen; }
    set stayopen(stayopen) { this.config.stayopen = stayopen; }

}
window.SearchControl = SearchControl;

class SimpleForm {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // Component id
            name: null, // Name attribute

            /*
                Only one of 'handler' or 'url'.  If both are present, 'handler' will take precedence.
                The 'handler' can be a function or url.  If a function, it will be passed self.
                The 'handler' can be a function or url.  If a function, it will be passed self.
                If a URL, it will be the target of an internal fetch request
             */
            handler: null, // Where to submit this form. Can be URL or function.
                           // If a function, passed self, and assumes a callback function.
            url: null, // URL to submit the form to.
            target: null, // Target attribute.  Requires a URL.
            action: null, // A function to execute on submit that isn't a form handler. Basically this captures
                            // a return characters
            contenttype: 'application/json',
            dialog: null, // A SimpleDialog window that this form may be included in.
            enctype: null, // Encapsulation type.
            autocomplete: 'off', // Autocomplete value
            method: 'get', // Method for the form.  Also used in API calls.
            header: null, // Stuff to put at the header. This is expected to be a DOM element

            passive: false, // Start life in "passive" mode. This will set all form elements to "passive" and hide any controls.  This also shows the "passive" instructions, if any.

            headers: null, // Possible headers to attach to a submitted form.
            instructions: null, // Instructions configuration.  See InstructionBox.
            passiveinstructions: null, // Passive Instructions array.  Shown when the form is set to passive.

            spinnerstyle: 'spin', //
            spinnertext: TextFactory.get('simpleform-spinnertext'), //
            results: null, // Sometimes you want to pass a form the results from a different form, like with logging out.
            classes: [], // Extra css classes to apply,
            submittors: [], // Array of elements that can submit this form.
                            // SimpleButton objects that have submits=true inside of the actions[] array
                            // are automatically added to this.  Only put elements here that are _outside_
                            // of the form and need to be connected.
            elements: [], // An array of form elements. These are the objects, not the rendered dom.
            actions: [], // An array of action elements. This are typically buttons.
            passiveactions: [], // An array of action elements that appear only when the form is in passive mode. This are buttons or keywords.
            handlercallback: null, // If present, the response from the handler will be passed to this
                                // instead of the internal callback. Passed self and results
                                // The internal callback expects JSON with success: true|false, and arrays of strings
                                // for results, errors, and warnings
            onsuccess: null, // What to do if the handlercallback returns success (passed self and results)
            onfailure: null, // What to do if the handlercallback returns failure (passed self and results)
            onvalid: null, // What to do when the form becomes valid (passed self)
            oninvalid: null, // What to do when the form becomes invalid (passed self),
            novalidate: false, // if true, don't do any validation (always return true)
            validator: null // validator function, passed self
        };
    }

    /**
     * Define a simple form
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleForm.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `form-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Scroll it to the top
     */
    toTop() {
        this.contentbox.scrollTo(0, 0);
    }

    /**
     * Switch to 'passive' mode.
     */
    pacify() {
        this.form.classList.add('passive');
        this.passive = true;
        for (let e of this.elements) {
            e.pacify();
        }
        if ((this.passiveinstructions) && (this.instructionbox)) {
            this.instructionbox.setInstructions(this.passiveinstructions.instructions);
        }
        this.toTop();
    }

    /**
     * Switch from 'passive' mode to 'active' mode.
     */
    activate() {
        this.form.classList.remove('passive');
        this.passive = false;
        for (let e of this.elements) {
            e.activate();
        }
        if ((this.instructions) && (this.instructionbox)) {
            this.instructionbox.setInstructions(this.instructions.instructions);
        }
        this.toTop();
    }

    /**
     * Toggle between active states
     */
    toggleActivation() {
        if (this.form.hasClass('passive')) {
            this.activate();
            return;
        }
        this.pacify();
    }

    /* ACTION METHODS___________________________________________________________________ */

    /**
     * Submits the form.  Runs the validator first.
     */
    submit() {
        if (this.passive) { return; }

        if (this.validate()) {
            if (this.handler) {
                this.shade.activate();

                if (typeof this.handler === 'function') {
                    this.handler(this, (results) => {
                        if ((this.handlercallback) && (typeof this.handlercallback === 'function')) {
                            this.handlercallback(this, results);
                            this.shade.deactivate();
                        } else {
                            this.handleResults(results);
                        }
                    });
                } else { // its an API url
                    this.doAjax((results) => {
                        if ((this.handlercallback) && (typeof this.handlercallback === 'function')) {
                            this.handlercallback(this, results);
                            this.shade.deactivate();
                        } else {
                            this.handleResults(results);
                        }
                    });
                }
            } else if (this.url) {
                this.form.submit();
            } else if (this.action) {
                this.action();
            } else {
                console.log(`No handler defined for form ${this.id} :: ${this.name}`);
            }
        }
    }

    /**
     * Get the form value as a dictionary
     * @return the values of the form as a key=value dictionary
     */
    get dictionary() {
        let dictionary = {};
        for (let i of this.elements) {
            dictionary[i.name] = i.value;
        }
        return dictionary;
    }

    /**
     * Get the form value as a dictionary
     * @return the values of the form as a key=value dictionary
     */
    get json() { return this.dictionary; }

    /**
     * Execute an ajax call
     * @param callback the callback to fire when done
     */
    doAjax(callback) {
        // Edge is terrible and doesn't support FormData;
        let body,
            files;

        if (this.contenttype === 'application/x-www-form-urlencoded') {
            let urlelements = [];
            for (let i of this.elements) {
                urlelements.push(`${i.name}=${i.value}`);
            }
            body = urlelements.join('&');
        } else {
            let dict = {};
            for (let i of this.elements) {
                dict[i.name]  = i.value;
            }
            body = JSON.stringify(dict);
        }

        let headers = this.headers;
        if (!headers) { headers = {}; }

        if (!headers['Content-Type']) {
            headers['Content-Type'] = this.contenttype
        }

        fetch(this.handler, {
            headers: headers,
            method: this.method,
            enctype: this.enctype,
            body: body
        })
            .then(response => response.json()) // response -> json
            .then(data => { // do the thing.
                if ((callback) && (typeof callback === 'function')) {
                    callback(data);
                }
            })
            .catch(err => {
                console.error(`Error while executing ajax call.`);
                console.error(err);
            });
    }

    /**
     * This is the default form results handler
     * @param results the results object to be managed
     * @param noexecution Don't execute onsuccess or onfailure.
     */
    handleResults(results, noexecution) {
        if (this.resultscontainer) { this.resultscontainer.remove(); }
        this.resultscontainer = new ResultsContainer({
            results: results.successes,
            errors: results.errors,
            warnings: results.warnings
        }).container;
        this.headerbox.appendChild(this.resultscontainer);
        this.shade.deactivate();

        if (!noexecution) {
            if ((results.success) && ((this.onsuccess) && (typeof this.onsuccess === 'function'))) {
                this.onsuccess(this, results);
            } else if ((this.onfailure) && (typeof this.onfailure === 'function')) {
                this.onfailure(this, results);
            }
        }
    }

    /* VALIDATION METHODS_______________________________________________________________ */

    /**
     * Validates the form. Runs all validators on registered elements.
     * @param isFirstValidation set to true when the form loads so it doesn't auto-validate untouched forms
     * @return {boolean}
     */
    validate(isFirstValidataion = false) {
        if (this.novalidate) {
           this.runValid();
           return true;
        }
        let valid = true;
        let touched = false;
        for (let element of this.elements) {
            if (element.touched) {
                touched = true;
                let localValid = element.validate();
                if (!localValid) { valid = false; }
            } else if ((element.required) && (element.value === '')) {
                valid = false; // empty required fields
            }
        }

        if ((valid) && ((this.validator) && (typeof this.validator === 'function'))) {
            valid = this.validator(this);
        }

        if ((valid) && (!isFirstValidataion)) {
            this.runValid();
        } else {
            this.runInvalid();
        }

        return valid;
    }

    /**
     * This runs when the all elements in the form are valid.
     * It will enable all elements in this.submittors().
     * It then executes any supplied onvalid function, passing self.
     */
    runValid() {
        for (let submittor of this.submittors) {
            submittor.enable();
        }
        if ((this.onvalid) && (typeof this.onvalid === 'function')) {
            this.onvalid(this);
        }
    }

    /**
     * This runs when the all elements in the form are valid.
     * It will enable all elements in this.submittors().
     * It then executes any supplied onvalid function, passing self.
     */
    runInvalid() {
        for (let submittor of this.submittors) {
            submittor.disable();
        }
        if ((this.oninvalid) && (typeof this.oninvalid === 'function')) {
            this.oninvalid(this);
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the form object itself
     */
    buildForm() {

        this.form = document.createElement('form');
        this.form.setAttribute('id', this.id);
        this.form.setAttribute('novalidate', true); // turn off browser validation 'cause we do it by hand
        if (this.name) { this.form.setAttribute('name', this.name); }
        this.form.setAttribute('method', this.method);
        if (this.enctype) { this.form.setAttribute('enctype', this.enctype); }
        this.form.setAttribute('role', 'form');
        this.form.setAttribute('autocomplete', this.autocomplete);
        this.form.classList.add('cornflowerblue');
        for (let c of this.classes) {
            this.form.classList.add(c);
        }

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submit();
        });

        if ((this.handler) && (typeof this.handler !== 'function') && (this.target)) {
            this.form.setAttribute('target', this.target);
        }

        this.contentbox.appendChild(this.headerbox);
        this.contentbox.appendChild(this.elementbox);

        this.form.appendChild(this.shade.container);
        this.form.appendChild(this.contentbox);
        if ((this.actions) && (this.actions.length > 0)) {
            this.form.appendChild(this.actionbox);
        } else {
            this.form.classList.add('noactions');
        }
        if ((this.passiveactions) && (this.passiveactions.length > 0)) { this.form.appendChild(this.passiveactionbox); }

        this.validate(true);

        if (this.passive) {
            this.pacify();
        }

    }

    /**
     * Build the header for the form.
     */
    buildHeaderBox() {
        this.headerbox = document.createElement('div');
        this.headerbox.classList.add('header');
        if ((this.header) || ((this.instructions) && (this.instructions.instructions) && (this.instructions.instructions.length > 0))) {
            if (this.header) { this.headerbox.appendChild(this.header); }
            if (this.instructions) {
                this.headerbox.appendChild(this.instructionbox.container);
            }
        }
        if (this.results) {
            this.handleResults(this.results, true);
        }
    }

    /**
     * Build the instruction box for the form.
     */
    buildInstructionBox() {
        if ((!this.instructions) || (this.instructions.length === 0)) {
            return;
        }
        let ins = this.instructions;
        if ((this.passive) && (this.passiveinstructions) && (this.passiveinstructions.length > 0)) {
            ins = this.passiveinstructions;
        }
        this.instructionbox = new InstructionBox(ins);
    }

    /**
     * Draw the Form's shade
     */
    buildShade() {
        this.shade = new LoadingShade({
            spinnertext: this.spinnertext,
            spinnerstyle: this.spinnerstyle
        });
    }

    /**
     * Draw individual form elements
     */
    buildElementBox() {
        this.elementbox = document.createElement('div');
        this.elementbox.classList.add('elements');
        let animOrder = 0;
        for (let element of this.elements) {
            if (typeof element === 'string') { // This is a text block, turn to paragraph
                let p = document.createElement('p');
                p.innerHTML = element;
                this.elementbox.appendChild(p);
            } else {
                element.form = this;
                if (element.type === 'file') {
                    this.form.setAttribute('enctype', 'multipart/form-data');
                    this.enctype = 'multipart/form-data';
                }
                if ((!element.id) && (element.name)) {
                    element.id = `${this.id}-${element.name}`;
                } else if (!element.id) {
                    element.id = `${this.id}-e-${CFBUtils.getUniqueKey(5)}`;
                }
                element.container.classList.add('popin');
                element.container.style.setProperty('--anim-order', animOrder);
                animOrder++;
                this.addElement(element);
                this.elementbox.appendChild(element.container);
            }
        }
    }

    /**
     * Draw the content box
     */
    buildContentBox() {
        this.contentbox = document.createElement('div');
        this.contentbox.classList.add('contentbox');
    }

    /**
     * Draw the actions on the form, if any.
     */
    buildActionBox() {
        if ((this.actions) && (this.actions.length > 0)) {
            this.actionbox = document.createElement('div');
            this.actionbox.classList.add('actions');
            for (let action of this.actions) {
                if ((action.cansubmit) && (action.submits)) {
                    this.submittors.push(action);
                }
                action.form = this;
                this.actionbox.appendChild(action.container);
            }
        }
    }

    /**
     * Draw the passive actions on the form, if any.
     */
    buildPassiveActionBox() {
        if ((this.passiveactions) && (this.passiveactions.length > 0)) {
            this.passiveactionbox = document.createElement('div');
            this.passiveactionbox.classList.add('passiveactions');
            for (let action of this.passiveactions) {
                if ((action.cansubmit) && (action.submits)) {
                    this.submittors.push(action);
                }
                action.form = this;
                this.passiveactionbox.appendChild(action.container);
            }
        }
    }


    /* ELEMENT MAP METHODS______________________________________________________________ */

    getElement(element) {
        return this.elementmap[element];
    }

    addElement(element) {
        this.elementmap[element.id] = element;
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get action() { return this.config.action; }
    set action(action) { this.config.action = action; }

    get actionbox() {
        if (!this._actionbox) { this.buildActionBox(); }
        return this._actionbox;
    }
    set actionbox(actionbox) { this._actionbox = actionbox; }

    get actions() { return this.config.actions; }
    set actions(actions) { this.config.actions = actions; }

    get autocomplete() { return this.config.autocomplete; }
    set autocomplete(autocomplete) { this.config.autocomplete = autocomplete; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() { return this.form; } // shorthand to form.
    set container(container) { this.form = container; }

    get contentbox() {
        if (!this._contentbox) { this.buildContentBox(); }
        return this._contentbox;
    }
    set contentbox(contentbox) { this._contentbox = contentbox; }

    get contenttype() { return this.config.contenttype; }
    set contenttype(contenttype) { this.config.contenttype = contenttype; }

    get dialog() { return this.config.dialog; }
    set dialog(dialog) { this.config.dialog = dialog; }

    get elementbox() {
        if (!this._elementbox) { this.buildElementBox(); }
        return this._elementbox;
    }
    set elementbox(elementbox) { this._elementbox = elementbox; }

    get elementmap() {
        if (!this._elementmap) { this._elementmap = {}; }
        return this._elementmap;
    }
    set elementmap(elementmap) { this._elementmap = elementmap; }

    get elements() { return this.config.elements; }
    set elements(elements) { this.config.elements = elements; }

    get enctype() { return this.config.enctype; }
    set enctype(enctype) { this.config.enctype = enctype; }

    get form() {
        if (!this._form) { this.buildForm(); }
        return this._form;
    }
    set form(form) { this._form = form; }

    get handler() { return this.config.handler; }
    set handler(handler) {
        if (typeof handler !== 'function') {
            console.error("Action provided for handler is not a function!");
        }
        this.config.handler = handler;
    }

    get handlercallback() { return this.config.handlercallback; }
    set handlercallback(handlercallback) {
        if (typeof handlercallback !== 'function') {
            console.error("Action provided for handlercallback is not a function!");
        }
        this.config.handlercallback = handlercallback;
    }

    get header() { return this.config.header; }
    set header(header) { this.config.header = header; }

    get headerbox() {
        if (!this._headerbox) { this.buildHeaderBox(); }
        return this._headerbox;
    }
    set headerbox(headerbox) { this._headerbox = headerbox; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get passive() { return this.config.passive; }
    set passive(passive) { this.config.passive = passive; }

    get passiveactionbox() {
        if (!this._passiveactionbox) { this.buildPassiveActionBox(); }
        return this._passiveactionbox;
    }
    set passiveactionbox(passiveactionbox) { this._passiveactionbox = passiveactionbox; }

    get passiveactions() { return this.config.passiveactions; }
    set passiveactions(passiveactions) { this.config.passiveactions = passiveactions; }

    get passiveinstructions() { return this.config.passiveinstructions; }
    set passiveinstructions(passiveinstructions) { this.config.passiveinstructions = passiveinstructions; }

    get headers() { return this.config.headers; }
    set headers(headers) { this.config.headers = headers; }

    get instructionbox() {
        if (!this._instructionbox) { this.buildInstructionBox(); }
        return this._instructionbox;
    }
    set instructionbox(instructionbox) { this._instructionbox = instructionbox; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get resultscontainer() { return this._resultscontainer; }
    set resultscontainer(resultscontainer) { this._resultscontainer = resultscontainer; }

    get method() { return this.config.method; }
    set method(method) { this.config.method = method; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get novalidate() { return this.config.novalidate; }
    set novalidate(novalidate) { this.config.novalidate = novalidate; }

    get onfailure() { return this.config.onfailure; }
    set onfailure(onfailure) {
        if (typeof onfailure !== 'function') {
            console.error("Action provided for onfailure is not a function!");
        }
        this.config.onfailure = onfailure;
    }

    get onsuccess() { return this.config.onsuccess; }
    set onsuccess(onsuccess) {
        if (typeof onsuccess !== 'function') {
            console.error("Action provided for onsuccess is not a function!");
        }
        this.config.onsuccess = onsuccess;
    }

    get oninvalid() { return this.config.oninvalid; }
    set oninvalid(oninvalid) {
        if (typeof oninvalid !== 'function') {
            console.error("Action provided for oninvalid is not a function!");
        }
        this.config.oninvalid = oninvalid;
    }

    get onvalid() { return this.config.onvalid; }
    set onvalid(onvalid) {
        if (typeof onvalid !== 'function') {
            console.error("Action provided for onvalid is not a function!");
        }
        this.config.onvalid = onvalid;
    }

    get results() { return this.config.results; }
    set results(results) { this.config.results = results; }

    get shade() {
        if (!this._shade) { this.buildShade(); }
        return this._shade;
    }
    set shade(shade) { this._shade = shade; }

    get spinnerstyle() { return this.config.spinnerstyle; }
    set spinnerstyle(spinnerstyle) { this.config.spinnerstyle = spinnerstyle; }

    get spinnertext() { return this.config.spinnertext; }
    set spinnertext(spinnertext) { this.config.spinnertext = spinnertext; }

    get submittors() { return this.config.submittors; }
    set submittors(submittors) { this.config.submittors = submittors; }

    get target() { return this.config.target; }
    set target(target) { this.config.target = target; }

    get url() { return this.config.url; }
    set url(url) { this.config.url = url; }

    get validator() { return this.config.validator; }
    set validator(validator) {
        if (typeof validator !== 'function') {
            console.error("Action provided for validator is not a function!");
        }
        this.config.validator = validator;
    }


}
window.SimpleForm = SimpleForm;

class TabBar {

    static get DEFAULT_CONFIG() {
        return {
            id: null, // The id
            navigation: false, // set to true if this is a navigation element, so that it wraps in a <nav /> element.
            responsive: true, // Set to false to disable responsive collapsing.
            menuicon: "menu", // the icon to use for the menu button, if in responsive mode.
            menulabel: TextFactory.get('toggle_menu'), // Default text for the menu
            arialabel: TextFactory.get('primary'), // the aria label to use if this is a navigation
            submenuicon: 'triangle-down', // icon to indicate submenu

            vertical: false, // Vertical or horizontal
            animation: 'popin', // Set to null to disable animations
            tabs: [], // An array of tab definitions
            // {
            //    classes: [] // An array of css classes to add
                              // include "mobileonly" to only show item in mobile
            //    label: "Tab Text", // text, optional if given an icon
            //    id: null, // tab id, used with "activate(tabid)"
            //    icon: null, // an icon identifier, optional
            //    tooltip: null, // an optional tooltip
            //    url: null, // just go to this url,
            //    selected: false, // if true, start selected
            //    action: (tab id, self) => { } // what to do when the tab is clicked. if empty, uses default action.
            //    subtabs: null  // an array of tab definitions to indicate subtabs
            // }
            action: null, // a function, passed (tab id, self), where tab is the tab id, and self is this TabPanel.
                          // This is what will fire if there is no action defined on the tab definition.
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define a TabBar
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, TabBar.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `tabbar-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Marks a specific tab as selected
     * @param tab the tab to select
     */
    select(tab) {
        if (typeof tab === 'string') {
            tab = document.querySelectorAll(`[data-tabid='${tab}']`)[0];
        }
        if (!tab) {
            console.warn(`Tab does not exist: ${tab}`);
            return;
        }
        if (this.selected) {
            this.selected.removeAttribute('aria-selected');
            this.selected.setAttribute('tabindex', '-1');
        }
        this.selected = tab;
        this.selected.setAttribute('aria-selected', 'true');
        this.selected.setAttribute('tabindex', '0');

        if ((this.responsive) && (this.menutitle)) {
            this.menutitle.innerHTML = this.selected.getAttribute('data-tabtext');
        }
    }

    deselectAll() {
        if (this.selected) {
            this.selected.removeAttribute('aria-selected');
            this.selected.setAttribute('tabindex', '-1');
            this.selected = null;
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the DOM.
     */
    buildContainer() {


        if (this.navigation) {
            this.container = document.createElement('nav');
            this.list.removeAttribute('role');
            this.container.setAttribute('aria-label', this.arialabel);
        } else {
            this.container = document.createElement('div');
        }

        this.container.classList.add('tablist-container');

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.responsive) {
            this.responsivebox = document.createElement('div');
            this.responsivebox.classList.add('responsivebox');

            this.menubutton = new HamburgerButton({
                text: this.menulabel,
                toggletarget: this
            });
            this.responsivebox.appendChild(this.menubutton.button);

            this.menutitle = document.createElement('div');
            this.menutitle.classList.add('menutitle');
            this.responsivebox.appendChild(this.menutitle);

            this.container.classList.add('responsive');
            this.container.appendChild(this.responsivebox);
        }

        this.container.appendChild(this.list);
    }

    /**
     * Build the actual tab list object
     */
    buildList() {
        this.list = document.createElement('ul');
        this.list.setAttribute('role', 'tablist');
        this.list.classList.add('tabbar');

        for (let c of this.classes) {
            this.list.classList.add(c);
        }

        if (this.vertical) {
            this.list.classList.add('vertical');
        }
        let order = 1;

        for (let tabdef of this.tabs) {
            order = this.buildTab(tabdef, order);
        }
    }

    /**
     * Build an individual tab
     * @param tabdef the tab definition
     * @param order the taborder
     * @param parent the parent tab object, if any (this will be an li)
     * @return the next in the order
     */
    buildTab(tabdef, order, parent) {

        let parentname = 'root',
            next = order + 1,
            previous = order - 1;

        if (previous < 1) { previous = 0; }

        if ((!tabdef.label) && (!tabdef.icon)) {
            console.warn('TabBar: Element defined but has neither icon or text.  Skipping');
            return null;
        }

        let li = document.createElement('li');
        li.setAttribute('role', 'none');
        li.setAttribute('id', `parent-${tabdef.id}`);
        li.setAttribute('data-tabno', `${order}`);
        if (tabdef.classes) {
            for (let c of tabdef.classes) {
                li.classList.add(c);
            }
        }
        if (tabdef.tooltip) {
            new ToolTip({
                text: tabdef.tooltip,
                icon: tabdef.tipicon,
                gravity: (tabdef.tooltipgravity ? tabdef.tooltipgravity : 's')
            }).attach(li);
        }

        let link = document.createElement('a');
        link.setAttribute('data-tabtext', tabdef.label);
        link.setAttribute('data-tabno', order);
        link.setAttribute('id', tabdef.id);
        link.setAttribute('data-tabid', tabdef.id);
        link.setAttribute('tabindex', '-1'); // always set this here
        if (!this.navigation) {
            link.setAttribute('role', 'menuitem');
        }
        if (tabdef.icon) {
            link.appendChild(IconFactory.icon(tabdef.icon));
        }
        if (tabdef.label) {
            let linktext = document.createElement('span');
            linktext.classList.add('t');
            linktext.innerHTML = tabdef.label;
            link.appendChild(linktext);
        }

        li.appendChild(link);

        if (parent) {
            parentname = parent.getAttribute('data-tabid');
            let plist = parent.querySelector('ul');
            if (!plist) {
                plist = document.createElement('ul');
                plist.setAttribute('role', 'menu');
                plist.classList.add('submenu');
                parent.appendChild(plist);
            }
            plist.appendChild(li); // attach to child list
        } else {
            if (this.animation) {
                li.style.setProperty('--anim-order', order); // used in animations
                li.classList.add(this.animation);
            }
            this.list.appendChild(li); // attach to root list
        }
        link.setAttribute('data-parent', parentname);
        li.setAttribute('data-parent', parentname);
        order++;

        // Is this a master menu item?
        if ((tabdef.subtabs) && (tabdef.subtabs.length > 0)) {
            link.classList.add('mastertab');
            link.setAttribute('aria-haspopup', true);
            link.setAttribute('aria-expanded', false);
            if (this.submenuicon) {
                let sicon = IconFactory.icon(this.submenuicon);
                sicon.classList.add('secondicon');
                link.appendChild(sicon);
            }
            // Add the subtabs ins
            let localorder = 1;
            for (let subdef of tabdef.subtabs) {
                localorder = this.buildTab(subdef, localorder, li);
            }

            link.addEventListener('keydown', (e) => {
                let setname = li.getAttribute('data-parent');
                let prevtab = li.parentNode.querySelector(`li[data-parent='${setname}'][data-tabno='${previous}'] a[data-tabno='${previous}']`);
                let nexttab = li.parentNode.querySelector(`li[data-parent='${setname}'][data-tabno='${next}'] a[data-tabno='${next}']`);

                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        e.stopPropagation();
                        if (prevtab) {
                            prevtab.focus();
                        }
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        e.stopPropagation();
                        if (nexttab) {
                            nexttab.focus();
                        }
                        break;
                    case 'ArrowDown':
                    case 'Enter':
                    case 'Space':
                        e.preventDefault();
                        e.stopPropagation();
                        let ul = li.querySelector('ul');
                        if (ul) {
                            let children = ul.querySelectorAll('li a');
                            children[0].focus();
                        }
                        break;
                    default:
                        break;
                }
            });
        } else if (tabdef.url) {
            link.setAttribute('href', tabdef.url);
        } else { // Non-Master Tabs
            link.addEventListener('keydown', (e) => {

                let setname = li.getAttribute('data-parent');
                let prevtab = li.parentNode.querySelector(`li[data-parent='${setname}'][data-tabno='${previous}'] a[data-tabno='${previous}']`);
                let nexttab = li.parentNode.querySelector(`li[data-parent='${setname}'][data-tabno='${next}'] a[data-tabno='${next}']`);
                let parenttab;
                if (parent) {
                    parenttab = parent.querySelector('a');
                }

                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        e.stopPropagation();
                        if ((previous === 0) && (parenttab)) {
                            parenttab.focus();
                        } else if (prevtab) {
                            prevtab.focus();
                        }
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        e.stopPropagation();
                        if (nexttab) {
                            nexttab.focus();
                        }
                        break;
                    case 'Escape':
                        e.preventDefault();
                        e.stopPropagation();
                        if (parenttab) {
                            parenttab.focus();
                        }
                        break;
                    case 'Enter':
                    case 'Space':
                        e.preventDefault();
                        e.stopPropagation();
                        link.click();
                        break;
                    default:
                        break;
                }
            });
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.select(tabdef.id);
                if ((tabdef.action) && (typeof tabdef.action === 'function')) {
                    tabdef.action(tabdef.id, me);
                } else if (this.action) {
                    this.action(tabdef.id, me);
                }
                link.blur();
            });
        }

        if (tabdef.selected) {
            window.setTimeout(()  => { // Have to wait until we're sure we're in the DOM
                this.select(tabdef.id);
            }, 100);
        }

        return order; // send this back.
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the menu is open
     * @return true if it is!
     */
    get isopen() {
        return this.container.hasAttribute('aria-expanded');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Toggle whether or not the menu is open
     */
    toggle() {
        if (this.isopen) {
            this.close();
            return;
        }
        this.open();
    }

    /**
     * Opens the menu
     */
    open() {

        if (this.isopen) { return; }
        this.container.setAttribute('aria-expanded', 'true');
        if (this.menubutton) { this.menubutton.open(); }
        setTimeout(()  => { // Set this after, or else we'll get bouncing.
            this.setCloseListener();
        }, 200);
    }

    /**
     * Closes the menu
     */
    close() {
        this.container.removeAttribute('aria-expanded');
        if (this.menubutton) { this.menubutton.close(); }
    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { this.close(); }
        }, { once: true });

        window.addEventListener('click', (e) => {
            if (e.target === this.list) {
                this.setCloseListener();
            } else {
                this.close();
            }
        }, { once: true, });
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get action() { return this.config.action; }
    set action(action) { this.config.action = action; }

    get animation() { return this.config.animation; }
    set animation(animation) { this.config.animation = animation; }

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get list() {
        if (!this._list) { this.buildList(); }
        return this._list;
    }
    set list(list) { this._list = list; }

    get menuicon() { return this.config.menuicon; }
    set menuicon(menuicon) { this.config.menuicon = menuicon; }

    get menulabel() { return this.config.menulabel; }
    set menulabel(menulabel) { this.config.menulabel = menulabel; }

    get menubutton() { return this._menubutton; }
    set menubutton(menubutton) { this._menubutton = menubutton; }

    get menutitle() { return this._menutitle; }
    set menutitle(menutitle) { this._menutitle = menutitle; }

    get navigation() { return this.config.navigation; }
    set navigation(navigation) { this.config.navigation = navigation; }

    get responsive() { return this.config.responsive; }
    set responsive(responsive) { this.config.responsive = responsive; }

    get responsivebox() { return this._responsivebox; }
    set responsivebox(responsivebox) { this._responsivebox = responsivebox; }

    get selected() { return this._selected; }
    set selected(selected) { this._selected = selected; }

    get submenuicon() { return this.config.submenuicon; }
    set submenuicon(submenuicon) { this.config.submenuicon = submenuicon; }

    get tabs() { return this.config.tabs; }
    set tabs(tabs) { this.config.tabs = tabs; }

    get vertical() { return this.config.vertical; }
    set vertical(vertical) { this.config.vertical = vertical; }

}
window.TabBar = TabBar;

class ToolTip {

    static get DEFAULT_CONFIG() {
        return {
            id : null,
            icon: 'help-circle',
            gravity: 'n',
            iconclasses: [],
            text: null,
            parent: null,
            waittime: 1000,
            classes: []
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The tooltip wrapper object will have this as it's id." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            icon: { type: 'option', datatype: 'string', description: "The icon to use in the tooltip." },
            iconclasses: { type: 'option', datatype: 'stringarray', description: "An array of css classes to apply to the icon." },
            gravity: { type: 'option', datatype: 'string', description: "The direction to open the tooltip whe." },
            text: { type: 'option', datatype: 'string', description: "The text to use in the tooltip." },
            parent: { type: 'option', datatype: 'object', description: "The parent object this fires off." },
            waittime: { type: 'option', datatype: 'number', description: "How long to wait (in milliseconds) before activating." }
        };
    }

    static closeOpen() {
        clearTimeout(ToolTip.timer);
        if (ToolTip.activeTooltip) {
            clearTimeout(ToolTip.activeTooltip.timer);
            ToolTip.activeTooltip.close();
        }
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, ToolTip.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `tt-${CFBUtils.getUniqueKey(5)}`; }
        return this;
    }

    /**
     * Attach the tooltip to its parent.  Will reset an existing parent if one is provided
     * during construction.
     * @param parent
     */
    attach(parent) {

        if ((parent) && (parent.container)) {
           parent = parent.container;
        }
        this.parent = parent;
        this.parent.appendChild(this.container);
        this.parent.setAttribute('data-tooltip', 'closed');
        this.parent.addEventListener('mouseover', function() {
            this.open();
        });
        this.parent.addEventListener('mouseout', function() {
            clearTimeout(ToolTip.timer);
            this.close();
        });
        this.parent.addEventListener('focusin', function() {
            this.open();
        });
        this.parent.addEventListener('focusout', function() {
            clearTimeout(ToolTip.timer);
            this.close();
        });
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Opens the help tooltip
     * This actually only starts a timer.  The actual opening happens in openGuts()
     */
    open() {

        ToolTip.closeOpen();
        ToolTip.timer = setTimeout(()  => {
            this.openGuts();
        }, this.waittime);
    }

    /**
     * Do the actual opening.
     */
    openGuts() {

        ToolTip.closeOpen();

        document.body.appendChild(this.container);
        this.container.removeAttribute('aria-hidden');

        if (typeof ToolTip.activeTooltip === 'undefined' ) {
            ToolTip.activeTooltip = this;
        } else {
            ToolTip.activeTooltip = this;
        }

        this.setPosition();

        window.addEventListener('scroll', this.setPosition, true);

    }

    /**
     * Set the position of the tooltip.
     */
    setPosition() {
        if (!ToolTip.activeTooltip) { return; }
        let self = ToolTip.activeTooltip;

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = self.parent.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top;

        switch(this.gravity) {
            case 's':
            case 'south':
                self.container.style.top = `${(offsetTop + self.container.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.container.style.left = `${offsetLeft - CFBUtils.getSingleEmInPixels()}px`;
                break;
            case 'w':
            case 'west':
                self.container.style.top = `${offsetTop}px`;
                self.container.style.left = `${offsetLeft - self.container.clientWidth - (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'e':
            case 'east':
                self.container.style.top = `${offsetTop}px`;
                self.container.style.left = `${offsetLeft + self.parent.offsetWidth + (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'n':
            case 'north':
            default:
                self.container.style.top = `${(offsetTop - self.container.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.container.style.left = `${offsetLeft - CFBUtils.getSingleEmInPixels()}px`;
                break;
        }

    }

    /**
     * Closes the help tooltip.
     */
    close() {
        this.parent.appendChild(this.container);
        window.removeEventListener('scroll', this.setPosition, true);
        this.container.setAttribute('aria-hidden', 'true');
        ToolTip.activeTooltip = null;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('tooltip');
        this.container.setAttribute('aria-hidden', 'true');
        if (this.id) { this.container.setAttribute('id', this.id); }
        switch(this.gravity) {
            case 's':
            case 'south':
                this.container.classList.add('south');
                break;
            case 'w':
            case 'west':
                this.container.classList.add('west');
                break;
            case 'e':
            case 'east':
                this.container.classList.add('east');
                break;
            case 'n':
            case 'north':
            default:
                this.container.classList.add('north');
                break;
        }

        if ((this.classes) && (this.classes.length > 0)) {
            for (let c of this.classes) {
                this.container.classList.add(c);
            }
        }

        if ((this.icon) && (this.icon !== '')) {
            let icon = IconFactory.icon(this.icon);
            icon.classList.add('tipicon');
            if ((this.iconclasses) && (this.iconclasses.length > 0)) {
                for (let ic of this.iconclasses) {
                    icon.classList.add(ic);
                }
            }
            this.container.appendChild(icon);
        }

        this.tiptext = document.createElement('div');
        this.tiptext.classList.add('tiptext');
        this.tiptext.setAttribute('id', `${this.id}-text`);
        if (this.text) {
            this.tiptext.innerHTML = this.text;
        }

        this.container.appendChild(this.tiptext);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get gravity() { return this.config.gravity; }
    set gravity(gravity) { this.config.gravity = gravity; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get iconclasses() { return this.config.iconclasses; }
    set iconclasses(iconclasses) { this.config.iconclasses = iconclasses; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get parent() { return this.config.parent; }
    set parent(parent) { this.config.parent = parent; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

    get timer() { return this._timer; }
    set timer(timer) { this._timer = timer; }

    get tiptext() { return this._tiptext; }
    set tiptext(tiptext) { this._tiptext = tiptext; }

    get tooltip() { return this._tooltip; }
    set tooltip(tooltip) { this._tooltip = tooltip; }

    get waittime() { return this.config.waittime; }
    set waittime(waittime) { this.config.waittime = waittime; }

}
window.ToolTip = ToolTip;
class InputElement {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            attributes: null,
            dataattributes: null,
            name: null,
            form: null,
            counter: null,
            forceconstraints: null,
            type: 'text',
            label: null,
            placeholder: null,
            preamble: null,
            title: null,
            pattern: null,
            icon: null,
            minimal: false,
            passive: false,
            unsettext: TextFactory.get('not_set'),
            help: null,
            helpwaittime: 5000,
            required: false,
            requiredtext: TextFactory.get('required_lc'),
            requirederror: TextFactory.get('input-error-required'),
            hidden: false,
            autocomplete: 'off',
            arialabel: null,
            maxlength: null,
            value: '',
            disabled: false,
            classes: [],
            onchange: null,
            onreturn: null,
            ontab: null,
            onkeyup: null,
            onkeydown: null,
            focusin: null,
            focusout: null,
            validator: null,
            renderer: (data) => { return document.createTextNode(data); }

        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The button object will have this as it's id." },
            dataattributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with data-$key = value on elements." },
            attributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with $key = value on elements." },
            form: { type: 'option', datatype: 'simpleform', description: "A SimpleForm object this element this is in." },
            arialabel: { type: 'option', datatype: 'string', description: "The aria-label attribute." },
            name: { type: 'option', datatype: 'string', description: "The name attribute for the input element." },
            label: { type: 'option', datatype: 'string', description: "Input label. If null, no label will be shown." },
            title: { type: 'option', datatype: 'string', description: "The title attribute for the element. Not recommended to be used." },
            pattern: { type: 'option', datatype: 'string', description: "Input pattern attribute." },
            icon: { type: 'option', datatype: 'string', description: "Use to define a specific icon, used in some specific controls." },
            minimal: { type: 'option', datatype: 'boolean', description: "If true, build with the intent that it is part of a larger component. This removes things like the secondary controls and validation boxes." },
            counter: { type: 'option', datatype: 'enumeration', description: "A value for a character counter. Null means 'no counter'. Possible values: null, 'remaining', 'limit', and 'sky'." },
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, force constraints defined in sub classes (many inputs don't have any)." },
            placeholder: { type: 'option', datatype: 'string', description: "Input placeholder. Individual fields can calculate this if it's null. To insure a blank placeholder, set the value to ''." },
            passive: { type: 'option', datatype: 'boolean', description: "Start life in passive mode." },
            preamble: { type: 'option', datatype: 'string', description: "This text will display before the element as additional explanation." },
            unsettext: { type: 'option', datatype: 'string', description: "Text to display in passive mode if the value is empty." },
            help: { type: 'option', datatype: 'string', description: "Help text that appears in tooltips." },
            helpwaittime: { type: 'option', datatype: 'number', description: "How long to wait before automatically showing help tooltip." },
            required: { type: 'option', datatype: 'boolean', description: "Is this a required field or not." },
            requiredtext: { type: 'option', datatype: 'string', description: "Text to display on required items." },
            requirederror: { type: 'option', datatype: 'string', description: "The error message to display if required item isn't filled." },
            hidden: { type: 'option', datatype: 'boolean', description: "Whether or not to bea hidden element." },
            autocomplete: { type: 'option', datatype: 'boolean', description: "Enable browser autocomplete. Default is off." },
            maxlength: { type: 'option', datatype: 'number', description: "If set, applies a maxlength to the element." },
            value: { type: 'option', datatype: 'string', description: "Value to use for the element." },
            disabled: { type: 'option', datatype: 'boolean', description: "If true, disable the field." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            onchange: { type: 'option', datatype: 'function', description: "The change handler. Passed (self)." },
            onreturn: { type: 'option', datatype: 'function', description: "The action to execute on hitting the return key. Passed (event, self) as arguments." },
            ontab: { type: 'option', datatype: 'function', description: "The action to execute on hitting the tab key. Passed (event, self) as arguments." },
            onkeyup: { type: 'option', datatype: 'function', description: "The action to execute on key up. Passed (event, self) as arguments." },
            onkeydown: { type: 'option', datatype: 'function', description: "The action to execute on key down. Passed (event, self) as arguments." },
            focusin: { type: 'option', datatype: 'function', description: "The action to execute on focus in. Passed (event, self) as arguments." },
            focusout: { type: 'option', datatype: 'function', description: "The action to execute on focus out. Passed (event, self) as arguments." },
            validator: { type: 'option', datatype: 'function', description: "A function to run to test validity. Passed the self as arguments." },
            renderer: { type: 'option', datatype: 'function', description: "A function that can be used to format the in the field in passive mode." }
        };
    }

    /**
     * Define a the input
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, InputElement.DEFAULT_CONFIG, config);

        if (!this.arialabel) { // munch aria label.
            if (this.label) {
                this.arialabel = this.label;
            } else if (this.title) {
                this.arialabel = this.title;
            }
        }

        if (!this.id) { this.id = `e-${CFBUtils.getUniqueKey(5)}`; }

        if (!this.name) { this.name = this.id; }

        if (!this.config.value) { this.config.value = ''; }

        if (this.config.value) { // store the supplied value if any
            this.origval = this.config.value;
        } else {
            this.origval = '';
        }

        this.touched = false; // set untouched on creation.
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Return the input mode. This is used by mobile devices to select the correct keyboard.
     * This is nearly always overridden.
     * (Valid values are text, none, tel, url, email, numeric, decimal, search
     * @return {string}
     */
    get inputmode() { return "text"; }

    /**
     * Returns a topcontrol, if any.  This is usually a character counter, and is overridden.
     * @return {null}, or the character counter.
     */
    get topcontrol() { return this.charactercounter; }

    /**
     * Return an extra input control, if any. This is things like stepper buttons for numbers.
     * @return {null}, or the input control.
     */
    get inputcontrol() { return null; }

    /**
     * Returns the raw element, without any container
     * @return {*} the element.
     */
    get naked() { return this.input; }

    /**
     * Let us know if there's a container on this.
     * @return {boolean}
     */
    get hascontainer() {
        return !!this._container;
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Has the field been changed or not?
     * @return {boolean} true or false, depending.
     */
    isDirty() {
        return (this.origval !== this.value);
    }

    /**
     * Runs validation.  Shows errors, if any. Returns true or false, depending.
     * @param onload If true, this validation fires on the loading. This is important to
     * know because some invalidations aren't actually errors until the form is submitted.
     * @return {boolean}
     */
    validate(onload) {
        this.errors = [];
        this.warnings = [];
        if ((!onload) && (this.required) && ((!this.value) || (this.value.length === 0))) {
            this.errors.push(this.requirederror);
        }

        if ((this.localValidator) && (typeof this.localValidator === 'function')) {
            this.localValidator(onload);
        }
        if ((this.validator) && (typeof this.validator === 'function')) {
            this.validator(this);
        }
        if ((this.errors.length > 0) || (this.warnings.length > 0)) {
            this.showMessages();
            this.container.classList.remove('valid');
            this.input.removeAttribute('aria-invalid');
            if (this.errors.length > 0) {
                this.input.setAttribute('aria-invalid', 'true');
            }
        } else {
            this.clearMessages();
            this.input.removeAttribute('aria-invalid');
            if ((!this.value) || ((this.value) && (this.value.length === 0))) { // it's cleared.
                this.container.classList.remove('valid');
                this.container.classList.remove('filled');
            } else if ((this.isDirty()) && (!onload)) { // This has to be valid
                this.container.classList.add('valid');
                this.container.classList.add('filled');
            } else if (this.value) {
                this.container.classList.remove('valid');
                this.container.classList.add('filled');
            } else {
                this.container.classList.remove('valid');
            }
        }
        return (this.errors.length < 1);
    }

    /**
     * Local datatype validator, intended for overriding
     * @param onload If true, this validation fires on the loading. This is important to
     * know because some invalidations aren't actually errors until the form is submitted.
     */
    localValidator(onload) { }

    /**
     * Show messages and warnings
     */
    showMessages() {
        this.messagebox.innerHTML = "";
        for (let error of this.errors) {
            this.addError(error);
        }
        for (let warning of this.warnings) {
            this.addWarning(warning);
        }
        if (this.errors.length > 0) {
            this.container.classList.add('error');
        } else if (this.warnings.length > 0) {
            this.container.classList.add('warning');
        }
        this.messagebox.removeAttribute('aria-hidden');
    }

    /**
     * Clears all messages from the element.
     */
    clearMessages() {
        this.errors = [];
        this.warnings = [];
        this.messagebox.innerHTML = '';
        this.messagebox.setAttribute('aria-hidden', 'true');
        this.container.classList.remove('error');
        this.container.classList.remove('warning');
    }

    /**
     * Add an error.
     * @param error the error to add
     */
    addError(error) {
        let err = document.createElement('li');
        err.classList.add('error');
        err.innerHTML = error;
        this.messagebox.appendChild(err);
    }

    /**
     * Add a warning
     * @param warning the warning to add
     */
    addWarning(warning) {
        let warn = document.createElement('li');
        warn.classList.add('warning');
        warn.innerHTML = warning;
        this.messagebox.appendChild(warn);
    }

    /**
     * Updates the counter
     */
    updateCounter() {
        if (!this.counter) { return; }

        let ctext = "";
        if (this.counter === 'limit') {
            ctext = TextFactory.get('input-counter-limit', this.value.length, this.maxlength);
        } else if (this.counter === 'sky') {
            ctext = TextFactory.get('input-counter-sky', this.value.length);
        } else { // remaining
            ctext = TextFactory.get('input-counter-remaining', (this.maxlength - this.value.length));
        }

        this.charactercounter.innerHTML = ctext;

        if ((this.maxlength) && (this.value.length >= this.maxlength)) {
            this.charactercounter.classList.add('outofbounds');
        } else if ((this.counter !== 'sky')
            && (this.value.length >= (this.maxlength * 0.90))) {
            this.charactercounter.classList.remove('outofbounds');
            this.charactercounter.classList.add('danger');
        } else {
            this.charactercounter.classList.remove('danger');
            this.charactercounter.classList.remove('outofbounds');
        }
    }

    /**
     * Calculate what the placeholder should be. This method is often overridden.
     * @return {null|*}
     */
    calculatePlaceholder() {
        return '';
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the element
     */
    disable() {
        this.input.setAttribute('disabled', 'true');
        this.disabled = true;
        if (this.container) { this.container.classList.add('disabled'); }
    }

    /**
     * Disable the element
     */
    enable() {
        this.input.removeAttribute('disabled');
        this.disabled = false;
        if (this.container) { this.container.classList.remove('disabled'); }
    }

    /**
     * Switch to 'passive' mode.
     */
    pacify() {
        this.container.classList.add('passive');
        this.passive = true;
    }

    /**
     * Switch from 'passive' mode to 'active' mode.
     */
    activate() {
        this.container.classList.remove('passive');
        this.passive = false;
    }

    /**
     * Toggle the passive/active modes
     */
    toggleActivation() {
        if (this.container.classList.contains('passive')) {
            this.activate();
            return;
        }
        this.pacify();
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get passivetext() {
        let v;
        if (this.value) {
            v = this.value;
        } else if (this.config.value) {
            v = this.config.value;
        }
        if (v) {
            if (this.renderer) {
                return this.renderer(v);
            }
            return document.createTextNode(v);
        }
        return document.createTextNode(this.unsettext);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds and returns a container object for all parts.
     * This gets over-ridden in elements that have additional structures, like a character counter
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        if (this.classes) {
            for (let c of this.classes) {
                this.container.classList.add(c);
            }
        }

        if (this.preamble) {
            let p = document.createElement('p');
            p.classList.add('preamble');
            p.innerHTML = this.preamble;
            this.container.appendChild(p);
        }

        this.topline = document.createElement('div');
        this.topline.classList.add('topline');
        if (this.label) { this.topline.appendChild(this.labelobj); }
        if (this.topcontrol) { this.topline.appendChild(this.topcontrol); }
        this.container.appendChild(this.topline);

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.input);
        if (this.inputcontrol) { wrap.appendChild(this.inputcontrol); }
        this.container.appendChild(wrap);

        if (!this.minimal) {
            this.container.appendChild(this.passivebox);
            this.container.appendChild(this.messagebox);
        }
        if (this.minimal) { this.container.classList.add('minimal'); }

        this.postContainerScrub();

    }

    /**
     * Apply various things to the container and its children.
     */
    postContainerScrub() {
        if (this.required) {
            this.container.classList.add('required');
            this.input.setAttribute('required', 'required');
        }
        if (this.mute) { this.container.classList.add('mute'); }
        if (this.disabled) { this.container.classList.add('disabled'); }

        if (this.hidden) {
            this.container.style.display = 'none';
            this.container.setAttribute('aria-hidden', 'true');
        }
        if ((this.config.value) && (this.config.value.length > 0)) {
            this.container.classList.add('filled');
        }
        if (this.passive) {
            this.pacify();
        }
        if (this.help) {
            this.input.setAttribute('aria-describedby', `${this.id}-help-tt`);
            this.input.setAttribute('aria-labelledby', `${this.id}-label`);
        }

        this.validate(true);
    }

    /**
     * Build the passive text box.
     */
    buildInactiveBox() {
        this.passivebox = document.createElement('div');
        this.passivebox.classList.add('passivebox');
        this.passivebox.appendChild(this.passivetext);
    }

    /**
     * Builds the input's DOM.
     */
    buildInput() {


        if (this.type === 'textarea') {
            this.input = document.createElement('textarea');
        } else {
            this.input = document.createElement('input');
        }

        this.input.setAttribute('type', this.type);
        this.input.setAttribute('id', this.id);
        this.input.setAttribute('name', this.name);
        this.input.setAttribute('inputmode', this.inputmode);
        this.input.setAttribute('aria-describedby', `msg-${this.id}`);
        this.input.setAttribute('role', 'textbox');
        this.input.setAttribute('tabindex', '0');
        if (this.mute) {
            this.input.setAttribute('placeholder', '');
        } else {
            this.input.setAttribute('placeholder', this.placeholder);
        }


        if (this.title) { this.input.setAttribute('title', this.title); }
        if (this.autocomplete) { this.input.setAttribute('autocomplete', this.autocomplete); }
        if (this.arialabel) { this.input.setAttribute('aria-label', this.arialabel); }        if (this.pattern) { this.input.setAttribute('pattern', this.pattern); }
        if (this.maxlength) { this.input.setAttribute('maxlength', this.maxlength); }

        if (this.classes) {
            for (let c of this.classes) {
                this.input.classList.add(c);
            }
        }
        this.input.addEventListener('change', (e) => {
            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(me);
            }
        });

        this.input.addEventListener('keydown', (e) => {
            // Reset this to keep readers from constantly beeping. It will re-validate later.
            this.input.removeAttribute('aria-invalid');
            if (this.hascontainer) {
                this.updateCounter();
            }
            this.touched = true; // set self as touched.
            if ((this.onkeydown) && (typeof this.onkeydown === 'function')) {
                this.onkeydown(e, me);
            }
        });
        this.input.addEventListener('keyup', (e) => {
            if (this.hascontainer) {
                if (this.helptimer) {
                    clearTimeout(this.helptimer);
                    if (this.helpbutton) {
                        this.helpbutton.closeTooltip();
                    }
                }

                if ((this.value) && (this.value.length > 0)) {
                    this.container.classList.add('filled');
                } else {
                    this.container.classList.remove('filled');
                }
                if ((this.form) && (this.required) // If this is the only thing required, tell the form.
                    && ((this.input.value.length === 0) || (this.input.value.length === 1))) { // Only these two lengths matter
                    if (this.form) { this.form.validate(); }
                }
            }

            if ((e.key === 'Enter') // Return key
                && (this.onreturn) && (typeof this.onreturn === 'function')) {
                e.preventDefault();
                e.stopPropagation();
                this.onreturn(e, me);
            } else if ((this.onkeyup) && (typeof this.onkeyup === 'function')) {
                this.onkeyup(e, me);
            }
        });
        this.input.addEventListener('focusin', (e) => {
            if ((this.mute) && (this.placeholder) && (this.placeholder !== this.label)) {
                this.input.setAttribute('placeholder', this.placeholder);
            }
            if (this.hascontainer) {
                this.container.classList.add('active');
                if ((this.help) && (this.helpbutton)) {
                    this.helptimer = setTimeout(() => {
                        this.helpbutton.openTooltip();
                    }, this.helpwaittime);
                }
            }
            if ((this.focusin) && (typeof this.focusin === 'function')) {
                this.focusin(e, me);
            }
        });
        this.input.addEventListener('focusout', (e) => {

            if (this.hascontainer) {
                if (this.passivebox) {
                    this.passivebox.innerHTML = '';
                    this.passivebox.appendChild(this.passivetext);
                }

                if (this.helptimer) {
                    clearTimeout(this.helptimer);
                    if (this.helpbutton) {
                        this.helpbutton.closeTooltip();
                    }
                }
                if ((this.mute) && (this.label)) {
                    this.input.setAttribute('placeholder', '');
                }
                this.container.classList.remove('active');
                this.validate();

                if (this.form) { this.form.validate(); }

            }

            if ((this.focusout) && (typeof this.focusout === 'function')) {
                this.focusout(e, me);
            }
        });
        this.input.value = this.config.value;

        if (this.required) {
            this.input.setAttribute('required', 'true');
            if ((this.hascontainer) && (this.label)) {
                this.labelobj.setAttribute('data-required-text', `${this.requiredtext}`);
            }
        }

        CFBUtils.applyDataAttributes(this.attributes, this.input);
        CFBUtils.applyDataAttributes(this.dataattributes, this.input);

        if (this.mute) {
            this.input.classList.add('mute');
        }

        if (this.hidden) { this.input.setAttribute('hidden', 'hidden'); }
        if (this.disabled) { this.disable(); }

        if (this.icon) { this.input.classList.add(`cfb-${this.icon}`); }

    }

    /**
     * Builds the input's DOM.
     */
    buildLabel() {


        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.setAttribute('id', `${this.id}-label`);
        this.labelobj.innerHTML = this.label;

        if (this.form) {
            this.labelobj.setAttribute('form', this.form.id);
        }

        if (this.help) {
            if (this.mute) {
                let s = document.createElement('span');
                s.classList.add('mutehelp');
                s.innerHTML = this.help;
                this.labelobj.appendChild(s);
            } else {
                this.helpbutton = new HelpButton({
                    id: `${this.id}-help`,
                    tooltip: this.help
                });
                this.labelobj.appendChild(this.helpbutton.button);
            }
        }

    }

    /**
     * Build the message box.
     */
    buildMessagebox() {
        this.messagebox = document.createElement('ul');
        this.messagebox.setAttribute('id', `msg-${this.id}`);
        this.messagebox.classList.add('messagebox');
    }

    /**
     * Draws a text counter in the field
     */
    buildCharacterCounter() {
        if (this.counter) {
            this.charactercounter = document.createElement('div');
            this.charactercounter.classList.add('charcounter');
            this.charactercounter.classList.add('topcontrol');
            this.charactercounter.classList.add(this.counter);

            if ((!this.maxlength) || (this.maxlength <= 0)) { this.counter = 'sky'; }

            this.updateCounter();
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get attributes() { return this.config.attributes; }
    set attributes(attributes) { this.config.attributes = attributes; }

    get autocomplete() { return this.config.autocomplete; }
    set autocomplete(autocomplete) { this.config.autocomplete = autocomplete; }

    get charactercounter() {
        if (!this._charactercounter) { this.buildCharacterCounter(); }
        return this._charactercounter;
    }
    set charactercounter(charactercounter) { this._charactercounter = charactercounter; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get counter() { return this.config.counter; }
    set counter(counter) { this.config.counter = counter; }

    get dataattributes() { return this.config.dataattributes; }
    set dataattributes(dataattributes) { this.config.dataattributes = dataattributes; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get helptimer() { return this._helptimer; }
    set helptimer(helptimer) { this._helptimer = helptimer; }

    get messagebox() {
        if (!this._messagebox) { this.buildMessagebox(); }
        return this._messagebox;
    }
    set messagebox(messagebox) { this._messagebox = messagebox; }

    get errors() { return this._errors; }
    set errors(errors) { this._errors = errors; }

    get focusin() { return this.config.focusin; }
    set focusin(focusin) {
        if (typeof focusin !== 'function') {
            console.error("Action provided for focusin is not a function!");
        }
        this.config.focusin = focusin;
    }

    get focusout() { return this.config.focusout; }
    set focusout(focusout) {
        if (typeof focusout !== 'function') {
            console.error("Action provided for focusout is not a function!");
        }
        this.config.focusout = focusout;
    }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get forceconstraints() { return this.config.forceconstraints; }
    set forceconstraints(forceconstraints) { this.config.forceconstraints = forceconstraints; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helpbutton() { return this._helpbutton; }
    set helpbutton(helpbutton) { this._helpbutton = helpbutton; }

    get helpwaittime() { return this.config.helpwaittime; }
    set helpwaittime(helpwaittime) { this.config.helpwaittime = helpwaittime; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get input() {
        if (!this._input) { this.buildInput(); }
        return this._input;
    }
    set input(input) { this._input = input; }

    get label() { return this.config.label; }
    set label(label) { this.config.label = label; }

    get labelobj() {
        if (!this._labelobj) { this.buildLabel(); }
        return this._labelobj;
    }
    set labelobj(labelobj) { this._labelobj = labelobj; }

    get maxlength() { return this.config.maxlength; }
    set maxlength(maxlength) { this.config.maxlength = maxlength; }

    get minimal() { return this.config.minimal; }
    set minimal(minimal) { this.config.minimal = minimal; }

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get onchange() { return this.config.onchange; }
    set onchange(onchange) {
        if (typeof onchange !== 'function') {
            console.error("Action provided for onchange is not a function!");
        }
        this.config.onchange = onchange;
    }

    get onkeydown() { return this.config.onkeydown; }
    set onkeydown(onkeydown) {
        if (typeof onkeydown !== 'function') {
            console.error("Action provided for onkeydown is not a function!");
        }
        this.config.onkeydown = onkeydown;
    }

    get onkeyup() { return this.config.onkeyup; }
    set onkeyup(onkeyup) {
        if (typeof onkeyup !== 'function') {
            console.error("Action provided for onkeyup is not a function!");
        }
        this.config.onkeyup = onkeyup;
    }

    get onreturn() { return this.config.onreturn; }
    set onreturn(onreturn) {
        if (typeof onreturn !== 'function') {
            console.error("Action provided for onreturn is not a function!");
        }
        this.config.onreturn = onreturn;
    }

    get ontab() { return this.config.ontab; }
    set ontab(ontab) {
        if (typeof ontab !== 'function') {
            console.error("Action provided for ontab is not a function!");
        }
        this.config.ontab = ontab;
    }

    get origval() { return this.config.origval; }
    set origval(origval) { this.config.origval = origval; }

    get passive() { return this.config.passive; }
    set passive(passive) { this.config.passive = passive; }

    get passivebox() {
        if (!this._passivebox) { this.buildInactiveBox(); }
        return this._passivebox;
    }
    set passivebox(passivebox) { this._passivebox = passivebox; }

    get pattern() { return this.config.pattern; }
    set pattern(pattern) { this.config.pattern = pattern; }

    get placeholder() {
        if (this.config.placeholder) return this.config.placeholder;
        return this.calculatePlaceholder();
    }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

    get preamble() { return this.config.preamble; }
    set preamble(preamble) { this.config.preamble = preamble; }

    get renderer() { return this.config.renderer; }
    set renderer(renderer) {
        if (typeof renderer !== 'function') {
            console.error("Value provided to renderer is not a function!");
        }
        this.config.renderer = renderer;
    }

    get required() { return this.config.required; }
    set required(required) { this.config.required = required; }

    get requirederror() { return this.config.requirederror; }
    set requirederror(requirederror) { this.config.requirederror = requirederror; }

    get requiredtext() { return this.config.requiredtext; }
    set requiredtext(requiredtext) { this.config.requiredtext = requiredtext; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get topline() { return this._topline; }
    set topline(topline) { this._topline = topline; }

    get touched() { return this._touched; }
    set touched(touched) { this._touched = touched; }

    get type() { return this.config.type; }
    set type(type) { this.config.type = type; }

    get unsettext() { return this.config.unsettext; }
    set unsettext(unsettext) { this.config.unsettext = unsettext; }

    get unselectedtext() { return this.config.unselectedtext; }
    set unselectedtext(unselectedtext) { this.config.unselectedtext = unselectedtext; }

    get validator() { return this.config.validator; }
    set validator(validator) { this.config.validator = validator; }

    get value() { return this.input.value; }
    set value(value) {
        this.config.value = value;
        this.input.value = value;
        this.passivebox.value = value;
        this.validate();
    }

    get warnings() { return this._warnings; }
    set warnings(warnings) { this._warnings = warnings; }

}
window.InputElement = InputElement;
class TextInput extends InputElement {
    constructor(config) {
        if (!config) { config = {}; }
        if (!config.type) { config.type = "text"; }
        super(config);
    }
}
window.TextInput = TextInput;
class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            combobox: false,
            placeholder: TextFactory.get('selectmenu-placeholder-default'),
            unselectedtext: null, // If present, allow for a deselect and use this text.
            icon: "chevron-down",
            prefix: null,   // a prefix to display in the trigger box.
            value: null,    // Use this to set the value of the item
            options: [],    // Array of option dictionary objects.  Printed in order given.
                            // { label: "Label to show", value: "v", checked: true }
            onchange: null  // The change handler. Passed (self).
        };
    }

    static get DOCUMENTATION() {
        return {
            combobox: { type: 'option', datatype: 'boolean', description: "If true, treat the SelectMenu as combobox" },
            unselectedtext: { type: 'option', datatype: 'string', description: "If present, allow for a deselect and use this text for the 'unselect' value." },
            placeholder: { type: 'option', datatype: 'string', description: "Input placeholder. Individual fields can calculate this if it's null. To insure a blank placeholder, set the value to ''." },
            icon: { type: 'option', datatype: 'string', description: "Use to define a specific icon, used in some specific controls." },
            prefix: { type: 'option', datatype: 'string', description: "A prefix to display in the trigger box." },
            value: { type: 'option', datatype: 'string', description: "Value to use for the element. This is the option value not the option label" },
            options: { type: 'option', datatype: 'array', description: "Array of option dictionaries. { label: 'Label to show', value: 'value_to_save', checked: false }" },
            onchange: { type: 'option', datatype: 'function', description: "The change handler. Passed (self)." }
        };
    }

    /**
     * Close open menus
     */
    static closeOpen() {
        if (SelectMenu.activeMenu) {
            SelectMenu.activeMenu.close();
        }
    }

    /**
     * Define the SelectMenu
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, SelectMenu.DEFAULT_CONFIG, config);
        if (!config.name) {
            config.name = `sel-name-${CFBUtils.getUniqueKey(5)}`;
        }
        super(config);
        if (config.value) {
            this.origval = config.value;
        }
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the button is open
     * @return boolean true if it is!
     */
    get isopen() {
        return (this.wrapper.getAttribute('aria-expanded') === 'true');
    }

    /**
     * Return the selected radio input.
     * @return {HTMLElement}
     */
    get selected() {
        let sel = this.optionlist.querySelector(`input[name=${this.name}]:checked`);
        if (sel) { return sel; }
        return null;
    }

    get value() {
        if (!this.selected) { return null; }
        return this.selected.value;
    }

    set value(value) {
        this.config.value = value;
        this.triggerbox.value = value;
        this.passivebox.value = value;
    }

    get passivetext() {
        let p = this.unsettext;
        if (this.selectedoption) { p = this.selectedoption.label; }
        if (this.value) { p = this.value; }
        if (this.config.value) { p = this.config.value; }
        return document.createTextNode(p);
    }

    drawPayload(def) {
        let text = document.createElement('span');
        text.classList.add('text');
        text.innerHTML = def.label;
        return text;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Scroll to a specific element in the list
     * @param element the element to scroll to
     */
    scrollto(element) {
        if (!element) return;
        if ((this.scrolleditem) && (element.getAttribute('id') === this.scrolleditem.getAttribute('id'))) {
            return; // this is us, don't reflow.
        }
        this.optionlist.scrollTop = element.offsetHeight;
        this.scrolleditem = element;
    }

    /**
     * Scroll the select to the selected element and optionally set focus there
     * @param andfocus if true, focus on the element.
     */
    jumptoSelected(andfocus) {
        let sel = this.optionlist.querySelector('li[aria-selected="true"]');
        if (!sel) {
            sel = this.optionlist.querySelector('li:first-child');
        }
        if (sel) {
            this.scrollto(sel);
            if (andfocus) {
                sel.focus();
            }
        }
    }

    /**
     * Opens the option list.
     */
    open() {


        SelectMenu.closeOpen(); // close open menus

        document.body.appendChild(this.listbox);

        this.listbox.removeAttribute('aria-hidden');
        this.wrapper.setAttribute('aria-expanded', true);
        this.container.setAttribute('aria-expanded', true);

        for (let li of Array.from(this.optionlist.querySelectorAll('li'))) {
            li.setAttribute('tabindex', '0');
        }

        if (typeof SelectMenu.activeMenu === 'undefined' ) {
            SelectMenu.activeMenu = this;
        } else {
            SelectMenu.activeMenu = this;
        }

        //window.addEventListener('scroll', this.setPosition, true);
        let x = window.scrollX,
            y = window.scrollY;
        window.onscroll = () => { window.scrollTo(x, y); };

        this.setPosition();

        setTimeout(() => { // Set this after, or else we'll get bouncing.
            this.setCloseListener();
        }, 100);
    }

    /**
     * Set the position of the open menu on the screen
     */
    setPosition() {
        if (!SelectMenu.activeMenu) { return; }

        let self = SelectMenu.activeMenu,
            bodyRect = document.body.getBoundingClientRect(),
            elemRect = self.triggerbox.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top,
            sumHeight = self.triggerbox.clientHeight + self.optionlist.clientHeight;

        self.listbox.style.left = `${offsetLeft}px`;
        self.listbox.style.width = `${self.container.clientWidth}px`;

        if ((elemRect.top + sumHeight) > window.innerHeight) {
            self.listbox.classList.add('vert');
            self.listbox.style.top = `${(offsetTop - self.optionlist.clientHeight)}px`;
            self.listbox.style.bottom = `${offsetTop}px`;
        } else {
            self.listbox.classList.remove('vert');
            self.listbox.style.top = `${(offsetTop + self.triggerbox.clientHeight)}px`;
        }
    }

    /**
     * Closes the option list.
     */
    close() {
        //window.removeEventListener('scroll', this.setPosition, true);
        window.onscroll=() => {};

        this.listbox.style.top = null;
        this.listbox.style.bottom = null;
        this.listbox.style.left = null;
        this.listbox.style.width = null;

        this.listbox.setAttribute('aria-hidden', 'true');
        this.listbox.setAttribute('tabindex', '-1');
        this.wrapper.setAttribute('aria-expanded', false);
        this.container.setAttribute('aria-expanded', false);

        for (let li of Array.from(this.optionlist.querySelectorAll('li'))) {
            li.setAttribute('tabindex', '-1');
        }

        this.container.appendChild(this.listbox);
        SelectMenu.activeMenu = null;
    }

    disable() {
        this.triggerbox.setAttribute('disabled', 'disabled');
        this.wrapper.removeAttribute('aria-expanded');
        this.disabled = true;
        if (this.triggerbox) { this.triggerbox.classList.add('disabled'); }
        if (this.container) { this.container.classList.add('disabled'); }
    }

    enable() {
        this.triggerbox.removeAttribute('disabled');
        this.disabled = false;
        if (this.triggerbox) { this.triggerbox.classList.remove('disabled'); }
        if (this.container) { this.container.classList.remove('disabled'); }
    }

    pacify() {
        this.container.classList.add('passive');
        this.optionlist.setAttribute('aria-hidden', true);
        this.passive = true;
    }

    activate() {
        this.container.classList.remove('passive');
        this.optionlist.removeAttribute('aria-hidden');
        this.passive = false;
    }

    /**
     * Select a specific entry, given a value
     * @param value the value to select
     */
    select(value) {
        let allopts = this.listbox.querySelectorAll('li');
        for (let o of allopts) {
            let radio = o.querySelector(`input[name=${this.name}`);
            if (o.getAttribute('data-value') === value) {
                o.setAttribute('aria-selected', true);
                radio.checked = true;
            } else {
                o.removeAttribute('aria-selected');
                radio.checked = false;
            }
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('select-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.labelobj) { this.container.appendChild(this.labelobj); }

        this.topline = document.createElement('div');
        this.topline.classList.add('topline');
        if (this.label) { this.topline.appendChild(this.labelobj); }
        this.container.appendChild(this.topline);

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrap');
        this.wrapper.setAttribute('role', 'combobox');
        this.wrapper.setAttribute('aria-haspopup', 'listbox');
        this.wrapper.setAttribute('aria-expanded', false);
        this.wrapper.setAttribute('aria-owns', `${this.id}-options`);
        if (this.icon) { this.wrapper.classList.add(`cfb-${this.icon}`); }
        this.wrapper.appendChild(this.triggerbox);

        this.container.appendChild(this.wrapper);

        this.listbox = document.createElement('div');
        this.listbox.setAttribute('id', `${this.id}-options`);
        this.listbox.setAttribute('aria-hidden', 'true');
        this.listbox.setAttribute('role', 'listbox');
        this.listbox.classList.add('selectmenu-menu');
        this.listbox.appendChild(this.optionlist);

        CFBUtils.applyDataAttributes(this.attributes, this.listbox);

        this.container.appendChild(this.listbox);

        if (!this.minimal) {
            this.container.appendChild(this.passivebox);
            this.container.appendChild(this.messagebox);
        }
        if (this.minimal) { this.container.classList.add('minimal'); }

        if (this.value) {
            this.select(this.value);
        }

        this.postContainerScrub();
    }

    /**
     * Builds the trigger box for the select.
     */
    buildTriggerBox() {

        this.triggerbox = document.createElement('input');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('type', 'text');
        this.triggerbox.setAttribute('tabindex', '0');
        this.triggerbox.setAttribute('aria-autocomplete', 'none');
        this.triggerbox.setAttribute('aria-activedescendant', '');
        this.triggerbox.setAttribute('placeholder', this.placeholder);

        this.triggerbox.addEventListener('focusin', (e) => {
            if (this.disabled) {
                e.stopPropagation();
                return;
            }
            this.triggerbox.select(); // Select all the text
            this.open();
        });

        this.triggerbox.addEventListener('keyup', (e) => {
            if ((e.shiftKey) && (e.key === 'Tab')) {  // Shift + Tab
                this.close();
            } else {
                switch (e.key) {
                    case 'Enter':
                    case 'Shift':
                    case 'Control':
                    case 'Alt':
                    case 'CapsLock':
                    case 'NumLock':
                    case 'ScrollLock':
                    case 'End':
                    case 'Home':
                    case 'Meta':
                    case 'PageUp':
                        // Nothing.
                        break;
                    case 'Tab':  // Tab
                    case 'Escape': // Escape
                    case 'ArrowUp': // Up
                        this.close();
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        this.open();
                        this.jumptoSelected(true);
                        break;
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        this.updateSearch();
                        break;
                    case ' ': // space
                    default:
                        this.updateSearch();
                        break;
                }
            }
        });

        if (this.mute) { this.triggerbox.classList.add('mute'); }
    }

    buildOptions() {

        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('selectmenu');
        this.optionlist.setAttribute('id', this.id);
        this.optionlist.setAttribute('tabindex', '-1');

        let order = 0;
        if (this.unselectedtext) {
            let unsel = {
                label: this.unselectedtext,
                value: '',
                unselectoption: true
            };
            if (!this.value) {
                unsel.checked = true;
                this.selectedoption = unsel;
            }
            this.options.unshift(unsel);
        }

        for (let opt of this.options) {
            if ((this.origval) && (this.origval === opt.value)) {
                opt.checked = true;
                this.selectedoption = opt;
            } else {
                delete opt.checked;
            }

            this.optionlist.appendChild(this.buildOption(opt, order++));
        }
    }

    buildOption(def, order) {


        const lId = `${this.id}-${CFBUtils.getUniqueKey(5)}`;
        let next = order + 1,
            previous = order - 1;
        if (this.unselectedtext) {
            if (previous < 0) { previous = 0; }
        } else {
            if (previous < 1) { previous = 1; }
        }
        if (next > this.options.length) { next = this.options.length; }

        let opt = document.createElement('input');
        opt.setAttribute('type', 'radio');
        opt.setAttribute('name', this.name);
        opt.value = def.value;
        if (def.checked) {
            opt.checked = true;
        }

        let li = document.createElement('li');
        li.setAttribute('tabindex', '-1');
        li.setAttribute('id', `li-${lId}`);
        li.setAttribute('data-menuorder', order);
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', def.value);

        li.appendChild(opt);

        li.addEventListener('keydown', (e) => {
            if ((e.shiftKey) && (e.key === 'Escape')) {  // Shift + Tab
                this.close();
            } else {
                switch (e.key) {
                    case 'Shift':
                    case 'Control':
                    case 'Alt':
                    case 'CapsLock':
                    case 'NumLock':
                    case 'ScrollLock':
                    case 'End':
                    case 'Home':
                    case 'Meta':
                    case 'PageUp':
                        // Nothing.
                        break;
                    case 'Tab':  // Tab
                    case 'Escape': // Escape
                    case 'ArrowUp': // Up
                        e.preventDefault();
                        this.optionlist.querySelector(`[data-menuorder='${previous}']`).focus();
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        this.optionlist.querySelector(`[data-menuorder='${next}']`).focus();
                        break;
                    case 'Enter':
                        li.click(); // click the one inside
                        break;
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        this.triggerbox.value = this.triggerbox.value.substring(0, this.value.length - 1);
                        this.updateSearch();
                        break;
                    case ' ': // space
                    default:
                        e.preventDefault();
                        this.triggerbox.value = this.triggerbox.value + e.key;
                        this.updateSearch();
                        break;
                }
            }

        });

        li.addEventListener('click', () => {
            let listentries = this.optionlist.querySelectorAll('li');
            for (let le of listentries) {
                le.removeAttribute('aria-selected');
                let opt = le.querySelector(`input[name=${this.name}]`);
                if (opt) { opt.removeAttribute('checked') ; }
            }
            li.setAttribute('aria-selected', 'true');
            li.querySelector(`input[name=${this.name}]`).checked = true;

            if (def.unselectoption) {
                this.triggerbox.value = '';
            } else if (this.prefix) {
                this.triggerbox.value = `${this.prefix} ${def.label}`;
            } else {
                this.triggerbox.value = def.label;
            }

            this.selectedoption = def;

            if (def.unselectoption) {
                this.passivebox.innerHTML = this.unsettext;
            } else {
                this.passivebox.innerHTML = def.label;
            }

            this.close();

            this.validate();

            if (this.form) { this.form.validate(); }

            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(me);
            }
        });

        li.appendChild(this.drawPayload(def));

        if (def.checked) {
            this.origval = def.value;
            if (def.unselectoption) {
                this.triggerbox.value = '';
            } else if (this.prefix) {
                this.triggerbox.value = `${this.prefix} ${def.label}`;
            } else {
                this.triggerbox.value = def.label;
            }
            li.setAttribute('aria-selected', 'true');
        }

        return li;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Search the list of options and scroll to it
     * @param s the string to search
     */
    findByString(s) {
        if ((!s) || (typeof s !== 'string')) { return; }
        for (let li of this.optionlist.querySelectorAll('li')) {
            let optiontext = li.querySelector('span.text').innerHTML.toUpperCase();
            if (optiontext.indexOf(s.toUpperCase()) !== -1) {
                this.scrollto(li);
                li.focus();
                break;
            }
        }
    }

    /**
     * Updates the counter
     */
    updateSearch() {
        this.findByString(this.triggerbox.value);
    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { this.close(); }
        }, { once: true });

        window.addEventListener('click', (e) => {
            if ((this.wrapper.contains(e.target)) || (this.listbox.contains(e.target))) {
                this.setCloseListener();
            } else {
                this.close();
            }
        }, { once: true });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get combobox() { return this.config.combobox; }
    set combobox(combobox) { this.config.combobox = combobox; }

    get listbox() { return this._listbox; }
    set listbox(listbox) { this._listbox = listbox; }

    get optionlist() {
        if (!this._optionlist) { this.buildOptions(); }
        return this._optionlist;
    }
    set optionlist(optionlist) { this._optionlist = optionlist; }

    get options() { return this.config.options; }
    set options(options) { this.config.options = options; }

    get prefix() { return this.config.prefix; }
    set prefix(prefix) { this.config.prefix = prefix; }

    get selectedoption() { return this._selectedoption; }
    set selectedoption(selectedoption) { this._selectedoption = selectedoption; }

    get scrolleditem() { return this._scrolleditem; }
    set scrolleditem(scrolleditem) { this._scrolleditem = scrolleditem; }

    get triggerbox() {
        if (!this._triggerbox) { this.buildTriggerBox(); }
        return this._triggerbox;
    }
    set triggerbox(triggerbox) { this._triggerbox = triggerbox; }

    get wrapper() { return this._wrapper; }
    set wrapper(wrapper) { this._wrapper = wrapper; }

}
window.SelectMenu = SelectMenu;
class BooleanToggle {

    static get DEFAULT_CONFIG() {
        return {
            id : null,
            attributes: null,
            name: null,
            form: null,
            label: null,
            checked: false, // Initial state.
            classes: [], // Extra css classes to apply
            disabled: false, // If true, make the checkbox disabled.
            labelside: 'right', // Which side to put the label on.
            style: null, // Default to box
            onchange: null, // The change handler. Passed (self).
            validator: null, // A function to run to test validity. Passed the self; returns true or false.,
            value: null, // the value of the checkbox
            renderer: (data) => { // A function that can be used to format the in the field in passive mode.
                return `${data}`;
            }
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The button object will have this as it's id." },
            dataattributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with data-$key = value on elements." },
            attributes: { type: 'option', datatype: 'dictionary', description: "A dictionary, key: value, which will end up with $key = value on elements." },
            form: { type: 'option', datatype: 'simpleform', description: "A SimpleForm object this element this is in." },
            arialabel: { type: 'option', datatype: 'string', description: "The aria-label attribute." },
            name: { type: 'option', datatype: 'string', description: "The name attribute for the input element." },
            label: { type: 'option', datatype: 'string', description: "Input label. If null, no label will be shown." },
            title: { type: 'option', datatype: 'string', description: "The title attribute for the element. Not recommended to be used." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            disabled: { type: 'option', datatype: 'boolean', description: "If true, disable the field." },
            onchange: { type: 'option', datatype: 'function', description: "The change handler. Passed (self)." },
            validator: { type: 'option', datatype: 'function', description: "A function to run to test validity. Passed the self as arguments." },
            renderer: { type: 'option', datatype: 'function', description: "A function that can be used to format the in the field in passive mode." },
            value: { type: 'option', datatype: 'string', description: "Value to use for the element." },
            checked: { type: 'option', datatype: 'boolean', description: "Should the toggle be checked or not" },
            labelside: { type: 'option', datatype: 'string', description: "Which side to put the label on." },
            style: { type: 'option', datatype: 'enumeration', description: "The style of the toggle. Options are: square, circle, toggle, and switch. Null means a standard checkbox style" },
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, BooleanToggle.DEFAULT_CONFIG, config);
        
        if ((!this.arialabel) && (this.label)) { // munch aria label.
            this.arialabel = this.label;
        }

        if (!this.id) { this.id = `check-${CFBUtils.getUniqueKey(5)}`; }
        if (!this.name) { this.name = this.id; }
        this.origval = this.checked;
    }

    /**
     * Returns the raw element, without any container
     * @return {*} the element.
     */
    get naked() { return this.toggle; }

    get touched() {
        return this.checked !== this.origval;
    }

    /* STATE METHODS____________________________________________________________________ */

    /**
     * Runs validation and returns true or false, depending.
     * @return {boolean}
     */
    validate() {
        let valid = true;
        if ((this.validator) && (typeof this.validator === 'function')) {
            valid = this.validator(this);
        }
        return valid;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('checkbox-container');

        if (this.hidden) { this.container.style.display = 'none'; }
        if (this.disabled) { this.container.classList.add('disabled'); }

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.labelside === 'left') {
            this.container.classList.add('leftside');
            this.container.appendChild(this.labelobj);
            this.container.appendChild(this.toggle);
        } else {
            this.container.appendChild(this.toggle);
            this.container.appendChild(this.labelobj);
        }
    }

    /**
     * Builds the DOM.
     */
    build() {

        this.toggle = document.createElement('input');
        this.toggle.setAttribute('type', "checkbox");
        this.toggle.setAttribute('id', this.id);
        this.toggle.setAttribute('name', this.name);
        this.toggle.setAttribute('tabindex', '0'); // always 0
        this.toggle.setAttribute('role', 'checkbox');
        this.toggle.setAttribute('value', this.value);
        this.toggle.classList.add(this.style);

        for (let c of this.classes) {
            this.toggle.classList.add(c);
        }

        CFBUtils.applyDataAttributes(this.attributes, this.toggle);
        CFBUtils.applyDataAttributes(this.dataattributes, this.input);

        this.toggle.addEventListener('change', () => {
            if (this.toggle.checked) {
                this.toggle.setAttribute('aria-checked','true');
                this.toggle.checked = true;
            } else {
                this.toggle.removeAttribute('aria-checked');
                this.toggle.checked = false;
            }
            this.checked = this.toggle.checked;

            if (this.form) { this.form.validate(); }

            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(me);
            }
        });

        if (this.disabled) { this.disable(); }
        if (this.hidden) { this.toggle.setAttribute('hidden', 'true'); }

        if (this.checked) {
            this.toggle.checked = true;
            this.toggle.setAttribute('aria-checked', 'true');
        }
    }

    /**
     * Builds the input's DOM.
     */
    buildLabel() {
        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.innerHTML = this.label;

        if (this.form) {
            this.labelobj.setAttribute('form', this.form.id);
        }
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the toggle
     */
    disable() {
        this.toggle.setAttribute('disabled', 'disabled');
        this.disabled = true;
        if (this.container) { this.container.classList.add('disabled'); }
    }

    /**
     * Disable the toggle
     */
    enable() {
        this.toggle.removeAttr('disabled');
        this.disabled = false;
        if (this.container) { this.container.classList.remove('disabled'); }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get attributes() { return this.config.attributes; }
    set attributes(attributes) { this.config.attributes = attributes; }

    get checked() { return this.config.checked; }
    set checked(checked) { this.config.checked = checked; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get dataattributes() { return this.config.dataattributes; }
    set dataattributes(dataattributes) { this.config.dataattributes = dataattributes; }

    get disabled() { return this.config.disabled; }
    set disabled(disabled) { this.config.disabled = disabled; }

    get form() { return this.config.form; }
    set form(form) { this.config.form = form; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get label() { return this.config.label; }
    set label(label) { this.config.label = label; }

    get labelobj() {
        if (!this._labelobj) { this.buildLabel(); }
        return this._labelobj;
    }
    set labelobj(labelobj) { this._labelobj = labelobj; }

    get labelside() { return this.config.labelside; }
    set labelside(labelside) { this.config.labelside = labelside; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

    get onchange() { return this.config.onchange; }
    set onchange(onchange) {
        if (typeof onchange !== 'function') {
            console.error("Action provided for onchange is not a function!");
        }
        this.config.onchange = onchange;
    }

    get origval() { return this.config.origval; }
    set origval(origval) { this.config.origval = origval; }

    get renderer() { return this.config.renderer; }
    set renderer(renderer) {
        if (typeof renderer !== 'function') {
            console.error("Value provided to renderer is not a function!");
        }
        this.config.renderer = renderer;
    }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

    get toggle() {
        if (!this._toggle) { this.build(); }
        return this._toggle;
    }
    set toggle(toggle) { this._toggle = toggle; }

    get validator() { return this.config.validator; }
    set validator(validator) { this.config.validator = validator; }

    get value() { return this.config.value; }
    set value(value) {
        this.input.attr('value', value);
        this.config.value = value;
    }

}

class DateInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            basetime: '12:00:00',
            timezone: 'GMT',
            type: 'text',
            gravity: 'south',
            triggerarialabel: TextFactory.get('dateinput-trigger-arialabel'),
            forceconstraints: true,
            dateicon: 'calendar'
        };
    }
    static get DOCUMENTATION() {
        return {
            basetime: { type: 'option', datatype: 'string', description: "Time of day to set dates to." },
            timezone: { type: 'option', datatype: 'string', description: "The default timezone to set the datepicker to (unused)." },
            gravity: { type: 'option', datatype: 'string', description: "The direction to open the datepicker when it's clicked open." },
            triggerarialabel: { type: 'option', datatype: 'string', description: "The aria-label for the datepicker trigger button." },
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, enforce that the value is a valid date." },
            dateicon: { type: 'option', datatype: 'string', description: "The icon to use for the datpicker trigger button." }
        };
    }

    /**
     * Tests whether or the value is a valid date.
     * @param date The date to check
     * @returns {boolean} true or false, depending
     */
    static isValid(date) {
        let d = new Date(date);
        return d instanceof Date && !isNaN(d.getTime());
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, DateInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputcontrol() { return this.calbutton; }

    get topcontrol() { return this.datedisplay; }

    /* CORE METHODS_____________________________________________________________________ */

    calculatePlaceholder() {
        return 'YYYY-MM-DD';
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!DateInput.isValid(this.value)) {
                this.errors.push(TextFactory.get('dateinput-error-invalid'));
            }
        }
        this.updateDateDisplay();
    }

    /**
     * Update the upper date display
     */
    updateDateDisplay() {
        if ((!this.value) || (this.value === '')) {
            this.datedisplay.classList.add('hidden');
            this.datedisplay.innerHTML = '';
            return;
        }
        this.datedisplay.classList.remove('hidden');
        let d = new Date(`${this.value} ${this.basetime} GMT`);
        this.datedisplay.innerHTML = d.toUTCString();
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the calendar button and attach the DatePicker
     */
    buildCalendarButton() {

        this.datepicker = new DatePicker({
            classes: ['menu'],
            onselect: (value) => {
                this.value = value;
                this.triggerbutton.close();
                this.input.focus();
                this.validate();
            }
        });
        this.triggerbutton = new ButtonMenu({
            classes: ['naked'],
            shape: 'square',
            gravity: 'n',
            icon: this.dateicon,
            arialabel: this.triggerarialabel,
            menu: this.datepicker.container,
            action: (e, self) => {
                if (self.isopen) {
                    self.close();
                    this.input.focus();
                } else {
                    self.open();
                    this.datepicker.renderMonth(this.value);
                }
                e.stopPropagation();
            },
        });

        this.calbutton = document.createElement('div');
        this.calbutton.classList.add('calbutton');
        this.calbutton.classList.add('inputcontrol');
        this.calbutton.appendChild(this.triggerbutton.button);

        this.calbutton.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevents focus shifting.
        });

    }

    /**
     * Draws the date text display.
     */
    buildDateDisplay() {
        this.datedisplay = document.createElement('div');
        this.datedisplay.classList.add('datedisplay');
        this.datedisplay.classList.add('topcontrol');
        this.updateDateDisplay();
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get basetime() { return this.config.basetime; }
    set basetime(basetime) { this.config.basetime = basetime; }

    get calbutton() {
        if (!this._calbutton) { this.buildCalendarButton(); }
        return this._calbutton;
    }
    set calbutton(calbutton) { this._calbutton = calbutton; }

    get datedisplay() {
        if (!this._datedisplay) { this.buildDateDisplay(); }
        return this._datedisplay;
    }
    set datedisplay(datedisplay) { this._datedisplay = datedisplay; }

    get dateicon() { return this.config.dateicon; }
    set dateicon(dateicon) { this.config.dateicon = dateicon; }

    get datepicker() { return this._datepicker; }
    set datepicker(datepicker) { this._datepicker = datepicker; }

    get gravity() { return this.config.gravity; }
    set gravity(gravity) { this.config.gravity = gravity; }

    get timezone() { return this.config.timezone; }
    set timezone(timezone) { this.config.timezone = timezone; }

    get triggerarialabel() { return this.config.triggerarialabel; }
    set triggerarialabel(triggerarialabel) { this.config.triggerarialabel = triggerarialabel; }

    get triggerbutton() { return this._triggerbutton; }
    set triggerbutton(triggerbutton) { this._triggerbutton = triggerbutton; }

}


class EmailInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            forceconstraints: true,
            pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
        };
    }

    static get DOCUMENTATION() {
        return {
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, enforce that the value is a valid email address." },
            pattern: { type: 'option', datatype: 'string', description: "The input pattern used to force a valid email address." }
        };
    }

    /**
     * Tests whether or not a string is a valid email address.
     * @param email The email address to check
     * @returns {boolean} true or false, depending
     */
    static isValid(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, EmailInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputmode() { return "email"; }

    /* CORE METHODS_____________________________________________________________________ */

    calculatePlaceholder() {
        return TextFactory.get('emailinput-placeholder-default');
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!EmailInput.isValid(this.value)) {
                this.errors.push(TextFactory.get('emailinput-error-invalid_web_address'));
            }
        }
    }

}


class FileInput extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            type: "file",
            icon: "upload",
            accept: 'image/png,image/gif,image/jpg,image/jpeg', // the default accept mime-type
            multiple: false, // Should the file uploader accept multiple files?
            onchange: null // The change handler. Passed (self).
        };
    }

    static get DOCUMENTATION() {
        return {
            icon: { type: 'option', datatype: 'string', description: "The icon to use for the upload trigger." },
            accept: { type: 'option', datatype: 'string', description: "The default accept mime-type value." },
            multiple: { type: 'option', datatype: 'boolean', description: "If true, accept multiple files for upload." }
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, FileInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get value() {
        if (this.selected) { return this.selected.val(); }
        return ''; // Return empty string for no value.
    }

    get topcontrol() { return this.searchdisplay; }

    get passivetext() {
        if (this.selectedoption) { return this.selectedoption.label; }
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    calculatePlaceholder() {
        if (this.multiple) { return TextFactory.get('fileinput-placeholder-multiple'); }
        return TextFactory.get('fileinput-placeholder-file');
    }

    disable() {
        this.triggerbox.setAttribute('disabled', 'disabled');
        this.triggerbox.classList.add('disabled');
        this.container.classList.add('disabled');
        this.disabled = true;
    }

    enable() {
        this.triggerbox.removeAttr('disabled');
        this.triggerbox.classList.remove('disabled');
        this.container.classList.remove('disabled');
        this.disabled = false;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {

        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('file-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        this.container.appendChild(this.labelobj);
        this.container.appendChild(this.fileinput);

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.triggerbox);
        this.container.appendChild(wrap);

        this.container.appendChild(this.messagebox);

        this.postContainerScrub();
    }

    /**
     * Builds the trigger box for the select.
     */
    buildTriggerBox() {

        this.triggerbox = document.createElement('div');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('tabindex', '-1');
        this.triggerbox.innerHTML = this.placeholder;
        this.triggerbox.addEventListener('click', (e) => {
            if (this.disabled) {
                e.stopPropagation();
                return;
            }
            this.labelobj.click();
        });
        this.triggerbox.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Tab':
                    this.triggerbox.blur();
                    break;
                case 'Enter':
                case ' ':
                    this.labelobj.click();
                    break;
                default:
                    break;
            }
        });

        if (this.mute) { this.triggerbox.classList.add('mute'); }

        if (this.icon) { this.triggerbox.classList.add(`cfb-${this.icon}`); }
    }

    /**
     * Build file input
     */
    buildFileInput() {


        this.fileinput = document.createElement('input');
        this.fileinput.setAttribute('type', this.type);
        this.fileinput.setAttribute('name', this.name);
        this.fileinput.setAttribute('id', this.id);
        this.fileinput.setAttribute('accept', this.accept);
        this.fileinput.setAttribute('multiple', this.multiple);
        this.fileinput.setAttribute('aria-labelledby', this.labelobj.id);
        this.fileinput.addEventListener('focusin', () => {
                this.triggerbox.focus();
        });
        this.fileinput.addEventListener('change', (event) => {
            if ((this.fileinput.files) && (this.fileinput.files.length > 0)) {
                let farray =  this.fileinput.files;
                let fnames = [];
                for (let i of farray) {
                    fnames.push(i.name);
                }
                if (fnames.length > 0) {
                    this.triggerbox.classList.add('files');
                    this.triggerbox.innerHTML = fnames.join(', ');
                } else {
                    this.triggerbox.classList.remove('files');
                    this.triggerbox.innerHTML = this.placeholder;
                }
            }
            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(event, me);
            }
        });

        CFBUtils.applyDataAttributes(this.attributes, this.fileinput);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get accept() { return this.config.accept; }
    set accept(accept) { this.config.accept = accept; }

    get fileinput() {
        if (!this._fileinput) { this.buildFileInput(); }
        return this._fileinput;
    }
    set fileinput(fileinput) { this._fileinput = fileinput; }

    get multiple() { return this.config.multiple; }
    set multiple(multiple) { this.config.multiple = multiple; }

    get triggerbox() {
        if (!this._triggerbox) { this.buildTriggerBox(); }
        return this._triggerbox;
    }
    set triggerbox(triggerbox) { this._triggerbox = triggerbox; }

}
window.FileInput = FileInput;
class HiddenField extends TextInput {
    /*
     * HiddenFields should not be used for elements that may become visible at some time.
     */
    constructor(config) {
        if (!config) { config = {}; }
        config.hidden = true;
        config.type = "hidden";
        super(config);
    }

    get container() {
        return this.input;
    }
}
window.HiddenField = HiddenField;
class NumberInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            pattern: '[0-9]*',
            forceconstraints: true,
            minnumber: null,
            maxnumber: null,
            downbuttonarialabel: TextFactory.get('decrement_number'),
            upbuttonarialabel: TextFactory.get('increment_number'),
            wholenumbers: false, // Require whole numbers
            steppers: true,
            step: 1
        };
    }

    static get DOCUMENTATION() {
        return {
            pattern: { type: 'option', datatype: 'string', description: "The input pattern used to force a valid number." },
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, enforce that the value is a valid number." },
            minnumber: { type: 'option', datatype: 'number', description: "The minimum acceptable value." },
            maxnumber: { type: 'option', datatype: 'number', description: "The maximum acceptable value." },
            downbuttonarialabel: { type: 'option', datatype: 'string', description: "The aria-label text for the decrement button" },
            upbuttonarialabel: { type: 'option', datatype: 'string', description: "The aria-label text for the increment button" },
            wholenumbers: { type: 'option', datatype: 'boolean', description: "If true, require whole numbers" },
            steppers: { type: 'option', datatype: 'boolean', description: "If true, show increment and decrement buttons" },
            step: { type: 'option', datatype: 'number', description: "The value that the increment and decrement buttons change the value by" }
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, NumberInput.DEFAULT_CONFIG, config);

        /*
         * Number inputs have a startlingly complicated set of configuration
         */
        if (config.step) {
            if (isNaN(parseFloat(config.step))) {
                console.error(`step is defined as ${config.step} but is not a number. Deleting.`);
                delete config.step;
            } else if (Number(config.step) <= 0) {
                console.error(`step cannot be a negative number. Deleting.`);
                delete config.step;
            } else {
                config.step = Number(config.step);
            }
        }
        if (config.maxnumber) {
            if (isNaN(parseFloat(config.maxnumber))) {
                console.error(`maxnumber is defined as ${config.maxnumber} but is not a number. Deleting.`);
                delete config.maxnumber;
            } else {
                config.maxnumber = Number(config.maxnumber);
            }
        }
        if (config.minnumber) {
            if (isNaN(parseFloat(config.minnumber))) {
                console.error(`minnumber is defined as ${config.minnumber} but is not a number. Deleting.`);
                delete config.maxnumber;
            } else {
                config.minnumber = Number(config.minnumber);
            }
        }

        // Have to take over any keydowns in order to overload the arrow keys.
        if (config.onkeydown) {
            config.origkeydown = config.onkeydown;
        }
        config.onkeydown = (e, self) => {
            switch (e.key) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '.':
                case '*':
                case '%':
                case '$':
                case '-':
                case '!':
                case '#':
                case '+':
                case '=':
                case '>':
                case '<':
                case '?':
                case 'Backspace':
                case 'Delete':
                case 'Enter':
                case 'Tab':
                    // Nothing.  These are characters that could be conceivably used
                    break;
                case 'ArrowUp': // Up
                    e.preventDefault();
                    e.stopPropagation();
                    self.increment();
                    break;
                case 'ArrowDown': // Down
                    e.preventDefault();
                    e.stopPropagation();
                    self.decrement();
                    break;
                default:
                    if (self.forceconstraints) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;
            }

            if ((self.origkeydown) && (typeof self.origkeydown === 'function')) {
                self.origkeydown(e, self);
            }
        };
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputmode() { return "numeric"; }

    get inputcontrol() { return this.stepbuttons; }

    /* CORE METHODS_____________________________________________________________________ */

    localValidator(onload) {
        if (this.value) {
            if (isNaN(this.value)) {
                this.errors.push(TextFactory.get('numberinput-error-nan'));
                return;
            }
            let v = parseFloat(this.value);
            if ((this.minnumber) && (v < this.minnumber)) {
                this.errors.push(TextFactory.get('numberinput-error-minimum_value', this.minnumber));
            } else if ((this.maxnumber) && (v > this.maxnumber)) {
                this.errors.push(TextFactory.get('numberinput-error-maximum_value', this.maxnumber));
            } else if ((this.step) && (v % this.step !== 0)) {
                this.errors.push(TextFactory.get('numberinput-error-values_divisible', this.step));
            } else if ((this.wholenumbers) && (v % 1 > 0)) {
                this.errors.push(TextFactory.get('numberinput-error-must_be_whole_numbers'));
            }
        }
    }

    calculatePlaceholder() {
        let text = TextFactory.get('numberinput-placeholder-basic');
        if ((this.minnumber) && (this.maxnumber)) {
            text = TextFactory.get('numberinput-placeholder-between_x_y', this.minnumber, this.maxnumber);
        } else if (this.minnumber) {
            text = TextFactory.get('numberinput-placeholder-larger_than_x', this.minnumber);
        } else if (this.maxnumber) {
            text = TextFactory.get('numberinput-placeholder-smaller_than_y', this.maxnumber);
        }
        if ((this.step) && (this.step > 1)) {
            text += TextFactory.get('numberinput-placeholder-fragment_increments', this.step);
        }
        return text;
    }

    /**
     * Increment the number
     * @param step the amount to increment by.
     */
    increment(step = 1) {
        if ((!step) || (isNaN(step))) { step = 1; }
        let val = parseFloat(this.value);
        if (!val) { val = 0; }
        if (!isNaN(val)) {
            val += step;
            if ((this.maxnumber) && (val > this.maxnumber)) {
                val = this.maxnumber;
            }
            this.value = val;
        }
    }

    /**
     * Decrement the number
     * @param step the amount to decrement by
     */
    decrement(step=1) {
        if ((!step) || (isNaN(step))) { step = 1; }
        let val = parseFloat(this.value);
        if (!val) { val = 0; }
        if (!isNaN(val)) {
            val -= step;
            if ((this.maxnumber) && (val > this.maxnumber)) {
                val = this.maxnumber;
            }
            this.value = val;
        }

    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the steppers
     */
    buildSteppers() {

        if (this.steppers) {
            this.upbtn = new SimpleButton({
                classes: ['naked'],
                icon: 'triangle-up',
                arialabel: this.upbuttonarialabel,
                notab: true,
                action: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.increment(this.step);
                }
            });
            this.downbtn = new SimpleButton({
                classes: ['naked'],
                icon: 'triangle-down',
                arialabel: this.downbuttonarialabel,
                notab: true,
                action: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.decrement(this.step);
                }
            });
            this.stepbuttons = document.createElement('div');
            this.stepbuttons.classList.add('stepbuttons');
            this.stepbuttons.classList.add('inputcontrol');
            this.stepbuttons.appendChild(this.upbtn.button);
            this.stepbuttons.appendChild(this.downbtn.button);
            this.stepbuttons.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Prevents focus shifting.
            });
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get downbtn() { return this._downbtn; }
    set downbtn(downbtn) { this._downbtn = downbtn; }

    get downbuttonarialabel() { return this.config.downbuttonarialabel; }
    set downbuttonarialabel(downbuttonarialabel) { this.config.downbuttonarialabel = downbuttonarialabel; }

    get maxnumber() { return this.config.maxnumber; }
    set maxnumber(maxnumber) { this.config.maxnumber = maxnumber; }

    get minnumber() { return this.config.minnumber; }
    set minnumber(minnumber) { this.config.minnumber = minnumber; }

    get origkeydown() { return this.config.origkeydown; }
    set origkeydown(origkeydown) { this.config.origkeydown = origkeydown; }

    get step() { return this.config.step; }
    set step(step) { this.config.step = step; }

    get stepbuttons() {
        if (!this._stepbuttons) { this.buildSteppers(); }
        return this._stepbuttons;
    }
    set stepbuttons(stepbuttons) { this._stepbuttons = stepbuttons; }

    get steppers() { return this.config.steppers; }
    set steppers(steppers) { this.config.steppers = steppers; }

    get upbtn() { return this._upbtn; }
    set upbtn(upbtn) { this._upbtn = upbtn; }

    get upbuttonarialabel() { return this.config.upbuttonarialabel; }
    set upbuttonarialabel(upbuttonarialabel) { this.config.upbuttonarialabel = upbuttonarialabel; }

    get wholenumbers() { return this.config.wholenumbers; }
    set wholenumbers(wholenumbers) { this.config.wholenumbers = wholenumbers; }

}
window.NumberInput = NumberInput;
class PasswordInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            minlength: 5,
            suggestedlength: 8,
            maxlength: 250,
            hideicon: 'eye-slash',
            showicon: 'eye',
            obscured: true, // If true, start with password hidden
            forceconstraints: false,
            type: 'password'
        };
    }

    static get DOCUMENTATION() {
        return {
            minlength: { type: 'option', datatype: 'number', description: "The minimum length of a password." },
            suggestedlength: { type: 'option', datatype: 'number', description: "The suggested length for a password." },
            maxlength: { type: 'option', datatype: 'number', description: "The maxlength for the password field." },
            hideicon: { type: 'option', datatype: 'string', description: "The icon to show on the hide/show password control for 'hide'." },
            showicon: { type: 'option', datatype: 'string', description: "The icon to show on the hide/show password control for 'show'." },
            obscured: { type: 'option', datatype: 'boolean', description: "If true, start with password hidden." },
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, enforce that the value meets all other constraints." }
        };
    }

    /**
     * Define the object
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, PasswordInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputcontrol() { return this.visibilitycontrol; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildVisibilityControl() {


        let icon = this.hideicon,
            arialabel = TextFactory.get('hide_password');

        if (this.obscured) {
            icon = this.showicon;
            arialabel = TextFactory.get('show_password');
        }

        this.eyebutton = new SimpleButton({
            classes: ['naked'],
            shape: 'square',
            icon: icon,
            arialabel: arialabel,
            tooltip: TextFactory.get('passwordinput-change_visibility'),
            action: (e, self) => {
                this.toggleVisibility();
                e.stopPropagation();
            },
        });

        this.visibilitycontrol = document.createElement('div');
        this.visibilitycontrol.classList.add('visbutton');
        this.visibilitycontrol.classList.add('inputcontrol');
        this.visibilitycontrol.appendChild(this.eyebutton.button);

        this.visibilitycontrol.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevents focus shifting.
        });

    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Toggle the visibility of the password
     */
    toggleVisibility() {
        if (this.input.getAttribute('type') === 'text') {
            this.setVisibility(false);
        } else {
            this.setVisibility(true);
        }
    }

    /**
     * Set the visibility of the user's password.
     * @param visible if true, make the password visible.
     */
    setVisibility(visible) {
        if (visible) {
            this.obscured = false;
            this.input.setAttribute('type', 'text');
            this.eyebutton.button.setAttribute('aria-label', TextFactory.get('hide_password'));
            this.eyebutton.setIcon(this.hideicon);
        } else {
            this.obscured = true;
            this.input.setAttribute('type', 'password');
            this.eyebutton.button.setAttribute('aria-label', TextFactory.get('show_password'));
            this.eyebutton.setIcon(this.showicon);
        }
        this.input.focus();
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (this.value.length < this.minlength) {
                this.errors.push(TextFactory.get('passwordchanger-error-minlength', this.minlength));
            } else if (this.value.length < this.suggestedlength) {
                this.errors.push(TextFactory.get('passwordchanger-error-suggestedlength', this.suggestedlength));
            } else if (this.value.length > this.maxlength) {
                this.errors.push(TextFactory.get('passwordchanger-error-maxlength', this.maxlength));
            }
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get eyebutton() { return this._eyebutton; }
    set eyebutton(eyebutton) { this._eyebutton = eyebutton; }

    get minlength() { return this.config.minlength; }
    set minlength(minlength) { this.config.minlength = minlength; }

    get hideicon() { return this.config.hideicon; }
    set hideicon(hideicon) { this.config.hideicon = hideicon; }

    get obscured() { return this.config.obscured; }
    set obscured(obscured) { this.config.obscured = obscured; }

    get showicon() { return this.config.showicon; }
    set showicon(showicon) { this.config.showicon = showicon; }

    get suggestedlength() { return this.config.suggestedlength; }
    set suggestedlength(suggestedlength) { this.config.suggestedlength = suggestedlength; }

    get visibilitycontrol() {
        if (!this._visibilitycontrol) { this.buildVisibilityControl(); }
        return this._visibilitycontrol;
    }
    set visibilitycontrol(visibilitycontrol) { this._visibilitycontrol = visibilitycontrol; }


}
window.PasswordInput = PasswordInput;
class RadioGroup extends SelectMenu {

    /**
     * Define the RadioGroup
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, RadioGroup.DEFAULT_CONFIG, config);

        if (!config.id) { // need to generate an id for label stuff
            config.id = `radiogroup-${CFBUtils.getUniqueKey(5)}`;
        }
        if (!config.name) { config.name = config.id; }

        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get input() { return this.optionlist; }

    get passivetext() {
        let p = this.unsettext;
        if (this.selectedoption) { p = this.selectedoption.label; }
        if (this.value) { p = this.value; }
        if (this.config.value) { p = this.config.value; }
        return document.createTextNode(p);
    }

    /* CONTROL METHODS__________________________________________________________________ */

    disable() {
        let radios = this.optionlist.querySelectorAll("input[type='radio']");
        for (let r of radios) {
            r.setAttribute('disabled', 'disabled');
        }
        this.disabled = true;
        if (this.container) { this.container.classList.add('disabled'); }
    }

    enable() {
        let radios = this.optionlist.querySelectorAll("input[type='radio']");
        for (let r of radios) {
            r.removeAttribute('disabled');
        }
        this.disabled = false;
        if (this.container) { this.container.classList.remove('disabled'); }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('radiogroup-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        this.container.appendChild(this.labelobj);
        this.container.appendChild(this.optionlist);
        this.container.appendChild(this.passivebox);

        this.postContainerScrub();

    }

    postContainerScrub() {
        if (this.hidden) { this.container.style.display = 'none'; }

        if (this.required) {
            this.container.classList.add('required');
            this.optionlist.setAttribute('required', 'required');
        }

        if (this.hidden) {
            this.container.style.display = 'none';
            this.container.setAttribute('aria-hidden', 'true');
        }

        if (this.passive) { this.pacify(); }
        if (this.disabled) { this.disable(); }

        if (this.help) {
            this.optionlist.setAttribute('aria-describedby', `${this.id}-help-tt`);
            this.optionlist.setAttribute('aria-labelledby', `${this.id}-label`);
        }
    }

    buildOption(def) {
        const lId = `${this.id}-${CFBUtils.getUniqueKey(5)}`;
        let op = document.createElement('input');
        op.setAttribute('id', lId);
        op.setAttribute('type', 'radio');
        op.setAttribute('name', this.name);
        op.setAttribute('tabindex', '0'); // always 0
        op.setAttribute('value', def.value);
        op.setAttribute('aria-label', def.label);
        op.setAttribute('role', 'radio');
        for (let c of this.classes) {
            op.classList.add(c);
        }
        op.addEventListener('change', () => {
            if (op.checked) {
                op.setAttribute('aria-checked', 'true');
            } else {
                op.removeAttribute('aria-checked');
            }

            this.selectedoption = def;
            if (def.label === this.unselectedtext) {
                this.passivebox.innerHTML = this.unsettext;
            } else {
                this.passivebox.innerHTML = def.label;
            }

            this.validate();

            if (this.form) { this.form.validate(); }

            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(this);
            }
        });

        let opLabel = document.createElement('label');
        opLabel.setAttribute('for', lId);
        opLabel.innerHTML = def.label;

        if (def.checked) {
            this.origval = def.value;
            op.checked = true;
            op.setAttribute('aria-checked', 'true');
        }

        let li = document.createElement('li');
        li.classList.add('radio');
        li.appendChild(op);
        li.appendChild(opLabel);
        return li;
    }

    buildOptions() {
        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('radiogroup');
        this.optionlist.setAttribute('tabindex', '-1');

        for (let opt of this.options) {
            let o = this.buildOption(opt);
            if (opt.checked) {
                this.selectedoption = opt;
            }
            this.optionlist.appendChild(o);
        }
    }

}
window.RadioGroup = RadioGroup;
class ColorSelector extends RadioGroup {

    static get DEFAULT_CONFIG() {
        return {
            options: [
                { label: 'Red', value: 'var(--red)' },
                { label: 'Orange', value: 'var(--orange)' },
                { label: 'Yellow', value: 'var(--yellow)' },
                { label: 'Green', value: 'var(--green)' },
                { label: 'Blue', value: 'var(--blue)' },
                { label: 'Dark Blue', value: 'var(--darkblue)' },
                { label: 'Purple', value: 'var(--purple)' },
                { label: 'Black', value: 'var(--black)' },
                { label: 'Tan', value: 'var(--tan)' },
                { label: 'White', value: 'var(--white)' }
            ]
        };
    }



    /**
     * Define the ColorSelecotr
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, ColorSelector.DEFAULT_CONFIG, config);

        if (!config.id) { // need to generate an id for label stuff
            config.id = `colorselector-${CFBUtils.getUniqueKey(5)}`;
        }
        if (!config.name) { config.name = config.id; }

        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get input() { return this.optionlist; }

    get passivetext() {
        let p = this.unsettext;
        if (this.selectedoption) { p = this.selectedoption.label; }
        if (this.value) { p = this.value; }
        if (this.config.value) { p = this.config.value; }
        return document.createTextNode(p);
    }


    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('colorselector-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        this.container.appendChild(this.labelobj);
        this.container.appendChild(this.optionlist);
        this.container.appendChild(this.passivebox);
        this.postContainerScrub();

    }

    buildOption(def) {
        const lId = `${this.id}-${CFBUtils.getUniqueKey(5)}`;
        let li = document.createElement('li'),
            op = document.createElement('input');

        op.setAttribute('id', lId);
        op.setAttribute('type', 'radio');
        op.setAttribute('name', this.name);
        op.setAttribute('tabindex', '0'); // always 0
        op.setAttribute('value', def.value);
        op.setAttribute('aria-label', def.label);
        op.setAttribute('role', 'radio');
        for (let c of this.classes) {
            op.classList.add(c);
        }
        op.addEventListener('change', () => {
            if (op.checked) {
                op.setAttribute('aria-checked', 'true');
                for (let l of this.optionlist.querySelectorAll('li')) {
                    l.removeAttribute('aria-selected');
                }
                li.setAttribute('aria-selected', 'true');
            } else {
                op.removeAttribute('aria-checked');
            }

            this.selectedoption = def;
            if (def.label === this.unselectedtext) {
                this.passivebox.innerHTML = this.unsettext;
            } else {
                this.passivebox.innerHTML = def.label;
            }

            this.validate();

            if (this.form) { this.form.validate(); }

            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(this);
            }
        });

        let swatch = document.createElement('span');
        swatch.classList.add('swatch');
        swatch.style.backgroundColor = def.value;

        let opLabel = document.createElement('label');
        opLabel.setAttribute('for', lId);
        opLabel.appendChild(swatch);
        new ToolTip({
            text: def.label
        }).attach(opLabel);


        let selected = false;
        if ((this.config.value) && (def.value === this.config.value)) {
            selected = true;
        } else if (def.checked) {
            selected = true;
        }
        if (selected) {
            li.setAttribute('aria-selected', "true");
            this.origval = def.value;
            op.checked = true;
            op.setAttribute('aria-checked', 'true');
        }

        li.classList.add('radio');
        li.appendChild(op);
        li.appendChild(opLabel);
        return li;
    }

    buildOptions() {
        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('colorselector');
        this.optionlist.setAttribute('tabindex', '-1');

        for (let opt of this.options) {
            let o = this.buildOption(opt);
            if (opt.checked) {
                this.selectedoption = opt;
            }
            this.optionlist.appendChild(o);
        }
    }

}
window.ColorSelector = ColorSelector;
class TextArea extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            counter: 'sky'
        };
    }

    static get DEFAULT_CONFIG_DOCUMENTATION() {
        return {
            counter: { type: 'option', datatype: 'string', description: "A value for a character counter. Null means 'no counter'. Possible values: null, 'remaining', 'limit', and 'sky'." }
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, TextArea.DEFAULT_CONFIG, config);
        config.type = "textarea";
        super(config);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('textarea-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        this.topline = document.createElement('div');
        this.topline.classList.add('topline');
        if (this.label) { this.topline.appendChild(this.labelobj); }
        if (this.topcontrol) { this.topline.appendChild(this.topcontrol); }
        this.container.appendChild(this.topline);

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.input);
        this.container.appendChild(wrap);

        this.container.appendChild(this.passivebox);
        this.container.appendChild(this.messagebox);

        this.postContainerScrub();

    }

}
window.TextArea = TextArea;
class URIInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            forceconstraints: true
        };
    }
    static get DEFAULT_CONFIG_DOCUMENTATION() {
        return {
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, enforce that the value is a valid web address address." }
        };
    }

    /**
     * Check if the URI is encoded already
     * @param uri the URI to check
     * @returns {boolean}
     */
    static isEncoded(uri) {
        uri = uri || '';
        return uri !== decodeURIComponent(uri);
    }

    /**
     * Tests whether or not a string is a valid URI.
     * @param uri The uri to check
     * @returns {boolean} true or false, depending
     */
    static isValid(uri) {
        return new RegExp(/\w+:(\/?\/?)[^\s]+/).test(uri);
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, URIInput.DEFAULT_CONFIG, config);

        if ((config.value) && (URIInput.isEncoded(config.value))) {
            config.value = decodeURIComponent(config.value); // sometimes the values aren't human readable
        }
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputmode() { return "url"; }

    /* CORE METHODS_____________________________________________________________________ */

    calculatePlaceholder() {
        return TextFactory.get('urlinput-placeholder-default');
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!URIInput.isValid(this.value)) {
                this.errors.push(TextFactory.get('urlinput-error-invalid_web_address'));
            }
        }
    }

}
window.URLInput = URIInput;
class CountryMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('countrymenu_select'),
            options: new CountryCode().options,
            valuesas: 'code' // What to stick in the value for the elements.
                             // "code" or "name".
        };
    }

    /**
     * Define the CountryMenu
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, CountryMenu.DEFAULT_CONFIG, config);
        // { label: "Label to show", value: "v", checked: true }

        if ((config.valuesas) && (config.valuesas === 'name')) {
            config.options = [];
            let countries = new CountryCode().list;
            for (let c of countries) {
                config.options.push({ label: c.name, value: c.name });
            }
        }
        if (config.value) {
            for (let o of config.options) {
                if ((config.value.toUpperCase() === o.value) || (config.value.toUpperCase() === o.label)) {
                    o.checked = true;
                }
            }
        }

        super(config);
    }
}
window.CountryMenu = CountryMenu;
class StateMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('statemenu_select'),
            valuesas: 'code', // What to stick in the value for the elements.
                            // "code" or "name".
            options: new StateProvince().options,
            set: null // Empty, or "US" or "CA". If empty, fills with all states.
        };
    }

    /**
     * Define the StateMenu
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, StateMenu.DEFAULT_CONFIG, config);
        // { label: "Label to show", value: "v", checked: true }

        let states = new StateProvince().set(config.set);
        config.options = [];
        for (let s of states) {
            let d = { label: s.name };
            if ((config.valuesas) && (config.valuesas === 'name')) {
                d.value = s.name;
            } else {
                d.value = s.id;
            }
            if ((config.value) && ((config.value.toUpperCase() === s.id) || (config.value.toUpperCase() === s.name))) {
                d.checked = true;
            }
            config.options.push(d);
        }

        super(config);

    }
}
window.StateMenu = StateMenu;
class TimezoneMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('timezone_select'),
            options: new TimeZoneDefinition().options,
            valuesas: 'offset' // What to stick in the value for the elements.
                               // "offset" or "name".
        };
    }

    /**
     * Define the TimezoneMenu
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, TimezoneMenu.DEFAULT_CONFIG, config);
        super(config);
    }
}
window.TimezoneMenu = TimezoneMenu;