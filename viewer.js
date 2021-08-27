var token, userId;
var options = [];

// so we don't have to write this out everytime #efficency
const twitch = window.Twitch.ext;


// callback called when context of an extension is fired 
twitch.onContext((context) => {
  //console.log(context);
});


// onAuthorized callback called each time JWT is fired
twitch.onAuthorized((auth) => {
  // save our credentials
  token = auth.token; //JWT passed to backend for authentication 
  userId = auth.userId; //opaque userID 

});

// when the config changes, update the panel! 
twitch.configuration.onChanged(function () {
  const config = JSON.parse(twitch.configuration.broadcaster.content)
  options = config

  // Get data from url
  fetch(`https://new.scoresaber.com/api/player/${options.scoresaber.match(/\d+/g)[0]}/full`).then(async response => {

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
})







