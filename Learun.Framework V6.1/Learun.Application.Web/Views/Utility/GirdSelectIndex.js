/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.11
 * 描 述：数据列表选择	
 */
var dfopid = request('dfopid');
var acceptClick;

var bootstrap = function ($, learun) {
    "use strict";
    var selectItem;

    function loadData(_dfop) {
        if (_dfop._loaded) {
            console.log(_dfop._data);
            $('#girdtable').jfGridSet('refreshdata', { rowdatas: _dfop._data });
        }
        else {
            setTimeout(function () {
                loadData(_dfop);
            }, 100);
        }
    }

    var page = {
        init: function () {
            page.bind();
        },
        bind: function () {
            var dfop = top.lrGirdSelect[dfopid];
            $('#btn_Search').on('click', function () {
                var keyword = $('#txt_Keyword').val();
                if (dfop._loaded) {
                    if (!!keyword) {
                        var _data = [];
                        $.each(dfop._data, function (id, item) {
                            if (item[dfop.selectWord].indexOf(keyword) != -1) {
                                _data.push(item);
                            }
                        });
                        $('#girdtable').jfGridSet('refreshdata', { rowdatas: _data });
                    }
                    else {
                        $('#girdtable').jfGridSet('refreshdata', { rowdatas: dfop._data });
                    }
                }
            });
            $('#girdtable').jfGrid({
                headData: dfop.headData,
                mainId: 'F_Id',
                onSelectRow: function (row) {
                    selectItem = row;
                }
            });
            loadData(dfop);
        }
    };
    // 保存数据
    acceptClick = function (callBack) {
        callBack(selectItem, dfopid);
        return true;
    };
    page.init();
}