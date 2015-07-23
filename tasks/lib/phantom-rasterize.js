var fs = require('fs'),
	system = require('system'),
	page = require('webpage').create(),
	items = JSON.parse(system.stdin.read()),
	total = items.length,
	next = 0,
	file, svgdata, frag, svg, width, height;


var nextFile = function () {
	var item;

	if (next >= total) {
		phantom.exit(0);
		return;
	}

	item = items[next++];

	var src = item.path.src + item.svg;
	var dest = item.path.dest + item.png;

	svgdata = fs.read(src) || '';

	frag = window.document.createElement('div');
	frag.innerHTML = svgdata;

	svg = frag.querySelector('svg');

	width = svg.getAttribute('width');
	height = svg.getAttribute('height');
	if (!width && !height) {
		var viewbox = svg.getAttribute('viewBox');
		var dimensions = viewbox.split(' ');
		width = dimensions[2] - dimensions[0];
		height = dimensions[3] - dimensions[1];
	}
	page.viewportSize = {
		width: parseFloat(width),
		height: parseFloat(height)
	};


	item.folder = item.path.variations;
	item.generated = item.folder + item.png;

	page.open(src, function (status) {
		//page.evaluate(function(){
		//	document.querySelector('svg').style.fill = '#12f';
		//});
		page.render(dest);
		console.log(JSON.stringify({ 'file': item, 'status': status }));
		nextFile();
	});

};

nextFile();
