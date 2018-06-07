/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.05
 * 描 述：单表开发模板	
 */

// 数据表数据
var dbAllTable = [];
var dbTable = [];
var selectedTable;
var databaseLinkId = '';
var mainTable;
var mapField = {};

var tableFieldTree = [];

// 表单选项卡数据
var tabList = [{
    id: '0',
    text: '表单选项卡',
    value: 'no',
    hasChildren: true,
    isexpand: true,
    complete: true,
    ChildNodes: [
        {
            id: 'main',
            text: '主表信息',
            value: 'main',
            sort: 0,
            isexpand: false,
            complete: true,
            componts: []
        }
    ]
}];
var componts= [];
var allcomponts = [];
var compontsTree = [];

// 查询条件设置
var queryData = [];

// 列表设置
var colData = [];

var bootstrap = function ($, learun) {
    "use strict";

    var rootDirectory = $('#rootDirectory').val();
    var postData = {};
    var page = {
        init: function () {
            page.bind();
        },
        /*绑定事件和初始化控件*/
        bind: function () {
            // 刷新
            $('#lr_refresh').on('click', function () {
                location.reload();
            });
            // 加载导向
            $('#wizard').wizard().on('change', function (e, data) {
                var $finish = $("#btn_finish");
                var $next = $("#btn_next");
                if (data.direction == "next") {
                    if (data.step == 1) {
                        dbTable = $('#db_gridtable').jfGridGet('rowdatas');
                        if (dbTable.length == 0) {
                            learun.alert.error('请选择数据表！');
                            return false;
                        }
                        var compontMap = {};
                        for (var i = 0, l = componts.length; i < l; i++) {
                            compontMap[componts[i].id] = "1";
                        }

                        // 获取主表
                        mainTable = "";
                        tableFieldTree.length = 0;
                        for (var i = 0, l = dbTable.length; i < l; i++) {
                            if (!dbTable[i].relationName) {
                                mainTable = dbTable[i];
                            }
                            var tableNode = {
                                id: dbTable[i].name,
                                text: dbTable[i].name,
                                value: dbTable[i].name,
                                hasChildren: true,
                                isexpand: true,
                                complete: true,
                                ChildNodes: []
                            };
                            for (var j = 0, jl = mapField[databaseLinkId + dbTable[i].name].length; j < jl; j++) {
                                var fieldItem = mapField[databaseLinkId + dbTable[i].name][j];
                                var point = {
                                    id: tableNode.text + fieldItem.f_column,
                                    text: fieldItem.f_column,
                                    value: fieldItem.f_column,
                                    title: fieldItem.f_remark,
                                    hasChildren: false,
                                    isexpand: false,
                                    complete: true,
                                    showcheck: true
                                };
                                if (!!compontMap[point.id]) {
                                    point.checkstate = 1;
                                }
                                tableNode.ChildNodes.push(point);
                            }
                            tableFieldTree.push(tableNode);
                        }

                        if (!mainTable) {
                            learun.alert.error('需要设定一张主表！');
                            return false;
                        }
                        $('#table_list').lrtreeSet('refresh');

                        $('#queryDatetime').lrselectRefresh({
                            data: mapField[databaseLinkId + mainTable.name]
                        });
                        $('#workfield').lrselectRefresh({
                            data: mapField[databaseLinkId + mainTable.name]
                        });
                        


                    }
                    else if (data.step == 2) {
                        if (!$('#step-2').lrValidform()) {
                            return false;
                        }
                        allcomponts = [];
                        compontsTree.length = 0;
                        for (var i = 0, l = tabList[0].ChildNodes.length; i < l; i++) {
                            var _componts = tabList[0].ChildNodes[i].componts;
                            for (var j = 0, jl = _componts.length; j < jl; j++) {
                                if (_componts[j].type != 'gridtable') {
                                    allcomponts.push(_componts[j]);
                                    var point = {
                                        id: _componts[j].id,
                                        text: _componts[j].fieldName,
                                        value: _componts[j].fieldName,
                                        hasChildren: false,
                                        isexpand: false,
                                        complete: true,
                                        showcheck: true,
                                        compont: _componts[j]
                                    };
                                    compontsTree.push(point);
                                }
                            }
                        }
                        // 刷新列表页组件
                        $('#compont_list').lrtreeSet('refresh');
                        colData.length = 0;
                        $('#col_gridtable').jfGridSet('refreshdata', { rowdatas: colData });
                        $('#compont_list').lrtreeSet("allCheck");
                    }
                    else if (data.step == 3) {
                        if (!$('#step-3').lrValidform()) {
                            return false;
                        }
                    }
                    else if (data.step == 4) {

                    }
                    else if (data.step == 5) {
                        if (!$('#step-5').lrValidform()) {
                            return false;
                        }
                        postData = {};
                        postData.databaseLinkId = databaseLinkId;
                        // 获取表数据
                        postData.dbTable = JSON.stringify(dbTable);

                        // 获取表单设计数据
                        var _tablist = [];
                        $.each(tabList[0].ChildNodes, function (id, item) {
                            var _point = {
                                text: item.text,
                                componts: item.componts
                            };
                            _tablist.push(_point);
                        });
                        postData.formData = JSON.stringify({
                            height: $('#formHeight').val(),
                            width: $('#formWidth').val(),
                            tablist: _tablist,
                            workField: $('#workfield').lrselectGet()
                        });
                        // 获取条件配置数据
                        var _querySetting = {
                            width: $('#queryWidth').val(),
                            height: $('#queryHeight').val(),
                            isDate: $('[name="queryDatetime"]:checked').val(),
                            DateField: $('#queryDatetime').lrselectGet(),
                            fields: queryData
                        };
                        postData.queryData = JSON.stringify(_querySetting);
                        // 获取列表数据
                        var _colData = {
                            isPage: $('[name="isPage"]:checked').val(),
                            fields: colData
                        };
                        postData.colData = JSON.stringify(_colData);
                        // 基础配置信息
                        var baseInfo = $('#step-5').lrGetFormData();
                        postData.baseInfo = JSON.stringify(baseInfo);

                        learun.httpAsyncPost(top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/LookWorkflowCode', postData, function (res) {
                            if (res.code == 200) {
                                $.each(res.data, function (id, item) {
                                    $('#' + id).html('<textarea name="SyntaxHighlighter" class="brush: c-sharp;">' + item + '</textarea>');
                                });
                                SyntaxHighlighter.highlight();
                            }
                        });
                    }
                    else if (data.step == 6) {
                        $finish.removeAttr('disabled');
                        $next.attr('disabled', 'disabled');
                    }
                    else {
                        $finish.attr('disabled', 'disabled');
                    }
                } else {
                    $finish.attr('disabled', 'disabled');
                    $next.removeAttr('disabled');
                }
            });
            // 数据表选择
            $('#dbId').lrselect({
                url: top.$.rootUrl + '/LR_SystemModule/DatabaseLink/GetTreeList',
                type: 'tree',
                placeholder: '请选择数据库',
                allowSearch: true,
                select: function (item) {
                    dbTable = [];
                    $('#db_gridtable').jfGridSet('refreshdata', { rowdatas: [] });
                    if (item.hasChildren) {
                        databaseLinkId = '';
                    }
                    else if (dbId != item.id) {
                        databaseLinkId = item.id;
                        // 获取数据的表数据 
                        learun.httpAsync('GET', top.$.rootUrl + '/LR_SystemModule/DatabaseTable/GetList', { databaseLinkId: databaseLinkId }, function (data) {
                            dbAllTable = data;
                        });
                    }
                }
            });
            // 新增
            $('#lr_db_add').on('click', function () {
                if (!!databaseLinkId) {
                    dbTable = $('#db_gridtable').jfGridGet('rowdatas');
                    selectedTable = null;
                    learun.layerForm({
                        id: 'DataTableForm',
                        title: '添加数据表',
                        url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/DataTableForm?dbId=' + databaseLinkId,
                        width: 600,
                        height: 400,
                        callBack: function (id) {
                            return top[id].acceptClick(function (data) {
                                for (var i = 0, l = dbTable.length; i < l; i++) {
                                    if (dbTable[i].name == data.name) {
                                        learun.alert.warning('不能重复添加表');
                                        return false;
                                    }
                                    if (!data.relationName && !dbTable[i].relationName) {
                                        learun.alert.warning('不能有两张主表');
                                        return false;
                                    }
                                }
                                $('#db_gridtable').jfGridSet('addRow', { row: data });
                            });
                        }
                    });
                }
                else {
                    learun.alert.warning('请选择数据库');
                }
            });
            // 编辑
            $('#lr_db_edit').on('click', function () {
                dbTable = $('#db_gridtable').jfGridGet('rowdatas');
                selectedTable = $('#db_gridtable').jfGridGet('rowdata');
                var keyValue = $('#db_gridtable').jfGridValue('name');

                if (learun.checkrow(keyValue)) {
                    learun.layerForm({
                        id: 'DataTableForm',
                        title: '编辑数据表',
                        url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/DataTableForm?dbId=' + databaseLinkId,
                        width: 600,
                        height: 400,
                        callBack: function (id) {
                            return top[id].acceptClick(function (data) {
                                for (var i = 0, l = dbTable.length; i < l; i++) {
                                    if (dbTable[i].name == data.name && data.name != selectedTable.name) {
                                        learun.alert.warning('不能重复添加表');
                                        return false;
                                    }
                                    if (!!selectedTable.relationName && !data.relationName && !dbTable[i].relationName) {
                                        learun.alert.warning('不能有两张主表');
                                        return false;
                                    }
                                }
                                $('#db_gridtable').jfGridSet('updateRow', { row: data });
                            });
                        }
                    });
                }
            });
            // 删除
            $('#lr_db_delete').on('click', function () {
                var keyValue = $('#db_gridtable').jfGridValue('name');
                if (learun.checkrow(keyValue)) {
                    learun.layerConfirm('是否确认删除该项！', function (res, index) {
                        if (res) {
                            $('#db_gridtable').jfGridSet('removeRow');
                            top.layer.close(index); //再执行关闭  
                        }
                    });
                }
            });
            $('#db_gridtable').jfGrid({
                headData: [
                    {
                        label: "", name: "isMain", width: 60, align: "center",
                        formatter: function (cellvalue, row) {
                            if (!row.relationName) {
                                return '<span class=\"label label-warning \" style=\"cursor: pointer;\">主表</span>';
                            }
                            else {
                                return '<span class=\"label label-info \" style=\"cursor: pointer;\">从表</span>';
                            }
                        }
                    },
                    { label: "数据表名", name: "name", width: 200, align: "left" },
                    { label: "主键", name: "pk", width: 160, align: "left" },
                    { label: "数据表关联字段", name: "field", width: 200, align: "left" },
                    { label: "关联表", name: "relationName", width: 200, align: "left" },
                    { label: "关联表字段", name: "relationField", width: 200, align: "left" }
                ],
                mainId: 'name',
                reloadSelected: true
            });

            // 表单设置
            $('#tab_list').lrtree({
                data: tabList,
                nodeClick: function (item) {
                    if (item.value != 'no') {
                        componts = item.componts;
                        $('#form_gridtable').jfGridSet('refreshdata', { rowdatas: componts });
                        var compontMap = {};
                        for (var i = 0, l = componts.length; i < l; i++) {
                            compontMap[componts[i].id] = "1";
                        }
                        tableFieldTree.length = 0;
                        for (var i = 0, l = dbTable.length; i < l; i++) {
                            var tableNode = {
                                id: dbTable[i].name,
                                text: dbTable[i].name,
                                value: dbTable[i].name,
                                hasChildren: true,
                                isexpand: true,
                                complete: true,
                                ChildNodes: []
                            };
                            for (var j = 0, jl = mapField[databaseLinkId + dbTable[i].name].length; j < jl; j++) {
                                var fieldItem = mapField[databaseLinkId + dbTable[i].name][j];
                                var point = {
                                    id: tableNode.text + fieldItem.f_column,
                                    text: fieldItem.f_column,
                                    value: fieldItem.f_column,
                                    title: fieldItem.f_remark,
                                    hasChildren: false,
                                    isexpand: false,
                                    complete: true,
                                    showcheck: true
                                };
                                if (!!compontMap[point.id]) {
                                    point.checkstate = 1;
                                }
                                tableNode.ChildNodes.push(point);
                            }
                            tableFieldTree.push(tableNode);
                        }
                        $('#table_list').lrtreeSet('refresh');
                    }
                }
            });
            $('#table_list').lrtree({
                data: tableFieldTree,
                nodeCheck: function (itemNode) {
                    if (itemNode.checkstate == 1) {
                        var _data = {
                            dataItemCode: "",
                            dataSource: "0",
                            dataSourceId: "",
                            fieldId: itemNode.value,
                            fieldName: itemNode.title,
                            id: itemNode.id,
                            proportion: "1",
                            sort: componts.length,
                            tableName: itemNode.parent.value,
                            type: "text",
                            validator: "",
                        };
                        componts.push(_data);
                        componts = componts.sort(function (a, b) {
                            return parseInt(a.sort) - parseInt(b.sort);
                        });
                    }
                    else {
                        $.each(componts, function (id, item) {
                            if (item.id == itemNode.id) {
                                componts.splice(id, 1);
                                return false;
                            }
                        });
                    }
                    $('#form_gridtable').jfGridSet('refreshdata', { rowdatas: componts });
                }
            });


            $('#tab_list_main').trigger('click');

            $('#lr_edit_tabs').on('click', function () {// 编辑选项卡
                learun.layerForm({
                    id: 'TabEditIndex',
                    title: '编辑选项卡',
                    url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/TabEditIndex',
                    width: 600,
                    height: 400,
                    maxmin: true,
                    btn: null,
                    end: function () {
                        $('#tab_list').lrtreeSet('refresh');
                        $('#tab_list_main').trigger('click');
                    }
                });
            });

            $('#form_gridtable').jfGrid({ // 字段设置
                headData: [
                    { label: "表名", name: "tableName", width: 140, align: "left" },
                    { label: "名称", name: "fieldName", width: 140, align: "left" },
                    { label: "字段", name: "fieldId", width: 140, align: "left" },
                    {
                        label: "类型", name: "type", width: 80, align: "center",
                        formatter: function (cellvalue) {
                            switch (cellvalue) {
                                case 'text':
                                    return '文本框';
                                    break;
                                case 'textarea':
                                    return '文本区域';
                                    break;
                                case 'datetime':
                                    return '日期框';
                                    break;
                                case 'select':
                                    return '下拉框';
                                    break;
                                case 'radio':
                                    return '单选框';
                                    break;
                                case 'checkbox':
                                    return '多选框';
                                    break;
                                case 'gridtable':
                                    return '编辑表格';
                                    break;
                            }
                        }
                    },
                    {
                        label: "字段验证", name: "validator", width: 160, align: "left",
                        formatter: function (cellvalue) {
                            switch (cellvalue) {
                                case 'NotNull':
                                    return '不能为空';
                                    break;
                                case 'Num':
                                    return '必须为数字';
                                    break;
                                case 'NumOrNull':
                                    return '数字或空';
                                    break;
                                case 'Email':
                                    return '必须为E-mail格式';
                                    break;
                                case 'EmailOrNull':
                                    return 'E-mail格式或空';
                                    break;
                                case 'EnglishStr':
                                    return '必须为字符串';
                                    break;
                                case 'EnglishStrOrNull':
                                    return '字符串或空';
                                    break;
                                case 'Phone':
                                    return '必须电话格式';
                                    break;
                                case 'PhoneOrNull':
                                    return '电话格式或者空';
                                    break;
                                case 'Fax':
                                    return '必须为传真格式';
                                    break;
                                case 'Mobile':
                                    return '必须为手机格式';
                                    break;
                                case 'MobileOrNull':
                                    return '手机格式或者空';
                                    break;
                                case 'MobileOrPhone':
                                    return '电话格式或手机格式';
                                    break;
                                case 'MobileOrPhoneOrNull':
                                    return '电话格式或手机格式或空';
                                    break;
                                case 'Uri':
                                    return '必须为网址格式';
                                    break;
                                case 'UriOrNull':
                                    return '网址格式或空';
                                    break;
                            }
                        }
                    },
                    {
                        label: "所占比例", name: "proportion", width: 80, align: "center",
                        formatter: function (cellvalue, row) {
                            return '1/' + cellvalue;
                        }
                    },
                    {
                        label: "数据来源", name: "dataSource", width: 120, align: "left",
                        formatter: function (cellvalue, row) {
                            if (row.type == 'select' || row.type == 'radio' || row.type == 'checkbox') {
                                switch (cellvalue) {
                                    case '0':
                                        return '数据字典';
                                        break;
                                    case '1':
                                        return '数据源';
                                        break;
                                }
                            }
                        }
                    }
                ]
            });
            // 编辑
            $('#lr_edit_form').on('click', function () {
                var _id = $('#form_gridtable').jfGridValue('id');
                if (learun.checkrow(_id)) {
                    learun.layerForm({
                        id: 'FormSetting',
                        title: '编辑表单字段',
                        url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/FormSetting?id=' + _id,
                        width: 400,
                        height: 520,
                        callBack: function (id) {
                            return top[id].acceptClick(function (data) {
                                $.each(componts, function (id, item) {
                                    if (item.id == data.id) {
                                        componts[id] = data;
                                        return false;
                                    }
                                });
                                componts = componts.sort(function (a, b) {
                                    return parseInt(a.sort) - parseInt(b.sort);
                                });
                                $('#form_gridtable').jfGridSet('refreshdata', { rowdatas: componts });
                            });
                        }
                    });
                }
            });
            // 删除
            $('#lr_delete_form').on('click', function () {
                var _id = $('#form_gridtable').jfGridValue('id');
                var _type = $('#form_gridtable').jfGridValue('type');

                if (learun.checkrow(_id)) {
                    learun.layerConfirm('是否确认删除该字段', function (res, index) {
                        if (res) {
                            if (_type == 'gridtable') {
                                $.each(componts, function (id, item) {
                                    if (item.id == _id) {
                                        componts.splice(id, 1);
                                        return false;
                                    }
                                });
                                $('#form_gridtable').jfGridSet('refreshdata', { rowdatas: componts });
                            }
                            else {
                                var list = [];
                                list.push(_id);
                                $('#table_list').lrtreeSet('setCheck', list);
                            }
                            top.layer.close(index); //再执行关闭  
                        }
                    });
                }
            });
            // 添加表格
            $('#lr_gridadd_form').on('click', function () {
                learun.layerForm({
                    id: 'AddGridFieldIndex',
                    title: '添加表格',
                    url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/AddGridFieldIndex',
                    width: 400,
                    height: 300,
                    callBack: function (id) {
                        return top[id].acceptClick(function (data) {
                            var point = {
                                dataItemCode: '',
                                dataSource: '',
                                dataSourceId: '',
                                fieldId: '',
                                fieldName: '编辑表格',
                                id: learun.newGuid(),
                                proportion: '1',
                                sort: data.sort,
                                tableName: data.tableName,
                                type: 'gridtable',
                                validator: '',
                                fields: []
                            };

                            for (var i = 0, l = mapField[databaseLinkId + data.tableName].length; i < l; i++) {
                                var fieldPoint = {
                                    name: mapField[databaseLinkId + data.tableName][i].f_remark,
                                    field: mapField[databaseLinkId + data.tableName][i].f_column,
                                    width: 160,
                                    type: 'input',
                                    align: 'left',
                                    sort: i,
                                    fixedInfoHide: 0
                                };
                                point.fields.push(fieldPoint);
                            }
                            componts.push(point);
                            componts = componts.sort(function (a, b) {
                                return parseInt(a.sort) - parseInt(b.sort);
                            });
                            $('#form_gridtable').jfGridSet('refreshdata', { rowdatas: componts });
                        });
                    }
                });
            });
            // 设置编辑表格
            $('#lr_gridedit_form').on('click', function () {
                var _id = $('#form_gridtable').jfGridValue('id');
                if (learun.checkrow(_id)) {
                    learun.layerForm({
                        id: 'GridFieldIndex',
                        title: '编辑表格',
                        url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/GridFieldIndex?id=' + _id,
                        width: 700,
                        height: 500,
                        maxmin: true,
                        btn: null,
                        end: function () {
                            $('#form_gridtable').jfGridSet('refreshdata', { rowdatas: componts });
                        }
                    });
                }
            });

            // 预览排版
            $('#lr_preview_form').on('click', function () {
                // 获取表单高和宽
                var w = parseInt($('#formWidth').val());
                var h = parseInt($('#formHeight').val());

                learun.layerForm({
                    id: 'PreviewForm',
                    title: '预览排版',
                    url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/PreviewForm?formId=layer_CustmerCodeIndex',
                    width: w,
                    height: h,
                    maxmin: true,
                    btn: null
                });
            });
            // 流程关联字段设置
            $('#workfield').lrselect({
                value: 'f_column',
                text: 'f_column',
                title: 'f_remark',
                allowSearch: true
            });

            // 条件信息设置
            $('#queryDatetime').lrselect({
                value: 'f_column',
                text: 'f_column',
                title: 'f_remark',
                allowSearch: true
            });


            $('#query_girdtable').jfGrid({
                headData: [
                    { label: "字段项名称", name: "fieldName", width: 260, align: "left" },
                    {
                        label: "所占行比例", name: "portion", width: 150, align: "left",
                        formatter: function (cellvalue, row) {
                            return '1/' + cellvalue;
                        }
                    },
                ],
                mainId: 'id'
            });

            // 新增
            $('#lr_add_query').on('click', function () {
                learun.layerForm({
                    id: 'QueryFieldForm',
                    title: '添加条件字段',
                    url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/QueryFieldForm',
                    height: 300,
                    width: 400,
                    callBack: function (id) {
                        return top[id].acceptClick(function (data) {
                            queryData.push(data);
                            queryData = queryData.sort(function (a, b) {
                                return parseInt(a.sort) - parseInt(b.sort);
                            });
                            $('#query_girdtable').jfGridSet('refreshdata', { rowdatas: queryData });
                        });
                    }
                });
            });
            // 编辑
            $('#lr_edit_query').on('click', function () {
                var id = $('#query_girdtable').jfGridValue('id');
                if (learun.checkrow(id)) {
                    learun.layerForm({
                        id: 'QueryFieldForm',
                        title: '添加条件字段',
                        url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/QueryFieldForm?id=' + id,
                        height: 300,
                        width: 400,
                        callBack: function (id) {
                            return top[id].acceptClick(function (data) {
                                for (var i = 0, l = queryData.length; i < l; i++) {
                                    if (queryData[i].id == data.id) {
                                        queryData[i] = data;
                                        break;
                                    }
                                }
                                queryData = queryData.sort(function (a, b) {
                                    return parseInt(a.sort) - parseInt(b.sort);
                                });
                                $('#query_girdtable').jfGridSet('refreshdata', { rowdatas: queryData });
                            });
                        }
                    });
                }
            });
            // 删除
            $('#lr_delete_query').on('click', function () {
                var id = $('#query_girdtable').jfGridValue('id');
                if (learun.checkrow(id)) {
                    learun.layerConfirm('是否确认删除该字段', function (res, index) {
                        if (res) {
                            for (var i = 0, l = queryData.length; i < l; i++) {
                                if (queryData[i].id == id) {
                                    queryData.splice(i, 1);
                                    break;
                                }
                            }
                            $('#query_girdtable').jfGridSet('refreshdata', { rowdatas: queryData });
                            top.layer.close(index); //再执行关闭  
                        }
                    });
                }
            });


            // 列表显示配置
            $('#col_gridtable').jfGrid({
                headData: [
                    { label: "列名", name: "fieldName", width: 140, align: "left" },
                    { label: "字段", name: "fieldId", width: 140, align: "left" },
                    { label: "对齐", name: "align", width: 80, align: "center" },
                    { label: "宽度", name: "width", width: 80, align: "center" }
                ]
            });

            $('#compont_list').lrtree({
                data: compontsTree,
                nodeCheck: function (itemNode) {
                    if (itemNode.checkstate == 1) {
                        var _data = {
                            compontId: itemNode.compont.id,
                            fieldName: itemNode.compont.fieldName,
                            fieldId: itemNode.compont.fieldId,
                            align: 'left',
                            width: 160,
                            sort: colData.length
                        };
                        colData.push(_data);
                        console.log(_data);
                        colData = colData.sort(function (a, b) {
                            return parseInt(a.sort) - parseInt(b.sort);
                        });
                    }
                    else {
                        console.log(itemNode.compont.id);

                        for (var i = 0, l = colData.length; i < l; i++) {

                            if (colData[i].compontId == itemNode.compont.id) {
                                colData.splice(i, 1);
                                console.log(colData);
                                break;
                            }
                        }
                    }
                    $('#col_gridtable').jfGridSet('refreshdata', { rowdatas: colData });
                }
            });

            // 编辑
            $('#lr_edit_col').on('click', function () {
                var compontId = $('#col_gridtable').jfGridValue('compontId');
                if (learun.checkrow(compontId)) {
                    learun.layerForm({
                        id: 'ColFieldForm',
                        title: '编辑条件字段',
                        url: top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/ColFieldForm?compontId=' + compontId,
                        height: 300,
                        width: 400,
                        callBack: function (id) {
                            return top[id].acceptClick(function (data) {
                                colData = colData.sort(function (a, b) {
                                    return parseInt(a.sort) - parseInt(b.sort);
                                });
                                $('#col_gridtable').jfGridSet('refreshdata', { rowdatas: colData });
                            });
                        }
                    });
                }
            });


            // 基础信息配置
            var loginInfo = learun.clientdata.get(['userinfo']);
            $('#createUser').val(loginInfo.realName);
            $('#outputArea').lrDataItemSelect({ code: 'outputArea' });

            $('#mappingDirectory').val(rootDirectory + $('#_mappingDirectory').val());
            $('#serviceDirectory').val(rootDirectory + $('#_serviceDirectory').val());
            $('#webDirectory').val(rootDirectory + $('#_webDirectory').val());

            // 代码查看
            $('#nav_tabs').lrFormTabEx();
            $('#tab_content>div').mCustomScrollbar({ // 优化滚动条
                theme: "minimal-dark"
            });
            // 发布功能
            // 上级
            $('#F_ParentId').lrselect({
                url: top.$.rootUrl + '/LR_SystemModule/Module/GetExpendModuleTree',
                type: 'tree',
                maxHeight: 280,
                allowSearch: true
            });
            // 选择图标
            $('#selectIcon').on('click', function () {
                learun.layerForm({
                    id: 'iconForm',
                    title: '选择图标',
                    url: top.$.rootUrl + '/Utility/Icon',
                    height: 700,
                    width: 1000,
                    btn: null,
                    maxmin: true,
                    end: function () {
                        if (top._learunSelectIcon != '') {
                            $('#F_Icon').val(top._learunSelectIcon);
                        }
                    }
                });
            });
            // 保存数据按钮
            $("#btn_finish").on('click', page.save);
        },
        dbTableSearch: function (param) {
            param = param || {};
            param.databaseLinkId = databaseLinkId;
            $('#dbtablegird').jfGridSet('reload', { param: param });
        },
        /*保存数据*/
        save: function () {
            if (!$('#step-7').lrValidform()) {
                return false;
            }
            var moduleData = $('#step-7').lrGetFormData();
            moduleData.F_EnabledMark = 1;
            postData.moduleEntityJson = JSON.stringify(moduleData);
            $.lrSaveForm(top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/CreateWorkflowCode', postData, function (res) { }, true);
        }
    };

    page.init();
}