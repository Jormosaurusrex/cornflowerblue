class TextFactory {

    //static _LOCALE = null;
    static get DEFAULT_LOCALE() { return 'en'; }

    static get LOCALE() { return TextFactory._LOCALE; }
    static set LOCALE(locale) { TextFactory._LOCALE = locale; }

    /**
     * Return the active library of text strings.
     * @return {*}
     */
    static get library() {
        if (!TextFactory._library) {
            TextFactory._library = TextFactory._libraryBase;
        }
        let dt = TextFactory.determineLocale();
        if (TextFactory._library[dt]) {
            return TextFactory._library[dt];
        }
        return TextFactory._library[TextFactory.DEFAULT_LOCALE];
    }

    static get _libraryBase() {
        return {
            en: {
                "login": "Login",
                "password": "Password",
                "close_pane" : "Close panel",
                "email": "Email",
                "color-red" : "Red",
                "color-orange" : "Orange",
                "color-yellow" : "Yellow",
                "color-green" : "Green",
                "color-blue" : "Blue",
                "color-darkblue" : "Dark Blue",
                "color-purple" : "Purple",
                "color-tan" : "Tan",
                "color-white" : "White",
                "color-black" : "Black",
                "color-pink" : "Pink",
                "color-grey" : "Grey",
                "color-brown" : "Brown",
                "passwordinput-placeholder-enter_password": "Enter your password.",
                "remember_me": "Remember me",
                "loginform-error-passwords_dont_match": "Email and password do not match.",
                "loginform-instructions-enter_username": "Enter your username and password.",
                "create_account": "Create account",
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
                "datagrid-tooltip-filters": "Add, remove, or edit filters.",
                "datagrid-activitynotifier-text": "Working...",
                "datagrid-column-config-instructions": "Select which columns to show in the grid. This does not hide the columns during export.",
                "datagrid-filter-instructions": "Columns that are filterable are shown below. Set the value of the column to filter it.",
                "datagrid-message-no_visible_columns": 'No columns are visible in this table.',
                "datagrid-message-empty_grid": "There are no rows in this dataset.",
                "datagrid-spinnertext": 'Loading',
                "datalist-noentries" : "(No Entries)",
                "dateinput-error-invalid": 'This is an invalid date.',
                "dateinput-trigger-arialabel": 'Open date picker',
                "decrement_number": 'Decrement number',
                "emailinput-placeholder-default": 'person@myemailaccount.net',
                "emailinput-error-invalid_web_address": 'This is an invalid email address.',
                "error": 'Error',
                "export": 'Export',
                "export-current_view": "Export current view",
                "fileinput-placeholder-file": 'Click to select file',
                "fileinput-placeholder-multiple": 'Click to select files (multiple accepted)',
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
                "name": 'Name',
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
                "passwordchanger-currentpw-help": 'This is your current password.',
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
                "save": "Save",
                "save_changes": "Save changes",
                "cancel_changes": "Cancel changes",
                "make_changes": "Make changes",
                "save_columns": "Save columns",
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
                "select_image": 'Select Image',
                "timezone_select": 'Select timezone',
                "toggle_menu": 'Toggle menu',
                "uppercase": 'Uppercase',
                "urlinput-placeholder-default": 'https://somewhere.cornflower.blue/',
                "urlinput-error-invalid_web_address": 'This is an invalid web address.',
                "warning": 'Warning',
                "country_code": "Country Code",
                "country": "Country",
                "time_zone": "Time zone",
                "offset": "Offset",
                "code": "Code",
                "alternate_names": "Alternate names"
            }
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
            if (t) {
                for (let arg = 1; arg <= arguments.length; arg++) {
                    t = t.replace(`$${arg}`, arguments[arg]);
                }
                return t;
            }
        }

        if (!TextFactory.library[arguments[0]]) {
            //console.warn(`Text key not found: ${arguments[0]}`);
            return arguments[0];
        }
        return TextFactory.library[arguments[0]];
    }

    static determineLocale() {
        if ((typeof TextFactory.LOCALE !== 'undefined') && (TextFactory.LOCALE !== null)) {
            return TextFactory.LOCALE;
        }
        if ((document) && (document.documentElement) && (document.documentElement.lang)) { return document.documentElement.lang; }
        return TextFactory.DEFAULT_LOCALE;
    }

    /**
     * Loads a text dictionary.  This method will attempt to determine a LOCALE if none exists and will set that.
     * @param urlset source(s) for the messages file.  Can be either a single url ("messages.json"), which will get merged into DEFAULT_LOCALE, or a dictionary of URLS, where it's { lang: 'url' }.
     * @param callback An optional callback to execute when the load is done.
     */
    static load(urlset, callback) {
        if (!urlset) {
            console.error('TextFactory.load() called without any URLs');
            return;
        }
        let locale = TextFactory.determineLocale(),
            url;

        if (typeof urlset === 'object') {
            if (urlset[locale]) { url = urlset[locale]; }
        } else {
            url = urlset;
        }
        if (!url) {
            console.error('TextFactory.load() called with missing URL');
            if ((callback) && (typeof callback === 'function')) {
                callback();
            }
            return;
        }
        fetch(url, {
            headers: { "Content-Type": "application/json; charset=utf-8" }
        })
            .then(response => response.json()) // response -> json
            .then(data => { // do the thing.
                // Now we have a bunch of messages for a specific locale.
                let dict = TextFactory.library[locale];
                if (!dict) { dict = {}; }
                dict = Object.assign({}, dict, data);
                TextFactory._library[locale] = dict;
                if ((callback) && (typeof callback === 'function')) {
                    callback();
                }
            })
            .catch(err => {
                console.error(`Error while fetching data from ${url}`);
                console.error(err);
            });
    }

}
window.TextFactory = TextFactory;