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
	return 'x:' + this.position.x.toFixed(2) + 
		', y:' + this.position.y.toFixed(2) + "\n" +
		'zoom: ' + this.zoom + "\n" +
		'rotation: ' + this.rotation + "\n";
};

