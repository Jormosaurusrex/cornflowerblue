class NumberInput extends TextInput {

    static get DEFAULT_CONFIG() {
        return {
            type: 'text',
            pattern: '[0-9]*',
            forceconstraints: true,
            minnumber: null,
            maxnumber: null,
            downbuttonarialabel: TextFactory.get('decrement_number'),
            upbuttonarialabel: TextFactory.get('increment_number'),
            wholenumbers: false, // Require whole numbers
            steppers: true,
            step: 1
        };
    }

    static get DOCUMENTATION() {
        return {
            pattern: { type: 'option', datatype: 'string', description: "The input pattern used to force a valid number." },
            forceconstraints: { type: 'option', datatype: 'boolean', description: "If true, enforce that the value is a valid number." },
            minnumber: { type: 'option', datatype: 'number', description: "The minimum acceptable value." },
            maxnumber: { type: 'option', datatype: 'number', description: "The maximum acceptable value." },
            downbuttonarialabel: { type: 'option', datatype: 'string', description: "The aria-label text for the decrement button" },
            upbuttonarialabel: { type: 'option', datatype: 'string', description: "The aria-label text for the increment button" },
            wholenumbers: { type: 'option', datatype: 'boolean', description: "If true, require whole numbers" },
            steppers: { type: 'option', datatype: 'boolean', description: "If true, show increment and decrement buttons" },
            step: { type: 'option', datatype: 'number', description: "The value that the increment and decrement buttons change the value by" }
        };
    }

    constructor(config) {
        if (!config) { config = {}; }
        config = Object.assign({}, NumberInput.DEFAULT_CONFIG, config);

        /*
         * Number inputs have a startlingly complicated set of configuration
         */
        if (config.step) {
            if (isNaN(parseFloat(config.step))) {
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
            if (isNaN(parseFloat(config.maxnumber))) {
                console.error(`maxnumber is defined as ${config.maxnumber} but is not a number. Deleting.`);
                delete config.maxnumber;
            } else {
                config.maxnumber = Number(config.maxnumber);
            }
        }
        if (config.minnumber) {
            if (isNaN(parseFloat(config.minnumber))) {
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
        config.onkeydown = (e, self) => {
            switch (e.key) {
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
                case '.':
                case '*':
                case '%':
                case '$':
                case '-':
                case '!':
                case '#':
                case '+':
                case '=':
                case '>':
                case '<':
                case '?':
                case 'Backspace':
                case 'Delete':
                case 'Enter':
                case 'Tab':
                    // Nothing.  These are characters that could be conceivably used
                    break;
                case 'ArrowUp': // Up
                    e.preventDefault();
                    e.stopPropagation();
                    self.increment();
                    break;
                case 'ArrowDown': // Down
                    e.preventDefault();
                    e.stopPropagation();
                    self.decrement();
                    break;
                default:
                    if (self.forceconstraints) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;
            }

            if ((self.origkeydown) && (typeof self.origkeydown === 'function')) {
                self.origkeydown(e, self);
            }
        };
        super(config);
    }

    /* PSEUDO-GETTER METHODS____________________________________________________________ */

    get inputmode() { return "numeric"; }

    get inputcontrol() { return this.stepbuttons; }

    /* CORE METHODS_____________________________________________________________________ */

    localValidator(onload) {
        if (this.value) {
            if (isNaN(this.value)) {
                this.errors.push(TextFactory.get('numberinput-error-nan'));
                return;
            }
            let v = parseFloat(this.value);
            if ((this.minnumber) && (v < this.minnumber)) {
                this.errors.push(TextFactory.get('numberinput-error-minimum_value', this.minnumber));
            } else if ((this.maxnumber) && (v > this.maxnumber)) {
                this.errors.push(TextFactory.get('numberinput-error-maximum_value', this.maxnumber));
            } else if ((this.step) && (v % this.step !== 0)) {
                this.errors.push(TextFactory.get('numberinput-error-values_divisible', this.step));
            } else if ((this.wholenumbers) && (v % 1 > 0)) {
                this.errors.push(TextFactory.get('numberinput-error-must_be_whole_numbers'));
            }
        }
    }

    calculatePlaceholder() {
        let text = TextFactory.get('numberinput-placeholder-basic');
        if ((this.minnumber) && (this.maxnumber)) {
            text = TextFactory.get('numberinput-placeholder-between_x_y', this.minnumber, this.maxnumber);
        } else if (this.minnumber) {
            text = TextFactory.get('numberinput-placeholder-larger_than_x', this.minnumber);
        } else if (this.maxnumber) {
            text = TextFactory.get('numberinput-placeholder-smaller_than_y', this.maxnumber);
        }
        if ((this.step) && (this.step > 1)) {
            text += TextFactory.get('numberinput-placeholder-fragment_increments', this.step);
        }
        return text;
    }

    /**
     * Increment the number
     * @param step the amount to increment by.
     */
    increment(step = 1) {
        if ((!step) || (isNaN(step))) { step = 1; }
        let val = parseFloat(this.value);
        if (!val) { val = 0; }
        if (!isNaN(val)) {
            val += step;
            if ((this.maxnumber) && (val > this.maxnumber)) {
                val = this.maxnumber;
            }
            this.value = val;
        }
    }

    /**
     * Decrement the number
     * @param step the amount to decrement by
     */
    decrement(step=1) {
        if ((!step) || (isNaN(step))) { step = 1; }
        let val = parseFloat(this.value);
        if (!val) { val = 0; }
        if (!isNaN(val)) {
            val -= step;
            if ((this.maxnumber) && (val > this.maxnumber)) {
                val = this.maxnumber;
            }
            this.value = val;
        }

    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Build the steppers
     */
    buildSteppers() {

        if (this.steppers) {
            this.upbtn = new SimpleButton({
                classes: ['naked'],
                icon: 'triangle-up',
                arialabel: this.upbuttonarialabel,
                notab: true,
                action: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.increment(this.step);
                }
            });
            this.downbtn = new SimpleButton({
                classes: ['naked'],
                icon: 'triangle-down',
                arialabel: this.downbuttonarialabel,
                notab: true,
                action: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.decrement(this.step);
                }
            });
            this.stepbuttons = document.createElement('div');
            this.stepbuttons.classList.add('stepbuttons');
            this.stepbuttons.classList.add('inputcontrol');
            this.stepbuttons.appendChild(this.upbtn.button);
            this.stepbuttons.appendChild(this.downbtn.button);
            this.stepbuttons.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Prevents focus shifting.
            });
        }
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get downbtn() { return this._downbtn; }
    set downbtn(downbtn) { this._downbtn = downbtn; }

    get downbuttonarialabel() { return this.config.downbuttonarialabel; }
    set downbuttonarialabel(downbuttonarialabel) { this.config.downbuttonarialabel = downbuttonarialabel; }

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

    get upbuttonarialabel() { return this.config.upbuttonarialabel; }
    set upbuttonarialabel(upbuttonarialabel) { this.config.upbuttonarialabel = upbuttonarialabel; }

    get wholenumbers() { return this.config.wholenumbers; }
    set wholenumbers(wholenumbers) { this.config.wholenumbers = wholenumbers; }

}
window.NumberInput = NumberInput;