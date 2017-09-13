import * as PIXI from 'pixi.js';
import * as Color from 'color-js/color';

import {renderer} from './renderer';

// import Utils from "./type-script/utils";
// import Tank from "./type-script/tank";
import Box from "./pixi-objects/box";
import Camera from "./pixi-objects/camera";
import Utils from "./type-script/utils";
import Vector2d from "./math/vector2d";
import Tank from "./pixi-objects/tank";


import Ellipse from './type-script/ellipse';

let Container = PIXI.Container;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;
let TextureCache = PIXI.utils.TextureCache;
let Rectangle = PIXI.Rectangle;
let Graphics = PIXI.Graphics;

let view = renderer.options.view

let color = Color;

let state = play;
const stage = new Container();

let mouse = Utils.captureMouse(view);
let keyboard = Utils.captureKeyboard(window);
let log = document.getElementById("log");

let cam = new Camera();
let box;
let ellipse;
let ellipse2;

let tanks: Tank[] = [];
let tanksAmount = 10;
let player = 0;
for (let i = 0; i < tanksAmount; i++) {
	tanks.push(new Tank(Math.random() * 1000, Math.random() * 1000));
    // tanks[i].color = Utils.HSBtoRGB(Math.random() * 360, 75, 75);
    tanks[i].color = Color({hue: Math.random() * 360, saturation: 75, lightness: 75}).getValue();
}

let camTarget = new Vector2d(stage.width / 2, stage.height / 2);
let easing = 0.08;

/**
 * setup
 */
export default function setup() {
    cam = new Camera();
    

    ellipse = new Ellipse(170, 170+64, new Graphics());
    ellipse2 = new Ellipse(120, 120, new Graphics());
    box = new Box(200, 200, new Graphics);

    stage.addChild(ellipse);
    stage.addChild(ellipse2);
    stage.addChild(box.getContext());

    

    gameLoop();
}

/**
 * gameLoop
 */
function gameLoop() {
    // Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);
    renderer.resize(window.innerWidth, window.innerHeight);

    state();

    // Render the stage to see the animation
    renderer.render(stage);
}

function play() {
	if (keyboard.x.pressed) {
		keyboard.x.pressed = false;
		if (player < tanksAmount - 1) {
			player++;
		} else {
			player = 0;
		}
	}

	if (keyboard.z.pressed) {
		keyboard.z.pressed = false;
		if (player - 1 > -1) {
			player--;
		} else {
			player = tanksAmount - 1;
		}
	}

    tanks[player].player(keyboard, mouse, cam);

    cam.manipulation(keyboard, mouse);

    let v = (tanks[player].position.sub(camTarget)).mult(easing);
    camTarget = camTarget.add(v);

    cam.focusing(stage, camTarget);

    cam.translate(stage);

    for (let tank of tanks) {
		tank.update();
		// tank.updateBoundingBox();
		tank.draw(stage);
		// tank.boundingBox.draw(stage);
	}

	(<any>log).value = null;
    
    (<any>log).value += "--- canvas ---" + "\n";
    (<any>log).value += "cam " + cam.toString() + "\n";
    
    (<any>log).value += "--- tank ---" + "\n";
    (<any>log).value += "play tank #" + player + "\n";
    (<any>log).value += "tank " + tanks[player].toString() + "\n";
}