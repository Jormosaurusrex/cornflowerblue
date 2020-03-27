class CountryMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('countrymenu_select'),
            options: new CountryCode().options,
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

        if ((config.valuesas) && (config.valuesas === 'name')) {
            config.options = [];
            let countries = new CountryCode().list;
            for (let c of countries) {
                config.options.push({ label: c.name, value: c.name });
            }
        }
        if (config.value) {
            for (let o of config.options) {
                if ((config.value.toUpperCase() === o.value) || (config.value.toUpperCase() === o.label)) {
                    o.checked = true;
                }
            }
        }

        super(config);
    }
}
window.CountryMenu = CountryMenu;