"use strict";


class ProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            style: 'thin',
            score: 0,   // The score to draw up to
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

        this.calcCurrentThreshold();

        return this;
    }

    /**
     * Calculates the current threshold tier.
     */
    calcCurrentThreshold() {
        let cthresh = 1;
        for (let k of Object.keys(this.steps).sort()) {
            if (this.score < this.steps[k].threshold) {
                break;
            }
            cthresh = k;
        }
        this.current = Number(cthresh);
    }

    /**
     * Build the full messagebox container
     */
    buildContainer() {
        this.container = $('<div />')
            .addClass('progressmeter')
            .data('self', this)
            .addClass(this.classes.join(' '));

        let $thresholds = $('<div />').addClass('threshholds');
        for (let k of Object.keys(this.steps).sort()) {
            $thresholds.append(this.buildThresholdBox(this.steps[k]));
        }
        this.container.append($thresholds);

        this.container.append($('<div />').addClass('pline'));
    }


    buildThresholdBox(point) {
        let $tpoint = $('<div />').addClass('tbox')
            .addClass(`tier-${point.level}`)
            .append($('<div />').addClass('name').html(point.name))
            .append($('<div />').addClass('points').html(point.threshold))
            .append($('<div />').addClass('marker'));

        if (Number(this.current) === Number(point.level)) {
            $tpoint.addClass('current');
        }

        return $tpoint;
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

    get score() { return this.config.score; }
    set score(score) { this.config.score = score; }

    get steps() { return this.config.steps; }
    set steps(steps) { this.config.steps = steps; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

}
