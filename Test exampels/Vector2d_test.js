describe("new Vector();", function() {

	function testVectorCycle(funct) {
		// 625 раз
		var vec1 = {},
			vec2 = {};
		for (vec1.x = -5; vec1.x <= 5; vec1.x+=2.5) {
			for (vec1.y = -5; vec1.y <= 5; vec1.y+=2.5) {
				for (vec2.x = -5; vec2.x <= 5; vec2.x+=2.5) {
					for (vec2.y = -5; vec2.y <= 5; vec2.y+=2.5) {
						funct(vec1,vec2);
					}
				}
			}
		}
	};

	it("Cоздаёт новый объект вектор", function() {
		var vec = new Vector2d();
		expect(vec).to.be.an.instanceof(Vector2d); });
	it("Прибавляет vec2 к вектору vec1;	vec1.add(vec2)", function() {
		testVectorCycle(function (start, end) {
		        expect = {
		           x: start.x + end.x,
		           y: start.y + end.y
		        },

		        vec1 = new Vector2d(start.x, start.y);
		        vec2 = new Vector2d(end.x,end.y);
		        
		        vec1 = vec1.add(vec2);

		        assert.equal(
		           (vec1.x, vec1.y), 
		           (expect.x, expect.y)
		        );
		});
	});

	it("Вычитает vec2 у вектора vec1;	vec1.sub(vec2)", function() {
		testVectorCycle(function (start, end) {
		    var expect = {
		        x: start.x - end.x,
		        y: start.y - end.y
		    },
		        vec1 = new Vector2d(start.x, start.y);
		        vec2 = new Vector2d(end.x,end.y);
		        
		        vec1 = vec1.sub(vec2);
		        assert.equal(
		            (vec1.x, vec1.y),
		            (expect.x, expect.y)
		        );	
		});
	});
	it("Vector2d.fromAngle(angle)", function() {
		v = Vector2d.fromAngle(0.01);
		assert.equal(
			(v.x,v.y),
			(Math.cos(0.01),Math.sin(0.01))
			);

	});

});