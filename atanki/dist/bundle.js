/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var vector2d_1 = __webpack_require__(1);
	var utils_1 = __webpack_require__(2);
	var tank_1 = __webpack_require__(3);
	var box_1 = __webpack_require__(4);
	var camera_1 = __webpack_require__(5);
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var mouse = utils_1.default.captureMouse(canvas);
	var keyboard = utils_1.default.captureKeyboard(window);
	var log = document.getElementById("log");
	var tank = new tank_1.default(30, 70);
	var tank2 = new tank_1.default(-10, 20);
	var box = new box_1.default();
	var cam = new camera_1.default();
	var camTarget = new vector2d_1.default(canvas.width / 2, canvas.height / 2);
	var easing = 0.08;
	(function drawFrame() {
	    window.requestAnimationFrame(drawFrame, canvas);
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    tank.player(keyboard, mouse, cam);
	    cam.manipulation(keyboard, mouse);
	    var v = (tank.position.sub(camTarget)).mult(easing);
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
	    tank.color = utils_1.default.HSBtoRGB(300, 75, 75);
	    tank.draw(context);
	    tank.drawHelp(context);
	    box.draw(context);
	    context.restore();
	    log.value = null;
	    log.value += "--- canvas ---" + "\n";
	    log.value += "cam " + cam.toString() + "\n";
	    log.value += "--- tank ---" + "\n";
	    log.value += "tank " + tank.toString() + "\n";
	})();


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var Vector2d = (function () {
	    function Vector2d(x, y) {
	        this.x = x || 0;
	        this.y = y || 0;
	    }
	    Vector2d.fromAngle = function (angle) {
	        return new Vector2d(Math.cos(angle), Math.sin(angle));
	    };
	    Vector2d.angleTo = function (vec1, vec2) {
	        return Math.atan2((vec1.y - vec2.y), (vec1.x - vec2.x));
	    };
	    Vector2d.prototype.set = function (xOrVec, y) {
	        if (typeof xOrVec === "object") {
	            this.x = xOrVec.x;
	            this.y = xOrVec.y;
	        }
	        else if (typeof xOrVec === "number" && typeof y === "number") {
	            this.x = xOrVec;
	            this.y = y;
	        }
	        return this;
	    };
	    Vector2d.prototype.setZero = function () {
	        this.x = 0;
	        this.y = 0;
	        return this;
	    };
	    Vector2d.prototype.copy = function () {
	        return new Vector2d(this.x, this.y);
	    };
	    Vector2d.prototype.mag = function () {
	        return (Math.sqrt((this.x * this.x) +
	            (this.y * this.y)));
	    };
	    Vector2d.prototype.magSq = function () {
	        return ((this.x * this.x) + (this.y * this.y));
	    };
	    Vector2d.prototype.add = function (vec) {
	        return new Vector2d((this.x + vec.x), (this.y + vec.y));
	    };
	    Vector2d.prototype.sub = function (vec) {
	        return new Vector2d((this.x - vec.x), (this.y - vec.y));
	    };
	    Vector2d.prototype.mult = function (scalar) {
	        return new Vector2d((this.x * scalar), (this.y * scalar));
	    };
	    Vector2d.prototype.div = function (scalar) {
	        return new Vector2d((this.x / scalar), (this.y / scalar));
	    };
	    Vector2d.prototype.dist = function (vec) {
	        return Math.sqrt(Math.pow(this.x - vec.x, 2) +
	            Math.pow(this.y - vec.y, 2));
	    };
	    Vector2d.prototype.dot = function (vec) {
	        return (this.x * vec.x) + (this.y * vec.y);
	    };
	    Vector2d.prototype.normalize = function () {
	        return this.div(this.mag());
	    };
	    Vector2d.prototype.limit = function (scalar) {
	        if (this.magSq() > scalar * scalar) {
	            this.normalize().mult(scalar);
	        }
	        return this;
	    };
	    Vector2d.prototype.setMag = function (scalar) {
	        return this.normalize().mult(scalar);
	    };
	    Vector2d.prototype.heading = function () {
	        return Math.atan2(this.y, this.x);
	    };
	    Vector2d.prototype.rotate = function (angle) {
	        return new Vector2d((this.x * Math.cos(angle)) - (this.y * Math.sin(angle)), (this.x * Math.sin(angle)) + (this.y * Math.cos(angle)));
	    };
	    Vector2d.prototype.lerp = function (vec, amount) {
	        if (amount > 1) {
	            amount = 1;
	        }
	        if (amount < 0) {
	            amount = 0;
	        }
	        return this.mult(amount).add(vec.copy().mult(1 - amount));
	    };
	    Vector2d.prototype.invert = function () {
	        var x = this.x * -1;
	        var y = this.y * -1;
	        return new Vector2d(x, y);
	    };
	    Vector2d.prototype.positioning = function (camera) {
	        return this.invert().rotate(camera.rotation).mult(camera.zoom).add(camera.focus);
	    };
	    Vector2d.prototype.toArray = function () {
	        return [this.x, this.y];
	    };
	    Vector2d.prototype.toString = function () {
	        return "x:" +
	            this.x.toFixed(2) +
	            ", y:" +
	            this.y.toFixed(2) +
	            "\n";
	    };
	    return Vector2d;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Vector2d;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var Utils = (function () {
	    function Utils() {
	    }
	    Utils.captureMouse = function (element) {
	        var mouse = {
	            x: 0,
	            y: 0,
	            LButton: { code: 0, pressed: false },
	            RButton: { code: 2, pressed: false },
	            MButton: { code: 1, pressed: false },
	            WheelUp: {
	                click: false,
	                get pressed() {
	                    if (this.click) {
	                        this.click = false;
	                        return true;
	                    }
	                    return false;
	                }
	            },
	            WheelDown: {
	                click: false,
	                get pressed() {
	                    if (this.click) {
	                        this.click = false;
	                        return true;
	                    }
	                    return false;
	                },
	            },
	        };
	        element.oncontextmenu = function (a) {
	            a.preventDefault();
	        };
	        element.addEventListener('mousemove', function (event) {
	            var x, y;
	            var mouse_event = eventPositionCapture(x, y, event, element);
	            mouse.x = mouse_event.x;
	            mouse.y = mouse_event.y;
	        }, false);
	        element.addEventListener('mousedown', function (event) {
	            var name;
	            for (name in mouse) {
	                if (mouse.hasOwnProperty(name)) {
	                    if (mouse[name].code === event.button) {
	                        mouse[name].pressed = true;
	                    }
	                }
	            }
	        }, false);
	        element.addEventListener('mouseup', function (event) {
	            var buttonName;
	            for (var name_1 in mouse) {
	                if (mouse.hasOwnProperty(name_1)) {
	                    if (mouse[name_1].code === event.button) {
	                        mouse[name_1].pressed = false;
	                    }
	                }
	            }
	        }, false);
	        element.addEventListener('wheel', function (event) {
	            if (event.deltaY < 0) {
	                mouse["WheelUp"].click = true;
	            }
	            else {
	                mouse["WheelDown"].click = true;
	            }
	        }, false);
	        return mouse;
	    };
	    ;
	    Utils.captureTouch = function (element) {
	        var touch = { x: null, y: null, isPressed: false };
	        element.addEventListener('touchstart', function (event) {
	            touch.isPressed = true;
	        }, false);
	        element.addEventListener('touchend', function (event) {
	            touch.isPressed = false;
	            touch.x = null;
	            touch.y = null;
	        }, false);
	        element.addEventListener('touchmove', function (event) {
	            var x, y;
	            var touch_event = eventPositionCapture(x, y, event.touches[0], element);
	            touch.x = touch_event.x;
	            touch.y = touch_event.y;
	        }, false);
	        return touch;
	    };
	    Utils.captureKeyboard = function (element) {
	        var key = {
	            left: { code: 37, pressed: false },
	            right: { code: 39, pressed: false },
	            up: { code: 38, pressed: false },
	            down: { code: 40, pressed: false },
	            w: { code: 87, pressed: false },
	            a: { code: 65, pressed: false },
	            s: { code: 83, pressed: false },
	            d: { code: 68, pressed: false },
	            e: { code: 69, pressed: false },
	            q: { code: 81, pressed: false },
	            NumpadAdd: { code: 107, pressed: false },
	            NumpadSub: { code: 109, pressed: false }
	        };
	        element.addEventListener("keydown", function (event) {
	            var name;
	            for (name in key) {
	                if (key.hasOwnProperty(name)) {
	                    if (key[name].code === event.keyCode) {
	                        key[name].pressed = true;
	                    }
	                }
	            }
	        }, false);
	        element.addEventListener("keyup", function (event) {
	            var name;
	            for (name in key) {
	                if (key.hasOwnProperty(name)) {
	                    if (key[name].code === event.keyCode) {
	                        key[name].pressed = false;
	                    }
	                }
	            }
	        }, false);
	        return key;
	    };
	    Utils.colorToRGB = function (color, alpha) {
	        if (typeof color === 'string' && color[0] === '#') {
	            color = parseInt(color.slice(1), 16);
	        }
	        alpha = (alpha === undefined) ? 1 : alpha;
	        var r = color >> 16 & 0xff;
	        var g = color >> 8 & 0xff;
	        var b = color & 0xff;
	        var a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
	        if (a === 1) {
	            return "rgb(" + r + "," + g + "," + b + ")";
	        }
	        else {
	            return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	        }
	    };
	    Utils.HSBtoRGB = function (hue, saturation, brightness, radians) {
	        if (hue === undefined) {
	            hue = 0;
	        }
	        if (saturation === undefined) {
	            saturation = 75;
	        }
	        if (brightness === undefined) {
	            brightness = 75;
	        }
	        if (radians === undefined) {
	            radians = false;
	        }
	        if (radians) {
	            hue *= 180 / Math.PI;
	        }
	        var HSB = {
	            h: hue % 360,
	            s: saturation / 100,
	            b: brightness / 100
	        };
	        var RGB = {
	            r: null,
	            g: null,
	            b: null,
	            color: function () {
	                return "rgb(" + Math.round(this.r) +
	                    "," + Math.round(this.g) +
	                    "," + Math.round(this.b) + ")";
	            }
	        };
	        var chroma;
	        var hueI;
	        var x;
	        var m;
	        if (HSB.h < 0) {
	            HSB.h += 360;
	        }
	        if (HSB.s > 100) {
	            HSB.s = 100;
	        }
	        else if (HSB.s < 0) {
	            HSB.s = 0;
	        }
	        if (HSB.b > 100) {
	            HSB.b = 100;
	        }
	        else if (HSB.b < 0) {
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
	    Utils.containsPoint = function (rect, x, y) {
	        return !(x < rect.x || x > rect.x + rect.width ||
	            y < rect.y || y > rect.y + rect.height);
	    };
	    Utils.angleNormalize = function (angle) {
	        return Math.atan2(Math.sin(angle), Math.cos(angle));
	    };
	    return Utils;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Utils;
	function eventPositionCapture(x, y, event, element) {
	    if (event.pageX || event.pageY) {
	        x = event.pageX;
	        y = event.pageY;
	    }
	    else {
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(2);
	var vector2d_1 = __webpack_require__(1);
	var Tank = (function () {
	    function Tank(x, y) {
	        this.position = new vector2d_1.default();
	        this.color = utils_1.default.HSBtoRGB(360, 75, 75);
	        this.direction = new vector2d_1.default();
	        this.rotation = 0;
	        this.speed = 5;
	        this.positionRotation = 0;
	        this.target = new vector2d_1.default();
	        this.targetRotation = 0;
	        this.scaleX = 1;
	        this.scaleY = 1;
	        this.lineWidth = 2;
	        this.transparency = 1;
	        this.pull = new vector2d_1.default(x, y) || new vector2d_1.default();
	    }
	    Tank.prototype.player = function (keyboard, mouse, camera) {
	        this.targetRotation = vector2d_1.default.angleTo(this.target.set(mouse), camera.targeting(this.position)) - camera.rotation;
	        var speed = 0;
	        if (keyboard.up.pressed || keyboard.w.pressed) {
	            this.direction = this.direction.add(vector2d_1.default.fromAngle(-Math.PI / 2 - camera.rotation));
	            speed = this.speed;
	        }
	        if (keyboard.down.pressed || keyboard.s.pressed) {
	            this.direction = this.direction.add(vector2d_1.default.fromAngle(Math.PI / 2 - camera.rotation));
	            speed = this.speed;
	        }
	        if (keyboard.left.pressed || keyboard.a.pressed) {
	            this.direction = this.direction.add(vector2d_1.default.fromAngle(Math.PI - camera.rotation));
	            speed = this.speed;
	        }
	        if (keyboard.right.pressed || keyboard.d.pressed) {
	            this.direction = this.direction.add(vector2d_1.default.fromAngle(0 - camera.rotation));
	            speed = this.speed;
	        }
	        this.direction = this.direction.normalize();
	        this.pull = this.pull.add(this.direction.mult(speed));
	    };
	    Tank.prototype.draw = function (ctx) {
	        var gun = {
	            Length: 30,
	            Width: 10,
	            TurretRadius: 10
	        };
	        var tank = {
	            Length: 40,
	            Width: 30
	        };
	        this.positionRotation = vector2d_1.default.angleTo(this.pull, this.position);
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
	        var scale = 1;
	        ctx.save();
	        ctx.translate(this.position.x, this.position.y);
	        ctx.moveTo(0, 0);
	        ctx.fillStyle = "#ff0000";
	        ctx.strokeStyle = "#00ff00";
	        ctx.scale(scale, scale);
	        function pointDraw(rotation, positionX, positionY) {
	            if (rotation === undefined) {
	                rotation = 0;
	            }
	            if (positionX === undefined) {
	                positionX = 0;
	            }
	            if (positionY === undefined) {
	                positionY = 0;
	            }
	            ctx.save();
	            ctx.beginPath();
	            ctx.rotate(rotation);
	            ctx.arc(positionX, positionY, 2, 0, (Math.PI * 2), false);
	            ctx.closePath();
	            ctx.fill();
	            ctx.restore();
	        }
	        function arcAngleDraw(angle1, angle2, radius) {
	            if (angle1 === undefined) {
	                angle1 = 0;
	            }
	            if (angle2 === undefined) {
	                angle2 = 0;
	            }
	            if (radius === undefined) {
	                radius = 10;
	            }
	            angle1 = utils_1.default.angleNormalize(angle1);
	            angle2 = utils_1.default.angleNormalize(angle2);
	            var difference = angle1 - angle2;
	            ctx.save();
	            ctx.beginPath();
	            if (Math.sin(difference) > 0) {
	                ctx.arc(0, 0, radius, (angle1), (angle2), true);
	            }
	            else {
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
	        arcAngleDraw(this.targetRotation, this.positionRotation, 50);
	        ctx.restore();
	    };
	    Tank.prototype.toString = function () {
	        return "position x:" + this.position.x.toFixed(2) + ", y:" + this.position.y.toFixed(2) + "\n" +
	            "pull x:" + this.pull.x.toFixed(2) + ", y:" + this.pull.y.toFixed(2) + "\n" +
	            "direction x:" + this.direction.x.toFixed(2) + ", y:" + this.direction.y.toFixed(2) + "\n" +
	            "targetRotation " + this.targetRotation.toFixed(2) + "\n" +
	            "positionRotation " + this.positionRotation.toFixed(2) + "\n" +
	            "rotation: " + this.rotation.toFixed(2) + "\n";
	    };
	    return Tank;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Tank;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var Box = (function () {
	    function Box() {
	        this.x = 200;
	        this.y = 200;
	        this.size = { height: 45, width: 45 };
	        this.color = "#9C9C9C";
	    }
	    Box.prototype.draw = function (ctx) {
	        ctx.save();
	        ctx.translate(this.x, this.y);
	        ctx.rotate(this.angle);
	        ctx.scale(1, 1);
	        ctx.lineWidth = 3;
	        ctx.fillStyle = this.color;
	        ctx.strokeStyle = "#2B2B2B";
	        ctx.globalAlpha = 1;
	        ctx.save();
	        ctx.beginPath();
	        ctx.rect(-this.size.height / 2, -this.size.width / 2, this.size.height, this.size.width);
	        ctx.moveTo(this.size.height / 2, this.size.width / 2);
	        ctx.lineTo(-this.size.height / 2, -this.size.width / 2);
	        ctx.moveTo(-this.size.height / 2, this.size.width / 2);
	        ctx.lineTo(this.size.height / 2, -this.size.width / 2);
	        ctx.fill();
	        ctx.stroke();
	        ctx.restore();
	        ctx.restore();
	    };
	    return Box;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Box;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var vector2d_1 = __webpack_require__(1);
	var Camera = (function () {
	    function Camera(position, zoom, rotation) {
	        this.position = position || new vector2d_1.default();
	        this.zoom = zoom || 1;
	        this.rotation = rotation || 0;
	        this.focus = new vector2d_1.default();
	    }
	    Camera.prototype.targeting = function (target) {
	        return target.mult(this.zoom).rotate(this.rotation).add(this.position);
	    };
	    Camera.prototype.manipulation = function (keyboard, mouse) {
	        if (keyboard.NumpadAdd.pressed || mouse.WheelUp.pressed) {
	            this.zoom *= 1.1;
	        }
	        if (keyboard.NumpadSub.pressed || mouse.WheelDown.pressed) {
	            this.zoom /= 1.1;
	        }
	        if (keyboard.e.pressed) {
	            this.rotation -= 0.1;
	        }
	        if (keyboard.q.pressed) {
	            this.rotation += 0.1;
	        }
	    };
	    Camera.prototype.focusing = function (canvas, focus) {
	        if (focus === undefined) {
	            focus = new vector2d_1.default();
	        }
	        this.focus.set(canvas.width / 2, canvas.height / 2);
	        this.position = this.position.set(focus.positioning(this));
	    };
	    Camera.prototype.focusingEasing = function (focus) {
	    };
	    Camera.prototype.draw = function (context) {
	        context.translate(this.position.x, this.position.y);
	        context.scale(this.zoom, this.zoom);
	        context.rotate(this.rotation);
	    };
	    Camera.prototype.toString = function () {
	        return this.position.toString() +
	            "zoom: " + this.zoom + "\n" +
	            "rotation: " + this.rotation + "\n";
	    };
	    return Camera;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Camera;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map