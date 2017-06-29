
(function() {

var c = document.getElementById('c'),
    hero = c.parentElement,
    width = hero.offsetWidth,
    height = hero.offsetHeight

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 )

var renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(width, height)
c.appendChild(renderer.domElement)

parent = new THREE.Object3D()
scene.add( parent )

//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var geometry = new THREE.Geometry()

function gaussRand() {
    return (Math.random() + Math.random()) / 2
}

var total = 10000
var radius = 6
var diam = radius * 2
var speed = 0.05
var voidRadius = 1.5

for(var v=0; v<total; v++){
  var dot = new THREE.Vector3()
  dot.x = gaussRand() * diam - radius
  dot.y = gaussRand() * diam - radius
  dot.z = gaussRand() * diam - radius
  geometry.vertices.push(dot)
}

var material = new THREE.PointsMaterial({ color: 0x666666, size: 0.02 })
var cube = new THREE.Points(geometry, material)
parent.add(cube)

camera.position.z = 5

var centre = new THREE.Vector3(0,0,0)

function anim() {
  requestAnimationFrame(anim)

  parent.rotation.y += 0.005

  var verts = cube.geometry.vertices
  for(var v=0; v<verts.length; v++){
    var vert = verts[v]
    if(vert.distanceTo(centre) < voidRadius){
      vert.x = gaussRand() * diam - radius
      vert.y = gaussRand() * diam - radius
      vert.z = gaussRand() * diam - radius
    }
    var target = v === verts.length - 1 ? verts[0] : verts[v + 1]
    //moveTo(vert, target, Math.random() * speed)    
    //vert.lerp(target, Math.random() * speed * (1 / vert.distanceTo(target)))
    vert.lerp(target, speed * (1 / vert.distanceTo(target)))
  }  
  cube.geometry.verticesNeedUpdate = true;

  renderer.render(scene, camera)
}
anim()




/*
function surface(r, z) {
    var vert = new THREE.
    return 
}*/

/*
var face
var manager = new THREE.LoadingManager();
var loader = new THREE.OBJLoader( manager );
loader.load( 'INGAME_BASE.obj', function ( object ) {
    console.log(object)
    face = object.children[0].geometry.attributes.position.array
    /*var m = geometry.vertices
    for(var v=0; v<m.length; v++){
        if(v < face.length * 3){
            m[v].x = face[v*3] * 2
            m[v].y = -face[v*3+1] * 2 + 0.5
            m[v].z = face[v*3+2] * 2
        }
    }*/
//})

/*
function surfaceRandom() {
    var index = Math.floor(Math.random() * face.length / 3)
    return new THREE.Vector3(face[index] * 2, -face[index + 1] * 2 + 0.5, face[index + 2] * 2)
    //return new THREE.Vector3(Math.random()*4 - 2, Math.random()*4 - 2, 0)
}

var size = 5
var xCount = yCount = 100

for(var y=0; y<yCount; y++){
    for(var x=0; x<xCount; x++){
        var dot = new THREE.Vector3()

        //dot.x = x * (size / xCount) - (size / 2)
        //dot.y = y * (size / yCount) - (size / 2)
        //dot.z = 2
        dot.x = Math.random() * (size * 2) - size
        dot.y = Math.random() * (size * 2) - size
        dot.z = Math.random() * (size * 2) - size
        geometry.vertices.push(dot)
    }    
}

var material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.02 })
var cube = new THREE.Points(geometry, material)
parent.add( cube );

camera.position.z = 5;

function findClosest(sample) {
    var verts = cube.geometry.vertices
    var winner = 0
    var minDistance = Number.MAX_VALUE
    for(var v=0; v<verts.length; v++){
        var dist = verts[v].distanceTo(sample)
        if(dist < minDistance){
            minDistance = dist
            winner = v
        }
    }
    return { index: winner, distance: minDistance }
}

function gauss(dist, mod) {
    return Math.exp(-(dist * dist) / mod)
}

var gMod = 100


function animate() {
	requestAnimationFrame( animate );

    parent.rotation.y += 0.01

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    /*var verts = cube.geometry.vertices

    for(var v=0; v<verts.length; v++){
        verts[v].x += 0.01 * ((v % 2) - 0.5)
        //varts[v].y
    }

    cube.geometry.verticesNeedUpdate = true;
    */

    // get random point from surface
    /*if(face){
        var sample = surfaceRandom()
    var winner = findClosest(sample)

    var winX = winner.index % xCount
    var winY = Math.floor(winner.index / xCount)

    var verts = cube.geometry.vertices
    for(var y=0; y<yCount; y++){
        for(var x=0; x<xCount; x++){
            var vIndex = y * xCount + x            
            var xDiff = Math.abs(x - winX)
            var yDiff = Math.abs(y - winY)            
            var meshDist = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
            var gaussDist = gauss(meshDist, gMod)
            verts[vIndex].lerp(sample, gaussDist * 0.1)
        }
    }
    //var res = cube.geometry.vertices[winner.index].lerp(sample, 0.01)
    cube.geometry.verticesNeedUpdate = true;

    gMod -= 0.1
    gMod = Math.max(gMod, 5)
    }

    //cube.geometry.verticesNeedUpdate = true


	renderer.render( scene, camera );
}
animate();
*/

}())