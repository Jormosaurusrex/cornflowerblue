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