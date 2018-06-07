/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.05
 * 描 述：功能按钮模块	
 */
var parentId = request('parentId');

var buttonlist = top.layer_form.buttonlist;
var currentBtnRow = top.layer_form.currentBtnRow;
var acceptClick;
var bootstrap = function ($, learun) {
    "use strict";

    var page = {
        init: function () {
            page.bind();
            page.initData();
        },
        bind: function () {
            // 上级
            var buttonTree = $.lrtree.treeTotree(buttonlist, 'F_ModuleButtonId', 'F_FullName', 'F_EnCode', false, 'jfGrid_ChildRows');
            $('#F_ParentId').lrselect({
                data: buttonTree,
                type: 'tree'
            }).lrselectSet(parentId);
        },
        initData: function () {
            if (!!currentBtnRow) {
                $('#form').lrSetFormData(currentBtnRow);
            }
        }
    };
    // 保存数据
    acceptClick = function (callBack) {
        if (!$('#form').lrValidform()) {
            return false;
        }
        var data = $('#form').lrGetFormData();
        if (data["F_ParentId"] == '' || data["F_ParentId"] == '&nbsp;') {
            data["F_ParentId"] = '0';
        }
        else if (data["F_ParentId"] == data['F_ModuleButtonId']) {
            learun.alert.error('上一级不能是自己本身');
            return false;
        }
        if (!!callBack) {
            callBack(data);
        }
        return true;
    };

    page.init();
}