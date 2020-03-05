class TextFactory {

    static get DEFAULT_STRINGS() {
        return {
            "actions" : 'Actions',
            "bulk_select" : 'Bulk select',
            "cancel" : 'Cancel',
            "caution" : 'Caution',
            "change_password" : 'Change Password',
            "close" : 'Close',
            "columns" : 'Columns',
            "configure_columns" : 'Configure Columns',
            "configure_generator" : 'Configure generator',
            "confirm_password" : 'Confirm Password',
            "countrymenu_select" : 'Select country',
            "current_password" : 'Current Password',
            "datagrid-activitynotifier-text" : "Working...",
            "datagrid-column-config-instructions" : "Select which columns to show in the grid. This does not hide the columns during export.",
            "datagrid-filter-instructions" : "Columns that are filterable are shown below. Set the value of the column to filter it.",
            "datagrid-message-no_visible_columns" : 'No columns are visible in this table.',
            "dateinput-error-invalid" : 'This is an invalid date.',
            "datagrid-spinnertext" : 'Loading',
            "dateinput-trigger-arialabel" : 'Open date picker',
            "decrement_number" : 'Decrement number',
            "emailinput-placeholder-default" : 'person@myemailaccount.net',
            "emailinput-error-invalid_web_address" : 'This is an invalid email address.',
            "error" : 'Error',
            "export" : 'Export',
            "fileinput-placeholder-file" : 'Select file',
            "fileinput-placeholder-multiple" : 'Select files (multiple accepted)',
            "filters" : 'Filters',
            "generate_password" : 'Generate password',
            "help" : 'Help',
            "hide_password" : 'Hide password',
            "increment_number" : 'Increment number',
            "input-counter-limit" : '$1 of $2 characters entered',
            "input-counter-sky" : '$1 characters entered',
            "input-counter-remaining" : '$1 characters remaining',
            "input-error-required" : 'This field is required',
            "items_label" : 'Items:',
            "lowercase" : 'Lowercase',
            "manage_filters" : 'Manage Filters',
            "matches_hidden_columns" : "Your search matches data in hidden columns.",
            "new_password" : 'New Password',
            "no_columns" : 'No columns',
            "no_provided_content" : 'No provided content',
            "no_results" : 'No results',
            "not_set" : "(Not Set)",
            "numberinput-error-maximum_value" : "The maximum value for this field is '$1'.",
            "numberinput-error-minimum_value" : "The minimum value for this field is '$1'.",
            "numberinput-error-must_be_whole_numbers" : 'Values must be whole numbers.',
            "numberinput-error-nan" : 'This is not a number.',
            "numberinput-error-values_divisible" : 'Values must be divisible by $1',
            "numberinput-placeholder-basic" : 'Enter a number',
            "numberinput-placeholder-between_x_y" : 'Enter a number between $1 and $2',
            "numberinput-placeholder-fragment_increments" : ' (increments of $1)',
            "numberinput-placeholder-larger_than_x" : 'Enter a number larger than $1',
            "numberinput-placeholder-smaller_than_y" : 'Enter a number smaller than $1',
            "numbers" : 'Numbers',
            "open_menu" : 'Open menu',
            "passwordchanger-currentpw-help" : 'This is your current password. We need to confirm that you are who you are.',
            "passwordchanger-currentpw-placeholder" : 'Your current password',
            "passwordchanger-error-cannot_be_used_as_pw" : 'This cannot be used as a password.',
            "passwordchanger-error-passwords_must_match" : 'Passwords must match.',
            "passwordchanger-form-instructions" : 'Change your password here.',
            "passwordchanger-placeholder-minlength" : 'Must be at least $1 characters',
            "passwordchanger-placeholder-suggested" : 'Should be at least $1 characters',
            "passwordchanger-results-changed_successfully" : 'Your password has been changed successfully!',
            "passwordchanger-error-maxlength" : 'Password must be less than $1 characters.',
            "passwordchanger-error-minlength" : 'Password must be at least $1 characters.',
            "passwordchanger-error-suggestedlength" : 'Password is less than the suggested length of $1 characters.',
            "primary" : 'Primary',
            "punctuation" : 'Punctuation',
            "required_lc" : 'required',
            "search" : 'Search',
            "search_noresults" : 'No entries were found matching your search terms.',
            "search_this_data" : 'Search this data',
            "searchcontrol-instructions" : 'Enter search terms',
            "selectmenu-placeholder-default" : 'Select value',
            "show_password" : 'Show password',
            "simpleform-spinnertext" : 'Please wait',
            "skip_to_content" : 'Skip to content',
            "statemenu_select" : 'Select state or province',
            "success" : 'Success',
            "timezone_select" : 'Select timezone',
            "toggle_menu" : 'Toggle menu',
            "uppercase" : 'Uppercase',
            "urlinput-placeholder-default" : 'https://somewhere.cornflower.blue/',
            "urlinput-error-invalid_web_address" : 'This is an invalid web address.',
            "warning" : 'Warning'

        }
    }

    /**
     * Get a text value by key
     * @return {null|*}
     */
    static get() {
        if (!arguments) { return null; }
        if (arguments.length > 1) {
            let t = TextFactory.DEFAULT_STRINGS[arguments[0]];
            for (let acount = 1; acount <= arguments.length; acount++) {
                t = t.replace(`$${acount}`, arguments[acount]);
            }
            return t;
        }
        if (!TextFactory.DEFAULT_STRINGS[arguments[0]]) {
            console.error(`Text key not found: ${arguments[0]}`);
        }
        return TextFactory.DEFAULT_STRINGS[arguments[0]];
    }

}