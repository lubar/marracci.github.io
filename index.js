'use strict';

/* global L d3 */
L.mapbox.accessToken = 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6IjRmMTFiNWYyZjg1NjU2ZDdlZDQ1ODlkOTE0Nzg2ZTkxIn0.v7N1YNXeOR5yfR_gHDiNjA';

// Avoid the page jump due to overflow clipping on the page?
// https://github.com/Leaflet/Leaflet/issues/2463
L.Map.addInitHook(function() {
  return L.DomEvent.off(this._container, 'mousedown', this.keyboard._onMouseDown);
});

var maps = {};

function refreshMaps() {
  for (var key in maps) {
    maps[key].invalidateSize();
  }
}

maps.one = L.mapbox.map('map-one', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
}).setView({lat: 38.87297, lng: -77.00732}, 16);

maps.two = L.mapbox.map('map-two', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
}).setView([-16.2114, 128.2324], 10);

maps.three = L.mapbox.map('map-three', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
}).setView({lat: 38.87297, lng: -77.00732}, 16);

maps.four = L.mapbox.map('map-four', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
}).setView([-16.2114, 128.2324], 10);

// Restrict panning to one copy of the world
var southWest = L.latLng(-90, -180),
    northEast = L.latLng(90, 180),
    bounds = L.latLngBounds(southWest, northEast);

maps.coverage = L.mapbox.map('map-coverage', 'tristen.8182c767', {
  zoomControl: false,
  noWrap: true,
  minZoom: 2,
  maxBounds: bounds,
  attributionControl: false
}).setView([33.137551192346145, 10.72265625], 2);

maps.one.scrollWheelZoom.disable();
maps.one.touchZoom.disable();

maps.two.scrollWheelZoom.disable();
maps.two.touchZoom.disable();

maps.three.scrollWheelZoom.disable();
maps.three.touchZoom.disable();

maps.four.scrollWheelZoom.disable();
maps.four.touchZoom.disable();

maps.coverage.scrollWheelZoom.disable();
maps.coverage.touchZoom.disable();

// Paging controls
// ===================
function page(_this, state) {
  var parent = d3.select('#' + d3.select(_this).attr('data-pager'));
  var slides = JSON.parse(parent.attr('data-slides'));
  var current = parent.select('.active');
  var titleCard = parent.select('span');
  var index = 0;

  // Find the current index
  slides.forEach(function(s, i) {
    if (s.id === current.node().id) index = i;
  });

  if (state === 'next') {
    index = ((index + 1) > (slides.length - 1)) ? 0 : index + 1;
  } else {
    index = ((index - 1) < 0) ? slides.length - 1 : index - 1;
  }

  titleCard.text(slides[index].title);
  current.classed('active', false);
  parent.select('#' + slides[index].id).classed('active', true);
  refreshMaps();
}

d3.selectAll('.js-next').on('click', function() {
  d3.event.preventDefault();
  page(this, 'next');
});

d3.selectAll('.js-previous').on('click', function() {
  d3.event.preventDefault();
  page(this, 'previous');
});


var $vividExamples = d3.select('#vivid-examples');
var $vividCoverage = d3.select('#vivid-coverage');

// Basemap + Vivid toggle
d3.selectAll('[name="vivid-toggle"]').on('change', function() {
  var val = d3.event.target.getAttribute('data-tab');

  $vividExamples.classed('active', function() {
    return $vividExamples.node().id === val;
  });

  $vividCoverage.classed('active', function() {
    return $vividCoverage.node().id === val;
  });

  refreshMaps();
});

// ===================
// Mapbox.js Examples
// ===================
var apiExamples = [
  { id: 'map-toggling', title: 'Example: Toggling labels'},
  { id: 'map-geojson', title: 'Example: Adding GeoJSON'},
  { id: 'map-swiping', title: 'Example: Swipe between layers'},
  { id: 'map-kml', title: 'Example: Adding KML data'}
];

var examples = d3.select('#js-api-examples');
examples.attr('data-slides', JSON.stringify(apiExamples));

// Set the first example
examples.select('span').text(apiExamples[0].title);
d3.select('#' + apiExamples[0].id).classed('active', true);

// Example: Toggling
// ===================
maps.toggling = L.mapbox.map('map-toggling', 'mapbox.satellite', {
  attributionControl: false
}).setView({lat: 38.87297, lng: -77.00732}, 8);

maps.toggling.scrollWheelZoom.disable();
maps.toggling.touchZoom.disable();

var layers = document.getElementById('menu-ui');
addLayer(L.mapbox.tileLayer('mapbox.streets-satellite'), 'Toggle labels');

function addLayer(layer, name) {
  layer.setZIndex(2).addTo(maps.toggling);

  var button = document.createElement('button');
    button.className = 'button active';
    button.innerHTML = name;

  button.onclick = function() {
    if (maps.toggling.hasLayer(layer)) {
      maps.toggling.removeLayer(layer);
      this.classList.remove('active');
    } else {
      maps.toggling.addLayer(layer);
      this.classList.add('active');
    }
  };

  layers.appendChild(button);
}

// Example: Adding GeoJSON
// ===================
maps.geojsonExample = L.mapbox.map('map-geojson', 'mapbox.satellite', {
  attributionControl: false
}).setView([38.8929, -77.0252], 15);

maps.geojsonExample.scrollWheelZoom.disable();
maps.geojsonExample.touchZoom.disable();

L.mapbox.featureLayer().addTo(maps.geojsonExample).setGeoJSON(geojsonData);

// Example: Swiping between layers
// ===================
maps.swipe = L.mapbox.map('map-swiping', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
});

maps.swipe.dragging.disable();
maps.swipe.touchZoom.disable();
maps.swipe.doubleClickZoom.disable();
maps.swipe.scrollWheelZoom.disable();

var overlay = L.mapbox.tileLayer('mapbox.outdoors').addTo(maps.swipe);
var range = document.getElementById('js-range');

function clip() {
  var nw = maps.swipe.containerPointToLayerPoint([0, 0]),
    se = maps.swipe.containerPointToLayerPoint(maps.swipe.getSize()),
    clipX = nw.x + (se.x - nw.x) * range.value;

  overlay.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
}

range['oninput' in range ? 'oninput' : 'onchange'] = clip;
maps.swipe.on('move', clip);
maps.swipe.setView([49.434, -123.272], 7);

// Example: Loading KML data
// ===================
var kmlTheme = L.geoJson(null, {
  style: function() {
    return {
      'color': '#fa946e',
      'opacity': 1,
      'width': 6
    };
  }
});

maps.kml = L.mapbox.map('map-kml', 'mapbox.satellite', {
  attributionControl: false
}).setView([37.82398042492735, -122.3653256893158], 15);

maps.kml.scrollWheelZoom.disable();
maps.kml.touchZoom.disable();

omnivore.kml('js/kml-data.kml', null, kmlTheme).addTo(maps.kml);
