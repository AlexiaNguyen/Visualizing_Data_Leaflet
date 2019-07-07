var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(magnitude) {
    return magnitude * 4;
};

var earthquakes = new L.LayerGroup();

d3.json(API_quakes, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

function Color(magnitude) {
    if (magnitude > 6) {
        return 'red'
    } else if (magnitude > 5) {
        return 'fuchsia'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'yellow'
    } else if (magnitude > 2) {
        return 'pink'
    } else if (magnitude > 1) {
        return 'aqua'
    } else {
        return 'blue'
    }
};

function createMap() {

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 14,
        id: 'mapbox.streets',
        accessToken: "pk.eyJ1IjoiYWxleGlhbmd1eWVuIiwiYSI6ImNqd2xjbzNibjAyZHg0YW1vNDd2ZnI5OXcifQ.CHbiJwSgTFdUxW2p44E1YA"
    });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 14,
        id: 'mapbox.satellite',
        accessToken: "pk.eyJ1IjoiYWxleGlhbmd1eWVuIiwiYSI6ImNqd2xjbzNibjAyZHg0YW1vNDd2ZnI5OXcifQ.CHbiJwSgTFdUxW2p44E1YA"
    });

    var baseLayers = {
        "Street": streetMap,
        "Satellite": satellite
    };

    var overlays = {
        "Earthquakes": earthquakes,
        };

    var mymap = L.map('mymap', {
        center: [40, -99],
        zoom: 3,
        layers: [streetMap, earthquakes]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);
    
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5, 6],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);
}

