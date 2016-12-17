var Vector2d = require("./vector2d");
var utils = require("./utils");
var Tank = require("./tank");
var Box = require("./box");
var Camera = require("./camera");


var canvas = document.getElementById("canvas");
var	context = canvas.getContext("2d");
var	mouse = utils.captureMouse(canvas);
var	keyboard = utils.captureKeyboard(window);
var	log = document.getElementById("log");
var	tank = new Tank(30, 70);
var	tank2 = new Tank(-10, 20);
var	box = new Box();
var	cam = new Camera();

var camTarget = new Vector2d(canvas.width / 2, canvas.height / 2);
var	easing = 0.08;




(function drawFrame() {
	window.requestAnimationFrame(drawFrame, canvas);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	// context.clearRect(0, 0, canvas.width, canvas.height);

	tank.player(keyboard, mouse, cam);

	cam.manipulation(keyboard, mouse);

	v = (tank.position.sub(camTarget)).mult(easing);
	camTarget = camTarget.add(v);

	cam.focusing(camTarget);


	context.save();

	cam.draw(context);

	context.fillStyle = "green"
	context.fillRect(1, 1, 100, 100);
	context.fillRect(-432, -153, 100, 100);
	context.fillRect(-565, 300, 100, 100);
	context.fillRect(123, -215, 100, 100);
	context.fillRect(-133, 132, 100, 100);

	tank.color = utils.HSBtoRGB(300, 75, 75);
	tank.draw(context);
	// tank2.draw(context);
	tank.drawHelp(context);
	box.draw(context);

	context.restore();

	// context.fillStyle = "red";
	// context.fillRect((target.x)-5, (target.y), +5, +5);
	// context.fillStyle = "red";
	// context.fillRect((target2.x)-5, (target2.y)-5, +5, +5);

	log.value = null;

	log.value += "--- canvas ---" + "\n";
	log.value += "cam " + cam.toString() + "\n";


	log.value += "--- tank ---" + "\n";
	log.value += "tank " + tank.toString() + "\n";

} ());