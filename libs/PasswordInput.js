"use strict";

class PasswordInput extends TextInput {
    constructor(config) {
        config.type = ['password'];
        super(config);
    }
}