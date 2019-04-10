"use strict";

class ConstructiveButton extends SimpleButton {
    constructor(definition) {
        if (definition.classes) {
            definition.classes.push('constructive');
        } else {
            definition.classes = ['constructive'];
        }
        super(definition);
    }
}