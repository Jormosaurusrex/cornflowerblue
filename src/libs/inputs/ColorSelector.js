class ColorSelector extends RadioGroup {

    static get DEFAULT_CONFIG() {
        return {
            options: [
                { label: 'Red', value: 'var(--red)' },
                { label: 'Orange', value: 'var(--orange)' },
                { label: 'Yellow', value: 'var(--yellow)' },
                { label: 'Green', value: 'var(--green)' },
                { label: 'Blue', value: 'var(--blue)' },
                { label: 'Purple', value: 'var(--purple)' },
                { label: 'Black', value: 'var(--black)' },
                { label: 'White', value: 'var(--white)' }
            ],
        };
    }



    /**
     * Define the ColorSelecotr
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        console.log(`a: ${config.value}`);
        config = Object.assign({}, ColorSelector.DEFAULT_CONFIG, config);
        console.log(`b: ${config.value}`);

        if (!config.id) { // need to generate an id for label stuff
            config.id = `colorselector-${CFBUtils.getUniqueKey(5)}`;
        }
        if (!config.name) { config.name = config.id; }

        super(config);
        console.log(`c: ${config.value}`);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get input() { return this.optionlist; }

    get passivetext() {
        let p = this.unsettext;
        if (this.selectedoption) { p = this.selectedoption.label; }
        if (this.value) { p = this.value; }
        if (this.config.value) { p = this.config.value; }
        return document.createTextNode(p);
    }


    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('colorselector-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        this.container.appendChild(this.labelobj);
        this.container.appendChild(this.optionlist);
        this.container.appendChild(this.passivebox);
        this.postContainerScrub();

    }

    buildOption(def) {
        const lId = `${this.id}-${CFBUtils.getUniqueKey(5)}`;
        let op = document.createElement('input');
        op.setAttribute('id', lId);
        op.setAttribute('type', 'radio');
        op.setAttribute('name', this.name);
        op.setAttribute('tabindex', '0'); // always 0
        op.setAttribute('value', def.value);
        op.setAttribute('aria-label', def.label);
        op.setAttribute('role', 'radio');
        for (let c of this.classes) {
            op.classList.add(c);
        }
        op.addEventListener('change', () => {
            if (op.checked) {
                op.setAttribute('aria-checked', 'true');
            } else {
                op.removeAttribute('aria-checked');
            }

            this.selectedoption = def;
            if (def.label === this.unselectedtext) {
                this.passivebox.innerHTML = this.unsettext;
            } else {
                this.passivebox.innerHTML = def.label;
            }

            this.validate();

            if (this.form) { this.form.validate(); }

            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(this);
            }
        });
        op.style.backgroundColor = def.value;

        let opLabel = document.createElement('label');
        opLabel.setAttribute('for', lId);
        opLabel.innerHTML = def.label;

        console.log(`${this.config.value} === ${def.value}`);
        if ((this.config.value) && (def.value === this.config.value)) {
            this.origval = def.value;
            op.checked = true;
            op.setAttribute('aria-checked', 'true');
        } else if (def.checked) {
            this.origval = def.value;
            op.checked = true;
            op.setAttribute('aria-checked', 'true');
        }

        let li = document.createElement('li');
        li.classList.add('radio');
        li.appendChild(op);
        li.appendChild(opLabel);
        return li;
    }

    buildOptions() {
        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('colorselector');
        this.optionlist.setAttribute('tabindex', '-1');

        for (let opt of this.options) {
            let o = this.buildOption(opt);
            if (opt.checked) {
                this.selectedoption = opt;
            }
            this.optionlist.appendChild(o);
        }
    }

}
window.ColorSelector = ColorSelector;