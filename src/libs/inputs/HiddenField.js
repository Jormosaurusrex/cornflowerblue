class HiddenField extends TextInput {
    /*
     * HiddenFields should not be used for elements that may become visible at some time.
     */
    constructor(config) {
        config.hidden = true;
        config.type = "hidden";
        super(config);
    }

    get container() {
        return this.input;
    }
}