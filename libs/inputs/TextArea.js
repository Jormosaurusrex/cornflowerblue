"use strict";

class TextArea extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            counter: 'sky', // A value for a character counter. Null means 'no counter'
            // Possible values: null, 'remaining', 'limit', and 'sky'
        };
    }

    constructor(config) {
        config = Object.assign({}, TextArea.DEFAULT_CONFIG, config);
        config.type = "textarea";
        super(config);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = $('<div />')
            .addClass('textarea-container')
            .data('self', this)
            .append(this.labelobj)
            .append(this.charactercounter)
            .append($('<div />').addClass('wrap').append(this.input))
            .append(this.messagebox);

        this.postContainerScrub();

    }

}
