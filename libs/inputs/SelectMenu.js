"use strict";

class SelectMenu extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: "(Select)",
            searchtext: true,
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

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Return the selected radio input.
     * @return {jQuery|HTMLElement}
     */
    get selected() {
        let sel = $(`input[name=${this.name}]:checked`);
        if (sel.length > 0) { return sel; }
        return null;
    }

    /**
     * Gets the value of the selected element.
     * @return {null|*}
     */
    get value() {
        if (this.selected) { return this.selected.val(); }
        return ''; // Return empty string for no value.
    }

    get topcontrol() { return this.searchdisplay; }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Opens the option list.
     */
    open() {
        const me = this;

        let vertpos;

        this.optionlist.addClass('open');

        if (this.container) {
            vertpos = (this.container.offset().top - $(window).scrollTop());
        } else {
            vertpos = (this.optionlist.offset().top - $(window).scrollTop());
        }

        let bodyheight = $('body').height();
        let menuheight = this.optionlist.height();

        if ((vertpos + menuheight) > bodyheight) {
            this.optionlist.addClass('vert');
            if (this.container) { this.container.addClass('vert'); }
        } else {
            this.optionlist.removeClass('vert');
            if (this.container) { this.container.removeClass('vert'); }
        }

        if (this.selected) {
            this.scrollto(this.optionlist.find('li.selected'));
        } else {
            this.scrollto(this.optionlist.find('li:first-child'));
        }

        $(document).one('click', function closeMenu(e) {
            if (me.container.has(e.target).length === 0) {
                me.close();
            } else {
                $(document).one('click', closeMenu);
            }
        });
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
            .append(this.inactivebox)
            .append(this.topcontrol)
            .append(this.messagebox);

        this.postContainerScrub();
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
                // Only need the focus handler because a click fires focus _then_ click
                // And focus happens in more ways than click (tab in, etc.)
                if (me.disabled) {
                    e.stopPropagation();
                    return;
                }
                me.open();
            });
        if (this.mute) {
            this.triggerbox.addClass('mute');
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

        let foundcheck = false;
        for (let opt of this.options) {
            let $o = this.buildOption(opt);
            if (opt.checked) {
                foundcheck = true;
            }
            this.optionlist.append($o);
        }

        if (this.unselectedtext) {
            let unselconfig = {
                label: this.unselectedtext,
                value: '',
                checked: !foundcheck,
                unselectoption: true
            };
            let $o = this.buildOption(unselconfig);
            this.optionlist.prepend($o);
        }
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

                if (def.label === me.unselectedtext) {
                    me.inactivebox.html(me.unsettext);
                } else {
                    me.inactivebox.html(def.label);
                }

                me.close();

                me.validate();

                if (me.form) { me.form.validate(); }

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
            .attr('id', `li-${lId}`)
            .on('keydown', function(e) {
                if (e.keyCode === 9) { // Tab
                    me.close();
                } else if (e.keyCode === 27) { // Escape
                    me.close();
                } else if (e.keyCode === 38) { // Up arrow
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).prev().focus();
                } else if (e.keyCode === 40) { // Down arrow
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).next().focus();
                } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                    $op.trigger('click');
                } else if (e.keyCode === 8) { // Backspace
                    me.rmSearchKey();
                } else { // Anything else
                    me.runKeySearch(e.key);
                }
            })
            .click(function(e) {
                me.optionlist.find('li').removeClass('selected');
                $(this).addClass('selected');
            });

        if (def.checked) {
            this.origval = def.value;
            this.triggerbox.html(def.label);
            $li.addClass('selected');
            $op.attr('aria-checked', 'checked')
                .attr('checked', 'checked')
        }

        return $li.append($op).append($opLabel);
    }

    /**
     * Draws the search text display.
     */
    buildSearchDisplay() {
        if (this.searchtext) {
            this.searchdisplay = $('<div />')
                .addClass('searchdisplay')
                .addClass('topcontrol');
            this.updateSearch();
        }
    }

    /**
     * Updates the counter
     */
    updateSearch() {
        if (this.searchkeys.length === 0) {
            this.searchdisplay.addClass('hidden');
            this.searchdisplay.html('');
            return;
        }
        this.searchdisplay.removeClass('hidden');
        this.searchdisplay.html(this.searchkeys.join(''));
    }

    /* CONTROL METHODS__________________________________________________________________ */

    /**
     * Delete a search key from the stack
     */
    rmSearchKey() {
        if (this.searchkeys.length === 0) return;
        this.searchkeys.pop();
        if (this.searchkeys.length > 0) {
            this.findByString(this.searchkeys.join(''));
        }
        this.updateSearch();
    }

    /**
     * Search the options from keyboard input
     * @param key the key to add to the stack
     */
    runKeySearch(key) {
        this.searchkeys.push(key);
        if (this.searchkeys.length > 0) {
            this.findByString(this.searchkeys.join(''));
        }
        this.updateSearch();
    }

    /**
     * Search the list of options and scroll to it
     * @param string the string to search
     */
    findByString(string) {
        let $target;
        for (let li of this.optionlist.children('li')) {
            let label = $(li).find('label')[0];
            if ($(label).html().toUpperCase().startsWith(string.toUpperCase())) {
                $target = $(li);
                break;
            }
        }
        this.scrollto($target);
    }

    /**
     * Scroll to a specific element in the list
     * @param $element the element to scroll to
     */
    scrollto($element) {
        if (!$element) return;
        if ((this.scrolleditem) && ($element.attr('id') === this.scrolleditem.attr('id'))) {
            return; // this is us, don't reflow.
        }
        this.optionlist.scrollTop($element.offset().top - $element.height());
        $element.focus();
        this.scrolleditem = $element;
    }


    /* ACCESSOR METHODS_________________________________________________________________ */

    get optionlist() {
        if (!this._optionlist) { this.buildOptions(); }
        return this._optionlist;
    }
    set optionlist(optionlist) { this._optionlist = optionlist; }

    get options() { return this.config.options; }
    set options(options) { this.config.options = options; }

    get searchdisplay() {
        if (!this._searchdisplay) { this.buildSearchDisplay(); }
        return this._searchdisplay;
    }
    set searchdisplay(searchdisplay) { this._searchdisplay = searchdisplay; }

    get searchkeys() {
        if (!this._searchkeys) { this._searchkeys = []; }
        return this._searchkeys;
    }
    set searchkeys(searchkeys) { return this._searchkeys; }

    get searchtext() { return this.config.searchtext; }
    set searchtext(searchtext) { this.config.searchtext = searchtext; }

    get scrolleditem() { return this._scrolleditem; }
    set scrolleditem(scrolleditem) { this._scrolleditem = scrolleditem; }

    get triggerbox() {
        if (!this._triggerbox) { this.buildTriggerBox(); }
        return this._triggerbox;
    }
    set triggerbox(triggerbox) { this._triggerbox = triggerbox; }

    get unselectedtext() { return this.config.unselectedtext; }
    set unselectedtext(unselectedtext) { this.config.unselectedtext = unselectedtext; }

}


