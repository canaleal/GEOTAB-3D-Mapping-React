export const getDataUsingFetch = async(url) => {
   
    return fetch(url,  {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }})
        .then((response) => {return response.json()});
}


export const getVancouverPointDataUsingFetchAndClean = async(url) => {
    return fetch(url)
    .then((response) => response.json())
    .then(data => {
        
        let geojson = { "type": "FeatureCollection", "features": [] }
        for (let point of data.records) {
            let coordinate = [parseFloat(point.fields.geom.coordinates[0]), parseFloat(point.fields.geom.coordinates[1])];
            let properties = point.fields;
            let temp = [coordinate[1], coordinate[0]];
            properties['stop_coordinates'] = temp.toString();
            let feature = { "type": "Feature", "geometry": { "type": "Point", "coordinates": coordinate }, "properties": properties }
            geojson.features.push(feature);
        }
        
        return geojson;
    });
}