"use strict";

class TextArea extends TextInput {

    constructor(config) {
        super(config);
    }

    /**
     * Builds the input's DOM.
     * @returns {jQuery} jQuery representation of the input
     */
    buildInput() {
        this.input = $('<textarea />')
            .data('self', this)
            .attr('type', this.type)
            .attr('name', this.name)
            .attr('autocomplete', this.autocomplete)
            .attr('placeholder', this.placeholder)
            .attr('aria-label', this.arialabel)
            .attr('maxlength', this.maxlength)
            .attr('hidden', this.hidden)
            .attr('disabled', this.disabled)
            .focusin(function() {
                if (($(this).data('self').mute) && ($(this).data('self').placeholder)) {
                    $(this).attr('placeholder', $(this).data('self').placeholder);
                }
            })
            .focusout(function() {
                if (($(this).data('self').mute) && ($(this).data('self').label)) {
                    $(this).attr('placeholder', $(this).data('self').label);
                }
            })
            .val(this.config.value);
        if (this.mute) {
            this.input.addClass('mute');
            if (this.label) { this.input.attr('placeholder', this.label); }
        }
    }

}