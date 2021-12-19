/**
 * @author cqb
 */
;(function(){
	/**
	 * 数组类扩展
	 * <pre>var a = new Array("111","222","333","111");
console.log("peek:"+a.peek());
console.log(a.indexOf("111",2));
console.log(a.lastIndexOf("111"));
a.forEach(function(item, index, arr){
	console.log("forEach "+index+" : "+ item);
});
var map = a.map(function(item, index, arr){
	return item+"-"+index;
});
console.log("a.map: "+map);
console.log(a.reduce(function(r,v,i,arr){
	return r+v;
},0));
console.log("a.some: "+a.some(function(item, index, arr){
	return item == "444";
}));
console.log("Array.contains: "+Array.contains(a, "333"));
console.log("a.contains: "+a.contains("333"));
a.insertAt("444", 4)
console.log(Array.defaultCompare);
a.clear();</pre>
	 * @module Window
	 * @class Array
	 * @author cqb
	 * @version 1.0
	 */
	
	/**
	 * 获取数组最后一个值但不删除它
	 * @method peek
	 */
	Array.prototype.peek = function(){
		return this[this.length-1];
	}
	
	/**
	 * 某一值在数组中的位置
	 * @method indexOf
	 * @param {String} obj 要检索的项
	 * @param {Number} from_inex 从from_index开始开始检索
	 * @return {Number} 该项在数组中的位置,-1 数组中不包含该项 
	 */
	Array.prototype.indexOf = Array.prototype.indexOf ? 
		Array.prototype.indexOf :
		function(obj, from_inex){
		var fromIndex = from_inex == null ?
		          0 : (from_inex < 0 ?
		               Math.max(0, this.length + from_inex) : from_inex);
		if (typeof(arr) == 'string') {
	        if (!typeof(obj) == 'string' || obj.length != 1) {
	          return -1;
	        }
	        return this.indexOf(obj, fromIndex);
		}
		for (var i = fromIndex; i < this.length; i++) {
			if (i in this && this[i] === obj){
				return i;
			}
		}
		return -1;
    }
	
	/**
	 * 某一值在数组中的最后位置
	 * @method lastIndexOf
	 * @param {String} obj 要检索的项
	 * @param {Number} from_inex 从from_index开始开始检索
	 * @return {Number} 该项在数组中的最后位置,-1 数组中不包含该项 
	 */
	Array.prototype.lastIndexOf = Array.prototype.lastIndexOf ? 
		Array.prototype.lastIndexOf :
		function(obj, from_inex){
			var fromIndex = from_inex == null ? this.length - 1 : from_inex;
			if (fromIndex < 0) {
		        fromIndex = Math.max(0, this.length + fromIndex);
			}
			if (typeof(arr) == 'string') {
		        if (!typeof(obj) == 'string' || obj.length != 1) {
		          return -1;
		        }
		        return this.lastIndexOf(obj, fromIndex);
			}
			for (var i = fromIndex; i >= 0; i--) {
		        if (i in this && this[i] === obj)
		          return i;
			}
			return -1;
		}
	
	/**
	 * 数组循环处理
	 * @method forEach
	 * @param {Function} f 循环处理的函数
	 * @param {Object} opt_obj f函数的执行类 默认可以null
	 */
	Array.prototype.forEach = Array.prototype.forEach ? 
		Array.prototype.forEach:
		function(f, opt_obj){
			var l = this.length;
			var arr2 = typeof(this) == 'string' ? this.split('') : this;
			for (var i = 0; i < l; i++) {
				if (i in arr2) {
					f.call(opt_obj, arr2[i], i, this);
				}
			}
		}
	/**
	 * 数组循环处理从最后开始
	 * @method forEach
	 * @param {Function} f 循环处理的函数
	 * @param {Object} opt_obj f函数的执行类 默认可以null
	 */
	Array.prototype.forEachRight = Array.prototype.forEachRight ? 
		Array.prototype.forEachRight:
		function(f, opt_obj){
			var l = this.length;
			var arr2 = typeof(this) == 'string' ? this.split('') : this;
			for (var i = l-1; i >= 0; i--) {
				if (i in arr2) {
					f.call(opt_obj, arr2[i], i, this);
				}
			}
		}
	/**
	 * 数组循环处理 返回处理完的结果数组
	 * @method map
	 * @param {Function} f 循环处理的函数 该函数需要返回处理结果
	 * @param {Object} opt_obj f函数的执行类 默认可以null
	 * @return {Array} 结果数组
	 */
	Array.prototype.map = Array.prototype.map ? 
		Array.prototype.map:
		function(f, opt_obj){
			var l = this.length;
			var res = new Array(l);
			var arr2 = typeof(this) == 'string' ? this.split('') : this;
			for (var i = 0; i < l; i++) {
				if (i in arr2) {
					res[i] = f.call(opt_obj, arr2[i], i, this);
				}
			}
			
			return res;
		}
	
	/**
	 * 数组过滤
	 * @method filter
	 * @param {Function} f 处理函数 该函数需要返回true/false
	 * @param {Object} opt_obj f函数的执行类 默认可以null
	 * @return {Array} 过滤结果
	 */
	Array.prototype.filter = Array.prototype.filter ? 
		Array.prototype.filter:
		function(f, opt_obj){
			var l = this.length;
			var res = [];
			var resLength = 0;
			var arr2 = typeof(this) == 'string' ? this.split('') : this;
			for (var i = 0; i < l; i++) {
				if (i in arr2) {
					var val = arr2[i];
					if (f.call(opt_obj, val, i, this)) {
			            res[resLength++] = val;
					}
				}
			}
			
			return res;
		}
	
	/**
	 * 数组分解处理
	 * @method reduce
	 * @param {Function} f 处理函数 该函数需要返回处理值
	 * @param {Object} val 初始值
	 * @param {Object} opt_obj f函数的执行类 默认可以null
	 * @return {Object} val最终结果
	 */
	Array.prototype.reduce = Array.prototype.reduce ? 
		Array.prototype.reduce:
		function(f, val, opt_obj){
			var rval = val;
			this.forEach(function(val, index){
				rval = f.call(opt_obj, rval, val, index, this);
			});
			
			return rval;
		}
	
	/**
	 * 是否存在某一项符合某要求
	 * @method some
	 * @param {Function} f 处理函数 该函数需要返回true/false
	 * @param {Object} opt_obj f函数的执行类 默认可以null
	 * @return {Boolean} true/false
	 */
	Array.prototype.some = Array.prototype.some ? 
		Array.prototype.some:
		function(f, opt_obj){
			var l = this.length;
			var arr2 = typeof(this) == 'string' ? this.split('') : this;
			for (var i = 0; i < l; i++) {
				if (i in arr2 && f.call(opt_obj, arr2[i], i, this)) {
					return true;
				}
			}
			return false;
		}
	
	/**
	 * 数组中是否所有的都符合某要求
	 * @method every
	 * @param {Function} f 处理函数 该函数需要返回true/false
	 * @param {Object} opt_obj f函数的执行类 默认可以null
	 * @return {Boolean} true/false
	 */
	Array.prototype.every = Array.prototype.every ? 
		Array.prototype.every:
		function(f, opt_obj){
			var l = this.length;
			var arr2 = typeof(this) == 'string' ? this.split('') : this;
			for (var i = 0; i < l; i++) {
				if (i in arr2 && !f.call(opt_obj, arr2[i], i, this)) {
					return false;
				}
			}
			return true;
		}
	
	/**
	 * 查找数组中的某一项 该项符合某要求
	 * @method find
	 * @param {Function} f 处理函数 该函数需要返回true/false
	 * @param {Object} opt_obj f函数的执行类 默认可以null
	 * @return {Object} 符合要求的项
	 */
	Array.prototype.find = Array.prototype.find ? 
		Array.prototype.find:
		function(f, opt_obj){
			var i = this.findIndex(f, opt_obj);
			return i < 0 ? null : typeof(this) == 'string' ? this.charAt(i) : arr[i];
		}
	
	/**
	 * 查找数组中的某一项的索引 该项符合某要求
	 * @method findIndex
	 * @param {Function} f 处理函数 该函数需要返回true/false
	 * @param {Object} opt_obj f函数的执行类 默认可以null
	 * @return {Number} 符合要求的项的索引
	 */
	Array.prototype.findIndex = Array.prototype.findIndex ? 
		Array.prototype.findIndex:
		function(f, opt_obj){
			var l = this.length;
			var arr2 = typeof(this) == 'string' ? this.split('') : this;
			for (var i = 0; i < l; i++) {
				if (i in arr2 && f.call(opt_obj, arr2[i], i, this)) {
					return i;
			    }
			}
			return -1;
		}
	
	/**
	 * 数组是否包含该值
	 * @method contains
	 * @param {Object} obj 要查找的对象
	 * @return {Boolean} true/false
	 */
	Array.prototype.contains = Array.prototype.contains ? 
		Array.prototype.contains:
		function(obj){
			return this.indexOf(obj) >= 0;
		}
	
	/**
	 * 数组是否为空
	 * @method isEmpty
	 * @return {Boolean} true/false
	 */
	Array.prototype.isEmpty = Array.prototype.isEmpty ? 
		Array.prototype.isEmpty:
		function(){
			return this.length == 0;
		}
	
	/**
	 * 数组是否包含该某值
	 * @method contains
	 * @param {Array} arr 要查找的数组
	 * @param {Object} obj 要查找的对象
	 * @return {Boolean} true/false
	 */
	Array.contains = function(arr, obj){
		return arr.contains(obj);
	}
	
	/**
	 * 数组是否为空
	 * @method isEmpty
	 * @return {Boolean} true/false
	 */
	Array.isEmpty = function(arr){
		return arr.isEmpty();
	}
	
	/**
	 * 清空数组
	 * @method clear
	 */
	Array.prototype.clear = Array.prototype.clear ? 
		Array.prototype.clear:
		function(){
			if (!typeof(this) == "array") {
			    for (var i = this.length - 1; i >= 0; i--) {
			      delete this[i];
			    }
			}
			this.length = 0;
		}
	
	/**
	 * 在数组中插入不存在的对象
	 * @method insert
	 * @param {Object} obj 要插入数组的对象
	 */
	Array.prototype.insert = Array.prototype.insert ? 
		Array.prototype.insert:
		function(obj){
			if(!this.contains(obj)){
				this.push(obj);
			}
		}
	
	/**
	 * 在数组的指定位置插入对象
	 * @method insertAt
	 * @param {Object} obj 要插入数组的对象
	 * @param {Number} index 索引
	 */
	Array.prototype.insertAt = Array.prototype.insertAt ? 
		Array.prototype.insertAt:
		function(obj, index){
			this.splice(index,0,obj);
		}
	
	/**
	 * 删除数组中存在某个值的项
	 * @method remove
	 * @param {Object} obj 要删除的对象
	 * @return {Number} 删除的对象的索引
	 */
	Array.prototype.remove = Array.prototype.remove ? 
		Array.prototype.remove:
		function(obj){
			var i = this.indexOf(obj);
			var v;
			if(v = i>= 0){
				this.removeAt(i);
			}
			return v;
		}
	
	/**
	 * 删除数组中某个索引的项
	 * @method removeAt
	 * @param {Number} i 要删除的对象的索引
	 * @return {Array} 删除对象后的数组
	 */
	Array.prototype.removeAt = Array.prototype.removeAt ? 
		Array.prototype.removeAt:
		function(i){
			return this.splice(i,1).length == 1;
		}
	
	/**
	 * 将某个类似数组的对象转化为数组 该对象中需要有length属性如String
	 * @method toArray
	 * @param {Object} object 要转化的对象
	 * @return {Array} 类的数组化数组，当不符合要求返回[]
	 */
	Array.toArray = Array.toArray ? 
		Array.toArray:
		function(object){
			var length = object.length;
			if (length > 0) {
			    var rv = new Array(length);
			    for (var i = 0; i < length; i++) {
			    	rv[i] = object[i];
			    }
			    return rv;
			}
			return [];
		}
	
	/**
	 * 克隆数组
	 * @method clone
	 * @param {Object} object 要克隆的数组
	 * @return {Array} 克隆后的数组
	 */
	Array.prototype.clone = Array.prototype.clone ? 
		Array.prototype.clone:
		function(){
			return Array.toArray(this);
		}
	
	/**
	 * 数组根据key排序
	 * @method sortObjectsByKey
	 * @param {String} key 排序的数组中对象的key
	 * @param {Function} opt_compareFn 进行对比的函数
	 * @return {Array} 排序后的数组
	 */
	Array.prototype.sortObjectsByKey = Array.prototype.sortObjectsByKey ? 
		Array.prototype.sortObjectsByKey:
		function(key, opt_compareFn){
			var compare = opt_compareFn || Array.defaultCompare;
			this.sort(function(a, b) {
			    return compare(a[key], b[key]);
			});
		}
	
	/**
	 * 数组默认比较函数
	 * @method defaultCompare
	 * @param {Object} a 比较的项
	 * @param {Object} b 比较的项
	 * @return {Number} 比较后的值 1： a>b 0 : a==b -1: a<b
	 */
	Array.defaultCompare = function(a, b){
		return a > b ? 1 : a < b ? -1 : 0;
	}
})();