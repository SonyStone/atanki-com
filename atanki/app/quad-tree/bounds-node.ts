import Node from "./node";

export default class BoundsNode extends Node {
	protected classConstructor = BoundsNode;
	private stuckChildren = null;
	private out = [];

	constructor (bounds, depth, maxChildren, maxDepth) {
		super(bounds, depth, maxChildren, maxDepth);
		this.stuckChildren = [];
	}

	public insert(item) {
		if (this.nodes.length) {
			let index = this.findIndex(item);
			let node = this.nodes[index];

			// todo: make _bounds bounds // wut?
			if (item.position.x >= node.bounds.x &&
				item.position.x + item.width <= node.bounds.x + node.bounds.width &&
				item.position.y >= node.bounds.y &&
				item.position.y + item.height <= node.bounds.y + node.bounds.height) {
				this.nodes[index].insert(item);
			} else {
				this.stuckChildren.push(item);
			}
			return;
		}
		this.children.push(item);
		let len = this.children.length;
		if (!(this.depth >= this.maxDepth) && len > this.maxChildren) {
			this.subdivide();
			for (let i = 0; i < len; i++ ) {
				this.insert(this.children[i]);
			}
			this.children.length = 0;
		}
	}

	public getChildren() {
		return this.children.concat(this.stuckChildren);
	}

	public retrieve(item) {
		let out = this.out;
		out.length = 0;
		if (this.nodes.length) {
			let index = this.findIndex(item);
			let node = this.nodes[index];
			if (item.position.x >= node.bounds.x &&
				item.position.x + item.width <= node.bounds.x + node.bounds.width &&
				item.position.y >= node.bounds.y &&
				item.position.y + item.height <= node.bounds.y + node.bounds.height) {
				out.push.apply(out, this.nodes[index].retrieve(item));
			} else {
				// Part of the item are overlapping multiple child nodes.
				// For each of the overlapping nodes, return all containing objects.
				if (item.position.x <= this.nodes[Node.TOP_RIGHT].bounds.x) {
					if (item.position.y <= this.nodes[Node.BOTTOM_LEFT].bounds.y) {
						out.push.apply(out, this.nodes[Node.TOP_LEFT].getAllContent());
					}
					if (item.position.y + item.height > this.nodes[Node.BOTTOM_LEFT].bounds.y) {
						out.push.apply(out, this.nodes[Node.BOTTOM_LEFT].getAllContent());
					}
				}
				if (item.position.x + item.width > this.nodes[Node.TOP_RIGHT].bounds.x) {
					// position + width bigger than middle x // the hell does that mean?
					if (item.position.y <= this.nodes[Node.BOTTOM_RIGHT].bounds.y) {
						out.push.apply(out, this.nodes[Node.TOP_RIGHT].getAllContent());
					}
					if (item.position.y + item.height > this.nodes[Node.BOTTOM_RIGHT].bounds.y) {
						out.push.apply(out, this.nodes[Node.BOTTOM_RIGHT].getAllContent());
					}
				}
			}
		}
		out.push.apply(out, this.stuckChildren);
		out.push.apply(out, this.children);
		return out;
	}

	public getAllContent() {
		let out = this.out;
		if (this.nodes.length) {
			for (let i = 0; i < this.nodes.length; i++) {
				this.nodes[i].getAllContent();
			}
		}
		out.push.apply(out, this.stuckChildren);
		out.push.apply(out, this.children);
		return out;
	}

	public clear() {
		this.stuckChildren.length = 0;
		this.children.length = 0;
		let len = this.nodes.length;
		if (!len) {
			return;
		}
		for (let i = 0; i < len; i++ ) {
			this.nodes[i].clear();
		}
		this.nodes.length = 0;
	}
}