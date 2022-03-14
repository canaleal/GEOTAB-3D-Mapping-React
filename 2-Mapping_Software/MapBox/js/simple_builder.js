/* Created by Alex Canales
Date: 2022-02-09
*/






//Add the mapbox map controls like fullscreen mode and navigation search bar
function add_map_controls() {
    //Geocoder is used to specify the langauge. Examples include EN for english, ES for spanish
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        language: 'en',
        mapboxgl: mapboxgl
    });
    map.addControl(geocoder, 'top-right');

    // Add full screen controls to the map
    map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

}


function add_assets() {
    map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker', image);
        }
    )
}


let toggleableLayerIds = [];

function add_terrian_layer() {
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    // add a sky layer that will show when the map is highly pitched
    map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
    });
}


//This function adds the Kingston city bounderies
function add_boundry_layer() {
    //Add the city bounderies layer
    map.addSource('Boundry', {
        'type': 'geojson',
        'data': 'http://127.0.0.1:5500/data/city-neighbourhoods.geojson',
    });

    // Add a new layer to visualize the bounderies.
    map.addLayer({
        'id': 'Boundry',
        'type': 'fill',
        'source': 'Boundry', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': ['get', 'fill'], // blue color fill
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


    map.addLayer({
        'id': 'BoundryIcon',
        'type': 'symbol',
        'source': 'Boundry',
        'layout': {

            // get the title name from the source's "title" property
            'text-field': ['get', 'name'],
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

    toggleableLayerIds.push('Boundry')
    map.setLayoutProperty('Boundry', 'visibility', 'visible');
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
            'id': 'Buildings',
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

    toggleableLayerIds.push('Buildings')
    map.setLayoutProperty('Buildings', 'visibility', 'visible');
}






function add_bus_routes_line_layer() {
    //Create the roads under development layer
    map.addSource('Buses', {
        'type': 'geojson',
        'data': 'http://127.0.0.1:5500/data/transit-gtfs-routes.geojson'
    });
    map.addLayer({
        'id': 'Buses',
        'type': 'line',
        'source': 'Buses',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#870113', //Specify road colour
            'line-width': 2 //Specify width of the road
        }
    });

    toggleableLayerIds.push('Buses')
    map.setLayoutProperty('Buses', 'visibility', 'visible');

}



function add_downtown_layer() {

    map.addSource('Pedestrians', {
        'type': 'geojson',
        'data': 'http://127.0.0.1:5500/data/transit-gtfs-stops-count.geojson'
    });

    map.addLayer(
        {
            'id': 'Pedestrians',
            'type': 'circle',
            'source': 'Pedestrians',
            'minzoom': 7,
            'paint': {
                // Size circle radius by earthquake magnitude and zoom level
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    ['interpolate', ['linear'], ['get', 'count'], 1, 2, 6, 8],
                    16,
                    ['interpolate', ['linear'], ['get', 'count'], 2, 4, 8, 10]
                ],
                // Color circle by earthquake magnitude
                'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'count'],
                    100,
                    'rgb(116,237,134)',
                    200,
                    'rgb(217, 161, 77)',
                    300,
                    'rgb(250, 97, 156)',
                    400,
                    'rgb(194, 129, 71)',
                    500,
                    'rgb(168, 28, 48)',
                    600,
                    'rgb(204, 77, 125)',
                    700,
                    'rgb(194, 58, 96)',
                    800,
                    'rgb(180, 40, 68)',
                    900,
                    'rgb(163, 24, 40)',
                    1000,
                    'rgb(144, 11, 10)'
                ],
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                // Transition from heatmap to circle layer by zoom level
                'circle-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    0,
                    8,
                    1
                ]
            }
        },
        'waterway-label'
    );


    map.setLayoutProperty('Pedestrians', 'visibility', 'visible');

    toggleableLayerIds.push('Pedestrians')
}


function add_jaywalker_layer() {

    // Add a GeoJSON source with 2 points
    map.addSource('Jaywalker', {
        'type': 'geojson',
        'data': 'http://127.0.0.1:5500/data/jaywalkers-count.geojson'
    });
    map.addLayer({
        'id': 'Jaywalker',
        'type': 'symbol',
        'source': 'Jaywalker',
        'layout': {
            'icon-image': 'custom-marker',
            // get the title name from the source's "title" property
            'text-field': ['get', 'name'],
            'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
            ],


            'text-offset': [0, 1.25],
            'text-anchor': 'top'
        },
        'paint': {
            "text-color": "#0000ff"

        }

    });


    map.setLayoutProperty('Jaywalker', 'visibility', 'visible');
    toggleableLayerIds.push('Jaywalker')
}


function add_toggle_for_downtown() {

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'Pedestrians', (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = `<p class="fw-bold">${e.features[0].properties.name} - ${e.features[0].properties.year}</p><p>Number of People (AVG/HR) : ${e.features[0].properties.count}</p><img src="${e.features[0].properties.img_url}" alt="TEST" height=auto width="100%"/>`

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.remove()

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);


    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'Pedestrians', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = `<span>People (AVG/HR) : ${e.features[0].properties.count}</span>`

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);

    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'Pedestrians', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
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



function add_menu_to_select_layers() {
    //The different layers are saved here

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
            console.log(visibility)
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



function add_layers() {
    //Layers
    add_terrian_layer()
    add_boundry_layer()
    add_building_layer()
    add_downtown_layer()
    add_jaywalker_layer()
    add_bus_routes_line_layer()
    add_toggle_for_downtown()

}

const years = ['2015', '2016', '2017', '2018', '2019', '2020']
function add_filters() {


    document.getElementById('filters').addEventListener('change', (event) => {
        const year = event.target.value;

        // update the map filter
        if (year === 'all') {
            filterDay = ['match', ['get', 'year'], years, false, true];

            map.setFilter('Pedestrians', ['all', filterDay]);
        } else if (years.includes(year)) {
            map.setFilter('Pedestrians', ['==', ['number', ['get', 'year']], parseInt(year)]);

            document.getElementById("myRange").value = year;
        }
        else {
            console.log('error');
        }


    })



    const slider = document.getElementById("myRange");
 
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
       
        const year = this.value;

        if (years.includes(year)) {
            map.setFilter('Pedestrians', ['==', ['number', ['get', 'year']], parseInt(year)]);
            document.getElementById(year).checked = true;
        }
        else {
            console.log('error');
        }
    }

}

function add_main_elements() {



    add_assets()
    add_layers()


}


function montaSlider() {

    rangeElement = document.getElementById("myRange");
    if (rangeElement.value == parseInt(years[years.length - 1])) {
        rangeElement.value = parseInt(years[0])
    }
    else {
        rangeElement.value = parseInt(rangeElement.value) + 1;
    }


   
    const year = rangeElement.value;

    if (years.includes(year)) {
        map.setFilter('Pedestrians', ['==', ['number', ['get', 'year']], parseInt(year)]);
        document.getElementById(year).checked = true;
    }
    else {
        console.log('error');
    }

}



function switchLayer(layer) {
    map.once("styledata", add_main_elements);
    const layerId = layer.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId);
}

function map_styles() {
    //Switch between map styles
    const layerList = document.getElementById("map_menu");
    const inputs = layerList.getElementsByTagName("input");


    // set toggle base style events
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
    }
}

let map;
document.addEventListener("DOMContentLoaded", function () {

 

    //Access token to load Mapbox into project
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FuYWxlYWwiLCJhIjoiY2t6Nmg2Z2R4MTBtcDJ2cW9xMXI2d2hqYyJ9.ef3NOXxDnIy4WawQuaFopg';

    //Used to create the map bounderies
    const map_bounderies = [
        [-76.788, 44.107], // Southwest coordinates
        [-76.170, 44.520] // Northeast coordinates
    ];

    //Create the mapbox map and set the center
    //Zoom ranges from 0 to 20. Higher value will get you closer to map
    map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-76.48098, 44.22976],
        zoom: 15.5,

        container: 'map',
        antialias: true,
        maxBounds: map_bounderies
    });



    map.on('load', () => {


        add_map_controls()

        //Assets and Layers
        add_main_elements()

        //Add the menu to make layers visible or invisible
        add_menu_to_select_layers()


        add_filters()

        map_styles()




        let isPlaying = false;
        let play_pause_btn = document.getElementById("play-pause-btn");
        let interval = null;
        play_pause_btn.onclick = function () {
            isPlaying = !isPlaying

            if (isPlaying == true) {


                play_pause_btn.firstElementChild.className = 'fa fa-pause';
                play_pause_btn.lastElementChild.innerHTML = 'Pause';

                //Create an interval that gets called every 2000milliseconds
                interval = setInterval(function () { montaSlider() }, 2000);
            }
            else {
                play_pause_btn.firstElementChild.className = 'fa fa-play';
                play_pause_btn.lastElementChild.innerHTML = 'Play';

                clearInterval(interval)
            }
        }




    });


});

