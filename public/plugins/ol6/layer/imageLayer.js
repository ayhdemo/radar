ol.layer.CollectionLayer = function (options) {
        ol.layer.Layer.call(this, options || {});

        this.images = [];
        this.images_map = {};
        this.projection = options.projection;
        this.direction = options.direction;
    };
ol.inherits(ol.layer.CollectionLayer, ol.layer.Layer);

function reWriteMapRenderer() {
    var fun = ol.renderer.canvas.Map.prototype.createLayerRenderer;
    ol.renderer.canvas.Map.prototype.createLayerRenderer = function (layer) {
        if (ol.ENABLE_IMAGE && layer instanceof ol.layer.Image) {
            return new ol.renderer.canvas.ImageLayer(layer);
        } else if (ol.ENABLE_TILE && layer instanceof ol.layer.Tile) {
            return new ol.renderer.canvas.TileLayer(layer);
        } else if (ol.ENABLE_VECTOR_TILE && layer instanceof ol.layer.VectorTile) {
            return new ol.renderer.canvas.VectorTileLayer(layer);
        } else if (ol.ENABLE_VECTOR && layer instanceof ol.layer.Vector) {
            return new ol.renderer.canvas.VectorLayer(layer);
        } else if (ol.ENABLE_IMAGE && layer instanceof ol.layer.CollectionLayer) {
            return new ol.renderer.canvas.Layer(layer);
        } else {
            ol.DEBUG && console.assert(false, 'unexpected layer configuration');
            return null;
        }
    };
}
reWriteMapRenderer();

ol.layer.CollectionLayer.prototype.addLayers = function (images) {
    if (images instanceof ol.source.Image) {
        this.addImagesBySource(images);
    } else if (images instanceof ol.layer.Image) {
        this.addImagesByLayers(images);
    } else {
        this.addImages(images);
    }
};

ol.layer.CollectionLayer.prototype.addImages = function (options) {
    var sources = options.map(function (option) {
        return new ol.source.ImageTransform({
            url: option.url,
            crossOrigin: '',
            projection: this.projection,
            imageExtent: option.imageExtent,
            targetPolygon: option.targetPolygon,
            direction: this.direction
        });
    }, this);

    this.addImagesBySopurce(sources);
};

ol.layer.CollectionLayer.prototype.addImagesBySopurce = function (sources) {
    var layers = sources.map(function (source) {
        return new ol.layer.Image({
            source: source
        });
    });
    this.addImagesByLayers(layers);
};

ol.layer.CollectionLayer.prototype.addImagesByLayers = function (layers) {
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        this.add(layer);
    }
};

ol.layer.CollectionLayer.prototype.add = function (image) {
    this.get("map").addLayer(image);
    var uid = ol.getUid(image);
    this.images.push(image);
    this.images_map[uid] = image;
};

ol.layer.CollectionLayer.prototype.del = function (image) {
    this.get("map").removeLayer(image);
    var uid = ol.getUid(image);
    this.images.push(image);
    for (var i in this.images) {
        if (this.images[i] == image) {
            this.images.splice(i, 1);
        }
    }
    delete this.images_map[uid];
};

ol.layer.CollectionLayer.prototype.clear = function () {
    for (var i in this.images) {
        this.get("map").removeLayer(this.images[i]);
    }
};

ol.layer.CollectionLayer.prototype.setVisible = function (visible) {
    for (var i in this.images) {
        this.images[i].setVisible(visible);
    }
};

ol.layer.CollectionLayer.prototype.setOpacity = function (opacity) {
    for (var i in this.images) {
        this.images[i].setOpacity(opacity);
    }
};