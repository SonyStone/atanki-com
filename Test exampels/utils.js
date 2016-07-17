var utils = {};

// Mouse position
utils.captureMouse = function (element) {
	var mouse = {x: 0, y: 0};

	element.addEventListener('mousemove', function (event) {
		var x, y,
			mouse_event = eventPositionCapture(x,y,event,element);

		mouse.x = mouse_event.x;
		mouse.y = mouse_event.y;
	}, false)
	return mouse;
};

// Touch position
utils.captureTouch = function(element) {
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
			touch_event = eventPositionCapture(x,y,event.touches[0],element);
			// first touch

		touch.x = touch_event.x;
		touch.y = touch_event.y;
	}, false);

	return touch;
};

utils.colorToRGB = function (color, alpha) {
	// if string format, convert to number
	if (typeof color === 'string' && color[0] === '#') {
		color = window.parseInt(color.slice(1), 16);
	}
	alpha = (alpha === undefined) ? 1 : alpha;

	// extract component values
	var r = color >> 16 & 0xff,
		g = color >> 8 & 0xff,
		b = color & 0xff,
		a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha); // check range

	// use 'rgba' if neede
	if (a === 1) { 
		return "rgb("+ r +","+ g +","+ b +")";
	} else {
		return "rgba("+ r +","+ g + "," + b +","+ a +")";
	}
};

function eventPositionCapture(x,y,event,element) {
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
		x:x,
		y:y
	};
}