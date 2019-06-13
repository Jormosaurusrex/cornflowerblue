"use strict";


class ProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            style: 'thin',
            totalscore: 0,   // The total local score
            tierscore: 0, // The current tier's score
            steps: {},  // An dictionary of step entries. Key is the level.
                        // 1: { level: 1, name: String, threshold: number, classes: [] }
            id : null,  // The id
            classes: [] // Extra css classes to apply
        };
    }

    /**
     * Define the element
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, ProgressMeter.DEFAULT_CONFIG, config);

        this.descriptors = {}; // Flatten descriptor dictionary

        this.calcCurrentThreshold();
        this.grindRelatorWidths();

        return this;
    }
    
    /**
     * Calculates the current threshold tier.
     */
    calcCurrentThreshold() {
        let cthresh = 1;
        for (let k of Object.keys(this.steps).sort()) {
            if (this.totalscore < this.steps[k].threshold) {
                break;
            }
            cthresh = k;
        }
        this.current = Number(cthresh);
    }

    grindRelatorWidths() {
        let max; // undef
        for (let k of Object.keys(this.steps).sort().reverse()) { // go backwards
            let point = this.steps[k];
            if (!max) {
                max = point.threshold;
                point.width = 100;
            } else {
                point.width = point.threshold / max;
                if (point.width > 0) {
                    point.width = point.width * 100;
                }
            }
        }
    }

    /**
     * Build the full messagebox container
     */
    buildContainer() {
        this.container = $('<div />')
            .addClass('progressmeter')
            .data('self', this)
            .addClass(this.classes.join(' '))
            .append(this.descriptorlayer)
            .append(this.relationlayer)
            .append(this.mainlayer);

    }


    buildDescriptor(point) {
        let $descriptor = $('<div />').addClass('descriptor')
            .addClass(`tier-${point.level}`)
            .append($('<div />').addClass('name').html(point.name))
            .append($('<div />').addClass('points').html(Utils.readableNumber(point.threshold)))
            .append($('<div />').addClass('marker'));

        if (Number(this.current) === Number(point.level)) {
            $descriptor.addClass('current');
        }
        this.descriptors[point.id] = $descriptor;
        return $descriptor;
    }

    buildDescriptorLayer() {
        this.descriptorlayer = $('<div />').addClass('descriptorlayer');
        for (let k of Object.keys(this.steps).sort()) {
            this.descriptorlayer.append(this.buildDescriptor(this.steps[k]));
        }
    }

    buildRelationLayer() {
        /*
            HERE THERE BE DRAGONS.
            This isn't hard to understand, but there is a thing that seems out of whack.
            Displaying tiers in a block will nearly always show strange colors.  You're really wanting to
            show the progress _to_, which means the color you show has to be the color of the _previous_
            tier.  This also means that the "first" tier, the one that begins with 0 points, doesn't
            (or shouldn't) display at all.

            Basically you're viewing the line associated with the NEXT tier up, so we have to grab data from the previous one.

         */
        this.relationlayer = $('<div />').addClass('relationlayer');
        let zindex = 10;
        for (let k of Object.keys(this.steps).sort().reverse()) { // go backwards
            let point = this.steps[k];
            if (point.level === 1) { break; }
            let previoustier = this.steps[point.level - 1];
            let $marker = $('<div />')
                .addClass('mline')
                .addClass(`tier-${(point.level - 1)}`)
                .css('z-index', zindex)
                .css('width', `${point.width}%`)
                .append(
                    $('<div />').addClass('details')
                        .append($('<span />').addClass('t-name').html(previoustier.name))
                        .append($('<span />').addClass('t-points').html(Utils.readableNumber(previoustier.threshold)))
                );
            zindex++;
            this.relationlayer.append($marker);
            previoustier = point;
        }
    }

    buildMainLayer() {
        let currentwidth;
        if (this.steps[this.current + 1]) {
            let pointscale = (this.steps[this.current + 1].threshold - this.steps[this.current].threshold);
            currentwidth = this.tierscore / pointscale;
            console.log(`pointscale: ${pointscale} :: tierscore: ${this.tierscore} :: currentwidth: ${currentwidth}`);
        } else {
            currentwidth = 100;
        }

        this.mainlayer = $('<div />').addClass('mainlayer')
            .addClass(`tier-${this.current}`);
        this.mainlayer.append($('<div />').addClass('current').css('width', `${currentwidth}%`));
        this.mainlayer.append($('<div />').addClass('aspirant'));

    }




    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

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

    get current() { return this._current; }
    set current(current) { this._current = current; }

    get descriptorlayer() {
        if (!this._descriptorlayer) { this.buildDescriptorLayer(); }
        return this._descriptorlayer;
    }
    set descriptorlayer(descriptorlayer) { this._descriptorlayer = descriptorlayer; }

    get descriptors() { return this._descriptors; }
    set descriptors(descriptors) { this._descriptors = descriptors; }

    get mainlayer() {
        if (!this._mainlayer) { this.buildMainLayer(); }
        return this._mainlayer;
    }
    set mainlayer(mainlayer) { this._mainlayer = mainlayer; }

    get relationlayer() {
        if (!this._relationlayer) { this.buildRelationLayer(); }
        return this._relationlayer;
    }
    set relationlayer(relationlayer) { this._relationlayer = relationlayer; }

    get tierscore() { return this.config.tierscore; }
    set tierscore(tierscore) { this.config.tierscore = tierscore; }

    get totalscore() { return this.config.totalscore; }
    set totalscore(totalscore) { this.config.totalscore = totalscore; }

    get steps() { return this.config.steps; }
    set steps(steps) { this.config.steps = steps; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

}
