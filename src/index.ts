import './types.d';
import "./index.scss";

import { App } from './App/App';
import { AppScene } from './App/Scene';

const canvas = document.createElement('canvas');

(<any>window).DEBUG = true;

document.body.appendChild(canvas);

const scene = new AppScene();
const app = new App(scene, canvas);

