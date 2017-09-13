import * as PIXI from 'pixi.js';

/**
 * Bezier class
 */
export default class Ellipse {
    ctx;
    /**
    * construct Bezier
    */
    constructor(x: Number, y: Number, context: any) {
            this.ctx = context;
            this.ctx.lineStyle(1, 0xFF3300, 1);
            this.ctx.drawEllipse(0, 0, 64, 64);
            this.ctx.x = x;
            this.ctx.y = y;
        return this.ctx;
    }
}
