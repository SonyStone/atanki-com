"use strict";
var vector2d_1 = require("./vector2d");
var Camera = (function () {
    function Camera(position, zoom, rotation) {
        this.position = position || new vector2d_1.Vector2d();
        this.zoom = zoom || 1;
        this.rotation = rotation || 0;
        this.focus = new vector2d_1.Vector2d();
    }
    /**
     * targeting
     */
    Camera.prototype.targeting = function (target) {
        return target.mult(this.zoom).rotate(this.rotation).add(this.position);
    };
    /**
     * manipulation
     */
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
            focus = new vector2d_1.Vector2d();
        }
        this.focus.set(canvas.width / 2, canvas.height / 2);
    };
    Camera.prototype.focusingEasing = function (focus) {
        // to do...
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
