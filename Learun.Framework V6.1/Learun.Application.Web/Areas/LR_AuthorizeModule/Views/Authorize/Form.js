/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.05
 * 描 述：功能模块	
 */
var objectId = request('objectId');
var objectType = request('objectType');

var bootstrap = function ($, learun) {
    "use strict";

    var selectData;

    var treeData;
    var checkModuleIds = [];
    var checkButtonIds = [];

    function setTreeData() {
        if (!!selectData) {
            $('#step-1').lrtreeSet('setCheck', selectData.modules);
            $('#step-2').lrtreeSet('setCheck', selectData.buttons);
            $('#step-3').lrtreeSet('setCheck', selectData.columns);
        }
        else {
            setTimeout(setTreeData,100);
        }
    }

    var page = {
        init: function () {
            page.bind();
            page.initData();
        },
        /*绑定事件和初始化控件*/
        bind: function () {
            learun.httpAsyncGet(top.$.rootUrl + '/LR_SystemModule/Module/GetCheckTree', function (res) {
                if (res.code == 200) {
                    treeData = res.data;
                    setTimeout(function () {
                        $('#step-1').lrtree({
                            data: treeData.moduleList
                        });
                    }, 10);
                    setTimeout(function () {
                        $('#step-2').lrtree({
                            data: treeData.buttonList
                        });
                    }, 30);
                    setTimeout(function () {
                        $('#step-3').lrtree({
                            data: treeData.columnList
                        });
                        if (!!objectId) {
                            setTreeData();
                        }
                    }, 50);
                }
            });
            // 加载导向
            $('#wizard').wizard().on('change', function (e, data) {
                var $finish = $("#btn_finish");
                var $next = $("#btn_next");
                if (data.direction == "next") {
                    if (data.step == 1) {
                        checkModuleIds = $('#step-1').lrtreeSet('getCheckNodeIds');
                        $('#step-2 .lr-tree-root [id$="_learun_moduleId"]').parent().hide();
                        $('#step-3 .lr-tree-root [id$="_learun_moduleId"]').parent().hide();
                        $.each(checkModuleIds, function (id, item) {
                            $('#step-2_' + item.replace(/-/g, '_') + '_learun_moduleId').parent().show();
                            $('#step-3_' + item.replace(/-/g, '_') + '_learun_moduleId').parent().show();
                        });
                    } else if (data.step == 2) {
                        checkButtonIds = $('#step-2').lrtreeSet('getCheckNodeIds');
                        $finish.removeAttr('disabled');
                        $next.attr('disabled', 'disabled');
                    } else {
                        $finish.attr('disabled', 'disabled');
                    }
                } else {
                    $finish.attr('disabled', 'disabled');
                    $next.removeAttr('disabled');
                }
            });
            // 保存数据按钮
            $("#btn_finish").on('click', page.save);
        },
        /*初始化数据*/
        initData: function () {
            if (!!objectId) {
                $.lrSetForm(top.$.rootUrl + '/LR_AuthorizeModule/Authorize/GetFormData?objectId=' + objectId, function (data) {//
                    selectData = data;
                });
            }
        },
        /*保存数据*/
        save: function () {
            var buttonList = [],columnList=[];
            var checkColumnIds = $('#step-3').lrtreeSet('getCheckNodeIds');
            $.each(checkButtonIds, function (id, item) {
                if (item.indexOf('_learun_moduleId') == -1)
                {
                    buttonList.push(item);
                }
            });
            $.each(checkColumnIds, function (id, item) {
                if (item.indexOf('_learun_moduleId') == -1) {
                    columnList.push(item);
                }
            });


            var postData = {
                objectId: objectId,
                objectType: objectType,
                strModuleId: String(checkModuleIds),
                strModuleButtonId: String(buttonList),
                strModuleColumnId: String(columnList)
            };

            $.lrSaveForm(top.$.rootUrl + '/LR_AuthorizeModule/Authorize/SaveForm', postData, function (res) {});
        }
    };

    page.init();
}