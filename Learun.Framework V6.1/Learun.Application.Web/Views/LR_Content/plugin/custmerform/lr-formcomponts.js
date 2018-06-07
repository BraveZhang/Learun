/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力 软-前端开 发组
 * 日 期：2017.03.22
 * 描 述：自定义表单组件
 */
(function ($, learun) {
    "use strict";

    var ruleCode;

    Date.prototype.DateAdd = function (strInterval, Number) {
        var dtTmp = this;
        switch (strInterval) {
            case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));// 秒
            case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));// 分
            case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));// 小时
            case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));// 天
            case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));// 星期
            case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());// 季度
            case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());// 月
            case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());// 年
        }
    }
    Date.prototype.DateDiff = function (strInterval, dtEnd) {
        var dtStart = this;
        if (typeof dtEnd == 'string')//如果是字符串转换为日期型  
        {
            dtEnd = learun.parseDate(dtEnd);
        }
        switch (strInterval) {
            case 's': return parseInt((dtEnd - dtStart) / 1000);
            case 'n': return parseInt((dtEnd - dtStart) / 60000);
            case 'h': return parseInt((dtEnd - dtStart) / 3600000);
            case 'd': return parseInt((dtEnd - dtStart) / 86400000);
            case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7));
            case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
            case 'y': return dtEnd.getFullYear() - dtStart.getFullYear();
        }
    }

    $.lrFormComponents = {
        label: {//文本标题
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="label" ><i  class="fa fa-font"></i>标 题</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '标 题',
                    type: "label",
                    proportion: '1',
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: "标 题" }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;

                var $html = $(".lr-custmerform-designer-layout-right .mCSB_container");
                var _html = '';
                _html += '<div class="lr-component-title">组件标题</div>';
                _html += '<div class="lr-component-control"><input id="lr_component_title" type="text" class="form-control" placeholder="必填项"/></div>';
                _html += '<div class="lr-component-control"><div id="lr_component_verify"></div></div>';
                _html += '<div class="lr-component-title">所占行比例</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_proportion"></div></div>';
                $html.html(_html);

                // 标题设置
                $html.find('#lr_component_title').val(dfop.title);
                $html.find('#lr_component_title').keyup(function (e) {
                    var value = $(this).val();
                    dfop.title = value;
                    $component.find('.lr-compont-title span').text(value);
                });
                // 所在行占比
                $('#lr_component_proportion').lrselect({
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
                            id: '5', text: '1/5'
                        },
                        {
                            id: '6', text: '1/6'
                        }
                    ],
                    placeholder: false,
                    value: 'id',
                    text: 'text',
                    select: function (item) {
                        if (!!item) {
                            dfop.proportion = item.id;
                        }
                        else {
                            dfop.proportion = '1';
                        }
                        $component.css({ 'width': 100 / parseInt(dfop.proportion) + '%' });
                    }
                });
                $('#lr_component_proportion').lrselectSet(dfop.proportion);
            },
            renderTable: function (compont, $row) {
                $row.find('.lr-form-item-title').remove();
                $row.append("<span>" + compont.title + "<span>");
                $row.css({ 'padding': '0', 'line-height': '38px', 'text-align': 'center', 'font-size': '20px', 'font-weight': 'bold', 'color': '#333' });
            }
        },
        html: {//文本标题
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="html" ><i  class="fa fa-file-o"></i>富文本</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '',
                    type: "html",
                    proportion: '1',
                };
                $component.html(getComponentRowHtml({ name: "富文本" , text: "富文本" }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;

                var $html = $(".lr-custmerform-designer-layout-right .mCSB_container");
                var _html = '';
                _html += '<div class="lr-component-title">文本内容</div>';
                _html += '<div class="lr-component-control"><textarea id="lr_component_title" type="text" style="height:300px;" class="form-control" placeholder="必填项"/></div>';
                _html += '<div class="lr-component-control"><div id="lr_component_verify"></div></div>';
                _html += '<div class="lr-component-title">所占行比例</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_proportion"></div></div>';
                $html.html(_html);

                // 标题设置
                $html.find('#lr_component_title').val(htmlDecode(dfop.title));
                $html.find('#lr_component_title').keyup(function (e) {
                    var value = $(this).val();
                    dfop.title = htmlEncode(value);
                });
                // 所在行占比
                $('#lr_component_proportion').lrselect({
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
                            id: '5', text: '1/5'
                        },
                        {
                            id: '6', text: '1/6'
                        }
                    ],
                    placeholder: false,
                    value: 'id',
                    text: 'text',
                    select: function (item) {
                        if (!!item) {
                            dfop.proportion = item.id;
                        }
                        else {
                            dfop.proportion = '1';
                        }
                        $component.css({ 'width': 100 / parseInt(dfop.proportion) + '%' });
                    }
                });
                $('#lr_component_proportion').lrselectSet(dfop.proportion);
            },
            renderTable: function (compont, $row) {
                $row.find('.lr-form-item-title').remove();
                $row.html(htmlDecode(compont.title));
            }
        },
        text: {//文本框
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="text" ><i  class="fa fa-italic"></i>文本框</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '文本框',
                    type: "text",
                    table: '',
                    field: "",
                    proportion: '1',
                    verify: '',

                    isHide: '0',  // 是否隐藏
                    dfvalue: '' // 默认值
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: "文本框" }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component, verifyDatalist);
                var _html = '';
                _html += '<div class="lr-component-title">是否隐藏</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_isHide"></div></div>';
                _html += '<div class="lr-component-title">默认值<i title="仅在添加数据时默认填入" class="help fa fa-question-circle"></i></div>';
                _html += '<div class="lr-component-control"><input id="lr_component_dfvalue" type="text" class="form-control" placeholder="无则不填"/></div>';

                $html.append(_html);
                $('#lr_component_isHide').lrselect({
                    placeholder: false,
                    data: [{ id: '0', text: '否' }, { id: '1', text: '是' }],
                    value: 'id',
                    text: 'text',
                    select: function (item) {
                        if (!!item) {
                            dfop.isHide = item.id;
                        }
                        else {
                            dfop.isHide = '0';
                        }
                    }
                });
                $('#lr_component_isHide').lrselectSet(dfop.isHide);

                $html.find('#lr_component_dfvalue').val(dfop.dfvalue);
                $html.find('#lr_component_dfvalue').keyup(function (e) {
                    var value = $(this).val();
                    dfop.dfvalue = value;
                });
            },
            renderTable: function (compont, $row) {
                

                var $compont = $('<input id="' + compont.id + '" type="text" class="form-control" />');
                $compont.val(compont.dfvalue);
                $row.append($compont);
                return $compont;
            },
            renderQuery: function (compont, $row) {
                var $compont = $('<input id="' + compont.id + '" type="text" class="form-control" />');
                $row.append($compont);
                return $compont;
            }
        },
        textarea: {//文本区
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="textarea" ><i class="fa fa-align-justify"></i>文本区</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '文本区',
                    type: "textarea",
                    table: '',
                    field: "",
                    proportion: '1',
                    verify: '',

                    height: '100',
                    dfvalue: '' // 默认值
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: "文本区" }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component, verifyDatalist2);
                var _html = '';
                _html += '<div class="lr-component-title">区域高度</div>';
                _html += '<div class="lr-component-control"><input id="lr_component_height" type="text" class="form-control" /></div>';
                _html += '<div class="lr-component-title">默认值<i title="仅在添加数据时默认填入" class="help fa fa-question-circle"></i></div>';
                _html += '<div class="lr-component-control"><input id="lr_component_dfvalue" type="text" class="form-control" placeholder="无则不填"/></div>';

                $html.append(_html);

                $html.find('#lr_component_height').val(dfop.height);
                $html.find('#lr_component_height').keyup(function (e) {
                    var value = $(this).val();
                    dfop.height = value;
                });

                $html.find('#lr_component_dfvalue').val(dfop.dfvalue);
                $html.find('#lr_component_dfvalue').keyup(function (e) {
                    var value = $(this).val();
                    dfop.dfvalue = value;
                });
            },
            renderTable: function (compont, $row) {//使用表单的时候渲染成table
                var $compont = $('<textarea id="' + compont.id + '"  class="form-control" ' + 'style="height: ' + compont.height + 'px;" />');
                $compont.val(compont.dfvalue);

                $row.append($compont);
                return $compont;
            },
            renderQuery: function (compont, $row) {
                var $compont = $('<input id="' + compont.id + '" type="text" class="form-control" />');
                $row.append($compont);
                return $compont;
            }
        },
        texteditor: {//编辑器
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="texteditor" ><i class="fa fa-edit"></i>编辑器</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '编辑器',
                    type: "texteditor",
                    table: '',
                    field: "",
                    proportion: '1',
                    verify: '',

                    height: '200',
                    dfvalue: '' // 默认值
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: "编辑器" }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component, verifyDatalist2);
                var _html = '';
                _html += '<div class="lr-component-title">区域高度</div>';
                _html += '<div class="lr-component-control"><input id="lr_component_height" type="text" class="form-control" /></div>';
                _html += '<div class="lr-component-title">默认值<i title="仅在添加数据时默认填入" class="help fa fa-question-circle"></i></div>';
                _html += '<div class="lr-component-control"><input id="lr_component_dfvalue" type="text" class="form-control" placeholder="无则不填"/></div>';

                $html.append(_html);

                $html.find('#lr_component_height').val(dfop.height);
                $html.find('#lr_component_height').keyup(function (e) {
                    var value = $(this).val();
                    dfop.height = value;
                });

                $html.find('#lr_component_dfvalue').val(dfop.dfvalue);
                $html.find('#lr_component_dfvalue').keyup(function (e) {
                    var value = $(this).val();
                    dfop.dfvalue = value;
                });
            },
            renderTable: function (compont, $row) {//使用表单的时候渲染成table
                var $compont = $('<div id="' + compont.id + '" type="text/plain" style="height: ' + compont.height + 'px;"></div>');
                $row.append($compont);
                UE.getEditor(compont.id);
                return $compont;
            },
            renderQuery: function (compont, $row) {
                var $compont = $('<input id="' + compont.id + '" type="text" class="form-control" />');
                $row.append($compont);
                return $compont;
            },

            setValue: function ($td, data) {//设置数据
                $td[0].simditor.setValue(data.value);
            }
        },
        radio: {//单选框
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="radio" ><i class="fa fa-circle-thin"></i>单选框</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '单选项',
                    type: "radio",
                    table: '',
                    field: "",
                    proportion: '1',

                    dataSource: '0',  // 0数据字典1数据源
                    dataSourceId: '',
                    itemCode: '',
                    dfvalue: ''       // 默认值
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: "单选项" }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component);
                var _html = '';
                _html += '<div class="lr-component-title">数据来源</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dataSource"></div></div>';
                _html += '<div class="lr-component-title">数据选项</div>';
                _html += '<div class="lr-component-control" id="lr_component_dataItemCode1"><div id="lr_component_dataItemCode"></div></div>';
                _html += '<div class="lr-component-control" id="lr_component_dataSourceId1" style="display:none;" ><div id="lr_component_dataSourceId">dasd</div></div>';
                _html += '<div class="lr-component-title">默认值<i title="仅在添加数据时默认填入" class="help fa fa-question-circle"></i></div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dfvalue"></div></div>';

                $html.append(_html);
                setDatasource(dfop);
            },
            renderTable: function (compont, $row) {//使用表单的时候渲染成table
                var $compont = $('<div class="radio"></div>');
                /*获取数据字典或者数据源数据*/
                if (compont.dataSource == '0') {
                    learun.clientdata.getAllAsync('dataItem', {
                        code: compont.itemCode,
                        callback: function (dataes) {
                            $.each(dataes, function (id, item) {
                                console.log(compont.dfvalue, item.value);
                                var $point = $('<label><input name="' + compont.id + '" value="' + item.value + '"' + (compont.dfvalue == item.value ? "checked" : "") + ' type="radio">' + item.text + '</label>');
                                $compont.append($point);
                            });
                        }
                    });
                }
                else {
                    var vlist = compont.dataSourceId.split(',');
                    learun.clientdata.getAllAsync('sourceData', {
                        code: vlist[0],
                        callback: function (data) {
                            $.each(data, function (id, item) {
                                var $point = $('<label><input name="' + compont.id + '" value="' + item[vlist[2]] + '"' + (compont.dfvalue == item[vlist[2]] ? "checked" : "") + ' type="radio">' + item[vlist[1]] + '</label>');
                                $compont.append($point);
                            });
                        }
                    });
                }
                $row.append($compont);
                return $compont;
            },
            renderQuery: function (compont, $row) {
                var $compont = $('<div class="radio"></div>');
                /*获取数据字典或者数据源数据*/
                if (compont.dataSource == '0') {
                    learun.clientdata.getAllAsync('dataItem', {
                        code: compont.itemCode,
                        callback: function (dataes) {
                            $.each(dataes, function (id, item) {
                                var $point = $('<label><input name="' + compont.id + '" value="' + item.value + '"' + (compont.dfvalue == item.value ? "checked" : "") + ' type="radio">' + item.text + '</label>');
                                $compont.append($point);
                            });
                        }
                    });
                }
                else {
                    var vlist = compont.dataSourceId.split(',');
                    learun.clientdata.getAllAsync('sourceData', {
                        code: vlist[0],
                        callback: function (data) {
                            $.each(data, function (id, item) {
                                var $point = $('<label><input name="' + compont.id + '" value="' + item[vlist[2]] + '"' + (compont.dfvalue == item[vlist[2]] ? "checked" : "") + ' type="radio">' + item[vlist[1]] + '</label>');
                                $compont.append($point);
                            });
                        }
                    });
                }

                $row.append($compont);
                return $compont;
            }
        },
        checkbox: {//多选框
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="checkbox" ><i class="fa fa-square-o"></i>多选框</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '多选项',
                    type: "checkbox",
                    table: '',
                    field: "",
                    proportion: '1',

                    dataSource: '0',  // 0数据字典1数据源
                    dataSourceId: '',
                    itemCode:'',
                    dfvalue: ''       // 默认值
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: "多选项" }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component);
                var _html = '';
                _html += '<div class="lr-component-title">数据来源</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dataSource"></div></div>';
                _html += '<div class="lr-component-title">数据选项</div>';
                _html += '<div class="lr-component-control" id="lr_component_dataItemCode1"><div id="lr_component_dataItemCode"></div></div>';
                _html += '<div class="lr-component-control" id="lr_component_dataSourceId1" style="display:none;" ><div id="lr_component_dataSourceId">dasd</div></div>';
                _html += '<div class="lr-component-title">默认值<i title="仅在添加数据时默认填入" class="help fa fa-question-circle"></i></div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dfvalue"></div></div>';

                $html.append(_html);
                setDatasource(dfop);
            },
            renderTable: function (compont, $row) {//使用表单的时候渲染成table
                var $compont = $('<div class="checkbox"></div>');
                /*获取数据字典或者数据源数据*/
                if (compont.dataSource == '0') {
                    learun.clientdata.getAllAsync('dataItem', {
                        code: compont.itemCode,
                        callback: function (dataes) {
                            $.each(dataes, function (id, item) {
                                var $point = $('<label><input name="' + compont.id + '" value="' + item.value + '"' + (compont.dfvalue == item.value ? "checked" : "") + ' type="checkbox">' + item.text + '</label>');
                                $compont.append($point);
                            });
                        }
                    });
                }
                else {
                    var vlist = compont.dataSourceId.split(',');
                    learun.clientdata.getAllAsync('sourceData', {
                        code: vlist[0],
                        callback: function (data) {
                            $.each(data, function (id, item) {
                                var $point = $('<label><input name="' + compont.id + '" value="' + item[vlist[2]] + '"' + (compont.dfvalue == item[vlist[2]] ? "checked" : "") + ' type="checkbox">' + item[vlist[1]] + '</label>');
                                $compont.append($point);
                            });
                        }
                    });
                }

                $row.append($compont);
                return $compont;
            },
            renderQuery: function (compont, $row) {
                var $compont = $('<div class="checkbox"></div>');
                /*获取数据字典或者数据源数据*/
                if (compont.dataSource == '0') {
                    learun.clientdata.getAllAsync('dataItem', {
                        code: compont.itemCode,
                        callback: function (dataes) {
                            $.each(data, function (id, item) {
                                var $point = $('<label><input name="' + compont.id + '" value="' + item.value + '"' + (compont.dfvalue == item.value ? "checked" : "") + ' type="checkbox">' + item.text + '</label>');
                                $compont.append($point);
                            });
                        }
                    });
                }
                else {
                    var vlist = compont.dataSourceId.split(',');
                    learun.clientdata.getAllAsync('sourceData', {
                        code: vlist[0],
                        callback: function (data) {
                            $.each(data, function (id, item) {
                                var $point = $('<label><input name="' + compont.id + '" value="' + item[vlist[2]] + '"' + (compont.dfvalue == item[vlist[2]] ? "checked" : "") + ' type="checkbox">' + item[vlist[1]] + '</label>');
                                $compont.append($point);
                            });
                        }
                    });
                }

                $row.append($compont);
                return $compont;
            }
        },
        select: {//下拉框
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="select" ><i class="fa fa-caret-square-o-right"></i>下拉框</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '下拉框',
                    type: "select",
                    table: '',
                    field: "",
                    proportion: '1',
                    verify: '',

                    height: 200,
                    dataSource: '0',  // 0数据字典1数据源
                    dataSourceId: '',
                    itemCode:'',
                    dfvalue: ''       // 默认值
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: "下拉框" }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component, verifyDatalist2);
                var _html = '';
                _html += '<div class="lr-component-title">数据来源</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dataSource"></div></div>';
                _html += '<div class="lr-component-title">数据选项</div>';
                _html += '<div class="lr-component-control" id="lr_component_dataItemCode1"><div id="lr_component_dataItemCode"></div></div>';
                _html += '<div class="lr-component-control" id="lr_component_dataSourceId1" style="display:none;" ><div id="lr_component_dataSourceId">dasd</div></div>';
                _html += '<div class="lr-component-title">默认值<i title="仅在添加数据时默认填入" class="help fa fa-question-circle"></i></div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dfvalue"></div></div>';
                _html += '<div class="lr-component-title">下拉高度</div>';
                _html += '<div class="lr-component-control"><input id="lr_component_height" type="text" class="form-control" /></div>';

                $html.append(_html);
                setDatasource(dfop);
                $html.find('#lr_component_height').val(dfop.height);
                $html.find('#lr_component_height').keyup(function (e) {
                    var value = $(this).val();
                    dfop.height = value;
                });
            },
            renderTable: function (compont, $row) {//使用表单的时候渲染成table
                var $compont = $('<div id="' + compont.id + '"></div>');
                $row.append($compont);
                /*获取数据字典或者数据源数据*/
                if (compont.dataSource == '0') {
                    $compont.lrDataItemSelect({
                        allowSearch: true,
                        maxHeight: compont.height,
                        code: compont.itemCode
                    }).lrselectSet(compont.dfvalue);
                }
                else {
                    var vlist = compont.dataSourceId.split(',');


                    $compont.lrDataSourceSelect({
                        allowSearch: true,
                        maxHeight: compont.height,
                        code: vlist[0],
                        value: vlist[2],
                        text: vlist[1]
                    }).lrselectSet(compont.dfvalue);
                }
                return $compont;
            },
            renderQuery: function (compont, $row) {
                var $compont = $('<div id="' + compont.id + '"></div>');
                $row.append($compont);

                /*获取数据字典或者数据源数据*/
                if (compont.dataSource == '0') {
                    $compont.lrDataItemSelect({
                        allowSearch: true,
                        maxHeight: compont.height,
                        code: compont.itemCode
                    }).lrselectSet(compont.dfvalue);
                }
                else {
                    var vlist = compont.dataSourceId.split(',');
                    $compont.lrDataSourceSelect({
                        allowSearch: true,
                        maxHeight: compont.height,
                        code: vlist[0],
                        value: vlist[2],
                        text: vlist[1]
                    }).lrselectSet(compont.dfvalue);
                }
                return $compont;
            }
        },
        datetime: {//日期框
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="datetime" ><i class="fa fa-calendar"></i>日期框</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '日期框',
                    type: "datetime",
                    table: '',
                    field: "",
                    proportion: '1',
                    verify: '',

                    dateformat: '0',
                    dfvalue: ''       // 默认值
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: '日期框' }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component, verifyDatalist2);
                var _html = '';
                _html += '<div class="lr-component-title">日期格式</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dateformat"></div></div>';
                _html += '<div class="lr-component-title">默认值<i title="仅在添加数据时默认填入" class="help fa fa-question-circle"></i></div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dfvalue"></div></div>';

                $html.append(_html);
                $('#lr_component_dateformat').lrselect({
                    data: [{ id: '0', text: '仅日期' }, { id: '1', text: '日期和时间' }],
                    value: 'id',
                    text: 'text',
                    placeholder: false,
                    select: function (item) {
                        dfop.dateformat = item.id;
                    }
                }).lrselectSet(dfop.dateformat);
                $('#lr_component_dfvalue').lrselect({
                    data: [{ id: '0', text: '昨天' }, { id: '1', text: '今天' }, { id: '2', text: '明天' }],
                    value: 'id',
                    text: 'text',
                    select: function (item) {
                        if (!!item) {
                            dfop.dfvalue = item.id;
                        }
                        else {
                            dfop.dfvalue = '';
                        }
                    }
                }).lrselectSet(dfop.dfvalue);
            },
            renderTable: function (compont, $row) {//使用表单的时候渲染成table
                var dateformat = compont.dateformat == '0' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm';
                var datedefault = "";
                var datetime = new Date();
                switch (compont.dfvalue) {
                    case "0":
                        datedefault = datetime.DateAdd('d', -1);
                        break;
                    case "1":
                        datedefault = datetime.DateAdd('d', 0);
                        break;
                    case "2":
                        datedefault = datetime.DateAdd('d', 1);;
                        break;
                }
                datedefault = learun.formatDate(datedefault, dateformat.replace(/H/g, 'h'));
                var $compont = $('<input value="' + datedefault + '" id="' + compont.id + '"    " onClick="WdatePicker({dateFmt:\'' + dateformat + '\',qsEnabled:false,isShowClear:false,isShowOK:false,isShowToday:false,onpicked:function(){$(\'#' + compont.id + '\').trigger(\'change\');}})"  type="text" class="form-control lr-input-wdatepicker" />');
                $row.append($compont);
                return $compont;
            }
        },
        datetimerange: {
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="datetimerange" ><i class="fa fa-calendar"></i>日期区间</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '日期区间',
                    type: "datetimerange",
                    table: '',
                    field: "",
                    proportion: '1',
                    verify: '',

                    startTime: '',
                    endTime: ''
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: '日期区间' }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component, verifyDatalist2);
                var _html = '';
                _html += '<div class="lr-component-title">开始日期</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_startTime"></div></div>';
                _html += '<div class="lr-component-title">结束日期</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_endTime"></div></div>';

                $html.append(_html);

                // 获取日期框的数据
                var datatimes = [];
                var $parent = $component.parent();
                $parent.find('.lr-compont-item').each(function () {
                    var compontItem = $(this)[0].dfop;
                    if (compontItem.type == 'datetime') {
                        var point = { id: compontItem.id, text: compontItem.title };
                        datatimes.push(point);
                    }
                });
                // 开始日期
                $('#lr_component_startTime').lrselect({
                    data: datatimes,
                    value: 'id',
                    text: 'text',
                    select: function (item) {
                        dfop.startTime = item.id;
                    }
                }).lrselectSet(dfop.startTime);
                // 结束日期
                $('#lr_component_endTime').lrselect({
                    data: datatimes,
                    value: 'id',
                    text: 'text',
                    select: function (item) {
                        dfop.endTime = item.id;
                    }
                }).lrselectSet(dfop.endTime);
            },
            renderTable: function (compont, $row) {
                var $compont = $('<input id="' + compont.id + '" type="text" class="form-control" />');
                function register() {
                    if ($('#' + compont.startTime).length > 0 && $('#' + compont.endTime).length > 0) {
                        $('#' + compont.startTime).on('change', function () {
                            var st = $(this).val();
                            var et = $('#' + compont.endTime).val();
                            if (!!st && !!et) {
                                var diff = learun.parseDate(st).DateDiff('d', et) + 1;
                                $compont.val(diff);
                            }
                        });
                        $('#' + compont.endTime).on('change', function () {
                            var st = $('#' + compont.startTime).val();
                            var et = $(this).val();
                            if (!!st && !!et) {
                                var diff = learun.parseDate(st).DateDiff('d', et) + 1;
                                $compont.val(diff);
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
                return $compont;
            },
            renderQuery: function (compont, $row) {
                var $compont = $('<input id="' + compont.id + '" type="text" class="form-control" />');
                $row.append($compont);
                return $compont;
            }
        },
       
        encode: {//单据编码
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="encode" ><i class="fa fa-barcode"></i>编 码</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '编 码',
                    type: "encode",
                    table: '',
                    field: "",
                    proportion: '1',

                    rulecode: '',
                    isHide: '0',  // 是否隐藏
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: "编 码" }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component);
                var _html = '';
                _html += '<div class="lr-component-title">单据规则</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_rulecode"></div></div>';

                $html.append(_html);

                $('#lr_component_rulecode').lrselect({
                    value: 'F_EnCode',
                    text: 'F_FullName',
                    title: 'F_FullName',
                    allowSearch: true,
                    select: function (item) {
                        if (!!item) {
                            dfop.rulecode = item.F_EnCode;
                        }
                        else {
                            dfop.rulecode = '';
                        }
                    }
                });

                if (!!ruleCode) {
                    $('#lr_component_rulecode').lrselectRefresh({
                        data: ruleCode
                    });
                }
                else {
                    learun.httpAsync('GET', top.$.rootUrl + '/LR_SystemModule/CodeRule/GetList', {}, function (data) {
                        ruleCode = data;
                        $('#lr_component_rulecode').lrselectRefresh({
                            data: ruleCode
                        });
                    });
                }

            },
            renderTable: function (compont, $row) {//使用表单的时候渲染成table
                var $compont = $('<input id="' + compont.id + '" type="text" readonly class="form-control" />');
                learun.httpAsync('GET', top.$.rootUrl + '/LR_SystemModule/CodeRule/GetEnCode', { code: compont.rulecode }, function (data) {
                    if (!$compont.val()) {
                        $compont.val(data);
                    }
                });

                $row.append($compont);
                return $compont;
            },
            renderQuery: function (compont, $row) {
                var $compont = $('<input id="' + compont.id + '" type="text" class="form-control" />');
                $row.append($compont);
                return $compont;
            }
        },
        organize: {//单位组织
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="organize" ><i  class="fa fa-coffee"></i>单位组织</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '单位组织',
                    type: "organize",
                    table: '',
                    field: "",
                    proportion: '1',

                    relation: "",
                    height: 200,
                    dataType: 'user'
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: '单位组织' }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component, verifyDatalist2);
                var _html = '';
                _html += '<div class="lr-component-title">下拉高度</div>';
                _html += '<div class="lr-component-control"><input id="lr_component_height" type="text" class="form-control" /></div>';
                _html += '<div class="lr-component-title">类型选择</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dataType"></div></div>';

                _html += '<div class="lr-component-title lrrelation">单位组织控件级联-上一级</div>';
                _html += '<div class="lr-component-control lrrelation"><div id="lr_component_relation"></div></div>';
    
                $html.append(_html);
                $html.find('#lr_component_height').val(dfop.height);
                $html.find('#lr_component_height').keyup(function (e) {
                    var value = $(this).val();
                    dfop.height = value;
                });

                /*上一级联*/
                var organizes = [];
                var $parent = $component.parent();
                $parent.find('.lr-compont-item').each(function () {
                    var compontItem = $(this)[0].dfop;
                    if (compontItem.type == 'organize' && compontItem.id != dfop.id) {
                        var point = { id: compontItem.id, text: compontItem.title, type: compontItem.dataType };
                        organizes.push(point);
                    }
                });
                $('#lr_component_relation').lrselect({
                    data: organizes,
                    value: 'id',
                    text: 'text',
                    select: function (item) {
                        if (!!item) {
                            dfop.relation = item.id;
                        }
                        else {
                            dfop.relation = '';
                        }
                    }
                }).lrselectSet(dfop.relation);
                /*类型选择*/
                $('#lr_component_dataType').lrselect({
                    data: [{ id: 'company', text: '公司' }, { id: 'department', text: '部门' }, { id: 'user', text: '人员' }],
                    value: 'id',
                    text: 'text',
                    placeholder: false,
                    select: function (item) {
                        dfop.dataType = item.id;
                        switch (dfop.dataType) {
                            case "user"://用户
                                var tmpData = [];
                                $.each(organizes, function (id, item) {
                                    if (item.type == 'department') {
                                        tmpData.push(item);
                                    }
                                });
                                $('#lr_component_relation').lrselectRefresh({
                                    data: tmpData
                                });
                                $('.lrrelation').show();
                                break;
                            case "department"://部门
                                var tmpData = [];
                                $.each(organizes, function (id, item) {
                                    if (item.type == 'company') {
                                        tmpData.push(item);
                                    }
                                });
                                $('#lr_component_relation').lrselectRefresh({
                                    data: tmpData
                                });

                                $('.lrrelation').show();
                                break;
                            case "company"://公司
                                $('.lrrelation').hide();
                                break;
                        }
                    }
                }).lrselectSet(dfop.dataType);
            },
            renderTable: function (compont, $row) {
                var $compont = $('<div id="' + compont.id + '" ></div>');
                $row.append($compont);
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
                return $compont;
            },
            renderQuery: function (compont, $row) {
                var $compont = $('<div id="' + compont.id + '" ></div>');
                $row.append($compont);
                switch (compont.dataType) {
                    case "user"://用户
                        $compont.lrformselect({
                            layerUrl: top.$.rootUrl + '/LR_OrganizationModule/User/SelectOnlyForm',
                            layerUrlW: 400,
                            layerUrlH: 300,
                            dataUrl: top.$.rootUrl + '/LR_OrganizationModule/User/GetListByUserIds'
                        });
                        break;
                    case "department"://部门
                        $compont.lrselect({
                            type: 'tree',
                            // 展开最大高度
                            maxHeight: compont.height,
                            // 是否允许搜索
                            allowSearch: true
                        });

                        $compont.lrselectRefresh({
                            url: top.$.rootUrl + '/LR_OrganizationModule/Department/GetTree',
                            param: {}
                        });
                        break;
                    case "company"://公司
                        $compont.lrCompanySelect({ maxHeight: compont.height });
                        break;
                }
                return $compont;
            }
        },
        currentInfo: {//固定信息
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="currentInfo" ><i  class="fa fa-book"></i>当前信息</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '当前信息',
                    type: "currentInfo",
                    table: '',
                    field: "",
                    proportion: '1',

                    isHide: '0',  // 是否隐藏
                    dataType: 'user'
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: '当前信息' }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component);
                var _html = '';
                _html += '<div class="lr-component-title">是否隐藏</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_isHide"></div></div>';
                _html += '<div class="lr-component-title">类型选择</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_dataType"></div></div>';

                $html.append(_html);

                $('#lr_component_isHide').lrselect({
                    placeholder: false,
                    data: [{ id: '0', text: '否' }, { id: '1', text: '是' }],
                    value: 'id',
                    text: 'text',
                    select: function (item) {
                        if (!!item) {
                            dfop.isHide = item.id;
                        }
                        else {
                            dfop.isHide = '0';
                        }
                    }
                });
                $('#lr_component_isHide').lrselectSet(dfop.isHide);
                $('#lr_component_dataType').lrselect({
                    data: [{ id: 'company', text: '当前公司' }, { id: 'department', text: '当前部门' }, { id: 'user', text: '当前用户' }, { id: 'time', text: '当前时间' }, { id: 'guid', text: 'GUID' }],
                    value: 'id',
                    text: 'text',
                    placeholder: false,
                    select: function (item) {
                        dfop.dataType = item.id;
                    }
                }).lrselectSet(dfop.dataType);
            },
            renderTable: function (compont, $row) {
                var $compont = $('<input id="' + compont.id + '" readonly type="text"  class="form-control lr-currentInfo lr-currentInfo-' + compont.dataType + '" />');
                var loginInfo = learun.clientdata.get(['userinfo']);
                switch (compont.dataType)
                {
                    case 'company':
                        $compont[0].lrvalue = loginInfo.companyId;
                        learun.clientdata.getAsync('company', {
                            key: loginInfo.companyId,
                            callback: function (_data) {
                                $compont.val(_data.F_FullName);
                            }
                        });
                        break;
                    case 'department':
                        $compont[0].lrvalue = loginInfo.departmentId;
                        learun.clientdata.getAsync('department', {
                            key: loginInfo.departmentId,
                            companyId: loginInfo.companyId,
                            callback: function (item) {
                                $compont.val(item.F_FullName);
                            }
                        });
                        break;
                    case 'user':
                        $compont.val(loginInfo.realName);
                        $compont[0].lrvalue = loginInfo.userId;
                        break;
                    case 'time':
                        $compont[0].lrvalue = learun.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
                        $compont.val($compont[0].lrvalue);
                        break;
                    case 'guid':
                        $compont[0].lrvalue = learun.newGuid();
                        $compont.val($compont[0].lrvalue);
                        break;
                }
                if (compont.isHide == '1') {
                    $row.hide();
                }

                $row.append($compont);
                return $compont;
            }
        },
        guid: {//固定信息
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="guid" ><i  class="fa fa-info"></i>GUID</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: 'GUID',
                    type: "guid",
                    table: '',
                    field: "",
                    proportion: '1',
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: 'GUID' }));
            },
            property: function ($component) {
                var dfop = $component[0].dfop;
                var $html = setComponentPropertyHtml($component);
            },
            renderTable: function (compont, $row) {
                var $compont = $('<input id="' + compont.id + '" readonly type="text"  class="form-control lr-currentInfo lr-currentInfo-guid" />');
                $compont[0].lrvalue = learun.newGuid();
                $compont.val($compont[0].lrvalue);
                $row.hide();
                $row.append($compont);
                return $compont;
            }
        },
        upload: {//附件框
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="upload" ><i class="fa fa-paperclip"></i>附件上传</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '附件上传',
                    type: "upload",
                    table: '',
                    field: "",
                    proportion: '1',
                    verify: ''
                };
                $component.html(getComponentRowHtml({ name: $component[0].dfop.title, text: '附件上传' }));
            },
            property: function ($component) {
                setComponentPropertyHtml($component, verifyDatalist2);
            },
            renderTable: function (compont, $row) {
                var $compont = $('<div id="' + compont.id + '"></div>');
                $row.append($compont);
                $compont.lrUploader();

                return $compont;
            }
        },
        girdtable: {
            init: function () {
                var $html = $('<div class="lr-custmerform-component" data-type="girdtable" ><i class="fa fa-table"></i>编辑表格</div>');
                return $html;
            },
            render: function ($component) {
                $component[0].dfop = $component[0].dfop || {
                    title: '编辑表格',
                    table: '',
                    type: "girdtable",
                    proportion: '1',
                    verify: '',

                    minheight: 400,  // 表格默认的行数
                    fieldsData: [], // 设置的字段数据

                    preloadDb: '',
                    preloadTable: ''

                };
                $component.html(getComponentRowHtml({ name: '编辑表格', text: '编辑表格' }));
            },
            property: function ($component) {
                var designerDfop = $component.parent()[0].dfop;
                var dfop = $component[0].dfop;

                var $html = $(".lr-custmerform-designer-layout-right .mCSB_container");
                var _html = '<div class="lr-component-title">绑定表</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_table"></div></div>';
                _html += '<div class="lr-component-title">字段验证</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_verify"></div></div>';
                _html += '<div class="lr-component-title">所占行比例</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_proportion"></div></div>';
                _html += '<div class="lr-component-title">最小高度</div>';
                _html += '<div class="lr-component-control"><input id="lr_component_minheight" type="text" class="form-control" placeholder="必填项"/></div>';

                _html += '<div class="lr-component-title">预加载数据库</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_ydb"></div></div>';
                _html += '<div class="lr-component-title">预加载数据表</div>';
                _html += '<div class="lr-component-control"><div id="lr_component_ytable"></div></div>';

                _html += '<div class="lr-component-control" style="text-align: center;padding-top: 10px;" ><a id="lr_fieldsData_set" class="btn btn-primary btn-block">设置表格字段</a></div>';

                $html.html(_html);
                $('#lr_component_table').lrselect({
                    data: designerDfop.dbTable,
                    value: 'name',
                    text: 'name',
                    allowSearch: true,
                    select: function (item) {
                        if (!!item) {
                            dfop.table = item.name;
                        }
                        else {
                            dfop.table = '';
                        }
                    }
                });
                if (!!designerDfop.dbTable && designerDfop.dbTable.length > 0) {
                    $('#lr_component_table').lrselectSet(dfop.table || designerDfop.dbTable[0].name);
                }
                // 标题设置
                $html.find('#lr_component_minheight').val(dfop.minheight);
                $html.find('#lr_component_minheight').keyup(function (e) {
                    var value = $(this).val();
                    dfop.minheight = value;
                });
                // 字段验证
                $('#lr_component_verify').lrselect({
                    data: verifyDatalist2,
                    value: 'id',
                    text: 'text',
                    allowSearch: true,
                    select: function (item) {
                        if (!!item) {
                            dfop.verify = item.id;
                        }
                        else {
                            dfop.verify = "";
                        }
                    }
                });
                $('#lr_component_verify').lrselectSet(dfop.verify);
                // 所在行占比
                $('#lr_component_proportion').lrselect({
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
                            id: '5', text: '1/5'
                        },
                        {
                            id: '6', text: '1/6'
                        }
                    ],
                    placeholder: false,
                    value: 'id',
                    text: 'text',
                    select: function (item) {
                        if (!!item) {
                            dfop.proportion = item.id;
                        }
                        else {
                            dfop.proportion = '1';
                        }

                        $component.css({ 'width': 100 / parseInt(dfop.proportion) + '%' });
                    }
                });
                $('#lr_component_proportion').lrselectSet(dfop.proportion);
                // 编辑表格字段
                $('#lr_fieldsData_set').on('click', function () {
                    top.formGridSetting = {
                        fields: dfop.fieldsData,
                        tableName: dfop.table,
                        dbId: designerDfop.dbId
                    };
                    learun.layerForm({
                        id: 'custmerForm_editgrid_index',
                        title: '编辑表格选项',
                        url: top.$.rootUrl + '/LR_FormModule/Custmerform/SetFieldIndex?keyValue=formGridSetting',
                        width: 700,
                        height: 500,
                        maxmin: true,
                        btn: null,
                        end: function () {
                            top.formGridSetting = null;
                            //$.lrCustmerFormDesigner.renderTabs($self);
                        }
                    });
                });

                // 预加载数据
                // 数据库表选择
                $('#lr_component_ytable').lrselect({
                    value: 'name',
                    text: 'name',
                    title: 'tdescription',
                    allowSearch: true,
                    select: function (item) {
                        if (!!item) {
                            dfop.preloadTable = item.name;
                        }
                        else {
                            dfop.preloadTable = '';
                        }
                    }
                }).lrselectSet(dfop.preloadTable);
                // 数据库表选择
                $('#lr_component_ydb').lrselect({
                    url: top.$.rootUrl + '/LR_SystemModule/DatabaseLink/GetTreeList',
                    type: 'tree',
                    placeholder: '请选择数据库',
                    allowSearch: true,
                    select: function (item) {
                        if (item.hasChildren || item.id == -1) {
                            dfop.preloadDb = '';
                            $('#lr_component_ytable').lrselectRefresh({
                                url: '',
                                data: [],
                            });
                        }
                        else {
                            dfop.preloadDb = item.id;
                            $('#lr_component_ytable').lrselectRefresh({
                                url: top.$.rootUrl + '/LR_SystemModule/DatabaseTable/GetList',
                                param: { databaseLinkId: dfop.preloadDb },
                                data: null,
                            });
                        }
                    }
                }).lrselectSet(dfop.preloadDb);
            },
            renderTable: function (compont, $row) {
                $row.find('.lr-form-item-title').remove();
                $row.addClass('lr-form-item-grid');
                var $compont = $('<div id="' + compont.id + '"></div>');
                $row.append($compont);
                compont.hideData = [];
                var headData = toGirdheadData(compont.fieldsData, compont.hideData);
                if (!!compont.preloadDb && !!compont.preloadTable) {
                    $compont.jfGrid({
                        headData: headData,
                        isAutoHeight: true
                    });
                    learun.httpAsync('GET', top.$.rootUrl + '/LR_SystemModule/DatabaseTable/GetTableDataAllList', { databaseLinkId: compont.preloadDb, tableName: compont.preloadTable }, function (data) {
                        if ($compont.jfGridGet('rowdatas').length < 1) {
                            var fieldMap = {};
                            $.each(compont.fieldsData, function (id, girdFiled) {
                                if (!!girdFiled.field) {
                                    fieldMap[girdFiled.field.toLowerCase()] = girdFiled.field;
                                }
                            });
                            var rowDatas = [];
                            for (var i = 0, l = data.length; i < l; i++) {
                                var _point = {};
                                for (var _field in data[i]) {
                                    _point[fieldMap[_field]] = data[i][_field];
                                }
                                rowDatas.push(_point);
                            }
                            $compont.jfGridSet('refreshdata', { rowdatas: rowDatas });
                        }
                    });
                }
                else {
                    $compont.jfGrid({
                        headData: headData,
                        isAutoHeight: true,
                        isEidt: true,
                        footerrow: true,
                        minheight: compont.minheight
                    });
                }


            }
        },
    }

    // 表字段
    var fieldMap = {};
    var verifyDatalist = [
        { id: "NotNull", text: "不能为空！" },
        { id: "Num", text: "必须为数字！" },
        { id: "NumOrNull", text: "数字或空！" },
        { id: "Email", text: "必须为E-mail格式！" },
        { id: "EmailOrNull", text: "E-mail格式或空！" },
        { id: "EnglishStr", text: "必须为字符串！" },
        { id: "EnglishStrOrNull", text: "字符串或空！" },
        { id: "Phone", text: "必须电话格式！" },
        { id: "PhoneOrNull", text: "电话格式或者空！" },
        { id: "Fax", text: "必须为传真格式！" },
        { id: "Mobile", text: "必须为手机格式！" },
        { id: "MobileOrNull", text: "手机格式或者空！" },
        { id: "MobileOrPhone", text: "电话格式或手机格式！" },
        { id: "MobileOrPhoneOrNull", text: "电话格式或手机格式或空！" },
        { id: "Uri", text: "必须为网址格式！" },
        { id: "UriOrNull", text: "网址格式或空！" }
    ];
    var verifyDatalist2 = [
        { id: "NotNull", text: "不能为空！" }
    ];

    // 获取组件行显示html
    function getComponentRowHtml(data) {
        var _html = '<div class="lr-compont-title"><span>' + data.name + '</span><div class="lr-compont-remove"><i  title="移除组件" class="del fa fa-close"></i></div></div><div class="lr-compont-value">' + data.text + '</div>';
        return _html;
    };
    // 设置组件公共属性设置html
    function setComponentPropertyHtml($component, verifyData) {
        var designerDfop = $component.parent()[0].dfop;
        var dfop = $component[0].dfop;

        var $html = $(".lr-custmerform-designer-layout-right .mCSB_container");
        var _html = '';
        _html += '<div class="lr-component-title">绑定表</div>';
        _html += '<div class="lr-component-control"><div id="lr_component_table"></div></div>';
        _html += '<div class="lr-component-title">绑定字段</div>';
        _html += '<div class="lr-component-control"><div id="lr_component_field"></div></div>';
        _html += '<div class="lr-component-title">组件标题</div>';
        _html += '<div class="lr-component-control"><input id="lr_component_title" type="text" class="form-control" placeholder="必填项"/></div>';
        if (!!verifyData) {
            _html += '<div class="lr-component-title">字段验证</div>';
            _html += '<div class="lr-component-control"><div id="lr_component_verify"></div></div>';
        }
        _html += '<div class="lr-component-title">所占行比例</div>';
        _html += '<div class="lr-component-control"><div id="lr_component_proportion"></div></div>';
        $html.html(_html);

        // 绑定字段
        $('#lr_component_field').lrselect({
            value: 'f_column',
            text: 'f_column',
            title: 'f_remark',
            allowSearch: true,
            select: function (item) {
                if (!!item) {
                    dfop.field = item.f_column;
                }
                else {
                    dfop.field = '';
                }
            }
        });
        $('#lr_component_table').lrselect({
            data: designerDfop.dbTable || [],
            value: 'name',
            text: 'name',
            allowSearch: true,
            select: function (item) {
                if (!!item) {
                    dfop.table = item.name;
                    if (!!fieldMap[designerDfop.dbId + item.name]) {
                        $('#lr_component_field').lrselectRefresh({
                            data: fieldMap[designerDfop.dbId + item.name]
                        });
                    }
                    else {
                        learun.httpAsync('GET', top.$.rootUrl + '/LR_SystemModule/DatabaseTable/GetFieldList', { databaseLinkId: designerDfop.dbId, tableName: item.name }, function (data) {
                            fieldMap[designerDfop.dbId + item.name] = data;
                            $('#lr_component_field').lrselectRefresh({
                                data: fieldMap[designerDfop.dbId + item.name]
                            });
                        });
                    }
                }
                else {
                    $('#lr_component_field').lrselectRefresh({
                        data: []
                    });
                    dfop.table = '';
                }
            }
        });
        if (!!designerDfop.dbTable && designerDfop.dbTable.length > 0)
        {
            $('#lr_component_table').lrselectSet(dfop.table || designerDfop.dbTable[0].name);
        }
        $('#lr_component_field').lrselectSet(dfop.field);
        // 标题设置
        $html.find('#lr_component_title').val(dfop.title);
        $html.find('#lr_component_title').keyup(function (e) {
            var value = $(this).val();
            $component.find('.lr-compont-title span').text(value);
            dfop.title = value;
        });
        if (!!verifyData) {
            // 字段验证
            $('#lr_component_verify').lrselect({
                data: verifyData,
                value: 'id',
                text: 'text',
                allowSearch: true,
                select: function (item) {
                    if (!!item) {
                        dfop.verify = item.id;
                    }
                    else {
                        dfop.verify = "";
                    }
                }
            });
            $('#lr_component_verify').lrselectSet(dfop.verify);
        }
        // 所在行占比
        $('#lr_component_proportion').lrselect({
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
            text: 'text',
            select: function (item) {
                if (!!item) {
                    dfop.proportion = item.id;
                }
                else {
                    dfop.proportion = '1';
                }

                $component.css({ 'width': 100 / parseInt(dfop.proportion) + '%' });
            }
        });
        $('#lr_component_proportion').lrselectSet(dfop.proportion);


        return $html;
    };
    // 数据字典选择初始化、数据源选择初始化
    function setDatasource(dfop) {
        
        $('#lr_component_dfvalue').lrselect({
            allowSearch: true,
            maxHeight: 93,
            select: function (item) {
                if (!!item) {
                    if (dfop.dataSource == '0') {
                        dfop.dfvalue = item.id;
                    }
                    else {
                        var vlist = dfop.dataSourceId.split(',');
                        dfop.dfvalue = item[vlist[2]];
                    }
                }
                else {
                    dfop.dfvalue = '';
                }
            }
        }).lrselectSet(dfop.dfvalue);
        $('#lr_component_dataItemCode').lrselect({
            allowSearch: true,
            maxHeight: 150,
            url: top.$.rootUrl + '/LR_SystemModule/DataItem/GetClassifyTree',
            type: 'tree',
            select: function (item) {
                if (!!item) {
                    if (dfop.dataSourceId != item.id) {
                        dfop.dfvalue = '';
                        dfop.dataSourceId = item.id;
                        dfop.itemCode = item.value;
                    }
                    learun.clientdata.getAllAsync('dataItem', {
                        code: item.value,
                        callback: function (dataes) {
                            var list = [];
                            $.each(dataes, function (_index, _item) {
                                if (_item.parentId == "0") {
                                    list.push({ id: _item.value, text: _item.text, title: _item.text, k: _index });
                                }
                            });
                            $('#lr_component_dfvalue').lrselectRefresh({
                                value: "id",
                                text: "text",
                                title: "title",
                                data: list,
                                url: ''
                            });
                        }
                    });
                }
                else {
                    dfop.dataSourceId = '';
                    dfop.itemCode = '';
                    $('#lr_component_dfvalue').lrselectRefresh({ url: '', data: [] });
                }
            }
        });

        $('#lr_component_dataSourceId').lrformselect({
            placeholder: '请选择数据源项',
            layerUrl: top.$.rootUrl + '/LR_SystemModule/DataSource/SelectForm',
            layerUrlH: 500,
            layerUrlW: 800,
            dataUrl: top.$.rootUrl + '/LR_SystemModule/DataSource/GetNameByCode',
            select: function (item) {
                if (dfop.dataSourceId != item.value) {
                    dfop.dfvalue = '';
                    dfop.dataSourceId = item.value;
                }
                if (item.value == '') {
                    $('#lr_component_dfvalue').lrselectRefresh({ url: '', data: [] });
                }
                else {
                    var vlist = item.value.split(',');
                    learun.clientdata.getAllAsync('sourceData', {
                        code: vlist[0],
                        callback: function (dataes) {
                            $('#lr_component_dfvalue').lrselectRefresh({
                                value: vlist[2],
                                text: vlist[1],
                                title: vlist[1],
                                url: '',
                                data: dataes
                            });                           
                        }
                    });
                }
            }
        });

        if (dfop.dataSource == "0") {
            $('#lr_component_dataItemCode').lrselectSet(dfop.dataSourceId);
        }
        else {
            $('#lr_component_dataSourceId').lrformselectSet(dfop.dataSourceId);
        }

        $('#lr_component_dataSource').lrselect({
            data: [{ id: '0', text: '数据字典' }, { id: '1', text: '数据源' }],
            value: 'id',
            text: 'text',
            placeholder: false,
            select: function (item) {
                if (dfop.dataSource != item.id) {
                    dfop.dfvalue = '';
                    dfop.dataSourceId = '';
                    dfop.itemCode = '';
                    $('#lr_component_dataItemCode').lrselectSet(dfop.dataSourceId);
                    $('#lr_component_dataSourceId').lrformselectSet(dfop.dataSourceId);
                    $('#lr_component_dfvalue').lrselectRefresh({ url: '', data: [] });
                }
                dfop.dataSource = item.id;
                if (dfop.dataSource == '0') {
                    $('#lr_component_dataSourceId1').hide();
                    $('#lr_component_dataItemCode1').show();
                }
                else {
                    $('#lr_component_dataItemCode1').hide();
                    $('#lr_component_dataSourceId1').show();
                }
            }
        }).lrselectSet(dfop.dataSource);
    };
    // 转化成树形数据
    function toGirdheadData(data, hideData) {
        // 只适合小数据计算
        var resdata = [];
        var mapdata = {};
        var mIds = {};
        var pIds = {};
        var maprowdatas = {};
        data = data || [];
       
        for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];
            var isAdd = true;
            //表头信息设置
            var point = { id: item.id, label: item.name, name: item.field || learun.newGuid(), width: parseInt(item.width), align: item.align || "left", editType: item.type };
            if (item.type == 'guid') {// 如果是固定信息
                hideData.push(item);
                isAdd = false;
            }
            else if (item.type == 'select') {
                var colData = [];
                for (var j = 0, jl = item.selectData.length; j < jl; j++) {
                    if (item.selectData[j].hide == '0') {
                        item.selectData[j].width = parseInt(item.selectData[j].width);
                        colData.push(item.selectData[j]);
                    }
                }
                var url = '', param = '';
                if (item.dataSource == '0') { // 0 数据字典 1 数据源
                    url = top.$.rootUrl + '/LR_SystemModule/DataItem/GetDetailList';
                    param = { itemCode: item.dataItemCode };
                }
                else {
                    url = top.$.rootUrl + '/LR_SystemModule/DataSource/GetDataTable';
                    param = { code: item.dataSourceId };
                }
                point.editOp = {
                    width: item.dataSourceWidth || 600,
                    height: item.dataSourceHeight || 400,
                    colData: colData,
                    url: url,
                    param: param,
                    selectData: item.selectData,
                    callback: function (selectdata, rownum, row, _selectData) {
                        console.log(selectdata, rownum, row, _selectData);
                        for (var hi = 0, hil = _selectData.length; hi < hil; hi++) {
                            
                            if (!!_selectData[hi].value) {
                                row[_selectData[hi].value] = selectdata[_selectData[hi].name];
                            }
                        }
                    }
                };
            }

            if (isAdd) {
                mIds[item['id']] = 1;
                mapdata[item['parentId']] = mapdata[item['parentId']] || [];
                if (item._isEdit == 1) {
                    point.editType = 'label';
                }

                mapdata[item['parentId']].push(point);
                if (mIds[item['parentId']] == 1) {
                    delete pIds[item['parentId']];
                }
                else {
                    pIds[item['parentId']] = 1;
                }
                if (pIds[item['id']] == 1) {
                    delete pIds[item['id']];
                }
            }
        }
        for (var id in pIds) {
            _fn(resdata, id);
        }
        function _fn(_data, vparentId) {
            var pdata = mapdata[vparentId] || [];
            for (var j = 0, l = pdata.length; j < l; j++) {
                var _item = pdata[j];
                _item.children = [];
                _fn(_item.children, _item['id']);
                if (_item.children.length == 0) {
                    delete _item['children'];
                }

                _data.push(_item);
                maprowdatas[_item['id']] = _item;
            }
        }
        return resdata;
    }

    // html编码
    function htmlEncode(text)
    {
        text = text || "";
        text = text.replace(/%/g, "{@bai@}");
        text = text.replace(/ /g, "{@kong@}");
        text = text.replace(/</g, "{@zuojian@}");
        text = text.replace(/>/g, "{@youjian@}");
        text = text.replace(/&/g, "{@and@}");
        text = text.replace(/\"/g, "{@shuang@}");
        text = text.replace(/\'/g, "{@dan@}");
        text = text.replace(/\t/g, "{@tab@}");
        text = text.replace(/\+/g, "{@jia@}");

        return text;
    }
     // html解码
    function htmlDecode(text) {
        text = text || "";
        text = text.replace(/{@bai@}/g, "%");
        text = text.replace(/{@dan@}/g, "'");
        text = text.replace(/{@shuang@}/g, "\"");
        text = text.replace(/{@kong@}/g, " ");
        text = text.replace(/{@zuojian@}/g, "<");
        text = text.replace(/{@youjian@}/g, ">");
        text = text.replace(/{@and@}/g, "&");
        text = text.replace(/{@tab@}/g, "\t");
        text = text.replace(/{@jia@}/g, "+");

        return text;
    }

})(jQuery, top.learun);