(function () {
    var keyvalue = '';

    var page = {
        isScroll: true,
        init: function ($page, param) {
            if (param && param.data) {
                keyvalue = param.data.F_InvoiceId;
                $page.find('.lr-form-container').lrformSet(param.data);
            }

            $('#crm_invoice_formsave').on('tap', function () {
                var data = $page.find('.lr-form-container').lrformGet();
                learun.layer.loading(true, "正在保存数据");
                learun.httppost(config.webapi + "learun/adms/crm/invoice/save", { keyValue: keyvalue, entity: data}, (res) => {
                    if (res.code == 200) {// 表单数据保存成功，发起流程
                        var prepage = learun.nav.getpage('crm/invoice');
                        prepage.pageobj.reload();
                        learun.nav.closeCurrent();
                    }
                    else {// 接口异常
                    }
                    learun.layer.loading(false);
                });

            });
        }
    };
    return page;
})();