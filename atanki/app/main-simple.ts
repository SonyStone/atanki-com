import Vector2d from "./math/vector2d";
import Utils from "./type-script/utils";
import Tank from "./type-script/tank";
import Box from "./type-script/box";
import Camera from "./type-script/camera";

import QuadTree from "./quad-tree/quad-tree";
import Rectangle from "./lib/rectangle";
import BoundingBox from "./collision/AABB";


let canvas = document.getElementById("canvas");
let context = (<any>canvas).getContext("2d");
let mouse = Utils.captureMouse((<any>canvas));
let keyboard = Utils.captureKeyboard((<any>window));
let log = document.getElementById("log");


let box = new Box();
let cam = new Camera();

let camTarget = new Vector2d((<any>canvas).width / 2, (<any>canvas).height / 2);
let easing = 0.08;

(function drawFrame() {
	(<any>window).requestAnimationFrame(drawFrame, canvas);
	(<any>canvas).width = window.innerWidth;
	(<any>canvas).height = window.innerHeight;

	cam.manipulation(keyboard, mouse);

	cam.focusing(canvas, camTarget);

	context.save();

	cam.draw(context);

	box.draw(context);

})();
