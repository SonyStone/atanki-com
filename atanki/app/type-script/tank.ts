import Utils from "./utils";
import Vector2d from "../math/vector2d";
import BoundingBox from "../collision/AABB";

export default class Tank {
	public pull: Vector2d;
	public position: Vector2d = new Vector2d();
	public color = Utils.HSBtoRGB(360, 75, 75);
	public direction: Vector2d = new Vector2d();

	public rotation: number = 0;
	public speed: number = 5;

	public positionRotation: number = 0;
	public target: Vector2d = new Vector2d();
	public targetRotation: number = 0;

	public scaleX: number = 1;
	public scaleY: number = 1;
	public lineWidth: number = 2;
	public transparency: number = 1;

	// specially for quard-tree
	public width: number = 5;
	public height: number = 5;
	public radius: number = 20;
	public isColliding: boolean = false;

	// specially for Axis Aligned Bounding Box
	public boundingBox: BoundingBox;
	public isCollidingboundingBox: boolean = false;
	public option: any = {
		lowerBound: this.position,
		upperBound: this.position.add(new Vector2d(5, 5)),
	};

	public object: any = {
		gun: {
			length: 30,
			width: 10,
			turretRadius: 10,
		},
		tank: {
			length: 40,
			width: 30,
		},
	};



	constructor(x?, y?) {
		this.pull = new Vector2d(x, y) || new Vector2d();
	}

	public player(keyboard, mouse, camera) {
		this.targetRotation = Vector2d.angleTo(
			this.target.set(mouse),
			camera.targeting(this.position)
			// this.position.mult(camera.zoom).rotate(camera.rotation).add(camera.position)
		) - camera.rotation;

		var speed = 0;
		if (keyboard.up.pressed || keyboard.w.pressed) {
			this.direction = this.direction.add(Vector2d.fromAngle(-Math.PI / 2 - camera.rotation));
			speed = this.speed;
		}
		if (keyboard.down.pressed || keyboard.s.pressed) {
			this.direction = this.direction.add(Vector2d.fromAngle(Math.PI / 2 - camera.rotation));
			speed = this.speed;
		}
		if (keyboard.left.pressed || keyboard.a.pressed) {
			this.direction = this.direction.add(Vector2d.fromAngle(Math.PI - camera.rotation));
			speed = this.speed;
		}
		if (keyboard.right.pressed || keyboard.d.pressed) {
			this.direction = this.direction.add(Vector2d.fromAngle(0 - camera.rotation));
			speed = this.speed;
		}
		this.direction = this.direction.normalize();
		this.pull = this.pull.add(this.direction.mult(speed));
		// this.direction.setZero();
	}

	public update() {
		this.positionRotation = Vector2d.angleTo(this.pull, this.position);
		this.position.x = this.pull.x - Math.cos(this.positionRotation) * 18;
		this.position.y = this.pull.y - Math.sin(this.positionRotation) * 18;

		this.option.upperBound = this.position.add(new Vector2d(50, 50));
		this.boundingBox = new BoundingBox(this.option);
	}

	public draw(ctx) {
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.scale(this.scaleX, this.scaleY);
		ctx.lineWidth = this.lineWidth;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		ctx.fillStyle = this.color;


		if (this.isColliding) {
			ctx.strokeStyle = "#c40000";
			this.isColliding = false;
		} else {
			ctx.strokeStyle = "#191919";
		}

		ctx.globalAlpha = this.transparency;

		ctx.save();
		ctx.rotate(this.positionRotation);
		this.tankPath(ctx);
		ctx.restore();

		ctx.save();
		ctx.rotate(this.targetRotation);
		this.gunPath(ctx);
		ctx.restore();

		ctx.restore();
	}

	public drawHelp(ctx) {
		let scale = 1;
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
			angle1 = Utils.angleNormalize(angle1);
			angle2 = Utils.angleNormalize(angle2);
			var difference = angle1 - angle2;
			ctx.save();
			ctx.beginPath();
			/*	if ((difference > 0 && difference < Math.PI) || difference < -Math.PI) {
					ctx.arc(0, 0, radius, (angle1), (angle2), true);
				} else {
					ctx.arc(0, 0, radius, (angle1), (angle2), false);
				}*/
			if (Math.sin(difference) > 0) {
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


		// pointDraw(this.targetRotation, 50);
		// pointDraw(this.positionRotation, 50);
		// pointDraw(0,this.moveX - this.x, this.moveY - this.y);
		arcAngleDraw(this.targetRotation, this.positionRotation, 50);
		// arcAngleDraw(this.targetRotation, 0, 42);
		// arcAngleDraw(this.positionRotation, 0, 40);

		ctx.restore();
	}

	public toString() {
		return "position: " + this.position.toString() + "\n" +
			"pull: " + this.pull.toString() + "\n" +
			"direction: " + this.direction.toString() + "\n" +
			"targetRotation: " + this.targetRotation.toFixed(2) + "\n" +
			"positionRotation: " + this.positionRotation.toFixed(2) + "\n" +
			"rotation: " + this.rotation.toFixed(2) + "\n" +
			"BoundingBox: " + this.boundingBox.bound.min.toString() + "\n" +
			"option.lowerBound: " + this.option.lowerBound.toString() + "\n" +
			"option.upperBound: " + this.option.upperBound.toString() + "\n";
	}

	private tankPath(ctx) {
		ctx.beginPath();
		ctx.rect(-this.object.tank.length / 2, -this.object.tank.width / 2, this.object.tank.length, this.object.tank.width);
		ctx.moveTo(this.object.tank.length / 2, 0);
		ctx.lineTo(-this.object.tank.length / 2, this.object.tank.width / 2);
		ctx.lineTo(-this.object.tank.length / 2, -this.object.tank.width / 2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	private gunPath(ctx) {
		ctx.beginPath();
		ctx.rect(0, -this.object.gun.width / 2, this.object.gun.length, this.object.gun.width);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(0, 0, this.object.gun.turretRadius, 0, (Math.PI * 2), false);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}