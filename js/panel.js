

hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged(() => {
	let broadcasterConfig = twitch.ext.configuration.broadcaster

	if (broadcasterConfig) {
		const [scoresaberUrl, bgPic] = parseConfigStr(broadcasterConfig, [null, null]);
    if (scoresaberUrl) {
      const scoresaberId = scoresaberUrl.match(/\d+/g)[0];

      // Get data and display everything
      getScoreSaberData(scoresaberId).then(playerData => {
        $("#name").text(playerData.playerName);
        $("#country").text(playerData.country);
        $("#flags").attr("src", "https://www.countryflags.io/" + playerData.country + "/shiny/16.png")
        $("#profiePic").css({
          "background-image": "url(" + (bgPic? bgPic : "https://new.scoresaber.com" + playerData.avatar) + ")",
          "background-size": "cover",
          "background-repeat": "no-repeat",
          "background-position": "50% 50%",
        });
        $("#rank").text(playerData.rank);
        $("#countryRank").text(playerData.countryRank);
        $("#pp").text(playerData.pp);
        $("#avgAcc").text( Math.round(playerData.avgAcc * 100) / 100);
        $("#rankedPlayCount").text(playerData.rankedPlayCount);
        $("#totalPlayCount").text(playerData.totalPlayCount);
      });
    }
	}
})


$(document).ready(() => {
  $(document.body).css("visibility", "visible");
});
