class Toast extends FloatingPanel {

    static get DEFAULT_CONFIG() {
        return {
            text : null,
            closeicon: 'echx',
            duration: 4000,
            icon: null,
            position: 'bottom-right'
        };
    }

    static get DOCUMENTATION() {
        return {
            icon: { type: 'option', datatype: 'string', description: "The icon to use in the toast." },
            closeicon: { type: 'option', datatype: 'string', description: "The icon to use in the toast's CloseButton." },
            iconclasses: { type: 'option', datatype: 'stringarray', description: "An array of css classes to apply to the icon." },
            text: { type: 'option', datatype: 'string', description: "The toast payload" },
            duration: { type: 'option', datatype: 'number', description: "Length of time in milliseconds to display. If 0 or negative, stays open." }
        };
    }

    static get GROWLBOX_ID() { return 'gbox-'; }

    /**
     * Quick access to a generic toast, with an optional title.
     * @param text the text to display
     * @param title (optional) a title
     * @return {Toast}
     */
    static growl(text, title) {
        return new Toast({
            text: text,
            title: title
        });
    }

    /**
     * Quick access to a error toast
     * @param text the text to display
     * @return {Toast}
     */
    static error(text) {
        return new Toast({
            text: text,
            title: TextFactory.get('error'),
            icon: 'warn-hex',
            classes: ['error']
        });
    }

    /**
     * Quick access to a warn toast
     * @param text the text to display
     * @return {Toast}
     */
    static warn(text) {
        return new Toast({
            text: text,
            title: TextFactory.get('warning'),
            icon: 'warn-triangle',
            classes: ['warn']
        });
    }

    /**
     * Quick access to a caution toast
     * @param text the text to display
     * @return {Toast}
     */
    static caution(text) {
        return new Toast({
            text: text,
            title: TextFactory.get('caution'),
            icon: 'warn-circle',
            classes: ['caution']
        });
    }

    /**
     * Quick access to a success toast
     * @param text the text to display
     * @return {Toast}
     */
    static success(text) {
        return new Toast({
            text: text,
            title: TextFactory.get('success'),
            icon: 'check-circle',
            classes: ['success']
        });
    }

    /**
     * Builds a growlbox and inserts it into the dom.
     * @param position the position to create it at.
     * @return HTMLDivElement growlbox object
     */
    static buildGrowlbox(position) {
        let gb = document.createElement('div');
        gb.classList.add('growlbox');
        gb.setAttribute('id', `${Toast.GROWLBOX_ID}${position}`);
        gb.classList.add(position);
        document.querySelector('body').appendChild(gb);
        return gb;
    }

    /**
     * Define a toast
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, Toast.DEFAULT_CONFIG, config);
        super(config);

        this.growlbox = document.getElementById(`${Toast.GROWLBOX_ID}${this.position}`);
        if (!this.growlbox) {
            this.growlbox = Toast.buildGrowlbox(this.position);
        }
        this.show();
    }

    /**
     * Close the toast
     */
    close() {

        if (this.timer) { clearTimeout(this.timer); }
        this.container.setAttribute('aria-hidden', 'true');

        setTimeout(()  => {
            if ((this.onclose) && (typeof this.onclose === 'function')) {
                this.onclose(me);
            }
            this.container.parentNode.removeChild(this.container);
        }, 100);

    }

    /**
     * Quickly close the toast, no animations.
     */
    quickClose() {
        if (this.timer) { clearTimeout(this.timer); }
        this.container.parentNode.removeChild(this.container);
        if ((this.onclose) && (typeof this.onclose === 'function')) {
            this.onclose(this);
        }
    }

    /**
     * Show the toast
     */
    show() {

        this.container.removeAttribute('aria-hidden');

        if (this.duration > 0) {
            this.timer = setTimeout(()  => {
                this.close();
            }, this.duration);
        }
        if ((this.onopen) && (typeof this.onopen === 'function')) {
            this.onopen(this);
        }
    }

    buildContainer() {


        this.container = document.createElement('div');
        this.container.setAttribute('aria-hidden', 'true');
        this.container.classList.add('toast');

        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        this.closebutton = new CloseButton({
            action: (e) => {
                e.preventDefault();
                this.quickClose();
            }
        });

        if (this.title) {
            let h3 = document.createElement('h3');
            let span = document.createElement('span');
            span.classList.add('text');
            span.innerHTML = this.title;
            h3.appendChild(span);
            h3.appendChild(this.closebutton.button);
            this.container.appendChild(h3);
        } else {
            this.container.appendChild(this.closebutton.button);
        }

        if (this.text) {
            let payload = document.createElement('div');
            payload.classList.add('payload');
            if (this.icon) {
                let i = IconFactory.icon(this.icon);
                i.classList.add('i');
                payload.appendChild(i);
            }

            let d = document.createElement('div');
            d.classList.add('text');
            d.innerHTML = this.text;
            payload.appendChild(d);

            this.container.appendChild(payload);
        }

        this.growlbox.appendChild(this.container);

    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get duration() { return this.config.duration; }
    set duration(duration) { this.config.duration = duration; }

    get growlbox() { return this._growlbox; }
    set growlbox(growlbox) { this._growlbox = growlbox; }

    get icon() { return this.config.icon; }
    set icon(icon) { this.config.icon = icon; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

    get timer() { return this._timer; }
    set timer(timer) { this._timer = timer; }

}
window.Toast = Toast;