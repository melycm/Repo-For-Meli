let deferredPrompt;

if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then(function() {
        console.log('Service worker registered');
    })
    .catch(function(err){
        console.log(err);
    })
}

window.addEventListener('beforeinstallprompt', function(event){
    console.log("beforeinstallprompt fired");
    event.preventDefault();
    deferredPrompt = event;
    return false;
});

//function that gets the location and returns it
function getLocation() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showLocationResults);
    } else {
      console.log("Geo Location not supported by browser");
    }
  }
  //function that retrieves the position
  function showLocationResults(position) {
    let location = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    }

    let locationStr = location.latitude + "," + location.longitude;

    let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + locationStr + "&type=restaurant&rankby=distance&key=AIzaSyAJA6JffBOweCkHpcxHA18aOoA5aRXeMbY";
        
    $.get(url)
    .done(function(response) {
        updateUISuccess(response)
    })

    .fail(function(error){
        console.log("Google Places API failure");
        updateUIError()
    });

    function updateUISuccess(response){
        const restaurantNames = document.getElementById("restaurantInfo");
        let resultLength;

        if (response.results.length > 20){
            resultLength = 20;
        } else if (response.results.length <= 20){
            resultLength = response.results.length;
        }

        for (let i = 0; i < resultLength; i++){
            let restaurantFlex = document.createElement("div");
            let restaurantName = document.createElement("p");
            let restaurantRating = document.createElement("p");

            restaurantFlex.setAttribute("class", "restaurantFlex")
            restaurantRating.setAttribute("class", "restaurantPTags")
            restaurantName.setAttribute("class", "restaurantPTags")

            restaurantName.innerHTML = response.results[i].name;
            if (response.results[i].rating != undefined){
                restaurantRating.innerHTML = response.results[i].rating;
            } else if (response.results[i].rating === undefined){
                restaurantRating.innerHTML = "No Rating Yet"
            }

            if (i % 2){
                restaurantFlex.setAttribute("style", "background-color: #DEEBF3");
            }

            restaurantFlex.appendChild(restaurantName);
            restaurantFlex.appendChild(restaurantRating);
            restaurantNames.appendChild(restaurantFlex);
        }
    }
}
getLocation();

function locationError(error) {
switch(error.code) {
    case error.PERMISSION_DENIED:
        return "User denied the request for Geolocation."
        break;
    case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable."
        break;
    case error.TIMEOUT:
        return "The request to get user location timed out."
        break;
    case error.UNKNOWN_ERROR:
        return "An unknown error occurred."
        break;
    }
}