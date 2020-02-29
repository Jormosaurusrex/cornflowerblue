class FloatingPanel extends Accordion {

    static get DEFAULT_CONFIG() {
        return {
            style: 'plain', // Various styles that can be applied to the panel.
                            // - 'plain': simple, spartan, solid.
                            // - 'ghost': similar to 'plain' except that it turns
                            //            translucent when not in focus or hover
                            // - 'invisible: panel behaves as normal but the background is transparent
            position: 'top-left' // Position for the panel. Valid values:
                                 // (top-center|bottom-center|top-right|bottom-right|bottom-left|top-left)
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