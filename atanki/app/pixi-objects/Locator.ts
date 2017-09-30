import { Graphics, Container } from 'pixi.js';
import { Mat, Transformation } from '../math2/Mat';


export class Locator extends Container {
    public length: number;
    // public width: number;
    public thickness: number;

    constructor(
        // length?: number,
        // width?: number,
        thickness?: number,
    ) {
        super()
        this.length = length || 1;
        // this.w
        this.thickness = thickness || 0.1;

        this.addChild(this.setLocator());

        return this
    }

    private setLocator(): Graphics {
        const context = new Graphics;
        context
            .lineStyle(0.1, 0xFF0000, 1)
            .moveTo(this.x, this.y)
            .lineTo(1, this.y)

            .lineStyle(0.1, 0x0000FF, 1)
            .moveTo(this.x, this.y)
            .lineTo(this.x, 1);
        return context
    }
}
