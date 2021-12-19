(function (atw){
    atw.extendClass("TableData.Xml",atw.TableData.Data,{

        xml : null,
        /**
         * @description 设置参数信息
         * @function 构造方法
         * @param {json} initObj构造参数对象
         * @return {void}
         */
        initialize : function(options){
        	atw.TableData.Data.prototype.initialize.apply(this,arguments);
        },

        /**
         * @description 设置表格数据
         * @function 私造方法
         * @param {Object} grid 表格对象
         * @return {void}
         */
        setDataForGrid : function(grid){
            if(this.checkStringOrXML(this.xml)){
                grid.loadXMLString(this.xml);
            }else{
                grid.loadXML(this.xml);
            }
        }
    });
})(ATW);