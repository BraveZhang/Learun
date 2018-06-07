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
                $("#girdtable").jqprintTable({ title:'商品采购明细表'});
            });
            //导出
            $('#lr-export').on('click', function () {
                learun.download({
                    method: "POST",
                    url: '/Utility/ExportExcel',
                    param: {
                        fileName: "导出采购报表",
                        columnJson: JSON.stringify($('#girdtable').jfGridGet('settingInfo').headData),
                        dataJson: JSON.stringify($('#girdtable').jfGridGet('settingInfo').rowdatas)
                    }
                });
            });
        },
        initGird: function () {
            $("#girdtable").height($(window).height() - 170);
            $('#girdtable').jfGrid({
                url: top.$.rootUrl + '/LR_ReportModule/ReportTemplate/GetPurchaseReportList',
                headData: [
                    { name: "date", label: "采购日期", width: 80, align: "center" },
                    { name: "billNo", label: "采购单据号", width: 120, align: "center" },
                    { name: "buName", label: "供应商", width: 150, align: "left" },
                    { name: "invNo", label: "商品编号", width: 80, align: "left" },
                    { name: "invName", label: "商品名称", width: 150, align: "left" },
                    { name: "unit", label: "单位", width: 80, align: "center" },
                    { name: "location", label: "仓库", width: 80, align: "left" },
                    { name: "qty", label: "数量", width: 80, align: "right" },
                    {
                        name: "unitPrice", label: "单价", width: 80, align: "right",
                        formatter: function (cellvalue) {
                            return learun.toDecimal(cellvalue);
                        }
                    },
                    {
                        name: "amount", label: "金额", width: 80, align: "right",
                        formatter: function (cellvalue) {
                            return learun.toDecimal(cellvalue);
                        }
                    },
                    { name: "description", label: "备注", width: 150, align: "left" }
                ],
                reloadSelected: true,
                mainId: 'billNo'
            });

            page.search();
        },
        search: function (param) {
            param = param || {};
            $('#girdtable').jfGridSet('reload', { param: param });
        }
    };
    page.init();
}


