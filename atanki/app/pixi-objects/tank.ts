import Utils from "../type-script/utils";
import Vector2d from "../math/vector2d";
import BoundingBox from "../collision/AABB";
import * as Color from 'color-js';

export default class Tank {
	public pull: Vector2d;
	public position: Vector2d = new Vector2d();
	// public color = Utils.HSBtoRGB(360, 75, 75);
	// public color = 0xBF3030;
	public color: number = Color({hue: 0, saturation: 75, lightness: 75}).getValue();
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
		lowerBound: null as Vector2d,
		upperBound: null as Vector2d,
	};

	private context: PIXI.Graphics;

	public object = {
		gun: {
			length: 30 as number,
			width: 10 as number,
			turretRadius: 10 as number,
		},
		tank: {
			length: 40 as number,
			width: 30 as number,
		},
		tank2: [
			new Vector2d(-20, -15 ),
			new Vector2d(20, -15 ),
			new Vector2d(20, 15 ),
			new Vector2d(-20, 15 ),
			new Vector2d(20, 0 ),
		] as Vector2d[],
	};

	public tankRotated: Vector2d[];



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
	}

	public updateBoundingBox() {

		let tankRotated: Vector2d[] = [];

		for (let point of this.object.tank2) {
			tankRotated.push(Vector2d.rotateAbout(
				Vector2d.clone(this.position).add(point),
				this.positionRotation,
				this.position,
			));
		}
		let min = Vector2d.clone(this.position);
		let max =  Vector2d.clone(this.position);

		for (let point of tankRotated) {
			if (point.getX() < min.getX()) {
				min.setX(point.getX());
			}
			if (point.getY() < min.getY()) {
				min.setY(point.getY());
			}
			if (point.getX() > max.getX()) {
				max.setX(point.getX());
			}
			if (point.getY() > max.getY()) {
				max.setY(point.getY());
			}
		}
		this.tankRotated = tankRotated;

		this.option.lowerBound = min;
		this.option.upperBound = max;
		this.boundingBox = new BoundingBox(this.option);
	}

	public draw(context) {
		this.context = context;
		this.context
			.lineStyle(this.lineWidth, 0xc40000, this.transparency)
			.beginFill(this.color)
			.setTransform(
				this.position.x,
				this.position.y,
				this.scaleX,
				this.scaleY,
				this.rotation
			)
			


		// if (this.isColliding) {
		// 	context.strokeStyle = "#c40000";
		// 	this.isColliding = false;
		// } else {
		// 	context.strokeStyle = "#191919";
		// }

		context.save();
		context.rotate(this.positionRotation);
		this.tank2Path(context);
		context.restore();

		context.save();
		context.rotate(this.targetRotation);
		this.gunPath(context);
		context.restore();

		context.restore();
	}

	public drawHelp(context) {
		let scale = 1;
		context.save();

		context.translate(this.position.x, this.position.y);
		context.moveTo(0, 0);
		context.fillStyle = "#ff0000";
		context.strokeStyle = "#00ff00";
		context.lineWidth = 0.5;
		context.lineJoin = "round";
		context.lineCap = "round";
		context.scale(scale, scale);

		function pointDraw(rotation, positionX, positionY) {
			if (rotation === undefined) { rotation = 0; }
			if (positionX === undefined) { positionX = 0; }
			if (positionY === undefined) { positionY = 0; }
			context.save();
			context.beginPath();
			context.rotate(rotation);
			context.arc(positionX, positionY, 2, 0, (Math.PI * 2), false);
			context.closePath();
			context.fill();
			context.restore();
		}
		function arcAngleDraw(angle1, angle2, radius) {
			if (angle1 === undefined) { angle1 = 0; }
			if (angle2 === undefined) { angle2 = 0; }
			if (radius === undefined) { radius = 10; }
			angle1 = Utils.angleNormalize(angle1);
			angle2 = Utils.angleNormalize(angle2);
			let difference = angle1 - angle2;
			context.save();
			context.beginPath();
			if (Math.sin(difference) > 0) {
				context.arc(0, 0, radius, (angle1), (angle2), true);
			} else {
				context.arc(0, 0, radius, (angle1), (angle2), false);
			}
			context.stroke();
			context.restore();
		}
		context.save();
		context.beginPath();
		context.rotate(this.positionRotation);
		context.moveTo(0, 0);
		context.lineTo(50, 0);
		context.closePath();
		context.stroke();
		context.restore();

		context.save();
		context.beginPath();
		context.rotate(this.targetRotation);
		context.moveTo(0, 0);
		context.lineTo(50, 0);
		context.closePath();
		context.stroke();
		context.restore();


		// pointDraw(this.targetRotation, 50);
		// pointDraw(this.positionRotation, 50);
		// pointDraw(0,this.moveX - this.x, this.moveY - this.y);
		arcAngleDraw(this.targetRotation, this.positionRotation, 50);
		// arcAngleDraw(this.targetRotation, 0, 42);
		// arcAngleDraw(this.positionRotation, 0, 40);

		context.restore();
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
			"option.upperBound: " + this.option.upperBound.toString() + "\n" +
			"tankRotated: " + "\n" +
			this.tankRotated[0].toString() + "\n" +
			this.tankRotated[1].toString() + "\n" +
			this.tankRotated[2].toString() + "\n" +
			this.tankRotated[3].toString() + "\n" +
			this.tankRotated[4].toString() + "\n";
	}

	private tankPath(context) {
		context.beginPath();
		context.rect(-this.object.tank.length / 2, -this.object.tank.width / 2, this.object.tank.length, this.object.tank.width);
		context.moveTo(this.object.tank.length / 2, 0);
		context.lineTo(-this.object.tank.length / 2, this.object.tank.width / 2);
		context.lineTo(-this.object.tank.length / 2, -this.object.tank.width / 2);
		context.closePath();
		context.fill();
		context.stroke();
	}

	private tank2Path(context) {
		let draw: Vector2d[] = this.object.tank2;
		context.beginPath();
		context.moveTo(draw[0].x, draw[0].y);
		context.lineTo(draw[1].x, draw[1].y);
		context.lineTo(draw[2].x, draw[2].y);
		context.lineTo(draw[3].x, draw[3].y);
		context.closePath();
		context.moveTo(draw[4].x, 0);
		context.lineTo(draw[3].x, draw[3].y);
		context.lineTo(draw[0].x, draw[0].y);
		context.closePath();
		context.fill();
		context.stroke();
	}

	private gunPath(context) {
		context.beginPath();
		context.rect(0, -this.object.gun.width / 2, this.object.gun.length, this.object.gun.width);
		context.closePath();
		context.fill();
		context.stroke();

		context.beginPath();
		context.arc(0, 0, this.object.gun.turretRadius, 0, (Math.PI * 2), false);
		context.closePath();
		context.fill();
		context.stroke();
	}
}