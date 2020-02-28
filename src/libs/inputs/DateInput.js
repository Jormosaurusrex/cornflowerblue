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
        return d instanceof Date && !isNaN(d);
    }

    constructor(config) {
        config = Object.assign({}, DateInput.DEFAULT_CONFIG, config);

        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputcontrol() { return this.calbutton; }

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
                console.log('focusing');
                me.input.focus();
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
                } else {
                    me.datepicker.renderMonth(me.value);
                    self.open();
                }
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

    /* ACCESSOR METHODS_________________________________________________________________ */

    get calbutton() {
        if (!this._calbutton) { this.buildCalendarButton(); }
        return this._calbutton;
    }
    set calbutton(calbutton) { this._calbutton = calbutton; }

    get dateicon() { return this.config.dateicon; }
    set dateicon(dateicon) { this.config.dateicon = dateicon; }

    get datepicker() { return this._datepicker; }
    set datepicker(datepicker) { this._datepicker = datepicker; }

    get triggerbutton() { return this._triggerbutton; }
    set triggerbutton(triggerbutton) { this._triggerbutton = triggerbutton; }

}

