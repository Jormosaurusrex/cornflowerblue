"use strict";

class RadialProgressMeter extends SimpleProgressMeter {

    static get DEFAULT_CONFIG() {
        return {
            numberposition: 'center', // where to display the badge and stinger.
                                    // Values include: center, bottomleft, bottomright, topleft, topright
            badge: null, // the large central number to show. If left empty, it will display the percentage.
            stinger: null, // A small text to display below the main badge
            size: 200,
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

        if (!this.strokewidth) {
            this.strokewidth = this.size * .07;
        }

        this.radius = (this.size / 2) - (this.strokewidth * 2); // have to cut the stroke
        this.circumference = this.radius * 2 * Math.PI; // pie are round
    }

    setProgress(percent) {
        const offset = this.circumference - percent / 100 * this.circumference;
        this.container.find('.radialcircle')
            .css('stroke-dasharray', `${this.circumference} ${this.circumference}`)
            .css('stroke-dashoffset', offset);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {

        const me = this;

        this.container = $('<div />')
            .data('self', this)
            .addClass('progressbar-container')
            .append(this.labelobj);

        let wrap = $('<div />')
            .addClass('circlewrap')
            .css('width', `${this.size}`)
            .css('height', `${this.size}`);

        wrap.append($('<svg />') // the background gutter circle
            .attr('height', this.size)
            .attr('width', this.size)
            .addClass('progressgutter')
            .append(
                $('<circle />')
                    .addClass('gutter')
                    .attr('stroke-width', this.strokewidth)
                    .attr('r', this.radius)
                    .attr('cx', this.size / 2)
                    .attr('cy', this.size / 2)
            )
        );

        wrap.append($('<svg />')
            .attr('height', this.size)
            .attr('width', this.size)
            .addClass('progressbar')
            .append(
                $('<circle />')
                    .addClass('radialcircle')
                    .attr('stroke-width', this.strokewidth)
                    .attr('r', this.radius)
                    .attr('cx', this.size / 2)
                    .attr('cy', this.size / 2)
            )
        );

        wrap.append(this.decallayer);

        this.container.append(wrap);

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
            this.stingerobj = $('<div />').addClass('stringer').html(this.stinger);
        }

        this.decallayer = $('<div />')
            .addClass('decals')
            .addClass(this.numberposition)
            .append(this.badgeobj)
            .append(this.stingerobj);

    }


    /* ACCESSOR METHODS_________________________________________________________________ */

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

    get stinger() { return this.config.stinger; }
    set stinger(stinger) { this.config.stinger = stinger; }

    get stingerobj() { return this._stingerobj; }
    set stingerobj(stingerobj) { this._stingerobj = stingerobj; }

    get strokewidth() { return this.config.strokewidth; }
    set strokewidth(strokewidth) { this.config.strokewidth = strokewidth; }

    get wrap() { return this._wrap; }
    set wrap(wrap) { this._wrap = wrap; }


}