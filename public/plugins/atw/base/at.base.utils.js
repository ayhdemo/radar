(function (atw) {
	/**
	 * ATW基础包工具类
	 * @module Base
	 * @class ATW.Util
	 * @author cqb
	 * @version 2.1 
	 */
	atw.Util = {
		/**
		 * 获取body的尺寸大小兼容各个浏览器
		 * @method getBodyDimensions
		 * @return {Object} body高宽对象
		 * @example {width: 800, height: 600}
		 */
		getBodyDimensions : function(){
			var winWidth = 0;
			var winHeight = 0;
			//获取窗口宽度
			if (window.innerWidth){
				winWidth = window.innerWidth;
			}else if ((document.body) && (document.body.clientWidth)){
				winWidth = document.body.clientWidth;
			}
			//获取窗口高度
			if (window.innerHeight){
				winHeight = window.innerHeight;
			}else if ((document.body) && (document.body.clientHeight)){
				winHeight = document.body.clientHeight;
			}
			//通过深入Document内部对body进行检测，获取窗口大小
			if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
				winHeight = document.documentElement.clientHeight;
				winWidth = document.documentElement.clientWidth;
			}
			
			return {width:winWidth, height:winHeight};
		},
		
		/**
         * 获取页面元素的高度或则宽度
         * @method getElementWH
         * @param element {DOM} 页面元素对象
         * @param name {String} css样式名称如:width height
         * @return {Float} 获取页面元素的高度或则宽度值
         */
		getElementWH: function(element, name){
			var val = name === "width" ? element.offsetWidth : element.offsetHeight;
			return val;
		},
		
		/**
         * 去掉某个css样式
         * @method removeCss
         * @param element {DOM} 页面元素对象
         * @param csstype {String} 某个css样式名称
         * @return {void} 
         */
		removeCss: function(element, csstype){
			if(element.style){
				if(element.style.removeProperty){
					element.style.removeProperty(csstype);
				}else{
					element.style[csstype] = "";
				}
			}
		},
		
		/**
         * 计算组件的边框长度
         * @method caculatBorderWH
         * @param o {DOM} 页面元素对象
         * @param d {String} 水平方向或竖直方向<br/>
         * "v": 竖直方向边框
         * "h"：水平方向边框
         * @return {Float}
         */
    	caculatBorderWH : function(o, d){
    		var result = 0;
    		if(o.style){
    			if(d == "v"){
    				if(o.style.borderTopWidth != ""){
    					result = result + parseFloat(o.style.borderTopWidth);
                    }
                    if(o.style.borderBottomWidth != ""){
                    	result = result + parseFloat(o.style.borderBottomWidth);
                    }
    			}
    			if(d == "h"){
    				if(o.style.borderLeftWidth != ""){
    					result = result + parseFloat(o.style.borderLeftWidth);
                    }
                    if(o.style.borderRightWidth != ""){
                    	result = result + parseFloat(o.style.borderRightWidth);
                    }
    			}
    		}
    		return result;
    	},
    	
    	/**
         * 该节点是否可以锚定位
         * @method checkAvalibleAnchorNode
         * @deprecated
         * @param node {DOM} 页面节点
         * @return {Boolean} 节点是否可以锚定位 
         */
    	checkAvalibleAnchorNode : function(node){
    		var flag = true;
    		if(node.tagName == "SCRIPT" || node.tagName == "!"){
    			flag = false;
    		}
    		if(node.nodeType != 1){
    			flag = false;
    		}
    		if(node.style.display == "none"){
    			flag = false;
    		}
    		return flag;
    	},
    	
    	/**
         * 获取UUID
         * @method UUID
         * @return {String} UUID
         */
    	UUID: function(){
		    var S4 = function() {
		       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		    };
		    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    	},
    	
    	/**
         * 在元素上绑定数据
         * @method attachData
         * @param element {DOM} 页面元素
         * @param data {Object} 要绑定的数据
         * @return {void}
         */
    	attachData: function(element, data){
    		if(element.nodeType == 1){
    			var uuid = at.base.utils.UUID();
    			element.setAttribute("atid",uuid);
    			element["atid"] = uuid;
    			window[uuid] = data;
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
         * 在系统中引入脚本兼容各个浏览器
         * @method loadScriptFile
         * @param path {String} 脚本文件路径
         * @return {void}
         */
    	loadScriptFile: function(path){
    		var agent = navigator.userAgent;
            var docWrite = (agent.match("MSIE") || agent.match("Safari"));
            
            if (docWrite) {
            	var scriptTag = "<script src='" + path +"'></script>";
            	document.write(scriptTag);
            }else{
            	 var s = document.createElement("script");
                 s.src = path;
                 var h = document.getElementsByTagName("head").length ? 
                            document.getElementsByTagName("head")[0] : 
                            document.body;
                 h.appendChild(s);
            }
    	},
    	
    	/**
         * 在页面中删除该节点
         * @method removeElement
         * @param element {DOM} 要删除的节点
         * @return {void}
         */
    	removeElement: function(element){
    		element.parentNode.removeChild(element);
    	}
	}
})(ATW);