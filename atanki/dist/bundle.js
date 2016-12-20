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
	var quad_tree_1 = __webpack_require__(6);
	var rectangle_1 = __webpack_require__(9);
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var mouse = utils_1.default.captureMouse(canvas);
	var keyboard = utils_1.default.captureKeyboard(window);
	var log = document.getElementById("log");
	var tank = [];
	var tankAmount = 10;
	var player = 0;
	for (var i = 0; i < tankAmount; i++) {
	    tank.push(new tank_1.default(Math.random() * 1000, Math.random() * 1000));
	    tank[i].color = utils_1.default.HSBtoRGB(Math.random() * 360, 75, 75);
	}
	var box = new box_1.default();
	var cam = new camera_1.default();
	var bounds = new rectangle_1.default(0, 0, 1000, 1000);
	var tree = new quad_tree_1.default(bounds, false, 7);
	function drawNode(node, ctx) {
	    var bounds = node.bounds;
	    ctx.save();
	    ctx.translate(bounds.x, bounds.y);
	    ctx.scale(1, 1);
	    ctx.lineWidth = 2;
	    ctx.strokeStyle = "#2B2B2B";
	    ctx.globalAlpha = 1;
	    ctx.save();
	    ctx.beginPath();
	    ctx.rect(0, 0, bounds.width, bounds.height);
	    ctx.stroke();
	    ctx.restore();
	    ctx.restore();
	    var len = node.nodes.length;
	    for (var i = 0; i < len; i++) {
	        drawNode(node.nodes[i], ctx);
	    }
	}
	var camTarget = new vector2d_1.default(canvas.width / 2, canvas.height / 2);
	var easing = 0.08;
	(function drawFrame() {
	    window.requestAnimationFrame(drawFrame, canvas);
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    if (keyboard.x.pressed) {
	        keyboard.x.pressed = false;
	        if (player + 1 < tankAmount) {
	            player++;
	        }
	        else {
	            player = 0;
	        }
	    }
	    if (keyboard.z.pressed) {
	        keyboard.z.pressed = false;
	        if (player - 1 > -1) {
	            player--;
	        }
	        else {
	            player = tankAmount - 1;
	        }
	    }
	    tank[player].player(keyboard, mouse, cam);
	    cam.manipulation(keyboard, mouse);
	    var v = (tank[player].position.sub(camTarget)).mult(easing);
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
	    for (var _i = 0, tank_2 = tank; _i < tank_2.length; _i++) {
	        var t = tank_2[_i];
	        t.draw(context);
	    }
	    tank[player].drawHelp(context);
	    box.draw(context);
	    tree.clear();
	    tree.insert(tank);
	    for (var _a = 0, tank_3 = tank; _a < tank_3.length; _a++) {
	        var t = tank_3[_a];
	        tree.retrieve(t);
	    }
	    drawNode(tree.root, context);
	    context.restore();
	    log.value = null;
	    log.value += "--- canvas ---" + "\n";
	    log.value += "cam " + cam.toString() + "\n";
	    log.value += "--- tank ---" + "\n";
	    log.value += "play tank #" + player + "\n";
	    log.value += "tank " + tank[player].toString() + "\n";
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
	            x: { code: 88, pressed: false },
	            z: { code: 90, pressed: false },
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
	        this.width = 5;
	        this.height = 5;
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var node_1 = __webpack_require__(7);
	var bounds_node_1 = __webpack_require__(8);
	var QuadTree = (function () {
	    function QuadTree(bounds, pointQuad, maxDepth, maxChildren) {
	        this.root = null;
	        var node;
	        if (pointQuad) {
	            node = new node_1.default(bounds, 0, maxDepth, maxChildren);
	        }
	        else {
	            node = new bounds_node_1.default(bounds, 0, maxDepth, maxChildren);
	        }
	        this.root = node;
	    }
	    QuadTree.prototype.insert = function (item) {
	        if (item instanceof Array) {
	            var len = item.length;
	            for (var i = 0; i < len; i++) {
	                this.root.insert(item[i]);
	            }
	        }
	        else {
	            this.root.insert(item);
	        }
	    };
	    QuadTree.prototype.clear = function () {
	        this.root.clear();
	    };
	    QuadTree.prototype.retrieve = function (item) {
	        var out = this.root.retrieve(item).slice(0);
	        return out;
	    };
	    return QuadTree;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = QuadTree;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	var Node = (function () {
	    function Node(bounds, depth, maxDepth, maxChildren) {
	        this.nodes = null;
	        this.children = null;
	        this.classConstructor = Node;
	        this.bounds = null;
	        this.depth = 0;
	        this.maxChildren = 4;
	        this.maxDepth = 4;
	        this.bounds = bounds;
	        this.children = [];
	        this.nodes = [];
	    }
	    Node.prototype.insert = function (item) {
	        if (this.nodes.length) {
	            var index = this.findIndex(item);
	            this.nodes[index].insert(item);
	            return;
	        }
	        this.children.push(item);
	        var len = this.children.length;
	        if (!(this.depth >= this.maxDepth) && len > this.maxChildren) {
	            this.subdivide();
	            for (var i = 0; i < len; i++) {
	                this.insert(this.children[i]);
	            }
	            this.children.length = 0;
	        }
	    };
	    Node.prototype.retrieve = function (item) {
	        if (this.nodes.length) {
	            var index = this.findIndex(item);
	            return this.nodes[index].retrieve(item);
	        }
	        return this.children;
	    };
	    Node.prototype.subdivide = function () {
	        var depth = this.depth + 1;
	        var bx = this.bounds.x;
	        var by = this.bounds.y;
	        var b_w_h = (this.bounds.width / 2);
	        var b_h_h = (this.bounds.height / 2);
	        var bx_b_w_h = bx + b_w_h;
	        var by_b_h_h = by + b_h_h;
	        this.nodes[Node.TOP_LEFT] = new this.classConstructor({
	            x: bx,
	            y: by,
	            width: b_w_h,
	            height: b_h_h,
	        }, depth, this.maxDepth, this.maxChildren);
	        this.nodes[Node.TOP_RIGHT] = new this.classConstructor({
	            x: bx_b_w_h,
	            y: by,
	            width: b_w_h,
	            height: b_h_h,
	        }, depth, this.maxDepth, this.maxChildren);
	        this.nodes[Node.BOTTOM_LEFT] = new this.classConstructor({
	            x: bx,
	            y: by_b_h_h,
	            width: b_w_h,
	            height: b_h_h,
	        }, depth, this.maxDepth, this.maxChildren);
	        this.nodes[Node.BOTTOM_RIGHT] = new this.classConstructor({
	            x: bx_b_w_h,
	            y: by_b_h_h,
	            width: b_w_h,
	            height: b_h_h,
	        }, depth, this.maxDepth, this.maxChildren);
	    };
	    Node.prototype.clear = function () {
	        this.children.length = 0;
	        var len = this.nodes.length;
	        for (var i = 0; i < len; i++) {
	            this.nodes[i].clear();
	        }
	        this.nodes.length = 0;
	    };
	    Node.prototype.findIndex = function (item) {
	        var b = this.bounds;
	        var left = (item.position.x > b.x + b.width / 2) ? false : true;
	        var top = (item.position.y > b.y + b.height / 2) ? false : true;
	        var index = Node.TOP_LEFT;
	        if (left) {
	            if (!top) {
	                index = Node.BOTTOM_LEFT;
	            }
	        }
	        else {
	            if (top) {
	                index = Node.TOP_RIGHT;
	            }
	            else {
	                index = Node.BOTTOM_RIGHT;
	            }
	        }
	        return index;
	    };
	    return Node;
	}());
	Node.TOP_LEFT = 0;
	Node.TOP_RIGHT = 1;
	Node.BOTTOM_LEFT = 2;
	Node.BOTTOM_RIGHT = 3;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Node;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var node_1 = __webpack_require__(7);
	var BoundsNode = (function (_super) {
	    __extends(BoundsNode, _super);
	    function BoundsNode(bounds, depth, maxChildren, maxDepth) {
	        var _this = _super.call(this, bounds, depth, maxChildren, maxDepth) || this;
	        _this.classConstructor = BoundsNode;
	        _this.stuckChildren = null;
	        _this.out = [];
	        _this.stuckChildren = [];
	        return _this;
	    }
	    BoundsNode.prototype.insert = function (item) {
	        if (this.nodes.length) {
	            var index = this.findIndex(item);
	            var node = this.nodes[index];
	            if (item.position.x >= node.bounds.x &&
	                item.position.x + item.width <= node.bounds.x + node.bounds.width &&
	                item.position.y >= node.bounds.y &&
	                item.position.y + item.height <= node.bounds.y + node.bounds.height) {
	                this.nodes[index].insert(item);
	            }
	            else {
	                this.stuckChildren.push(item);
	            }
	            return;
	        }
	        this.children.push(item);
	        var len = this.children.length;
	        if (!(this.depth >= this.maxDepth) && len > this.maxChildren) {
	            this.subdivide();
	            for (var i = 0; i < len; i++) {
	                this.insert(this.children[i]);
	            }
	            this.children.length = 0;
	        }
	    };
	    BoundsNode.prototype.getChildren = function () {
	        return this.children.concat(this.stuckChildren);
	    };
	    BoundsNode.prototype.retrieve = function (item) {
	        var out = this.out;
	        out.length = 0;
	        if (this.nodes.length) {
	            var index = this.findIndex(item);
	            var node = this.nodes[index];
	            if (item.position.x >= node.bounds.x &&
	                item.position.x + item.width <= node.bounds.x + node.bounds.width &&
	                item.position.y >= node.bounds.y &&
	                item.position.y + item.height <= node.bounds.y + node.bounds.height) {
	                out.push.apply(out, this.nodes[index].retrieve(item));
	            }
	            else {
	                if (item.position.x <= this.nodes[node_1.default.TOP_RIGHT].bounds.x) {
	                    if (item.position.y <= this.nodes[node_1.default.BOTTOM_LEFT].bounds.y) {
	                        out.push.apply(out, this.nodes[node_1.default.TOP_LEFT].getAllContent());
	                    }
	                    if (item.position.y + item.height > this.nodes[node_1.default.BOTTOM_LEFT].bounds.y) {
	                        out.push.apply(out, this.nodes[node_1.default.BOTTOM_LEFT].getAllContent());
	                    }
	                }
	                if (item.position.x + item.width > this.nodes[node_1.default.TOP_RIGHT].bounds.x) {
	                    if (item.position.y <= this.nodes[node_1.default.BOTTOM_RIGHT].bounds.y) {
	                        out.push.apply(out, this.nodes[node_1.default.TOP_RIGHT].getAllContent());
	                    }
	                    if (item.position.y + item.height > this.nodes[node_1.default.BOTTOM_RIGHT].bounds.y) {
	                        out.push.apply(out, this.nodes[node_1.default.BOTTOM_RIGHT].getAllContent());
	                    }
	                }
	            }
	        }
	        out.push.apply(out, this.stuckChildren);
	        out.push.apply(out, this.children);
	        return out;
	    };
	    BoundsNode.prototype.getAllContent = function () {
	        var out = this.out;
	        if (this.nodes.length) {
	            for (var i = 0; i < this.nodes.length; i++) {
	                this.nodes[i].getAllContent();
	            }
	        }
	        out.push.apply(out, this.stuckChildren);
	        out.push.apply(out, this.children);
	        return out;
	    };
	    BoundsNode.prototype.clear = function () {
	        this.stuckChildren.length = 0;
	        this.children.length = 0;
	        var len = this.nodes.length;
	        if (!len) {
	            return;
	        }
	        for (var i = 0; i < len; i++) {
	            this.nodes[i].clear();
	        }
	        this.nodes.length = 0;
	    };
	    return BoundsNode;
	}(node_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BoundsNode;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	var Rectangle = (function () {
	    function Rectangle(x, y, width, height) {
	        this.x = x;
	        this.y = y;
	        this.width = width;
	        this.height = height;
	    }
	    return Rectangle;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Rectangle;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map