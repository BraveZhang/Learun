/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力 软-前端开 发组
 * 日 期：2017.03.22
 * 描 述：自定义表单设计
 */
(function ($, learun) {
    "use strict";

    $.lrCustmerFormDesigner = {
        init: function ($self, op) {
            var dfop = {
                dbId: '',      // 数据主键
                dbTable: [], // 对应的表数据
                data: [{// 选项卡数据
                    id: '1',
                    text: '主表信息',
                    sort: '0',
                    componts: []
                }]
            }
            $.extend(dfop, op || {});
            dfop.id = $self.attr('id');
            $self[0]._lrCustmerFormDesigner = { dfop: dfop };
            $self.addClass('lr-custmerform-designer-layout');
            var _html = '';
            _html += '<div class="lr-custmerform-designer-layout-left"  id="lr_custmerform_compont_list_' + dfop.id + '"></div>';

            _html += '<div class="lr-custmerform-designer-layout-center">';
            _html += '<div class="lr-custmerform-designer-layout-header">';
            _html += '<div class="lr-custmerform-designer-tabs" id="lr_custmerform_designer_tabs_' + dfop.id + '">';
            _html += '<ul class="nav nav-tabs lr-form-tab">';
            _html += '</ul>';
            _html += '</div>';
            _html += '</div>';

            _html += '<div class="lr-custmerform-designer-layout-area" id="lr_custmerform_designer_layout_area_' + dfop.id + '" ></div>';
            _html += '<div class="lr-custmerform-designer-layout-footer">';
            _html += '<div class="lr-custmerform-designer-layout-footer-item" id="lr_custmerform_tabsEdit_btn_' + dfop.id + '"><i class="fa fa-pencil-square-o"></i><span>编辑选项卡</span></div>';
            _html += '<div class="lr-custmerform-designer-layout-footer-item" id="lr_custmerform_preview_btn_' + dfop.id + '"><i class="fa fa-eye"></i><span>预览表单</span></div>';
            _html += '</div>';
            _html += '<div class="lr-custmerform-designer-layout-center-bg"><img src="' + top.$.rootUrl + '/Content/images/tableform.png" /></div>';

            _html += '</div>';

            _html += '<div class="lr-custmerform-designer-layout-right" id="lr_custmerform_compont_property_' + dfop.id + '"></div>';

            $self.html(_html);
            $.lrCustmerFormDesigner.bind($self);
            $.lrCustmerFormDesigner.compontinit($self);
            $.lrCustmerFormDesigner.compontbind($self);

            $.lrCustmerFormDesigner.tabbind($self);
            $.lrCustmerFormDesigner.renderTabs($self);
            $.lrCustmerFormDesigner.renderComponts($self);
        },
        // 绑定表单设计器的全局事件
        bind: function ($self) {
            var dfop = $self[0]._lrCustmerFormDesigner.dfop;
            // 优化滚动条
            $('#lr_custmerform_compont_list_' + dfop.id).mCustomScrollbar({
                theme: "minimal-dark"
            });
            $('#lr_custmerform_designer_tabs_' + dfop.id).mCustomScrollbar({
                axis: "x",
                theme: "minimal-dark"
            });
            $('#lr_custmerform_designer_layout_area_' + dfop.id).mCustomScrollbar({
                theme: "minimal-dark"
            });
            $('#lr_custmerform_compont_property_' + dfop.id).mCustomScrollbar({
                theme: "minimal-dark"
            });
            $('#lr_custmerform_designer_layout_area_' + dfop.id + ' .mCSB_container')[0].dfop = dfop;

            // 编辑选项卡
            $self.find('#lr_custmerform_tabsEdit_btn_' + dfop.id).on('click', function () {
                top.formTabList = dfop.data;
                learun.layerForm({
                    id: 'custmerForm_editTabs_index',
                    title: '编辑选项卡',
                    url: top.$.rootUrl + '/LR_FormModule/Custmerform/TabEditIndex?keyValue=formTabList',
                    width: 600,
                    height: 400,
                    maxmin: true,
                    btn: null,
                    end: function () {
                        top.formTabList = null;
                        $.lrCustmerFormDesigner.renderTabs($self);
                    }
                });
            });

            // 预览表单
            $self.find('#lr_custmerform_preview_btn_' + dfop.id).on('click', function () {
                top.custmerFormData = dfop.data;
                $.lrCustmerFormDesigner.saveComponts($self);
                learun.layerForm({
                    id: 'custmerForm_PreviewForm',
                    title: '预览当前表单',
                    url: top.$.rootUrl + '/LR_FormModule/Custmerform/PreviewForm?keyValue=custmerFormData',
                    width: 700,
                    height: 500,
                    maxmin: true,
                    btn: null
                });
            });
        },
        // 组件初始化
        compontinit: function ($self) {// 组件初始化
            var dfop = $self[0]._lrCustmerFormDesigner.dfop;
            var $compontList = $self.find('#lr_custmerform_compont_list_' + dfop.id + ' .mCSB_container');
            $.each($.lrFormComponents, function (i, component) {
                var $component = component.init();
                $compontList.append($component);
            });
            $compontList.find('.lr-custmerform-component').draggable({
                connectToSortable: '#lr_custmerform_designer_layout_area_' + dfop.id + ' .mCSB_container',
                helper: "clone",
                revert: "invalid"
            });

            $('#lr_custmerform_designer_layout_area_' + dfop.id + ' .mCSB_container').sortable({
                opacity: 0.4,
                delay: 300,
                cursor: 'move',
                placeholder: "ui-state-highlight",
                stop: function (event, ui) {
                    var $compont = $(ui.item[0]);
                    var componttype = $compont.attr('data-type');
                    if (!!componttype) {//如果是第一次移入，需要对单元项进行初始化处理
                        var $designer = $compont.parents('.lr-custmerform-designer-layout');

                       
                        $compont.addClass('lr-compont-item').css({ 'width': '100%' });
                        $compont.removeClass('lr-custmerform-component');
                        $compont.removeAttr('data-type');
                        $.lrFormComponents[componttype].render($compont);
                        $compont[0].dfop.id = learun.newGuid();
                        $compont.trigger("click");
                    }
                    else {
                        $compont.trigger("click");
                    }
                },
                start: function (event, ui) {
                    $self.find(".lr-custmerform-designer-layout-center-bg").hide();
                    var $highlight = $self.find(".ui-state-highlight");
                    $highlight.html('拖放控件到这里');
                    var $compont = $(ui.item[0]);
                    var componttype = $compont.attr('data-type');
                    if (!componttype) {
                        $highlight.css({ width: ((100 / $compont[0].dfop.proportion) + "%") });
                    }
                },
                out: function (event, ui) {
                    if (ui.helper != null) {
                        var $componts = $('.lr-custmerform-designer-layout-area .mCSB_container .lr-compont-item');
                        if ($componts.length <= 1) {
                            if ($componts.length == 1) {
                                if ($componts.find('.lr-compont-value').length == 0) {
                                    $(".lr-custmerform-designer-layout-center-bg").show();
                                }
                            }
                            else {
                                $(".lr-custmerform-designer-layout-center-bg").show();
                            }
                        }
                    }
                }
            });
        },
        // 组件事件注册
        compontbind: function ($self) {
            $self.delegate('.lr-compont-item', 'click', function () {
                var $this = $(this);
                if (!$this.hasClass('active')) {
                    $('.lr-custmerform-designer-layout-area .mCSB_container .lr-compont-item').removeClass('active');
                    $this.addClass('active');
                    if ($('.lr-custmerform-designer-layout').css('padding-right') == '0px') {
                        $('.lr-custmerform-designer-layout').animate({ 'padding-right': '240px', speed: 2000 });
                        $('.lr-custmerform-designer-layout-right').animate({ right: 0, speed: 2000 });
                    }
                    setTimeout(function () {
                        $.lrFormComponents[$this[0].dfop.type].property($this);
                    }, 150);
                }
            });
            $self.delegate('.lr-compont-remove i', 'click', function () {
                var $compont = $(this).parents('.lr-compont-item');
                $compont.remove();
                if ($('.lr-custmerform-designer-layout-area .mCSB_container .lr-compont-item').length == 0) {
                    $('.lr-custmerform-designer-layout-right').animate({ right: '-240px', speed: 2000 });
                    $('.lr-custmerform-designer-layout').animate({ 'padding-right': '0px', speed: 2000 });
                    $(".lr-custmerform-designer-layout-center-bg").show();
                }
                else {
                    $('.lr-custmerform-designer-layout-area .mCSB_container .lr-compont-item').eq(0).trigger('click');
                }
            });
        },
        // 选项卡事件绑定
        tabbind: function ($self) {
            var dfop = $self[0]._lrCustmerFormDesigner.dfop;
            $self.delegate('#lr_custmerform_designer_tabs_' + dfop.id + ' ul>li', 'click', function () {
                var $this = $(this);
                if (!$this.hasClass('active')) {
                    var $parent = $this.parent();
                    var $self = $this.parents('.lr-custmerform-designer-layout');
                    var _dfop = $self[0]._lrCustmerFormDesigner.dfop;

                    $parent.find('.active').removeClass('active');
                    $this.addClass('active');
                    // 保存当前选项卡组件数据
                    $.lrCustmerFormDesigner.saveComponts($self);
                    // 切换到新的选项卡数据
                    _dfop._currentTabId = $this.attr('data-value');
                    for (var i = 0; i < _dfop.data.length; i++) {
                        var tabItem = _dfop.data[i];
                        if (_dfop._currentTabId == tabItem.id) {
                            _dfop._currentComponts = _dfop.data[i].componts;
                        }
                    }
                    _dfop._isRenderComponts = true;
                    $.lrCustmerFormDesigner.renderComponts($self);
                }
            });
        },
        // 渲染选项卡
        renderTabs: function ($self) {// 渲染选项卡
            var dfop = $self[0]._lrCustmerFormDesigner.dfop;
            var $tabs = $('#lr_custmerform_designer_tabs_' + dfop.id + ' ul');
            var tabsLength = dfop.data.length;
            var index = 0;
            $tabs.html("");
            for (var i = 0; i < tabsLength; i++) {
                var tabItem = dfop.data[i];
                $tabs.append('<li data-value="' + tabItem.id + '"><a>' + tabItem.text + '</a></li>');
                if (dfop._currentTabId == tabItem.id) {
                    index = i;
                }
            }
            // 获取当前选项卡的组件数据并渲染
            if (dfop._currentTabId != dfop.data[index].id) {
                dfop._currentTabId = dfop.data[index].id;
                dfop._currentComponts = dfop.data[index].componts;
                dfop._isRenderComponts = true;
                $.lrCustmerFormDesigner.renderComponts($self);
            }
            
            if (tabsLength <= 1) {
                $self.find('.lr-custmerform-designer-layout-center').removeClass('hasTab');
            }
            else {
                $self.find('.lr-custmerform-designer-layout-center').addClass('hasTab');
                $tabs.find('li').eq(index).addClass('active');
            }
        },
        // 渲染数据
        renderData: function ($self) {
            var dfop = $self[0]._lrCustmerFormDesigner.dfop;
            var $tabs = $('#lr_custmerform_designer_tabs_' + dfop.id + ' ul');
            var tabsLength = dfop.data.length;
            $tabs.html("");
            for (var i = 0; i < tabsLength; i++) {
                var tabItem = dfop.data[i];
                $tabs.append('<li data-value="' + tabItem.id + '"><a>' + tabItem.text + '</a></li>');
                if (i == 0) {
                    dfop._currentTabId = tabItem.id;
                    dfop._currentComponts = dfop.data[0].componts;
                    dfop._isRenderComponts = true;
                    $.lrCustmerFormDesigner.renderComponts($self);
                }
            }
            if (tabsLength <= 1) {
                $self.find('.lr-custmerform-designer-layout-center').removeClass('hasTab');
            }
            else {
                $self.find('.lr-custmerform-designer-layout-center').addClass('hasTab');
                $tabs.find('li').eq(0).addClass('active');
            }
        },
        // 保存当前选项卡的组件数据
        saveComponts: function ($self) {
            var dfop = $self[0]._lrCustmerFormDesigner.dfop;
            var componts = [];
            var compontsLayout = $('#lr_custmerform_designer_layout_area_' + dfop.id + ' .mCSB_container');
            compontsLayout.find('.lr-compont-item').each(function () {
                var compont = $(this)[0].dfop;
                componts.push(compont);
            });
            for (var i = 0, l = dfop.data.length; i < l; i++) {
                if (dfop.data[i].id == dfop._currentTabId) {
                    dfop.data[i].componts = componts;
                    break;
                }
            }
        },
        // 渲染组件
        renderComponts: function ($self) {
            var dfop = $self[0]._lrCustmerFormDesigner.dfop;
            if (dfop._isRenderComponts) {
                var compontsLayout = $('#lr_custmerform_designer_layout_area_' + dfop.id + ' .mCSB_container');
                compontsLayout.html('');
                if (dfop._currentComponts.length > 0) {
                    $self.find(".lr-custmerform-designer-layout-center-bg").hide();
                    for (var i = 0, l = dfop._currentComponts.length; i < l; i++) {
                        var compontItem = dfop._currentComponts[i];
                        var $compont = $('<div class="lr-compont-item" ></div>');
                        $compont[0].dfop = compontItem;
                        $compont.css({ 'width': 100 / parseInt(compontItem.proportion) + '%' });
                        $.lrFormComponents[compontItem.type].render($compont);

                        compontsLayout.append($compont);

                        if (i == 0) {
                            $compont.trigger("click");
                        }
                    }
                }
                else {
                    $('.lr-custmerform-designer-layout-right').animate({ right: '-240px', speed: 2000 });
                    $('.lr-custmerform-designer-layout').animate({ 'padding-right': '0px', speed: 2000 });
                    $(".lr-custmerform-designer-layout-center-bg").show();
                }
                dfop._isRenderComponts = false;
            }
        },
        // 更新绑定的数据表字段信息
        updatedb: function ($self, op) {
            var dfop = $self[0]._lrCustmerFormDesigner.dfop;
            if (dfop.dbId != op.dbId) {// 如果数据库改变,绑定字段数据重置
                dfop.dbId = op.dbId;
                for (var i = 0, l = dfop.data.length; i < l; i++) {
                    for (var j = 0, jl = dfop.data[i].componts.length; j < jl; j++) {
                        dfop.data[i].componts[j].table = '';
                        dfop.data[i].componts[j].field = '';
                    }
                }
            }
            else {
                for (var i = 0, l = dfop.dbTable.length; i < l; i++) {
                    var tablename = dfop.dbTable[i].name;
                    var flag = false;
                    for (var j = 0, jl = op.dbTable.length; i < jl; i++) {
                        if (op.dbTable[i].name == tablename) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        for (var i = 0, l = dfop.data.length; i < l; i++) {
                            for (var j = 0, jl = dfop.data[i].componts.length; j < jl; j++) {
                                if (dfop.data[i].componts[j].table == tablename) {
                                    dfop.data[i].componts[j].table = '';
                                    dfop.data[i].componts[j].field = '';
                                }
                            }
                        }
                    }
                }
            }
            dfop.dbTable = op.dbTable;
        },
        // 判定所有组件数据是否输入完整（主要是数据库绑定信息）
        validData: function ($self) {
            var dfop = $self[0]._lrCustmerFormDesigner.dfop;
            var _data = {};
            var res = true;
            for (var i = 0, l = dfop.data.length; i < l; i++) {
                for (var j = 0, jl = dfop.data[i].componts.length; j < jl; j++) {
                    if (dfop.data[i].componts[j].type != 'label') {
                        var table = dfop.data[i].componts[j].table;
                        var field = dfop.data[i].componts[j].field;
                        var title = dfop.data[i].componts[j].title;
                        if (table != '' && field != '') {
                            if (!!_data[table + '_' + field]) {
                                learun.alert.error('【' + title + '】绑定数据表字段与【' + _data[table + '_' + field] + '】重复！');
                                res = false;
                            }
                            else {
                                _data[table + '_' + field] = title;
                            }
                        }
                        else {
                            if (dfop.data[i].componts[j].type == 'girdtable') {
                                if (table == '') {
                                    learun.alert.error('【表格项】请绑定数据表！');
                                    res = false;
                                }
                            }
                            else {
                                learun.alert.error('【' + title + '】请绑定数据表！');
                                res = false;
                            }
                        }
                    }
                }
            }
            return res;
        }
    };

    //对外暴露接口
    $.fn.lrCustmerFormDesigner = function (type, op) {
        var $this = $(this);
        if (!$this.attr('id')) {
            return false;
        }
        switch (type) {
            // 初始化设计器
            case "init":
                $.lrCustmerFormDesigner.init($this, op);
                break;
            // 更新数据库绑定信息
            case 'updatedb':
                $.lrCustmerFormDesigner.updatedb($this, op);
                break;
            // 判定所有组件数据是否输入完整（主要是数据库绑定信息）
            case 'valid':
                $.lrCustmerFormDesigner.saveComponts($this);
                return $.lrCustmerFormDesigner.validData($this);
                break;
            case "get":
                $.lrCustmerFormDesigner.saveComponts($this);
                var dfop = $this[0]._lrCustmerFormDesigner.dfop;
                var res = {
                    dbId: dfop.dbId,
                    dbTable: dfop.dbTable,
                    data: dfop.data
                };
                return res;
                break;
            case "set":
                var dfop = $this[0]._lrCustmerFormDesigner.dfop;
                dfop.dbId = op.dbId;
                dfop.dbTable = op.dbTable;
                dfop.data = op.data;
                $.lrCustmerFormDesigner.renderData($this);
                break;
        }
    };

})(jQuery, top.learun);