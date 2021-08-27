var options = []


document.getElementById('btn-scoresaber').addEventListener('click', evt => {
	twitch.ext.configuration.set(
		'broadcaster', "v1_scoreSaberId",
		[$(`[name="scoresaber"]`).val()].join('|')
	)
  document.getElementById('btn-scoresaber').style.display = 'none';
})


// Start-Up:
hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged((globalConf) => {
	let broadcasterConfig = twitch.ext.configuration.broadcaster

	if (broadcasterConfig) {
    console.log("Data", twitch.configuration.broadcaster);
		let [id] = parseConfigStr(broadcasterConfig, [null])
		
    console.log(id);
	}
  console.log("STUPID TWITCH");
})
