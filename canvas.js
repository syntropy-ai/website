'use strict';

(function () {

  var c = document.getElementById('c'),
      ctx = c.getContext('2d'),
      hero = c.parentElement,
      width = hero.offsetWidth,
      height = hero.offsetHeight,
      xCentre = width / 2,
      yCentre = height / 2,
      xSpeed = width / 500,
      ySpeed = height / 500,
      voidSize = 70,
      density = 13,
      minNodeSize = 1,
      maxNodeSize = 1,
      baseColour = {
    r: 255, g: 255, b: 255
  },
      totalNodes = Math.round(width / density * height / density);

  var play = true,
      iter = 0;

  c.width = width;
  c.height = height;
  var imgData = ctx.getImageData(0, 0, width, height);

  var gaussianRand = function gaussianRand() {
    var rand = 0;
    for (var i = 0; i < 2; i += 1) {
      rand += Math.random();
    }
    return rand / 2;
  };

  var insideVoid = function insideVoid(x, y, xFromC, yFromC) {
    return yFromC < voidSize && xFromC + y - yCentre < voidSize;
  };

  var outsideBounds = function outsideBounds(x, y) {
    return x < 0 || y < 0 || x >= width || y >= height;
  };

  var updateDistFromCentre = function updateDistFromCentre(node) {
    node.xFromC = Math.abs(node.x - xCentre);
    node.yFromC = Math.abs(node.y - yCentre);
  };

  var generateNodes = function generateNodes() {
    var sizeRange = maxNodeSize - minNodeSize;
    var output = new Array(totalNodes);
    for (var i = 0; i < totalNodes; ++i) {
      var strength = 255; //Math.random() * 100 + 155
      output[i] = {
        x: gaussianRand() * width,
        y: gaussianRand() * height,
        nodeSize: Math.round(Math.random() * sizeRange + minNodeSize),
        /*colour: {
          ...baseColour
        },*/
        colour: {
          r: strength,
          g: strength,
          b: strength
        },
        neighbour: i > 0 ? output[i - 1] : null
      };
      updateDistFromCentre(output[i]);
    }
    output[0].neighbour = output[totalNodes - 1];
    return output;
  };

  var nodes = generateNodes();

  var move = function move(node) {
    var x = node.x,
        y = node.y,
        xFromC = node.xFromC,
        yFromC = node.yFromC,
        neighbour = node.neighbour;


    if (insideVoid(x, y, xFromC, yFromC) || outsideBounds(x, y)) {
      // reset node position
      node.x = Math.random() * width;
      node.y = Math.random() * height;
    } else {
      // move towards left neighbour at random speed
      /*const moveX = Math.round((Math.random() * 2 - 1) * xSpeed)
      const moveY = Math.round((Math.random() * 2 - 1) * ySpeed)
      node.x += moveX + neighbour.x - x > 0 ? 1 : -1
      node.y += moveY + neighbour.y - y > 0 ? 1 : -1*/
      var dirX = node.x < neighbour.x ? 1 : -1;
      var dirY = node.y < neighbour.y ? 1 : -1;
      node.x += dirX * (Math.random() * xSpeed);
      node.y += dirY * (Math.random() * ySpeed);
    }

    // update the distance from centres
    updateDistFromCentre(node);
  };

  var fillPixel = function fillPixel(arrayPos, color) {
    var p = arrayPos * 4;
    var _imgData = imgData,
        data = _imgData.data;

    data[p] = color.r;
    data[p + 1] = color.g;
    data[p + 2] = color.b;
    data[p + 3] = 180;
  };

  var paint = function paint(node) {
    var x = Math.round(node.x);
    var y = Math.round(node.y);
    var colour = node.colour,
        nodeSize = node.nodeSize;


    var maxLeft = Math.min(x + nodeSize, width);
    var maxTop = Math.min(y + nodeSize, height);
    for (var left = x; left < maxLeft; ++left) {
      for (var top = y; top < maxTop; ++top) {
        fillPixel(left + top * width, colour);
      }
    }
  };

  var processNode = function processNode(node) {
    // do movement
    move(node);

    // do painting
    paint(node);
  };

  var clearCanvas = function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
    //imgData.data.fill(0);
    //imgData = ctx.createImageData(width, height);
    imgData = ctx.getImageData(0, 0, width, height);
  };

  var animLoop = function animLoop() {
    // clear the canvas
    clearCanvas();
    // single node work loop
    for (var n = 0; n < totalNodes; ++n) {
      processNode(nodes[n]);
    }
    // paint on the canvas
    ctx.putImageData(imgData, 0, 0);
    iter++;
    if (play) {
      requestAnimationFrame(animLoop);
    }
  };

  // start the animation
  requestAnimationFrame(animLoop);
})();
