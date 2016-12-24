import Node from "./node";
import BoundsNode from "./bounds-node";
import Rectangle from "../lib/rectangle";
import BoundingBox from "../collision/AABB";
import Vector2d from "../math/vector2d";

export default class QuadTree {
	public root: Node & BoundsNode = null;

	constructor(bounds: Rectangle, pointQuad: boolean, maxDepth?: number, maxChildren?: number) {
		let node;
		if (pointQuad) {
			node = new Node(bounds, 0, maxDepth, maxChildren);
		} else {
			node = new BoundsNode(bounds, 0, maxDepth, maxChildren);
		}
		this.root = node;
	}

	public insert(item: any[]): void {
		if (item instanceof Array) {
			let len = item.length;
			for (let i = 0; i < len; i++) {
				this.root.insert(item[i]);
			}
		} else {
			this.root.insert(item);
		}
	}

	public clear(): void {
		this.root.clear();
	}

	public retrieve(item) {
		let out = this.root.retrieve(item).slice(0);
		return out;
	}

	public draw(context) {
		let bounds = this.root.bounds;

		bounds.draw(context);

		let len = this.root.nodes.length;
		for (let node of this.root.nodes) {
			node.draw(context);
		}
	}

	public boundingBox(items) {
		this.clear();
		this.insert(items); // make virtual quad-tree greed
		for (let item of items) {
			let itemsB = this.retrieve(item);
			for (let itemB of itemsB) {
				if (item === itemB) {
					continue;
				}
				if (item.isColliding && itemB.isColliding) {
					continue;
				}
				if (BoundingBox.overlaps(item.boundingBox, itemB.boundingBox)) {
					item.isColliding = true;
					itemB.isColliding = true;
				}
			}
		}
	}

	public boundingCircle(items) {
		this.clear();

		this.insert(items); // make virtual quad-tree greed
		for (let item of items) {
			let itemsB = this.retrieve(item);
			for (let itemB of itemsB) {
				if (item === itemB) {
					continue;
				}
				if (item.isColliding && itemB.isColliding) {
					continue;
				}

				let d: Vector2d = item.position.sub(itemB.position);
				let radii = item.radius + itemB.radius;
				let colliding = d.magSq() < (radii * radii);
				if (!item.isColliding) {
					item.isColliding = colliding;
				}
				if (!itemB.isColliding) {
					itemB.isColliding = colliding;
				}
			}
		}

	}

	public bruteForce(items) {
		for (let item of items) {
			for (let itemB of items) {
				if (item === itemB) {
					continue;
				}
				if (item.isColliding && itemB.isColliding) {
					continue;
				}
				if (BoundingBox.overlaps(item.boundingBox, itemB.boundingBox)) {
					item.isColliding = true;
					itemB.isColliding = true;
				}
			}
		}
	}


}