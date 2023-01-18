import { ACESFilmicToneMapping, Clock, sRGBEncoding, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import { FXAAShader    } from 'three/examples/jsm/shaders/FXAAShader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ORBIT_DAMPING, INTERSECTION_THRESHOLD } from './constants';
import OverlayGradient from './shaders/overlayGradient';
import { AppScene } from './Scene';
import { createCamera, isMobile } from './utils';

const IS_DESKTOP = !isMobile();



export class App {
  private scene;
  private clock;
  private renderer;
  private composer;
  private frameId;
  private stats;
  private controls;
  private intersectionObserver;

  constructor(canvas) {
    this.clock = new Clock();
    this.init(canvas);
    this.onResize();
    this.onShow();
  }

  public get dimensions() {
    const container = this.renderer.domElement.parentElement;

    return [container.offsetWidth, container.offsetHeight];
  }

  public  get aspect() {
    const [w, h] = this.dimensions;
    return w / h;
  }

  private init(canvas) {

    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
    });

    const [w, h] = this.dimensions;

    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMapping = ACESFilmicToneMapping;

    this.composer = new EffectComposer(this.renderer);

    this.scene = new AppScene(createCamera(this.aspect));

    const { scene, camera } = this.scene;

    this.composer.insertPass(new RenderPass(scene, camera), 0)

    if (IS_DESKTOP) {
      this.composer.addPass(this.antialiasPass());
    }

    this.composer.addPass(new ShaderPass(OverlayGradient));

    if (IS_DESKTOP) {
      this.controls = new OrbitControls(camera, this.renderer.domElement);
      this.controls.enablePan = false;
      this.controls.enableZoom = false;
      this.controls.enableDamping = true;
      this.controls.dampingFactor = ORBIT_DAMPING;
    }
  }

  public animate() {
    this.frameId = window.requestAnimationFrame(() => this.animate());

    try {
      const delta = this.clock.getDelta();
      this.scene.animate(delta);
      this.composer.render();
      this.controls?.update();
    } catch (e) {
      this.stopAnimation();
      console.error(e);
      return;
    }
  }

  public stopAnimation() {
    cancelAnimationFrame(this.frameId);
  }

  onResize() {

    const onWindowResize = () => {
      this.scene.camera.aspect = this.aspect;
      this.scene.camera.updateProjectionMatrix();
      this.renderer.setSize( ...this.dimensions );
    }

    window.addEventListener( 'resize', onWindowResize, false );
  }

  onShow() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate();
        } else {
          this.stopAnimation();
        }
      });
    }, { threshold: INTERSECTION_THRESHOLD });
    this.intersectionObserver.observe(this.renderer.domElement);
  }

  antialiasPass () {
    const fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();
    const [w, h] = this.dimensions;
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( w * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( h * pixelRatio );
    return fxaaPass
  }

}
