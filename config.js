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


// when the config changes, update the panel! 
twitch.configuration.onChanged(function () {
  
  if (twitch.configuration.broadcaster) {
    console.log("Data", twitch.configuration.broadcaster);
  } else {
    console.log("First Time setting up");
  }
  
})

// Function to save the streamer's WYR options  
$(function() {
  $("#btn-scoresaber").click(function(e){

    // Save data
    twitch.configuration.set("broadcaster", "1", 
      JSON.stringify({
        scoresaber: $(`[name="scoresaber"]`).val()
      })
    );

  })  
})
