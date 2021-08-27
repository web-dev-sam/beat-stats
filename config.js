var options = []


document.getElementById('btn-scoresaber').addEventListener('click', evt => {
	twitch.ext.configuration.set(
		'broadcaster', "v1_scoreSaberId",
		[$(`[name="scoresaber"]`).val()].join('|')
	)
  
  console.log("twitch.ext.configuration.broadcaster should exist:", twitch.ext.configuration.broadcaster);
  document.getElementById('btn-scoresaber').style.display = 'none';
})


// Start-Up:
hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged(() => {
	let broadcasterConfig = twitch.ext.configuration.broadcaster

	if (broadcasterConfig) {
    console.log("Data", twitch.ext.configuration.broadcaster);
		let [id] = parseConfigStr(broadcasterConfig, [null])
	} else {
    console.log("TWITCH STUPID AND", $(`[name="scoresaber"]`).val());
  }
})
