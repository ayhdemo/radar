(function(atw) {
	/**
	 * js组件基础类 所有的类都继承该类
	 * @module Core
	 * @class ATW.Object
	 * @author cqb
	 * @version 2.1
	 */
	atw.extendClass("Object",{
		/**
		 * 构造方法
		 * @constructor
		 * @method initialize
         * @param options {Object} 参数
         */
        initialize : function(options){
        	for(var o in options){
                this[o] = options[o];
            }
        	if($.browser&&$.browser.msie){
        		if($.browser.version == "6.0"){
        			atw.isIE6 = true;
        		}
        	}
        },
        
        /**
         * 提示出错信息
         * @method printError
         * @param {String} errorStr：错误信息
         * @event 向浏览器抛错误信息
         */
        printError : function(errorStr){
            window.status = errorStr;
            throw new Error(errorStr);
        },
        
        /**
         * 检测当前字符串是否是XML格式
         * @method checkStringOrXML
         * @param strOrXml {String} 测试XML
         * @return {Boolean} 是否是XML格式
         */
        checkStringOrXML : function(strOrXml){
            var isXml = false;
            var num1 = strOrXml.indexOf("<?xml");
            var num2 = strOrXml.indexOf("?>");
            if(num1 == 0 && num2 != -1){
                isXml = true;
            }
            return isXml;
        },
        
        /**
         * 获取某个页面元素的当前样式
         * @method getCurrentStyle
         * @param obj {DOM} 页面元素对象
         * @return {Object} 该页面元素当前的所有样式
         */
        getCurrentStyle: function(obj){
        	if(obj.currentStyle){ //for ies
        		return obj.currentStyle; //注意获取方式
        	}else{ //for others
        		return document.defaultView.getComputedStyle(obj,null);
        	}
        },
        
        /**
         * 获取系统的根路径
         * @method getRootPath
         * @return {String} 系统根路径
         */
    	getRootPath: function(){
    		var strFullPath=window.document.location.href;
			var strPath=window.document.location.pathname;
			var pos=strFullPath.indexOf(strPath);
			var prePath=strFullPath.substring(0,pos);
			var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1)+"/";
			
			return(prePath+postPath);
    	},
    	
    	/**
         * 将16进制颜色转换成rgb
         * @method hex2rgb
         * @param dataFormat16 {String} 16进制格式的颜色码
         * @return {String} rgb格式的颜色码
         */
        hex2rgb : function(dataFormat16){
            if(!dataFormat16){
                this.printError("调用hex2rgb方法时传入的参数“"+dataFormat16+"”非法！");
            }
            dataFormat16 = jQuery.trim(dataFormat16);
            dataFormat16 = this.replaceAll(dataFormat16,"#","");
            dataFormat16 = dataFormat16.toLowerCase();
            if(dataFormat16.length > 6){
                dataFormat16 = dataFormat16.substring(0,5);    
            }else if(dataFormat16.length < 6){
                for(var i=0,num=6-dataFormat16.length; i<num; i++){
                    dataFormat16 += "0";    
                }
            }
            var b = new Array();
            for(var x = 0; x < 3; x++){
                b[0] = dataFormat16.substr(x*2,2);
                b[3] = "0123456789abcdef";
                b[1] = b[0].substr(0,1);
                b[2] = b[0].substr(1,1);
                b[20+x] = b[3].indexOf(b[1])*16+b[3].indexOf(b[2]);
            }
            return b[20]+","+b[21]+","+b[22];
        },
        
        /**
         * 替换字符串
         * @method replaceAll
         * @param sourceStr {String} 被操作的字符串
         * @param findText {String} 被替换掉的字符串
         * @param repText {String} 替换成掉的字符串
         * @return {String} 替换后的字符串
         */
        replaceAll : function(sourceStr,findText,repText){
	        return sourceStr.replace(new RegExp(findText,"g"),repText);
        },
        
        /**
         * 日志,向控制台打印日志信息
         * @method log
         * @param msg {String} 日志内容
         * @return {void}
         */
        log: function(msg){
        	if(!$.browser.msie){
        		console.log(msg);
        	}
        }
	});
	
	atw.isIE6 = false;
})(ATW);