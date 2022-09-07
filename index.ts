/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// This example creates a simple polygon representing the Bermuda Triangle.

const getCounty = function (county) {
  let data = '';
  let countyCoordinates;
  fetch(
    'https://public.opendatasoft.com/api/records/1.0/search/?dataset=georef-united-states-of-america-county&q=&sort=year&facet=coty_name&refine.coty_name=' + county
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      data = myJson;
      if(data.records.length > 0){
        countyCoordinates = data['records'][0].fields.geo_shape.coordinates[0];
        countyCoordinates = countyCoordinates.map((x) => ({
          lng: x[0],
          lat: x[1],
        }));
        drawMap(countyCoordinates);
      }
      else
        drawMap(data.records);
      
    });
};

const getState = function (state) {
  let data;
  let stateCoordinates;
  console.log(state);

  fetch(
    'https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-state-boundaries&q=&facet=name&refine.name=' + state
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      data = myJson;
      console.log(data);
      stateCoordinates = data['records'][0].fields.st_asgeojson.coordinates[0];
      stateCoordinates = stateCoordinates.map((x) => ({lng: x[0], lat: x[1]}));
      drawMap(stateCoordinates);
    });

}

const drawMap = function (data = null) {
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 5,
      center: { lat: 24.886, lng: -70.268 },
      mapTypeId: 'terrain',
    }
  );

  // Define the LatLng coordinates for the polygon's path.
  const triangleCoords = [
    { lat: 25.774, lng: -80.19 },
    { lat: 18.466, lng: -66.118 },
    { lat: 32.321, lng: -64.757 },
    { lat: 25.774, lng: -80.19 },
  ];

  // Construct the polygon.
  const bermudaTriangle = new google.maps.Polygon({
    paths: data,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
  });
  bermudaTriangle.setMap(map);
  
};

function initMap(): void {
  let userSearch = 'Greene';
  let states = ['Alaska', 'Texas', 'New york', 'Alabama', 'California', 'Delaware'];
  let counties = ['Bibb', 'Greene', 'St. Clair', 'Cleveland', 'Southeast Fairbanks', 'Adams']
  let state = states.find(x=> x.toLowerCase() == userSearch.toLowerCase());

  if(state != null){
    getState(state);
  }
  else{
    getCounty(userSearch);
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
