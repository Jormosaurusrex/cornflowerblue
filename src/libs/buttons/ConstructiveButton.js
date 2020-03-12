class ConstructiveButton extends SimpleButton {
    constructor(config) {
        if (config.classes) {
            config.classes.push('constructive');
        } else {
            config.classes = ['constructive'];
        }
        super(config);
    }
}
window.ConstructiveButton = ConstructiveButton;