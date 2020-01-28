/*! Cornflower Blue - v0.1.0 - 2020-01-27
* http://www.gaijin.com/cornflowerblue/
* Copyright (c) 2020 Brandon Harris; Licensed MIT */
class Utils {

    /* GENERAL METHODS__________________________________________________________________ */

    /**
     * Get the value of a specific cookie.
     * @param name the name of the cookie
     * @return {string} the value of the cookie
     */
    static getCookie(name) {
        return ('; ' + document.cookie)
            .split('; ' + name + '=')
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
        let keys = Object.keys(obj.config).sort(function(a, b){
            let a1 = a.toLowerCase(),
                b1 = b.toLowerCase();
            if(a1 === b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
        let vlines = [];
        for (let k of keys) {
            if (typeof obj[k] === 'function') {
                vlines.push(`\t ${k} : function(...) { ... }`);
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
        let keys = Object.keys(obj.config).sort(function(a, b){
            let a1 = a.toLowerCase(),
                b1 = b.toLowerCase();
            if(a1 === b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
        let vlines = [];
        for (let k of keys) {
            let line = "";
            if ((k === 'id') || (k === 'name')) {
                line = `    <span class="key">${k}</span> : <span class="value">&lt;string&gt;</span>`;
            } else if (typeof obj[k] === 'function') {
                line = `    <span class="key">${k}</span> : function(...) { ... }`;
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
            if ((Array.isArray(obj[k])) && (Utils.arrayEquals(obj[k], obj.constructor.DEFAULT_CONFIG[k]))) {
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
        a.sort(function(a, b){
            let a1 = a.toLowerCase(),
                b1 = b.toLowerCase();
            if(a1 === b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
        b.sort(function(a, b){
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

    /* MOBILE DETECTION METHODS_________________________________________________________ */

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
            'check-circle-disc',
            'checkmark-circle',
            'chevron-down',
            'checkmark',
            'chevron-left',
            'chevron-right',
            'chevron-up',
            'double-triangle-vertical',
            'chat',
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
            'flag-rectangle-angle'
        ];
    }


    /**
     * Gets an icon defined by cornflower blue
     * @param icon the icon id. This is stacked with the cfb prefix.
     * @param arialabel the aria label to use
     * @return {*|jQuery|*} a jquery <span> class.
     */
    static icon(icon, arialabel) {
        if (icon instanceof Object) { // this is probably a pre-defined icon
            return icon;
        }
        let i = document.createElement('span');
        i.classList.add('icon');
        i.classList.add(`cfb-${icon}`);
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
     * @return {*|jQuery|*} a jquery <span> class.
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

class StateProvince {

    /**
     * A map of states in US and canada
     * @return {*} a dictionary
     */
    static get STATEMAP() {
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
     * Get a specific state by the id
     * @param id the id to get
     * @return {*} the state definition, or null
     */
    static get(id) {
        return StateProvince.STATEMAP[id];
    }

    /**
     * Get a list of state dictionary elements.
     * @param filter Optional, either US or CA. If empty, returns all.
     * @return {Array} an array of state object definitions
     */
    static list(filter) {
        let list = [];
        if ((filter) && (filter.toLowerCase() === 'us')) {
            for (let s of StateProvince.US_STATES) {
                list.push(StateProvince.STATEMAP[s]);
            }
        } else if ((filter) && (filter.toLowerCase() === 'ca')) {
            for (let s of StateProvince.CA_STATES) {
                list.push(StateProvince.STATEMAP[s]);
            }
        } else {
            for (let s of StateProvince.US_STATES) {
                list.push(StateProvince.STATEMAP[s]);
            }
            for (let s of StateProvince.CA_STATES) {
                list.push(StateProvince.STATEMAP[s]);
            }
        }
        return list;
    }

    /**
     * Search the State dictionary
     * @param text the text to search on.
     */
    static search(text) {
        if ((!text) || (text.length() < 1)) { return []; }

        let results = [];

        for (let k of Object.keys(StateProvince.STATEMAP)) {
            let s = StateProvince.STATEMAP[k];
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

}
class SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            submits: false, // If true, force "type='submit'"
            cansubmit: true, // Advertizes to Forms that it can be used to submit them, if submits is true.
                            // This should be on an interface (e.g., SimpleButton implements Submittor)
                            // but Javascript is poor with regards to that.
            text : null, // The text for the button. This is also used as aria-label.
            shape : null, // (null|square|circle|pill) :: Make the button one of these shapes. Otherwise, makes a rectangle
            size : 'medium', // size of the button: micro, small, medium (default), large, fill
            form: null, // A form element this is in
            hidden: false, // Start hidden or not.
            classes: [], //Extra css classes to apply
            icon : null, // If present, will be attached to the text inside the button
                         // This can be passed a jQuery object
            iconside: 'left', // The side the icon displays on
            secondicon : null, // if present, this icon will be placed on the opposite side of the
                                // defined 'iconside'.  If this is the only icon defined, it will
                                // still be placed.  This is ignored in shaped buttons.
            notab: false, // if true, don't be tabindexed.
            disabled: false, // if true, make the button disabled.
            mute: false, //if true, make the button mute.
            ghost: false, //if true, make the button ghost.
            link: false, //if true, make the button behave like a normal link.
            naked: false, //if true, remove all styles from the button.
            action: null, // The click handler. Passed (event, self) as arguments. NOT used if "submits" is true.
            focusin: null, // The focus in handler.  Passed (event, self) as arguments.
            focusout: null, // The focus out handler.  Passed (event, self) as arguments.
            hoverin: null, // The on hover handler.  Passed (event, self) as arguments.
            hoverout: null // The off hover handler.  Passed (event, self) as arguments.
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleButton.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `button-${Utils.getUniqueKey(5)}`; }
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Can this be used to submit a form?
     * Javascript doesn't have great interfaces. This would be on the interface otherwise.
     * Doesn't have a settor.
     * @return {boolean}
     */
    get cansubmit() { return this.config.cansubmit; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the button's DOM.
     * @returns {jQuery} jQuery representation of the SimpleButton
     */
    buildButton() {
        const me = this;

        if (this.text) {
            this.textobj = document.createElement('span');
            this.textobj.classList.add('text');
            this.textobj.innerHTML = this.text;
        }

        this.button = document.createElement('button');
        let icon,
            secondicon;
        if (this.icon) {
            icon = IconFactory.icon(this.icon);
        }
        if (this.secondicon) {
            secondicon = IconFactory.icon(this.secondicon);
            secondicon.classList.add('secondicon');
        }

        // XXX TODO: change to flex order
        if ((this.iconside) && (this.iconside === 'right')) {
            this.button.classList.add('righticon');
        }
        if (icon) {
            this.button.appendChild(icon);
        }
        if (this.textobj) {
            this.button.appendChild(this.textobj);
        }
        if (secondicon) {
            this.button.appendChild(secondicon);
        }

        this.button.setAttribute('aria-label', this.text);
        this.button.setAttribute('id', this.id);
        this.button.setAttribute('role', 'button');
        this.button.setAttribute('type', (this.submits ? 'submit' : 'button'));
        this.button.classList.add(this.size);

        for (let c of this.classes) {
            this.button.classList.add(c);
        }

        this.button.addEventListener('focusin', function(e) {
            if ((me.focusin) && (typeof me.focusin === 'function')) {
                me.focusin(e, me);
            }
        });
        this.button.addEventListener('focusout', function(e) {
            if ((me.focusout) && (typeof me.focusout === 'function')) {
                me.focusout(e, me);
            }
        });
        this.button.addEventListener('mouseover', function(e) {
            if ((me.hoverin) && (typeof me.hoverin === 'function')) {
                me.hoverin(e, me);
            }
        });
        this.button.addEventListener('mouseout', function(e) {
            if ((me.hoverout) && (typeof me.hoverout === 'function')) {
                me.hoverout(e, me);
            }
        });

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


        if ((!this.submits) && (this.action) && (typeof this.action === 'function')) {
            this.button.addEventListener('click', function (e) {
                if (!me.disabled) {
                    me.action(e, me);
                }
            });
        }
    }

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

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get action() { return this.config.action; }
    set action(action) {
        if (typeof action !== 'function') {
            console.error("Action provided to button is not a function!");
        }
        this.config.action = action;
    }

    get button() {
        if (!this._button) { this.buildButton(); }
        return this._button;
    }
    set button(button) { this._button = button; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() { return this.button; }
    set container(container) { this.button = container; }

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

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get iconside() { return this.config.iconside; }
    set iconside(iconside) { this.config.iconside = iconside; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

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

}

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
class DestructiveButton extends SimpleButton {
    constructor(config) {
        if (config.classes) {
            config.classes.push('destructive');
        } else {
            config.classes = ['destructive', 'foobar'];
        }
        super(config);
    }
}
class ButtonMenu extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            focusin: function(e, self) { self.open(); },    // open on focus
            secondicon: 'triangle-down', // this is passed up as a secondicon
            items: [] // list of menu item definitions
                    // {
                    //    label: "Menu Text", // text
                    //    tooltip: null, // Tooltip text
                    //    icon: null, // Icon to use, if any
                    //    action: function() { } // what to do when the tab is clicked.
                    // }
        };
    }

    constructor(config) {
        config = Object.assign({}, ButtonMenu.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('menu');
        } else {
            config.classes = ['menu'];
        }
        super(config);
        if (!this.menu) { this.buildMenu(); }
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
        const me = this;
        if (this.isopen) { return; }
        this.button.setAttribute('aria-expanded', 'true');
        this.menu.removeAttribute('aria-hidden');
        this.menu.querySelector('li:first-child').focus();

        let items = Array.from(this.menu.querySelector('li'));
        for (let li of items) {
            li.setAttribute('tabindex', '0');
        }

        window.setTimeout(function() { // Set this after, or else we'll get bouncing.
            me.setCloseListener();
        }, 200);
    }

    /**
     * Closes the button
     */
    close() {
        this.button.removeAttribute('aria-expanded');
        this.menu.setAttribute('aria-hidden', 'true');

        let items = Array.from(this.menu.querySelector('li'));
        for (let li of items) {
            li.setAttribute('tabindex', '-1');
        }
    }


    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;
        window.addEventListener('click', function(e) {
            if (e.target === me.menu) {
                me.setCloseListener();
            } else {
                me.close();
            }
        }, {
            once: true,
        });
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the menu.
     * @returns {jQuery} jQuery representation
     */
    buildMenu() {
        const me = this;
        this.menu = document.createElement('ul');
        this.menu.setAttribute('aria-hidden', 'true');
        this.menu.setAttribute('tabindex', '0');
        let order = 1;

        for (let item of this.items) {

            let next = order + 1,
                previous = order - 1;
            if (previous < 1) { previous = 1; }
            if (next > this.items.length) { next = this.items.length; }

            let menuitem = document.createElement('li');
            menuitem.setAttribute('tabindex', '-1');
            menuitem.setAttribute('data-order', order);

            menuitem.addEventListener('keydown', function(e, me, previous, next) {
                if (e.keyCode === 9) { // Tab
                    me.close();
                } else if (e.keyCode === 27) { // Escape
                    me.close();
                } else if (e.keyCode === 38) { // Up arrow
                    e.preventDefault();
                    me.menu.querySelector(`[data-order='${previous}']`).focus();
                } else if (e.keyCode === 40) { // Down arrow
                    e.preventDefault();
                    me.menu.querySelector(`[data-order='${next}']`).focus();
                } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                    me.querySelector('a').click(); // click the one inside
                }
            });

            let anchor = document.createElement('a');
            if (item.icon) {
                anchor.appendChild(IconFactory.icon(item.icon));
            }

            let s = document.createElement('span');
            s.innerHTML = item.label;
            anchor.appendChild(s);

            anchor.addEventListener('click', function(e, me, item) {
                e.preventDefault();
                if ((item.action) && (typeof item.action === 'function')) {
                    item.action(e);
                }
                me.close();
            });

            menuitem.appendChild(anchor);

            this.menu.appendChild(menuitem);

            order++;
        }
        this.button.appendChild(this.menu);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get items() { return this.config.items; }
    set items(items) { this.config.items = items; }

    get menu() { return this._menu; }
    set menu(menu) { this._menu = menu; }

}

class HelpButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: function(e, self) { self.stayopen(); },
            hoverin: function(e, self) { self.open(); },
            hoverout: function(e, self) { self.close(); },
            icon: 'help-circle',
            tipicon: 'help-circle',
            help: null // help text to display
        };
    }

    constructor(config) {
        config = Object.assign({}, HelpButton.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('naked');
            config.classes.push('help');
        } else {
            config.classes = ['naked', 'help'];
        }
        if (!config.id) { // need to generate an id for aria stuff
            config.id = `help-${Utils.getUniqueKey(5)}`;
        }

        super(config);
    }

    /**
     * Force the tooltip to stay open.
     */
    stayopen() {
        this.button.classList.add('stayopen');
        this.open();
    }

    /**
     * Opens the help tooltip
     */
    open() {
        const me = this;
        if (!this.tooltip) { this.buildTooltip(); }
        this.button.setAttribute('aria-expanded', 'true');
        this.tooltip.removeAttribute('aria-hidden');
        setTimeout(function() {
            me.tooltip.style.top = `calc(0px - ${me.tooltip.style.height} - .5em)`;
        },1);
    }

    /**
     * Closes the help tooltip.
     */
    close() {
        if (this.button.classList.contains('stayopen')) { return; }
        this.button.removeAttribute('aria-expanded');
        this.tooltip.setAttribute('aria-hidden', 'true');
    }

    /**
     * Builds the help.
     */
    buildTooltip() {
        const me = this;
        this.tooltip = document.createElement('div');
        this.tooltip.classList.add('tooltip');
        this.tooltip.setAttribute('aria-hidden', 'true');
        this.tooltip.setAttribute('id', this.id);

        if (this.tipicon) {
            let icon = IconFactory.icon(this.tipicon);
            icon.classList.add('tipicon');
            this.tooltip.appendChild(icon);
        }

        this.helptext = document.createElement('div');
        this.helptext.classList.add('helptext');
        this.helptext.setAttribute('id', `${this.id}-tt`);
        this.helptext.innerHTML = this.help;

        this.closebutton = new SimpleButton({
            icon: 'echx',
            text: "Close",
            shape: "square",
            classes: ["naked", "closebutton"],
            action: function(e) {
                e.preventDefault();
                e.stopPropagation();
                me.button.classList.remove('stayopen');
                me.close();
            }
        });

        this.tooltip.appendChild(this.helptext);
        this.tooltip.appendChild(this.closebutton.button);

        this.button.removeAttribute('aria-expanded');
        this.button.appendChild(this.tooltip);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get button() {
        if (!this._button) { this.buildButton(); }
        if (!this.tooltip) { this.buildTooltip(); }
        return this._button;
    }
    set button(button) { this._button = button; }

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helptext() { return this._helptext; }
    set helptext(helptext) { this._helptext = helptext; }

    get tipicon() { return this.config.tipicon; }
    set tipicon(tipicon) { this.config.tipicon = tipicon; }

    get tooltip() { return this._tooltip; }
    set tooltip(tooltip) { this._tooltip = tooltip; }

}



class SkipButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            text: "Skip to Content",
            classes: ['visually-hidden'],
            id: 'content-jump',
            hot: true,
            contentstart: "#content-start",
            focusin: function(e, self) {
                self.button.classList.remove('visually-hidden');
            },
            focusout: function(e, self) {
                self.button.classList.add('visually-hidden');
            },
            action: function(e, self) {
                let url = location.href;
                location.href = self.contentstart;
                history.replaceState(null,null,url);
            }
        };
    }

    constructor(config) {
        config = Object.assign({}, SkipButton.DEFAULT_CONFIG, config);
        super(config);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get contentstart() { return this.config.contentstart; }
    set contentstart(contentstart) { this.config.contentstart = contentstart; }

}

class InputElement {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // Component id
            name: null, // Name attribute
            form: null, // A form element this is in
            counter: null, // A value for a character counter. Null means 'no counter'
            // Possible values: null, 'remaining', 'limit', and 'sky'
            forceconstraints: null, // if true, force constraints defined in sub classes (many inputs don't have any)
            type: 'text', // Type of input, defaults to "text"
            label : null, // Input label. If null, does not show up.
            placeholder: null, // Input placeholder. Individual fields can calculate this if it's null.
                               // To insure a blank placeholder, set the value to ""
            title: null,
            pattern: null,
            icon: null, // Use to define a specific icon, used in some specific controls.


            passive: false, // Start life in "passive" mode.
            unsettext: "(Not Set)", // what to display in passive mode if the value is empty

            help: null, // Help text.
            helpwaittime: 5000, // How long to wait before automatically showing help tooltip
            required: false, // Is this a required field or not
            requiredtext: 'required', // text to display on required items
            requirederror: 'This field is required', // error to display if required item isn't filled.
            hidden: false, // Whether or not to be hidden
            autocomplete: 'off', // Enable browser autocomplete. Default is off.
            arialabel: null, // The aria-label value. If null, follows: label > title > null
            maxlength: null, // Value for maxlength.
            value: '', // Value to use (pre-population).  Used during construction and then discarded.
            disabled: false, // If true, disable the field.
            classes: [], // Extra css classes to apply
            onreturn: null, // action to execute on hitting the return key. Passed (event, self).
            ontab: null, // action to execute on hitting the tab key. Passed (event, self).
            onkeyup: null, // action to execute on key up. Passed (event, self).
            onkeydown: null, // action to execute on key down. Passed (event, self).
            focusin: null, // action to execute on focus in. Passed (event, self).
            focusout: null, // action to execute on focus out. Passed (event, self).
            validator: null // A function to run to test validity. Passed the self.
        };
    }

    /**
     * Define a the input
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, TextInput.DEFAULT_CONFIG, config);

        if (!this.arialabel) { // munch aria label.
            if (this.label) {
                this.arialabel = this.label;
            } else if (this.title) {
                this.arialabel = this.title;
            }
        }

        if (!this.id) { this.id = `e-${Utils.getUniqueKey(5)}`; }

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
            if (this.errors.length > 0) {
                this.input.setAttribute('aria-invalid', 'true');
            } else {
                this.input.removeAttribute('aria-invalid');
            }
        } else {
            this.clearMessages();
            this.input.removeAttribute('aria-invalid');
            if ((this.isDirty()) && (!onload)) { // This has to be valid
                this.container.classList.add('valid');
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
            ctext = `${this.value.length} of ${this.maxlength} characters entered`;
        } else if (this.counter === 'sky') {
            ctext = `${this.value.length} characters entered`;
        } else { // remaining
            ctext = `${(this.maxlength - this.value.length)} characters remaining`;
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
        return null;
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
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds and returns a container object for all parts.
     * This gets over-ridden in elements that have additional structures, like a character counter
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.label) { this.container.appendChild(this.labelobj); }

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.input);
        if (this.inputcontrol) { wrap.appendChild(this.inputcontrol); }
        this.container.appendChild(wrap);

        this.container.appendChild(this.passivebox);
        if (this.topcontrol) { this.container.appendChild(this.topcontrol); }
        this.container.appendChild(this.messagebox);

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
            this.input.setAttribute('aria-described-by', `${this.help.id}-tt`);
            this.input.setAttribute('aria-labeled-by', `label-${this.id}`);
        }

        this.validate(true);
    }

    /**
     * Build the passive text box.
     */
    buildInactiveBox() {
        this.passivebox = document.createElement('div');
        this.passivebox.classList.add('passivebox');
        this.passivebox.innerHTML = this.passivetext;
    }

    /**
     * Builds the input's DOM.
     */
    buildInput() {
        const me = this;

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

        if (this.title) { this.input.setAttribute('title', this.title); }
        if (this.autocomplete) { this.input.setAttribute('autocomplete', this.autocomplete); }
        if (this.placeholder) { this.input.setAttribute('placeholder', this.placeholder); }
        if (this.arialabel) { this.input.setAttribute('aria-label', this.arialabel); }        if (this.pattern) { this.input.setAttribute('pattern', this.pattern); }
        if (this.maxlength) { this.input.setAttribute('maxlength', this.maxlength); }

        for (let c of this.classes) {
            this.input.classList.add(c);
        }
        this.input.addEventListener('keydown', function(e) {
            // Reset this to keep readers from constantly beeping. It will re-validate later.
            me.input.removeAttribute('aria-invalid');
            me.updateCounter();
            me.touched = true; // set self as touched.
            if ((me.onkeydown) && (typeof me.onkeydown === 'function')) {
                me.onkeydown(e, me);
            }
        });
        this.input.addEventListener('keyup', function(e) {
            if (me.helptimer) {
                clearTimeout(me.helptimer);
                me.helpicon.close();
            }

            if ((me.value) && (me.value.length > 0) && (me.container)) {
                me.container.classList.add('filled');
            } else {
                me.container.classList.remove('filled');
            }

            if ((me.form) && (me.required) // If this is the only thing required, tell the form.
                && ((me.input.value.length === 0) || (me.input.value.length === 1))) { // Only these two lengths matter
                if (me.form) { me.form.validate(); }
            }
            if ((e.keyCode === 13) // Return key
                && (me.onreturn) && (typeof me.onreturn === 'function')) {
                e.preventDefault();
                e.stopPropagation();
                me.onreturn(e, me);
            } else if ((me.onkeyup) && (typeof me.onkeyup === 'function')) {
                me.onkeyup(e, me);
            }
        });
        this.input.addEventListener('focusin', function(e) {
            if ((me.mute) && (me.placeholder) && (me.placeholder !== me.label)) {
                me.input.setAttribute('placeholder', me.placeholder);
            }
            if (me.container) {
                me.container.classList.add('active');
            }
            if (me.help) {
                me.helptimer = setTimeout(function() {
                    me.helpicon.open();
                }, me.helpwaittime);
            }
            if ((me.focusin) && (typeof me.focusin === 'function')) {
                me.focusin(e, me);
            }
        });
        this.input.addEventListener('focusout', function(e) {

            me.passivebox.innerHTML = me.passivetext;

            if (me.helptimer) {
                clearTimeout(me.helptimer);
                me.helpicon.close();
            }

            if ((me.mute) && (me.label)) {
                me.input.setAttribute('placeholder', `${me.label} ${me.required ? '(' + me.requiredtext + ')' : ''}`);
            }

            if (me.container) { me.container.classList.remove('active'); }
            me.validate();

            if (me.form) { me.form.validate(); }

            if ((me.focusout) && (typeof me.focusout === 'function')) {
                me.focusout(e, me);
            }
        });
        this.input.value = this.config.value;

        if (this.required) {
            this.input.setAttribute('required', 'true');
            if (this.label) {
                this.labelobj.setAttribute('data-required-text', `${this.requiredtext}`);
            }
        }

        if (this.mute) {
            this.input.classList.add('mute');
            if (this.label) {
                this.input.setAttribute('placeholder', `${this.label} ${this.required ? '(' + this.requiredtext + ')' : ''}`);
            }
        }

        if (this.hidden) { this.input.setAttribute('hidden', 'hidden'); }
        if (this.disabled) { this.disable(); }

        if (this.icon) { this.input.classList.add(`cfb-${this.icon}`); }

    }

    /**
     * Builds the input's DOM.
     */
    buildLabel() {
        const me = this;

        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.setAttribute('id', `label-${this.id}`);
        this.labelobj.innerHTML = this.label;
        this.labelobj.addEventListener('click', function() {
            // XXX JQUERY
            //$('#' + $(this).attr('for')).focus();
        });

        if (this.form) {
            this.labelobj.setAttribute('form', this.form.id);
        }

        if (this.help) {
            this.helpicon = new HelpButton({ help: this.help });
            this.labelobj.appendChild(this.helpicon.button);
            this.labelobj.addEventListener('onmouseover', function() {
                me.helpicon.open();
            });
            this.labelobj.addEventListener('onmouseout', function() {
                me.helpicon.close();
            });
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
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

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

    get helpicon() { return this._helpicon; }
    set helpicon(helpicon) { this._helpicon = helpicon; }

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

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

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

    get required() { return this.config.required; }
    set required(required) { this.config.required = required; }

    get requirederror() { return this.config.requirederror; }
    set requirederror(requirederror) { this.config.requirederror = requirederror; }

    get requiredtext() { return this.config.requiredtext; }
    set requiredtext(requiredtext) { this.config.requiredtext = requiredtext; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

    get touched() { return this._touched; }
    set touched(touched) { this._touched = touched; }

    get type() { return this.config.type; }
    set type(type) { this.config.type = type; }

    get unsettext() { return this.config.unsettext; }
    set unsettext(unsettext) { this.config.unsettext = unsettext; }

    get validator() { return this.config.validator; }
    set validator(validator) { this.config.validator = validator; }

    get value() { return this.input.value; }
    set value(value) {
        this.config.value = value;
        this.input.value = value;
        this.passivebox.value = value;
    }

    get warnings() { return this._warnings; }
    set warnings(warnings) { this._warnings = warnings; }



}
class TextInput extends InputElement {
    constructor(config) {
        config.type = "text";
        super(config);
    }
}

class BooleanToggle {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The button id
            name: null,
            form: null, // A form element this is in
            label: null, // The text for the label.
            checked: false, // Initial state.
            classes: [], // Extra css classes to apply
            disabled: false, // If true, make the checkbox disabled.
            labelside: 'right', // Which side to put the label on.
            style: null, // Default to box
            onchange: null, // The change handler. Passed (event, self).
            validator: null, // A function to run to test validity. Passed the self; returns true or false.,
            value: null // the value of the checkbox
        };
    }

    constructor(config) {
        this.config = Object.assign({}, BooleanToggle.DEFAULT_CONFIG, config);
        
        if ((!this.arialabel) && (this.label)) { // munch aria label.
            this.arialabel = this.label;
        }

        if (!this.id) { this.id = `check-${Utils.getUniqueKey(5)}`; }
        if (!this.name) { this.name = this.id; }
        this.origval = this.checked;
    }

    /**
     * Returns the raw element, without any container
     * @return {*} the element.
     */
    get naked() { return this.toggle; }

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
        this.container.classList.add('checkbox');

        if (this.hidden) { this.container.style.display = 'none'; }
        if (this.disabled) { this.container.classList.add('disabled'); }

        if (this.labelside === 'right') {
            this.container.classList.add('rightside');
            this.container.appendChild(this.toggle);
            this.container.appendChild(this.labelobj);
        } else {
            this.container.appendChild(this.labelobj);
            this.container.appendChild(this.toggle);
        }
    }

    /**
     * Builds the DOM.
     */
    build() {
        const me = this;
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

        this.toggle.addEventListener('change', function() {
            if (me.toggle.checked) {
                me.toggle.setAttribute('aria-checked','true');
                me.toggle.checked = true;
            } else {
                me.toggle.removeAttribute('aria-checked');
                me.toggle.checked = false;
            }
            me.checked = me.toggle.checked;

            if ((me.onchange) && (typeof me.onchange === 'function')) {
                me.onchange(me);
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
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

    get checked() { return this.config.checked; }
    set checked(checked) { this.config.checked = checked; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

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

class NumberInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            //pattern:'[0-9.%+-]$',
            minnumber: null,
            maxnumber: null,
            wholenumbers: false, // Require whole numbers
            steppers: true,
            step: null
        };
    }

    constructor(config) {
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
        config.onkeydown = function(e, self) {
            if (e.keyCode === 38) { // up arrow
                e.preventDefault();
                e.stopPropagation();
                self.increment();
            } else if (e.keyCode === 40) { // down arrow
                e.preventDefault();
                e.stopPropagation();
                self.decrement();
            }
            if ((self.origkeydown) && (typeof self.origkeydown === 'function')) {
                self.origkeydown(e, self);
            }
        };
        if (config.type === 'range') {
            console.log(`type: ${config.type}`);
        }
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputmode() { return "numeric"; }

    get inputcontrol() { return this.stepbuttons; }

    /* CORE METHODS_____________________________________________________________________ */

    localValidator(onload) {
        if (this.value) {
            if (isNaN(this.value)) {
                this.errors.push("This is not a number.");
                return;
            }
            let v = parseFloat(this.value);
            if ((this.minnumber !== 'undefined') && (v < this.minnumber)) {
                this.errors.push(`The minimum value for this field is '${this.minnumber}'.`);
            } else if ((this.maxnumber !== 'undefined') && (v > this.maxnumber)) {
                this.errors.push(`The maximum value for this field is '${this.maxnumber}'.`);
            } else if ((this.step) && (v % this.step !== 0)) {
                this.errors.push(`Values must be divisible by ${this.step}.`);
            } else if ((this.wholenumbers) && (v % 1 > 0)) {
                this.errors.push("Values must be whole numbers.");
            }
        }
    }

    calculatePlaceholder() {
        let text = "Enter a number";
        if ((this.minnumber !== 'undefined') && (this.maxnumber !== 'undefined')) {
            text = `Enter a number between ${this.minnumber} and ${this.maxnumber}`;
        } else if (this.minnumber !== 'undefined') {
            text = `Enter a number larger than ${this.minnumber}`;
        } else if (this.maxnumber !== 'undefined') {
            text = `Enter a number smaller than ${this.maxnumber}`;
        }
        if (this.step) {
            text += ` (increments of ${this.step})`;
        }
        text += ".";
        return text;
    }

    /**
     * Increment the number
     * @param step the amount to increment by.
     */
    increment(step) {
        if ((!step) || (isNaN(step))) {
            step = 1;
        }
        let val = Number(this.value);
        if (!val) { val = 0; }
        if (!isNaN(val)) {
            val += step;
            if ((this.maxnumber !== 'undefined') && (val > this.maxnumber)) {
                val = this.maxnumber;
            }
            this.value = val;
        }
    }

    /**
     * Decrement the number
     * @param step the amount to decrement by
     */
    decrement(step) {
        if ((!step) || (isNaN(step))) {
            step = 1;
        }
        let val = Number(this.value);
        if (!val) { val = 0; }
        if (!isNaN(val)) {
            val -= step;
            if ((this.minnumber !== 'undefined') && (val < this.minnumber)) {
                val = this.minnumber;
            }
            this.value = val;
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the steppers
     */
    buildSteppers() {
        const me = this;
        if (this.steppers) {
            this.upbtn = new SimpleButton({
                classes: ['naked'],
                icon: 'triangle-up',
                notab: true,
                action: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.increment(me.step);
                }
            });
            this.downbtn = new SimpleButton({
                classes: ['naked'],
                icon: 'triangle-down',
                notab: true,
                action: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.decrement(me.step);
                }
            });
            this.stepbuttons = document.createElement('div');
            this.stepbuttons.classList.add('stepbuttons');
            this.stepbuttons.classList.add('inputcontrol');
            this.stepbuttons.appendChild(this.upbtn.button);
            this.stepbuttons.appendChild(this.downbtn.button);
            this.stepbuttons.addEventListener('mousedown', function(e) {
                e.preventDefault(); // Prevents focus shifting.
            });
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get downbtn() { return this._downbtn; }
    set downbtn(downbtn) { this._downbtn = downbtn; }

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

    get wholenumbers() { return this.config.wholenumbers; }
    set wholenumbers(wholenumbers) { this.config.wholenumbers = wholenumbers; }

}


class EmailInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            forceconstraints: true,
            pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
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
        config = Object.assign({}, EmailInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputmode() { return "email"; }

    /* CORE METHODS_____________________________________________________________________ */

    calculatePlaceholder() {
        return 'person@myemailaccount.net';
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!EmailInput.isValid(this.value)) {
                this.errors.push("This is an invalid email address.");
            }
        }
    }

}


class URIInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            forceconstraints: true
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
        return 'https://somewhere.cornflower.blue/';
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!URIInput.isValid(this.value)) {
                this.errors.push("This is an invalid web address.");
            }
        }
    }

}


class HiddenField extends TextInput {
    /*
     * HiddenFields should not be used for elements that may become visible at some time.
     */
    constructor(config) {
        config.hidden = true;
        config.type = "hidden";
        super(config);
    }

    get container() {
        return this.input;
    }
}
class PasswordInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            minlength: 5,
            suggestedlength: 8,
            maxlength: 30,
            visibilityswitch: true, // Show the visibility switch
            startvisible: false, // If true, start with password visible already.
            forceconstraints: false,
            type: 'password'
        };
    }

    /**
     * Define the object
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, PasswordInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get topcontrol() { return this.visibilityswitcher; }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Draws the visibility switcher.
     */
    buildVisibilitySwitcher() {
        const me = this;
        if (this.visibilityswitch) {
            this.hidepwbutton = new SimpleButton({
                classes: ['naked'],
                text: "Hide Password",
                hidden: true,
                notab: true,
                icon: 'eye-slash',
                action: function() {
                    me.setVisibility(false);
                }
            });
            this.showpwbutton = new SimpleButton({
                classes: ['naked'],
                text: "Show Password",
                hidden: true,
                notab: true,
                icon: 'eye',
                action: function() {
                    me.setVisibility(true);
                }
            });

            this.visibilityswitcher = document.createElement('div');
            this.visibilityswitcher.classList.add('visibilityswitch');
            this.visibilityswitcher.classList.add('topcontrol');
            this.visibilityswitcher.appendChild(this.hidepwbutton.button);
            this.visibilityswitcher.appendChild(this.showpwbutton.button);

            this.setVisibility(this.startvisible);

        }
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Set the visibility of the user's password.
     * @param visible if true, make the password visible.
     */
    setVisibility(visible) {
        if (visible) {
            this.mode = false;
            this.input.setAttribute('type', 'text');
            this.hidepwbutton.show();
            this.showpwbutton.hide();
        } else {
            this.mode = true;
            this.input.setAttribute('type', 'password');
            this.hidepwbutton.hide();
            this.showpwbutton.show();
        }
        this.input.focus();
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (this.value.length < this.minlength) {
                this.errors.push(`Password must be at least ${this.minlength} characters.`);
            } else if (this.value.length < this.suggestedlength) {
                this.warnings.push(`Password is less than the suggested length of ${this.suggestedlength} characters.`);
            } else if (this.value.length > this.maxlength) {
                this.errors.push(`Password must be less than ${this.maxlength} characters.`);
            }
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */
    
    get minlength() { return this.config.minlength; }
    set minlength(minlength) { this.config.minlength = minlength; }

    get hidepwbutton() { return this._hidepwbutton; }
    set hidepwbutton(hidepwbutton) { this._hidepwbutton = hidepwbutton; }

    get showpwbutton() { return this._showpwbutton; }
    set showpwbutton(showpwbutton) { this._showpwbutton = showpwbutton; }

    get mode() { return this._mode; }
    set mode(mode) { this._mode = mode; }

    get startvisible() { return this.config.startvisible; }
    set startvisible(startvisible) { this.config.startvisible = startvisible; }

    get suggestedlength() { return this.config.suggestedlength; }
    set suggestedlength(suggestedlength) { this.config.suggestedlength = suggestedlength; }

    get visibilityswitch() { return this.config.visibilityswitch; }
    set visibilityswitch(visibilityswitch) { this.config.visibilityswitch = visibilityswitch; }

    get visibilityswitcher() {
        if (!this._visibilityswitcher) { this.buildVisibilitySwitcher(); }
        return this._visibilityswitcher;
    }
    set visibilityswitcher(visibilityswitcher) { this._visibilityswitcher = visibilityswitcher; }

}

class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: "(Select)",
            icon: "chevron-down",
            prefix: null, // a prefix to display in the trigger box.
            searchtext: true, // Show the "searchtext" box.
            options: [], // Array of option dictionary objects.  Printed in order given.
                         // { label: "Label to show", value: "v", checked: true }
            onchange: null // The change handler. Passed (event, self).
        };
    }

    /**
     * Define the SelectMenu
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, SelectMenu.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Return the selected radio input.
     * @return {jQuery|HTMLElement}
     */
    get selected() {
        let sel = this.optionlist.querySelector(`input[name=${this.name}]:checked`);
        if (sel.length > 0) { return sel; }
        return null;
    }

    get value() {
        return this.optionlist.querySelector(`input[name=${this.name}]:checked`).value;
    }

    get topcontrol() { return this.searchdisplay; }

    get passivetext() {
        if (this.selectedoption) { return this.selectedoption.label; }
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Opens the option list.
     */
    open() {
        const me = this;

        this.optionlist.removeAttribute('aria-hidden');
        this.triggerbox.setAttribute('aria-expanded', 'true');

        let items = Array.from(this.optionlist.querySelector('li'));
        for (let li of items) {
            li.setAttribute('tabindex', '0');
        }

        let vertpos = (Utils.getSingleEmInPixels() * 15); // menu height
        if (this.container) {
            vertpos += parseInt(this.container.getBoundingClientRect().top);
        } else {
            vertpos += parseInt(this.optionlist.getBoundingClientRect().top);
        }

        if (vertpos > window.innerHeight) {
            this.optionlist.classList.add('vert');
            if (this.container) { this.container.classList.add('vert'); }
        } else {
            this.optionlist.classList.remove('vert');
            if (this.container) { this.container.classList.remove('vert'); }
        }

        setTimeout(function() { // Have to wait until we're sure we're in the DOM
            let sel = me.optionlist.querySelector('li[aria-selected="true"]');
            if (!sel) {
                sel = me.optionlist.querySelector('li:first-child');
            }
            if (sel) {
                me.scrollto(sel);
                sel.focus();
            }
        }, 100);

        setTimeout(function() { // Set this after, or else we'll get bouncing.
            me.setCloseListener();
        }, 200);

    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;
        window.addEventListener('click', function(e) {
            if (e.target === me.optionlist) {
                me.setCloseListener();
            } else if ((e.target === me.triggerbox) && (me.triggerbox.getAttribute('aria-expanded') === 'true')) {
                // Do _nothing_
            } else {
                me.close();
            }
        }, {
            once: true,
        });
    }

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
        element.focus();
        this.scrolleditem = element;
    }

    /**
     * Closes the option list.
     */
    close() {
        this.optionlist.setAttribute('aria-hidden', 'true');
        this.triggerbox.removeAttribute('aria-expanded');

        let items = Array.from(this.optionlist.querySelector('li'));
        for (let li of items) {
            li.setAttribute('tabindex', '-1');
        }

        this.searchkeys = [];
        this.updateSearch();
    }

    disable() {
        let radios = this.optionlist.querySelectorAll("input[type='radio']");
        for (let r of radios) {
            r.setAttribute('disabled', 'disabled');
        }
        this.triggerbox.setAttribute('disabled', 'disabled');
        this.triggerbox.removeAttribute('aria-expanded');
        this.disabled = true;
        if (this.triggerbox) { this.triggerbox.classList.add('disabled'); }
        if (this.container) { this.container.classList.add('disabled'); }
    }

    enable() {
        let radios = this.optionlist.querySelectorAll("input[type='radio']");
        for (let r of radios) {
            r.removeAttribute('disabled');
        }
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

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('select-container');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.labelobj) { this.container.appendChild(this.labelobj); }

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.triggerbox);
        this.container.append(wrap);

        this.container.appendChild(this.optionlist);
        this.container.appendChild(this.passivebox);
        this.container.appendChild(this.topcontrol);
        this.container.appendChild(this.messagebox);

        this.postContainerScrub();
    }

    /**
     * Builds the trigger box for the select.
     */
    buildTriggerBox() {
        const me = this;
        this.triggerbox = document.createElement('div');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('tabindex', '0');
        this.triggerbox.addEventListener('focus', function(e) {
            if (me.disabled) {
                e.stopPropagation();
                return;
            }
            me.open();
        });
        if (this.mute) { this.triggerbox.classList.add('mute'); }
        if (this.icon) { this.triggerbox.classList.add(`cfb-${this.icon}`); }
    }

    buildOptions() {
        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('selectmenu');
        this.optionlist.setAttribute('id', this.id);
        this.optionlist.setAttribute('aria-hidden', 'true');
        this.optionlist.setAttribute('tabindex', '0');
        this.optionlist.setAttribute('role', 'radiogroup');

        let order = 1;
        for (let opt of this.options) {
            let o = this.buildOption(opt, order);
            if (opt.checked) {
                this.selectedoption = opt;
            }
            order++;
            this.optionlist.appendChild(o);
        }

        if (this.unselectedtext) { // Unselected slots last because we need to select if nothing is selected
            let unselconfig = {
                label: this.unselectedtext,
                value: '',
                checked: !this.selectedoption,
                unselectoption: true
            };
            let o = this.buildOption(unselconfig, 0);
            o.setAttribute('data-menuorder', 0);
            this.optionlist.prepend(o);
        }
    }

    buildOption(def, order) {
        const me = this;

        const lId = `${this.id}-${Utils.getUniqueKey(5)}`;
        let next = order + 1,
            previous = order - 1;
        if (this.unselectedtext) {
            if (previous < 0) { previous = 0; }
        } else {
            if (previous < 1) { previous = 1; }
        }
        if (next > this.options.length) { next = this.options.length; }

        let li = document.createElement('li');
        li.setAttribute('tabindex', '-1');
        li.setAttribute('id', `li-${lId}`);
        li.setAttribute('data-menuorder', order);

        li.addEventListener('keydown', function(e) {
            if((e.shiftKey) && (e.keyCode === 9)) {  // Shift + Tab
                me.close();
            } else if (e.keyCode === 9) { // Tab
                me.close();
            } else if (e.keyCode === 27) { // Escape
                me.close();
            } else if (e.keyCode === 38) { // Up arrow
                e.preventDefault();
                me.optionlist.querySelector(`[data-menuorder='${previous}']`).focus();
            } else if (e.keyCode === 40) { // Down arrow
                e.preventDefault();
                me.optionlist.querySelector(`[data-menuorder='${next}']`).focus();
            } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                li.querySelector('input').click(); // click the one inside
            } else if (e.keyCode === 8) { // Backspace
                me.rmSearchKey();
            } else if ((e.keyCode === 17) // ctrl
                || (e.keyCode === 18) // alt
                || (e.keyCode === 91) // command
            ) {
                // do nothing, ignore
            } else { // Anything else
                me.runKeySearch(e.key);
            }
        });
        li.addEventListener('click', function() {
            let opts = me.optionlist.querySelectorAll('li');
            for (let o of opts) {
                o.removeAttribute('aria-selected');
            }
            li.setAttribute('aria-selected', 'true');
        });

        let opLabel = document.createElement('label');
        opLabel.setAttribute('for', lId);
        opLabel.innerHTML = def.label;

        let op = document.createElement('input');
        op.setAttribute('id', lId);
        op.setAttribute('type', 'radio');
        op.setAttribute('name', this.name);
        op.setAttribute('tabindex', '-1');
        op.setAttribute('value', def.value);
        op.setAttribute('aria-labelledby', lId);
        op.setAttribute('aria-label', def.label);
        op.setAttribute('role', 'radio');
        op.addEventListener('change', function() {
            if (me.prefix) {
                me.triggerbox.innerHTML = `${me.prefix} ${def.label}`;
            } else {
                me.triggerbox.innerHTML = def.label;
            }

            me.selectedoption = def;

            if (def.label === me.unselectedtext) {
                me.passivebox.innerHTML = me.unsettext;
            } else {
                me.passivebox.innerHTML = def.label;
            }

            let labels = me.optionlist.querySelectorAll('label');
            for (let l of labels) {
                l.classList.remove('cfb-triangle-down');
            }

            opLabel.classList.add('cfb-triangle-down');

            me.close();

            me.validate();

            if (me.form) { me.form.validate(); }

            if ((me.onchange) && (typeof me.onchange === 'function')) {
                me.onchange(me);
            }
        });

        if (def.checked) {
            this.origval = def.value;
            if (this.prefix) {
                this.triggerbox.innerHTML = `${this.prefix} ${def.label}`;
            } else {
                this.triggerbox.innerHTML = def.label;
            }
            li.setAttribute('aria-selected', 'true');
            op.setAttribute('aria-checked', 'checked');
            op.setAttribute('checked', 'checked');
        }

        li.appendChild(op);
        li.appendChild(opLabel);
        return li;
    }

    /**
     * Draws the search text display.
     */
    buildSearchDisplay() {
        if (this.searchtext) {
            this.searchdisplay = document.createElement('div');
            this.searchdisplay.classList.add('searchdisplay');
            this.searchdisplay.classList.add('topcontrol');
            this.updateSearch();
        }
    }

    /**
     * Updates the counter
     */
    updateSearch() {
        if (this.searchkeys.length === 0) {
            this.searchdisplay.classList.add('hidden');
            this.searchdisplay.innerHTML = '';
            return;
        }
        this.searchdisplay.classList.remove('hidden');
        this.searchdisplay.innerHTML = this.searchkeys.join('');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Delete a search key from the stack
     */
    rmSearchKey() {
        if (this.searchkeys.length === 0) return;
        this.searchkeys.pop();
        if (this.searchkeys.length > 0) {
            this.findByString(this.searchkeys.join(''));
        }
        this.updateSearch();
    }

    /**
     * Search the options from keyboard input
     * @param key the key to add to the stack
     */
    runKeySearch(key) {
        this.searchkeys.push(key);
        if (this.searchkeys.length > 0) {
            this.findByString(this.searchkeys.join(''));
        }
        this.updateSearch();
    }

    /**
     * Search the list of options and scroll to it
     * @param s the string to search
     */
    findByString(s) {
        if ((!s) || (typeof s !== 'string')) { return; }
        let target;

        let lis = this.optionlist.querySelectorAll('li');
        for (let li of lis) {
            let label = li.querySelector('label');
            if (label.innerHTML.toUpperCase().startsWith(s.toUpperCase())) {
                target = li;
                break;
            }
        }
        this.scrollto(target);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get optionlist() {
        if (!this._optionlist) { this.buildOptions(); }
        return this._optionlist;
    }
    set optionlist(optionlist) { this._optionlist = optionlist; }

    get options() { return this.config.options; }
    set options(options) { this.config.options = options; }

    get prefix() { return this.config.prefix; }
    set prefix(prefix) { this.config.prefix = prefix; }

    get searchdisplay() {
        if (!this._searchdisplay) { this.buildSearchDisplay(); }
        return this._searchdisplay;
    }
    set searchdisplay(searchdisplay) { this._searchdisplay = searchdisplay; }

    get searchkeys() {
        if (!this._searchkeys) { this._searchkeys = []; }
        return this._searchkeys;
    }
    set searchkeys(searchkeys) { this._searchkeys = searchkeys; }

    get searchtext() { return this.config.searchtext; }
    set searchtext(searchtext) { this.config.searchtext = searchtext; }

    get selectedoption() { return this._selectedoption; }
    set selectedoption(selectedoption) { this._selectedoption = selectedoption; }

    get scrolleditem() { return this._scrolleditem; }
    set scrolleditem(scrolleditem) { this._scrolleditem = scrolleditem; }

    get triggerbox() {
        if (!this._triggerbox) { this.buildTriggerBox(); }
        return this._triggerbox;
    }
    set triggerbox(triggerbox) { this._triggerbox = triggerbox; }

    get unselectedtext() { return this.config.unselectedtext; }
    set unselectedtext(unselectedtext) { this.config.unselectedtext = unselectedtext; }

}



class RadioGroup extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The button id
            name: null,
            form: null, // A form element this is in
            label: null, // The text for the label.
            passive: false, // Start life in "passive" mode.
            required: false, // Is this a required field or not
            unsettext: "(Not Set)", // what to display in passive mode if the value is empty
            classes: [], // Extra css classes to apply
            disabled: false, // If true, make this disabled.
            options: [], // Array of option dictionary objects.  Printed in order given.
                         // { label: "Label to show", value: "v", checked: true }
            onchange: null, // The change handler. Passed (self).
            validator: null // A function to run to test validity. Passed the self; returns true or false.
        };
    }

    /**
     * Define the RadioGroup
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, RadioGroup.DEFAULT_CONFIG, config);

        if (!config.id) { // need to generate an id for label stuff
            config.id = `radiogroup-${Utils.getUniqueKey(5)}`;
        }
        if (!config.name) { config.name = config.id; }

        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get input() { return this.optionlist; }

    get passivetext() {
        if (this.selectedoption) { return this.selectedoption.label; }
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
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
            this.optionlist.setAttribute('aria-described-by', `${this.help.id}-tt`);
            this.optionlist.setAttribute('aria-labeled-by', `label-${this.id}`);
        }
    }

    buildOption(def) {

        const me = this;
        const lId = `${this.id}-${Utils.getUniqueKey(5)}`;
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
        op.addEventListener('change', function() {
            if (op.checked) {
                op.setAttribute('aria-checked', 'true');
            } else {
                op.removeAttribute('aria-checked');
            }

            me.selectedoption = def;
            if (def.label === me.unselectedtext) {
                me.passivebox.innerHTML = me.unsettext;
            } else {
                me.passivebox.innerHTML = def.label;
            }

            me.validate();

            if (me.form) { me.form.validate(); }

            if ((me.onchange) && (typeof me.onchange === 'function')) {
                me.onchange(me);
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
        this.optionlist.setAttribute('role', 'radiogroup');

        for (let opt of this.options) {
            let o = this.buildOption(opt);
            if (opt.checked) {
                this.selectedoption = opt;
            }
            this.optionlist.appendChild(o);
        }
    }


    /* ACCESSOR METHODS_________________________________________________________________ */

    get onchange() { return this.config.onchange; }
    set onchange(onchange) {
        if (typeof onchange !== 'function') {
            console.error("Action provided for onchange is not a function!");
        }
        this.config.onchange = onchange;
    }

}

class StateMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: "(Select State or Province)",
            valuesas: 'code', // What to stick in the value for the elements.
                            // "code" or "name".
            set: null // Empty, or "US" or "CA". If empty, fills with all states.
        };
    }

    /**
     * Define the StateMenu
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, StateMenu.DEFAULT_CONFIG, config);
        // { label: "Label to show", value: "v", checked: true }

        let states = StateProvince.list(config.set);
        let options = [];
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
            options.push(d);
        }

        config.options = options;
        super(config);

    }
}
class TextArea extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            counter: 'sky', // A value for a character counter. Null means 'no counter'
            // Possible values: null, 'remaining', 'limit', and 'sky'
        };
    }

    constructor(config) {
        config = Object.assign({}, TextArea.DEFAULT_CONFIG, config);
        config.type = "textarea";
        super(config);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('textarea-container');
        this.container.appendChild(this.labelobj);
        this.container.appendChild(this.charactercounter);

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.input);
        this.container.appendChild(wrap);

        this.container.appendChild(this.passivebox);
        this.container.appendChild(this.messagebox);

        this.postContainerScrub();

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

    static get DEFAULT_STRINGS() {
        return {
            multiple_file_placeholder: 'Select files (multiple accepted)',
            single_file_placeholder: 'Select file'
        };
    }

    constructor(config) {
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
        if (this.multiple) { return FileInput.DEFAULT_STRINGS.multiple_file_placeholder; }
        return FileInput.DEFAULT_STRINGS.single_file_placeholder;
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
        const me = this;
        this.triggerbox = document.createElement('div');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('tabindex', '-1');
        this.triggerbox.innerHTML = this.placeholder;
        this.triggerbox.addEventListener('click', function(e) {
            if (me.disabled) {
                e.stopPropagation();
                return;
            }
            me.labelobj.click();
        });
        this.triggerbox.addEventListener('keydown', function(e) {
            if (e.keyCode === 9) { // Tab
                me.triggerbox.blur();
            } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                me.labelobj.click();
            }
        });

        if (this.mute) { this.triggerbox.classList.add('mute'); }

        if (this.icon) { this.triggerbox.classList.add(`cfb-${this.icon}`); }
    }

    /**
     * Build file input
     */
    buildFileInput() {
        const me = this;

        this.fileinput = document.createElement('input');
        this.fileinput.setAttribute('type', this.type);
        this.fileinput.setAttribute('name', this.name);
        this.fileinput.setAttribute('id', this.id);
        this.fileinput.setAttribute('accept', this.accept);
        this.fileinput.setAttribute('multiple', this.multiple);
        this.fileinput.setAttribute('aria-labelled-by', this.labelobj.id);
        this.fileinput.addEventListener('focusin', function() {
                me.triggerbox.focus();
        });
        this.fileinput.addEventListener('change', function(me) {
            if ((me.fileinput.files) && (me.fileinput.files.length > 0)) {
                let farray =  me.fileinput.files;
                let fnames = [];
                for (let i of farray) {
                    fnames.push(i.name);
                }
                if (fnames.length > 0) {
                    me.triggerbox.classList.add('files');
                    me.triggerbox.innerHTML = fnames.join(', ');
                } else {
                    me.triggerbox.classList.remove('files');
                    me.triggerbox.innerHTML = me.placeholder;

                }
            }
            if ((me.onchange) && (typeof me.onchange === 'function')) {
                me.onchange(me);
            }
        });
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



class DialogWindow {

    static get DEFAULT_CONFIG() {
       return {
            id: null,
            form: null,  // takes a SimpleForm.  If present, displays and renders that. If not, uses content.
            content: '<p />No provided content</p', // This is the content of the dialog
            classes: [],             // apply these classes to the dialog, if any.
            header: null, // jQuery object, will be used if passed before title.
            title: null,  // Adds a title to the dialog if present. header must be null.
            trailer: null, // Adds a trailing chunk of DOM.  Can be provided a full dom object
                           // or a string.  If it's a string, it creates a div at the bottom
                           // with the value of the text.
            clickoutsidetoclose: true, // Allow the window to be closed by clicking outside.
            escapecloses: true, // Allow the window to be closed by the escape key
            showclose: true  // Show or hide the X button in the corner (requires title != null)
        };
    }

    /**
     * Define a DialogWindow
     * @param config a dictionary object
     * @return DialogWindow
     */
    constructor(config) {
        this.config = Object.assign({}, DialogWindow.DEFAULT_CONFIG, config);

        if (!config.id) { config.id = `dialog-${Utils.getUniqueKey(5)}`; }

        this.build();
    }

    /**
     * Opens the dialog window
     */
    open() {
        const me = this;

        this.prevfocus = document.querySelector(':focus');

        this.mask = document.createElement('div');
        this.mask.classList.add('window-mask');
        for (let c of this.classes) {
            this.mask.classList.add(c);
        }
        this.mask.addEventListener('click', function(e) {
            e.preventDefault();
            if (me.clickoutsidetoclose) {
                me.close();
            }
        });
        this.container.appendChild(me.window);

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

        this.escapelistener = function(e) {
            if (e.key === 'Escape') {
                me.close();
            }
        };

        setTimeout(function() {
            let focusable = me.contentbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable[0]) {
                focusable[0].focus();
            }
            if (me.escapecloses) {
                document.addEventListener('keyup', me.escapelistener);
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
    }

    /**
     * Check to see if escape should close the thing
     * @param e the event.
     */
    escape(e, self) {
        console.log(e.key);
        if (e.key === 'Escape') {
            console.log("asdfadssadfasdfasdads");
            console.log(self);
            self.close();
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Constructs the DialogWindow's DOM elements
     */
    build() {
        const me = this;

        this.container = document.createElement('div');
        this.container.classList.add('window-container');

        this.window = document.createElement('div');
        this.window.classList.add('dialog');
        this.window.setAttribute('id', this.id);

        for (let c of this.classes) {
            this.container.classList.add(c);
            this.window.classList.add(c);
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

            if (this.showclose) {
                this.closebutton = new SimpleButton({
                    icon: 'echx',
                    text: "Close",
                    shape: "square",
                    classes: ["naked", "closebutton"],
                    action: function(e) {
                        e.preventDefault();
                        me.close();
                    }
                });
                this.header.appendChild(this.closebutton.button);
            }
        } else if (this.showclose) {
            console.error("Dialog defines 'showclose' but no title is defined.");
        }

        if (this.form) { // it's a SimpleForm

            this.form.dialog = this;

            this.contentbox = document.createElement('div');
            this.contentbox.classList.add('content');
            this.contentbox.appendChild(this.form.form);

            this.window.classList.add('isform');
            this.window.appendChild(this.contentbox);

        } else if (this.content) { // It's a jQuery object

            this.contentbox = document.createElement('div');
            this.contentbox.classList.add('content');
            this.contentbox.appendChild(this.content);

            this.window.appendChild(this.contentbox);
        }
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

    get clickoutsidetoclose() { return this.config.clickoutsidetoclose; }
    set clickoutsidetoclose(clickoutsidetoclose) { this.config.clickoutsidetoclose = clickoutsidetoclose; }

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

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

    get mask() { return this._mask; }
    set mask(mask) { this._mask = mask; }

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

class FloatingPanel {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            title: null, // The title
            content : null, // The content payload
            style: 'plain', // Various styles that can be applied to the panel.
            // - 'plain': simple, spartan, solid.
            // - 'ghost': similar to 'plain' except that it turns translucent when not in focus or hover
            // - 'invisible: panel behaves as normal but the background is transparent

            hidden: false, // set to true to hide
            togglecontrol: true, // show a visibility toggle
            closeicon: 'triangle-down-circle',
            minimized: false, // Start minimized
            position: 'top-left', // Position for the panel. Valid values:
            // (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)
            classes: [], //Extra css classes to apply,

            onclose: null, // A function to run to when the panel closes. Passed the self.
            onopen: null // A function to run to when the panel opens. Passed the self.

        };
    }

    constructor(config) {
        this.config = Object.assign({}, FloatingPanel.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `panel-${Utils.getUniqueKey(5)}`; }
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
        this.container.setAttribute('aria-expanded', 'true');
        this.pcontent.setAttribute('aria-hidden', 'false');
        this.minimized = false;
        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }
    }

    /**
     * Minimize the panel
     */
    close() {
        this.container.setAttribute('aria-expanded', 'false');
        this.pcontent.setAttribute('aria-hidden', 'true');
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
     * Build the HTML elements of the Floating Panel
     */
    buildContainer() {

        const me = this;

        this.container = document.createElement('div');
        this.container.classList.add('panel');
        this.container.classList.add(this.style);
        this.container.classList.add(this.position);

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.togglecontrol) {
            this.togglebutton = new SimpleButton({
                icon: this.closeicon,
                text: "Close",
                naked: true,
                shape: "square",
                classes: ["togglebutton"],
                action: function(e) {
                    e.preventDefault();
                }
            });
        }

        if (this.title) {
            this.titlecontainer = document.createElement('h3');
            this.titlecontainer.addEventListener('click', function(e) {
                    e.preventDefault();
                    me.toggleClose();
                });
            if (this.togglecontrol) {
                this.titlecontainer.appendChild(this.togglebutton.button);
            }
            this.titleactual = document.createElement('span');
            this.titleactual.classList.add('text');
            this.titleactual.innerHTML = this.title;
            this.titlecontainer.appendChild(this.titleactual);
        } else {
            if (this.togglecontrol) {
                this.container.appendChild(this.togglebutton.button);
            }
        }

        this.pcontent = document.createElement('div');
        this.pcontent.classList.add('pcontent');
        if (this.content) {
            this.pcontent.appendChild(this.content);
        }

        this.contentbox = document.createElement('div');
        this.contentbox.classList.add('content');
        if (this.title) { this.contentbox.appendChild(this.titlecontainer); }
        this.contentbox.appendChild(this.pcontent);

        this.container.appendChild(this.contentbox);

        if (this.minimized) {
            this.close();
        } else {
            this.open();
        }

        if (this.hidden) { this.hide(); }
    }

    /**
     * Replace the content with other content
     * @param content the content to place
     */
    replace(content) {
        this.content = content;
        this.pcontent.innerHTML = "";
        this.pcontent.appendChild(this.content);
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

    get togglebutton() { return this._togglebutton; }
    set togglebutton(togglebutton) { this._togglebutton = togglebutton; }

    get togglecontrol() { return this.config.togglecontrol; }
    set togglecontrol(togglecontrol) { this.config.togglecontrol = togglecontrol; }

    get closeicon() { return this.config.closeicon; }
    set closeicon(closeicon) { this.config.closeicon = closeicon; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get content() { return this.config.content; }
    set content(content) {
        if (this.pcontent) { this.pcontent.innerHTML = content; }
        this.config.content = content;
    }

    get contentbox() { return this._contentbox; }
    set contentbox(contentbox) { this._contentbox = contentbox; }

    get hidden() { return this.config.hidden; }
    set hidden(hidden) { this.config.hidden = hidden; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get minimized() { return this._minimized; }
    set minimized(minimized) { this._minimized = minimized; }

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

    get pcontent() { return this._pcontent; }
    set pcontent(pcontent) { this._pcontent = pcontent; }

    get position() { return this.config.position; }
    set position(position) { this.config.position = position; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

    get title() { return this.config.title; }
    set title(title) {
        this.config.title = title;
        if (this.titleactual) { this.titleactual.innerHTML = title; }
    }

    get titleactual() { return this._titleactual; }
    set titleactual(titleactual) { this._titleactual = titleactual; }

    get titlecontainer() { return this._titlecontainer; }
    set titlecontainer(titlecontainer) { this._titlecontainer = titlecontainer; }

}
class Growler extends FloatingPanel {

    static get DEFAULT_CONFIG() {
        return {
            text : null, // The growler payload
            closeicon: 'echx',
            duration: 4000, // Length of time in milliseconds to display. If 0 or negative, stays open.
            icon: null, // An optional icon. Position of this depends on whether there is text or a title.
                        // If a title is given but no text, it will be in the titlebar. Else it
                        // gets placed in the text area.
            position: 'bottom-right' // Position for the growler. Valid values:
                        // (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)
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
            title: 'Error',
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
            title: 'Warning',
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
            title: 'Caution',
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
            title: 'Success',
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
        const me = this;
        if (this.timer) { clearTimeout(this.timer); }
        this.container.setAttribute('aria-hidden', 'true');

        setTimeout(function() {
            if ((me.onclose) && (typeof me.onclose === 'function')) {
                me.onclose(me);
            }
            me.container.parentNode.removeChild(me.container);
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
        const me = this;
        this.container.removeAttribute('aria-hidden');

        if (this.duration > 0) {
            this.timer = setTimeout(function() {
                me.close();
            }, this.duration);
        }
        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }
    }

    buildContainer() {
        const me = this;

        this.container = document.createElement('div');
        this.container.setAttribute('aria-hidden', 'true');
        this.container.classList.add('growler');

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        this.closebutton = new SimpleButton({
            icon: 'echx',
            text: "Close",
            shape: "square",
            classes: ["closebutton"],
            action: function(e) {
                e.preventDefault();
                me.quickClose();
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
                payload.append(i);
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
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

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


class InstructionBox {

    static get DEFAULT_CONFIG() {
        return {
            icon : 'help-circle', // If present, will be displayed large next to texts
            id : null, // the id
            instructions: [], // An array of instruction texts
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, InstructionBox.DEFAULT_CONFIG, config);
        if ((!this.instructions) || (this.instructions.length < 1)) { console.warn("No instructions provided to InstructionBox"); }
        return this;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the actual DOM container.
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('instructions');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.icon) {
            this.container.appendChild(IconFactory.icon(this.icon));
        }
        if ((this.instructions) && (this.instructions.length > 0)) {
            this.setInstructions(this.instructions);
            this.container.appendChild(this.list);
            // Apply specific style based on how many lines there are
        }
    }

    /**
     * Build the list object.  This is the dumbest method I've ever written.
     */
    buildList() {
        this.list = document.createElement('ul');
    }

    /**
     * Build in the instructions.  This method can also be used to re-write them in a new list, as with forms being activated and pacifyd
     * @param instructions an array of strings.
     */
    setInstructions(instructions) {
        this.container.classList.remove('size-1');
        this.container.classList.remove('size-2');
        this.container.classList.remove('size-3');
        this.list.innerHTML = '';

        for (let text of instructions) {
            let li = document.createElement('li');
            li.innerHTML = text;
            this.list.appendChild(li);
        }

        if ((instructions.length > 0) && (instructions.length < 4)) {
            this.container.classList.add(`size-${instructions.length}`);
        }
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

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get list() {
        if (!this._list) { this.buildList(); }
        return this._list;
    }
    set list(list) { this._list = list;  }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

}

class MessageBox {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            errors: null, // array of errors
            warnings: null, // array of warning strings
            results: null, // array of result or success message strings
            errorstitle: null,
            successtitle: null,
            warningstitle: null,
            erroricon: 'warn-hex', // If present, will be displayed large next to texts
            warningicon : 'warn-triangle', // If present, will be displayed large next to texts
            successicon: 'disc-check', // If present, will be displayed large next to texts
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, MessageBox.DEFAULT_CONFIG, config);
        return this;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full messagebox container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('messagebox');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if ((this.errors) && (this.errors.length > 0)) {
            this.container.appendChild(this.buildBox("errors"));
        }

        if ((this.results) && (this.results.length > 0)) {
            this.container.appendChild(this.buildBox("results"));
        }

        if ((this.warnings) && (this.warnings.length > 0)) {
            this.container.appendChild(this.buildBox("warnings"));
        }

    }

    /**
     * Build the specific box.
     * @param type the type of box to create (errors|warnings|results)
     * @return {*|jQuery}
     */
    buildBox(type = 'results') {
        let list,
            icon,
            title;

        let box = document.createElement('div');
        box.classList.add('box');
        box.classList.add(type);

        switch(type) {
            case 'errors':
                list = this.errors;
                icon = this.erroricon;
                title = this.errorstitle;
                break;
            case 'warnings':
                list = this.warnings;
                icon = this.warningicon;
                title = this.warningstitle;
                break;
            case 'results':
            default:
                list = this.results;
                icon = this.successicon;
                title = this.successtitle;
                break;
        }

        if (title) {
            let telem = document.createElement('h4');
            telem.innerHTML = title;
            box.appendChild(telem);
        }

        let lbox = document.createElement('div');
        lbox.classList.add('lbox');


        if (icon) { lbox.appendChild(IconFactory.icon(icon)); }


        let mlist = document.createElement('ul');
        for (let text of list) {
            let li = document.createElement('li');
            li.innerHTML = text;
            mlist.appendChild(li);
        }

        lbox.appendChild(mlist);

        lbox.classList.add(`size-${list.length}`);

        box.appendChild(lbox);
        return box;
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

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

    get errors() { return this.config.errors; }
    set errors(errors) { this.config.errors = errors; }

    get errorstitle() { return this.config.errorstitle; }
    set errorstitle(errorstitle) { this.config.errorstitle = errorstitle; }

    get erroricon() { return this.config.erroricon; }
    set erroricon(erroricon) { this.config.erroricon = erroricon; }

    get results() { return this.config.results; }
    set results(results) { this.config.results = results; }

    get successtitle() { return this.config.successtitle; }
    set successtitle(successtitle) { this.config.successtitle = successtitle; }

    get successicon() { return this.config.successicon; }
    set successicon(successicon) { this.config.successicon = successicon; }

    get warnings() { return this.config.warnings; }
    set warnings(warnings) { this.config.warnings = warnings; }

    get warningstitle() { return this.config.warningstitle; }
    set warningstitle(warningstitle) { this.config.warningstitle = warningstitle; }

    get warningicon() { return this.config.warningicon; }
    set warningicon(warningicon) { this.config.warningicon = warningicon; }

}

class PasswordGenerator {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            buttontext: 'Generate Password',
            buttonicon: 'refresh',
            length: 15, // how many characters to generate
            autofills: [], // input elements to auto fill.
            sets: ['lc', 'uc', 'num', 'punc']
        };
    }

    static get DATASETS () {
        return {
            lc: { id: 'lc', label: 'Lowercase', set: 'a-z', chars: 'abcdefghijklmnopqrstuvwxyz' },
            uc: { id: 'uc', label: 'Uppercase', set: 'A-Z', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            num: { id: 'num', label: 'Numbers', set: '0-9', chars: '0123456789' },
            punc: { id: 'punc', label: 'Punctuation', set: '#', chars: '![]{}()%&*$#^<>~@|' }
        };
    }

    /**
     * Get a dataset definition by id
     * @param id the id of the dataset
     * @return {*} the dataset definition, or null
     */
    static getDataSet(id) {
        return PasswordGenerator.DATASETS[id];
    }

    /**
     * Generates a random password string.  Takes an array of character objects to include
     * @param datasets an array of dataset identifiers (defaults to all)
     * @param length how long of a password to generate (default 15);
     * @returns {string}
     */
    static randomPassword (datasets = PasswordGenerator.DEFAULT_CONFIG.sets, length = 15) {

        let corpus = '';
        for (let ds of datasets) {
            if (PasswordGenerator.getDataSet(ds)) {
                corpus += PasswordGenerator.getDataSet(ds).chars;
            }
        }

        let pw = '';
        for (let i = 0; i < length; i++) {
            pw += corpus.charAt(Math.floor(Math.random() * corpus.length));
        }
        return pw;
    }

    constructor(config) {
        this.config = Object.assign({}, PasswordGenerator.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `pwgen-${Utils.getUniqueKey(5)}`; }

        this.setactuals = [];
    }

    /* ACTION METHODS___________________________________________________________________ */

    /**
     * Does the actual password generation
     */
    generatePassword() {
        let sets = [];
        if ((!this.sets) || (this.sets.length === 0)){
            sets = PasswordGenerator.DEFAULT_CONFIG.sets;
        } else {
            for (let cb of this.setactuals) {
                if (cb.checked) {
                    sets.push(cb.value);
                }
            }
        }

        let genpw =  PasswordGenerator.randomPassword(sets, this.length);

        if ((this.autofills) && (this.autofills.length > 0)) {
            let theform;
            for (let af of this.autofills) {
                af.value = genpw;
                if (af.form) { theform = af.form; }
            }
            if (theform) {
                theform.validate();
            }
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the container for the generator
     */
    buildContainer() {
        const me = this;
        this.container = document.createElement('div');
        this.container.classList.add('pwgenerator');

        this.datasetblock = document.createElement('ul');
        this.datasetblock.classList.add('datasets');
        this.datasetblock.setAttribute('aria-hidden', 'true');

        if (this.sets.length > 0) {
            for (let ds of this.sets) {
                if (ds in PasswordGenerator.DATASETS) {
                    let set = PasswordGenerator.getDataSet(ds);
                    let cb = new BooleanToggle({
                        name: `dset-${set.id}`,
                        id: `${this.id}-${set.id}`,
                        value: set.id,
                        label: set.label,
                        checked: true
                    });
                    this.setactuals.push(cb);
                    let li = document.createElement('li');
                    li.appendChild(cb.container);
                    this.datasetblock.appendChild(li);
                }
            }
        }

        this.button = new SimpleButton({
            text: this.buttontext,
            naked: true,
            action: function(e) {
                e.preventDefault();
                me.generatePassword();
            }

        });

        this.configbutton = new SimpleButton({
            icon: 'gear',
            naked: true,
            arialabel: 'Configure Generator',
            classes: ['config'],
            action: function(e) {
                e.preventDefault();
                if (me.datasetblock.getAttribute('aria-hidden')) {
                    me.datasetblock.removeAttribute('aria-hidden');
                } else {
                    me.datasetblock.setAttribute('aria-hidden', 'true');
                }
            }

        });
        let controls = document.createElement('div');
        controls.classList.add('controls');
        controls.appendChild(this.button.button);
        controls.appendChild(this.configbutton.button);

        this.container.appendChild(controls);
        this.container.appendChild(this.datasetblock);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get autofills() { return this.config.autofills; }
    set autofills(autofills) { this.config.autofills = autofills; }

    get button() { return this._button; }
    set button(button) { this._button = button; }

    get configbutton() { return this._configbutton; }
    set configbutton(configbutton) { this._configbutton = configbutton; }

    get buttonicon() { return this.config.buttonicon; }
    set buttonicon(buttonicon) { this.config.buttonicon = buttonicon; }

    get buttontext() { return this.config.buttontext; }
    set buttontext(buttontext) { this.config.buttontext = buttontext; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get datasetblock() { return this._datasetblock; }
    set datasetblock(datasetblock) { this._datasetblock = datasetblock; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get length() { return this.config.length; }
    set length(length) { this.config.length = length; }

    get sets() { return this.config.sets; }
    set sets(sets) { this.config.sets = sets; }

    get setactuals() { return this._setactuals; }
    set setactuals(setactuals) { this._setactuals = setactuals; }

}
class PasswordChangeForm {

    static get DEFAULT_CONFIG() {
        return {
            maxlength: 30,
            minlength: 5,
            suggestedlength: 8,
            cannotbe: [],
            instructions: ["Change your password here."],
            buttontext: 'Change Password',
            pwcurrlabel: 'Current Password',
            pwcurrplaceholder: 'Your current password',
            pwcurrhelp: 'This is your <i>current</i> password. We need to confirm that you are who you are.',
            pwonelabel: 'New Password',
            pwoneplaceholder: null,
            pwonehelp: null,
            pwtwolabel: 'Confirm Password',
            pwtwoplaceholder: null,
            pwtwohelp: null,
            badpasswordhook: null // Function used to test the value against an external bad password list, like the one used by NIST.
        };
    }

    constructor(config) {
        this.config = Object.assign({}, PasswordChangeForm.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `pwchange-${Utils.getUniqueKey(5)}`; }
    }

    /* ACTION METHODS___________________________________________________________________ */




    /* VALIDATION METHODS_______________________________________________________________ */

    runChecks(self) {
        let valid = true;
        if ((this.pwone.value) !== (this.pwtwo.value)) {
            this.pwone.errors.push('Passwords must match.');
            this.pwone.showMessages();
            valid = false;
        }
        if ((this.cannotbe) && (this.cannotbe.length > 0)) {
            for (let cbs of this.cannotbe) {
                if (this.pwone.value === cbs) {
                    this.pwone.errors.push('This cannot be used as a password.');
                    valid = false;
                }
            }
        }
        if ((valid) && (this.badpasswordhook) && (typeof this.badpasswordhook === 'function')) {
            valid = this.badpasswordhook(this.pwone);
        }

        if (valid) {
            this.pwone.clearMessages();
        }

        return valid;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildForm() {
        const me = this;

        this.pwcurr = new PasswordInput({
            id: `${this.id}-pwcurr`,
            label: this.pwcurrlabel,
            showpasswordbydefault: true,
            required: true,
            placeholder: this.pwcurrplaceholder,
            help: this.pwcurrhelp
        });
        this.pwone = new PasswordInput({
            id: `${this.id}-pwone`,
            label: this.pwonelabel,
            showpasswordbydefault: true,
            required: true,
            placeholder: this.pwoneplaceholder,
            help: this.pwonehelp
        });
        this.pwtwo = new PasswordInput({
            id: `${this.id}-pwtwo`,
            label: this.pwtwolabel,
            required: true,
            showpasswordbydefault: true,
            placeholder: this.pwtwoplaceholder,
            help: this.pwtwohelp
        });

        this.pwgen = new PasswordGenerator({
            autofills: [this.pwone, this.pwtwo]
        });


        this.form = new SimpleForm({
            instructions: {
                icon: 'help-circle',
                instructions: this.instructions
            },
            elements: [
                new HiddenField({
                    name: this.name
                }),
                this.pwcurr,
                this.pwone,
                this.pwtwo,
                this.pwgen

            ],
            validator: function(self) {
                return me.runChecks(self);
            },
            handler: function(self, callback) {
                let results = {
                    success: true,
                    results: ['Your password has been changed successfully!']
                };
                callback(results);
            },
            actions: [
                new ConstructiveButton({
                    text: this.buttontext,
                    hot: true,
                    submits: true,
                    disabled: true  // No action needed.
                })
            ]

        });

    }

    /**
     * Calculate the placeholder
     * @return {string|*}
     */
    calculatePlaceholder() {
        if (this.placeholder) { return this.placeholder; }
        if (this.forceconstraints) {
            return `Must be at least ${this.minlength} characters.`;
        } else if (this.suggestedlength) {
            return `Should be at least ${this.suggestedlength} characters.`;
        }
    }


    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get container() {
        return this.form.container;
    }

    get pwonehelp() {
        if (this.config.pwonehelp) { return this.config.pwonehelp; }
        // generate
    }

    get pwoneplaceholder() {
        if (this.config.pwoneplaceholder) { return this.config.pwoneplaceholder; }
        // generate
    }

    get pwtwohelp() {
        if (this.config.pwtwohelp) { return this.config.pwtwohelp; }
        // generate
    }

    get pwtwoplaceholder() {
        if (this.config.pwtwoplaceholder) { return this.config.pwtwoplaceholder; }
        // generate
    }


    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get badpasswordhook() { return this.config.badpasswordhook; }
    set badpasswordhook(badpasswordhook) {
        if (typeof badpasswordhook !== 'function') {
            console.error("Action provided for badpasswordhook is not a function!");
        }
        this.config.badpasswordhook = badpasswordhook;
    }

    get buttontext() { return this.config.buttontext; }
    set buttontext(buttontext) { this.config.buttontext = buttontext; }

    get cannotbe() { return this.config.cannotbe; }
    set cannotbe(cannotbe) { this.config.cannotbe = cannotbe; }

    get form() {
        if (!this._form) { this.buildForm(); }
        return this._form;
    }
    set form(form) { this._form = form; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get maxlength() { return this.config.maxlength; }
    set maxlength(maxlength) { this.config.maxlength = maxlength; }

    get minlength() { return this.config.minlength; }
    set minlength(minlength) { this.config.minlength = minlength; }

    get pwactual() { return this._pwactual; }
    set pwactual(pwactual) { this._pwactual = pwactual; }

    get pwcurr() { return this._pwcurr; }
    set pwcurr(pwcurr) { this._pwcurr = pwcurr; }

    get pwgen() { return this._pwgen; }
    set pwgen(pwgen) { this._pwgen = pwgen; }


    get pwone() { return this._pwone; }
    set pwone(pwone) { this._pwone = pwone; }

    get pwtwo() { return this._pwtwo; }
    set pwtwo(pwtwo) { this._pwtwo = pwtwo; }

    get pwcurrhelp() { return this.config.pwcurrhelp; }
    set pwcurrhelp(pwcurrhelp) { this.config.pwcurrhelp = pwcurrhelp; }

    get pwcurrlabel() { return this.config.pwcurrlabel; }
    set pwcurrlabel(pwcurrlabel) { this.config.pwcurrlabel = pwcurrlabel; }

    get pwcurrplaceholder() { return this.config.pwcurrplaceholder; }
    set pwcurrplaceholder(pwcurrplaceholder) { this.config.pwcurrplaceholder = pwcurrplaceholder; }

    get pwonelabel() { return this.config.pwonelabel; }
    set pwonelabel(pwonelabel) { this.config.pwonelabel = pwonelabel; }

    get pwtwolabel() { return this.config.pwtwolabel; }
    set pwtwolabel(pwtwolabel) { this.config.pwtwolabel = pwtwolabel; }

    get suggestedlength() { return this.config.suggestedlength; }
    set suggestedlength(suggestedlength) { this.config.suggestedlength = suggestedlength; }

    get value() { return this.pwactual.val(); }
    set value(value) { this.pwactual.val(value); }

}
class TabBar {

    static get DEFAULT_CONFIG() {
        return {
            id: null, // The id
            navigation: false, // set to true if this is a navigation element, so that it wraps in a <nav /> element.
            responsive: true, // Set to false to disable responsive collapsing.
            menuicon: "menu", // the icon to use for the menu button, if in responsive mode.
            menulabel: "Toggle Menu", // Default text for the menu
            arialabel: 'Primary', // the aria label to use if this is a navigation
            vertical: false, // Vertical or horizontal
            animation: 'popin', // Set to null to disable animations
            tabs: [], // An array of tab definitions
            // {
            //    classes: [] // An array of css classes to add
                              // include "mobileonly" to only show item in mobile
            //    label: "Tab Text", // text, optional if given an icon
            //    id: null, // tab id, used with "activate(tabid)"
            //    icon: null, // an icon identifier, optional
            //    selected: false, // if true, start selected
            //    action: function(tab id, self) { } // what to do when the tab is clicked. if empty, uses default action.
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
        this.tabmap = {};
        if (!this.id) { this.id = `tabbar-${Utils.getUniqueKey(5)}`; }
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

    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the DOM.
     * @returns the container object
     */
    buildContainer() {
        const me = this;

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
            let icon,
                linktext,
                next = order + 1,
                previous = order - 1;

            if (previous < 1) {
                previous = 1;
            }
            if (next > this.tabs.length) {
                next = this.tabs.length;
            }

            if ((!tabdef.label) && (!tabdef.icon)) {
                console.warn('TabBar: Element defined but has neither icon or text.  Skipping');
                break;
            }

            if (tabdef.icon) {
                icon = IconFactory.icon(tabdef.icon);
            }
            if (tabdef.label) {
                linktext = document.createElement('span');
                linktext.innerHTML = tabdef.label;
            }

            let link = document.createElement('a');
            link.setAttribute('role', 'tab');
            link.setAttribute('aria-controls', `t-${tabdef.id}`);
            link.setAttribute('tabindex', '-1');
            link.setAttribute('data-tabno', `${order}`);
            link.setAttribute('id', tabdef.id);
            link.setAttribute('data-tabid', tabdef.id);
            if (icon) {
                link.appendChild(icon);
            }
            link.appendChild(linktext);

            link.addEventListener('keydown', function (e, previous, next, link) {
                if ((e.key === 'ArrowLeft') || (e.key === 'ArrowUp')) { // Left arrow || Up Arrow
                    e.preventDefault();
                    e.stopPropagation();
                    me.list.querySelector(`[data-tabno='${previous}']`).focus();
                } else if ((e.key === 'ArrowRight') || (e.key === 'ArrowDown')) { // Right arrow || Down Arrow
                    e.preventDefault();
                    e.stopPropagation();
                    me.list.querySelector(`[data-tabno='${next}']`).focus();
                } else if ((e.key === " ") || (e.key === "Spacebar") || (e.key === 'Enter')) { // return or space
                    link.click();
                }
            });
            link.addEventListener('click', function (e, me, tabdef) {
                e.preventDefault();
                me.select(tabdef.id);
                if ((tabdef.action) && (typeof tabdef.action === 'function')) {
                    tabdef.action(tabdef.id, me);
                } else if (me.action) {
                    me.action(tabdef.id, me);
                }
            });

            let maplink = document.createElement('li');
            maplink.setAttribute('role', 'presentation');
            maplink.appendChild(link);
            if (tabdef.classes) {
                for (let c of tabdef.classes) {
                    maplink.classList.add(c);
                }
            }

            this.tabmap[tabdef.id] = maplink;

            if (this.animation) {
                this.tabmap[tabdef.id].style.setProperty('--anim-order', `${order}`); // used in animations
                this.tabmap[tabdef.id].classList.add(this.animation);
            }

            this.list.appendChild(this.tabmap[tabdef.id]);

            order++;


            if (tabdef.selected) {
                window.setTimeout(function(me, tabdef) { // Have to wait until we're sure we're in the DOM
                    me.select(tabdef.id);
                }, 100);
            }
        }

        this.container = document.createElement('nav');
        this.container.classList.add('tablist-container');

        if (this.navigation) {
            this.container.setAttribute('role', 'navigation');
            this.container.setAttribute('aria-label', this.arialabel);
        }

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.responsive) {
            this.menubutton = new SimpleButton({
                action: function(e, self) { me.toggle(); },
                icon: this.menuicon,
                shape: 'square',
                text: this.menulable,
                classes: ['menuicon']
            });
            this.container.classList.add('responsive');
            this.container.appendChild(this.menubutton.button);
        }

        this.container.appendChild(this.list);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Let us know if the button is open
     * @return true if it is!
     */
    get isopen() {
        return this.container.hasAttribute('aria-expanded');
    }

    /* CONTROL METHODS__________________________________________________________________ */

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
        const me = this;
        if (this.isopen) { return; }
        this.container.setAttribute('aria-expanded', 'true');

        setTimeout(function() { // Set this after, or else we'll get bouncing.
            me.setCloseListener();
        }, 200);
    }

    /**
     * Closes the button
     */
    close() {
        this.container.removeAttribute('aria-expanded');
    }


    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;
        window.addEventListener('click', function(e) {
            if (e.target === me.list) {
                me.setCloseListener();
            } else {
                me.close();
            }
        }, {
            once: true,
        });
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

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

    get list() { return this._list; }
    set list(list) { this._list = list; }

    get menuicon() { return this.config.menuicon; }
    set menuicon(menuicon) { this.config.menuicon = menuicon; }

    get menulable() { return this.config.menulable; }
    set menulable(menulable) { this.config.menulable = menulable; }

    get menubutton() { return this._menubutton; }
    set menubutton(menubutton) { this._menubutton = menubutton; }

    get navigation() { return this.config.navigation; }
    set navigation(navigation) { this.config.navigation = navigation; }

    get responsive() { return this.config.responsive; }
    set responsive(responsive) { this.config.responsive = responsive; }

    get selected() { return this._selected; }
    set selected(selected) { this._selected = selected; }

    get tabmap() { return this._tabmap; }
    set tabmap(tabmap) { this._tabmap = tabmap; }

    get tabs() { return this.config.tabs; }
    set tabs(tabs) { this.config.tabs = tabs; }

    get vertical() { return this.config.vertical; }
    set vertical(vertical) { this.config.vertical = vertical; }

}


class SimpleProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], // Extra css classes to apply
            label: null, // The title
            help: null, // Help text.

            style: null, // One of a handful of styles:
                        // * roundcap : both sides of the progress bar will be round capped.
                        // * interiorroundcap : the progress bar's right side will be round capped.

            commaseparate: true, // set to false to not comma separate numbers
            currentrank: null, // A string, if present, will be displayed inside (along with minvalue)
            nextrank: null, // A string, if present, will be displayed inside (along with maxvalue)
            showcaps: true, // if true, show the min and max values.  True by default if currentrank or nextrank is set.
            decalposition: 'interior', // Where should the decals appear?
                        // * 'none' : Don't show any decals
                        // * 'exterior' : decals are drawn outside of and above the bar
                        // * 'exterior-bottom' : decals are drawn outside of and below the bar

            /*
                The meter can have a variable scale, but the width of its progressbar is absolute within
                the scale.

                Consider a progress system made of multiple progress steps, perhaps of different length
                (like a loyalty program).  Progress in the first rank is 0 - 25 points, in the second
                rank is 25 - 75, in the third is 76 - 150, and the fourth is 151 - 300.
                  - minnumber would be the start of the "rank" (ex 76 for rank 3)
                  - maxnumber would be the end of the "rank" (ex 150)
                  - value is absolute, considered along the whole sequence (0 - 300), ex 123.
             */
            maxvalue: 100, // the max value
            minvalue: 0, // the min value
            value: 50, // the current score, calculated absolute.

            width: null, // width of the progressbar to fill.  Used if provided, or else calculated from other values.
        };
    }

    /**
     * Define a SimpleProgressMeter
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleProgressMeter.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `progress-${Utils.getUniqueKey(5)}`; }
        this.determineWidth();
    }

    /* CORE METHODS_____________________________________________________________________ */

    determineWidth() {
        if (this.width) return; // use provided width

        // Figure out where value lies between minnumber and maxxnumber.
        //let pointscale = (this.steps[this.current + 1].threshold - this.steps[this.current].threshold);

        let pointscale = (this.maxvalue - this.minvalue);
        let subjectivevalue = this.value - this.minvalue;
        if (this.value < this.minvalue) {
            subjectivevalue = this.value;
        }

        this.width =  (subjectivevalue / pointscale) * 100;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the container
     */
    buildContainer() {
        const me = this;

        this.progress = document.createElement('div');
        this.progress.classList.add('progress');

        this.bar = document.createElement('div');
        this.bar.classList.add('simpleprogress');
        this.bar.classList.add(this.style);
        this.bar.appendChild(this.progress);

        this.container = document.createElement('div');
        this.container.classList.add('progressbar-container');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.label) { this.container.append(this.labelobj); }

        if (((this.currentrank) || (this.nextrank))
            && (this.decalposition) && (this.decalposition === 'exterior')) {
            this.container.appendChild(this.decallayer);
            this.bar.classList.add('exteriordecal');
        }

        this.container.append(this.bar);

        if (((this.currentrank) || (this.nextrank))
            && (this.decalposition) && (this.decalposition !== 'exterior') && (this.decalposition !== 'none')) {
            if (this.decalposition === 'exterior-bottom') {
                this.container.appendChild(this.decallayer);
                this.bar.classList.add('exteriordecal-bottom');
            } else {
                this.bar.appendChild(this.decallayer);
                this.bar.classList.add('withdecals');
            }
        }

        // Don't allow the the width animation to fire until it's in the page
        setTimeout(function() {
            me.progress.style.width = `${me.width}%`;
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
                value.innerHTML = (this.commaseparate ? Utils.readableNumber(this.minvalue) : this.minvalue);
                p.appendChild(value);
            }
            this.decallayer.append(p);
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
                value.innerHTML = (this.commaseparate ? Utils.readableNumber(this.maxvalue) : this.maxvalue);
                p.appendChild(value);
            }
            this.decallayer.appendChild(p);
        }
    }

    /**
     * Builds the label
     */
    buildLabel() {
        const me = this;
        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.innerHTML = this.label;

        if (this.help) {
            this.helpicon = new HelpButton({ help: this.help });
            this.labelobj.appendChild(this.helpicon.button);
            this.labelobj.addEventListener('onmouseover', function() {
                me.helpicon.open();
            });
            this.labelobj.addEventListener('onmouseout', function() {
                me.helpicon.close();
            });
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

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

    get width() { return this.config.width; }
    set width(width) { this.config.width = width; }
}




class RadialProgressMeter extends SimpleProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            numberposition: 'center', // where to display the badge and stinger.
                                    // Values include: center, bottomleft, bottomright, topleft, topright
            badge: null, // the large central number to show. If left empty, it will display the percentage.
            stinger: null, // A small text to display below the main badge
            size: 'medium', // Can be one of several values or metrics!
                        // Accepts: 'small', 'medium', 'large', 'huge' as strings
                        // Numbers in pixels and ems, as strings ('300px' or '5em')
                        // Or if given a number, assumes pixels
            style: 'solid', // 'solid' or 'ticks'.
                        // If set to 'ticks', disables any 'segments' value.
            segments: null, // Displays tick marks in the circle.
                        // Takes a number; this is the number of divisions. If you want segments of 10%, set it
                        // to 10.  If you want segments of 25%, set it to 4.
            strokewidth: null // If provided, the stroke will be this wide.
                            // If not provided, the width will be 5% of the circle's whole size
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
            this.actualsize = (Utils.getSingleEmInPixels() * parseInt(this.size));
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

        const me = this;

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
        let animtimer = window.setTimeout(function() {
            me.setProgress(me.value);
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
class SimpleForm {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // Component id
            name: null, // Name attribute

            /*
                Only one of 'handler' or 'url'.  If both are present, 'handler' will take precedence.
                The 'handler' can be a function or url.  If a function, it will be passed self.
                If a URL, it will be the target of an internal fetch request
             */
            handler: null, // Where to submit this form. Can be URL or function.
                           // If a function, passed self, and assumes a callback function.
            url: null, // URL to submit the form to.
            target: null, // Target attribute.  Requires a URL.

            dialog: null, // A SimpleDialog window that this form may be included in.
            enctype: null, // Encapsulation type.
            autocomplete: 'off', // Autocomplete value
            method: 'get', // Method for the form.  Also used in API calls.
            header: null, // Stuff to put at the header. This is expected to be a jQuery element

            passive: false, // Start life in "passive" mode. This will set all form elements to "passive" and hide any controls.  This also shows the "passive" instructions, if any.

            instructions: null, // Instructions configuration.  See InstructionBox.
            passiveinstructions: null, // Passive Instructions array.  Shown when the form is set to passive.

            spinnerstyle: 'spin', //
            spinnertext: '...Please Wait...', //
            results: null, // Sometimes you want to pass a form the results from a different form, like with logging out.
            classes: [], // Extra css classes to apply,
            submittors: [], // Array of elements that can submit this form.
                            // SimpleButton objects that have submits=true inside of the actions[] array
                            // are automatically added to this.  Only put elements here that are _outside_
                            // of the form and need to be connected.
            elements: [], // An array of form elements. These are the objects, not the rendered dom.
            actions: [], // An array of action elements. This are buttons or keywords.
            passiveactions: [], // An array of action elements that appear only when the form is in passive mode. This are buttons or keywords.
            handlercallback: null, // If present, the response from the handler will be passed to this
                                // instead of the internal callback. Passed self and results
                                // The internal callback expects JSON with success: true|false, and arrays of strings
                                // for results, errors, and warnings
            onsuccess: null, // What to do if the handlercallback returns success (passed self and results)
            onfailure: null, // What to do if the handlercallback returns failure (passed self and results)
            onvalid: null, // What to do when the form becomes valid (passed self)
            oninvalid: null, // What to do when the form becomes invalid (passed self),
            validator: null // validator function, passed self
        };
    }

    /**
     * Define a simple form
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleForm.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `form-${Utils.getUniqueKey(5)}`; }
    }

    /* CONTROL METHODS__________________________________________________________________ */

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
        const me = this;

        if (this.passive) { return; }

        if (this.validate()) {
            if (this.handler) {
                this.form.classList.add('shaded');

                if (typeof this.handler === 'function') {
                    this.handler(me, function(results) {
                        if ((me.handlercallback) && (typeof me.handlercallback === 'function')) {
                            me.handlercallback(me, results);
                            me.container.classList.remove('shaded');
                        } else {
                            me.handleResults(results);
                        }
                    });
                } else { // its an API url
                    this.doAjax(function(results) {
                        if ((me.handlercallback) && (typeof me.handlercallback === 'function')) {
                            me.handlercallback(me, results);
                            me.container.classList.remove('shaded');
                        } else {
                            me.handleResults(results);
                        }
                    });
                }

            } else if (this.url) {
                this.form.submit();
            } else {
                console.log(`No handler defined for form ${this.id} :: ${this.name}`);
            }
        }
    }

    /**
     * Execute an ajax call
     * @param callback the callback to fire when done
     */
    doAjax(callback) {

        // Edge is terrible and doesn't support FormData;
        //const body = new URLSearchParams(new FormData(this.form)).toString();

        let urlelements = [];
        for (let i of this.elements) {
            urlelements.push(`${i.name}=${i.value}`);
        }
        const body = urlelements.join('&');

        fetch(this.handler, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: this.method,
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
        if (this.messagebox) { this.messagebox.remove(); }
        this.messagebox = new MessageBox(results).container;
        this.headerbox.append(this.messagebox);
        this.container.classList.remove('shaded');

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
     * @return {boolean}
     */
    validate() {
        let valid = true;

        for (let element of this.elements) {
            if (element.touched) {
                let localValid = element.validate();
                if (!localValid) { valid = false; }
            } else if ((element.required) && (element.value === '')) {
                valid = false; // empty required fields
            }
        }

        if ((valid) && ((this.validator) && (typeof this.validator === 'function'))) {
            valid = this.validator(this);
        }

        if (valid) {
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
        const me = this;
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
        this.form.addEventListener('submit', function(e) {
            e.preventDefault();
            me.submit();
        });

        if ((this.handler) && (typeof this.handler !== 'function') && (this.target)) {
            this.form.setAttribute('target', this.target);
        }

        this.contentbox.appendChild(this.headerbox);
        this.contentbox.appendChild(this.elementbox);

        this.form.appendChild(this.shade);
        this.form.appendChild(this.contentbox);
        if (this.actions.length > 0) { this.form.appendChild(this.actionbox); }
        if (this.passiveactions.length > 0) { this.form.appendChild(this.passiveactionbox); }

        this.validate();

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
        this.shade = document.createElement('div');
        this.shade.classList.add('shade');

        if (this.spinnerstyle) {
            let d = document.createElement('div');
            d.classList.add('spinner');
            d.classList.add(this.spinnerstyle);
            this.shade.append(d);
        }

        if (this.spinnertext) {
            let d = document.createElement('div');
            d.classList.add('spinnertext');
            d.classList.innerHTML = this.spinnertext;
            this.shade.append(d);
        }
    }

    /**
     * Draw individual form elements
     */
    buildElementBox() {
        this.elementbox = document.createElement('div');
        this.elementbox.classList.add('elements');
        for (let element of this.elements) {
            element.form = this;
            if (element.type === 'file') {
                this.form.setAttribute('enctype', 'multipart/form-data');
            }
            if ((!element.id) && (element.name)) {
                element.id = `${this.id}-${element.name}`;
            } else if (!element.id) {
                element.id = `${this.id}-e-${Utils.getUniqueKey(5)}`;
            }
            this.addElement(element);
            this.elementbox.appendChild(element.container);
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
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

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

    get instructionbox() {
        if (!this._instructionbox) { this.buildInstructionBox(); }
        return this._instructionbox;
    }
    set instructionbox(instructionbox) { this._instructionbox = instructionbox; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get messagebox() { return this._messagebox; }
    set messagebox(messagebox) { this._messagebox = messagebox; }

    get method() { return this.config.method; }
    set method(method) { this.config.method = method; }

    get name() { return this.config.name; }
    set name(name) { this.config.name = name; }

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
