/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.17
 * 描 述：选项卡编辑	
 */
var keyValue = request('keyValue');
var selectedRow;
var bootstrap = function ($, learun) {
    "use strict";
    var tabList = top[keyValue];
    var page = {
        init: function () {
            page.initGird();
            page.bind();
        },
        bind: function () {
            // 新增
            $('#lr_add').on('click', function () {
                selectedRow = null;
                learun.layerForm({
                    id: 'TabEditForm',
                    title: '添加选项卡',
                    url: top.$.rootUrl + '/LR_FormModule/Custmerform/TabEditForm',
                    width: 400,
                    height: 200,
                    callBack: function (id) {
                        return top[id].acceptClick(function (data) {
                            tabList.push(data);
                            tabList = tabList.sort(function (a, b) {
                                return parseInt(a.sort) - parseInt(b.sort);
                            });
                            $('#girdtable').jfGridSet('refreshdata', { rowdatas: tabList });
                        });
                    }
                });
            });
            // 编辑
            $('#lr_edit').on('click', function () {
                selectedRow = $('#girdtable').jfGridGet('rowdata');
                var keyValue = $('#girdtable').jfGridValue('id');
                if (learun.checkrow(keyValue)) {
                    learun.layerForm({
                        id: 'TabEditForm',
                        title: '编辑选项卡',
                        url: top.$.rootUrl + '/LR_FormModule/Custmerform/TabEditForm',
                        width: 400,
                        height: 200,
                        callBack: function (id) {
                            return top[id].acceptClick(function (data) {
                                console.log(data);

                                $.each(tabList, function (id, item) {
                                    console.log(item);

                                    if (item.id == data.id) {
                                        tabList[id] = data;
                                        return false;
                                    }
                                });
                                tabList = tabList.sort(function (a, b) {
                                    return parseInt(a.sort) - parseInt(b.sort);
                                });
                                $('#girdtable').jfGridSet('refreshdata', { rowdatas: tabList });
                            });
                        }
                    });
                }
            });
            // 删除
            $('#lr_delete').on('click', function () {
                var _id = $('#girdtable').jfGridValue('id');
                if (learun.checkrow(_id)) {
                    learun.layerConfirm('是否确认删除该选项卡', function (res, index) {
                        if (res) {
                            $.each(tabList, function (id, item) {
                                if (item.id == _id) {
                                    tabList.splice(id, 1);
                                    return false;
                                }
                            });
                            $('#girdtable').jfGridSet('refreshdata', { rowdatas: tabList });
                            top.layer.close(index); //再执行关闭  
                        }
                    });
                }
            });
        },
        initGird: function () {
            $('#girdtable').jfGrid({
                headData: [
                    { label: "名称", name: "text", width: 340, align: "left" },
                    { label: "序号", name: "sort", width: 80, align: "center" }
                ],
                mainId: 'id',
                reloadSelected: true
            });

            $('#girdtable').jfGridSet('refreshdata', { rowdatas: tabList });
        }
    };
    page.init();
}