import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {FlakesTexture} from './FlakesTexture';
import {RGBELoader} from './RGBELoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Texture } from 'three';


//SCENE, CAMERA, RENDERER

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );


camera.position.setZ(6.5);

renderer.render( scene, camera );

//SET UP LIGHTS

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(25,12,12)

scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff)
pointLight2.position.set(-20, -120, -120)

scene.add(pointLight2);


const ambientLight = new THREE.AmbientLight(0xcfe2f3)
ambientLight.intensity = 0.25
//scene.add(ambientLight)


/*
const loader = new GLTFLoader();
loader.load( 'Sting-Sword.glb', function ( gltf ) {
  scene.add ( gltf.scene );
}, undefined, function (error) {
  console.error(error);
} ); 
*/

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (url, item, total) => {
  console.log('started loading');
}
loadingManager.onProgress = (url, loaded, total) => {
  console.log('started loading ',url, total)
}
loadingManager.onLoad = () => {
  console.log('finished loading');
  scene.background = spaceTexture;
  scene.add(torus1)
  scene.add(moon)
  scene.add(cat)
}

const controls = new OrbitControls( camera, renderer.domElement )

//CREATE MAIN TORUS

const torusTexture = new THREE.CanvasTexture(new FlakesTexture())
torusTexture.wrapS = THREE.RepeatWrapping;
torusTexture.wrapT = THREE.RepeatWrapping;
torusTexture.repeat.x = 50;
torusTexture.repeat.y = 20;

const t1geometry = new THREE.TorusGeometry( 7, 0.5, 50, 150 );
const t1material = new THREE.MeshPhysicalMaterial( {
  color: 0xc90076, 
  emissive: 0x20124d,
  emissiveIntensity: 0.01,
  roughness: 0.1,
  metalness: 0.9,
  reflectivity: 0.9,
  flatShading: false,
  normalMap: torusTexture
  } );
const torus1 = new THREE.Mesh( t1geometry, t1material );



//CREATE STARS

function addStar() {
  const geometry = new THREE.SphereGeometry( 0.25, 20, 20 );
  const material = new THREE.MeshStandardMaterial( 
    { 
      color: 0xd5a6bd,
      roughness: 0.5,
      metalness: 0.2,
      emissive: 0xcfe2f3,
      emissiveIntensity: 0.7,
      flatShading: true,
    } 
  );


  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100, 10) );

  star.position.set(x,y,z),
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//BACKGROUND

const spaceTexture = new THREE.TextureLoader(loadingManager).load('blue-nebula.jpg');


//CENTERPIECE

const catTexture = new THREE.TextureLoader(loadingManager).load("cat-img.jpg");
const cat = new THREE.Mesh(
  new THREE.BoxGeometry(4, 4, 4),
  new THREE.MeshBasicMaterial( { map: catTexture } )
)


//CREATE MOON

const moonTexture = new THREE.TextureLoader(loadingManager).load('moon.jpg');
const moonNormal = new THREE.TextureLoader(loadingManager).load('moon-normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( { 
    map: moonTexture,
    normalMap: moonNormal
   } )
)
moon.position.set(-12, 5, 10)


//SCROLLING FUNCTION

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += .1;
  moon.rotation.y += .0075;
  moon.rotation.z += .05;

 
  cat.rotation.x += .02;
  cat.rotation.y += .02;
  cat.rotation.z += .001;
  

  camera.position.z = 6.5 + t * -0.01;
  camera.position.x = t * -0.001;
  camera.position.y = t * 0.01;

  }
document.body.onscroll = moveCamera

//ANIMATION LOOP

function animate(){
  requestAnimationFrame(animate);

  torus1.rotation.x += .001;
  torus1.rotation.y += .005;
  torus1.rotation.z += .0001;  

  controls.update()

  renderer.render( scene, camera );
}

animate()