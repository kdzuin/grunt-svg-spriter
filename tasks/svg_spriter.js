/**
 * grunt-svg-spriter
 *
 * Copyright (c) 2015 Konstantin Dzuin
 * Licensed under The MIT License (MIT)
 */

'use strict';

var fs = require('fs');
var path = require('path');
var SVGO = require('svgo');
var phantomjs = require('phantomjs');
var childprocess = require('child_process');
var async = require('async');


module.exports = function (grunt) {

	grunt.registerMultiTask('svg_spriter', 'Makes SVG sprites and PNG fallbacks from collection of SVG files', function () {

		var getCollection = function (item) {
			var collection = {};

			try {
				collection = JSON.parse(grunt.file.read(path.resolve(item.path.src + 'generator.json')));
			} catch (e) {
				collection = {};
			}
			return collection;
		};

		var rasterize = function (done) {
			grunt.log.subhead('Rasterizing SVG files:');

			var items = Object(collection);
			items.forEach(function(item) {
				var collection = getCollection(item);
				item.path.src = options.tasks.compress ? path.resolve(item.path.compressed) + '/' : path.resolve(item.path.src) + '/';
				item.path.dest = path.resolve(item.path.variations) + '/';
				item.collection = collection;
			});

			var spawn = childprocess.spawn(
				phantomjs.path,
				[path.resolve(__dirname, 'lib/phantom-rasterize.js')]
			);

			spawn.stdin.write(JSON.stringify(items));
			spawn.stdin.end();

			spawn.stdout.on('data', function (buffer) {
				try {
					var result = JSON.parse(buffer.toString());
					if (result.status) {
						grunt.log.writeln(result.file + ' generated');
					}
				} catch (e) {
					grunt.log.error(buffer);
				}
			});

			spawn.on('exit', function () {
				grunt.log.ok("Rasterization complete.");
				done();
			});
		};

		var compress = function (done, again) {
			grunt.log.subhead('Compressing SVG files:');
			var svgo = new SVGO(options.compression);
			async.each(collection, function(file, callback) {
				var src = file.path.src + file.svg;
				var dest = file.path.compressed + file.svg;
				var svg = grunt.file.read(src);
				svgo.optimize(svg, function (result) {
					if (result.error) {
						grunt.warn('Error parsing SVG:', result.error);
						callback();
						return;
					}
					grunt.file.write(dest, result.data);
					grunt.log.writeln(src + ' -> ' + dest);
					callback();
				});
			}, function() {
				if (again) {
					grunt.log.ok('SVG files compressed');
					done();
				} else {
					compress(done, true);
				}
			});

		};

		var done = this.async();
		var skip = function (callback) {
			callback();
		};

		var options = this.options({
			folders: {
				compressed: 'compressed/',
				variations: 'png/'
			},
			compression: {
				plugins: [
					{removeTitle: true},
					{removeDimensions: true}
				]
			},
			tasks: {
				compress: true,
				rasterize: true
			}
		});

		var collection = [];

		var files = this.files[0];
		files.src.forEach(function (filename) {
			var data = {
				path: {
					src: files.cwd,
					compressed: files.dest + options.folders.compressed,
					variations: files.dest + options.folders.variations
				},
				svg: filename,
				png: filename.replace(/\.svg$/i, '.png')
			};
			collection.push(data);
		});

		//grunt.log.subhead('Files collection:');
		//grunt.log.writeln(JSON.stringify(collection, null, 2));

		async.series(
			[
				options.tasks.compress ? compress : skip,
				options.tasks.rasterize ? rasterize : skip
			],
			function () {
				grunt.log.subhead('Done');
				done();
			}
		);

	});
};