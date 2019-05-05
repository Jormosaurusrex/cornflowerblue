"use strict";

class DestructiveButton extends SimpleButton {
    constructor(config) {
        if (config.classes) {
            config.classes.push('destructive');
        } else {
            config.classes = ['destructive', 'foobar'];
        }
        super(config);
    }
}