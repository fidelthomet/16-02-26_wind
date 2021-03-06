// CONFIG
var config = {
	canvas: {
		width: 1500,
		height: 420
	},

	img: {
		file: "font1_rg.jpg",
		width: 1500,
		height: 410

	},
	sampleSize: 10, // canvas.width & canvas.height müssen

	orientation: {
		min: 0,
		max: 180
	},
	width: {
		min: 1,
		max: 6
	},
	height: 8,

	opacity: {
		min: 0,
		max: 127
	},

	output: "png" // "png" or "jpg"
}



var img, arrRed, arrGreen, c

function preload() {
	img = loadImage(config.img.file); // Load the image
}

function setup() {
	c = createCanvas(config.canvas.width, config.canvas.height);

	background(255, 255, 255)
	image(img, (config.canvas.width - config.img.width) / 2, (config.canvas.height - config.img.height) / 2);

	loadPixels();

	arrRed = []
	arrGreen = []
	for (var y1 = 0; y1 < height / config.sampleSize; y1++) {
		for (var x1 = 0; x1 < width / config.sampleSize; x1++) {

			var totalRed = totalGreen = 0

			for (var y2 = 0; y2 < config.sampleSize; y2++) {
				for (var x2 = 0; x2 < config.sampleSize; x2++) {
					totalRed += pixels[getPixel(x1 * config.sampleSize, y1 * config.sampleSize) + getPixel(x2, y2) + 1]
					totalGreen += pixels[getPixel(x1 * config.sampleSize, y1 * config.sampleSize) + getPixel(x2, y2)]
				}
			}
			arrRed.push(Math.round(totalRed / (config.sampleSize * config.sampleSize)))
			arrGreen.push(Math.round(totalGreen / (config.sampleSize * config.sampleSize)))
		}
	}

	updatePixels();

	background(255)
	angleMode(DEGREES)
	noStroke();
	fill(0)
	for (var x1 = 0; x1 < width / config.sampleSize; x1++) {
		for (var y1 = 0; y1 < height / config.sampleSize; y1++) {
			push()
			translate(x1 * config.sampleSize + config.sampleSize / 2, y1 * config.sampleSize + config.sampleSize / 2)
			var size = map(arrRed[x1 + y1 * (width / config.sampleSize)], 255, 0, config.width.min, config.width.max)
			var filly = map(arrRed[x1 + y1 * (width / config.sampleSize)], 0, 255, config.opacity.min, config.opacity.max)
			var deg = map(arrGreen[x1 + y1 * (width / config.sampleSize)], 0, 255, config.orientation.min, config.orientation.max)

			fill(filly)
			rotate(deg)
			rect(-(size / 2), -(config.height / 2), size, config.height)
			pop()
		}
	}

	svg()
}


function svg() {
	var chart = d3.select("body")
		.append("svg")
		.attr("width", config.canvas.width)
		.attr("height", config.canvas.height)


	for (var x1 = 0; x1 < width / config.sampleSize; x1++) {
		for (var y1 = 0; y1 < height / config.sampleSize; y1++) {
			var size = map(arrRed[x1 + y1 * (width / config.sampleSize)], 255, 0, config.width.min, config.width.max)
			var filly = map(arrRed[x1 + y1 * (width / config.sampleSize)], 0, 255, 1-config.opacity.min/255, 1-config.opacity.max/255)
			var deg = map(arrGreen[x1 + y1 * (width / config.sampleSize)], 0, 255, config.orientation.min, config.orientation.max)

			chart.append("g")
				.attr('transform', 'translate(' + (x1 * config.sampleSize + config.sampleSize / 2) + ',' + (y1 * config.sampleSize + config.sampleSize / 2) + ') rotate('+deg+')')
				.append('rect')
				.attr('x', -(size / 2))
				.attr('y', -(config.height / 2))
				.attr('width', size)
				.attr('height', config.height)
				.attr("fill", "rgba(0,0,0,"+filly+")")

				

		}
	}
}

function button() {
	document.querySelector("#b1").addEventListener("click", function() {
		saveCanvas(c, 'wind-' + (new Date().getTime()), config.output);
	})
	document.querySelector("#b2").addEventListener("click", function() {
		download('wind-' + (new Date().getTime())+'.svg', document.querySelector("svg").outerHTML)
	})
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

if (document.readyState != 'loading') {
	button();
} else {
	document.addEventListener('DOMContentLoaded', button);
}


function getPixel(x, y) {
	return (x * 4) + (y * width * 4)
}

function draw() {
	// Displays the image at its actual size at point (0,0)

}