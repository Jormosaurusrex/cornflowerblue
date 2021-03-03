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
            let image = document.createElement('div');
            image.classList.add('thumbnail')
            image.style.backgroundImage = `url('${def.url}')`;
            div.appendChild(image);
        }
        let data = document.createElement('div');
        data.classList.add('data');
        data.innerHTML = `<span class="text">${def.label}</span>`;
        if ((def.filesize) || ((def.height) && (def.width))) {
            let mdata = document.createElement('div');
            mdata.classList.add('meta');
            if ((def.filesize) && ((def.height) && (def.width))) {
                mdata.innerHTML = `<span class="size">${def.filesize} bytes</span> &middot; <span class="dimensions">${def.height}px x ${def.width}px</span>`;
            } else if (def.filesize) {
                mdata.innerHTML = `<span class="size">${def.filesize} bytes</span>`;
            } else if ((def.height) && (def.width)) {
                mdata.innerHTML = `<span class="dimensions">${def.height}px x ${def.width}px</span>`;
            }
            data.appendChild(mdata);
        }
        div.appendChild(data);
        return div;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

}
window.ImageSelector = ImageSelector;