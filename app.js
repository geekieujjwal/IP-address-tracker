const input = document.getElementById("search-inp");
console.log(input.value);
const ipAddress = document.getElementById("ipAddress");
const locationID = document.getElementById("locationID");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");

const submitBtn = document.getElementById("submit-btn");

submitBtn.addEventListener("click", () => {
  fetchData();
});

input.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    submitBtn.click();
  }
});

async function fetchData() {
  const res = await fetch(
    `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_zKOUvpjkDepQYUqRTCwoJd3lKmPXM&ipAddress=${input.value}`
  );
  const data = await res.json();
  console.log(data);
  ipAddress.textContent = input.value;
  locationID.textContent = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
  timezone.textContent = data.location.timezone;
  isp.textContent = data.isp;
}

let map;

document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([0, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  // Add a marker for the user's location
  let userMarker = L.marker([0, 0]).addTo(map);

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
