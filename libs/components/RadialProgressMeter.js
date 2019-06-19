"use strict";

class RadialProgressMeter extends SimpleProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            numberposition: 'center', // where to display the badge and stinger.
                                    // Values include: center, bottomleft, bottomright, topleft, topright
            badge: null, // the large central number to show. If left empty, it will display the percentage.
            stinger: null, // A small text to display below the main badge
            size: 'medium', // Can be one of several values or metrics!
                        // Accepts: 'small', 'medium', 'large', 'huge' as strings
                        // Numbers in pixels and ems, as strings ('300px' or '5em')
                        // Or if given a number, assumes pixels
            style: 'solid', // 'solid' or 'ticks'.
                        // If set to 'ticks', disables any 'segments' value.
            segments: null, // Displays tick marks in the circle.
                        // Takes a number; this is the number of divisions. If you want segments of 10%, set it
                        // to 10.  If you want segments of 25%, set it to 4.
            strokewidth: null // If provided, the stroke will be this wide.
                            // If not provided, the width will be 5% of the circle's whole size
        };
    }

    /**
     * Define the StateMenu
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, RadialProgressMeter.DEFAULT_CONFIG, config);
        super(config);

        this.calculateSize();

        if (!this.strokewidth) {
            this.strokewidth = this.actualsize * .07;
        }
        if (this.style === 'ticks') {
            this.segments = null;
        }

        this.radius = (this.actualsize / 2) - (this.strokewidth * 2); // have to cut the stroke
        this.circumference = this.radius * 2 * Math.PI; // pie are round
    }

    /**
     * Calculates the size of the SVG to use.
     * - Parses the 'size' attribute into 'actualsize'
     * - Determines the 'sizeclass'
     */
    calculateSize() {
        if (typeof this.size === 'number') {
            this.actualsize = this.size;
        } else if (this.size.toLowerCase().endsWith('px')) {
            this.actualsize = parseInt(this.size);
            if (isNaN(this.actualsize)) {
                console.error(`RadialProgressMeter: provided invalid size: ${this.size}`);
                this.actualsize = 200;
            }
        } else if (this.size.toLowerCase().endsWith('em')) {
            this.actualsize = (Utils.getSingleEmInPixels() * parseInt(this.size));
            if (isNaN(this.actualsize)) {
                console.error(`RadialProgressMeter: provided invalid size: ${this.size}`);
                this.actualsize = 200;
            }
        } else {
            switch(this.size) {
                case 'small':
                    this.actualsize = 100;
                    break;
                case 'large':
                    this.actualsize = 400;
                    break;
                case 'huge':
                    this.actualsize = 800;
                    break;
                case 'medium':
                default:
                    this.actualsize = 200;
                    break;
            }
        }

        // Now we parse a size class
        if (this.actualsize >= 800) {
            this.sizeclass = 'huge';
        } else if (this.actualsize >= 400) {
            this.sizeclass = 'large';
        } else if (this.actualsize >= 200) {
            this.sizeclass = 'medium';
        } else if (this.actualsize >= 100) {
            this.sizeclass = 'small';
        } else  {
            this.sizeclass = 'tiny';
        }
    }

    /**
     * Set the progress value of the meter
     * @param percent the percent to set it to.
     */
    setProgress(percent) {
        const offset = this.circumference - percent / 100 * this.circumference;

        this.container.find('.radialcircle')
            .css('stroke-dasharray', `${this.circumference} ${this.circumference}`)
            .css('stroke-dashoffset', offset);

        if (this.segments) {
            //this.radius = (this.actualsize / 2) - (this.strokewidth * 2); // have to cut the stroke
            //this.circumference = this.radius * 2 * Math.PI; // pie are round

            //let seglength = (this.actualsize * Math.PI) / this.segments;


            let seglength = (this.circumference - this.strokewidth) / this.segments;
            this.container.find('.tickmarks')
                .css('stroke-dasharray', `2, ${seglength}`);
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build a circle template
     * @param target the class to apply
     * @return {*|null|undefined|jQuery}
     */
    circleTemplate(target) {
        return $('<circle />')
            .addClass(target)
            .attr('stroke-width', this.strokewidth)
            .attr('r', this.radius)
            .attr('cx', this.actualsize / 2)
            .attr('cy', this.actualsize / 2)
    }

    buildContainer() {

        const me = this;

        this.container = $('<div />')
            .data('self', this)
            .addClass(this.sizeclass)
            .addClass('progressbar-container')
            .append(this.labelobj);

        let $wrap = $('<div />')
            .addClass('circlewrap')
            .css('width', `${this.actualsize}`)
            .css('height', `${this.actualsize}`);

        let $svg = $('<svg />') // the background gutter circle
            .attr('height', this.actualsize)
            .attr('width', this.actualsize)
            .addClass('progressgutter')
            .addClass(this.style)
            .append(this.circleTemplate('gutter'))
            .append(this.circleTemplate('radialcircle'));

        if ((this.segments) || (this.style === 'ticks')) {
            $svg.append(this.circleTemplate('tickmarks'));
        }

        this.container
            .append($wrap
                .append($svg)
                .append(this.decallayer)
            );

        this.container.html(this.container.html()); // this is funky b/c manipulating svgs can't be done with jquery

        this.setProgress(0); // flatten

        // Don't allow the the width animation to fire until it's in the page
        let animtimer = setTimeout(function() {
            me.setProgress(me.value);
        }, 500);
    }


    buildDecalLayer() {
        if (!this.badge) { this.badge = `${this.value}<sup>%</sup>`; }

        this.badgeobj = $('<div />').addClass('badge').html(this.badge);

        if (this.stinger) {
            this.stingerobj = $('<div />').addClass('stinger').html(this.stinger);
        }

        this.decallayer = $('<div />')
            .addClass('decals')
            .addClass(this.numberposition)
            .append(this.badgeobj)
            .append(this.stingerobj);

    }


    /* ACCESSOR METHODS_________________________________________________________________ */

    get actualsize() { return this._actualsize; }
    set actualsize(actualsize) { this._actualsize = actualsize; }

    get badge() { return this.config.badge; }
    set badge(badge) { this.config.badge = badge; }

    get badgeobj() { return this._badgeobj; }
    set badgeobj(badgeobj) { this._badgeobj = badgeobj; }

    get circumference() { return this._circumference; }
    set circumference(circumference) { this._circumference = circumference; }

    get numberposition() { return this.config.numberposition; }
    set numberposition(numberposition) { this.config.numberposition = numberposition; }

    get radius() { return this._radius; }
    set radius(radius) { this._radius = radius; }

    get size() { return this.config.size; }
    set size(size) { this.config.size = size; }

    get sizeclass() { return this._sizeclass; }
    set sizeclass(sizeclass) { this._sizeclass = sizeclass; }

    get stinger() { return this.config.stinger; }
    set stinger(stinger) { this.config.stinger = stinger; }

    get stingerobj() { return this._stingerobj; }
    set stingerobj(stingerobj) { this._stingerobj = stingerobj; }

    get strokewidth() { return this.config.strokewidth; }
    set strokewidth(strokewidth) { this.config.strokewidth = strokewidth; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

    get segments() { return this.config.segments; }
    set segments(segments) { this.config.segments = segments; }

    get wrap() { return this._wrap; }
    set wrap(wrap) { this._wrap = wrap; }


}