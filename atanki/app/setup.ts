import {
    Container,
    loader,
    Sprite,
    utils,
    Rectangle,
    Graphics,
} from 'pixi.js';

import { renderer } from './renderer';

import { Box } from "./pixi-objects/box";
import Camera from "./pixi-objects/camera";
import Utils from "./type-script/utils";
import Vector2d from "./math/vector2d";
import { Vec2 } from './math2/Vec2'
import { Tank } from "./pixi-objects/tank";

import { Locator } from './pixi-objects/Locator';

import Ellipse from './type-script/ellipse';

let resources = loader.resources;
let TextureCache = utils.TextureCache;

let view = renderer.options.view

// let color = Color;

let state = play;
const world = new Container();

let mouse = Utils.captureMouse(view);
let keyboard = Utils.captureKeyboard(window);
let log = <HTMLTextAreaElement>document.getElementById("log");

let cam = new Camera();
let box;
let box2;
let ellipse;
let ellipse2;

let locator;
let locator2 = new Locator();
let container = new Container()

let tanks: Tank[] = [];
let tanksAmount = 100;
let player = 0;


for (let i = 0; i < tanksAmount; i++) {
    const tank = new Tank()

    tank.pull.x = (Math.random() * 1000);
    tank.pull.y = (Math.random() * 1000);

    tanks.push(tank);
    // tanks[i].color = Utils.HSBtoRGB(Math.random() * 360, 75, 75);
    // tanks[i].color = Color({hue: Math.random() * 360, saturation: 75, lightness: 75}).getValue();
}

let camTarget = new Vector2d(renderer.width / 2, renderer.height / 2);
let easing = 0.08;


let thing = new Graphics();

let count = 0


/**
 * setup
 */
export default function setup() {
    ellipse = new Ellipse(0, 0);
    ellipse2 = new Ellipse(1200, 1200);
    box = new Box(200, 200);
    box2 = new Box(400, 400);

    locator = new Locator().setTransform(40, 40, 10, 10, undefined, 0.5);
    locator2.setTransform(30, 30, 10, 10);

    ellipse.addChild(ellipse2);

    container.addChild(ellipse2);
    world.addChild(container);

    world.addChild(ellipse);
    world.addChild(box.getContext());
    world.addChild(box2.getContext());
    world.addChild(locator)

    world.addChild(locator2)

    tanks.forEach(tank => {
        world.addChild(tank);

    });
    world.addChild(thing);
    // console.log(tanks[player].position)

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

    // Render the world to see the animation
    renderer.render(world);
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

    // let v = (tanks[player].position.sub(camTarget)).mult(easing);
    let v = (Vec2.sub(tanks[player].position, camTarget).mult(easing));

    camTarget = camTarget.add(v);

    cam.focusing(renderer, camTarget);

    cam.translate(world);

    for (let tank of tanks) {
        tank.update();
        // world.addChild(getBounds(tank));
        // tank.updateBoundingBox();
        // tank.draw(new Graphics);
        // tank.boundingBox.draw(stage);
    }

    count += 0.1;
    thing.clear();
    thing.lineStyle(10, 0xff0000, 1);
    thing.beginFill(0xffFF00, 0.5);

    thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
    thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
    thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
    thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
    thing.lineTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);

    thing.rotation = count * 0.1;

    log.value = null;

    log.value += `--- canvas ---\n` +
        `${cam}\n` +
        `--- tank ---\n` +
        `play tank #${player}\n` +
        `tank ${tanks[player]}\n`;
}
