/* * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：超级管理员
 * 日  期：2018-05-23 13:06
 * 描  述：存储过程测试
 */
var refreshGirdData;
var bootstrap = function ($, learun) {
    "use strict";
    var page = {
        init: function () {
            page.initGird();
            page.bind();
        },
        bind: function () {
            $('#multiple_condition_query').lrMultipleQuery(function (queryJson) {
                page.search(queryJson);
            }, 220, 400);
            // 刷新
            $('#lr_refresh').on('click', function () {
                location.reload();
            });
            // 新增
            $('#lr_add').on('click', function () {
                learun.layerForm({
                    id: 'form',
                    title: '新增',
                    url: top.$.rootUrl + '/LR_CodeDemo/Product/Form',
                    width: 600,
                    height: 400,
                    callBack: function (id) {
                        return top[id].acceptClick(refreshGirdData);
                    }
                });
            });
            // 编辑
            $('#lr_edit').on('click', function () {
                var keyValue = $('#girdtable').jfGridValue('productId');
                if (learun.checkrow(keyValue)) {
                    learun.layerForm({
                        id: 'form',
                        title: '编辑',
                        url: top.$.rootUrl + '/LR_CodeDemo/Product/Form?keyValue=' + keyValue,
                        width: 600,
                        height: 400,
                        callBack: function (id) {
                            return top[id].acceptClick(refreshGirdData);
                        }
                    });
                }
            });
            // 删除
            $('#lr_delete').on('click', function () {
                var keyValue = $('#girdtable').jfGridValue('productId');
                if (learun.checkrow(keyValue)) {
                    learun.layerConfirm('是否确认删除该项！', function (res) {
                        if (res) {
                            learun.deleteForm(top.$.rootUrl + '/LR_CodeDemo/Product/DeleteForm', { keyValue: keyValue}, function () {
                                refreshGirdData();
                            });
                        }
                    });
                }
            });
        },
        // 初始化列表
        initGird: function () {
            $('#girdtable').lrAuthorizeJfGrid({
                url: top.$.rootUrl + '/LR_CodeDemo/Product/GetPageList',
                headData: [
                    { label: "productName", name: "productName", width: 160, align: "left"},
                    { label: "productKind", name: "productKind", width: 160, align: "left"},
                    { label: "productCycle", name: "productCycle", width: 160, align: "left"},
                    { label: "allocateCycle", name: "allocateCycle", width: 160, align: "left"},
                    { label: "maxProfit", name: "maxProfit", width: 160, align: "left"},
                    { label: "minProfit", name: "minProfit", width: 160, align: "left"},
                    { label: "maxAmount", name: "maxAmount", width: 160, align: "left"},
                    { label: "minAmount", name: "minAmount", width: 160, align: "left"},
                    { label: "factAmount", name: "factAmount", width: 160, align: "left"},
                    { label: "deptNo", name: "deptNo", width: 160, align: "left"},
                    { label: "productManager", name: "productManager", width: 160, align: "left"},
                    { label: "accountId", name: "accountId", width: 160, align: "left"},
                    { label: "seriesId", name: "seriesId", width: 160, align: "left"},
                    { label: "investWay", name: "investWay", width: 160, align: "left"},
                    { label: "productTag", name: "productTag", width: 160, align: "left"},
                    { label: "productStatus", name: "productStatus", width: 160, align: "left"},
                ],
                mainId:'productId',
                reloadSelected: true,
                isPage: true
            });
            page.search();
        },
        search: function (param) {
            param = param || {};
            $('#girdtable').jfGridSet('reload', { param: { queryJson: JSON.stringify(param) } });
        }
    };
    refreshGirdData = function () {
        page.search();
    };
    page.init();
}
