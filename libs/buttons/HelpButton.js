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
            config.id = `help-${Utils.getUniqueKey(5)}`;
        }

        super(config);
    }

    /**
     * Force the tooltip to stay open.
     */
    stayopen() {
        this.button.classList.add('stayopen');
        this.open();
    }

    /**
     * Opens the help tooltip
     */
    open() {
        const me = this;
        if (!this.tooltip) { this.buildTooltip(); }
        this.button.setAttribute('aria-expanded', 'true');
        this.tooltip.removeAttribute('aria-hidden');
        setTimeout(function() {
            me.tooltip.style.top = `calc(0px - ${me.tooltip.style.height} - .5em)`;
        },1);
    }

    /**
     * Closes the help tooltip.
     */
    close() {
        if (this.button.classList.contains('stayopen')) { return; }
        this.button.removeAttribute('aria-expanded');
        this.tooltip.setAttribute('aria-hidden', 'true');
    }

    /**
     * Builds the help.
     */
    buildTooltip() {
        const me = this;
        this.tooltip = document.createElement('div');
        this.tooltip.classList.add('tooltip');
        this.tooltip.setAttribute('aria-hidden', 'true');
        this.tooltip.setAttribute('id', this.id);

        if (this.tipicon) {
            let icon = IconFactory.icon(this.tipicon);
            icon.classList.add('tipicon');
            this.tooltip.appendChild(icon);
        }

        this.helptext = document.createElement('div');
        this.helptext.classList.add('helptext');
        this.helptext.setAttribute('id', `${this.id}-tt`);
        this.helptext.innerHTML = this.help;

        this.closebutton = new SimpleButton({
            icon: 'echx',
            text: "Close",
            shape: "square",
            classes: ["naked", "closebutton"],
            action: function(e) {
                e.preventDefault();
                e.stopPropagation();
                me.button.classList.remove('stayopen');
                me.close();
            }
        });

        this.tooltip.appendChild(this.helptext);
        this.tooltip.appendChild(this.closebutton.button);

        this.button.removeAttribute('aria-expanded');
        this.button.appendChild(this.tooltip);
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
