var options = []


// Start-Up:
hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged(() => {
	let broadcasterConfig = twitch.ext.configuration.broadcaster

  if (twitch.configuration.broadcaster) {
    console.log("Data", twitch.configuration.broadcaster);
		let [id] = parseConfigStr(broadcasterConfig, [null])
    console.log(id);
  } else {
    console.log("STUPID TWITCH");
  }

})






function doStuff(config) {

  // Get data from url
  fetch(`https://new.scoresaber.com/api/player/${config.scoresaber.match(/\d+/g)[0]}/full`).then(async response => {

    // Get the text from the response
    const data = await response.json();
    console.log(data);

    // Get the song name from the json data
    const pp = data.playerInfo.pp;
    const rank = data.playerInfo.rank;
    const crank = data.playerInfo.countryRank;
    const country = data.playerInfo.country;
    const avatar = data.playerInfo.avatar;
    const avgAcc = data.scoreStats.averageRankedAccuracy;


    // Display song name in html
    $("#name").text(data.playerInfo.playerName);
    $("#rank").text(rank);
  })
}