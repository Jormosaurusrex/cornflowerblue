class GridField {

    static get DEFAULT_CONFIG() {
        return {
            name: null,        // The variable name for this field (computer readable)
            label: null,       // The human-readable name for the column
            readonly: false,   // if true, this value cannot be changed
            hidden: false,     // Is the column hidden or not.
            identifier: false, // If true, marks the field as the unique identifier
                               // for a data set.  An identifier is required if the
                               // grid is intended to update entries.  Without a unique
                               // field, data can only be appended, not updated.
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
            separator: ', ', // Used when rendering array values
            nodupe: false, // If true, this column is ignored when deemphasizing duplicate rows.
            resize: false,   // Whether or not to allow resizing of the column (default: false)
            description: null,  // A string that describes the data in the column
            classes: [], // Additional classes to apply to cells of this field
            filterable: true, // Is the field filterable?
            renderer: function(data) {     // A function that can be used to format the data
                return `${data}`;
            }

        };
    }


    /**
     * Define the gridfield
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, GridField.DEFAULT_CONFIG, config);
        return this;
    }





}