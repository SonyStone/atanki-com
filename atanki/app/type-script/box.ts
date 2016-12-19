export default class Box {

	public x: number= 200;
	public y: number = 200;
	public angle: number;
	private size: any = { height: 45, width: 45};
	private color = "#9C9C9C";

	public draw(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.scale(1, 1);
		ctx.lineWidth = 3;

		ctx.fillStyle = this.color;
		ctx.strokeStyle = "#2B2B2B";
		ctx.globalAlpha = 1;

		ctx.save();

		ctx.beginPath();
		ctx.rect(-this.size.height / 2, -this.size.width / 2, this.size.height, this.size.width);

		ctx.moveTo(this.size.height / 2, this.size.width / 2);
		ctx.lineTo(-this.size.height / 2, -this.size.width / 2);

		ctx.moveTo(-this.size.height / 2, this.size.width / 2);
		ctx.lineTo(this.size.height / 2, -this.size.width / 2);
		ctx.fill();
		ctx.stroke();

		ctx.restore();

		ctx.restore();
	}
}
