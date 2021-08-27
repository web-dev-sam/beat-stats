var token, userId;
var options = []

// so we don't have to write this out everytime 
const twitch = window.Twitch.ext;

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


// when the config changes, save the new changes! 
twitch.configuration.onChanged(function(){
  
  console.log("HI", twitch.configuration.broadcaster);

  if (twitch.configuration.broadcaster.content) {
    //options = JSON.parse(twitch.configuration.broadcaster.content);
    //$(`[name="scoresaber"]`).val(options.scoresaber);
  }

})

function updateConfig() {
  //twitch.configuration.set("broadcaster", "1", JSON.stringify(options))
}

// Function to save the streamer's WYR options  
$(function(){
  $("#btn-scoresaber").click(function(e){
    options = {
			scoresaber: $(`[name="scoresaber"]`).val()
		}

		updateConfig()
    e.preventDefault()
  })  
})
