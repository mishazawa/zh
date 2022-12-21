import './types.d';
import "./index.scss";

import { App } from './App/App';


const container = document.createElement('div');
const canvas = document.createElement('canvas');

canvas.className = 'canvas';
container.className = 'cont';
container.appendChild(canvas);
document.body.appendChild(container);

const app = new App(canvas);

