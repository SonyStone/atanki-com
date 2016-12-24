import Node from "../quad-tree/node";

export default class Rectangle {
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	public draw(context) {
		context.save();
		context.translate(this.x, this.y);
		context.scale(1, 1);
		context.lineWidth = 2;

		context.strokeStyle = "#2B2B2B";
		context.globalAlpha = 1;

		context.save();

		context.beginPath();
		context.rect(0, 0, this.width, this.height);
		context.stroke();

		context.restore();
		context.restore();

	}
}