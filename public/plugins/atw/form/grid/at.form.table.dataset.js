(function (atw){
    atw.extendClass("TableData.DataSet",atw.TableData.Json,{
        dataSet : null,
        width : null,
        /**
         * @description 设置参数信息
         * @function 构造方法
         * @param {json} initObj构造参数对象
         * @return {void}
         */
        initialize : function(options){
        	atw.TableData.Json.prototype.initialize.apply(this,arguments);
            this.setColumnHeadFromMeta();
        },

        /**
         * @description 设置表头信息
         * @function 私造方法
         * @param {}
         * @return {void}
         */
        setColumnHeadFromMeta : function(){
            if(this.column == null){
                var column = new Array;
                var metas = this.dataSet.getMeta().getJsonMetes();
                var meta = null;
                for(var i=0,num=metas.length; i<num; i++){
                    meta = metas[i];
                    if(meta.getFIELDID() && meta.getFIELDID() != ""){
	                    column.push({
	                        column : meta.getFIELDNAME(),
	                        chName : meta.getFIELDCHNNAME(),
	                        type : this.changeColumnType(meta.getFIELDTYPE()),
	                        width: this.columndefaultwidth,
	                        align: this.columnalign
	                    });
                    }
                }
                this.column = column;
            }else{
                var columns = this.column;
                var column = null;
                var meta = null;
                for(var i=0,num=columns.length; i<num; i++){
                    column = columns[i];
                    if(this.isDefined(column.column)){
                        meta = this.dataSet.getMeta().getFieldMetaByName(column.column);
                        if(meta != null && this.isDefined(meta)){
                            column.chName = this.isDefined(column.chName) ? column.chName : meta.getFIELDCHNNAME();
                            column.type = this.isDefined(column.type) ? column.type : this.changeColumnType(meta.getFIELDTYPE());
                        }
                    }
                }
            }
        },

        /**
         * @description 解析字段类型
         * @function 私造方法
         * @param {}
         * @return {void}
         */
        changeColumnType : function(type){
            type = Number(type);
            if(type == 1){
                return atw.STRINGCOLUMN;
            }else if(type == 2){
                return atw.DATECOLUMN;
            }else if(type == 3){
                return atw.NUMBERCOLUMN;
            }else{
                return atw.STRINGCOLUMN;
            }
        },

        /**
         * @description 解析JSON
         * @function 私造方法
         * @param {Number} pageNum 当前页码
         * @return {void}
         */
        changeJson : function(pageNum){
            //this.dataSet.loadSetData();
            var data = this.dataSet.getPageAt(pageNum ? pageNum : 1);
            var arrs = new Array();
            if(data != null){
                var cData = data.getJsonData();
                var arr = null;
                var column = this.column;
                for(var i=0,num=cData.length; i<num; i++){
                    arr = new Array();
                    for(var j=0,jNum=column.length; j<jNum; j++){
                        arr.push(cData[i].get(column[j].column));
                    }
                    arrs.push({id:i+"",data:arr});
                }
                this.json = {rows:arrs};
                this.grid.serverPageContainer.style.display = "";
            }else{
                this.json = {rows:arrs};
                this.grid.serverPageContainer.style.display = "none";
            }
        },

        /**
         * @description 设置表格数据
         * @function 私造方法
         * @param {Object} grid 表格对象
         * @return {void}
         */
        setDataForGrid : function(grid,pageNum){
            this.changeJson(pageNum);
            atw.Json.prototype.setDataForGrid.apply(this,arguments);
        }
    });
})(ATW);