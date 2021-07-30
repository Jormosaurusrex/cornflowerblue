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

        this.svg.setAttribute("viewBox", `-${adj} -${adj} ${(this.width + (adj * 3))} ${(this.height + (adj * 3))}`);

        this.d3svg = d3.select(`svg#${this.svgId}`);

        const timeConv = d3.timeFormat("%d-%b");
        const timeFormat = d3.timeFormat("%d-%b-%Y");
        //const dataset = d3.csv("data.csv");

        for (let d of this.data) {
            //console.log(timeConv);
            d.date = new Date(d.create_date);
        }

        // XXX if time/number
        const yScale = d3.scaleLinear().rangeRound([this.height, 0]);
        const xScale = d3.scaleTime().range([0,this.width]);

        yScale.domain(d3.extent(this.data, (d) =>{
            return d.total_session_count
        }));

        xScale.domain(d3.extent(this.data, (d) =>{
            console.log(d.date);
            console.log(timeConv(d.date));
            return timeConv(d.date)
        }));


        const xaxis = d3.axisBottom()
            .ticks(this.data.length)
            .tickFormat(d3.timeFormat('%b %d'))
            .scale(xScale);

        console.log(this.data);
        const yaxis = d3.axisLeft()
            .ticks(this.data.length)
            .scale(yScale);




        this.d3svg.append("g")
            .attr("class", "axis")
            .call(yaxis);


        this.d3svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${this.height})`)
            .call(xaxis);


    }

    compile2() {
        // This is mostly to create data portability
        this.d3svg = d3.select(`svg#${this.svgId}`);

        this.d3margin = {top: 20, right: 20, bottom: 30, left: 40};
        this.d3width = + this.d3svg.attr("width") - this.d3margin.left - this.d3margin.right;
        this.d3height = + this.d3svg.attr("height") - this.d3margin.top - this.d3margin.bottom;

// The number of datapoints
        let n = this.data.length;

// 5. X scale will use the index of our data
        let xScale = d3.scaleLinear()
            .domain([0, n-1]) // input
            .range([0, this.width]); // output

// 6. Y scale will use the randomly generate number
        let yScale = d3.scaleLinear()
            .domain([0, 1]) // input
            .range([this.height, 0]); // output

        console.log(this.data);
// 7. d3's line generator
        let line = d3.line()
            .x((d, i) => { return xScale(i); }) // set the x values for the line generator
            .y((d) => { return yScale(d.y); }) // set the y values for the line generator
            .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
        this.dataset = d3.range(n).map((d) => { return {"y": d3.randomUniform(1)() } })



        //this.d3x = d3.scaleTime().rangeRound([0, this.d3width]).padding(0.1);
        //this.d3y = d3.scaleLinear().rangeRound([this.d3height, 0]);
        //this.d3g = this.d3svg.append("g");

        this.d3svg
            .append("g")
            .attr("transform", `translate(${this.d3margin.left}, ${this.d3margin.top})`);

// 3. Call the x axis in a group tag
        this.d3svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
        this.d3svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator
        this.d3svg.append("path")
            .datum(this.data) // 10. Binds data to the line
            .attr("class", "line") // Assign a class for styling
            .attr("d", line); // 11. Calls the line generator

// 12. Appends a circle for each datapoint
        this.d3svg.selectAll(".dot")
            .data(this.data)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", (d, i) => { return xScale(i) })
            .attr("cy", (d) => { return yScale(d.y) })
            .attr("r", 5)
            .on("mouseover", (a, b, c) => {
                console.log(a)
                this.attr('class', 'focus')
            })
            .on("mouseout", () => {  })
//       .on("mousemove", mousemove);

//   var focus = svg.append("g")
//       .attr("class", "focus")
//       .style("display", "none");

//   focus.append("circle")
//       .attr("r", 4.5);

//   focus.append("text")
//       .attr("x", 9)
//       .attr("dy", ".35em");

//   svg.append("rect")
//       .attr("class", "overlay")
//       .attr("width", width)
//       .attr("height", height)
//       .on("mouseover", function() { focus.style("display", null); })
//       .on("mouseout", function() { focus.style("display", "none"); })
//       .on("mousemove", mousemove);

//   function mousemove() {
//     var x0 = x.invert(d3.mouse(this)[0]),
//         i = bisectDate(data, x0, 1),
//         d0 = data[i - 1],
//         d1 = data[i],
//         d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//     focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
//     focus.select("text").text(d);
//   }
    }

    chart2() {
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

    /* ACCESSOR METHODS_________________________________________________________________ */

    get dataset() { return this._dataset; }
    set dataset(dataset) { this._dataset = dataset; }
}
window.LineChart = LineChart;