"use strict";

class HelpButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            action: function(e, self) { self.toggleHelp(e, self); },
            icon: 'help-circle',
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
     * Toggle visibility of the help.
     */
    toggleHelp(e, self) {

        if (!this.helpobj) { this.buildHelp(); }

        this.button.toggleClass('open');

        e.stopPropagation();

        $(document).one('click', function closeHelp (e){
            if (self.button.has(e.target).length === 0) {
                self.button.removeClass('open');
            } else {
                $(document).one('click', closeHelp);
            }
        });

    }

    /**
     * Builds the help.
     * @returns {jQuery} jQuery representation
     */
    buildHelp() {
        this.helpobj = $('<span />')
            .addClass('text')
            .attr('id', this.id)
            .html(this.help);
        this.button.append(this.helpobj);

    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helpobj() { return this._helpobj; }
    set helpobj(helpobj) { this._helpobj = helpobj; }

}
