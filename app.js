// Get references to HTML elements
const input = document.getElementById("search-inp");
const ipAddress = document.getElementById("ipAddress");
const locationID = document.getElementById("locationID");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const submitBtn = document.getElementById("submit-btn");
const locationDetails = document.querySelector(".location-details");

let map, userMarker, myIcon;

// Wait for the DOM content to be loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  //Hide the location details unless IP Address given
  locationDetails.classList.add("hide");

  // Initialize the Leaflet map
  map = L.map("map").setView([0, 0], 10);

  // Add OpenStreetMap tiles to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  //Changing the location icon
  myIcon = L.icon({
    iconUrl: "/images/icon-location.svg",
    iconSize: [25, 35],
  });

  // L.marker([0, 0], { icon: myIcon }).addTo(map);

  // Add a marker for the user's location
  userMarker = L.marker([0, 0], { icon: myIcon }).addTo(map);

  // Locate the user's current position
  map.locate({ setView: true, maxZoom: 16 });

  // Handle the location found event
  map.on("locationfound", (e) => {
    const { lat, lng } = e.latlng;
    userMarker.setLatLng([lat, lng]);
    // userMarker.bindPopup("You are here").openPopup();
  });

  // Handle the location error event
  map.on("locationerror", (e) => {
    console.log(e.message);
    alert("Could not retrieve your location.");
  });
});

// Add click event listener to submit button
submitBtn.addEventListener("click", () => fetchData());

// Add keypress event listener to input
input.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    submitBtn.click();
  }
});

// Fetch data from IPify API
async function fetchData() {
  try {
    if (input.value) {
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_zKOUvpjkDepQYUqRTCwoJd3lKmPXM&ipAddress=${input.value}`
      );
      const data = await res.json();
      const { city, country, postalCode, timezone, lat, lng } = data.location;

      // Update displayed information
      ipAddress.textContent = input.value;
      locationID.textContent = `${city}, ${country} ${postalCode}`;
      timezone.textContent = timezone;
      isp.textContent = data.isp;
      //Making location details field visible
      locationDetails.classList.remove("hide");

      // Set map view to the searched location
      map.setView([lat, lng], 16);

      // Add a marker for the searched location
      userMarker = L.marker([data.location.lat, data.location.lng], {
        icon: myIcon,
      }).addTo(map);
      userMarker.bindPopup("You searched for this position");

      // Clear the input field
      input.value = "";
    } else {
      alert("Please input IP Address");
    }
  } catch (err) {
    console.log(err);
    alert("You entered the wrong IP Address or there was an error.");
  }
}
