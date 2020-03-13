class MessageBox {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // the id
            icon: null,
            title: null,
            content: null,
            classes: [] //Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, MessageBox.DEFAULT_CONFIG, config);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('messagebox');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.title) {
            this.header = document.createElement('h3');
            this.header.innerHTML = this.title;
            this.container.appendChild(this.header);
        }
        if (this.content) {
            if (this.icon) {
                this.payload.appendChild(IconFactory.icon(this.icon));
            }
            this.content.classList.add('content');
            this.payload.appendChild(this.content);
            this.container.appendChild(this.payload);
        }
    }

    buildPayload() {
        this.payload = document.createElement('div');
        this.payload.classList.add('payload');
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get content() { return this.config.content; }
    set content(content) { this.config.content = content; }

    get header() { return this._header; }
    set header(header) { this._header = header; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get payload() {
        if (!this._payload) { this.buildPayload(); }
        return this._payload;
    }
    set payload(payload) { this._payload = payload; }

    get title() { return this.config.title; }
    set title(title) { this.config.title = title; }

}
window.MessageBox = MessageBox;