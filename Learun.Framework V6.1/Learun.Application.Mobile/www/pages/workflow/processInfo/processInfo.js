(function () {
    var processId = '';
    var taskId = '';

    var fieldMap = {};
    var formMap = {};
    var page = {
        isScroll: false,
        init: function ($page, param) {
            processId = param.processId || '';
            taskId = param.taskId || '';
            $page.find('.lr-processInfo-page').toptab(['表单信息', '流程信息']).each(function (index) {
                var $this = $(this);
                switch (index) {
                    case 0:
                        $this.html('<div class="container" id="processInfocontainer1"></div>');
                        break;
                    case 1:
                        $this.html('<div class="container" id="processInfocontainer2"></div>');
                        break;
                }
                $this = null;
            });
            processinfo(param);
        }
    };
    // 流程发起初始化
    function processinfo(_param) {
        var req = {
            processId: _param.processId,
            taskId: _param.taskId
        };
        learun.layer.loading(true, "获取流程信息");
        learun.httpget(config.webapi + "learun/adms/workflow/processinfo", req, (res) => {
            if (res.code == 200) {
                var flowdata = res.data;
                if (flowdata.status == 1) {// 流程数据加载成功
                    var wfForms = flowdata.data.currentNode.wfForms;// 表单数据
                    // 获取下关联字段
                    var formreq = [];
                    $.each(wfForms, function (_index, _item) {
                        fieldMap[_item.formId] = _item.field;
                        var point = {
                            schemeInfoId: _item.formId,
                            processIdName: _item.field,
                            keyValue: _param.processId,
                        }
                        formreq.push(point);
                    });

                    // 获取下自定义表单数据
                    learun.httpget(config.webapi + "learun/adms/form/data", formreq, (res) => {
                        if (res.code == 200) {// 加载表单
                            // 设置自定义表单数据
                            $.each(res.data, function (_id, _item) {
                                $.each(_item, function (_j, _jitem) {
                                    if (_jitem.length > 0) {
                                        formMap[_id] = true;
                                    }
                                });
                            });
                            $('#processInfocontainer1').custmerformSet(res.data);
                        }
                    });
                    $('#processInfocontainer1').custmerform(wfForms, 2);
                    // 加载流程信息
                    initTimeLine(flowdata.data.history);

                }
            }
            else {// 接口异常

            }
            learun.layer.loading(false);
        });
    }


    function initTimeLine(flowHistory) {
        var nodelist = [];
        for (var i = 0, l = flowHistory.length; i < l; i++) {
            var item = flowHistory[i];

            var content = '';
            if (item.F_Result == 1) {
                content += '通过';
            }
            else {
                content += '不通过';
            }
            if (item.F_Description) {
                content += '【备注】' + item.F_Description;
            }

            var point = {
                title: item.F_NodeName,
                people: item.F_CreateUserName + ':',
                content: content,
                time: item.F_CreateDate
            };
            nodelist.push(point);
        }
        $('#processInfocontainer2').ftimeline(nodelist);
    }


    return page;
})();