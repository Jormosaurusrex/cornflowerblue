class BarChart extends Chart {

    static get DEFAULT_CONFIG() {
        return {
            classes: ["barchart"]
        };
    }
    constructor(config) {
        config = Object.assign({}, BarChart.DEFAULT_CONFIG, config);
        super(config);
    }
}
window.BarChart = BarChart;
