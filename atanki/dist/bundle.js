/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Vector2d = __webpack_require__(1);
	var utils = __webpack_require__(2);
	var Tank = __webpack_require__(3);
	var Box = __webpack_require__(4);
	var Camera = __webpack_require__(5);


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

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
		Vector2d(x,y)	✓
		├───.random(vec)		// Return new vector, with a random direction.
		├───.fromAngle(angle)	// Return new vector, from an angle
		├───.add(vec1,vec2)		// Return new vector, addition of two independent vectors
		│	├───.x()
		│	└───.y()
		├───.sub()				// Return new vector, subtraction of two independent vectors
		│	├───.x()
		│	└───.y()
		├───.mult()				// Return new vector, multiply a vector by a scalar
		├───.div()				// Return new vector, divide a vector by a scalar
		├───.dist()				// Return scalar, the distance between two points
		├───.dot()				// Return scalar, the dot product of two vectors
		├───.lerp()				// Return new vector, linear interpolate the vector to another vector
		├───.angleBetween()		// Calculate and return the angle between two vectors
		│
		└───.prototype
			├───.set(vec)		// Modifies, return set the components of the vector
			├───.copy()			// Return new vector, copy of the vector
			├───.mag()			// Return scalar, the magnitude of the vector
			├───.magSq()		// Return scalar, the magnitude of the vector, squared
			├───.add(vec)		// Modifies, return adds one vector to another
			├───.sub()			// Modifies, return subs one vector from another
			├───.mult()			// Modifies, return multiplies a vector by a scalar
			├───.div()			// Modifies, return divide  a vector by a scalar
			├───.dist()			// Return scalar, the distance between two points
			├───.dot()			// Return scalar, the dot product of two vectors
			├───.normalize()	// Modifies, return normalize the vector to a length of 1
			├───.limit()		// Modifies, return limit the magnitude of the vector
			├───.setMag()		// Modifies, return set the magnitude of the vector
			├───.heading()		// Return angle of rotation for this vector
			├───.rotate()		// Modifies, return rotate the vector by an angle
			├───.lerp()			// Modifies, return linear interpolate the vector to another vector
			├───.invert()		//
			├───.toArray
			└───.toString
	*/



	function Vector2d(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};
	Vector2d.prototype = Object.create(Object.prototype);
	Vector2d.random = function() {
		return new Vector2d(Math.random() * 2 - 1,Math.random() * 2 - 1);
	};
	Vector2d.fromAngle = function(angle) {
		return new Vector2d(Math.cos(angle),Math.sin(angle));
	};
	Vector2d.add = function(vec1, vec2) {
		return new Vector2d().set(vec1).add(vec2);
	};
	Vector2d.sub = function(vec1, vec2) {
		return new Vector2d().set(vec1).sub(vec2);
	};
	Vector2d.mult = function(vec, scalar) {
		return new Vector2d().set(vec).mult(scalar);
	};
	Vector2d.div = function(vec, scalar) {
		return new Vector2d().set(vec).div(scalar);
	};
	Vector2d.dist = function(vec1, vec2) {
		return new Vector2d().set(vec1).dist(vec2);
	};
	Vector2d.dot = function(vec1, vec2) {
		return new Vector2d().set(vec1).dot(vec2);
	};
	Vector2d.lerp = function(vec1, vec2, amount) {
		if (amount > 1) { amount = 1; }
		if (amount < 0)	{ amount = 0; }
		return new Vector2d().set(vec1).lerp(vec2, amount);
	};
	Vector2d.angleBetween = function(vec1, vec2) {
		return vec1.heading() - vec2.heading();
	};
	Vector2d.angleTo = function(vec1, vec2) {
		return Math.atan2((vec1.y - vec2.y), (vec1.x - vec2.x));
	};

	// prototypes

	Vector2d.prototype.set = function() {
		if (arguments[0] instanceof Object) {
			this.x = arguments[0]['x'];
			this.y = arguments[0]['y'];
		} else {
			this.x = arguments[0];
			this.y = arguments[1];
		}
		return this;
	};
	Vector2d.prototype.setZero = function() {
		this.x = 0;
		this.y = 0;
		return this;
	};
	Vector2d.prototype.copy = function() {
		return new Vector2d(this.x, this.y);
	};
	Vector2d.prototype.mag = function() {
		return (Math.sqrt((this.x * this.x) + (this.y * this.y)));
	};
	Vector2d.prototype.magSq = function() {
		return ((this.x * this.x) + (this.y * this.y));
	};
	Vector2d.prototype.add = function(vec) {
		return new Vector2d(
						(this.x + vec.x),
						(this.y + vec.y)
					);
	};
	Vector2d.prototype.sub = function(vec) {
		return new Vector2d(
						(this.x - vec.x),
						(this.y - vec.y)
					);
	};
	Vector2d.prototype.mult = function(scalar) {
		return new Vector2d(
						(this.x * scalar),
						(this.y * scalar)
					);
	};
	Vector2d.prototype.div = function(scalar) {
		return new Vector2d(
						(this.x / scalar),
						(this.y / scalar)
					);
	};
	Vector2d.prototype.dist = function(vec) {
		return Math.sqrt(
				Math.pow(this.x - vec.x, 2) +
				Math.pow(this.y - vec.y, 2)
			);
	};
	Vector2d.prototype.dot = function(vec) {
		return (this.x * vec.x) + (this.y * vec.y);
	};
	Vector2d.prototype.normalize = function() {
		return this.div(this.mag());;
	};
	Vector2d.prototype.limit = function(scalar) {
		if (this.magSq() > scalar * scalar) {
			return this.normalize().mult(scalar);
		}
		return this;
	};
	Vector2d.prototype.setMag = function(scalar) {
		return this.normalize().mult(scalar);
	};
	Vector2d.prototype.heading = function() {
		return Math.atan2(this.y, this.x);
	};
	Vector2d.prototype.rotate = function (angle) {
		return new Vector2d(
					(this.x * Math.cos(angle)) - (this.y * Math.sin(angle)),
					(this.x * Math.sin(angle)) + (this.y * Math.cos(angle))
				);
	};
	Vector2d.prototype.lerp = function(vec, amount) {
		if (amount > 1) { amount = 1; }
		if (amount < 0)	{ amount = 0; }
		return this.mult(amount).add(vec.copy().mult(1-amount));
	};
	Vector2d.prototype.invert = function() {
		var x = this.x * -1;
		var y = this.y * -1;
		return new Vector2d(x,y);
	};
	Vector2d.prototype.positioning = function(camera) {
		return this.invert().rotate(camera.rotation).mult(camera.zoom).add(camera.focus);
	};

	Vector2d.prototype.toArray = function() {
		return [this.x, this.y];
	};
	Vector2d.prototype.toString = function() {
		return 'x:' + this.x.toFixed(2) + ', y:' + this.y.toFixed(2) + "\n";
	};

	module.exports = Vector2d;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Vector2d = __webpack_require__(1);

	var utils = {};

	function eventPositionCapture(x, y, event, element) {
	    'use strict';
		if (event.pageX || event.pageY) {		// он будет проверять каждый раз? O_o
			x = event.pageX;
			y = event.pageY;
		} else {
			x = event.clientX + document.body.scrollLeft +
				document.documentElement.scrollLeft;
			y = event.clientY + document.body.scrollTop +
				document.documentElement.scrollTop;
		}
		x -= element.offsetLeft;
		y -= element.offsetTop;
		return {
			x: x,
			y: y
		};
	}

	// Mouse position
	utils.captureMouse = function (element) {
	    'use strict';
		var mouse = {
			x: 0, 
			y: 0,
			LButton: { code: 0, pressed: false },
			RButton: { code: 2, pressed: false },
			MButton: { code: 1, pressed: false },
			WheelUp: { click: false, 
			  			get pressed() {
			  				if (this.click) {
			  					this.click = false;
			  					return true;
			  				}
			  				return false;
			  		 	}
	  				 },
			WheelDown:{ click: false, 
						get pressed() {
			  				if (this.click) {
			  					this.click = false;
			  					return true;
			  				}
			  				return false;
			  		 	}
	  				 }, 
		};

		element.oncontextmenu = function(a) {
	    	a.preventDefault();
		}

		element.addEventListener('mousemove', function (event) {
			var x, y,
				mouse_event = eventPositionCapture(x, y, event, element);

			mouse.x = mouse_event.x;
			mouse.y = mouse_event.y;
		}, false);

		element.addEventListener('mousedown', function (event) {
			var name;
			//console.log(event.button);
			for (name in mouse) {
	            if (mouse.hasOwnProperty(name)) {
	                if (mouse[name].code === event.button) {
					    mouse[name].pressed = true;
					    //console.log(name + ": " + mouse[name].pressed);
	                }
	            }
			}
		}, false);

		element.addEventListener('mouseup', function (event) {
			var buttonName;
			//console.log(event.button);
			for (name in mouse) {
	            if (mouse.hasOwnProperty(name)) {
	                if (mouse[name].code === event.button) {
					    mouse[name].pressed = false;
					    //console.log(name + ": " + mouse[name].pressed);
	                }
	            }
			}
		}, false);

		element.addEventListener('wheel', function (event) {
			//console.log(event.wheelDelta);
			//console.log(event.deltaY);
			if (event.deltaY < 0){
				mouse["WheelUp"].click = true;
			} else {
				mouse["WheelDown"].click = true;
			}
		}, false);

		return mouse;
	};

	// Touch position
	utils.captureTouch = function (element) {
	    'use strict';
		var touch = {x: null, y: null, isPressed: false};

		element.addEventListener('touchstart', function (event) {
			touch.isPressed = true;
		}, false);

		element.addEventListener('touchend', function (event) {
			touch.isPressed = false;
			touch.x = null;
			touch.y = null;
		}, false);

		element.addEventListener('touchmove', function (event) {
			var x, y,
				touch_event = eventPositionCapture(x, y, event.touches[0], element);
				// first touch

			touch.x = touch_event.x;
			touch.y = touch_event.y;
		}, false);

		return touch;
	};

	utils.captureKeyboard = function (element) {
	    'use strict';
		var key = {
				left:      { code: 37, pressed: false },
				right:     { code: 39, pressed: false },
				up:        { code: 38, pressed: false },
				down:      { code: 40, pressed: false },
				w:         { code: 87, pressed: false },
				a:         { code: 65, pressed: false },
				s:         { code: 83, pressed: false },
				d:         { code: 68, pressed: false },
				e:         { code: 69, pressed: false },
				q:         { code: 81, pressed: false },
				NumpadAdd: { code: 107, pressed: false },
				NumpadSub: { code: 109, pressed: false }
		    };


		element.addEventListener('keydown', function (event) {
			var name;
			//console.log(event.keyCode);
			//console.log(event.code);
	        for (name in key) {
	            if (key.hasOwnProperty(name)) {
	                if (key[name].code === event.keyCode) {
					    key[name].pressed = true;
					    //console.log(name + ": " + key[name].pressed);
					    
	                }
	            }

			}
		}, false);

		element.addEventListener('keyup', function (event) {
	        var name;
			for (name in key) {
	            if (key.hasOwnProperty(name)) {
				    if (key[name].code === event.keyCode) {
					    key[name].pressed = false;
					    //console.log(name + ": " + key[name].pressed);
	                }
	            }
			}
		}, false);

		return key;
	};

	utils.colorToRGB = function (color, alpha) {
	    'use strict';
		// if string format, convert to number
		if (typeof color === 'string' && color[0] === '#') {
			color = window.parseInt(color.slice(1), 16);
		}
		alpha = (alpha === undefined) ? 1 : alpha;

		// extract component values
	    /*jslint bitwise: true */
		var r = color >> 16 & 0xff,
			g = color >> 8 & 0xff,
			b = color & 0xff,
			a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha); // check range

		// use 'rgba' if neede
		if (a === 1) {
			return "rgb(" + r + "," + g + "," + b + ")";
		} else {
			return "rgba(" + r + "," + g + "," + b + "," + a + ")";
		}
	};

	/**
	 * Convert HSB color into string "rgb(r,g,b)"
	 *
	 * @param {number} hue in degrees (from 0 to 360)
	 * @param {number} saturation in percent (from 0 to 100)
	 * @param {number} brightness in percent (from 0 to 100)
	 * @param {boolean} radians if true, used hue in radians
	 * @return {string} color string "rgb(r,g,b)"
	 */
	utils.HSBtoRGB = function (hue, saturation, brightness, radians) {
	    'use strict';
		// https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
		if (hue        === undefined) { hue        = 0; }
		if (saturation === undefined) { saturation = 75; }
		if (brightness === undefined) { brightness = 75; }
		if (radians    === undefined) { radians    = false; }

		if (radians) { hue *= 180 / Math.PI; }
		var HSB = {
				h: hue % 360,
				s: saturation / 100,
				b: brightness / 100
			},
			RGB = {
				r: null,
				g: null,
				b: null,
				color: function () {
					return "rgb(" + Math.round(this.r) +
							  "," + Math.round(this.g) +
							  "," + Math.round(this.b) + ")";
				}
			},
			chroma,
	        hueI,
	        x,
	        m;

		if (HSB.h < 0) {
			HSB.h += 360;
		}
		if (HSB.s > 100) {
			HSB.s = 100;
		} else if (HSB.s < 0) {
			HSB.s = 0;
		}

		if (HSB.b > 100) {
			HSB.b = 100;
		} else if (HSB.b < 0) {
			HSB.b = 0;
		}

		chroma = HSB.s * HSB.b;
		hueI = HSB.h / 60;
		
		x = chroma * (1 - Math.abs(hueI % 2 - 1));
		switch (Math.floor(hueI)) {
	    case 0:
	        RGB.r = chroma;
	        RGB.g = x;
	        RGB.b = 0;
	        break;
		case 1:
	        RGB.r = x;
	        RGB.g = chroma;
	        RGB.b = 0;
	        break;
		case 2:
	        RGB.r = 0;
	        RGB.g = chroma;
	        RGB.b = x;
	        break;
		case 3:
	        RGB.r = 0;
	        RGB.g = x;
	        RGB.b = chroma;
	        break;
		case 4:
	        RGB.r = x;
	        RGB.g = 0;
	        RGB.b = chroma;
	        break;
		case 5:
	        RGB.r = chroma;
	        RGB.g = 0;
	        RGB.b = x;
	        break;
		}
		m = HSB.b - chroma;
		RGB.r += m;
	    RGB.g += m;
	    RGB.b += m;
		RGB.r *= 255;
	    RGB.g *= 255;
	    RGB.b *= 255;
		
		return RGB.color();
	};

	utils.parseColor = function (color, toNumber) {
	    'use strict';
	    /*jslint bitwise: true */
		if (toNumber === true) {
			if (typeof color === 'number') {
				return (color | 0); // chop off decimal
			}
			if (typeof color === 'string' && color[0] === '#') {
				color = color.slice(1);
			}
			return window.parseInt(color, 16);
		} else {
			if (typeof color === 'number') {
				// make sure our hexadecimal number is padded out
				color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
			}
			return color;
		}
	};

	utils.containsPoint = function (rect, x, y) {
	    'use strict';
		return !(x < rect.x || x > rect.x + rect.width ||
				 y < rect.y || y > rect.y + rect.height);
	};

	utils.angleNormalize = function(angle) {
		return Math.atan2(Math.sin(angle), Math.cos(angle));
	};

	module.exports = utils;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Vector2d = __webpack_require__(1);
	var utils = __webpack_require__(2);

	function Tank(x, y) {
	    'use strict';
		//if (radius === undefined) { radius = 10; }
		this.color = utils.HSBtoRGB(360, 75, 75);
		this.position = new Vector2d();
		this.pull = new Vector2d(x,y) || new Vector2d();
		this.direction = new Vector2d();

		
		this.rotation = 0;
		this.speed = 5;

		this.positionRotation = 0;

		this.target = new Vector2d();
		this.targetRotation = 0;

		this.scaleX = 1;
		this.scaleY = 1;
		this.lineWidth = 2;
		this.transparency = 1;

	}
	Tank.prototype.player = function (keyboard, mouse, camera) {
		// направление пушки относительно вращения канваса
		this.targetRotation = Vector2d.angleTo(
			this.target.set(mouse),
			camera.targeting(this.position)
			// this.position.mult(camera.zoom).rotate(camera.rotation).add(camera.position)
			) -	camera.rotation;

		var speed = 0;
		if (keyboard.up.pressed || keyboard.w.pressed) { 
			this.direction = this.direction.add(Vector2d.fromAngle(-Math.PI/2-camera.rotation));
			speed = this.speed;
		}
		if (keyboard.down.pressed || keyboard.s.pressed) { 
			this.direction = this.direction.add(Vector2d.fromAngle(Math.PI/2-camera.rotation));
			speed = this.speed;
		}
		if (keyboard.left.pressed || keyboard.a.pressed) { 
			this.direction = this.direction.add(Vector2d.fromAngle(Math.PI-camera.rotation));
			speed = this.speed;
		}
		if (keyboard.right.pressed || keyboard.d.pressed) {
			this.direction = this.direction.add(Vector2d.fromAngle(0-camera.rotation));
			speed = this.speed;
		}
		this.direction = this.direction.normalize();
		this.pull = this.pull.add(this.direction.mult(speed));
		// this.direction.setZero();
	};
	Tank.prototype.draw = function (ctx) {
	    'use strict';
		var gun = {
				Length: 30,
				Width: 10,
				TurretRadius: 10
			},
			tank = {
				Length: 40,
				Width: 30
			};
		// this.positionRotation = Math.atan2((this.pull.y - this.position.y), (this.pull.x - this.position.x));
		this.positionRotation = Vector2d.angleTo(this.pull, this.position);
		this.position.x = this.pull.x - Math.cos(this.positionRotation) * 18;
	    this.position.y = this.pull.y - Math.sin(this.positionRotation) * 18;

		function tankPath(ctx) {
			ctx.beginPath();
			ctx.rect(-tank.Length / 2, -tank.Width / 2, tank.Length, tank.Width);
			ctx.moveTo(tank.Length / 2, 0);
			ctx.lineTo(-tank.Length / 2, tank.Width / 2);
			ctx.lineTo(-tank.Length / 2, -tank.Width / 2);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}

		function gunPath(ctx) {
			ctx.beginPath();
			ctx.rect(0, -gun.Width / 2, gun.Length, gun.Width);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(0, 0, gun.TurretRadius, 0, (Math.PI * 2), false);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}

		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.scale(this.scaleX, this.scaleY);
		ctx.lineWidth = this.lineWidth;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "#191919";
		ctx.globalAlpha = this.transparency;

		ctx.save();
	    ctx.rotate(this.positionRotation);
		tankPath(ctx);
		ctx.restore();

		ctx.save();
		ctx.rotate(this.targetRotation);
		gunPath(ctx);
		ctx.restore();

		ctx.restore();
	};
	Tank.prototype.drawHelp = function (ctx) {
	    'use strict';
	    var scale = 1;
		ctx.save();

		ctx.translate(this.position.x, this.position.y);
		ctx.moveTo(0, 0);
		ctx.fillStyle = "#ff0000";
		ctx.strokeStyle = "#00ff00";
		ctx.scale(scale, scale);

		function pointDraw(rotation, positionX, positionY) {
			if (rotation === undefined) { rotation = 0; }
			if (positionX === undefined) { positionX = 0; }
			if (positionY === undefined) { positionY = 0; }
			ctx.save();
			ctx.beginPath();
			ctx.rotate(rotation);
			ctx.arc(positionX, positionY, 2, 0, (Math.PI * 2), false);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
		function arcAngleDraw(angle1, angle2, radius) {
			if (angle1 === undefined) { angle1 = 0; }
			if (angle2 === undefined) { angle2 = 0; }
			if (radius === undefined) { radius = 10; }
			angle1 = utils.angleNormalize(angle1);
			angle2 = utils.angleNormalize(angle2);
			var difference = angle1 - angle2;
			ctx.save();
			ctx.beginPath();
		/*	if ((difference > 0 && difference < Math.PI) || difference < -Math.PI) {
				ctx.arc(0, 0, radius, (angle1), (angle2), true);
			} else {
				ctx.arc(0, 0, radius, (angle1), (angle2), false);
			}*/
			if (Math.sin(difference) > 0 ) {
				ctx.arc(0, 0, radius, (angle1), (angle2), true);
			} else {
				ctx.arc(0, 0, radius, (angle1), (angle2), false);
			}
			ctx.stroke();
			ctx.restore();
		}
		ctx.save();
		ctx.beginPath();
		ctx.rotate(this.positionRotation);
		ctx.moveTo(0, 0);
		ctx.lineTo(50, 0);
		ctx.closePath();
	    ctx.stroke();
	    ctx.restore();

	    ctx.save();
		ctx.beginPath();
		ctx.rotate(this.targetRotation);
		ctx.moveTo(0, 0);
		ctx.lineTo(50, 0);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();


		//pointDraw(this.targetRotation, 50);
		//pointDraw(this.positionRotation, 50);
		//pointDraw(0,this.moveX - this.x, this.moveY - this.y);
		arcAngleDraw(this.targetRotation, this.positionRotation, 50);
		//arcAngleDraw(this.targetRotation, 0, 42);
		//arcAngleDraw(this.positionRotation, 0, 40);

		ctx.restore();
	};
	Tank.prototype.toString = function() {
		return 	'position x:' + this.position.x.toFixed(2) + ', y:' + this.position.y.toFixed(2) + "\n" +
				'pull x:' + this.pull.x.toFixed(2) + ', y:' + this.pull.y.toFixed(2) + "\n" +
				'direction x:' + this.direction.x.toFixed(2) + ', y:' + this.direction.y.toFixed(2) + "\n" +
				'targetRotation ' + this.targetRotation.toFixed(2) + "\n" +
				'positionRotation ' + this.positionRotation.toFixed(2) + "\n" +
				'rotation: ' + this.rotation.toFixed(2) + "\n";
				
	};
	/*
	Tank.prototype.getBounds = function () {
	    'use strict';
		return {
			x: this.x - this.radius,
			y: this.y - this.radius,
			width: this.radius * 2,
			height: this.radius * 2
		};
	};

	Tank.prototype.move = function () {
	    'use strict';

	};
	*/

	module.exports = Tank;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Vector2d = __webpack_require__(1);
	var utils = __webpack_require__(2);

	function Box() {
		this.x = 200;
		this.y = 200;
		this.angle;
	}

	Box.prototype.draw = function (ctx) {
		'use strict';

		var box = {
				height: 45,
				width: 45
			},
			color = "#9C9C9C";

		function tankPath(ctx) {
			ctx.beginPath();
			ctx.rect(-box.height / 2, -box.width / 2, box.height, box.width);
			
			ctx.moveTo(box.height / 2, box.width / 2);
			ctx.lineTo(-box.height / 2, -box.width / 2);

			ctx.moveTo(-box.height / 2, box.width / 2);
			ctx.lineTo(box.height / 2, -box.width / 2);
			ctx.fill();
			ctx.stroke();
		}

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.scale(1, 1);
		ctx.lineWidth = 3;
		//ctx.lineJoin = "round";
		//ctx.lineCap = "round";
		ctx.fillStyle = color;
		ctx.strokeStyle = "#2B2B2B";
		ctx.globalAlpha = 1;

		ctx.save();
		tankPath(ctx);
		ctx.restore();
		ctx.restore();
	}

	module.exports = Box;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Vector2d = __webpack_require__(1);
	var utils = __webpack_require__(2);

	function Camera(position, zoom, rotation) {
		this.position = position || new Vector2d();
		this.zoom     = zoom     || 1;
		this.rotation = rotation || 0;
		this.focus    = new Vector2d();
	};
	Camera.prototype = Object.create(Object.prototype);

	Camera.prototype.targeting = function(target) {
		return target.mult(this.zoom).rotate(this.rotation).add(this.position);
	};
	Camera.prototype.manipulation = function(keyboard, mouse) {

		if (keyboard.NumpadAdd.pressed || mouse.WheelUp.pressed   )  { this.zoom *= 1.1; }
		if (keyboard.NumpadSub.pressed || mouse.WheelDown.pressed )  { this.zoom /= 1.1; }

		if (keyboard.e.pressed)  { this.rotation -= 0.1; }
		if (keyboard.q.pressed)  { this.rotation += 0.1; }
	};

	Camera.prototype.focusing = function(focus) {
		if (focus === undefined) { focus = new Vector2d(); }
		this.focus.set(canvas.width / 2, canvas.height / 2);

		this.position = this.position.set(focus.positioning(this));
	};
	Camera.prototype.focusingEasing = function(focus) {
		// to do...
	};
	Camera.prototype.draw = function(context) {
		context.translate(this.position.x, this.position.y);
		context.scale(this.zoom, this.zoom);
		context.rotate(this.rotation);
	};
	Camera.prototype.toString = function() {
		return this.position.toString() +
			'zoom: ' + this.zoom + "\n" +
			'rotation: ' + this.rotation + "\n";
	};

	module.exports = Camera;

/***/ }
/******/ ]);