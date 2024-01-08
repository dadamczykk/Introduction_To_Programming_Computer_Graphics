// import * as THREE from './libs/THREE.js';
import Flock from './flock.js';
import {utils} from './utils.js';


var scene, camera, renderer, controls, flock, light;
var obstacles = [];
var clock;
const birdsNo = 500;
const boxSize = 500;

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);


// Point Light
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(0, 10, 0);


// Spot Light
const spotLight = new THREE.SpotLight(0x00ff00, 1, 100, Math.PI / 4, 1);
spotLight.position.set(0, 10, 0);

const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
hemisphereLight.position.set(0, 400, 0);

var movement = true;

const getRandomNumber = (min, max) => Math.random() * (max - min) + min;
const numShapes = 7;
const shapeRadiusMin = 50;
const shapeRadiusMax = 70;

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera.position.z = 500;

	renderer = new THREE.WebGLRenderer({antialias: true})

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.minDistance = 100;
	controls.maxDistance = 1000;
	controls.maxPolarAngle = Math.PI / 2;

	scene.add(new THREE.AmbientLight(555555, 0.5));
	scene.background = new THREE.Color(0xC0C0C0);

	light = new THREE.PointLight(0xffffff, 0.5, 500);
	light.position.set(0, 100, 0);
	scene.add(light);

	scene.add(directionalLight);
	scene.add(pointLight);
	scene.add(spotLight);
	scene.add(hemisphereLight);

	

// Function to generate a random number between min and max
	

	// Create 10 randomly placed shapes (spheres, boxes, and cones)


	for (let i = 0; i < numShapes; i++) {
	let geometry;
	const rand = Math.random();
	if (rand < 0.33) {
		geometry = new THREE.SphereGeometry(getRandomNumber(shapeRadiusMin, shapeRadiusMax), 32, 32);
	} else if (rand < 0.66) {
		geometry = new THREE.BoxGeometry(getRandomNumber(shapeRadiusMin * 1.5, shapeRadiusMax * 1.5), getRandomNumber(shapeRadiusMin * 1.5, shapeRadiusMax * 1.5), getRandomNumber(shapeRadiusMin * 1.5, shapeRadiusMax * 1.5));
	} else {
		geometry = new THREE.ConeGeometry(getRandomNumber(shapeRadiusMin, shapeRadiusMax), getRandomNumber(shapeRadiusMin * 2, shapeRadiusMax * 2), 32);
	}

	const material = new THREE.MeshNormalMaterial(); // Normal material for visualization

	const shape = new THREE.Mesh(geometry, material);
	shape.position.x = getRandomNumber(-boxSize / 2, boxSize / 2);
	shape.position.y = getRandomNumber(-boxSize / 2, boxSize / 2);
	shape.position.z = getRandomNumber(-boxSize / 2, boxSize / 2);

	shape.velocity = new THREE.Vector3(getRandomNumber(-1, 1), getRandomNumber(-1, 1), getRandomNumber(-1, 1));
	shape.rotationVelocity = new THREE.Vector3(getRandomNumber(0.01, 0.02), getRandomNumber(0.01, 0.02), getRandomNumber(0.01, 0.02));



	obstacles.push(shape);
	scene.add(shape);
	}


	flock = new Flock(scene, birdsNo, obstacles);

	// flock.birds.forEach(bird => {
	// 	scene.add(bird.mesh);
	// });

	clock = new THREE.Clock();


}

var cnt = 0;



const animateLights = () => {
  const time = Date.now() * 0.001; // Time-based movement for animation

  // Move the directional light in a circle
  const directionalX = Math.sin(time) * 5;
  const directionalZ = Math.cos(time) * 5;
  directionalLight.position.set(directionalX, 5, directionalZ);

  // Move the point light up and down
  const pointY = Math.sin(time * 2) * 5 + 10;
  pointLight.position.setY(pointY);

  // Move the spot light in a circular path
  const spotX = Math.sin(time * 1.5) * 8;
  const spotZ = Math.cos(time * 1.5) * 8;
  spotLight.position.set(spotX, 5, spotZ);

}

function update(delta){
	cnt += 0.001;
	flock.update(delta);

}

function render() {
	var delta = clock.getDelta();
	update(delta);
	renderer.render(scene, camera);
}

var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


var animate = function() {
	requestAnimationFrame(animate);
	stats.begin();
	if (movement){
		obstacles.forEach((shape) => {
		shape.position.add(shape.velocity);
	
		// Keep shapes within the box
		if (shape.position.x < -boxSize / 2 || shape.position.x > boxSize / 2) {
		  shape.velocity.x *= -1;
		}
		if (shape.position.y < -boxSize / 2 || shape.position.y > boxSize / 2) {
		  shape.velocity.y *= -1;
		}
		if (shape.position.z < -boxSize / 2 || shape.position.z > boxSize / 2) {
		  shape.velocity.z *= -1;
		}
		
	
		shape.rotation.x += shape.rotationVelocity.x;
		shape.rotation.y += shape.rotationVelocity.y;
		shape.rotation.z += shape.rotationVelocity.z;
	  });
	}
	animateLights();
	controls.update();
	stats.end();
	render();
}

window.addEventListener('resize', function () {
	const width = window.innerWidth;
	const height = window.innerHeight;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});


init(); 

const gui = new dat.GUI();

const flockFolder = gui.addFolder('Flock Settings');

flockFolder.add(flock, 'birdsNo', 50, 1000).name('Number of Birds').step(20).onChange((value) => {
	flock.changeBirdsNo(value);
  });
  

flockFolder.add(flock, 'alignmentWeight', 0, 4).name('Alignment').step(0.1).onChange((value) => {
  flock.changeAlignment(value);
});

flockFolder.add(flock, 'cohesionWeight', 0, 4).name('Cohesion').step(0.1).onChange((value) => {
	flock.changeCohesion(value);
});

flockFolder.add(flock, 'separationWeight', 0, 4).name('Separation').step(0.1).onChange((value) => {
	flock.changeSeparation(value);
});

flockFolder.add(flock, 'maxSpeed', 1, 8).name('Max Speed').step(0.1).onChange((value) => {
  flock.changeMaxSpeed(value);
});

flockFolder.add(flock, 'minSpeed', 1, 8).name('Max Speed').step(0.1).onChange((value) => {
	flock.changeMinSpeed(value);
});
  
flockFolder.open();

const shapesSettings = gui.addFolder('Shapes Settings');

shapesSettings.add({ movement: movement }, 'movement').name('Toggle Movement').onChange((value) => {
	movement = value;
	// Logic for controlling movement goes here
	console.log("Movement:", movement);
  });

function addShape(){
	let geometry;
	const rand = Math.random();
	if (rand < 0.33) {
		geometry = new THREE.SphereGeometry(getRandomNumber(shapeRadiusMin, shapeRadiusMax), 32, 32);
	} else if (rand < 0.66) {
		geometry = new THREE.BoxGeometry(getRandomNumber(shapeRadiusMin * 1.5, shapeRadiusMax * 1.5), getRandomNumber(shapeRadiusMin * 1.5, shapeRadiusMax * 1.5), getRandomNumber(shapeRadiusMin * 1.5, shapeRadiusMax * 1.5));
	} else {
		geometry = new THREE.ConeGeometry(getRandomNumber(shapeRadiusMin, shapeRadiusMax), getRandomNumber(shapeRadiusMin * 2, shapeRadiusMax * 2), 32);
	}
	flock.firstTry = true;

	const material = new THREE.MeshNormalMaterial(); // Normal material for visualization

	const shape = new THREE.Mesh(geometry, material);
	shape.position.x = getRandomNumber(-boxSize / 2, boxSize / 2);
	shape.position.y = getRandomNumber(-boxSize / 2, boxSize / 2);
	shape.position.z = getRandomNumber(-boxSize / 2, boxSize / 2);

	shape.velocity = new THREE.Vector3(getRandomNumber(-1, 1), getRandomNumber(-1, 1), getRandomNumber(-1, 1));
	shape.rotationVelocity = new THREE.Vector3(getRandomNumber(0.01, 0.02), getRandomNumber(0.01, 0.02), getRandomNumber(0.01, 0.02));

	obstacles.push(shape)
	scene.add(shape)
}

function removeShape() {
	if (obstacles.length > 0) {
	  const shapeToRemove = obstacles.pop();
	  scene.remove(shapeToRemove);
	}
  }

shapesSettings.add({ 'Add Shape': () => addShape() }, 'Add Shape');
shapesSettings.add({ 'Remove Shape': () => removeShape() }, 'Remove Shape');


shapesSettings.open();



animate();

