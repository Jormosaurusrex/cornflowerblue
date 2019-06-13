"use strict";

class SimpleProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The id
            classes: [], // Extra css classes to apply
            label: null, // The title
            help: null, // Help text.

            previousrank: null, // A string, if present, will be displayed inside (along with minvalue)
            nextrank: null, // A string, if present, will be displayed inside (along with maxvalue)
            showcaps: true, // if true, show the min and max values.  True by default if previousrank or nextrank is set.

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

        if (!this.id) { // need to generate an id for label stuff
            this.id = `progress-${Utils.getUniqueKey(5)}`;
        }
        this.determineWidth();
    }

    /* CORE METHODS_____________________________________________________________________ */

    determineWidth() {
        if (this.width) return; // use provided width

        // Figure out where value lies between minnumber and maxxnumber.
        //let pointscale = (this.steps[this.current + 1].threshold - this.steps[this.current].threshold);

        let pointscale = (this.maxvalue - this.minvalue);
        let subjectivevalue = this.value - this.minvalue;
        this.width =  (subjectivevalue / pointscale) * 100;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        const me = this;

        this.progress = $('<div />').addClass('progress');

        this.bar = $('<div />')
            .addClass('simpleprogress')
            .append(this.progress)
            .append(this.decallayer);



        this.container = $('<div />')
            .addClass(this.classes.join(' '))
            .addClass('progressbar-container')
            .append(this.labelobj)
            .append(this.bar);

        if ((this.previousrank) || (this.nextrank)) {
            this.bar.addClass('withdecals');
        }

        // Don't allow the the width animation to fire until it's in the page
        let animtimer = setTimeout(function() {
            me.progress.css('width', `${me.width}%`);
        }, 500);
    }

    buildDecalLayer() {
        if ((!this.previousrank) && (!this.nextrank) && (!this.showcaps)) { return null; }

        this.decallayer = $('<div />').addClass('decals');
        if ((this.previousrank) || (this.showcaps)) {
            let $p = $('<div />').addClass('previous');
            if (this.previousrank) {
                $p.append($('<div />').addClass('name').html(this.previousrank))
            }
            if (this.showcaps) {
                $p.append($('<div />').addClass('value').html(this.minvalue));
            }
            this.decallayer.append($p);
        }
        if ((this.nextrank) || (this.showcaps)) {
            let $p = $('<div />').addClass('next');
            if (this.previousrank) {
                $p.append($('<div />').addClass('name').html(this.nextrank))
            }
            if (this.showcaps) {
                $p.append($('<div />').addClass('value').html(this.maxvalue));
            }
            this.decallayer.append($p);
        }
    }

    buildLabel() {
        if (!this.label) { return null; }

        this.labelobj = $('<label />')
            .attr('for', this.id)
            .html(this.label);

        if (this.help) {
            this.helpicon = new HelpButton({ help: this.help });
            this.labelobj
                .append(this.helpicon.button)
                .hover(
                    function() { me.helpicon.open(); },
                    function() { me.helpicon.close(); }
                );
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

    get previousrank() { return this.config.previousrank; }
    set previousrank(previousrank) { this.config.previousrank = previousrank; }

    get progress() { return this._progress; }
    set progress(progress) { this._progress = progress; }

    get value() { return this.config.value; }
    set value(value) { this.config.value = value; }

    get showcaps() { return this.config.showcaps; }
    set showcaps(showcaps) { this.config.showcaps = showcaps; }

    get width() { return this.config.width; }
    set width(width) { this.config.width = width; }
}

