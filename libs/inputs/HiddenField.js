"use strict";

class HiddenField extends TextInput {
    constructor(config) {
        config.hidden = true;
        super(config);
    }
}