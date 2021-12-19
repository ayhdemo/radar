(function (atw) {
	/**
	 * 表格组件
	 * @class ATW.Table
	 * @extends ATW.Control
	 * @author cqb
	 * @version 2.1
	 */
    atw.extendClass("Table",atw.Control,{
        /**
         * XML方式加载数据
         * @type {String}
         */
        xml : "",
        /**
         * json方式加载数据
         * @type {Object}
         */
        json : {},
        /**
         * dataset方式加载数据
         * @type {Object}
         */
        dataSet : {},
        /**
         * 列信息
         * @type {Array}
         */
        column : null,
        /**
         * 复合列信息
         * @type {Object}
         */
        complexcolumn : null,
        /**
         * 透明度
         * @type {Number}
         */
        opacity : 1,
        /**
         * 当前样式名称
         * @type {String}
         */
        stylename : "dhx_skyblue",
        /**
         * 固定列
         * @type {Number}
         */
        splitat : 0,
        /**
         * 客户端过滤
         * @type {Array}
         */
        clientfilter : null,
        /**
         * 是否改变滚定条样式
         * @type {Boolean}
         */
        ischangescroll : false,
        /**
         * 隐藏列
         * @type {Array}
         */
        hiddencolumnindex : null,
        /**
         * 翻页回调函数
         * @type {Function}
         */
        onpagechange : function(){},
        /**
         * 过滤回调函数
         * @type {Function}
         */
        onfilterend : function(){},
        /**
         * 排序回调函数
         * @type {Function}
         */
        onsortend : function(){},
        /**
         * 点击某行回调函数
         * @type {Function}
         */
        onclickrow : function(){},
        /**
         * 双击某行回调函数
         * @type {Function}
         */
        ondbclickrow : function(){},
        /**
         * 框选单元格回调函数
         * @type {Function}
         */
        onblockrow : function(){},
        /**
         * 是否支持多行选择
         * @type {Boolean}
         */
        selMultiRows: false,
        /**
         * 列全选回调函数
         * @type {Function}
         */
        oncolumnselect : function(){},
        /**
         * 是否鼠标选取记录
         * @type {Boolean}
         */
        isdragselect : false,
        /**
         * 选择模式
         * @type {String}
         */
        selectmode : "row",
        /**
         * 延迟加载
         * @type {Boolean}
         */
        islazy : false,
        /**
         * 客户端分页信息
         * @type {Object}
         */
        clientpagination : null,
        /**
         * 默认列宽
         * @type {String}
         */
        columndefaultwidth : "*",
        /**
         * 是否允许排序
         * @type {Boolean}
         */
        issort : false,
        /**
         * 允许列选
         * @type {Boolean}
         */
        isselectcolumn : false,
        /**
         * 自定义列选
         * @type {String}
         */
        selectcolumnselfdefine : null,
        /**
         * 当前选择的列索引
         * @type {Number}
         */
        curcloindex : null,
        /**
         * 每一列中内容的停靠方向
         * @type {String}
         */
        columnalign: "left",
        /**
         * 翻页描述
         * @type {Boolean}
         */
        pagenationdes: true,
        /**
         * 首页文字
         * @type {String}
         */
        firPageText: "",
        /**
         * 上一页文字
         * @type {String}
         */
        prePageText: "",
        /**
         * 下一页文字
         * @type {String}
         */
        nexPageText: "",
        /**
         * 尾页文字
         * @type {String}
         */
        lasPageText: "",
        /**
         * 设置参数信息
         * @constructor
         * @param {Object} options 参数
         */
        initialize : function(options){
        	atw.Control.prototype.initialize.apply(this,arguments);
        	this._render();
        },
        
        /**
         * 渲染
         * @private
         * @method _render
         */
        _render: function(){
        	//初始化
        	this._init();
        	//创建
        	this._create();
        },
        
        /**
         * 初始化
         * @private
         * @method _init
         */
        _init: function(){
        	var imgpath = jQuery.Script._getLibPath()+"themes/base/images/gridskin/";
            this.imgPath = typeof(this.imgPath) == 'undefined' ? imgpath : this.imgPath;
            this.checkNecessaryAttribute();
        },
        
        /**
         * 创建grid
         * @private
         * @method _create
         */
        _create: function(){
        	this.buildContainer();
            this.buildTable();
        },
        
        /**
         * 检查必须属性的设置情况
         * @private
         * @method checkNecessaryAttribute
         */
        checkNecessaryAttribute : function(){
            this.checkDataSource();
            if(this.clientpagination && this.clientpagination.recordInPage){
                this.clientpagination.recordInPage = parseFloat(this.clientpagination.recordInPage);
                this.clientpagination.dispPageCount = parseFloat(this.clientpagination.dispPageCount);
            }
        },

        /**
         * 检查数据来源
         * @private
         * @method checkDataSource
         */
        checkDataSource : function(){
            if(this.json.rows){
                this.dataSource = "json";
                this.dataSourceObj = new ATW.TableData.Json({
                    column : this.column,
                    complexColumn : this.complexcolumn,
                    json : this.json,
                    columnDefaultWidth : this.columndefaultwidth,
                    sortAble : this.issort
                });
            }else if(this.dataSet){
                this.dataSource = "dataset";
                this.dataSourceObj = new ATW.TableData.DataSet({
                    column : this.column,
                    complexColumn : this.complexcolumn,
                    dataSet : this.dataSet,
                    columnDefaultWidth : this.columndefaultwidth,
                    sortAble : this.issort,
                    grid : this,
                    columnalign: this.columnalign
                });
                this.column = this.dataSourceObj.column;
            }else if(this.xml != ""){
                this.dataSource = "xml";
                this.dataSourceObj = new ATW.TableData.Xml({
                    column : this.column,
                    complexColumn : this.complexcolumn,
                    xml : this.xml,
                    columnDefaultWidth : this.columndefaultwidth,
                    sortAble : this.issort
                });
            }else{
                throw("信息不存在--xml属性、dataSet属性、json属性均没有设置，请设置其中一个！");
            }
        },

        /**
         * 构造表格组件
         * @private
         * @method render
         */
        render : function(){
            this.buildContainer();
            this.buildTable();
        },

        /**
         * 构建自定义列选功能参数
         * @private
         * @method changeSelectColumnSelfDefine
         */
        changeSelectColumnSelfDefine : function(){
            var sdSelectCol = this.selectcolumnselfdefine;
            if(sdSelectCol != null){
                var newSdSelectCol = {valueArray : new Array()};
                var tempArray = new Array();
                for(var i=0,iNum=sdSelectCol.length; i<iNum; i++){
                    tempArray.push(sdSelectCol[i]["isSelect"]);
                    newSdSelectCol[sdSelectCol[i]["position"]] = sdSelectCol[i]["isSelect"];
                }
                for(var i=tempArray.length-1; i>=0; i--){
                    newSdSelectCol.valueArray.push(tempArray[i]);
                }
                this.selectcolumnselfdefine = newSdSelectCol;
            }
        },

        /**
         * 构造表格
         * @private
         * @method buildTable
         */
        buildTable : function(){
            var self = this;
            //this.changeSelectColumnSelfDefine();
            var grid = new dhtmlXGridObject(this.tableContainer);
            //grid.attachEvent("onRowSelect", this.onclickrow);
            grid.enableMultiselect(this.selMultiRows);
            this.grid = grid;
            //edit by cqb
            //this.grid.entBox.style.height = this.height+"px";
            //事件绑定
            this.setBindEvent(grid);
            //设置图片路径
            grid.setImagePath(this.imgPath);
            //设置样式
            grid.setSkin(this.stylename);
            //禁止编辑
            //grid.enableEditEvents(false,false,false);
            grid.setEditable(false);
            //禁止拖拽列
            if(this.ischangescroll){
                grid.enableResizing("false");
            }
            //设置固定列
            //grid.splitAt(this.splitat);
            //设置客户端过滤
            //this.setClientFilter(grid);
            //设置列信息
            if(this.column.length > 0){
                this.dataSourceObj.setColumnHead(grid);
            }else{
                this.dataSourceObj.setComplexColumnHead(grid);
            }
            if(this.clientpagination && this.clientpagination.recordInPage){
            	this.setTotalPage(this.clientpagination.dispPageCount,this.clientpagination.recordInPage);
            	if(this.pagenationdes){
                	this.writePageInforDisp();
                }
                //设置客户端分页信息
                this.setClientPagination(grid);
                this.bindPageButton();
            }else{
                //延迟加载数据
                //grid.enableSmartRendering(this.islazy);
            }
            //初始化组件
            grid.init();
            if(this.complexcolumn && this.complexcolumn.length > 1){
                //解析排序图标的存在性
                this.parseMultColForSort(grid);
            }
            //以后写入子类中------------
            if(this.dataSource == "dataset" && this.dataSet.pageSize != -1){
                this.setTotalPage(this.dataSet.getRecordCount(),this.dataSet.pageSize);
                if(this.pagenationdes){
                	this.writePageInforDisp();
                }
                this.bindPageButton();
            }
            //-------------------------
            this.dataSourceObj.setDataForGrid(grid);
            if(this.splitat == 0 || this.splitat == "0"){
                //鼠标点击选择模式（“row”行选模式、“cell”格选模式）
                //grid.j_setSelectMode(this.selectmode);
                //允许鼠标拖拽选择
                //grid.j_enableDragSelection(this.isdragselect);
            }else{
                this.selectmode = "row";
                this.isdragselect = false;
            }
            //隐藏列
            this.hiddenColumn(grid);
        },

        /**
         * 解析排序图标的存在性
         * @private
         * @method parseMultColForSort
         * @param {Object} grid 原始表格对象
         * @return {Void}
         */
        parseMultColForSort : function(grid){
            var sortValArray = this.getSortColVal();
            var sortColArray = grid.j_multSortImgArray;
            for(var i=0,iNum=sortColArray.length; i<iNum; i++){
                if(!sortValArray[i]){
                    sortColArray[i].style.display = "none";
                }
            }
        },

        /**
         * 获取复合表头排序图标是否存在值
         * @private 私有方法
         * @method getSortColVal
         * @return {Array} 描述复合列的是否有排序功能的数组
         */
        getSortColVal : function(){
            var column = this.complexcolumn;
            var sortVal = new Array();
            for(var i=0,iNum=column.length; i<iNum; i++){
                if(iNum == i + 1){      //最后一行排序
                    for(var j=0,jNum=column[i].length; j<jNum; j++){
                        if(column[i][j].chName != "#cspan" && column[i][j].chName != "#rspan"){
                            sortVal.push(true);
                        }
                    }
                }else{                  //最后一行以前的行需要查看当前行后的所有行的当前列是否有cspan或rspan
                    for(var j=0,jNum=column[i].length; j<jNum; j++){
                        if(column[i][j].chName != "#cspan" && column[i][j].chName != "#rspan"){
                            var isEnd = true;
                            for(var k=i+1; k<iNum; k++){
                                if(column[k][j].chName != "#rspan"){
                                    isEnd = false;
                                }
                            }
                            sortVal.push(isEnd);
                        }
                    }
                }
            }
            return sortVal;
        },

        /**
         * 设置客户端分页
         * @private 私有方法
         * @method setClientPagination
         * @param {Object} grid 原始表格对象
         * @return {void}
         */
        setClientPagination : function(grid){
            var recordInPage = typeof(this.clientpagination.recordInPage) == 'undefined' ? 20 : this.clientpagination.recordInPage;
            var dispPageCount = typeof(this.clientpagination.dispPageCount) == 'undefined' ? 10 : this.clientpagination.dispPageCount;
            grid.enablePaging(true,recordInPage,dispPageCount,document.createElement("div"),true);
//            grid.setPagingSkin("bricks");
        },

        /**
         * 设置客户端过滤
         * @function 私有方法
         * @param {Object} grid 原始表格对象
         * @return {void}
         */
        setClientFilter : function(grid){
            if(this.clientfilter && this.clientfilter.length > 0){
                var filterArray = new Array();
                for(var i=0,num=this.clientfilter.length; i<num; i++){
                    if(this.clientfilter[i].toLowerCase() == "text"){
                        filterArray.push("#text_filter");
                    }else if(this.clientfilter[i].toLowerCase() == "select"){
                        filterArray.push("#select_filter");
                    }else{
                        filterArray.push("#rspan");
                    }
                }
                grid.attachHeader(filterArray.join(","));
            }
        },

        /**
         * 事件绑定
         * @function 私有方法
         * @param {Object} grid 原始表格对象
         * @return {void}
         */
        setBindEvent : function(grid){
            var self = this;
            //客户端翻页事件绑定
            grid.attachEvent("onPageChanged",function(curPage,firRow,lasRow){
                self.reSetTotalScroll();
                self.onpagechange(curPage,firRow,lasRow);
            });
            //客户端过滤事件绑定
            grid.attachEvent("onFilterEnd",function(id){
                self.reSetTotalScroll();
                self.onfilterend(id);
            });
            //客户端排序事件绑定
            grid.attachEvent("onAfterSorting",function(id){
                self.reSetTotalScroll();
                self.onsortend(id);
            });
            //设置点击行(单元格)处理事件
            grid.attachEvent("onRowSelect",function(rowId,colIndex){
                if(self.selectmode == "cell"){
                    self.onclickrow(self.getCallBackParam(rowId,colIndex));
                }else if(self.selectmode == "row"){
                    self.onclickrow(self.getCallBackParamArray(rowId,colIndex));
                }
            });
            //设置双击行(单元格)处理事件
            grid.attachEvent("onRowDblClicked",function(rowId,colIndex){
                if(self.selectmode == "cell"){
                    self.ondbclickrow(self.getCallBackParam(rowId,colIndex));
                }else if(self.selectmode == "row"){
                    self.ondbclickrow(self.getCallBackParamArray(rowId,colIndex));
                }
            });
            //设置框选行（单元格）处理事件
            grid.attachEvent("onRowBlocked",function(){
                self.onblockrow(self.getSelectedRows());
            });
            //设置框选列处理事件
            grid.attachEvent("onColumnSelect",function(colIndex){
                if(colIndex != undefined){
                    self.curcloindex = colIndex;
                    var colInfor = {};
                    if(self.column.length > 0){
                        colInfor = self.column[colIndex];
                    }else if(self.complexcolumn.length > 0){
                        colInfor = self.complexcolumn[0][colIndex];
                    }
                    colInfor.columnIndex = colIndex;
                    self.oncolumnselect(colInfor);
                }
            });

        },

        /**
         * 获取当前页的信息
         * @function 公有方法
         * @param {}
         * @return {Array} 页面信息
         */
        getCurrentPageRowInfor : function(){
            var arr = new Array();
            var coll = this.grid.rowsCol;
            for(var i=0, num=coll.length; i<num; i++){
                arr.push(this.getRowInfor(coll[i].idd));
            }
            return arr;
        },


        /**
         * 获取某个行的列信息
         * @function 公有方法
         * @param {Number} rowId 行ID
         * @return {Object} 列信息
         */
        getRowInfor : function(rowId){
            var cellObj = {};
            this.grid.forEachCell(Number(rowId),function(obj,id){
                cellObj[id+""] = obj.cell.innerText;
            });
            return cellObj;
        },

        /**
         * 获取当前选择的行信息（支持多行）
         * @function 公有方法
         * @param {}
         * @return {Array} 当前选择的行信息
         */
        getSelectedRows : function(){
            var grid = this.grid;
            if(this.selectmode == "row"){
                var selectedId = grid.getSelectedId();
                if(selectedId){
                    var ids = selectedId.split(",");
                    var rowId = null;
                    var rowIndex = null;
                    var cells = null;
                    var selectRowArray = new Array();
                    for(var i=0, num=ids.length; i<num; i++){
                        rowId = ids[i];
                        rowIndex = grid.getRowIndex(rowId);
                        cells = grid.rowsCol[rowIndex];
                        selectRowArray.push(this.getCallBackParamArray(rowId,null,rowIndex,cells));
                    }
                    return selectRowArray;
                }else{
                    return new Array();
                }
            }else if(this.selectmode == "cell"){
                var cells = this.grid.j_selectedCells;
                var cell = null;
                var rowId = null;
                var colIndex = null;
                var rowIndex = null;
                var array = new Array();
                for(var i=0,num=cells.length; i<num; i++){
                    cell = cells[i];
                    rowId = cell.parentNode.idd;
                    colIndex = cell._cellIndex;
                    rowIndex = grid.getRowIndex(rowId);
                    array.push(this.getCallBackParam(rowId,colIndex,rowIndex,cell));
                }
                return array;
            }
        },

        /**
         * 获取某个列的行信息
         * @function 公有方法
         * @param {Number} colIndex 列索引
         * @return {Array} 某列行信息
         */
        getRowsByColumnIndex : function(colIndex){
            var row = null;
            var cell = null;
            var colArray = new Array();
            for(var i=0,num=this.grid.rowsCol.length; i<num; i++){
                row = this.grid.rowsCol[i];
                if(row._childIndexes){
                    cell = row.childNodes[row._childIndexes[colIndex]];
                }else{
                    cell = row.childNodes[colIndex];
                }
                colArray.push(this.getCallBackParam(row.idd,colIndex,row.rowIndex,cell));
            }
            return colArray;
        },

        /**
         * 设置单元格参数信息
         * @function 私有方法
         * @param {String} rowId 行ID
         * @param {String} colIndex 列索引
         * @param {String} rowIndex 行索引
         * @param {String} cell 单元格对象
         * @return {Object} 单元格参数信息对象
         */
        getCallBackParam : function(rowId,colIndex){

            return null;
        },

        /**
         * 设置单元格参数信息
         * @function 私有方法
         * @param {String} rowId 行ID
         * @param {String} colIndex 列索引
         * @param {String} rowIndex 行索引
         * @param {Array} cellArray 单元格数组
         * @return {Array} 行内单元格参数信息对象数组
         */
        getCallBackParamArray : function(rowId,colIndex){
            var arr = new Array();
            var rowindex = this.grid.getRowIndex(rowId);
            var cloumnnum = this.grid.getColumnsNum();
            for(var i =0; i < cloumnnum; i++){
            	var celldata = {};
	            var cell = this.grid.cells(rowId, i);
	            celldata["colIndex"] = i;
	            celldata["rowId"] = rowId;
	            celldata["rowIndex"] = rowindex;
	            celldata["text"] = cell.getValue();
	            celldata["htmlnode"] = cell.cell;
	            celldata["column"] = this.column[i];
	            arr.push(celldata);
            }
            return arr;
        },

        /**
         * 设置隐藏列
         * @function 私有方法
         * @param {Object} grid 原始表格对象
         * @return {void}
         */
        hiddenColumn : function(grid){
            var hIndex = this.hiddencolumnindex;
            if(hIndex && hIndex.length > 0){
                for(var i=0,num=hIndex.length; i<num; i++){
                    grid.setColumnHidden(Number(hIndex[i]),true);
                }
            }
        },

        /**
         * 设置隐藏列
         * @function 公有方法
         * @param {Number} index 列索引
         * @param {Boolean} hidden 是否隐藏
         * @return {void}
         */
        setColumnHidden : function(index,hidden){
            this.grid.setColumnHidden(Number(index),hidden);
        },

        /**
         * 构造表格总容器
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        buildContainer : function(){
            //设置表格透明度
            this.setContainerOpacity();
            //构造表格主体
            var mainContainer = document.createElement("div");
            jQuery(mainContainer).addClass("grid-main-container");
            this.buildTableContainer();
            mainContainer.appendChild(this.tableContainer);
            //构造客户端分页容器
            if(this.clientpagination && this.clientpagination.recordInPage && this.dataSource != "dataset"){
            	this.initPageInfor();
                this.buildClientPageContainer();
                mainContainer.appendChild(this.clientPageContainer);
            }
            //构造服务器端分页容器
            if(this.dataSource == "dataset" && this.dataSet.pageSize != -1){
                this.initPageInfor();
                this.buildServerPageContainer();
                mainContainer.appendChild(this.serverPageContainer);
            }
            this.mainContainer = mainContainer;
            jQuery(this.target).empty();
            jQuery(this.target).append(this.mainContainer);
        },

        /**
         * 设置表格容器透明度
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        setContainerOpacity : function(){
            this.opacity = parseFloat(this.opacity);
            if(this.opacity >= 0 && this.opacity < 1){
                //this.container.style.position = "absolute";
                this.target.style.opacity = this.opacity;
                this.target.style.filter = "alpha(opacity="+this.opacity*100+")";
            }
        },

        /**
         * 当有固定列时需要重新计算容器宽度
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        reSetContainer : function(){
            var width = parseFloat(this.width);
            var height = parseFloat(this.height);
            var splitNum = 0;
            var splitArr = this.grid._fake.cellWidthPX;
            for(var i=0,num=splitArr.length; i<num; i++){
                splitNum += parseFloat(splitArr[i]);
            }
            this.grid.myDiv.style.width = width-splitNum+"px";
            this.grid._fake.myDiv.style.width = splitNum+"px";

            this.myDiv.init();
            this.myDiv.setParamters();
            this.myDiv.setLrParamters();
            this.myDiv.sethandle();
        },

        /**
         * 重新设置滚动条
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        reSetScroll: function(){
            var width = parseFloat(this.width);
            var height = parseFloat(this.height);
            var splitNum = 0;
            if(this.grid._fake){
                var splitArr = this.grid._fake.cellWidthPX;
                for(var i=0,num=splitArr.length; i<num; i++){
                    splitNum += parseFloat(splitArr[i]);
                }
            }
            if(this.grid.objBox.scrollWidth>this.grid.objBox.offsetWidth-17){
                this.grid.myDivBar.style.height = height-this.grid.hdr.offsetHeight-14+"px";
                this.grid.myLrDivBar.style.display = "block";
                if(this.grid._fake){
                    this.grid._fake.myLrDivBar.style.display = "block";
                }
            }else{
                this.grid.myDivBar.style.height = height-this.grid.hdr.offsetHeight+"px";
                this.grid.myLrDivBar.style.display = "none";
                if(this.grid._fake){
                    this.grid._fake.myLrDivBar.style.display = "none";
                }
            }
            if(this.grid.objBox.scrollHeight>this.grid.objBox.offsetHeight-17){
                this.grid.myLrDivBar.style.width = width-splitNum-14+"px";
                this.grid.myDivBar.style.display = "block";
            }else{
                this.grid.myLrDivBar.style.width = width-splitNum+"px";
                this.grid.myDivBar.style.display = "none";
            }
            this.myDiv.init();
            this.myDiv.setParamters();
            this.myDiv.setLrParamters();
            this.myDiv.sethandle();
        },

        /**
         * 重新设置滚动条(总)
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        reSetTotalScroll : function(){
            if(this.ischangescroll){
                if(this.splitat > 0){
                    this.reSetContainer();
                }
                this.reSetScroll();
            }
        },

        /**
         * 构造表格中间容器
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        buildTableContainer : function(){
            var tableContainer = document.createElement("div");
            tableContainer.style.width = this.width+"px";
            tableContainer.style.height = this.height+"px";
            this.tableContainer = tableContainer;
        },

        /**
         * 构造客户端分页按钮容器
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        buildClientPageContainer : function(){
            var clientPageContainer = document.createElement("div");
            clientPageContainer.className = "grid-pagenation-box";
            clientPageContainer.style.width = (this.width+2)+"px";
            clientPageContainer.appendChild(this.buildServerPageInfor());
            this.clientPageContainer = clientPageContainer;
        },

        /**
         * 构造服务器端分页按钮容器
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        buildServerPageContainer : function(){
            var serverPageContainer = document.createElement("div");
            serverPageContainer.className = "grid-pagenation-box";
            serverPageContainer.style.width = (this.width+2)+"px";
            serverPageContainer.appendChild(this.buildServerPageInfor());
            this.serverPageContainer = serverPageContainer;
        },

        /**
         * 设置组件内部参数信息
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        initPageInfor : function(){
            this.isFirButtonBind = false;
            this.isPreButtonBind = false;
            this.isNexButtonBind = false;
            this.isLasButtonBind = false;
            this.pageNum = 1;
        },

        /**
         * 构造翻页按钮
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        buildServerPageInfor : function(){
            var self = this;
            var table = document.createElement("table");
            table.className = "grid-pagenation";
            table.border = "0";
            table.align = "right";
            var tbody = document.createElement("tbody");
            table.appendChild(tbody);
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            this.pageInforDips = this.buildPageInforDisp();
            tr.appendChild(this.pageInforDips);
            this.firPage = this.buildPageButton(this.firPageText);
            jQuery(this.firPage).addClass("firPage pagenation_bt").attr("title","首页");
            tr.appendChild(this.firPage);
            this.prePage = this.buildPageButton(this.prePageText);
            jQuery(this.prePage).addClass("prePage pagenation_bt").attr("title","上一页");
            tr.appendChild(this.prePage);
            this.nexPage = this.buildPageButton(this.nexPageText);
            jQuery(this.nexPage).addClass("nexPage pagenation_bt").attr("title","下一页");
            tr.appendChild(this.nexPage);
            this.lasPage = this.buildPageButton(this.lasPageText);
            jQuery(this.lasPage).addClass("lasPage pagenation_bt").attr("title","尾页");
            tr.appendChild(this.lasPage);
            this.buildPageButtonEvent();
            return table;
        },

        /**
         * 构造分页信息显示区域
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        buildPageInforDisp : function(){
            var td = document.createElement("td");
            td.width = "100%";
            var div = document.createElement("div");
            div.className = "serverPageInforDisp";
            div.setAttribute("class","serverPageInforDisp");
            td.appendChild(div);
            return td;
        },

        /**
         * 设置总记录数和总页数
         * @function 私有方法
         * @param {String} rowTotal 总记录数
         * @return {void}
         */
        setTotalPage : function(rowTotal,recordInPage){
            rowTotal = parseInt(rowTotal);
            recordInPage = parseInt(recordInPage);
            this.pagesize = recordInPage;
            this.rowTotal = rowTotal;
            this.totalPage = parseInt((rowTotal + recordInPage -1)/recordInPage);
        },

        /**
         * 写入分页信息显示区域
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        writePageInforDisp : function(){
            var node = this.pageInforDips.childNodes[0];
            var othorstatinfo = $(node).find(".othorstatinfo");
            var infoHTML = (othorstatinfo.html()&&othorstatinfo.html()!=0)? othorstatinfo.html():"";
            node.innerHTML = "共<span><font style='color:red'>"+this.rowTotal+"</font></span>条数据，<span class='othorstatinfo'>"+infoHTML+"</span>每页显示<span>"+this.pagesize+"</span>条，当前<span>"+this.pageNum+"</span>/<span>"+this.totalPage+"</span>页。";
        },

        /**
         * 构造翻页按钮
         * @function 私有方法
         * @param {String} text 按钮名称
         * @param {String} func 事件句柄
         * @return {void}
         */
        buildPageButton : function(text){
            var td = document.createElement("td");
            var div = document.createElement("div");
            div.className = "serverPageButton";
            div.setAttribute("class","serverPageButton");
            div.innerHTML = text;
            td.appendChild(div);
            return td;
        },

        /**
         * 构造翻页按钮事件
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        buildPageButtonEvent : function(){
            var self = this;
            this.firPageEvent = function(){
                self.pageNum=1;
                if(self.dataSourceObj instanceof ATW.TableData.Json){
                	self.grid.changePage(self.pageNum);
                }else{
                	self.dataSourceObj.setDataForGrid(self.grid,self.pageNum);
                }
                self.reSetTotalScroll();
                self.bindPageButton();
                self.callPageChangedBack();
            };
            this.prePageEvent = function(){
                self.pageNum--;
                if(self.pageNum < 1){
                    self.pageNum = 1;
                }
                if(self.dataSourceObj instanceof ATW.TableData.Json){
                	self.grid.changePage(self.pageNum);
                }else{
                	self.dataSourceObj.setDataForGrid(self.grid,self.pageNum);
                }
                self.reSetTotalScroll();
                self.bindPageButton();
                self.callPageChangedBack();
            };
            this.nexPageEvent = function(){
                self.pageNum++;
                if(self.pageNum > self.totalPage){
                    self.pageNum = self.totalPage;
                }
                if(self.dataSourceObj instanceof ATW.TableData.Json){
                	self.grid.changePage(self.pageNum);
                }else{
                	self.dataSourceObj.setDataForGrid(self.grid,self.pageNum);
                }
                self.reSetTotalScroll();
                self.bindPageButton();
                self.callPageChangedBack();
            };
            this.lasPageEvent = function(){
                self.pageNum = self.totalPage;
                if(self.dataSourceObj instanceof ATW.TableData.Json){
                	self.grid.changePage(self.pageNum);
                }else{
                	self.dataSourceObj.setDataForGrid(self.grid,self.pageNum);
                }
                self.reSetTotalScroll();
                self.bindPageButton();
                self.callPageChangedBack();
            };
        },

        /**
         * 服务器端分页处理事件
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        callPageChangedBack : function(){
            this.reSetTotalScroll();
            if(this.pagenationdes){
            	this.writePageInforDisp();
            }
            this.onpagechange(this.pageNum);
        },

        /**
         * 变换翻页按钮事件
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        bindPageButton : function(){
            if(!this.isFirButtonBind){
                var node = this.firPage.childNodes[0];
                node.className = "serverPageButton";
                node.setAttribute("class","serverPageButton");
                jQuery(this.firPage).click(this.firPageEvent);
                this.isFirButtonBind = true;
            }
            if(!this.isPreButtonBind){
                var node = this.prePage.childNodes[0];
                node.className = "serverPageButton";
                node.setAttribute("class","serverPageButton");
                jQuery(this.prePage).click(this.prePageEvent);
                this.isPreButtonBind = true;
            }
            if(!this.isNexButtonBind){
                var node = this.nexPage.childNodes[0];
                node.className = "serverPageButton";
                node.setAttribute("class","serverPageButton");
                jQuery(this.nexPage).click(this.nexPageEvent);
                this.isNexButtonBind = true;
            }
            if(!this.isLasButtonBind){
                var node = this.lasPage.childNodes[0];
                node.className = "serverPageButton";
                node.setAttribute("class","serverPageButton");
                jQuery(this.lasPage).click(this.lasPageEvent);
                this.isLasButtonBind = true;
            }
            if(this.pageNum == 1){
                if(this.isFirButtonBind){
                    var node = this.firPage.childNodes[0];
                    node.className = "serverPageButton_off";
                    node.setAttribute("class","serverPageButton_off");
                    jQuery(this.firPage).unbind("click",this.firPageEvent);
                    this.isFirButtonBind = false;
                }
                if(this.isPreButtonBind){
                    var node = this.prePage.childNodes[0];
                    node.className = "serverPageButton_off";
                    node.setAttribute("class","serverPageButton_off");
                    jQuery(this.prePage).unbind("click",this.prePageEvent);
                    this.isPreButtonBind = false;
                }
            }
            var recordInPage = (this.dataSet && this.dataSet.pageSize != -1) ? this.dataSet.pageSize : this.serverPagination.recordInPage;
            if(this.pageNum == this.totalPage || this.rowTotal <= recordInPage){
                if(this.isNexButtonBind){
                    var node = this.nexPage.childNodes[0];
                    node.className = "serverPageButton_off";
                    node.setAttribute("class","serverPageButton_off");
                    jQuery(this.nexPage).unbind("click",this.nexPageEvent);
                    this.isNexButtonBind = false;
                }
                if(this.isLasButtonBind){
                    var node = this.lasPage.childNodes[0];
                    node.className = "serverPageButton_off";
                    node.setAttribute("class","serverPageButton_off");
                    jQuery(this.lasPage).unbind("click",this.lasPageEvent);
                    this.isLasButtonBind = false;
                }
            }
        },

        /**
         * 解除所有翻页按钮点击事件
         * @function 私有方法
         * @param {}
         * @return {void}
         */
        unbindAll : function(){
            if(!this.isFirButtonBind){
            	jQuery(this.firPage).unbind("click",this.firPageEvent);
            }
            if(!this.isPreButtonBind){
            	jQuery(this.prePage).unbind("click",this.prePageEvent);
            }
            if(!this.isNexButtonBind){
            	jQuery(this.nexPage).unbind("click",this.nexPageEvent);
            }
            if(!this.isLasButtonBind){
            	jQuery(this.lasPage).unbind("click",this.lasPageEvent);
            }
        },

        /**
         * 销毁表格组件
         * @function 公有方法
         * @param {Object} selfObj 表格对象
         * @return {void}
         */
        destroy : function(selfObj){
            this.target.innerHTML = "";
            selfObj = null;
        },

        /**
         * 重新设置表格宽度
         * @function 公有方法
         * @param {Number} width 表格宽度
         * @return {void}
         */
        reSetWidth : function(width){
            width = Number(width);
            this.tableContainer.style.width = width+"px";
            //this.grid.objBox.style.width = width;
            this.width = width;
            if(this.ischangescroll){
                this.grid.myDiv.style.width = width+"px";
                this.reSetTotalScroll();
            }
            if(this.clientpagination && this.clientpagination.recordInPage){
                this.clientPageContainer.style.width = width+"px";
                this.setClientPagination(this.grid);
            }
            if(this.dataSource == "dataset" && this.dataSet.pageSize != -1){
                this.serverPageContainer.style.width = width+"px";
            }
        },

        /**
         * 重新设置表格高度
         * @function 公有方法
         * @param {Number} height 表格高度
         * @return {void}
         */
        reSetHeight : function(height){
            height = Number(height);
            this.tableContainer.style.height = height+"px";
            //this.grid.objBox.style.height = height - 28;
            this.grid.setSizes();
            if(this.splitat > 0){
                this.grid._fake.objBox.style.height = height+"px";
            }
            this.height = height;
            if(this.ischangescroll){
                this.grid.myDiv.style.height = height+"px";
                if(this.splitat > 0){
                    this.grid._fake.myDiv.style.height = height+"px";
                }
                this.reSetTotalScroll();
            }
        },

        /**
         * 重新设置表格数据
         * @function 公有方法
         * @param {Object} param 数据
         * @return {void}
         */
        reSetData : function(param){
            if(this.dataSource == "json"){
                if(!param.json){
                    throw ("“reSetData”方法: 参数json属性为空，请为该json属性赋值！");
                }
                this.json = this.dataSourceObj.json = param.json;    
            }else if(this.dataSource == "dataset"){
                if(!param.dataset){
                	throw ("“reSetData”方法: 参数dataSet属性为空，请为该dataSet属性赋值！");
                }
                this.dataSet = this.dataSourceObj.dataSet = param.dataset;
            }else if(this.dataSource == "xml"){
                if(!param.xml){
                    throw ("“reSetData”方法: 参数xml属性为空，请为该xml属性赋值！");
                }
                this.xml = this.dataSourceObj.xml = param.xml;
            }
            this.dataSourceObj.setDataForGrid(this.grid);
            if(this.dataSource == "dataset" && this.dataSet.pageSize != -1){
                this.initPageInfor();
                this.unbindAll();
                this.setTotalPage(this.dataSet.getRecordCount(),this.dataSet.pageSize);
                if(this.pagenationdes){	
                	this.writePageInforDisp();
                }
                this.bindPageButton();
            }
            this.reSetTotalScroll();
        },

        /**
         * 复制属性
         * @function 私有方法
         * @param docObj {Object} doc对象
         * @return void
         */
        copyAttribute : function(docObj){
            at.form.Control.prototype.copyAttribute.apply(this,arguments);
            var xml = docObj.innerHTML;
            if(xml != ""){
                xml = this.innerHTML2XML(xml);
                xml = this.replaceAll(xml,"ROWS","rows");
                xml = this.replaceAll(xml,"HEAD","head");
                xml = this.replaceAll(xml,"COLUMN","column");
                xml = this.replaceAll(xml,"ROW","row");
                xml = this.replaceAll(xml,"CELL","cell");
                xml = this.replaceAll(xml,"#CDATA-","<![CDATA[");
                xml = this.replaceAll(xml,"-CDATA#","]]>");
                this.xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
            }
            this.style.position = "absolute";
        },

        /**
         * 停止事件响应
         * @function 私有方法
         * @param {Object} o：对象变量
         * @return {Void}
         */
        stopEvent:function(e) {
            //目前表格组件不支持阻止冒泡
        },
        
		/**
         * 组件名称
         * @type {String}
         */
        WIDGET_NAME: "表格组件"
    });
})(ATW);