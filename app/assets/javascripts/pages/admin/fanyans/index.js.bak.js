//= require jquery
//= require jquery_ujs
//= require bootstrap/js/bootstrap.min
//= require moment/moment
//
//
//= require components/admin/common/metronic
//= require components/admin/common/layout
//= require components/admin/common/index
//= require components/admin/table-ajax/index
//
//
//= require bootstrap-table.min
//= require bootstrap-table-zh-CN.min
//= require clipboard.min
//
//= require remarkable-bootstrap-notify/bootstrap-notify
//= require common/my-notify
//= require common/lib
//
//
//= require_self

// 利用翻译文件-更改搜索框内容
!function changeSearchPlaceholder() {
    $.fn.bootstrapTable.locales["zh-CN"].formatSearch = function () {
        return '搜索条件： 国名、地名、型号、体制、用途..'
    };
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
}();

var process_status_trans = {
    'new':                                      '新交易',
    'auto_out_processing':                      '处理中',
    'auto_out_processed':                       '待确认',
    'auto_out_confirmed':                       '已完成',
    'auto_out_err_bad_address':                 '目标地址非法',
    'auto_out_err_gw_disabled':                 '交易对未启用',
    'auto_out_err_out_chain_disabled':          '转出链未启用',
    'auto_out_err_out_to_gw':                   '禁止转入充值地址',
    'auto_out_err_asset_unknown':               '未知转出资产',
    'auto_out_err_asset_disabled':              '已禁用转出资产',
    'auto_out_err_out_chain_not_found':         '目标链未知',
    'auto_out_err_out_chain_not_reliable':      '链不可靠',
    'auto_out_err_out_from_account_not_found':  '未知网关转出账户',
    'auto_out_err_out_from_account_disabled':   '禁用网关账户转出',
    'auto_out_err_insufficient_balance':        '网关余额不足',
    'auto_out_err_amount_large_than_in':        '转出金额大于转入',
    'auto_out_err_unknown':                     '自动转出失败',
    'in_err_memo_empty':                        '备注为空',
    'in_err_memo_too_long':                     '备注太长',
    'in_err_memo_bad_format':                   '备注格式错误',
    'in_err_memo_gateway_unknown':              '未知备注交易对',
    'in_err_memo_platform_unknown':             '未知备注链',
    'in_err_memo_asset_disabled':               '已禁用备注资产',
    'in_err_memo_asset_unknown':                '未知备注资产',
    'in_err_amount_too_little':                 '转入金额太小',
    'in_err_eth_not_bind':                      'ETH地址未绑定',
    'in_err_erc20_not_bind':                    'ERC20地址未绑定',
    'in_err_btc_not_bind':                      'BTC地址未绑定',
    'in_err_omni_not_bind':                     'OMNI地址未绑定',
    'in_err_unknown':                           '未知转入错误',
};

let fn_insert_search_option = function () {
    var $search = $('.fixed-table-toolbar .search input');
    var $search_parent = $search.parent();
    var search_option = `
        <!--<select class="form-control" id="sel-in_out">-->
            <!--<option value="">方向: 全部</option>-->
            <!--<option value="in">转入</option>-->
            <!--<option value="out">转出</option>-->
        <!--</select>-->
        <select class="form-control" id="sel-search_option">
            <option value="">类型: 全部</option>
            <option value="txid">交易ID</option>
            <option value="asset">资产</option>
            <option value="account">账户</option>
        </select>
    `;
    $search_parent.prepend($(search_option));
};

$(function () {
    'use strict';

    Layout.init(); // init layout

    let mylib = window.mylib;
    var el = $('body');


    // $('#btn_submit').click(function(e) {
    //     e.preventDefault()

    // })
    var myChart = echarts.init(document.getElementById("box"));
    
    $('#frm_fanyan').submit(function(e) {
        e.preventDefault();
        var formData = new FormData(this);
    
        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,
            success: function (data) {
                alert(JSON.stringify(data))
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

    var option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
        }]
    };

    // myChart.setOption(option);

    drawFanyan()
    
    function drawFanyan(data) {
//         data = {
//     "xs": [
//         18.67,
//         18.63,
//         18.66,
//         18.59,
//         18.65,
//         18.79,
//         18.62,
//         18.58,
//         18.72
//     ],
//     "ys": [
//         396.4931499216016,
//         401.56477366101035,
//         386.70259365911716,
//         398.00701943238124,
//         398.1380447882172,
//         360.5062853811331,
//         380.78652620531034,
//         378.599844206808,
//         357.1951724459736
//     ],
//     "fit_xs": [
//         17.546499999999998,
//         17.5565,
//         17.5665,
//         17.576500000000003,
//         17.586500000000004,
//         17.596500000000006,
//         17.606500000000008,
//         17.61650000000001,
//         17.62650000000001,
//         17.636500000000012,
//         17.646500000000014,
//         17.656500000000015,
//         17.666500000000017,
//         17.67650000000002,
//         17.68650000000002,
//         17.69650000000002,
//         17.706500000000023,
//         17.716500000000025,
//         17.726500000000026,
//         17.736500000000028,
//         17.74650000000003,
//         17.75650000000003,
//         17.766500000000033,
//         17.776500000000034,
//         17.786500000000036,
//         17.796500000000037,
//         17.80650000000004,
//         17.81650000000004,
//         17.826500000000042,
//         17.836500000000044,
//         17.846500000000045,
//         17.856500000000047,
//         17.86650000000005,
//         17.87650000000005,
//         17.88650000000005,
//         17.896500000000053,
//         17.906500000000054,
//         17.916500000000056,
//         17.926500000000058,
//         17.93650000000006,
//         17.94650000000006,
//         17.956500000000062,
//         17.966500000000064,
//         17.976500000000065,
//         17.986500000000067,
//         17.99650000000007,
//         18.00650000000007,
//         18.01650000000007,
//         18.026500000000073,
//         18.036500000000075,
//         18.046500000000076,
//         18.056500000000078,
//         18.06650000000008,
//         18.07650000000008,
//         18.086500000000083,
//         18.096500000000084,
//         18.106500000000086,
//         18.116500000000087,
//         18.12650000000009,
//         18.13650000000009,
//         18.146500000000092,
//         18.156500000000094,
//         18.166500000000095,
//         18.176500000000097,
//         18.1865000000001,
//         18.1965000000001,
//         18.2065000000001,
//         18.216500000000103,
//         18.226500000000105,
//         18.236500000000106,
//         18.246500000000108,
//         18.25650000000011,
//         18.26650000000011,
//         18.276500000000112,
//         18.286500000000114,
//         18.296500000000115,
//         18.306500000000117,
//         18.31650000000012,
//         18.32650000000012,
//         18.33650000000012,
//         18.346500000000123,
//         18.356500000000125,
//         18.366500000000126,
//         18.376500000000128,
//         18.38650000000013,
//         18.39650000000013,
//         18.406500000000133,
//         18.416500000000134,
//         18.426500000000136,
//         18.436500000000137,
//         18.44650000000014,
//         18.45650000000014,
//         18.466500000000142,
//         18.476500000000144,
//         18.486500000000145,
//         18.496500000000147,
//         18.50650000000015,
//         18.51650000000015,
//         18.52650000000015,
//         18.536500000000153,
//         18.546500000000155,
//         18.556500000000156,
//         18.566500000000158,
//         18.57650000000016,
//         18.58650000000016,
//         18.596500000000162,
//         18.606500000000164,
//         18.616500000000165,
//         18.626500000000167,
//         18.63650000000017,
//         18.64650000000017,
//         18.65650000000017,
//         18.666500000000173,
//         18.676500000000175,
//         18.686500000000176,
//         18.696500000000178,
//         18.70650000000018,
//         18.71650000000018,
//         18.726500000000183,
//         18.736500000000184,
//         18.746500000000186,
//         18.756500000000187,
//         18.76650000000019,
//         18.77650000000019,
//         18.786500000000192
//     ],
//     "fit_ys": [
//         -987.3248561845976,
//         -961.6553974685958,
//         -936.2272385822143,
//         -911.0403795254533,
//         -886.0948202986037,
//         -861.3905609013746,
//         -836.927601333824,
//         -812.7059415960102,
//         -788.7255816880497,
//         -764.986521609535,
//         -741.4887613609317,
//         -718.2323009421234,
//         -695.2171403528191,
//         -672.4432795933681,
//         -649.9107186635956,
//         -627.6194575634436,
//         -605.569496293203,
//         -583.7608348525828,
//         -562.193473241583,
//         -540.8674114604946,
//         -519.7826495090267,
//         -498.9391873871791,
//         -478.3370250951848,
//         -457.9761626328691,
//         -437.8566000003484,
//         -417.9783371973899,
//         -398.34137422422646,
//         -378.9457110807998,
//         -359.7913477670518,
//         -340.87828428309876,
//         -322.20652062882436,
//         -303.77605680411216,
//         -285.5868928093114,
//         -267.63902864418924,
//         -249.93246430868749,
//         -232.46719980303897,
//         -215.24323512706906,
//         -198.26057028071955,
//         -181.51920526416507,
//         -165.0191400773474,
//         -148.76037472020835,
//         -132.7429091927479,
//         -116.96674349514069,
//         -101.43187762703747,
//         -86.13831158890389,
//         -71.08604538033251,
//         -56.275079001439735,
//         -41.705412452400196,
//         -27.377045733039267,
//         -13.28997884329874,
//         0.5557882166467607,
//         14.160255446797237,
//         27.52342284732731,
//         40.645290418178774,
//         53.52585815923521,
//         66.16512607055483,
//         78.56309415231226,
//         90.71976240415825,
//         102.63513082638383,
//         114.3091994189308,
//         125.74196818174096,
//         136.93343711469788,
//         147.88360621815082,
//         158.59247549175052,
//         169.0600449356716,
//         179.2863145499141,
//         189.27128433436155,
//         199.0149542890722,
//         208.51732441422064,
//         217.77839470945764,
//         226.79816517507425,
//         235.57663581107045,
//         244.1138066172134,
//         252.40967759361956,
//         260.4642487404053,
//         268.27752005739603,
//         275.84949154464994,
//         283.18016320234165,
//         290.2695350301801,
//         297.1176070282818,
//         303.72437919670483,
//         310.0898515355075,
//         316.2140240444569,
//         322.0968967236695,
//         327.7384695733781,
//         333.13874259317527,
//         338.2977157832356,
//         343.215389143792,
//         347.8917626744369,
//         352.3268363754032,
//         356.52061024674913,
//         360.4730842882418,
//         364.1842585000559,
//         367.65413288219133,
//         370.88270743459,
//         373.8699821571936,
//         376.6159570502932,
//         379.1206321134814,
//         381.384007346991,
//         383.40608275088016,
//         385.1868583249161,
//         386.72633406927343,
//         388.0245099840686,
//         389.08138606889406,
//         389.89696232415736,
//         390.47123874968383,
//         390.8042153454735,
//         390.89589211146813,
//         390.74626904778415,
//         390.355346154538,
//         389.7231234314386,
//         388.84960087860236,
//         387.73477849620394,
//         386.3786562838941,
//         384.7812342419056,
//         382.94251237035496,
//         380.86249066889286,
//         378.54116913775215,
//         375.97854777704924,
//         373.1746265864931,
//         370.12940556620015,
//         366.842884716345,
//         363.3150640365784,
//         359.5459435271332,
//         355.5355231881258
//     ],
//     "param": [
//         -417696.48933690286,
//         44918.68548440652,
//         -1206.4991485855144
//     ],
//     "text": "【拟合采用参数：】[-417696.48933690286, 44918.68548440652, -1206.4991485855144]\n【波束宽度】0.8025765073120752度\n【自由空间损耗】[314.13855102653457, 314.9562403542742, 313.279854127817, 315.19543295246564, 313.6684661653064, 308.63630079457585, 314.1524998318264, 315.6944337952789, 311.06281903374145]dB\n【大气损耗】[19.35459889506707, 19.60853330673615, 19.422739531300174, 19.811586479915597, 19.46957862291077, 18.869984586557255, 19.63402637348392, 19.90541041152908, 19.132353412232145]dB\n【多普勒频移】[8.120261030386148e-05, 8.120261030386148e-05, 8.120261030386148e-05, 8.120261030386148e-05, 8.120261030386148e-05, 8.120261030386148e-05, 8.120261030386148e-05, 8.120261030386148e-05, 8.120261030386148e-05]Hz\n【卫星高度】[500000.0, 500000.0, 500000.0, 500000.0, 500000.0, 500000.0, 500000.0, 500000.0, 500000.0]度\n【卫星纬度】[27.487, 27.471, 27.416, 27.422, 27.428, 27.376, 27.36, 27.31, 27.379]度\n【卫星经度】[128.532, 128.5, 128.523, 128.477, 128.517, 128.609, 128.497, 128.467, 128.564]度\n【目标纬度】[39.9, 39.9, 39.9, 39.9, 39.9, 39.9, 39.9, 39.9, 39.9]度\n【目标经度】[116.3, 116.3, 116.3, 116.3, 116.3, 116.3, 116.3, 116.3, 116.3]度\n"
// }
        var data_line = []
        var data_scatter = []
        // data.xs.forEach((val, idx) => {  
        //     data_scatter.push([data.xs[idx], data.ys[idx]])
        // })
        // data.fit_xs.forEach((val, idx) => {
        //     data_line.push([data.fit_xs[idx], data.fit_ys[idx]])
        //  })
        
        data = {
            xs=[-59.491746253220654, -58.029625147930005, -56.56587355651807, -55.09885798334177, -53.6269389574194, -52.1484681555134, -50.66178566230275, -49.16521742036859, -47.65707292882881, -46.135643257200044, -44.599199450482786, -43.04599141259219, -41.47424736809964, -39.882174016764864, -38.26795751141066, -36.62976540709707, -34.9657497479227, -33.27405147654687, -31.55280636987139, -29.800152721099423, -28.01424100207251, -26.19324574838447, -24.335379910762185, -22.438911906521184, -20.502185580902136, -18.52364324564357, -16.50185189677967, -14.435532620846288, -12.323593074339101, -10.165162762331107, -7.959630647486222, -5.706684392077136, -3.4063502788890503, -1.0590325830906977, 1.3344491066577575, 3.7728263700032016, 6.254354189556068, 8.776791000296924, 11.337388607558637, 13.932893868835777, 16.559563704354787, 19.21319449315328, 21.889166239377687, 24.58250109461065, 27.287934955627918, 30.0, 32.71311526005056, 35.421681751442236, 38.120178332918584, 40.803254418618025, 43.465815900494476, 46.10310113763106, 48.710744573685616, 51.284826375217705, 53.82190735623959, 56.31904928656755, 58.77382140669636, 61.184294544330015, 63.54902462491751, 65.86702758965214, 68.1377477956315, 70.36102190197681, 72.53704007603687, 74.66630611940636, 76.74959784536486, 78.78792876319625, 80.78251186012827, 82.73472603153473, 84.64608550225086, 86.51821240953004, 88.35281258114705, 90.15165443797514, 91.91655087523873, 93.64934392614003, 95.35189198115535, 97.02605932170263, 98.67370772426739, 100.29668989714648, 101.89684452400743, 103.47599270428321, 105.035935598333, 106.57845310402146, 108.10530340996397, 109.61822328850693, 111.1189290081156, 112.60911775995854, 114.09046950695566, 115.56464917532722, 117.03330911873573, 118.49809179347923, 119.96063258990861, 121.42256277036486, 122.88551246749566, 124.35111369886428, 125.82100335431991, 127.29682611166689, 128.78023723374517, 130.2729051960769, 131.77651408872256, 133.2927657288624],
            y=[600.3778152486987, 440.05714590206816, 647.8802357958484, 364.84498003574765, 508.6717533590623, 362.86571251294976, 633.3656072953304, 465.78762369844094, 387.2766786274573, 370.1230267632087, 636.6643864999936, 330.5376763072506, 488.8790781310832, 356.927909944556, 625.4485372041388, 376.7205851725351, 537.7010103600983, 477.00347299429575, 576.6266049751238, 548.2571038150204, 354.9486424217581, 628.747316408802, 602.3570827714966, 487.5595664492179, 595.0997685212376, 407.06935385543636, 412.3474005828974, 519.2278468139845, 364.185224194815, 335.155967193779, 523.1863818595803, 603.0168386124292, 601.0375710896313, 492.17785733574635, 494.8168806994769, 531.1034519507718, 490.8583456538811, 624.7887813632062, 363.5254683538824, 604.9961061352271, 558.8131972699426, 632.0460956134651, 461.82908865284514, 563.431488156471, 503.39370663160116, 348.3510840124317, 424.8827615606175, 359.56693330828654, 633.3656072953304, 345.05230480776856, 334.4962113528464, 373.42180596787193, 331.85718798911586, 535.0619869963678, 535.0619869963678, 471.065670425902, 523.1863818595803, 480.3022521989589, 334.4962113528464, 372.76205012693924, 2149.768299407688, 2330.078372592283, 2466.4722119774374, 2563.1543655034047, 2618.426226536783, 2637.9553803831077, 2625.682555793436, 2577.507437329337, 2501.236343301941, 2397.0173243163495, 2264.8375128385637, 2108.5590555449207, 1928.2174892118267, 1725.4183877756084, 1501.5090175898965, 0.0, 149.10482005077571, 143.167017482382, 154.3828667782368, 25.070721955440163, 145.80604084611252, 49.481688069947694, 121.395074731605, 141.18774995958407, 66.63533993419622, 176.1548095290138, 197.92675227979078, 160.32066934663052, 81.80972427564684, 11.21584929585481, 100.28288782176065, 138.54872659585354, 134.5901915502577, 138.54872659585354, 55.419490638341415, 178.79383289274432, 568.0497790429995, 531.7632077917045, 655.79730588704, 526.4851610642435],
            ys=[624.1402136041143, 473.4663243337486, 452.8491649378293, 476.7593766160535, 502.0374945366569, 511.5939731777397, 503.22349572431096, 482.12725064259973, 456.104955000957, 432.6507986888926, 417.3887730488512, 413.4313043966599, 421.3543416159597, 439.562207893833, 464.8742437766464, 493.2083017000464, 520.267892205488, 542.1636146287893, 555.9180688420464, 559.818807581584, 553.597654779522, 538.4280707955471, 516.745955965902, 491.91364871786055, 467.76165647452984, 448.0570119554027, 435.9595858507584, 433.5361238227829, 441.40371367648646, 458.56729117925784, 482.4976752344876, 509.46682902208545, 535.1171013352468, 555.1955349696535, 566.3405027841916, 566.7760772016139, 556.7606648043882, 538.6596232838415, 516.5704639505435, 495.5187820598449, 480.3478855644212, 474.5208784646032, 479.11242555371433, 492.2644796741142, 509.304976861104, 523.5897736704827, 527.9554986815376, 516.5084247547354, 486.36767049305655, 438.9629558282939, 380.5666304813103, 321.89802804626544, 276.83479452805324, 260.4510945654704, 286.7328629626801, 366.3696467413142, 504.987952334546, 702.089634004486, 950.820609430054, 1238.5528610980982, 1548.1436392178748, 1859.6569747794674, 2152.299425764235, 2406.3301061629973, 2604.743988419301, 2734.584311499857, 2787.8024168572447, 2761.641821127414, 2658.5715583487763, 2485.8288235857035, 2254.652425363194, 1979.2980225264328, 1675.9260866169352, 1361.4468129379675, 1052.3954673579428, 763.8991380827501, 508.7832533912733, 296.8546645017341, 134.38821428548545, 23.835736175999045, -36.22976957075298, -50.926845556125045, -28.63130035251379, 19.704738292843103, 81.47465441375971, 143.56600871309638, 193.70890406146646, 221.97628508508205, 222.35645768791437, 194.26966082304716, 143.8283100053668, 84.53445076942444, 36.95385955274105, 26.68433165550232, 79.61835020780563, 213.04889532923698, 420.52770882844925, 647.4826258420944, 753.3297807872295, 454.0315400958061]
        }
        data.xs.forEach((val, idx) => {  
            data_scatter.push([val, data.y[idx]])
        })
        data.xs.forEach((val, idx) => {
            data_line.push([val, data.ys[idx]])
        })
       

        // var data_line=[['100', '800'],['1100', '400'],]
        // var data_scatter=[ ['100', '800'],['200', '300'],['300', '500'],['400', '300'],
        //             ['500', '100'],['600', '400'],['700', '500'],['800', '200'],
        //             ['900', '800'],['1000', '300'],['1100', '500'],['1200', '300'],
        //             ['1300', '100'],['1400', '400'],['1500', '500'],['1600', '200']]
        // option 里面的内容基本涵盖你要画的图表的所有内容
        var option = {
            backgroundColor: '#FBFBFB',
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['拟合曲线', '散点']
            },
            calculable: true,
                xAxis:
                [{
                axisLabel: {
                    rotate: 30,
                    interval: 0
                },
                axisLine: {
                    lineStyle: {
                        color: '#CECECE'
                    }
                },
                type: 'value',
                boundaryGap: false,
                splitLine: {
                    show: true,
                    interval: 'auto',
                    lineStyle: {
                        color: ['#FBFBFB']
                    }
                },
                axisTick: {
                    show: false
                },
                scale:true
            }],
            yAxis: [{
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: ['#D4DFF5']
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#CECECE'
                    }
                },
                scale:true
            }],
            axisTick: {
                show: false
            },
            series: [{
                name: '拟合曲线',
                type: 'line',
                symbol: 'none',
                smooth: 0.1,
                data: data_line,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                }
            },
            {
                name: '散点',
                type: 'scatter',
                symbol: 'circle',
                data: data_scatter,
                symbolSize: 3
            }]
        };
        myChart.setOption(option);
    }









    let $chk_failed     = el.find("#chk-trx_failed"),
        $chk_unhandled  = el.find("#chk-trx_unhandled");

    let $only_unhandled = new URLSearchParams(location.search).get('only_unhandled');
    let only_unhandled  = $only_unhandled != null && $only_unhandled.length > 0 && $only_unhandled !== 'false';
    if(only_unhandled) {
        $chk_unhandled.prop('checked', true)
    }

    // var gw_accounts = {};
    // el.find('#gw-accounts').data('gw-accounts').forEach(acc => {
    //     var key = [acc.chain_type, acc.asset_id, acc.out_account_id].join('_');
    //     gw_accounts[key] = true
    // });

    var $modal_his_comment = el.find('#mdl-his_comment');
    var $tbl_his = el.find('#tbl-gw_his');
    $tbl_his.bootstrapTable({
        clickToSelect: true,
        pagination: true,
        paginationLoop: true,
        pageSize: 25,
        pageList: [10, 25, 50, 100],
        sidePagination: 'server',
        showRefresh: true,
        uniqueId: 'id',
        // rowStyle: function rowStyle(row, index) {
        //     if(true)
        //         return {
        //             classes: 'tx-deposit',
        //         };
        //     return {
        //         classes: 'tx-withdraw',
        //     }
        // },
        queryParams: function(params) {
            let sel_in_out      = $("#sel-in_out").val(),
                sel_search_opt  = $("#sel-search_option").val();

            if(params.search) {
                if (sel_in_out && sel_in_out.length)
                    params.in_out = sel_in_out;

                if (sel_search_opt && sel_search_opt.length)
                    params.search_opt = sel_search_opt;
            }

            let opt_failed      = $chk_failed.is(':checked'),
                opt_unhandled   = $chk_unhandled.is(':checked');
            if(!(opt_failed || opt_unhandled))
                return params;
            if(opt_unhandled) {
                params.only_unhandled = true;
                return params;
            }
            if (opt_failed) {
                params.only_failed = true;
                return params;
            }
        },
        detailFormatter: function (index, row) {
            function generateItem(key, val, width) {
                if(!width) {
                    width = {xs: 12,md: 2}
                }
                return `<div class="his-detail col-xs-${width.xs} col-md-${width.md}"> <span class="key">${key}: </span><span class="value">${val || '无'}</span></div>`
            }
            return [
                {
                    title: '目标名',
                    field: "radarName",
                     width: {
                        xs: 12,
                        md: 12
                    },
                },
                {
                    field: 'searchLast',
                    title: '侦查结束时间',
                    formatter: function (idx, row) {
                        return " " + row.searchLast
                    },
                    width: {
                        xs: 12,
                        md: 12
                    },
                },
                {
                    title: '载频',
                    field: "rfAverage",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '载频最大值',
                    field: "rfMax",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '载频最小值',
                    field: "rfMin",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '载频类型',
                    field: "rfType",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI',
                    field: "priAverage",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI最大值',
                    field: "priMax",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI最小值',
                    field: "priMin",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: 'PRI类型',
                    field: "priType",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽',
                    field: "pwAverage",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽最大值',
                    field: "pwMax",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽最小值',
                    field: "pwMin",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '脉宽类型',
                    field: "pwType",
                     width: {
                        xs: 3,
                        md: 3
                    },
                },
                {
                    title: '带宽BW',
                    field: "bw",
                     width: {
                        xs: 12,
                        md: 12
                    },
                },
                // {
                //     field: 'out_amount',
                //     title: '转出数额',
                //     valign: 'middle'
                // },
                // {
                //     field: 'out_block',
                //     title: '转出区块',
                //     formatter: function (idx, row) {
                //         if(row.out_block)
                //             return [
                //                 row.out_block,
                //                 row.out_trx_in_block,
                //                 row.out_op_in_trx,
                //             ].join('_');
                //         else
                //             return null
                //     }
                // },
                // {
                //     field: 'out_nonce',
                //     title: '转出Nonce',
                // },
                // {
                //     field: 'out_memo',
                //     title: '转出备注',
                //     width: {
                //         xs: 6,
                //         md: 4
                //     }
                // },
                // {
                //     field: 'out_from_account_name',
                //     title: '网关转出',
                //     formatter: function (idx, row) {
                //         try {
                //             row.out_from_account_name.length > 0;
                //             row.out_to_account_name.length   > 0;
                //             return [
                //                 mylib.account_url_template(row.out_from_account_name, row.to_chain_type),
                //                 mylib.account_url_template(row.out_to_account_name, row.to_chain_type),
                //             ].join(' -> ');
                //         } catch (e) {
                //             return ''
                //         }
                //     },
                //     width: {
                //         xs: 12,
                //         md: 12,
                //     }
                // },
                // {
                //     field: 'out_trx_id',
                //     title: '转出交易ID',
                //     width: {
                //         xs: 12,
                //         md: 12
                //     },
                //     formatter: function (value, row) {
                //         return [
                //             mylib.tx_url_template(row.out_trx_id, row.to_chain_type, false)
                //         ].join('')
                //     },
                // },
                // {
                //     field: 'comment',
                //     title: '人工标注',
                //     width: {
                //         xs: 12,
                //         md: 12
                //     },
                //     formatter: function (value, row) {
                //         var comment = row.comment.trim();
                //         if(comment.length) {
                //             return [
                //                 '<div style="white-space: pre">',
                //                 comment,
                //                 '</div>'
                //             ].join('')
                //         } else {
                //             return ''
                //         }
                //     },
                // },
                // {
                //     field: 'out_info',
                //     title: '错误详情(若有)',
                //     width: {
                //         xs: 12,
                //         md: 12
                //     },
                //     formatter: function (value, row) {
                //         var out_info = (row.out_info || '').trim();
                //         if(out_info.length) {
                //             return [
                //                 '<div style="white-space: pre">',
                //                 out_info,
                //                 '</div>'
                //             ].join('')
                //         } else {
                //             return ''
                //         }
                //     },
                // },
            ].map(function (item) {
                var val = row[item.field];
                if (typeof(item.formatter) === 'function')
                    val = item.formatter(index, row);
                return generateItem(item.title, val, item.width)
            }).join('')
        },
        columns: [
            {
                checkbox: true
            },
            {
                title: '编号',
                field: 'id',
                valign: 'middle'
            },
            {
                title: 'sn',
                field: "sn",
                valign: 'middle'
            },
            {
                title: '侦查时间',
                field: "searchFirst",
                valign: 'middle'
            },
            {
                field: 'ownNation',
                title: '国名',
                valign: 'middle'
            },
            {
                field: 'addr',
                title: '地名',
                valign: 'middle'
            },
            {
                field: 'radarName',
                title: '型号',
                valign: 'middle'
            },
            {
                field: 'lon',
                title: '经度',
                valign: 'middle'
            },
            {
                field: 'lat',
                title: '纬度',
                valign: 'middle'
            },
            {
                field: 'radarSys',
                title: '技术体制',
                valign: 'middle'
            },
            {
                field: 'radarUseage',
                title: '雷达用途',
                valign: 'middle'
            },
            {
                field: 'radarWorkMode',
                title: '工作模式',
                valign: 'middle'
            },
            {
                field: 'targetType',
                title: '目标类型',
                valign: 'middle'
            },
            {
                field: 'radarGroup',
                title: '群目标类型',
                valign: 'middle'
            },
            {
                field: 'networkType',
                title: '组网分析方式',
                valign: 'middle',
                formatter: (value, row) => {
                    if(value != null && row.network_id){ 
                        console.log(row)
                        return  [
                            value,
                            `<a class="link" href="/admin/networks/${row.network_id}">`,
                            '(查看组网)',
                            '</a>'
                        ].join('')

                    }
                },
            },
            {
                field: 'level',
                title: '威胁等级',
                valign: 'middle'
            },
            // {
            //     field: 'in_decrypted_memo',
            //     title: '状态',
            //     valign: 'middle'
            // },
            {
                title: '操作',
                events: {
                    'click .manual-comment': (e, value, row, idx) => {
                        el.find('#history_id').val(row.id);
                        el.find('#history_comment').val(row.comment);
                        $modal_his_comment.modal('show')
                    },
                },
                valign: 'middle',
                formatter: (idx, row) => {
                    let manual_comment = [
                        '<a class="btn default btn-xs purple manual-comment">',
                        '<i class="fa fa-pencil"></i> 标记',
                        '</a>',
                    ].join('');
                    let manual_comment_exists = [
                        '<a class="btn default btn-xs blue manual-comment">',
                        '<i class="fa fa-edit"></i> 专家评估',
                        '</a>',
                    ].join('');
                    if(row.process_status !== 'auto_out_confirmed') {
                        return '' === row.comment ? manual_comment : manual_comment_exists;
                    }
                    return '';
                },
            }
        ]
    });
    $tbl_his.on('dbl-click-row.bs.table', function (e, row, $ele, field) {
        var index = $ele.data('index');
        var is_in_detail_view = $ele.next().hasClass('detail-view');
        if(is_in_detail_view)
            $tbl_his.bootstrapTable("collapseRow", index);
        else
            $tbl_his.bootstrapTable("expandRow", index);
    });

    fn_insert_search_option();

    el.find('#btn-save_his_comment').click(function (e) {
        var his_id  = el.find('#history_id').val();
        var $form   = el.find('#frm-history');
        var action  = $form.attr('action');
        if('' === his_id) return;

        $.post(
            `${action}/${his_id}/update_comment`,
            $form.serialize()
        ).then(res => {
            // console.log(res);
            var record = res.data;
            if(record) {
                var record_data = {id: record.id, row: record};
                $tbl_his.bootstrapTable("updateByUniqueId", record_data);
                $modal_his_comment.modal('hide');
            } else {
                alert('更新失败');
                console.error(res)
            }
        }).fail(reason => {
            console.error(reason);
        })
    });

    // 标注的模板
    el.find('#btn-set_default_comment').click(function (e) {
        var template = [
            '处理结果: 已重发/已退回',
            '目标账户: ',
            '转出金额: ',
            '交易的ID: ',
            '转出时间: ',
        ].join('\n');
        el.find("#history_comment").val(template)
    });

    //全屏
    el.find('#btn-expand').click(function (e) {
        $(this).hide();
        el.find('#btn-compress').show();
        el.find('#his-container').removeClass('container');
        el.find('#his-container').addClass('container-fluid');
    });
    //取消全屏
    el.find('#btn-compress').click(function (e) {
        $(this).hide();
        el.find('#btn-expand').show();
        el.find('#his-container').addClass('container');
        el.find('#his-container').removeClass('container-fluid');
    });


    /////////////////导出选中记录/////////////////
    let get_selected_records = function() {
        let rows = $tbl_his.bootstrapTable('getAllSelections');
        if(rows.length)
            return rows;
        else {
            MyNotify.error('未选择需要导出的记录');
            return false
        }
    };

    let $ipt_clipboard   = el.find('#ipt-clipboard');
    let $btn_export_file = el.find("#btn-export_file");
    let $btn_export_clip = el.find("#btn-export_clipboard");
    $btn_export_file.click(function () {
        let selections = get_selected_records();
        if(! selections) return;

        let data = format_export_data(selections);
        download(data, '充提记录.csv', 'text/plain');
    });
    $btn_export_clip.on('click', function () {
        let selections = get_selected_records();
        if(! selections) return;

        $ipt_clipboard.val(format_export_data(selections));
    });

    let column_to_export = {
        chain_type: ['Chain', row => [row.from_chain_type, row.to_chain_type].join(' -> '), 14],
        from_to:    ['From -> To', row => [row.from_account_name, row.monitor_account_name].join(' -> '), 88],
        in_amount:  ['转入金额', row => [row.in_amount, row.in_asset_alias.length && row.in_asset_alias || row.in_asset_name].join(' '), 40],
        in_decrypted_memo:  ['备注',           null, 48],
        in_block_num:       ['转入块号',        null, 10],
        in_trx_id:          ['转入交易ID',      null, 68],
        out_amount:         ['转出金额',        null, 20],
        process_status:     ['状态', row => process_status_trans[row.process_status] || row.process_status]
    };

    function format_export_data(rows) {
        let format_row = (row) => {
            return Object.keys(column_to_export).map(key => {
                let val = column_to_export[key];
                let res = null;
                if(val[1]) {
                    res = val[1](row)
                } else {
                    res = row[key];
                }
                if(val[2]) {
                    let res_len = res.length;
                    let diff    = val[2] - res_len;
                    diff > 0    && (res = ' '.repeat(diff) + res);
                }

                return res;
            }).join(', ')
        };
        let format_header = () => {
            return Object.keys(column_to_export).map(key => {
                let val = column_to_export[key];
                let res = val[0];
                if(val[2]) {
                    let res_len = res.split('').map(chr => {
                        if(/[ ->1-9A-Za-z]/.test(chr))
                            return 1;
                        else
                            return 2;
                    }).reduce( (a,b) => a+b);
                    let diff    = val[2] - res_len;
                    diff > 0    && (res = ' '.repeat(diff) + res);
                }
                return res;
            }).join(', ')
        };

        let formatted_data = rows.map( row => {
            return format_row(row)
        }).join('\n');

        return [format_header(), formatted_data].join('\n')
    }

    let clipboard = new ClipboardJS('#btn-export_clipboard', {
        text: function(trigger) {
            return $ipt_clipboard.val();
        }
    });
    clipboard.on('success', function(e) {
        if ($ipt_clipboard.val().length > 0)
            MyNotify.success('导出成功');
    });
    clipboard.on('error', function(e) {
        MyNotify.error('导出失败');
        console.error('Action:' + e.action);
        console.error('Trigger:' + e.trigger);
    });

    $chk_failed.on('change', function (e) {
        $tbl_his.bootstrapTable('refresh');
    });
    $chk_unhandled.on('change', function (e) {
        $tbl_his.bootstrapTable('refresh');
    })
});
