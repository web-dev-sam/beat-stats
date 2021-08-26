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
  //console.log(twitch.configuration.broadcaster)
  if (twitch.configuration.broadcaster) {
    try {
      var config = JSON.parse(twitch.configuration.broadcaster.content)
      //console.log(typeof config)
      if (typeof config === "object") {
        options = config
        updateOptions()
      } else {
        console.log('invalid config')
      }
    } catch (e) {
      console.log('invalid config')
    }
  }
})


$(function () {

  // Get data from url
  fetch('https://new.scoresaber.com/api/player/76561198038084750/full').then(async response => {

    // Get the text from the response
    const data = await response.json();
    console.log(data);

    // Get the song name from the json data
    const pp = data.playerInfo.pp;

    // Display song name in html
    $(".boody").text(pp);
  })
});








