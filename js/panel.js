

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
      $("#rank").text(playerData.rank);
      $("#pp").text(playerData.pp);
    });

	}
})





