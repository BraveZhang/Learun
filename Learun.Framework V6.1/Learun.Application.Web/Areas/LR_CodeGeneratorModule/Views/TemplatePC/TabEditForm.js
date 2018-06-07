/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.11
 * 描 述：选项卡添加	
 */
var acceptClick;
var bootstrap = function ($, learun) {
    "use strict";
    var selectedRow = top.layer_TabEditIndex.selectedRow;

    var page = {
        init: function () {
            page.initData();
        },
        initData: function () {
            if (!!selectedRow) {
                $('#form').lrSetFormData(selectedRow);
            }
        }
    };
    // 保存数据
    acceptClick = function (callBack) {
        if (!$('#form').lrValidform()) {
            return false;
        }
        var formData = $('#form').lrGetFormData();
        formData.id = formData.id || learun.newGuid();
        formData.value = formData.id;
        formData.isexpand = false;
        formData.complete = true;

        if (!!selectedRow) {
            formData.componts = selectedRow.componts;
        }
        else {
            formData.componts = [];
        }
        

        callBack(formData);
        return true;
    };
    page.init();
}