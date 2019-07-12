"use strict";

class FileInput extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            type: "file",
            icon: "upload",
            accept: 'image/png,image/gif,image/jpg,image/jpeg', // the default accept mime-type
            multiple: false, // Should the file uploader accept multiple files?
            onchange: null // The change handler. Passed (self).
        };
    }

    static get DEFAULT_STRINGS() {
        return {
            multiple_file_placeholder: 'Select files (multiple accepted)',
            single_file_placeholder: 'Select file'
        }
    }

    constructor(config) {
        config = Object.assign({}, FileInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get value() {
        if (this.selected) { return this.selected.val(); }
        return ''; // Return empty string for no value.
    }

    get topcontrol() { return this.searchdisplay; }

    get passivetext() {
        if (this.selectedoption) { return this.selectedoption.label; }
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    calculatePlaceholder() {
        if (this.multiple) { return FileInput.DEFAULT_STRINGS.multiple_file_placeholder; }
        return FileInput.DEFAULT_STRINGS.single_file_placeholder;
    }

    disable() {
        this.triggerbox.prop('disabled', true).addClass('disabled');
        this.container.addClass('disabled');
        this.disabled = true;
    }

    enable() {
        this.triggerbox.removeAttr('disabled').removeClass('disabled');
        this.container.removeClass('disabled');
        this.disabled = false;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = $('<div />')
            .data('self', this)
            .addClass('input-container')
            .addClass('file-container')
            .addClass(this.classes.join(' '))
            .append(this.labelobj)
            .append(this.fileinput)
            .append($('<div />').addClass('wrap').append(this.triggerbox))
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
            .attr('tabindex', -1)
            .html(this.placeholder)
            .click(function(e) {
                if (me.disabled) {
                    e.stopPropagation();
                    return;
                }
                me.labelobj.trigger('click');
            })
            .on('keydown', function(e) {
                if (e.keyCode === 9) { // Tab
                    me.triggerbox.blur();
                } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                    me.labelobj.trigger('click');
                }
            });

        if (this.mute) { this.triggerbox.addClass('mute'); }

        if (this.icon) { this.triggerbox.addClass(`cfb-${this.icon}`); }
    }

    /**
     * Build file input
     */
    buildFileInput() {
        const me = this;

        this.fileinput = $('<input />')
            .attr('type', this.type)
            .data('self', this)
            .attr('name', this.name)
            .attr('id', this.id)
            .attr('accept', this.accept)
            .attr('multiple', this.multiple)
            .attr('aria-labelled-by', this.labelobj.id)
            .on('focusin', function() {
                me.triggerbox.focus();
            })
            .on('change', function(me) {
                if (($(this).prop('files')) && ($(this).prop('files').length > 0)) {
                    let farray =  $(this).prop('files');
                    let fnames = [];
                    for (let i of farray) {
                        fnames.push(i.name);
                    }
                    if (fnames.length > 0) {
                        me.triggerbox.addClass('files').html(fnames.join(', '));
                    } else {
                        me.triggerbox.removeClass('files').html(me.placeholder);
                    }
                }
                if ((me.onchange) && (typeof me.onchange === 'function')) {
                    me.onchange(me);
                }
            });
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get accept() { return this.config.accept; }
    set accept(accept) { this.config.accept = accept; }

    get fileinput() {
        if (!this._fileinput) { this.buildFileInput(); }
        return this._fileinput;
    }
    set fileinput(fileinput) { this._fileinput = fileinput; }

    get multiple() { return this.config.multiple; }
    set multiple(multiple) { this.config.multiple = multiple; }

    get triggerbox() {
        if (!this._triggerbox) { this.buildTriggerBox(); }
        return this._triggerbox;
    }
    set triggerbox(triggerbox) { this._triggerbox = triggerbox; }

}


