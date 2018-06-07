/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.05
 * 描 述：单表开发模板	
 */

// 数据表数据
var databaseLinkId = '';
var mainTable = '';
var mainPk = '';
var mapField = {};

var tableFieldTree = [];

// 表单选项卡数据
var componts = [];
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
            componts: componts
        }
    ]
}];
var tabItem = tabList[0].ChildNodes[0];


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
                        // 获取表
                        mainTable = $('#dbtablegird').jfGridValue('name');
                        mainPk = $('#dbtablegird').jfGridValue('pk');

                        if (mainTable == '') {
                            learun.alert.error('请选择数据表');
                            return false;
                        }
                        var compontMap = {};
                        for (var i = 0, l = componts.length; i < l; i++) {
                            compontMap[componts[i].id] = "1";
                        }
                        // 获取表字段
                        if (mapField[databaseLinkId + mainTable]) {
                            tableFieldTree.length = 0;
                            var tableNode = {
                                id: mainTable,
                                text: mainTable,
                                value: mainTable,
                                hasChildren: true,
                                isexpand: true,
                                complete: true,
                                showcheck: true,
                                ChildNodes: []
                            };
                            for (var j = 0, jl = mapField[databaseLinkId + mainTable].length; j < jl; j++) {
                                var fieldItem = mapField[databaseLinkId + mainTable][j];
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

                            $('#table_list').lrtreeSet('refresh');

                            $('#queryDatetime').lrselectRefresh({
                                data: mapField[databaseLinkId + mainTable]
                            });
                        }
                        else {
                            learun.httpAsync('GET', top.$.rootUrl + '/LR_SystemModule/DatabaseTable/GetFieldList', { databaseLinkId: databaseLinkId, tableName: mainTable }, function (data) {
                                mapField[databaseLinkId + mainTable] = data;

                                tableFieldTree.length = 0;
                                var tableNode = {
                                    id: mainTable,
                                    text: mainTable,
                                    value: mainTable,
                                    hasChildren: true,
                                    isexpand: true,
                                    complete: true,
                                    showcheck: true,
                                    ChildNodes: []
                                };
                                for (var j = 0, jl = mapField[databaseLinkId + mainTable].length; j < jl; j++) {
                                    var fieldItem = mapField[databaseLinkId + mainTable][j];
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

                                $('#table_list').lrtreeSet('refresh');

                                $('#queryDatetime').lrselectRefresh({
                                    data: mapField[databaseLinkId + mainTable]
                                });
                            });
                        }                        
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
                        postData.dbTable = mainTable;
                        postData.dbTablePk = mainPk;

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
                            tablist: _tablist
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

                        learun.httpAsyncPost(top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/LookCustmerProcCode', postData, function (res) {
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
                    if (item.hasChildren) {
                        databaseLinkId = '';
                        $('#dbtablegird').jfGridSet('refreshdata', { rowdatas: [] });
                    }
                    else if (dbId != item.id) {
                        databaseLinkId = item.id;
                        page.dbTableSearch();
                    }
                }
            });
            // 查询按钮
            $('#btn_Search').on('click', function () {
                var keyword = $('#txt_Keyword').val();
                page.dbTableSearch({ tableName: keyword });
            });

            $('#dbtablegird').jfGrid({
                url: top.$.rootUrl + '/LR_SystemModule/DatabaseTable/GetList',
                headData: [
                    { label: "表名", name: "name", width: 300, align: "left" },
                    {
                        label: "记录数", name: "sumrows", width: 100, align: "center",
                        formatter: function (cellvalue) {
                            return cellvalue + "条";
                        }
                    },
                    { label: "使用大小", name: "reserved", width: 100, align: "center" },
                    { label: "索引使用大小", name: "index_size", width: 120, align: "center" },
                    { label: "说明", name: "tdescription", width: 350, align: "left" }
                ],
                mainId: 'name',
                isSubGrid: true,             // 是否有子表
                subGridRowExpanded: function (subid, rowdata) {
                    $('#' + subid).jfGrid({
                        url: top.$.rootUrl + '/LR_SystemModule/DatabaseTable/GetFieldList',
                        headData: [
                            { label: "列名", name: "f_column", width: 300, align: "left" },
                            { label: "数据类型", name: "f_datatype", width: 120, align: "center" },
                            { label: "长度", name: "f_length", width: 57, align: "center" },
                            {
                                label: "允许空", name: "f_isnullable", width: 50, align: "center",
                                formatter: function (cellvalue) {
                                    return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
                                }
                            },
                            {
                                label: "标识", name: "f_identity", width: 58, align: "center",
                                formatter: function (cellvalue) {
                                    return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
                                }
                            },
                            {
                                label: "主键", name: "f_key", width: 50, align: "center",
                                formatter: function (cellvalue) {
                                    return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
                                }
                            },
                            { label: "默认值", name: "f_default", width: 120, align: "center" },
                            { label: "说明", name: "f_remark", width: 200, align: "left" }
                        ]
                    });
                    $('#' + subid).jfGridSet('reload', { param: { databaseLinkId: databaseLinkId, tableName: rowdata.name } });
                }// 子表展开后调用函数
            });


            // 表单设置
            $('#tab_list').lrtree({
                data: tabList,
                nodeClick: function (item) {
                   
                    if (item.value != 'no') {
                        tabItem = item;
                        componts = item.componts;
                        $('#form_gridtable').jfGridSet('refreshdata', { rowdatas: componts });
                        if (mapField[databaseLinkId + mainTable]) {
                            var compontMap = {};
                            for (var i = 0, l = componts.length; i < l; i++) {
                                compontMap[componts[i].id] = "1";
                            }
                            tableFieldTree.length = 0;
                            var tableNode = {
                                id: mainTable,
                                text: mainTable,
                                value: mainTable,
                                hasChildren: true,
                                isexpand: true,
                                complete: true,
                                ChildNodes: []
                            };
                            for (var j = 0, jl = mapField[databaseLinkId + mainTable].length; j < jl; j++) {
                                var fieldItem = mapField[databaseLinkId + mainTable][j];
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
                            $('#table_list').lrtreeSet('refresh');
                        }
                    }
                }
            });
            $('#table_list').lrtree({
                data: tableFieldTree,
                nodeCheck: function (itemNode) {
                    if (itemNode.checkstate == 1) {
                        if (itemNode.hasChildren) {
                            var compontsMap = {};
                            $.each(componts, function (_index, item) {
                                compontsMap[item.tableName + item.fieldId] = "1";
                            });

                            $.each(itemNode.ChildNodes, function (_index, _item) {
                                if (compontsMap[itemNode.value + _item.value] != '1') {
                                    var _data = {
                                        dataItemCode: "",
                                        dataSource: "0",
                                        dataSourceId: "",
                                        fieldId: _item.value,
                                        fieldName: _item.title,
                                        id: _item.id,
                                        proportion: "1",
                                        sort: componts.length,
                                        tableName: itemNode.value,
                                        type: "text",
                                        validator: "",
                                    };
                                    componts.push(_data);
                                }
                            });

                            tabItem.componts = componts.sort(function (a, b) {
                                return parseInt(a.sort) - parseInt(b.sort);
                            });
                        }
                        else {
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
                            tabItem.componts = componts.sort(function (a, b) {
                                return parseInt(a.sort) - parseInt(b.sort);
                            });
                        }
                    }
                    else {
                        if (itemNode.hasChildren) {
                            var map = {};
                            $.each(itemNode.ChildNodes, function (_index, _item) {
                                map[itemNode.value + _item.value] = '1';
                            });
                            var _componts = [];
                            $.each(componts, function (id, item) {
                                if (map[item.tableName + item.fieldId] != '1') {
                                    _componts.push(item);
                                }
                            });
                            tabItem.componts = _componts;

                        }
                        else {
                            $.each(componts, function (id, item) {
                                if (item.id == itemNode.id) {
                                    componts.splice(id, 1);
                                    return false;
                                }
                            });
                        }
                    }
                    componts = tabItem.componts;
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
                        colData = colData.sort(function (a, b) {
                            return parseInt(a.sort) - parseInt(b.sort);
                        });
                    }
                    else {
                        for (var i = 0, l = colData.length; i < l; i++) {
                            if (colData[i].compontId == itemNode.compont.id) {
                                colData.splice(i, 1);
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
            $.lrSaveForm(top.$.rootUrl + '/LR_CodeGeneratorModule/TemplatePC/CreateCustmerProcCode', postData, function (res) { }, true);
        }
    };

    page.init();
}