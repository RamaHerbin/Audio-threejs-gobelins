import * as THREE from "three";

export default class Scene {
  constructor(_params) {
    this.scene = new THREE.Scene();

    const ambient = new THREE.AmbientLight(0xaafff0);
    this.scene.add(ambient);

    const lightBehind = new THREE.PointLight(0xff00ff, 1);
    lightBehind.position.x = 5;
    lightBehind.position.y = 5;
    lightBehind.position.z = -5;

    this.scene.add(lightBehind);
    this.scene.add(new THREE.PointLightHelper(lightBehind, 0.2));

    const lightFront = new THREE.PointLight(0x00ffff, 0.5);
    lightFront.position.x = -5;
    lightFront.position.y = -5;
    lightFront.position.z = 5;

    this.scene.add(lightFront);
    this.scene.add(new THREE.PointLightHelper(lightFront, 0.2));
  }
}
