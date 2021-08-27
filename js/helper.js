
const twitch = window.Twitch;

// #region Stupid Twitch API
function parseConfigStr(config, fallbackValues) {
    if (!config) {
        return fallbackValues
    }

    let configStr = config.content
    let valueCount = (configStr.match(/\|/g) || []).length + 1

    if (fallbackValues.length === valueCount) {
        return configStr.split('|')
    } else {
        return fallbackValues
    }
}

function hookOnGlobalConfigChanged(callback = null) {
    twitch.ext.configuration.onChanged(() => {
        callback();
    })
}


function hookOnAuthorized(callback = null) {
    twitch.ext.onAuthorized((userDetails) => {
        if (callback) {
            callback(userDetails)
        }
    })
}


function hookOnContextChanged(callback = null) {
    twitch.ext.onContext((context, changedKeys) => {
        if (callback) {
            callback(context, changedKeys)
        }
    })
}
// #endregion


// #region ScoreSaber API
async function getScoreSaberData(scoresaberId) {

    // Get data from scoresaber
    const response = await fetch(`https://new.scoresaber.com/api/player/${scoresaberId}/full`)
    const data = await response.json();

    // Return the data
    console.log(data);
    return {
        playerName: data.playerInfo.playerName,
        pp: data.playerInfo.pp,
        rank: data.playerInfo.rank,
        countryRank: data.playerInfo.countryRank,
        country: data.playerInfo.country,
        avatar: data.playerInfo.avatar,
        avgAcc: data.scoreStats.averageRankedAccuracy,
        rankedPlayCount: data.scoreStats.rankedPlayCount,
        totalPlayCount: data.scoreStats.totalPlayCount,
    }
}
// #endregion