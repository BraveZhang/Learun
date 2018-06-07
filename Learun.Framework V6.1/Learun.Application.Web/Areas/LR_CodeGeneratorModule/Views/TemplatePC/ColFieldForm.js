/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.11
 * 描 述：列表字段添加	
 */
var compontId = request('compontId');

var acceptClick;
var bootstrap = function ($, learun) {
    "use strict";
    var colData = top.layer_CustmerCodeIndex.colData;
    var currentItem;

    var page = {
        init: function () {
            page.bind();
            page.initData();
        },
        bind: function () {
            // 所在行所占比
            $('#align').lrselect({
                placeholder:false
            }).lrselectSet('left');
        },
        initData: function () {
            if (!!compontId) {
                for (var i = 0, l = colData.length; i < l; i++) {
                    if (colData[i].compontId == compontId) {
                        currentItem = colData[i];
                        $('#form').lrSetFormData(currentItem);
                        break;
                    }
                }
            }
        }
    };
    // 保存数据
    acceptClick = function (callBack) {
        if (!$('#form').lrValidform()) {
            return false;
        }
        var formData = $('#form').lrGetFormData();
        currentItem.align = formData.align;
        currentItem.width = formData.width;
        currentItem.sort = formData.sort;
        callBack(currentItem);
        return true;
    };
    page.init();
}