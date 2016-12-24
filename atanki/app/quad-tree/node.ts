import Rectangle from "../lib/rectangle";

export default class Node {
	protected static TOP_LEFT = 0;
	protected static TOP_RIGHT = 1;
	protected static BOTTOM_LEFT = 2;
	protected static BOTTOM_RIGHT = 3;

	public nodes: any[] = null;
	public children: any[] = null;
	public bounds: Rectangle = null;

	protected classConstructor = Node;
	protected depth = 0;
	protected maxChildren = 4;
	protected maxDepth = 4;

	constructor(bounds: Rectangle, depth: number, maxDepth: number, maxChildren: number) {
		this.bounds = bounds;
		this.children = [];
		this.nodes = [];
	}

	public insert(item) {
		if (this.nodes.length) {
			let index = this.findIndex(item);
			this.nodes[index].insert(item);
			return;
		}
		this.children.push(item);
		let len = this.children.length;
		if (!(this.depth >= this.maxDepth) && len > this.maxChildren) {
			this.subdivide();
			for (let i = 0; i < len; i++) {
				this.insert(this.children[i]);
			}
			this.children.length = 0;
		}
	}

	public retrieve(item) {
		if (this.nodes.length) {
			let index = this.findIndex(item);
			return this.nodes[index].retrieve(item);
		}
		return this.children;
	}

	public subdivide() {
		let depth = this.depth + 1;
		let bx = this.bounds.x;
		let by = this.bounds.y;

		// floor the values
		let b_w_h = (this.bounds.width / 2);
		let b_h_h = (this.bounds.height / 2);
		let bx_b_w_h = bx + b_w_h;
		let by_b_h_h = by + b_h_h;

		// top left
		this.nodes[Node.TOP_LEFT] = new this.classConstructor(
			new Rectangle(bx, by, b_w_h, b_h_h),
			depth, this.maxDepth, this.maxChildren);

		// top right
		this.nodes[Node.TOP_RIGHT] = new this.classConstructor(
			new Rectangle(bx_b_w_h, by, b_w_h, b_h_h),
			depth, this.maxDepth, this.maxChildren);

		// bottom left
		this.nodes[Node.BOTTOM_LEFT] = new this.classConstructor(
			new Rectangle(bx, by_b_h_h, b_w_h, b_h_h),
			depth, this.maxDepth, this.maxChildren);

		// bottom right
		this.nodes[Node.BOTTOM_RIGHT] = new this.classConstructor(
			new Rectangle(bx_b_w_h, by_b_h_h, b_w_h, b_h_h),
			depth, this.maxDepth, this.maxChildren);
	}

	public clear() {
		this.children.length = 0;
		let len = this.nodes.length;
		for (let i = 0; i < len; i++) {
			this.nodes[i].clear();
		}
		this.nodes.length = 0;
	}

	public draw(context) {
		let bounds = this.bounds;

		bounds.draw(context);

		let len = this.nodes.length;
		for (let node of this.nodes) {
			node.draw(context);
		}
	}

	protected findIndex(item) {
		let b = this.bounds;
		let left = (item.position.x > b.x + b.width / 2) ? false : true;
		let top = (item.position.y > b.y + b.height / 2) ? false : true;
		// top left
		let index = Node.TOP_LEFT;
		if (left) {
			// left side
			if (!top) {
				// bottom left
				index = Node.BOTTOM_LEFT;
			}
		} else {
			// right side
			if (top) {
				// top right
				index = Node.TOP_RIGHT;
			} else {
				// bottom right
				index = Node.BOTTOM_RIGHT;
			}
		}
		return index;
	}


}