var Box = (function () {
    function Box() {
        this.x = 200;
        this.y = 200;
        this.size = { height: 45, width: 45 };
        this.color = "#9C9C9C";
    }
    Box.prototype.draw = function (ctx) {
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
    };
    return Box;
}());
