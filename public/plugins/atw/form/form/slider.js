;(function(atw){
	/**
	 * 滑动条组件
	 * @module Control
	 * @class ATW.Slider
	 * @author cgq
	 * @version 2.1
	 */
	atw.extendClass("Slider",atw.Control,{
		/**
		 * 是否拖拽
		 * @type {Boolean}
		 * @property isdragging
		 * @default false
		 */
		isdragging: false,
		/**
		 * 皮肤
		 * @type {String}
		 * @property theme
		 * @default a
		 */
		theme: "a",
		/**
		 * 上一次移动标记
		 * @type {Number}
		 * @property lastpos
		 * @default 0
		 */
		lastpos: 0,
		/**
		 * 偏移量
		 * @type {Number}
		 * @property offset
		 * @default 0
		 */
        offset: 0,
        /**
		 * 最小值
		 * @type {Number}
		 * @property min
		 * @default 0
		 */
        min: 0,
        /**
		 * 最大值
		 * @type {Number}
		 * @property max
		 * @default 100
		 */
		max: 100,
		/**
		 * 步长
		 * @type {Number}
		 * @property step
		 * @default 1
		 */
		step: 1,
		/**
		 * 滑动标记量
		 * @type {Number}
		 * @property eleft
		 * @default 0
		 */
		eleft: 0,
		/**
		 * 当前显示值
		 * @type {Number}
		 * @property value
		 * @default 0
		 */
		value: 0,
		/**
		 * 当前对象
		 * @type {Object}
		 * @property slider
		 * @default null
		 */
		slider: null,
		
		mousemovehandler: null,
		
		mouseuphandler: null,
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
		 * 入口
		 * @private
		 * @method _render
		 */
		_render: function(){
			this._getOptions();
			
			this._create();
			
			this._listerner();
		},
		/**
		 * 获取参数
		 * @private
		 * @method _getOptions
		 */
		_getOptions: function(){
			this.theme = jQuery(this.target).attr("data-theme") || this.theme;
			this.step = parseInt(jQuery(this.target).attr("data-step") || this.step);
			this.min = parseInt(jQuery(this.target).attr("data-min") || this.min);
			this.max = parseInt(jQuery(this.target).attr("data-max") || this.max);
			this.value = parseInt(jQuery(this.target).val() || this.value);
		},
		/**
		 * 创建switch结构
		 * @private
		 * @method _create
		 */
		_create: function(){
			var slider = jQuery('<span class="atw_slider atw_slider_color atw_theme_'+ this.theme +'"></span>');
			var active = jQuery('<span class="atw_slider_active atw_active_color"></span>');
			var point = jQuery('<span class="atw_slider_point atw_drag"></span>');
			jQuery(this.target).wrap(slider);
			jQuery(this.target).hide();
			this.slider = $(this.target).parent();
			this.slider.append(active);
			this.slider.append(point);
			
			var w = this.slider.width();
			var h = this.slider.height();
			this.eleft = this.value/(this.max - this.min)*w;
			jQuery(".atw_slider_point", this.slider).width(h+8).height(h+8);
			var pointh = $(".atw_slider_point", this.slider).width();
			jQuery(".atw_slider_point", this.slider).css("margin-top", -(pointh-h)/2);
			jQuery(".atw_slider_point", this.slider).css("margin-left", -pointh/2);
			jQuery(".atw_slider_point", this.slider).css("margin-right", -pointh/2);
			this.refresh(this.value);
		},
		/**
		 * 事件监听函数
		 * @private
		 * @method _listerner
		 */
		_listerner: function(){
			var self = this;
			//鼠标按下监听事件
			jQuery(self.slider).bind("mousedown", function(evt){
				self.isdragging = true;
				self.lastpos = 0;
				if(evt.target == $(".atw_slider_point", self.slider)[0]){
					var x = evt.offsetX;
					var w = $(".atw_slider_point", self.slider).width();
					var slidew = $(self.slider).width();
					var offx = x - w/2;
					self.eleft += offx;
					if(self.eleft <= slidew){
						jQuery(".atw_slider_active", self.slider).css("width", self.eleft);
					}
				}else{
					self.eleft = evt.offsetX;
					jQuery(".atw_slider_active", self.slider).css("width", self.eleft);
				}
				return false;
			});
			//鼠标移动监听事件
			this.mousemovehandler = function(evt){
				if(self.isdragging == true){
					var pos = evt.pageX;
					self.offset = self.lastpos ? pos - self.lastpos : 0;
					self.lastpos = pos;
					self._animate();
				}
			}
			jQuery(document).bind("mousemove", this.mousemovehandler);
			//鼠标弹起监听事件
			this.mouseuphandler = function(evt){
				if(self.isdragging == true){
					self.isdragging = false;
				}
				self._setSliderValue(self.eleft);
			}
			jQuery(document).bind("mouseup", this.mouseuphandler);
		},
		/**
		 * 鼠标拖动
		 * @private
		 * @method _animate
		 */
		_animate: function(){
			var w = this.slider.width();
			this.eleft += this.offset;
			if(this.eleft >= 0 && this.eleft <= w){
				jQuery(".atw_slider_active", this.slider).css("width", this.eleft);
				//值随着动画动
				this._setSliderValue(this.eleft);
			}
		},
		/**
		 * 布局
		 * @private
		 * @method _setSliderValue
		 */
		_setSliderValue: function(eleft){
			var width = $(this.slider).innerWidth();
			var pixelval = (width/(this.max - this.min))*this.step;
			var val = parseInt(eleft/pixelval);
			
			if((eleft%pixelval)*2 >= pixelval){
				this.value = this.min + (val+1)*this.step;
			}else{
				this.value = this.min + val*this.step;
			}
			if(this.value > this.max){
				this.value = this.max;
			}else if(this.value < this.min){
				this.value = this.min;
			}
			jQuery(this.target).val(this.value);
			this.sliderChange(this.value);
		},
		/**
		 * 重设滑动条的值
		 * @private
		 * @method refresh
		 */
		refresh: function(value){
			var w = this.slider.width();
			this.value = value;
			this.eleft = this.value/(this.max - this.min)*w;
			if(this.eleft >= w){
				jQuery(".atw_slider_active", this.slider).css("width", w);
			}else if(this.eleft <= 0){
				jQuery(".atw_slider_active", this.slider).css("width", 0);
			}else{
				jQuery(".atw_slider_active", this.slider).css("width", this.eleft);
			}
		},
		/**
		 * 滑动条的值改变
		 * @private
		 * @method refresh
		 */
		sliderChange: function(value){
		},
		/**
		 * 注销事件
		 */
		destroy: function(){
			jQuery(this.slider).unbind("mousedown");
			jQuery(document).unbind("mousemove",this.mousemovehandler);
			jQuery(document).unbind("mouseup", this.mouseuphandler);
			
			var original = jQuery(this.target).data("original");
        	jQuery(this.target).parent().before(original);
        	jQuery(this.target).removeData("original");
        	jQuery(this.target).removeData(this.CLASS_NAME);
        	var tmp = jQuery(this.target).parent().remove();
        	tmp = null;
		}
	});
	
	/**
	 * 页面载入后进行组件调用
	 */
	jQuery(function(){
		jQuery("input[data-role='slider']").Slider();
	});
})(ATW)