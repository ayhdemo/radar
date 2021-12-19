/*

  ATGis.js -- AT21 century MapGis Framework

  Copyright (c) 2013 by AT21 century Contributors
 */self.console = self.console || {
	info : function() {
	},
	log : function() {
	},
	debug : function() {
	},
	warn : function() {
	},
	error : function() {
	}
};
String.prototype.trim = String.prototype.trim || function() {
	return this.replace(/^\s+|\s+$/g, '');
};
var ATGis = window.ATGis = function(adaptors, options) {
	this._init(adaptors, options);
};
ATGis.REVISION = "1.0";
ATGis.AdaptorType = null;
ATGis.extend = function(obj, source) {
	if (Object.keys) {
		var keys = Object.keys(source || {});
		for ( var i = 0, il = keys.length; i < il; i++) {
			var prop = keys[i];
			Object.defineProperty(obj, prop, Object.getOwnPropertyDescriptor(
					source, prop));
		}
	} else {
		var safeHasOwnProperty = {}.hasOwnProperty;
		for ( var prop in source) {
			if (safeHasOwnProperty.call(source, prop)) {
				obj[prop] = source[prop];
			}
		}
	}
	return obj;
}
ATGis.combi = function(obj, source) {
	var safeHasOwnProperty = {}.hasOwnProperty;
	for ( var prop in source) {
		if (safeHasOwnProperty.call(source, prop)) {
			if (typeof (source[prop]) == "object") {
				obj[prop] ? false : obj[prop] = new Object();
				ATGis.combi(obj[prop], source[prop]);
			} else {
				obj[prop] = source[prop];
			}
		}
	}
}
ATGis.prototype = {
	adaptors : null,
	activeAdaptor : null,
	adaptorManager : null,
	layers : null,
	legends : null,
	_init : function(adaptors, options) {
		this.adaptors = adaptors;
		this.layers = [];
		this.legends = [];
		ATGis.extend(this, options);
		this._initAdaptorManager();
	},
	init : function() {
		this.adaptorManager.callMethod("init");
	},
	_initAdaptorManager : function() {
		this.adaptorManager = new ATGis.AdaptorManager(this, this.adaptors);
		if (this.adaptors) {
			this.setCurrentAdaptor(this.adaptors[0]);
		}
	},
	setCurrentAdaptor : function(adaptor) {
		this.activeAdaptor = adaptor;
		ATGis.AdaptorType = adaptor.adaptorType;
	},
	getCurrentAdaptor : function() {
		return this.activeAdaptor;
	},
	zoomIn : function() {
		this.adaptorManager.callMethod("zoomIn", arguments);
	},
	zoomOut : function() {
		this.adaptorManager.callMethod("zoomOut", arguments);
	},
	zoomTo : function(zoom) {
		this.adaptorManager.callMethod("zoomTo", arguments);
	},
	zoomToExtent : function(extent) {
		this.adaptorManager.callMethod("zoomToExtent", arguments);
	},
	goTo : function(position) {
		this.adaptorManager.callMethod("goTo", arguments);
	},
	panLeft : function() {
		this.adaptorManager.callMethod("panLeft", arguments);
	},
	panBottom : function() {
		this.adaptorManager.callMethod("panBottom", arguments);
	},
	panRight : function() {
		this.adaptorManager.callMethod("panRight", arguments);
	},
	panTop : function() {
		this.adaptorManager.callMethod("panTop", arguments);
	},
	centerAt : function(position) {
		this.adaptorManager.callMethod("centerAt", arguments);
	},
	centerZoom : function(position, zoom) {
		this.adaptorManager.callMethod("centerZoom", arguments);
	},
	setCenter : function(position) {
		this.adaptorManager.callMethod("setCenter", arguments);
	},
	getCenter : function() {
		return this.adaptorManager.callMethod("getCenter", arguments);
	},
	getZoom : function() {
		return this.adaptorManager.callMethod("getZoom", arguments);
	},
	getMaxZoom : function() {
		return this.adaptorManager.callMethod("getMaxZoom", arguments);
	},
	getMinZoom : function() {
		return this.adaptorManager.callMethod("getMinZoom", arguments);
	},
	getExtent : function() {
		return this.adaptorManager.callMethod("getExtent", arguments);
	},
	getPositionByPoint : function(point) {
		return this.adaptorManager.callMethod("getPositionByPoint", arguments);
	},
	getPointByPosition : function(position) {
		return this.adaptorManager.callMethod("getPointByPosition", arguments);
	},
	update : function() {
		this.adaptorManager.callMethod("update", arguments);
	},
	enableMouseWheelZoom : function() {
		this.adaptorManager.callMethod("enableMouseWheelZoom", arguments);
	},
	disableMouseWheelZoom : function() {
		this.adaptorManager.callMethod("disableMouseWheelZoom", arguments);
	},
	loadend : function() {
	},
	click : null,
	dblclick : null,
	rightclick : null,
	movestart : null,
	move : null,
	moveend : null,
	layeradded : null,
	layerremoved : null,
	zoomend : null,
	darg : null,
	dargend : null,
	addLayer : function(layer) {
		if (ATGis.Utils.indexOf(this.layers, layer) == -1) {
			this.adaptorManager.callMethod("addLayer", arguments);
			this.layers.push(layer);
			if (layer.legend && layer.legend != "null") {
				this.addLegend(layer.legend);
			}
		}
	},
	addLayers : function(layers) {
		for ( var i in layers) {
			var layer = layers[i];
			this.addLayer(layer);
		}
	},
	removeLayer : function(layer) {
		var index = ATGis.Utils.indexOf(this.layers, layer);
		if (index != -1) {
			this.adaptorManager.callMethod("removeLayer", arguments);
			this.layers.splice(index, 1);
			if (layer.legend) {
				this.removeLegend(layer.legend);
			}
		}
	},
	removeLayers : function(layers) {
		for ( var i in layers) {
			this.removeLayer(layers[i]);
		}
	},
	createTileLayer : function(layer) {
		return this.adaptorManager.callMethod("createTileLayer", arguments);
	},
	createWMSLayer : function(layer) {
		return this.adaptorManager.callMethod("createWMSLayer", arguments);
	},
	createPOILayer : function(layer) {
		return this.adaptorManager.callMethod("createPOILayer", arguments);
	},
	addLegend : function(legend) {
		if (ATGis.Utils.indexOf(this.legends, legend) == -1) {
			this.legends.push(legend);
		}
	},
	removeLegend : function(legend) {
		var index = ATGis.Utils.indexOf(this.legends, legend);
		if (index != -1) {
			this.legends.splice(index, 1);
		}
	},
	addControl : function(control, options, align) {
		return this.adaptorManager.callMethod("addControl", arguments);
	},
	removeControl : function(control) {
		this.adaptorManager.callMethod("removeControl", arguments);
	},
	hasBaseLayer : function() {
		return this.adaptorManager.callMethod("hasBaseLayer", arguments);
	},
	getGeometryArea : function(geometry, unit) {
		return this.adaptorManager.callMethod("getGeometryArea", arguments);
	},
	getGeometryLength : function(geometry, unit) {
		return this.adaptorManager.callMethod("getGeometryLength", arguments);
	}
}
ATGis.ALIGN_TOP_LEFT = 0;
ATGis.ALIGN_TOP_CENTER = 1;
ATGis.ALIGN_TOP_RIGHT = 2;
ATGis.ALIGN_BOTTOM_RIGHT = 3;
ATGis.ALIGN_BOTTOM_CENTER = 4;
ATGis.ALIGN_BOTTOM_LEFT = 5;
ATGis.ALIGN_CENTER_CENTER = 6;
ATGis.ALIGN_CENTER_LEFT = 7;
ATGis.ALIGN_CENTER_RIGHT = 8;
ATGis.JSON = self.JSON || {};
ATGis.JSON.parse ? true : ATGis.JSON.parse = function(json) {
	return eval("(" + json + ")");
};
ATGis.JSON.stringify ? true : ATGis.JSON.stringify = function(json) {
	switch (typeof (json)) {
	case 'string':
		return '"' + json.replace(/(["\\])/g, '\\$1') + '"';
	case 'array':
		return '[' + json.map(ATGis.JSON.stringify).join(',') + ']';
	case 'object':
		if (json instanceof Array) {
			var strArr = [];
			var len = json.length;
			for ( var i = 0; i < len; i++) {
				strArr.push(ATGis.JSON.stringify(json[i]));
			}
			return '[' + strArr.join(',') + ']';
		} else if (obj == null) {
			return 'null';
		} else {
			var string = [];
			for ( var property in json) {
				string.push(property + ':'
						+ ATGis.JSON.stringify(obj[property]));
				return '{' + string.join(',') + '}';
			}
		}
	case 'number':
		return obj;
	case false:
		return obj;
	}
};
ATGis.Bounds = function(left, bottom, right, top) {
	this._init(left, bottom, right, top);
}
ATGis.Bounds.prototype = {
	constructor : ATGis.Bounds,
	left : null,
	bottom : null,
	right : null,
	top : null,
	centerLonLat : null,
	_init : function(left, bottom, right, top) {
		if (left instanceof Array) {
			bottom = left[1];
			right = left[2];
			top = left[3];
			left = left[0];
		}
		left != null ? this.left = parseFloat(left) : false;
		bottom != null ? this.bottom = parseFloat(bottom) : false;
		right != null ? this.right = parseFloat(right) : false;
		top != null ? this.top = parseFloat(top) : false;
	},
	clone : function() {
		return new ATGis.Bounds(this.left, this.bottom, this.right, this.top);
	},
	equals : function(bounds) {
		var equals = false;
		if (bounds != null) {
			equals = ((this.left == bounds.left)
					&& (this.right == bounds.right) && (this.top == bounds.top) && (this.bottom == bounds.bottom));
		}
		return equals;
	},
	toString : function() {
		return [ this.left, this.bottom, this.right, this.top ].join(",");
	},
	toArray : function(reverseAxisOrder) {
		if (reverseAxisOrder === true) {
			return [ this.bottom, this.left, this.top, this.right ];
		} else {
			return [ this.left, this.bottom, this.right, this.top ];
		}
	},
	toGeometry : function() {
	},
	getWidth : function() {
		return (this.right - this.left);
	},
	getHeight : function() {
		return (this.top - this.bottom);
	},
	getCenterLonLat : function() {
		if (!this.centerLonLat) {
			this.centerLonLat = new ATGis.Position(
					(this.left + this.right) / 2, (this.bottom + this.top) / 2,
					0);
		}
		return this.centerLonLat;
	},
	extend : function(object) {
		var bounds = null;
		if (object) {
			if (object instanceof ATGis.Position) {
				bounds = ATGis.Bounds(object.x, object.y, object.x, object.y);
			} else if (object instanceof ATGis.Point) {
				bounds = ATGis.Bounds(object.x, object.y, object.x, object.y);
			} else if (object instanceof ATGis.Bounds) {
				bounds = object;
			} else {
			}
			if (bounds) {
				this.centerLonLat = null;
				if ((this.left == null) || (bounds.left < this.left)) {
					this.left = bounds.left;
				}
				if ((this.bottom == null) || (bounds.bottom < this.bottom)) {
					this.bottom = bounds.bottom;
				}
				if ((this.right == null) || (bounds.right > this.right)) {
					this.right = bounds.right;
				}
				if ((this.top == null) || (bounds.top > this.top)) {
					this.top = bounds.top;
				}
			}
		}
	},
	containsBounds : function(bounds, partial, inclusive) {
		if (partial == null) {
			partial = false;
		}
		if (inclusive == null) {
			inclusive = true;
		}
		var bottomLeft = this.contains(bounds.left, bounds.bottom, inclusive);
		var bottomRight = this.contains(bounds.right, bounds.bottom, inclusive);
		var topLeft = this.contains(bounds.left, bounds.top, inclusive);
		var topRight = this.contains(bounds.right, bounds.top, inclusive);
		return (partial) ? (bottomLeft || bottomRight || topLeft || topRight)
				: (bottomLeft && bottomRight && topLeft && topRight);
	},
	contains : function(x, y, inclusive) {
		if (inclusive == null) {
			inclusive = true;
		}
		if (x == null || y == null) {
			return false;
		}
		x = parseFloat(x);
		y = parseFloat(y);
		var contains = false;
		if (inclusive) {
			contains = ((x >= this.left) && (x <= this.right)
					&& (y >= this.bottom) && (y <= this.top));
		} else {
			contains = ((x > this.left) && (x < this.right)
					&& (y > this.bottom) && (y < this.top));
		}
		return contains;
	}
};
ATGis.Utils = ATGis.Utils || {};
ATGis.Utils.indexOf = function(arr, item) {
	var index = -1;
	for ( var i in arr) {
		if (arr[i] === item) {
			index = i;
			break;
		}
	}
	return index;
}
ATGis.Vec2 = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};
ATGis.Vec2.prototype = {
	constructor : ATGis.Vec2,
	set : function(x, y) {
		this.x = x;
		this.y = y;
		return this;
	},
	setX : function(x) {
		this.x = x;
		return this;
	},
	setY : function(y) {
		this.y = y;
		return this;
	},
	setComponent : function(index, value) {
		switch (index) {
		case 0:
			this.x = value;
			break;
		case 1:
			this.y = value;
			break;
		default:
			throw new Error("index is out of range: " + index);
		}
	},
	getComponent : function(index) {
		switch (index) {
		case 0:
			return this.x;
		case 1:
			return this.y;
		default:
			throw new Error("index is out of range: " + index);
		}
	},
	copy : function(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	},
	add : function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},
	addVectors : function(a, b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		return this;
	},
	addScalar : function(s) {
		this.x += s;
		this.y += s;
		return this;
	},
	sub : function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	},
	subVectors : function(a, b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		return this;
	},
	multiplyScalar : function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	},
	divideScalar : function(s) {
		if (s !== 0) {
			this.x /= s;
			this.y /= s;
		} else {
			this.set(0, 0);
		}
		return this;
	},
	min : function(v) {
		if (this.x > v.x) {
			this.x = v.x;
		}
		if (this.y > v.y) {
			this.y = v.y;
		}
		return this;
	},
	max : function(v) {
		if (this.x < v.x) {
			this.x = v.x;
		}
		if (this.y < v.y) {
			this.y = v.y;
		}
		return this;
	},
	clamp : function(min, max) {
		if (this.x < min.x) {
			this.x = min.x;
		} else if (this.x > max.x) {
			this.x = max.x;
		}
		if (this.y < min.y) {
			this.y = min.y;
		} else if (this.y > max.y) {
			this.y = max.y;
		}
		return this;
	},
	negate : function() {
		return this.multiplyScalar(-1);
	},
	dot : function(v) {
		return this.x * v.x + this.y * v.y;
	},
	lengthSq : function() {
		return this.x * this.x + this.y * this.y;
	},
	length : function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
	normalize : function() {
		return this.divideScalar(this.length());
	},
	distanceTo : function(v) {
		return Math.sqrt(this.distanceToSquared(v));
	},
	distanceToSquared : function(v) {
		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	},
	setLength : function(l) {
		var oldLength = this.length();
		if (oldLength !== 0 && l !== oldLength) {
			this.multiplyScalar(l / oldLength);
		}
		return this;
	},
	lerp : function(v, alpha) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		return this;
	},
	equals : function(v) {
		return ((v.x === this.x) && (v.y === this.y));
	},
	fromArray : function(array) {
		this.x = array[0];
		this.y = array[1];
		return this;
	},
	toArray : function() {
		return [ this.x, this.y ];
	},
	clone : function() {
		return new ATGis.Vec2(this.x, this.y);
	}
};
ATGis.Point = function(x, y) {
	ATGis.Vec2.call(this, x, y);
};
ATGis.Point.prototype = Object.create ? Object.create(ATGis.Vec2.prototype)
		: ATGis.extend({}, ATGis.Vec2.prototype);
ATGis.extend(ATGis.Point.prototype, {
	constructor : ATGis.Point,
	toString : function() {
		return this.x + "," + this.y;
	}
});
ATGis.Vec3 = function(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}
ATGis.Vec3.prototype = {
	constructor : ATGis.Vec3,
	set : function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	},
	setX : function(x) {
		this.x = x;
		return this;
	},
	setY : function(y) {
		this.y = y;
		return this;
	},
	setZ : function(z) {
		this.z = z;
		return this;
	},
	setComponent : function(index, value) {
		switch (index) {
		case 0:
			this.x = value;
			break;
		case 1:
			this.y = value;
			break;
		case 2:
			this.z = value;
			break;
		default:
			throw new Error("index is out of range: " + index);
		}
	},
	getComponent : function(index) {
		switch (index) {
		case 0:
			return this.x;
		case 1:
			return this.y;
		case 2:
			return this.z;
		default:
			throw new Error("index is out of range: " + index);
		}
	},
	copy : function(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	},
	add : function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	},
	addScalar : function(s) {
		this.x += s;
		this.y += s;
		this.z += s;
		return this;
	},
	addVectors : function(a, b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		return this;
	},
	sub : function(v, w) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	},
	subVectors : function(a, b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		return this;
	},
	multiply : function(v, w) {
		if (w !== undefined) {
			console
					.warn('DEPRECATED: Vector3\'s .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
			return this.multiplyVectors(v, w);
		}
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	},
	multiplyScalar : function(s) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	},
	multiplyVectors : function(a, b) {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;
		return this;
	},
	applyMatrix3 : function(m) {
		var x = this.x;
		var y = this.y;
		var z = this.z;
		var e = m.elements;
		this.x = e[0] * x + e[3] * y + e[6] * z;
		this.y = e[1] * x + e[4] * y + e[7] * z;
		this.z = e[2] * x + e[5] * y + e[8] * z;
		return this;
	},
	applyMatrix4 : function(m) {
		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;
		this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
		this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
		this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
		return this;
	},
	applyProjection : function(m) {
		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;
		var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
		this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
		this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
		this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
		return this;
	},
	applyQuaternion : function(q) {
		var x = this.x;
		var y = this.y;
		var z = this.z;
		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;
		var ix = qw * x + qy * z - qz * y;
		var iy = qw * y + qz * x - qx * z;
		var iz = qw * z + qx * y - qy * x;
		var iw = -qx * x - qy * y - qz * z;
		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
		return this;
	},
	transformDirection : function(m) {
		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;
		this.x = e[0] * x + e[4] * y + e[8] * z;
		this.y = e[1] * x + e[5] * y + e[9] * z;
		this.z = e[2] * x + e[6] * y + e[10] * z;
		this.normalize();
		return this;
	},
	divide : function(v) {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		return this;
	},
	divideScalar : function(s) {
		if (s !== 0) {
			this.x /= s;
			this.y /= s;
			this.z /= s;
		} else {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		}
		return this;
	},
	min : function(v) {
		if (this.x > v.x) {
			this.x = v.x;
		}
		if (this.y > v.y) {
			this.y = v.y;
		}
		if (this.z > v.z) {
			this.z = v.z;
		}
		return this;
	},
	max : function(v) {
		if (this.x < v.x) {
			this.x = v.x;
		}
		if (this.y < v.y) {
			this.y = v.y;
		}
		if (this.z < v.z) {
			this.z = v.z;
		}
		return this;
	},
	clamp : function(min, max) {
		if (this.x < min.x) {
			this.x = min.x;
		} else if (this.x > max.x) {
			this.x = max.x;
		}
		if (this.y < min.y) {
			this.y = min.y;
		} else if (this.y > max.y) {
			this.y = max.y;
		}
		if (this.z < min.z) {
			this.z = min.z;
		} else if (this.z > max.z) {
			this.z = max.z;
		}
		return this;
	},
	negate : function() {
		return this.multiplyScalar(-1);
	},
	dot : function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},
	lengthSq : function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	},
	length : function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	},
	lengthManhattan : function() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	},
	normalize : function() {
		return this.divideScalar(this.length());
	},
	setLength : function(l) {
		var oldLength = this.length();
		if (oldLength !== 0 && l !== oldLength) {
			this.multiplyScalar(l / oldLength);
		}
		return this;
	},
	lerp : function(v, alpha) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		this.z += (v.z - this.z) * alpha;
		return this;
	},
	cross : function(v, w) {
		if (w !== undefined) {
			console
					.warn('DEPRECATED: Vector3\'s .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
			return this.crossVectors(v, w);
		}
		var x = this.x, y = this.y, z = this.z;
		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;
		return this;
	},
	crossVectors : function(a, b) {
		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;
		return this;
	},
	angleTo : function(v) {
		var theta = this.dot(v) / (this.length() * v.length());
		return Math.acos(THREE.Math.clamp(theta, -1, 1));
	},
	distanceTo : function(v) {
		return Math.sqrt(this.distanceToSquared(v));
	},
	distanceToSquared : function(v) {
		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var dz = this.z - v.z;
		return dx * dx + dy * dy + dz * dz;
	},
	setEulerFromRotationMatrix : function(m, order) {
		function clamp(x) {
			return Math.min(Math.max(x, -1), 1);
		}
		var te = m.elements;
		var m11 = te[0], m12 = te[4], m13 = te[8];
		var m21 = te[1], m22 = te[5], m23 = te[9];
		var m31 = te[2], m32 = te[6], m33 = te[10];
		if (order === undefined || order === 'XYZ') {
			this.y = Math.asin(clamp(m13));
			if (Math.abs(m13) < 0.99999) {
				this.x = Math.atan2(-m23, m33);
				this.z = Math.atan2(-m12, m11);
			} else {
				this.x = Math.atan2(m32, m22);
				this.z = 0;
			}
		} else if (order === 'YXZ') {
			this.x = Math.asin(-clamp(m23));
			if (Math.abs(m23) < 0.99999) {
				this.y = Math.atan2(m13, m33);
				this.z = Math.atan2(m21, m22);
			} else {
				this.y = Math.atan2(-m31, m11);
				this.z = 0;
			}
		} else if (order === 'ZXY') {
			this.x = Math.asin(clamp(m32));
			if (Math.abs(m32) < 0.99999) {
				this.y = Math.atan2(-m31, m33);
				this.z = Math.atan2(-m12, m22);
			} else {
				this.y = 0;
				this.z = Math.atan2(m21, m11);
			}
		} else if (order === 'ZYX') {
			this.y = Math.asin(-clamp(m31));
			if (Math.abs(m31) < 0.99999) {
				this.x = Math.atan2(m32, m33);
				this.z = Math.atan2(m21, m11);
			} else {
				this.x = 0;
				this.z = Math.atan2(-m12, m22);
			}
		} else if (order === 'YZX') {
			this.z = Math.asin(clamp(m21));
			if (Math.abs(m21) < 0.99999) {
				this.x = Math.atan2(-m23, m22);
				this.y = Math.atan2(-m31, m11);
			} else {
				this.x = 0;
				this.y = Math.atan2(m13, m33);
			}
		} else if (order === 'XZY') {
			this.z = Math.asin(-clamp(m12));
			if (Math.abs(m12) < 0.99999) {
				this.x = Math.atan2(m32, m22);
				this.y = Math.atan2(m13, m11);
			} else {
				this.x = Math.atan2(-m23, m33);
				this.y = 0;
			}
		}
		return this;
	},
	setEulerFromQuaternion : function(q, order) {
		function clamp(x) {
			return Math.min(Math.max(x, -1), 1);
		}
		var sqx = q.x * q.x;
		var sqy = q.y * q.y;
		var sqz = q.z * q.z;
		var sqw = q.w * q.w;
		if (order === undefined || order === 'XYZ') {
			this.x = Math.atan2(2 * (q.x * q.w - q.y * q.z),
					(sqw - sqx - sqy + sqz));
			this.y = Math.asin(clamp(2 * (q.x * q.z + q.y * q.w)));
			this.z = Math.atan2(2 * (q.z * q.w - q.x * q.y),
					(sqw + sqx - sqy - sqz));
		} else if (order === 'YXZ') {
			this.x = Math.asin(clamp(2 * (q.x * q.w - q.y * q.z)));
			this.y = Math.atan2(2 * (q.x * q.z + q.y * q.w),
					(sqw - sqx - sqy + sqz));
			this.z = Math.atan2(2 * (q.x * q.y + q.z * q.w),
					(sqw - sqx + sqy - sqz));
		} else if (order === 'ZXY') {
			this.x = Math.asin(clamp(2 * (q.x * q.w + q.y * q.z)));
			this.y = Math.atan2(2 * (q.y * q.w - q.z * q.x),
					(sqw - sqx - sqy + sqz));
			this.z = Math.atan2(2 * (q.z * q.w - q.x * q.y),
					(sqw - sqx + sqy - sqz));
		} else if (order === 'ZYX') {
			this.x = Math.atan2(2 * (q.x * q.w + q.z * q.y),
					(sqw - sqx - sqy + sqz));
			this.y = Math.asin(clamp(2 * (q.y * q.w - q.x * q.z)));
			this.z = Math.atan2(2 * (q.x * q.y + q.z * q.w),
					(sqw + sqx - sqy - sqz));
		} else if (order === 'YZX') {
			this.x = Math.atan2(2 * (q.x * q.w - q.z * q.y),
					(sqw - sqx + sqy - sqz));
			this.y = Math.atan2(2 * (q.y * q.w - q.x * q.z),
					(sqw + sqx - sqy - sqz));
			this.z = Math.asin(clamp(2 * (q.x * q.y + q.z * q.w)));
		} else if (order === 'XZY') {
			this.x = Math.atan2(2 * (q.x * q.w + q.y * q.z),
					(sqw - sqx + sqy - sqz));
			this.y = Math.atan2(2 * (q.x * q.z + q.y * q.w),
					(sqw + sqx - sqy - sqz));
			this.z = Math.asin(clamp(2 * (q.z * q.w - q.x * q.y)));
		}
		return this;
	},
	getPositionFromMatrix : function(m) {
		this.x = m.elements[12];
		this.y = m.elements[13];
		this.z = m.elements[14];
		return this;
	},
	getScaleFromMatrix : function(m) {
		var sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length();
		var sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length();
		var sz = this.set(m.elements[8], m.elements[9], m.elements[10])
				.length();
		this.x = sx;
		this.y = sy;
		this.z = sz;
		return this;
	},
	getColumnFromMatrix : function(index, matrix) {
		var offset = index * 4;
		var me = matrix.elements;
		this.x = me[offset];
		this.y = me[offset + 1];
		this.z = me[offset + 2];
		return this;
	},
	equals : function(v) {
		return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
	},
	fromArray : function(array) {
		this.x = array[0];
		this.y = array[1];
		this.z = array[2];
		return this;
	},
	toArray : function() {
		return [ this.x, this.y, this.z ];
	},
	clone : function() {
		return new THREE.Vector3(this.x, this.y, this.z);
	}
};
ATGis.Position = function(lon, lat, alt) {
	ATGis.Vec3.call(this, lon, lat, alt);
}
ATGis.Position.prototype = Object.create ? Object.create(ATGis.Vec3.prototype)
		: ATGis.extend({}, ATGis.Vec3.prototype);
ATGis.extend(ATGis.Position.prototype, {
	constructor : ATGis.Position,
	toString : function() {
		return this.x + "," + this.y + "," + this.alt + "," + this.heading
				+ "," + this.pitch + "," + this.dis;
	}
});
ATGis.Size = function(w, h) {
	this.w = w || 0;
	this.h = h || 0;
}
ATGis.Size.prototype = {
	clone : function() {
		return new ATGis.Size(this.w, this.h);
	},
	equals : function(size) {
		return this.w == size.w && this.h == size.h;
	},
	scale : function(scale) {
		this.w *= scale;
		this.h *= scale;
	},
	toString : function() {
		return this.w + "," + this.h;
	}
};
ATGis.Adaptor = function(id, options) {
	this._init(id, options);
};
ATGis.Adaptor.prototype = {
	id : null,
	options : null,
	_init : function(id, options) {
		this.id = id;
		this.options = options;
	},
	init : function() {
	},
	zoomIn : function() {
	},
	zoomOut : function() {
	},
	zoomTo : function(zoom) {
	},
	zoomToExtent : function(extent) {
	},
	goTo : function(position) {
	},
	panLeft : function() {
	},
	panBottom : function() {
	},
	panRight : function() {
	},
	panTop : function() {
	},
	centerAt : function(position) {
	},
	centerZoom : function(position, zoom) {
	}
};
ATGis.OpenLayersAdaptor = function(id, options) {
	ATGis.Adaptor.call(this);
	this._init(id, options);
};
ATGis.OpenLayersAdaptor.prototype = Object.create ? Object
		.create(ATGis.Adaptor.prototype) : ATGis.extend({},
		ATGis.Adaptor.prototype);
ATGis
		.extend(
				ATGis.OpenLayersAdaptor.prototype,
				{
					constructor : ATGis.OpenLayersAdaptor,
					adaptorType : "OpenLayers",
					map : null,
					atgis : null,
					controlpanel : null,
					defaultOptions : {
						maxResolution : 0.703125,
						tileSize : 512,
						units : 'dd',
						projection : "EPSG:4326",
						numZoomLevels : 24,
						maxExtent : [ -180, -180, 180, 180 ]
					},
					init : function() {
						this.controlpanel = new OpenLayers.Control.Panel();
						this.options.controls = [
								new OpenLayers.Control.LTZommAnimation(),
								new OpenLayers.Control.Zoom(),
								this.controlpanel ];
						var settings = ATGis.extend({}, this.defaultOptions);
						settings = ATGis.extend(settings, this.options);
						if (settings.tileSize) {
							this.setTileSize(settings.tileSize);
							delete settings.tileSize;
						}
						OpenLayers.Map.prototype.resetLayersZIndex = function() {
						}
						this.map = new OpenLayers.Map(this.id, settings);
						this.atgis.loadend();
						if (this.atgis.click) {
							this.addEventListener("click", this.map,
									this.atgis.click);
						}
						if (this.atgis.dblclick) {
							this.addEventListener("dblclick", this.map,
									this.atgis.dblclick);
						}
						if (this.atgis.rightclick) {
							var scope = this;
							this.addEventListener("mousedown", this.map,
									function(evt) {
										evt.preventDefault();
										if (evt.button == 2) {
											scope.atgis.rightclick(evt);
											return false;
										}
									});
						}
						if (this.atgis.movestart) {
							this.addEventListener("movestart", this.map,
									this.atgis.movestart);
						}
						if (this.atgis.move) {
							this.addEventListener("move", this.map,
									this.atgis.move);
						}
						if (this.atgis.moveend) {
							this.addEventListener("moveend", this.map,
									this.atgis.moveend);
						}
						if (this.atgis.zoomend) {
							this.addEventListener("zoomend", this.map,
									this.atgis.zoomend);
						}
						if (this.atgis.drag) {
							this.addEventListener("move", this.map,
									this.atgis.drag);
						}
						if (this.atgis.dragend) {
							this.addEventListener("moveend", this.map,
									this.atgis.dragend);
						}
					},
					setGis : function(atgis) {
						this.atgis = atgis;
					},
					setTileSize : function(size) {
						OpenLayers.Map.TILE_WIDTH = size;
						OpenLayers.Map.TILE_HEIGHT = size;
					},
					zoomIn : function() {
						this.map.zoomIn();
					},
					zoomOut : function() {
						this.map.zoomOut();
					},
					zoomTo : function(zoom) {
						this.map.zoomTo(zoom);
					},
					zoomToExtent : function(extent) {
						this.map.zoomToExtent(new OpenLayers.Bounds(
								extent.left, extent.bottom, extent.right,
								extent.top));
					},
					goTo : function(position) {
						this.centerAt(position);
					},
					panLeft : function() {
						this.map.pan(50, 0);
					},
					panBottom : function() {
						this.map.pan(0, -50);
					},
					panRight : function() {
						this.map.pan(-50, 0);
					},
					panTop : function() {
						this.map.pan(0, 50);
					},
					centerAt : function(position) {
						this.map.setCenter(new OpenLayers.LonLat(position.x,
								position.y));
					},
					centerZoom : function(position, zoom) {
						this.map.setCenter(new OpenLayers.LonLat(position.x,
								position.y), zoom);
					},
					setCenter : function(position) {
						this.map.setCenter(new OpenLayers.LonLat(position.x,
								position.y));
					},
					getCenter : function() {
						var p = this.map.getCenter();
						return new ATGis.Position(p.lon, p.lat);
					},
					getZoom : function() {
						return this.map.getZoom();
					},
					getMaxZoom : function() {
						return this.map.numZoomLevels;
					},
					getMinZoom : function() {
						return 0;
					},
					getExtent : function() {
						return this.map.getExtent();
					},
					getPositionByPoint : function(point) {
						var lonlat = this.map.getLonLatFromPixel(point);
						return new ATGis.Position(lonlat.lon, lonlat.lat, 0);
					},
					getPointByPosition : function(position) {
						return this.map
								.getPixelFromLonLat(new OpenLayers.LonLat(
										position.x, position.y));
					},
					update : function() {
						this.map.updateSize();
					},
					enableMouseWheelZoom : function() {
						var controls = this.map
								.getControlsByClass("OpenLayers.Control.Navigation");
						if (controls) {
							var control = controls[0];
							control.enableZoomWheel();
						}
					},
					disableMouseWheelZoom : function() {
						var controls = this.map
								.getControlsByClass("OpenLayers.Control.Navigation");
						if (controls) {
							var control = controls[0];
							control.disableZoomWheel();
						}
					},
					addLayer : function(layer) {
						if (!this.hasBaseLayer()) {
							layer.options.isBaseLayer = true;
						}
						layer.setAdaptor(this);
						this.map.addLayer(layer.adaptorLayer);
						if (this.atgis.layeradded) {
							this.atgis.layeradded(layer);
						}
					},
					addLayers : function(layers) {
						for ( var i in layers) {
							var layer = layers[i];
							this.addLayer(layer);
						}
					},
					removeLayer : function(layer) {
						this.map.removeLayer(layer.adaptorLayer);
						if (this.atgis.layerremoved) {
							this.atgis.layerremoved(layer);
						}
					},
					removeLayers : function(layers) {
						for ( var i in layers) {
							this.removeLayer(layers[i]);
						}
					},
					reLoadLayer : function(layer, params) {
						if (layer.type === "WMSLayer") {
							layer.adaptorLayer.mergeNewParams(params);
						}
					},
					createLayer : function(layer) {
						var olayer;
						if (layer.options.layerName) {
							if (OpenLayers.Layer[layer.options.layerName]) {
								olayer = new OpenLayers.Layer[layer.options.layerName](
										layer.name, layer.options);
								return olayer;
							}
						}
						return null;
					},
					createTileLayer : function(layer) {
						var layer = new OpenLayers.Layer.TileLayer(layer.name,
								layer.url, layer.options);
						return layer;
					},
					createWMSLayer : function(layer) {
						var wmslayer = new OpenLayers.Layer.WMS(layer.name,
								layer.url, layer.params, layer.options);
						wmslayer.spetialQueryable = layer.spetialQueryable;
						wmslayer.restIDs = layer.restIDs;
						return wmslayer;
					},
					createPOILayer : function(layer) {
						var poilayer = new OpenLayers.Layer.PoiLayer(
								layer.name, layer.options);
						poilayer.spetialQueryable = layer.spetialQueryable;
						return poilayer;
					},
					createVectorLayer : function(layer) {
						if (layer.options.style) {
							var style = new OpenLayers.Style();
							style.addRules([ new OpenLayers.Rule({
								symbolizer : layer.options.style
							}) ]);
							var styleMap = new OpenLayers.StyleMap({
								"default" : style
							});
							delete layer.options.style;
							layer.options.styleMap = styleMap;
						}
						var vlayer = new OpenLayers.Layer.Vector(layer.name,
								layer.options);
						return vlayer;
					},
					createFileLayer : function(layer) {
						return null;
					},
					addControl : function(control, options, align) {
						if (OpenLayers.Control[control]) {
							var c = new OpenLayers.Control[control](options);
							if (c.type == OpenLayers.Control.TYPE_TOOL
									|| c.type == OpenLayers.Control.TYPE_TOGGLE
									|| c.type == OpenLayers.Control.TYPE_BUTTON) {
								this.controlpanel.addControls([ c ]);
							} else {
								this.map.addControl(c);
							}
							console.log("添加了控件" + control);
							return c;
						}
						return null;
					},
					removeControl : function(control) {
						var clazz = "OpenLayers.Control." + control;
						var cs = this.map.getControlsByClass(clazz);
						if (cs.length) {
							this.map.removeControl(cs[0]);
						}
					},
					getControl : function(name) {
						var clazz = "OpenLayers.Control." + name;
						var cs = this.map.getControlsByClass(clazz);
						if (cs.length) {
							return cs[0];
						}
						return null;
					},
					activeControl : function(control) {
						if (typeof (control) == 'string') {
							control = this.getControl(control);
						}
						if (!control) {
							return;
						}
						if (control.type == OpenLayers.Control.TYPE_BUTTON) {
							control.trigger();
							return;
						}
						if (control.type == OpenLayers.Control.TYPE_TOGGLE) {
							if (control.active) {
								control.deactivate();
							} else {
								control.activate();
							}
							return;
						}
						var c;
						for ( var i = 0, len = this.map.controls.length; i < len; i++) {
							c = this.map.controls[i];
							if (c != control
									&& (c.type === OpenLayers.Control.TYPE_TOOL || c.type == null)) {
								c.deactivate();
							}
						}
						control.activate();
					},
					createFeatureByWKT : function(wkt) {
						var format = new OpenLayers.Format.WKT();
						var fs = format.read(wkt);
						return fs;
					},
					addEventListener : function(type, obj, cback) {
						obj.events.register(type, obj, cback);
					},
					removeEventListener : function(type, obj, cback) {
						obj.events.unregister(type, obj, cback);
					},
					hasBaseLayer : function() {
						return this.map.baseLayer !== null;
					},
					getGeometryArea : function(geometry, unit) {
						var area = geometry.getArea();
						var geomUnits = this.map.getUnits();
						var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[unit];
						if (inPerDisplayUnit) {
							var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
							area *= Math.pow((inPerMapUnit / inPerDisplayUnit),
									2);
						}
						return area;
					},
					getGeometryLength : function(geometry, unit) {
						var length = geometry.getLength();
						var geomUnits = this.map.getUnits();
						var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[unit];
						if (inPerDisplayUnit) {
							var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
							length *= (inPerMapUnit / inPerDisplayUnit);
						}
						return length;
					}
				});
ATGis.Layer = function(name, url, options) {
	this._init(name, url, options);
}
ATGis.Layer.prototype = {
	name : null,
	url : null,
	options : null,
	type : null,
	adaptorLayer : null,
	adaptor : null,
	legend : null,
	spetialQueryable : false,
	_init : function(name, url, options) {
		ATGis.extend(this, options);
		this.name = name;
		this.url = url;
		this.options = options;
	},
	setAdaptor : function(adaptor) {
		this.adaptor = adaptor;
		this.adaptorLayer = this._createAdaptorLayer();
	},
	_createAdaptorLayer : function() {
		var layer = this.adaptor.createLayer(this);
		return layer;
	},
	clone : function() {
		return this._callMethod("clone", arguments);
	},
	getVisibility : function() {
		return this._callMethod("getVisibility", arguments);
	},
	setVisibility : function(visibility) {
		return this._callMethod("setVisibility", arguments);
	},
	setIsBaseLayer : function(isBaseLayer) {
		return this._callMethod("setIsBaseLayer", arguments);
	},
	setOpacity : function(opacity) {
		return this._callMethod("setOpacity", arguments);
	},
	getZIndex : function() {
		return this._callMethod("getZIndex", arguments);
	},
	setZIndex : function(zindex) {
		return this._callMethod("setZIndex", arguments);
	},
	_callMethod : function(method, args) {
		if (this.adaptorLayer) {
			return this.adaptorLayer[method].apply(this.adaptorLayer, args);
		} else {
			console.log("当前图层的适配器图层没有初始化 先初始化该图层！");
			return null;
		}
	}
};
ATGis.POILayer = function(name, options) {
	ATGis.Layer.call(this, name, null, options);
}
ATGis.POILayer.prototype = Object.create ? Object.create(ATGis.Layer.prototype)
		: ATGis.extend({}, ATGis.Layer.prototype);
ATGis.extend(ATGis.POILayer.prototype, {
	constructor : ATGis.POILayer,
	type : "POILayer",
	_createAdaptorLayer : function() {
		var layer = this.adaptor.createPOILayer(this);
		return layer;
	}
});
ATGis.AdaptorManager = function(adaptors, options) {
	this._init(adaptors, options);
};
ATGis.AdaptorManager.prototype = {
	adaptors : null,
	atgis : null,
	_init : function(atgis, adaptors) {
		this.adaptors = adaptors || [];
		this.atgis = atgis;
		for ( var i = 0; i < this.adaptors.length; i++) {
			this.adaptors[i].setGis(atgis);
		}
	},
	callMethod : function(method, args) {
		var result = {};
		for ( var i in this.adaptors) {
			var adaptor = this.adaptors[i];
			if (typeof (adaptor[method]) === "function") {
				var ret = adaptor[method].apply(adaptor, args || []);
				result[adaptor.id] = ret;
			}
		}
		if (this.adaptors.length > 1) {
			return result;
		} else {
			return result[this.adaptors[0].id];
		}
	},
	addAdaptor : function(adaptor) {
		this.adaptors.push(adaptor);
		adaptor.setGis(this.atgis);
		this.atgis.adaptors = this.adaptors;
		adaptor.init();
	},
	removeAdaptor : function(adaptor) {
		var index = ATGis.Utils.indexOf(this.adaptors, adaptor);
		if (index !== -1) {
			this.adaptors.splice(index, 1);
			this.atgis.adaptors = this.adaptors;
		}
	}
};
ATGis.VectorLayer = function(name, options) {
	options = options || {};
	var s = {};
	ATGis.combi(s, this.defaultSymbolizers);
	ATGis.combi(s, options.style);
	options.style = s;
	ATGis.Layer.call(this, name, null, options);
}
ATGis.VectorLayer.prototype = Object.create ? Object
		.create(ATGis.Layer.prototype) : ATGis
		.extend({}, ATGis.Layer.prototype);
ATGis.extend(ATGis.VectorLayer.prototype, {
	constructor : ATGis.VectorLayer,
	defaultSymbolizers : {
		"Point" : {
			pointRadius : 3,
			graphicName : "square",
			fillColor : "#8AC4F0",
			fillOpacity : 1,
			strokeWidth : 1,
			strokeOpacity : 1,
			strokeColor : "#FAD00B"
		},
		"Line" : {
			strokeWidth : 3,
			strokeOpacity : 1,
			strokeColor : "#ee9900",
			strokeDashstyle : "solid"
		},
		"Polygon" : {
			strokeWidth : 2,
			strokeOpacity : 1,
			strokeColor : "#ee9900",
			fillColor : "#66cccc",
			fillOpacity : 0.3
		}
	},
	_createAdaptorLayer : function() {
		var layer = this.adaptor.createVectorLayer(this);
		return layer;
	},
	add : function(features) {
		if (features && !(features instanceof Array)) {
			features = [ features ];
		}
		var fs = [];
		for ( var i in features) {
			var feature = features[i];
			var featureobj = this.adaptor.createFeatureByWKT(feature.geometry);
			ATGis.extend(featureobj.attributes, feature.attributes);
			if (!featureobj.fid) {
				featureobj.fid = "feature_"
						+ parseInt(Math.random() * Math.pow(10, 17));
			}
			fs.push(featureobj);
		}
		this.addOrigFeatures(fs);
	},
	remove : function(features) {
		if (features && !(features instanceof Array)) {
			features = [ features ];
		}
		this.adaptorLayer.removeFeatures(features);
	},
	addOrigFeatures : function(features) {
		if (features && !(features instanceof Array)) {
			features = [ features ];
		}
		this.adaptorLayer.addFeatures(features);
	},
	removeOrigFeatures : function(features) {
		if (features && !(features instanceof Array)) {
			features = [ features ];
		}
		this.adaptorLayer.removeFeatures(features);
	},
	clear : function() {
		this.adaptorLayer.removeAllFeatures();
	},
	addWKT : function(wkt) {
		var features = this.adaptor.createFeatureByWKT(wkt);
		this.addOrigFeatures(features);
		return features;
	},
	getFeatures : function() {
		return this.adaptorLayer.features;
	},
	addEventListener : function(type, cback) {
		this.adaptor.addEventListener(type, this.adaptorLayer, cback);
	},
	removeEventListener : function(type, cback) {
		this.adaptor.removeEventListener(type, this.adaptorLayer, cback);
	}
});
ATGis.TileLayer = function(name, url, options) {
	ATGis.Layer.call(this);
	var settings = ATGis.extend({}, this.defaultOptions);
	settings = ATGis.extend(settings, options);
	this._init(name, url, settings);
}
ATGis.TileLayer.prototype = Object.create ? Object
		.create(ATGis.Layer.prototype) : ATGis
		.extend({}, ATGis.Layer.prototype);
ATGis.extend(ATGis.TileLayer.prototype, {
	constructor : ATGis.TileLayer,
	defaultOptions : {
		isBaseLayer : false
	},
	type : "TileLayer",
	_createAdaptorLayer : function() {
		var layer = this.adaptor.createTileLayer(this);
		return layer;
	}
});
ATGis.SpetialQuery = function(adaptor, queryType, proxy) {
	this.adaptor = adaptor;
	this.queryType = queryType;
	proxy ? this.setProxy(proxy) : false;
	var scope = this;
	if (queryType === ATGis.SpetialQuery.POINT) {
		this.control = adaptor.addControl("PointQuery", {
			proxy : proxy,
			queryend : function() {
				scope.queryEnd.apply(scope, arguments);
			}
		});
	}
	if (queryType === ATGis.SpetialQuery.RECT) {
		this.control = adaptor.addControl("RectQuery", {
			proxy : proxy,
			queryend : function() {
				scope.queryEnd.apply(scope, arguments);
			}
		});
	}
	if (queryType === ATGis.SpetialQuery.POLYGON) {
		this.control = adaptor.addControl("PolygonQuery", {
			proxy : proxy,
			queryend : function() {
				scope.queryEnd.apply(scope, arguments);
			}
		});
	}
}
ATGis.SpetialQuery.prototype = {
	proxy : null,
	queryType : null,
	url : null,
	querybox : null,
	adaptor : null,
	control : null,
	setProxy : function(proxy) {
		this.proxy = proxy;
	},
	getQueryBbox : function() {
		return this.querybox;
	},
	setQueryBbox : function(bounds) {
		this.querybox = bounds
	},
	queryEnd : function(ret) {
	},
	getQueryURL : function() {
		var url = this.url;
		if (this.proxy) {
			url = this.proxy + "?url=" + escape(url);
		}
		return url;
	}
};
ATGis.SpetialQuery.POINT = "point";
ATGis.SpetialQuery.RECT = "rect";
ATGis.SpetialQuery.POLYGON = "polygon";
ATGis.FileLayer = function(name, url, options) {
	ATGis.Layer.call(this, name, url, options);
}
ATGis.FileLayer.prototype = Object.create ? Object
		.create(ATGis.Layer.prototype) : ATGis
		.extend({}, ATGis.Layer.prototype);
ATGis.extend(ATGis.FileLayer.prototype, {
	constructor : ATGis.FileLayer,
	type : "FileLayer",
	_createAdaptorLayer : function() {
		var layer = this.adaptor.createFileLayer(this);
		return layer;
	}
});
ATGis.RouteAnalysis = function(adaptor, server, proxy, startIcon, endIcon) {
	this.adaptor = adaptor;
	this.proxy = proxy;
	this.server = server;
	this.startIcon = startIcon;
	this.endIcon = endIcon;
	var scope = this;
	this.route = adaptor.addControl("RouteAnalysis", {
		proxy : proxy,
		server : server,
		startIcon : startIcon,
		endIcon : endIcon,
		queryend : function() {
			scope.queryEnd.apply(scope, arguments);
		}
	});
}
ATGis.RouteAnalysis.prototype = {
	porxy : null,
	server : null,
	adaptor : null,
	setProxy : function(proxy) {
		this.proxy = proxy;
	},
	queryEnd : function(features) {
	},
	destroy : function() {
		this.route.deactivate();
		this.adaptor.removeControl(this.route);
	}
};
ATGis.BufferAnalysis2 = function(adaptor, server, radius, proxy) {
	this.adaptor = adaptor;
	this.server = server;
	this.proxy = proxy;
	this.radius = radius;
	var scope = this;
	var buffer = adaptor.addControl("BufferAnalysis2", {
		server : server,
		proxy : proxy,
		radius : radius,
		queryend : function() {
			scope.queryEnd.apply(scope, arguments);
		}
	});
}
ATGis.BufferAnalysis2.prototype = {
	setRadius : function(radius) {
		this.radius = radius;
	},
	getRadius : function() {
		return this.radius;
	}
};
ATGis.Buffer = function(options) {
	this._init(options);
}
ATGis.Buffer.prototype = {
	server : null,
	geometry : null,
	distance : null,
	type : ATGis.Buffer.OUTSIDE,
	dataType : "json",
	format : "json",
	success : null,
	error : null,
	vectorLayer : null,
	_init : function(options) {
		ATGis.extend(this, options);
		if (!this.server) {
			throw "服务地址没有设置 new ATGis.Buffer({server: '', geometry: '', distance: 100, type: '',success:'', error: ''})";
		}
		if (!this.geometry) {
			throw "缓冲空间对象没有设置 new ATGis.Buffer({server: '', geometry: '', distance: 100, type: '',success:'', error: ''})";
		}
		if (!this.distance) {
			throw "缓冲距离没有设置 new ATGis.Buffer({server: '', geometry: '', distance: 100, type: '',success:'', error: ''})";
		}
		this.doExecute();
	},
	doExecute : function() {
		var scope = this;
		var params = {
			geometry : this.geometry,
			distance : this.distance
		};
		$.ajax({
			url : this.server,
			type : "POST",
			dataType : this.dataType,
			async : true,
			data : params,
			success : function(data) {
				scope._parseData(data);
				if (scope.vectorLayer
						&& scope.vectorLayer instanceof ATGis.VectorLayer) {
					scope.vectorLayer.add(scope.data.features);
				}
				if (scope.success) {
					scope.success(scope.data);
				}
			},
			error : function(err) {
				if (scope.error) {
					scope.error(err);
				}
			}
		});
	},
	_parseData : function(data) {
		if (this.format == "json") {
			if (typeof (data) == 'string') {
				this.data = ATGis.JSON.parse(data);
			} else {
				this.data = data;
			}
		}
		if (this.format == "xml") {
			this._parseXML(data);
		}
	},
	_parseXML : function(data) {
		var xml = $(data);
		var root = xml;
		if (xml[0].nodeType == 8) {
			root = xml.eq(1);
		}
		if (xml[0].nodeType == 9) {
			root = xml.children();
		}
		if (root.attr("success") === ATGis.Buffer.SUCCESS) {
			this.data = {
				"success" : true,
				features : []
			};
			var featurenodes = root.find("feature");
			var scope = this;
			featurenodes.each(function() {
				var feature = {};
				scope._parseFeature(this, feature);
				scope.data.features.push(feature);
			});
		}
	},
	_parseFeature : function(node, feature) {
		var attributesnode = $(node).children("attributes");
		var geometrynode = $(node).children("geometry");
		var geometry = geometrynode[0].firstChild ? geometrynode[0].firstChild.nodeValue
				: null;
		feature.attributes = {};
		feature.geometry = geometry;
		attributesnode.children().each(function() {
			var key = this.tagName;
			var value = this.firstChild ? this.firstChild.nodeValue : null;
			feature.attributes[key] = value;
		});
	},
	getDistance : function() {
		return this.distance;
	}
};
ATGis.Buffer.INSET = "inset";
ATGis.Buffer.OUTSIDE = "outside";
ATGis.Buffer.SUCCESS = "true";
ATGis.WMSLayer = function(name, url, params, options) {
	ATGis.Layer.call(this);
	var settings = ATGis.extend({}, this.defaultOptions);
	settings = ATGis.extend(settings, options);
	this._init(name, url, settings);
	var pa = ATGis.extend({}, this.defaultParams);
	pa = ATGis.extend(pa, params);
	this.params = pa;
}
ATGis.WMSLayer.prototype = Object.create ? Object.create(ATGis.Layer.prototype)
		: ATGis.extend({}, ATGis.Layer.prototype);
ATGis.extend(ATGis.WMSLayer.prototype, {
	constructor : ATGis.WMSLayer,
	defaultOptions : {
		isBaseLayer : false,
		transitionEffect : 'resize'
	},
	defaultParams : {
		transparent : true
	},
	type : "WMSLayer",
	params : null,
	_createAdaptorLayer : function() {
		var layer = this.adaptor.createWMSLayer(this);
		return layer;
	},
	reLoad : function(params) {
		this.adaptor.reLoadLayer(this, params);
	}
});
ATGis.CEarthAdaptor = function(id, options) {
	ATGis.Adaptor.call(this);
	this._init(id, options);
};
ATGis.CEarthAdaptor.prototype = Object.create ? Object
		.create(ATGis.Adaptor.prototype) : ATGis.extend({},
		ATGis.Adaptor.prototype);
ATGis.extend(ATGis.CEarthAdaptor.prototype,
		{
			constructor : ATGis.CEarthAdaptor,
			adaptorType : "CEarth",
			world : null,
			atgis : null,
			controlpanel : null,
			init : function() {
				if (this.options && this.options.tileSize) {
					this.setTileSize(this.options.tileSize);
					delete this.options.tileSize;
				}
				this.world = new CEarth.World(this.id, this.options);
				var stars = new CEarth.Stars(this.world);
				this.atgis.loadend();
			},
			setGis : function(atgis) {
				this.atgis = atgis;
			},
			setTileSize : function(size) {
				CEarth.World.TILE_WIDTH = size;
				CEarth.World.TILE_HEIGHT = size;
			},
			zoomIn : function() {
				this.world.zoomIn();
			},
			zoomOut : function() {
				this.world.zoomOut();
			},
			zoomTo : function(zoom) {
				this.world.zoomTo(zoom);
			},
			zoomToExtent : function(extent) {
				this.world.zoomToExtent(extent);
			},
			goTo : function(position, dis) {
				this.centerAt(position, dis);
			},
			panLeft : function() {
			},
			panBottom : function() {
			},
			panRight : function() {
			},
			panTop : function() {
			},
			centerAt : function(position, dis) {
				this.world.flyTo(new CEarth.Position(position.x, position.y,
						position.z, dis));
			},
			centerZoom : function(position, zoom) {
			},
			setCenter : function(position) {
			},
			getCenter : function() {
				var p = this.world.getCenter();
				return new ATGis.Position(p.lon, p.lat, p.alt);
			},
			getZoom : function() {
				return this.world.getZoom();
			},
			getMaxZoom : function() {
				return this.world.maxZoom;
			},
			getMinZoom : function() {
				return this.world.minZoom;
			},
			getExtent : function() {
			},
			getPositionByPoint : function(point) {
				return this.world.getPositionByPoint(point);
			},
			getPointByPosition : function(position) {
				return this.world.getWorldPointByPosition(new CEarth.Position(
						position.x, position.y, position.z));
			},
			update : function() {
				this.world.draw();
			},
			enableMouseWheelZoom : function() {
				this.world.control.userZoom = true;
			},
			disableMouseWheelZoom : function() {
				this.world.control.userZoom = false;
			},
			addLayer : function(layer) {
				layer.setAdaptor(this);
				this.world.addLayer(layer.adaptorLayer);
				if (this.atgis.layeradded) {
					this.atgis.layeradded(layer);
				}
			},
			addLayers : function(layers) {
				for ( var i in layers) {
					var layer = layers[i];
					this.addLayer(layer);
				}
			},
			removeLayer : function(layer) {
				this.world.removeLayer(layer.adaptorLayer);
				if (this.atgis.layerremoved) {
					this.atgis.layerremoved(layer);
				}
			},
			createTileLayer : function(layer) {
				return layer;
			},
			createWMSLayer : function(layer) {
				var wmslayer = new CEarth.WMSLayer(layer.name, layer.url,
						layer.options);
				wmslayer.spetialQueryable = layer.spetialQueryable;
				wmslayer.restIDs = layer.restIDs;
				return wmslayer;
			},
			createPOILayer : function(layer) {
				var markers = new CEarth.Markers(layer.name, layer.options);
				return markers;
			},
			createVectorLayer : function(layer) {
				return null;
			},
			createFileLayer : function(layer) {
				return null;
			},
			addControl : function(control, options, align) {
				return null;
			},
			removeControl : function(control) {
			},
			getControl : function(name) {
				return null;
			},
			createFeatureByWKT : function(wkt) {
				return fs;
			},
			addEventListener : function(type, obj, cback) {
				obj.events.on(type, cback);
			},
			removeEventListener : function(type, obj, cback) {
				obj.events.un(type, cback);
			}
		});
ATGis.Measure = function(adaptor, measuretype) {
	this.adaptor = adaptor;
	this.measuretype = measuretype;
	var self = this;
	if (this.measuretype === ATGis.Measure.DISTANCE) {
		var dis = this.adaptor.addControl("MeasureDistance");
		this.control = dis;
		if (dis) {
			dis.mesureend = function(ret, units, geom) {
				self.setLength(ret);
				self.units = units;
				self.measureEnd.apply(self, arguments);
			}
		}
	}
	if (this.measuretype === ATGis.Measure.AREA) {
		var area = this.adaptor.addControl("MeasureArea");
		this.control = area;
		if (area) {
			area.mesureend = function(ret, units, geom) {
				self.setArea(ret);
				self.units = units;
				self.measureEnd.apply(self, arguments);
			}
		}
	}
}
ATGis.Measure.prototype = {
	length : null,
	units : null,
	area : null,
	measuretype : null,
	onTerrain : false,
	getLength : function() {
		return this.length;
	},
	setLength : function(length) {
		this.length = length;
	},
	getArea : function() {
		return this.area;
	},
	setArea : function(area) {
		this.area = area;
	},
	setOnTerrain : function(flag) {
		this.onTerrain = flag;
	},
	getOnTerrain : function() {
		return this.onTerrain;
	},
	measureEnd : function(ret) {
	}
}
ATGis.Measure.DISTANCE = "distance";
ATGis.Measure.AREA = "area";
ATGis.History = {
	history : [],
	pointer : -1,
	atgis : null,
	add : function(extent) {
		if (this.pointer >= 0) {
			this.history = this.history.slice(0, this.pointer + 1);
		}
		this.history.push(extent);
		this.pointer++;
	},
	back : function() {
		if (this.pointer <= 0) {
			return null;
		}
		this.pointer--;
		var extent = this.history[this.pointer];
		if (this.atgis) {
			this.atgis.zoomToExtent(extent, true);
		}
		return extent;
	},
	forword : function() {
		if (this.pointer >= this.history.length - 1) {
			return null;
		}
		this.pointer++;
		var extent = this.history[this.pointer];
		if (this.atgis) {
			this.atgis.zoomToExtent(extent, true);
		}
		return extent;
	}
};
ATGis.BufferAnalysis = function(adaptor, options) {
	this.adaptor = adaptor;
	this._init(options);
}
ATGis.BufferAnalysis.prototype = {
	server : null,
	distance : null,
	vectorLayer : null,
	type : ATGis.BufferAnalysis.POINT,
	persist : false,
	_init : function(options) {
		ATGis.extend(this, options);
		if (!options.server) {
			throw "缺少参数server，new ATGis.BufferAnalysis(adaptor,{server: '',distance:''})"
		}
		if (!options.distance) {
			throw "缺少参数distance，new ATGis.BufferAnalysis(adaptor,{server: '',distance:''})"
		}
		var scope = this;
		var controlname;
		if (this.type == ATGis.BufferAnalysis.POINT) {
			controlname = "BufferPointAnalysis";
		}
		if (this.type == ATGis.BufferAnalysis.LINE) {
			controlname = "BufferLineAnalysis";
		}
		if (this.type == ATGis.BufferAnalysis.POLYGON) {
			controlname = "BufferPolygonAnalysis";
		}
		var buffer = this.adaptor.addControl(controlname, {
			queryend : function(wkt) {
				if (scope.persist) {
					scope.vectorLayer.addWKT(wkt);
				}
				var buffer = new ATGis.Buffer({
					server : scope.server,
					geometry : wkt,
					distance : scope.distance,
					dataType : "JSONP",
					format : "json",
					vectorLayer : scope.vectorLayer,
					success : function() {
						if (scope.queryEnd) {
							scope.queryEnd(buffer);
						}
					},
					error : function() {
					}
				});
			},
			layer : scope.vectorLayer.adaptorLayer
		});
		this.control = buffer;
	},
	setDistance : function(distance) {
		this.distance = distance;
	},
	getDistance : function() {
		return this.distance;
	},
	queryEnd : function(bf) {
	}
};
ATGis.BufferAnalysis.POINT = "point";
ATGis.BufferAnalysis.LINE = "line";
ATGis.BufferAnalysis.POLYGON = "polygon";