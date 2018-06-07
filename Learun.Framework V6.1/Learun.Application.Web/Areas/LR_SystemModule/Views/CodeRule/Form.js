/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.11
 * 描 述：单据编号	
 */
var acceptClick;
var keyValue = '';
var currentColRow = null;
var bootstrap = function ($, learun) {
    "use strict";
    var selectedRow = learun.frameTab.currentIframe().selectedRow;

    var page = {
        init: function () {
            page.bind();
            page.initData();
        },
        bind: function () {
            $('#lr_add_format').on('click', function () {
                currentColRow = null;
                learun.layerForm({
                    id: 'FormatForm',
                    title: '添加',
                    url: top.$.rootUrl + '/LR_SystemModule/CodeRule/FormatForm',
                    width: 450,
                    height: 310,
                    callBack: function (id) {
                        return top[id].acceptClick(function (data) {
                            $('#girdtable').jfGridSet('addRow', { row: data });
                        });
                    }
                });
            });
            $('#lr_edit_format').on('click', function () {
                currentColRow = $('#girdtable').jfGridGet('rowdata');
                var _id = currentColRow ? currentColRow.itemTypeName : '';
                if (learun.checkrow(_id)) {
                    learun.layerForm({
                        id: 'FormatForm',
                        title: '修改',
                        url: top.$.rootUrl + '/LR_SystemModule/CodeRule/FormatForm',
                        width: 450,
                        height: 310,
                        callBack: function (id) {
                            return top[id].acceptClick(function (data) {
                                $('#girdtable').jfGridSet('updateRow', { row: data });
                            });
                        }
                    });
                }
                
            });
            $('#lr_delete_format').on('click', function () {
                currentColRow = null;
                var row = $('#girdtable').jfGridGet('rowdata');
                var _id = row ? row.itemTypeName : '';
                if (learun.checkrow(_id)) {
                    learun.layerConfirm('是否确认删除该项！', function (res, index) {
                        if (res) {
                            $('#girdtable').jfGridSet('removeRow');
                            top.layer.close(index); //再执行关闭  
                        }
                    });
                }
            });

            $('#girdtable').jfGrid({
                headData: [
                    { label: "前缀", name: "itemTypeName", width: 120, align: "left" },
                    { label: "格式", name: "formatStr", width: 120, align: "left" },
                    { label: "步长", name: "stepValue", width: 100, align: "left" },
                    { label: "初始值", name: "initValue", width: 120, align: "left" },
                    { label: "说明", name: "description", width: 180, align: "left" }
                ]
            });

            /*检测重复项*/
            $('#F_EnCode').on('blur', function () {
                $.lrExistField(keyValue, 'F_EnCode', top.$.rootUrl + '/LR_SystemModule/CodeRule/ExistEnCode');
            });
            $('#F_FullName').on('blur', function () {
                $.lrExistField(keyValue, 'F_FullName', top.$.rootUrl + '/LR_SystemModule/CodeRule/ExistFullName');
            });
        },
        initData: function () {
            if (!!selectedRow) {
                keyValue = selectedRow.F_RuleId;
                $('#form').lrSetFormData(selectedRow);
                var formatdata = JSON.parse(selectedRow.F_RuleFormatJson);
                $('#girdtable').jfGridSet('refreshdata', { rowdatas: formatdata });
            }
        }
    };
    // 保存数据
    acceptClick = function (callBack) {
        if (!$('#form').lrValidform()) {
            return false;
        }
        var postData = $('#form').lrGetFormData(keyValue);
        var formatdata = $('#girdtable').jfGridGet('rowdatas');
        if (formatdata.length == 0) {
            learun.alert.error('请设置规则！');
            return false;
        }
        postData.F_RuleFormatJson = JSON.stringify(formatdata);
        $.lrSaveForm(top.$.rootUrl + '/LR_SystemModule/CodeRule/SaveForm?keyValue=' + keyValue, postData, function (res) {
            if (!!callBack) {
                callBack();
            }
        });
    };
    page.init();
}