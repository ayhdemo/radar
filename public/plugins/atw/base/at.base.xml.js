(function (atw) {
    /**
     * XML解析类
     * @module Base
	 * @class ATW.base.Xml
	 * @extends ATW.Object
	 * @author cqb
	 * @version 2.1
	 * @example 
	 * 	var xml = new ATW.base.Xml({xml: xxxx/xxx.xml});
	 *  var xml = new ATW.base.Xml({xml: "<? xml ...>"});
	 */
    atw.extendClass("base.Xml",atw.Object,{

       /**
        * 记录传入的XML
        * xml字符串或者xml文件或服务地址
        * @type String
        * @property xml
        */
        xml : null,
        /**
         * 构造函数 设置参数信息
         * @constructor
         * @param参数名 {json} 构造参数对象
         */
        initialize : function(options){
            //初始化父类
        	atw.Object.prototype.initialize.apply(this,arguments);
            this.render();
        },

        /**
         * 检查必须属性的设置情况
         * @private
         * @deprecated
         * @method checkNecessaryAttribute
         */
        checkNecessaryAttribute : function(){
            
        },

        /**
         * 创建XMLDom
         * @method createXmlDoc
         * @return {Boolean} 是否创建成功
         */
         createXmlDoc : function(){
             if($.browser.msie){
                var arrSingatures = [
                    "MSXML2.DOMDocument.5.0",
                    "MSXML2.DOMDocument.4.0",
                    "MSXML2.DOMDocument.3.0",
                    "MSXML2.DOMDocument",
                    "Microsoft.XmlDom"
                ];
                for(var i=0;i<arrSingatures.length;i++){
                    try{
                        this.xmlDoc = new ActiveXObject(arrSingatures[i]);
                        this.xmlDoc.async=false;
                        return false;
                    }catch(oError){}
                }
                throw new Error("当前是IE特殊版本！");
            }else if($.browser.mozilla){
                this.xmlDoc = document.implementation.createDocument("","",null);
                this.xmlDoc.async=false;
                return false;
            }else{
                this.xmlDoc = document.implementation.createDocument("","",null);
                this.xmlDoc.async=false;
                return false; 
            }
        },

        /**
         * 导入XML
         * @private
         * @return {void}
         */
         loadXml : function(){
             if(this.xml == null){
                 this.printError("信息不存在--创建atw.base时构造参数对象没有设置xml属性！");
             }
             if(typeof(this.xml) == "object"){
                 this.xmlDoc = this.xml;
             }else{
                 this.xml = $.trim(this.xml);
                 if($.browser.msie){
                     if(this.checkStringOrXML(this.xml)){
                        this.xmlDoc.loadXML(this.xml);
                     }else{
                        this.xmlDoc.load(this.xml);
                     }
                 }else if($.browser.mozilla){
                    if(this.checkStringOrXML(this.xml)){
                        var oParser = new DOMParser();
                        this.xmlDoc = oParser.parseFromString(this.xml,"text/xml");
                    }else{
                        this.xmlDoc.load(this.xml);
                    }
                 }else{
                    if(this.checkStringOrXML(this.xml)){
                        var oParser = new DOMParser();
                        this.xmlDoc = oParser.parseFromString(this.xml,"text/xml");
                    }else{
                    	var self = this;
                    	$.ajax({
                    		async: false,
                    		dataType: "xml",
                    		url: this.xml,
                    		success: function(xml){
                    			self.xmlDoc = xml;
                    		},
                    		error: function(){
                    			alert("请求的xml格式有错误!");
                    		}
                    	});
                    }
                 }
             }
         },

        /**
         * 获得原生的XMLDocument对象
         * @method getXmlDocument
         * @return {XMLDocument} XMLDocument对象
         */
        getXmlDocument : function(){
            return this.xmlDoc;
        },

        /**
         * 得到XML对象根节点
         * @method getRootNode
         * @return {Node} 根节点
         */
        getRootNode : function(){
            this.rootNode = this.xmlDoc.documentElement;
            if(this.rootNode == null){
                this.printError("传入的XML节点属性有重复！");
            }
            return new atw.base.Xml.Node({node:this.rootNode});
        },

        /**
         * 转化成XML字符串兼容各个浏览器
         * @method toString
         * @return {String} xml的字符串形式
         * */
        toString : function(){
            if($.browser.msie){
                return this.xmlDoc.xml;
            }else{
                return new XMLSerializer().serializeToString(this.xmlDoc,"text/xml");
            }
        },

        /**
         * 执行
         * @private
         * @method render
         */
        render : function(){
            this.checkNecessaryAttribute();
            this.createXmlDoc();
            if(this.xml != null){
                this.loadXml();
            }
        }
    });
})(ATW);


(function(atw){
    /**
     * XML节点类
     * @module Base
	 * @class ATW.base.Xml.Node
	 * @extends ATW.Object
	 * @author cqb
	 * @version 2.1
	 */
    atw.extendClass("base.Xml.Node",atw.Object,{

	   /**
        * 记录传入的节点原对象
        * @type XMLDocument
        * @property xmlDoc
        */
        xmlDoc : null,
		
	   /**
        * 记录传入的节点原对象
        * @type XMLNode
        * @property node
        */
        node : null,
       /**
        * 新建的节点标签名称
        * @type String
        * @property tag
        */
		tag : null,
		
	   /**
        * 新建的节点标签值
        * @type String
        * @property value
        */
        value : null,
       /**
        * 新建的节点属性
        * @type JSON
        * @property attributes
        */
		attributes : null,

        /**
         * 设置参数信息
         * @private
         * @constructor
         * @param options {Object} 构造参数对象
         */
        initialize : function(options){
            //初始化父类
        	atw.Object.prototype.initialize.apply(this,arguments);
            this.checkNecessaryAttribute();
            if(this.tag != null){
                this.buildNode();
            }
        },

        /**
         * 检查必须属性的设置情况
         * @private
         * @deprecated
         */
        checkNecessaryAttribute : function(){
            if(this.node == null && this.tag == null){
                this.printError("信息不存在--创建atw.base.Xml.Node时构造参数对象同时没有设置node属性和tag属性！");
            }
        },

        /**
         * 创建新节点
         * @private
         * @method buildNode
         */
        buildNode : function(){
            if(this.xmlDoc == null){
                var xml = new atw.base.Xml({});
                this.xmlDoc = xml.xmlDoc;
            }
            this.node = this.xmlDoc.createElement(this.tag);
            if(this.value != null){
                this.node.text = this.value;
            }
            if(this.attributes != null){
                for(var attr in this.attributes){
                    var t = this.xmlDoc.createAttribute(attr);
                    t.value = this.attributes[attr];
                    this.node.setAttributeNode(t);
                }
            }
        },

        /**
         * 添加子节点
         * @method appendChild
         * @param newNode {Node} 新节点
         * @param childNode {Node} 现有的子节点
         * @param isBefore {Boolean} 添加在childNode之前
         */
        appendChild : function(newNode,childNode,isBefore){
            if(typeof(childNode) == "undefined"){
                this.node.appendChild(newNode.node);
            }else{
                if(isBefore){
                    this.node.insertBefore(newNode.node,childNode.node);
                }else{
                    if(childNode.getNextNode() == null){
                        this.node.appendChild(newNode.node);    
                    }else{
                        this.node.insertBefore(newNode.node,childNode.getNextNode().node);
                    }
                }
            }
        },

        /**
         * 替换子结点
         * @method replaceChild
         * @param newNode {Node} 新子节点
         * @param oldNode {Node} 旧子节点
         */
        replaceChild : function(newNode,oldNode){
            this.node.replaceChild(newNode.node,oldNode.node);
        },

        /**
         * 删除子结点
         * @method removeChild
         * @param node {Node} 子节点
         */
        removeChild : function(node){
            this.node.removeChild(node.node);
        },

        /**
         * 克隆结点
         * @method cloneNode
         * @param isCloneChild {Boolean} 被克隆节点（子节点是否被克隆）
         * @return {Node} 克隆后的节点
         */
        cloneNode : function(isCloneChild){
            return new atw.base.Xml.Node({node:this.node.cloneNode(isCloneChild)});
        },

        /**
         * 设置节点值
         * @method setNodeValue
         * @param value {String} 将要插入的节点值
         * @param index {Number} 插入的位置（不传则为替换）
         */
        setNodeValue : function(value,index){
            var child = this.node.childNodes;
            if(child.length > 0){
                if(child[0].nodeType == 3){
                    if(typeof(index) == "undefined"){
                        this.node.childNodes[0].nodeValue = value;    
                    }else{
                        if(isNaN(Number(index))){
                            this.node.childNodes[0].nodeValue = value;    
                        }else{
                            var length = this.node.childNodes[0].nodeValue.length;
                            index = index > length ? length : index;
                            index = index < 0 ? 0 : index;
                            this.node.childNodes[0].insertData(index,value);
                        }
                    }
                }
            }
        },

        /**
         * 获取节点值
         * @method getNodeValue
         * @return {String} 当前节点值
         */
        getNodeValue : function(){
            var child = this.node.childNodes;
            if(child.length > 0){
                return child[0].nodeValue == null ? "" : child[0].nodeValue;
            }else{
                return "";
            }
        },

        /**
         * 设置节点属性，如果属性不存在则为添加节点
         * @method setAttribute
         * @param attributeName {String} 属性名称
         * @param attributeValue {String} 属性值
         */
        setAttribute : function(attributeName,attributeValue){
            this.node.setAttribute(attributeName,attributeValue);
        },

        /**
         * 根据属性名称获取属性值
         * @method getAttribute
         * @param attributeName {String} 属性名称
         * @return {String}根据参数返回属性值
         */
        getAttribute : function(attributeName){
            return this.node.getAttribute(attributeName);
        },
        
        /**
         * 获取节点所有属性
         * @method getAttributes
         * @return {Array} 由节点属性信息组成的数组，<br/>属性名存放在"attributeName"属性中，<br/>属性值存放在"attributeValue"属性中
         */
        getAttributes : function(){
            var attrArray = new Array();
            var attr = this.node.attributes;
            if(attr != null){
                for(var i=0; i<attr.length; i++){
                    attrArray.push({attributeName:attr[i].nodeName,attributeValue:attr[i].nodeValue});
                }
                return attrArray;
            }
        },

        /**
         * 获取节点所有属性
         * @method getAttributesJson
         * @return {JSON}由节点属性信息组成的json对象
         */
        getAttributesJson : function(){
            var attrJson = {};
            var attr = this.node.attributes;
            if(attr != null){
                for(var i=0; i<attr.length; i++){
                    attrJson[attr[i].nodeName] = attr[i].nodeValue;
                }
                return attrJson;
            }
        },

        /**
         * 获取当前节点的父节点
         * @method getParentNode
         * @return {Node} 父节点对象
         */
        getParentNode : function(){
            return this.node.parentNode == null ? null : new atw.base.Xml.Node({node:this.node.parentNode});
        },

        /**
          * 获取父节点及祖宗节点
          * @method getParentNodes
          * @param step {Number} 获取级数，若不输入则获取父节点及全部祖宗节点
          * @return {Array} 以数组形式返回父节点及全部祖宗节点
          */
        getParentNodes : function(step){
             if(typeof(step)=="undefined"){
                 step = 10000;
             }
             var rStep = step;
             step = Number(step);
             if(isNaN(step)){
                 this.printError("调用getParentNodes函数时输入参数“"+rStep+"”不合法！");
             }
             var parentNode = this.node.parentNode;
             var pNodeArray = new Array();
             for(var i=0; i<step; i++){
                 if(parentNode.nodeType == 9){
                     break;
                 }
                 pNodeArray.push(new atw.base.Xml.Node({node:parentNode}));
                 parentNode = parentNode.parentNode;
             }
             return pNodeArray;
        },
        
        /**
         * 获取当前节点的子节点
         * @method getChildNodes
         * @param tag {String} 子标签名称（不传将返回所有子节点）
         * @return {Array} 对应子标签下的所有子节点
         */
        getChildNodes : function(tag){
            var childNodes = null;
            if(typeof(tag)=="undefined"){
                childNodes = this.node.childNodes;
            }else{
                childNodes = this.node.getElementsByTagName(tag);
            }
            var childNodesArray = new Array();
            for(var i=0,num=childNodes.length;i<num;i++){
                if(childNodes[i].nodeType==1){
                    childNodesArray.push(new atw.base.Xml.Node({node:childNodes[i]}));
                }
            }
            return childNodesArray;    
        },

        /**
         * 获取单个对象数组
         * @method getChildNodesByXPath
         * @param xPath {String} 标签路径
         * @return {Array} 对应路径下的所有子节点
         */
        getChildNodesByXPath : function(xPath){
             if(xPath != null && xPath != '' && typeof(xPath) != "undefined"){
                 var childNodes = null;
                 var childNodesArray = new Array();
                 if($.browser.msie){
                    childNodes = this.node.selectNodes(xPath);
                    for(var i=0, num=childNodes.length; i<num; i++){
                       childNodesArray.push(new atw.base.Xml.Node({node:childNodes[i]}));
                    }
                 }else{
                     var oEvaluator = new XPathEvaluator();
                     childNodes = oEvaluator.evaluate(xPath,this.node,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);
                     if(childNodes!=null){
                        var oElement = childNodes.iterateNext();
                        while(oElement){
                            childNodesArray.push(new atw.base.Xml.Node({node:oElement}));
                            oElement = childNodes.iterateNext();
                        }
                     }
                 }
                 return childNodesArray;
             }else{
                 this.printError("调用“getChildNodesByXPath”方法时，传入参数“"+xPath+"”无效");
             }
        },

        /**
         * 返回当前节点的前一节点
         * @method getPreviousNode
         * @return {Node}: 当前节点的前一节点
         */
        getPreviousNode : function(){
            if($.browser.msie){
                var pNode = this.node.previousSibling;
                if(pNode == null){
                    return null;
                }else{
                    return new atw.base.Xml.Node({node:pNode});
                }
            }else{
                var pNode = this.node.previousSibling;
                while(pNode != null){
                    if(pNode.nodeType == 1){
                        return new atw.base.Xml.Node({node:pNode});
                    }
                    pNode = pNode.previousSibling;
                }
                return null;
            }
        },

        /**
         * 返回当前节点的后一节点
         * @method getNextNode
         * @return {Node} 当前节点的后一节点
         */
        getNextNode : function(){
            if($.browser.msie){
                var nNode = this.node.nextSibling;
                if(nNode == null){
                    return null;
                }else{
                    return new atw.base.Xml.Node({node:nNode});
                }
            }else{
                var nNode = this.node.nextSibling;
                while(nNode != null){
                    if(nNode.nodeType == 1){
                        return new atw.base.Xml.Node({node:nNode});
                    }
                    nNode = nNode.nextSibling;
                }
                return null;
            }
        }
    });

	/**
	 * 转换XML格式类
	 * @module Base
	 * @class ATW.base.Xml.Xsl
	 * @extends ATW.Object
	 * @author cqb
	 * @version 2.1
	 */
    atw.extendClass("base.Xml.Xsl",atw.Object,{

	   /**
        * 原XML信息
        * @type XMLDocument
        * @property xml
        */
        xml : null,
        
	   /**
        * 转换XSL信息
        * @type XMLDocument
        * @property xsl
        */
        xsl : null,

        /**
         * 设置参数信息
         * @private
         * @constructor
         * @param options {json} 构造参数对象
         */
        initialize : function(options){
            //初始化父类
        	atw.Object.prototype.initialize.apply(this,arguments);
            this.checkNecessaryAttribute();
            this.render();
        },

        /**
         * 检查必须属性的设置情况
         * @private
         * @deprecated
         */
        checkNecessaryAttribute : function(){
            if(this.xml == null){
                this.printError("信息不存在--创建atw.base.Xsl时构造参数对象没有设置xml属性！");
            }
            if(this.xsl == null){
                this.printError("信息不存在--创建atw.base.Xsl时构造参数对象没有设置xsl属性！");
            }
        },

        /**
         * 获取转换后的xml对象
         * @method getNewXml
         * @return {Xml} 获取转换后的xml
         */
        getNewXml : function(){
            var xml = new atw.base.Xml({
                xml : this.oRes
            });
            return xml;
        },

        /**
         * @private
         * @method render
         * 运行
         */
        render : function(){
            this.xml = new atw.base.Xml({
                xml : this.xml
            });
            this.xsl = new atw.base.Xml({
                xml : this.xsl
            });
            if($.browser.msie){
                this.oRes = this.xml.xmlDoc.transformNode(this.xsl.xmlDoc);
            }else{
                var oProcessor = new XSLTProcessor();
                oProcessor.importStylesheet(this.xsl.xmlDoc);
                this.oRes = oProcessor.transformToDocument(this.xml.xmlDoc);
            }
        }
    });
})(ATW);