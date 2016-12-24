import AABB from "../collision/AABB";

export default class Node {
	public static Null = -1;
	public aabb: AABB;

	public parent: number;
	public next: number;

	public left: number;
	public right: number;

	public userDate;


	public isLeaf() {
		return this.right = Node.Null;
	}

	// constructor (){}

	public query(index: number) {
		while(index !== Node.Null) {
			this.left = nodes[index].left;
			this.right = nodes[index].right;

			nodes[index].height = 1 + Max( nodes[left].height, nodes[right].height);
			nodes[index].height = Combine( nodes[left].aabb, nodes[right].aabb);

			index = nodes[index].parent;
		}
	}

}
}