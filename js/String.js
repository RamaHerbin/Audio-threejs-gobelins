import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
// import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { CustomLineMaterial } from "./CustomLineMaterial.js"



const matLine = new CustomLineMaterial({
    color: 0xffffff,
    linewidth: 0.005, // in world units with size attenuation, pixels otherwise
    dashed: false,
    // alphaToCoverage: true,
  });

const geometry = new LineGeometry();

export default class String extends Line2 {

  constructor(_params) {



    geometry.setPositions(_params.positions);
    geometry.setColors(_params.colors);


    super(geometry, matLine);

    

    this.computeLineDistances();
    this.scale.set(1, 1, 1);
    this.position.z = 10;
    this.position.x = -50;
    this.frustumCulled = false;


  }






}
