class SkipButton extends SimpleButton {

    static get DEFAULT_CONFIG() {
        return {
            text: TextFactory.get('skip_to_content'),
            classes: ['visually-hidden'],
            id: 'content-jump',
            hot: true,
            contentstart: "#content-start",
            focusin: function(e, self) {
                self.button.classList.remove('visually-hidden');
            },
            focusout: function(e, self) {
                self.button.classList.add('visually-hidden');
            },
            action: function(e, self) {
                let url = location.href;
                location.href = self.contentstart;
                history.replaceState(null,null,url);
            }
        };
    }

    constructor(config) {
        config = Object.assign({}, SkipButton.DEFAULT_CONFIG, config);
        super(config);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    /**
     * Get the content start identifier
     * @return {string}
     */
    get contentstart() { return this.config.contentstart; }
    set contentstart(contentstart) { this.config.contentstart = contentstart; }

}
window.SkipButton = SkipButton;