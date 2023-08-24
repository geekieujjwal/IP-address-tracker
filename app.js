const input = document.getElementById("search-inp");
const ipAddress = document.getElementById("ipAddress");
const locationID = document.getElementById("locationID");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");

const submitBtn = document.getElementById("submit-btn");

let map, userMarker;

document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([0, 0], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  // Add a marker for the user's location
  userMarker = L.marker([0, 0]).addTo(map);

  // Locate the user's current position
  map.locate({ setView: true, maxZoom: 16 });

  // Handle the location found event
  map.on("locationfound", (e) => {
    const { lat, lng } = e.latlng;
    userMarker.setLatLng([lat, lng]);
    userMarker.bindPopup("You are here").openPopup();
  });

  // Handle the location error event
  map.on("locationerror", (e) => {
    console.log(e.message);
    alert("Could not retrieve your location.");
  });
});

//On click of submit button
submitBtn.addEventListener("click", () => {
  fetchData();
});

//On click of Enter on input
input.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    submitBtn.click();
  }
});

//Fetching
async function fetchData() {
  const res = await fetch(
    `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_zKOUvpjkDepQYUqRTCwoJd3lKmPXM&ipAddress=${input.value}`
  );
  const data = await res.json();
  ipAddress.textContent = input.value;
  locationID.textContent = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
  timezone.textContent = data.location.timezone;
  isp.textContent = data.isp;

  let latlng = L.latLng(data.location.lng, data.location.lng);

  map.setView([data.location.lat, data.location.lng], 16);

  userMarker = L.marker([data.location.lat, data.location.lng]).addTo(map);
  userMarker.bindPopup("You searched for this position");
}
