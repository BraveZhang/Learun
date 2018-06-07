/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.11
 * 描 述：字段导入	
 */
var acceptClick;
var bootstrap = function ($, learun) {
    "use strict";
    // 获取父弹层的数据
    var dbTable = top.layer_CustmerCodeIndex.dbTable;

    var page = {
        init: function () {
            page.bind();
        },
        bind: function () {
            // 数据表选择
            $('#tableName').lrselect({
                data: dbTable,
                value: 'name',
                text: 'name',
                maxHeight: 150,
                allowSearch: true
            });
        }
    };
    // 保存数据
    acceptClick = function (callBack) {
        if (!$('#form').lrValidform()) {
            return false;
        }
        var postData = $('#form').lrGetFormData();
        callBack(postData);
        return true;
    };
    page.init();
}