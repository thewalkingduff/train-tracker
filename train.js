mapboxgl.accessToken = 'pk.eyJ1Ijoic2lsdmVyYmVycnl0cmVlIiwiYSI6ImNrbmFxbmN3ZDByeTAydW1sY2IwZXVsYm4ifQ.tF--7GCiOSJxan8h5s4uuA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/silverberrytree/cknts6q5n0c2s18nxp67p7ycm',
    center: ([-71.104081, 42.357575]),
    zoom: 11
});

async function run() {
    const locations = await getTrainLocations();

    locations.forEach((train) => {
        var marker = addMarker(train)
    });

    setTimeout(run, 15000);
    setTimeout(removeMarkers, 15000);
};

var markers = [];

function addMarker(train) {
    const longitude = train.attributes.longitude
    const latitude = train.attributes.latitude
    const routeID = train.relationships.route.data.id

    var marker = document.createElement('div');

    if (routeID === 'Red') {
        marker.className = 'red-train marker';
    } else if (routeID === 'Green-B' || routeID === 'Green-C' || routeID === 'Green-D' || routeID === 'Green-E') {
        marker.className = 'green-train marker'
    } else if (routeID === 'Orange') {
        marker.className = 'orange-train marker'
    } else if (routeID === 'Blue') {
        marker.className = 'blue-train marker';
    } else if (routeID.includes('CR-')) {
        marker.className = 'commuter-train marker';
    }

    new mapboxgl.Marker(marker)
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML('<h3>' + routeID + '</h3><p>' + train.attributes.current_status + '</p><p>' + 'Speed: ' + train.attributes.speed + ' mph' + '</p>'))
        .addTo(map)
    markers.push(marker);
};

function removeMarkers(marker) {
    markers.forEach(marker => {
        marker.remove()
    });
};

async function getTrainLocations() {
    const url = 'https://api-v3.mbta.com/vehicles';
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
};


run();

