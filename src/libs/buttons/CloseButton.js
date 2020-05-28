class CloseButton extends SimpleButton {
    static get DEFAULT_CONFIG() {
        return {
            icon: 'echx',
            text: TextFactory.get('close'),
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
window.CloseButton = CloseButton;