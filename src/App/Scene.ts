import { AnimationClip, AnimationMixer, BoxGeometry, Camera, Color, EquirectangularReflectionMapping, Fog, FogExp2, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshStandardMaterial, Object3D, PerspectiveCamera, Scene, Vector3 } from "three";
import { loadGltf, loadHdri } from "./utils";
// import URL_MODEL from 'assets/balls_v2.glb';

import URL_MODEL from 'assets/not_work.glb';
import URL_HDRI  from 'assets/studio.hdr';

import { ANIMATION_SPEED, MATERIAL_PROPS } from "./constants";


export class AppScene {
  public scene: Scene;
  private mixer: AnimationMixer;
  
  constructor(public camera) {
    this.scene = new Scene();

    Promise.all([
      loadHdri(URL_HDRI),
      loadGltf(URL_MODEL),
    ]).then(([hdri, gltf]) => {
      this.configScene(hdri);
      this.addGeometry(gltf);
      this.addAnimation(gltf);
    })
  }

  configScene(texture) {
    texture.mapping = EquirectangularReflectionMapping;

    this.scene.environment = texture;
    this.camera.position.z = 2;

    this.scene.fog = new Fog(0x060C12, this.camera.position.z, 3);
  }

  addGeometry (model) {
    const material = this.createMaterial();
    const ballsMesh= model.scene as Mesh;

    ballsMesh.children[0].children.forEach((c: Mesh) => {
      c.material = material;
    })

    this.scene.add(ballsMesh)
  }

  addAnimation (model) {
    const {animations, scene} = model;
    const currentClip = AnimationClip.findByName(animations, animations[0].name);

    this.mixer = new AnimationMixer(scene);
    this.mixer.clipAction(currentClip).timeScale = ANIMATION_SPEED;
    this.mixer.clipAction(currentClip).reset().play();
  }

  createMaterial () {

    return new MeshStandardMaterial(MATERIAL_PROPS);
  }

  public animate (delta: number) {
    this.mixer?.update(delta);
  }
}
