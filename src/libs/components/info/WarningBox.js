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