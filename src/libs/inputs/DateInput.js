class DateInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'date',
            dateicon: 'calendar'
        };
    }

    constructor(config) {
        config = Object.assign({}, DateInput.DEFAULT_CONFIG, config);

        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputcontrol() { return this.calbutton; }

    /* CORE METHODS_____________________________________________________________________ */

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    openPicker() {

    }

    // XXX TODO: break out into its own component
    buildDatePicker() {
        const me = this;
        this.datepicker = new DatePicker({
            onselect: function(value) {
                me.value = value;
            }
        });
    }

    /**
     * Build the calendar button
     */
    buildCalendarButton() {
        const me = this;

        this.triggerbutton = new ButtonMenu({
            classes: ['naked'],
            shape: 'square',
            icon: this.dateicon,
            menu: this.datepicker.container,
            action: function(e, self) {
                self.toggle();
                me.datepicker.renderMonth(me.value);
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

    get datepicker() {
        if (!this._datepicker) { this.buildDatePicker(); }
        return this._datepicker;
    }
    set datepicker(datepicker) { this._datepicker = datepicker; }

    get triggerbutton() { return this._triggerbutton; }
    set triggerbutton(triggerbutton) { this._triggerbutton = triggerbutton; }

}

