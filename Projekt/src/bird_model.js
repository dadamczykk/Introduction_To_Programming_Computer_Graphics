import { GLTFLoader } from './libs/jsm/loaders/GLTFLoader.js';
import {utils} from './utils.js';




export default class BirdModel{
    
    constructor(position = new THREE.Vector3(0,0,0), scene){
        var parrot = new THREE.Group();
        var mixers = [];
        const loader = new GLTFLoader();
        this.group = parrot
        const myArray = ['./models/Parrot.glb', './models/Stork.glb', './models/Flamingo.glb'];

        const randomIndex = Math.floor(Math.random() * myArray.length);
        const randomElement = myArray[randomIndex];

        loader.load( randomElement, function ( gltf ) {

            const mesh = gltf.scene.children[ 0 ];

            const s = 0.27;
            mesh.scale.set( s, s, s );

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // scene.add( mesh );

            parrot.add(mesh);

            const mixer = new THREE.AnimationMixer( mesh );
            mixer.clipAction( gltf.animations[ 0 ] ).setDuration( Math.random() *2 + 0.3 ).play();
  
            mixers.push( mixer );

        } );




        // loadModel();

        // // while(loaded == 1){
        // //     console.log(loaded);
        // // }
        // console.log(loaded);
        
        var geometry = new THREE.ConeGeometry(5, 10, 8);
        geometry.rotateX(THREE.Math.degToRad(90));

        var meshMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true})

        var mesh = new THREE.Mesh(geometry, meshMaterial);
        
        mesh.position.copy(position);
        // scene.add(mesh);
        this.group.position.copy(position)
        // scene.add(this.group);
        
        // console.log(group);
        return [mesh, geometry, this.group, mixers]

    }





    

}
