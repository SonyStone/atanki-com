import * as PIXI from 'pixi.js';

PIXI.utils.skipHello();

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const autoDetectRenderer = PIXI.autoDetectRenderer;

const options = PIXI.settings.RENDER_OPTIONS;

options.view = canvas;
options.view.style.position = 'absolute';
options.view.style.display = 'block';

options.backgroundColor = 0x595959;
options.antialias = true;
options.forceFXAA = true;
options.autoResize = true;
options.autoResize = true;
options.width = window.innerWidth;
options.height = window.innerHeight;

// Create the renderer
export const renderer = autoDetectRenderer(options);
