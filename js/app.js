import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import * as GeometryUtils from "three/addons/utils/GeometryUtils.js";

import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

import * as dat from "dat.gui";
import Renderer from "./Renderer";
import Sizes from "./utils/Sizes";
import Camera from "./Camera";
import Scene from "./Scene";
import audio from "./utils/audio";
import { Data3DTexture, WireframeGeometry } from "three";
import String from "./String";

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
    this.gui = null;
    this.audio = audio;


    this.setupGUI();

    this.setupCamera();
    this.setupGlow();

    this.setupMesh();

    this.setupAudio();
    this.onFrame();

    // this.onFrame = this.onFrame.bind(this);
  }

  setupConfig() {
    this.config = {};
    this.config.debug = window.location.hash === "#debug";
  }

  setupGUI() {
    this.gui = new dat.GUI();
    let fSettings = this.gui.addFolder("Settings");
    fSettings.open();
  }

  setupCamera() {
    this.camera = new Camera({
      time: this.time,
      sizes: this.sizes,
      gui: this.gui,
      renderer: this.renderer,
    });

    this.scene.instance.add(this.camera.container);

    // this.time.on('tick', () => {
    //     this.renderer.render(this.scene, this.camera.instance);
    // });
  }

  setupGlow() {
    const renderScene = new RenderPass(
      this.scene.instance,
      this.camera.instance
    );

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 2;
    bloomPass.radius = 0.5;

    this.composer = new EffectComposer(this.renderer.instance);

    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
  }

  setupMesh() {

// Cube
    // const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(cubeGeometry, material);
    // this.scene.instance.add(cube);

// Line


    const stringPositions = [];
    const stringColors = [];
    const divisions = 100;

    for (let i = 0; i < divisions; i++) {
      stringPositions.push((i / divisions) * 100, 0, 0);
      stringColors.push(1, 1, 1);
    }

    const strings = [];
    const LINE_NB = 6;

    const group = new THREE.Group();
    
    for (let j = 0; j < LINE_NB; j++) {

      const string = new String({
        colors: stringColors,
        positions: stringPositions
      })

      string.position.z = j

      group.add( string );
    }
    
    

    this.scene.instance.add(group);

    // const positions = [];
    // const colors = [];

    // const divisions = 100;


    // for (let j = 0; j < divisions; i++) {
    //   positions.push((i / divisions) * 100, 0, 0);
    //   colors.push(1, 1, 1);
    // }

    // const geometry = new LineGeometry();
    // geometry.setPositions(positions);
    // geometry.setColors(colors);

    // let matLine = new LineMaterial({
    //   color: 0xffffff,
    //   linewidth: 0.01, // in world units with size attenuation, pixels otherwise
    //   dashed: false,
    //   // alphaToCoverage: true,
    // });

    // let line = new Line2(geometry, matLine);
    // line.computeLineDistances();
    // line.scale.set(1, 1, 1);
    // line.position.z = 10;
    // line.position.x = -50;

    // line.frustumCulled = false;
    // this.scene.instance.add(line);

    // let matLine = new LineMaterial( {
    //   color: 0xffffff,
    //   linewidth: 5,
    // } );

    // const material = new THREE.LineBasicMaterial({
    //   color: 0x0000ff
    // });

    // const points = {};
    // const group = new THREE.Group();

    // for (let index = 0; index < LINE_NB; index++) {
    //   points[index] = [];
    //   points[index].push( new THREE.Vector3( - 10, index, 0 ) );
    //   points[index].push( new THREE.Vector3( 10, index, 0 ) );
    //   const geometry = new THREE.BufferGeometry().setFromPoints( points[index] );

    //   const line = new THREE.Line( geometry, material );
    //   group.add( line );

    // }

    // this.scene.instance.add( group );

    // this.camera.instance.lookAt(group.position);
  }

  setupAudio() {
    function onBeat() {
      console.log("onBeat");
    }

    window.addEventListener("click", (e) => {
      this.audio.start({
        onBeat: onBeat,
        live: false,
        src: "./static/galvanize.mp3",
        // debug: true
      });
    });
  }

  onFrame = () => {
    let self = this;

    requestAnimationFrame(this.onFrame);
    this.renderer.render(this.scene.instance, this.camera.instance);

    this.composer.render();

    if (this.audio.isPlaying) {
      this.audio.update();
    }

    // console.log('this.lineMesh.material.uniforms.dashOffset.value :>> ', this.lineMesh.material.uniforms.dashOffset.value);

    // if (this.lineMesh.material.uniforms.dashOffset.value < -2)
    //   this.lineMesh.material.uniforms.dashOffset.value = 0;
    // this.lineMesh.material.uniforms.dashOffset.value -= 0.01;

    // Decrement the dashOffset value to animate the path with the dash.
  };
}
