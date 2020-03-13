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