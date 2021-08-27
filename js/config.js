let saved = false;

// #region When you click on save button
$("#btn-save").on("click", _ => {
  if (saved) return;

  $("#btn-save").html(`Saving...`);
  saved = true;
  saveEverything();
  
  // Wait a little bit before allowing to save settings again
  setTimeout(() => {
    $("#btn-save").html("Save");
    saved = false;
  }, 1000);
})

function saveEverything() {

  // Get the data
  const scoresaberId = $(`[name="scoresaber"]`).val();
  const backgroundPic = $(`[name="background-pic"]`).val();
  
  // Save the settings
	twitch.ext.configuration.set('broadcaster', "v1_scoreSaberId_bgpic", [
    scoresaberId,
    backgroundPic
  ].join('|'));
}
// #endregion


hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged(_ => {
  let broadcasterConfig = twitch.ext.configuration.broadcaster

	if (broadcasterConfig) {
		const [scoresaberUrl, backgroundPic] = parseConfigStr(broadcasterConfig, [null, null]);
    console.log("pls twitch work", scoresaberUrl, backgroundPic)

    if (scoresaberUrl) {
      const scoresaberId = scoresaberUrl.match(/\d+/g)[0];
      $(`[name="scoresaber"]`).val(scoresaberId);
    }

    if (backgroundPic) {
      $(`[name="background-pic"]`).val(backgroundPic);
    }
	}
})
