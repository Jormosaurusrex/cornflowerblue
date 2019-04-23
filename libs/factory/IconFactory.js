"use strict";

class IconFactory {

    /**
     * Makes an icon object
     * @param icon the icon.  If passed an object, it returns exactly that object.
     *                        Otherwise, it constructs an icon <span /> using internal font glyphs
     * @param arialabel the aria-label value, if any. If null, sets aria-hidden to true
     * @returns {jQuery} a div element
     */
    static makeIcon(icon, arialabel) {
        if (icon instanceof Object) { // this is probably a pre-defined icon
            return icon;
        }
        let $i = $('<span />')
            .addClass('icon')
            .addClass("cfb-" + icon);
        if (arialabel) {
            $i.attr('aria-label', arialabel);
        } else {
            $i.attr('aria-hidden', true)
        }
        return $i;
    }
}
