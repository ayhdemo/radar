
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

var echarts = require("../../echarts");

var createListSimply = require("../helper/createListSimply");

var _model = require("../../util/model");

var defaultEmphasis = _model.defaultEmphasis;

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
var FunnelSeries = echarts.extendSeriesModel({
  type: 'series.funnel',
  init: function (option) {
    FunnelSeries.superApply(this, 'init', arguments); // Enable legend selection for each data item
    // Use a function instead of direct access because data reference may changed

    this.legendDataProvider = function () {
      return this.getRawData();
    }; // Extend labelLine emphasis


    this._defaultLabelLine(option);
  },
  getInitialData: function (option, ecModel) {
    return createListSimply(this, ['value']);
  },
  _defaultLabelLine: function (option) {
    // Extend labelLine emphasis
    defaultEmphasis(option, 'labelLine', ['show']);
    var labelLineNormalOpt = option.labelLine;
    var labelLineEmphasisOpt = option.emphasis.labelLine; // Not show label line if `label.normal.show = false`

    labelLineNormalOpt.show = labelLineNormalOpt.show && option.label.show;
    labelLineEmphasisOpt.show = labelLineEmphasisOpt.show && option.emphasis.label.show;
  },
  // Overwrite
  getDataParams: function (dataIndex) {
    var data = this.getData();
    var params = FunnelSeries.superCall(this, 'getDataParams', dataIndex);
    var valueDim = data.mapDimension('value');
    var sum = data.getSum(valueDim); // Percent is 0 if sum is 0

    params.percent = !sum ? 0 : +(data.get(valueDim, dataIndex) / sum * 100).toFixed(2);
    params.$vars.push('percent');
    return params;
  },
  defaultOption: {
    zlevel: 0,
    // ????????????
    z: 2,
    // ????????????
    legendHoverLink: true,
    left: 80,
    top: 60,
    right: 80,
    bottom: 60,
    // width: {totalWidth} - left - right,
    // height: {totalHeight} - top - bottom,
    // ??????????????????????????????
    // min: 0,
    // max: 100,
    minSize: '0%',
    maxSize: '100%',
    sort: 'descending',
    // 'ascending', 'descending'
    gap: 0,
    funnelAlign: 'center',
    label: {
      show: true,
      position: 'outer' // formatter: ???????????????????????????Tooltip.formatter????????????????????????

    },
    labelLine: {
      show: true,
      length: 20,
      lineStyle: {
        // color: ??????,
        width: 1,
        type: 'solid'
      }
    },
    itemStyle: {
      // color: ??????,
      borderColor: '#fff',
      borderWidth: 1
    },
    emphasis: {
      label: {
        show: true
      }
    }
  }
});
var _default = FunnelSeries;
module.exports = _default;