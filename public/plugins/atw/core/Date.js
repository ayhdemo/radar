/**
 * @author cqb
 */
;(function(){
	/**
	 * 时间对象 重写Date
	 * <pre>var date = new Date();
console.log(date);
console.log("getDate: "+ date.getDate());
console.log("getTime: "+ date.getTime());
console.log("getDay: "+ date.getDay());
console.log("getFullYear: "+ date.getFullYear());
console.log("getHours: "+ date.getHours());
console.log("getMilliseconds: "+ date.getMilliseconds());
console.log("getMinutes: "+ date.getMinutes());
console.log("getMonth: "+ date.getMonth());
console.log("getSeconds: "+ date.getSeconds());
console.log("getTimezoneOffset: "+ date.getTimezoneOffset());
console.log("getYear: "+ date.getYear());
console.log("toString: "+ date.toString());
date.setDate(21);
console.log("setDate(21): "+ date.toString());
console.log("plus('dd',5): "+ date.plus('dd',5));
console.log("plus('MM',1): "+ date.plus('MM',1));
console.log("plus('yy',1): "+ date.plus('yy',1));
console.log("plus('hh',1): "+ date.plus('hh',1));
console.log("plus('mm',1): "+ date.plus('mm',1));
console.log("plus('ss',1): "+ date.plus('ss',1));
console.log("plus('dd',5): "+ date.plus('dd',-5));
console.log("plus('MM',1): "+ date.plus('MM',-1));
console.log("plus('yy',1): "+ date.plus('yy',-1));
console.log("plus('hh',1): "+ date.plus('hh',-1));
console.log("plus('mm',1): "+ date.plus('mm',-1));
console.log("plus('ss',1): "+ date.plus('ss',-1));
console.log("minus('dd',1): "+ date.minus('dd',1));
console.log("format('yyyy-MM-dd hh:mm:ss'): "+ date.format('yyyy-MM-dd hh:mm:ss S'));
console.log(date.minusDate(new Date("2012-11-20 15:29:00")));
console.log("validate: "+ Date.validate("2222-12-23"));
	 * @class Date
	 * @author cqb
	 * @version 1.0
	 */
	var __Date = window.Date;
	
	var dateFormat = function(fmt, date){
		var o = {
	    	"M+" : date.getMonth()+1,                 //月份   
	    	"d+" : date.getDate(),                    //日   
	    	"h+" : date.getHours(),                   //小时   
	    	"m+" : date.getMinutes(),                 //分   
	    	"s+" : date.getSeconds(),                 //秒   
	    	"q+" : Math.floor((date.getMonth()+3)/3), //季度
	    	"S"  : date.getMilliseconds()             //毫秒   
	  	};
		if(/(y+)/.test(fmt))   
	    	fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
	  	for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}
	Date = function(date){
		var args = arguments;
		if(args.length > 1){
			var params= [];
			for(var i = 0; i<args.length; i++){
				params.push("args["+i+"]");
			}
			this.__date = eval("new __Date("+params.join(",")+")");
		}else{
			if(date){
				if(typeof(date) == 'number'){
					this.__date = new __Date(date);
				}else if(typeof(date) == 'string'){
					this.__date = new __Date(date);
					if(isNaN(this.__date)){
						this.__date = Date.fromString(date);
					}
				}
			}else{
				this.__date = new __Date();
			}
		}
		
		if(!this.__date){
			this.__date = new __Date();
		}
	}
	
	/**
	 * 时间格式化
	 * @method format
	 * @static
	 * @param {String} fmt 时间格式化样式
	 * @param {Date} date 时间对象
	 * @return {String} 格式化后的时间字符串
	 */
	Date.format = dateFormat;
	
	/**
	 * 解析一个包含日期的字符串，2012-11-26/2012-11-26 14:08:00/ 2012/11/26
	 * @method fromString
	 * @param {String} str 时间字符串
	 * @return {Date} 返回一个时间对象
	 */
	Date.fromString = function(str){
		var d = null;
		var reg = new RegExp('^(\\d{4})(?:(?:[-|/]?(\\d{2})(?:[-|/]?(\\d{2}))?))');
		var ret = str.match(reg);
		if(!ret){
			return null;
		}
		var year = parseInt(ret[1]);
		var month = parseInt(ret[2]);
		var day = parseInt(ret[3]);
		d = new __Date(year, month-1, day);
		
		var reg = /(\d{2})(?::?(\d{2})(?::?(\d{2})(\.\d+)?)?)+$/;
		var ret = str.match(reg);
		
		if(ret){
			d.setHours(parseInt(ret[1]));
			d.setMinutes(parseInt(ret[2]));
			d.setSeconds(parseInt(ret[3]));
		}
		
		return d;
	};
	
	/**
	 * 解析字符串
	 * @method parse
	 * @param {String} str 时间字符串
	 * @return {Number} 返回一个整数值，这个整数表示 dateVal 中所包含的日期与 1970 年 1 月 1 日午夜之间相间隔的毫秒数
	 */
	Date.parse = __Date.parse;
	
	Date.UTC = __Date.UTC;
	
	Date.prototype = {
		__plusMethod: {"yy": "Year","MM":"Month","dd":"Date","hh":"Hours","mm":"Minutes","ss":"Seconds","S":"Milliseconds"},
		os: 1000,
		om: 60000,
		oh: 3600000,
		od: 24*3600000,
		
		/**
		 * 返回 Date 对象中的时间值
		 * @method getTime
		 * @return {Number} 返回一个整数值,这个整数代表了从1970年1月1日开始计
		 * 算到Date对象中的时间之间的毫秒数
		 */
		getTime: function(){
			return this.__date.getTime();
		},
		
		/**
		 * 返回一个月中的日期值
		 * @method getDate
		 * @return {Number} 返回值是一个处于 1 到 31 之间的整数，它代表了相应的 Date 对象中的日期值
		 */
		getDate: function(){
			return this.__date.getDate();
		},
		
		/**
		 * 返回一周中的日期值
		 * @method getDay
		 * @return {Number} 返回的值是一个处于 0 到 6 之间的整数，它代表了一周中的某一天
		 *	0 星期天 
		 *	1 星期一 
		 *	2 星期二 
		 *	3 星期三 
		 *	4 星期四 
		 *	5 星期五 
		 *	6 星期六
		 */
		getDay: function(){
			return this.__date.getDay();
		},
		
		/**
		 * 返回 Date 对象中用本地时间表示的年份值
		 * @method getFullYear
		 * @return {Number} 以绝对数字的形式返回年份值
		 */
		getFullYear: function(){
			return this.__date.getFullYear();
		},
		
		/**
		 * 返回 Date 对象中用本地时间表示的小时值
		 * @method getHours
		 * @return {Number} 方法返回一个处于 0 到 23 之间的整数，这个值表示从午夜开始计算的小时数。
		 */
		getHours: function(){
			return this.__date.getHours();
		},
		
		/**
		 * 返回 Date 对象中用本地时间表示的毫秒值
		 * @method getMilliseconds
		 * @return {Number} 所返回的毫秒值处于 0-999 之间
		 */
		getMilliseconds: function(){
			return this.__date.getMilliseconds();
		},
		
		/**
		 * 返回 Date 对象中用本地时间表示的分钟值
		 * @method getMinutes
		 * @return {Number} 方法返回一个处于 0 到 59 之间的整数，返回值就等于保存在 Date 对象中的分钟值
		 */
		getMinutes: function(){
			return this.__date.getMinutes();
		},
		
		/**
		 * 返回 Date 对象中用本地时间表示的月份值
		 * @method getMonth
		 * @return {Number} 一个处于 0 到 11 之间的整数，它代表 Date 对象中的月份值
		 */
		getMonth: function(){
			return this.__date.getMonth();
		},
		
		/**
		 * 返回 Date 对象中用本地时间表示的秒钟值
		 * @method getSeconds
		 * @return {Number} 一个处于 0 到 59 之间的整数，它表示了相应的 Date 对象中的秒钟值
		 */
		getSeconds: function(){
			return this.__date.getSeconds();
		},
		
		/**
		 * 返回用分钟表示的主计算机上的时间和全球标准时间 (UTC)之间的差别
		 * @method getTimezoneOffset
		 * @return {Number} 返回一个整数值，这个整数代表了当前计算机上的时间和 UTC 之间相差的分钟数
		 */
		getTimezoneOffset: function(){
			return this.__date.getTimezoneOffset();
		},
		
		/**
		 * 返回 Date 对象中的年份值
		 * @method getYear
		 * @return {Number} 这个方法已经过时，之所以提供这个方法，是为了保持向后的兼容性。
		 * 请改用 getFullYear 方法。
		 */
		getYear: function(){
			return this.__date.getYear();
		},
		
		/**
		 * 返回 Date 对象中用全球标准时间 (UTC)表示的日期
		 * @method getUTCDate
		 * @return {Number} 一个处于 1 到 31 之间的整数值，这个整数代表了 Date 对象中的日期值
		 */
		getUTCDate: function(){
			return this.__date.getUTCDate();
		},
		
		/**
		 * 返回 Date 对象中用全球标准时间 (UTC)表示的一周中的日期值
		 * @method getUTCDay
		 * @return {Number} 一个处于 0 到 6 之间的整数，它代表了一周中的某一天
		 */
		getUTCDay: function(){
			return this.__date.getUTCDay();
		},
		
		/**
		 * 返回 Date 对象中用全球标准时间 (UTC)表示的年份值
		 * @method getUTCFullYear
		 * @return {Number} 以绝对数字的形式返回年份值
		 */
		getUTCFullYear: function(){
			return this.__date.getUTCFullYear();
		},
		
		/**
		 * 返回 Date 对象中用全球标准时间 (UTC)表示的小时值
		 * @method getUTCHours
		 * @return {Number} 一个处于 0 到 23 之间的整数，这个整数代表了从午夜开始所经过的小时数
		 */
		getUTCHours: function(){
			return this.__date.getUTCHours();
		},
		
		/**
		 * 返回 Date 对象中用全球标准时间 (UTC)表示的毫秒值
		 * @method getUTCMilliseconds
		 * @return {Number} 秒值的范围是 0-999
		 */
		getUTCMilliseconds: function(){
			return this.__date.getUTCMilliseconds();
		},
		
		/**
		 * 返回 Date 对象中用全球标准时间 (UTC)表示的分钟值
		 * @method getUTCMinutes
		 * @return {Number} 一个处于 0 到 59 之间的整数，这个整数就等于包含在 Date 对象中的分钟数的值
		 */
		getUTCMinutes: function(){
			return this.__date.getUTCMinutes();
		},
		
		/**
		 * 返回 Date 对象中用全球标准时间 (UTC)表示的月份值
		 * @method getUTCMonth
		 * @return {Number} 一个处于 0 到 11 之间的整数，这个整数就表示 Date 对象中的月份值
		 */
		getUTCMonth: function(){
			return this.__date.getUTCMonth();
		},
		
		/**
		 * 返回 Date 对象中用全球标准时间 (UTC)表示的秒钟值
		 * @method getUTCSeconds
		 * @return {Number} 一个处于 0 到 59 之间的整数，这个整数表示相应的 Date 对象中的秒钟数
		 */
		getUTCSeconds: function(){
			return this.__date.getUTCSeconds();
		},
		
		/**
		 * 设置 Date 对象中用本地时间表示的数字日期
		 * 如果 numDate 的值大于 Date 对象中所保存的月份的天数或者是负数。那么日期将被设置为由 numDate 减去所保存月份中天数而得到的日期
		 * @method setDate
		 * @param {Number} d 是一个等于数字日期的数值
		 */
		setDate: function(d){
			this.__date.setDate(d);
		},
		
		/**
		 * 设置 Date 对象中用全球标准时间 (UTC)表示的数值日期
		 * @method setUTCDate
		 * @param {Number} numDate 是一个与数值日期相等的数值
		 */
		setUTCDate: function(numDate){
			this.__date.setUTCDate(numDate);
		},
		
		/**
		 * 设置 Date 对象中用全球标准时间 (UTC)表示的年份值
		 * @method setUTCFullYear
		 * @param {Number} numYear 一个等于年份的数值
		 * @param {Number} numMonth 一个等于月份的数值。如果提供了 numDate，那么也必须提供此项
		 * @param {Number} numDate 一个等于日期的数值
		 */
		setUTCFullYear: function(){
			this.__date.setUTCFullYear.apply(this.__date, arguments);
		},
		
		/**
		 * 设置 Date 对象中用全球标准时间 (UTC)表示的小时值
		 * @method setUTCHours
		 * @param {Number} numHours 等于小时值的数值
		 * @param {Number} numMin 等于分钟值的数值
		 * @param {Number} numSec 等于秒钟值的数值
		 * @param {Number} numMilli 等于毫秒值的数值
		 */
		setUTCHours: function(){
			this.__date.setUTCHours.apply(this.__date, arguments);
		},
		
		/**
		 * 设置 Date 对象中用全球标准时间 (UTC)表示的毫秒值
		 * @method setUTCMilliseconds
		 * @param {Number} numMilli 等于毫秒值的数值
		 */
		setUTCMilliseconds: function(numMilli){
			this.__date.setUTCMilliseconds(numMilli);
		},
		
		/**
		 * 设置 Date 对象中用全球标准时间 (UTC)表示的分钟值
		 * @method setUTCMinutes
		 * @param {Number} numMin 等于分钟值的数值
		 * @param {Number} numSec 等于秒钟值的数值
		 * @param {Number} numMilli 等于毫秒值的数值
		 */
		setUTCMinutes: function(){
			this.__date.setUTCMinutes.apply(this.__date, arguments);
		},
		
		/**
		 * 设置 Date 对象中用本地时间表示的年份值
		 * @method setFullYear
		 * @param {Number} y 一个等于年份的数值
		 * @param {Number} m 一个等于月份的数值。如果提供了 d，那么此项也必须提供(可选)
		 * @param {Number} d 一个等于日期的数值(可选)
		 */
		setFullYear: function(y,m,d){
			var args = [];
			y != undefined ? args.push(y) : false;
			m != undefined ? args.push(m) : false;
			d != undefined ? args.push(d) : false;
			this.__date.setFullYear.apply(this.__date, args);
		},
		
		/**
		 * 设置 Date 对象中用本地时间表示的小时值
		 * @method setHours
		 * @param {Number} numHours 一个等于小时值的数值
		 * @param {Number} numMin 一个等于分钟值的数值。如果使用了下面的参数，那么此参数也必须提供(可选)
		 * @param {Number} numSec 一个等于秒钟值的数值。如果使用了下面的参数，那么此参数也必须提供(可选)
		 * @param {Number} numMilli 一个等于毫秒值的数值(可选)
		 */
		setHours: function(){
			this.__date.setHours.apply(this.__date, arguments);
		},
		
		/**
		 * 设置 Date 对象中用本地时间表示的毫秒值
		 * @method setMilliseconds
		 * @param {Number} m 是一个等于毫秒值的数值
		 */
		setMilliseconds: function(m){
			this.__date.setMilliseconds(m);
		},
		
		/**
		 * 设置 Date 对象中用 本地时间表示的分钟值
		 * @method setMinutes
		 * @param {Number} numMinutes 一个等于分钟值的数值
		 * @param {Number} numSeconds 一个等于秒钟值的数值(可选)
		 * @param {Number} numMilli 一个等于毫秒值的数值(可选)
		 */
		setMinutes: function(){
			this.__date.setMinutes.apply(this.__date, arguments);
		},
		
		/**
		 * 设置 Date 对象中用 本地时间表示的月份值
		 * @method setMonth
		 * @param {Number} numMonth 一个等于月份值的数值
		 * @param {Number} dateVal 一个代表日期的数值(可选)
		 */
		setMonth: function(){
			this.__date.setMonth.apply(this.__date,arguments);
		},
		
		/**
		 * 设置 Date 对象中用全球标准时间 (UTC)表示的月份值
		 * @method setUTCMonth
		 * @param {Number} numMonth 一个等于月份值的数值
		 * @param {Number} dateVal 一个代表日期的数值(可选)
		 */
		setUTCMonth: function(){
			this.__date.setUTCMonth.apply(this.__date,arguments);
		},
		
		/**
		 * 设置 Date 对象中用 本地时间表示的秒钟值
		 * @method setSeconds
		 * @param {Number} numSeconds 等于秒钟值的数值
		 * @param {Number} numMilli 等于毫秒值的数值(可选)
		 */
		setSeconds: function(){
			this.__date.setSeconds.apply(this.__date, arguments);
		},
		
		/**
		 * 设置 Date 对象中用全球标准时间 (UTC)表示的秒钟值
		 * @method setUTCSeconds
		 * @param {Number} numSeconds 等于秒钟值的数值
		 * @param {Number} numMilli 等于毫秒值的数值(可选)
		 */
		setUTCSeconds: function(){
			this.__date.setUTCSeconds.apply(this.__date, arguments);
		},
		
		/**
		 * 设置 Date 对象的日期和时间值
		 * @method setTime
		 * @param {Number} milliseconds 是一个整数值，它代表从格林威治标准时间（GMT）的 1970 年 1 月 1 日午夜开始所经过的毫秒数
		 */
		setTime: function(milliseconds){
			this.__date.setTime(t);
		},
		
		/**
		 * 设置 Date 对象中的年份值
		 * @method setTime
		 * @param {Number} y 其数值等于年份减去 1900
		 */
		setYear: function(y){
			this.setFullYear(y);
		},
		
		/**
		 * 返回对象的字符串表示
		 * @method toString
		 * @return {String} 时间字符串
		 */
		toString: function(){
			return this.__date.toString();
		},
		
		/**
		 * 格林威治标准时间 (GMT) 表示并已被转换为字符串
		 * @method toGMTString
		 * @return {String} 时间字符串
		 */
		toGMTString: function(){
			return this.__date.toGMTString();
		},
		
		/**
		 * 返回一个日期，该日期使用当前区域设置并已被转换为字符串
		 * @method toLocaleString
		 * @return {String} 时间字符串
		 */
		toLocaleString: function(){
			return this.__date.toLocaleString();
		},
		
		/**
		 * 返回一个已被转换为字符串的，用全球标准时间 (UTC)表示的日期
		 * @method toUTCString
		 * @return {String} 时间字符串
		 */
		toUTCString: function(){
			return this.__date.toUTCString();
		},
		
		/**
		 * 时间相加
		 * @method plus
		 * @param {String} partten 代表要相加的是年份月份等
		 * yy: 年份
		 * MM：月份
		 * dd：日期
		 * hh: 小时
		 * mm：分钟
		 * ss：秒
		 * S：毫秒
		 * @param {Number} num 相应部分要相加的值
		 * @return {Date} 相加后的时间对象
		 */
		plus: function(partten, num){
			if(partten){
				var setmethodname = this["set" + this.__plusMethod[partten]];
				var getmethodname = this["get" + this.__plusMethod[partten]];
				var curr = getmethodname.call(this,[]);
				setmethodname.apply(this, [curr+num]);
			}
			return this;
		},
		
		/**
		 * 时间相减
		 * @method minus
		 * @param {String} partten 代表要相加的是年份月份等
		 * yy: 年份
		 * MM：月份
		 * dd：日期
		 * hh: 小时
		 * mm：分钟
		 * ss：秒
		 * S：毫秒
		 * @param {Number} num 相应部分要相减的值
		 * @return {Date} 相减后的时间对象
		 */
		minus: function(partten, num){
			return this.plus(partten, -num);
		},
		
		/**
		 * 两个时间相减后的时间
		 * @method minusDate
		 * @param {Date} date 要相减的时间对象
		 * @return {Object} 形如:
		 * 	{	
		 * 		date: days,	相差的天数
		 *		hours: hours, 相差的小时数
		 *		minutes: minutes,	相差的分钟
		 *		seconds: seconds,	相差的秒数
		 *		milliseconds: milliseconds, 相差的毫秒数
		 *		time: _long	相差的毫秒时间总数
			}
		 */
		minusDate: function(date){
			var _long = this.getTime() - date.getTime();
			var days = parseInt(_long / this.od);
			var hours = parseInt(_long % this.od / this.oh);
			var minutes = parseInt(_long % this.oh / this.om);
			var seconds = parseInt(_long % this.om / this.os);
			var milliseconds = parseInt(_long % this.os);
			
			return {
				date: days,
				hours: hours,
				minutes: minutes,
				seconds: seconds,
				milliseconds: milliseconds,
				time: _long
			}
		},
		
		/**
		 * 时间格式化
		 * @method format
		 * @param {String} fmt 格式化样式
		 * @param {Date} date 要格式化的时间对象(可选)
		 * @return {String} 格式化后的时间字符串
		 */
		format: function(fmt, date){
			var date = date ? date : this;
			return dateFormat(fmt, date);
		}
	}
})();