"use strict";

class TextArea extends TextInput {

    static DEFAULT_CONFIG = {
        counter: 'sky', // A value for a character counter. Null means 'no counter'
        // Possible values: null, 'remaining', 'limit', and 'sky'
    };

    constructor(config) {
        config = Object.assign({}, TextArea.DEFAULT_CONFIG, config);
        super(config);
    }

    /**
     * Builds and returns a container object for all parts.
     * This gets over-ridden in elements that have additional structures, like a character counter
     * @returns {jQuery} jQuery representation of the label and the input together.
     */
    buildContainer() {
        this.container = $('<div />')
            .addClass('input-container')
            .addClass('textarea-container')
            .append(this.labelobj)
            .append(this.charactercounter)
            .append($('<div />').addClass('wrap').append(this.input))
            .append(this.messagebox);

        if (this.required) { this.container.addClass('required'); }
        if (this.mute) { this.container.addClass('mute'); }
    }

    /**
     * Builds the input's DOM.
     * @returns {jQuery} jQuery representation of the input
     */
    buildInput() {
        const me = this;
        this.input = $('<textarea />')
            .data('self', this)
            .attr('name', this.name)
            .attr('autocomplete', this.autocomplete)
            .attr('placeholder', this.placeholder)
            .attr('aria-label', this.arialabel)
            .attr('aria-describedby', `msg-${this.id}`)
            .attr('aria-invalid', false)
            .attr('role', 'textbox')
            .attr('aria-multiline', true)
            .attr('tabindex', 0) // always 0
            .attr('maxlength', this.maxlength)
            .attr('hidden', this.hidden)
            .attr('disabled', this.disabled)
            .on('keydown', function() {
                me.updateCounter();
            })
            .on('keyup', function(e) {
                if ((me.value) && (me.value.length > 0) && (me.container)) {
                    me.container.addClass('filled');
                } else {
                    me.container.removeClass('filled');
                }
                if ((e.keyCode === 13) // Return key
                    && (me.onreturn) && (typeof me.onreturn === 'function')) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.onreturn(e, me);
                } else if ((me.keyup) && (typeof me.keyup === 'function')) {
                    me.keyup(e, me);
                }
            })
            .focusin(function(e) {
                if ((me.mute) && (me.placeholder)) {
                    $(this).attr('placeholder', me.placeholder);
                }
                if (me.container) {
                    me.container.addClass('active');
                }
                if ((me.focusin) && (typeof me.focusin === 'function')) {
                    me.focusin(e, me);
                }
            })
            .focusout(function(e) {
                if ((me.mute) && (me.label)) {
                    $(this).attr('placeholder', me.label);
                }
                if (me.container) {
                    me.container.removeClass('active');
                }

                me.validate();

                if ((me.focusout) && (typeof me.focusout === 'function')) {
                    me.focusout(e, me);
                }
            })
            .val(this.config.value);

        if (this.required) {
            this.input.attr('required', true);
        }

        if (this.mute) {
            this.input.addClass('mute');
            if (this.label) { this.input.attr('placeholder', this.label); }
        }
    }

}