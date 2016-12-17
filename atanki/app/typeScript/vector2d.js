"use strict";
var Vector2d = (function () {
    function Vector2d(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    /**
     * fromAngle
     * Return new vector, from an angle
     */
    Vector2d.fromAngle = function (angle) {
        return new Vector2d(Math.cos(angle), Math.sin(angle));
    };
    /**
     * angleTo
     * Return new vector, to angle, maybe?
     */
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
    /**
     * .setZero()
     * Modifies, return vector with zero coordinates
     */
    Vector2d.prototype.setZero = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    /**
     * .copy()
     * Return new vector, copy of the vector
     */
    Vector2d.prototype.copy = function () {
        return new Vector2d(this.x, this.y);
    };
    /**
     * .mag()
     * Return scalar, the magnitude of the vector
     */
    Vector2d.prototype.mag = function () {
        return (Math.sqrt((this.x * this.x) +
            (this.y * this.y)));
    };
    /**
     * .magSq()
     * Return scalar, the magnitude of the vector, squared
     */
    Vector2d.prototype.magSq = function () {
        return ((this.x * this.x) + (this.y * this.y));
    };
    /**
     * .add(vec)
     * Modifies, return adds one vector to another
     */
    Vector2d.prototype.add = function (vec) {
        return new Vector2d((this.x + vec.x), (this.y + vec.y));
    };
    /**
     * .sub(vec)
     * Modifies, return subs one vector from another
     */
    Vector2d.prototype.sub = function (vec) {
        return new Vector2d((this.x - vec.x), (this.y - vec.y));
    };
    /**
     * .mult()
     * Modifies, return multiplies a vector by a scalar
     */
    Vector2d.prototype.mult = function (scalar) {
        return new Vector2d((this.x * scalar), (this.y * scalar));
    };
    /**
     * .div()
     * Modifies, return divide a vector by a scalar
     */
    Vector2d.prototype.div = function (scalar) {
        return new Vector2d((this.x / scalar), (this.y / scalar));
    };
    /**
     * .dist()
     * Return scalar, the distance between two points
     */
    Vector2d.prototype.dist = function (vec) {
        return Math.sqrt(Math.pow(this.x - vec.x, 2) +
            Math.pow(this.y - vec.y, 2));
    };
    /**
     * .dot()
     * Return scalar, the dot product of two vectors
     */
    Vector2d.prototype.dot = function (vec) {
        return (this.x * vec.x) + (this.y * vec.y);
    };
    /**
     * .normalize()
     * Modifies, return normalize the vector to a length of 1
     */
    Vector2d.prototype.normalize = function () {
        return this.div(this.mag());
    };
    /**
     * .limit()
     * Modifies, return limit the magnitude of the vector
     */
    Vector2d.prototype.limit = function (scalar) {
        if (this.magSq() > scalar * scalar) {
            this.normalize().mult(scalar);
        }
        return this;
    };
    /**
     * .setMag()
     * Modifies, return set the magnitude of the vector
     */
    Vector2d.prototype.setMag = function (scalar) {
        return this.normalize().mult(scalar);
    };
    /**
     * .heading()
     * Return angle of rotation for this vector
     */
    Vector2d.prototype.heading = function () {
        return Math.atan2(this.y, this.x);
    };
    /**
     * .rotate()
     * Modifies, return rotate the vector by an angle
     */
    Vector2d.prototype.rotate = function (angle) {
        return new Vector2d((this.x * Math.cos(angle)) - (this.y * Math.sin(angle)), (this.x * Math.sin(angle)) + (this.y * Math.cos(angle)));
    };
    /**
     * .lerp()
     * Modifies, return linear interpolate the vector to another vector
     */
    Vector2d.prototype.lerp = function (vec, amount) {
        if (amount > 1) {
            amount = 1;
        }
        if (amount < 0) {
            amount = 0;
        }
        return this.mult(amount).add(vec.copy().mult(1 - amount));
    };
    /**
     * invert()
     * Modifies, return inverted vector direction
     */
    Vector2d.prototype.invert = function () {
        var x = this.x * -1;
        var y = this.y * -1;
        return new Vector2d(x, y);
    };
    /**
     * positioning
     * something to do with the camera
     */
    Vector2d.prototype.positioning = function (camera) {
        return this.invert().rotate(camera.rotation).mult(camera.zoom).add(camera.focus);
    };
    /**
     * toArray
     */
    Vector2d.prototype.toArray = function () {
        return [this.x, this.y];
    };
    /**
     * toString
     */
    Vector2d.prototype.toString = function () {
        return "x:" +
            this.x.toFixed(2) +
            ", y:" +
            this.y.toFixed(2) +
            "\n";
    };
    return Vector2d;
}());
exports.Vector2d = Vector2d;
