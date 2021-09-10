class DatePicker {

    static get DEFAULT_CONFIG() {
        return {
            startdate: null,
            value: null,
            timezone: 'GMT',
            timepicker: false,
            basetime: '12:00:00', // Time to set dates on
            locale: 'en-US',
            weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            onselect: null,
            classes: []
        };
    }

    static get DOCUMETATION() {
        return {
            classes: { type: 'option', datatype: 'stringarray', description: "An array of css class names to apply." },
            startdate: { type: 'option', datatype: 'date', description: "The date to start the calendar on. Can also be a readable string." },
            value: { type: 'option', datatype: 'date', description: "The date to preselect. Can also be a readable string." },
            onselect: { type: 'option', datatype: 'function', description: "A function to be called on selection. Passed the date selected, as a string." }
        }
    }

    /**
     * Define a DataGrid
     * @param config a dictionary object
     */
    constructor(config) {
        if (!config) { config = {}; }
        this.config = Object.assign({}, DatePicker.DEFAULT_CONFIG, config);
    }

    /**
     * Get the month name.
     * @param m month id
     * @return {*} string
     */
    getMonthName(m) {
        return this.months[m];
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('datepicker');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }
        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        this.container.appendChild(this.monthbox);

        if (this.timepicker) {
            this.timeinput = new TimeInput({
                mute: true
            });
            this.container.appendChild(this.timeinput.container);
        }

    }

    buildMonthBox() {
        this.monthbox = document.createElement('div');
        this.monthbox.classList.add('monthbox');
        this.renderMonth(this.startdate); // initial
    }

    /**
     * Render a month
     * @param startDate the date to center the month around. If null, uses today.
     */
    renderMonth(startDate) {

        // XXX there has to be a better way to do this.

        let now = new Date();
        let today = new Date(`${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()} ${this.basetime}`);

        if ((!startDate) || (!DateInput.isValid(startDate))) {
            startDate = today;
        } else if (typeof startDate === 'string') {
            startDate = new Date(`${startDate} ${this.basetime}`);
            this.value = startDate;
            this.startdate = startDate;
        }

        let startDay = new Date(startDate.getFullYear(), startDate.getMonth()).getDay();

        // Many additional dates or things
        let daysInMonth = (32 - new Date(startDate.getFullYear(), startDate.getMonth(), 32).getDate()),
            previousMonth = new Date(startDate.getFullYear(), (startDate.getMonth() - 1)),
            daysInPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 0).getDate(),
            nextMonth = new Date(startDate.getFullYear(), (startDate.getMonth() + 1));

        let month = document.createElement('div');
        month.classList.add('month');

        let header = document.createElement('div');
        header.classList.add('datepicker-header');

        let pMonthButton = new SimpleButton({
            shape: 'square',
            mute: true,
            size: 'small',
            icon: 'triangle-left',
            action: (e) => {
                e.preventDefault();
                this.renderMonth(previousMonth);
            }
        });

        let nMonthButton = new SimpleButton({
            shape: 'square',
            mute: true,
            size: 'small',
            icon: 'triangle-right',
            action: (e) => {
                e.preventDefault();
                this.renderMonth(nextMonth);
            }
        });

        let mname = document.createElement('div');
        mname.classList.add('name');
        mname.innerHTML = `${this.getMonthName(startDate.getMonth())}, ${startDate.getFullYear()}`;

        header.appendChild(mname);
        header.appendChild(pMonthButton.button);
        header.appendChild(nMonthButton.button);

        month.appendChild(header);

        let calendar = document.createElement('table');
        calendar.classList.add('month');

        let thead = document.createElement('thead');
        let hr = document.createElement('tr');
        for (let weekday of this.weekdays) {
            let th = document.createElement('th');
            th.innerHTML = weekday.charAt(0);
            let celltip = new ToolTip({
                classes: ['unfixed'],
                text: weekday
            });
            celltip.attach(th);
            hr.appendChild(th);
        }
        thead.appendChild(hr);
        calendar.appendChild(thead);

        let tbody = document.createElement('tbody');

        let dayOfMonth = 1,
            dayOfNextMonth = 1,
            dayOfPreviousMonth = daysInPreviousMonth - startDay;

        let cellCount = 0;
        for (let rc = 0; rc <= 5; rc++) {
            let tr = document.createElement('tr');
            for (let d = 0; d <= 6; d++) {

                let td = document.createElement('td'),
                    link = document.createElement('a'),
                    thisDay;

                link.setAttribute('data-cellno', cellCount);

                if ((cellCount >= startDay) && (dayOfMonth <= daysInMonth)) {
                    // startDay or into the future until the end of the month
                    link.innerHTML = dayOfMonth;
                    link.classList.add('cmonth');
                    link.setAttribute('data-day', `${startDate.getFullYear()}-${(startDate.getMonth() + 1)}-${dayOfMonth}`);
                    thisDay = new Date(`${startDate.getFullYear()}-${(startDate.getMonth() +1)}-${dayOfMonth} ${this.basetime}`);
                    dayOfMonth++;
                } else if ((cellCount < startDay)) {
                    // before the startDay, so last month
                    link.innerHTML = dayOfPreviousMonth;
                    thisDay = new Date(`${previousMonth.getFullYear()}-${(previousMonth.getMonth()+ 1)}-${dayOfPreviousMonth} ${this.basetime}`);
                    link.setAttribute('data-day', `${previousMonth.getFullYear()}-${(previousMonth.getMonth()+ 1)}-${dayOfPreviousMonth}`);
                    dayOfPreviousMonth++;
                } else {
                    // after this month, so next month
                    thisDay = new Date(`${nextMonth.getFullYear()}-${(nextMonth.getMonth() +1)}-${dayOfNextMonth} ${this.basetime}`);
                    link.innerHTML = dayOfNextMonth;
                    link.setAttribute('data-day', `${nextMonth.getFullYear()}-${(nextMonth.getMonth() +1)}-${dayOfNextMonth}`);
                    dayOfNextMonth++;
                }

                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.select(link);
                });
                link.addEventListener('keydown', (e) => {

                    let pcell = parseInt(link.getAttribute('data-cellno')) - 1;
                    let ncell = parseInt(link.getAttribute('data-cellno')) + 1;

                    switch (e.key) {
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            let p = tbody.querySelector(`[data-cellno='${pcell}'`);
                            if (p) {
                                p.focus();
                            }
                            e.stopPropagation();
                            break;
                        case 'ArrowRight':
                        case 'ArrowDown':
                            let n = tbody.querySelector(`[data-cellno='${ncell}'`);
                            if (n) {
                                n.focus();
                            }
                            e.stopPropagation();
                            break;
                        case 'Enter':
                        case ' ':
                            this.select(link);
                            e.stopPropagation();
                            break;
                        default:
                            break;
                    }
                    return false;
                });

                link.setAttribute('aria-label', link.getAttribute('data-day'));
                link.setAttribute('tabindex', 0);

                if (thisDay.getTime() === today.getTime()) {
                    link.classList.add('today');
                } else if (thisDay.getTime() < today.getTime()) {
                    link.classList.add('past');
                } else if (thisDay.getTime() > today.getTime()) {
                    link.classList.add('future');
                }

                if ((this.value) && (
                    (this.startdate.getFullYear() === thisDay.getFullYear()) &&
                    (this.startdate.getMonth() === thisDay.getMonth()) &&
                    (this.startdate.getDate() === thisDay.getDate())
                )) {
                    link.setAttribute('aria-selected', true);
                }

                td.appendChild(link);

                tr.appendChild(td);
                cellCount++;
            }
            tbody.appendChild(tr);
        }
        calendar.appendChild(tbody);

        month.appendChild(calendar);

        this.monthbox.innerHTML = "";
        this.monthbox.appendChild(month);
    }

    /**
     * Select a date.
     * @param link the date with the link
     */
    select(link) {
        this.startdate = new Date(link.getAttribute('data-day'));
        if ((this.onselect) && (typeof this.onselect === 'function')) {
            this.onselect(link.getAttribute('data-day'));
        }
    }


    /* ACCESSOR METHODS_________________________________________________________________ */

    get basetime() { return this.config.basetime; }
    set basetime(basetime) { this.config.basetime = basetime; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get locale() { return this.config.locale; }
    set locale(locale) { this.config.locale = locale; }

    get monthbox() {
        if (!this._monthbox) { this.buildMonthBox(); }
        return this._monthbox;
    }
    set monthbox(monthbox) { this._monthbox = monthbox; }

    get months() { return this.config.months; }
    set months(months) { this.config.months = months; }

    get onselect() { return this.config.onselect; }
    set onselect(onselect) { this.config.onselect = onselect; }

    get startdate() { return this.config.startdate; }
    set startdate(startdate) { this.config.startdate = startdate; }

    get timeinput() { return this._timeinput; }
    set timeinput(timeinput) { this._timeinput = timeinput; }

    get timepicker() { return this.config.timepicker; }
    set timepicker(timepicker) { this.config.timepicker = timepicker; }

    get timezone() { return this.config.timezone; }
    set timezone(timezone) { this.config.timezone = timezone; }

    get weekdays() { return this.config.weekdays; }
    set weekdays(weekdays) { this.config.weekdays = weekdays; }

    get value() { return this.config.value; }
    set value(value) { this.config.value = value; }

}
window.DatePicker = DatePicker;