(function($) {
	/**
	 * 创建类并实现类之间的继承
	 * ATW.extendClass
	 * @module ATW
	 * @author cqb
	 * @version 2.1
	 */
	$.fn.extend({
		extendClass : function() {
			var extended = {};
			var parent, _initialize, Type;
			var classpath = arguments[0];
			
			for ( var i = 1, len = arguments.length; i < len; ++i) {
				Type = arguments[i];
				if (typeof Type == "function") {
					// make the class passed as the first argument the
					// superclass
					if (i == 1 && len > 1) {
						_initialize = Type.prototype.initialize;
						// replace the _initialize method with an empty function,
						// because we do not want to create a real instance here
						Type.prototype.initialize = function() {
						};
						// the line below makes sure that the new class has a
						// superclass
						extended = new Type();
						// restore the original _initialize method
						if (_initialize === undefined) {
							delete Type.prototype.initialize;
						} else {
							Type.prototype.initialize = _initialize;
						}
					}
					// get the prototype of the superclass
					parent = Type.prototype;
				} else {
					// in this case we're extending with the prototype
					parent = Type;
				}
				jQuery.extend(extended, parent);
			}
			
			var Class = _createPackages(classpath);
			
			function _createPackages(path){
				var packages = path.split(".");
				var parent = jQuery.fn;
				for(var i = 0; i< packages.length - 1; i++){
					if(!parent[packages[i]]){
						parent[packages[i]] = {};
					}
					parent = parent[packages[i]];
				}
				var classname = packages[packages.length - 1];
				
				var zlass = parent[classname] = function(options){
					var args = arguments;
					if (arguments && arguments[0] != ATW.extendClass.isPrototype) {
						if (this.each) {
							if(this.data(classname)){
								if(typeof(options) == "string"){
									var clazz = this.data(classname);
									if(clazz[options] && typeof(clazz[options]) == 'function'){
										return clazz[options].apply(clazz, Array.prototype.slice.call(arguments, 1));
									}
								}
							}else{
								return this.each(function(index) {
									var F = function(){};
									F.prototype = extended;
									var clazz = new F();
									jQuery(this).data(classname, clazz);
									if(!jQuery(this).data("original")){
										jQuery(this).data("original", jQuery(this).clone(true));
									}
									clazz.CLASS_NAME = F.prototype.CLASS_NAME = classname;
									clazz.target = this;
									if (clazz.initialize) {
										clazz.initialize.apply(clazz, args);
									}
								});
							}
						} else {
							this.CLASS_NAME = classname;
							this.initialize.apply(this, arguments);
						}
					}
				};
				
				return zlass;
			}
			Class.prototype = extended;
			return Class;
		}
	});
	$.fn.extendClass.isPrototype = function () {};
	if(window.ATW == undefined || ATW == undefined){
		ATW = window.ATW = jQuery.fn;
	}
})(jQuery);