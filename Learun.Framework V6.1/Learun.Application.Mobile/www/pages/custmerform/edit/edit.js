(function () {
    var keyvalue = '';
    var formId = '';

    var fieldMap = {};
    var formMap = {};
    var page = {
        isScroll: false,
        init: function ($page, param) {
            keyvalue = param.keyvalue;
            formId = param.formId;
            var formscheme = param.formscheme;
            $('#custmerpage_container').custmerform([formId], 2, formscheme);            

            if (!!keyvalue) {
                // 获取下自定义表单数据
                learun.httpget(config.webapi + "learun/adms/form/data", [{ schemeInfoId: formId, keyValue: keyvalue }], (res) => {
                    if (res.code == 200) {// 加载表单
                        // 设置自定义表单数据
                        $('#custmerpage_container').custmerformSet(res.data);
                    }
                });
            }

            // 提交数据
            $page.find('#custmerpage_save').on('tap', function () {
                
                var formData = $('#custmerpage_container').custmerformGet();
                if (formData == null) {
                    return false;
                }
                learun.layer.loading(true, "正在提交数据");
                var formreq = [];
                for (var id in formData) {
                    var point = {
                        schemeInfoId: formId,
                        keyValue: keyvalue,
                        formData: JSON.stringify(formData[id])
                    }
                    formreq.push(point);
                }
                learun.httppost(config.webapi + "learun/adms/form/save", formreq, (res) => {
                    if (res.code == 200) {// 表单数据保存成功，发起流程
                        var prepage = learun.nav.getpage('custmerform');
                        prepage.listView.reload();


                        learun.nav.closeCurrent();
                    }
                    learun.layer.loading(false);
                });
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
                }
            }
            else {// 接口异常

            }
            learun.layer.loading(false);
        });
    }
    return page;
})();