/**
* In this land dwells the mighty Twitch API. The Twitch helper functions are... well, they are.
* And yes, they are pretty much just a bunch of functions. I'm not going to comment on them. I'm
* just going to use them. If you want to know more, check out the Twitch API documentation. I'm
* not going to be commenting on that either. I'm just going to use it. I guess.
*/



/**
* A bunch of functions to help dealing with the configuration service.
*/
class Configuration {


    // The structure of the configuration object.
    static STRUCTURE = {
        "broadcaster": {
            "version": "2",
            "data": {
                "scoresaberId": "",
                "bgPic": "",
                "globalRank": true,
                "localRank": true,
                "pp": true,
                "topPercentage": false,
                "topRankedPlay": false,
                "avgAcc": true,
                "totalPlays": true,
                "rankedPlays": true,
                "totalScore": true,
                "rankedScore": true,
                "blur": "5",
            },
        },
    };


    /**
     * Saves the configuration object to the specified segment.
     * @param {string} segment your configuration segment
     * @param {object} data your data to be stored
     * @public
     * @static
     */
    static set(segment, data) {
        twitch.ext.configuration.set(
            segment,
            Configuration.__getVersion(segment), 
            JSON.stringify(data)
        );
    }


    /**
     * Gets the configuration object from the specified segment.
     * @param {string} segment your configuration segment
     * @returns {object | undefined} your data
     * @public
     * @static
     */
    static get(segment) {
        const data = twitch.ext.configuration[segment];
        console.log(data);
        if (data && data.version === Configuration.__getVersion(segment)) {
            return JSON.parse(data.content);
        } else {
            console.log("Configuration Version Mismatch! Using Defaults...");
            Configuration.setDefaults(segment);
        }
    }


    /**
     * Sets the default configuration object for the specified segment.
     * @param {string} segment your configuration segment
     * @param {string} scoresaberId your scoresaber id
     * @public
     * @static
     */
    static setDefaults(segment, scoresaberId) {
        if (scoresaberId && demoDefaults[scoresaberId]) {
            console.log("defaults", Object.assign({}, Configuration.STRUCTURE[segment]["data"], demoDefaults[scoresaberId]))
            Configuration.set(segment, Object.assign({}, Configuration.STRUCTURE[segment]["data"], demoDefaults[scoresaberId]));
            return;
        }
        const config = Configuration.STRUCTURE[segment]["data"];
        config.scoresaberId = scoresaberId;
        Configuration.set(segment, config);
    }


    /**
     * Returns a version string of the configuration object.
     * @returns {string} the version string.
     * @private
     * @static
     */
    static __getVersion(segment) {
        return Configuration.STRUCTURE[segment]["version"] + window.btoa(JSON.stringify(Configuration.STRUCTURE[segment]["data"]));
    }

}