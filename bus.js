mapboxgl.accessToken = 'pk.eyJ1Ijoic2lsdmVyYmVycnl0cmVlIiwiYSI6ImNrbmFxbmN3ZDByeTAydW1sY2IwZXVsYm4ifQ.tF--7GCiOSJxan8h5s4uuA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/silverberrytree/cknts6q5n0c2s18nxp67p7ycm',
    center: ([-71.104081, 42.357575]),
    zoom: 12
});


async function run() {
    const locations = await getBusLocations();

    locations.forEach((bus) => {
        var marker = addMarker(bus)
    });

    setTimeout(run, 15000);
    setTimeout(removeMarkers, 15000);
};

var markers = [];



function addMarker(bus) {
    const longitude = bus.attributes.longitude
    const latitude = bus.attributes.latitude
    const routeID = bus.relationships.route.data.id
    if (routeID.includes('CR-')) {
        console.log(bus)
    }


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
            .setHTML('<h3>' + routeID + '</h3><p>' + bus.attributes.current_status + '</p><p>' + 'Speed: ' + bus.attributes.speed + ' mph' + '</p>'))
        .addTo(map)
    markers.push(marker);
};

function removeMarkers(marker) {
    markers.forEach(marker => {
        marker.remove()
    });
};

async function getBusLocations() {
    const url = 'https://api-v3.mbta.com/vehicles';
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
};


run();

