export default class Vec2 {

    /**
     * Return new vector, from an angle
     */
    public static fromAngle(angle: number): Vec2 {
        return new Vec2(Math.cos(angle), Math.sin(angle));
    }

    /**
     * Return new vector, to angle, maybe?
     */
    public static angleTo(vector1: Vec2, vector2: Vec2): number {
        return Math.atan2((vector1.y - vector2.y), (vector1.x - vector2.x));
    }

    /**
     * Return new vector, to angle, maybe?
     */
    public static clone(vector: Vec2): Vec2  {
        return vector.clone();
    }

    /**
     * Returns the magnitude (length) of a vector.
     */
    public static magnitude(vector: Vec2): number {
        return vector.mag();
    }

    /**
     * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
     */
    public static magnitudeSquared(vector: Vec2): number {
        return vector.magSq();
    }

    public static rotate(vector: Vec2, angle: number): Vec2 {
        return new Vec2(vector).rotate(angle);
    }

    public static isLessOrEqual(vectorA: Vec2, vectorB: Vec2) {
        return (
            (vectorA.getX() <= vectorB.getX()) &&
            (vectorA.getY() <= vectorB.getY())
        );
    }

    public static isGreaterOrEqual(vectorA: Vec2, vectorB: Vec2) {
        return (
            (vectorA.getX() >= vectorB.getX()) &&
            (vectorA.getY() >= vectorB.getY())
        );
    }

    public static isLess(vectorA: Vec2, vectorB: Vec2) {
        return (
            (vectorA.getX() < vectorB.getX()) &&
            (vectorA.getY() < vectorB.getY())
        );
    }

    public static isGreater(vectorA: Vec2, vectorB: Vec2) {
        return (
            (vectorA.getX() > vectorB.getX()) &&
            (vectorA.getY() > vectorB.getY())
        );
    }


    public x: number;
    public y: number;

    constructor(x?, y?) {
        /**
         * @member {number}
         * @default 0
         */
        this.x = x || 0;

        /**
         * @member {number}
         * @default 0
         */
        this.y = y || 0;
    }

    /**
     * Modifies, return set the components of the vector
     * with black magic
     */
    public set(array: [])
    public set(obj: object);
    public set(vec: Vec2): Vec2;
    public set(x: number, y: number): Vec2;

    public set(any: any, y?: number): Vec2 {
        if (any.isArray()) {
            this.x = any[0];
            this.y = any[1]; 
        } else if (typeof any === "object") {
            this.x = any.x;
            this.y = any.y;
        } else if (typeof any === "number" && typeof y === "number") {
            this.x = any;
            this.y = y;
        }
        return this;
    }

    /**
     * Modifies, return vector with zero coordinates
     */
    public zero(): Vec2 {
        this.x = 0;
        this.y = 0;
        return this;
    }

    public setX(x: number): Vec2 {
        this.x = x;
        return this;
    }

    public setY(y: number): Vec2 {
        this.y = y;
        return this;
    }

    public getX(): number {
        return this.x
    }

    public getY(): number {
        return this.y
    }

    /**
     * Return new vector, copy of the vector
     * @return {Vec2} copy of the vector
     */
    public clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    /**
     * Return new vector, copy of the vector
     * @return {Vec2} copy of the vector
     */
    public copy(vec: Vec2): Vec2 {
        return this.set(vec);
    }

    /**
     * Return scalar, the magnitude of the vector
     */
    public mag(): number {
        return (Math.sqrt(
            (this.x * this.x) +
            (this.y * this.y),
        ));
    }

    /**
     * .magSq()
     * Return scalar, the magnitude of the vector, squared
     */
    public magSq(): number {
        return ((this.x * this.x) + (this.y * this.y));
    }

    /**
     * .add(vec)
     * Modifies, return adds one vector to another
     */
    public add(vec: Vec2): Vec2 {
        return new Vec2(
            (this.x + vec.x),
            (this.y + vec.y),
        );
    }

    /**
     * .sub(vec)
     * Modifies, return subs one vector from another
     */
    public sub(vec: Vec2): Vec2 {
        return new Vec2(
            (this.x - vec.x),
            (this.y - vec.y),
        );
    }

    /**
     * .mult()
     * Modifies, return multiplies a vector by a scalar
     */
    public mult(scalar: number): Vec2 {
        return new Vec2(
            (this.x * scalar),
            (this.y * scalar),
        );
    }

    /**
     * .div()
     * Modifies, return divide a vector by a scalar
     */
    public div(scalar: number): Vec2 {
        return new Vec2(
            (this.x / scalar),
            (this.y / scalar),
        );
    }

    /**
     * .dist()
     * Return scalar, the distance between two points
     */
    public dist(vec: Vec2): number {
        return Math.sqrt(
            Math.pow(this.x - vec.x, 2) +
            Math.pow(this.y - vec.y, 2),
        );
    }

    /**
     * .dot()
     * Return scalar, the dot product of two vectors
     */
    public dot(vec: Vec2): number {
        return (this.x * vec.x) + (this.y * vec.y);
    }

    /**
     * .normalize()
     * Modifies, return normalize the vector to a length of 1
     */
    public normalize(): Vec2 {
        return this.div(this.mag());
    }

    /**
     * .limit()
     * Modifies, return limit the magnitude of the vector
     */
    public limit(scalar: number): Vec2 {
        if (this.magSq() > scalar * scalar) {
            this.normalize().mult(scalar);
        }
        return this;
    }

    /**
     * .setMag()
     * Modifies, return set the magnitude of the vector
     */
    public setMag(scalar: number): Vec2 {
        return this.normalize().mult(scalar);
    }

    /**
     * .heading()
     * Return angle of rotation for this vector
     */
    public heading():number {
        return Math.atan2(this.y, this.x);
    }

    /**
     * .rotate()
     * Modifies, return rotate the vector by an angle
     */
    public rotate(angle: number): Vec2 {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return new Vec2(
            (this.x * cos) - (this.y * sin),
            (this.x * sin) + (this.y * cos),
        );
    }

    /**
     * .lerp()
     * Modifies, return linear interpolate the vector to another vector
     */
    public lerp(vec: Vec2, amount: number): Vec2 {
        if (amount > 1) { amount = 1; }
        if (amount < 0) { amount = 0; }
        return this.mult(amount).add(vec.clone().mult(1 - amount));
    }

    /**
     * invert()
     * Modifies, return inverted vector direction
     */
    public invert(): Vec2 {
        let x = this.x * -1;
        let y = this.y * -1;
        return new Vec2(x, y);
    }

    /**
     * positioning
     * something to do with the camera
     */
    public positioning(camera): Vec2 {
        return this.invert().rotate(camera.rotation).mult(camera.zoom).add(camera.focus);
    }

    /**
     * toArray
     */
    public toArray(): number[] {
        return [this.x, this.y];
    }

    /**
     * toString
     */
    public toString(): string {
        return "x:" +
            this.x.toFixed(2) +
            ", y:" +
            this.y.toFixed(2) +
            "\n";
    }
}