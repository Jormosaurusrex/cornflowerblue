class RadioGroup extends SelectMenu {

    static get DEFAULT_CONFIG() {
        return {

        };
    }

    /**
     * Define the RadioGroup
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, RadioGroup.DEFAULT_CONFIG, config);

        if (!config.id) { // need to generate an id for label stuff
            config.id = `radiogroup-${CFBUtils.getUniqueKey(5)}`;
        }
        if (!config.name) { config.name = config.id; }

        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get value() {
        let opt = this.optionlist.querySelector(`input[name="${this.name}"][aria-checked="true"]`);
        if (opt) { return opt.value; }
        return null;
    }

    get input() { return this.optionlist; }

    get passivetext() {
        let p = this.unsettext;
        if (this.selectedoption) { p = this.selectedoption.label; }
        if (this.value) { p = this.value; }
        if (this.config.value) { p = this.config.value; }
        return document.createTextNode(p);
    }

    /* CONTROL METHODS__________________________________________________________________ */

    disable() {
        let radios = this.optionlist.querySelectorAll("input[type='radio']");
        for (let r of radios) {
            r.setAttribute('disabled', 'disabled');
        }
        this.disabled = true;
        if (this.container) { this.container.classList.add('disabled'); }
    }

    enable() {
        let radios = this.optionlist.querySelectorAll("input[type='radio']");
        for (let r of radios) {
            r.removeAttribute('disabled');
        }
        this.disabled = false;
        if (this.container) { this.container.classList.remove('disabled'); }
    }

    select(value) {
        let radios = this.optionlist.querySelectorAll("input[type='radio']");
        for (let radio of radios) {
            if (radio.getAttribute('data-value') === value) {
                radio.setAttribute('aria-selected', "true");
                radio.checked = true;
            } else {
                radio.removeAttribute('aria-selected');
                radio.checked = false;
            }
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('radiogroup-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        this.container.appendChild(this.labelobj);
        this.container.appendChild(this.optionlist);
        this.container.appendChild(this.passivebox);

        if (this.value) {
            this.select(this.value);
        }

        this.postContainerScrub();

    }

    postContainerScrub() {
        if (this.hidden) { this.container.style.display = 'none'; }

        if (this.required) {
            this.container.classList.add('required');
            this.optionlist.setAttribute('required', 'required');
        }

        if (this.hidden) {
            this.container.style.display = 'none';
            this.container.setAttribute('aria-hidden', 'true');
        }

        if (this.passive) { this.pacify(); }
        if (this.disabled) { this.disable(); }

        if (this.help) {
            this.optionlist.setAttribute('aria-describedby', `${this.id}-help-tt`);
            this.optionlist.setAttribute('aria-labelledby', `${this.id}-label`);
        }
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
        op.setAttribute('data-value', def.value);

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

        let opLabel = document.createElement('label');
        opLabel.setAttribute('for', lId);
        opLabel.innerHTML = def.label;

        if (def.help) {
            let s = document.createElement('span');
            s.classList.add('mutehelp');
            s.innerHTML = def.help;
            opLabel.appendChild(s);
        }

        if (((this.config.value !== null) && (this.config.value === def.value)) || (def.checked)) {
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

    buildOptionList() {
        this.optionlist = document.createElement('ul');
        this.optionlist.classList.add('radiogroup');
        this.optionlist.setAttribute('tabindex', '-1');

        for (let opt of this.options) {
            let o = this.buildOption(opt);
            if (opt.checked) {
                this.selectedoption = opt;
            }
            this.optionlist.appendChild(o);
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */
    get optionlist() {
        if (!this._optionlist) { this.buildOptionList(); }
        return this._optionlist;
    }
    set optionlist(optionlist) { this._optionlist = optionlist; }


}
window.RadioGroup = RadioGroup;