'use strict';

/* global L d3 */
require('d3');
require('mapbox.js');
L.mapbox.accessToken = process.env.TOKEN;

var formData = require('./js/form-data');

d3.select('#js-form-timing')
  .selectAll('option')
  .data(formData.timing)
  .enter()
.append('option')
  .attr('value', ((d) => {
    return d;
  }))
  .text(((d) => {
    return d;
  }));

d3.select('#js-form-countries')
  .selectAll('option')
  .data(formData.countries)
  .enter()
.append('option')
  .attr('value', ((d) => {
    return d;
  }))
  .text(((d) => {
    return d;
  }));

d3.select('#js-form-industries')
  .selectAll('option')
  .data(formData.industries)
  .enter()
.append('option')
  .attr('value', ((d) => {
    return d;
  }))
  .text(((d) => {
    return d;
  }));

var one = L.mapbox.map('map-one', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
}).setView({lat: 38.87297, lng: -77.00732}, 16);

var two = L.mapbox.map('map-two', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
}).setView([-16.2114, 128.2324], 10);

var three = L.mapbox.map('map-three', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
}).setView({lat: 38.87297, lng: -77.00732}, 16);

var four = L.mapbox.map('map-four', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
}).setView([-16.2114, 128.2324], 10);

var five = L.mapbox.map('map-five', 'mapbox.satellite', {
  zoomControl: false,
  attributionControl: false
}).setView({lat: 38.87297, lng: -77.00732}, 16);

var coverage = L.mapbox.map('map-coverage', 'tristen.coverage', {
  zoomControl: false,
  attributionControl: false
});

one.scrollWheelZoom.disable();
one.touchZoom.disable();

two.scrollWheelZoom.disable();
two.touchZoom.disable();

three.scrollWheelZoom.disable();
three.touchZoom.disable();

four.scrollWheelZoom.disable();
four.touchZoom.disable();

five.scrollWheelZoom.disable();
five.touchZoom.disable();

coverage.scrollWheelZoom.disable();
coverage.touchZoom.disable();

// Paging controls
d3.selectAll('.js-next').on('click', () => {
  d3.event.preventDefault();
});

d3.selectAll('.js-previous').on('click', () => {
  d3.event.preventDefault();
});


var $vividExamples = d3.select('#vivid-examples');
var $vividCoverage = d3.select('#vivid-coverage');

// Basemap + Vivid toggle
d3.selectAll('[name="vivid-toggle"]').on('change', () => {
  var val = d3.event.target.getAttribute('data-tab');

  $vividExamples.classed('active', () => {
    return $vividExamples.node().id === val;
  });

  $vividCoverage.classed('active', () => {
    return $vividCoverage.node().id === val;
  });
});
