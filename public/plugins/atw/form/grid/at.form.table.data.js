
 if(!ATW.TableData){
	 ATW.TableData = {};
	 ATW.TableData.TREECOLUMN = "tree";
	 ATW.TableData.STRINGCOLUMN = "str";
	 ATW.TableData.NUMBERCOLUMN = "int";
	 ATW.TableData.DATECOLUMN = "date";
 }
(function (atw){
    atw.extendClass("TableData.Data",atw.Object,{

        //组件提示说明
        selfInfor : {className : "at.form.Table",chName : "表格"},
        columnDefaultWidth : "*",
        sortAble : true,

        /**
         * 设置参数信息
         * @param {json} initObj构造参数对象
         * @return {void}
         */
        initialize : function(options){
        	atw.Object.prototype.initialize.apply(this,arguments);
        },

        /**
         * 设置表头信息
         * @function 私造方法
         * @param {}
         * @return {void}
         */
        setColumnHead : function(grid){
            var columns = this.column;
            var headArr = new Array();      //列名称
            var widthArr = new Array();     //列宽度
            var alignArr = new Array();     //列对齐方式
            var colorArr = new Array();     //列颜色
            var typeArr = new Array();      //列字段类型
            var sortArr = new Array();      //列排序
            this.setColumnHeadInfo(columns,headArr,widthArr,alignArr,colorArr,typeArr,sortArr);
            grid.setHeader(headArr.join(","));
            grid.setInitWidths(widthArr.join(","));
            grid.setColAlign(alignArr.join(","));
            grid.setColumnColor(colorArr.join(","));
            //alert(typeArr);
            //grid.setColTypes(typeArr.join(","));
            if(this.sortAble){
                grid.setColSorting(sortArr.join(","));
            }
        },

        /**
         * 设置复合表头信息
         * @function 私造方法
         * @param {}
         * @return {void}
         */
        setComplexColumnHead : function(grid){
            var columns = this.complexColumn;
            if(!columns){
            	return;
            }
            if(columns && typeof(columns) == "object"){
                if(columns.length > 1){
                    for(var i=0,num=columns.length; i<num; i++){
                        if(!this.isArray(columns[i])){
                            this.printError("参数格式错误--创建"+this.selfInfor.className+"时complexColumn属性设置的参数“"+columns[i]+"”有误，请设置该参数的每一个元素为数组类型！");
                        }
                    }
                    var headArr = new Array();      //列名称
                    var widthArr = new Array();     //列宽度
                    var alignArr = new Array();     //列对齐方式
                    var colorArr = new Array();     //列颜色
                    var typeArr = new Array();      //列字段类型
                    var sortArr = new Array();      //列排序
                    this.setColumnHeadInfo(columns[0],headArr,widthArr,alignArr,colorArr,typeArr,sortArr);
                    grid.setHeader(headArr.join(","));
                    var column = null;
                    var jColumn = null;
                    var cHeadArr = null;
                    for(var i=1,num=columns.length; i<num; i++){
                        column = columns[i];
                        cHeadArr = new Array();
                        if(this.isDefined(column)){
                            for(var j=0,jNum=column.length; j<jNum; j++){
                                jColumn = column[j];
                                if(this.isDefined(jColumn.chName)){
                                    cHeadArr.push(jColumn.chName);
                                }else if(this.isDefined(jColumn.column)){
                                    cHeadArr.push(jColumn.column);
                                }else{
                                    cHeadArr.push("");
                                }
                            }
                            grid.attachHeader(cHeadArr.join(","));
                        }
                    }
                    grid.setInitWidths(widthArr.join(","));
                    grid.setColAlign(alignArr.join(","));
                    grid.setColumnColor(colorArr.join(","));
                    grid.setColTypes(typeArr.join(","));
                    if(this.sortAble){
                        grid.setColSorting(sortArr.join(","));
                    }
                }else if(columns.length == 1){
                    this.printError("参数格式错误--创建"+this.selfInfor.className+"时complexColumn属性时，检查出非复合表头形式，请使用column属性设置表头！");
                }
            }else{
                this.printError("参数格式错误--创建"+this.selfInfor.className+"时complexColumn属性设置的参数“"+columns+"”有误，请设置该参数为数组类型！");
            }
        },

        /**
         * 设置表头其它信息
         * @function 私造方法
         * @param {}
         * @return {void}
         */
        setColumnHeadInfo : function(columns,headArr,widthArr,alignArr,colorArr,typeArr,sortArr){
            var column = null;
            for(var i=0,num=columns.length; i<num; i++){
                column = columns[i];
                if(column){
                    if(column.chName){
                        headArr.push(column.chName);
                    }else if(column.column){
                        headArr.push(column.column);
                    }else{
                        headArr.push("");
                    }
                    if(column.width){
                        widthArr.push(column.width);
                    }else{
                        widthArr.push(this.columnDefaultWidth);
                    }
                    if(column.align){
                        alignArr.push(column.align);
                    }
                    if(column.color){
                        colorArr.push(column.color);
                    }
                    if(column.type){
                        typeArr.push(this.getColumnType(column.type));
                        sortArr.push(column.type);
                    }else{
                        typeArr.push("txt");
                        sortArr.push("str");
                    }
                }
            }
        },

        /**
         * 获取表头类型
         * @function 私造方法
         * @param {}
         * @return {void}
         */
        getColumnType : function(type){
            switch(type){
                case atw.TableData.TREECOLUMN : return "tree";
                case atw.TableData.STRINGCOLUMN : return "txt";
                case atw.TableData.NUMBERCOLUMN : return "dyn";
                case atw.TableData.DATECOLUMN : return "txt";
            }
        }
    });
})(ATW);