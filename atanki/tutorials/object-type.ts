let obj1: { property: string; } = { property: "foo" };

interface MyObjLayout {
	property: string;
}

let obj2: MyObjLayout = { property: "foo" };


let obj3 = {
	property: <string>null
};

let obj4 = {
	hasStarted: <boolean>null,
	hasFinished: <boolean>null,
	id: <number>null,
}

let obj5: {
	hasStarted: boolean;
	hasFinished: boolean;
	id: number;
} = {
		hasStarted: null,
		hasFinished: null,
		id: null,
	};

let obj6 = {
	property: null as string
};

let obj7 = {
	hasStarted: null as boolean,
	hasFinished: null as boolean,
	id: null as number,
};