import * as THREE from 'three';

export default class Renderer {
  constructor(_$canvas, _viewport) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: _$canvas,
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
