(function(){

// === Config === //
var config = {
	density: 15,
	nodeSize: 2,
	voidSize: 70
};

// === Setup === //
var play = true,
	it = 0,
	c = document.getElementById('c'),
	ctx = c.getContext('2d'),
	hero = c.parentElement,
	nodes = [],
	xspeed = hero.offsetWidth / 500,
	yspeed = hero.offsetHeight / 500;

c.width = hero.offsetWidth;
c.height = hero.offsetHeight;
var imgData = ctx.getImageData(0, 0, c.width, c.height);
setNodeStyles('#67ddff');

// Create nodes
addNodes(hero.offsetWidth / config.density * hero.offsetHeight / config.density);

// === Animation loop === //
function animationLoop() {
	for(var n=0; n<nodes.length; n++) {
		nodes[n].move();
	}
	clearCanvas();
	drawNodes();
	it++;
	if(play) {
		requestAnimationFrame(animationLoop);
	}
}
requestAnimationFrame(animationLoop);


// === Node object === //
function Node(x, y, n) {
	this.x = x;
	this.y = y;
	this.index = n;
}

// Move a node
Node.prototype.move = function() {
	// New starting position if we're in the no-go zone
	var xcentre = c.width / 2,
		ycentre = c.height / 2,
		xfromc = Math.abs(this.x - xcentre),
		yfromc = Math.abs(this.y - ycentre);
	if(yfromc < config.voidSize && xfromc + this.y - ycentre < config.voidSize
		|| this.x < 0 || this.y < 0 || this.x > c.width || this.y > c.height) {
		this.x = Math.random() * c.width;
		this.y = Math.random() * c.height;
	} else {
		// Some amount of random
		var moveX = Math.round((Math.random() * 2 - 1) * xspeed);
		var moveY = Math.round((Math.random() * 2 - 1) * yspeed);
		// Attraction to neighbours
		var leftNeighbour = typeof(nodes[this.index - 1]) !== 'undefined' ? nodes[this.index - 1] : nodes[nodes.length - 1];
		moveX += leftNeighbour.x - this.x > 0 ? 1 : -1;
		moveY += leftNeighbour.y - this.y > 0 ? 1 : -1;
		// Update position
		this.x = Math.round(moveX + this.x);
		this.y = Math.round(moveY + this.y);
	}
};

// === Adding / removing nodes === //
function addNodes(numToAdd) {
	for(var n=0; n<numToAdd; n++) {
		var x = Math.round(Math.random() * c.width),
			y = Math.round(Math.random() * c.height);
		nodes.push(new Node(x, y, n));
	}
}
function removeNodes(numToRemove) {
	nodes.splice(0, numToRemove);
}

// === Canvas functions === //

// No need to set these more than once
function setNodeStyles(colour) {
	ctx.fillStyle = '#67ddff';
	//ctx.fillStyle = colour; // #67ffe2 #6789ff
	//ctx.shadowColor = '#67ddff';
	//ctx.shadowBlur = 30;
}

// Function to draw nodes to canvas
function drawNodes() {
	for(var n=0; n<nodes.length; n++) {
		/*
		if(n === 0) {
			setNodeStyles('#67ddff');
		} else if(n === Math.floor(nodes.length / 3)) {
			setNodeStyles('#67b3ff');
		} else if(n === Math.floor(nodes.length / 3 * 2)) {
			setNodeStyles('#67ffe2');
		}
		*/
		ctx.fillRect(nodes[n].x, nodes[n].y, config.nodeSize, config.nodeSize);
	}
}

// Draws nodes by changing the image data directly
// Faster for high number of nodes
function drawBulkNodes() {
	imgData.data.fill(0);
	for(var n=0; n<nodes.length; n++) {
		// Get first pixel's position (don't worry about data structure)
		var firstPixel = nodes[n].y * c.width + nodes[n].x;//nodes[n].x * nodes[n].y * 4;
		var lastInRow = nodes[n].x % c.width === 0;
		var lastInCol = nodes[n].y % c.height === 0;
		// Fill top left pixel
		fillPixel(firstPixel);
		// Top right pixel if not off edge
		if(!lastInRow) {
			fillPixel(firstPixel + 1);
		}
		// Bottom left pixel if not off bottom
		if(!lastInCol) {
			fillPixel(firstPixel + c.width);
			// Bottom right pixel if not off edge
			if(!lastInRow) {
				fillPixel(firstPixel + 1 + c.width);
			}
		}
	}
	ctx.putImageData(imgData, 0, 0);
}

// Fill a single pixel in an imgData array
// @param pixelR index of R value in array
function fillPixel(pixel) {
	pixel *= 4;
	imgData.data[pixel] = 103;
	imgData.data[pixel + 1] = 221;
	imgData.data[pixel + 2] = 255;
	imgData.data[pixel + 3] = 255;
}

// Clears canvas
function clearCanvas() {
	ctx.clearRect(0, 0, c.width, c.height);
}

}());