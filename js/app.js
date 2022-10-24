import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "meshline";
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';



import Renderer from "./Renderer";
import Sizes from "./utils/Sizes";
import Camera from "./Camera";
import Scene from "./Scene";
import audio from "./utils/audio";

export default class Application {
  constructor(_params) {
    this.$canvas = _params.$canvas;

    console.log("INIT APP");
    this.sizes = new Sizes();
    this.scene = new Scene();
    this.renderer = new Renderer(this.$canvas, this.sizes.viewport);

    this.sizes.on("resize", () => {
      const { width, height } = this.sizes.viewport;
      this.renderer.instance.setSize(width, height);
      this.renderer.instance.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      );
    });

    this.lineMesh = null; //Access lineMesh globally
    this.composer = null;

    this.setupCamera();
    this.setupGlow()

    this.setupMesh();


    this.setupAudio();
    this.onFrame();

    // this.onFrame = this.onFrame.bind(this);
  }

  setupConfig() {
    this.config = {};
    this.config.debug = window.location.hash === "#debug";
  }

  setupDebug() {
    if (this.config.debug) {
      this.debug = new GUI({ width: 300 });
    }
  }

  setupCamera() {
    this.camera = new Camera({
      time: this.time,
      sizes: this.sizes,
      debug: this.debug,
      renderer: this.renderer,
    });

    this.scene.instance.add(this.camera.container);


    // this.time.on('tick', () => {
    //     this.renderer.render(this.scene, this.camera.instance);
    // });
  }

  setupGlow() {

    const renderScene = new RenderPass( this.scene.instance, this.camera.instance );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0;
    bloomPass.strength = 2;
    bloomPass.radius = 0.5;

    this.composer = new EffectComposer( this.renderer.instance );

    this.composer.addPass( renderScene );
    this.composer.addPass( bloomPass );
  }

  setupMesh() {
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // let material = new THREE.MeshPhysicalMaterial({
    //   color: 0x444444,
    //   metalness: 0.1,
    //   roughness: 0.5,
    // });
    // let cube = new THREE.Mesh(geometry, material);
    // this.scene.instance.add(cube);

    // LINES

    const segmentLength = 1;
    const nbrOfPoints = 10;
    const points = [];
    const turbulence = 0.5;
    for (let i = 0; i < nbrOfPoints; i++) {
      // ! We have to wrapped points into a THREE.Vector3 this time
      points.push(
        new THREE.Vector3(
          i * segmentLength,
          Math.random() * (turbulence * 2) - turbulence,
          Math.random() * (turbulence * 2) - turbulence
        )
      );
    }

    const linePoints = new THREE.BufferGeometry().setFromPoints(
      new THREE.CatmullRomCurve3(points).getPoints(50)
    );

    const line = new MeshLine();
    line.setGeometry(linePoints);
    const geometry = line.geometry;

    // Build the material with good parameters to animate it.
    const material = new MeshLineMaterial({
      transparent: true,
      lineWidth: 0.1,
      color: new THREE.Color("#ff0000"),
      dashArray: 2, // always has to be the double of the line
      dashOffset: 0, // start the dash at zero
      dashRatio: 0.9, // visible length range min: 0.99, max: 0.5
    });

    // Build the Mesh
    this.lineMesh = new THREE.Mesh(geometry, material);
    this.lineMesh.position.x = -4.5;

    // ! Assuming you have your own webgl engine to add meshes on scene and update them.
    this.scene.instance.add(this.lineMesh);
  }

  setupAudio() {
    function onBeat() {
      console.log("onBeat");
    }

    window.addEventListener('click',(e) => {
      audio.start({
        onBeat: onBeat,
        live: false,
        src: "./static/galvanize.mp3",
        debug: true
      });
    })
  }

  onFrame = () => {
    let self = this;
    // console.log('this.renderer :>> ', this.renderer);
    requestAnimationFrame(this.onFrame);
    this.renderer.render(this.scene.instance, this.camera.instance);

    this.composer.render();

    if (this.lineMesh.material.uniforms.dashOffset.value < -2)
      this.lineMesh.material.uniforms.dashOffset.value = 0;
    this.lineMesh.material.uniforms.dashOffset.value -= 0.01;


    // Decrement the dashOffset value to animate the path with the dash.
  };
}
