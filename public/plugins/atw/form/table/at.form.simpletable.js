;(function(atw){
	/**
	 * 简单表格
	 * @module Control
	 * @author cqb
	 * @version 2.1
	 * @class ATW.SimpleTable
	 */
	atw.extendClass("SimpleTable",ATW.Control,{
		/**
		 * 数据集
		 * @type {Object}
		 * @property data
		 */
		data: null,
		/**
		 * 表头列数据
		 * @type {Array}
		 * @property columns
		 */
		columns: null,
		/**
		 * 行数据
		 * @type {Array}
		 * @property rows
		 */
		rows: null,
		/**
		 * 是否使用复选框列
		 * @type {Boolean}
		 * @property checkboxcolumn
		 */
		checkboxcolumn: false,
		/**
		 * 进行排序
		 * @type {Boolean}
		 * @default false
		 * @property sortable
		 */
		sortable: false,
		/**
		 * 列是否支持拖拽
		 * @type {Boolean}
		 * @default true
		 * @property sortable
		 */
		resizable: true,
		/**
		 * 是否懒加载
		 * @type {Boolean}
		 * @default false
		 * @property islazy
		 */
		islazy: false,
		/**
		 * 懒加载时间戳
		 * @type {int}
		 * @property lazytimer
		 */
		lazytimer: null,
		/**
		 * 懒加载开始行号
		 * @type {Number}
		 * @property _lazystart
		 */
		_lazystart: 0,
		/**
		 * 基偶行颜色
		 * @type {Boolean}
		 * @default true
		 * @property oddrowcolor
		 */
		oddrowcolor: true,
		/**
		 * 选择模式
		 * @type {String}
		 * @property selectionmode
		 */
		selectionmode: "row",
		/**
		 * 每一列的宽度
		 * @type {Array}
		 * @property _columnswidth
		 */
		_columnswidth: [],
		/**
		 * 每一列的最小宽度
		 * @type {Array}
		 * @property _columnsminwidth
		 */
		_columnsminwidth: [],
		
		/**
		 * 复选框选中的个数
		 * @type {Number}
		 * @property selectednum
		 */
		selectednum: 0,
		
		/**
		 * 设置参数信息
		 * @constructor
         * @param {Object} options 参数
		 */
		initialize : function(options){
			ATW.Control.prototype.initialize.apply(this, arguments);
			
			this._render();
		},
		
		/**
		 * 入口
		 * @private
		 * @method _render
		 */
		_render: function(){
			this.columns = this.data.columns;
			this.rows = this.data.rows;
			//创建表格结构
			this._create();
			//创建表格
			this._createTable();
			//基偶行间隔颜色
			this._oddeven();
			//更新滚动条
			this.scrollupdate();
			//滚动条resize事件
			this.scrollresize();
			//列拖拽事件
			this._draglistener();
			//选择事件
			this._addSelectListener();
			//checkbox事件
			this._addCheckBoxListener();
			//排序事件
			this._addSortListener();
		},
		
		/**
		 * 创建表格结构
		 * @private
		 * @method _create
		 */
		_create: function(){
			jQuery(this.target).addClass("atw_grid");
			var atw_grid_box = $('<div class="atw_grid_box"></div>');
			var atw_grid_scroll = $('<div class="atw_grid_scroll"></div>');
			atw_grid_box.append(atw_grid_scroll);
			jQuery(this.target).append(atw_grid_box);
			
			var atw_grid_scroll_box = $('<div class="atw_grid_client atw_grid_scroll_box"></div>');
			atw_grid_scroll_box.append('<div class="atw_grid_scroll_spacer"> </div>');
			
			var atw_grid_scroll_content = $('<div class="atw_grid_client atw_grid_scroll_content"></div>');
			atw_grid_scroll.append(atw_grid_scroll_box).append(atw_grid_scroll_content);
			
			var atw_grid_view_top = $('<div class="atw_grid_client atw_grid_view_top"></div>');
			var atw_grid_view_middle = $('<div class="atw_grid_client atw_grid_view_middle"></div>');
			atw_grid_scroll_content.append(atw_grid_view_top).append(atw_grid_view_middle);
			
			var atw_grid_headers = $('<div class="atw_grid_headers"></div>');
			atw_grid_view_top.append(atw_grid_headers);
			
			var atw_grid_rows = $('<div class="atw_grid_rows"></div>');
			atw_grid_view_middle.append(atw_grid_rows);
			atw_grid_rows.append('<div class="atw_grid_row"></div>');
		},
		
		/**
		 * 创建表格
		 */
		_createTable: function(){
			var columns = this.columns;
		    var rows = this.rows;
		    $(".atw_grid_headers", this.target).empty();
		    if(this.checkboxcolumn){
		    	$(".atw_grid_headers", this.target).append('<div id="atw_column_checkbox" class="atw_column_checkbox">'+
                        '<div class="atw_column_text align_center"><input type="checkbox"></div>'+
                    '</div>');
		    }
		    
		    this._createHeader(columns);
		    
		    var length = rows.length;
		    if(this.islazy){
		        var bodyh = $(".atw_grid_view_middle", this.target).outerHeight(true);
		        var rowHeight = $(".atw_grid_row", this.target).outerHeight(true);
		        var length = parseInt(bodyh/rowHeight)+1;
		    }
		    $('.atw_grid_rows', this.target).empty();
		    
		    for(var index = 0; index < length; index++){
		        var rowdata = rows[index];
		        this._createRow(rowdata, index, columns);
		    };
		},
		
		/**
		 * 重设表格数据
		 * @method setData
		 * @param {Object} data 表格新数据
		 */
		setData: function(data){
			this.data = data;
			this.columns = this.data.columns;
			this.rows = this.data.rows;
			this._columnswidth = [];
	        this._columnsminwidth = [];
	        $(".atw_grid_rows", this.target).css({"top": "0px","left": "0px"});
	        $(".atw_grid_headers", this.target).css("left", "0px");
	        $(".atw_grid_scroll_box", this.target).scrollTop(0);
			this._createTable();
			//基偶行间隔颜色
			this._oddeven();
			//更新滚动条
			this.scrollupdate();
			//排序事件
			this._addSortListener();
		},
		
		/**
		 * 创建表头
		 * @private
		 * @method _createHeader
		 * @param {Array} columns 列数据
		 */
		_createHeader: function(columns){
			columns.forEach(function(col, index){
		        var column = $('<div id="atw_column_'+index+'" class="atw_column">'+
		                       '<div class="atw_column_text align_center">'+col.name+'</div></div>');
		        if(col.display == "false" || col.display == false){
		            column.hide();
		        }
		        $(".atw_grid_headers", this.target).append(column);
		        if(col.width){
		            column.css("width",col.width);
		        }
		        if(col.minWidth){
		            column.css("minWidth",col.minWidth);
		        }
		        var sorttype = col.type;
		        column.attr("sorttype",sorttype);
		        if(this.sortable){
		            column.append('<div class="atw_column_sort"> </div>');
		        }
		        if(this.selectionmode == "col"){
		            column.append('<div class="atw_column_select"> </div>');
		        }
		        if(this.resizable){
		            var separator = $('<div class="atw_column_separator atw_column_resizable"> </div>');
		            column.after(separator);
		            var visible = column.is(":visible");
		            visible ? false : separator.hide();
		        }
		        
		        var width = column.outerWidth(true);
		        this._columnswidth.push(width);
		        this._columnsminwidth.push(column.css("minWidth"));
		    },this);
		},
		
		/**
		 * 创建行
		 * @private
		 * @method _createRow
		 * @param {Object} rowdata	行数据
		 * @param {Object} index	行号
		 * @param {Object} columns	列数据
		 */
		_createRow: function(rowdata, index, columns){
			var row = $('<div id="atw_grid_row_'+index+'" class="atw_grid_row"></div>');
		    if(this.checkboxcolumn){
		        var checked = $(".atw_column_checkbox input", this.target).is(":checked");
		        var checkboxcol = $('<div id="atw_grid_cell_checkbox_'+index+'" class="atw_grid_cell_checkbox">'+
		                    '<input type="checkbox"></div>');
		        checkboxcol.children().attr("checked", checked);
		        row.append(checkboxcol);
		    }
		    columns.forEach(function(column, colindex){
		        var value = rowdata[column.id];
		        var col = $('<div id="atw_cell_'+index+'_'+colindex+'" class="atw_grid_cell atw_column_'+colindex+'">'+value+'</div>');
		        if(column.display == "false" || column.display == false){
		            col.hide();
		        }
		        row.append(col);
		        $('.atw_grid_rows', this.target).append(row);
		        col.css("width", this._columnswidth[colindex]);
		        col.css("minWidth", this._columnsminwidth[colindex]);
		        
		        col.hover(function(){
		        	if(!$(this).attr("title")){
		        		if(this.childNodes.length && this.childNodes[0].nodeType==3){
		        			$(this).attr("title", $(this).html());
		        		}
		        	}
		        },function(){});
		    }, this);
		},
		
		/**
		 * 偶数基数行设置
		 */
		_oddeven: function(){
			if(this.oddrowcolor){
				$(".atw_grid_row", this.target).removeClass("odd").removeClass("even");
				$(".atw_grid_row:odd", this.target).addClass("odd");
				$(".atw_grid_row:even", this.target).addClass("even");
			}
		},
		
		/**
		 * 滚动条滚动事件
		 */
		scrollupdate: function(){
			var w = this._getColumnsWidth();
			var h = this._getRowsHeight();
			
			$(".atw_grid_scroll_spacer", this.target).width(w).height(h);
			var spacerw = $(".atw_grid_scroll_spacer", this.target)[0].scrollWidth;
			var spacerh = $(".atw_grid_scroll_spacer", this.target)[0].scrollHeight;
			var boxw = $(".atw_grid_scroll_box", this.target).outerWidth();
			var boxh = $(".atw_grid_scroll_box", this.target).outerHeight();
			
			var hasscrollh = boxh/spacerh < 1 ? true : false;
			var hasscrollw = boxw/spacerw < 1 ? true : false;
			hasscrollw ? boxh = boxh - 17 : false;
			hasscrollh ? boxw = boxw - 17 : false;
			if(boxw/spacerw < 1){
				$(".atw_grid_scroll_content", this.target).css("bottom","17px");
			}else{
				$(".atw_grid_scroll_content", this.target).css("bottom","0px");
			}
			if(boxh/spacerh < 1){
				$(".atw_grid_scroll_content", this.target).css("right","17px");
			}else{
				$(".atw_grid_scroll_content", this.target).css("right","0px");
			}
			
			var self = this;
			$(".atw_grid_scroll_box", this.target).scroll(function(evt){
			    if(!self.islazy){
		    		var delta = evt.target.scrollTop/evt.target.scrollHeight;
		    		var scrolltop = delta*spacerh;
		    		$(".atw_grid_rows", self.target).css("top", -scrolltop);
				}else{
				    if(self.lazytimer){
				        window.clearTimeout(self.lazytimer);
				    }
				    self.lazytimer = window.setTimeout(function(){
		    		    var target = $(".atw_grid_scroll_box", self.target);
		    		    var bodyh = $(".atw_grid_view_middle", self.target).outerHeight(true);
		                var height = target.scrollTop();
		                var rowHeight = $(".atw_grid_row", self.target).outerHeight(true);
		                var start = parseInt(height/rowHeight);
		                self._lazystart = start;
		                var startoffset = height%rowHeight;
		                $(".atw_grid_rows", self.target).css("top", -startoffset);
		                var length = Math.floor(parseInt(bodyh/rowHeight))+1;
		                if(start+length > self.rows.length){
		                    start = self.rows.length - length;
		                }
		                
		                $('.atw_grid_rows', self.target).empty();
		                for(var i = 0; i < length; i++){
		                    self._createRow(self.rows[start+i],start+i,self.columns);
		                }
		                
		                self._oddeven();
				    }, 30);
				}
				var delta = evt.target.scrollLeft/evt.target.scrollWidth;
				var scrollleft = delta*spacerw;
				$(".atw_grid_headers", self.target).css("left", -scrollleft);
				$(".atw_grid_rows", self.target).css("left", -scrollleft);
			});
			
			if(window.addEventListener){
				$(".atw_grid_scroll", this.target)[0].addEventListener('mousewheel', this._mousewheeltoscroll,false);
			}else{
				$(".atw_grid_scroll", this.target)[0].onmousewheel = this._mousewheeltoscroll;
			}
		},
		
		/**
		 * 滚动条resize事件
		 * @method scrollresize
		 * @private
		 */
		scrollresize: function(){
			var self = this;
			if($.browser.msie){
				$(".atw_grid_scroll_box", this.target).resize(function(e){
					self.scrollupdate();
					$(this).scroll();
				});
			}
		},
		
		/**
		 * 获取总列宽
		 * @private
		 * @method _getColumnsWidth
		 * @return {Number} 所有显示列的宽度总和
		 */
		_getColumnsWidth: function(){
			var w = 0;
			$(".atw_column:visible", this.target).each(function(){
				w += $(this).outerWidth(true);
			});
			
			if(this.checkboxcolumn){
			    w += $(".atw_column_checkbox", this.target).outerWidth();
			}
			
			return w;
		},
		
		/**
		 * 获取所有行的高度
		 * @private
		 * @method _getRowsHeight
		 * @return {Number} 所有显示行的高度总和
		 */
		_getRowsHeight: function(){
			var h = 0;
			var oh = $(".atw_grid_row", this.target).outerHeight(true);
			h = oh * this.rows.length;
			h += $(".atw_grid_view_top", this.target).outerHeight(true);
			
			return h;
		},
		
		/**
		 * 鼠标滚轮事件
		 * @private
		 * @method _mousewheeltoscroll
		 */
		_mousewheeltoscroll: function(evt){
			evt = evt || window.event;
		    var wheeldelta = evt.wheelDelta/120;
		    var wheeloffset = 40;
		    var target = $(".atw_grid_scroll_box", this.target);
		    var st = target.scrollTop();
		    target.scrollTop(st - wheeloffset*wheeldelta);
		},
		
		/**
		 * 列拖拽事件
		 * @private
		 * @method _draglistener
		 */
		_draglistener: function(){
			var draggingstart = false;
			var lastpos = 0;
			var self = this;
			$(".atw_column_separator", this.target).live("mousedown", function(){
				$(".atw_column_separator", self.target).removeClass("atw_grid_separator_active");
				$(this).addClass("atw_grid_separator_active");
				draggingstart = true;
				lastpos = 0;
				return false;
			});
			$(document).live("mouseup.simpletable",$.proxy(function(){
				draggingstart = false;
				var separator = $(".atw_grid_separator_active", this.target);
				if(separator.length){
					var lw = separator.prev().outerWidth(true);
					var lid = separator.prev().attr("id");
					$(".atw_grid_rows ."+lid, this.target).css("width",lw);
					var index = lid.split("_")[2];
					this._columnswidth[index] = lw;
					
					this.scrollupdate();
				}
			},self));
			
			$(document).live("mousemove.simpletable",$.proxy(function(evt){
				if (draggingstart) {
					var separator = $(".atw_grid_separator_active", this.target);
					var x = evt.pageX;
					var offpos = lastpos ? x - lastpos : 0;
					lastpos = x;
					
					var lw = separator.prev().outerWidth(true);
					separator.prev().css("width",lw+offpos);
				}
				
				return true;
			},self));
		},
		
		/**
		 * 表格选中高亮
		 * 支持cell、multicell、row、multirow模式
		 * multicell采用shift+鼠标选中
		 * multirow采用ctrl+鼠标选中
		 * @private
		 * @method _addSelectListener
		 */
		_addSelectListener: function(){
			var startcell = null;
			var self = this;
			$(".atw_grid_cell", this.target).live("click",function(evt){
				var selectionmode = self.selectionmode;
				var id = $(this).attr("id");
				var parts = id.split("_");
				var param = {
					colindex: parts[3],
					rowindex: parts[2],
					cell: this,
					row: $("#atw_grid_row_"+parts[2], self.target)[0],
					column: self.columns[parts[3]],
					rowdata: self.rows[parts[2]]
				};
				self.cellSelected(param);
				
				var param = {
					rowindex: parts[2],
					row: $(this).parent()[0],
					rowdata: self.rows[parts[2]]
				};
				self.rowSelected(param);
				
				if(selectionmode == "cell"){
					if(!$(this).hasClass("selected")){
						$(".atw_grid_cell.selected", self.target).removeClass("selected");
						$(this).addClass("selected");
					}
				}
				if(selectionmode == "multicell"){
					if(evt.shiftKey){
						if(startcell){
							$(".atw_grid_cell.selected", self.target).removeClass("selected");
							var startcellid = $(startcell).attr("id");
							var parts = startcellid.split("_");
							var colindex = parts[3];
							var rowindex = parts[2];
							
							var thecellid = $(this).attr("id");
							var parts = thecellid.split("_");
							var thecolindex = parts[3];
							var therowindex = parts[2];
							
							var startcol = Math.min(colindex, thecolindex);
							var endcol = Math.max(colindex, thecolindex);
							var startrow = Math.min(rowindex, therowindex);
							var endrow = Math.max(rowindex, therowindex);
							if(self.islazy){
								startrow -= self._lazystart;
								endrow -= self._lazystart;
							}
							
							for(var i=startrow; i<=endrow; i++) {
								var row = $(".atw_grid_row", self.target).eq(i);
								for(var j=startcol; j<=endcol; j++) {
									row.children(".atw_column_"+j).addClass("selected");
								}
							}
						}
					}else{
						if(!$(this).hasClass("selected")){
							$(".atw_grid_cell.selected", self.target).removeClass("selected");
							$(this).addClass("selected");
							startcell = this;
						}
					}
				}
				
				if(selectionmode == "row"){
					$(".atw_grid_row.active", self.target).removeClass("active");
					$(this).parent().addClass("active");
				}
				
				if(selectionmode == "multirow"){
					if(evt.ctrlKey){
						$(this).parent().addClass("active");
					}else{
						$(".atw_grid_row.active", self.target).removeClass("active");
						$(this).parent().addClass("active");
					}
				}
				
				return false;
			});
			
			
			$(".atw_column_select", this.target).live("click", function(){
				if(!$(this).hasClass("selected")){
					var ele = $(".atw_column_select.selected", this.target);
					if(ele.length){
						ele.removeClass("selected");
						var id = ele.parent().attr("id");
						var colnum = id.split("_")[2];
						$(".atw_grid_cell.atw_column_"+colnum).removeClass("selected");
					}
				}
				$(this).addClass("selected");
				var id = $(this).parent().attr("id");
				var colnum = id.split("_")[2];
				
				$(".atw_grid_cell.atw_column_"+colnum).addClass("selected");
				
				var coldata = [];
				var colid = self.columns[colnum].id;
				self.rows.forEach(function(item, index){
					coldata.push(item[colid]);
				});
				var params = {
					colindex: colnum,
					column: self.columns[colnum],
					coldata: coldata
				};
				self.columnSelected(params);
			});
		},
		
		/**
		 * cell选择回调函数
		 * @method cellSelected
		 * @param {Object} param cell所在对象数据包含cell/colindex/rowindex/row/column/rowdata
		 */
		cellSelected: function(param){
			
		},
		
		/**
		 * 行选中回调函数
		 * @method rowSelected
		 * @param {Object} param row所在对象数据包含rowindex/row/rowdata
		 */
		rowSelected: function(param){
			
		},
		
		/**
		 * 列选中回调函数
		 * @method columnSelected
		 * @param {Object} param 列所在对象数据包含colindex/column/coldata
		 */
		columnSelected: function(param){
			
		},
		
		/**
		 * 添加复选框列事件
		 * @private
		 * @method _addCheckBoxListener
		 */
		_addCheckBoxListener: function(){
			var self = this;
			$(".atw_column_checkbox", this.target).live("click",function(){
		        var checked = $("input",this).is(":checked");
		        $(".atw_grid_cell_checkbox input", this.target).attr("checked",checked);
		        
		        if(checked){
		        	self.selectednum = self.rows.length;
		        }else{
		        	self.selectednum = 0;
		        }
		    });
			
			$(".atw_grid_cell_checkbox input", this.target).live("click",function(){
				var checked = $(this).is(":checked");
				if(!checked){
					$(".atw_column_checkbox input", self.target).attr("checked",checked);
					self.selectednum = self.selectednum - 1;
				}else{
					self.selectednum = self.selectednum + 1;
					if(self.selectednum == self.rows.length){
						$(".atw_column_checkbox input", self.target).attr("checked", true);
					}
				}
			});
		},
		
		/**
		 * 排序事件监听
		 * @private
		 * @method _addSortListener
		 */
		_addSortListener: function(){
			var self = this;
			$(".atw_column_sort", this.target).bind("click", function(){
				var clazz = $(this).parent().attr("id");
				var sorttype = $(this).parent().attr("sorttype");
				
				if($(this).hasClass("desc")){
					$(this).removeClass("desc");
					$(this).addClass("asc");
					self._columnSort(clazz, sorttype, false);
				}else if($(this).hasClass("asc")){
					$(this).removeClass("asc");
					$(this).addClass("desc");
					self._columnSort(clazz, sorttype, true);
				}else{
					$(".atw_column_sort", this.target).removeClass("asc");
					$(".atw_column_sort", this.target).removeClass("desc");
					
					$(this).addClass("desc");
					
					self._columnSort(clazz, sorttype, true);
				}
			});
		},
		
		/**
		 * 列排序
		 * @private
		 * @method _columnSort
		 * @param {String} clazz
		 * @param {String} sorttype	"numeric"/"String"
		 * @param {Boolean} sortdesc true/false
		 */
		_columnSort: function(clazz, sorttype, sortdesc){
			var arr = this._getValuesToSort(clazz);
			var sortedrows = this._sortValues(arr,sorttype,sortdesc);
			sortedrows.forEachRight(function(item, index){
				item.row.parent().prepend(item.row);
			});
			
			this._oddeven();
		},
		
		/**
		 * 获取进行排序的值
		 * @private
		 * @method _getValuesToSort
		 * @param {String} clazz css选择器
		 * @return {Array} 进行排序对比的数据
		 */
		_getValuesToSort: function(clazz){
			var valuesToSort = [];
			$("."+clazz).each(function(index){
				valuesToSort.push({row:$(this).parent(),value:$.trim($(this).html())});
			});
			
			return valuesToSort;
		},
		
		/**
		 * 进行排序
		 * @private
		 * @method _sortValues
		 * @param {Array} valuesToSort 进行排序对比的数据
		 * @param {String} sorttype	"numeric"/"String"
		 * @param {Boolean} sortdesc true/false
		 */
		_sortValues: function(valuesToSort, sorttype, sortDesc){
			sorttype == "int" ?
			valuesToSort.sortObjectsByKey("value",function(a, b){
				return (a.replace(/[^\d\.]/g, '', a)-b.replace(/[^\d\.]/g, '', b));
			})
			:
			valuesToSort.sortObjectsByKey("value",function(a, b){
				return a.localeCompare(b);
			});
			
			if(sortDesc){
				valuesToSort_tempCopy = [];
				valuesToSort.forEachRight(function(item, index){
					valuesToSort_tempCopy.push(item);
				});
				valuesToSort = valuesToSort_tempCopy;
				delete(valuesToSort_tempCopy);
			}
			
			return valuesToSort;
		},
		
		/**
		 * 设置列宽
		 * @method setColumnsWidth
		 * @param {Array} columnswidth 列宽值如：[80,100,120]或者[{"0": 80},{"2":120}]
		 */
		setColumnsWidth: function(columnswidth){
			columnswidth.forEach(function(item, index){
				if(typeof(item) == 'object'){
					for(var i in item){
						this.setColumnWidth(i, item[i]);
					}
				}else{
					this.setColumnWidth(index, item);
				}
			}, this);
		},
		
		/**
		 * 设置列宽
		 * @method setColumnWidth
		 * @param {Object} index	列索引
		 * @param {Object} width	列宽度
		 */
		setColumnWidth: function(index, width){
			$("#atw_column_"+index, this.target).css("width", width);
			$(".atw_column_"+index, this.target).css("width", width);
			this._columnswidth[index] = width;
			
			this.scrollupdate();
		},
		
		/**
		 * 根据指定的列号隐藏列
		 * @method hideColumns
		 * @param {Array} cloumns	列号索引数组[0,1,2,3...]
		 */
		hideColumns: function(cloumns){
			cloumns.forEach(function(item){
				this.hideColumn(item);
			},this);
		},
		
		/**
		 * 隐藏某列
		 * @method hideColumn
		 * @param {Number} index	隐藏列的索引
		 */
		hideColumn: function(index){
			var column = $("#atw_column_"+index, this.target);
			column.hide();
			column.next(".atw_column_separator").hide();
			var id = column.attr("id");
			$("."+id, this.target).hide();
			
			//更新滚动条
			this.scrollupdate();
		},
		
		/**
		 * 显示列
		 * @method showColumns
		 * @param {Array} cloumns	显示列的索引[0,1,2,3...]
		 */
		showColumns: function(cloumns){
			cloumns.forEach(function(item){
				this.showColumn(item);
			}, this);
		},
		
		/**
		 * 显示列
		 * @method showColumn
		 * @param {Number} index	显示列索引
		 */
		showColumn: function(index){
			var column = $("#atw_column_"+index, this.target);
			column.show();
			column.next(".atw_column_separator").show();
			
			var id = column.attr("id");
			$("."+id, this.target).show();
			
			//更新滚动条
			this.scrollupdate();
		},
		
		/**
		 * 设置列是否允许拖拽
		 * @method setColumnResizable
		 * @param {Object} index	索引
		 * @param {Object} resizable	是否可拖拽true/false
		 */
		setColumnResizable: function(index, resizable){
			if(index != undefined){
				var column = $("#atw_column_"+index, this.target);
				var next = column.next();
				if(resizable){
					if(!column.next().hasClass("atw_column_separator")){
						var separator = $('<div class="atw_column_separator atw_column_resizable"> </div>');
						column.after(separator);
					}
				}else{
					if(next.hasClass("atw_column_separator")){
						next.remove();
					}
				}
			}
		},
		
		/**
		 * 设置表格选择模式
		 * @method setSelectionMode
		 * @param {String} mode 选择模式
		 */
		setSelectionMode: function(mode){
			this.selectionmode = mode;
		},
		
		/**
		 * 获取复选框选中的行数据
		 * @method getSelectedRows
		 * @return {Array} 选中的数据集
		 */
		getSelectedRows: function(){
			var selectedrows = [];
			var self = this;
			
			var allchecked = $(".atw_column_checkbox input", this.target).is(":checked");
			if(allchecked && !this.islazy){
				selectedrows = this.rows;
			}else{
				$(".atw_grid_cell_checkbox input:checked", this.target).each(function(){
					var r = $(this).parent().parent();
					var rownum = r.attr("id").split("_")[3];
					var row = self.rows[rownum];
					selectedrows.push(row);
				});
			}
			
			return selectedrows;
		}
	});
})(ATW)