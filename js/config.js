let saved = false;

// #region When you click on save button
$("#btn-scoresaber").on("click", _ => {
  if (saved) return;

  // Get the settings
  const scoresaberId = $(`[name="scoresaber"]`).val();

  // Save the settings
	twitch.ext.configuration.set('broadcaster', "v1_scoreSaberId", [
    scoresaberId
  ].join('|'));
  
  $("#btn-scoresaber").html(`Saving...`);
  saved = true;
  
  // Wait a little bit before allowing to save settings again
  setTimeout(() => {
    $("#btn-scoresaber").html("Use");
    saved = false;
  }, 1500);
})
// #endregion


hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged(_ => {
  let broadcasterConfig = twitch.ext.configuration.broadcaster

	if (broadcasterConfig) {
		const [scoresaberUrl] = parseConfigStr(broadcasterConfig, [null]);
    const scoresaberId = scoresaberUrl.match(/\d+/g)[0];
    $(`[name="scoresaber"]`).val(scoresaberId);
	}
})
