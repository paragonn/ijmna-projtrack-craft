import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { bbox, buffer, circle } from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

let mapboxContainer = "mapbox_map";
let $map_holder = document.getElementById(mapboxContainer);
let form1 = document.getElementById("stage-form");
let form2 = document.getElementById("search-form");
let layers = [];
let forceSearch = true;
const zoomLimit = {
    zoom: 1.8,
    min: 1,
    max: 20,
    markerZoom: 15,
};

export const instance = mapboxgl
export const $map = $map_holder
export let map = {}
export let markers = {}

const firstLimit = 100;
const genLimit = 100;

const ajaxWrapper = document.querySelector(".ajax-items");
const mobileMapOpenBtn = document.querySelector(".map-click");
const markerFilter = ["in", "id"];
const colorMarker = "#006FAC";

const gqlToken = $map_holder.dataset.token;
let polygen = false;
let regBound = false;
let params = getQueryParams();
let defaultLat = 13.839994950862705;
let defaultLng = 32.53248643419619;

window.addEventListener("load", (event) => {
    mapboxgl.accessToken = $map_holder.dataset.mapbox;

    map = new mapboxgl.Map({
        container: mapboxContainer,
        // We can create custom style from MAPBOX Account.
        style: "mapbox://styles/mapbox/light-v10",
        center: [$map_holder.dataset.longitude ?? defaultLng, $map_holder.dataset.latitude ?? defaultLat],
        // maxBounds: [
        //     [33.75, 29.375],
        //     [36.125, 33.5],
        // ],
        zoom: zoomLimit.zoom,
        minZoom: zoomLimit.min,
        maxZoom: zoomLimit.max,
        scrollZoom: true,
    }).addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
        /* let labels = ['country-label', 'state-label',
            'settlement-label', 'settlement-subdivision-label',
            'airport-label', 'poi-label', 'water-point-label',
            'water-line-label', 'natural-point-label',
            'natural-line-label', 'waterway-label', 'road-label'];

        labels.forEach(label => {
            map.setLayoutProperty(label, 'text-field', ['get', `name_${document.ocumentElement.lang}`]);
        }); */

        // Remove all Labels
        // map.style.stylesheet.layers.forEach(function(layer) {
        //     if (layer.type === 'symbol') {
        //         map.removeLayer(layer.id);
        //     }
        // });

        // Set color of WATER to match with IJM
        // map.setPaintProperty("water", 'fill-color', "#e9edf0");
        performMagic(params);
    }).on("click", "markers", e => {
        const marker = e.features[0]
        let data = marker.properties;
        let html = createMarkerPopup(data);
        const popup = new instance.Popup()
            .setLngLat(marker.geometry.coordinates.slice())
            .setHTML(html)
            .setMaxWidth("420px")
            .addTo(map)

    });
});

async function performMagic(params)
{
    showLoader();
    startFreshMarkers();
    removeAllLayers();

    var queryString = new URLSearchParams();
    let variables = {};
    params.forEach(function (data) {
        if (data.value) {
            queryString.append(data.name, data.value);
            variables[data.name] = data.value;
        }
    });

    queryString = queryString.toString();
    let url = window.location.pathname + (params.length ? '?' + queryString : '');
    window.history.pushState({ path: url }, '', url);

    var found = false;

    const result = await fetch("/api", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: "application/json",
            Authorization: `Bearer ${gqlToken}`
        },
        cache: "force-cache",
        body: JSON.stringify({
            query: `query fetchProjectTrackingData($stage: [QueryArgument], $jurisdiction: [QueryArgument], $casework: [QueryArgument]) {
                entries(section: "projects", stage: $stage, jurisdiction:$jurisdiction, casework: $casework) {
                    ... on projects_Entry {
                        id
                        title
                        uri
                        stage(label: true)
                        jurisdiction {
                            ... on jurisdiction_Category {
                                id,
                                title,
                                address {
                                    lat
                                    lng
                                    parts {
                                        state
                                        country
                                    }
                                }
                            }
                        }
                        casework {
                            ... on casework_Category {
                                id,
                                title
                            }
                        }
                        image {
                            url @transform(width: 118, height: 138, mode: "crop")
                        }
                    }
                }
            }`,
            variables: variables
        })
    })
    .then(response => response.json());

    handleDataFromGql(result.data);
}

function handleDataFromGql(data)
{
    if(data.entries.length == 0) {
        console.log("No rows found")
        return false;
    }

    let locations = [];
    data.entries.forEach(function(item, key) {
        locations.push(item.jurisdiction[0].address.parts.state ? item.jurisdiction[0].address.parts.state + ", " + item.jurisdiction[0].address.parts.country : item.jurisdiction[0].address.parts.country);

        let marker = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [item.jurisdiction[0].address.lng, item.jurisdiction[0].address.lat]
            },
            properties: item
        };

        markers.features.push(marker);
        markerFilter.push(marker.properties.id);
    });

    if(locations.length) {
        hightlightAreaOnMap(locations);
    }

    if (map.getSource("markers")) {
        map.removeLayer("markers");
        map.removeLayer("markers-highlighted");
        map.removeSource("markers");
    }

    console.log(markers)
    map.addSource("markers", {
        type: "geojson",
        data: markers,
    });

    addMarkerLayer("markers", {
        "circle-color": colorMarker,
        "circle-radius": 6,
        "circle-stroke-width": 1,
        "circle-stroke-opacity": 0.4,
    });

    addMarkerLayer("markers-highlighted", {
        "circle-color": colorMarker,
        "circle-radius": 10,
        "circle-stroke-color": colorMarker,
        "circle-stroke-width": 7,
        "circle-stroke-opacity": 0.6,
    });

    // Display only the dealer markers that are within the dealer list
    console.log(markerFilter)
    map.setFilter("markers", markerFilter);
    hideLoader();
}

function hightlightAreaOnMap(locations)
{
    for (let index = 0; index < locations.length; index++)
    {
        let id = convertToSlug(locations[index]);
        layers.push(id);

        // removeLayerIfExists(map, "locationFill_" + id);
        // removeLayerIfExists(map, "locationOutline_" + id);
        // removeSourceIfExists(map, "location_" + id);

        Promise.all([getBoundaries(locations[index], id)]).then(boundaryData => {
            if(boundaryData[0]) {
                drawBoundaries(id);
            }
        });
    }
}

function startFreshMarkers() {
    markers = {
        type: 'FeatureCollection',
        features: []
    };
}

function removeLayerIfExists(map, layer) {
    if (map.getLayer(layer)) {
        map.removeLayer(layer)
    }
}

function removeSourceIfExists(map, source) {
    if (map.getSource(source)) {
        map.removeSource(source)
    }
}

function removeAllLayers() {
    for (let index = 0; index < layers.length; index++)
    {
        removeLayerIfExists(map, "locationFill_" + layers[index]);
        removeLayerIfExists(map, "locationOutline_" + layers[index]);
        removeSourceIfExists(map, "location_" + layers[index]);
    }
}

function getBoundaries(location, id) {
    // set default location for openstreetmap endpoint
    // if the location is set get coordinates
    polygen = false;
    if (location) {

        return fetch("https://nominatim.openstreetmap.org/search.php?q=" + location + "&polygon_geojson=1&format=json", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            cache: "force-cache"
        })
            .then(response => response.json())
            .then(data => {
                if (data.length == 0) return false;

                // filter the data to get only the polygon coordinates
                let localizedData = data.filter(
                    val =>
                        (data.length > 1 ? val.geojson.type.includes("Polygon") && val.class != "tourism" : true)
                )

                if (localizedData.length === 0) {
                    localizedData = data.filter(
                        val =>
                            (data.length > 1 ? val.geojson.type.includes("Polygon") : true)
                    )
                }

                if (localizedData.length) {
                    let d;
                    data = localizedData;
                    const boundaryData = data.find(x => x.class == 'boundary');

                    if (boundaryData) {
                        data = getPolygon(boundaryData)
                        d = getBoundingBox3(data);
                    } else {
                        data = getPolygon(data[0]);
                        d = getBoundingBox3(data);
                    }

                    polygen = data;

                    // removeLayerIfExists(map, "locationFill");
                    // removeLayerIfExists(map, "locationOutline");
                    // removeSourceIfExists(map, "location");
                    map.addSource("location_" + id, {
                        type: "geojson",
                        data: data.geometry,
                    });

                    if (location == "USA" || location == "United States") {
                        return [[-124.736342, 49.382808], [-66.945392, 24.521208]];
                    } else if (location == "Canada") {
                        return [[-127.04488959947128, 46.84335005883247], [-93.56611457505713, 67.56632192699053]];
                    } else if (location == "Australia") {
                        return [[113.1833866242153, -43.18948268415735], [155.58306008612902, -8.396740704298026]];
                    } else if (location == "New Zealand") {
                        return [[167.56687045493499, -47.123778189733535], [176.25112313112277, -40.23886012876884]];
                    }
                    return d;
                } else {
                    return false;
                }
            });
    } else {
        return false;
    }
}

function drawBoundaries(location) {
    // Add a new layer to visualize the polygon.
    map.addLayer({
        id: "locationFill_" + location,
        type: "fill",
        source: "location_" + location, // reference the data source
        layout: {},
        paint: {
            "fill-color": "#0080ff", // blue color fill
            "fill-opacity": 0.1,
        },
    })
    // Add a black outline around the polygon.
    map.addLayer({
        id: "locationOutline_" + location,
        type: "line",
        source: "location_" + location,
        layout: {},
        paint: {
            "line-color": "#000",
            "line-width": 2,
        },
    })
}

function getPolygon(data) {
    let value = {
        type: "Feature",
        properties: {},
        geometry: { ...data.geojson },
        lat: data.lat,
        lng: data.lon
    }

    if ("LineString" === data.geojson.type) {
        value = buffer(value, 1)
    } else if ("Point" === data.geojson.type) {
        value = circle(value, 1)
    }

    return value
}

function addMarkerLayer(layerId, layerPaint) {
    map.addLayer({
        id: layerId,
        source: "markers",
        type: "circle",
        paint: layerPaint,
        filter: ["in", "id", ""],
    });
}

function getBoundingBox3(data) {
    let d = bbox(data);
    return [
        [
            d[0],
            d[1]
        ],
        [
            d[2],
            d[3]
        ]
    ];
}

function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let params = [];
    let entries = urlParams.entries();
    for (const entry of entries) {
        params.push({ name: entry[0], value: entry[1] });
    }

    return params;
}

function getFromParams(key) {
    let ret = '';
    params.forEach(function (val, index) {
        if (val.name == key) {
            ret = val.value;
        }
    });

    return ret;
}

function showLoader() {
    document.querySelectorAll(".ajax--loading").forEach(function (item) {
        item.classList.remove("hidden")
    });
}

function hideLoader() {
    document.querySelectorAll(".ajax--loading").forEach(function (item) {
        item.classList.add("hidden")
    });
}

function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}

function createMarkerPopup(item) {
    let image = JSON.parse(item.image);
    let jurisdiction = JSON.parse(item.jurisdiction);
    let card = `<div class="flex sm:flex-row flex-col items-stretch bg-blue-800">`;
        if(image.length) {
            card += `<div class="flex-1 sm:max-w-[118px] max-h-[139px] sm:h-full overflow-hidden">
                <img src="${image[0].url}" class="object-cover object-center w-full h-full" alt="${item.title}">
            </div>`;
        }

        card += `<div class="py-5 pl-5 pr-12 text-white relative flex-1 w-full">
            <p class="text-blue-500 text-base">Country: ${jurisdiction[0].address.parts.country}</p>
            <h3 class="text-2xl md:text-3xl mt-2 font-Baskervville">${item.title}</h3>
            <p class="mt-4 text-base uppercase">STAGE: ${item.stage}</p>
            <div class="absolute right-4 bottom-4">
                <button class="text-white hover:text-blue-500 transition-all duration-300">
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.96875 12.5H24.2427" stroke="currentColor" stroke-width="2"></path>
                        <path d="M12.6055 25L12.6055 0" stroke="currentColor" stroke-width="2"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>`;

    return card;
}