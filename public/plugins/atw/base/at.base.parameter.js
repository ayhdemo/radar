(function (atw){
	/**
	 * 全局变量类
	 * @module Base
	 * @class ATW.Parameter
	 * @author cqb
	 * @version 2.1
	 */
    atw.Parameter = {

        /**
         * 锚信息
         * @property ANCHOR
         */
        ANCHOR : {
            LEFT : "left",
            RIGHT : "right",
            TOP : "top",
            BOTTOM : "bottom",
            BOTH : "both"
        },
        /**
         * 事件ID数组
         * @property EVENTIDLIST
         */
        EVENTIDLIST : ["onResize","onclick","ondblclick","onmousedown","onmouseup","onmousemove","onmouseout","onfocus",""],
        /**
         * 事件ID
         * @property EVENTID
         */
        EVENTID : {
        	ANCHOR : "anchor",
            RESIZE : "resize",
            CLICK : "click",
            DBLCLICK : "dblclick",
            MOUSEDOWN : "mousedown",
            MOUSEUP : "mouseup",
            MOUSEMOVE : "mousemove",
            MOUSEOUT : "mouseout",
            FOCUS : "focus",
            BLUR : "blur"
        },

        /**
         * Table组件
         * @property TABLE
         */
        TABLE : {
            TREECOLUMN : "tree",
            STRINGCOLUMN : "str",
            NUMBERCOLUMN : "int",
            DATECOLUMN : "date"
        },

        /**
         * TabBar组件
         * @property TABBAR
         */
        TABBAR : {
            TOP : "top",
            BOTTOM : "bottom",
            LEFT : "left",
            RIGHT : "right"
        },

        /**
         * Tree组件
         * @property TREE
         */
        TREE : {
            EVENTLIST : ["onOpening","onOpenEnd","onNodeClick","onNodeDblClick","onCheck"]
        },
        
        /**
         * 表单信息
         * @property FORM
         */
        FORM: {
        	FORM_STATE_SAVE:		"SAVE",	//保存表单
    		FORM_STATE_EDIT:		"EDIT",	//修改表单
    		
    		FIELD_TYPE_STRING: 		1,	//字段属性，表示为字符串类型
    	    FIELD_TYPE_DATE: 		2,	//字段属性，表示为date类型
    	    FIELD_TYPE_NUMBER:		3,	//字段属性，表示为数值类型
    	    FIELD_TYPE_BOOBLEAN:	4,	//
    	    FIELD_TYPE_DATETIME: 	5,  //日期时间型
    	    FIELD_TYPE_CLOB:	 	6 	// 大文本
        }
    };
})(ATW);