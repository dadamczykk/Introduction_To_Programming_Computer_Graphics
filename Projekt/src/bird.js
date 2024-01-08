
import BirdModel from "./bird_model.js"
import {utils} from './utils.js';


const middle = new THREE.Vector3(0,0,0);

export default class Bird {
    constructor(scene, target, position, mixers) {
        this.scene = scene;
        this.target = target;

        const aa = new BirdModel(position, scene, mixers);

        this.mesh = aa[0];
        this.geometry = aa[1];
        this.parrot = aa[2];
        this.mixers = aa[3];
        scene.add(this.parrot);

        this.acceleration = new THREE.Vector3();

        this.velocity = new THREE.Vector3(utils.getRandomArbitrary(-1,1), utils.getRandomArbitrary(-1,1), utils.getRandomArbitrary(-1,1));
        
        this.maxSpeed = 4;
        this.minSpeed = 2;
        this.range = 50;
        this.boxSideLen = 400;
        this.alignmentWeight = 4;
        this.separationWeight = 3;
        this.cohesionWeight = 2;
        this.boundry = 500;
        this.wanderCnt = 0;
        this.wanderWeight = 1;
        this.bir

    }

    alignment(delta, neighbours){
        const avgDir = new THREE.Vector3();

        neighbours.forEach(neighbour => {
            avgDir.add(neighbour.velocity.clone());
        })

        if (neighbours.length > 0){
            avgDir.divideScalar(neighbours.length);
            avgDir.normalize().multiplyScalar(this.maxSpeed);
        }

        return avgDir.sub(this.velocity).clampLength(0, delta * 5);

    }

    cohesion(delta, neighbours){
        var massCentre = new THREE.Vector3();

        neighbours.forEach(neighbour => {
            massCentre.add(neighbour.mesh.position);
        });

        if (neighbours.length > 0){
            return massCentre.divideScalar(neighbours.length).sub(this.mesh.position).normalize().multiplyScalar(this.maxSpeed).sub(this.velocity).clampLength(0, 5*delta);
        }
        return massCentre;

    }

    separation(delta, neighbours){
        var steer = new THREE.Vector3();

        neighbours.forEach(neighbour => {
            
            var diff = this.mesh.position.clone().sub(neighbour.mesh.position);
            diff.divideScalar(neighbour.mesh.position.distanceTo(this.mesh.position));
            steer.add(diff);
        });

        if (neighbours.length > 0){
            steer.divideScalar(neighbours.length).normalize().multiplyScalar(this.maxSpeed).clampLength(0, delta * 5);
        }
        return steer;
    }

    steerTo(delta) {
        var dst = this.mesh.position.distanceTo(this.target);
        if (dst < 10 || this.wanderCnt > 350) {
            this.target = new THREE.Vector3(utils.getRandomArbitrary(-300,300), utils.getRandomArbitrary(-300,300), utils.getRandomArbitrary(-300,300))
            this.wanderCnt = 0;
        }

        return this.target.clone().sub(this.mesh.position).normalize().multiplyScalar(this.maxSpeed).sub(this.velocity).clampLength(0, delta * 5);

    }



    update(delta, birds, obstacles){
        // console.log(this.mesh.position, middle)
        this.acceleration.add(this.steerTo(delta).multiplyScalar(this.mesh.position.distanceTo(middle) > this.boundry ? 20 : this.wanderWeight))


        var neighbours = birds.filter(bird =>
            (bird.mesh.id != this.mesh.id)
            && (bird.mesh.position.distanceTo(this.mesh.position) < this.range)
            );

        this.acceleration.add(this.alignment(delta, neighbours).multiplyScalar(this.alignmentWeight));
        
        this.acceleration.add(this.cohesion(delta, neighbours).multiplyScalar(this.cohesionWeight));

        this.acceleration.add(this.separation(delta, neighbours).multiplyScalar(this.separationWeight));

        
    var origin = this.mesh.position.clone();

    var direction = this.geometry.vertices[0].clone().applyMatrix4(this.mesh.matrix).sub(this.mesh.position);
    var raycaster = new THREE.Raycaster(origin, direction.clone().normalize(), 0, 150);

    


    var collisions = raycaster.intersectObjects(obstacles);

    if (collisions.length > 0) {

      for (var i = 0; i < utils.collisionsHelper.length; i++) {
        const direction = utils.collisionsHelper[i]
        raycaster = new THREE.Raycaster(origin, direction, 0, 150);
        var newCollisions = raycaster.intersectObject(collisions[0].object)
        if (newCollisions.length === 0) {
          this.acceleration.add(direction.clone().multiplyScalar(100))
          break
        }
      }
    }



        var dir = this.velocity.clone();
        dir.add(this.mesh.position);
        this.mesh.lookAt(dir);
        if (this.parrot != undefined){
        this.parrot.lookAt(dir);}



        this.velocity.add(this.acceleration);
        this.acceleration.set(0,0,0);
        this.velocity.clampLength(this.minSpeed, this.maxSpeed);
        this.mesh.position.add(this.velocity)
        if (this.parrot != undefined){
        this.parrot.position.add(this.velocity);}

        if (this.mixers.length > 0){
            this.mixers[0].update(delta);
        }
    }
}