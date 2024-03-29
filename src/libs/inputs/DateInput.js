class DateInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            basetime: '12:00:00',
            timezone: 'GMT',
            type: 'text',
            gravity: 'south',
            timepicker: false,
            triggerarialabel: TextFactory.get('dateinput-trigger-arialabel'),
            forceconstraints: true,
            format: (self) => {
                let d = new Date(self.value);
                if (!d) { return ""; }
                return d.toUTCString();
            },
            dateicon: 'calendar'
        };
    }
    static get DOCUMENTATION() {
        return {
            basetime: { type: 'option', datatype: 'string', description: "Time of day to set dates to." },
            timezone: { type: 'option', datatype: 'string', description: "The default timezone to set the datepicker to (unused)." },
            gravity: { type: 'option', datatype: 'string', description: "The direction to open the datepicker when it's clicked open." },
            triggerarialabel: { type: 'option', datatype: 'string', description: "The aria-label for the datepicker trigger button." },
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, enforce that the value is a valid date." },
            dateicon: { type: 'option', datatype: 'string', description: "The icon to use for the datpicker trigger button." }
        };
    }

    /**
     * Tests whether or the value is a valid date.
     * @param date The date to check
     * @returns {boolean} true or false, depending
     */
    static isValid(date) {
        let d = new Date(date),
            valid = true;
        switch (d.getMonth()) {
            case 2:
                if (d.getDay() > 29) { valid = false; }
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                if (d.getDay() > 30) { valid = false; }
                break;
            default:
                if (d.getDay() > 31) { valid = false; }
                break;
        }
        if (!valid) return false;
        return d instanceof Date && !isNaN(d.getTime());
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, DateInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputcontrol() { return this.calbutton; }

    get topcontrol() { return this.datedisplay; }

    renderer() {
        return document.createTextNode(this.format(this));
    }

    /* CORE METHODS_____________________________________________________________________ */

    calculatePlaceholder() {
        return 'YYYY-MM-DD';
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!DateInput.isValid(this.value)) {
                this.errors.push(TextFactory.get('dateinput-error-invalid'));
            }
        }
        this.updateDateDisplay();
    }

    /**
     * Update the upper date display
     */
    updateDateDisplay() {
        if ((!this.value) || (this.value === '')) {
            this.datedisplay.classList.add('hidden');
            this.datedisplay.innerHTML = '';
            return;
        }
        this.datedisplay.classList.remove('hidden');
        // XXX THIS GETS COMPLICATED
        // XXX IF NOT TIME THEN SET TO BASETIME
        //console.log(`date: ${this.value} ${this.basetime}`);

        //let d = new Date(`${this.value} ${this.basetime} GMT`);
        this.datedisplay.innerHTML = this.format(this);
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the calendar button and attach the DatePicker
     */
    buildCalendarButton() {
        this.datepicker = new DatePicker({
            classes: ['menu'],
            timepicker: this.timepicker,
            onselect: (value) => {
                this.value = value;
                this.triggerbutton.close();
                this.input.focus();
                this.validate();
                if ((this.onchange) && (typeof this.onchange === 'function')) {
                    this.onchange(this);
                }
            }
        });
        this.triggerbutton = new ButtonMenu({
            classes: ['naked', 'datepicker'],
            shape: 'square',
            gravity: 'n',
            icon: this.dateicon,
            arialabel: this.triggerarialabel,
            menu: this.datepicker.container,
            action: (e, self) => {
                if (self.isopen) {
                    self.close();
                    this.input.focus();
                } else {
                    self.open();
                    this.datepicker.renderMonth(this.value);
                }
                e.stopPropagation();
            },
        });

        this.calbutton = document.createElement('div');
        this.calbutton.classList.add('calbutton');
        this.calbutton.classList.add('inputcontrol');
        this.calbutton.appendChild(this.triggerbutton.button);

        this.calbutton.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevents focus shifting.
        });

    }

    /**
     * Draws the date text display.
     */
    buildDateDisplay() {
        this.datedisplay = document.createElement('div');
        this.datedisplay.classList.add('datedisplay');
        this.datedisplay.classList.add('topcontrol');
        this.updateDateDisplay();
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get basetime() { return this.config.basetime; }
    set basetime(basetime) { this.config.basetime = basetime; }

    get calbutton() {
        if (!this._calbutton) { this.buildCalendarButton(); }
        return this._calbutton;
    }
    set calbutton(calbutton) { this._calbutton = calbutton; }

    get datedisplay() {
        if (!this._datedisplay) { this.buildDateDisplay(); }
        return this._datedisplay;
    }
    set datedisplay(datedisplay) { this._datedisplay = datedisplay; }

    get dateicon() { return this.config.dateicon; }
    set dateicon(dateicon) { this.config.dateicon = dateicon; }

    get datepicker() { return this._datepicker; }
    set datepicker(datepicker) { this._datepicker = datepicker; }

    get format() { return this.config.format; }
    set format(format) { this.config.format = format; }

    get gravity() { return this.config.gravity; }
    set gravity(gravity) { this.config.gravity = gravity; }

    get timepicker() { return this.config.timepicker; }
    set timepicker(timepicker) { this.config.timepicker = timepicker; }

    get timezone() { return this.config.timezone; }
    set timezone(timezone) { this.config.timezone = timezone; }

    get triggerarialabel() { return this.config.triggerarialabel; }
    set triggerarialabel(triggerarialabel) { this.config.triggerarialabel = triggerarialabel; }

    get triggerbutton() { return this._triggerbutton; }
    set triggerbutton(triggerbutton) { this._triggerbutton = triggerbutton; }

}

window.DateInput = DateInput;