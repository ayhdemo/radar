(function(atw){
	/**
	 * 选项卡
	 * @module Control
	 * @class ATW.sTab
	 * @author cqb
	 * @extends ATW.Control
	 * @version 2.1
	 */
	atw.extendClass("sTab",ATW.Control,{
		/**
		 * 滚动方向 lr --> left right, tb --> top bottom
		 * @type {String}
		 * @default lr
		 * @property rolldir
		 */
		rolldir: "lr",
		/**
		 * 选项卡的位置
		 * top,left,right,bottom
		 * @type {String}
		 * @default top
		 * @property align
		 */
		align: "top",
		/**
		 * 特效时间
		 * @type {Integer}
		 * @default 600
		 * @property speed
		 */
		speed: 600,
		/**
		 * 内容是通过ajax加载
		 * @type {Boolean}
		 * @default false
		 * @property ajaxload
		 */
		ajaxload: false,
		/**
		 * 内容通过ajax重新加载
		 * @type {Boolean}
		 * @default true
		 * @property reload
		 */
		reload: true,
		/**
		 * 当前tab索引
		 * @type {Integer}
		 * @default 0
		 * @property currentindex
		 */
		currentindex: 0,
		
		/**
		 * 设置参数信息
		 * @constructor
         * @param {Object} options 参数
		 */
		initialize : function(options){
			ATW.Control.prototype.initialize.apply(this, arguments);
			
			this._render();
		},
		
		/**
		 * 入口
		 * @private
		 * @method _render
		 */
		_render: function(){
			//初始化
			this._init();
			//创建
			this._create();
			//初始化位置大小
			this._initDem();
			
			//注册事件
			this._listener();
		},
		
		/**
		 * 初始化
		 * @private
		 * @method _init
		 */
		_init: function(){
			
		},
		
		/**
		 * 创建选项卡html结构
		 * @private
		 * @method _create
		 */
		_create: function(){
    		jQuery(this.target).addClass("atw_tab").addClass("atw_tab_align_"+this.align);
    		var titles = jQuery(this.target).children("span").addClass("atw_tab_title_bt");
    		var contents = jQuery(this.target).children("div").addClass("atw_tab_cont");
    		
    		jQuery(this.target).append('<div class="atw_tab_title"></div>');
    		jQuery(this.target).append('<div class="atw_tab_content"></div>');
    		jQuery(".atw_tab_content",this.target).append('<div class="atw_tab_content_scroll"></div>');
    		
    		var titlescroll = jQuery("<div>").addClass("atw_tab_title_scroll");
    		jQuery(".atw_tab_title",this.target).append("<a class='atw_tab_title_larrow'></a>");
    		jQuery(".atw_tab_title",this.target).append(titlescroll);
    		jQuery(".atw_tab_title",this.target).append("<a class='atw_tab_title_rarrow'></a>");
    		var div = jQuery("<span>").addClass("atw_tab_titles_wrap");
    		div.append(titles);
    		titlescroll.append(div);
    		jQuery(".atw_tab_content_scroll",this.target).append(contents);
		},
		
		/**
		 * 初始化大小和位置
		 * @private
		 * @method _initDem
		 */
		_initDem: function(){
			var titles = jQuery(this.target).children(".atw_tab_title").children(".atw_tab_title_scroll").find(".atw_tab_title_bt");
			
			var titleH = jQuery(this.target).children(".atw_tab_title").outerHeight(true);
			var titleW = jQuery(this.target).children(".atw_tab_title").outerWidth(true);
			
			var c = (this.align == "top" || this.align == "bottom") ? titleH : titleW;
			jQuery(this.target).children(".atw_tab_content").css(this.align,c);
			
			this._initContDem();
		},
		
		/**
		 * 初始化内容区大小和位置
		 * @private
		 * @method _initContDem
		 */
		_initContDem: function(){
			var titles = jQuery(this.target).children(".atw_tab_title").children(".atw_tab_title_scroll").find(".atw_tab_title_bt");
			var width = jQuery(this.target).width();
			var height = jQuery(this.target).height();
			if(this.rolldir == "lr"){
				jQuery(".atw_tab_content_scroll",jQuery(this.target).children(".atw_tab_content")).css({
					width: width * titles.length,
					right: "auto"
				});
				jQuery(".atw_tab_cont",jQuery(this.target).children(".atw_tab_content")).css({
					width: width
				});
			}
			if(this.rolldir == "tb"){
				jQuery(".atw_tab_content_scroll",jQuery(this.target).children(".atw_tab_content")).css({
					height: height * titles.length,
					bottom: "auto"
				});
//				if(jQuery.browser.msie && jQuery.browser.version < 8){
//					jQuery(".tab_cont",jQuery(this.target).children(".atw_tab_content")).each(function(index){
//						jQuery(this).css({
//							position: "absolute",
//							left: "0px",
//							right: "0px",
//							top: height*index+"%",
//							bottom: height*(-index-1)+"%"
//						});
//					});
//				}else{
				jQuery(".atw_tab_cont",jQuery(this.target).children(".atw_tab_content")).css({
					height: height
				});
//				}
			}
		},
		
		/**
		 * 事件监听
		 * @private
		 * @method _listener
		 */
		_listener: function(){
			var self = this;
			var titles = jQuery(".atw_tab_title_bt",jQuery(this.target).children(".atw_tab_title"));
			titles.click(function(){
				var titles = jQuery(".atw_tab_title_bt",jQuery(self.target).children(".atw_tab_title"));
				var title = this;
				titles.each(function(index){
					if(this == title){
						self.slide(index);
						self.tabClicked(title, index);
					}
				});
			}).eq(0).addClass("active");
			var tscroll = jQuery(this.target).children(".atw_tab_title").children(".atw_tab_title_scroll");
			var timer = null;
			jQuery(this.target).children(".atw_tab_title").hover(function(){
				if(timer){
					window.clearTimeout(timer);
				}
				var scrollwh = self.align == "top" || self.align == "bottom" ? tscroll.children(".atw_tab_titles_wrap").outerWidth(true) : tscroll.children(".atw_tab_titles_wrap").outerHeight(true);
				
				var twh = self.align == "top" || self.align == "bottom" ? jQuery(self.target).children(".atw_tab_title").outerWidth(true) : jQuery(self.target).children(".atw_tab_title").outerHeight(true);
				if(scrollwh > twh){
					jQuery(".atw_tab_title_rarrow", jQuery(self.target).children(".atw_tab_title")).css("display","block");
					jQuery(".atw_tab_title_larrow", jQuery(self.target).children(".atw_tab_title")).css("display","block");
				}
			},function(){
				timer = window.setTimeout(function(){
					jQuery(".atw_tab_title_rarrow", jQuery(self.target).children(".atw_tab_title")).css("display","none");
					jQuery(".atw_tab_title_larrow", jQuery(self.target).children(".atw_tab_title")).css("display","none");
				}, 300);
			});
			if(this.ajaxload){
				jQuery(".atw_tab_title_bt",jQuery(this.target).children(".atw_tab_title")).eq(0).click();
			}
			jQuery(".atw_tab_title_rarrow",jQuery(this.target).children(".atw_tab_title")).click(function(){
				self.ltitleSlide();
			});
			
			jQuery(".atw_tab_title_larrow",jQuery(this.target).children(".atw_tab_title")).click(function(){
				self.rtitleSlide();
			});
		},
		
		/**
		 * tab标题向左或上移动
		 * @private
		 * @method ltitleSlide
		 */
		ltitleSlide: function(){
			var tscroll = jQuery(this.target).children(".atw_tab_title").children(".atw_tab_title_scroll");
			var wrap = tscroll.children(".atw_tab_titles_wrap");
			var lefttop = this.align == "top" || this.align == "bottom" ? parseFloat(tscroll.css("left")): parseFloat(tscroll.css("top"));
			
			var scrollwh = this.align == "top" || this.align == "bottom" ? wrap.outerWidth(true) : wrap.outerHeight(true);
			var twh = this.align == "top" || this.align == "bottom" ? jQuery(this.target).children(".atw_tab_title").outerWidth(true) : jQuery(this.target).children(".atw_tab_title").outerHeight(true);
			var offsetx = scrollwh + lefttop;
			
			var cssa = this.align == "top" || this.align == "bottom" ? "left" : "top";
			if(offsetx <= 0){
				return false;
			}
			if(offsetx < twh){
				return false;
			}else{
				var slideoff = twh;
				slideoff = offsetx - twh < twh ? offsetx - twh : slideoff;
				var css = {};
				css[cssa] = lefttop-slideoff;
				tscroll.animate(css, 500);
			}
		},
		
		/**
		 * tab标题向右或下移动
		 * @private
		 * @method rtitleSlide
		 */
		rtitleSlide: function(){
			var tscroll = jQuery(this.target).children(".atw_tab_title").children(".atw_tab_title_scroll");
			var twh = this.align == "top" || this.align == "bottom" ? jQuery(this.target).children(".atw_tab_title").outerWidth(true) : jQuery(this).children(".atw_tab_title").outerHeight(true);
			var lefttop = this.align == "top" || this.align == "bottom" ? parseFloat(tscroll.css("left")): parseFloat(tscroll.css("top"));
			
			var cssa = this.align == "top" || this.align == "bottom" ? "left" : "top";
			if(Math.abs(lefttop) < twh){
				var css = {};
				css[cssa] = "0px";
				tscroll.animate(css, 500);
				return false;
			}else{
				var css = {};
				css[cssa] = lefttop+twh;
				tscroll.animate(css, 500);
			}
		},
		
		/**
		 * 左滑
		 * @method slide
		 * @param {Integer} index 当前选项卡的顺序
		 * @param {Integer} speed 特效时间
		 */
		slide: function(index, speed){
			var self = this;
			speed = speed == undefined ? this.speed : speed;
			this.currentindex = index;
			jQuery(".atw_tab_title_bt",jQuery(this.target).children(".atw_tab_title")).removeClass("active");
			jQuery(".atw_tab_title_bt",jQuery(this.target).children(".atw_tab_title")).eq(index).addClass("active");
			var width = jQuery(this.target).children(".atw_tab_content").outerWidth(true);
			var height = jQuery(this.target).children(".atw_tab_content").outerHeight(true);
			var titles = jQuery(this.target).children(".atw_tab_title").children(".atw_tab_title_scroll").find(".atw_tab_title_bt");
			var start = this.rolldir == "lr" ? -index*width : -index*height;

			var dir = {"lr":["left","right"],"tb":["top","bottom"]};
			var rolldir = dir[this.rolldir];
			var obj = {};
			obj[rolldir[0]] = start;
			jQuery(".atw_tab_content_scroll",jQuery(this.target).children(".atw_tab_content"))
				.animate(obj, speed, function(){
					self.slideEnd(index);
				});
			
			if(this.ajaxload){
				var cont = jQuery(".atw_tab_cont",jQuery(this.target).children(".atw_tab_content")).eq(index);
				var load = this.reload ? true : !cont.data("loaded");
				if(load){
					var url = titles.eq(index).attr("href");
					if(url && url != ""){
						cont.empty();
						cont.load(url, function(){
							self.contentCompleted(index);
						});
						cont.data("loaded", true);
					}
				}
			}
		},
		
		/**
		 * 添加一个Tab
		 * @method add
		 * @param {Object} params {title: "标题",href:"内容地址"}或者{title: "标题",content:"内容"}
		 */
		add: function(params){
			var self = this;
			if(!params.title){
				throw("addTab 方法中参数缺少title属性");
				return;
			}
			var tab = jQuery("<span>").addClass("atw_tab_title_bt").html(params.title);
			if(params.href){
				tab.attr("href",params.href);
				this.ajaxload = true;
			}
			jQuery(".atw_tab_titles_wrap", jQuery(this.target).children(".atw_tab_title")).append(tab);
			var cont = jQuery("<div>").addClass("atw_tab_cont");
			if(params.content){
				cont.html(params.content);
			}
			jQuery(".atw_tab_content_scroll", jQuery(this.target).children(".atw_tab_content")).append(cont);
			this._initContDem();
			self.slide(this.currentindex,0);
			
			var index = jQuery(this.target).children(".atw_tab_title").find(".atw_tab_title_bt").length - 1;
			tab.click(function(){
				jQuery(".atw_tab_title_bt",jQuery(self.target).children(".atw_tab_title")).removeClass("active");
				jQuery(this).addClass("active");
				self.slide(index);
				self.tabClicked(this, index);
			});
		},
		
		/**
		 * 删除tab
		 * @method remove
		 * @param {Number} index tab的索引
		 */
		remove: function(index){
			var tabtitles = jQuery(this.target).children(".atw_tab_title").find(".atw_tab_title_bt");
			index = index == undefined ? tabtitles.length-1 : index;
			
			var rt = tabtitles.eq(index);
			rt.die("click");
			rt.remove();
			tabtitles = jQuery(this.target).children(".atw_tab_title").find(".atw_tab_title_bt");
			
			var tabconts = jQuery(this.target).children(".atw_tab_content").children(".atw_tab_content_scroll").find(".atw_tab_cont");
			var rc = tabconts.eq(index);
			rc.remove();
			
			var self = this;
			var newindex = null;
			tabtitles.each(function(index){
				if($(this).hasClass("active")){
					newindex = index;
				}
			});
			newindex==undefined ? this.currentindex-- : this.currentindex = newindex;
			
			this._initContDem();
			this.currentindex = this.currentindex<0? 0: this.currentindex;
			this.slide(this.currentindex,0);
		},
		
		/**
		 * 内容加载完成回调
		 * @method contentCompleted
		 * @param {Integer} index 内容加载完成回调的tab索引
		 */
		contentCompleted: function(index){
			
		},
		
		/**
		 * 滑动结束回调
		 * @method slideEnd
		 * @param {Integer} index tab索引
		 */
		slideEnd: function(index){
			
		},
		
		/**
		 * tab点击回调
		 * @method tabClicked
		 * @param {DOM} tab 选项卡对象
		 * @param {Integer} index 选项卡索引
		 */
		tabClicked: function(tab, index){
			
		},
		
		/**
		 * 激活第index个标签
		 * @method active
		 * @param {Number} index tab索引
		 */
		active: function(index){
			var bts = jQuery(".atw_tab_title_bt",jQuery(this.target).children(".atw_tab_title"));
			bts.removeClass("active");
			bts.eq(index).addClass("active");
			this.slide(index);
		},
		
		/**
		 * 重新将tab的头和内容容器重新定位
		 * @method reposition
		 */
		reposition: function(){
			$(".atw_tab_title_scroll", this.target).css("left", "0px");
			$(".atw_tab_content_scroll", this.target).css("left", "0px");
		},
		
        /**
         * 组件名称
         * @type {String}
         */
        WIDGET_NAME: "选项卡"		
        
	});
})(ATW);