"use strict";

class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            options: [], // Array of option dictionary objects.  Printed in order given.
                         // { label: "Label to show", value: "v", checked: true }
            onchange: null // The change handler. Passed (event, self).
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

    /**
     * Returns the raw element, without any container
     * @return {*} the element.
     */
    get naked() { return this.triggerbox; }

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
            .append($('<div />').addClass('wrap').append(this.triggerbox))
            .append(this.optionlist)
            .append(this.messagebox);

        this.postContainerScrub();
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
            .focusin(function() {
                me.optionlist.addClass('open');
                me.optionlist.find('li:first-child').focus();
            })
            .click(function(e) {
                e.preventDefault();
                if (me.disabled) {
                    e.stopPropagation();
                    return;
                }
                //me.toggle(e, me);
                me.open();
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
                me.close();
                if ((me.onchange) && (typeof me.onchange === 'function')) {
                    me.onchange(e, me);
                }
            })
            .attr('role', 'radio');

        let $opLabel = $('<label />')
            .attr('for', lId)
            .html(def.label);

        let $li = $('<li />')
            .attr('tabindex', 0)
            .on('keydown', function(e) {
                if (e.keyCode === 38) { // up arrow
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).prev().focus();
                } else if (e.keyCode === 40) { // down arrow
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).next().focus();
                } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                    $op.trigger('click');
                }
            })
            .click(function(e) {
                me.optionlist.find('li').removeClass('selected');
                $(this).addClass('selected');

            });

        if (def.checked) {
            this.origval = def.value;
            $li.addClass('selected');
            $op.attr('aria-checked', 'checked')
                .attr('checked', 'checked')
        }

        return $li.append($op).append($opLabel);
    }

    /* CONTROL METHODS__________________________________________________________________ */

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
     * Opens the option list.
     */
    open() {
        this.optionlist.addClass('open');
    }

    /**
     * Closes the option list.
     */
    close() {
        this.optionlist.removeClass('open');
    }

    /**
     * Enable the element
     */
    disable() {
        this.optionlist.find('input:radio').attr('disabled',true);
        this.triggerbox.prop('disabled', true);
        this.disabled = true;
        if (this.triggerbox) { this.triggerbox.addClass('disabled'); }
        if (this.container) { this.container.addClass('disabled'); }
    }

    /**
     * Disable the element
     */
    enable() {
        this.optionlist.find('input:radio').removeAttr('disabled');
        this.triggerbox.removeAttr('disabled');
        this.disabled = false;
        if (this.triggerbox) { this.triggerbox.removeClass('disabled'); }
        if (this.container) { this.container.removeClass('disabled'); }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get optionlist() {
        if (!this._optionlist) { this.buildOptions(); }
        return this._optionlist;
    }
    set optionlist(optionlist) { this._optionlist = optionlist; }

    get options() { return this.config.options; }
    set options(options) { this.config.options = options; }

    get triggerbox() {
        if (!this._triggerbox) { this.buildTriggerBox(); }
        return this._triggerbox;
    }
    set triggerbox(triggerbox) { this._triggerbox = triggerbox; }

}


