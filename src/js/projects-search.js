import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { bbox, buffer, circle } from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

let mapboxContainer = "mapbox_map";
let $map_holder = document.getElementById(mapboxContainer);
let searchForm = document.getElementById("js-search-form");
let layers = [];
const zoomLimit = {
    zoom: 1.8,
    min: 2,
    max: 20,
    markerZoom: 15,
};

export const instance = mapboxgl
export const $map = $map_holder
export let map = {}
export let markers = {}

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
        zoom: zoomLimit.zoom,
        minZoom: zoomLimit.min,
        maxZoom: zoomLimit.max,
        scrollZoom: true,
    }).addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
        performMagic(params);
    })
    .on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('markers').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    })
    .on("click", "markers", e => {
        const marker = e.features[0]
        let data = marker.properties;
        let html = createMarkerPopup(data);
        const popup = new instance.Popup()
            .setLngLat(marker.geometry.coordinates.slice())
            .setHTML(html)
            .setMaxWidth("420px")
            .addTo(map)

    })
    .on("mouseenter", "markers", function (e) {
        map.getCanvas().style.cursor = "pointer";
    })
    .on("mouseenter", "clusters", function (e) {
        map.getCanvas().style.cursor = "pointer";
    })
    .on("mouseleave", "markers", function () {
        map.getCanvas().style.cursor = ""
    })
    .on("mouseleave", "clusters", function () {
        map.getCanvas().style.cursor = ""
    });
});

function submitFormViaAjax() {
    let formData = new FormData(searchForm);
    params = [];
    formData.forEach(function (value, name) {
        params.push({ name: name, value: value });
    });

    performMagic(params);
}
window.submitFormViaAjax = submitFormViaAjax;

async function performMagic(params)
{
    showLoader();
    flushMapBoxLayersAndData();

    var queryString = new URLSearchParams();
    let variables = {};

    let tmp = getFromParams("stage");
    if(tmp && document.querySelector(`.stage-wrapper[data-stage='${tmp}']`)) {
        variables["stage"] = tmp;
        queryString.append("stage", tmp);
    }

    tmp = getFromParams("country[]");
    if(tmp.length) {
        for (let index = 0; index < tmp.length; index++) {
            queryString.append("country[]", tmp[index]);
        }

        variables["categories"] = [];
        variables["categories"].push({"group": ["country"], "slug": tmp});
    }

    tmp = getFromParams("casework[]");
    if(tmp.length) {
        for (let index = 0; index < tmp.length; index++) {
            const element = tmp[index];
            queryString.append("casework[]", tmp[index]);
        }

        if(typeof(variables["categories"]) === "undefined") {
            variables["categories"] = [];
        }

        variables["categories"].push({"group": ["casework"], "slug": tmp});
    }

    queryString = queryString.toString();
    let url = window.location.pathname + (queryString != '' ? '?' + queryString : '');
    window.history.pushState({ path: url }, '', url);

    const result = await fetch("/api", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: "application/json",
            Authorization: `Bearer ${gqlToken}`
        },
        cache: "force-cache",
        body: JSON.stringify({
            query: `query fetchJurisdictionsTrackingData($stage: [QueryArgument], $categories: [CategoryCriteriaInput]) {
                entryCount(section: "jurisdictions", stage: $stage, relatedToCategories:$categories)
                categoriesForStage: entries(section: "jurisdictions", stage: $stage) {
                    ... on jurisdictions_Entry {
                        country {
                            ... on country_Category {
                            slug
                            }
                        }
                        casework {
                            ... on casework_Category {
                            slug
                            }
                        }
                    }
                }
                entries(section: "jurisdictions", stage: $stage, relatedToCategories: $categories) {
                    ... on jurisdictions_Entry {
                        id,
                        title,
                        uri,
                        stage(label: true),
                        address {
                            lat,
                            lng,
                            parts {
                                state,
                                country,
                            }
                        }
                        country {
                            ... on country_Category {
                                id,
                                slug,
                                title,
                            }
                        }
                        casework {
                            ... on casework_Category {
                                id,
                                slug,
                                title,
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
    let entryCounterDiv = document.querySelector(".js-entry-count");
    entryCounterDiv.innerHTML = data.entryCount;
    entryCounterDiv.parentElement.parentElement.classList.remove("hidden");

    if(data.entries.length == 0) {
        hideLoader();
        console.log("No rows found")
        return false;
    }

    data.entries.forEach(function(item, key) {
        // countries.push(item.address.parts.state ? item.address.parts.state + ", " + item.address.parts.country : item.address.parts.country);
        let marker = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [item.address.lng, item.address.lat]
            },
            properties: item
        };

        markers.features.push(marker);
        markerFilter.push(marker.properties.id);
    });

    searchForm.querySelectorAll("input[type='checkbox']").forEach(function(item) {
        item.removeAttribute("disabled");
    });

    let stage = getFromParams("stage");
    let country = getFromParams("country[]");
    let casework = getFromParams("casework[]");

    if(stage != '' && data.entryCount ){
        let countries = [];
        let caseworks = [];
        data.categoriesForStage.forEach(function(item, key) {
            if(typeof(item.country[0]) !== "undefined") {
                countries.push(item.country[0].slug);
            }

            if(typeof(item.casework[0]) !== "undefined") {
                caseworks.push(item.casework[0].slug);
            }
        });

        searchForm.querySelectorAll(`input[name='country[]']`).forEach(function(item) {
            if(countries.indexOf(item.value) === -1) {
                item.setAttribute("disabled", "disabled");
            }
        });

        searchForm.querySelectorAll(`input[name='casework[]']`).forEach(function(item) {
            if(caseworks.indexOf(item.value) === -1) {
                item.setAttribute("disabled", "disabled");
            }
        });
    }

    /* if(locations.length) {
        hightlightAreaOnMap(locations);
    } */

    /* if(getFromParams("country[]").length) {
        hightlightAreaOnMap(getFromParams("country[]"));
    } */

    /* addMarkerLayer("markers", {
        "circle-color": colorMarker,
        "circle-radius": 7.5,
        "circle-stroke-width": 1,
        "circle-stroke-opacity": 0.4,
    }); */
    addMarkerLayers(markers);

    // Display only the dealer markers that are within the dealer list
    map.setFilter("markers", markerFilter);
    hideLoader();

    let bounds = bbox(markers);
    map.fitBounds(bounds, {
        padding: 150,
        duration: 200,
        maxZoom: 15
    });
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

function flushMapBoxLayersAndData() {
    for (let index = 0; index < layers.length; index++)
    {
        removeLayerIfExists(map, "locationFill_" + layers[index]);
        removeLayerIfExists(map, "locationOutline_" + layers[index]);
        removeSourceIfExists(map, "location_" + layers[index]);
    }

    if (map.getSource("markers")) {
        map.removeLayer("markers");
        map.removeLayer("clusters");
        map.removeLayer("cluster-count");
        // map.removeLayer("markers-highlighted");
        map.removeSource("markers");
    }

    markers = {
        type: 'FeatureCollection',
        features: []
    };


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

function addMarkerLayers(markers)
{
    map.addSource("markers", {
        type: "geojson",
        data: markers,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'markers',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            /*'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6', 100,
                '#f1f075', 750,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20, 100,
                30, 750,
                40
            ]*/
            "circle-color": colorMarker,
            "circle-radius": 20,
            "circle-stroke-width": 0,
            "circle-stroke-opacity": 0.4,
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'markers',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-size': 14,
            'text-font': ['Open Sans SemiBold', 'Arial Unicode MS Bold']
        },
        paint: {
            "text-color": '#ffffff',
        }
    });

    map.addLayer({
        id: "markers",
        type: "circle",
        source: "markers",
        // filter: ["in", "id", ""],
        filter: ['!', ['has', 'point_count']],
        paint: {
            "circle-color": colorMarker,
            "circle-radius": 7.5,
            "circle-stroke-width": 1,
            "circle-stroke-opacity": 0.4,
        }
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
window.getQueryParams = getQueryParams;

function getFromParams(key) {
    if(key.includes("[]")) {
        let ret = [];
        params.forEach(function (val, index) {
            if (val.name == key) {
                ret.push(val.value);
            }
        });

        return ret;
    } else {
        let ret = '';
        params.forEach(function (val, index) {
            if (val.name == key) {
                ret = val.value;
            }
        });

        return ret;
    }
}
window.getFromParams = getFromParams;

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
    let country = JSON.parse(item.country);
    let casework = JSON.parse(item.casework);
    // let address = JSON.parse(item.address);
    let card = `<div class="flex sm:flex-row flex-col items-stretch bg-blue-800">`;
        if(image.length) {
            card += `<div class="flex-1 sm:max-w-[118px] overflow-hidden">
                <img src="${image[0].url}" class="object-cover object-center w-full h-full" alt="${item.title}">
            </div>`;
        }

        card += `<div class="py-5 pl-5 pr-12 text-white relative flex-1 w-full">
            <h3 class="text-2xl md:text-3xl mt-2 font-Baskervville">${item.title}</h3>
            <p class="mt-4 text-base uppercase">STAGE: ${item.stage}</p>
            <p class="text-blue-500 text-base">Casework: ${casework[0].title}</p>
            <div class="absolute right-4 bottom-4">
                <a href="/${item.uri}" class="text-white hover:text-blue-500 transition-all duration-300">
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.96875 12.5H24.2427" stroke="currentColor" stroke-width="2"></path>
                        <path d="M12.6055 25L12.6055 0" stroke="currentColor" stroke-width="2"></path>
                    </svg>
                </a>
            </div>
        </div>
    </div>`;

    return card;
}