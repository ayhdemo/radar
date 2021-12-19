(function (atw) {
	/**
	 * 浮动DIV组件
	 * <pre>var floatdiv = $(".div").FloatDiv({
		draggable: true,
		title: "Title",
		resizeable: true,
		useiframe: true,
		content:{url: "content.html"}
}).data("FloatDiv");
floatdiv.setSize(500, 200);</pre>
	 * @module Control
	 * @class ATW.FloatDiv
	 * @extends ATW.Control
	 * @author cqb
	 * @version 2.1
	 */
    atw.extendClass("FloatDiv",atw.Control,{
    	/**
         * 是否可以关闭
         * @type {Boolean}
         * @property closeable
         */
		closeable: true,
    	/**
         * 关闭按钮的位置只能是“left” or “right”
         * @type {String}
         * @property closeiconalign
         * @default right
         */
		closeiconalign: "right",
		/**
         * 关闭特效类型nomal, fade
         * @type {String}
         * @property hidetype
         * @default nomal
         */
    	hidetype: "nomal",
    	/**
         * 特效时间
         * @type {Number}
         * @property speed
         * @default 700
         */
    	speed: 700,
    	/**
         * 浮动的层级
         * @type {Number}
         * @property zindex
         * @default 10000
         */
    	zindex: 10000,
    	/**
         * 标题
         * @type {String}
         * @property title
         */
    	title: null,
    	/**
         * 是否允许退拽
         * @type {Boolean}
         * @property draggable
         * @default false
         */
    	draggable: false,
    	/**
         * 是否允许大小可变
         * @type {Boolean}
         * @property resizeable
         * @default false
         */
    	resizeable: false,
    	/**
         * 滚动条两边的按钮
         * @type {Boolean}
         * @property showarrows
         * @default true
         */
    	showarrows: true,
    	/**
         * 最小高度
         * @type {Number}
         * @property minHeight
         * @default 25
         */
		minHeight: 25,
		/**
         * 最小宽度
         * @type {Number}
         * @property minWidth
         * @default 200
         */
		minWidth: 200,
		/**
         * 组件状态
         * @type {Boolean}
         * @property contentready
         * @default false
         */
		contentready: false,
		/**
         * 是否为模态
         * @type {Boolean}
         * @property ismode
         * @default false
         */
		ismode: false,
		/**
         * 模态透明度
         * @type {Number}
         * @property shadowopacity
         * @default 0.7
         */
		shadowopacity: 0.7,
		/**
         * 内容
         * text: ""
         * url: 地址
         * @type {Object}
         * @property content
         */
		content: null,
		/**
         * 组件浮动的位置
         * @type {String}
         * @property widgetalign
         * @default center
         */
		widgetalign: "center",
		/**
         * 浮动div的状态
         * @type {Boolean}
         * @property state
         */
		state: null,
		/**
         * 浮动的父框
         * @type {String}
         * @property containment
         * @default parent
         */
		containment: "parent",
		/**
		 * 用户自定义样式类
		 * @type {String}
		 * @property userClass
		 */
		userClass: null,
		/**
		 * 内容是否使用iframe展示
		 * @type {Boolean}
		 * @property useiframe
		 */
		useiframe: false,
        /**
         * 设置参数信息
         * @constructor
         * @param {Object} options 参数
         */
        initialize : function(options){
        	//滚动条
        	atw.Control.prototype.initialize.apply(this,arguments);
        	
        	//浮动渲染div
        	this._render(options);
        },
        
        /**
         * 浮动渲染div
         * @private
         * @param {Object} options 参数
         */
        _render: function(options){
        	//添加样式类
        	jQuery(this.target).addClass("atw_floatdiv");
        	//检查浮动div的状态
        	this._checkState();
        	//创建浮动div的结构
        	this._createFloatDiv();
        	//设置标题
        	this.setTitle(this.title);
        	//设置内容
        	this.setContent(this.content);
        	//设置大小和位置
        	this.positionEles();
        	//添加事件监听
        	this._addEventListeners();
        },
        
        /**
         * 检查浮动div的状态,显示或隐藏
         * @private
         * @method _checkState
         */
        _checkState: function(){
        	//当前样式
        	var style = this.getCurrentStyle(this.target);
        	//隐藏状态为false，显示状态为true
        	this.state = $(this.target).is(":visible");
        },
        
        /**
         * 创建浮动div的结构
         * @private
         * @method _createFloatDiv
         */
        _createFloatDiv: function(){
        	//创建div
        	var floatdivmain = jQuery("<div>").addClass("atw_floatdiv_main atw_corner atw_shadow");
        	var floatdivwrapper = jQuery("<div>").addClass("atw_floatdiv_wrapper")
        									.css("position","absolute");
        	var id = $(this.target).attr("id");
        	if(id){
        		floatdivwrapper.attr("id","atw_"+id);
        	}
        	if(this.userClass){
        		floatdivwrapper.addClass(this.userClass);
        	}
        	var closeicon = jQuery("<div>").addClass("atw_floatdiv_closeicon");
        	var floatdivtitle = jQuery("<div>").addClass("atw_floatdiv_title atw_corner_top");
        	
        	jQuery(this.target).wrap(floatdivwrapper);
        	//如果设置了关闭选项
        	if(this.closeable){
        		//关闭按钮放左边
        		if(this.closeiconalign == "left"){
        			closeicon.addClass("atw_floatdiv_closeicon_left");
        		}
        		jQuery(this.target).before(closeicon);
        	}
        	jQuery(this.target).wrap(floatdivmain);
        	jQuery(this.target).before(floatdivtitle);
        	
        	//插入iframe
        	if(this.useiframe){
        		var iframe = $('<iframe class="atw_floatdiv_frame atw_client" frameBorder="0" src=""></iframe>');
        		jQuery(this.target).empty().append(iframe);
        	}
        	
        	//模态
        	if(this.ismode){
        		if(!jQuery("#atw_floatdiv_model").length){
	        		var at_floatdiv_model = jQuery("<div>").attr("id","atw_floatdiv_model");
	        		jQuery("body").append(at_floatdiv_model);
	        		jQuery("#atw_floatdiv_model").css("zIndex",this.zindex-1)
	        				.css("opacity",this.shadowopacity);
        		}else{
        			jQuery("#atw_floatdiv_model").css("zIndex",this.zindex-1)
	        				.css("opacity",this.shadowopacity);
        		}
        		//如果当前状态为隐藏
        		if(!this.state){
	        		jQuery("#atw_floatdiv_model").hide();
	        	}
        	}
        	
        	$("#atw_floatdiv_model").css("height",document.body.clientHeight);
        	$("#atw_floatdiv_wrapper").css("top",(document.body.scrollTop));
        },
        
        /**
         * 设置大小和位置
         * @private
         * @method positionEles
         * @param {DOM} target 调用该方法的DOM对象
         */
        positionEles: function(){
        	var mainobj = jQuery(this.target).parent(".atw_floatdiv_main");
        	//当前对象的长宽
        	var width = jQuery(this.target).outerWidth(true);
        	var height = jQuery(this.target).outerHeight(true);
			
        	var paddingw = parseFloat($(mainobj).css("padding-left")) + parseFloat($(mainobj).css("padding-right"));
        	var paddingh = parseFloat($(mainobj).css("padding-top")) + parseFloat($(mainobj).css("padding-bottom"));
        	var bw = $(mainobj).css("border-width");
			bw = bw == "" ? 0 : parseFloat(bw);
			
        	var titleh = mainobj.children(".atw_floatdiv_title").outerHeight(true);
        	
        	jQuery(this.target).parents(".atw_floatdiv_wrapper").width(width + paddingw+bw*2).height(height+paddingh+titleh+bw *2+5);
        	jQuery(this.target).parents(".atw_floatdiv_wrapper").css("zIndex", this.zindex);
        	
        	//如果当前状态为隐藏、隐藏组件并显示当前对象
        	if(!this.state){
        		jQuery(this.target).parents(".atw_floatdiv_wrapper").hide();
        		jQuery(this.target).show();
        	}
        	//父节点的长宽
        	var parent = null;
        	if(this.containment != 'parent'){
        		parent = jQuery(this.target).parents(this.containment);
        	}else{
        		parent = jQuery(this.target).parents(".atw_floatdiv_wrapper").parent();
        	}
        	//var parentw = parent.width();
        	var parentw = jQuery(window).width();
        	/*var parenth = parent.height();
        	//如果父节点为body
        	if(parent[0].tagName == "BODY"){
        		parenth = atw.Util.getBodyDimensions().height;
        	}*/
        	var parenth = jQuery(window).height();
        	
        	//组件定位
        	if(this.widgetalign == "center"){
	        	jQuery(this.target).parents(".atw_floatdiv_wrapper").css({
	        		left: (parentw-width)/2,
	        		top: (parenth-height)/2
	        	});
        	}
        	
        	mainobj.addClass("atw_client");
        	$(this.target).width("auto").addClass("atw_client absolute");
        	
        	$("#atw_floatdiv_model").css("height",document.body.clientHeight);
        //	$(".atw_floatdiv_wrapper").css("margin-top",(document.body.scrollTop));
        	$(".atw_floatdiv_wrapper").css("margin-top",(document.body.scrollTop));
        },
        
        /**
         * 居中
         * @private
         * @method _setCenter
         */
        _setCenter: function(){
        	var wrap = jQuery(this.target).parents(".atw_floatdiv_wrapper");
        	var width = wrap.width();
        	var height = wrap.height();
        	
        	//父节点的长宽
        	var parent = null;
        	if(this.containment != 'parent'){
        		parent = jQuery(this.target).parents(this.containment);
        	}else{
        		parent = jQuery(this.target).parents(".atw_floatdiv_wrapper").parent();
        	}
        	var parentw = parent.width();
        	var parenth = parent.height();
        	//如果父节点为body
        	if(parent[0].tagName == "BODY"){
        		parenth = atw.Util.getBodyDimensions().height;
        	}
        	
        	//组件定位
        	if(this.widgetalign == "center"){
	        	jQuery(this.target).parents(".atw_floatdiv_wrapper").css({
	        		left: (parentw-width)/2,
	        		top: (parenth-height)/2
	        	});
        	}
        },
        
        /**
         * 添加事件监听
         * @private
         * @method _addEventListeners
         */
        _addEventListeners: function(){
        	var self = this;
        	//关闭组件监听
        	if(this.closeable){
        		jQuery(this.target).parents(".atw_floatdiv_wrapper").children(".atw_floatdiv_closeicon").click(function(){
        			self.close();
        		});
        	}
        	
        	//拖拽监听
        	if(this.draggable){
        		jQuery(this.target).parents(".atw_floatdiv_wrapper").draggable({
        			handle:".atw_floatdiv_title",
        			containment: this.containment,
        			start: function(event, ui){self.beforeDrag(event, self);},
        			stop: function(event, ui){self.afterDrag(event, self);}
        		});
        	}
        	//resize监听
        	if(this.resizeable){
        		jQuery(this.target).parents(".atw_floatdiv_wrapper").resizable({
        			alsoResize: '.atw_floatdiv_main, .atw_floatdiv',
					minHeight: this.minHeight,
					minWidth: this.minWidth,
					stop: function(event, ui){
						self.afterResize(event, self);
					},
					start: function(event, ui){
						self.beforeResize(event, self);
					}
        		});
        	}
        },
        
        /**
         * 拖拽之前回调函数
         * @method beforeDrag
         * @param {Event} event Window event对象
         * @param {Object} self 当前对象
         */
        beforeDrag: function(event, self){
        	
        },
        
        /**
         * 拖拽之后回调函数
         * @method afterDrag
         * @param {Event} event Window event对象
         * @param {Object} self 当前对象
         */
        afterDrag: function(event, self){
        	
        },
        
        /**
         * Resize之前回调函数
         * @method beforeResize
         * @param {Event} event Window event对象
         * @param {Object} self 当前对象
         */
        beforeResize: function(event, self){
        	
        },
        
        /**
         * Resize之后回调函数
         * @method afterResize
         * @param {Event} event Window event对象
         * @param {Object} self 当前对象
         */
        afterResize: function(event, self){
        	
        },
        
        /**
         * 关闭组件
         * @method close
         */
        close: function(){
        	this.beforeClose(this);
        	if(this.hidetype == "nomal"){
        		if(this.ismode){
        			jQuery("#atw_floatdiv_model").hide();
        		}
        		jQuery(this.target).parents(".atw_floatdiv_wrapper").hide();
        	}
        	if(this.hidetype == "fade"){
        		if(this.ismode){
        			jQuery("#atw_floatdiv_model").fadeOut(this.speed);
        		}
        		jQuery(this.target).parents(".atw_floatdiv_wrapper").fadeOut(this.speed);
        	}
        	this.state = false;
        	this.closeCallback(this);
        },
        
        /**
         * 关闭之前回调函数
         * @method beforeClose
         * @param {Object} obj 当前组件对象
         */
        beforeClose: function(obj){
        	
        },
        
        /**
         * 关闭组件回调函数
         * @method closeCallback
         * @param {Object} obj 当前组件对象
         */
        closeCallback: function(obj){
        	
        },
        
        /**
         * 显示组件
         * @method show
         */
        show: function(){
        	if(this.hidetype == "nomal"){
        		if(this.ismode){
        			jQuery("#atw_floatdiv_model").show();
        		}
        		jQuery(this.target).parents(".atw_floatdiv_wrapper").show();
        	}
        	if(this.hidetype == "fade"){
        		if(this.ismode){
        			jQuery("#atw_floatdiv_model").fadeIn(this.speed);
        		}
        		var self = this;
        		jQuery(this.target).parents(".atw_floatdiv_wrapper").fadeIn(this.speed,function(){
        		});
        	}
        	if(this.widgetalign == "center"){
        		var parentw = jQuery(window).width();
            	var parenth = jQuery(window).height();
            	//当前对象的长宽
            	var width = jQuery(this.target).outerWidth(true);
            	var height = jQuery(this.target).outerHeight(true);
	        	jQuery(this.target).parents(".atw_floatdiv_wrapper").css({
	        		left: (parentw-width)/2,
	        		top: (parenth-height)/2
	        	});
        	}
        	this.state = true;
        	this.showCallback(this);
        },
        
        /**
         * 显示组件回调函数
         * @method showCallback
         * @param {Object} obj 当前对象
         */
        showCallback: function(obj){
        	
        },
        
        /**
         * 隐藏组件
         * @method hide
         */
        hide: function(){
        	this.close();
        },
        
        /**
         * 销毁
         * @method destroy
         */
        destroy: function(){
        	var original = jQuery(this).data("original");
        	jQuery(this.target).parents(".atw_floatdiv_wrapper").before(original);
        	jQuery(this.target).removeData("original");
        	jQuery(this.target).removeData(this.CLASS_NAME);
        	var a = jQuery(this.target).parents(".atw_floatdiv_wrapper").remove();
        	a = null;
        	if(jQuery("#atw_floatdiv_model").length){
        		a = jQuery("#atw_floatdiv_model").remove();
        		a = null;
        	}
        },
        
        /**
         * 设置内容
         * @method setContent
         * @param {Object} options 参数
         */
        setContent: function(options){
        	if(options){
	        	if(options.text){
	        		jQuery(this.target).html(options.text);
	        	}
	        	if(options.url){
	        		if(this.useiframe){
	        			jQuery(this.target).children(".atw_floatdiv_frame").attr("src",options.url);
	        		}else{
	        			jQuery(this.target).load(options.url);
	        		}
	        	}
	        }
        },
        
        /**
         * 设置标题
         * @method setTitle
         * @param {String} title 参数
         */
        setTitle: function(title){
        	jQuery(this.target).parent().children(".atw_floatdiv_title").html(title);
        },
        
        /**
         * 设置定位
         * @method setPosition
         * @param {Object} position 边距{left: "", top: "" ...}
         */
        setPosition: function(position){
        	jQuery(this.target).parents(".atw_floatdiv_wrapper").css(position);
        },
        
        /**
         * 设置大小
         * @method setSize
         * @param {Number} width 长度
         * @param {Number} height 宽度
         */
        setSize: function(width, height){
        	jQuery(this.target).parents(".atw_floatdiv_wrapper").width(width).height(height);
        	this._setCenter();
        },
        
		/**
         * 组件名称
         * @type {String}
         * @property WIDGET_NAME
         */
        WIDGET_NAME: "浮动div"
    });
})(ATW);