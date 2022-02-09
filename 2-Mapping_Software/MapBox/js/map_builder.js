/* Created by Alex Canales
Date: 2022-02-09
*/

//Access token to load Mapbox into project
mapboxgl.accessToken = 'pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg';

//Used to create the map bounderies
const map_bounderies = [
    [-76.788, 44.107], // Southwest coordinates
    [-76.170, 44.520] // Northeast coordinates
];

//Create the mapbox map and set the center
//Zoom ranges from 0 to 20. Higher value will get you closer to map
const map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
    center: [-76.48098, 44.22976],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    antialias: true,
    maxBounds: map_bounderies
});


//Add the mapbox map controls like fullscreen mode and navigation search bar
function add_map_controls() {
    //Geocoder is used to specify the langauge. Examples include EN for english, ES for spanish
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        language: 'en',
        mapboxgl: mapboxgl
    });
    map.addControl(geocoder);

    // Add full screen controls to the map
    map.addControl(new mapboxgl.FullscreenControl());

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
}


//This function adds the Kingston city bounderies
function add_boundry_layer() {
    //Add the city bounderies layer
    map.addSource('Boundry', {
        'type': 'geojson',
        'data': 'http://127.0.0.1:5500/data/neighbourhoods.geojson',
    });

    // Add a new layer to visualize the bounderies.
    map.addLayer({
        'id': 'Boundry',
        'type': 'fill',
        'source': 'Boundry', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#0078d3', // blue color fill
            'fill-opacity': 0.3 //Set opacity of the polygon
        }
    });
    // Add a black outline around the polygon.
    map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'Boundry',
        'layout': {},
        'paint': {
            'line-color': '#ffffff',
            'line-width': 1
        }
    });
}


//This layer adds the buildings to the map
function add_building_layer() {
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
    ).id;
    // The 'building' layer in the Mapbox Streets
    // vector tileset contains building height data
    // from OpenStreetMap.
    map.addLayer(
        {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 5,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // Use an 'interpolate' expression to
                // add a smooth transition effect to
                // the buildings as the user zooms in.
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 1.0
            }
        },
        labelLayerId
    );
}


function add_road_layer() {
    //Create the roads under development layer
    map.addSource('Roads', {
        'type': 'geojson',
        'data': 'http://127.0.0.1:5500/data/capital-planning-lines.geojson'
    });
    map.addLayer({
        'id': 'Roads',
        'type': 'line',
        'source': 'Roads',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#de3030', //Specify road colour
            'line-width': 3 //Specify width of the road
        }
    });

}

function add_development_layer() {
    map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker', image);
            // Add a GeoJSON source with 2 points
            map.addSource('Developments', {
                'type': 'geojson',
                'data': 'http://127.0.0.1:5500/data/capital-planning-points.geojson'
            });
            map.addLayer({
                'id': 'Developments',
                'type': 'symbol',
                'source': 'Developments',
                'layout': {
                    'icon-image': 'custom-marker',
                    // get the title name from the source's "title" property
                    'text-field': ['get', 'project_title'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],


                    'text-offset': [0, 1.25],
                    'text-anchor': 'top'
                },
                'paint': {
                    "text-color": "#ffffff"

                }

            });
        }
    )

}

function add_toggle_for_developments() {


    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'Developments', (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = `<h2>${e.features[0].properties.project_title}</h2><p>${e.features[0].properties.project_description}</p>`

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);

        map.flyTo({
            center: coordinates,
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom: 15
        });
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'Developments', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Developments', () => {
        map.getCanvas().style.cursor = '';
    });


}

function add_toggle_for_roads() {
    map.on('click', 'Roads', (e) => {
        // Copy coordinates array.
        var coord = e.features[0].properties.geo_point_2d;
        var coord_clean = coord.replace(/[\[\]']/g, '');
        var splitter = coord_clean.split(',');

        const coordinates = (splitter.map(Number)).reverse()
        const description = e.features[0].properties.project_description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);

        map.flyTo({
            center: coordinates,
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom: 15
        });
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'Roads', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Roads', () => {
        map.getCanvas().style.cursor = '';
    });
}


function add_toggle_for_boundry() {
    map.on('click', 'Boundry', (e) => {
        // Copy coordinates array.
        var coord = e.features[0].properties.geo_point_2d;
        var coord_clean = coord.replace(/[\[\]']/g, '');
        var splitter = coord_clean.split(',');

        const coordinates = (splitter.map(Number)).reverse()
        const description = `<h3>${e.features[0].properties.name}</h3>`

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });
}

function add_menu_to_select_layers(){
    //The different layers are saved here
    var toggleableLayerIds = ['Developments', 'Roads', 'Boundry', 'outline'];

    for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];

      var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.textContent = id;

      link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
          map.setLayoutProperty(clickedLayer, 'visibility', 'none');
          this.className = '';
        } else {
          this.className = 'active';
          map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
      };

      var layers = document.getElementById('menu');
      layers.appendChild(link);
    }
}


map.on('load', () => {
    //Controls
    add_map_controls()

    //Layers
    add_boundry_layer()
    add_building_layer()
    add_road_layer()
    add_development_layer()

    //Allow popups to show up when layer is clicked
    add_toggle_for_boundry()
    add_toggle_for_roads()
    add_toggle_for_developments()

    //Add the menu to make layers visible or invisible
    add_menu_to_select_layers()
});