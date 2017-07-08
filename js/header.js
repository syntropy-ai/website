
(function() {

// Settings and vars
var c = document.getElementById('c'),
    hero = c.parentElement,
    width = hero.offsetWidth,
    height = hero.offsetHeight,
    density = 15,
    radius = 6,
    diam = radius * 2,
    speed = 0.025,
    vertSize = 0.03,
    rotationSpeed = 0.002,
    voidRadius = 1.5,
    total = Math.round(width / density * height / density)

// Three objects
var scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 ),
    sprite = new THREE.TextureLoader().load( "textures/disc.png" ),
    renderer = new THREE.WebGLRenderer({ alpha: true }),
    geometry = new THREE.Geometry(),
    parent = new THREE.Object3D(),
    material = new THREE.PointsMaterial({ size: vertSize, map: sprite, alphaTest: 0.7, transparent: true }),
    centre = new THREE.Vector3(0,0,0),
    cube = new THREE.Points(geometry, material)

// Setup scene
renderer.setSize(width, height)
c.appendChild(renderer.domElement)
scene.add(parent)
parent.add(cube)
camera.position.z = 5

// Create verts
for(var v=0; v<total; v++){
  var dot = new THREE.Vector3()
  dot.x = gaussRand() * diam - radius
  dot.y = gaussRand() * diam - radius
  dot.z = gaussRand() * diam - radius
  geometry.vertices.push(dot)
}

// Animation loop
function anim() {
  requestAnimationFrame(anim)

  parent.rotation.y += rotationSpeed

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
    vert.lerp(target, gaussRand() * speed * (1 / vert.distanceTo(target)))
    //vert.lerp(target, speed * (1 / vert.distanceTo(target)))
  }  
  cube.geometry.verticesNeedUpdate = true;

  renderer.render(scene, camera)
}
anim()

// Fade in the canvas
c.style.opacity = '1'

function gaussRand() {
    return (Math.random() + Math.random()) / 2
}

}())