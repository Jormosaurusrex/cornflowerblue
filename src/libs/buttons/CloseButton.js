class CloseButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            icon: 'echx',
            text: "Close",
            shape: "square",
            iconclasses: ['closeicon'],
            classes: ["naked", "closebutton"]
        };
    }

    constructor(config) {
        config = Object.assign({}, CloseButton.DEFAULT_CONFIG, config);
        super(config);
    }

}
