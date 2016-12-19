import Vector2d from "./type-script/vector2d";
import Utils from "./type-script/utils";
import Tank from "./type-script/tank";
import Box from "./type-script/box";
import Camera from "./type-script/camera";

let canvas = document.getElementById("canvas");
let	context = (<any> canvas).getContext("2d");
let	mouse = Utils.captureMouse((<any> canvas));
let	keyboard = Utils.captureKeyboard((<any> window));
let	log = document.getElementById("log");
let	tank = new Tank(30, 70);
let	tank2 = new Tank(-10, 20);
let	box = new Box();
let	cam = new Camera();

let camTarget = new Vector2d((<any> canvas).width / 2, (<any> canvas).height / 2);
let	easing = 0.08;


(function drawFrame() {
	(<any> window).requestAnimationFrame(drawFrame, canvas);
	(<any> canvas).width = window.innerWidth;
	(<any> canvas).height = window.innerHeight;

	tank.player(keyboard, mouse, cam);

	cam.manipulation(keyboard, mouse);

	let v = (tank.position.sub(camTarget)).mult(easing);
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

	tank.color = Utils.HSBtoRGB(300, 75, 75);
	tank.draw(context);
	// tank2.draw(context);
	tank.drawHelp(context);
	box.draw(context);

	context.restore();

	// context.fillStyle = "red";
	// context.fillRect((target.x)-5, (target.y), +5, +5);
	// context.fillStyle = "red";
	// context.fillRect((target2.x)-5, (target2.y)-5, +5, +5);

	(<any> log).value = null;

	(<any> log).value += "--- canvas ---" + "\n";
	(<any> log).value += "cam " + cam.toString() + "\n";


	(<any> log).value += "--- tank ---" + "\n";
	(<any> log).value += "tank " + tank.toString() + "\n";

})();