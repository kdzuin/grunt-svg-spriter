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

var path = require('path');
var SVGO = require('svgo');
var eachAsync = require('each-async');

module.exports = function (grunt) {

	function log(str) {
		grunt.log.writeln(str);
	}

	grunt.registerMultiTask('svg_spriter', 'Makes SVG sprites and PNG sprites from collection of SVG files', function () {

		var options = this.options({
			names: {
				compressedFolderSVG: 'compressed/',
				variationsFolderSVG: 'variations/svg/',
				variationsFolderPNG: 'variations/png/',
				spritesFolder: 'sprites/'

			},
			compression: {}
		});
		var files = [];

		this.files.forEach(function(fset)
		{
			fset.src.forEach(function(svg)
			{
				files.push({
					cwd: path.resolve(fset.cwd || ""),
					svg: svg,
					png: svg.replace(/\.svg$/i, '.png')
				});
			});
		});

	});

};