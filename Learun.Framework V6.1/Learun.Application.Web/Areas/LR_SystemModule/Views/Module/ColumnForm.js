/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.11
 * 描 述：功能视图模块	
 */
var currentColRow = top.layer_form.currentColRow;
var acceptClick;
var bootstrap = function ($, learun) {
    "use strict";

    var page = {
        init: function () {
            page.initData();
        },
        initData: function () {
            if (!!currentColRow) {
                $('#form').lrSetFormData(currentColRow);
            }
        }
    };
    // 保存数据
    acceptClick = function (callBack) {
        if (!$('#form').lrValidform()) {
            return false;
        }
        var data = $('#form').lrGetFormData();
        data.F_ParentId = '0';
        if (!!callBack) {
            callBack(data);
        }
        return true;
    };
    page.init();
}