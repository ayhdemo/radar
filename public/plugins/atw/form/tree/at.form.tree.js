(function (atw) {
	/**
	 * 树组件
	 * <pre>var tree = $("#tree1").Tree({
	id: "0",
	width: "100%",
	height: "100%"
}).data("Tree");</pre>
	 * @module Control
	 * @class ATW.Tree
	 * @extends ATW.Control
	 * @author cqb
	 * @version 2.1
	 */
    atw.extendClass("Tree",atw.Control,{
    	/**
    	 * 节点属性信息
    	 * @type JSON
    	 * @attribute extendAttributesJson
    	 */
		/**
         * 树根的id
         * @type {String}
         * @property id
         */
    	id: null,
		/**
         * 树的宽度
         * @type {Number}
         * @property treewidth
         */
    	width: null,
		/**
         * 树的高度
         * @type {Number}
         * @property treeheight
         */
    	height: null,
    	
        /**
         * 构造函数
         * @constructor
         * @param {options} 参数
         */
        initialize : function(options){
        	atw.Control.prototype.initialize.apply(this,arguments);
        	this._render();
        },
        
        /**
         * 渲染树将第三方组件拷贝到当前类中
         * @private
         * @method _render
         * @return {void}
         */
        _render: function(){
        	var tree = new dhtmlXTreeObject(this.target, this.width, this.height, this.id);
        	tree.setSkin("dhx_skyblue");
        	tree.setImagePath(jQuery.Script._getLibPath()+"/themes/base/images/treeskin/csh_dhx_skyblue/");
        	this.tree = tree;
        	jQuery.extend(this, tree);
        },
        
        /**
         * 销毁树
         * @method destroy
         */
        destroy: function(){
        	this.destructor();
        },
        
		/**
         * 组件名称
         * @type {String}
         * @property WIDGET_NAME
         */
        WIDGET_NAME: "tree"
        /**
         * 是否允许复选框
         * @method enableCheckBoxes
         * @param {Boolean} mode
         */
    	/**
         * 是否允许右键菜单
         * @method enableContextMenu
         * @param {Boolean} menu
         */
    	/**
         * 是否允许右键菜单
         * @method enableDragAndDrop
         * @param {Boolean} mode
         */
    	/**
         * 节点是否允许单选框
         * @method enableRadioButtons
         * @param {String} itemId
         * @param {Boolean} mode
         */
    	/**
         * 是否允许单选框
         * @method enableSingleRadioMode
         * @param {Boolean} mode
         */
    	/**
         * 复选框是否允许级联
         * @method enableThreeStateCheckboxes
         * @param {Boolean} mode
         */
    	/**
         * 聚焦节点
         * @method focusItem
         * @param {String} itemId
         */
    	/**
         * 获取所有勾选的节点id
         * @method getAllChecked
         * @return {String} id字符串以逗号隔开
         */
    	/**
         * 获取所有勾选的节点id
         * @method getAllCheckedBranches
         * @return {String} id字符串以逗号隔开
         */
    	/**
         * 获取所有有孩子结点的节点id
         * @method getAllItemsWithKids
         * @return {String} id字符串以逗号隔开
         */
    	/**
         * 获取所有叶子节点id
         * @method getAllLeafs
         * @return {String} id字符串以逗号隔开
         */
    	/**
         * 获取所有子节点id
         * @method getAllSubItems
         * @param {String} itemId 当前节点id
         * @return {String} id字符串以逗号隔开
         */
    	/**
         * 获取当前节点下所有为勾选节点id
         * @method getAllUnchecked
         * @param {String} itemId 当前节点id
         * @return {String} id字符串以逗号隔开
         */
    	/**
         * 根据索引获取某节点下子节点id
         * @method getChildItemIdByIndex
         * @param {String} itemId 父节点id
         * @param {Number} index 索引
         * @return {String} 节点id
         */
    	/**
         * 根据节点id获取节点索引
         * @method getIndexById
         * @param {String} itemId 节点id
         * @return {Number} 节点索引
         */
    	/**
         * 根据节点颜色值
         * @method getItemColor
         * @param {String} itemId 节点id
         * @return {String} 节点颜色值
         */
    	/**
         * 获取节点文字
         * @method getItemText
         * @param {String} itemId 节点id
         * @return {String} 节点文字
         */
    	/**
         * 获取节点层级
         * @method getLevel
         * @param {String} itemId 节点id
         * @return {Number} 节点层级
         */
    	/**
         * 获取节点打开状态
         * @method getOpenState
         * @param {String} itemId 节点id
         * @return {Number} 节点打开状态 1:打开 -1关闭
         */
    	/**
         * 获取父节点Id
         * @method getParentId
         * @param {String} itemId 节点id
         * @return {String} 父节点Id
         */
    	/**
         * 获取当前选中节点Id
         * @method getSelectedItemId
         * @return {String} 节点Id
         */
    	/**
         * 获取当前选中节点文字
         * @method getSelectedItemText
         * @return {String} 节点文字
         */
    	/**
         * 获取当前节点的子节点id
         * @method getSubItems
         * @param {String} itemId 节点id
         * @return {String} 节点id字符串以","隔开
         */
    	/**
         * 判断当前节点是否有子节点
         * @method hasChildren
         * @param {String} itemId 节点id
         * @return {Boolean} true 有子节点 false 没有子节点
         */
    	/**
         * 创建子节点
         * @method insertNewChild
         * @param {String} parentId 父节点id
         * @param {String} itemId 节点id
         * @param {String} itemText 节点文字
         * @param {Function} itemActionHandler 节点选中或点击处理函数
         * @param {String} image1 节点图片1
         * @param {String} image2 节点图片2
         * @param {String} image3 节点图片3
         * @param {String} optionStr 属性字符串 如SELECT,CALL,CHILD,CHECKED,OPEN
         * @param {String} children 属性字符串 如SELECT,CALL,CHILD,CHECKED,OPEN
         * @return {Object} 节点对象
         */
    	/**
         * 创建新节点
         * @method insertNewItem
         * @param {String} parentId 父节点id
         * @param {String} itemId 节点id
         * @param {String} itemText 节点文字
         * @param {Function} itemActionHandler 节点选中或点击处理函数
         * @param {String} image1 节点图片1
         * @param {String} image2 节点图片2
         * @param {String} image3 节点图片3
         * @param {String} optionStr 属性字符串 如SELECT,CALL,CHILD,CHECKED,OPEN
         * @param {String} children 属性字符串 如SELECT,CALL,CHILD,CHECKED,OPEN
         * @return {Object} 节点对象
         */
    	/**
         * 判断当前节点是否选中
         * @method isItemChecked
         * @param {String} itemId 节点id
         * @return {Boolean} true/false
         */
    	/**
         * 加载XML文件
         * @method loadXML
         * @param {String} file xml文件地址
         * @param {Function} afterCall xml加载完成后的回调函数
         */
    	/**
         * 加载XML字符串
         * @method loadXMLString
         * @param {String} xmlString XML字符串
         * @param {Function} afterCall xml加载完成后的回调函数
         */
    	/**
         * 展开当前节点的下的所有节点
         * @method openAllItems
         * @param {String} itemId 节点id
         */
    	/**
         * 展开节点
         * @method openItem
         * @param {String} itemId 节点id
         */
    	/**
         * 当节点加载后展开节点
         * @method openOnItemAdded
         * @param {Boolean} mode true/false
         */
    	/**
         * 刷新节点以及子节点
         * @method refreshItem
         * @param {String} itemId 节点id
         */
    	/**
         * 选中节点
         * @method selectItem
         * @param {String} itemId 节点id
         * @param {mode} true/false 可选
         */
    	/**
         * 设置节点选中状态
         * @method setCheck
         * @param {String} itemId 节点id
         * @param {state} true 勾选/false 去掉勾选
         */
    	/**
         * 设置树组件图标路径
         * @method setIconPath
         * @param {String} path 路径
         */
    	/**
         * 设置树组件图标路径
         * @method setIconsPath
         * @param {String} path 路径
         */
    	/**
         * 设置树组件图标路径
         * @method setImagePath
         * @param {String} newPath 路径
         */
    	/**
         * 设置树组件图标路径
         * @method setImagesPath
         * @param {String} newPath 路径
         */
    	/**
         * 设置节点图标大小
         * @method setIconSize
         * @param {Number} newWidth 长度
         * @param {Number} newHeight 宽度
         * @param {String} itemId 节点id
         */
    	/**
         * 设置节点是否可以关闭
         * @method setItemCloseable
         * @param {String} itemId 节点id
         * @param {Boolean} flag true/false
         */
    	/**
         * 设置节点颜色
         * @method setItemColor
         * @param {String} itemId 节点id
         * @param {String} defaultColor 默认颜色
         * @param {String} selectedColor 选中颜色
         */
    	/**
         * 设置节点文字
         * @method setItemText
         * @param {String} itemId 节点id
         * @param {String} newLabel 文字
         * @param {String} newTooltip 提示文字
         */
    	/**
         * 节点勾选事件
         * @method setOnCheckHandler
         * @param {Function} 回调函数 function(id, state){}
         */
    	/**
         * 节点点击事件
         * @method setOnClickHandler
         * @param {Function} 回调函数 function(id){}
         */
    	/**
         * 节点双击事件
         * @method setOnDblClickHandler
         * @param {Function} 回调函数 function(id){}
         */
    	/**
         * 节点展开完成事件
         * @method setOnOpenEndHandler
         * @param {Function} 回调函数 function(id, state){}
         */
    	/**
         * 节点展开事件
         * @method setOnOpenHandler
         * @param {Function} 回调函数 function(id, state){}
         */
    	/**
         * 节点展开开始事件
         * @method setOnOpenStartHandler
         * @param {Function} 回调函数 function(id, state){}
         */
    	/**
         * 节点右键点击事件
         * @method setOnRightClickHandler
         * @param {Function} 回调函数 function(id){}
         */
    	/**
         * 节点选中事件
         * @method setOnSelectStateChange
         * @param {Function} 回调函数 function(id){}
         */
    	/**
         * 节点皮肤
         * @method setSkin
         * @param {String} name 皮肤名称
         */
    	/**
         * 设置当前节点子节点选中与否
         * @method setSubChecked
         * @param {String} itemId 节点Id
         * @param {Boolean} state 勾选状态
         */
    	/**
         * 显示节点复选框与否
         * @method showItemCheckbox
         * @param {String} itemId 节点Id
         * @param {Boolean} state 显示状态
         */
    	/**
         * 根据id获取节点
         * @method _globalIdStorageFind
         * @param {String} itemId 节点Id
         * @return {Object} 节点对象 
         */
    });
})(ATW);