import * as PIXI from 'pixi.js';

const Graphics = PIXI.Graphics

export class Box {
	
	public x: number= 200;
	public y: number = 200;
	public angle: number;
	private size: any = { height: 45, width: 45};
	// private color = "#9C9C9C";
	private colorFill: number = 0x9C9C9C;
	private colorLine: number = 0x2B2B2B; // #2B2B2B
	private context: PIXI.Graphics;

	constructor(x: number, y: number) {
		this.context = new Graphics;
		this.context
			.lineStyle(3, this.colorLine, 1)
			.beginFill(this.colorFill)
			.drawRect(-this.size.height / 2, -this.size.width / 2, this.size.height, this.size.width)
			.endFill()

			.moveTo(this.size.height / 2, this.size.width / 2)
			.lineTo(-this.size.height / 2, -this.size.width / 2)
			.moveTo(-this.size.height / 2, this.size.width / 2)
			.lineTo(this.size.height / 2, -this.size.width / 2)
			.setTransform(x, y);
	}

	/**
	 * getContext
	 */
	public getContext() {
		return this.context;
	}
}
 