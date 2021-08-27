

hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged(() => {
	let broadcasterConfig = twitch.ext.configuration.broadcaster

	if (broadcasterConfig) {
		const [scoresaberUrl] = parseConfigStr(broadcasterConfig, [null]);
    const scoresaberId = scoresaberUrl.match(/\d+/g)[0];

    // Get data and display everything
    getScoreSaberData(scoresaberId).then(playerData => {
      $("#name").text(playerData.playerName);
      $("#country").text(playerData.country);
      $("#flags").attr("src", "https://www.countryflags.io/" + playerData.country + "/shiny/16.png")
      $("#profiePic").attr("src","https://new.scoresaber.com" + playerData.avatar);
      $("#rank").text(playerData.rank);
      $("#countryRank").text(playerData.countryRank);
      $("#pp").text(playerData.pp);
      $("#avgAcc").text( Math.round(playerData.avgAcc * 100) / 100);
      $("#rankedPlayCount").text(playerData.rankedPlayCount);
      $("#totalPlayCount").text(playerData.totalPlayCount);
    });

	}
})





