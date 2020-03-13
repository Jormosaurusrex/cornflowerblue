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