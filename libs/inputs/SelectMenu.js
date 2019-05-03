"use strict";

class SelectMenu extends RadioGroup {

    /**
     * Define the SelectMenu
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, SelectMenu.DEFAULT_CONFIG, config);

        super(config);

    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */


    /**
     * Builds and returns a container object for all parts.
     * This gets over-ridden in elements that have additional structures, like a character counter
     * @returns {jQuery} jQuery representation of the label and the input together.
     */
    buildContainer() {
        this.container = $('<div />')
            .addClass('input-container')
            .addClass('select-container')
            .addClass(this.classes.join(' '))
            .append(this.labelobj)
            .append(this.triggerbox)
            .append(this.optionlist)
            .append(this.messagebox);

        if (this.required) { this.container.addClass('required'); }
        if (this.mute) { this.container.addClass('mute'); }
        if (this.hidden) {
            this.container.css('display', 'none');
            this.container.attr('aria-hidden', true);
        }
        if ((this.config.value) && (this.config.value.length > 0)) {
            this.container.addClass('filled');
        }
    }

    buildOptions() {
        const me = this;

        this.optionlist = $('<ul />')
            .addClass('selectmenu')
            .attr('role', 'radiogroup');

        for (let opt of this.options) {
            let $o = this.buildOption(opt);
            if (opt.checked) {
                this.origval = opt.value;
                this.triggerbox.html(opt.label);
            }

            this.optionlist.append($o);
        }
    }

    buildTriggerBox() {
        const me = this;
        this.triggerbox = $('<div />')
            .addClass('trigger')
            .click(function(e) {
                me.toggleMenu(e, me);
            });
    }

    /**
     * Toggle visibility of the menu.
     */
    toggleMenu(e, self) {
        e.preventDefault();

        this.optionlist.toggleClass('open');

        e.stopPropagation();

        $(document).one('click', function closeMenu (e){
            if (self.optionlist.has(e.target).length === 0) {
                self.optionlist.removeClass('open');
            } else {
                $(document).one('click', closeMenu);
            }
        });

    }

    buildOption(def) {
        const me = this;

        const lId = this.id + '-' + Utils.getUniqueKey(5);

        let $op = $('<input />')
            .data('self', this)
            .attr('id', lId)
            .attr('type', 'radio')
            .attr('name', this.name)
            .attr('tabindex', 0) // always 0
            .attr('value', def.value)
            .attr('aria-label', def.label)
            .attr('role', 'radio')
            .addClass(this.classes.join(' '))
            .change(function(e) {
                $(this).prop('aria-checked', $(this).prop('checked'));
                if ((me.onchange) && (typeof me.onchange === 'function')) {
                    me.onchange(e, me);
                }
            }).click(function(e) {
                me.optionlist.addClass('open');
                e.preventDefault();

                me.triggerbox.html(def.label);

                me.optionlist.find('input[type=radio]')
                    .removeAttr('checked')
                    .removeAttr('aria-checked');

                $(this).prop('checked', true)
                    .prop('aria-checked', true)
                    .attr('checked', 'checked')
                    .attr('aria-checked', 'checked');

                me.toggleMenu(e, me);

            });
        let $opLabel = $('<label />')
            .attr('for', lId)
            .html(def.label);

        if (def.checked) {
            this.origval = def.value;
            $op.attr('aria-checked', 'checked')
                .attr('checked', 'checked')
        }

        return $('<li />').append($op).append($opLabel);
    }


    /**
     * Builds the input's DOM.
     * @returns {jQuery} jQuery representation of the input
     */
    buildLabel() {
        if (!this.label) { return null; }
        this.labelobj = $('<label />')
            .attr('for', this.id)
            .html(this.label);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get mute() { return this.config.mute; }
    set mute(mute) { this.config.mute = mute; }

    get required() { return this.config.required; }
    set required(required) { this.config.required = required; }

    get triggerbox() {
        if (!this._triggerbox) { this.buildTriggerBox(); }
        return this._triggerbox;
    }
    set triggerbox(triggerbox) { this._triggerbox = triggerbox; }

}

SelectMenu.DEFAULT_CONFIG = {
    id : null, // The button id
    name: null,
    label: null, // The text for the label.
    classes: [], // Extra css classes to apply
    disabled: false, // If true, make this disabled.
    options: [], // Array of option dictionary objects.  Printed in order given.
                 // { label: "Label to show", value: "v", checked: true }
    onchange: null, // The change handler. Passed (event, self).
    validator: null // A function to run to test validity. Passed the self; returns true or false.
};


