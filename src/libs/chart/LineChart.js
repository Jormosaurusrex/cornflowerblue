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
}
window.LineChart = LineChart;