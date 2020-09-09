class SimpleProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            classes: [],
            label: null,
            help: null,
            style: 'boxed',
            commaseparate: true,
            direction: 'horizontal',
            currentrank: null,
            nextrank: null,
            showcaps: true,
            decalposition: 'interior',
            maxvalue: 100,
            minvalue: 0,
            value: 50,
            fill: null
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. The dialog object will have this as it's id." },
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            label: { type: 'option', datatype: 'string', description: "The title for the progress meter." },
            help: { type: 'option', datatype: 'string', description: "Help text." },
            style: { type: 'option', datatype: 'enmumeration', description: "One of a handful of additional styles: boxed, roundcap or interiorroundcamp" },
            commaseparate: { type: 'option', datatype: 'boolean', description: "Set to false to not comma separate numbers." },
            currentrank: { type: 'option', datatype: 'string', description: "A string, if present, will be displayed inside (along with minvalue)." },
            direction: { type: 'option', datatype: 'enumeration', description: "Which direction does the meter run? Values: 'vertical' or 'horizontal' (default)." },
            nextrank: { type: 'option', datatype: 'string', description: "A string, if present, will be displayed inside (along with maxvalue)." },
            showcaps: { type: 'option', datatype: 'boolean', description: "if true, show the min and max values.  True by default if currentrank or nextrank is set." },

            decalposition: { type: 'option', datatype: 'enumeration', description: "Where should the decals appear. Values: non, exterior, exterior-bottom" },
            maxvalue: { type: 'option', datatype: 'number', description: "The maximum score value for the meter." },
            minvalue: { type: 'option', datatype: 'number', description: "The minimum score value for the meter." },
            value: { type: 'option', datatype: 'number', description: "The current score, absolute." },
            fill: { type: 'option', datatype: 'number', description: "Width of the progressbar to fill.  Used if provided, or else calculated from other values." }
        };
    }


    /**
     * Define a SimpleProgressMeter
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleProgressMeter.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `progress-${CFBUtils.getUniqueKey(5)}`; }
        this.determineFill();
    }

    /* CORE METHODS_____________________________________________________________________ */

    determineFill() {
        if (this.fill) return; // use provided fill

        // Figure out where value lies between minnumber and maxxnumber.
        let pointscale = (this.maxvalue - this.minvalue),
            subjectivevalue = this.value - this.minvalue;

        if (this.value < this.minvalue) {
            subjectivevalue = this.value;
        }

        this.fill = (subjectivevalue / pointscale) * 100;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the container
     */
    buildContainer() {
        const me = this;

        this.container = document.createElement('div');
        this.container.classList.add('progressbar-container');
        this.container.classList.add(this.direction);

        this.progress = document.createElement('div');
        this.progress.classList.add('progress');

        this.bar = document.createElement('div');
        this.bar.classList.add('simpleprogress');
        this.bar.classList.add(this.style);
        this.bar.appendChild(this.progress);

        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.label) { this.container.appendChild(this.labelobj); }

        if (((this.currentrank) || (this.nextrank))
            && (this.decalposition) && (this.decalposition === 'exterior')) {
            this.container.appendChild(this.decallayer);
            this.bar.classList.add('exteriordecal');
        }

        this.container.appendChild(this.bar);

        if (((this.currentrank) || (this.nextrank))
            && (this.decalposition) && (this.decalposition !== 'exterior')
            && (this.decalposition !== 'none')) {
            if (this.decalposition === 'exterior-bottom') {
                this.container.appendChild(this.decallayer);
                this.bar.classList.add('exteriordecal-bottom');
            } else {
                this.bar.appendChild(this.decallayer);
                this.bar.classList.add('withdecals');
            }
        }

        // Don't allow the the fill animation to fire until it's in the page
        setTimeout(function() {
            if (me.direction === 'vertical') {
                me.progress.style.height = `${me.fill}%`;
            } else {
                me.progress.style.width = `${me.fill}%`;
            }
        }, 500);
    }

    /**
     * Builds the decal layer
     */
    buildDecalLayer() {
        if ((!this.currentrank) && (!this.nextrank) && (!this.showcaps)) { return null; }
        if (this.decalposition === 'none') { return null; }

        this.decallayer = document.createElement('div');
        this.decallayer.classList.add('decals');
        this.decallayer.classList.add(this.decalposition);

        if ((this.currentrank) || (this.showcaps)) {
            let p = document.createElement('div');
            p.classList.add('current');
            if (this.currentrank) {
                let currrank = document.createElement('div');
                currrank.classList.add('name');
                currrank.innerHTML = this.currentrank;
                p.appendChild(currrank);
            }
            if (this.showcaps) {
                let value = document.createElement('div');
                value.classList.add('value');
                value.innerHTML = (this.commaseparate ? CFBUtils.readableNumber(this.minvalue) : this.minvalue);
                p.appendChild(value);
            }
            this.decallayer.appendChild(p);
        }
        if ((this.nextrank) || (this.showcaps)) {
            let p = document.createElement('div');
            p.classList.add('next');
            if (this.nextrank) {
                let nrank = document.createElement('div');
                nrank.classList.add('name');
                nrank.innerHTML = this.nextrank;
                p.appendChild(nrank);
            }
            if (this.showcaps) {
                let value = document.createElement('div');
                value.classList.add('value');
                value.innerHTML = (this.commaseparate ? CFBUtils.readableNumber(this.maxvalue) : this.maxvalue);
                p.appendChild(value);
            }
            this.decallayer.appendChild(p);
        }
    }

    /**
     * Builds the label
     */
    buildLabel() {
        const me = this;
        if (!this.label) { return null; }

        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.innerHTML = this.label;

        if (this.help) {
            this.helpicon = new HelpButton({ help: this.help });
            this.labelobj.appendChild(this.helpicon.button);
            this.labelobj.addEventListener('onmouseover', function() {
                me.helpicon.open();
            });
            this.labelobj.addEventListener('onmouseout', function() {
                me.helpicon.close();
            });
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get bar() { return this._bar; }
    set bar(bar) { this._bar = bar; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get commaseparate() { return this.config.commaseparate; }
    set commaseparate(commaseparate) { this.config.commaseparate = commaseparate; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get decallayer() {
        if (!this._decallayer) { this.buildDecalLayer(); }
        return this._decallayer;
    }
    set decallayer(decallayer) { this._decallayer = decallayer; }

    get decalposition() { return this.config.decalposition; }
    set decalposition(decalposition) { this.config.decalposition = decalposition; }

    get direction() { return this.config.direction; }
    set direction(direction) { this.config.direction = direction; }

    get fill() { return this.config.fill; }
    set fill(fill) { this.config.fill = fill; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helpicon() { return this._helpicon; }
    set helpicon(helpicon) { this._helpicon = helpicon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get label() { return this.config.label; }
    set label(label) { this.config.label = label; }

    get labelobj() {
        if (!this._labelobj) { this.buildLabel(); }
        return this._labelobj;
    }
    set labelobj(labelobj) { this._labelobj = labelobj; }
    get maxvalue() { return this.config.maxvalue; }
    set maxvalue(maxvalue) { this.config.maxvalue = maxvalue; }

    get minvalue() { return this.config.minvalue; }
    set minvalue(minvalue) { this.config.minvalue = minvalue; }

    get nextrank() { return this.config.nextrank; }
    set nextrank(nextrank) { this.config.nextrank = nextrank; }

    get currentrank() { return this.config.currentrank; }
    set currentrank(currentrank) { this.config.currentrank = currentrank; }

    get progress() { return this._progress; }
    set progress(progress) { this._progress = progress; }

    get value() { return this.config.value; }
    set value(value) { this.config.value = value; }

    get showcaps() { return this.config.showcaps; }
    set showcaps(showcaps) { this.config.showcaps = showcaps; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

}
window.SimpleProgressMeter = SimpleProgressMeter;
