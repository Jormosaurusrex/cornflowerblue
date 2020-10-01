class ImageSelector extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {
            unselectedtext: TextFactory.get('select_image')
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        if (!config.classes) { config.classes = []; }
        config.classes.push('imageselector-container');
        config = Object.assign({}, ImageSelector.DEFAULT_CONFIG, config);
        super(config);
    }

    get passivetext() {
        let i = document.createElement('img');
        i.setAttribute('src', this.config.value);
        return i;
    }

    set value(value) {
        this.config.value = value;
        this.triggerbox.value = value;
        this.setPassiveboxValue(value);
    }
    get value() { return this.config.value; }

    setPassiveboxValue(value) {
        this.passivebox.setAttribute('src', value);
    }

    drawPayload(def) {
        let div = document.createElement('div');
        div.classList.add('imagesel');
        if (def.url) {
            let img = document.createElement('img');
            img.setAttribute('src', def.url);
            div.appendChild(img);
        }
        div.appendChild(super.drawPayload(def));
        return div;
    }
}
window.ImageSelector = ImageSelector;