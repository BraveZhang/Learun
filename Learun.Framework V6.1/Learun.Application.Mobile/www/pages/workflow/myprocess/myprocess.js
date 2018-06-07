(function () {
    var page = {
        isScroll: false,
        init: function ($page) {
            var pageobj = $('#myprocess').lrpagination({
                lclass: "lr-list lr-flow-list",
                rows: 10,                            // 每页行数
                getData: function (param, callback) {// 获取数据 param 分页参数,callback 异步回调
                    var getParam = {
                        pagination: {
                            rows: param.rows,
                            page: param.page,
                            sidx: 'F_CreateDate',
                            sord:'DESC'
                        },
                        queryJson: '{}'
                    }
                    learun.httpget(config.webapi + "learun/adms/workflow/mylist", getParam, (res) => {
                        if (res == null) {
                            callback([], 0);
                            return false;
                        }

                        if (res.code == 200) {
                            callback(res.data.rows, parseInt(res.data.records));
                        }
                        else {
                            learun.layer.warning('数据加载失败,请重新刷新！', function () { }, '力软提示', '关闭');
                            callback([], 0);
                        }
                    });
                },
                renderData: function (_index, _item) {// 渲染数据模板
                    var levelText = '';
                    var levelbg = '';
                    switch (_item.F_ProcessLevel) {
                        case 0:
                            levelText = '普通';
                            levelbg = 'bgcblue1';
                            break;
                        case 1:
                            levelText = '重要';
                            levelbg = 'bgcyellow';
                            break;
                        case 2:
                            levelText = '紧急';
                            levelbg = 'bgcpink';
                            break;
                    }
                    statusText = '待审批';
                    if (_item.F_IsFinished == 1) {
                        statusText = '结束';
                    }
                    else if (_item.F_EnabledMark != 1) {
                        statusText = '暂停';
                    }
                    var _html ='<div class="lr-list-item">\
                                    <div class="left" >\
                                        <span class="circle '+ levelbg + '">' + levelText +'</span>\
                                    </div >\
                                    <div class="middle">\
                                        <div class="title">'+ _item.F_ProcessName +'</div>\
                                        <div class="text">'+ _item.F_SchemeName + '</div>\
                                        <div class="status">'+ statusText +'</div>\
                                    </div>\
                                    <div class="right">'+ learun.date.format(_item.F_CreateDate, 'yyyy-MM-dd') +'</div>\
                                </div>';
                    return _html;
                },
                click: function (item, $item) {// 列表行点击事件
                    learun.nav.go({ path: 'workflow/processInfo', title: item.F_ProcessName, type: 'right', param: { processId: item.F_Id} });
                }
            });
        }
    };
    return page;
})();