"use strict";

class NumberInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            pattern:'[0-9.%+-]$',
            minnumber: null,
            maxnumber: null,
            wholenumbers: false, // Require whole numbers
            steppers: true,
            step: null
        };
    }

    /**
     * Define the object
     * @param config a dictionary object
     */
    constructor(config) {
        config = Object.assign({}, NumberInput.DEFAULT_CONFIG, config);

        /*
         * Number inputs have a startlingly complicated set of configuration
         */
        if (config.step) {
            if (isNaN(config.step)) {
                console.error(`step is defined as ${config.step} but is not a number. Deleting.`);
                delete config.step;
            } else if (Number(config.step) <= 0) {
                console.error(`step cannot be a negative number. Deleting.`);
                delete config.step;
            } else {
                config.step = Number(config.step);
            }
        }
        if (config.maxnumber) {
            if (isNaN(config.maxnumber)) {
                console.error(`maxnumber is defined as ${config.maxnumber} but is not a number. Deleting.`);
                delete config.maxnumber;
            } else {
                config.maxnumber = Number(config.maxnumber);
            }
        }
        if (config.minnumber) {
            if (isNaN(config.minnumber)) {
                console.error(`minnumber is defined as ${config.minnumber} but is not a number. Deleting.`);
                delete config.maxnumber;
            } else {
                config.minnumber = Number(config.minnumber);
            }
        }

        // Have to take over any keydowns in order to overload the arrow keys.
        if (config.onkeydown) {
            config.origkeydown = config.onkeydown;
        }
        config.onkeydown = function(e, self) {
            if (e.keyCode === 38) { // up arrow
                e.preventDefault();
                e.stopPropagation();
                self.increment();
            } else if (e.keyCode === 40) { // down arrow
                e.preventDefault();
                e.stopPropagation();
                self.decrement();
            }
            if ((self.origkeydown) && (typeof self.origkeydown === 'function')) {
                self.origkeydown(e, self);
            }
        };

        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    /**
     * Return inputmode
     * @override
     * @return {string}
     */
    get inputmode() { return "numeric"; }

    /**
     * Get the inputcontrol.  This returns stepbuttons.
     * @return {*}
     */
    get inputcontrol() { return this.stepbuttons; }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * The localized validator.  This one is for datatype dependent rules
     * @param onload If true, this validation fires on the loading. This is important to know because some invalidations aren't actually errors until the form is submitted.
     * @override
     */
    localValidator(onload) {
        if (this.value) {
            if (isNaN(this.value)) {
                this.errors.push("This is not a number.");
                return;
            }
            let v = Number(this.value);
            if ((this.minnumber !== 'undefined') && (v < this.minnumber)) {
                this.errors.push(`The minimum value for this field is '${this.minnumber}'.`);
            } else if ((this.maxnumber !== 'undefined') && (v > this.maxnumber)) {
                this.errors.push(`The maximum value for this field is '${this.maxnumber}'.`);
            } else if ((this.step) && (v % this.step !== 0)) {
                this.errors.push(`Values must be divisible by ${this.step}.`);
            } else if ((this.wholenumbers) && (v % 1 > 0)) {
                this.errors.push("Values must be whole numbers.");
            }
        }
    }

    /**
     * Calculate the placeholder
     * @override
     * @return {string|*}
     */
    calculatePlaceholder() {
        if (this.placeholder) { return this.placeholder; }
        let text = "Enter a number";
        if ((this.minnumber !== 'undefined') && (this.maxnumber !== 'undefined')) {
            text = `Enter a number between ${this.minnumber} and ${this.maxnumber}`;
        } else if (this.minnumber !== 'undefined') {
            text = `Enter a number larger than ${this.minnumber}`;
        } else if (this.maxnumber !== 'undefined') {
            text = `Enter a number smaller than ${this.maxnumber}`;
        }
        if (this.step) {
            text += ` (increments of ${this.step})`;
        }
        text += ".";
        return text;
    }

    /**
     * Increment the number
     * @param step the amount to increment by.
     */
    increment(step) {
        if ((!step) || (isNaN(step))) {
            step = 1;
        }
        let val = Number(this.value);
        if (!val) { val = 0; }
        if (!isNaN(val)) {
            val += step;
            if ((this.maxnumber !== 'undefined') && (val > this.maxnumber)) {
                val = this.maxnumber;
            }
            this.value = val;
        }
    }

    /**
     * Decrement the number
     * @param step the amount to decrement by
     */
    decrement(step) {
        if ((!step) || (isNaN(step))) {
            step = 1;
        }
        let val = Number(this.value);
        if (!val) { val = 0; }
        if (!isNaN(val)) {
            val -= step;
            if ((this.minnumber !== 'undefined') && (val < this.minnumber)) {
                val = this.minnumber;
            }
            this.value = val;
        }
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the steppers
     */
    buildSteppers() {
        const me = this;
        if (this.steppers) {
            this.upbtn = new SimpleButton({
                classes: ['naked'],
                icon: 'triangle-up',
                action: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.increment(me.step);
                }
            });
            this.downbtn = new SimpleButton({
                classes: ['naked'],
                icon: 'triangle-down',
                action: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.decrement(me.step);
                }
            });
            this.stepbuttons = $('<div />')
                .addClass('stepbuttons')
                .addClass('inputcontrol')
                .append(this.upbtn.button)
                .append(this.downbtn.button)
                .on('mousedown', function(event) {
                    event.preventDefault(); // Prevents focus shifting.
                });
        }
    }


    /* ACCESSOR METHODS_________________________________________________________________ */


    get downbtn() { return this._downbtn; }
    set downbtn(downbtn) { this._downbtn = downbtn; }

    get maxnumber() { return this.config.maxnumber; }
    set maxnumber(maxnumber) { this.config.maxnumber = maxnumber; }

    get minnumber() { return this.config.minnumber; }
    set minnumber(minnumber) { this.config.minnumber = minnumber; }

    get origkeydown() { return this.config.origkeydown; }
    set origkeydown(origkeydown) { this.config.origkeydown = origkeydown; }

    get step() { return this.config.step; }
    set step(step) { this.config.step = step; }

    get stepbuttons() {
        if (!this._stepbuttons) { this.buildSteppers(); }
        return this._stepbuttons;
    }
    set stepbuttons(stepbuttons) { this._stepbuttons = stepbuttons; }

    get steppers() { return this.config.steppers; }
    set steppers(steppers) { this.config.steppers = steppers; }

    get upbtn() { return this._upbtn; }
    set upbtn(upbtn) { this._upbtn = upbtn; }

    get wholenumbers() { return this.config.wholenumbers; }
    set wholenumbers(wholenumbers) { this.config.wholenumbers = wholenumbers; }

}

