class TextArea extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            counter: 'sky'
        };
    }

    static get DEFAULT_CONFIG_DOCUMENTATION() {
        return {
            counter: { type: 'option', datatype: 'string', description: "A value for a character counter. Null means 'no counter'. Possible values: null, 'remaining', 'limit', and 'sky'." }
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, TextArea.DEFAULT_CONFIG, config);
        config.type = "textarea";
        super(config);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('textarea-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        this.topline = document.createElement('div');
        this.topline.classList.add('topline');
        if (this.label) { this.topline.appendChild(this.labelobj); }
        if (this.topcontrol) { this.topline.appendChild(this.topcontrol); }
        this.container.appendChild(this.topline);

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.input);
        this.container.appendChild(wrap);

        this.container.appendChild(this.passivebox);
        this.container.appendChild(this.messagebox);

        this.postContainerScrub();

    }

}
window.TextArea = TextArea;