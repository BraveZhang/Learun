/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.11
 * 描 述：表单设计数据表添加	
 */
var dbId = request('dbId');

var dbAllTable = top.layer_CustmerCodeIndex.dbAllTable;
var dbTable = top.layer_CustmerCodeIndex.dbTable;
var selectedTable = top.layer_CustmerCodeIndex.selectedTable;
var mapField = top.layer_CustmerCodeIndex.mapField;


var acceptClick;
var bootstrap = function ($, learun) {
    "use strict";

    var pk = '';

    var page = {
        init: function () {
            page.bind();
            page.initData();
        },
        bind: function () {
            $('#field').lrselect({
                value: 'f_column',
                text: 'f_column',
                title: 'f_remark',
                allowSearch: true
            });
            $('#relationField').lrselect({
                value: 'f_column',
                text: 'f_column',
                title: 'f_remark',
                maxHeight: 130,
                allowSearch: true
            });
            $('#name').lrselect({
                data: dbAllTable,
                value: 'name',
                text: 'name',
                title: 'tdescription',
                maxHeight: 200,
                allowSearch: true,
                select: function (item) {
                    if (!!item) {
                        var fieldData = mapField[dbId + item.name];
                        if (!!fieldData) {
                            $('#field').lrselectRefresh({
                                data: fieldData
                            });
                        }
                        else {
                            learun.httpAsync('GET', top.$.rootUrl + '/LR_SystemModule/DatabaseTable/GetFieldList', { databaseLinkId: dbId, tableName: item.name }, function (data) {
                                mapField[dbId + item.name] = data;
                                $('#field').lrselectRefresh({
                                    data: data
                                });
                            });
                        }
                        pk = item.pk;
                    }
                    else {
                        $('#field').lrselectRefresh({
                            url: '',
                            data: []
                        });
                        pk = '';
                    }
                    
                }
            });
            $('#relationName').lrselect({
                data: dbTable,
                value: 'name',
                text: 'name',
                maxHeight: 160,
                allowSearch: true,
                select: function (item) {
                    if (!!item) {
                        var fieldData = mapField[dbId + item.name];
                        if (!!fieldData) {
                            $('#relationField').lrselectRefresh({
                                data: fieldData
                            });
                        }
                    }
                    else {
                        $('#relationField').lrselectRefresh({
                            url:'',
                            data:[]
                        });
                    }
                }
            });
        },
        initData: function () {
            if (!!selectedTable) {
                $('#form').lrSetFormData(selectedTable);
            }
        }
    };
    // 保存数据
    acceptClick = function (callBack) {
        if (!$('#form').lrValidform()) {
            return false;
        }

        var data = $('#form').lrGetFormData();
        if (data.name == data.relationName) {
            learun.alert.error('关联表不能是自己本身！');
            return false;
        }
        data.pk = pk;
        if (!!callBack) {
            callBack(data);
        }
        return true;
    };
    page.init();
}