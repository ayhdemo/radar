/*

  ATGis.js -- AT21 century MapGis Framework

  Copyright (c) 2013 by AT21 century Contributors
 */ATGis.DS = function(url, atgis, options, cback) {
	this._init(url, atgis, options, cback);
}
ATGis.DS.prototype = {
	url : null,
	data : null,
	atgis : null,
	layers : null,
	type : "xml",
	async : true,
	_init : function(url, atgis, options, cback) {
		this.url = url;
		if (typeof (atgis) == 'function') {
			cback = atgis;
			atgis = null;
		}
		if (typeof (options) == 'function') {
			cback = options;
			options = null;
		}
		this.atgis = atgis;
		ATGis.extend(this, options);
		this.layers = [];
		this._query(cback);
	},
	_query : function(cback) {
		var scope = this;
		ATGis.DS.get(this.url, this.type, this.async, function(data) {
			scope.data = data;
			scope.createLayers();
			if (scope.atgis) {
				if (!scope.atgis.layers || scope.atgis.layers.length == 0) {
					scope.layers[0].options.isBaseLayer = true;
				}
				scope.atgis.addLayers(scope.layers);
			}
			cback ? cback(scope) : false;
		});
	},
	createLayers : function() {
		for ( var i in this.data) {
			var layerdata = this.data[i];
			var layer = this.createLayer(layerdata);
			if (layer) {
				layer.legend = layerdata.legend;
				layer.legend ? layer.legend.layer = layer : false;
				this.layers.push(layer);
			}
		}
	},
	createLayer : function(layerdata) {
	},
	getLayers : function() {
		return this.layers;
	}
};
ATGis.DS.SUCCESS = "success";
ATGis.DS.TAGTILELAYER = "tilelayer";
ATGis.DS.TAGWMSLAYER = "wmslayer";
ATGis.DS.TAGPOILAYER = "poilayer";
ATGis.DS.getTimes = function(url, cback, type) {
	type = type || "xml";
	var times;
	$.ajax({
		type : "GET",
		url : url,
		dataType : type,
		async : false,
		success : function(xml) {
			var root = ATGis.DS.getXMLRoot(xml);
			var items = root.find("time");
			if (items.length) {
				times = [];
				items.each(function() {
					var time = {};
					ATGis.DS._parseAttribute(time, this);
					time["time"] = this.firstChild.nodeValue;
					times.push(time);
				});
				if (cback) {
					cback(times);
				}
			}
		}
	});
	return times;
}
ATGis.DS.getXMLRoot = function(xml) {
	if (typeof xml == "string") {
		if ($.browser.msie && $.browser.version < 10) {
			var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc["loadXML"](xml);
			xml = $(xmlDoc);
		} else {
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(xml, "text/xml");
			xml = $(xmlDoc);
		}
	} else {
		xml = $(xml);
	}
	var root = xml;
	if (xml[0].nodeType == 9) {
		root = xml.children();
	} else if (xml[0].nodeType == 8) {
		root = xml.eq(1);
	}
	return root;
}
ATGis.DS.get = function(url, type, async, cback) {
	type = type || "xml";
	async = (async == undefined || async == null) ? true : async;
	$.ajax({
		type : "GET",
		url : url,
		dataType : type,
		async : async,
		success : function(xml) {
			var root = ATGis.DS.getXMLRoot(xml);
			var ret = ATGis.DS.parse(root);
			cback ? cback(ret) : false;
		}
	});
}
ATGis.DS.parse = function(root) {
	if (root.attr("flag") === ATGis.DS.SUCCESS) {
		var items = root.children("item").children();
		var rets = [];
		items.each(function() {
			var layernode = this;
			var tagname = layernode.tagName.toLowerCase();
			if (tagname == ATGis.DS.TAGTILELAYER) {
				var obj = {
					layertype : ATGis.DS.TAGTILELAYER
				};
				ATGis.DS._parse(obj, $(layernode));
				rets.push(obj);
			} else if (tagname == ATGis.DS.TAGWMSLAYER) {
				var obj = {
					layertype : ATGis.DS.TAGWMSLAYER
				};
				ATGis.DS._parse(obj, $(layernode));
				rets.push(obj);
			}
		});
		var poi = ATGis.DS._parsePOI(root);
		if (poi) {
			poi.layertype = ATGis.DS.TAGPOILAYER;
			rets.push(poi);
		}
		return rets;
	}
	if (root.attr("success") === "true") {
		var tables = root.find("table");
		var rets = [];
		tables.each(function() {
			var layernode = this;
			var poi = ATGis.DS._parsePOI($(layernode));
			if (poi) {
				poi.layertype = ATGis.DS.TAGPOILAYER;
				rets.push(poi);
			}
		});
		return rets;
	}
	return null;
}
ATGis.DS._parse = function(obj, layernode) {
	layernode.children()
			.each(
					function() {
						var property = this.tagName.toLowerCase();
						var value = null;
						if (!$(this).children().length) {
							value = this.firstChild ? this.firstChild.nodeValue
									: value;
						} else {
							if (property == "legend") {
								value = {};
								ATGis.DS._parseLegend(value, $(this), 1,
										layernode[0].tagName);
							} else {
								value = {};
								ATGis.DS._parse(value, $(this));
							}
						}
						obj[property] = obj[property] ? [].concat(
								obj[property], value) : value;
					});
}
ATGis.DS._parsePOI = function(root) {
	var recordsnode = root.children("records");
	if (recordsnode.length) {
		var metasnode = root.children("metas");
		var metas = {};
		if (metasnode.length) {
			ATGis.DS._parseAttribute(metas, metasnode[0]);
			metas.fields = [];
			metasnode.children("field").each(function() {
				var field = {};
				ATGis.DS._parseAttribute(field, this);
				metas.fields.push(field);
			});
		}
		var records = [];
		recordsnode.children("record").each(function() {
			var record = {};
			$(this).children("field").each(function() {
				var name = $(this).attr("id");
				var value = this.firstChild ? this.firstChild.nodeValue : null;
				if (value) {
					record[name] = value;
				}
			});
			records.push(record);
		});
		return {
			metas : metas,
			records : records
		};
	}
	return null;
}
ATGis.DS._parseAttribute = function(data, node) {
	for ( var i = 0; i < node.attributes.length; i++) {
		var attr = node.attributes[i];
		data[attr.name] = attr.value;
	}
}
ATGis.DS._parseLegend = function(legend, legendnode, level, layertype) {
	if (legendnode.children("legenditem").length) {
		legend.children = [];
	}
	legendnode.children("legenditem").each(function() {
		var item = {
			level : level,
			parent : legend,
			type : layertype
		};
		ATGis.DS._parseLegendItem(item, this, level, layertype);
		legend.children.push(item);
	});
	return legend;
}
ATGis.DS.legendID = 1;
ATGis.DS._parseLegendItem = function(obj, legenditem, level, layertype) {
	var namenode = $(legenditem).children("name")[0];
	var name = namenode.firstChild ? namenode.firstChild.nodeValue : null;
	var titlenode = $(legenditem).children("title")[0];
	var title = titlenode.firstChild ? titlenode.firstChild.nodeValue : null;
	var imgnode = $(legenditem).children("img")[0];
	var img = imgnode.firstChild ? imgnode.firstChild.nodeValue : null;
	obj.name = name;
	obj.title = title;
	obj.img = img;
	obj.text = title || "";
	obj.icon = img || "";
	obj.checked = 1;
	obj.id = "legend_" + ATGis.DS.legendID++;
	if ($(legenditem).children("legenditem").length) {
		obj.children = [];
	}
	$(legenditem).children("legenditem").each(function() {
		var item = {
			level : level + 1,
			parent : obj,
			type : layertype
		};
		ATGis.DS._parseLegendItem(item, this, level + 1);
		obj.children.push(item);
	});
}
ATGis.DS.Buffer = function(server, params) {
	var settings = {};
	this.vectorLayer = params.vectorLayer;
	params.vectorLayer ? delete params.vectorLayer : false;
	if (params.success) {
		this.success = params.success;
		delete params.success;
	}
	if (params.error) {
		this.error = params.error;
		delete params.error;
	}
	ATGis.extend(settings, this.defaultParams);
	ATGis.extend(settings, params);
	this._init(server, settings);
}
ATGis.DS.Buffer.prototype = {
	server : null,
	params : null,
	vectorLayer : null,
	_init : function(server, params) {
		this.server = server;
		this.params = params;
		this._query();
	},
	_query : function() {
		var geometry = this.params.geometry;
		var type = this.getGeometryType(geometry);
		var paramstr = ATGis.JSON.stringify(this.params);
		var url = this.server + paramstr;
		if (this.params.dataType === "JSONP") {
			url += "&callback=?";
		}
		var scope = this;
		var buffer = new ATGis.Buffer({
			server : url,
			geometry : geometry,
			distance : this.params.distance,
			dataType : this.params.dataType || "JSONP",
			format : this.params.format || "json",
			vectorLayer : this.vectorLayer,
			success : function() {
				if (scope.success) {
					scope.success(buffer);
				}
			},
			error : function() {
				if (scope.error) {
					scope.error();
				}
			}
		});
	},
	getGeometryType : function(geometry) {
		var typeStr = /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/;
		var matches = typeStr.exec(geometry);
		var type = null;
		if (matches) {
			var geomtype = matches[1].toLowerCase();
			switch (geomtype) {
			case "point": {
				type = ATGis.DS.Buffer.POINT;
				break;
			}
			case "linestring": {
				type = ATGis.DS.Buffer.LINE;
				break;
			}
			case "polygon": {
				type = ATGis.DS.Buffer.POLYGON;
				break;
			}
			}
		}
		return type;
	}
}
ATGis.DS.Buffer.POINT = "esriGeometryPoint";
ATGis.DS.Buffer.LINE = "esriGeometryPolyline";
ATGis.DS.Buffer.POLYGON = "esriGeometryPolygon";
ATGis.DS.SpecialQuery = function(server, options) {
	this._init(server, options);
};
ATGis.DS.SpecialQuery.prototype = {
	server : null,
	geometry : null,
	type : [],
	dataType : "xml",
	_init : function(server, options) {
		ATGis.extend(this, options);
		this.server = server;
	},
	query : function(params, cback) {
		$.ajax({
			type : "POST",
			url : this.server,
			data : params,
			dataType : this.dataType || "JSONP",
			success : function(data) {
				cback ? cback(data) : false;
			}
		});
	},
	queryEnd : function(data) {
	}
};
ATGis.DS.POI = function(url, atgis, options, cback) {
	ATGis.DS.call(this, url, atgis, options, cback);
}
ATGis.DS.POI.prototype = Object.create ? Object.create(ATGis.DS.prototype)
		: ATGis.extend({}, ATGis.DS.prototype);
ATGis.extend(ATGis.DS.POI.prototype, {
	constructor : ATGis.DS.POI,
	icon : null,
	align : "bottom_center",
	spetialQueryable : false,
	createLayer : function(layerdata) {
		if (layerdata.layertype === ATGis.DS.TAGPOILAYER) {
			var records = layerdata.records;
			var type = records[0]["type"] || records[0]["TYPE"];
			var data = {};
			this.icon = this.icon || "";
			data[type] = {
				icon : this.icon.replace("#{icon}", type),
				align : this.align,
				data : records
			}
			var poiLayer = new ATGis.POILayer(type, {
				data : data
			});
			layerdata.legend = {};
			layerdata.legend.children = [ {
				id : "legend_" + ATGis.DS.legendID++,
				checked : 1,
				name : type,
				title : type,
				img : (this.icon || "").replace("#{icon}", type),
				text : type || "",
				icon : (this.icon || "").replace("#{icon}", type),
				type : "poilayer",
				parent : layerdata.legend
			} ];
			poiLayer.spetialQueryable = this.spetialQueryable;
			poiLayer.serviceData = layerdata;
			ATGis.extend(poiLayer.options, this.options);
			return poiLayer;
		}
		return null;
	}
});
ATGis.DS.WMS = function(url, atgis, options, cback) {
	ATGis.DS.call(this, url, atgis, options, cback);
}
ATGis.DS.WMS.prototype = Object.create ? Object.create(ATGis.DS.prototype)
		: ATGis.extend({}, ATGis.DS.prototype);
ATGis.extend(ATGis.DS.WMS.prototype, {
	constructor : ATGis.DS.WMS,
	createLayer : function(layerdata) {
		if (layerdata.layertype === ATGis.DS.TAGWMSLAYER) {
			var layerparam = layerdata.layerparam;
			layerparam.layers = layerdata.layers;
			var params = {};
			for ( var i in layerdata) {
				if (i !== "name" && i !== "url" && i !== "layerparam"
						&& i !== "layers" && i !== "type") {
					params[i] = layerdata[i];
				}
			}
			params.restIDs = layerdata.restlayers;
			params.transitionEffect = layerparam.transitioneffect;
			var wmslayer = new ATGis.WMSLayer(layerdata.name, layerdata.url,
					layerparam, params);
			return wmslayer;
		}
		return null;
	}
});
ATGis.DS.Tile = function(url, atgis, options, cback) {
	ATGis.DS.call(this, url, atgis, options, cback);
}
ATGis.DS.Tile.prototype = Object.create ? Object.create(ATGis.DS.prototype)
		: ATGis.extend({}, ATGis.DS.prototype);
ATGis.extend(ATGis.DS.Tile.prototype, {
	constructor : ATGis.DS.Tile,
	createLayer : function(layerdata) {
		if (layerdata.layertype === ATGis.DS.TAGTILELAYER) {
			var params = {};
			params["name"] = layerdata["name"];
			params["type"] = layerdata["type"];
			params["pixel"] = layerdata["pixel"];
			params["zoomLevels"] = layerdata["levels"];
			params["imgFormat"] = layerdata["format"];
			params["legend"] = layerdata["legend"];
			var tilelayer = new ATGis.TileLayer(layerdata.title, layerdata.url,
					params);
			return tilelayer;
		}
		return null;
	}
});