/**
 * grunt-svg-spriter
 *
 * Copyright (c) 2015 Konstantin Dzuin
 * Licensed under The MIT License (MIT)
 */

'use strict';


/**
 *
 * 1) we use phantomjs to convert svg files to png files
 * on the step of converting svg to png we should have a possibility
 * to change a collection of sizes and colors
 *
 */

var phantomjs = require('phantomjs'),
	path = require('path');


module.exports = function(grunt) {

	grunt.registerMultiTask('svgspriter', 'Makes SVG sprites and PNG sprites from collection of SVG files', function() {
	});

};