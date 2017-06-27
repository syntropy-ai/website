
(function(){

const c = document.getElementById('c'),
  ctx = c.getContext('2d'),
  hero = c.parentElement,
  width = hero.offsetWidth,
  height = hero.offsetHeight,
  xCentre = width / 2,
  yCentre = height / 2,
  xSpeed = width / 500,
  ySpeed = height / 500,
  voidSize = 100,
  density = 17,
  minNodeSize = 1,
  maxNodeSize = 1,
  baseColour = {
    r: 255, g: 255, b: 255
  },
  totalNodes = Math.round(width / density * height / density)

let play = true,
  iter = 0

c.width = width
c.height = height
let imgData = ctx.getImageData(0, 0, width, height)

const gaussianRand = () => {
  var rand = 0
  for (var i = 0; i < 2; i += 1) {
    rand += Math.random()
  }
  return rand / 2
}

const insideVoid = (x, y, xFromC, yFromC) => {
  return yFromC < voidSize && xFromC + y - yCentre < voidSize
}

const outsideBounds = (x, y) => {
  return x < 0 || y < 0 || x >= width || y >= height
}

const updateDistFromCentre = node => {
  node.xFromC = Math.abs(node.x - xCentre)
  node.yFromC = Math.abs(node.y - yCentre)
}

const generateNodes = () => {
  const sizeRange = maxNodeSize - minNodeSize
  const output = new Array(totalNodes)
  for(var i=0; i<totalNodes; ++i){
    const strength = 255//Math.random() * 100 + 155
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
    }
    updateDistFromCentre(output[i])
  }
  output[0].neighbour = output[totalNodes - 1]
  return output
}

const nodes = generateNodes()

const move = node => {
  const { x, y, xFromC, yFromC, neighbour } = node

  if(insideVoid(x, y, xFromC, yFromC) || outsideBounds(x, y)){
    // reset node position
    node.x = Math.random() * width
    node.y = Math.random() * height
  }else{
    // move towards left neighbour at random speed
    /*const moveX = Math.round((Math.random() * 2 - 1) * xSpeed)
    const moveY = Math.round((Math.random() * 2 - 1) * ySpeed)
    node.x += moveX + neighbour.x - x > 0 ? 1 : -1
    node.y += moveY + neighbour.y - y > 0 ? 1 : -1*/
    const dirX = node.x < neighbour.x ? 1 : -1
    const dirY = node.y < neighbour.y ? 1 : -1
    node.x += dirX * (Math.random() * xSpeed)
    node.y += dirY * (Math.random() * ySpeed)
  }

  // update the distance from centres
  updateDistFromCentre(node)
}

const fillPixel = (arrayPos, color) => {
  const p = arrayPos * 4
  const { data } = imgData
  data[p] = color.r
  data[p + 1] = color.g
  data[p + 2] = color.b
  data[p + 3] = 200
}

const paint = node => {
  const x = Math.round(node.x)
  const y = Math.round(node.y)
  const { colour, nodeSize } = node

  const maxLeft = Math.min(x + nodeSize, width)
  const maxTop = Math.min(y + nodeSize, height)
  for(var left=x; left<maxLeft; ++left){
    for(var top=y; top<maxTop; ++top){
      fillPixel(left + (top * width), colour)
    }
  }
}

const processNode = node => {
  // do movement
  move(node)

  // do painting
  paint(node)
}

const clearCanvas = () => {
	ctx.clearRect(0, 0, width, height);
  //imgData.data.fill(0);
  //imgData = ctx.createImageData(width, height);
  imgData = ctx.getImageData(0, 0, width, height)
}

const animLoop = () => {
  // clear the canvas
  clearCanvas()
  // single node work loop
  for(var n=0; n<totalNodes; ++n){
    processNode(nodes[n])
  }
  // paint on the canvas
  ctx.putImageData(imgData, 0, 0)
  iter++
  if(play){
    requestAnimationFrame(animLoop)
  }
}

// start the animation
requestAnimationFrame(animLoop)

})()
