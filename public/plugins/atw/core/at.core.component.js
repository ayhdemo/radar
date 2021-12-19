(function(atw){
	/**
	 * 运行时非可视化类
	 * 支持与编辑器交互，设计时可见，运行时不可见的非可视化组件
	 * @module Core
	 * @class ATW.Component
	 * @extends ATW.Object
	 * @author cqb
	 * @version 2.1
	 */
	atw.extendClass("Component",atw.Object,{
        /**
         * 设置参数信息
         * @constructor
         * @method initialize
         * @param initObj {Object} 构造参数对象
         */
        initialize : function(options){
        	atw.Object.prototype.initialize.apply(this,arguments);
        }
    });
})(ATW);