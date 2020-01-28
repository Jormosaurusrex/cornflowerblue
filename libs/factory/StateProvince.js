class StateProvince {

    /**
     * A map of states in US and canada
     * @return {*} a dictionary
     */
    static get STATEMAP() {
        return {
            AL: { id: "AL", name: "Alabama", country: "US" },
            AK: { id: "AK", name: "Alaska", country: "US" },
            AZ: { id: "AZ", name: "Arizona", country: "US" },
            AR: { id: "AR", name: "Arkansas", country: "US" },
            CA: { id: "CA", name: "California", country: "US" },
            CO: { id: "CO", name: "Colorado", country: "US" },
            CT: { id: "CT", name: "Connecticut", country: "US" },
            DC: { id: "DC", name: "District of Columbia", country: "US", alt: ["Washington DC", "Washington D.C."] },
            DE: { id: "DE", name: "Delaware", country: "US" },
            FL: { id: "FL", name: "Florida", country: "US" },
            GA: { id: "GA", name: "Georgia", country: "US" },
            HI: { id: "HI", name: "Hawaii", country: "US" },
            ID: { id: "ID", name: "Idaho", country: "US" },
            IL: { id: "IL", name: "Illinois", country: "US" },
            IN: { id: "IN", name: "Indiana", country: "US" },
            IA: { id: "IA", name: "Iowa", country: "US" },
            KS: { id: "KS", name: "Kansas", country: "US" },
            KY: { id: "KY", name: "Kentucky", country: "US" },
            LA: { id: "LA", name: "Louisiana", country: "US" },
            ME: { id: "ME", name: "Maine", country: "US" },
            MD: { id: "MD", name: "Maryland", country: "US" },
            MA: { id: "MA", name: "Massachusetts", country: "US" },
            MI: { id: "MI", name: "Michigan", country: "US" },
            MN: { id: "MN", name: "Minnesota", country: "US" },
            MS: { id: "MS", name: "Mississippi", country: "US" },
            MO: { id: "MO", name: "Missouri", country: "US" },
            MT: { id: "MT", name: "Montana", country: "US" },
            NE: { id: "NE", name: "Nebraska", country: "US" },
            NV: { id: "NV", name: "Nevada", country: "US" },
            NH: { id: "NH", name: "New Hampshire", country: "US" },
            NJ: { id: "NJ", name: "New Jersey", country: "US" },
            NM: { id: "NM", name: "New Mexico", country: "US" },
            NY: { id: "NY", name: "New York", country: "US" },
            NC: { id: "NC", name: "North Carolina", country: "US" },
            ND: { id: "ND", name: "North Dakota", country: "US" },
            OH: { id: "OH", name: "Ohio", country: "US" },
            OK: { id: "OK", name: "Oklahoma", country: "US" },
            OR: { id: "OR", name: "Oregon", country: "US" },
            PA: { id: "PA", name: "Pennsylvania", country: "US" },
            RI: { id: "RI", name: "Rhode Island", country: "US" },
            SC: { id: "SC", name: "South Carolina", country: "US" },
            SD: { id: "SD", name: "South Dakota", country: "US" },
            TN: { id: "TN", name: "Tennessee", country: "US" },
            TX: { id: "TX", name: "Texas", country: "US" },
            UT: { id: "UT", name: "Utah", country: "US" },
            VT: { id: "VT", name: "Vermont", country: "US" },
            VA: { id: "VA", name: "Virginia", country: "US" },
            WA: { id: "WA", name: "Washington", country: "US" },
            WV: { id: "WV", name: "West Virginia", country: "US" },
            WI: { id: "WI", name: "Wisconsin", country: "US" },
            WY: { id: "WY", name: "Wyoming", country: "US" },
            AS: { id: "AS", name: "American Samoa", country: "US" },
            GU: { id: "GU", name: "Guam", country: "US" },
            MP: { id: "MP", name: "Northern Mariana Islands", country: "US" },
            PR: { id: "PR", name: "Puerto Rico", country: "US" },
            UM: { id: "UM", name: "United States Minor Outlying Islands", country: "US" },
            VI: { id: "VI", name: "Virgin Islands", country: "US" },

            AB: { id: "AB", name: "Alberta", country: "CA" },
            BC: { id: "BC", name: "British Columbia", country: "CA" },
            MB: { id: "MB", name: "Manitoba", country: "CA" },
            NB: { id: "NB", name: "New Brunswick", country: "CA" },
            NL: { id: "NL", name: "Newfoundland and Labrador", country: "CA", alt: ["Newfoundland","Labrador"] },
            NS: { id: "NS", name: "Nova Scotia", country: "CA" },
            NU: { id: "NU", name: "Nunavut", country: "CA" },
            NT: { id: "NT", name: "Northwest Territories", country: "CA" },
            ON: { id: "ON", name: "Ontario", country: "CA" },
            PE: { id: "PE", name: "Prince Edward Island", country: "CA" },
            QC: { id: "QC", name: "Quebec", country: "CA" },
            SK: { id: "SK", name: "Saskatchewan", country: "CA" },
            YT: { id: "YT", name: "Yukon", country: "CA" }
        };
    }

    /**
     * An array of United States states
     * @return {string[]}
     */
    static get US_STATES() {
        return ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "AS", "GU", "MP", "PR", "UM", "VI"];
    }

    /**
     * An array of Canadian states
     * @return {string[]}
     */
    static get CA_STATES() {
        return ["AB", "BC", "MB", "NB", "NL", "NS", "NU", "NT", "ON", "PE", "QC", "SK", "YT"];
    }

    /**
     * Get a specific state by the id
     * @param id the id to get
     * @return {*} the state definition, or null
     */
    static get(id) {
        return StateProvince.STATEMAP[id];
    }

    /**
     * Get a list of state dictionary elements.
     * @param filter Optional, either US or CA. If empty, returns all.
     * @return {Array} an array of state object definitions
     */
    static list(filter) {
        let list = [];
        if ((filter) && (filter.toLowerCase() === 'us')) {
            for (let s of StateProvince.US_STATES) {
                list.push(StateProvince.STATEMAP[s]);
            }
        } else if ((filter) && (filter.toLowerCase() === 'ca')) {
            for (let s of StateProvince.CA_STATES) {
                list.push(StateProvince.STATEMAP[s]);
            }
        } else {
            for (let s of StateProvince.US_STATES) {
                list.push(StateProvince.STATEMAP[s]);
            }
            for (let s of StateProvince.CA_STATES) {
                list.push(StateProvince.STATEMAP[s]);
            }
        }
        return list;
    }

    /**
     * Search the State dictionary
     * @param text the text to search on.
     */
    static search(text) {
        if ((!text) || (text.length() < 1)) { return []; }

        let results = [];

        for (let k of Object.keys(StateProvince.STATEMAP)) {
            let s = StateProvince.STATEMAP[k];
            if (text.toUpperCase() === k) { // if the code matches, just slot it.
                results.push(s);
            } else if (s.name.toUpperCase().indexOf(text.toUpperCase()) >= 0) {
                results.push(s);
            } else if ((s.alt) && (s.alt.length > 0)) {
                let found = false;
                for (let i of s.alt) {
                    if ((!found) && (i.toUpperCase().indexOf(text.toUpperCase()) >= 0)) {
                        results.push(s);
                    }
                }
            }
        }
        return results;
    }

}