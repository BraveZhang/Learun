(function () {
    var page = {
        isScroll: false,
        init: function ($page) {
            $page.find('#crm_invoice_addbtn').on('tap', function () {
                learun.nav.go({ path: 'crm/invoice/form', title: '新增开票信息', type: 'right', param: {} });
            });

            page.pageobj = $('#lr_crm_invoice').lrpagination({
                lclass: "lr-list",
                rows: 10,                            // 每页行数
                getData: function (param, callback) {// 获取数据 param 分页参数,callback 异步回调
                    var getParam = {
                        pagination: {
                            rows: param.rows,
                            page: param.page,
                            sidx: 'F_CreateDate',
                            sord: 'ASC'
                        },
                        queryJson: '{}'
                    }
                    learun.httpget(config.webapi + "learun/adms/crm/invoice/list", getParam, (res) => {
                        if (res == null) {
                            callback([], 0);
                            return false;
                        }

                        if (res.code == 200) {
                            callback(res.data.rows, parseInt(res.data.records));
                        }
                        else {
                            learun.layer.warning('数据加载失败,请重新刷新！', function () { }, '力软提示', '关闭');
                            callback([], 0);
                        }
                    });
                },
                renderData: function (_index, _item) {// 渲染数据模板
                    var _html = '<div class="lr-list-item lr-list-item-multi">\
                            <h5>'+ _item.F_CustomerName + '</h5>\
                            <p class="lr-ellipsis">'+ _item.F_InvoiceContent + '</p>\
                        </div >';
                    return _html;
                },
                click: function (item, $item) {// 列表行点击事件
                    learun.nav.go({ path: 'crm/invoice/form', title: '编辑', type: 'right', param: { data: item } });

                }
            });
        }
    };
    return page;
})();