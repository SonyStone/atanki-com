var Vector2d = require("./vector2d");

var utils = {};

function eventPositionCapture(x, y, event, element) {
    'use strict';
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

// Mouse position
utils.captureMouse = function (element) {
    'use strict';
	var mouse = {
		x: 0, 
		y: 0,
		LButton: { code: 0, pressed: false },
		RButton: { code: 2, pressed: false },
		MButton: { code: 1, pressed: false },
		WheelUp: { click: false, 
		  			get pressed() {
		  				if (this.click) {
		  					this.click = false;
		  					return true;
		  				}
		  				return false;
		  		 	}
  				 },
		WheelDown:{ click: false, 
					get pressed() {
		  				if (this.click) {
		  					this.click = false;
		  					return true;
		  				}
		  				return false;
		  		 	}
  				 }, 
	};

	element.oncontextmenu = function(a) {
    	a.preventDefault();
	}

	element.addEventListener('mousemove', function (event) {
		var x, y,
			mouse_event = eventPositionCapture(x, y, event, element);

		mouse.x = mouse_event.x;
		mouse.y = mouse_event.y;
	}, false);

	element.addEventListener('mousedown', function (event) {
		var name;
		//console.log(event.button);
		for (name in mouse) {
            if (mouse.hasOwnProperty(name)) {
                if (mouse[name].code === event.button) {
				    mouse[name].pressed = true;
				    //console.log(name + ": " + mouse[name].pressed);
                }
            }
		}
	}, false);

	element.addEventListener('mouseup', function (event) {
		var buttonName;
		//console.log(event.button);
		for (name in mouse) {
            if (mouse.hasOwnProperty(name)) {
                if (mouse[name].code === event.button) {
				    mouse[name].pressed = false;
				    //console.log(name + ": " + mouse[name].pressed);
                }
            }
		}
	}, false);

	element.addEventListener('wheel', function (event) {
		//console.log(event.wheelDelta);
		//console.log(event.deltaY);
		if (event.deltaY < 0){
			mouse["WheelUp"].click = true;
		} else {
			mouse["WheelDown"].click = true;
		}
	}, false);

	return mouse;
};

// Touch position
utils.captureTouch = function (element) {
    'use strict';
	var touch = {x: null, y: null, isPressed: false};

	element.addEventListener('touchstart', function (event) {
		touch.isPressed = true;
	}, false);

	element.addEventListener('touchend', function (event) {
		touch.isPressed = false;
		touch.x = null;
		touch.y = null;
	}, false);

	element.addEventListener('touchmove', function (event) {
		var x, y,
			touch_event = eventPositionCapture(x, y, event.touches[0], element);
			// first touch

		touch.x = touch_event.x;
		touch.y = touch_event.y;
	}, false);

	return touch;
};

utils.captureKeyboard = function (element) {
    'use strict';
	var key = {
			left:      { code: 37, pressed: false },
			right:     { code: 39, pressed: false },
			up:        { code: 38, pressed: false },
			down:      { code: 40, pressed: false },
			w:         { code: 87, pressed: false },
			a:         { code: 65, pressed: false },
			s:         { code: 83, pressed: false },
			d:         { code: 68, pressed: false },
			e:         { code: 69, pressed: false },
			q:         { code: 81, pressed: false },
			NumpadAdd: { code: 107, pressed: false },
			NumpadSub: { code: 109, pressed: false }
	    };


	element.addEventListener('keydown', function (event) {
		var name;
		//console.log(event.keyCode);
		//console.log(event.code);
        for (name in key) {
            if (key.hasOwnProperty(name)) {
                if (key[name].code === event.keyCode) {
				    key[name].pressed = true;
				    //console.log(name + ": " + key[name].pressed);
				    
                }
            }

		}
	}, false);

	element.addEventListener('keyup', function (event) {
        var name;
		for (name in key) {
            if (key.hasOwnProperty(name)) {
			    if (key[name].code === event.keyCode) {
				    key[name].pressed = false;
				    //console.log(name + ": " + key[name].pressed);
                }
            }
		}
	}, false);

	return key;
};

utils.colorToRGB = function (color, alpha) {
    'use strict';
	// if string format, convert to number
	if (typeof color === 'string' && color[0] === '#') {
		color = window.parseInt(color.slice(1), 16);
	}
	alpha = (alpha === undefined) ? 1 : alpha;

	// extract component values
    /*jslint bitwise: true */
	var r = color >> 16 & 0xff,
		g = color >> 8 & 0xff,
		b = color & 0xff,
		a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha); // check range

	// use 'rgba' if neede
	if (a === 1) {
		return "rgb(" + r + "," + g + "," + b + ")";
	} else {
		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	}
};

/**
 * Convert HSB color into string "rgb(r,g,b)"
 *
 * @param {number} hue in degrees (from 0 to 360)
 * @param {number} saturation in percent (from 0 to 100)
 * @param {number} brightness in percent (from 0 to 100)
 * @param {boolean} radians if true, used hue in radians
 * @return {string} color string "rgb(r,g,b)"
 */
utils.HSBtoRGB = function (hue, saturation, brightness, radians) {
    'use strict';
	// https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
	if (hue        === undefined) { hue        = 0; }
	if (saturation === undefined) { saturation = 75; }
	if (brightness === undefined) { brightness = 75; }
	if (radians    === undefined) { radians    = false; }

	if (radians) { hue *= 180 / Math.PI; }
	var HSB = {
			h: hue % 360,
			s: saturation / 100,
			b: brightness / 100
		},
		RGB = {
			r: null,
			g: null,
			b: null,
			color: function () {
				return "rgb(" + Math.round(this.r) +
						  "," + Math.round(this.g) +
						  "," + Math.round(this.b) + ")";
			}
		},
		chroma,
        hueI,
        x,
        m;

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
};

utils.parseColor = function (color, toNumber) {
    'use strict';
    /*jslint bitwise: true */
	if (toNumber === true) {
		if (typeof color === 'number') {
			return (color | 0); // chop off decimal
		}
		if (typeof color === 'string' && color[0] === '#') {
			color = color.slice(1);
		}
		return window.parseInt(color, 16);
	} else {
		if (typeof color === 'number') {
			// make sure our hexadecimal number is padded out
			color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
		}
		return color;
	}
};

utils.containsPoint = function (rect, x, y) {
    'use strict';
	return !(x < rect.x || x > rect.x + rect.width ||
			 y < rect.y || y > rect.y + rect.height);
};

utils.angleNormalize = function(angle) {
	return Math.atan2(Math.sin(angle), Math.cos(angle));
};

module.exports = utils;