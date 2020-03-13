class DestructiveButton extends SimpleButton {
    constructor(config) {
        if (config.classes) {
            config.classes.push('destructive');
        } else {
            config.classes = ['destructive'];
        }
        super(config);
    }
}
window.DestructiveButton = DestructiveButton;