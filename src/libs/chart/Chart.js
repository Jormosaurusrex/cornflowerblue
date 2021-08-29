class Chart {

    static get DEFAULT_CONFIG() {
        return {
            id: null,
            classes: [],
            label: null,
            source: null,
            width: 500,
            height: 500,
            data: [],
            svgId: null,
            sourcetype: "application/json",
            sourcemethod: 'GET',
            charttype: 'bar',
            help: null
        };
    }

    constructor(config) {
        this.config = Object.assign({}, Chart.DEFAULT_CONFIG, config);
        if (!this.id) { this.id = `chart-${CFBUtils.getUniqueKey(5)}`; }
        if (!this.svgId) { this.svgId = `chart-${this.charttype}-${CFBUtils.getUniqueKey(5)}`; }
    }

    get sourcebody() {
        if (this.sourcemethod.toLowerCase() === 'get') { return null; }
        return JSON.stringify({
            id: this.id
        })
    }

    /* CORE METHODS_____________________________________________________________________ */

    compile() {
        // This is mostly to create data portability
        this.d3svg = d3.select(`svg#${this.svgId}`);

        this.d3margin = {top: 20, right: 20, bottom: 30, left: 40};

        this.d3width = + this.d3svg.attr("width") - this.d3margin.left - this.d3margin.right;
        this.d3height = + this.d3svg.attr("height") - this.d3margin.top - this.d3margin.bottom;

        this.d3x = d3.scaleBand().rangeRound([0, this.d3width]).padding(0.1);
        this.d3y = d3.scaleLinear().rangeRound([this.d3height, 0]);
        this.d3g = this.d3svg.append("g");

        this.d3g.attr("transform", `translate(${this.d3margin.left}, ${this.d3margin.top})`);

        this.chart();

    }

    chart() {
        this.d3x.domain(this.data.map((d) => { return d[this.xaxiskey]; }));
        this.d3y.domain([0, d3.max(this.data, (d) => { return d[this.yaxiskey]; })]);

        this.d3g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0, ${this.d3height})`)
            .call(d3.axisBottom(this.d3x));

        this.d3g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(this.d3y).ticks(10, "%"))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

        this.d3g.selectAll(".bar")
            .data(this.data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d) => { return this.d3x(d[this.xaxiskey]); })
            .attr("y", (d) => { return this.d3y(d[this.yaxiskey]); })
            .attr("width", this.d3x.bandwidth())
            .attr("height", (d) => { return this.d3height - this.d3y(d[this.yaxiskey]); });
    }

    load(callback) {
        fetch(this.source, {
            method: this.sourcemethod,
            headers: { 'Content-Type': this.sourcetype },
            body: this.sourcebody
        })
            .then(response => response.json())
            .then(data => {
                if ((callback) && (typeof callback === 'function')) {
                    callback(data);
                }
            })
            .catch(error => {
                console.error(error)
            });
    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the container
     */
    buildContainer() {

        this.container = document.createElement('div');
        this.container.classList.add('chart-container');


        /*
            These are constructed in rows; the middle row will hold many things.
            These rows aren't needed to be captured; they are variable in size.
            only centerdiv is guaranteed
         */
        let centerdiv = document.createElement('div');
        centerdiv.classList.add('c');

        if (this.label) {
            this.container.innerHTML = `<div class="toprow"><label>${this.label}</label></label>`;
        }

        if (this.yaxislabel) {
            let yaxisdiv = document.createElement('div');
            yaxisdiv.classList.add('yaxis');
            yaxisdiv.innerHTML = `<label>${this.yaxislabel}</label>`;
            centerdiv.appendChild(yaxisdiv);
        }

        centerdiv.appendChild(this.svg);
        this.container.appendChild(centerdiv);

        if (this.xaxislabel) {
            let xaxisdiv = document.createElement('div');
            xaxisdiv.classList.add('xaxis');
            xaxisdiv.innerHTML = `<label>${this.xaxislabel}</label>`;
            this.container.appendChild(xaxisdiv);
        }

        window.setTimeout(() => {
            if ((this.data) && (this.data.length > 0)) {
                this.compile();
            } else if (this.source) {
                this.load((results) => {
                    console.log('done loading');
                    if (results.data) {
                        this.data = results.data;
                    }
                    this.compile();
                });
            }
        }, 200);

    }

    buildSVG() {
        //this.svg = document.createElement('svg');
        this.svg = document.createElementNS('http://www.w3.org/2000/svg','svg');

        //this.svg.classList.add('chart', this.charttype);
        this.svg.setAttribute('id', this.svgId);
        this.svg.setAttribute('width', this.width);
        this.svg.setAttribute('height', this.height);
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}` );
        this.svg.setAttribute('preserveAspectRatio','xMinYMin');
    }

    /**
     * Builds the label
     */
    buildLabel() {
        if (!this.label) { return null; }
        this.labelobj = document.createElement('label');
        this.labelobj.setAttribute('for', this.id);
        this.labelobj.innerHTML = this.label;

        if (this.help) {
            this.helpicon = new HelpButton({ help: this.help });
            this.labelobj.appendChild(this.helpicon.button);
            this.labelobj.addEventListener('onmouseover', () => {
                this.helpicon.open();
            });
            this.labelobj.addEventListener('onmouseout', () => {
                this.helpicon.close();
            });
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return CFBUtils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get charttype() { return this.config.charttype; }
    set charttype(charttype) { this.config.charttype = charttype; }

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get d3g() { return this._d3g; }
    set d3g(d3g) { this._d3g = d3g; }

    get d3height() { return this._d3height; }
    set d3height(d3height) { this._d3height = d3height; }

    get d3margin() { return this._d3margin; }
    set d3margin(d3margin) { this._d3margin = d3margin; }

    get d3svg() { return this._d3svg; }
    set d3svg(d3svg) { this._d3svg = d3svg; }

    get d3width() { return this._d3width; }
    set d3width(d3width) { this._d3width = d3width; }

    get d3x() { return this._d3x; }
    set d3x(d3x) { this._d3x = d3x; }

    get d3y() { return this._d3y; }
    set d3y(d3y) { this._d3y = d3y; }

    get data() { return this.config.data; }
    set data(data) { this.config.data; }

    get height() { return this.config.height; }
    set height(height) { this.config.height = height; }

    get help() { return this.config.help; }
    set help(help) { this.config.help = help; }

    get helpicon() { return this._helpicon; }
    set helpicon(helpicon) { this._helpicon = helpicon; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get label() { return this.config.label; }
    set label(label) { this.config.label = label; }

    get labelobj() {
        if (!this._labelobj) { this.buildLabel(); }
        return this._labelobj;
    }
    set labelobj(labelobj) { this._labelobj = labelobj; }

    get source() { return this.config.source; }
    set source(source) { this.config.source = source; }

    get sourcemethod() { return this.config.sourcemethod; }
    set sourcemethod(sourcemethod) { this.config.sourcemethod = sourcemethod; }

    get sourcetype() { return this.config.sourcetype; }
    set sourcetype(sourcetype) { this.config.sourcetype = sourcetype; }

    get svg() {
        if (!this._svg) { this.buildSVG(); }
        return this._svg;
    }
    set svg(svg) { this._svg = svg; }

    get svgId() { return this.config.svgId; }
    set svgId(svgId) { this.config.svgId = svgId; }

    get width() { return this.config.width; }
    set width(width) { this.config.width = width; }

    get xaxiskey() { return this.config.xaxiskey; }
    set xaxiskey(xaxiskey) { this.config.xaxiskey = xaxiskey; }

    get xaxislabel() { return this.config.xaxislabel; }
    set xaxislabel(xaxislabel) { this.config.xaxislabel = xaxislabel; }

    get yaxiskey() { return this.config.yaxiskey; }
    set yaxiskey(yaxiskey) { this.config.yaxiskey = yaxiskey; }

    get yaxislabel() { return this.config.yaxislabel; }
    set yaxislabel(yaxislabel) { this.config.yaxislabel = yaxislabel; }

}
window.Chart = Chart;