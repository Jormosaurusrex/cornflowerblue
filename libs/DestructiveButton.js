"use strict";

class DestructiveButton extends SimpleButton {
    constructor(definition) {
        if (definition.classes) {
            definition.classes.push('destructive');
        } else {
            definition.classes = ['destructive'];
        }
        super(definition);
    }
}