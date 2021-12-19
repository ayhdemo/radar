(function(atw){
	/**
	 * js可视化基础组件
	 * @module Control
	 * @class ATW.Control
	 * @extends ATW.Component
	 * @author cqb
	 * @version 2.1
	 */
    atw.extendClass("Control",atw.Component,{
        /**
         * 所有的特效
         * @type {Boolean}
         * @property animations
         */
        animations: null,
        /**
         * 构造函数设置参数信息
         * @constructor
         * @param {Object} options 参数对象
         */
        initialize : function(options){
        	atw.Component.prototype.initialize.apply(this,arguments);
        },

        /**
         * 事件处理
         * @private
         * @method doEvent
         * @param {Object} obj 事件对象
         * @return {void}
         */
        doEvent : function(obj){
            obj.target = this;
            switch(obj.eventId){
                case atw.Parameter.EVENTID.ANCHOR : {           //锚处理事件
                    this.doAnchor(obj);
                    break;
                }
            }
        },
        
        /**
         * 显示组件本身
         * @method show
         * @return {void}
         */
        show: function(){
        	jQuery(this.target).show();
        },
        
        /**
         * 隐藏组件本身
         * @method hide
         * @return {void}
         */
        hide: function(){
        	jQuery(this.target).hide();
        },

        /**
         * 注销销毁本身
         * @method destroy
         * @return {void}
         */
        destroy: function(){
        	var original = jQuery(this.target).data("original");
        	jQuery(this.target).before(original);
        	jQuery(this.target).removeData("original");
        	jQuery(this.target).removeData(this.CLASS_NAME);
        	var tmp = jQuery(this.target).remove();
        	tmp = null;
        },
		
		/**
         * 组件名称
         * @type {String}
         * @property WIDGET_NAME
         * @final
         */
        WIDGET_NAME: "可视化组件"
    });
})(ATW);