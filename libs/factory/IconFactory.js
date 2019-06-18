"use strict";

class IconFactory {

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
