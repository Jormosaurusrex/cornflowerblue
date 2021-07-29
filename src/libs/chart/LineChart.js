class LineChart extends Chart {
    static get DEFAULT_CONFIG() {
        return {
            classes: ["linechart"]
        };
    }
    constructor(config) {
        config = Object.assign({}, LineChart.DEFAULT_CONFIG, config);
        super(config);
    }

    compile() {
        // This is mostly to create data portability
        this.d3svg = d3.select(`svg#${this.svgId}`);

        this.d3margin = {top: 20, right: 20, bottom: 30, left: 40};

        this.d3width = + this.d3svg.attr("width") - this.d3margin.left - this.d3margin.right;
        this.d3height = + this.d3svg.attr("height") - this.d3margin.top - this.d3margin.bottom;

        this.d3x = d3.scaleTime().rangeRound([0, this.d3width]).padding(0.1);
        this.d3y = d3.scaleLinear().rangeRound([this.d3height, 0]);
        this.d3g = this.d3svg.append("g");

        this.d3g.attr("transform", `translate(${this.d3margin.left}, ${this.d3margin.top})`);

        this.chart();

    }

    chart() {
        this.d3x.domain(this.data.map((d) => {
            return d3.timeParse("%Y-%m-%d")(d[this.xaxiskey]);
            // return d[this.xaxiskey];
        }));
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

        /*
        this.d3g.selectAll(".bar")
            .data(this.data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d) => { return this.d3x(d[this.xaxiskey]); })
            .attr("y", (d) => { return this.d3y(d[this.yaxiskey]); })
            .attr("width", this.d3x.bandwidth())
            .attr("height", (d) => { return this.d3height - this.d3y(d[this.yaxiskey]); });
        */
        this.d3svg.append("path")
            .datum(this.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x((d) => { return this.d3x(d[this.xaxiskey]) })
                .y((d) => { return this.d3y(d[this.yaxiskey]) })
            );

    }
}
window.LineChart = LineChart;