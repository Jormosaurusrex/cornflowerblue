class HelpButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: function(e, self) { self.tooltip.open(); },
            icon: 'help-circle',
            tipicon: 'help-circle',
            tipgravity: 'n',
            arialabel: TextFactory.get('help'),
            iconclasses: ['helpicon'],
            tooltip: null // help text to display
        };
    }

    constructor(config) {
        config = Object.assign({}, HelpButton.DEFAULT_CONFIG, config);
        if (config.classes) {
            if (!config.classes.includes('tagbutton')) {
                config.classes.push('naked');
                config.classes.push('help');
            }
        } else {
            config.classes = ['naked', 'help'];
        }
        if (!config.id) { // need to generate an id for aria stuff
            config.id = `${CFBUtils.getUniqueKey(5)}-help`;
        }
        super(config);
    }

}
window.HelpButton = HelpButton;