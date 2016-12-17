function Vector2d(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}
Vector2d.prototype = Object.create(Object.prototype);
Vector2d.prototype.DIMENSIONS = ['x','y']; 
Vector2d.prototype.set = function() {
	if (arguments[0] instanceof Vector2d) {
		for (a = 0; a < arguments.length; a++) {
			for (d = 0; d < this.DIMENSIONS.length; d++) {
				this[this.DIMENSIONS[d]] = arguments[a][this.DIMENSIONS[d]];
			}
		}
	} else {
		for (d = 0; d < this.DIMENSIONS.length; d++) {
			this[this.DIMENSIONS[d]] = arguments[d];
		}
	}
	return this;
};
Vector2d.prototype.add = function() {
	if (arguments[0] instanceof Vector2d) {
		for (a = 0; a < arguments.length; a++) {
			for (d = 0; d < this.DIMENSIONS.length; d++) {
				this[this.DIMENSIONS[d]] += arguments[a][this.DIMENSIONS[d]];
			}
		}
	} else {
		for (d = 0; d < this.DIMENSIONS.length; d++) {
			this[this.DIMENSIONS[d]] += arguments[d];
		}
	}
	return this;
};
Vector2d.prototype.add = function() {
	if (arguments[0] instanceof Vector2d) {
		for (a = 0; a < arguments.length; a++) {
			for (d = 0; d < this.DIMENSIONS.length; d++) {
				this[this.DIMENSIONS[d]] += arguments[a][this.DIMENSIONS[d]];
			}
		}
	} else {
		for (d = 0; d < this.DIMENSIONS.length; d++) {
			this[this.DIMENSIONS[d]] += arguments[d];
		}
	}
	return this;
};

Vector2d.prototype.sub = function(vector2d) {
	if (arguments[0] instanceof Vector2d) {
		for (a = 0; a < arguments.length; a++) {
			for (d = 0; d < this.DIMENSIONS.length; d++) {
				this[this.DIMENSIONS[d]] -= arguments[a][this.DIMENSIONS[d]];
			}
		}
	} else {
		for (d = 0; d < this.DIMENSIONS.length; d++) {
			this[this.DIMENSIONS[d]] -= arguments[d];
		}
	}
	return this;
};

var vector2d = function (x, y) {
	var vec = {
	// Компоненты вектора x и y сохранены в vx,vy.
	vx: x,
	vy: y,
	// Метод scale() позволяет масштабировать вектор
	// в сторону увеличения или уменьшения.
	scale: function (scale) {
		vec.vx *= scale;
		vec.vy *= scale;
	},
	// Метод add() позволяет прибавить вектор.
	add: function (vec2) {
		vec.vx += vec2.vx;
		vec.vy += vec2.vy;
	},
	// Метод sub() вычитает вектор.
	sub: function (vec2) {
		vec.vx -= vec2.vx;
		vec.vy -= vec2.vy;
	},
	// Метод negate() переориентирует вектор
	// в противоположном направлении.
	negate: function () {
		vec.vx = -vec.vx;
		vec.vy = -vec.vy;
	},
	// Метод length() возвращает длину вектора, рассчитанную
	// по теореме Пифагора.
	length: function () {
		return Math.sqrt(vec.vx * vec.vx + vec.vy * vec.vy);
	},
	// Ускоренный метод расчета, при котором возвращается значение
	// квадрата длины. Полезен, если требуется просто узнать,
	// какой из векторов длиннее другого.
	lengthSquared: function () {
		return vec.vx * vec.vx + vec.vy * vec.vy;
	},
	// Метод normalize() превращает вектор в единичный,
	// указывающий в том же направлении, что и ранее.
	normalize: function () {
		var len = Math.sqrt(vec.vx * vec.vx + vec.vy * vec.vy);
		if (len) {
			vec.vx /= len;
			vec.vy /= len;
		}
		// Поскольку длину мы уже рассчитали, она также может быть
		// возвращена, так как эта информация тоже может понадобиться.
		return len;
	},
	// Поворачивает вектор на угол, указанный в радианах.
	rotate: function (angle) {
		var vx = vec.vx,
		vy = vec.vy,
		cosVal = Math.cos(angle),
		sinVal = Math.sin(angle);
		vec.vx = vx * cosVal - vy * sinVal;
		vec.vy = vx * sinVal + vy * cosVal;
	},
	// toString() - вспомогательная функция, выводящая вектор
	// в виде текста. Полезна при отладке.
	toString: function () {
		return '(' + vec.vx.toFixed(3) + ',' + vec.vy.toFixed(3) + ')';
	}
	};
	return vec;
};