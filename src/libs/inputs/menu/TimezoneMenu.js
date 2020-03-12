class TimezoneMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('timezone_select'),
            valuesas: 'offset' // What to stick in the value for the elements.
                             // "offset" or "name".
        };
    }

    /**
     * Define the TimezoneMenu
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, TimezoneMenu.DEFAULT_CONFIG, config);

        let options = [];
        for (let tz of TimezoneDB.list()) {
            let o = { label: tz.id };
            if ((config.valuesas) && (config.valuesas === 'name')) {
                o.value = tz.id;
            } else {
                o.value = tz.offset;
            }
            if ((config.value) && ((config.value.toUpperCase() === tz.id) || (config.value.toUpperCase() === tz.offset))) {
                o.checked = true;
            }
            options.push(o);
        }

        config.options = options;
        super(config);

    }
}
window.TimezoneMenu = TimezoneMenu;