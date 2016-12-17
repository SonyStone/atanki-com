function Box() {
	this.x = 200;
	this.y = 200;
	this.angle;
}

Box.prototype.draw = function (ctx) {
	'use strict';

	var box = {
			height: 45,
			width: 45
		},
		color = "#9C9C9C";


	function tankPath(ctx) {
		ctx.beginPath();
		ctx.rect(-box.height / 2, -box.width / 2, box.height, box.width);
		
		ctx.moveTo(box.height / 2, box.width / 2);
		ctx.lineTo(-box.height / 2, -box.width / 2);

		ctx.moveTo(-box.height / 2, box.width / 2);
		ctx.lineTo(box.height / 2, -box.width / 2);
		ctx.fill();
		ctx.stroke();
	}

	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);
	ctx.scale(1, 1);
	ctx.lineWidth = 3;
	//ctx.lineJoin = "round";
	//ctx.lineCap = "round";
	ctx.fillStyle = color;
	ctx.strokeStyle = "#2B2B2B";
	ctx.globalAlpha = 1;

	ctx.save();
	tankPath(ctx);
	ctx.restore();
	ctx.restore();
}