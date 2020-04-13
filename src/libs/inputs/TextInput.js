class TextInput extends InputElement {
    constructor(config) {
        if (!config) { config = {}; }
        if (!config.type) { config.type = "text"; }
        super(config);
    }
}
window.TextInput = TextInput;