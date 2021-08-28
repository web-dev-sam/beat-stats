

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

