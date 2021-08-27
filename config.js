var token, userId;
var options = []

// onContext callback called when context of an extension is fired 
twitch.onContext((context) => {
  //console.log(context);
});


// onAuthorized callback called each time JWT is fired
twitch.onAuthorized((auth) => {
  // save our credentials
  token = auth.token; //JWT passed to backend for authentication 
  userId = auth.userId; //opaque userID 
});


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
