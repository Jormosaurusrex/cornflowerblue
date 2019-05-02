"use strict";

class InstructionBox {

    static DEFAULT_CONFIG = {
        icon : null, // If present, will be displayed large next to texts
        id : null, // the id
        instructions: [], // An array of instruction texts
        classes: [] //Extra css classes to apply
    };

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, InstructionBox.DEFAULT_CONFIG, config);
        if ((!this.instructions) || (this.instructions.length < 1)) { console.warn("No instructions provided to InstructionBox"); }
        return this;
    }

    /**
     * Build the actual DOM container.
     */
    buildContainer() {
        this.container = $('<div />')
            .addClass('instructions')
            .addClass(this.classes.join(' '));
        if (this.icon) {
            this.container.append(IconFactory.makeIcon(this.icon));
        }
        if ((this.instructions) && (this.instructions.length > 1)) {
            let $list = $('<ul />');
            for (let text of this.instructions) {
                $list.append($('<li>').html(text));
            }
            this.container.append($list);
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () {
        return Utils.getConfig(this);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get list() { return this._list; }
    set list(list) { this._list = list;  }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

}