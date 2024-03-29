class ColorSelector extends RadioGroup {

    static get DEFAULT_CONFIG() {
        return {
            options: [
                { label: TextFactory.get('color-red'), value: 'red' },
                { label: TextFactory.get('color-orange'), value: 'orange' },
                { label: TextFactory.get('color-yellow'), value: 'yellow' },
                { label: TextFactory.get('color-green'), value: 'green' },
                { label: TextFactory.get('color-blue'), value: 'blue' },
                { label: TextFactory.get('color-darkblue'), value: 'darkblue' },
                { label: TextFactory.get('color-purple'), value: 'purple' },
                { label: TextFactory.get('color-pink'), value: 'pink' },
                { label: TextFactory.get('color-tan'), value: 'tan' },
                { label: TextFactory.get('color-brown'), value: 'brown' },
                { label: TextFactory.get('color-black'), value: 'black' },
                { label: TextFactory.get('color-grey'), value: 'grey' },
                { label: TextFactory.get('color-white'), value: 'white' }
            ]
        };
    }

    /**
     * Define the ColorSelecotr
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, ColorSelector.DEFAULT_CONFIG, config);

        if (!config.id) { // need to generate an id for label stuff
            config.id = `colorselector-${CFBUtils.getUniqueKey(5)}`;
        }
        if (!config.name) { config.name = config.id; }

        super(config);
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
        let li = document.createElement('li'),
            op = document.createElement('input');

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
            for (let opt of this.optionlist.querySelectorAll('input[type="radio"]')) {
                opt.removeAttribute('aria-checked');
                opt.removeAttribute('aria-selected');
            }
            if (op.checked) {
                op.setAttribute('aria-checked', 'true');
                op.setAttribute('aria-selected', 'true');
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

        let swatch = document.createElement('span');
        swatch.classList.add('swatch');
        swatch.style.backgroundColor = def.value;

        op.style.backgroundColor = def.value;

        let opLabel = document.createElement('label');
        opLabel.setAttribute('for', lId);
        opLabel.appendChild(swatch);
        new ToolTip({
            text: def.label,
            icon: null
        }).attach(opLabel);


        let selected = false;
        if ((this.config.value) && (def.value === this.config.value)) {
            selected = true;
        } else if (def.checked) {
            selected = true;
        }
        if (selected) {
            li.setAttribute('aria-selected', "true");
            this.origval = def.value;
            op.checked = true;
            op.setAttribute('aria-checked', 'true');
        }

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