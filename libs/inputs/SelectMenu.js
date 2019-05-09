"use strict";

class SelectMenu extends RadioGroup {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The button id
            name: null,
            form: null, // A form element this is in
            label: null, // The text for the label.

            classes: [], // Extra css classes to apply
            disabled: false, // If true, make this disabled.
            options: [], // Array of option dictionary objects.  Printed in order given.
                         // { label: "Label to show", value: "v", checked: true }
            onchange: null, // The change handler. Passed (event, self).
            validator: null // A function to run to test validity. Passed the self; returns true or false.
        };
    }

    /**
     * Define the SelectMenu
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, SelectMenu.DEFAULT_CONFIG, config);

        if (!config.id) { // need to generate an id for label stuff
            config.id = "select-" + Utils.getUniqueKey(5);
        }
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
            .data('self', this)
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
        if (this.disabled) {
            this.disable();
        }
    }

    /**
     * Build the option list.
     */
    buildOptions() {
        const me = this;

        this.optionlist = $('<ul />')
            .addClass('selectmenu')
            .attr('tabindex', 0)
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

    /**
     * Builds the trigger box for the select.
     */
    buildTriggerBox() {
        const me = this;
        this.triggerbox = $('<div />')
            .addClass('trigger')
            .attr('tabindex', 0)
            .click(function(e) {
                e.preventDefault();
                if (me.disabled) {
                    e.stopPropagation();
                    return;
                }
                me.toggle(e, me);
            });
    }

    /**
     * Toggle visibility of the menu.
     */
    toggle(e, self) {
        e.preventDefault();

        this.optionlist.toggleClass('open');

        e.stopPropagation();

        $(document).one('click', function closeMenu(e) {
            if (self.optionlist.has(e.target).length === 0) {
                self.optionlist.removeClass('open');
            } else {
                $(document).one('click', closeMenu);
            }
        });

    }

    /**
     * Build an option line.
     * @param def the definition
     * @return {jQuery}
     */
    buildOption(def) {
        const me = this;

        const lId = this.id + '-' + Utils.getUniqueKey(5);

        let $li = $('<li />')
            .attr('tabindex', 0)
            .click(function(e) {
                me.optionlist.find('li').removeClass('selected');
                $(this).addClass('selected');

            });

        let $op = $('<input />')
            .data('self', this)
            .attr('id', lId)
            .attr('type', 'radio')
            .attr('name', this.name)
            .attr('tabindex', 0) // always 0
            .attr('value', def.value)
            .attr('aria-label', def.label)
            .change(function(e) {
                me.triggerbox.html(def.label);
                me.toggle(e, me);

                if ((me.onchange) && (typeof me.onchange === 'function')) {
                    me.onchange(e, me);
                }
            })
            .click(function(e){
                console.log('adfadfaf')
            })
            .attr('role', 'radio');

        let $opLabel = $('<label />')
            .attr('for', lId)
            .html(def.label);

        if (def.checked) {
            this.origval = def.value;
            $li.addClass('selected');
            $op.attr('aria-checked', 'checked')
                .attr('checked', 'checked')
        }

        return $li.append($op).append($opLabel);
    }

    /**
     * Builds the label.
     * @returns {jQuery} jQuery representation of the label
     */
    buildLabel() {
        if (!this.label) { return null; }
        this.labelobj = $('<label />')
            .attr('for', this.id)
            .html(this.label);
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Enable the element
     */
    disable() {
        this.optionlist.find('input:radio').attr('disabled',true);
        this.triggerbox.prop('disabled', true);
        this.disabled = true;
        if (this.triggerbox) { this.container.addClass('disabled'); }
    }

    /**
     * Disable the element
     */
    enable() {
        this.optionlist.find('input:radio').removeAttr('disabled');
        this.triggerbox.removeAttr('disabled');
        this.disabled = false;
        if (this.triggerbox) { this.triggerbox.removeClass('disabled'); }
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


