import { PerspectiveCamera } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { App } from './App';
import { CAMERA_FAR, CAMERA_FOV, CAMERA_NEAR } from './constants';


export const loadGltf = url => new Promise((res, rej) => new GLTFLoader().load(url, data => res(data), undefined, rej));
export const loadHdri = url => new Promise((res, rej) => new RGBELoader().load(url, data => res(data), undefined, rej));

export const createCamera = () => new PerspectiveCamera(
  CAMERA_FOV,
  App.aspect,
  CAMERA_NEAR,
  CAMERA_FAR
);