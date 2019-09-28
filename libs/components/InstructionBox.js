"use strict";

class InstructionBox {

    static get DEFAULT_CONFIG() {
        return {
            icon : 'help-circle', // If present, will be displayed large next to texts
            id : null, // the id
            instructions: [], // An array of instruction texts
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, InstructionBox.DEFAULT_CONFIG, config);
        if ((!this.instructions) || (this.instructions.length < 1)) { console.warn("No instructions provided to InstructionBox"); }
        return this;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the actual DOM container.
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('instructions');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        if (this.icon) {
            this.container.appendChild(IconFactory.icon(this.icon));
        }
        if ((this.instructions) && (this.instructions.length > 0)) {
            this.setInstructions(this.instructions);
            this.container.appendChild(this.list);
            // Apply specific style based on how many lines there are
        }
    }

    /**
     * Build the list object.  This is the dumbest method I've ever written.
     */
    buildList() {
        this.list = document.createElement('ul');
    }

    /**
     * Build in the instructions.  This method can also be used to re-write them in a new list, as with forms being activated and pacifyd
     * @param instructions an array of strings.
     */
    setInstructions(instructions) {
        this.container.classList.remove('size-1');
        this.container.classList.remove('size-2');
        this.container.classList.remove('size-3');
        this.list.innerHTML = '';

        for (let text of instructions) {
            let li = document.createElement('li');
            li.innerHTML = text;
            this.list.appendChild(li);
        }

        if ((instructions.length > 0) && (instructions.length < 4)) {
            this.container.classList.add(`size-${instructions.length}`);
        }
    }


    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

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

    get list() {
        if (!this._list) { this.buildList(); }
        return this._list;
    }
    set list(list) { this._list = list;  }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

}
