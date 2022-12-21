import { ACESFilmicToneMapping, Clock, sRGBEncoding, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import {FXAAShader} from 'three/examples/jsm/shaders/FXAAShader';

import OverlayGradient from './shaders/overlayGradient';

// debug
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { ORBIT_DAMPING } from './constants';


export class App {
  private clock;
  private renderer;
  private composer;
  private frameId;
  private stats;
  private controls;

  constructor(private scene, canvas) {
    this.clock = new Clock();
    this.init(canvas);
    this.animate();
  }

  public static get dimensions() {
    return [window.innerWidth, window.innerHeight];
  }

  public static get aspect() {
    return window.innerWidth / window.innerHeight;
  }

  private init(canvas) {

    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
    });

    const [w, h] = App.dimensions;

    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // this.renderer.physicallyCorrectLights = true;
    // this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = ACESFilmicToneMapping;

    this.composer = new EffectComposer(this.renderer);

    const { scene, camera } = this.scene;
    this.composer.insertPass(new RenderPass(scene, camera), 0)
    this.composer.addPass(this.antialiasPass());
    this.composer.addPass(new ShaderPass(OverlayGradient));

    this.controls = new OrbitControls(camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = ORBIT_DAMPING;


    if ((<any>window).DEBUG) {
      this.stats = Stats();
      const container = document.createElement('div');

      document.body.appendChild(container);
      container.appendChild( this.stats.dom );
    }
  }

  public animate() {
    this.frameId = window.requestAnimationFrame(() => this.animate());

    try {
      const delta = this.clock.getDelta();
      this.scene.animate(delta);
      this.composer.render();
      this.stats?.update();
      this.controls?.update();
    } catch (e) {
      cancelAnimationFrame(this.frameId);
      console.error(e);
      return;
    }
  }

  antialiasPass () {
    const fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();

    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( App.dimensions[0] * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( App.dimensions[1] * pixelRatio );
    return fxaaPass
  }
}
