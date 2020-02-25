class TagButton extends HelpButton {

    static get DEFAULT_CONFIG() {
        return {
            iconside: 'right', // The side the button displays on
            icon: 'echx',  // icon to use in the button,
            iconclasses: ['tagicon'],
            shape: 'pill',
            size: 'small',
            //tipicon: '' // hide
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, TagButton.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('tagbutton');
        } else {
            config.classes = ['tagbutton'];
        }
        super(config);
    }

}
