"use strict";

/*
 * HiddenFields should not be used for elements that may get visibility at some time.
 */
class HiddenField extends TextInput {
    constructor(config) {
        config.hidden = true;
        config.type = "hidden";
        super(config);
    }
}