class DateInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'date',
            forceconstraints: true,
            dateicon: 'calendar'
        };
    }

    /**
     * Tests whether or the value is a valid date.
     * @param date The date to check
     * @returns {boolean} true or false, depending
     */
    static isValid(date) {
        let d = new Date(`${date} 12:00:00`);
        console.log(d);
        return d instanceof Date && !isNaN(d);
    }

    constructor(config) {
        config = Object.assign({}, DateInput.DEFAULT_CONFIG, config);
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputcontrol() { return this.calbutton; }

    get topcontrol() { return this.datedisplay; }

    /* CORE METHODS_____________________________________________________________________ */

    calculatePlaceholder() {
        return 'YYYY-MM-DD';
    }

    localValidator() {
        if ((this.value) && (this.forceconstraints)) {
            if (!DateInput.isValid(this.value)) {
                this.errors.push("This is an invalid date.");
            }
        }
        this.updateDateDisplay();
    }

    updateDateDisplay() {
        if ((!this.value) || (this.value === '')) {
            this.datedisplay.classList.add('hidden');
            this.datedisplay.innerHTML = '';
            return;
        }
        this.datedisplay.classList.remove('hidden');
        this.datedisplay.innerHTML = new Date(`${this.value} 12:00:00`).toString();
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the calendar button and attach the DatePicker
     */
    buildCalendarButton() {
        const me = this;

        this.datepicker = new DatePicker({
            onselect: function(value) {
                me.value = value;
                me.triggerbutton.close();
                me.input.focus();
                me.validate();
            }
        });

        this.triggerbutton = new ButtonMenu({
            classes: ['naked'],
            shape: 'square',
            icon: this.dateicon,
            menu: this.datepicker.container,
            action: function(e, self) {
                if (self.isopen) {
                    self.close();
                    me.input.focus();
                } else {
                    self.open();
                }
                me.datepicker.renderMonth(me.value);
                e.stopPropagation();
            },
        });

        this.calbutton = document.createElement('div');
        this.calbutton.classList.add('calbutton');
        this.calbutton.classList.add('inputcontrol');
        this.calbutton.appendChild(this.triggerbutton.button);

        this.calbutton.addEventListener('mousedown', function(e) {
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

    get triggerbutton() { return this._triggerbutton; }
    set triggerbutton(triggerbutton) { this._triggerbutton = triggerbutton; }

}

