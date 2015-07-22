/**
 * grunt-svg-spriter
 *
 * Copyright (c) 2015 Konstantin Dzuin
 * Licensed under The MIT License (MIT)
 */


'use strict';

module.exports = function(grunt)
{

	grunt.initConfig({

		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		clean: {
			tests: ['test/**/*.png']
		},

		svg_spriter: {
			all: {
				cwd: 'icons/',
				src: '*.svg',
				options: {
					names: {
						compressedFolderSVG: 'compressed/',
						variationsFolderSVG: 'variations/svg/',
						variationsFolderPNG: 'variations/png/',
						spritesFolder: 'sprites/'
					}
				}
			}
		}

	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['jshint']);

};
