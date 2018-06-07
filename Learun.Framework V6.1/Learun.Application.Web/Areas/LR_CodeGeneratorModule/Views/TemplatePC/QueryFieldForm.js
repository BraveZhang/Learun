/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.11
 * 描 述：查询条件字段添加	
 */
var id = request('id');

var acceptClick;
var bootstrap = function ($, learun) {
    "use strict";
    var allcomponts = top.layer_CustmerCodeIndex.allcomponts;
    var queryData = top.layer_CustmerCodeIndex.queryData;


    console.log(allcomponts);

    var fieldName = '';
    var compontId = '';

    var page = {
        init: function () {
            page.bind();
            page.initData();
        },
        bind: function () {
            // 选择字段
            $('#fieldId').lrselect({
                value: 'fieldId',
                text: 'fieldName',
                data: allcomponts,
                allowSearch: true,
                maxHeight: 140,
                select: function (item) {
                    fieldName = item.fieldName;
                    compontId = item.id;
                }
            });
            // 所在行所占比
            $('#portion').lrselect({
                data: [
                    {
                        id: '1', text: '1'
                    },
                    {
                        id: '2', text: '1/2'
                    },
                    {
                        id: '3', text: '1/3'
                    },
                    {
                        id: '4', text: '1/4'
                    },
                    {
                        id: '6', text: '1/6'
                    }
                ],
                placeholder: false,
                value: 'id',
                text: 'text'
            }).lrselectSet('1');
        },
        initData: function () {
            if (!!id) {
                for (var i = 0, l = queryData.length; i < l; i++) {
                    if (queryData[i].id == id) {
                        $('#form').lrSetFormData(queryData[i]);
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
        var postData = $('#form').lrGetFormData();
        postData.id = id || learun.newGuid();
        postData.compontId = compontId;
        postData.fieldName = fieldName;
        callBack(postData);
        return true;
    };
    page.init();
}