/**
 * @author cqb
 */
;(function(atw){
	/**
	 * 侧边菜单栏
	 * @class ATW.SideBar
	 * @extends ATW.Control
	 * @author cqb
	 * @version 2.1
	 */
	atw.extendClass("SideBar",atw.Control,{
		/**
		 * 停靠位置
		 * @type {String}
		 * @default left
		 * @property align
		 */
		align: "left",
		/**
		 * 特效时间
		 * @type {Number}
		 * @default 500
		 * @property speed
		 */
		speed: 500,
		/**
		 * 初始化
		 * @constructor
		 * @param {Object} options 参数
		 */
		initialize: function(options){
			atw.Control.prototype.initialize.apply(this,arguments);
			this._render();
		},
		
		/**
		 * 执行
		 * @private
		 * @method _render
		 */
		_render: function(){
			//创建sidebar结构
			this._create();
			//添加监听
			this._listeners();
		},
		
		/**
		 * 创建sidebar的结构
		 * @private
		 * @method _create
		 */
		_create: function(){
			var clazz = this.align == "left" ? "align_left" : "align_right";
			jQuery(this.target).addClass("atw_sidebar "+clazz);
			
			var tabs = jQuery(this.target).children("a");
			var conts = jQuery(this.target).children("div");
			
			tabs.addClass("atw_sidebar_tab");
			conts.addClass("atw_sidebar_content");
			
			var atw_sidebar_title = jQuery('<div class="atw_sidebar_title"></div>');
			atw_sidebar_title.append(tabs);
			jQuery(this.target).append(atw_sidebar_title);
			
			var atw_sidebar_main = jQuery('<div class="atw_sidebar_main"></div>');
			atw_sidebar_main.append(conts);
			jQuery(this.target).append(atw_sidebar_main);
		},
		
		/**
		 * 事件监听
		 * @private
		 * @method _listeners
		 */
		_listeners: function(){
			var self = this;
			$(".atw_sidebar_tab",this.target).each(function(index){
				$(this).click(function(){
					if ($(this).hasClass("active")) {
						$(this).removeClass("active");
						self._slideIn(index);
					}
					else {
						$(".atw_sidebar_tab",self.target).removeClass("active");
						$(this).addClass("active");
						
						self._slideIn(index, function(){
							window.setTimeout(function(){
								$(".atw_sidebar_content",self.target).eq(index).addClass("active");
								self._slideOut(index);
							}, 300);
						});
					}
				});
			});
		},
		
		/**
		 * 内容隐藏
		 * @private
		 * @method _slideIn
		 */
		_slideIn: function(index, cback){
			var self = this;
			var lor = $(this.target).hasClass("align_left") ? "marginLeft" : "marginRight";
			var main = $(".atw_sidebar_main", this.target);
			var w = main.outerWidth(true);
			var css = {};
			css[lor] = -w;
			if ($(".atw_sidebar_content.active", main).length) {
				main.animate(css, this.speed, function(){
					$(".atw_sidebar_content.active", main).removeClass("active");
					if (cback) {
						cback();
					}
					self.afterDeactive(index);
				});
			}else{
				if (cback) {
					cback();
				}
			}
		},
		
		/**
		 * 显示内容
		 * @private
		 * @method _slideOut
		 */
		_slideOut: function(index){
			var lor = $(this.target).hasClass("align_left") ? "marginLeft" : "marginRight";
			var css = {};
			css[lor] = -10+"px";
			var self = this;
			$(".atw_sidebar_main", this.target).animate(css, this.speed, function(){
				self.afterActive(index);
			});
		},
		
		/**
		 * 激活显示第n个tab项
		 * @method active
		 * @param {Number} index tab项索引
		 */
		active: function(index){
			$(".atw_sidebar_tab.active",this.target).removeClass("active");
			$(".atw_sidebar_tab",this.target).eq(index).addClass("active");
			var self = this;
			this._slideIn(index, function(){
				window.setTimeout(function(){
					$(".atw_sidebar_content",self.target).eq(index).addClass("active");
					self._slideOut(index);
				}, 300);
			});
		},
		
		/**
		 * 隐藏第n个tab项
		 * @method deactive
		 * @param {Number} index tab项索引
		 */
		deactive: function(index){
			if($(".atw_sidebar_tab",this.target).eq(index).hasClass("active")){
				$(".atw_sidebar_tab",this.target).eq(index).removeClass("active");
				this._slideIn(index);
			}
		},
		
		/**
		 * 激活显示第n个tab项的回调函数
		 * @method afterActive
		 * @param {Number} index tab项索引
		 */
		afterActive: function(index){
			
		},
		
		/**
		 * 隐藏第n个tab项的回调函数
		 * @method afterDeactive
		 * @param {Number} index tab项索引
		 */
		afterDeactive: function(index){
			
		},
		
		/**
		 * 组件名称
		 * @property WIDGET_NAME
		 * @type {String}
		 */
		WIDGET_NAME: "SideBar"
	});
})(ATW);