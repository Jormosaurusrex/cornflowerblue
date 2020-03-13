class InstructionBox extends MessageBox {

    static get DEFAULT_CONFIG() {
        return {
            icon : 'help-circle', // If present, will be displayed large next to texts
            instructions: [] // An array of instruction texts
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, InstructionBox.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('instructions');
        } else {
            config.classes = ['instructions'];
        }
        super(config);
    }

    /* PSEUDO GETTERS___________________________________________________________________ */

    get infolist() { return this.instructions; }
    set infolist(infolist) { this.instructions = infolist; }

    setInstructions(instructions) {
        this.setInfolist(instructions);
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Replace existing infolist with some different ones
     * @param infolist an array of info items
     */
    setInfolist(infolist) {
        this.container.classList.remove('size-1');
        this.container.classList.remove('size-2');
        this.container.classList.remove('size-3');
        this.list.innerHTML = '';

        for (let text of infolist) {
            let li = document.createElement('li');
            li.innerHTML = text;
            this.list.appendChild(li);
        }

        if ((infolist.length > 0) && (infolist.length < 4)) {
            this.container.classList.add(`size-${infolist.length}`);
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the actual DOM container.
     */
    buildContainer() {
        if ((this.infolist) && (this.infolist.length > 0)) {
            for (let text of this.infolist) {
                let li = document.createElement('li');
                li.innerHTML = text;
                this.list.appendChild(li);
            }
            this.content = this.list;
        }

        super.buildContainer();

        if ((this.infolist.length > 0) && (this.infolist.length < 4)) {
            this.container.classList.add(`size-${this.infolist.length}`);
        }
    }

    /**
     * Build the list object.  This is the dumbest method I've ever written.
     */
    buildList() {
        this.list = document.createElement('ul');
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get instructions() { return this.config.instructions; }
    set instructions(instructions) { this.config.instructions = instructions; }

    get list() {
        if (!this._list) { this.buildList(); }
        return this._list;
    }
    set list(list) { this._list = list;  }

}
window.InstructionBox = InstructionBox;