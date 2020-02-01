class IconFactory {

    static get LIST() {
        return [
            'arrow-down-circle',
            'arrow-up',
            'download',
            'map',
            'arrow-right',
            'upload',
            'arrow-left',
            'arrow-down-circle-1',
            'calendar',
            'trashcan',
            'tag',
            'legend',
            'echx',
            'arrow-down',
            'check-circle-disc',
            'checkmark-circle',
            'chevron-down',
            'checkmark',
            'chevron-left',
            'chevron-right',
            'chevron-up',
            'double-triangle-vertical',
            'chat',
            'heart',
            'no',
            'double-triangle-horizontal',
            'arrow-left-circle',
            'echx-circle',
            'echx-1',
            'spinner-circle',
            'circle-disc-chopped',
            'circle',
            'disc-chopped',
            'gear-complex',
            'gear',
            'globe',
            'help-circle',
            'lightbulb',
            'lock-open',
            'magnify',
            'menu',
            'question',
            'star',
            'user-circle',
            'user',
            'exclaim',
            'shape-hex',
            'shape-rounded-triangle',
            'warn-circle',
            'warn-hex',
            'warn-triangle',
            'eye-slash',
            'microphone-slash',
            'minimize',
            'eye',
            'disc-check',
            'minus-circle',
            'minus',
            'popout',
            'plus',
            'plus-circle',
            'pencil',
            'pencil-circle',
            'refresh',
            'speaker-high',
            'speaker-low',
            'printer',
            'speaker-medium',
            'microphone',
            'speaker-mute',
            'lock-closed',
            'image',
            'folder',
            'document',
            'speaker-slash',
            'triangle-down-small',
            'triangle-down',
            'triangle-left-small',
            'triangle-left',
            'triangle-right-small',
            'triangle-up',
            'triangle-up-small',
            'triangle-right',
            'arrow-right-circle',
            'arrow-up-circle',
            'triangle-down-circle',
            'triangle-left-circle',
            'triangle-right-circle',
            'triangle-up-circle',
            'flag-notched',
            'flag-pointed',
            'flag-rectangle',
            'flag-notched-angle',
            'flag-pointed-angle',
            'flag-rectangle-angle'
        ];
    }


    /**
     * Gets an icon defined by cornflower blue
     * @param icon the icon id. This is stacked with the cfb prefix.
     * @param arialabel the aria label to use
     * @return {*}
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
     * @return a span DOM object
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
