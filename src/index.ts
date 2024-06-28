import L from "leaflet";
import "@elfalem/leaflet-curve";

import { AIRPORTS } from "./airports";

type LatLng = [number, number];

const from: LatLng = [AIRPORTS["SKRG"].lat, AIRPORTS["SKRG"].lon];
const to: LatLng = [AIRPORTS["KLGA"].lat, AIRPORTS["KLGA"].lon];

function loadSmallMap(location: LatLng) {
  var map1 = L.map("map", {
    zoom: 5,
    zoomControl: false,
  }).setView(location);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map1);

  map1.addEventListener("click", (e) => {
    hideSmallShowLarge();
  });

  L.marker(location).addTo(map1);
}

function hideSmallShowLarge() {
  (document.getElementById("map") as HTMLDivElement).style.display = "none";
  (document.getElementById("map2") as HTMLDivElement).style.display = "block";
  showLargerMap(from, to);
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

loadSmallMap(to);
