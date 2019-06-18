"use strict";

class RadioGroup extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            id : null, // The button id
            name: null,
            form: null, // A form element this is in
            label: null, // The text for the label.
            passive: false, // Start life in "passive" mode.
            required: false, // Is this a required field or not
            unsettext: "(Not Set)", // what to display in passive mode if the value is empty
            classes: [], // Extra css classes to apply
            disabled: false, // If true, make this disabled.
            options: [], // Array of option dictionary objects.  Printed in order given.
                         // { label: "Label to show", value: "v", checked: true }
            onchange: null, // The change handler. Passed (event, self).
            validator: null // A function to run to test validity. Passed the self; returns true or false.
        };
    }

    /**
     * Define the RadioGroup
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, RadioGroup.DEFAULT_CONFIG, config);

        if (!config.id) { // need to generate an id for label stuff
            config.id = "radiogroup-" + Utils.getUniqueKey(5);
        }
        if (!config.name) { config.name = config.id; }

        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get input() { return this.optionlist; }

    get passivetext() {
        if (this.selectedoption) { return this.selectedoption.label; }
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    disable() {
        this.optionlist.find('input:radio').attr('disabled',true);
        this.disabled = true;
        if (this.container) { this.container.addClass('disabled'); }
    }

    enable() {
        this.optionlist.find('input:radio').removeAttr('disabled');
        this.disabled = false;
        if (this.container) { this.container.removeClass('disabled'); }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = $('<div />')
            .data('self', this)
            .addClass('input-container')
            .addClass('radiogroup-container')
            .addClass(this.classes.join(' '))
            .append(this.labelobj)
            .append(this.optionlist)
            .append(this.passivebox);

        this.postContainerScrub();

    }

    postContainerScrub() {
        if (this.hidden) { this.container.css('display', 'none'); }

        if (this.required) {
            this.container.addClass('required');
            this.optionlist.attr('required', 'required');
        }

        if (this.hidden) {
            this.container.css('display', 'none');
            this.container.attr('aria-hidden', true);
        }

        if (this.passive) { this.pacify(); }
        if (this.disabled) { this.disable(); }

        if (this.help) {
            this.optionlist
                .attr('aria-described-by', `${this.help.id}-tt`)
                .attr('aria-labeled-by', `label-${this.id}`);
        }
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
            //.attr('aria-checked', def.checked)
            //.attr('checked', def.checked)
            .addClass(this.classes.join(' '))
            .change(function(e) {
                $(this).prop('aria-checked', $(this).prop('checked'));

                me.selectedoption = def;
                if (def.label === me.unselectedtext) {
                    me.passivebox.html(me.unsettext);
                } else {
                    me.passivebox.html(def.label);
                }

                me.validate();

                if (me.form) { me.form.validate(); }

                if ((me.onchange) && (typeof me.onchange === 'function')) {
                    me.onchange(e, me);
                }
            });

        let $opLabel = $('<label />')
            .attr('for', lId)
            .html(def.label);

        if (def.checked) {
            this.origval = def.value;
            $op.attr('aria-checked', true)
                .attr('checked', true)
        }

        return $('<li />').addClass('radio').append($op).append($opLabel);
    }

    buildOptions() {
        const me = this;
        this.optionlist = $('<ul />')
            .addClass('radiogroup')
            .attr('tabindex', -1)
            .attr('role', 'radiogroup');

        for (let opt of this.options) {
            let $o = this.buildOption(opt);
            if (opt.checked) {
                this.selectedoption = opt;
            }
            this.optionlist.append($o);
        }
    }


    /* ACCESSOR METHODS_________________________________________________________________ */

    get onchange() { return this.config.onchange; }
    set onchange(onchange) {
        if (typeof onchange !== 'function') {
            console.error("Action provided for onchange is not a function!");
        }
        this.config.onchange = onchange;
    }

}
