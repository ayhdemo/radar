ol.Matrix = function () {
        this.mx = [1, 0, 0, 1, 0, 0];
    };

    ol.Matrix.prototype.rotate = function (r) {
        var cos = Math.cos(r),
            sin = Math.sin(r),
            mx = this.mx,
            a = mx[0] * cos + mx[2] * sin,
            b = mx[1] * cos + mx[3] * sin,
            c = -mx[0] * sin + mx[2] * cos,
            d = -mx[1] * sin + mx[3] * cos;
        this.mx[0] = a;
        this.mx[1] = b;
        this.mx[2] = c;
        this.mx[3] = d;
        return this;
    };

    ol.Matrix.prototype.translate = function (x, y) {
        this.mx[4] += this.mx[0] * x + this.mx[2] * y;
        this.mx[5] += this.mx[1] * x + this.mx[3] * y;
        return this;
    };
    ol.Matrix.prototype.scale = function (x, y) {
        this.mx[0] *= x;
        this.mx[1] *= x;
        this.mx[2] *= y;
        this.mx[3] *= y;
        return this;
    };

    ol.Matrix.prototype.skew = function (x, y) {
        var tanX = Math.tan(x),
            tanY = Math.tan(y),
            mx0 = this.mx[0],
            mx1 = this.mx[1];
        this.mx[0] += tanY * this.mx[2];
        this.mx[1] += tanY * this.mx[3];
        this.mx[2] += tanX * mx0;
        this.mx[3] += tanX * mx1;
        return this;
    };

    /**
 * @classdesc
 * A layer source for displaying a single, static image.
 *
 * @constructor
 * @extends {ol.source.Image}
 * @param {olx.source.ImageStaticOptions} options Options.
 * @api stable
 */
ol.source.ImageTransform = function (options) {
    var imageExtent = options.imageExtent;

    this.targetPolygon_ = options.targetPolygon;
    this.direction_ = options.direction || ol.source.ImageTransform.DIRECTION.RIGHT_UP;

    var crossOrigin = options.crossOrigin !== undefined ? options.crossOrigin : null;

    var /** @type {ol.ImageLoadFunctionType} */imageLoadFunction = options.imageLoadFunction !== undefined ? options.imageLoadFunction : ol.source.Image.defaultImageLoadFunction;

	ol.source.Image.call(this, {
	    attributions: options.attributions,
	    logo: options.logo,
	    projection: ol.proj.get(options.projection)
	});

	/**
	 * @private
	 * @type {ol.Image}
	 */
	this.image_ = new ol.Image(imageExtent, undefined, 1, this.getAttributions(), options.url, crossOrigin, imageLoadFunction);
	       
	/**
	 * @private
	 * @type {ol.Size}
	 */
    this.imageSize_ = options.imageSize ? options.imageSize : null;

    ol.events.listen(this.image_, ol.events.EventType.CHANGE, this.handleImageChange, this);
};
ol.inherits(ol.source.ImageTransform, ol.source.Image);

/**
 * @inheritDoc
 */
ol.source.ImageTransform.prototype.getImageInternal = function (extent, resolution, pixelRatio, projection) {
    if (ol.extent.intersects(extent, this.image_.getExtent())) {
        return this.image_;
    }
    return null;
};

/**
 * @inheritDoc
 */
ol.source.ImageTransform.prototype.handleImageChange = function (evt) {
    if (this.image_.getState() == ol.ImageState.LOADED) {   //ol3.19  ol.Image.State.LOADED
        var imageExtent = this.image_.getExtent();
        var image = this.image_.getImage();
        var imageWidth, imageHeight;
        if (this.imageSize_) {
            imageWidth = this.imageSize_[0];
            imageHeight = this.imageSize_[1];
        } else {
            // TODO: remove the type cast when a closure-compiler > 20160315 is used.
        // see: https://github.com/google/closure-compiler/pull/1664
        imageWidth = /** @type {number} */image.width;
        imageHeight = /** @type {number} */image.height;
        }

        var resolution = ol.extent.getHeight(imageExtent) / imageHeight;
        var targetWidth = Math.ceil(ol.extent.getWidth(imageExtent) / resolution);
        if (targetWidth != imageWidth) {
            var context = ol.dom.createCanvasContext2D(targetWidth, imageHeight);
            var canvas = context.canvas;

            var tf = this.calculateTransform();
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(tf.rotate);
            context.scale(tf.scale[0], tf.scale[1]);
            var matrix = new ol.Matrix();
            matrix.skew(tf.skewx, 0);
            context.transform.apply(context, matrix.mx);
            context.drawImage(image, 0, 0, imageWidth, imageHeight, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

            this.image_.setImage(canvas);
        }
    }
    ol.source.Image.prototype.handleImageChange.call(this, evt);
};

ol.source.ImageTransform.prototype.calculateTransform = function () {
    var theta = this.getRotate();
    var scaley = this.getScaleY(theta);
    var scalex = this.getScaleX(theta);
    var skew = this.getSkew();
    return {
        rotate: theta,
        scale: [scalex, scaley],
        skewx: skew
    };
};

ol.source.ImageTransform.prototype.getSkew = function () {
    var top = this.getTopPoint();
    var left = this.getLeftPoint();
    var right = this.getRightPoint();
    left = ol.proj.transform(left, this.getProjection(), "EPSG:4326");
right = ol.proj.transform(right, this.getProjection(), "EPSG:4326");
top = ol.proj.transform(top, this.getProjection(), "EPSG:4326");

    var a = this.distance(top, left);
    var b = this.distance(top, right);
    var c = this.distance(left, right);

    var theta = Math.acos((a * a + b * b - c * c) / 2 / a / b);
    return theta - Math.PI / 2;
};

ol.source.ImageTransform.prototype.getRotate = function () {
    var left = this.getLeftPoint();
    var bottom = this.getBottomPoint();
    left = ol.proj.transform(left, this.getProjection(), "EPSG:4326");
bottom = ol.proj.transform(bottom, this.getProjection(), "EPSG:4326");

    var dx = this.distance(bottom, [left[0], bottom[1]]);
    var dy = this.distance([left[0], bottom[1]], left);

    var theta = Math.atan(dy / dx);

    if (this.direction_ == ol.source.ImageTransform.DIRECTION.LEFT_UP) {
        return Math.PI / 2 - theta;
    }

    return theta;
};

ol.source.ImageTransform.prototype.getScaleY = function (rotate) {
    var image = this.image_.getImage();
    var w = image.width;
    var h = image.height;
    var r = Math.sqrt(w * w + h * h);

    var theta = Math.atan(w / h);
    theta -= rotate;

    var H = r * Math.cos(theta);

    if (h > H) {
        return H / h;
    } else {
        return h / H;
    }
};

ol.source.ImageTransform.prototype.getScaleX = function (rotate) {
    var image = this.image_.getImage();
    var w = image.width;
    var h = image.height;
    var r = Math.sqrt(w * w + h * h);

    var theta = Math.atan(h / w);
    theta -= rotate;

    var W = r * Math.cos(theta);

    if (w > W) {
        return W / w;
    } else {
        return w / W;
    }
};

ol.source.ImageTransform.prototype.getMaxPoint = function (index) {
    var poly = this.targetPolygon_;
    var coords = poly.getCoordinates();
    var max = 0,
        point;
    coords[0].forEach(function (coord) {
        if (coord[index] > max) {
            max = coord[index];
            point = coord;
        }
    });

    return point;
};

ol.source.ImageTransform.prototype.getMinPoint = function (index) {
    var poly = this.targetPolygon_;
    var coords = poly.getCoordinates();
    var min = Number.MAX_SAFE_INTEGER,
        point;
    coords[0].forEach(function (coord) {
        if (coord[index] < min) {
            min = coord[index];
            point = coord;
        }
    });

    return point;
};

ol.source.ImageTransform.prototype.getTopPoint = function () {
    return this.getMaxPoint(1);
};

ol.source.ImageTransform.prototype.getRightPoint = function () {
    return this.getMaxPoint(0);
};

ol.source.ImageTransform.prototype.getLeftPoint = function () {
    return this.getMinPoint(0);
};

ol.source.ImageTransform.prototype.getBottomPoint = function () {
    return this.getMinPoint(1);
};

ol.source.ImageTransform.prototype.distance = function (sp, tp) {
    var lat = [sp[1], tp[1]];
    var lng = [sp[0], tp[0]];
    var R = 6378137;
    var dLat = (lat[1] - lat[0]) * Math.PI / 180;
    var dLng = (lng[1] - lng[0]) * Math.PI / 180;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d);
};

ol.source.ImageTransform.DIRECTION = {};
/**
 * @const
 * @type {string}
 */
ol.source.ImageTransform.DIRECTION.LEFT_UP = "left_up";
/**
 * @const
 * @type {string}
 */
ol.source.ImageTransform.DIRECTION.RIGHT_UP = "right_up";