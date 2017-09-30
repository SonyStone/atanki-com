import Vector2d from "./math/vector2d";
import Utils from "./type-script/utils";
import Tank from "./type-script/tank";
import Box from "./type-script/box";
import Camera from "./type-script/camera";

import QuadTree from "./quad-tree/quad-tree";
import Rectangle from "./lib/rectangle";
import BoundingBox from "./collision/AABB";


let canvas = < HTMLCanvasElement > document.getElementById("canvas");
let context = < CanvasRenderingContext2D > canvas.getContext("2d");
let mouse = Utils.captureMouse(canvas);
let keyboard = Utils.captureKeyboard(window);
let log = document.getElementById("log");


let tanks: Tank[] = [];
let tanksAmount = 9;
let player = 0;
for (let i = 0; i < tanksAmount; i++) {
    tanks.push(new Tank(Math.random() * 1000, Math.random() * 1000));
    tanks[i].color = Utils.HSBtoRGB(Math.random() * 360, 75, 75);
}

let box = new Box();
let cam = new Camera();

// QuadTree
let bounds = new Rectangle(0, 0, 1000, 1000);
let tree = new QuadTree(bounds, false, 7);

let camTarget = new Vector2d(( < any > canvas).width / 2, ( < any > canvas).height / 2);
let easing = 0.08;

(function drawFrame() {
    ( < any > window).requestAnimationFrame(drawFrame, canvas);
    ( < any > canvas).width = window.innerWidth;
    ( < any > canvas).height = window.innerHeight;

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

    cam.focusing(canvas, camTarget);

    context.save();

    cam.draw(context);

    context.fillStyle = "green";
    context.fillRect(1, 1, 100, 100);
    context.fillRect(-432, -153, 100, 100);
    context.fillRect(-565, 300, 100, 100);
    context.fillRect(123, -215, 100, 100);
    context.fillRect(-133, 132, 100, 100);

    for (let tank of tanks) {
        tank.update();
        tank.updateBoundingBox();
        tank.draw(context);
        tank.boundingBox.draw(context);
    }

    tanks[player].drawHelp(context);
    box.draw(context);

    // tree.boundingBox(tanks);
    tree.bruteForce(tanks); // temporarily

    tree.draw(context); // draw virtual quad-tree greed

    context.restore();

    // context.fillStyle = "red";
    // context.fillRect((target.x)-5, (target.y), +5, +5);
    // context.fillStyle = "red";
    // context.fillRect((target2.x)-5, (target2.y)-5, +5, +5);

    ( < any > log).value = `
--- canvas ---
cam: ${cam.toString()}
--- tank ---
play tank #${player}выф
tank ${tanks[player].toString()}
	`;

})();
