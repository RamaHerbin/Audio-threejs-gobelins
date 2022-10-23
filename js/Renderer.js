import * as THREE from 'three';

export default class Renderer {
  constructor(_viewport) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$canvas,
    });

    const { width, height } = _viewport;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    console.log('this.sizes :>> ', this.sizes);

    
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }
}
