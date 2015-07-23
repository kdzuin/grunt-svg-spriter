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
			icons: [
				'icons/compressed',
				'icons/png'
			]
		},

		svg_spriter: {
			icons: {
				cwd: 'icons/assets/',
				src: ['*.svg'],
				dest: 'icons/',
				options: {
					folders: {
						compressed: 'compressed/',
						variations: 'png/',
						sprites: 'sprites/'
					},
					tasks: {
						compress: true,
						rasterize: true
					}
				}
			}
		}

	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean', 'jshint', 'svg_spriter']);

};
