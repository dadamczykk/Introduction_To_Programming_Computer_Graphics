
import Bird from './bird.js'
import {utils} from './utils.js'


export default class Flock{
    constructor(scene, birdsNo = 1000, obstacles){
        this.birdsNo = birdsNo;
        this.scene = scene;
        this.initBirds(scene, birdsNo);

        this.obstacles = obstacles;

        this.maxSpeed = 4;
        this.minSpeed = 2;
        this.alignmentWeight = 2;
        this.separationWeight = 2;
        this.cohesionWeight = 2;
        this.firstTry = true;
    }

    initBirds(scene, birdsNo){
        this.birds = [];

        this.mixers = [];

        var x, y, z;

        for (let i = 0; i < birdsNo; i++) {
            x = utils.getRandomArbitrary(-200, 200);
            y = utils.getRandomArbitrary(-200, 200);
            z = utils.getRandomArbitrary(-200, 200);

            var startPos = new THREE.Vector3(x, y, z)

            this.birds.push(new Bird(scene, startPos, startPos, this.mixers));

        }
    }

    update(delta) {
        this.birds.forEach(bird => {
            bird.update(delta, this.birds, this.obstacles)
        })


    }

    changeBirdsNo(newVal){
        if (this.firstTry){
            for(var i = 0; i < 100; i++){
                var x = utils.getRandomArbitrary(-200, 200);
                var y = utils.getRandomArbitrary(-200, 200);
                var z = utils.getRandomArbitrary(-200, 200);
                console.log(this.birds.length)
                var startPos = new THREE.Vector3(x, y, z)
                const bird = new Bird(this.scene, startPos, startPos, this.mixers)
                
                this.birds.push(bird);
                this.birdsNo++;
                
            }
            while (this.birds.length > 80){
                const toremove = this.birds.pop();
                this.scene.remove(toremove.mesh);
                this.scene.remove(toremove.parrot);
                this.birdsNo--;
                this.mixers.pop();

            }
            this.firstTry=false;
        }
        while (newVal < this.birds.length){
            const toremove = this.birds.pop();
            this.scene.remove(toremove.mesh);
            this.scene.remove(toremove.parrot);
            this.birdsNo--;
            this.mixers.pop();

        }
        while (newVal > this.birds.length){
            var x = utils.getRandomArbitrary(-200, 200);
            var y = utils.getRandomArbitrary(-200, 200);
            var z = utils.getRandomArbitrary(-200, 200);
            console.log(this.birds.length)
            var startPos = new THREE.Vector3(x, y, z)
            const bird = new Bird(this.scene, startPos, startPos, this.mixers)

            bird.maxSpeed=this.maxSpeed;
            bird.minSpeed=this.minSpeed;
            bird.alignmentWeight=this.alignmentWeight;
            bird.separationWeight=this.separationWeight;
            bird.cohesionWeight=this.cohesionWeight;
            
            this.birds.push(bird);
            this.birdsNo++;
            // this.scene.add(bird.mesh)
        }
        // if (this.firstTry)
    }

    changeAlignment(newVal) {
        console.log(newVal);
        this.birds.forEach(bird =>
            bird.alignmentWeight = newVal)
    }

    changeSeparation(newVal) {
        this.birds.forEach(bird =>
            bird.separationWeight = newVal)
    }

    changeCohesion(newVal) {
        this.birds.forEach(bird =>
            bird.cohesionWeight = newVal)
    }

    changeMinSpeed(newVal) {
        this.birds.forEach(bird =>
            bird.minSpeed = newVal)
    }

    changeMaxSpeed(newVal) {
        this.birds.forEach(bird =>
            bird.maxSpeed = newVal)
    }
}


