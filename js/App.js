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
    this.audio = null; //Audio module load dynamically
    this.percentAnim = 0;

    this.strings = []; //Array of wavee strings

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

// Lines

    const stringPositions = [];
    const stringColors = [];
    const divisions = 300;

    for (let i = 0; i < divisions; i++) {
      stringPositions.push((i / divisions) * 100, 0, 0);
      stringColors.push(1, 1, 1);
    }

    const strings = [];
    const LINE_NB = 1;

    const group = new THREE.Group();
    
    for (let j = 0; j < LINE_NB; j++) {

      this.strings[j] = new String({
        colors: stringColors,
        positions: stringPositions,
        stringIndex: j
      })

      this.strings[j].position.z = j;
      group.add( this.strings[j] );
    }

    this.scene.instance.add(group);
  }

  setupAudio() {
    function onBeat() {
      console.log("onBeat");
    }

    let audioEvent = async (e) => {

      this.audio = (await import("./utils/audio")).default;

      this.audio.start({
        onBeat: onBeat,
        live: false,
        src: "./static/galvanize.mp3",
        // debug: true
      });

      window.removeEventListener('click', audioEvent);
    }
    window.addEventListener("click", audioEvent);
  }

  onFrame = () => {
    let self = this;

    requestAnimationFrame(this.onFrame);
    this.renderer.render(this.scene.instance, this.camera.instance);

    this.composer.render();

    if (this.audio && this.audio.isPlaying) {
      this.audio.update();

      this.percentAnim > 1 ? this.percentAnim = 0: this.percentAnim += 0.01;

      for (let index = 0; index < this.strings.length; index++) {
        this.strings[index].update(this.audio.values[index], this.percentAnim);
      }
    }

    function normalize(val, max, min) { return (val - min) / (max - min); }


  };
}
