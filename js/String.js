import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
// import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { CustomLineMaterial } from "./CustomLineMaterial.js"

const geometry = new LineGeometry();

export default class String extends Line2 {

  constructor(_params) {


    const matLine = new CustomLineMaterial({
      color: 0xffffff,
      linewidth: 0.005, // in world units with size attenuation, pixels otherwise
      dashed: false,
      opacity: 0,
      frequence: 0,
      stringIndex: _params.stringIndex,
      distanceActive: .2,
      percentAnim: 0
      // TODO: rajouter index string
      // alphaToCoverage: true,
    });

    geometry.setPositions(_params.positions);
    geometry.setColors(_params.colors);


    super(geometry, matLine);


    // this.frequenceValue = 0; //updated by the onFrame func
    this.computeLineDistances();
    this.scale.set(1, 1, 1);
    this.position.z = 10;
    this.position.x = -50;
    this.frustumCulled = false;


  }

  update(frequence, percentAnimation) {

    this.material.frequence = frequence;

    this.material.percentAnim = percentAnimation;

    // console.log('this.material.frequence :>> ', this.material.frequence);
  }


}
