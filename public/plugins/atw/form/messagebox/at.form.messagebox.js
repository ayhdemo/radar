(function(atw) {
	/**
	 * 消息框
	 * <pre>ATW.MessageBox("你的消息");
ATW.MessageBox("你的消息",{
	'type' : 'error',
	'title' : '提示'
});

ATW.MessageBox("确认该操作?",{
	'type' : 'question',
	'title' : '提示',
	'buttons' : [ '确认', '取消' ],
	'onClose' : function(caption) {
		if (caption != "" && caption == "确认") {
			alert("该操作已经执行");
		} else {
			alert("该操作已经取消");
		}
	}
});
</pre>
	 * @module Control
	 * @class ATW.MessageBox
	 * @author cqb
	 * @version 2.1
	 * @edit xuhu 20150615
	 */
	atw.MessageBox = function(msg, options){
		new ATW.MessageDialog(msg, options);
	}
	
	/**
	 * @module Control
	 * @class ATW.MessageDialog
	 * @author cqb
	 * @version 2.1
	 */
	atw.extendClass('MessageDialog',atw.Object,{
		/**
		 * 特效时间
		 * @type Number
		 * @default 250
		 * @property animation_speed
		 */
		animation_speed:250,
		/**
		 * 自动关闭
		 * @type Number/Boolean
		 * @default false
		 * @property auto_close
		 */
		auto_close: false,
		/**
		 * 对话框按钮
		 * @type Boolean/Array
		 * @default true
		 * @property buttons
		 */
		buttons: true,
		/**
		 * 自定义样式类
		 * @type String
		 * @default false
		 * @property custom_class
		 */
		custom_class: false,
		/**
		 * 支持键盘事件
		 * @type Boolean
		 * @default true
		 * @property keyboard
		 */
		keyboard: true,
		/**
		 * 消息内容
		 * @type String
		 * @property message
		 */
		message: '',
		/**
		 * 消息容器
		 * @type DOM
		 * @property messagediv
		 */
		messagediv: '',
		/**
		 * 是否模态
		 * @type Boolean
		 * @default true
		 * @property modal
		 */
		modal: true,
		/**
		 * 是否支持点击遮盖层关闭
		 * @type Boolean
		 * @default true
		 * @property overlay_close
		 */
		overlay_close: true,
		/**
		 * 遮盖层透明度
		 * @type Float
		 * @default 0.9
		 * @property overlay_opacity
		 */
		overlay_opacity: .9,
		/**
		 * 定位
		 * @type String
		 * @default center
		 * @property position
		 */
		position: 'center',
		/**
		 * 标题
		 * @type String
		 * @property title
		 */
		title: ATWConstans["message_info"],
		/**
		 * 对话框类型
		 * @type String
		 * @default information
		 * @property type
		 */
		type: 'information',
		/**
		 * 消息居中
		 * @type Boolean
		 * @default true
		 * @property vcenter_short_message
		 */
		vcenter_short_message: true,
		/**
		 * 对话框宽度
		 * @type Float
		 * @property width
		 */
		width: 0,
		/**
		 * 对话框关闭回调
		 * @type Function
		 * @property onClose
		 */
		onClose: null,
		/**
		 * 遮盖层
		 * @type DOM
		 * @property overlay
		 */
		overlay: null,
		/**
		 * 对话框
		 * @type DOM
		 * @property dialog
		 */
		dialog: null,
		/**
		 * 是否初始化
		 * @type Boolean
		 * @default false
		 * @property inited
		 */
		inited: false,
		
		/**
         * 设置参数信息
         * @constructor
         * @param {Object} options 参数
         */
		initialize: function(msg, options){
        	this.message = msg;
        	atw.Object.prototype.initialize.apply(this,[options]);
        	this._render();
		},
		
		/**
		 * 渲染入口
		 * @method _render
		 * @private
		 */
		_render: function(){
			if(this.inited){
				return;
			}
			this.inited = true;
			
			//创建
			this._create();
			//定位
            this._draw();
		},
		
		/**
		 * 创建组件
		 * @method _create
		 * @private
		 */
		_create: function(){
			//遮盖层
			this._createOverLay();
			// 创建信息框
			this._createDialog();
			
            if(this.width){
            	this.dialog.css({'width' : this.width});
            }
            
            if (this.title){
                jQuery('<h3>', {'class': 'atw_msgdialog_title'}).html(this.title).appendTo(this.dialog);
            }
            
            this.messagediv = jQuery('<div>', {
                'class': 'atw_msgdialog_body' + (this._getType() != '' ? ' atw_msgdialog_icon atw_msgdialog_' + this._getType() : '')
            });
            if (this.vcenter_short_message){
                jQuery('<div>').html(this.message).appendTo(this.messagediv);
            }else{
            	this.messagediv.html(this.message);
            }
            
            this.messagediv.appendTo(this.dialog);
            
            //创建按钮
            this._createButtons();
            
            //insert the dialog box in the DOM
            this.dialog.appendTo('body');
            
            // if the browser window is resized
            jQuery(window).bind('resize', this._draw);

            // if dialog box can be closed by pressing the ESC key
            if (this.keyboard){
                // if a key is pressed
                jQuery(document).bind('keyup', this._keyup);
            }
            
            // if plugin is to be closed automatically after a given number of milliseconds
            if (this.auto_close !== false){
                setTimeout(this.close, this.auto_close);
            }
            $(".atw_msgdialog_overlay").css("height",document.body.clientHeight);
            $(".atw_msgdialog").css("top",(document.body.scrollTop));
		},
		
		/**
		 * 创建对话框
		 * @method _createDialog
		 * @private
		 */
		_createDialog: function(){
			// 创建信息框
            this.dialog = jQuery('<div>', {
                'class':'atw_msgdialog' + (this.custom_class ? ' ' + this.custom_class : '')
            }).css({
                'position':     'absolute',
                'left':         0,
                'top':          0,
                'z-index':      10001,
                'visibility':   'hidden'
            });
		},
		
		/**
		 * 创建对话框按钮并注册事件
		 * @method _createButtons
		 * @private
		 */
		_createButtons: function(){
			var self = this;
			var buttons = this._getButtons();
            if (buttons) {
                var button_bar = jQuery('<div>', {'class': 'atw_msgdialog_buttons'}).appendTo(this.dialog);
                jQuery.each(buttons, function(index, value) {
                    var button = jQuery('<div>', {
                        'class':    'atw_msgdialog_button' + index,
                        'class':    'atw_msgdialog_bt'
                    }).html(value);

                    button.bind('click', function() {
                    	self.close(value)
                    });

                    // append the button to the button bar
                    button.appendTo(button_bar);
                    
                    button.hover(function(){
                    	jQuery(this).addClass("hover");
                    },function(){
                    	jQuery(this).removeClass("hover");
                    });
                });

                jQuery('<div>', {'style': 'clear:both'}).appendTo(button_bar);
            }
		},
		
		/**
		 * 创建遮盖层
		 * @method _createOverLay
		 * @private
		 */
		_createOverLay: function(){
			if(this.modal){
                this.overlay = jQuery('<div>', {
                    'class':    'atw_msgdialog_overlay'
                }).css({
                    'position': 'absolute',
                    'left':     0,
                    'top':      0,
                    'opacity':  this.overlay_opacity,
                    'z-index':  10000
                });
                if (this.overlay_close){
                	this.overlay.bind('click', this.close);
                }
                this.overlay.appendTo('body');
			}
		},
		
		/**
		 * 获取对话框类型
		 * @method _getType
		 * @private
		 */
		_getType: function() {
            switch (this.type) {
                case 'confirmation':
                case 'error':
                case 'information':
                case 'question':
                case 'warning':
                    return this.type.charAt(0).toUpperCase() + this.type.slice(1).toLowerCase();
                    break;
                default:
                    return false;
            }
        },
        
        /**
		 * 获取对话框按钮
		 * @method _getButtons
		 * @private
		 */
        _getButtons: function() {
            if (this.buttons !== true && !jQuery.isArray(this.buttons)){
            	return false;
            }
            if (this.buttons === true){
                switch (this.type) {
                    case 'question':
                        this.buttons = [ATWConstans["button_yes"], ATWConstans["button_no"]];
                        break;
                    default:
                    	this.buttons = [ATWConstans["button_ok"]];
                }
			}
            return this.buttons.reverse();
        },
        
        /**
         * 关闭
         * @method close
         */
        close: function() {
        	var self = this;
        	this.inited = false;
            if (this.keyboard){
            	jQuery(document).unbind('keyup', this._keyup);
           	}
            jQuery(window).unbind('resize', this.draw);
            
            // if an overlay exists
            if (this.modal){
                this.overlay.animate({opacity: 0},this.animation_speed,function() {
                	self.overlay.remove();
                });
			}
            // animate dialog box's css properties
            this.dialog.animate({top: 0,opacity: 0},this.animation_speed, function() {
            	self.dialog.remove();
            });

            if (this.onClose && typeof this.onClose == 'function'){
                this.onClose(undefined != arguments[0] ? arguments[0] : '');
            }
        },
        
        /**
         * 键盘事件
         * @method _keyup
         * @private
         */
        _keyup: function(e) {
            //Esc
        	if (e.which == 27){
            	this.close();
            }
            // let the event bubble up
            return true;
        },
        
        /**
         * 定位
         * @method _draw
         * @private
         */
        _draw: function() {
           var viewport_width = jQuery(window).width(),
                viewport_height = jQuery(window).height(),
                dialog_width = this.dialog.width(),
                dialog_height = this.dialog.height(),
                values = {
                    'left':     0,
                    'top':      0,
                    'right':    viewport_width - dialog_width,
                    'bottom':   viewport_height - dialog_height,
                    'center':   (viewport_width - dialog_width) / 2,
                    'middle':   (viewport_height - dialog_height) / 2
                };
            
            if (this.modal){
                this.overlay.css({
                    'width':    viewport_width,
                    'height':   viewport_height
                });
			}
            
            // the dialog box will be in its default position, centered
            var dialog_left = values['center'];
            var dialog_top = values['middle'];
            
            // if short messages are to be centered vertically
            if (this.vcenter_short_message) {
                var message = this.messagediv.find('div:first'),
                    message_height = message.height(),
                    container_height = this.messagediv.height();
                
                // if we need to center the message vertically
                if (message_height < container_height){
                    message.css({
                        'margin-top':   (container_height - message_height) / 2
                    });
                }
            }
            this.dialog.css({
                'left':         dialog_left,
                'top':          dialog_top,
                'visibility':   'visible'
            });
            
            this.dialog.find('a[class^=atw_msgdialog_button]:first').focus();
            $(".atw_msgdialog_overlay").css("height",document.body.clientHeight);
            var margintop = document.body.scrollTop;
            $(".atw_msgdialog").css("margin-top",margintop);
        }
    });
})(ATW);