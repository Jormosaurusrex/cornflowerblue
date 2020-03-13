/*! Cornflower Blue - v0.1.1 - 2020-03-13
* http://www.gaijin.com/cornflowerblue/
* Copyright (c) 2020 Brandon Harris; Licensed MIT */
class CFBUtils {

    /* GLOBAL METHODS___________________________________________________________________ */

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
window.CFBUtils = CFBUtils;
class TextFactory {

    /**
     * This is the actual library of text.  It can be modified through other methods.
     * @private
     */
    static get _libraryBase() {
        return {
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
            "datagrid-tooltip-export": "Export all data in this grid as a comma separated value file.",
            "datagrid-tooltip-export-current_view": "Export the data in the current view as a comma separated value file.",
            "datagrid-tooltip-configure_columns": "Configure the visibility of individual columns.",
            "datagrid-tooltip-bulk_select": "Show bulk selection controls.",
            "datagrid-tooltip-filters": "Add, remove, or edit view filters.",
            "datagrid-activitynotifier-text": "Working...",
            "datagrid-column-config-instructions": "Select which columns to show in the grid. This does not hide the columns during export.",
            "datagrid-filter-instructions": "Columns that are filterable are shown below. Set the value of the column to filter it.",
            "datagrid-message-no_visible_columns": 'No columns are visible in this table.',
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
            "filter-comparator-contains": "Contains",
            "filter-comparator-notcontains": "Does not contain",
            "filter-comparator-equals": "Equals",
            "filter-comparator-doesnotequal": "Does not equal",
            "filter-comparator-isbefore": "Is before",
            "filter-comparator-isafter": "Is after",
            "filter-comparator-greaterthan": "Is greater than",
            "filter-comparator-lessthan": "Is less than",
            "filter-comparator-select_field": "Select field",
            "filter-comparator-comparator": "Comparator",
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
            "primary": 'Primary',
            "punctuation": 'Punctuation',
            "required_lc": 'required',
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
            "warning": 'Warning'
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
     * @return {*}
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
window.StateProvince = StateProvince;
class CountryCodes {

    static get MAP() {
        return {
            AF: { code: "AF", country: "Afghanistan" },
            AX: { code: "AX", country: "Åland Islands" },
            AL: { code: "AL", country: "Albania" },
            DZ: { code: "DZ", country: "Algeria" },
            AS: { code: "AS", country: "American Samoa" },
            AD: { code: "AD", country: "Andorra" },
            AO: { code: "AO", country: "Angola" },
            AI: { code: "AI", country: "Anguilla" },
            AQ: { code: "AQ", country: "Antarctica" },
            AG: { code: "AG", country: "Antigua and Barbuda" },
            AR: { code: "AR", country: "Argentina" },
            AM: { code: "AM", country: "Armenia" },
            AW: { code: "AW", country: "Aruba" },
            AU: { code: "AU", country: "Australia" },
            AT: { code: "AT", country: "Austria" },
            AZ: { code: "AZ", country: "Azerbaijan" },
            BS: { code: "BS", country: "Bahamas" },
            BH: { code: "BH", country: "Bahrain" },
            BD: { code: "BD", country: "Bangladesh" },
            BB: { code: "BB", country: "Barbados" },
            BY: { code: "BY", country: "Belarus" },
            BE: { code: "BE", country: "Belgium" },
            BZ: { code: "BZ", country: "Belize" },
            BJ: { code: "BJ", country: "Benin" },
            BM: { code: "BM", country: "Bermuda" },
            BT: { code: "BT", country: "Bhutan" },
            BO: { code: "BO", country: "Bolivia, Plurinational State of" },
            BQ: { code: "BQ", country: "Bonaire, Sint Eustatius and Saba" },
            BA: { code: "BA", country: "Bosnia and Herzegovina" },
            BW: { code: "BW", country: "Botswana" },
            BV: { code: "BV", country: "Bouvet Island" },
            BR: { code: "BR", country: "Brazil" },
            IO: { code: "IO", country: "British Indian Ocean Territory" },
            BN: { code: "BN", country: "Brunei Darussalam" },
            BG: { code: "BG", country: "Bulgaria" },
            BF: { code: "BF", country: "Burkina Faso" },
            BI: { code: "BI", country: "Burundi" },
            KH: { code: "KH", country: "Cambodia" },
            CM: { code: "CM", country: "Cameroon" },
            CA: { code: "CA", country: "Canada" },
            CV: { code: "CV", country: "Cape Verde" },
            KY: { code: "KY", country: "Cayman Islands" },
            CF: { code: "CF", country: "Central African Republic" },
            TD: { code: "TD", country: "Chad" },
            CL: { code: "CL", country: "Chile" },
            CN: { code: "CN", country: "China" },
            CX: { code: "CX", country: "Christmas Island" },
            CC: { code: "CC", country: "Cocos (Keeling) Islands" },
            CO: { code: "CO", country: "Colombia" },
            KM: { code: "KM", country: "Comoros" },
            CG: { code: "CG", country: "Congo" },
            CD: { code: "CD", country: "Congo, the Democratic Republic of the" },
            CK: { code: "CK", country: "Cook Islands" },
            CR: { code: "CR", country: "Costa Rica" },
            CI: { code: "CI", country: "Côte d'Ivoire" },
            HR: { code: "HR", country: "Croatia" },
            CU: { code: "CU", country: "Cuba" },
            CW: { code: "CW", country: "Curaçao" },
            CY: { code: "CY", country: "Cyprus" },
            CZ: { code: "CZ", country: "Czech Republic" },
            DK: { code: "DK", country: "Denmark" },
            DJ: { code: "DJ", country: "Djibouti" },
            DM: { code: "DM", country: "Dominica" },
            DO: { code: "DO", country: "Dominican Republic" },
            EC: { code: "EC", country: "Ecuador" },
            EG: { code: "EG", country: "Egypt" },
            SV: { code: "SV", country: "El Salvador" },
            GQ: { code: "GQ", country: "Equatorial Guinea" },
            ER: { code: "ER", country: "Eritrea" },
            EE: { code: "EE", country: "Estonia" },
            ET: { code: "ET", country: "Ethiopia" },
            FK: { code: "FK", country: "Falkland Islands (Malvinas)" },
            FO: { code: "FO", country: "Faroe Islands" },
            FJ: { code: "FJ", country: "Fiji" },
            FI: { code: "FI", country: "Finland" },
            FR: { code: "FR", country: "France" },
            GF: { code: "GF", country: "French Guiana" },
            PF: { code: "PF", country: "French Polynesia" },
            TF: { code: "TF", country: "French Southern Territories" },
            GA: { code: "GA", country: "Gabon" },
            GM: { code: "GM", country: "Gambia" },
            GE: { code: "GE", country: "Georgia" },
            DE: { code: "DE", country: "Germany" },
            GH: { code: "GH", country: "Ghana" },
            GI: { code: "GI", country: "Gibraltar" },
            GR: { code: "GR", country: "Greece" },
            GL: { code: "GL", country: "Greenland" },
            GD: { code: "GD", country: "Grenada" },
            GP: { code: "GP", country: "Guadeloupe" },
            GU: { code: "GU", country: "Guam" },
            GT: { code: "GT", country: "Guatemala" },
            GG: { code: "GG", country: "Guernsey" },
            GN: { code: "GN", country: "Guinea" },
            GW: { code: "GW", country: "Guinea-Bissau" },
            GY: { code: "GY", country: "Guyana" },
            HT: { code: "HT", country: "Haiti" },
            HM: { code: "HM", country: "Heard Island and McDonald Islands" },
            VA: { code: "VA", country: "Holy See (Vatican City State)" },
            HN: { code: "HN", country: "Honduras" },
            HK: { code: "HK", country: "Hong Kong" },
            HU: { code: "HU", country: "Hungary" },
            IS: { code: "IS", country: "Iceland" },
            IN: { code: "IN", country: "India" },
            ID: { code: "ID", country: "Indonesia" },
            IR: { code: "IR", country: "Iran, Islamic Republic of" },
            IQ: { code: "IQ", country: "Iraq" },
            IE: { code: "IE", country: "Ireland" },
            IM: { code: "IM", country: "Isle of Man" },
            IL: { code: "IL", country: "Israel" },
            IT: { code: "IT", country: "Italy" },
            JM: { code: "JM", country: "Jamaica" },
            JP: { code: "JP", country: "Japan" },
            JE: { code: "JE", country: "Jersey" },
            JO: { code: "JO", country: "Jordan" },
            KZ: { code: "KZ", country: "Kazakhstan" },
            KE: { code: "KE", country: "Kenya" },
            KI: { code: "KI", country: "Kiribati" },
            KP: { code: "KP", country: "Korea, Democratic People's Republic of" },
            KR: { code: "KR", country: "Korea, Republic of" },
            KW: { code: "KW", country: "Kuwait" },
            KG: { code: "KG", country: "Kyrgyzstan" },
            LA: { code: "LA", country: "Lao People's Democratic Republic" },
            LV: { code: "LV", country: "Latvia" },
            LB: { code: "LB", country: "Lebanon" },
            LS: { code: "LS", country: "Lesotho" },
            LR: { code: "LR", country: "Liberia" },
            LY: { code: "LY", country: "Libya" },
            LI: { code: "LI", country: "Liechtenstein" },
            LT: { code: "LT", country: "Lithuania" },
            LU: { code: "LU", country: "Luxembourg" },
            MO: { code: "MO", country: "Macao" },
            MK: { code: "MK", country: "Macedonia, the Former Yugoslav Republic of" },
            MG: { code: "MG", country: "Madagascar" },
            MW: { code: "MW", country: "Malawi" },
            MY: { code: "MY", country: "Malaysia" },
            MV: { code: "MV", country: "Maldives" },
            ML: { code: "ML", country: "Mali" },
            MT: { code: "MT", country: "Malta" },
            MH: { code: "MH", country: "Marshall Islands" },
            MQ: { code: "MQ", country: "Martinique" },
            MR: { code: "MR", country: "Mauritania" },
            MU: { code: "MU", country: "Mauritius" },
            YT: { code: "YT", country: "Mayotte" },
            MX: { code: "MX", country: "Mexico" },
            FM: { code: "FM", country: "Micronesia, Federated States of" },
            MD: { code: "MD", country: "Moldova, Republic of" },
            MC: { code: "MC", country: "Monaco" },
            MN: { code: "MN", country: "Mongolia" },
            ME: { code: "ME", country: "Montenegro" },
            MS: { code: "MS", country: "Montserrat" },
            MA: { code: "MA", country: "Morocco" },
            MZ: { code: "MZ", country: "Mozambique" },
            MM: { code: "MM", country: "Myanmar" },
            NA: { code: "NA", country: "Namibia" },
            NR: { code: "NR", country: "Nauru" },
            NP: { code: "NP", country: "Nepal" },
            NL: { code: "NL", country: "Netherlands" },
            NC: { code: "NC", country: "New Caledonia" },
            NZ: { code: "NZ", country: "New Zealand" },
            NI: { code: "NI", country: "Nicaragua" },
            NE: { code: "NE", country: "Niger" },
            NG: { code: "NG", country: "Nigeria" },
            NU: { code: "NU", country: "Niue" },
            NF: { code: "NF", country: "Norfolk Island" },
            MP: { code: "MP", country: "Northern Mariana Islands" },
            NO: { code: "NO", country: "Norway" },
            OM: { code: "OM", country: "Oman" },
            PK: { code: "PK", country: "Pakistan" },
            PW: { code: "PW", country: "Palau" },
            PS: { code: "PS", country: "Palestine, State of" },
            PA: { code: "PA", country: "Panama" },
            PG: { code: "PG", country: "Papua New Guinea" },
            PY: { code: "PY", country: "Paraguay" },
            PE: { code: "PE", country: "Peru" },
            PH: { code: "PH", country: "Philippines" },
            PN: { code: "PN", country: "Pitcairn" },
            PL: { code: "PL", country: "Poland" },
            PT: { code: "PT", country: "Portugal" },
            PR: { code: "PR", country: "Puerto Rico" },
            QA: { code: "QA", country: "Qatar" },
            RE: { code: "RE", country: "Réunion" },
            RO: { code: "RO", country: "Romania" },
            RU: { code: "RU", country: "Russian Federation" },
            RW: { code: "RW", country: "Rwanda" },
            BL: { code: "BL", country: "Saint Barthélemy" },
            SH: { code: "SH", country: "Saint Helena, Ascension and Tristan da Cunha" },
            KN: { code: "KN", country: "Saint Kitts and Nevis" },
            LC: { code: "LC", country: "Saint Lucia" },
            MF: { code: "MF", country: "Saint Martin (French part)" },
            PM: { code: "PM", country: "Saint Pierre and Miquelon" },
            VC: { code: "VC", country: "Saint Vincent and the Grenadines" },
            WS: { code: "WS", country: "Samoa" },
            SM: { code: "SM", country: "San Marino" },
            ST: { code: "ST", country: "Sao Tome and Principe" },
            SA: { code: "SA", country: "Saudi Arabia" },
            SN: { code: "SN", country: "Senegal" },
            RS: { code: "RS", country: "Serbia" },
            SC: { code: "SC", country: "Seychelles" },
            SL: { code: "SL", country: "Sierra Leone" },
            SG: { code: "SG", country: "Singapore" },
            SX: { code: "SX", country: "Sint Maarten (Dutch part)" },
            SK: { code: "SK", country: "Slovakia" },
            SI: { code: "SI", country: "Slovenia" },
            SB: { code: "SB", country: "Solomon Islands" },
            SO: { code: "SO", country: "Somalia" },
            ZA: { code: "ZA", country: "South Africa" },
            GS: { code: "GS", country: "South Georgia and the South Sandwich Islands" },
            SS: { code: "SS", country: "South Sudan" },
            ES: { code: "ES", country: "Spain" },
            LK: { code: "LK", country: "Sri Lanka" },
            SD: { code: "SD", country: "Sudan" },
            SR: { code: "SR", country: "Suriname" },
            SJ: { code: "SJ", country: "Svalbard and Jan Mayen" },
            SZ: { code: "SZ", country: "Swaziland" },
            SE: { code: "SE", country: "Sweden" },
            CH: { code: "CH", country: "Switzerland" },
            SY: { code: "SY", country: "Syrian Arab Republic" },
            TW: { code: "TW", country: "Taiwan, Province of China" },
            TJ: { code: "TJ", country: "Tajikistan" },
            TZ: { code: "TZ", country: "Tanzania, United Republic of" },
            TH: { code: "TH", country: "Thailand" },
            TL: { code: "TL", country: "Timor-Leste" },
            TG: { code: "TG", country: "Togo" },
            TK: { code: "TK", country: "Tokelau" },
            TO: { code: "TO", country: "Tonga" },
            TT: { code: "TT", country: "Trinidad and Tobago" },
            TN: { code: "TN", country: "Tunisia" },
            TR: { code: "TR", country: "Turkey" },
            TM: { code: "TM", country: "Turkmenistan" },
            TC: { code: "TC", country: "Turks and Caicos Islands" },
            TV: { code: "TV", country: "Tuvalu" },
            UG: { code: "UG", country: "Uganda" },
            UA: { code: "UA", country: "Ukraine" },
            AE: { code: "AE", country: "United Arab Emirates" },
            GB: { code: "GB", country: "United Kingdom" },
            US: { code: "US", country: "United States" },
            UM: { code: "UM", country: "United States Minor Outlying Islands" },
            UY: { code: "UY", country: "Uruguay" },
            UZ: { code: "UZ", country: "Uzbekistan" },
            VU: { code: "VU", country: "Vanuatu" },
            VE: { code: "VE", country: "Venezuela, Bolivarian Republic of" },
            VN: { code: "VN", country: "Viet Nam" },
            VG: { code: "VG", country: "Virgin Islands, British" },
            VI: { code: "VI", country: "Virgin Islands, U.S." },
            WF: { code: "WF", country: "Wallis and Futuna" },
            EH: { code: "EH", country: "Western Sahara" },
            YE: { code: "YE", country: "Yemen" },
            ZM: { code: "ZM", country: "Zambia" },
            ZW: { code: "ZW", country: "Zimbabwe" }
        }
    }

    /**
     * Get a specific country by the code
     * @param code the code to get
     * @return {*} the country definition, or null
     */
    static get(code) {
        return CountryCodes.MAP[code];
    }

    /**
     * Get a list of countries
     * @return {Array} an array of country object definitions
     */
    static list() {
        let list = [];
        for (let c of Object.values(CountryCodes.MAP)) {
            list.push(c);
        }
        list.sort(function(a,b){
            if (a.country > b.country) { return 1 }
            if (a.country < b.country) { return -1 }
            return 0;
        });
        return list;
    }

}
window.CountryCodes = CountryCodes;
class TimezoneDB {

    /**
     * Get the dictionary of the timezones.
     * @return a dictionary.
     */
    static get MAP() {
        return {
            "Asia/Kabul": { id: "Asia/Kabul", countrycode: "AF", country: "Afghanistan", tz: "Asia/Kabul", offset: "UTC +04:30" },
            "Europe/Tirane": { id: "Europe/Tirane", countrycode: "AL", country: "Albania", tz: "Europe/Tirane", offset: "UTC +01:00" },
            "Africa/Algiers": { id: "Africa/Algiers", countrycode: "DZ", country: "Algeria", tz: "Africa/Algiers", offset: "UTC +01:00" },
            "Pacific/Pago_Pago": { id: "Pacific/Pago_Pago", countrycode: "AS", country: "American Samoa", tz: "Pacific/Pago_Pago", offset: "UTC -11:00" },
            "Europe/Andorra": { id: "Europe/Andorra", countrycode: "AD", country: "Andorra", tz: "Europe/Andorra", offset: "UTC +01:00" },
            "Africa/Luanda": { id: "Africa/Luanda", countrycode: "AO", country: "Angola", tz: "Africa/Luanda", offset: "UTC +01:00" },
            "America/Anguilla": { id: "America/Anguilla", countrycode: "AI", country: "Anguilla", tz: "America/Anguilla", offset: "UTC -04:00" },
            "Antarctica/Casey": { id: "Antarctica/Casey", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/Casey", offset: "UTC +08:00" },
            "Antarctica/Davis": { id: "Antarctica/Davis", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/Davis", offset: "UTC +07:00" },
            "Antarctica/DumontDUrville": { id: "Antarctica/DumontDUrville", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/DumontDUrville", offset: "UTC +10:00" },
            "Antarctica/Mawson": { id: "Antarctica/Mawson", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/Mawson", offset: "UTC +05:00" },
            "Antarctica/McMurdo": { id: "Antarctica/McMurdo", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/McMurdo", offset: "UTC +13:00" },
            "Antarctica/Palmer": { id: "Antarctica/Palmer", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/Palmer", offset: "UTC -03:00" },
            "Antarctica/Rothera": { id: "Antarctica/Rothera", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/Rothera", offset: "UTC -03:00" },
            "Antarctica/Syowa": { id: "Antarctica/Syowa", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/Syowa", offset: "UTC +03:00" },
            "Antarctica/Troll": { id: "Antarctica/Troll", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/Troll", offset: "UTC" },
            "Antarctica/Vostok": { id: "Antarctica/Vostok", countrycode: "AQ", country: "Antarctica", tz: "Antarctica/Vostok", offset: "UTC +06:00" },
            "America/Antigua": { id: "America/Antigua", countrycode: "AG", country: "Antigua and Barbuda", tz: "America/Antigua", offset: "UTC -04:00" },
            "America/Argentina/Buenos_Aires": { id: "America/Argentina/Buenos_Aires", countrycode: "AR", country: "Argentina", tz: "America/Argentina/Buenos_Aires", offset: "UTC -03:00" },
            "America/Argentina/Catamarca": { id: "America/Argentina/Catamarca", countrycode: "AR", country: "Argentina", tz: "America/Argentina/Catamarca", offset: "UTC -03:00" },
            "America/Argentina/Cordoba": { id: "America/Argentina/Cordoba", countrycode: "AR", country: "Argentina", tz: "America/Argentina/Cordoba", offset: "UTC -03:00" },
            "America/Argentina/Jujuy": { id: "America/Argentina/Jujuy", countrycode: "AR", country: "Argentina", tz: "America/Argentina/Jujuy", offset: "UTC -03:00" },
            "America/Argentina/La_Rioja": { id: "America/Argentina/La_Rioja", countrycode: "AR", country: "Argentina", tz: "America/Argentina/La_Rioja", offset: "UTC -03:00" },
            "America/Argentina/Mendoza": { id: "America/Argentina/Mendoza", countrycode: "AR", country: "Argentina", tz: "America/Argentina/Mendoza", offset: "UTC -03:00" },
            "America/Argentina/Rio_Gallegos": { id: "America/Argentina/Rio_Gallegos", countrycode: "AR", country: "Argentina", tz: "America/Argentina/Rio_Gallegos", offset: "UTC -03:00" },
            "America/Argentina/Salta": { id: "America/Argentina/Salta", countrycode: "AR", country: "Argentina", tz: "America/Argentina/Salta", offset: "UTC -03:00" },
            "America/Argentina/San_Juan": { id: "America/Argentina/San_Juan", countrycode: "AR", country: "Argentina", tz: "America/Argentina/San_Juan", offset: "UTC -03:00" },
            "America/Argentina/San_Luis": { id: "America/Argentina/San_Luis", countrycode: "AR", country: "Argentina", tz: "America/Argentina/San_Luis", offset: "UTC -03:00" },
            "America/Argentina/Tucuman": { id: "America/Argentina/Tucuman", countrycode: "AR", country: "Argentina", tz: "America/Argentina/Tucuman", offset: "UTC -03:00" },
            "America/Argentina/Ushuaia": { id: "America/Argentina/Ushuaia", countrycode: "AR", country: "Argentina", tz: "America/Argentina/Ushuaia", offset: "UTC -03:00" },
            "Asia/Yerevan": { id: "Asia/Yerevan", countrycode: "AM", country: "Armenia", tz: "Asia/Yerevan", offset: "UTC +04:00" },
            "America/Aruba": { id: "America/Aruba", countrycode: "AW", country: "Aruba", tz: "America/Aruba", offset: "UTC -04:00" },
            "Antarctica/Macquarie": { id: "Antarctica/Macquarie", countrycode: "AU", country: "Australia", tz: "Antarctica/Macquarie", offset: "UTC +11:00" },
            "Australia/Adelaide": { id: "Australia/Adelaide", countrycode: "AU", country: "Australia", tz: "Australia/Adelaide", offset: "UTC +10:30" },
            "Australia/Brisbane": { id: "Australia/Brisbane", countrycode: "AU", country: "Australia", tz: "Australia/Brisbane", offset: "UTC +10:00" },
            "Australia/Broken_Hill": { id: "Australia/Broken_Hill", countrycode: "AU", country: "Australia", tz: "Australia/Broken_Hill", offset: "UTC +10:30" },
            "Australia/Currie": { id: "Australia/Currie", countrycode: "AU", country: "Australia", tz: "Australia/Currie", offset: "UTC +11:00" },
            "Australia/Darwin": { id: "Australia/Darwin", countrycode: "AU", country: "Australia", tz: "Australia/Darwin", offset: "UTC +09:30" },
            "Australia/Eucla": { id: "Australia/Eucla", countrycode: "AU", country: "Australia", tz: "Australia/Eucla", offset: "UTC +08:45" },
            "Australia/Hobart": { id: "Australia/Hobart", countrycode: "AU", country: "Australia", tz: "Australia/Hobart", offset: "UTC +11:00" },
            "Australia/Lindeman": { id: "Australia/Lindeman", countrycode: "AU", country: "Australia", tz: "Australia/Lindeman", offset: "UTC +10:00" },
            "Australia/Lord_Howe": { id: "Australia/Lord_Howe", countrycode: "AU", country: "Australia", tz: "Australia/Lord_Howe", offset: "UTC +11:00" },
            "Australia/Melbourne": { id: "Australia/Melbourne", countrycode: "AU", country: "Australia", tz: "Australia/Melbourne", offset: "UTC +11:00" },
            "Australia/Perth": { id: "Australia/Perth", countrycode: "AU", country: "Australia", tz: "Australia/Perth", offset: "UTC +08:00" },
            "Australia/Sydney": { id: "Australia/Sydney", countrycode: "AU", country: "Australia", tz: "Australia/Sydney", offset: "UTC +11:00" },
            "Europe/Vienna": { id: "Europe/Vienna", countrycode: "AT", country: "Austria", tz: "Europe/Vienna", offset: "UTC +01:00" },
            "Asia/Baku": { id: "Asia/Baku", countrycode: "AZ", country: "Azerbaijan", tz: "Asia/Baku", offset: "UTC +04:00" },
            "America/Nassau": { id: "America/Nassau", countrycode: "BS", country: "Bahamas", tz: "America/Nassau", offset: "UTC -05:00" },
            "Asia/Bahrain": { id: "Asia/Bahrain", countrycode: "BH", country: "Bahrain", tz: "Asia/Bahrain", offset: "UTC +03:00" },
            "Asia/Dhaka": { id: "Asia/Dhaka", countrycode: "BD", country: "Bangladesh", tz: "Asia/Dhaka", offset: "UTC +06:00" },
            "America/Barbados": { id: "America/Barbados", countrycode: "BB", country: "Barbados", tz: "America/Barbados", offset: "UTC -04:00" },
            "Europe/Minsk": { id: "Europe/Minsk", countrycode: "BY", country: "Belarus", tz: "Europe/Minsk", offset: "UTC +03:00" },
            "Europe/Brussels": { id: "Europe/Brussels", countrycode: "BE", country: "Belgium", tz: "Europe/Brussels", offset: "UTC +01:00" },
            "America/Belize": { id: "America/Belize", countrycode: "BZ", country: "Belize", tz: "America/Belize", offset: "UTC -06:00" },
            "Africa/Porto-Novo": { id: "Africa/Porto-Novo", countrycode: "BJ", country: "Benin", tz: "Africa/Porto-Novo", offset: "UTC +01:00" },
            "Atlantic/Bermuda": { id: "Atlantic/Bermuda", countrycode: "BM", country: "Bermuda", tz: "Atlantic/Bermuda", offset: "UTC -04:00" },
            "Asia/Thimphu": { id: "Asia/Thimphu", countrycode: "BT", country: "Bhutan", tz: "Asia/Thimphu", offset: "UTC +06:00" },
            "America/La_Paz": { id: "America/La_Paz", countrycode: "BO", country: "Bolivia, Plurinational State of", tz: "America/La_Paz", offset: "UTC -04:00" },
            "America/Kralendijk": { id: "America/Kralendijk", countrycode: "BQ", country: "Bonaire, Sint Eustatius and Saba", tz: "America/Kralendijk", offset: "UTC -04:00" },
            "Europe/Sarajevo": { id: "Europe/Sarajevo", countrycode: "BA", country: "Bosnia and Herzegovina", tz: "Europe/Sarajevo", offset: "UTC +01:00" },
            "Africa/Gaborone": { id: "Africa/Gaborone", countrycode: "BW", country: "Botswana", tz: "Africa/Gaborone", offset: "UTC +02:00" },
            "America/Araguaina": { id: "America/Araguaina", countrycode: "BR", country: "Brazil", tz: "America/Araguaina", offset: "UTC -03:00" },
            "America/Bahia": { id: "America/Bahia", countrycode: "BR", country: "Brazil", tz: "America/Bahia", offset: "UTC -03:00" },
            "America/Belem": { id: "America/Belem", countrycode: "BR", country: "Brazil", tz: "America/Belem", offset: "UTC -03:00" },
            "America/Boa_Vista": { id: "America/Boa_Vista", countrycode: "BR", country: "Brazil", tz: "America/Boa_Vista", offset: "UTC -04:00" },
            "America/Campo_Grande": { id: "America/Campo_Grande", countrycode: "BR", country: "Brazil", tz: "America/Campo_Grande", offset: "UTC -04:00" },
            "America/Cuiaba": { id: "America/Cuiaba", countrycode: "BR", country: "Brazil", tz: "America/Cuiaba", offset: "UTC -04:00" },
            "America/Eirunepe": { id: "America/Eirunepe", countrycode: "BR", country: "Brazil", tz: "America/Eirunepe", offset: "UTC -05:00" },
            "America/Fortaleza": { id: "America/Fortaleza", countrycode: "BR", country: "Brazil", tz: "America/Fortaleza", offset: "UTC -03:00" },
            "America/Maceio": { id: "America/Maceio", countrycode: "BR", country: "Brazil", tz: "America/Maceio", offset: "UTC -03:00" },
            "America/Manaus": { id: "America/Manaus", countrycode: "BR", country: "Brazil", tz: "America/Manaus", offset: "UTC -04:00" },
            "America/Noronha": { id: "America/Noronha", countrycode: "BR", country: "Brazil", tz: "America/Noronha", offset: "UTC -02:00" },
            "America/Porto_Velho": { id: "America/Porto_Velho", countrycode: "BR", country: "Brazil", tz: "America/Porto_Velho", offset: "UTC -04:00" },
            "America/Recife": { id: "America/Recife", countrycode: "BR", country: "Brazil", tz: "America/Recife", offset: "UTC -03:00" },
            "America/Rio_Branco": { id: "America/Rio_Branco", countrycode: "BR", country: "Brazil", tz: "America/Rio_Branco", offset: "UTC -05:00" },
            "America/Santarem": { id: "America/Santarem", countrycode: "BR", country: "Brazil", tz: "America/Santarem", offset: "UTC -03:00" },
            "America/Sao_Paulo": { id: "America/Sao_Paulo", countrycode: "BR", country: "Brazil", tz: "America/Sao_Paulo", offset: "UTC -03:00" },
            "Indian/Chagos": { id: "Indian/Chagos", countrycode: "IO", country: "British Indian Ocean Territory", tz: "Indian/Chagos", offset: "UTC +06:00" },
            "Asia/Brunei": { id: "Asia/Brunei", countrycode: "BN", country: "Brunei Darussalam", tz: "Asia/Brunei", offset: "UTC +08:00" },
            "Europe/Sofia": { id: "Europe/Sofia", countrycode: "BG", country: "Bulgaria", tz: "Europe/Sofia", offset: "UTC +02:00" },
            "Africa/Ouagadougou": { id: "Africa/Ouagadougou", countrycode: "BF", country: "Burkina Faso", tz: "Africa/Ouagadougou", offset: "UTC" },
            "Africa/Bujumbura": { id: "Africa/Bujumbura", countrycode: "BI", country: "Burundi", tz: "Africa/Bujumbura", offset: "UTC +02:00" },
            "Asia/Phnom_Penh": { id: "Asia/Phnom_Penh", countrycode: "KH", country: "Cambodia", tz: "Asia/Phnom_Penh", offset: "UTC +07:00" },
            "Africa/Douala": { id: "Africa/Douala", countrycode: "CM", country: "Cameroon", tz: "Africa/Douala", offset: "UTC +01:00" },
            "America/Atikokan": { id: "America/Atikokan", countrycode: "CA", country: "Canada", tz: "America/Atikokan", offset: "UTC -05:00" },
            "America/Blanc-Sablon": { id: "America/Blanc-Sablon", countrycode: "CA", country: "Canada", tz: "America/Blanc-Sablon", offset: "UTC -04:00" },
            "America/Cambridge_Bay": { id: "America/Cambridge_Bay", countrycode: "CA", country: "Canada", tz: "America/Cambridge_Bay", offset: "UTC -07:00" },
            "America/Creston": { id: "America/Creston", countrycode: "CA", country: "Canada", tz: "America/Creston", offset: "UTC -07:00" },
            "America/Dawson": { id: "America/Dawson", countrycode: "CA", country: "Canada", tz: "America/Dawson", offset: "UTC -08:00" },
            "America/Dawson_Creek": { id: "America/Dawson_Creek", countrycode: "CA", country: "Canada", tz: "America/Dawson_Creek", offset: "UTC -07:00" },
            "America/Edmonton": { id: "America/Edmonton", countrycode: "CA", country: "Canada", tz: "America/Edmonton", offset: "UTC -07:00" },
            "America/Fort_Nelson": { id: "America/Fort_Nelson", countrycode: "CA", country: "Canada", tz: "America/Fort_Nelson", offset: "UTC -07:00" },
            "America/Glace_Bay": { id: "America/Glace_Bay", countrycode: "CA", country: "Canada", tz: "America/Glace_Bay", offset: "UTC -04:00" },
            "America/Goose_Bay": { id: "America/Goose_Bay", countrycode: "CA", country: "Canada", tz: "America/Goose_Bay", offset: "UTC -04:00" },
            "America/Halifax": { id: "America/Halifax", countrycode: "CA", country: "Canada", tz: "America/Halifax", offset: "UTC -04:00" },
            "America/Inuvik": { id: "America/Inuvik", countrycode: "CA", country: "Canada", tz: "America/Inuvik", offset: "UTC -07:00" },
            "America/Iqaluit": { id: "America/Iqaluit", countrycode: "CA", country: "Canada", tz: "America/Iqaluit", offset: "UTC -05:00" },
            "America/Moncton": { id: "America/Moncton", countrycode: "CA", country: "Canada", tz: "America/Moncton", offset: "UTC -04:00" },
            "America/Nipigon": { id: "America/Nipigon", countrycode: "CA", country: "Canada", tz: "America/Nipigon", offset: "UTC -05:00" },
            "America/Pangnirtung": { id: "America/Pangnirtung", countrycode: "CA", country: "Canada", tz: "America/Pangnirtung", offset: "UTC -05:00" },
            "America/Rainy_River": { id: "America/Rainy_River", countrycode: "CA", country: "Canada", tz: "America/Rainy_River", offset: "UTC -06:00" },
            "America/Rankin_Inlet": { id: "America/Rankin_Inlet", countrycode: "CA", country: "Canada", tz: "America/Rankin_Inlet", offset: "UTC -06:00" },
            "America/Regina": { id: "America/Regina", countrycode: "CA", country: "Canada", tz: "America/Regina", offset: "UTC -06:00" },
            "America/Resolute": { id: "America/Resolute", countrycode: "CA", country: "Canada", tz: "America/Resolute", offset: "UTC -06:00" },
            "America/St_Johns": { id: "America/St_Johns", countrycode: "CA", country: "Canada", tz: "America/St_Johns", offset: "UTC -03:30" },
            "America/Swift_Current": { id: "America/Swift_Current", countrycode: "CA", country: "Canada", tz: "America/Swift_Current", offset: "UTC -06:00" },
            "America/Thunder_Bay": { id: "America/Thunder_Bay", countrycode: "CA", country: "Canada", tz: "America/Thunder_Bay", offset: "UTC -05:00" },
            "America/Toronto": { id: "America/Toronto", countrycode: "CA", country: "Canada", tz: "America/Toronto", offset: "UTC -05:00" },
            "America/Vancouver": { id: "America/Vancouver", countrycode: "CA", country: "Canada", tz: "America/Vancouver", offset: "UTC -08:00" },
            "America/Whitehorse": { id: "America/Whitehorse", countrycode: "CA", country: "Canada", tz: "America/Whitehorse", offset: "UTC -08:00" },
            "America/Winnipeg": { id: "America/Winnipeg", countrycode: "CA", country: "Canada", tz: "America/Winnipeg", offset: "UTC -06:00" },
            "America/Yellowknife": { id: "America/Yellowknife", countrycode: "CA", country: "Canada", tz: "America/Yellowknife", offset: "UTC -07:00" },
            "Atlantic/Cape_Verde": { id: "Atlantic/Cape_Verde", countrycode: "CV", country: "Cape Verde", tz: "Atlantic/Cape_Verde", offset: "UTC -01:00" },
            "America/Cayman": { id: "America/Cayman", countrycode: "KY", country: "Cayman Islands", tz: "America/Cayman", offset: "UTC -05:00" },
            "Africa/Bangui": { id: "Africa/Bangui", countrycode: "CF", country: "Central African Republic", tz: "Africa/Bangui", offset: "UTC +01:00" },
            "Africa/Ndjamena": { id: "Africa/Ndjamena", countrycode: "TD", country: "Chad", tz: "Africa/Ndjamena", offset: "UTC +01:00" },
            "America/Punta_Arenas": { id: "America/Punta_Arenas", countrycode: "CL", country: "Chile", tz: "America/Punta_Arenas", offset: "UTC -03:00" },
            "America/Santiago": { id: "America/Santiago", countrycode: "CL", country: "Chile", tz: "America/Santiago", offset: "UTC -03:00" },
            "Pacific/Easter": { id: "Pacific/Easter", countrycode: "CL", country: "Chile", tz: "Pacific/Easter", offset: "UTC -05:00" },
            "Asia/Shanghai": { id: "Asia/Shanghai", countrycode: "CN", country: "China", tz: "Asia/Shanghai", offset: "UTC +08:00" },
            "Asia/Urumqi": { id: "Asia/Urumqi", countrycode: "CN", country: "China", tz: "Asia/Urumqi", offset: "UTC +06:00" },
            "Indian/Christmas": { id: "Indian/Christmas", countrycode: "CX", country: "Christmas Island", tz: "Indian/Christmas", offset: "UTC +07:00" },
            "Indian/Cocos": { id: "Indian/Cocos", countrycode: "CC", country: "Cocos (Keeling) Islands", tz: "Indian/Cocos", offset: "UTC +06:30" },
            "America/Bogota": { id: "America/Bogota", countrycode: "CO", country: "Colombia", tz: "America/Bogota", offset: "UTC -05:00" },
            "Indian/Comoro": { id: "Indian/Comoro", countrycode: "KM", country: "Comoros", tz: "Indian/Comoro", offset: "UTC +03:00" },
            "Africa/Brazzaville": { id: "Africa/Brazzaville", countrycode: "CG", country: "Congo", tz: "Africa/Brazzaville", offset: "UTC +01:00" },
            "Africa/Kinshasa": { id: "Africa/Kinshasa", countrycode: "CD", country: "Congo, the Democratic Republic of the", tz: "Africa/Kinshasa", offset: "UTC +01:00" },
            "Africa/Lubumbashi": { id: "Africa/Lubumbashi", countrycode: "CD", country: "Congo, the Democratic Republic of the", tz: "Africa/Lubumbashi", offset: "UTC +02:00" },
            "Pacific/Rarotonga": { id: "Pacific/Rarotonga", countrycode: "CK", country: "Cook Islands", tz: "Pacific/Rarotonga", offset: "UTC -10:00" },
            "America/Costa_Rica": { id: "America/Costa_Rica", countrycode: "CR", country: "Costa Rica", tz: "America/Costa_Rica", offset: "UTC -06:00" },
            "Europe/Zagreb": { id: "Europe/Zagreb", countrycode: "HR", country: "Croatia", tz: "Europe/Zagreb", offset: "UTC +01:00" },
            "America/Havana": { id: "America/Havana", countrycode: "CU", country: "Cuba", tz: "America/Havana", offset: "UTC -05:00" },
            "America/Curacao": { id: "America/Curacao", countrycode: "CW", country: "Curaçao", tz: "America/Curacao", offset: "UTC -04:00" },
            "Asia/Famagusta": { id: "Asia/Famagusta", countrycode: "CY", country: "Cyprus", tz: "Asia/Famagusta", offset: "UTC +02:00" },
            "Asia/Nicosia": { id: "Asia/Nicosia", countrycode: "CY", country: "Cyprus", tz: "Asia/Nicosia", offset: "UTC +02:00" },
            "Europe/Prague": { id: "Europe/Prague", countrycode: "CZ", country: "Czech Republic", tz: "Europe/Prague", offset: "UTC +01:00" },
            "Africa/Abidjan": { id: "Africa/Abidjan", countrycode: "CI", country: "Côte d'Ivoire", tz: "Africa/Abidjan", offset: "UTC" },
            "Europe/Copenhagen": { id: "Europe/Copenhagen", countrycode: "DK", country: "Denmark", tz: "Europe/Copenhagen", offset: "UTC +01:00" },
            "Africa/Djibouti": { id: "Africa/Djibouti", countrycode: "DJ", country: "Djibouti", tz: "Africa/Djibouti", offset: "UTC +03:00" },
            "America/Dominica": { id: "America/Dominica", countrycode: "DM", country: "Dominica", tz: "America/Dominica", offset: "UTC -04:00" },
            "America/Santo_Domingo": { id: "America/Santo_Domingo", countrycode: "DO", country: "Dominican Republic", tz: "America/Santo_Domingo", offset: "UTC -04:00" },
            "America/Guayaquil": { id: "America/Guayaquil", countrycode: "EC", country: "Ecuador", tz: "America/Guayaquil", offset: "UTC -05:00" },
            "Pacific/Galapagos": { id: "Pacific/Galapagos", countrycode: "EC", country: "Ecuador", tz: "Pacific/Galapagos", offset: "UTC -06:00" },
            "Africa/Cairo": { id: "Africa/Cairo", countrycode: "EG", country: "Egypt", tz: "Africa/Cairo", offset: "UTC +02:00" },
            "America/El_Salvador": { id: "America/El_Salvador", countrycode: "SV", country: "El Salvador", tz: "America/El_Salvador", offset: "UTC -06:00" },
            "Africa/Malabo": { id: "Africa/Malabo", countrycode: "GQ", country: "Equatorial Guinea", tz: "Africa/Malabo", offset: "UTC +01:00" },
            "Africa/Asmara": { id: "Africa/Asmara", countrycode: "ER", country: "Eritrea", tz: "Africa/Asmara", offset: "UTC +03:00" },
            "Europe/Tallinn": { id: "Europe/Tallinn", countrycode: "EE", country: "Estonia", tz: "Europe/Tallinn", offset: "UTC +02:00" },
            "Africa/Addis_Ababa": { id: "Africa/Addis_Ababa", countrycode: "ET", country: "Ethiopia", tz: "Africa/Addis_Ababa", offset: "UTC +03:00" },
            "Atlantic/Stanley": { id: "Atlantic/Stanley", countrycode: "FK", country: "Falkland Islands (Malvinas)", tz: "Atlantic/Stanley", offset: "UTC -03:00" },
            "Atlantic/Faroe": { id: "Atlantic/Faroe", countrycode: "FO", country: "Faroe Islands", tz: "Atlantic/Faroe", offset: "UTC" },
            "Pacific/Fiji": { id: "Pacific/Fiji", countrycode: "FJ", country: "Fiji", tz: "Pacific/Fiji", offset: "UTC +12:00" },
            "Europe/Helsinki": { id: "Europe/Helsinki", countrycode: "FI", country: "Finland", tz: "Europe/Helsinki", offset: "UTC +02:00" },
            "Europe/Paris": { id: "Europe/Paris", countrycode: "FR", country: "France", tz: "Europe/Paris", offset: "UTC +01:00" },
            "America/Cayenne": { id: "America/Cayenne", countrycode: "GF", country: "French Guiana", tz: "America/Cayenne", offset: "UTC -03:00" },
            "Pacific/Gambier": { id: "Pacific/Gambier", countrycode: "PF", country: "French Polynesia", tz: "Pacific/Gambier", offset: "UTC -09:00" },
            "Pacific/Marquesas": { id: "Pacific/Marquesas", countrycode: "PF", country: "French Polynesia", tz: "Pacific/Marquesas", offset: "UTC -09:30" },
            "Pacific/Tahiti": { id: "Pacific/Tahiti", countrycode: "PF", country: "French Polynesia", tz: "Pacific/Tahiti", offset: "UTC -10:00" },
            "Indian/Kerguelen": { id: "Indian/Kerguelen", countrycode: "TF", country: "French Southern Territories", tz: "Indian/Kerguelen", offset: "UTC +05:00" },
            "Africa/Libreville": { id: "Africa/Libreville", countrycode: "GA", country: "Gabon", tz: "Africa/Libreville", offset: "UTC +01:00" },
            "Africa/Banjul": { id: "Africa/Banjul", countrycode: "GM", country: "Gambia", tz: "Africa/Banjul", offset: "UTC" },
            "Asia/Tbilisi": { id: "Asia/Tbilisi", countrycode: "GE", country: "Georgia", tz: "Asia/Tbilisi", offset: "UTC +04:00" },
            "Europe/Berlin": { id: "Europe/Berlin", countrycode: "DE", country: "Germany", tz: "Europe/Berlin", offset: "UTC +01:00" },
            "Europe/Busingen": { id: "Europe/Busingen", countrycode: "DE", country: "Germany", tz: "Europe/Busingen", offset: "UTC +01:00" },
            "Africa/Accra": { id: "Africa/Accra", countrycode: "GH", country: "Ghana", tz: "Africa/Accra", offset: "UTC" },
            "Europe/Gibraltar": { id: "Europe/Gibraltar", countrycode: "GI", country: "Gibraltar", tz: "Europe/Gibraltar", offset: "UTC +01:00" },
            "Europe/Athens": { id: "Europe/Athens", countrycode: "GR", country: "Greece", tz: "Europe/Athens", offset: "UTC +02:00" },
            "America/Danmarkshavn": { id: "America/Danmarkshavn", countrycode: "GL", country: "Greenland", tz: "America/Danmarkshavn", offset: "UTC" },
            "America/Godthab": { id: "America/Godthab", countrycode: "GL", country: "Greenland", tz: "America/Godthab", offset: "UTC -03:00" },
            "America/Scoresbysund": { id: "America/Scoresbysund", countrycode: "GL", country: "Greenland", tz: "America/Scoresbysund", offset: "UTC -01:00" },
            "America/Thule": { id: "America/Thule", countrycode: "GL", country: "Greenland", tz: "America/Thule", offset: "UTC -04:00" },
            "America/Grenada": { id: "America/Grenada", countrycode: "GD", country: "Grenada", tz: "America/Grenada", offset: "UTC -04:00" },
            "America/Guadeloupe": { id: "America/Guadeloupe", countrycode: "GP", country: "Guadeloupe", tz: "America/Guadeloupe", offset: "UTC -04:00" },
            "Pacific/Guam": { id: "Pacific/Guam", countrycode: "GU", country: "Guam", tz: "Pacific/Guam", offset: "UTC +10:00" },
            "America/Guatemala": { id: "America/Guatemala", countrycode: "GT", country: "Guatemala", tz: "America/Guatemala", offset: "UTC -06:00" },
            "Europe/Guernsey": { id: "Europe/Guernsey", countrycode: "GG", country: "Guernsey", tz: "Europe/Guernsey", offset: "UTC" },
            "Africa/Conakry": { id: "Africa/Conakry", countrycode: "GN", country: "Guinea", tz: "Africa/Conakry", offset: "UTC" },
            "Africa/Bissau": { id: "Africa/Bissau", countrycode: "GW", country: "Guinea-Bissau", tz: "Africa/Bissau", offset: "UTC" },
            "America/Guyana": { id: "America/Guyana", countrycode: "GY", country: "Guyana", tz: "America/Guyana", offset: "UTC -04:00" },
            "America/Port-au-Prince": { id: "America/Port-au-Prince", countrycode: "HT", country: "Haiti", tz: "America/Port-au-Prince", offset: "UTC -05:00" },
            "Europe/Vatican": { id: "Europe/Vatican", countrycode: "VA", country: "Holy See (Vatican City State)", tz: "Europe/Vatican", offset: "UTC +01:00" },
            "America/Tegucigalpa": { id: "America/Tegucigalpa", countrycode: "HN", country: "Honduras", tz: "America/Tegucigalpa", offset: "UTC -06:00" },
            "Asia/Hong_Kong": { id: "Asia/Hong_Kong", countrycode: "HK", country: "Hong Kong", tz: "Asia/Hong_Kong", offset: "UTC +08:00" },
            "Europe/Budapest": { id: "Europe/Budapest", countrycode: "HU", country: "Hungary", tz: "Europe/Budapest", offset: "UTC +01:00" },
            "Atlantic/Reykjavik": { id: "Atlantic/Reykjavik", countrycode: "IS", country: "Iceland", tz: "Atlantic/Reykjavik", offset: "UTC" },
            "Asia/Kolkata": { id: "Asia/Kolkata", countrycode: "IN", country: "India", tz: "Asia/Kolkata", offset: "UTC +05:30" },
            "Asia/Jakarta": { id: "Asia/Jakarta", countrycode: "ID", country: "Indonesia", tz: "Asia/Jakarta", offset: "UTC +07:00" },
            "Asia/Jayapura": { id: "Asia/Jayapura", countrycode: "ID", country: "Indonesia", tz: "Asia/Jayapura", offset: "UTC +09:00" },
            "Asia/Makassar": { id: "Asia/Makassar", countrycode: "ID", country: "Indonesia", tz: "Asia/Makassar", offset: "UTC +08:00" },
            "Asia/Pontianak": { id: "Asia/Pontianak", countrycode: "ID", country: "Indonesia", tz: "Asia/Pontianak", offset: "UTC +07:00" },
            "Asia/Tehran": { id: "Asia/Tehran", countrycode: "IR", country: "Iran, Islamic Republic of", tz: "Asia/Tehran", offset: "UTC +03:30" },
            "Asia/Baghdad": { id: "Asia/Baghdad", countrycode: "IQ", country: "Iraq", tz: "Asia/Baghdad", offset: "UTC +03:00" },
            "Europe/Dublin": { id: "Europe/Dublin", countrycode: "IE", country: "Ireland", tz: "Europe/Dublin", offset: "UTC" },
            "Europe/Isle_of_Man": { id: "Europe/Isle_of_Man", countrycode: "IM", country: "Isle of Man", tz: "Europe/Isle_of_Man", offset: "UTC" },
            "Asia/Jerusalem": { id: "Asia/Jerusalem", countrycode: "IL", country: "Israel", tz: "Asia/Jerusalem", offset: "UTC +02:00" },
            "Europe/Rome": { id: "Europe/Rome", countrycode: "IT", country: "Italy", tz: "Europe/Rome", offset: "UTC +01:00" },
            "America/Jamaica": { id: "America/Jamaica", countrycode: "JM", country: "Jamaica", tz: "America/Jamaica", offset: "UTC -05:00" },
            "Asia/Tokyo": { id: "Asia/Tokyo", countrycode: "JP", country: "Japan", tz: "Asia/Tokyo", offset: "UTC +09:00" },
            "Europe/Jersey": { id: "Europe/Jersey", countrycode: "JE", country: "Jersey", tz: "Europe/Jersey", offset: "UTC" },
            "Asia/Amman": { id: "Asia/Amman", countrycode: "JO", country: "Jordan", tz: "Asia/Amman", offset: "UTC +02:00" },
            "Asia/Almaty": { id: "Asia/Almaty", countrycode: "KZ", country: "Kazakhstan", tz: "Asia/Almaty", offset: "UTC +06:00" },
            "Asia/Aqtau": { id: "Asia/Aqtau", countrycode: "KZ", country: "Kazakhstan", tz: "Asia/Aqtau", offset: "UTC +05:00" },
            "Asia/Aqtobe": { id: "Asia/Aqtobe", countrycode: "KZ", country: "Kazakhstan", tz: "Asia/Aqtobe", offset: "UTC +05:00" },
            "Asia/Atyrau": { id: "Asia/Atyrau", countrycode: "KZ", country: "Kazakhstan", tz: "Asia/Atyrau", offset: "UTC +05:00" },
            "Asia/Oral": { id: "Asia/Oral", countrycode: "KZ", country: "Kazakhstan", tz: "Asia/Oral", offset: "UTC +05:00" },
            "Asia/Qostanay": { id: "Asia/Qostanay", countrycode: "KZ", country: "Kazakhstan", tz: "Asia/Qostanay", offset: "UTC +06:00" },
            "Asia/Qyzylorda": { id: "Asia/Qyzylorda", countrycode: "KZ", country: "Kazakhstan", tz: "Asia/Qyzylorda", offset: "UTC +05:00" },
            "Africa/Nairobi": { id: "Africa/Nairobi", countrycode: "KE", country: "Kenya", tz: "Africa/Nairobi", offset: "UTC +03:00" },
            "Pacific/Enderbury": { id: "Pacific/Enderbury", countrycode: "KI", country: "Kiribati", tz: "Pacific/Enderbury", offset: "UTC +13:00" },
            "Pacific/Kiritimati": { id: "Pacific/Kiritimati", countrycode: "KI", country: "Kiribati", tz: "Pacific/Kiritimati", offset: "UTC +14:00" },
            "Pacific/Tarawa": { id: "Pacific/Tarawa", countrycode: "KI", country: "Kiribati", tz: "Pacific/Tarawa", offset: "UTC +12:00" },
            "Asia/Pyongyang": { id: "Asia/Pyongyang", countrycode: "KP", country: "Korea, Democratic People's Republic of", tz: "Asia/Pyongyang", offset: "UTC +09:00" },
            "Asia/Seoul": { id: "Asia/Seoul", countrycode: "KR", country: "Korea, Republic of", tz: "Asia/Seoul", offset: "UTC +09:00" },
            "Asia/Kuwait": { id: "Asia/Kuwait", countrycode: "KW", country: "Kuwait", tz: "Asia/Kuwait", offset: "UTC +03:00" },
            "Asia/Bishkek": { id: "Asia/Bishkek", countrycode: "KG", country: "Kyrgyzstan", tz: "Asia/Bishkek", offset: "UTC +06:00" },
            "Asia/Vientiane": { id: "Asia/Vientiane", countrycode: "LA", country: "Lao People's Democratic Republic", tz: "Asia/Vientiane", offset: "UTC +07:00" },
            "Europe/Riga": { id: "Europe/Riga", countrycode: "LV", country: "Latvia", tz: "Europe/Riga", offset: "UTC +02:00" },
            "Asia/Beirut": { id: "Asia/Beirut", countrycode: "LB", country: "Lebanon", tz: "Asia/Beirut", offset: "UTC +02:00" },
            "Africa/Maseru": { id: "Africa/Maseru", countrycode: "LS", country: "Lesotho", tz: "Africa/Maseru", offset: "UTC +02:00" },
            "Africa/Monrovia": { id: "Africa/Monrovia", countrycode: "LR", country: "Liberia", tz: "Africa/Monrovia", offset: "UTC" },
            "Africa/Tripoli": { id: "Africa/Tripoli", countrycode: "LY", country: "Libya", tz: "Africa/Tripoli", offset: "UTC +02:00" },
            "Europe/Vaduz": { id: "Europe/Vaduz", countrycode: "LI", country: "Liechtenstein", tz: "Europe/Vaduz", offset: "UTC +01:00" },
            "Europe/Vilnius": { id: "Europe/Vilnius", countrycode: "LT", country: "Lithuania", tz: "Europe/Vilnius", offset: "UTC +02:00" },
            "Europe/Luxembourg": { id: "Europe/Luxembourg", countrycode: "LU", country: "Luxembourg", tz: "Europe/Luxembourg", offset: "UTC +01:00" },
            "Asia/Macau": { id: "Asia/Macau", countrycode: "MO", country: "Macao", tz: "Asia/Macau", offset: "UTC +08:00" },
            "Europe/Skopje": { id: "Europe/Skopje", countrycode: "MK", country: "Macedonia, the Former Yugoslav Republic of", tz: "Europe/Skopje", offset: "UTC +01:00" },
            "Indian/Antananarivo": { id: "Indian/Antananarivo", countrycode: "MG", country: "Madagascar", tz: "Indian/Antananarivo", offset: "UTC +03:00" },
            "Africa/Blantyre": { id: "Africa/Blantyre", countrycode: "MW", country: "Malawi", tz: "Africa/Blantyre", offset: "UTC +02:00" },
            "Asia/Kuala_Lumpur": { id: "Asia/Kuala_Lumpur", countrycode: "MY", country: "Malaysia", tz: "Asia/Kuala_Lumpur", offset: "UTC +08:00" },
            "Asia/Kuching": { id: "Asia/Kuching", countrycode: "MY", country: "Malaysia", tz: "Asia/Kuching", offset: "UTC +08:00" },
            "Indian/Maldives": { id: "Indian/Maldives", countrycode: "MV", country: "Maldives", tz: "Indian/Maldives", offset: "UTC +05:00" },
            "Africa/Bamako": { id: "Africa/Bamako", countrycode: "ML", country: "Mali", tz: "Africa/Bamako", offset: "UTC" },
            "Europe/Malta": { id: "Europe/Malta", countrycode: "MT", country: "Malta", tz: "Europe/Malta", offset: "UTC +01:00" },
            "Pacific/Kwajalein": { id: "Pacific/Kwajalein", countrycode: "MH", country: "Marshall Islands", tz: "Pacific/Kwajalein", offset: "UTC +12:00" },
            "Pacific/Majuro": { id: "Pacific/Majuro", countrycode: "MH", country: "Marshall Islands", tz: "Pacific/Majuro", offset: "UTC +12:00" },
            "America/Martinique": { id: "America/Martinique", countrycode: "MQ", country: "Martinique", tz: "America/Martinique", offset: "UTC -04:00" },
            "Africa/Nouakchott": { id: "Africa/Nouakchott", countrycode: "MR", country: "Mauritania", tz: "Africa/Nouakchott", offset: "UTC" },
            "Indian/Mauritius": { id: "Indian/Mauritius", countrycode: "MU", country: "Mauritius", tz: "Indian/Mauritius", offset: "UTC +04:00" },
            "Indian/Mayotte": { id: "Indian/Mayotte", countrycode: "YT", country: "Mayotte", tz: "Indian/Mayotte", offset: "UTC +03:00" },
            "America/Bahia_Banderas": { id: "America/Bahia_Banderas", countrycode: "MX", country: "Mexico", tz: "America/Bahia_Banderas", offset: "UTC -06:00" },
            "America/Cancun": { id: "America/Cancun", countrycode: "MX", country: "Mexico", tz: "America/Cancun", offset: "UTC -05:00" },
            "America/Chihuahua": { id: "America/Chihuahua", countrycode: "MX", country: "Mexico", tz: "America/Chihuahua", offset: "UTC -07:00" },
            "America/Hermosillo": { id: "America/Hermosillo", countrycode: "MX", country: "Mexico", tz: "America/Hermosillo", offset: "UTC -07:00" },
            "America/Matamoros": { id: "America/Matamoros", countrycode: "MX", country: "Mexico", tz: "America/Matamoros", offset: "UTC -06:00" },
            "America/Mazatlan": { id: "America/Mazatlan", countrycode: "MX", country: "Mexico", tz: "America/Mazatlan", offset: "UTC -07:00" },
            "America/Merida": { id: "America/Merida", countrycode: "MX", country: "Mexico", tz: "America/Merida", offset: "UTC -06:00" },
            "America/Mexico_City": { id: "America/Mexico_City", countrycode: "MX", country: "Mexico", tz: "America/Mexico_City", offset: "UTC -06:00" },
            "America/Monterrey": { id: "America/Monterrey", countrycode: "MX", country: "Mexico", tz: "America/Monterrey", offset: "UTC -06:00" },
            "America/Ojinaga": { id: "America/Ojinaga", countrycode: "MX", country: "Mexico", tz: "America/Ojinaga", offset: "UTC -07:00" },
            "America/Tijuana": { id: "America/Tijuana", countrycode: "MX", country: "Mexico", tz: "America/Tijuana", offset: "UTC -08:00" },
            "Pacific/Chuuk": { id: "Pacific/Chuuk", countrycode: "FM", country: "Micronesia, Federated States of", tz: "Pacific/Chuuk", offset: "UTC +10:00" },
            "Pacific/Kosrae": { id: "Pacific/Kosrae", countrycode: "FM", country: "Micronesia, Federated States of", tz: "Pacific/Kosrae", offset: "UTC +11:00" },
            "Pacific/Pohnpei": { id: "Pacific/Pohnpei", countrycode: "FM", country: "Micronesia, Federated States of", tz: "Pacific/Pohnpei", offset: "UTC +11:00" },
            "Europe/Chisinau": { id: "Europe/Chisinau", countrycode: "MD", country: "Moldova, Republic of", tz: "Europe/Chisinau", offset: "UTC +02:00" },
            "Europe/Monaco": { id: "Europe/Monaco", countrycode: "MC", country: "Monaco", tz: "Europe/Monaco", offset: "UTC +01:00" },
            "Asia/Choibalsan": { id: "Asia/Choibalsan", countrycode: "MN", country: "Mongolia", tz: "Asia/Choibalsan", offset: "UTC +08:00" },
            "Asia/Hovd": { id: "Asia/Hovd", countrycode: "MN", country: "Mongolia", tz: "Asia/Hovd", offset: "UTC +07:00" },
            "Asia/Ulaanbaatar": { id: "Asia/Ulaanbaatar", countrycode: "MN", country: "Mongolia", tz: "Asia/Ulaanbaatar", offset: "UTC +08:00" },
            "Europe/Podgorica": { id: "Europe/Podgorica", countrycode: "ME", country: "Montenegro", tz: "Europe/Podgorica", offset: "UTC +01:00" },
            "America/Montserrat": { id: "America/Montserrat", countrycode: "MS", country: "Montserrat", tz: "America/Montserrat", offset: "UTC -04:00" },
            "Africa/Casablanca": { id: "Africa/Casablanca", countrycode: "MA", country: "Morocco", tz: "Africa/Casablanca", offset: "UTC +01:00" },
            "Africa/Maputo": { id: "Africa/Maputo", countrycode: "MZ", country: "Mozambique", tz: "Africa/Maputo", offset: "UTC +02:00" },
            "Asia/Yangon": { id: "Asia/Yangon", countrycode: "MM", country: "Myanmar", tz: "Asia/Yangon", offset: "UTC +06:30" },
            "Africa/Windhoek": { id: "Africa/Windhoek", countrycode: "NA", country: "Namibia", tz: "Africa/Windhoek", offset: "UTC +02:00" },
            "Pacific/Nauru": { id: "Pacific/Nauru", countrycode: "NR", country: "Nauru", tz: "Pacific/Nauru", offset: "UTC +12:00" },
            "Asia/Kathmandu": { id: "Asia/Kathmandu", countrycode: "NP", country: "Nepal", tz: "Asia/Kathmandu", offset: "UTC +05:45" },
            "Europe/Amsterdam": { id: "Europe/Amsterdam", countrycode: "NL", country: "Netherlands", tz: "Europe/Amsterdam", offset: "UTC +01:00" },
            "Pacific/Noumea": { id: "Pacific/Noumea", countrycode: "NC", country: "New Caledonia", tz: "Pacific/Noumea", offset: "UTC +11:00" },
            "Pacific/Auckland": { id: "Pacific/Auckland", countrycode: "NZ", country: "New Zealand", tz: "Pacific/Auckland", offset: "UTC +13:00" },
            "Pacific/Chatham": { id: "Pacific/Chatham", countrycode: "NZ", country: "New Zealand", tz: "Pacific/Chatham", offset: "UTC +13:45" },
            "America/Managua": { id: "America/Managua", countrycode: "NI", country: "Nicaragua", tz: "America/Managua", offset: "UTC -06:00" },
            "Africa/Niamey": { id: "Africa/Niamey", countrycode: "NE", country: "Niger", tz: "Africa/Niamey", offset: "UTC +01:00" },
            "Africa/Lagos": { id: "Africa/Lagos", countrycode: "NG", country: "Nigeria", tz: "Africa/Lagos", offset: "UTC +01:00" },
            "Pacific/Niue": { id: "Pacific/Niue", countrycode: "NU", country: "Niue", tz: "Pacific/Niue", offset: "UTC -11:00" },
            "Pacific/Norfolk": { id: "Pacific/Norfolk", countrycode: "NF", country: "Norfolk Island", tz: "Pacific/Norfolk", offset: "UTC +12:00" },
            "Pacific/Saipan": { id: "Pacific/Saipan", countrycode: "MP", country: "Northern Mariana Islands", tz: "Pacific/Saipan", offset: "UTC +10:00" },
            "Europe/Oslo": { id: "Europe/Oslo", countrycode: "NO", country: "Norway", tz: "Europe/Oslo", offset: "UTC +01:00" },
            "Asia/Muscat": { id: "Asia/Muscat", countrycode: "OM", country: "Oman", tz: "Asia/Muscat", offset: "UTC +04:00" },
            "Asia/Karachi": { id: "Asia/Karachi", countrycode: "PK", country: "Pakistan", tz: "Asia/Karachi", offset: "UTC +05:00" },
            "Pacific/Palau": { id: "Pacific/Palau", countrycode: "PW", country: "Palau", tz: "Pacific/Palau", offset: "UTC +09:00" },
            "Asia/Gaza": { id: "Asia/Gaza", countrycode: "PS", country: "Palestine, State of", tz: "Asia/Gaza", offset: "UTC +02:00" },
            "Asia/Hebron": { id: "Asia/Hebron", countrycode: "PS", country: "Palestine, State of", tz: "Asia/Hebron", offset: "UTC +02:00" },
            "America/Panama": { id: "America/Panama", countrycode: "PA", country: "Panama", tz: "America/Panama", offset: "UTC -05:00" },
            "Pacific/Bougainville": { id: "Pacific/Bougainville", countrycode: "PG", country: "Papua New Guinea", tz: "Pacific/Bougainville", offset: "UTC +11:00" },
            "Pacific/Port_Moresby": { id: "Pacific/Port_Moresby", countrycode: "PG", country: "Papua New Guinea", tz: "Pacific/Port_Moresby", offset: "UTC +10:00" },
            "America/Asuncion": { id: "America/Asuncion", countrycode: "PY", country: "Paraguay", tz: "America/Asuncion", offset: "UTC -03:00" },
            "America/Lima": { id: "America/Lima", countrycode: "PE", country: "Peru", tz: "America/Lima", offset: "UTC -05:00" },
            "Asia/Manila": { id: "Asia/Manila", countrycode: "PH", country: "Philippines", tz: "Asia/Manila", offset: "UTC +08:00" },
            "Pacific/Pitcairn": { id: "Pacific/Pitcairn", countrycode: "PN", country: "Pitcairn", tz: "Pacific/Pitcairn", offset: "UTC -08:00" },
            "Europe/Warsaw": { id: "Europe/Warsaw", countrycode: "PL", country: "Poland", tz: "Europe/Warsaw", offset: "UTC +01:00" },
            "Atlantic/Azores": { id: "Atlantic/Azores", countrycode: "PT", country: "Portugal", tz: "Atlantic/Azores", offset: "UTC -01:00" },
            "Atlantic/Madeira": { id: "Atlantic/Madeira", countrycode: "PT", country: "Portugal", tz: "Atlantic/Madeira", offset: "UTC" },
            "Europe/Lisbon": { id: "Europe/Lisbon", countrycode: "PT", country: "Portugal", tz: "Europe/Lisbon", offset: "UTC" },
            "America/Puerto_Rico": { id: "America/Puerto_Rico", countrycode: "PR", country: "Puerto Rico", tz: "America/Puerto_Rico", offset: "UTC -04:00" },
            "Asia/Qatar": { id: "Asia/Qatar", countrycode: "QA", country: "Qatar", tz: "Asia/Qatar", offset: "UTC +03:00" },
            "Europe/Bucharest": { id: "Europe/Bucharest", countrycode: "RO", country: "Romania", tz: "Europe/Bucharest", offset: "UTC +02:00" },
            "Asia/Anadyr": { id: "Asia/Anadyr", countrycode: "RU", country: "Russian Federation", tz: "Asia/Anadyr", offset: "UTC +12:00" },
            "Asia/Barnaul": { id: "Asia/Barnaul", countrycode: "RU", country: "Russian Federation", tz: "Asia/Barnaul", offset: "UTC +07:00" },
            "Asia/Chita": { id: "Asia/Chita", countrycode: "RU", country: "Russian Federation", tz: "Asia/Chita", offset: "UTC +09:00" },
            "Asia/Irkutsk": { id: "Asia/Irkutsk", countrycode: "RU", country: "Russian Federation", tz: "Asia/Irkutsk", offset: "UTC +08:00" },
            "Asia/Kamchatka": { id: "Asia/Kamchatka", countrycode: "RU", country: "Russian Federation", tz: "Asia/Kamchatka", offset: "UTC +12:00" },
            "Asia/Khandyga": { id: "Asia/Khandyga", countrycode: "RU", country: "Russian Federation", tz: "Asia/Khandyga", offset: "UTC +09:00" },
            "Asia/Krasnoyarsk": { id: "Asia/Krasnoyarsk", countrycode: "RU", country: "Russian Federation", tz: "Asia/Krasnoyarsk", offset: "UTC +07:00" },
            "Asia/Magadan": { id: "Asia/Magadan", countrycode: "RU", country: "Russian Federation", tz: "Asia/Magadan", offset: "UTC +11:00" },
            "Asia/Novokuznetsk": { id: "Asia/Novokuznetsk", countrycode: "RU", country: "Russian Federation", tz: "Asia/Novokuznetsk", offset: "UTC +07:00" },
            "Asia/Novosibirsk": { id: "Asia/Novosibirsk", countrycode: "RU", country: "Russian Federation", tz: "Asia/Novosibirsk", offset: "UTC +07:00" },
            "Asia/Omsk": { id: "Asia/Omsk", countrycode: "RU", country: "Russian Federation", tz: "Asia/Omsk", offset: "UTC +06:00" },
            "Asia/Sakhalin": { id: "Asia/Sakhalin", countrycode: "RU", country: "Russian Federation", tz: "Asia/Sakhalin", offset: "UTC +11:00" },
            "Asia/Srednekolymsk": { id: "Asia/Srednekolymsk", countrycode: "RU", country: "Russian Federation", tz: "Asia/Srednekolymsk", offset: "UTC +11:00" },
            "Asia/Tomsk": { id: "Asia/Tomsk", countrycode: "RU", country: "Russian Federation", tz: "Asia/Tomsk", offset: "UTC +07:00" },
            "Asia/Ust-Nera": { id: "Asia/Ust-Nera", countrycode: "RU", country: "Russian Federation", tz: "Asia/Ust-Nera", offset: "UTC +10:00" },
            "Asia/Vladivostok": { id: "Asia/Vladivostok", countrycode: "RU", country: "Russian Federation", tz: "Asia/Vladivostok", offset: "UTC +10:00" },
            "Asia/Yakutsk": { id: "Asia/Yakutsk", countrycode: "RU", country: "Russian Federation", tz: "Asia/Yakutsk", offset: "UTC +09:00" },
            "Asia/Yekaterinburg": { id: "Asia/Yekaterinburg", countrycode: "RU", country: "Russian Federation", tz: "Asia/Yekaterinburg", offset: "UTC +05:00" },
            "Europe/Astrakhan": { id: "Europe/Astrakhan", countrycode: "RU", country: "Russian Federation", tz: "Europe/Astrakhan", offset: "UTC +04:00" },
            "Europe/Kaliningrad": { id: "Europe/Kaliningrad", countrycode: "RU", country: "Russian Federation", tz: "Europe/Kaliningrad", offset: "UTC +02:00" },
            "Europe/Kirov": { id: "Europe/Kirov", countrycode: "RU", country: "Russian Federation", tz: "Europe/Kirov", offset: "UTC +03:00" },
            "Europe/Moscow": { id: "Europe/Moscow", countrycode: "RU", country: "Russian Federation", tz: "Europe/Moscow", offset: "UTC +03:00" },
            "Europe/Samara": { id: "Europe/Samara", countrycode: "RU", country: "Russian Federation", tz: "Europe/Samara", offset: "UTC +04:00" },
            "Europe/Saratov": { id: "Europe/Saratov", countrycode: "RU", country: "Russian Federation", tz: "Europe/Saratov", offset: "UTC +04:00" },
            "Europe/Ulyanovsk": { id: "Europe/Ulyanovsk", countrycode: "RU", country: "Russian Federation", tz: "Europe/Ulyanovsk", offset: "UTC +04:00" },
            "Europe/Volgograd": { id: "Europe/Volgograd", countrycode: "RU", country: "Russian Federation", tz: "Europe/Volgograd", offset: "UTC +04:00" },
            "Africa/Kigali": { id: "Africa/Kigali", countrycode: "RW", country: "Rwanda", tz: "Africa/Kigali", offset: "UTC +02:00" },
            "Indian/Reunion": { id: "Indian/Reunion", countrycode: "RE", country: "Réunion", tz: "Indian/Reunion", offset: "UTC +04:00" },
            "America/St_Barthelemy": { id: "America/St_Barthelemy", countrycode: "BL", country: "Saint Barthélemy", tz: "America/St_Barthelemy", offset: "UTC -04:00" },
            "Atlantic/St_Helena": { id: "Atlantic/St_Helena", countrycode: "SH", country: "Saint Helena, Ascension and Tristan da Cunha", tz: "Atlantic/St_Helena", offset: "UTC" },
            "America/St_Kitts": { id: "America/St_Kitts", countrycode: "KN", country: "Saint Kitts and Nevis", tz: "America/St_Kitts", offset: "UTC -04:00" },
            "America/St_Lucia": { id: "America/St_Lucia", countrycode: "LC", country: "Saint Lucia", tz: "America/St_Lucia", offset: "UTC -04:00" },
            "America/Marigot": { id: "America/Marigot", countrycode: "MF", country: "Saint Martin (French part)", tz: "America/Marigot", offset: "UTC -04:00" },
            "America/Miquelon": { id: "America/Miquelon", countrycode: "PM", country: "Saint Pierre and Miquelon", tz: "America/Miquelon", offset: "UTC -03:00" },
            "America/St_Vincent": { id: "America/St_Vincent", countrycode: "VC", country: "Saint Vincent and the Grenadines", tz: "America/St_Vincent", offset: "UTC -04:00" },
            "Pacific/Apia": { id: "Pacific/Apia", countrycode: "WS", country: "Samoa", tz: "Pacific/Apia", offset: "UTC +14:00" },
            "Europe/San_Marino": { id: "Europe/San_Marino", countrycode: "SM", country: "San Marino", tz: "Europe/San_Marino", offset: "UTC +01:00" },
            "Africa/Sao_Tome": { id: "Africa/Sao_Tome", countrycode: "ST", country: "Sao Tome and Principe", tz: "Africa/Sao_Tome", offset: "UTC" },
            "Asia/Riyadh": { id: "Asia/Riyadh", countrycode: "SA", country: "Saudi Arabia", tz: "Asia/Riyadh", offset: "UTC +03:00" },
            "Africa/Dakar": { id: "Africa/Dakar", countrycode: "SN", country: "Senegal", tz: "Africa/Dakar", offset: "UTC" },
            "Europe/Belgrade": { id: "Europe/Belgrade", countrycode: "RS", country: "Serbia", tz: "Europe/Belgrade", offset: "UTC +01:00" },
            "Indian/Mahe": { id: "Indian/Mahe", countrycode: "SC", country: "Seychelles", tz: "Indian/Mahe", offset: "UTC +04:00" },
            "Africa/Freetown": { id: "Africa/Freetown", countrycode: "SL", country: "Sierra Leone", tz: "Africa/Freetown", offset: "UTC" },
            "Asia/Singapore": { id: "Asia/Singapore", countrycode: "SG", country: "Singapore", tz: "Asia/Singapore", offset: "UTC +08:00" },
            "America/Lower_Princes": { id: "America/Lower_Princes", countrycode: "SX", country: "Sint Maarten (Dutch part)", tz: "America/Lower_Princes", offset: "UTC -04:00" },
            "Europe/Bratislava": { id: "Europe/Bratislava", countrycode: "SK", country: "Slovakia", tz: "Europe/Bratislava", offset: "UTC +01:00" },
            "Europe/Ljubljana": { id: "Europe/Ljubljana", countrycode: "SI", country: "Slovenia", tz: "Europe/Ljubljana", offset: "UTC +01:00" },
            "Pacific/Guadalcanal": { id: "Pacific/Guadalcanal", countrycode: "SB", country: "Solomon Islands", tz: "Pacific/Guadalcanal", offset: "UTC +11:00" },
            "Africa/Mogadishu": { id: "Africa/Mogadishu", countrycode: "SO", country: "Somalia", tz: "Africa/Mogadishu", offset: "UTC +03:00" },
            "Africa/Johannesburg": { id: "Africa/Johannesburg", countrycode: "ZA", country: "South Africa", tz: "Africa/Johannesburg", offset: "UTC +02:00" },
            "Atlantic/South_Georgia": { id: "Atlantic/South_Georgia", countrycode: "GS", country: "South Georgia and the South Sandwich Islands", tz: "Atlantic/South_Georgia", offset: "UTC -02:00" },
            "Africa/Juba": { id: "Africa/Juba", countrycode: "SS", country: "South Sudan", tz: "Africa/Juba", offset: "UTC +03:00" },
            "Africa/Ceuta": { id: "Africa/Ceuta", countrycode: "ES", country: "Spain", tz: "Africa/Ceuta", offset: "UTC +01:00" },
            "Atlantic/Canary": { id: "Atlantic/Canary", countrycode: "ES", country: "Spain", tz: "Atlantic/Canary", offset: "UTC" },
            "Europe/Madrid": { id: "Europe/Madrid", countrycode: "ES", country: "Spain", tz: "Europe/Madrid", offset: "UTC +01:00" },
            "Asia/Colombo": { id: "Asia/Colombo", countrycode: "LK", country: "Sri Lanka", tz: "Asia/Colombo", offset: "UTC +05:30" },
            "Africa/Khartoum": { id: "Africa/Khartoum", countrycode: "SD", country: "Sudan", tz: "Africa/Khartoum", offset: "UTC +02:00" },
            "America/Paramaribo": { id: "America/Paramaribo", countrycode: "SR", country: "Suriname", tz: "America/Paramaribo", offset: "UTC -03:00" },
            "Arctic/Longyearbyen": { id: "Arctic/Longyearbyen", countrycode: "SJ", country: "Svalbard and Jan Mayen", tz: "Arctic/Longyearbyen", offset: "UTC +01:00" },
            "Africa/Mbabane": { id: "Africa/Mbabane", countrycode: "SZ", country: "Swaziland", tz: "Africa/Mbabane", offset: "UTC +02:00" },
            "Europe/Stockholm": { id: "Europe/Stockholm", countrycode: "SE", country: "Sweden", tz: "Europe/Stockholm", offset: "UTC +01:00" },
            "Europe/Zurich": { id: "Europe/Zurich", countrycode: "CH", country: "Switzerland", tz: "Europe/Zurich", offset: "UTC +01:00" },
            "Asia/Damascus": { id: "Asia/Damascus", countrycode: "SY", country: "Syrian Arab Republic", tz: "Asia/Damascus", offset: "UTC +02:00" },
            "Asia/Taipei": { id: "Asia/Taipei", countrycode: "TW", country: "Taiwan, Province of China", tz: "Asia/Taipei", offset: "UTC +08:00" },
            "Asia/Dushanbe": { id: "Asia/Dushanbe", countrycode: "TJ", country: "Tajikistan", tz: "Asia/Dushanbe", offset: "UTC +05:00" },
            "Africa/Dar_es_Salaam": { id: "Africa/Dar_es_Salaam", countrycode: "TZ", country: "Tanzania, United Republic of", tz: "Africa/Dar_es_Salaam", offset: "UTC +03:00" },
            "Asia/Bangkok": { id: "Asia/Bangkok", countrycode: "TH", country: "Thailand", tz: "Asia/Bangkok", offset: "UTC +07:00" },
            "Asia/Dili": { id: "Asia/Dili", countrycode: "TL", country: "Timor-Leste", tz: "Asia/Dili", offset: "UTC +09:00" },
            "Africa/Lome": { id: "Africa/Lome", countrycode: "TG", country: "Togo", tz: "Africa/Lome", offset: "UTC" },
            "Pacific/Fakaofo": { id: "Pacific/Fakaofo", countrycode: "TK", country: "Tokelau", tz: "Pacific/Fakaofo", offset: "UTC +13:00" },
            "Pacific/Tongatapu": { id: "Pacific/Tongatapu", countrycode: "TO", country: "Tonga", tz: "Pacific/Tongatapu", offset: "UTC +13:00" },
            "America/Port_of_Spain": { id: "America/Port_of_Spain", countrycode: "TT", country: "Trinidad and Tobago", tz: "America/Port_of_Spain", offset: "UTC -04:00" },
            "Africa/Tunis": { id: "Africa/Tunis", countrycode: "TN", country: "Tunisia", tz: "Africa/Tunis", offset: "UTC +01:00" },
            "Europe/Istanbul": { id: "Europe/Istanbul", countrycode: "TR", country: "Turkey", tz: "Europe/Istanbul", offset: "UTC +03:00" },
            "Asia/Ashgabat": { id: "Asia/Ashgabat", countrycode: "TM", country: "Turkmenistan", tz: "Asia/Ashgabat", offset: "UTC +05:00" },
            "America/Grand_Turk": { id: "America/Grand_Turk", countrycode: "TC", country: "Turks and Caicos Islands", tz: "America/Grand_Turk", offset: "UTC -05:00" },
            "Pacific/Funafuti": { id: "Pacific/Funafuti", countrycode: "TV", country: "Tuvalu", tz: "Pacific/Funafuti", offset: "UTC +12:00" },
            "Africa/Kampala": { id: "Africa/Kampala", countrycode: "UG", country: "Uganda", tz: "Africa/Kampala", offset: "UTC +03:00" },
            "Europe/Kiev": { id: "Europe/Kiev", countrycode: "UA", country: "Ukraine", tz: "Europe/Kiev", offset: "UTC +02:00" },
            "Europe/Simferopol": { id: "Europe/Simferopol", countrycode: "UA", country: "Ukraine", tz: "Europe/Simferopol", offset: "UTC +03:00" },
            "Europe/Uzhgorod": { id: "Europe/Uzhgorod", countrycode: "UA", country: "Ukraine", tz: "Europe/Uzhgorod", offset: "UTC +02:00" },
            "Europe/Zaporozhye": { id: "Europe/Zaporozhye", countrycode: "UA", country: "Ukraine", tz: "Europe/Zaporozhye", offset: "UTC +02:00" },
            "Asia/Dubai": { id: "Asia/Dubai", countrycode: "AE", country: "United Arab Emirates", tz: "Asia/Dubai", offset: "UTC +04:00" },
            "Europe/London": { id: "Europe/London", countrycode: "GB", country: "United Kingdom", tz: "Europe/London", offset: "UTC" },
            "America/Adak": { id: "America/Adak", countrycode: "US", country: "United States", tz: "America/Adak", offset: "UTC -10:00" },
            "America/Anchorage": { id: "America/Anchorage", countrycode: "US", country: "United States", tz: "America/Anchorage", offset: "UTC -09:00" },
            "America/Boise": { id: "America/Boise", countrycode: "US", country: "United States", tz: "America/Boise", offset: "UTC -07:00" },
            "America/Chicago": { id: "America/Chicago", countrycode: "US", country: "United States", tz: "America/Chicago", offset: "UTC -06:00" },
            "America/Denver": { id: "America/Denver", countrycode: "US", country: "United States", tz: "America/Denver", offset: "UTC -07:00" },
            "America/Detroit": { id: "America/Detroit", countrycode: "US", country: "United States", tz: "America/Detroit", offset: "UTC -05:00" },
            "America/Indiana/Indianapolis": { id: "America/Indiana/Indianapolis", countrycode: "US", country: "United States", tz: "America/Indiana/Indianapolis", offset: "UTC -05:00" },
            "America/Indiana/Knox": { id: "America/Indiana/Knox", countrycode: "US", country: "United States", tz: "America/Indiana/Knox", offset: "UTC -06:00" },
            "America/Indiana/Marengo": { id: "America/Indiana/Marengo", countrycode: "US", country: "United States", tz: "America/Indiana/Marengo", offset: "UTC -05:00" },
            "America/Indiana/Petersburg": { id: "America/Indiana/Petersburg", countrycode: "US", country: "United States", tz: "America/Indiana/Petersburg", offset: "UTC -05:00" },
            "America/Indiana/Tell_City": { id: "America/Indiana/Tell_City", countrycode: "US", country: "United States", tz: "America/Indiana/Tell_City", offset: "UTC -06:00" },
            "America/Indiana/Vevay": { id: "America/Indiana/Vevay", countrycode: "US", country: "United States", tz: "America/Indiana/Vevay", offset: "UTC -05:00" },
            "America/Indiana/Vincennes": { id: "America/Indiana/Vincennes", countrycode: "US", country: "United States", tz: "America/Indiana/Vincennes", offset: "UTC -05:00" },
            "America/Indiana/Winamac": { id: "America/Indiana/Winamac", countrycode: "US", country: "United States", tz: "America/Indiana/Winamac", offset: "UTC -05:00" },
            "America/Juneau": { id: "America/Juneau", countrycode: "US", country: "United States", tz: "America/Juneau", offset: "UTC -09:00" },
            "America/Kentucky/Louisville": { id: "America/Kentucky/Louisville", countrycode: "US", country: "United States", tz: "America/Kentucky/Louisville", offset: "UTC -05:00" },
            "America/Kentucky/Monticello": { id: "America/Kentucky/Monticello", countrycode: "US", country: "United States", tz: "America/Kentucky/Monticello", offset: "UTC -05:00" },
            "America/Los_Angeles": { id: "America/Los_Angeles", countrycode: "US", country: "United States", tz: "America/Los_Angeles", offset: "UTC -08:00" },
            "America/Menominee": { id: "America/Menominee", countrycode: "US", country: "United States", tz: "America/Menominee", offset: "UTC -06:00" },
            "America/Metlakatla": { id: "America/Metlakatla", countrycode: "US", country: "United States", tz: "America/Metlakatla", offset: "UTC -09:00" },
            "America/New_York": { id: "America/New_York", countrycode: "US", country: "United States", tz: "America/New_York", offset: "UTC -05:00" },
            "America/Nome": { id: "America/Nome", countrycode: "US", country: "United States", tz: "America/Nome", offset: "UTC -09:00" },
            "America/North_Dakota/Beulah": { id: "America/North_Dakota/Beulah", countrycode: "US", country: "United States", tz: "America/North_Dakota/Beulah", offset: "UTC -06:00" },
            "America/North_Dakota/Center": { id: "America/North_Dakota/Center", countrycode: "US", country: "United States", tz: "America/North_Dakota/Center", offset: "UTC -06:00" },
            "America/North_Dakota/New_Salem": { id: "America/North_Dakota/New_Salem", countrycode: "US", country: "United States", tz: "America/North_Dakota/New_Salem", offset: "UTC -06:00" },
            "America/Phoenix": { id: "America/Phoenix", countrycode: "US", country: "United States", tz: "America/Phoenix", offset: "UTC -07:00" },
            "America/Sitka": { id: "America/Sitka", countrycode: "US", country: "United States", tz: "America/Sitka", offset: "UTC -09:00" },
            "America/Yakutat": { id: "America/Yakutat", countrycode: "US", country: "United States", tz: "America/Yakutat", offset: "UTC -09:00" },
            "Pacific/Honolulu": { id: "Pacific/Honolulu", countrycode: "US", country: "United States", tz: "Pacific/Honolulu", offset: "UTC -10:00" },
            "Pacific/Midway": { id: "Pacific/Midway", countrycode: "UM", country: "United States Minor Outlying Islands", tz: "Pacific/Midway", offset: "UTC -11:00" },
            "Pacific/Wake": { id: "Pacific/Wake", countrycode: "UM", country: "United States Minor Outlying Islands", tz: "Pacific/Wake", offset: "UTC +12:00" },
            "America/Montevideo": { id: "America/Montevideo", countrycode: "UY", country: "Uruguay", tz: "America/Montevideo", offset: "UTC -03:00" },
            "Asia/Samarkand": { id: "Asia/Samarkand", countrycode: "UZ", country: "Uzbekistan", tz: "Asia/Samarkand", offset: "UTC +05:00" },
            "Asia/Tashkent": { id: "Asia/Tashkent", countrycode: "UZ", country: "Uzbekistan", tz: "Asia/Tashkent", offset: "UTC +05:00" },
            "Pacific/Efate": { id: "Pacific/Efate", countrycode: "VU", country: "Vanuatu", tz: "Pacific/Efate", offset: "UTC +11:00" },
            "America/Caracas": { id: "America/Caracas", countrycode: "VE", country: "Venezuela, Bolivarian Republic of", tz: "America/Caracas", offset: "UTC -04:00" },
            "Asia/Ho_Chi_Minh": { id: "Asia/Ho_Chi_Minh", countrycode: "VN", country: "Viet Nam", tz: "Asia/Ho_Chi_Minh", offset: "UTC +07:00" },
            "America/Tortola": { id: "America/Tortola", countrycode: "VG", country: "Virgin Islands, British", tz: "America/Tortola", offset: "UTC -04:00" },
            "America/St_Thomas": { id: "America/St_Thomas", countrycode: "VI", country: "Virgin Islands, U.S.", tz: "America/St_Thomas", offset: "UTC -04:00" },
            "Pacific/Wallis": { id: "Pacific/Wallis", countrycode: "WF", country: "Wallis and Futuna", tz: "Pacific/Wallis", offset: "UTC +12:00" },
            "Africa/El_Aaiun": { id: "Africa/El_Aaiun", countrycode: "EH", country: "Western Sahara", tz: "Africa/El_Aaiun", offset: "UTC +01:00" },
            "Asia/Aden": { id: "Asia/Aden", countrycode: "YE", country: "Yemen", tz: "Asia/Aden", offset: "UTC +03:00" },
            "Africa/Lusaka": { id: "Africa/Lusaka", countrycode: "ZM", country: "Zambia", tz: "Africa/Lusaka", offset: "UTC +02:00" },
            "Africa/Harare": { id: "Africa/Harare", countrycode: "ZW", country: "Zimbabwe", tz: "Africa/Harare", offset: "UTC +02:00" },
            "Europe/Mariehamn": { id: "Europe/Mariehamn", countrycode: "AX", country: "Åland Islands", tz: "Europe/Mariehamn", offset: "UTC +02:00" },
        }
    }

    /**
     * Get a specific timezone def by its code
     * @param code the code to get
     * @return {*} the tz definition, or null
     */
    static get(code) {
        return TimezoneDB.MAP[code];
    }

    /**
     * Get a list of timezones
     * @return {Array} an array of timezone object definitions
     */
    static list() {
        let list = [];
        for (let c of Object.values(TimezoneDB.MAP)) {
            list.push(c);
        }
        list.sort(function(a,b){
            if (a.id > b.id){ return 1 }
            if (a.id < b.id){ return -1 }
            return 0;
        });
        return list;
    }
    
}
window.TimezoneDB = TimezoneDB;
class ToolTip {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            icon: 'help-circle',
            gravity: 'n',
            iconclasses: [], // Classes to apply to the icon
            text: null, // The text to use,
            parent: null, // the parent object to fire off
            waittime: 1000, // how long to wait before activating
            classes: [] //Extra css classes to apply
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
        const me = this;
        if ((parent) && (parent.container)) {
           parent = parent.container;
        }
        this.parent = parent;
        this.parent.appendChild(this.container);
        this.parent.setAttribute('data-tooltip', 'closed');
        this.parent.addEventListener('mouseover', function() {
            me.open();
        });
        this.parent.addEventListener('mouseout', function() {
            clearTimeout(ToolTip.timer);
            me.close();
        });
        this.parent.addEventListener('focusin', function() {
            me.open();
        });
        this.parent.addEventListener('focusout', function() {
            clearTimeout(ToolTip.timer);
            me.close();
        });
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Opens the help tooltip
     * This actually only starts a timer.  The actual opening happens in openGuts()
     */
    open() {
        const me = this;
        ToolTip.closeOpen();
        ToolTip.timer = setTimeout(function() {
            me.openGuts();
        }, this.waittime);
    }

    openGuts() {
        const me = this;

        ToolTip.closeOpen();

        document.body.appendChild(this.container);
        this.container.removeAttribute('aria-hidden');

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.parent.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top;

        switch(this.gravity) {
            case 's':
            case 'south':
                this.container.style.top = `${(offsetTop + me.container.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.container.style.left = `${offsetLeft - CFBUtils.getSingleEmInPixels()}px`;
                break;
            case 'w':
            case 'west':
                this.container.style.top = `${offsetTop}px`;
                this.container.style.left = `${offsetLeft - this.container.clientWidth - (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'e':
            case 'east':
                this.container.style.top = `${offsetTop}px`;
                this.container.style.left = `${offsetLeft + this.parent.offsetWidth + (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'n':
            case 'north':
            default:
                this.container.style.top = `${(offsetTop - me.container.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.container.style.left = `${offsetLeft - CFBUtils.getSingleEmInPixels()}px`;
                break;
        }

        if (typeof ToolTip.activeTooltip === 'undefined' ) {
            ToolTip.activeTooltip = this;
        } else {
            ToolTip.activeTooltip = this;
        }
    }

    /**
     * Closes the help tooltip.
     */
    close() {
        this.container.setAttribute('aria-hidden', 'true');
        this.parent.appendChild(this.container);
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
class SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            submits: false, // If true, force "type='submit'"
            arialabel: null, // THe aria-label attribute
            cansubmit: true, // Advertizes to Forms that it can be used to submit them, if submits is true.
                            // This should be on an interface (e.g., SimpleButton implements Submittor)
                            // but Javascript is poor with regards to that.
            text : null, // The text for the button. This is also used as aria-label.
            shape : null, // (null|square|circle|pill) :: Make the button one of these shapes. Otherwise, makes a rectangle
            size : 'medium', // size of the button: micro, small, medium (default), large, fill
            form: null, // A form element this is in
            hidden: false, // Start hidden or not.
            tooltip: null, // An optional tooltip
            tipicon: null, // An icon for the tooltip
            tipgravity: 'n', // Tooltip gravity
            classes: [], //Extra css classes to apply
            icon : null, // If present, will be attached to the text inside the button
                         // This can be passed a DOM object
            iconclasses: [], // Classes to apply to icons
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

    /**
     * Builds the button's DOM.
     * @returns DOM representation of the SimpleButton
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
        if ((this.iconclasses) && (this.iconclasses.length > 0)) {
            for (let ic of this.iconclasses) {
                if (icon) { icon.classList.add(ic); }
                if (secondicon) { secondicon.classList.add(ic); }
            }
        }

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

        if ((!this.submits) && (this.action) && (typeof this.action === 'function')) {
            this.button.addEventListener('click', function (e) {
                if (!me.disabled) {
                    me.action(e, me);
                }
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

    get action() { return this.config.action; }
    set action(action) {
        if (typeof action !== 'function') {
            console.error("Action provided to button is not a function!");
        }
        this.config.action = action;
    }

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

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

    get iconclasses() { return this.config.iconclasses; }
    set iconclasses(iconclasses) { this.config.iconclasses = iconclasses; }

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
class ButtonMenu extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: function(e, self) {
                let focused = (document.activeElement === self.button);
                if ((focused) && (!self.isopen)) {
                    self.open();
                }
                e.stopPropagation();
            },
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
        const me = this;

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

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.button.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top,
            offsetRight = bodyRect.right - elemRect.right,
            offsetBottom = elemRect.bottom - bodyRect.bottom;

        //this.gravity = 's';
        this.menu.classList.add(this.gravity);

        switch(this.gravity) {
            case 'w':
            case 'west':
                this.menu.style.top = `${offsetTop}px`;
                this.menu.style.left = `${offsetLeft - this.menu.clientWidth - (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'e':
            case 'east':
                this.menu.style.top = `${offsetTop}px`;
                this.menu.style.left = `${offsetLeft + this.button.offsetWidth + (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'n':
            case 'north':
                this.menu.style.top = `${(offsetTop - this.menu.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.menu.style.left = `${offsetLeft - this.menu.offsetWidth + this.button.offsetWidth}px`;
                break;
            case 'nw':
            case 'northwest':
                this.menu.style.top = `${(offsetTop - this.menu.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.menu.style.left = `${offsetLeft}px`;
                break;
            case 'se':
            case 'southeast':
                this.menu.style.top = `${(offsetTop + this.button.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.menu.style.left = `${offsetLeft}px`;
                break;
            case 's':
            case 'south':
            case 'southwest':
            default:
                this.menu.style.top = `${(offsetTop + me.button.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                this.menu.style.right = `${offsetRight}px`;
                break;
        }

        if (typeof ButtonMenu.activeTooltip === 'undefined' ) {
            ButtonMenu.activeTooltip = this;
        } else {
            ButtonMenu.activeTooltip = this;
        }

        let focusable = this.menu.querySelectorAll('[tabindex]:not([tabindex="-1"])');
        if ((focusable) && (focusable.length > 0)) {
            focusable[0].focus();
        }

        if (typeof ButtonMenu.activeMenu === 'undefined' ) {
            ButtonMenu.activeMenu = this;
        } else {
            ButtonMenu.activeMenu = this;
        }
        if (this.autoclose) {
            window.setTimeout(function() { // Set this after, or else we'll get bouncing.
                me.setCloseListener();
            }, 200);
        }
    }

    /**
     * Closes the button
     */
    close() {
        this.button.removeAttribute('aria-expanded');
        this.menu.setAttribute('aria-hidden', 'true');

        if ((this.items) && (this.items.length > 0)) {
            let items = Array.from(this.menu.querySelector('li'));
            for (let li of items) {
                li.setAttribute('tabindex', '-1');
            }
        }

        this.button.appendChild(this.menu);
        ButtonMenu.activeMenu = null;

    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') { me.close(); }
        }, { once: true });

        window.addEventListener('click', function(e) {
            let tag = me.menu.tagName.toLowerCase();
            if ((me.menu.contains(e.target)) && ((tag === 'form') || (tag === 'div'))) {
                me.setCloseListener();
            } else if (me.menu.contains(e.target)) {
                me.close();
            } else if (me.button.contains(e.target)) {
                me.toggle();
            } else {
                me.close();
            }
        }, { once: true, });
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the menu.
     * @returns DOM representation
     */
    buildMenu() {
        const me = this;
        this.menu = document.createElement('ul');
        this.menu.classList.add('button-menu');
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

            menuitem.addEventListener('keyup', function(e) {
                switch (e.key) {
                    case 'Tab':
                    case 'Escape':
                        me.close();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        me.menu.querySelector(`[data-order='${previous}']`).focus();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        me.menu.querySelector(`[data-order='${next}']`).focus();
                        break;
                    case 'Enter': // Enter
                    case ' ': // Space
                        me.querySelector('a').click(); // click the one inside
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

            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                if ((item.action) && (typeof item.action === 'function')) {
                    item.action(e, me);
                }
                me.close();
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
        const me = this;
        this.menu.setAttribute('aria-hidden', 'true');
        this.menu.setAttribute('tabindex', '0');
        this.menu.classList.add('button-menu');
        this.button.appendChild(this.menu);
        this.menu.addEventListener('keyup', function(e) {
            if (e.key === 'Escape') {
                me.close();
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

    get tooltipgravity() { return this.config.tooltipgravity; }
    set tooltipgravity(tooltipgravity) { this.config.tooltipgravity = tooltipgravity; }

}
window.ButtonMenu = ButtonMenu;
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
class HelpButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: function(e, self) { self.tooltip.open(); },
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

    /**
     * Get the content start identifier
     * @return {string}
     */
    get contentstart() { return this.config.contentstart; }
    set contentstart(contentstart) { this.config.contentstart = contentstart; }

}
window.SkipButton = SkipButton;
class HamburgerButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            toggletarget: null, // The menu object to open or close.
            text: TextFactory.get('open_menu'),
            shape: 'square',
            naked: true,
            icon: HamburgerButton.MAGIC_HAMBURGER,
            action: function(e, self) { self.toggle(); }
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

    get toggletarget() { return this.config.toggletarget; }
    set toggletarget(toggletarget) { this.config.toggletarget = toggletarget; }

}
window.HamburgerButton = HamburgerButton;
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
class DatePicker {

    static get DEFAULT_CONFIG() {
        return {
            dateicon: 'calendar',
            startdate: null,
            value: null,
            timezone: 'GMT',
            basetime: '12:00:00', // Time to set dates on
            locale: 'en-US',
            weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            onselect: null, // A function to be called on selection. Passed the date selected, as a string.
            classes: [] // Extra css classes to apply
        };
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
        this.container.addEventListener('click', function(e) {
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
        const me = this;

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
        //let daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 0).getDate();
        //console.log(`startDay: ${startDay}, daysInThisMonth: ${daysInMonth}`);

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
            action: function(e) {
                e.preventDefault();
                me.renderMonth(previousMonth);
            }
        });

        let nMonthButton = new SimpleButton({
            shape: 'square',
            mute: true,
            size: 'small',
            icon: 'triangle-right',
            action: function(e) {
                e.preventDefault();
                me.renderMonth(nextMonth);
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

                link.addEventListener('click', function(e) {
                    e.stopPropagation();
                    me.select(link);
                });
                link.addEventListener('keydown', function(e) {

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
                            me.select(link);
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

        month.append(calendar);

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

    get dateicon() { return this.config.dateicon; }
    set dateicon(dateicon) { this.config.dateicon = dateicon; }

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

            minimal: false, // if true, build with the intent that it is part of a larger component.
                            // this removes things like the search controls and validation boxes.

            passive: false, // Start life in "passive" mode.
            unsettext: TextFactory.get('not_set'), // what to display in passive mode if the value is empty

            help: null, // Help text.
            helpwaittime: 5000, // How long to wait before automatically showing help tooltip
            required: false, // Is this a required field or not
            requiredtext: TextFactory.get('required_lc'), // text to display on required items
            requirederror: TextFactory.get('input-error-required'), // error to display if required item isn't filled.
            hidden: false, // Whether or not to be hidden
            autocomplete: 'off', // Enable browser autocomplete. Default is off.
            arialabel: null, // The aria-label value. If null, follows: label > title > null
            maxlength: null, // Value for maxlength.
            value: '', // Value to use (pre-population).  Used during construction and then discarded.
            disabled: false, // If true, disable the field.
            classes: [], // Extra css classes to apply
            onchange: null, // The change handler. Passed (self).
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
        if (!config) { config = {}; }
        this.config = Object.assign({}, TextInput.DEFAULT_CONFIG, config);

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

        if (!this.minimal) {
            this.container.appendChild(this.passivebox);
            if (this.topcontrol) { this.container.appendChild(this.topcontrol); }
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
        this.input.setAttribute('placeholder', this.placeholder);

        if (this.title) { this.input.setAttribute('title', this.title); }
        if (this.autocomplete) { this.input.setAttribute('autocomplete', this.autocomplete); }
        if (this.arialabel) { this.input.setAttribute('aria-label', this.arialabel); }        if (this.pattern) { this.input.setAttribute('pattern', this.pattern); }
        if (this.maxlength) { this.input.setAttribute('maxlength', this.maxlength); }

        for (let c of this.classes) {
            this.input.classList.add(c);
        }
        this.input.addEventListener('change', function(e) {
            if ((me.onchange) && (typeof me.onchange === 'function')) {
                me.onchange(me);
            }
        });

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
                me.helpbutton.closeTooltip();
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
            if ((e.key === 'Enter') // Return key
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
                    me.helpbutton.openTooltip();
                }, me.helpwaittime);
            }
            if ((me.focusin) && (typeof me.focusin === 'function')) {
                me.focusin(e, me);
            }
        });
        this.input.addEventListener('focusout', function(e) {

            if (me.passivebox) {
                me.passivebox.innerHTML = me.passivetext;
            }

            if (me.helptimer) {
                clearTimeout(me.helptimer);
                me.helpbutton.closeTooltip();
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
        this.labelobj.setAttribute('id', `${this.id}-label`);
        this.labelobj.innerHTML = this.label;

        if (this.form) {
            this.labelobj.setAttribute('form', this.form.id);
        }

        if (this.help) {
            this.helpbutton = new HelpButton({
                id: `${this.id}-help`,
                tooltip: this.help
            });
            this.labelobj.appendChild(this.helpbutton.button);
            this.labelobj.addEventListener('mouseover', function() {
                me.helpbutton.openTooltip();
            });
            this.labelobj.addEventListener('mouseout', function() {
                me.helpbutton.closeTooltip();
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
    toString () { return CFBUtils.getConfig(this); }

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
window.InputElement = InputElement;
class TextInput extends InputElement {
    constructor(config) {
        if (!config) { config = {}; }
        config.type = "text";
        super(config);
    }
}
window.TextInput = TextInput;
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
            onchange: null, // The change handler. Passed (self).
            validator: null, // A function to run to test validity. Passed the self; returns true or false.,
            value: null // the value of the checkbox
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

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

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
    toString () { return CFBUtils.getConfig(this); }

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
        config.onkeydown = function(e, self) {
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
        const me = this;
        if (this.steppers) {
            this.upbtn = new SimpleButton({
                classes: ['naked'],
                icon: 'triangle-up',
                arialabel: this.upbuttonarialabel,
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
                arialabel: this.downbuttonarialabel,
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
class DateInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            basetime: '12:00:00', // Time to set dates on
            timezone: 'GMT',
            type: 'date',
            gravity: 's', // The direction to open the datepicker
            triggerarialabel: TextFactory.get('dateinput-trigger-arialabel'),
            forceconstraints: true,
            dateicon: 'calendar'
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
        const me = this;
        this.datepicker = new DatePicker({
            classes: ['menu'],
            onselect: function(value) {
                me.value = value;
                me.triggerbutton.close();
                me.input.focus();
                me.validate();
            }
        });

        this.triggerbutton = new ButtonMenu({
            classes: ['naked'],
            shape: 'square',
            gravity: 'n',
            icon: this.dateicon,
            arialabel: this.triggerarialabel,
            menu: this.datepicker.container,
            action: function(e, self) {
                if (self.isopen) {
                    self.close();
                    me.input.focus();
                } else {
                    self.open();
                }
                me.datepicker.renderMonth(me.value);
                e.stopPropagation();
            },
        });

        this.calbutton = document.createElement('div');
        this.calbutton.classList.add('calbutton');
        this.calbutton.classList.add('inputcontrol');
        this.calbutton.appendChild(this.triggerbutton.button);

        this.calbutton.addEventListener('mousedown', function(e) {
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


class URLInput extends TextInput {

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
        if (!config) { config = {}; }
        config = Object.assign({}, URLInput.DEFAULT_CONFIG, config);

        if ((config.value) && (URLInput.isEncoded(config.value))) {
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
            if (!URLInput.isValid(this.value)) {
                this.errors.push(TextFactory.get('urlinput-error-invalid_web_address'));
            }
        }
    }

}
window.URLInput = URLInput;
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
        if (!config) { config = {}; }
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
                text: TextFactory.get('hide_password'),
                hidden: true,
                notab: true,
                icon: 'eye-slash',
                action: function() {
                    me.setVisibility(false);
                }
            });
            this.showpwbutton = new SimpleButton({
                classes: ['naked'],
                text: TextFactory.get('show_password'),
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
                this.errors.push(TextFactory.get('passwordchanger-error-minlength', this.minlength));
            } else if (this.value.length < this.suggestedlength) {
                this.errors.push(TextFactory.get('passwordchanger-error-suggestedlength', this.suggestedlength));
            } else if (this.value.length > this.maxlength) {
                this.errors.push(TextFactory.get('passwordchanger-error-maxlength', this.maxlength));
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
window.PasswordInput = PasswordInput;
class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('selectmenu-placeholder-default'), // Default value to use when unselected
            icon: "chevron-down",
            prefix: null,   // a prefix to display in the trigger box.
            value: null,    // Use this to set the value of the item
            options: [],    // Array of option dictionary objects.  Printed in order given.
                            // { label: "Label to show", value: "v", checked: true }
            onchange: null  // The change handler. Passed (self).
        };
    }

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
        if (this.selectedoption) { return this.selectedoption.label; }
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
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
        const me = this;

        SelectMenu.closeOpen(); // close open menus

        document.body.appendChild(this.listbox);

        this.listbox.removeAttribute('aria-hidden');
        this.wrapper.setAttribute('aria-expanded', true);

        for (let li of Array.from(this.optionlist.querySelectorAll('li'))) {
            li.setAttribute('tabindex', '0');
        }

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.wrapper.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top;

        this.listbox.style.top = `${(offsetTop + this.wrapper.clientHeight)}px`;
        this.listbox.style.left = `${offsetLeft}px`;
        this.listbox.style.width = `${this.container.clientWidth}px`;


        if (typeof SelectMenu.activeMenu === 'undefined' ) {
            SelectMenu.activeMenu = this;
        } else {
            SelectMenu.activeMenu = this;
        }

        setTimeout(function() { // Set this after, or else we'll get bouncing.
            me.setCloseListener();
        }, 100);
    }

    /**
     * Closes the option list.
     */
    close() {
        this.listbox.setAttribute('aria-hidden', 'true');
        this.listbox.setAttribute('tabindex', '-1');
        this.wrapper.setAttribute('aria-expanded', false);
        for (let li of Array.from(this.optionlist.querySelectorAll('li'))) {
            li.setAttribute('tabindex', '-1');
        }
        this.updateSearch();
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

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('select-container');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.labelobj) { this.container.appendChild(this.labelobj); }

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrap');
        this.wrapper.setAttribute('role', 'combobox');
        this.wrapper.setAttribute('aria-haspopup', 'listbox');
        this.wrapper.setAttribute('aria-expanded', false);
        this.wrapper.setAttribute('aria-owns', `${this.id}-options`);
        if (this.icon) { this.wrapper.classList.add(`cfb-${this.icon}`); }
        this.wrapper.appendChild(this.triggerbox);

        this.container.append(this.wrapper);

        this.listbox = document.createElement('div');
        this.listbox.setAttribute('id', `${this.id}-options`);
        this.listbox.setAttribute('aria-hidden', 'true');
        this.listbox.setAttribute('role', 'listbox');
        this.listbox.classList.add('selectmenu-menu')
        this.listbox.appendChild(this.optionlist);

        this.container.appendChild(this.listbox);

        if (!this.minimal) {
            this.container.appendChild(this.passivebox);
            this.container.appendChild(this.messagebox);
        }
        if (this.minimal) { this.container.classList.add('minimal'); }

        if (this.value) {
            //this.select(this.value);
        }

        this.postContainerScrub();
    }

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

    /**
     * Builds the trigger box for the select.
     */
    buildTriggerBox() {
        const me = this;
        this.triggerbox = document.createElement('input');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('type', 'text');
        this.triggerbox.setAttribute('tabindex', '0');
        this.triggerbox.setAttribute('aria-autocomplete', 'none');
        this.triggerbox.setAttribute('aria-activedescendant', '');
        this.triggerbox.setAttribute('placeholder', this.placeholder);

        this.triggerbox.addEventListener('focusin', function(e) {
            if (me.disabled) {
                e.stopPropagation();
                return;
            }
            me.triggerbox.select(); // Select all the text
            me.open();
        });

        this.triggerbox.addEventListener('keyup', function(e) {
            if ((e.shiftKey) && (e.key === 'Tab')) {  // Shift + Tab
                me.close();
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
                        me.close();
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        me.open();
                        me.jumptoSelected(true);
                        break;
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        me.updateSearch();
                        break;
                    case ' ': // space
                    default:
                        me.updateSearch();
                        break;
                }
            }
        });

        if (this.mute) { this.triggerbox.classList.add('mute'); }

    }

    calculatePlaceholder() {
        if (this.unselectedtext) { return this.unselectedtext; }
        return TextFactory.get('selectmenu-placeholder-default');
    }

    buildOptions() {

        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('selectmenu');
        this.optionlist.setAttribute('id', this.id);
        this.optionlist.setAttribute('tabindex', '-1');

        let order = 1;
        let minchars = 5;
        for (let opt of this.options) {
            if ((this.origval) && (this.origval === opt.value)) {
                opt.checked = true;
                this.selectedoption = opt;
            } else {
                delete opt.checked;
            }

            let o = this.buildOption(opt, order);

            if ((opt.label) && (opt.label.length > minchars)) {
                minchars = opt.label.length;
            }
            order++;
            this.optionlist.appendChild(o);
        }
        this.triggerbox.style.minWidth = `${(minchars * CFBUtils.getSingleEmInPixels())}px`;
    }

    buildOption(def, order) {
        const me = this;

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

        li.addEventListener('keydown', function(e) {
            if ((e.shiftKey) && (e.key === 'Escape')) {  // Shift + Tab
                me.close();
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
                        me.optionlist.querySelector(`[data-menuorder='${previous}']`).focus();
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        me.optionlist.querySelector(`[data-menuorder='${next}']`).focus();
                        break;
                    case 'Enter':
                        li.click(); // click the one inside
                        break;
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        me.triggerbox.value = me.triggerbox.value.substring(0, me.value.length - 1);
                        me.updateSearch();
                        break;
                    case ' ': // space
                    default:
                        e.preventDefault();
                        me.triggerbox.value = me.triggerbox.value + e.key;
                        me.updateSearch();
                        break;
                }
            }

        });

        li.addEventListener('click', function() {
            let listentries = me.optionlist.querySelectorAll('li');
            for (let le of listentries) {
                le.removeAttribute('aria-selected');
                let opt = le.querySelector(`input[name=${me.name}]`);
                if (opt) { opt.removeAttribute('checked') ; }
            }
            li.setAttribute('aria-selected', 'true');
            li.querySelector(`input[name=${me.name}]`).checked = true;

            if (me.prefix) {
                me.triggerbox.value = `${me.prefix} ${def.label}`;
            } else {
                me.triggerbox.value = def.label;
            }

            me.selectedoption = def;

            if (def.label === me.unselectedtext) {
                me.passivebox.innerHTML = me.unsettext;
            } else {
                me.passivebox.innerHTML = def.label;
            }

            me.close();

            me.validate();

            if (me.form) { me.form.validate(); }

            if ((me.onchange) && (typeof me.onchange === 'function')) {
                me.onchange(me);
            }
        });

        let text = document.createElement('span');
        text.innerHTML = def.label;
        li.appendChild(text);

        if (def.checked) {
            this.origval = def.value;
            if (this.prefix) {
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
            if (li.innerHTML.toUpperCase().startsWith(s.toUpperCase())) {
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
        this.findByString(this.value);
    }

    /**
     * Sets an event listener to close the menu if the user clicks outside of it.
     */
    setCloseListener() {
        const me = this;

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') { me.close(); }
        }, { once: true });

        window.addEventListener('click', function(e) {
            if ((me.wrapper.contains(e.target)) || (me.listbox.contains(e.target))) {
                me.setCloseListener();
            } else {
                me.close();
            }
        }, { once: true });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get listbox() { return this._listbox; }
    set listbox(listbox) { this._listbox = listbox; }

    get minimal() { return this.config.minimal; }
    set minimal(minimal) { this.config.minimal = minimal; }

    get onchange() { return this.config.onchange; }
    set onchange(onchange) { this.config.onchange = onchange; }

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

    get unselectedtext() { return this.config.unselectedtext; }
    set unselectedtext(unselectedtext) { this.config.unselectedtext = unselectedtext; }

    get wrapper() { return this._wrapper; }
    set wrapper(wrapper) { this._wrapper = wrapper; }

}
window.SelectMenu = SelectMenu;
class RadioGroup extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The button id
            name: null,
            form: null, // A form element this is in
            label: null, // The text for the label.
            passive: false, // Start life in "passive" mode.
            required: false, // Is this a required field or not
            unsettext: TextFactory.get('not_set'), // what to display in passive mode if the value is empty
            classes: [], // Extra css classes to apply
            disabled: false, // If true, make this disabled.
            options: [], // Array of option dictionary objects.  Printed in order given.
                         // { label: "Label to show", value: "v", checked: true }
            validator: null // A function to run to test validity. Passed the self; returns true or false.
        };
    }

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
            this.optionlist.setAttribute('aria-describedby', `${this.id}-help-tt`);
            this.optionlist.setAttribute('aria-labelledby', `${this.id}-label`);
        }
    }

    buildOption(def) {

        const me = this;
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
class StateMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('statemenu_select'),
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
        if (!config) { config = {}; }
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
window.StateMenu = StateMenu;
class CountryMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('countrymenu_select'),
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

        let countries = CountryCodes.list();
        let options = [];
        for (let c of countries) {
            let d = { label: c.country };
            if ((config.valuesas) && (config.valuesas === 'name')) {
                d.value = c.country;
            } else {
                d.value = c.code;
            }
            if ((config.value) && ((config.value.toUpperCase() === c.code) || (config.value.toUpperCase() === c.country))) {
                d.checked = true;
            }
            options.push(d);
        }

        config.options = options;
        super(config);

    }
}
window.CountryMenu = CountryMenu;
class TimezoneMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('timezone_select'),
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

        let options = [];
        for (let tz of TimezoneDB.list()) {
            let o = { label: tz.id };
            if ((config.valuesas) && (config.valuesas === 'name')) {
                o.value = tz.id;
            } else {
                o.value = tz.offset;
            }
            if ((config.value) && ((config.value.toUpperCase() === tz.id) || (config.value.toUpperCase() === tz.offset))) {
                o.checked = true;
            }
            options.push(o);
        }

        config.options = options;
        super(config);

    }
}
window.TimezoneMenu = TimezoneMenu;
class TextArea extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            counter: 'sky', // A value for a character counter. Null means 'no counter'
            // Possible values: null, 'remaining', 'limit', and 'sky'
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
window.TextArea = TextArea;
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
            switch (e.key) {
                case 'Tab':
                    me.triggerbox.blur();
                    break;
                case 'Enter':
                case ' ':
                    me.labelobj.click();
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
        const me = this;

        this.fileinput = document.createElement('input');
        this.fileinput.setAttribute('type', this.type);
        this.fileinput.setAttribute('name', this.name);
        this.fileinput.setAttribute('id', this.id);
        this.fileinput.setAttribute('accept', this.accept);
        this.fileinput.setAttribute('multiple', this.multiple);
        this.fileinput.setAttribute('aria-labelledby', this.labelobj.id);
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
window.FileInput = FileInput;
class LoadingShade {
    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            spinnerstyle: 'spin', //
            spinnertext: TextFactory.get('simpleform-spinnertext'), //
            classes: [] //Extra css classes to apply
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
        this.container.parentNode.classList.add('shaded');
        this.container.removeAttribute('aria-hidden');
    }

    deactivate() {
        this.container.parentNode.classList.remove('shaded');
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
            this.container.append(d);
        }
        if (this.spinnertext) {
            let d = document.createElement('div');
            d.classList.add('spinnertext');
            d.innerHTML = this.spinnertext;
            this.container.append(d);
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
class DialogWindow {

    static get DEFAULT_CONFIG() {
       return {
           id: null,
           form: null,  // takes a SimpleForm.  If present, displays and renders that. If not, uses content.
           actions: null, // An array of actions. Can be buttons or keyword strings.Only used if form is null.
                            // Possible keywords:  closebutton, cancelbutton
           content: `<p />${TextFactory.get('no_provided_content')}</p>`, // This is the content of the dialog
           classes: [],             // apply these classes to the dialog, if any.
           header: null, // DOM object, will be used if passed before title.
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
        const me = this;

        CFBUtils.closeOpen();

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
            if (!me.nofocus) {
                let focusable = me.contentbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusable[0]) {
                    focusable[0].focus();
                }
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
        if (e.key === 'Escape') {
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
                this.closebutton = new CloseButton({
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
                                    action: function() {
                                        me.close();
                                    }
                                }).container);
                                break;
                            case 'cancelbutton':
                                this.actionbox.appendChild(new DestructiveButton({
                                    text: this.canceltext,
                                    mute: true,
                                    action: function() {
                                        me.close();
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

    get mask() { return this._mask; }
    set mask(mask) { this._mask = mask; }

    get nofocus() { return this.config.nofocus; }
    set nofocus(nofocus) { this.config.nofocus = nofocus; }

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
class Panel {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            contentid : null, // The contentid
            headerid : null, // The headerid
            title: null, // The title
            content : null, // The content payload
            style: 'plain', // Various styles that can be applied to the panel.
                            // - 'plain': simple, spartan, solid.
                            // - 'ghost': similar to 'plain' except that it turns
                            //            translucent when not in focus or hover
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
        const me = this;
        this.header = document.createElement('h3');
        if (this.collapsible) {
            this.togglebutton = new SimpleButton({
                id: this.headerid,
                secondicon: this.closeicon,
                text: this.title,
                naked: true,
                iconclasses: ['headerbutton'],
                classes: ['headerbutton'],
                action: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.toggleClose();
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
            this.container.append(this.header);
            this.contentbox.setAttribute('aria-labelledby', this.headerid);
        }
        if (this.content) {
            this.contentbox.appendChild(this.content);
        }

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
        this.content.parentNode.removeChild(this.content);
        this.content = content;
        this.container.appendChild(this.content);
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

    get togglebutton() { return this._togglebutton; }
    set togglebutton(togglebutton) { this._togglebutton = togglebutton; }

    get togglecontrol() { return this.config.togglecontrol; }
    set togglecontrol(togglecontrol) { this.config.togglecontrol = togglecontrol; }

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
    set content(content) {
        if (this.pcontent) { this.pcontent.innerHTML = content; }
        this.config.content = content;
    }

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

    get titlecontainer() { return this._titlecontainer; }
    set titlecontainer(titlecontainer) { this._titlecontainer = titlecontainer; }

}
window.Panel = Panel;
class FloatingPanel extends Panel {

    static get DEFAULT_CONFIG() {
        return {
            style: 'plain', // Various styles that can be applied to the panel.
                            // - 'plain': simple, spartan, solid.
                            // - 'ghost': similar to 'plain' except that it turns
                            //            translucent when not in focus or hover
                            // - 'invisible: panel behaves as normal but the background is transparent
            position: 'top-left' // Position for the panel. Valid values:
                                 // (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)
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

        this.closebutton = new CloseButton({
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
class PasswordGenerator {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            buttontext: TextFactory.get('generate_password'),
            buttonicon: 'refresh',
            length: 15, // how many characters to generate
            autofills: [], // input elements to auto fill.
            sets: ['lc', 'uc', 'num', 'punc']
        };
    }

    static get DATASETS () {
        return {
            lc: { id: 'lc', label: TextFactory.get('lowercase'), set: 'a-z', chars: 'abcdefghijklmnopqrstuvwxyz' },
            uc: { id: 'uc', label: TextFactory.get('uppercase'), set: 'A-Z', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            num: { id: 'num', label: TextFactory.get('numbers'), set: '0-9', chars: '0123456789' },
            punc: { id: 'punc', label: TextFactory.get('punctuation'), set: '#', chars: '![]{}()%&*$#^<>~@|' }
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

        if (!this.id) { this.id = `pwgen-${CFBUtils.getUniqueKey(5)}`; }

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
            arialabel: TextFactory.get('configure_generator'),
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
    toString () { return CFBUtils.getConfig(this); }

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
window.PasswordGenerator = PasswordGenerator;
class PasswordChangeForm {

    static get DEFAULT_CONFIG() {
        return {
            maxlength: 30,
            minlength: 5,
            suggestedlength: 8,
            cannotbe: [],
            forceconstraints: null, // if true, force constraints defined in sub classes (many inputs don't have any)
            instructions: [TextFactory.get('passwordchanger-form-instructions')],
            placeholder: null,
            buttontext: TextFactory.get('change_password'),
            pwcurrlabel: TextFactory.get('current_password'),
            pwcurrplaceholder: TextFactory.get('passwordchanger-currentpw-placeholder'),
            pwcurrhelp: TextFactory.get('passwordchanger-currentpw-help'),
            pwonelabel: TextFactory.get('new_password'),
            pwoneplaceholder: null,
            pwonehelp: null,
            pwtwolabel: TextFactory.get('confirm_password'),
            pwtwoplaceholder: null,
            pwtwohelp: null,
            badpasswordhook: null // Function used to test the value against an external bad password list, like the one used by NIST.
        };
    }

    constructor(config) {
        this.config = Object.assign({}, PasswordChangeForm.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `pwchange-${CFBUtils.getUniqueKey(5)}`; }
    }

    /* ACTION METHODS___________________________________________________________________ */


    /* VALIDATION METHODS_______________________________________________________________ */

    runChecks(self) {
        let valid = true;
        if ((this.pwone.value) !== (this.pwtwo.value)) {
            this.pwone.errors.push(TextArea.get('passwordchanger-error-passwords_must_match'));
            this.pwone.showMessages();
            valid = false;
        }
        if ((this.cannotbe) && (this.cannotbe.length > 0)) {
            for (let cbs of this.cannotbe) {
                if (this.pwone.value === cbs) {
                    this.pwone.errors.push(TextArea.get('passwordchanger-error-cannot_be_used_as_pw'));
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
                    results: [TextFactory.get('passwordchanger-results-changed_successfully')]
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
            return TextFactory.get('passwordchanger-placeholder-minlength', this.minlength);
        } else if (this.suggestedlength) {
            return TextFactory.get('passwordchanger-placeholder-suggested', this.suggestedlength);
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
    toString () { return CFBUtils.getConfig(this); }

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

    get forceconstraints() { return this.config.forceconstraints; }
    set forceconstraints(forceconstraints) { this.config.forceconstraints = forceconstraints; }

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

    get placeholder() {
        if (this.config.placeholder) return this.config.placeholder;
        return this.calculatePlaceholder();
    }
    set placeholder(placeholder) { this.config.placeholder = placeholder; }

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
window.PasswordChangeForm = PasswordChangeForm;
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
            //    selected: false, // if true, start selected
            //    action: function(tab id, self) { } // what to do when the tab is clicked. if empty, uses default action.
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
        this.tabmap = {};
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
            order = this.buildTab(tabdef, order);
        }

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
                toggletarget: me
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

    buildTab(tabdef, order, parent) {
        const me = this;
        let next = order + 1,
            previous = order - 1;

        if (previous < 1) {
            previous = 1;
        }
        if (next > this.tabs.length) {
            next = this.tabs.length;
        }

        if ((!tabdef.label) && (!tabdef.icon)) {
            console.warn('TabBar: Element defined but has neither icon or text.  Skipping');
            return null;
        }

        let link = document.createElement('a');
        link.setAttribute('data-tabtext', `${tabdef.label}`);
        link.setAttribute('data-tabno', `${order}`);
        link.setAttribute('id', tabdef.id);
        link.setAttribute('data-tabid', tabdef.id);
        if (!this.navigation) {
            link.setAttribute('role', 'menuitem');
        }

        if (tabdef.icon) {
            link.appendChild(IconFactory.icon(tabdef.icon));
        }
        if (tabdef.label) {
            let linktext = document.createElement('span');
            linktext.innerHTML = tabdef.label;
            link.appendChild(linktext);
        }

        let maplink = document.createElement('li');
        maplink.setAttribute('role', 'none');
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

        if (parent) {
            let clink = parent.querySelector('a');
            link.setAttribute('data-parent', `${clink.getAttribute('data-tabid')}`);
            let plist = parent.querySelector('ul');
            if (!plist) {
                plist = document.createElement('ul');
                plist.setAttribute('role', 'menu');
                plist.setAttribute('aria-label', tabdef.label);
                plist.classList.add('submenu');
                parent.appendChild(plist);
            }
            plist.append(this.tabmap[tabdef.id]); // attach to child list
        } else {
            this.list.appendChild(this.tabmap[tabdef.id]); // attach to root list
        }

        order++;
        link.setAttribute('tabindex', '-1'); // always set this here

        // Is this a master menu item?

        if ((tabdef.subtabs) && (tabdef.subtabs.length > 0)) {
            link.classList.add('mastertab');
            link.setAttribute('aria-haspopup', true);
            link.setAttribute('aria-expanded', false);
            if (this.submenuicon) {
                link.appendChild(IconFactory.icon(this.submenuicon));
            }
            for (let subdef of tabdef.subtabs) {
                order = this.buildTab(subdef, order, this.tabmap[tabdef.id]);
            }
            // XXX SET open/close linking
        } else {
            // set link events here.
            link.addEventListener('keydown', function (e) {
                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        e.stopPropagation();
                        me.list.querySelector(`[data-tabno='${previous}']`).focus();
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        e.stopPropagation();
                        me.list.querySelector(`[data-tabno='${next}']`).focus();
                        break;
                    case 'Enter':
                    case 'Space':
                        link.click();
                        break;

                }
            });
            link.addEventListener('click', function (e) {
                e.preventDefault();
                me.select(tabdef.id);
                if ((tabdef.action) && (typeof tabdef.action === 'function')) {
                    tabdef.action(tabdef.id, me);
                } else if (me.action) {
                    me.action(tabdef.id, me);
                }
            });
        }

        if (tabdef.selected) {
            window.setTimeout(function() { // Have to wait until we're sure we're in the DOM
                me.select(tabdef.id);
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
        const me = this;
        if (this.isopen) { return; }
        this.container.setAttribute('aria-expanded', 'true');
        if (this.menubutton) { this.menubutton.open(); }

        setTimeout(function() { // Set this after, or else we'll get bouncing.
            me.setCloseListener();
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
        const me = this;

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') { me.close(); }
        }, { once: true });

        window.addEventListener('click', function(e) {
            if (e.target === me.list) {
                me.setCloseListener();
            } else {
                me.close();
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

    get list() { return this._list; }
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

    get tabmap() { return this._tabmap; }
    set tabmap(tabmap) { this._tabmap = tabmap; }

    get tabs() { return this.config.tabs; }
    set tabs(tabs) { this.config.tabs = tabs; }

    get vertical() { return this.config.vertical; }
    set vertical(vertical) { this.config.vertical = vertical; }

}
window.TabBar = TabBar;

class SearchControl {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            autoexecute: true, // Cause the search's action to execute automatically on focusout
                               // or when there number of seed characters is reached
            arialabel: TextFactory.get('searchcontrol-instructions'), // The aria-label value.
            maxlength: null, // Value for maxlength.
            searchtext: TextFactory.get('search'),
            searchicon: 'magnify',
            action: function(value, self) { // The search action. Passed the value of the input and the self
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
        const me = this;
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
            action: function(e) {
                e.preventDefault();
                if ((me.action) && (typeof me.action === 'function')) {
                    me.action(me.value, me);
                }
            }
        });

        // Open the search input if the user clicks on the button when it's not open
        this.container.addEventListener('click', function() {
            if (!me.isopen) {
                me.searchinput.focus();
                return;
            }
        });

        this.container.appendChild(this.searchbutton.button);

    }

    /**
     * Build the search input
     */
    buildSearchInput() {
        const me = this;
        this.searchinput = document.createElement('input');

        this.searchinput.setAttribute('type', 'text');
        this.searchinput.setAttribute('role', 'textbox');
        this.searchinput.setAttribute('tabindex', '0');

        if (this.placeholder) { this.searchinput.setAttribute('placeholder', this.placeholder); }
        if (this.arialabel) { this.searchinput.setAttribute('aria-label', this.arialabel); }
        if (this.maxlength) { this.searchinput.setAttribute('maxlength', this.maxlength); }

        for (let c of this.classes) {
            this.searchinput.classList.add(c);
        }

        this.searchinput.addEventListener('keyup', function(e) {
            switch (e.key) {
                case 'Tab':
                    if (me.autoexecute) {
                        if ((me.action) && (typeof me.action === 'function')) {
                            me.action(me.value, me);
                        }
                    }
                    break;
                case 'Enter':
                    if ((me.action) && (typeof me.action === 'function')) {
                        me.action(me.value, me);
                    }
                    break;
                default:
                    if (me.autoexecute) {
                        if ((me.action) && (typeof me.action === 'function')) {
                            me.action(me.value, me);
                        }
                    }
                    break;

            }
        });

        this.searchinput.addEventListener('focusout', function(e) {
            if ((me.value) && (me.value.length > 0)) {
                me.container.classList.add('open');
                if (me.autoexecute) {
                    if ((me.action) && (typeof me.action === 'function')) {
                        me.action(me.value, me);
                    }
                }
            } else {
                me.container.classList.remove('open');
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

    get maxlength() { return this.config.maxlength; }
    set maxlength(maxlength) { this.config.maxlength = maxlength; }

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

}
window.SearchControl = SearchControl;

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

        if (!this.id) { this.id = `progress-${CFBUtils.getUniqueKey(5)}`; }
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
                value.innerHTML = (this.commaseparate ? CFBUtils.readableNumber(this.minvalue) : this.minvalue);
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
window.SimpleProgressMeter = SimpleProgressMeter;

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
window.RadialProgressMeter = RadialProgressMeter;

class DataGrid extends Panel {

    static get DEFAULT_CONFIG() {
        return {
            title: null, // the title for the grid
            id: null, // The id. An id is required to save a grid's state.
            sortable: true, //  Data columns can be sorted

            fields: [  // The data fields for the grid and how they behave.
                /*
                 * An array of field definition dictionaries:
                 *
                    name: <string>,    // The variable name for this field (computer readable)
                    label: <string>,   // The human-readable name for the column
                    width: <number,    // The default width of the column
                    hidden: <boolean>, // Is the column hidden or not.
                    identifier: <boolean> // If true, marks the field as the unique identifier
                                          // for a data set.  An identifier is required if the
                                          // grid is intended to update entries.  Without a unique
                                          // field, data can only be appended, not updated.
                    type: <string>,    // The datatype of the column
                                       //   - string
                                       //   - number
                                       //   - date
                                       //   - time
                                       //   - stringarray
                                       //   - paragraph
                    separator: <string>, // Used when rendering array values
                    nodupe: false, // If true, this column is ignored when deemphasizing duplicate rows.
                    resize: <boolean>,   // Whether or not to allow resizing of the column (default: false)
                    description: <string>>,  // A string that describes the data in the column
                    classes: <string array>, // Additional classes to apply to cells of this field
                    filterable: <null|string|enum> // Is the field filterable? if so, how?
                    renderer: function(data) {     // A function that can be used to
                        return `${data}.`;
                    }
                */
            ],
            data: null,   // The data to throw into the grid on load. This is an array of rows.
            source: null, // the url from which data is drawn.  Ignored if 'data' is not null.
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
            exportfilename: function(self) { // the filename to name the exported data.
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

            selectable: true, //  Data rows can be selected.
            selectaction: function(self) {  // What to do when a single row is selected.
                //console.log("row clicked");
            },
            spinnerstyle: 'spin', //
            spinnertext: TextFactory.get('datagrid-spinnertext'), //

            multiselect: true, // Can multiple rows be selected? If true, overrides "selectable: false"
            multiselectactions: [], // Array of button actions to multiselects
            multiselecticon: 'checkmark',

            rowactions: null, // an array of actions that can be used on items.
            rowactionsicon: 'menu', // Icon to use for row-actions button

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

        const me = this;

        if (this.id) {
            this.savekey = `grid-test-${this.id}`;
        } else {
            this.id = `grid-${CFBUtils.getUniqueKey(5)}`;
        }
        for (let f of this.fields) {
            if (f.identifier) { this.identifier = f.name; }
        }
        this.activefilters = [];
        this.loadstate();

        setTimeout(function() {
           me.fillData();
        }, 100);
    }

    /**
     * Loads the initial data into the grid.
     */
    fillData() {
        const me = this;

        this.shade.activate();

        if (this.data) {
            for (let rdata of this.data) {
                this.gridbody.appendChild(this.buildRow(rdata));
            }
            setTimeout(function() {
                me.postLoad();
                me.shade.deactivate();
            }, 100);
        } else if (this.source) {
            this.fetchData(this.source, function(data){
                me.update(data);
                me.postLoad();
                me.shade.deactivate();
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

        // XXX TODO: Don't export hidden fields

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

        if (matches <= 0) {
            this.messagebox.innerHTML = "";
            let warnings = [TextFactory.get('search_noresults')];
            if (matchesHiddenColumns) {
                warnings.push(TextFactory.get('matches_hidden_columns'));
            }
            this.messagebox.append(new MessageBox({
                warningstitle: TextFactory.get('no_results'),
                warnings: warnings,
                classes: ['hidden']
            }).container);
            this.messagebox.classList.remove('hidden');
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
        const me = this;

        let title,
            container,
            actions = [];

        switch(type) {
            case 'column':
                title = TextFactory.get('configure_columns');
                container = document.createElement('div');
                container.classList.add('datagrid-configurator');
                container.classList.add('column');

                container.append(new InstructionBox({
                    instructions: [TextFactory.get('datagrid-column-config-instructions')]
                }).container);

                let content = document.createElement('ul');
                content.classList.add('elements');
                for (let f of this.fields) {
                    let li = document.createElement('li');

                    let cbox = new BooleanToggle({
                        label: f.label,
                        checked: !f.hidden,
                        classes: ['column'],
                        onchange: function() {
                            me.toggleColumn(f);
                        }
                    });
                    li.appendChild(cbox.container);

                    if (f.description) {
                        let desc = document.createElement('div');
                        desc.classList.add('description');
                        desc.innerHTML = f.description;
                        li.appendChild(desc);
                    }
                    content.appendChild(li);
                }

                container.append(content);
                break;
            case 'filter':
                let fc = new FilterConfigurator({
                    fields: this.fields,
                    filters: this.activefilters
                });
                container = fc.container;

                let applyfiltersbutton = new SimpleButton({ // need to pass this to sub-routines
                    text: TextFactory.get('apply_filters'),
                    action: function() {
                        fc.grindFilters();
                        me.activefilters = fc.filters;
                        me.applyFilters();
                        me.persist();
                        dialog.close();
                    }
                });
                actions.push(applyfiltersbutton);

                title = TextFactory.get('manage_filters');
                break;
            default:
                break;
        }

        actions.push('closebutton');
        let dialog = new DialogWindow({
            title: title,
            content: container,
            actions: actions
        });
        dialog.open();
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
        const me = this;
        this.fetchData(url, function(data) {
            me.update(data);
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
            if (key === this.identifier) {
                continue;
            }
            let oldCell = rowDOM.querySelector(`[data-name=${key}`);
            let c = this.buildCell(entry, this.getField(key));
            rowDOM.replaceChild(c, oldCell);
        }
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
        for (let field of Object.values(this.fields)) {
            if (!field.hidden) {
                colsvisible = true;
                break;
            }
        }
        if (!colsvisible) {
            this.messagebox.innerHTML = "";
            this.messagebox.append(new MessageBox({
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
        const me = this;
        let rows = Array.from(this.gridbody.childNodes);

        this.filtertags.innerHTML = '';

        if ((this.activefilters) && (Object.values(this.activefilters).length > 0)) {
            this.filterinfo.setAttribute('aria-expanded', true);
            for (let f of this.activefilters) {
                f.tagbutton = new TagButton({
                    text: this.getField(f.field).label,
                    tooltip: `${this.getField(f.field).label} ${FilterConfigurator.getComparatorLabel(f.comparator)} ${f.value}`,
                    action: function() {
                        me.removeFilter(f);
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
            this.messagebox.append(new MessageBox({
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
            case 'imageurl':
            case 'string':
            default:
                switch(filter.comparator) {
                    case 'equals':
                        matches = (testVal === filterVal);
                        break;
                    case 'doesnotequal':
                        matches = (testVal !== filterVal);
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

        let deselectOthers = true;
        let othersSelected = false;

        if (this.multiselecting) {
            deselectOthers = false;
        } else if ((this.multiselect) && (event) && (event.type === 'click') && ((event.shiftKey) || (event.metaKey))) {
            deselectOthers = false;
        }

        let sels = this.gridbody.querySelectorAll("[aria-selected='true'");

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
        const me = this;
        this.container = document.createElement('div');
        this.container.classList.add('datagrid-container');
        this.container.classList.add('panel');
        this.container.setAttribute('id', this.id);
        this.container.setAttribute('aria-expanded', 'true');

        if (this.title) {
            this.container.append(this.header);
        }

        this.container.append(this.gridinfo);

        if (this.filterable) {
            this.container.append(this.filterinfo);
        }

        this.grid.appendChild(this.thead);
        this.grid.appendChild(this.gridbody);

        this.gridwrapper = document.createElement('div');
        this.gridwrapper.classList.add('grid-wrapper');
        this.gridwrapper.appendChild(this.shade.container);
        this.gridwrapper.appendChild(this.grid);
        this.container.append(this.gridwrapper);

        this.gridwrapper.onscroll = function(e) {
            if (me.gridwrapper.scrollLeft > 0) {
                me.grid.classList.add('schoriz');
            } else {
                me.grid.classList.remove('schoriz');
            }
            if (me.gridwrapper.scrollTop > 0) {
                me.grid.classList.add('scvert');
            } else {
                me.grid.classList.remove('scvert');
            }
        };

        this.messagebox = document.createElement('div');
        this.messagebox.classList.add('messages');
        this.messagebox.classList.add('hidden');
        this.container.append(this.messagebox);

        if (this.minimized) { // don't call close() to avoid the callbacks.
            this.container.setAttribute('aria-expanded', 'false');
            this.minimized = true;
        }

        if (this.hidden) { this.hide(); }

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
        if (this.data) {
            this.itemcount.innerHTML = this.data.length;
        }
    }

    /**
     * Build the grid info bit
     */
    buildGridInfo() {
        const me = this;

        this.gridinfo = document.createElement('div');
        this.gridinfo.classList.add('grid-info');

        this.itemcountlabel = document.createElement('label');
        this.itemcountlabel.innerHTML = TextFactory.get('items_label');

        this.itemcount = document.createElement('span');
        this.itemcount.classList.add('itemcount');
        this.updateCount();

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
                searchtext: TextFactory.get('search'),
                action: function(value) {
                    me.search(value);
                }
            });
            this.gridinfo.append(this.searchcontrol.container);
        }

        if (this.filterable) {
            this.filterbutton  = new SimpleButton({
                mute: true,
                text: TextFactory.get('filters'),
                icon: this.filterbuttonicon,
                tooltip: TextFactory.get('datagrid-tooltip-filters'),
                classes: ['filter'],
                action: function() {
                    me.configurator('filter');
                }
            });
            this.gridinfo.append(this.filterbutton.button);
        }

        let items = [];

        if (this.multiselect) {
            items.push({
                label: TextFactory.get('bulk_select'),
                tooltip: TextFactory.get('datagrid-tooltip-bulk_select'),
                icon: this.multiselecticon,
                action: function() {
                    me.selectmodetoggle();
                }
            });
        }
        items.push({
            label: TextFactory.get('columns'),
            icon: this.columnconfigurationicon,
            tooltip: TextFactory.get('datagrid-tooltip-configure_columns'),
            action: function() {
                me.configurator('column');
            }
        });
        if (this.exportable) {
            items.push({
                label: TextFactory.get('export'),
                tooltip: TextFactory.get('datagrid-tooltip-export'),
                icon: this.exporticon,
                action: function() {
                    me.export();
                }
            });
            items.push({
                label: TextFactory.get('export-current_view'),
                tooltip: TextFactory.get('datagrid-tooltip-export-current_view'),
                icon: this.exporticon,
                action: function() {
                    me.export(true);
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

        this.gridinfo.append(this.actionsbutton.button);
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
        const me = this;

        if (this.multiselect) {
            this.masterselector = new BooleanToggle({
                onchange: function(self) {
                    me.toggleallselect(self.checked);
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
        const me = this;

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
            cell.addEventListener('click', function(e) {
                e.preventDefault();
                me.togglesort(field.name);
            });
            cell.addEventListener('keyup', function(e) {
                e.preventDefault();
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        me.togglesort(field.name);
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
        const me = this;
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

            row.addEventListener('click', function(e) {

                if (e.target.classList.contains('mechanical')) { return; }

                if (e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getSelection().removeAllRanges(); // remove cursor selection
                }
                if (me.selectable) {
                    me.select(row, e);
                }
            });

            row.addEventListener('keydown', function(e) {
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
                onchange: function(self) {
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

        if ((this.rowactions) && (this.rowactions.length > 0)) {

            let cell = document.createElement('td');
            cell.classList.add('actions');
            cell.classList.add('mechanical');
            cell.appendChild(new ButtonMenu({
                ghost: true,
                shape: 'square',
                data: rdata,
                secondicon: null,
                gravity: 'east',
                text: TextFactory.get('actions'),
                icon: this.rowactionsicon,
                classes: ['actions'],
                items: this.rowactions
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
                case 'imageurl':
                    content = `<a href="${d}"><img src="${d}" /></a>`;
                    break;
                case 'date':
                    content = d.toString();
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

    get columnconfigbutton() { return this._columnconfigbutton; }
    set columnconfigbutton(columnconfigbutton) { this._columnconfigbutton = columnconfigbutton; }

    get columnconfigurationicon() { return this.config.columnconfigurationicon; }
    set columnconfigurationicon(columnconfigurationicon) { this.config.columnconfigurationicon = columnconfigurationicon; }

    get currentsort() { return this._currentsort; }
    set currentsort(currentsort) { this._currentsort = currentsort; }

    get data() { return this.config.data; }
    set data(data) { this.config.data = data; }

    get dataprocessor() { return this.config.dataprocessor; }
    set dataprocessor(dataprocessor) { this.config.dataprocessor = dataprocessor; }

    get demphasizeduplicates() { return this.config.demphasizeduplicates; }
    set demphasizeduplicates(demphasizeduplicates) { this.config.demphasizeduplicates = demphasizeduplicates; }

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
    set selectaction(selectaction) { this.config.selectaction = selectaction; }

    get shade() {
        if (!this._shade) { this.buildShade(); }
        return this._shade;
    }
    set shade(shade) { this._shade = shade; }

    get sortable() { return this.config.sortable; }
    set sortable(sortable) { this.config.sortable = sortable; }

    get source() { return this.config.source; }
    set source(source) { this.config.source = source; }

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

}
window.DataGrid = DataGrid;
class FilterConfigurator {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], //Extra css classes to apply,
            filters: [], // Existing filters.
            fields: [
                /*
                 * An array of field definition dictionaries:
                 *
                    name: <string>,    // The variable name for this field (computer readable)
                    label: <string>,   // The human-readable name for the column
                    type: <string>,    // The datatype of the column
                                       //   - string
                                       //   - number
                                       //   - date
                                       //   - time
                                       //   - stringarray
                                       //   - paragraph
                    description: <string>>,  // A string that describes the data in the column
                    classes: <string array>, // Additional classes to apply to cells of this field
                    filterable: <null|string|enum> // Is the field filterable? if so, how?
                */
            ],
            instructions: TextFactory.get('datagrid-filter-instructions')

        };
    }

    /**
     * Supported comparators
     * @return a comparator dictionary.
     * @constructor
     */
    static get COMPARATORS() {
        return {
            'contains' : TextFactory.get('filter-comparator-contains'),
            'notcontains' : TextFactory.get('filter-comparator-notcontains'),
            'equals' : TextFactory.get('filter-comparator-equals'),
            'doesnotequal' : TextFactory.get('filter-comparator-doesnotequal'),
            'isbefore' : TextFactory.get('filter-comparator-isbefore'),
            'isafter' : TextFactory.get('filter-comparator-isafter'),
            'isgreaterthan' : TextFactory.get('filter-comparator-greaterthan'),
            'islessthan' : TextFactory.get('filter-comparator-lessthan')
        }
    }

    /**
     * Get a comparator label
     * @param comparator the comparator
     * @return A string, or null
     */
    static getComparatorLabel(comparator) {
        return FilterConfigurator.COMPARATORS[comparator];
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
         * This this is gigantic and ugly.  Don't @ me.
         * It should really be it's own mini-app/class.  Maybe I'll do it that way one day.
         */
        const me = this;

        this.container = document.createElement('div');
        this.container.classList.add('filter-configurator');

        // instructions
        if (this.instructions) {
            this.container.append(new InstructionBox({
                instructions: [this.instructions]
            }).container);
        }

        this.actions = document.createElement('div');
        this.actions.classList.add('filter-actions');

        this.actions.appendChild(new SimpleButton({
            icon: 'cfb-plus',
            text: TextFactory.get('filter-configurator-add_filter'),
            action: function() {
                let unsets = me.elements.querySelectorAll('[data-field="unset"]');
                if (unsets.length < 1) {
                    me.addFilter();
                }
            }
        }).button);

        this.container.append(this.actions);

        this.elements = document.createElement('ul');
        this.elements.classList.add('filter-list');

        if (this.filters) {
            for (let f of this.filters) {
                this.addFilter(f);
            }
        }

        this.container.append(this.elements);

    }

    /**
     * Add a filter line to the configurator.
     * @param filter
     */
    addFilter(filter) {

        const me = this;

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

        li.appendChild(new DestructiveButton({
            icon: 'minus',
            shape: 'square',
            ghost: true,
            classes: ['filterkiller'],
            action: function() {
                if ((li.getAttribute('data-field')) && (li.getAttribute('data-field') !== 'unset')) {
                    delete me.workingfilters[li.getAttribute('data-filterid')];
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
        const me = this;

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
            placeholder: TextFactory.get('filter-comparator-select_field'),
            classes: ['primeselector'],
            onchange: function(self) {
                let li = self.container.parentElement,
                    validmarker = li.querySelector('div.validmarker'),
                    comparatorfield = li.querySelector('div.select-container.comparator'),
                    valuefield = li.querySelector('div.input-container.valueinput'),
                    field = me.getField(primeSelector.value);

                li.setAttribute('data-valid', 'false');
                if (comparatorfield) {
                    li.removeChild(comparatorfield);
                }
                if (valuefield) {
                    li.removeChild(valuefield);
                }
                if (field) {
                    li.setAttribute('data-field', field.name);
                    li.insertBefore(me.makeComparatorSelector(filterid, field).container, validmarker);
                    li.insertBefore(me.makeValueSelector(filterid, field).container, validmarker);
                    me.checkValidity(li);
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
        const me = this;

        let ourValue = 'contains';
        let comparators = [ // Default for strings.
            { value: 'contains', label: FilterConfigurator.getComparatorLabel('contains') },
            { value: 'notcontains', label: FilterConfigurator.getComparatorLabel('notcontains') },
            { value: 'equals', label: FilterConfigurator.getComparatorLabel('equals') },
            { value: 'doesnotequal', label: FilterConfigurator.getComparatorLabel('doesnotequal') },
        ];

        switch (field.type) {
            case 'date':
            case 'time':
                ourValue = 'equals';
                comparators = [
                    { value: 'equals', checked: true, label: FilterConfigurator.getComparatorLabel('equals') },
                    { value: 'doesnotequal', label: FilterConfigurator.getComparatorLabel('doesnotequal') },
                    { value: 'isbefore', label: FilterConfigurator.getComparatorLabel('isbefore') },
                    { value: 'isafter', label: FilterConfigurator.getComparatorLabel('isafter') }
                ];
                break;
            case 'number':
                ourValue = 'equals';
                comparators = [
                    { value: 'equals', checked: true, label: FilterConfigurator.getComparatorLabel('equals') },
                    { value: 'doesnotequal', label: FilterConfigurator.getComparatorLabel('doesnotequal') },
                    { value: 'isgreaterthan', label: FilterConfigurator.getComparatorLabel('isgreaterthan') },
                    { value: 'islessthan', label: FilterConfigurator.getComparatorLabel('islessthan') }
                ];
                break;
            default:
                break;
        }

        if (value) {
            ourValue = value;
        }

        let comparatorSelector = new SelectMenu({
            options: comparators,
            placeholder: TextFactory.get('filter-comparator-comparator'),
            value: ourValue,
            name: `comparator-${filterid}`,
            minimal: true,
            classes: ['comparator'],
            onchange: function(self) {
                let li = self.container.parentElement;
                me.checkValidity(li);
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
        const me = this;

        let valueSelector;
        switch (field.type) {
            case 'date':
            case 'time':
                valueSelector = new DateInput({
                    value: value,
                    name: `valuefield-${filterid}`,
                    minimal: true,
                    classes: ['valueinput'],
                    onchange: function(self) {
                        let li = self.container.parentElement;
                        me.checkValidity(li);
                    }
                });
                break;
            case 'number':
                valueSelector = new NumberInput({
                    value: value,
                    name: `valuefield-${filterid}`,
                    minimal: true,
                    classes: ['valueinput'],
                    onchange: function(self) {
                        let li = self.container.parentElement;
                        me.checkValidity(li);
                    }
                });
                break;
            case 'imageurl':
                valueSelector = new URLInput({
                    value: value,
                    name: `valuefield-${filterid}`,
                    minimal: true,
                    classes: ['valueinput'],
                    onchange: function(self) {
                        let li = self.container.parentElement;
                        me.checkValidity(li);
                    }
                });
                break;
            case 'string':
            default:
                valueSelector = new TextInput({
                    value: value,
                    name: `valuefield-${filterid}`,
                    minimal: true,
                    classes: ['valueinput'],
                    onchange: function(self) {
                        let li = self.container.parentElement;
                        me.checkValidity(li);
                    }
                });
                break;
        }

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

    get workingfilters() { return this._workingfilters; }
    set workingfilters(workingfilters) { this._workingfilters = workingfilters; }
}
window.FilterConfigurator = FilterConfigurator;