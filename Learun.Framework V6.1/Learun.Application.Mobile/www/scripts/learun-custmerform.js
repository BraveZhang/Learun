/*
 * 版 本 Learun-Mobile V1.0.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.12.15
 * 描 述：力软移动端框架 自定义表单处理方法
 */
(function ($, learun, window) {
    // 加载自定义表单模板
    learun.custmerform = {
        loadScheme: function (formIds, callback) {// formIds表单主键集合,callback回调函数
            var req = [];
            var scheme = {};
            $.each(formIds, function (_index, _item) {
                var formId = 'lrform' + _item;
                var formScheme = learun.storage.get(formId);// 从缓存中获取表单模板数据
                if (!formScheme) {
                    req.push({ id: _item, ver: "" });
                }
                else {
                    scheme[_item] = formScheme.content;
                    req.push({ id: _item, ver: formScheme.ver });
                }
            });
            // 加载自定义表单模板
            learun.httpget(config.webapi + "learun/adms/form/scheme", req, (res) => {
                if (res.code === 200) {
                    $.each(res.data, function (_index, _item) {
                        scheme[_index] = _item.F_Scheme;
                        var formScheme = { ver: learun.date.format(_item.F_CreateDate, 'yyyyMMddhhmmss'), content: _item.F_Scheme };
                        learun.storage.set('lrform' + _index,formScheme);
                    });
                    callback(scheme);
                }
                else {
                    callback([]);
                }
            });
        }
    };

    // 自定义表单初始化
    $.fn.custmerform = function (data, type, formScheme) {// type表单数据 0发起流程 1 审核流程
        var $this = $(this);
        if (!formScheme) {
            var formids = [];
            // 判断下是否有系统表单（暂时不支持系统表单）
            for (var i = 0, l = data.length; i < l; i++) {
                var formItem = data[i];
                if (formItem.formId == "") {// 如果是系统表单就返回错误（目前暂时不支持）
                    return false;
                }
                formids.push(formItem.formId);
            }
            learun.custmerform.loadScheme(formids, function (formSchemes) {
                custmerformsRender($this, type, formSchemes);
            });
        }
        else {
            custmerformsRender($this, type, formScheme);
        }
        return true;
    }
    // 获取自定义表单数据
    $.fn.custmerformGet = function () {
        var res = {};
        var validateflag = true;
        $(this).find('.lrcomponts').each(function () {
            var $this = $(this);
            var schemeInfoId = $this.attr('data-id');
            var _componts = $this[0].componts;
            res[schemeInfoId] = res[schemeInfoId] || {};
            // 遍历自定义表单控件
            $.each(_componts, function (_index, _item) {
                var _fn = componts[_item.type].get;
                if (!!_fn) {
                    var value = _fn(_item);
                    if (!!_item.verify && _item.verify != "") {
                        var checkfn = window.fui.validator['is' + _item.verify];
                        var r = checkfn(value);
                        if (!r.code) {
                            validateflag = false;
                            window.fui.dialog({ msg: r.msg });
                            return false;
                        }
                    }
                    res[schemeInfoId][_item.id] = value;
                }
            });
            $this = null;
            if (!validateflag) {
                return false;
            }
        });
        if (!validateflag) {
            return null;
        }
        return res;
    }
    // 设置自定义表单数据
    $.fn.custmerformSet = function (data) {
        var $this = $(this);
        function set($this, data) {
            if ($this.find('.lrcomponts').length > 0) {
                $this.find('.lrcomponts').each(function () {
                    var $this = $(this);
                    var schemeInfoId = $this.attr('data-id');
                    var _componts = $this[0].componts;
                    var _data = {};
                    $.each(data[schemeInfoId], function (_index, _item) {
                        $.each(_item[0], function (_id, _jitem) {
                            _data[_index.toLowerCase() + _id] = _jitem;
                        });
                    });
                    // 遍历自定义表单控件
                    $.each(_componts, function (_index, _item) {
                        var _fn = componts[_item.type].set;
                        if (!!_fn) {
                            if (_item.table && _item.field) {
                                _fn(_item, _data[(_item.table + _item.field).toLowerCase()]);
                            }
                        }
                    });
                    $this = null;
                });
            }
            else {
                setTimeout(function () {
                    set($this, data);
                }, 100);
            }
        }
        set($this, data);
    }

    
    function getFontHtml(verify) {
        var res = "";
        switch (verify) {
            case "NotNull":
            case "Num":
            case "Email":
            case "EnglishStr":
            case "Phone":
            case "Fax":
            case "Mobile":
            case "MobileOrPhone":
            case "Uri":
                res = '<font face="宋体">*</font>';
                break;
        }
        return res;
    }

    // 渲染表单
    function custmerformsRender($this, type, formSchemes) {
        $this.scroll();
        var $container = $this.find('.f-scroll');
        $.each(formSchemes, function (_index, _item) {
            var formScheme = JSON.parse(_item);
            custmerformRender($container, formScheme.data, _index);
        });
        if (type == 0) {
            // 加载备注输入框
            $container.append('\
                    <div class="lr-form-container" >\
                        <div class="lr-form-row lr-form-row-title"  >\
                            <label style="width:200px" >流程自定义信息</label>\
                        </div>\
                        <div class="lr-form-row">\
                            <label>流程标题</label>\
                            <input id="lrflowworktitle"   type="text" >\
                        </div>\
                        <div class="lr-form-row">\
                            <label>重要等级</label>\
                            <div id="lrflowworklevel"></div>\
                        </div>\
                        <div class="lr-form-row lr-form-row-multi">\
                            <label>备注</label>\
                            <div id="lrflowworkdes"  class="lrtextarea"  contenteditable="true" ></div>\
                        </div>\
                    </div>');
            var d = $('#lrflowworklevel').lrpicker({
                data: [
                    { 'text': '普通', 'value': '0' },
                    { 'text': '重要', 'value': '1' },
                    { 'text': '紧急', 'value': '2' }
                ]
            }).lrpickerSet('0');
        }
        else if (type == 1) {
            // 加载备注输入框
            $container.append('\
                    <div class="lr-form-container" >\
                        <div class="lr-form-row lr-form-row-title"  >\
                            <label style="width:200px" >流程审核信息</label>\
                        </div>\
                        <div class="lr-form-row">\
                            <label>审核结果</label>\
                            <div id="lrflowworkverify"></div>\
                        </div>\
                        <div class="lr-form-row lr-form-row-multi">\
                            <label>备注</label>\
                            <div id="lrflowworkdes"  class="lrtextarea"  contenteditable="true" ></div>\
                        </div>\
                    </div>');
            var d = $('#lrflowworkverify').lrpicker({
                data: [
                    { 'text': '同意', 'value': '1' },
                    { 'text': '不同意', 'value': '2' }
                ]
            });
        }
    }


    // 渲染自定义表单
    function custmerformRender($container, scheme, schemeInfoId) {
        var loaddataComponts = [];
        $.each(scheme, function (_index, _item) {
            var $list = $('<div class="lr-form-container lrcomponts" data-id="' + schemeInfoId + '" ></div>');
            $list[0].componts = _item.componts;
            $.each(_item.componts, function (_jindex, _jitem) {
                var $row = $('<div class="lr-form-row"><label>' + _jitem.title + '</label></div>');
                if (componts[_jitem.type].render($row, _jitem)) {
                    $list.append($row);
                    $row.prepend(getFontHtml(_jitem.verify));
                }
            });
            $container.append($list);
        });
    }

    var componts = {
        label: {
            render: function ($row, compont) {
                $row.addClass('lr-form-row-title');
                return true;
            }
        },
        html: {
            render: function ($row, compont) {// 移动端暂时不支持
                return false;
            }
        },
        text: {
            render: function ($row, compont) {
                var $compont = $('<input id="' + compont.id + '" type="text" />');
                $compont.val(compont.dfvalue);
                $row.append($compont);
                $compont = null;
                return true;
            },
            get: function (compont) {
                return $('#' + compont.id).val();
            },
            set: function (compont, value) {
                $('#' + compont.id).val(value);
            }
        },
        textarea: {
            render: function ($row, compont) {
                $row.addClass('lr-form-row-multi');
                var $compont = $('<div id="' + compont.id + '"  class="lrtextarea"  contenteditable="true" ></div>');
                $compont.text(compont.dfvalue);
                $row.append($compont);
                $compont = null;
                return true;
            },
            get: function (compont) {
                return $('#' + compont.id).text();
            },
            set: function (compont, value) {
                if (!!value) {
                    $('#' + compont.id).text(value);
                }
            }
        },
        texteditor: {
            render: function ($row, compont) {// 移动端富文本和普通多行文本一致
                $row.addClass('lr-form-row-multi');
                var $compont = $('<div id="' + compont.id + '"  class="lrtextarea"  contenteditable="true" ></div>');
                $compont.text(compont.dfvalue);
                $row.append($compont);
                $compont = null;
                return true;
            },
            get: function (compont) {
                return $('#' + compont.id).text();
            },
            set: function (compont, value) {
                if (!!value) {
                    $('#' + compont.id).text(value);
                }
            }
        },
        radio: {
            render: function ($row, compont) {// 单选改用和下拉一致
                var $compont = $('<div id="' + compont.id + '" ></div>');
                $row.append($compont);
                $compont = null;
                // 获取数据
                if (compont.dataSource == '0') {
                    learun.clientdata.getAll('dataItem', {
                        code: compont.itemCode,
                        callback: function (data) {
                            var list = [];
                            $.each(data, function (_index, _item) {
                                list.push({ id: _item.value, text: _item.text });
                            });
                            $('#' + compont.id).lrpicker({
                                data: list,
                                ivalue: 'id',
                                itext: 'text'
                            });
                        }
                    });
                }
                else {
                    var vlist = compont.dataSourceId.split(',');

                    learun.clientdata.getAll('sourceData', {
                        code: vlist[0],
                        callback: function (data) {
                            $('#' + compont.id).lrpicker({
                                data: data,
                                ivalue: vlist[2],
                                itext: vlist[1]
                            });
                        }
                    });
                }
                return true;
            },
            get: function (compont) {
                return $('#' + compont.id).lrpickerGet();
            },
            set: function (compont, value) {
                $('#' + compont.id).lrpickerSet(value);
            }
        },
        checkbox: {
            render: function ($row, compont) {
                $row.addClass('lr-form-row-title');
                $row.attr('id', compont.id);
                if (compont.dataSource == '0') {
                    learun.clientdata.getAll('dataItem', {
                        code: compont.itemCode,
                        callback: function (data) {
                            var _$row = $('#' + compont.id);
                            $.each(data, function (_index, _item) {
                                var _$div = $('<div class="lr-form-row" data-name="' + compont.id + '" data-value="' + _item.value + '" ><label>' + _item.text + '</label><div class="checkbox" ></div></div>');;
                                _$row.after(_$div);
                                _$div.find('.checkbox').lrswitch();
                                _$div = null;
                            });
                            _$row = null;
                        }
                    });
                }
                else {
                    var vlist = compont.dataSourceId.split(',');
                    learun.clientdata.getAll('sourceData', {
                        code: vlist[0],
                        callback: function (data) {
                            var _$row = $('#' + compont.id);
                            $.each(data, function (_index, _item) {
                                var _$div = $('<div class="lr-form-row" data-name="' + compont.id + '" data-value="' + _item[vlist[2]] + '" ><label>' + _item[vlist[1]] + '</label><div class="checkbox" ></div></div>');;
                                _$row.after(_$div);
                                _$div.find('.checkbox').lrswitch();
                                _$div = null;
                            });
                            _$row = null;
                        }
                    });
                }
                return true;
            },
            get: function (compont) {
                var values = [];
                $('[data-name=' + compont.id + '"]').each(function () {
                    if ($(this).lrswitchGet() == 1) {
                        var v = $(this).attr('data-value');
                        values.push(v);
                    }
                });
                return String(values);
            },
            set: function (compont, value) {
                var values = value.split(',');
                $.each(values, function (_index, _item) {
                    $('[data-name=' + compont.id + '"][data-value="' + _item + '"]').lrswitchSet(1);
                });
            }
        },
        select: {
            render: function ($row, compont) {//
                var $compont = $('<div id="' + compont.id + '" ></div>');
                $row.append($compont);
                $compont = null;
                // 获取数据
                if (compont.dataSource == '0') {
                    learun.clientdata.getAll('dataItem', {
                        code: compont.itemCode,
                        callback: function (data) {
                            var list = [];
                            $.each(data, function (_index, _item) {
                                list.push({ id: _item.value, text: _item.text });
                            });
                            $('#' + compont.id).lrpicker({
                                data: list,
                                ivalue: 'id',
                                itext: 'text'
                            });
                        }
                    });
                }
                else {
                    var vlist = compont.dataSourceId.split(',');
                    learun.clientdata.getAll('sourceData', {
                        code: vlist[0],
                        callback: function (data) {
                            $('#' + compont.id).lrpicker({
                                data: data,
                                ivalue: vlist[2],
                                itext: vlist[1]
                            });
                        }
                    });
                }
                return true;
            },
            get: function (compont) {
                return $('#' + compont.id).lrpickerGet();
            },
            set: function (compont, value) {
                $('#' + compont.id).lrpickerSet(value);
            }
        },
        datetime: {
            render: function ($row, compont) {//
                var $compont = $('<div id="' + compont.id + '" ></div>');
                $row.append($compont);
                if (compont.dateformat == '0') {
                    $compont.lrdate({
                        type: 'date',
                    });
                }
                else {
                    $compont.lrdate();
                }
                $compont = null;
                return true;
            },
            get: function (compont) {
                return $('#' + compont.id).lrdateGet();
            },
            set: function (compont, value) {
                if (compont.dateformat == '0') {
                    value = learun.date.format(value,'yyyy-MM-dd');
                }
                else {
                    value = learun.date.format(value, 'yyyy-MM-dd hh:mm');
                }

                $('#' + compont.id).lrdateSet(value);
            }
        },
        datetimerange: {
            render: function ($row, compont) {//
                var $compont = $('<input id="' + compont.id + '" type="text" />');
                function register() {
                    if ($('#' + compont.startTime).length > 0 && $('#' + compont.endTime).length > 0) {
                        $('#' + compont.startTime).on('change', function () {
                            var st = $(this).lrdateGet();
                            var et = $('#' + compont.endTime).lrdateGet();
                            if (!!st && !!et) {
                                var diff = learun.date.parse(st).DateDiff('d', et) + 1;
                                $('#' + compont.id).val(diff);
                            }
                        });
                        $('#' + compont.endTime).on('change', function () {
                            var st = $('#' + compont.startTime).lrdateGet();
                            var et = $(this).lrdateGet();
                            if (!!st && !!et) {
                                var diff = learun.date.parse(st).DateDiff('d', et) + 1;
                                $('#' + compont.id).val(diff);
                            }
                        });
                    }
                    else {
                        setTimeout(function () {
                            register();
                        }, 50);
                    }
                }
                if (!!compont.startTime && compont.endTime) {
                    register();
                }
                $row.append($compont);
                $compont = null;
                return true;
            },
            get: function (compont) {
                return $('#' + compont.id).val();
            },
            set: function (compont, value) {
                $('#' + compont.id).val(value);
            }
        },
        encode: {
            render: function ($row, compont) {
                var $compont = $('<input id="' + compont.id + '" type="text" readonly  />');
                compont.isInit = false;
                learun.getRuleCode(compont.rulecode, function (data) {
                    if (!compont.isInit) {
                        compont.isInit = true;
                        $('#' + compont.id).val(data);
                    }
                });
                $row.append($compont);
                $compont = null;
                return true;
            },
            get: function (compont) {
                return $('#' + compont.id).val();
            },
            set: function (compont, value) {
                compont.isInit = true;
                $('#' + compont.id).val(value);
            }
        },
        organize: {
            render: function ($row, compont) {
                return false;

                var $compont = $('<div id="' + compont.id + '" ></div>');
                $row.append($compont);
                $compont = null;
                switch (compont.dataType) {
                    case "user"://用户
                        if (compont.relation != "") {
                            $compont.lrselect({
                                value: 'F_UserId',
                                text: 'F_RealName',
                                title: 'F_RealName',
                                // 展开最大高度
                                maxHeight: compont.height,
                                // 是否允许搜索
                                allowSearch: true
                            });
                            function register() {
                                if ($('#' + compont.relation).length > 0) {
                                    $('#' + compont.relation).on('change', function () {
                                        var value = $(this).lrselectGet();
                                        if (value == "") {
                                            $compont.lrselectRefresh({
                                                url: '',
                                                data: []
                                            });
                                        }
                                        else {
                                            $compont.lrselectRefresh({
                                                url: top.$.rootUrl + '/LR_OrganizationModule/User/GetList',
                                                param: { departmentId: value }
                                            });
                                        }
                                    });
                                }
                                else {
                                    setTimeout(function () { register(); }, 100);
                                }
                            }
                            register();
                        }
                        else {
                            $compont.lrformselect({
                                layerUrl: top.$.rootUrl + '/LR_OrganizationModule/User/SelectOnlyForm',
                                layerUrlW: 400,
                                layerUrlH: 300,
                                dataUrl: top.$.rootUrl + '/LR_OrganizationModule/User/GetListByUserIds'
                            });
                        }
                        break;
                    case "department"://部门
                        $compont.lrselect({
                            type: 'tree',
                            // 展开最大高度
                            maxHeight: compont.height,
                            // 是否允许搜索
                            allowSearch: true
                        });
                        if (compont.relation != "") {
                            function register() {
                                if ($('#' + compont.relation).length > 0) {
                                    $('#' + compont.relation).on('change', function () {
                                        var value = $(this).lrselectGet();
                                        $compont.lrselectRefresh({
                                            url: top.$.rootUrl + '/LR_OrganizationModule/Department/GetTree',
                                            param: { companyId: value }
                                        });
                                    });
                                }
                                else {
                                    setTimeout(function () { register(); }, 100);
                                }
                            }
                            register();
                        }
                        else {
                            $compont.lrselectRefresh({
                                url: top.$.rootUrl + '/LR_OrganizationModule/Department/GetTree',
                                param: {}
                            });
                        }
                        break;
                    case "company"://公司
                        $compont.lrCompanySelect({ maxHeight: compont.height });
                        break;
                }
                return true;
            }
        },
        currentInfo: {
            render: function ($row, compont) {
                var $compont = $('<input id="' + compont.id + '" readonly type="text"  />');
                var userinfo = learun.storage.get('userinfo');

                switch (compont.dataType) {
                    case 'company':
                        compont.value = userinfo.baseinfo.companyId;
                        learun.clientdata.get('company', {
                            key: compont.value,
                            callback: function (item) {
                                $compont.val(item.name);
                            }
                        });
                        break;
                    case 'department':
                        compont.value = userinfo.baseinfo.departmentId;
                        learun.clientdata.get('department', {
                            key: compont.value,
                            callback: function (item) {
                                $compont.val(item.name);
                            }
                        });
                        break;
                    case 'user':
                        $compont.val(userinfo.baseinfo.realName);
                        compont.value = userinfo.baseinfo.userId;
                        break;
                    case 'time':
                        compont.value = learun.date.format(new Date(), 'yyyy-MM-dd hh:mm:ss');
                        $compont.val(compont.value);
                        break;
                    case 'guid':
                        compont.value = learun.guid();
                        $compont.val(compont.value);
                        break;
                }
                if (compont.isHide == '1') {
                    return false;
                }
                else {
                    $row.append($compont);
                    $compont = null;
                }
                return true;
            },
            get: function (compont) {
                return compont.value;
            },
            set: function (compont, value) {
                if (!!value) {
                    var organization = learun.storage.get('organization');

                    switch (compont.dataType) {
                        case 'company':
                            compont.value = value;
                            if (compont.isHide != '1') {
                                learun.clientdata.get('company', {
                                    key: compont.value,
                                    callback: function (item) {
                                        $('#' + compont.id).val(item.name);
                                    }
                                });
                            }
                            break;
                        case 'department':
                            compont.value = value;
                            if (compont.isHide != '1') {
                                learun.clientdata.get('department', {
                                    key: compont.value,
                                    callback: function (item) {
                                        $('#' + compont.id).val(item.name);
                                    }
                                });
                            }
                            break;
                        case 'user':
                            compont.value = value;
                            if (compont.isHide != '1') {
                                if (value == "System") {
                                    $('#' + compont.id).val('超级管理员');
                                }
                                else {
                                    learun.clientdata.get('user', {
                                        key: compont.value,
                                        callback: function (item) {
                                            $('#' + compont.id).val(item.name);
                                        }
                                    });
                                }
                            }
                            break;
                        case 'time':
                            compont.value = value;
                            if (compont.isHide != '1') {
                                $('#' + compont.id).val(value);
                            }
                            break;
                        case 'guid':
                            compont.value = value;
                            if (compont.isHide != '1') {
                                $('#' + compont.id).val(value);
                            }
                            break;
                    }
                }
            }
        },
        guid: {
            render: function ($row, compont) {
                compont.value = learun.guid();
                $row.remove();
                return false;
            },
            get: function (compont) {
                return compont.value;
            },
            set: function (compont, value) {
                compont.value = value;
            }
        },
        upload: {
            render: function () {
                return false;
            }
        },
        girdtable: {
            render: function () {
                return false;
            }
        }
    }

    

})(window.jQuery, window.lrmui, window);

