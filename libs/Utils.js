"use strict";

class Utils {

    /**
     * Parses all URL parameters into a dictionary.  Returns the dictionary.
     * Can be used in-line but that may be slow.
     * @param url (optional) an URL to parse. If empty, parses the window's URL.
     * @return {object} a dictionary of the URL params
     */
    static getAllURLParams(url) {

        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        var dict = {};

        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');

                // set parameter name and value (use 'true' if empty)
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {

                    // create key if it doesn't exist
                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!dict[key]) dict[key] = [];

                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        var index = /\[(\d+)\]/.exec(paramName)[1];
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
            var a1 = a.toLowerCase(),
                b1 = b.toLowerCase();
            if(a1 === b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
        let vlines = [];
        for (let k of keys) {
            if (typeof obj[k] === 'function') {
                vlines.push(`\t ${k} : function(e, self) { ... }`);
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
     * Encrypt a text string
     * @param message the string to encrypt
     * @return {Promise<string>}
     */
    async static sha256(message) {
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

        var n = value;
        var i;
        var j;
        var sign = n < 0 ? "-" : "";
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "";
        j = (j = i.length) > 3 ? j % 3 : 0;

        return sign + currencySymbol + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
    }

    /**
     * Tests whether or not a string is a valid email address.
     * @param email The email address to check
     * @return {boolean} true or false, depending
     */
    static isValidEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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

