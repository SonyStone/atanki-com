import * as PIXI from 'pixi.js';

const Graphics = PIXI.Graphics
/**
 * Bezier class
 */
export default class Ellipse {
    public ctx: PIXI.Graphics;
    /**
    * construct Bezier
    */
    constructor(x: number, y: number) {
            this.ctx = new Graphics;
            this.ctx.beginFill(0x778679);
            this.ctx.drawEllipse(0, 0, 640, 640);
            this.ctx.x = x;
            this.ctx.y = y;
            this.ctx.endFill();
        return this.ctx;
    }
}
