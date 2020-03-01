class HelpButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: function(e, self) { self.tooltip.open(); },
            icon: 'help-circle',
            tipicon: 'help-circle',
            iconclasses: ['helpicon'],
            help: null // help text to display
        };
    }

    constructor(config) {
        config = Object.assign({}, HelpButton.DEFAULT_CONFIG, config);
        if (config.classes) {
            if (!config.classes.includes('tagbutton')) {
                config.classes.push('naked');
                config.classes.push('help');
            }
        } else {
            config.classes = ['naked', 'help'];
        }
        if (!config.id) { // need to generate an id for aria stuff
            config.id = `help-${Utils.getUniqueKey(5)}`;
        }
        super(config);
        this.tooltip.attach(this);
    }

    /**
     * Force the tooltip to stay open.
     */
    stayopen() {
        this.button.classList.add('stayopen');
        this.open();
    }

    /**
     * Builds the help.
     */
    buildTooltip() {
        this.tooltip = new ToolTip({
            icon: this.tipicon,
            text: this.help
        });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get button() {
        if (!this._button) { this.buildButton(); }
        if (!this.tooltip) { this.buildTooltip(); }
        return this._button;
    }
    set button(button) { this._button = button; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get tipicon() { return this.config.tipicon; }
    set tipicon(tipicon) { this.config.tipicon = tipicon; }

    get tooltip() {
        if (!this._tooltip) { this.buildTooltip(); }
        return this._tooltip;
    }
    set tooltip(tooltip) { this._tooltip = tooltip; }

}
