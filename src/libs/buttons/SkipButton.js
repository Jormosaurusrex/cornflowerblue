class SkipButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            text: TextFactory.get('skip_to_content'),
            classes: ['visually-hidden', 'skipbutton'],
            id: 'content-jump',
            contentstart: "#content-start",
            focusin: (e, self) => {
                self.button.classList.remove('visually-hidden');
            },
            focusout: (e, self) => {
                self.button.classList.add('visually-hidden');
            },
            action: (e, self) => {
                let url = location.href;
                location.href = self.contentstart;
                history.replaceState(null,null,url);
            }
        };
    }

    static get DOCUMENTATION() {
        return {
            id: { type: 'option', datatype: 'string', description: "A unique id value. This is predefined on a SkipButton." },
            contentstart: { type: 'option', datatype: 'string', description: "The id of the element to jump to that marks the start of the content." }
        };
    }
    constructor(config) {
        config = Object.assign({}, SkipButton.DEFAULT_CONFIG, config);
        super(config);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get contentstart() { return this.config.contentstart; }
    set contentstart(contentstart) { this.config.contentstart = contentstart; }

}
window.SkipButton = SkipButton;