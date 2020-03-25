class LZSong extends BusinessObject {

    static get CONFIG() {
        return {
            identifier: 'id',
            source: 'demo/data/lz.json',
            fields: [
                {
                    name: "id",
                    label: "ID",
                    identifier: true,
                    readonly: true,
                    type: "number",
                    nodupe: true,
                    hidden: true,
                    description: "The unique ID for this song"
                },{
                    name: "track",
                    label: "Track",
                    type: "number",
                    nodupe: true,
                    filterable: true,
                    description: "The track number of the song.",
                    renderer: function(data) {
                        return `${data}.`;
                    }
                }, {
                    name: "image",
                    label: "Cover",
                    resize: true,
                    type: "imageurl",
                    description: "The album cover."
                }, {
                    name: "album",
                    label: "Album",
                    resize: true,
                    type: "string",
                    filterable: true,
                    description: "The album the song is on.",
                    classes: ['nowrap', 'italic']
                }, {
                    name: "released",
                    label: "Released",
                    filterable: true,
                    description: "The date the album was released.",
                    type: "date"
                }, {
                    name: "title",
                    label: "Title",
                    resize: true,
                    type: "string",
                    filterable: true,
                    description: "The title of the song.",
                    classes: ['nowrap', 'italic']
                }, {
                    name: "writers",
                    label: "Writers",
                    resize: true,
                    nodupe: true,
                    filterable: true,
                    type: "stringarray",
                    separator: " &middot; ",
                    description: "A list of the song's writers.",
                    classes: ['smaller']
                }, {
                    name: "label",
                    label: "Label",
                    filterable: true,
                    description: "The record label the album was released by.",
                    type: "enumeration",
                    values: [
                        { label: 'Atlantic', value: 'Atlantic', default: true },
                        { label: 'Swan Song', value: 'Swan Song', default: true }
                    ]
                }, {
                    name: "length",
                    label: "Length",
                    nodupe: true,
                    description: "The time length of the song.",
                    type: "time"
                }
            ],
            sortfunction: function(a, b) {
                if (a.title > b.title) { return 1 }
                if (a.title < b.title) { return -1 }
                return 0;
            }
        };
    }

    static instance;

    constructor() {
        super();
        if (!LZSong.instance) {
            this.config = LZSong.CONFIG;
            LZSong.instance = this;
        }
        return LZSong.instance;
    }


}