class FloatingPanel extends Panel {

    static get DEFAULT_CONFIG() {
        return {
            style: 'plain',
            position: 'top-left'
        };
    }

    static get DOCUMENTATION() {
        return {
            position: { type: 'option', datatype: 'enumeration', description: "Position for the growler. Valid values: (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)" }
        };
    }

    constructor(config) {
        config = Object.assign({}, FloatingPanel.DEFAULT_CONFIG, config);
        if (config.classes) {
            config.classes.push('floating');
        } else {
            config.classes = ['floating'];
        }
        config.classes.push(config.position);
        config.classes.push(config.style);
        super(config);
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get position() { return this.config.position; }
    set position(position) { this.config.position = position; }

    get style() { return this.config.style; }
    set style(style) { this.config.style = style; }

}
window.FloatingPanel = FloatingPanel;