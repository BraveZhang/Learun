/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.03.22
 * 描 述：表格数据字段编辑	
 */
var id = request('id');
var colDatas = [];

var bootstrap = function ($, learun) {
    "use strict";
    // 获取父弹层的数据
    var componts = top.layer_CustmerCodeIndex.componts;

    var girdtableSetting;

    var page = {
        init: function () {
            page.initGird();
            page.bind();
        },
        bind: function () {
            // 编辑
            $('#lr_edit').on('click', function () {
                var _field = $('#girdtable').jfGridValue('field');
                if (learun.checkrow(_field)) {
                    learun.layerForm({
                        id: 'GridFieldForm',
                        title: '编辑表格字段',
                        url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/GridFieldForm?keyValue=' + _field,
                        width: 600,
                        height: 500,
                        callBack: function (id) {
                            return top[id].acceptClick(function (data) {
                                for (var i = 0, l = colDatas.length; i < l; i++) {
                                    var item = colDatas[i];
                                    if (item.field == _field) {
                                        colDatas[i] = data;
                                        break;
                                    }
                                }
                                colDatas = colDatas.sort(function (a, b) {
                                    return parseInt(a.sort) - parseInt(b.sort);
                                });
                                $('#girdtable').jfGridSet('refreshdata', { rowdatas: colDatas });
                            });

                        }
                    });
                }
            });
        },
        initGird: function () {
            $('#girdtable').jfGrid({
                headData: [
                    { label: "显示名称", name: "name", width: 200, align: "left" },
                    { label: "绑定字段", name: "field", width: 200, align: "left" },
                    { label: "显示宽度", name: "width", width: 80, align: "center" },
                    { label: "编辑类型", name: "type", width: 80, align: "center" },
                    {
                        label: "是否隐藏", name: "fixedInfoHide", width: 60, align: "center",
                        formatter: function (cellvalue, row, dfop, $dcell) {
                            $dcell.on('click', function () {
                                if (row.fixedInfoHide == 1) {
                                    row.fixedInfoHide = 0;
                                    $(this).html('<span class=\"label label-success \" style=\"cursor: pointer;\">否</span>');
                                }
                                else {
                                    row.fixedInfoHide = 1;
                                    $(this).html('<span class=\"label label-default \" style=\"cursor: pointer;\">是</span>');
                                }
                            });
                            if (cellvalue == 1) {
                                return '<span class=\"label label-default \" style=\"cursor: pointer;\">是</span>';
                            } else if (cellvalue == 0) {
                                return '<span class=\"label label-success \" style=\"cursor: pointer;\">否</span>';
                            }
                        }


                    }// 1 隐藏 0 显示
                ],
                mainId: 'field',
                reloadSelected: true
            });
            
            if (!!id) {
                for (var i = 0, l = componts.length; i < l; i++) {
                    if (componts[i].id == id) {
                        girdtableSetting = componts[i];
                        colDatas = componts[i].fields;
                        break;
                    }
                }
            }

            $('#girdtable').jfGridSet('refreshdata', { rowdatas: colDatas });
        }
    };
    page.init();
}


