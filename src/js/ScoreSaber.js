

class ScoreSaber {


    constructor(scoresaberId) {
        this.scoresaberId = scoresaberId;
    }


    /**
     * Fetches the scoresaber user's data and statistics
     * @returns All the data of the user
     * @async
     */
    getPlayerData() {
        return new Promise((resolve, reject) => {

            // Get data from scoresaber
            fetch(`https://new.scoresaber.com/api/player/${this.scoresaberId}/full`).then(async response => {
                if (!response.ok) {
                    switch (response.status) {
                        case 404: reject("User doesn't exist!");
                        case 429: reject("Too many requests!");
                        case 422: reject("You should input your ScoreSaber Profile ID or URL!");
                    }
                    return;
                }

                const data = await response.json();

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
            fetch(`https://new.scoresaber.com/api/player/${this.scoresaberId}/scores/top/1`).then(async response => {
                if (!response.ok) {
                    switch (response.status) {
                        case 404: reject("User doesn't exist!");
                        case 429: reject("Too many requests!");
                        case 422: reject("You should input your ScoreSaber Profile ID or URL!");
                    }
                    return;
                }

                const data = await response.json();

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


    /**
     * Fetches the accsaber user's data and statistics https://api.accsaber.com/players/76561198436848521
     * @returns All the data of the user
     * @async
     */
    getPlayerData() {
        return new Promise((resolve, reject) => {

            // Get data from scoresaber
            fetch(`https://api.accsaber.com/players/${this.scoresaberId}`).then(async response => {
                if (!response.ok) {
                    switch (response.status) {
                        case 404: reject("AccSaber user doesn't exist!");
                        case 429: reject("Too many requests!");
                        case 422: reject("You should input your ScoreSaber Profile ID or URL!");
                    }
                    return;
                }

                const data = await response.json();

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
            fetch(`https://api.accsaber.com/players/${this.scoresaberId}/scores`).then(async response => {
                if (!response.ok) {
                    switch (response.status) {
                        case 404: reject("AccSaber user doesn't exist!");
                        case 429: reject("Too many requests!");
                        case 422: reject("You should input your ScoreSaber Profile ID or URL!");
                    }
                    return;
                }

                const data = await response.json();

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
