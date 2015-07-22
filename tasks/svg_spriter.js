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

	function minify(e, files, options) {
		var svgo = new SVGO(options.compression);
		var done = e.async();

		eachAsync(files, function (el, i, next) {
			var srcPath = path.resolve(el.cwd, el.svg);
			var srcSvg = grunt.file.read(srcPath);

			log(el.svg + ' compressing...');

			svgo.optimize(srcSvg, function (result) {
				if (result.error) {
					grunt.warn('Error parsing SVG:', result.error);
					next();
					return;
				}
				grunt.file.write(el.cwd + '/' + options.names.compressedFolderSVG + el.svg, result.data);
				next();
			});
		}, function () {
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
			compression: {}
		});
		var files = [];

		this.files.forEach(function (fset) {
			fset.src.forEach(function (svg) {
				files.push({
					cwd: path.resolve(fset.cwd || ""),
					svg: svg,
					png: svg.replace(/\.svg$/i, '.png')
				});
			});
		});

		minify(this, files, options);

	});

};