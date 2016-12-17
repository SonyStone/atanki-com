/*
✓	Vector2d(x,y)	
✓	├───.random(vec)		// Return new vector, with a random direction.
✓	├───.fromAngle(angle)	// Return new vector, from an angle
✓	├───.add(vec1,vec2)		// Return new vector, addition of two independent vectors
 ?	│	├───.x()
 ?	│	└───.y()
✓	├───.sub()				// Return new vector, subtraction of two independent vectors
 ?	│	├───.x()
 ?	│	└───.y()
✓	├───.mult()				// Return new vector, multiply a vector by a scalar
✓	├───.div()				// Return new vector, divide a vector by a scalar
✓	├───.dist()				// Return scalar, the distance between two points
✓	├───.dot()				// Return scalar, the dot product of two vectors
✓	├───.lerp()				// Return new vector, linear interpolate the vector to another vector
✓	├───.angleBetween()		// Calculate and return the angle between two vectors
	│
	└───.prototype
✓		├───.set(vec)		// Modifies, return set the components of the vector
✓		├───.copy()			// Return new vector, copy of the vector
✓		├───.mag()			// Return scalar, the magnitude of the vector
✓		├───.magSq()		// Return scalar, the magnitude of the vector, squared
✓		├───.add(vec)		// Modifies, return adds one vector to another
✓		├───.sub()			// Modifies, return subs one vector from another
✓		├───.mult()			// Modifies, return multiplies a vector by a scalar
✓		├───.div()			// Modifies, return divide  a vector by a scalar
✓		├───.dist()			// Return scalar, the distance between two points
✓		├───.dot()			// Return scalar, the dot product of two vectors
✓		├───.normalize()	// Modifies, return normalize the vector to a length of 1
✓		├───.limit()		// Modifies, return limit the magnitude of the vector
✓		├───.setMag()		// Modifies, return set the magnitude of the vector
✓		├───.heading()		// Return angle of rotation for this vector
✓		├───.rotate()		// Modifies, return rotate the vector by an angle
✓		├───.lerp()			// Modifies, return linear interpolate the vector to another vector
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
	return Math.atan2(this.y, this.x)
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