import L from "leaflet";
import "@elfalem/leaflet-curve";

import { AIRPORTS } from "./airports";

type LatLng = [number, number];

//const from: LatLng = [AIRPORTS["SKRG"].lat, AIRPORTS["SKRG"].lon];
//const to: LatLng = [AIRPORTS["KLGA"].lat, AIRPORTS["KLGA"].lon];

let smallMap = L.map("map", {
  zoom: 5,
  zoomControl: false,
});
smallMap.addEventListener("click", (e) => {
  hideSmallShowLarge();
});
let smallMapElement = document.getElementById("map") as HTMLDivElement;

function clearMaps() {}

function loadSmallMap(location: LatLng) {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(smallMap);

  smallMap.setView(location);

  L.marker(location).addTo(smallMap);

  smallMapElement.style.display = "block";

  //smallMap.remove
}

function hideSmallShowLarge() {
  smallMapElement.style.display = "none";
  (document.getElementById("map2") as HTMLDivElement).style.display = "block";
  //showLargerMap(from, to);
}

function showLargerMap(from: LatLng, to: LatLng) {
  //Calculate the zoom needed to fit the curve path
  var map2 = L.map("map2", {
    zoom: 3,
  }).setView(to);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map2);

  const fromMarker = L.marker(from).addTo(map2);
  const toMarker = L.marker(to).addTo(map2);

  const groupMarker = new L.FeatureGroup();
  groupMarker.addLayer(fromMarker);
  groupMarker.addLayer(toMarker);
  //groupMarker.addTo(map2);
  map2.fitBounds(groupMarker.getBounds());

  var offsetX = to[1] - from[1],
    offsetY = to[0] - from[0];

  var r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
    theta = Math.atan2(offsetY, offsetX);

  var thetaOffset = 3.14 / 10;

  var r2 = r / 2 / Math.cos(thetaOffset),
    theta2 = theta + thetaOffset;

  var midpointX = r2 * Math.cos(theta2) + from[1],
    midpointY = r2 * Math.sin(theta2) + from[0];

  var midpointLatLng: [number, number] = [midpointY, midpointX];

  L.curve(["M", from, "Q", midpointLatLng, to], {
    color: "blue",
  }).addTo(map2);
}

const form = document.getElementById("flightForm") as HTMLFormElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  clearMaps();

  const formData = new FormData(form);
  const from = formData.get("from") as string;
  const to = formData.get("to") as string;
  const date = formData.get("date") as string;
  const adults = formData.get("adults") as string;

  console.log(from, to, date, adults);

  if (!AIRPORTS[to]) {
    alert("Invalid destination");
    return;
  }

  loadSmallMap([AIRPORTS[to].lat, AIRPORTS[to].lon]);
});

//http://localhost:9000/flights?from=MED&to=JFK&date=2024-10-21&adults=2
