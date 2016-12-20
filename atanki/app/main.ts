import Vector2d from "./type-script/vector2d";
import Utils from "./type-script/utils";
import Tank from "./type-script/tank";
import Box from "./type-script/box";
import Camera from "./type-script/camera";

import QuadTree from "./quad-tree/quad-tree";
import Rectangle from "./lib/rectangle";

let canvas = document.getElementById("canvas");
let context = (<any>canvas).getContext("2d");
let mouse = Utils.captureMouse((<any>canvas));
let keyboard = Utils.captureKeyboard((<any>window));
let log = document.getElementById("log");


let tank = [];
let tankAmount = 10;
let player = 0;
for (let i = 0; i < tankAmount; i++) {
	tank.push(new Tank(Math.random() * 1000, Math.random() * 1000));
	tank[i].color = Utils.HSBtoRGB(Math.random() * 360, 75, 75);
}

let box = new Box();
let cam = new Camera();

// QuadTree
let bounds = new Rectangle(0, 0, 1000, 1000);
let tree = new QuadTree(bounds, false, 7);




function drawNode(node: any, ctx) {
	let bounds = node.bounds;

	ctx.save();
	ctx.translate(bounds.x, bounds.y);
	ctx.scale(1, 1);
	ctx.lineWidth = 2;

	// ctx.fillStyle = this.color;
	ctx.strokeStyle = "#2B2B2B";
	ctx.globalAlpha = 1;

	ctx.save();

	ctx.beginPath();
	ctx.rect(0, 0, bounds.width, bounds.height);
	ctx.stroke();

	ctx.restore();

	ctx.restore();

	let len = node.nodes.length;
	for (let i = 0; i < len; i++) {
		drawNode(node.nodes[i], ctx);
	}
}

let camTarget = new Vector2d((<any>canvas).width / 2, (<any>canvas).height / 2);
let easing = 0.08;


(function drawFrame() {
	(<any>window).requestAnimationFrame(drawFrame, canvas);
	(<any>canvas).width = window.innerWidth;
	(<any>canvas).height = window.innerHeight;

	// this is maddness!
	if (keyboard.x.pressed) {
		keyboard.x.pressed = false;
		if ( player + 1 < tankAmount) {
			player++;
		} else {
			player = 0;
		}
	}
	if (keyboard.z.pressed) {
		keyboard.z.pressed = false;
		if ( player - 1 > -1) {
			player--;
		} else {
			player = tankAmount -1;
		}
	}

	tank[player].player(keyboard, mouse, cam);

	cam.manipulation(keyboard, mouse);

	let v = (tank[player].position.sub(camTarget)).mult(easing);
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


	for (let t of tank) {
		t.draw(context);
	}

	tank[player].drawHelp(context);
	box.draw(context);

	// QuadTree
	tree.clear();

	tree.insert(tank);
	for (let t of tank) { tree.retrieve(t); }

	drawNode(tree.root, context);

	context.restore();

	// context.fillStyle = "red";
	// context.fillRect((target.x)-5, (target.y), +5, +5);
	// context.fillStyle = "red";
	// context.fillRect((target2.x)-5, (target2.y)-5, +5, +5);

	(<any>log).value = null;

	(<any>log).value += "--- canvas ---" + "\n";
	(<any>log).value += "cam " + cam.toString() + "\n";


	(<any>log).value += "--- tank ---" + "\n";
	(<any>log).value += "play tank #" + player + "\n";
	(<any>log).value += "tank " + tank[player].toString() + "\n";

})();