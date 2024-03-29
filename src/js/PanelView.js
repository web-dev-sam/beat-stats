

function buildGlobalRank(value) {
    return `
        <div>
            <span class="small">Global Rank</span><br>
            <img src="assets/globe.png">
            #<span class="fairly-big" id="rank">${value}</span>
        </div>
    `;
}


function buildLocalRank(value) {
    return `
        <div>
            <span class="small">Local Rank</span><br>
            <img id="flags" class="hover-hint">
            #<span class="fairly-big" id="countryRank">${value}</span>
        </div>
    `;
}


function buildPipi(value) {
    return `
        <div>
            <span class="small">PP</span><br>
            <span class="fairly-big" id="pp">${value}</span>
        </div>
    `;
}


function buildAvgAcc(value) {
    return `
        <div>
            <span class="small">Avg Acc</span><br>
            <span class="fairly-big" id="avgAcc">${value}</span>%
        </div>
    `;
}


function buildTotalPlays(value) {
    return `
        <div>
            <span class="small">Total Plays</span><br>
            <span class="fairly-big" id="totalPlayCount">${value}</span>
        </div>
    `;
}


function buildRankedPlays(value) {
    return `
        <div>
            <span class="small">Ranked Plays</span><br>
            <span class="fairly-big" id="rankedPlayCount">${value}</span>
        </div>
    `;
}


function buildTopPercentage(value) {
    const notice = "Based on all registered players at scoresaber.com (as of February 2022)";
    return `
        <div class="hover-hint" title="${notice}">
            <span class="small">Top Percentage</span><br>
            <span class="fairly-big" id="topPercentage">${value}</span>%
        </div>
    `;
}


function buildTopRankedPlay(value) {
    return `
        <div>
            <span class="small">Top PP Play</span><br>
            <span class="fairly-big" id="topRankedPlay">${value}</span>
        </div>
    `;
}


function buildTotalScore(value) {
    value = beautifyBigNumber(value);
    return `
        <div>
            <span class="small">Total Score</span><br>
            <span class="fairly-big" id="totalScore">${value}</span>
        </div>
    `;
}


function buildRankedScore(value) {
    value = beautifyBigNumber(value);
    return `
        <div>
            <span class="small">Ranked Score</span><br>
            <span class="fairly-big" id="rankedScore">${value}</span>
        </div>
    `;
}


function buildTopAp(value) {
    return `
        <div>
            <span class="small">Top AP Play</span><br>
            <span class="fairly-big" id="topAp">${value}</span>
        </div>
    `;
}


function buildAp(value) {
    return `
        <div>
            <span class="small">AP</span><br>
            <span class="fairly-big" id="ap">${value}</span>
        </div>
    `;
}


function buildAvgAccSaberAcc(value) {
    return `
        <div>
            <span class="small">Avg AccSaber Acc</span><br>
            <span class="fairly-big" id="avgAccSaberAcc">${value}</span>%
        </div>
    `;
}


function buildStats(values, settings) {
    const statsLabels = [
        "globalRank", "localRank", "pp", "topPercentage",
        "topRankedPlay", "avgAcc", "totalPlays", "rankedPlays",
        "totalScore", "rankedScore", "ap", "topApPlay", "avgAccSaberAcc",
    ];
    const statsLabelProperties = {
        globalRank: {
            fn: buildGlobalRank,
            visibility: values.globalRank,
        },
        localRank: {
            fn: buildLocalRank,
            visibility: values.localRank,
        },
        pp: {
            fn: buildPipi,
            visibility: values.pp,
        },
        topRankedPlay: {
            fn: buildTopRankedPlay,
            visibility: values.topRankedPlay,
        },
        topPercentage: {
            fn: buildTopPercentage,
            visibility: values.topPercentage,
        },
        avgAcc: {
            fn: buildAvgAcc,
            visibility: values.avgAcc,
        },
        totalPlays: {
            fn: buildTotalPlays,
            visibility: values.totalPlays,
        },
        rankedPlays: {
            fn: buildRankedPlays,
            visibility: values.rankedPlays,
        },
        totalScore: {
            fn: buildTotalScore,
            visibility: values.totalScore,
        },
        rankedScore: {
            fn: buildRankedScore,
            visibility: values.rankedScore,
        },
        ap: {
            fn: buildAp,
            visibility: values.ap,
        },
        topApPlay: {
            fn: buildTopAp,
            visibility: values.topApPlay,
        },
        avgAccSaberAcc: {
            fn: buildAvgAccSaberAcc,
            visibility: values.avgAccSaberAcc,
        },
    };
    let length = 0;
    for (const { visibility } of Object.values(statsLabelProperties)) {
        length += visibility ? 1 : 0;
    }

    let left = "";
    let right = "";
    let putLeft = true;
    for (const label of statsLabels) {
        const property = statsLabelProperties[label];
        if (!property.visibility)
            continue;

        if (putLeft) {
            left += property.fn(settings[label]);
        } else {
            right += property.fn(settings[label]);
        }
        putLeft = !putLeft;
    }

    if (length > 6) {
        document.querySelector("#name").style.display = "none";
        document.querySelector(".player-data").style.marginTop = "18px";
    }

    document.querySelector(`.player-data .left-column`).innerHTML = left;
    document.querySelector(`.player-data .right-column`).innerHTML = right;
}



hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged(async () => {

    const data = Configuration.get("broadcaster");
    //console.log(data);
    if (!data)
        return;

    // Get data and display everything
    const scoresaber = new ScoreSaber(data.scoresaberId);
    const accsaber = new AccSaber(data.scoresaberId);
    const playerData = await scoresaber.getPlayerData();

    let accPlayerData;
    try {
        accPlayerData = await accsaber.getPlayerData();
    } catch {
        accPlayerData = {
            ap: 0,
            averageAcc: 0,
        }
    }

    let accPlayerTopPlays;
    try {
        accPlayerTopPlays = await accsaber.getTopPlays();
    } catch {
        accPlayerTopPlays = [{
            ap: 0,
        }]
    }

    const scores = await scoresaber.getTopPlays();
    const topPlay = scores.scores[0].pp;

    buildStats(data, {
        globalRank: playerData.playerInfo.rank,
        localRank: playerData.playerInfo.countryRank,
        pp: playerData.playerInfo.pp + (data.scoresaberId === "76561198118364720" ? 3000 : 0), // ;)
        topPercentage: Math.ceil(playerData.playerInfo.rank * 10000 / 216000) / 100, // about 216000 registered players on the scoresaber.com leaderboard on 16.02.2022
        topRankedPlay: Math.ceil(topPlay * 100) / 100,
        avgAcc: Math.round(playerData.scoreStats.averageRankedAccuracy * 100) / 100,
        totalPlays: playerData.scoreStats.totalPlayCount,
        rankedPlays: playerData.scoreStats.rankedPlayCount,
        totalScore: playerData.scoreStats.totalScore,
        rankedScore: playerData.scoreStats.totalRankedScore,
        ap: Math.ceil(accPlayerData.ap * 100) / 100,
        topApPlay: Math.ceil((accPlayerTopPlays[0].ap || 0) * 100) / 100,
        avgAccSaberAcc: Math.round(accPlayerData.averageAcc * 10000) / 100,
    });

    document.querySelector("#name").innerText = playerData.playerInfo.playerName;
    const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    const flags = document.querySelector("#flags");
    flags.setAttribute("src", "https://countryflagsapi.com/png/" + playerData.playerInfo.country);
    flags.setAttribute("title", regionNames.of(playerData.playerInfo.country.toUpperCase()));
    document.querySelector(".sexy-blur").style.backdropFilter = `blur(${data.blur}px)`;
    const profilePic = document.querySelector("#profiePic");
    profilePic.style.backgroundImage = `url(https://new.scoresaber.com${playerData.playerInfo.avatar})`;
    profilePic.style.backgroundSize = "cover";
    profilePic.style.backgroundRepeat = "no-repeat";
    profilePic.style.backgroundPosition = "50% 50%";
    const name = document.querySelector("#name");
    name.href = `https://scoresaber.com/u/${data.scoresaberId}`;

})


/**
 * Calles when page is loaded
 */
function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState != 'loading')
                fn();
        });
    }
}


ready(() => {
    document.body.style.visibility = "visible";
});
