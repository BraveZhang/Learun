(function () {
    var processId = '';
    var fieldMap = {};
    var schemeCode = '';

    var page = {
        isScroll: false,
        init: function ($page, param) {
            processId = param.processId;
            schemeCode = param.schemeCode;
            // 初始化
            switch (param.type) { // 操作类型 0.创建 1.审批 2.重新创建 3.确认阅读 4.加签 100 流程进度查看
                case 0: // 
                    processId = learun.guid('-');
                    bootstraper(param);
                    break;
            }

            // 提交流程
            $('#taskformbtn').on('tap', function () {
                var des = $('#lrflowworkdes').text();
                // 保存表单数据
                var formData = $('#taskformcontainer').custmerformGet();
                if (formData === null) {
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
                    formData[id][fieldMap[id]] = processId;

                    var point = {
                        schemeInfoId: id,
                        processIdName: fieldMap[id],
                        keyValue: '',
                        formData: JSON.stringify(formData[id])
                    }

                   
                    formreq.push(point);
                }


                learun.layer.loading(true, "正在提交数据");
                learun.httppost(config.webapi + "learun/adms/form/save", formreq, (res) => {
                    if (res.code === 200) {// 表单数据保存成功，发起流程

                        var flowreq = {
                            isNew: true,
                            processId: processId,
                            schemeCode: schemeCode,
                            processName: $('#lrflowworktitle').val(),
                            processLevel: 0,
                            description: des,
                            formData: JSON.stringify(formAllData)
                        };

                        learun.httppost(config.webapi + "learun/adms/workflow/create", flowreq, (res) => {
                            if (res.code === 200) {
                                learun.layer.loading(false);
                            }
                            else {// 接口异常

                            }
                            learun.nav.closeCurrent();
                        });
                    }
                    else {// 接口异常

                    }
                    learun.layer.loading(false);
                });
            });

        }
    };
    // 流程发起初始化
    function bootstraper(_param) {
        var req = {
            isNew: _param.type === 0 ? true : false,
            processId: processId,
            schemeCode: _param.schemeCode
        };
        learun.layer.loading(true, "获取流程模板信息");
        learun.httpget(config.webapi + "learun/adms/workflow/bootstraper", req, (res) => {
            if (res.code === 200) {
                var flowdata = res.data;
                if (flowdata.status === 1) {// 流程数据加载成功
                    var wfForms = flowdata.data.currentNode.wfForms;// 表单数据
                    // 获取下关联字段
                    $.each(wfForms, function (_index, _item) {
                        fieldMap[_item.formId] = _item.field;
                    });
                    $('#taskformcontainer').custmerform(wfForms, 0);
                }
            }
            else {// 接口异常
            
            }
            learun.layer.loading(false);
        });
    }

    return page;
})();