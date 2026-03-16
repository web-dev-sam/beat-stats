

class ScoreSaber {


    constructor(scoresaberId) {
        this.scoresaberId = scoresaberId;
        this.baseUrl = "https://scoresaber.com";
    }


    async _fetchJson(url, messages = {}) {
        return beatStatsFetchJson(url, messages);
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
            const messages = {
                404: "User doesn't exist!",
                429: "Too many requests!",
                422: "You should input your ScoreSaber Profile ID or URL!",
            };

            // ScoreSaber has had multiple score endpoints over time; try both.
            this._fetchJson(`${this.baseUrl}/api/player/${this.scoresaberId}/scores/top/1`, messages)
                .catch(() => this._fetchJson(`${this.baseUrl}/api/player/${this.scoresaberId}/scores?sort=top&page=1&limit=1`, messages))
                .then(data => {

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
        return beatStatsFetchJson(url, messages);
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

function beatStatsGetProxyBase() {
    if (typeof window === "undefined" || !window.location)
        return null;

    const explicit = (window.BEATSTATS_PROXY_BASE || "").trim();
    if (explicit)
        return explicit;

    // Local development: run `node tools/dev-proxy.mjs` (default port: 8787).
    const host = window.location.hostname;
    if (host === "127.0.0.1" || host === "localhost")
        return "http://127.0.0.1:8787";

    return null;
}

function beatStatsHasExplicitProxyBase() {
    if (typeof window === "undefined")
        return false;
    return (window.BEATSTATS_PROXY_BASE || "").trim().length > 0;
}

function beatStatsIsLocalDevHost() {
    if (typeof window === "undefined" || !window.location)
        return false;
    const host = window.location.hostname;
    return host === "127.0.0.1" || host === "localhost";
}

function beatStatsBuildProxyUrl(proxyBase, targetUrl) {
    const trimmed = proxyBase.replace(/\/+$/, "");
    return `${trimmed}/proxy?url=${encodeURIComponent(targetUrl)}`;
}

async function beatStatsFetchJson(url, messages = {}) {
    const proxyBase = beatStatsGetProxyBase();
    const hasExplicitProxy = beatStatsHasExplicitProxyBase();
    const isLocalDev = beatStatsIsLocalDevHost();

    // If we have a proxy configured (explicitly or via localhost default), prefer it
    // to avoid noisy browser CORS console errors.
    if (proxyBase) {
        const proxiedUrl = beatStatsBuildProxyUrl(proxyBase, url);
        let proxyResponse;
        try {
            proxyResponse = await fetch(proxiedUrl, { headers: { Accept: "application/json" } });
        } catch {
            // In local dev, a missing proxy is the common failure mode. Avoid falling
            // back to direct fetch, which will just hit CORS and spam the console.
            if (isLocalDev && !hasExplicitProxy) {
                throw new Error(
                    "ScoreSaber blocked this request (CORS). Start the dev proxy: `node tools/dev-proxy.mjs`."
                );
            }
            proxyResponse = null;
        }

        if (proxyResponse) {
            if (!proxyResponse.ok) {
                const errorMessage = messages[proxyResponse.status] || `Request failed (${proxyResponse.status})`;
                throw new Error(errorMessage);
            }
            return proxyResponse.json();
        }
    }

    let response;
    try {
        response = await fetch(url, { headers: { Accept: "application/json" } });
    } catch {
        throw new Error(
            "ScoreSaber blocked this request (CORS). Set window.BEATSTATS_PROXY_BASE to a proxy, or run `node tools/dev-proxy.mjs` for local dev."
        );
    }

    if (!response.ok) {
        const errorMessage = messages[response.status] || `Request failed (${response.status})`;
        throw new Error(errorMessage);
    }

    return response.json();
}
