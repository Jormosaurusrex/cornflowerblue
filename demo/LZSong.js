class LZSong extends BusinessObject {

    static get CONFIG() {
        return {
            identifier: 'id',
            source: 'demo/data/lz.json',
            fields: [
                new GridField({
                    name: "id",
                    label: "ID",
                    identifier: true,
                    readonly: true,
                    type: "number",
                    nodupe: true,
                    hidden: true,
                    description: "The unique ID for this song"
                }),
                new GridField({
                    name: "track",
                    label: "Track",
                    type: "number",
                    nodupe: true,
                    filterable: true,
                    description: "The track number of the song.",
                    renderer: function(data) {
                        return document.createTextNode(`${data}.`);
                    }
                }),
                new GridField({
                    name: "image",
                    label: "Cover",
                    resize: true,
                    type: "imageurl",
                    lightbox: true,
                    description: "The album cover."
                }),
                new GridField({
                    name: "album",
                    label: "Album",
                    resize: true,
                    type: "string",
                    filterable: true,
                    description: "The album the song is on.",
                    classes: ['nowrap', 'italic']
                }),
                new GridField({
                    name: "released",
                    label: "Released",
                    filterable: true,
                    description: "The date the album was released.",
                    type: "date"
                }),
                new GridField({
                    name: "title",
                    label: "Title",
                    resize: true,
                    type: "string",
                    filterable: true,
                    description: "The title of the song.",
                    classes: ['nowrap', 'italic']
                }),
                new GridField({
                    name: "writers",
                    label: "Writers",
                    resize: true,
                    nodupe: true,
                    filterable: true,
                    type: "stringarray",
                    separator: " &middot; ",
                    description: "A list of the song's writers.",
                    classes: ['smaller']
                }),
                new GridField({
                    name: "label",
                    label: "Label",
                    filterable: true,
                    description: "The record label the album was released by.",
                    type: "enumeration",
                    values: [
                        { key: 'Atlantic', value: 'Atlantic', default: true },
                        { key: 'Swan Song', value: 'Swan Song', default: true }
                    ]
                }),
                new GridField({
                    name: "length",
                    label: "Length",
                    nodupe: true,
                    description: "The time length of the song.",
                    type: "time"
                })
            ],
            sortfunction: function(a, b) {
                if (a.title > b.title) { return 1 }
                if (a.title < b.title) { return -1 }
                return 0;
            }
        };
    }

    //static instance;

    constructor() {
        super();
        const me = this;
        if (!LZSong.instance) {
            this.config = Object.assign({}, this.config, LZSong.CONFIG);
            if ((this.cadence) && (this.cadence > 0)) {
                setInterval(function () {
                    me.update();
                }, this.cadence);
            }
            LZSong.instance = this;
        }
        return LZSong.instance;
    }

}

window.LZSong = LZSong;