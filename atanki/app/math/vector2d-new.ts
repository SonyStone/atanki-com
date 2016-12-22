export default class Vector2d {

	/**
	 * Return new vector, from an angle
	 */
	public static fromAngle(angle: number): Vector2d {
		return new Vector2d(Math.cos(angle), Math.sin(angle));
	}

	/**
	 * Return new vector, to angle, maybe?
	 */
	public static angleTo(vector1: Vector2d, vector2: Vector2d): number {
		return Math.atan2((vector1.y - vector2.y), (vector1.x - vector2.x));
	}

	/**
	 * Return new vector, to angle, maybe?
	 */
	public static clone(vector: Vector2d): Vector2d  {
		return new Vector2d(vector.x, vector.y);
	}

	/**
	 * Returns the magnitude (length) of a vector.
	 */
	public static magnitude(vector: Vector2d): number {
		return (Math.sqrt(
			(vector.getX() * vector.getX()) +
			(vector.getY() * vector.getY()),
		));
	}

	/**
	 * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
	 */
	public static magnitudeSquared(vector: Vector2d): number {
		return (
			(vector.getX() * vector.getX()) +
			(vector.getY() * vector.getY())
		);
	}

	public static rotate(vector: Vector2d, angle: number): Vector2d {
		return new Vector2d(
			(vector.getX() * Math.cos(angle)) - (vector.getY() * Math.sin(angle)),
			(vector.getX() * Math.sin(angle)) + (vector.getY() * Math.cos(angle)),
		);
	}

	public static isLessOrEqual(vectorA: Vector2d, vectorB: Vector2d) {
		return (
			(vectorA.getX() <= vectorB.getX()) &&
			(vectorA.getY() <= vectorB.getY())
		);
	}

	public static isGreaterOrEqual(vectorA: Vector2d, vectorB: Vector2d) {
		return (
			(vectorA.getX() >= vectorB.getX()) &&
			(vectorA.getY() >= vectorB.getY())
		);
	}

	public static isLess(vectorA: Vector2d, vectorB: Vector2d) {
		return (
			(vectorA.getX() < vectorB.getX()) &&
			(vectorA.getY() < vectorB.getY())
		);
	}

	public static isGreater(vectorA: Vector2d, vectorB: Vector2d) {
		return (
			(vectorA.getX() > vectorB.getX()) &&
			(vectorA.getY() > vectorB.getY())
		);
	}


	public x: number;
	public y: number;

	constructor(x?, y?) {
		this.x = x || 0;
		this.y = y || 0;
	}

	/**
	 * Modifies, return set the components of the vector
	 * with black magic
	 */
	public set(vec: Vector2d): Vector2d;
	public set(x: number, y: number): Vector2d;

	public set(xOrVec: any, y?: number): Vector2d {
		if (typeof xOrVec === "object") {
			this.x = xOrVec.x;
			this.y = xOrVec.y;
		} else if (typeof xOrVec === "number" && typeof y === "number") {
			this.x = xOrVec;
			this.y = y;
		}
		return this;
	}

	/**
	 * Modifies, return vector with zero coordinates
	 */
	public setZero(): Vector2d {
		this.x = 0;
		this.y = 0;
		return this;
	}

	public setX(x: number): Vector2d {
		this.x = x;
		return this;
	}

	public setY(y: number): Vector2d {
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
	 * .copy()
	 * Return new vector, copy of the vector
	 */
	public copy(): Vector2d {
		return new Vector2d(this.x, this.y);
	}

	/**
	 * .mag()
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
	public add(vec: Vector2d): Vector2d {
		return new Vector2d(
			(this.x + vec.x),
			(this.y + vec.y),
		);
	}

	/**
	 * .sub(vec)
	 * Modifies, return subs one vector from another
	 */
	public sub(vec: Vector2d): Vector2d {
		return new Vector2d(
			(this.x - vec.x),
			(this.y - vec.y),
		);
	}

	/**
	 * .mult()
	 * Modifies, return multiplies a vector by a scalar
	 */
	public mult(scalar: number): Vector2d {
		return new Vector2d(
			(this.x * scalar),
			(this.y * scalar),
		);
	}

	/**
	 * .div()
	 * Modifies, return divide a vector by a scalar
	 */
	public div(scalar: number): Vector2d {
		return new Vector2d(
			(this.x / scalar),
			(this.y / scalar),
		);
	}

	/**
	 * .dist()
	 * Return scalar, the distance between two points
	 */
	public dist(vec: Vector2d): number {
		return Math.sqrt(
			Math.pow(this.x - vec.x, 2) +
			Math.pow(this.y - vec.y, 2),
		);
	}

	/**
	 * .dot()
	 * Return scalar, the dot product of two vectors
	 */
	public dot(vec: Vector2d): number {
		return (this.x * vec.x) + (this.y * vec.y);
	}

	/**
	 * .normalize()
	 * Modifies, return normalize the vector to a length of 1
	 */
	public normalize(): Vector2d {
		return this.div(this.mag());
	}

	/**
	 * .limit()
	 * Modifies, return limit the magnitude of the vector
	 */
	public limit(scalar: number): Vector2d {
		if (this.magSq() > scalar * scalar) {
			this.normalize().mult(scalar);
		}
		return this;
	}

	/**
	 * .setMag()
	 * Modifies, return set the magnitude of the vector
	 */
	public setMag(scalar: number): Vector2d {
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
	public rotate(angle: number): Vector2d {
		return new Vector2d(
			(this.x * Math.cos(angle)) - (this.y * Math.sin(angle)),
			(this.x * Math.sin(angle)) + (this.y * Math.cos(angle)),
		);
	}

	/**
	 * .lerp()
	 * Modifies, return linear interpolate the vector to another vector
	 */
	public lerp(vec: Vector2d, amount: number): Vector2d {
		if (amount > 1) { amount = 1; }
		if (amount < 0) { amount = 0; }
		return this.mult(amount).add(vec.copy().mult(1 - amount));
	}

	/**
	 * invert()
	 * Modifies, return inverted vector direction
	 */
	public invert(): Vector2d {
		let x = this.x * -1;
		let y = this.y * -1;
		return new Vector2d(x, y);
	}

	/**
	 * positioning
	 * something to do with the camera
	 */
	public positioning(camera): Vector2d {
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