import Vector2d from "./vector2d";

export default class Utils {
	public static captureMouse(element: HTMLAnchorElement) {
		let mouse = {
			x: 0,
			y: 0,
			LButton: { code: 0, pressed: false },
			RButton: { code: 2, pressed: false },
			MButton: { code: 1, pressed: false },
			WheelUp: {
				click: false,
				get pressed() {
					if (this.click) {
						this.click = false;
						return true;
					}
					return false;
				}
			},
			WheelDown: {
				click: false,
				get pressed() {
					if (this.click) {
						this.click = false;
						return true;
					}
					return false;
				},
			},
		};

		element.oncontextmenu = function (a) {
			a.preventDefault();
		};

		element.addEventListener('mousemove', function (event) {
			let x, y;
			let mouse_event = eventPositionCapture(x, y, event, element);
			mouse.x = mouse_event.x;
			mouse.y = mouse_event.y;
		}, false);

		element.addEventListener('mousedown', function (event) {
			let name;
			for (name in mouse) {
				if (mouse.hasOwnProperty(name)) {
					if (mouse[name].code === event.button) {
						mouse[name].pressed = true;
					}
				}
			}
		}, false);

		element.addEventListener('mouseup', function (event) {
			let buttonName;
			for (let name in mouse) {
				if (mouse.hasOwnProperty(name)) {
					if (mouse[name].code === event.button) {
						mouse[name].pressed = false;
					}
				}
			}
		}, false);

		element.addEventListener('wheel', function (event) {
			if (event.deltaY < 0) {
				mouse["WheelUp"].click = true;
			} else {
				mouse["WheelDown"].click = true;
			}
		}, false);

		return mouse;
	};

	public static captureTouch(element: HTMLAnchorElement) {
		let touch = { x: null, y: null, isPressed: false };

		element.addEventListener('touchstart', function (event) {
			touch.isPressed = true;
		}, false);

		element.addEventListener('touchend', function (event) {
			touch.isPressed = false;
			touch.x = null;
			touch.y = null;
		}, false);

		element.addEventListener('touchmove', function (event) {
			let x, y;
			let touch_event = eventPositionCapture(x, y, event.touches[0], element);
			touch.x = touch_event.x;
			touch.y = touch_event.y;
		}, false);

		return touch;
	}

	public static captureKeyboard(element: HTMLAnchorElement) {
		let key = {
			left: { code: 37, pressed: false },
			right: { code: 39, pressed: false },
			up: { code: 38, pressed: false },
			down: { code: 40, pressed: false },
			w: { code: 87, pressed: false },
			a: { code: 65, pressed: false },
			s: { code: 83, pressed: false },
			d: { code: 68, pressed: false },
			e: { code: 69, pressed: false },
			q: { code: 81, pressed: false },
			x: { code: 88, pressed: false },
			z: { code: 90, pressed: false },
			NumpadAdd: { code: 107, pressed: false },
			NumpadSub: { code: 109, pressed: false }
		};

		element.addEventListener("keydown", function (event) {
			let name;
			for (name in key) {
				if (key.hasOwnProperty(name)) {
					if (key[name].code === event.keyCode) {
						key[name].pressed = true;
					}
				}
			}
		}, false);

		element.addEventListener("keyup", function (event) {
			var name;
			for (name in key) {
				if (key.hasOwnProperty(name)) {
					if (key[name].code === event.keyCode) {
						key[name].pressed = false;
					}
				}
			}
		}, false);

		return key;
	}

	// do we realy need this method?
	public static colorToRGB(color, alpha) {
		if (typeof color === 'string' && color[0] === '#') {
			color = parseInt(color.slice(1), 16);
		}
		alpha = (alpha === undefined) ? 1 : alpha;

		let r = color >> 16 & 0xff;
		let g = color >> 8 & 0xff;
		let b = color & 0xff;
		let a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);

		if (a === 1) {
			return "rgb(" + r + "," + g + "," + b + ")";
		} else {
			return "rgba(" + r + "," + g + "," + b + "," + a + ")";
		}
	}

	/**
	 * Convert HSB color into string "rgb(r,g,b)"
	 *
	 * @param {number} hue in degrees (from 0 to 360)
	 * @param {number} saturation in percent (from 0 to 100)
	 * @param {number} brightness in percent (from 0 to 100)
	 * @param {boolean} radians if true, used hue in radians
	 * @return {string} color string "rgb(r,g,b)"
	 */
	public static HSBtoRGB(hue?, saturation?, brightness?, radians?) {
		if (hue === undefined) { hue = 0; }
		if (saturation === undefined) { saturation = 75; }
		if (brightness === undefined) { brightness = 75; }
		if (radians === undefined) { radians = false; }

		if (radians) { hue *= 180 / Math.PI; }
		let HSB = {
			h: hue % 360,
			s: saturation / 100,
			b: brightness / 100
		};
		let RGB = {
			r: null,
			g: null,
			b: null,
			color: function () {
				return "rgb(" + Math.round(this.r) +
					"," + Math.round(this.g) +
					"," + Math.round(this.b) + ")";
			}
		};
		let chroma;
		let hueI;
		let x;
		let m;

		if (HSB.h < 0) {
			HSB.h += 360;
		}
		if (HSB.s > 100) {
			HSB.s = 100;
		} else if (HSB.s < 0) {
			HSB.s = 0;
		}

		if (HSB.b > 100) {
			HSB.b = 100;
		} else if (HSB.b < 0) {
			HSB.b = 0;
		}

		chroma = HSB.s * HSB.b;
		hueI = HSB.h / 60;

		x = chroma * (1 - Math.abs(hueI % 2 - 1));
		switch (Math.floor(hueI)) {
			case 0:
				RGB.r = chroma;
				RGB.g = x;
				RGB.b = 0;
				break;
			case 1:
				RGB.r = x;
				RGB.g = chroma;
				RGB.b = 0;
				break;
			case 2:
				RGB.r = 0;
				RGB.g = chroma;
				RGB.b = x;
				break;
			case 3:
				RGB.r = 0;
				RGB.g = x;
				RGB.b = chroma;
				break;
			case 4:
				RGB.r = x;
				RGB.g = 0;
				RGB.b = chroma;
				break;
			case 5:
				RGB.r = chroma;
				RGB.g = 0;
				RGB.b = x;
				break;
		}
		m = HSB.b - chroma;
		RGB.r += m;
		RGB.g += m;
		RGB.b += m;
		RGB.r *= 255;
		RGB.g *= 255;
		RGB.b *= 255;

		return RGB.color();
	}

	// public parseColor(color, toNumber) {
	// 	if (toNumber === true) {
	// 		if (typeof color === 'number') {
	// 			return (color | 0); // chop off decimal
	// 		}
	// 		if (typeof color === 'string' && color[0] === '#') {
	// 			color = color.slice(1);
	// 		}
	// 		return window.parseInt(color, 16);
	// 	} else {
	// 		if (typeof color === 'number') {
	// 			// make sure our hexadecimal number is padded out
	// 			color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
	// 		}
	// 		return color;
	// 	}
	// }

	public static containsPoint(rect, x, y) {
		return !(x < rect.x || x > rect.x + rect.width ||
			y < rect.y || y > rect.y + rect.height);
	}

	public static angleNormalize(angle) {
		return Math.atan2(Math.sin(angle), Math.cos(angle));
	}
}


function eventPositionCapture(x, y, event, element) {
	if (event.pageX || event.pageY) {		// он будет проверять каждый раз? O_o
		x = event.pageX;
		y = event.pageY;
	} else {
		x = event.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop +
			document.documentElement.scrollTop;
	}
	x -= element.offsetLeft;
	y -= element.offsetTop;
	return {
		x: x,
		y: y
	};
}