(function(atw){
    /**
     * 时间轴
     * @module Control
	 * @class ATW.TimeLine
	 * @extends ATW.Control
     * @author cqb
     * @version 1.0
     * @editby xuhu 20141210 :add autoplay
     */
    
    atw.extendClass("TimeLine", atw.Control, {
        /**
		 * 时间轴数据
		 * [{name: "2005年", value: "2005"},{name: "2010年", value: "2010"}]
		 * @type {Object}
		 * @property data
		 */
        data: null,
        /**
         * 是否自动播放
         * @type Object 'true'/'false'/function
         * @property autoPlayFun
         */
        autoPlayFun:'false',
        /**
         * 自动播放时间间隔
         * @type int
         * @property autoPlayPause
         */
        autoPlayPause:5000,
        
        /**
		 * 初始化
		 * @constructor
		 * @param {Object} 参数
		 */
        initialize: function(options){
            atw.Control.prototype.initialize.apply(this,arguments);
            
            this._render();
        },
        
        /**
         * 渲染
         * @private
         * @method _render
         */
        _render: function(){
            //创建
            this._create();
            //事件监听
            this._listens();
        },
        
        /**
         * 创建
         * @private
         * @method _create
         */
        _create: function(){
            $(this.target).addClass("atw_timeline");
            var ul = $("<ul id='timelinr_dates'>");
            var ww = 10;
            for(var i in this.data){
                var data = this.data[i];
                var li = $('<li id="timelinr_'+data.value+'"><span>'+data.name+'</span></li>');
                li.data("value", data.value);
                li.data("attrs",data);
                ul.append(li);
            }
            
            $(this.target).append(ul);
            
            $("#timelinr_dates").children("li").each(function(index){
            	$(this).attr("limarginleft",ww);
            	ww += $(this).width();
            });
            $("#timelinr_dates").width(ww+$("#timelinr_dates").children("li").length*20);
        },
        
        /**
         * 事件监听
         * @private
         * @method _listens
         */
        _listens: function(){
            var scope = this;
            $("li", this.target).click(function(){
                if(!$(this).hasClass("active")){
                    $("li.active", this.target).removeClass("active");
                    $(this).addClass("active");
                    
                    var value = $(this).data("value");
                    var attrs = $(this).data("attrs");
                    scope.selectEnd(this, value,attrs);
                }
            });
            if(scope.autoPlayPause>4000){
	            if(scope.autoPlayFun == 'true') { 
	    			setInterval(function(){if(scope.autoPlayFun == 'true')scope.autoPlay();}, scope.autoPlayPause);
	    		}
            }
        },
        
        /**
         * 自动播放
         */
        autoPlay:function(){
        	var ww = $("#timelinr_dates").width();
    		var currentDate = $("#timelinr_dates").find('li.active');
    		//移动ul
    	//	var position = currentDate.position();
    		var mleft = currentDate.attr("limarginleft");
			
    		if(currentDate.is('li:last-child')) {
    			$("#timelinr_dates"+' li:first-child').find('span').trigger('click');
    			mleft = 10;
    		} else {
    			currentDate.next().find('span').trigger('click');
    		}
    		var parentww = $("#LayerPlay").width();
            if(parentww<$("#timelinr_dates").width()){
            	$("#timelinr_dates").animate({'marginLeft':-1*(mleft)},{queue:false, duration:'normal'});
            }
        },
        
        /**
         * 选择回调
         * @method selectEnd
         * @param {DOM} ele li元素
         * @param {String} value 时间点对应的值
         */
        selectEnd: function(ele, value){
            
        },
        
        /**
         * 激活对应值的时间节点
         * @method active
         * @param {String} value 时间节点对应的值
         */
        active: function(value){
        	var flag = true;
            $("li", this.target).each(function(){
                var val = $(this).data("value");
                //xuhu added, 有多个重值时只响应第一个值
                if(val == value && flag){
                    $(this).click();
                    flag = false;
                }
            });
        }
    });
})(ATW);