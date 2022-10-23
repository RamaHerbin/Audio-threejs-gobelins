import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "meshline";
import Renderer from "./Renderer";
import Sizes from "./utils/Sizes";
import Camera from "./Camera";
import Scene from "./Scene";

export default class Application {
  constructor(_params) {
    this.$canvas = _params.$canvas;

    console.log("INIT APP");
    console.log('this.$canvas :>> ', this.$canvas);
    this.sizes = new Sizes();
    this.scene = new Scene();
    this.renderer = new Renderer(this.$canvas, this.sizes.viewport);
    this.sizes.on("resize", () => {
      const { width, height } = _viewport;
      this.renderer.renderer.setSize(width, height);
      this.renderer.renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      );
    });

    this.setupCamera();

    this.setupMesh();

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

    console.log("this.camera :>> ", this.camera);

    this.scene.scene.add(this.camera.container);

    const onFrame = () => {
        let self = this;
        // console.log('this.renderer :>> ', this.renderer);
        requestAnimationFrame(onFrame);
        this.renderer.render(this.scene.scene, this.camera.instance);
      }
  
      onFrame();
    // this.time.on('tick', () => {
    //     this.renderer.render(this.scene, this.camera.instance);
    // });
  }

  setupMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshPhysicalMaterial({
      color: 0x444444,
      metalness: 0.1,
      roughness: 0.5,
    });
    let cube = new THREE.Mesh(geometry, material);
    this.scene.scene.add(cube);
  }

  // Notre frame loop
  //   onFrame() {
  //     let self = this;
  //     console.log('self.onFrame :>> ', this.onFrame);
  //     requestAnimationFrame(this.onFrame);
  //     this.renderer.render(this.scene.scene, this.camera.instance);
  //   }
}
