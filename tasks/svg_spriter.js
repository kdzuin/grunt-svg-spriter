/**
 * grunt-svg-spriter
 *
 * Copyright (c) 2015 Konstantin Dzuin
 * Licensed under The MIT License (MIT)
 */

'use strict';


/**
 *
 * todo:
 * 1) we use phantomjs to convert svg files to png files
 * on the step of converting svg to png we should have a possibility
 * to change a collection of sizes and colors
 *
 */

var fs = require('fs');
var path = require('path');
var SVGO = require('svgo');
var eachAsync = require('each-async');

module.exports = function (grunt) {


	function log(str) {
		grunt.log.writeln(str);
	}

	/**
	 * minifying svg icons with svgo
	 * all the options are held in options.compression object
	 * @param e - 'this' object from task
	 */
	function minify(e) {
		var svgo = new SVGO(e.options.compression);
		var done = e.async();

		var options = e.options;
		grunt.log.subhead('Compressing SVG files:');

		eachAsync(e.files, function (el, i, next) {
			var srcPath = el.src[0];
			var filename = path.parse(el.src[0]).base;
			var destPath = el.orig.dest + e.options.names.compressedFolderSVG + filename;
			var srcSvg = grunt.file.read(srcPath);

			svgo.optimize(srcSvg, function (result) {
				if (result.error) {
					grunt.warn('Error parsing SVG:', result.error);
					next();
					return;
				}

				grunt.file.write(destPath, result.data);

				grunt.log.writeln(srcPath + ' -> ' + destPath);
				next();
			});
		}, function () {
			grunt.log.ok('SVG files compressed');
			done();
		});
	}

	grunt.registerMultiTask('svg_spriter', 'Makes SVG sprites and PNG sprites from collection of SVG files', function () {

		var options = this.options({
			names: {
				compressedFolderSVG: 'compressed/',
				variationsFolderSVG: 'variations/svg/',
				variationsFolderPNG: 'variations/png/',
				spritesFolder: 'sprites/'

			},
			compression: {
				mergePaths: false
			}
		});
		this.options = options;

		minify(this);

	});

};