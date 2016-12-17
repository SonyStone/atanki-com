/*global utils, canvas*/

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
