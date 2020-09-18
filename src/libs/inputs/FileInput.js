class FileInput extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            type: "file",
            icon: "upload",
            accept: 'image/png,image/gif,image/jpg,image/jpeg', // the default accept mime-type
            multiple: false, // Should the file uploader accept multiple files?
            onchange: null // The change handler. Passed (self).
        };
    }

    static get DOCUMENTATION() {
        return {
            icon: { type: 'option', datatype: 'string', description: "The icon to use for the upload trigger." },
            accept: { type: 'option', datatype: 'string', description: "The default accept mime-type value." },
            multiple: { type: 'option', datatype: 'boolean', description: "If true, accept multiple files for upload." }
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, FileInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get value() {
        if (this.selected) { return this.selected.val(); }
        return ''; // Return empty string for no value.
    }

    get topcontrol() { return this.searchdisplay; }

    get passivetext() {
        if (this.selectedoption) { return this.selectedoption.label; }
        if (this.value) { return this.value; }
        if (this.config.value) { return this.config.value; }
        return this.unsettext;
    }

    /* CONTROL METHODS__________________________________________________________________ */

    calculatePlaceholder() {
        if (this.multiple) { return TextFactory.get('fileinput-placeholder-multiple'); }
        return TextFactory.get('fileinput-placeholder-file');
    }

    disable() {
        this.triggerbox.setAttribute('disabled', 'disabled');
        this.triggerbox.classList.add('disabled');
        this.container.classList.add('disabled');
        this.disabled = true;
    }

    enable() {
        this.triggerbox.removeAttribute('disabled');
        this.triggerbox.classList.remove('disabled');
        this.container.classList.remove('disabled');
        this.disabled = false;
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {

        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('file-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        this.container.appendChild(this.labelobj);
        this.container.appendChild(this.fileinput);

        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        wrap.appendChild(this.triggerbox);
        this.container.appendChild(wrap);

        this.container.appendChild(this.messagebox);

        this.postContainerScrub();
    }

    /**
     * Builds the trigger box for the select.
     */
    buildTriggerBox() {

        this.triggerbox = document.createElement('div');
        this.triggerbox.classList.add('trigger');
        this.triggerbox.setAttribute('tabindex', '-1');
        this.triggerbox.innerHTML = this.placeholder;
        this.triggerbox.addEventListener('click', (e) => {
            if (this.disabled) {
                e.stopPropagation();
                return;
            }
            this.labelobj.click();
        });
        this.triggerbox.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Tab':
                    this.triggerbox.blur();
                    break;
                case 'Enter':
                case ' ':
                    this.labelobj.click();
                    break;
                default:
                    break;
            }
        });

        if (this.mute) { this.triggerbox.classList.add('mute'); }

        if (this.icon) { this.triggerbox.classList.add(`cfb-${this.icon}`); }
    }

    /**
     * Build file input
     */
    buildFileInput() {


        this.fileinput = document.createElement('input');
        this.fileinput.setAttribute('type', this.type);
        this.fileinput.setAttribute('name', this.name);
        this.fileinput.setAttribute('id', this.id);
        this.fileinput.setAttribute('accept', this.accept);
        this.fileinput.setAttribute('multiple', this.multiple);
        this.fileinput.setAttribute('aria-labelledby', this.labelobj.id);
        this.fileinput.addEventListener('focusin', () => {
                this.triggerbox.focus();
        });
        this.fileinput.addEventListener('change', (event) => {
            if ((this.fileinput.files) && (this.fileinput.files.length > 0)) {
                let farray =  this.fileinput.files;
                let fnames = [];
                for (let i of farray) {
                    fnames.push(i.name);
                }
                if (fnames.length > 0) {
                    this.triggerbox.classList.add('files');
                    this.triggerbox.innerHTML = fnames.join(', ');
                } else {
                    this.triggerbox.classList.remove('files');
                    this.triggerbox.innerHTML = this.placeholder;
                }
            }
            this.validate();
            if (this.form) {
                this.form.validate();
            }
            if ((this.onchange) && (typeof this.onchange === 'function')) {
                this.onchange(event, this);
            }
        });

        CFBUtils.applyDataAttributes(this.attributes, this.fileinput);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get accept() { return this.config.accept; }
    set accept(accept) { this.config.accept = accept; }

    get fileinput() {
        if (!this._fileinput) { this.buildFileInput(); }
        return this._fileinput;
    }
    set fileinput(fileinput) { this._fileinput = fileinput; }

    get multiple() { return this.config.multiple; }
    set multiple(multiple) { this.config.multiple = multiple; }

    get triggerbox() {
        if (!this._triggerbox) { this.buildTriggerBox(); }
        return this._triggerbox;
    }
    set triggerbox(triggerbox) { this._triggerbox = triggerbox; }

}
window.FileInput = FileInput;