var bootstrap = function ($, learun) {
    "use strict";
    var page = {
        init: function () {
            page.initGird();
            page.bind();
        },
        bind: function () {
            // 刷新
            $('#lr-replace').on('click', function () {
                location.reload();
            });
            //打印
            $('#lr-print').on('click', function () {
                $("#girdtable").jqprintTable({ title: '商品收发明细表' });
            });
            //导出
            $('#lr-export').on('click', function () {
                learun.download({
                    method: "POST",
                    url: '/Utility/ExportExcel',
                    param: {
                        fileName: "商品收发明细表",
                        columnJson: JSON.stringify($('#girdtable').jfGridGet('settingInfo').headData),
                        dataJson: JSON.stringify($('#girdtable').jfGridGet('settingInfo').rowdatas)
                    }
                });
            });
        },
        initGird: function () {
            $("#girdtable").height($(window).height() - 170);
            $('#girdtable').jfGrid({
                url: top.$.rootUrl + '/LR_ReportModule/ReportTemplate/GetStockReportList',
                headData: [
                    { name: "invNo", label: "商品编号", width: 80, align: "left" },
                    { name: "invName", label: "商品名称", width: 150, align: "left" },
                    { name: "date", label: "单据日期", width: 80, align: "center" },
                    { name: "billNo", label: "单据单号", width: 100, align: "center" },
                    { name: "billType", label: "业务类别", width: 80, align: "center" },
                    { name: "buName", label: "往来单位", width: 100 },
                    { name: "location", label: "仓库", width: 80 },
                    {
                        label: "入库", name: "入库", width: 80, align: 'center',
                        children: [
                            {
                                name: "inqty", label: "入库数量", width: 80, align: "right",
                                formatter: function (cellvalue) {
                                    return learun.toDecimal(cellvalue);
                                }
                            },
                            {
                                name: "inunitCost", label: "单位成本", width: 80, align: "right",
                                formatter: function (cellvalue) {
                                    return learun.toDecimal(cellvalue);
                                }
                            },
                            {
                                name: "incost", label: "成本", width: 80, align: "right", formatter: function (cellvalue) {
                                    return learun.toDecimal(cellvalue);
                                }
                            },
                        ]
                    },
                    {
                        label: "出库", name: "出库", width: 80, align: 'center',
                        children: [
                            {
                                name: "outqty", label: "出库数量", width: 80, align: "right",
                                formatter: function (cellvalue) {
                                    return learun.toDecimal(cellvalue);
                                }
                            },
                            {
                                name: "outunitCost", label: "单位成本", width: 80, align: "right",
                                formatter: function (cellvalue) {
                                    return learun.toDecimal(cellvalue);
                                }
                            },
                            {
                                name: "outcost", label: "成本", width: 80, align: "right",
                                formatter: function (cellvalue) {
                                    return learun.toDecimal(cellvalue);
                                }
                            },
                        ]
                    },
                    {
                        label: "结存", name: "结存", width: 80, align: 'center',
                        children: [
                            {
                                name: "totalqty", label: "结存数量", width: 80, align: "right",
                                formatter: function (cellvalue) {
                                    return learun.toDecimal(cellvalue);
                                }
                            },
                            {
                                name: "totalunitCost", label: "单位成本", width: 80, align: "right",
                                formatter: function (cellvalue) {
                                    return learun.toDecimal(cellvalue);
                                }
                            },
                            {
                                name: "totalcost", label: "成本", width: 80, align: "right",
                                formatter: function (cellvalue) {
                                    return learun.toDecimal(cellvalue);
                                }
                            }
                        ]
                    }
                ],
                reloadSelected: true,
                mainId: 'billNo'
            });
            page.search();
        },
        search: function (param) {
            param = param || {};
            var d = $('#girdtable').jfGridGet('headData');
            console.log(d);
            return;
            $('#girdtable').jfGridSet('reload', { param: param });
        }
    };
    page.init();
}


