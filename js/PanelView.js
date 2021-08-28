

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
            <img id="flags">
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
    return `
        <div>
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
    return `
        <div>
            <span class="small">Total Score</span><br>
            <span class="fairly-big" id="totalScore">${value}</span>
        </div>
    `;
}


function buildRankedScore(value) {
    return `
        <div>
            <span class="small">Ranked Score</span><br>
            <span class="fairly-big" id="rankedScore">${value}</span>
        </div>
    `;
}


function buildStats(values, settings) {
    const statsLabels = [
        "globalRank", "localRank", "pp", "topPercentage",
        "topRankedPlay", "avgAcc", "totalPlays", "rankedPlays",
        "totalScore", "rankedScore"
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
        }
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
        $("#name").hide();
        $(".player-data").css("margin-top", "18px");
    }

    $(`.player-data .left-column`).html(left);
    $(`.player-data .right-column`).html(right);
}



hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged(async () => {

    const data = Configuration.get("broadcaster");
    console.log(data);
    if (!data)
        return;

    // Get data and display everything
    const scoresaber = new ScoreSaber(data.scoresaberId);
    const playerData = await scoresaber.getPlayerData();
    console.log(playerData)

    const scores = await scoresaber.getTopPlays();
    const topPlay = scores.scores[0].pp;
    
    buildStats(data, {
        globalRank:     playerData.playerInfo.rank,
        localRank:      playerData.playerInfo.countryRank,
        pp:             playerData.playerInfo.pp,
        topPercentage:  Math.ceil(playerData.playerInfo.rank * 10000 / 174000) / 100,
        topRankedPlay:  Math.ceil(topPlay * 100) / 100,
        avgAcc:         Math.round(playerData.scoreStats.averageRankedAccuracy * 100) / 100,
        totalPlays:     playerData.scoreStats.totalPlayCount,
        rankedPlays:    playerData.scoreStats.rankedPlayCount,
        totalScore:     playerData.scoreStats.totalScore,
        rankedScore:    playerData.scoreStats.totalRankedScore
    });

    $("#name").text(playerData.playerInfo.playerName);
    $("#flags").attr("src", "https://www.countryflags.io/" + playerData.playerInfo.country + "/shiny/16.png")
    $("#profiePic").css({
        "background-image": "url(" + (data.bgPic ? data.bgPic : "https://new.scoresaber.com" + playerData.playerInfo.avatar) + ")",
        "background-size": "cover",
        "background-repeat": "no-repeat",
        "background-position": "50% 50%",
    });
    $(".sexy-blur").css("backdrop-filter", `blur(${data.blur}px)`)

})


$(document).ready(() => {
    $(document.body).css("visibility", "visible");
});
