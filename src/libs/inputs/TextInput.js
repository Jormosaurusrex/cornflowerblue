class TextInput extends InputElement {
    constructor(config) {
        if (!config) { config = {}; }
        config.type = "text";
        super(config);
    }
}
