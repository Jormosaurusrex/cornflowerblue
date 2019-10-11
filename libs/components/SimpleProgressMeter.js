"use strict";

class SimpleProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], // Extra css classes to apply
            label: null, // The title
            help: null, // Help text.

            style: null, // One of a handful of styles:
                        // * roundcap : both sides of the progress bar will be round capped.
                        // * interiorroundcap : the progress bar's right side will be round capped.

            commaseparate: true, // set to false to not comma separate numbers
            currentrank: null, // A string, if present, will be displayed inside (along with minvalue)
            nextrank: null, // A string, if present, will be displayed inside (along with maxvalue)
            showcaps: true, // if true, show the min and max values.  True by default if currentrank or nextrank is set.
            decalposition: 'interior', // Where should the decals appear?
                        // * 'none' : Don't show any decals
                        // * 'exterior' : decals are drawn outside of and above the bar
                        // * 'exterior-bottom' : decals are drawn outside of and below the bar

            /*
                The meter can have a variable scale, but the width of its progressbar is absolute within
                the scale.

                Consider a progress system made of multiple progress steps, perhaps of different length
                (like a loyalty program).  Progress in the first rank is 0 - 25 points, in the second
                rank is 25 - 75, in the third is 76 - 150, and the fourth is 151 - 300.
                  - minnumber would be the start of the "rank" (ex 76 for rank 3)
                  - maxnumber would be the end of the "rank" (ex 150)
                  - value is absolute, considered along the whole sequence (0 - 300), ex 123.
             */
            maxvalue: 100, // the max value
            minvalue: 0, // the min value
            value: 50, // the current score, calculated absolute.

            width: null, // width of the progressbar to fill.  Used if provided, or else calculated from other values.
        };
    }

    /**
     * Define a SimpleProgressMeter
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, SimpleProgressMeter.DEFAULT_CONFIG, config);

        if (!this.id) { this.id = `progress-${Utils.getUniqueKey(5)}`; }
        this.determineWidth();
    }

    /* CORE METHODS_____________________________________________________________________ */

    determineWidth() {
        if (this.width) return; // use provided width

        // Figure out where value lies between minnumber and maxxnumber.
        //let pointscale = (this.steps[this.current + 1].threshold - this.steps[this.current].threshold);

        let pointscale = (this.maxvalue - this.minvalue);
        let subjectivevalue = this.value - this.minvalue;
        if (this.value < this.minvalue) {
            subjectivevalue = this.value;
        }

        this.width =  (subjectivevalue / pointscale) * 100;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the container
     */
    buildContainer() {
        const me = this;

        this.progress = document.createElement('div');
        this.progress.classList.add('progress');

        this.bar = document.createElement('div');
        this.bar.classList.add('simpleprogress');
        this.bar.classList.add(this.style);
        this.bar.appendChild(this.progress);

        this.container = document.createElement('div');
        this.container.classList.add('progressbar-container');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.label) { this.container.append(this.labelobj); }

        if (((this.currentrank) || (this.nextrank))
            && (this.decalposition) && (this.decalposition === 'exterior')) {
            this.container.appendChild(this.decallayer);
            this.bar.classList.add('exteriordecal');
        }

        this.container.append(this.bar);

        if (((this.currentrank) || (this.nextrank))
            && (this.decalposition) && (this.decalposition !== 'exterior') && (this.decalposition !== 'none')) {
            if (this.decalposition === 'exterior-bottom') {
                this.container.appendChild(this.decallayer);
                this.bar.classList.add('exteriordecal-bottom');
            } else {
                this.bar.appendChild(this.decallayer);
                this.bar.classList.add('withdecals');
            }
        }

        // Don't allow the the width animation to fire until it's in the page
        setTimeout(function() {
            me.progress.style.width = `${me.width}%`;
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
                value.innerHTML = (this.commaseparate ? Utils.readableNumber(this.minvalue) : this.minvalue);
                p.appendChild(value);
            }
            this.decallayer.append(p);
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
                value.innerHTML = (this.commaseparate ? Utils.readableNumber(this.maxvalue) : this.maxvalue);
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
    toString () { return Utils.getConfig(this); }

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

    get width() { return this.config.width; }
    set width(width) { this.config.width = width; }
}

