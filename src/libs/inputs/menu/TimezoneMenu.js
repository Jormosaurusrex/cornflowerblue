class TimezoneMenu extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('timezone_select'),
            options: new TimeZoneDefinition().options,
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
        super(config);
    }
}
window.TimezoneMenu = TimezoneMenu;