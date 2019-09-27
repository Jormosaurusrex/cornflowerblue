"use strict";

class IconFactory {

    /**
     * Gets an icon defined by cornflower blue
     * @param icon the icon id. This is stacked with the cfb prefix.
     * @param arialabel the aria label to use
     * @return {*|jQuery|*} a jquery <span> class.
     */
    static icon(icon, arialabel) {
        if (icon instanceof Object) { // this is probably a pre-defined icon
            return icon;
        }
        let i = document.createElement('span');
        i.classList.add('icon');
        i.classList.add(`cfb-${icon}`);
        if (arialabel) {
            i.setAttribute('aria-label', arialabel);
        } else {
            i.setAttribute('aria-hidden', "true");
        }
        return i;
    }

    /**
     * Gets an icon NOT defined by cornflower blue (like fontawesome, or a different icon font)
     * @param icon the icon.  This can be an array as well, and if so will apply all elements as classes
     * @param arialabel the aria label to use
     * @return {*|jQuery|*} a jquery <span> class.
     */
    static xicon(icon, arialabel) {
        if (icon instanceof Object) { // this is probably a pre-defined icon
            return icon;
        }
        let i = document.createElement('span');
        i.classList.add('icon');

        if (Array.isArray(icon)) {
            for (let c of icon) {
                i.classList.add(c);
            }
        } else {
            i.classList.add(icon);
        }

        if (arialabel) {
            i.setAttribute('aria-label', arialabel);
        } else {
            i.setAttribute('aria-hidden', "true");
        }
        return i;
    }
}
