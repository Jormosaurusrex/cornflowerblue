"use strict";

class HelpButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: function(e, self) { self.stayopen(); },
            hoverin: function(e, self) { self.open(); },
            hoverout: function(e, self) { self.close(); },
            icon: 'help-circle',
            tipicon: 'help-circle',
            help: null // help text to display
        };
    }

    constructor(config) {
        config = Object.assign({}, HelpButton.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('naked');
            config.classes.push('help');
        } else {
            config.classes = ['naked', 'help'];
        }
        if (!config.id) { // need to generate an id for aria stuff
            config.id = "help-" + Utils.getUniqueKey(5);
        }

        super(config);
    }

    /**
     * Force the tooltip to stay open.
     */
    stayopen() {
        this.button.addClass('stayopen');
        this.open();
    }

    /**
     * Opens the help tooltip
     */
    open() {
        const me = this;
        if (!this.tooltip) { this.buildTooltip(); }
        this.button.attr('aria-expanded', true);
        this.tooltip.removeAttr('aria-hidden');
        setTimeout(function() {
            me.tooltip.css('top', `calc(0px - ${me.tooltip.css('height')} - .5em)`);
        },1);
    }

    /**
     * Closes the help tooltip.
     */
    close() {
        if (this.button.hasClass('stayopen')) { return; }
        this.button.attr('aria-expanded', false);
        this.tooltip.attr('aria-hidden', true);
    }

    /**
     * Builds the help.
     */
    buildTooltip() {
        const me = this;
        this.tooltip = $('<div />')
            .addClass('tooltip')
            .attr('aria-hidden', true)
            .attr('id', this.id);

        if (this.tipicon) {
            this.tooltip.append(IconFactory.icon(this.tipicon).addClass('tipicon'));
        }

        this.helptext = $('<div />')
            .addClass('helptext')
            .attr('id', `${this.id}-tt`)
            .html(this.help);

        this.closebutton = new SimpleButton({
            icon: 'echx',
            text: "Close",
            shape: "square",
            classes: ["naked", "closebutton"],
            action: function(e) {
                e.preventDefault();
                e.stopPropagation();
                me.button.removeClass('stayopen');
                me.close();
            }
        });

        this.tooltip
            .append(this.helptext)
            .append(this.closebutton.button);

        this.button
            .attr('aria-expanded', false)
            .append(this.tooltip);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get button() {
        if (!this._button) { this.buildButton(); }
        if (!this.tooltip) { this.buildTooltip(); }
        return this._button;
    }
    set button(button) { this._button = button; }

    get closebutton() { return this._closebutton; }
    set closebutton(closebutton) { this._closebutton = closebutton; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helptext() { return this._helptext; }
    set helptext(helptext) { this._helptext = helptext; }

    get tipicon() { return this.config.tipicon; }
    set tipicon(tipicon) { this.config.tipicon = tipicon; }

    get tooltip() { return this._tooltip; }
    set tooltip(tooltip) { this._tooltip = tooltip; }

}
