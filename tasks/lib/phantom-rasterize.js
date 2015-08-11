var fs = require('fs'),
	system = require('system'),
	items = JSON.parse(system.stdin.read()),
	async = require('async'),
	total = items.length,
	next = 0,
	file;


var nextFile = function () {
	var item;

	if (next >= total) {
		phantom.exit(0);
		return;
	}

	item = items[next++];

	var src = item.path.src + item.svg;
	var dest = item.path.dest + item.png;


	if (typeof(item.collection.sizes) === 'object') {

		var sizes = item.collection.sizes;

		var nextSize = 0;
		var totalSize = sizes.length;

		var nextSizeRasterize = function () {
			var size;

			if (nextSize >= totalSize) {
				nextFile();
				return;
			}

			size = sizes[nextSize++];

			var page = require('webpage').create();
			dest = item.path.dest + size.name + '/' + item.png;

			page.viewportSize = {
				width: parseFloat(size.width),
				height: parseFloat(size.height)
			};

			page.open(src, function(status) {
				page.render(dest);
				console.log(JSON.stringify({ 'file': item.path.variations + size.name + '/' + item.png , 'status': status}));
				page.close();
				nextSizeRasterize();
			});
		};

		nextSizeRasterize();


	} else {

		var svgdata = fs.read(src) || '';
		var frag = window.document.createElement('div');
		frag.innerHTML = svgdata;
		var svg = frag.querySelector('svg');

		var width = svg.getAttribute('width');
		var height = svg.getAttribute('height');
		if (!width && !height) {
			var viewbox = svg.getAttribute('viewBox');
			var dimensions = viewbox.split(' ');
			width = dimensions[2] - dimensions[0];
			height = dimensions[3] - dimensions[1];
		}

		var page = require('webpage').create();
		page.viewportSize = {
			width: parseFloat(width),
			height: parseFloat(height)
		};
		page.open(src, function(status) {
			page.render(dest);
			console.log(JSON.stringify({ 'file': item.path.variations + item.png, 'status': status }));
			nextFile();
		});

	}


};

nextFile();
