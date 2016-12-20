import Node from "./node";
import BoundsNode from "./bounds-node";

export default class QuadTree {
	public root: Node & BoundsNode = null;

	constructor(bounds, pointQuad, maxDepth?, maxChildren?) {
		let node;
		if (pointQuad) {
			node = new Node(bounds, 0, maxDepth, maxChildren);
		} else {
			node = new BoundsNode(bounds, 0, maxDepth, maxChildren);
		}
		this.root = node;
	}

	public insert(item) {
		if (item instanceof Array) {
			let len = item.length;
			for (let i = 0; i < len; i++) {
				this.root.insert(item[i]);
			}
		} else {
			this.root.insert(item);
		}
	}

	public clear() {
		this.root.clear();
	}

	public retrieve(item) {
		let out = this.root.retrieve(item).slice(0);
		return out;
	}


}