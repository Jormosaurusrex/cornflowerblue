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
        let adj = 30;

        this.svg.setAttribute("viewBox", `-${(adj * 2)} -${adj} ${(this.width + (adj * 3))} ${(this.height + (adj * 3))}`);

        this.d3svg = d3.select(`svg#${this.svgId}`)
            .style("padding", 0)
            .style("margin", 0);

        const timeConv = d3.timeFormat("%d-%b");
        const timeFormat = d3.timeFormat("%d-%b-%Y");
        //const dataset = d3.csv("data.csv");


        for (let d of this.data) {
            d.date = new Date(d.date);
        }

        // XXX if time/number
        const yScale = d3.scaleLinear().rangeRound([this.height, 0]);
        const xScale = d3.scaleTime().range([0, this.width]);

        yScale.domain(d3.extent(this.data, (d) =>{
            return d.value
        }));

        xScale.domain(d3.extent(this.data, (d) =>{
            return d.date;
        }));

        const yaxis = d3.axisLeft()
            .ticks(this.data.length)
            .scale(yScale);

        const xaxis = d3.axisBottom()
            .ticks(this.data.length)
            .scale(xScale);

        const line = d3.line()
            .x((d) => {
                return xScale(d.date);
            })
            .y((d) => {
                return yScale(d.value);
            });

        this.d3svg.append("g")
            .attr("class", "axis")
            .call(yaxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("dy", ".75em")
            .attr("y", 6)
            .style("text-anchor", "end")
            .text("Total Session Count");

        this.d3svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${this.height})`)
            .call(xaxis);

        const lines = this.d3svg.selectAll("lines")
            .data([this.data])
            .enter()
            .append("g");

        lines.append("path")
            .attr("class", "chart-line")
            .attr("d", (d) => {
                return line(d);
            });

        const tooltip = d3.select("body").append("div")
            .attr("class", "d3tooltip")
            .style("opacity", 0)
            .style("position", "absolute");

        lines.selectAll("points")
            .data((d) => {
                return d;
            })
            .enter()
            .append("circle")
            .attr("class", "pointmarker")
            .attr("cx", (d) => {
                return xScale(d.date);
            })
            .attr("cy", (d) => {
                return yScale(d.value);
            })
            .attr("r", 3)
            .attr("class","point")
            .style("opacity", 1);

        lines.selectAll("circles")
            .data((d) => { return(d); } )
            .enter()
            .append("circle")
            .attr("class", "pointhover")
            .attr("cx", (d) => { return xScale(d.date); })
            .attr("cy", (d) => { return yScale(d.value); })
            .attr('r', 10)
            .style("opacity", 0)
            .on('mouseover', function (e, d) { // can't use inline this syntax
                tooltip.transition()
                    .delay(30)
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(d.value)
                    .style("left", (e.pageX + 25) + "px")
                    .style("top", (e.pageY) + "px");
                //add this
                const selection = d3.select(this).raise();
                selection
                    .transition()
                    .delay("20")
                    .duration("200")
                    .style("opacity", 1);

            })
            .on("mouseout", function (e) {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);

                const selection = d3.select(this);

                selection
                    .transition()
                    .delay("20")
                    .duration("200")
                    .attr("r", 10)
                    .style("opacity", 0);
            });

    }
    /* ACCESSOR METHODS_________________________________________________________________ */

    get dataset() { return this._dataset; }
    set dataset(dataset) { this._dataset = dataset; }
}
window.LineChart = LineChart;