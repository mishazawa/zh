import './types.d';
import "./index.scss";

import { App } from './App/App';

(<any>window).DEBUG = false;

const container = document.createElement('div');
container.className = 'cont';
const canvas = document.createElement('canvas');
canvas.className = 'canvas';
container.appendChild(canvas);
document.body.appendChild(container);



window.addEventListener('load', () => {
  const app = new App(canvas);
})
