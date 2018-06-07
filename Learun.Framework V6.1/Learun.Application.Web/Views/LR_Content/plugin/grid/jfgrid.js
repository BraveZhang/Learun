(function ($, learun) {
    "use strict";
    // 初始化表头数据
    var headDataInit = function (data, parent, headData, cols, frozenCols) {
        $.each(data, function (_index, _item) {//_item:label/name/width/align/frozen
            //设置列表头数据
            var col = {
                data: _item,
                height: 28,
                width: _item.width || 100,
                top: 0,
                left: 0,
                frozen: false
            };
            // 判断是否是固定列
            if (_item.frozen || parent.frozen) {
                col.frozen = true;
            }
            // 判断所在位置y坐标

            // 判断所在位置x坐标

            headData.push(col);

            if (col.frozen) {
                if (!_item.children) {
                    frozenCols.push(_item);
                }
                else {

                }
              
            }
            else {
                if (!_item.children) {
                    cols.push(_item);
                }
                else {

                }
            }

        });
    }

    var _jfgrid = {
        init: function ($self, op) {
            $self.html('');
            $self.addClass('jfgrid-layout');

            _jfgrid.head($self, op);

            op = null;
            return;

          

            $.jfGrid.renderHead($self);
            $.jfGrid.renderBorder($self);
            $.jfGrid.renderLeft($self);
            $.jfGrid.renderScorllArea($self);
            $.jfGrid.renderPageBarinit($self);

            $.jfGrid.renderFooterrow($self);
            $.jfGrid.renderToolBar($self);



            $self.append('<div class="jfgrid-move-line" id="jfgrid_move_line_' + $self[0].dfop.id + '"  ></div>');// 调整宽度线条
            $self.append('<div class="jfgrid-nodata-img" id="jfgrid_nodata_img_' + $self[0].dfop.id + '"  ></div>');// 调整宽度线条
            $self.append('<div class="jfgrid-loading" id="jfgrid_loading_' + $self[0].dfop.id + '"  ><div class="bg"></div><div class="img">正在拼命加载列表数据…</div></div>');// 调整宽度线条


            // 注册整体事件
            $self.on('mousedown', $.jfGrid.bindmdown);
            $self.on('click', $.jfGrid.bindClick);
            $self.mousemove($.jfGrid.bindmmove);
            $self.on('mouseover', $.jfGrid.bindmover);

            // 加载数据
            if (!!dfop.rowdatas && !dfop.url) {
                if (dfop.isEidt && dfop.rowdatas.length == 0) {
                    dfop.rowdatas.push({});// 
                }
                $.jfGrid.renderData($self);
            }

            $self.css({ 'min-height': dfop.minheight });
            if (dfop.height > 0) {
                $self.css({ 'height': dfop.height });
            }

            dfop = null;
            return;
        },

        
        head: function ($self, op) {
            op.running.headWidth = 0;
            op.running.headHeight = 0;
            op.running.leftWidth = 0;

            op.running.cols = [];
            op.running.frozenCols = [];
            op.running.headData = [];

            $.each(op.headData, function (_index, _item) {//_item:label/name/width/align/frozen
                //设置列表头数据
                var col = {
                    data: _item,
                    height: 28,
                    width: _item.width || 100,

                };



            });


            return;


            dfop._headWidth = 0;
            dfop._leftWidth = 0;
            dfop._headHeight = 0;
            dfop._colModel = [];
            dfop._colFrozenModel = [];

            var $head = $('<div class="jfgrid-head" id="jfgrid_head_' + dfop.id + '" ></div>');
            var $border = $('<div class="jfgrid-border" id="jfgrid_border_' + dfop.id + '" ></div>');
            var $borderCol = $('<div class="jfgrid-border-col" id="jfgrid_border_col_' + dfop.id + '" ></div>');

            var len = dfop.headData.length;
            for (var i = 0; i < len; i++) {
                var cell = dfop.headData[i];
                var left = cell.frozen ? dfop._leftWidth : dfop._headWidth;
                cell.height = 28;
                var $cell = $('<div class="jfgrid-head-cell jfgrid-heed-rownum_0" path="' + i + '" >' + (cell.label || "") + '</div>');
                cell.obj = $cell;
                cell.path = i;
                if (!!cell.children) {// 如果有子列
                    if (cell.frozen) {
                        $.jfGrid.renderSubHead($borderCol, cell, dfop, dfop._leftWidth, 1, true, i);
                    }
                    else {
                        $.jfGrid.renderSubHead($head, cell, dfop, dfop._headWidth, 1, false, i);
                    }
                }
                else {
                    $cell.attr('jfgrid-heed-cellrender', 'ok');
                    $cell.append('<div class="jfgrid-heed-sort"><i class="fa fa-caret-up"></i><i class="fa fa-caret-down"></i></div>');
                    $cell.append('<div class="jfgrid-heed-move"></div>');
                    if (cell.frozen) {
                        dfop._colFrozenModel[dfop._colFrozenModel.length] = cell;
                    } else {
                        dfop._colModel[dfop._colModel.length] = cell;
                    }
                    cell.type = 'datacol';
                }
                cell.left = left;
                $cell.css({ 'width': ((cell.width || 100) + 'px'), 'text-align': (cell.align || 'left'), 'left': (left + 'px') });
                dfop._headHeight = dfop._headHeight > cell.height ? dfop._headHeight : cell.height;
                if (cell.frozen) {
                    dfop._leftWidth += cell.width;
                    $borderCol.append($cell);
                } else {
                    dfop._headWidth += cell.width;
                    $head.append($cell);
                }
            }
            if (dfop._headHeight > 28) {
                $head.find('.jfgrid-heed-rownum_0[jfgrid-heed-cellrender="ok"]').css({
                    'height': (dfop._headHeight + 'px'),
                    'line-height': ((dfop._headHeight - 1) + 'px')
                });
                $borderCol.find('.jfgrid-heed-rownum_0[jfgrid-heed-cellrender="ok"]').css({
                    'height': (dfop._headHeight + 'px'),
                    'line-height': ((dfop._headHeight - 1) + 'px')
                });
                for (var j = 0; j < len; j++) {
                    var cell = dfop.headData[j];
                    if (!!cell.children && cell.height < dfop._headHeight) {
                        if (!!cell.children) {
                            $.jfGrid.renderSubHeadToo(cell.children, dfop._headHeight - cell.height);
                        }
                        else {
                            cell.obj.css({
                                'height': (dfop._headHeight - cell.height + 28 + 'px'),
                                'line-height': ((dfop._headHeight - cell.height + 27) + 'px')
                            });
                        }
                    }
                }
            }
            $border.append($borderCol);
            $self.append($border);
            $self.append($head);

            dfop = null;
        }
    };

    $.fn.jfgrid = function (op) {
        var $self = $(this);
        if (!$self[0] || $self[0].dfop) {
            return $self;
        }

        var id = $self.attr('id');
        if (id == null || id == undefined || id == '') {
            id = "jfgrid" + new Date().getTime();
            $self.attr('id', id);
        }

        var dfop = {
            url: '',                      // 数据服务地址
            param: {},                    // 请求参数
            rowdatas: [],                 // 列表数据
            datatype: 'array',            // 数据类型

            headData: [],                 // 列数据

            isShowNum: true,              // 是否显示序号
            isMultiselect: false,         // 是否允许多选
            multiselectfield: '',         // 多选绑定字段

            isSubGrid: false,             // 是否有子表
            subGridRowExpanded: false,    // 子表展开后调用函数
            subGridHeight: 300,

            onSelectRow: false,           // 选中一行后回调函数
            onRenderComplete: false,      // 表格加载完后调用

            isPage: false,                // 是否分页默认是不分页（目前只支持服务端分页）
            pageparam: {
                rows: 50,                 // 每页行数      
                page: 1,                  // 当前页
                sidx: '',                 // 排序列
                sord: '',                 // 排序类型
                records: 0,               // 总记录数
                total: 0                  // 总页数
            },
            sidx: '',
            sord: 'ASC',


            isTree: false,                // 是否树形显示（没有分页的情况下才支持） (只有在数据不多情况下才建议使用)
            mainId: 'id',                 // 关联的主键
            parentId: 'parentId',         // 树形关联字段

            reloadSelected: false,        // 刷新后是否还选择之前选中的,只支持单选

            isAutoHeight: false,          // 自动适应表格高度
            footerrow: false,             // 底部合计条

            isEidt: false,
            minheight: 0,
            height: 0,
            isStatistics: false            // 统计条

        };
        if (!!op) {
            $.extend(dfop, op);
        }
        dfop.id = id;
        $self[0].dfop = dfop;
        dfop.pageparam.sidx = dfop.sidx;
        dfop.pageparam.sord = dfop.sord;
        dfop.running = {};
        _jfgrid.init($self, dfop);

        dfop = null;
        return $self;
    };

})(window.jQuery, top.learun)