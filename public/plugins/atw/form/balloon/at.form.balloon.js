(function(atw){
	/**
	 * 气泡组件
	 * <pre>jQuery("#balloon").Balloon({
	skin: "cloud",
	title: "标题",
	content: {url: "content.html"},
	hasshadow: true,
	width: 500,
	height: 300
});
</pre>
	 * @module Control
	 * @class ATW.Balloon
	 * @extends ATW.Control
	 * @author cqb
	 * @version 2.1
	 */
	atw.extendClass("Balloon",atw.Control,{
		/**
         * 气泡圆角数组如：radius[5,5,5,5]
         * @type {Array}
         * @property radius
         */
		radius: null,
		/**
         * 是否有阴影
         * @type {Boolean}
         * @property hasshadow
         */
		hasshadow: false,
		/**
         * 气泡阴影参数:<br>
         * color: 阴影颜色<br>
         * opacity： 阴影透明度<br>
         * offsetx：阴影x轴偏移量<br>
         * offsety：阴影y轴偏移量<br>
         * blur：阴影淡化系数<br>
         * @type {JSON}
         * @property shadow
         */
		shadow: {
			color: '#999',
			opacity: 1,
			offsetx: 3,
			offsety: 3,
			blur: 3
		},
		/**
		 * 边框粗细
		 * @type {Number}
		 * @default 5
		 * @property borderWidth
		 */
		borderWidth: 5,
		/**
		 * 边框颜色
		 * @type {String}
		 * @default #000
		 * @property borderColor
		 */
		borderColor: '#000',
		/**
		 * 边框透明度
		 * @type {Number}
		 * @property borderopacity
		 */
		borderopacity: 1,
		/**
		 * 箭头宽度
		 * @type {Number}
		 * @default 15
		 * @property spikew
		 */
		spikew: 15,
		/**
		 * 箭头高度
		 * @type {Number}
		 * @default 10
		 * @property spikeh
		 */
		spikeh: 10,
		/**
		 * 箭头偏移量系数(0-1)
		 * @type {Number}
		 * @default 0.5
		 * @property spikeratio
		 */
		spikeratio: 0.5,
		/**
		 * 箭头偏移量
		 * @type {Object}
		 * @property spikeoffset
		 */
		spikeoffset: 0,
		/**
		 * 气泡宽度
		 * @type {Number}
		 * @default 200
		 * @property width
		 */
		width: 200,
		/**
		 * 气泡高度
		 * @type {Number}
		 * @default 100
		 * @property height
		 */
		height: 100,
		/**
		 * 气泡背景
		 * color: 背景颜色
		 * 			为String#xxxxxx;
		 * 			为数组[{position: 0, color: '#f6fbfd'},{position: 1, color: '#f6fbfd'}]
		 * opacity：背景透明度
		 * @type {Object}
		 * @property background
		 */
		background: {
      		color: [
	        { position: 0, color: '#f6fbfd'},
	        { position: 0.1, color: '#fff' },
	        { position: .48, color: '#fff'},
	        { position: .5, color: '#fefffe'},
	        { position: .52, color: '#f7fbf9'},
	        { position: .8, color: '#edeff0' },
	        { position: 1, color: '#e2edf4' }
      		],
      		opacity: 1
    	},
		/**
		 * 气泡填充样式
		 * @type {String/Object}
		 * @property fillstyle
		 */
    	fillstyle: null,
		/**
		 * 气泡淡出时间
		 * @type {Number}
		 * @default 500
		 * @property fadeIn
		 */
    	fadeIn: 500,
		/**
		 * 气泡淡入时间
		 * @type {Number}
		 * @default 700
		 * @property fadeOut
		 */
   		fadeOut: 700,
		/**
		 * 气泡标题
		 * @type {String}
		 * @property title
		 */
    	title: '标题',
		/**
		 * 气泡内容
		 * @type {String}
		 * @property content
		 */
    	content: '',
		/**
		 * 画布页面元素
		 * @type {DOM}
		 * @property canvasdom
		 */
    	canvasdom: null,
		/**
		 * 画布上下文
		 * @type {Object}
		 * @property ctx
		 */
    	ctx: null,
		/**
		 * 画布开始绘制的x横向位置
		 * @type {Number}
		 * @property x
		 */
    	x: 2,
		/**
		 * 画布开始绘制的y纵向位置
		 * @type {Number}
		 * @property y
		 */
    	y: 2,
		/**
		 * 画布绘制的长度
		 * @type {Number}
		 * @property draww
		 */
    	draww: null,
		/**
		 * 画布绘制的宽度
		 * @type {Number}
		 * @property drawh
		 */
    	drawh: null,
		/**
		 * 气泡容器
		 * @type {DOM}
		 * @property balloonwrap
		 */
    	balloonwrap: null,
		/**
		 * 气泡的状态 
		 * true：显示
		 * false：隐藏
		 * @type {Boolean}
		 * @property state
		 */
    	state: true,
		/**
		 * 气泡的皮肤
		 * 目前有10中默认的皮肤black/cloud/dark/facebook/lavender/lime/liquid/blue/salmon/yellow
		 * @type {String}
		 * @property skin
		 */
    	skin: 'base',
    	
		/**
         * 设置参数信息
         * @constructor
         * @param options {Object} 参数
         */
        initialize : function(options){
        	this._getSkin(options);
        	atw.Control.prototype.initialize.apply(this,arguments);
        	
        	//渲染
        	this._render();
        },
        
        /**
         * 获取皮肤设置
         * @private
         * @param {Object} options 参数
         * @method _getSkin
         */
        _getSkin: function(options){
        	if(options.skin && options.skin != ""){
	        	var skin = atw.Balloon.Skins[options.skin];
	        	jQuery.extend(this, skin);
        	}
        },
        
        /**
         * 渲染气泡
         * @private
         * @method _render
         */
        _render: function(){
        	//气泡内容
        	this._renderBalloonContent();
        	jQuery(this.canvasdom).width(this.width).height(this.height);
        	this.canvasdom.width = this.width;
        	this.canvasdom.height = this.height;
        	this.balloonwrap.width(this.width).height(this.height);
        	
        	//初始化Canvas
        	this._initCanvas();
        	//绘制气泡
        	this._drawBalloon();
        	//添加标题
        	this.setTitle(this.title);
        	//气泡内容
        	this.setContent(this.content);
        	//气泡大小
        	this._renderBalloonDimensions();
        	//事件监听
        	this.addListeners();
        },
        
        /**
         * 设置气泡的结构
         * @private
         * @method _renderBalloonContent
         */
        _renderBalloonContent: function(){
        	var balloonwrap = jQuery("<div>").addClass("atw_balloon_wrap");
        	this.balloonwrap = balloonwrap;
        	
        	var ballooncontent = jQuery("<div>").addClass("atw_balloon_content atw_client");
        	var canvas = jQuery("<canvas>").addClass("atw_balloon_canvas");
        	this.canvasdom = canvas[0];
        	balloonwrap.append(canvas);
        	balloonwrap.append(ballooncontent);
        	
        	var balloontitle = jQuery("<div>").addClass("atw_balloon_title");
        	var balloontitle_text = jQuery("<span>").addClass("atw_balloon_title_text");
        	var ballooncloseicon = jQuery("<div>").addClass("atw_balloon_closeicon");
        	balloontitle.append(ballooncloseicon);
        	balloontitle.append(balloontitle_text);
        	ballooncontent.append(balloontitle);
        	
        	var balloonmain = jQuery("<div>").addClass("atw_balloon_content_main atw_client");
        	ballooncontent.append(balloonmain);
        	
        	jQuery(this.target).append(balloonwrap);
        },
        
        /**
         * 设置气泡的大小
         * @private
         * @method _renderBalloonDimensions
         */
        _renderBalloonDimensions: function(){
        	jQuery(".atw_balloon_content", this.balloonwrap).css({
        		"top": this.borderWidth,
        		"left": this.borderWidth,
        		"right": this.borderWidth + this.shadow.blur + this.shadow.offsetx,
        		"bottom": this.spikeh+this.borderWidth+this.shadow.blur+this.shadow.offsety
        	});
        },
        
        /**
         * 初始化canvas以便后面在canvas中绘制
         * @private
         * @method _initCanvas
         */
        _initCanvas: function(){
        	if(this.canvasdom){
    			if(BrowserDetect.browser=="Explorer" && !this.canvasdom.getContext){
	        		if (typeof G_vmlCanvasManager != "undefined") {
					  G_vmlCanvasManager.initElement(this.canvasdom);
					}
				}
        		this.ctx = this.canvasdom.getContext("2d");
        		if(parseInt(this.canvasdom.clientWidth) == 0){
        		jQuery("div:first",this.canvasdom).width(this.canvasdom.width)
											.height(this.canvasdom.height);
        		}
        		
        	}
        },
        
        /**
         * 绘制气泡
         * @private
         * @method _drawBalloon
         */
        _drawBalloon: function(){
        	if(!this.radius){
        		this.radius = [0,0,0,0];
        	}
        	//保存
        	this.ctx.save();
        	//初始化阴影
        	if(this.hasshadow){
        		this._initShadow();
        	}
        	var self = this;
        	//绘制边框
        	this.drawBorder(function(){
        		
        		//还原状态
        		self.ctx.restore();
        		//保存
        		self.ctx.save();
        		//绘制内容
        		self.drawContentRect();
        	});
        },
        
        /**
         * 绘制气泡的边框
         * @private
         * @method drawBorder
         */
        drawBorder: function(cback){
        	this.draww = this.width;
        	this.drawh = this.height;
        	this.x = this.y = this.borderWidth/2;
        	this.draww = this.draww - this.x * 2 - this.borderWidth;
        	this.drawh = this.drawh - this.y * 2 - this.borderWidth - this.spikeh;
        	
        	//如果有阴影的话整个边框需错位
        	//边框的大小改变
        	if(this.hasshadow){
        		var offsetx = this.shadow.blur> Math.abs(this.shadow.offsetx)? this.shadow.blur: Math.abs(this.shadow.offsetx);
				var offsety = this.shadow.blur> Math.abs(this.shadow.offsety)? this.shadow.blur: Math.abs(this.shadow.offsety);
        		if(this.shadow.offsetx < 0){
        			this.x += offsetx;
        		}
        		if(this.shadow.offsety < 0){
					this.y += offsety;
				}
				//边框的大小改变
				this.draww -= offsetx;
				this.drawh -= offsety;
        	}
        	
        	var borderColor = this.getRGBColor(this.borderColor, this.borderopacity);
        	var self = this;
        	var timer = window.setTimeout(function(){
        		window.clearTimeout(timer);
        		self._drawBalloonBorder(self.ctx, self.x, self.y, self.draww, self.drawh, self.radius, self.borderWidth, borderColor);
        		if(cback){
        			cback.apply(this,[]);
        		}
        	}, 100);
        },
        
        /**
         * 绘制气泡的内部矩形
         * @private
         * @method drawContentRect
         */
        drawContentRect: function(){
        	this.x += this.borderWidth/2;
			this.y += this.borderWidth/2;
			this.draww -= this.borderWidth;
			this.drawh -= this.borderWidth;
        	//初始化fillStyle
        	var fillstyle = this.initFillStyle(this.drawh);
        	
        	var self = this;
        	self._drawContentRect(self.ctx, self.x, self.y, self.draww, self.drawh, self.radius, fillstyle);
        },
        
        /**
         * 初始化阴影设置
         * @private
         * @method _initShadow
         */
        _initShadow: function(){
        	if(this.shadow){
				this.ctx.shadowOffsetX = this.shadow.offsetx;
				this.ctx.shadowOffsetY = this.shadow.offsety;
				this.ctx.shadowBlur = this.shadow.blur;
				var rgba = this.getRGBColor(this.shadow.color, this.shadow.opacity);
				this.ctx.shadowColor=rgba;
        	}
        },
        
        /**
         * 初始化填充样式
         * @private
         * @param {Number} height 内容区域的高度
         * @method initFillStyle
         */
        initFillStyle: function(height){
        	if(typeof this.background == "object"){
	        	var opacity = this.background.opacity;
	        	var colors = this.background.color;
        		if(colors && typeof(colors) == "string"){
        			var rgba = this.getRGBColor(colors, opacity);
        			return rgba;
        		}else{
		        	var gradient = this.ctx.createLinearGradient(0, 0, 0, height);
		        	for(var i in colors){
		        		var color = colors[i].color;
		        		var rgba = this.getRGBColor(color, opacity);
		        		gradient.addColorStop(colors[i].position,rgba);
		        	}
		        	return gradient;
		        }
        	}else{
        		return this.background;
        	}
        },
        
        /**
         * 获取十六进制颜色值的rgba形式的颜色值
         * @private
         * @method getRGBColor
         * @param {String} color 十六进制颜色
         * @param {Number} opacity 颜色的透明度
         * @return {String} rgba值
         */
        getRGBColor: function(color, opacity){
        	var rgb = [];
			var reg = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
			if (reg.test(color)) {
				var matched = color.match(reg);
				rgb.push(parseInt(matched[1], 16));
				rgb.push(parseInt(matched[2], 16));
				rgb.push(parseInt(matched[3], 16));
				if(opacity && opacity != ''){
					rgb.push(opacity);
					return "rgba(" + rgb.join(",") + ")";
				}else{
					return "rgb(" + rgb.join(",") + ")";
				}
			} 
			reg = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
			if (reg.test(color)) {
				var matched = color.match(reg);
				rgb.push(parseInt(matched[1]+matched[1], 16));
				rgb.push(parseInt(matched[2]+matched[2], 16));
				rgb.push(parseInt(matched[3]+matched[3], 16));
				if(opacity && opacity != ''){
					rgb.push(opacity);
					return "rgba(" + rgb.join(",") + ")";
				}else{
					return "rgb(" + rgb.join(",") + ")";
				}
			}
        },
        
        /**
         * 绘制气泡边框
         * @private
         * @method _drawBalloonBorder
         * @param {Object} ctx canvas上下文
         * @param {Number} x 开始的横坐标
         * @param {Number} y 开始的纵坐标
         * @param {Number} width 绘制的长度
         * @param {Number} height 绘制的宽度
         * @param {Number} radius 矩形的圆角
         * @param {Number} borderWidth 边框的粗细大小
         * @param {String} borderColor 边框的颜色
         */
        _drawBalloonBorder: function(ctx, x, y, width, height, radius, borderWidth, borderColor){
        	//console.log(x + " : "+y);
        	//console.log(borderWidth + " : "+borderColor);
        	ctx.lineWidth = borderWidth;
			ctx.strokeStyle = borderColor;
			this._drawEnptyRoundedRect(ctx, x, y, width, height, radius);
			ctx.stroke();
        },
        
        /**
         * 绘制气泡内容区域
         * @private
         * @method _drawContentRect
         * @param {Object} ctx canvas上下文
         * @param {Number} x 开始的横坐标
         * @param {Number} y 开始的纵坐标
         * @param {Number} width 绘制的长度
         * @param {Number} height 绘制的宽度
         * @param {Number} radius 矩形的圆角
         * @param {Object} fillStyle 填充的样式
         */
        _drawContentRect: function(ctx, x, y, width, height, radius, fillStyle){
        	ctx.fillStyle = fillStyle;
			this._drawEnptyRoundedRect(ctx, x, y, width, height, radius);
			ctx.fill();
        },
        
        /**
         * 绘制空的矩形
         * @private
         * @method _drawEnptyRoundedRect
         * @param {Object} ctx canvas上下文
         * @param {Number} x 开始的横坐标
         * @param {Number} y 开始的纵坐标
         * @param {Number} width 绘制的长度
         * @param {Number} height 绘制的宽度
         * @param {Number} radius 矩形的圆角
         */
        _drawEnptyRoundedRect: function(ctx, x, y, width, height, radius){
        	ctx.beginPath();
			ctx.moveTo(x, y-this.borderWidth/2 + radius[0]);
			//左边
			ctx.lineTo(x, y + height - radius[1]);
			//左下角
			ctx.quadraticCurveTo(x, y + height, x + radius[1], y + height);
			
			ctx.lineTo(x + width*this.spikeratio - this.spikew/2, y + height);
			ctx.lineTo(x + width*this.spikeratio - this.spikeoffset, y + height+this.spikeh);
			ctx.lineTo(x + width*this.spikeratio + this.spikew/2, y + height);
			
			//下边
			ctx.lineTo(x + width - radius[2], y + height);
			//右下角
			ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius[2]);
			//右边
			ctx.lineTo(x + width, y + radius[3]);
			//右上角
			ctx.quadraticCurveTo(x + width, y, x + width - radius[3], y);
			//上边
			ctx.lineTo(x + radius[0], y);
			//左上角
			ctx.quadraticCurveTo(x, y, x, y + radius[0]);
        },
        
        /**
         * 设置标题
         * @method setTitle
         * @param {String} title 标题
         */
        setTitle: function(title){
        	this.balloonwrap.find(".atw_balloon_title_text").html(title);
        },
        
        /**
         * 设置内容
         * @method setContent
         * @param {String} content 内容
         */
        setContent: function(content){
        	if(typeof(content) == 'object' && content["url"]){
        		var frame = jQuery(".atw_balloon_frame",this.target);
        		if(!frame.length){
        			frame = jQuery('<iframe frameBorder="0" class="atw_balloon_frame" marginWidth="0px" marginHeight="0px"></iframe>');
        			jQuery(".atw_balloon_content_main", this.target).append(frame);
        		}
        		frame.attr("src", content["url"]);
        	}else{
        		this.balloonwrap.find(".atw_balloon_content_main").html(content);
        	}
        },
        
        /**
         * 添加事件监听
         * @private
         * @method addListeners
         */
        addListeners: function(){
        	var self = this;
        	this.balloonwrap.find(".atw_balloon_closeicon").click(function(){
        		self.hide();
        		self.closed();
        	});
        },
        
        /**
         * 隐藏组件
         * @method hide
         */
        hide: function(){
        	this.balloonwrap.fadeOut(this.fadeOut);
        	this.state = false;
        },
        
        /**
         * 显示组件
         * @method show
         */
        show: function(){
        	this.balloonwrap.fadeIn(this.fadeIn);
        	this.state = true;
        },
        
        /**
         * 隐藏组件回调函数
         * @method closed
         */
        closed: function(){
        	
        },
        
        /**
         * 获取气泡箭头的位置
         * @method getSpikeOffset
         * @return {Number} 箭头的位置离左边的值
         */
        getSpikeOffset: function(){
        	return this.width * this.spikeratio - this.spikeoffset;
        },
        
		/**
         * 组件名称
         * @type {String}
         */
        WIDGET_NAME: "气泡组件"
    });
    
   /**
    * 气泡的皮肤
	 * @class ATW.Balloon.Skins
	 * @author cqb
	 * @version 2.1
	 */
    atw.Balloon.Skins = {
		/**
		 * 黑色皮肤
		 * @property black
		 */
    	'black': {
    		background: {
    			color: '#232323',
    			opacity: .9
    		},
     		borderWidth: 1,
     		borderColor: "#232323"
    	},
		
    	/**
		 * 云皮肤
		 * @property cloud
		 */
    	'cloud': {
    		background: {
		      color: [
		        { position: 0, color: '#f6fbfd'},
		        { position: 0.1, color: '#fff' },
		        { position: .48, color: '#fff'},
		        { position: .5, color: '#fefffe'},
		        { position: .52, color: '#f7fbf9'},
		        { position: .8, color: '#edeff0' },
		        { position: 1, color: '#e2edf4' }
		      ],
		      opacity: 0.8
		    },
		    borderColor: "#bec6d5",
		    borderWidth: 5,
			radius: [5,5,5,5],
			spikeoffset: 0,
			spikeratio: 0.75,
			borderopacity: 0.7
    	},
    	
		/**
		 * 暗色皮肤
		 * @property dark
		 */
    	'dark': {
    		borderColor: "#1f1f1f",
    		background: {
		      color: [
		        { position: .0, color: '#686766' },
		        { position: .48, color: '#3a3939' },
		        { position: .52, color: '#2e2d2d' },
		        { position: .54, color: '#2c2b2b' },
		        { position: 0.95, color: '#222' },
		        { position: 1, color: '#202020' }
		      ],
		      opacity: .75
		    },
		    radius: [4,4,4,4],
		    spikeratio: 0.55,
		    hasshadow: true,
		    shadow: {
		    	color: '#aaa',
				opacity: 1,
				offsetx: 3,
				offsety: 3,
				blur: 3
		    },
		    borderopacity: 0.8
    	},
    	
		/**
		 * facebook皮肤
		 * @property facebook
		 */
    	'facebook': {
    		background: "#282828",
    		borderWidth: 0,
		    fadeIn: 500,
		    fadeOut: 700,
		    radius: [0,0,0,0]
    	},
    	
		/**
		 * 熏衣草皮肤
		 * @property lavender
		 */
    	'lavender' : {
    		background: {
		      color: [
		        { position: .0, color: '#b2b6c5' },
		        { position: .5, color: '#9da2b4' },
		        { position: 1, color: '#7f85a0' }
		      ],
		      opacity: 0.8
		    },
		    borderWidth: 3,
		    borderColor: '#6b7290'
    	},
    	
		/**
		 * 石灰皮肤
		 * @property lime
		 */
    	'lime': {
    		background: {
		      color: [
		        { position: 0,   color: '#a5e07f' },
		        { position: .02, color: '#cef8be' },
		        { position: .09, color: '#7bc83f' },
		        { position: .35, color: '#77d228' },
		        { position: .65, color: '#85d219' },
		        { position: .8,  color: '#abe041' },
		        { position: 1,   color: '#c4f087' }
		      ],
		      opacity: 0.9
		    },
		    borderWidth: 5,
			radius: [5,5,5,5],
			borderopacity: 0.3
    	},
    	
		/**
		 * 明亮皮肤
		 * @property liquid
		 */
    	'liquid': {	
    		borderWidth: 1,
			borderColor: "#454545",
    		background: {
		      color: [
		        { position: 0, color: '#515562'},
		        { position: .3, color: '#252e43'},
		        { position: .48, color: '#111c34'},
		        { position: .52, color: '#161e32'},
		        { position: .54, color: '#0c162e'},
		        { position: 1, color: '#010c28'}
		      ],
		      opacity: .8
		    },
		    radius: [5,5,5,5],
		    hasshadow: true,
		    shadow: {
		    	color: '#ccc',
				opacity: 0.75,
				offsetx: 3,
				offsety: 3,
				blur: 3
		    },
		    borderopacity: 0.5
    	},
    	
		/**
		 * 蓝色皮肤
		 * @property blue
		 */
    	'blue': {
		    borderWidth: 3,
		    borderColor: '#1e5290',
		    radius: [5,5,5,5],
		    spikeoffset: 4,
		    background: {
		      color: [
		        { position: 0, color: '#3a7ab8'},
		        { position: .48, color: '#346daa'},
		        { position: .52, color: '#326aa6'},
		        { position: 1, color: '#2d609b' }
		      ],
		      opacity: .8
		    },
		    borderWidth: 1,
			borderColor: "#1e5290",
		    hasshadow: true,
		    shadow: {
		    	color: '#ccc',
				opacity: 0.3,
				offsetx: 3,
				offsety: 3,
				blur: 3
		    },
		    borderopacity: 0.5
		  },
		  
		  /**
		   * 肉色皮肤
		   * @property salmon
		   */
		  'salmon' : {
		    background: {
		      color: [
		        { position: 0, color: '#fbd0b7' },
		        { position: .5, color: '#fab993' },
		        { position: 1, color: '#f8b38b' }
		      ],
		      opacity: .8
		    },
		    borderWidth: 3,
		    borderColor: '#eda67b',
		    radius: [4,4,4,4]
		  },
		  
		  /**
		   * 黄色
		   * @property yellow
		   */
		  'yellow': {
		  	borderWidth: 3,
		    borderColor: '#f7c735',
		    background: '#ffffaa',
		    hasshadow: true,
		    shadow: {
		    	color: '#f7c735',
				opacity: 0.3,
				offsetx: 3,
				offsety: 3,
				blur: 3
		    },
		    radius: [4,4,4,4]
		  }
    }
})(ATW);