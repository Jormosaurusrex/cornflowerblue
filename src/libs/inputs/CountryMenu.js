class CountryMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: "(Select Country)",
            valuesas: 'code' // What to stick in the value for the elements.
                             // "code" or "name".
        };
    }

    /**
     * Define the CountryMenu
     * @param config a dictionary object
     */
    constructor(config) {
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