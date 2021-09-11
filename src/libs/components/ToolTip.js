class ToolTip {

    static get DEFAULT_CONFIG() {
        return {
            containerId: 'cfb-tooltip',
            gravity: 'n',
            text: null,
            parent: null,
            waittime: 1000
        };
    }

    static get DOCUMENTATION() {
        return {
            gravity: { type: 'option', datatype: 'string', description: "The direction to open the tooltip into." },
            text: { type: 'option', datatype: 'string', description: "The text to use in the tooltip." },
            parent: { type: 'option', datatype: 'object', description: "The parent object this fires off." },
            waittime: { type: 'option', datatype: 'number', description: "How long to wait (in milliseconds) before activating." }
        };
    }

    static closeOpen() {
        clearTimeout(ToolTip.timer);
        for (let tt of document.body.querySelectorAll('div.tooltip')) {
            tt.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, ToolTip.DEFAULT_CONFIG, config);
        return this;
    }

    /**
     * Attach the tooltip to its parent.  Will reset an existing parent if one is provided
     * during construction.
     * @param parent
     */
    attach(parent) {
        if (!parent) return;
        if ((parent) && (parent.container)) {
           parent = parent.container;
        }
        this.parent = parent;
        this.parent.setAttribute('data-tooltip', 'closed');

        const onmouseout = (e) => {
            clearTimeout(ToolTip.timer);
            this.close();
            this.parent.removeEventListener('mouseout', onmouseout);
        }
        const onmouseover = (e) => {
            this.open();
            this.parent.addEventListener('mouseout', onmouseout);
        }

        const onfocusout = (e) => {
            clearTimeout(ToolTip.timer);
            this.close();
            this.parent.removeEventListener('focusout', onfocusout);
        }
        const onfocusin = (e) => {
            this.open();
            this.parent.addEventListener('focusout', onfocusout);
        }

        this.parent.addEventListener('mouseover', onmouseover);
        this.parent.addEventListener('focusin', onfocusin);

    }
    /* PSEUDO-ACCESSORS ________________________________________________________________ */

    get isopen() {
        if (!ToolTip.activeTooltip) { return false; }
        return ToolTip.activeTooltip.container.hasAttribute('aria-hidden');
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Opens the help tooltip
     * This actually only starts a timer.  The actual opening happens in openGuts()
     */
    open() {
        ToolTip.closeOpen();
        ToolTip.timer = setTimeout(()  => {
            this.openGuts();
        }, this.waittime);
    }

    /**
     * Do the actual opening.
     */
    openGuts() {
        if ((this.parent.hasAttribute('aria-expanded')) && (this.parent.getAttribute('aria-expanded') === "true")) {
            return;
        }

        this.container = document.getElementById(`${this.containerId}`);

        if (!this.container) {
            this.buildContainer();
        }

        this.container.innerHTML = this.text;
        this.container.removeAttribute('aria-hidden');

        if (typeof ToolTip.activeTooltip === 'undefined' ) {
            ToolTip.activeTooltip = this;
        } else {
            ToolTip.activeTooltip = this;
        }
        switch(this.gravity) {
            case 's':
            case 'south':
                this.container.setAttribute('data-gravity', 's');
                break;
            case 'w':
            case 'west':
                this.container.setAttribute('data-gravity', 'w');
                break;
            case 'e':
            case 'east':
                this.container.setAttribute('data-gravity', 'e');
                break;
            case 'n':
            case 'north':
                this.container.setAttribute('data-gravity', 'n');
                break;
            case 'nw':
            default:
                this.container.setAttribute('data-gravity', 'nw');
                break;
        }

        this.setPosition();

        /*
            This is gross but:
                1) anonymous functions can't be removed, so we have a problem with "this"
                2) we can't pass this.setPosition as the function because "this" becomes "window"
                3) we can't remove a listener set this way in a different method (e.g., close())
         */
        const me = this;
        window.addEventListener('scroll', function _listener() {
            if (!me.isopen) {
                window.removeEventListener('scroll', _listener, true);
            }
            me.setPosition();
        }, true);

    }

    /**
     * Set the position of the tooltip.
     */
    setPosition() {
        if (!ToolTip.activeTooltip) { return; }
        let self = ToolTip.activeTooltip;

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = self.parent.getBoundingClientRect(),
            offsetLeft = elemRect.left - bodyRect.left,
            offsetTop = elemRect.top - bodyRect.top;

        switch(this.gravity) {
            case 's':
            case 'south':
                self.container.style.top = `${(offsetTop + self.container.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.container.style.left = `${offsetLeft - (self.container.offsetWidth / 2) + (this.parent.offsetWidth / 2 )}px`;
                break;
            case 'sw':
            case 'southwest':
                self.container.style.top = `${(offsetTop + self.container.clientHeight + (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.container.style.left = `${offsetLeft - CFBUtils.getSingleEmInPixels()}px`;
                break;
            case 'w':
            case 'west':
                self.container.style.top = `${offsetTop}px`;
                self.container.style.left = `${offsetLeft - self.container.clientWidth - (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'e':
            case 'east':
                self.container.style.top = `${offsetTop}px`;
                self.container.style.left = `${offsetLeft + self.parent.offsetWidth + (CFBUtils.getSingleEmInPixels() / 2)}px`;
                break;
            case 'n':
            case 'north':
                self.container.style.top = `${(offsetTop - self.container.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.container.style.left = `${offsetLeft - (self.container.offsetWidth / 2) + (this.parent.offsetWidth / 2 )}px`;
                break;
            case 'ne':
            default:
                self.container.style.top = `${(offsetTop - self.container.clientHeight - (CFBUtils.getSingleEmInPixels() / 2))}px`;
                self.container.style.left = `${offsetLeft}px`;
                break;
        }

    }

    /**
     * Closes the tooltip.
     */
    close() {
        if (!this.container) { this.container = document.getElementById(this.containerId); }
        if (this.container) {
            this.container.setAttribute('aria-hidden', 'true');
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.setAttribute('id', this.containerId)
        this.container.classList.add('tooltip');
        this.container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.container);
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get container() { return this._container; }
    set container(container) { this._container = container; }

    get containerId() { return this.config.containerId; }
    set containerId(containerId) { this.config.containerId = containerId; }

    get gravity() { return this.config.gravity; }
    set gravity(gravity) { this.config.gravity = gravity; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get parent() { return this.config.parent; }
    set parent(parent) { this.config.parent = parent; }

    get text() { return this.config.text; }
    set text(text) { this.config.text = text; }

    get timer() { return this._timer; }
    set timer(timer) { this._timer = timer; }

    get tooltip() { return this._tooltip; }
    set tooltip(tooltip) { this._tooltip = tooltip; }

    get waittime() { return this.config.waittime; }
    set waittime(waittime) { this.config.waittime = waittime; }

}
window.ToolTip = ToolTip;