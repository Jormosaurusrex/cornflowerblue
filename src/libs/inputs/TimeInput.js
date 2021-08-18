class TimeInput extends InputElement {

    static get DEFAULT_CONFIG() {
        return {
            timestyle: 'am',
            label: TextFactory.get('timeinput-label-default')
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, TimeInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    renderer() {
        return document.createTextNode(this.format(this));
    }

    /* CORE METHODS_____________________________________________________________________ */


    /* CONSTRUCTION METHODS_____________________________________________________________ */

    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('input-container');
        this.container.classList.add('timeinput-container');
        if (this.name) {
            this.container.classList.add(`name-${this.name}`);
        }
        if (this.mute) {
            this.container.classList.add('mute');
        }
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        if (this.label) {
            this.container.appendChild(this.labelobj);
        }

        this.container.appendChild(this.timebox);

        this.postContainerScrub();

    }

    buildTimeBox() {
        this.timebox = document.createElement('div');
        this.timebox.classList.add('timebox');

        if (this.mute) {
            this.timebox.classList.add('mute');
        }

        this.hourinput = new TextInput({
            mute: this.mute,
            hours: 'minutes',
            maxlength: 2,
            focusin: () => {
                this.timebox.classList.add('focus');
            },
            focusout: () => {
                this.timebox.classList.remove('focus');
            },
            ontab: () => {
                this.minuteinput.input.focus();
            },
            onkeydown: (e, self) => {
                let allow = false,
                    bail = true,
                    firstspot = (self.value.length === 0),
                    numval = 0;

                switch (e.key) {
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        bail = false;
                        break;
                    case ' ':
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        allow = true;
                        bail = false;
                        break;
                    case 'Tab': // Up
                        e.preventDefault();
                        break;
                    case 'ArrowUp': // Up
                        e.preventDefault();
                        break;
                    case 'ArrowDown': // Down
                        e.preventDefault();
                        break;
                    default:
                        break;
                }

                if (bail) {
                    e.preventDefault();
                    return false;
                }
                if (allow) {
                    e.preventDefault();

                    if (self.value.length >= 2) {
                        //we're replacing everything
                        self.value = '';
                        firstspot = true;
                    }

                    try {
                        numval = parseInt(e.key);
                    } catch (e) {
                        numval = 0; // prob space backspace or delete
                    }

                    if (firstspot) {
                        if (numval > 2) { // Broken no matter what
                            e.preventDefault();
                            return false;
                        } else if ((numval > 1) || (numval === 0)) { // Only Military time
                            this.setTimeStyle('military');
                        }
                        self.value = `${numval}`;
                    } else { // Second hour, can be 1-0, or only 1 or 2.
                        let first = self.value[0];
                        if (this.timestyle === 'military') {
                            if (numval > 4) {
                                e.preventDefault();
                                return false;
                            }
                            self.value = `${first}${numval}`;
                        } else {
                            if ((first === '1') && (numval > 2)) { // Impossible number
                                e.preventDefault();
                                return false;
                            }
                            self.value = `${first}${numval}`;
                        }
                    }
                }
            },
            onkeyup: (e, self) => {
                let firstspot = (self.value.length === 1);
                if (!firstspot) {
                    this.minuteinput.value = '';
                    this.minuteinput.input.focus();
                }
            }
        });
        this.hourinput.input.setAttribute('pattern', "[0-9]");
        let colon = document.createElement('span');
        colon.innerHTML = ':';
        this.minuteinput = new TextInput({
            mute: this.mute,
            name: 'minutes',
            maxlength: 2,
            focusin: () => {
                this.timebox.classList.add('focus');
            },
            focusout: () => {
                this.timebox.classList.remove('focus');
            },
            onkeydown: (e, self) => {
                let allow = false,
                    bail = true,
                    firstspot = (self.value.length === 0),
                    numval = 0;

                switch (e.key) {
                    case 'Backspace':  // Backspace
                    case 'Delete':  // Delete
                        bail = false;
                        break;
                    case ' ':
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        bail = false;
                        allow = true;
                        break;
                    default:
                        break;
                }

                if (bail) {
                    e.preventDefault();
                    return false;
                }

                if (allow) {
                    e.preventDefault();
                    if (self.value.length >= 2) {
                        //we're replacing everything
                        self.value = '';
                        firstspot = true;
                    }

                    try {
                        numval = parseInt(e.key);
                    } catch (e) {
                        numval = 0; // prob space backspace or delete
                    }

                    if (firstspot) {
                        if (numval > 5) { // Broken no matter what
                            e.preventDefault();
                            return false;
                        }
                        self.value = `${numval}`;
                    } else {
                        let first = self.value[0];
                        self.value = `${first}${numval}`;
                    }

                }
            },
            onkeyup: (e, self) => {
                if (self.value.length === 2) {
                    //this.amtoggle.button.focus();
                }
            }

        });


        this.hourinput.input.setAttribute("data-time", "hours");
        this.minuteinput.input.setAttribute("data-time", "minutes");
        this.timebox.appendChild(this.hourinput.input);
        this.timebox.appendChild(colon);
        this.timebox.appendChild(this.minuteinput.input);
        this.timebox.appendChild(this.timestylebox);

    }

    buildTimeStyleBox() {
        this.timestylebox = document.createElement('div');
        this.timestylebox.classList.add('toggleset');

        this.amtoggle = new SimpleButton({
            text: TextFactory.get('timeinput-ante_meridian'),
            action: () => {
                this.setTimeStyle('am');
            }
        });
        this.pmtoggle = new SimpleButton({
            text: TextFactory.get('timeinput-post_meridian'),
            action: () => {
                this.setTimeStyle('pm');
            }
        });
        this.militarytoggle = new SimpleButton({
            text: TextFactory.get('timeinput-24_hour'),
            action: () => {
                this.setTimeStyle('military');
            }
        });

        this.timestylebox.appendChild(this.amtoggle.button);
        this.timestylebox.appendChild(this.pmtoggle.button);
        this.timestylebox.appendChild(this.militarytoggle.button);

    }

    setTimeStyle(style = 'am') {
        this.amtoggle.button.removeAttribute("aria-selected");
        this.pmtoggle.button.removeAttribute("aria-selected");
        this.militarytoggle.button.removeAttribute("aria-selected");
        switch(style) {
            case 'military':
                this.timestyle = 'military';
                this.militarytoggle.button.setAttribute("aria-selected", "true");
                break;
            case 'pm':
                this.timestyle = 'pm';
                this.pmtoggle.button.setAttribute("aria-selected", "true");
                break;
            case 'am':
            default:
                this.timestyle = 'am';
                this.amtoggle.button.setAttribute("aria-selected", "true");
                break;
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get amtoggle() { return this._amtoggle; }
    set amtoggle(amtoggle) { this._amtoggle = amtoggle; }

    get hourinput() { return this._hourinput; }
    set hourinput(hourinput) { this._hourinput = hourinput; }

    get militarytoggle() { return this._militarytoggle; }
    set militarytoggle(militarytoggle) { this._militarytoggle = militarytoggle; }

    get minuteinput() { return this._minuteinput; }
    set minuteinput(minuteinput) { this._minuteinput = minuteinput; }

    get pmtoggle() { return this._pmtoggle; }
    set pmtoggle(pmtoggle) { this._pmtoggle = pmtoggle; }

    get timebox() {
        if (!this._timebox) { this.buildTimeBox(); }
        return this._timebox;
    }
    set timebox(timebox) { this._timebox = timebox; }

    get timestyle() { return this.config.timestyle; }
    set timestyle(timestyle) { this.config.timestyle = timestyle; }

    get timestylebox() {
        if (!this._timestylebox) { this.buildTimeStyleBox(); }
        return this._timestylebox;
    }
    set timestylebox(timestylebox) { this._timestylebox = timestylebox; }

}

window.TimeInput = TimeInput;