

class ScoreSaber {


    constructor(scoresaberId) {
        this.scoresaberId = scoresaberId;
        this.baseUrl = "https://scoresaber.com";
    }


    async _fetchJson(url, messages = {}) {
        const response = await fetch(url);
        if (!response.ok) {
            const errorMessage = messages[response.status] || `Request failed (${response.status})`;
            throw new Error(errorMessage);
        }
        return response.json();
    }


    /**
     * Fetches the scoresaber user's data and statistics
     * @returns All the data of the user
     * @async
     */
    getPlayerData() {
        return new Promise((resolve, reject) => {

            // Get data from scoresaber
            this._fetchJson(`${this.baseUrl}/api/player/${this.scoresaberId}/full`, {
                404: "User doesn't exist!",
                429: "Too many requests!",
                422: "You should input your ScoreSaber Profile ID or URL!",
            }).then(data => {

                // Return the data
                console.log("Got data from ScoreSaber: ", data);
                resolve(data);
            }).catch(error => {

                // Return the error
                console.error("Error getting data from ScoreSaber: ", error);
                reject(error);
            });

        });
    }


    /**
     * Fetches the top pp maps of the user
     */
    getTopPlays() {
        return new Promise((resolve, reject) => {

            // Get data from scoresaber
            this._fetchJson(`${this.baseUrl}/api/player/${this.scoresaberId}/scores/top/1`, {
                404: "User doesn't exist!",
                429: "Too many requests!",
                422: "You should input your ScoreSaber Profile ID or URL!",
            }).then(data => {

                // Return the data
                console.log("Got data from ScoreSaber: ", data);
                resolve(data);
            }).catch(error => {

                // Return the error
                console.error("Error getting data from ScoreSaber: ", error);
                reject(error);
            });

        });
        
    }


}


class AccSaber {

    constructor(scoresaberId) {
        this.scoresaberId = scoresaberId;
    }


    async _fetchJson(url, messages = {}) {
        const response = await fetch(url);
        if (!response.ok) {
            const errorMessage = messages[response.status] || `Request failed (${response.status})`;
            throw new Error(errorMessage);
        }
        return response.json();
    }


    /**
     * Fetches the accsaber user's data and statistics https://api.accsaber.com/players/76561198436848521
     * @returns All the data of the user
     * @async
     */
    getPlayerData() {
        return new Promise((resolve, reject) => {

            // Get data from scoresaber
            this._fetchJson(`https://api.accsaber.com/players/${this.scoresaberId}`, {
                404: "AccSaber user doesn't exist!",
                429: "Too many requests!",
                422: "You should input your ScoreSaber Profile ID or URL!",
            }).then(data => {

                // Return the data
                console.log("Got data from AccSaber: ", data);
                resolve(data);
            }).catch(error => {

                // Return the error
                console.error("Error getting data from AccSaber: ", error);
                reject(error);
            });

        });
    }


    /**
     * Fetches the top ap maps of the user https://api.accsaber.com/players/76561198436848521/scores
     */
    getTopPlays() {
        return new Promise((resolve, reject) => {

            // Get data from scoresaber
            this._fetchJson(`https://api.accsaber.com/players/${this.scoresaberId}/scores`, {
                404: "AccSaber user doesn't exist!",
                429: "Too many requests!",
                422: "You should input your ScoreSaber Profile ID or URL!",
            }).then(data => {

                // Return the data
                console.log("Got data from AccSaber: ", data);
                resolve(data);
            }).catch(error => {

                // Return the error
                console.error("Error getting data from AccSaber: ", error);
                reject(error);
            });

        });
    }

}
