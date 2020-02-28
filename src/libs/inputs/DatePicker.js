class DatePicker {

    static get DEFAULT_CONFIG() {
        return {
            dateicon: 'calendar',
            startdate: null,
            value: null,
            weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            onselect: null, // A function to be called on selection. Passed the date selected, as a string.
            classes: [] // Extra css classes to apply
        };
    }

    /**
     * Define a DataGrid
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, DatePicker.DEFAULT_CONFIG, config);
    }

    getMonthName(m) {
        return this.months[m];
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the full messagebox container
     */
    buildContainer() {
        this.container = document.createElement('div');
        this.container.classList.add('datepicker');
        for (let c of this.classes) {
            this.container.classList.add(c);
        }

        this.container.appendChild(this.monthbox);
    }

    buildMonthBox() {
        this.monthbox = document.createElement('div');
        this.monthbox.classList.add('monthbox');
        this.renderMonth(this.startdate); // initial
    }

    renderMonth(startDate) {
        const me = this;


        // XXX there has to be a better way to do this.

        let now = new Date();
        let today = new Date(`${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()} 12:00:00`);

        console.log(`startDate: ${startDate}`);
        console.log(`today: ${today}`);

        if (!startDate) {
            startDate = today;
        } else if (typeof startDate === 'string') {
            startDate = new Date(`${startDate} 12:00:00`);
        }

        let startDay = new Date(startDate.getFullYear(), startDate.getMonth()).getDay();
        //let daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 0).getDate();
        //console.log(`startDay: ${startDay}, daysInThisMonth: ${daysInMonth}`);

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
            action: function() {
                me.renderMonth(previousMonth);
            }
        });

        let nMonthButton = new SimpleButton({
            shape: 'square',
            mute: true,
            size: 'small',
            icon: 'triangle-right',
            action: function() {
                me.renderMonth(nextMonth);
            }
        });

        let mname = document.createElement('div');
        mname.classList.add('name');
        mname.innerHTML = `${this.getMonthName(startDate.getMonth())}, ${startDate.getFullYear()}`;

        header.appendChild(pMonthButton.button);
        header.appendChild(mname);
        header.appendChild(nMonthButton.button);

        month.appendChild(header);

        let calendar = document.createElement('table');
        calendar.classList.add('month');

        let thead = document.createElement('thead');
        let hr = document.createElement('tr');
        for (let weekday of this.weekdays) {
            let th = document.createElement('th');
            th.innerHTML = weekday.charAt(0);
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

                if ((cellCount >= startDay) && (dayOfMonth <= daysInMonth)) {
                    // startDay or into the future until the end of the month
                    link.innerHTML = dayOfMonth;
                    link.setAttribute('data-day', `${startDate.getFullYear()}-${(startDate.getMonth() + 1)}-${dayOfMonth}`);
                    link.classList.add('cmonth');
                    thisDay = new Date(`${startDate.getFullYear()}-${startDate.getMonth()}-${dayOfMonth} 12:00:00`);
                    dayOfMonth++;
                } else if ((cellCount < startDay)) {
                    // before the startDay, so last month
                    link.innerHTML = dayOfPreviousMonth;
                    thisDay = new Date(`${previousMonth.getFullYear()}-${previousMonth.getMonth()}-${dayOfPreviousMonth} 12:00:00`);
                    link.setAttribute('data-day', `${previousMonth.getFullYear()}-${(previousMonth.getMonth()+ 1)}-${dayOfPreviousMonth}`);
                    dayOfPreviousMonth++;
                } else {
                    // after this month, so next month
                    thisDay = new Date(`${nextMonth.getFullYear()}-${nextMonth.getMonth()}-${dayOfNextMonth} 12:00:00`);
                    link.innerHTML = dayOfNextMonth;
                    link.setAttribute('data-day', `${nextMonth.getFullYear()}-${(nextMonth.getMonth() +1)}-${dayOfNextMonth}`);
                    dayOfNextMonth++;
                }

                link.addEventListener('click', function() {
                    me.select(link);
                });

                link.setAttribute('aria-label', link.getAttribute('data-day'));
                link.setAttribute('tabindex', 0);

                if (this.isBefore(thisDay, today)) {
                    link.classList.add('past');
                } else if (this.isAfter(thisDay, today)) {
                    link.classList.add('future');
                } else {
                    link.classList.add('today');
                }

                console.log(`startDate: ${startDate} :: thisDay: ${thisDay}`);

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

        month.append(calendar);

        this.monthbox.innerHTML = "";
        this.monthbox.appendChild(month);
    }

    isBefore(dayOne, dayTwo) {
        return new Date(dayOne) < new Date(dayTwo);
    }

    isAfter(dayOne, dayTwo) {
        return new Date(dayOne) > new Date(dayTwo);
    }

    select(link) {
        console.log(`select: ${link.getAttribute('data-day')}`);
        this.startdate = new Date(link.getAttribute('data-day'));
        if ((this.onselect) && (typeof this.onselect === 'function')) {
            this.onselect(link.getAttribute('data-day'));
        }
    }


    /* ACCESSOR METHODS_________________________________________________________________ */

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get dateicon() { return this.config.dateicon; }
    set dateicon(dateicon) { this.config.dateicon = dateicon; }

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

    get weekdays() { return this.config.weekdays; }
    set weekdays(weekdays) { this.config.weekdays = weekdays; }

    get value() { return this.config.value; }
    set value(value) { this.config.value = value; }


}