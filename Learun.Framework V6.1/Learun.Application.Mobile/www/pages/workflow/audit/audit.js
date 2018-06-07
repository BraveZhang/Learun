(function () {
    var processId = '';
    var taskId = '';

    var fieldMap = {};
    var formMap = {};
    var page = {
        isScroll: false,
        init: function ($page, param) {
            $page.find('.lr-audit-page').toptab(['表单信息', '流程信息']).each(function (index) {
                var $this = $(this);
                switch (index) {
                    case 0:
                        $this.html('<div class="formcontainer" ><div class="container" id="auditcontainer"></div>\
                            <div class="lr-form-btn" >\
                                <button type="button" class="lr-btn-primary lr-btn-block" id="auditbtn">审核</button>\
                            </div ></div>');
                        break;
                    case 1:
                        $this.html('<div class="container" id="auditcontainer2"></div>');
                        break;
                }
                $this = null;
            });



            processId = param.processId;
            taskId = param.taskId;
            taskinfo(param);

            // 提交流程
            $page.find('#auditbtn').on('tap', function () {
                var des = $('#lrflowworkdes').text();
                var verify = $('#lrflowworkverify').lrpickerGet();
                if (!!verify) {
                     // 保存表单数据
                    var formData = $('#auditcontainer').custmerformGet();

                    if (formData == null) {
                        return false;
                    }

                    var formreq = [];
                    var formAllData = {};
                    for (var id in formData) {
                        if (!fieldMap[id]) {
                            learun.layer.warning('未设置流程表单关联字段！', function () { }, '力软提示', '关闭');
                            return false;
                        }
                        $.extend(formAllData, formData[id]);

                        if (!formMap[id]) {
                            formData[id][fieldMap[id]] = processId;
                        }
                     

                        var point = {
                            schemeInfoId: id,
                            processIdName: fieldMap[id],
                            //keyValue: processId,
                            formData: JSON.stringify(formData[id])
                        }

                        if (formMap[id]) {
                            point.keyValue = processId;
                        }

                        formreq.push(point);
                    }


                    learun.layer.loading(true, "正在提交数据");
                    learun.httppost(config.webapi + "learun/adms/form/save", formreq, (res) => {
                        if (res.code == 200) {// 表单数据保存成功，发起流程
                            var flowreq = {
                                taskId: taskId,
                                verifyType: verify,
                                description: des,
                                formData: JSON.stringify(formAllData)
                            };
                            learun.httppost(config.webapi + "learun/adms/workflow/audit", flowreq, (res) => {
                                var prepage = learun.nav.getpage('workflow/mytaskinfo');
                                prepage.listView.reload();

                                learun.nav.closeCurrent();

                              
                            });
                        }
                        learun.layer.loading(false);
                    });
                }
                else {
                    learun.layer.warning('请选择审核结果！', function () { }, '力软提示', '关闭');
                }
            });
        }
    };
    // 流程发起初始化
    function taskinfo(_param) {
        var req = {
            processId: _param.processId,
            taskId: _param.taskId
        };
        learun.layer.loading(true, "获取流程信息");
        learun.httpget(config.webapi + "learun/adms/workflow/taskinfo", req, (res) => {
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
                            $('#auditcontainer').custmerformSet(res.data);

                        }
                    });

                    $('#auditcontainer').custmerform(wfForms, 1);

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
        $('#auditcontainer2').ftimeline(nodelist);
    }

    return page;
})();