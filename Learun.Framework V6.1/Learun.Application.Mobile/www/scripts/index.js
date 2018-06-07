// 有关“空白”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=397704
// 若要在 cordova-simulate 或 Android 设备/仿真器上在页面加载时调试代码: 启动应用，设置断点，
// 然后在 JavaScript 控制台中运行 "window.location.reload()"。
(function ($, learun) {
    "use strict";

    // 封装一层http请求，带上用户信息
    learun.httpget = function (url, data, callback) {
        var param = {};
        var logininfo = learun.storage.get('logininfo');
        param.token = logininfo.token;
        param.loginMark = learun.deviceId;
        var type = learun.type(data);
        if (type === 'object' || type === 'array') {
            param.data = JSON.stringify(data);
        }
        else if (type === 'string') {
            param.data = data;
        }

        return learun.http.get(url, param, callback);
    };
    learun.httppost = function (url, data, callback) {
        var param = {};
        var logininfo = learun.storage.get('logininfo');
        param.token = logininfo.token;
        param.loginMark = learun.deviceId;
        var type = learun.type(data);
        if (type === 'object' || type === 'array') {
            param.data = JSON.stringify(data);
        }
        else if (type === 'string') {
            param.data = data;
        }

        return learun.http.post(url, param, callback);
    };
    /*******************使用时异步获取*******************/
    var loadSate = {
        no: -1,  // 还未加载
        yes: 1,  // 已经加载成功
        ing: 0,  // 正在加载中
        fail: 2  // 加载失败
    };
    var clientAsyncData = {};
    learun.clientdata = {
        init: function () {
            clientAsyncData.company.init();
        },
        get: function (name, op) {//
            return clientAsyncData[name].get(op);
        },
        getAll: function (name, op) {//
            return clientAsyncData[name].getAll(op);
        }
    };
    // 公司信息
    clientAsyncData.company = {
        states: loadSate.no,
        init: function () {
            if (clientAsyncData.company.states == loadSate.no) {
                clientAsyncData.company.states = loadSate.ing;
                var data = learun.storage.get("companyData") || {};
                var ver = data.ver || "";
                learun.httpget(config.webapi + "learun/adms/company/map", { ver: ver }, function (res) {
                    if (res.code == 200) {
                        if (res.data.ver) {
                            learun.storage.set("companyData", res.data);
                        }
                        clientAsyncData.company.states = loadSate.yes;
                        clientAsyncData.department.init();
                    }
                    else {
                        clientAsyncData.company.states = loadSate.fail;
                    }
                });
            }
        },
        get: function (op) {
            clientAsyncData.company.init();
            if (clientAsyncData.company.states == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.company.get(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else {
                var data = learun.storage.get("companyData").data || {};
                op.callback(data[op.key] || {}, op);
            }
        },
        getAll: function (op) {
            if (clientAsyncData.company.states == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.company.getAll(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else {
                var data = learun.storage.get("companyData").data || {};
                op.callback(data, op);
            }
        }
    };
    // 部门信息
    clientAsyncData.department = {
        states: loadSate.no,
        init: function () {
            if (clientAsyncData.department.states == loadSate.no) {
                clientAsyncData.department.states = loadSate.ing;
                var data = learun.storage.get("departmentData") || {};
                var ver = data.ver || "";
                learun.httpget(config.webapi + "learun/adms/department/map", { ver: ver }, function (res) {
                    if (res.code == 200) {
                        if (res.data.ver) {
                            learun.storage.set("departmentData", res.data);
                        }
                        clientAsyncData.department.states = loadSate.yes;
                        clientAsyncData.user.init();
                    }
                    else {
                        clientAsyncData.department.states = loadSate.fail;
                    }
                });
            }
        },
        get: function (op) {
            clientAsyncData.department.init();
            if (clientAsyncData.department.states == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.department.get(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else {
                var data = learun.storage.get("departmentData").data || {};
                op.callback(data[op.key] || {}, op);
            }
        },
        getAll: function (op) {
            if (clientAsyncData.department.states == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.department.getAll(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else {
                var data = learun.storage.get("departmentData").data || {};
                op.callback(data, op);
            }
        }
    };
    // 人员信息
    clientAsyncData.user = {
        states: loadSate.no,
        init: function () {
            if (clientAsyncData.user.states == loadSate.no) {
                clientAsyncData.user.states = loadSate.ing;
                var data = learun.storage.get("userData") || {};
                var ver = data.ver || "";

                learun.httpget(config.webapi + "learun/adms/user/map", { ver: ver }, function (res) {

                    if (res.code == 200) {
                        if (res.data.ver) {
                            learun.storage.set("userData", res.data);
                        }
                        clientAsyncData.user.states = loadSate.yes;
                        clientAsyncData.dataItem.init();
                    }
                    else {
                        clientAsyncData.user.states = loadSate.fail;
                    }
                });
            }
        },
        get: function (op) {
            clientAsyncData.user.init();
            if (clientAsyncData.user.states == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.user.get(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else {
                var data = learun.storage.get("userData").data || {};
                op.callback(data[op.key] || {}, op);
            }
        },
        getAll: function (op) {
            if (clientAsyncData.user.states == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.user.getAll(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else {
                var data = learun.storage.get("userData").data || {};
                op.callback(data, op);
            }
        }
    };
    // 数据字典
    clientAsyncData.dataItem = {
        states: loadSate.no,
        init: function () {
            if (clientAsyncData.dataItem.states == loadSate.no) {
                clientAsyncData.dataItem.states = loadSate.ing;
                var data = learun.storage.get("dataItemData") || {};
                var ver = data.ver || "";
                learun.httpget(config.webapi + "learun/adms/dataitem/map", { ver: ver }, function (res) {
                    if (res.code == 200) {
                        if (res.data.ver) {
                            learun.storage.set("dataItemData", res.data);
                        }
                        clientAsyncData.dataItem.states = loadSate.yes;
                    }
                    else {
                        clientAsyncData.dataItem.states = loadSate.fail;
                    }
                });
            }
        },
        get: function (op) {
            clientAsyncData.dataItem.init();
            if (clientAsyncData.dataItem.states == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.dataItem.get(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else {
                var data = learun.storage.get("dataItemData").data || {};
                op.callback(clientAsyncData.dataItem.find(op.key, data[op.code] || {}) || {}, op);
            }
        },
        getAll: function (op) {
            if (clientAsyncData.dataItem.states == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.dataItem.getAll(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else {
                var data = learun.storage.get("dataItemData").data || {};
                op.callback(data[op.code] || {}, op);
            }
        },
        find: function (key, data) {
            var res = {};
            for (var id in data) {
                if (data[id].value == key) {
                    res = data[id];
                    break;
                }
            }
            return res;
        }
    };
    // 数据源数据
    clientAsyncData.sourceData = {
        states: {},
        get: function (op) {
            if (clientAsyncData.sourceData.states[op.code] == undefined || clientAsyncData.sourceData.states[op.code] == loadSate.no) {
                clientAsyncData.sourceData.states[op.code] = loadSate.ing;
                clientAsyncData.sourceData.load(op.code);
            }

            if (clientAsyncData.sourceData.states[op.code] == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.sourceData.get(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else {
                var data = learun.storage.get("sourceData_" + op.code).data || [];
                if (!!data) {
                    op.callback(clientAsyncData.sourceData.find(op.key, op.keyId, data) || {}, op);
                } else {
                    op.callback({}, op);
                }
            }
        },
        getAll: function (op) {
            if (clientAsyncData.sourceData.states[op.code] == undefined || clientAsyncData.sourceData.states[op.code] == loadSate.no) {
                clientAsyncData.sourceData.states[op.code] = loadSate.ing;
                clientAsyncData.sourceData.load(op.code);
            }

            if (clientAsyncData.sourceData.states[op.code] == loadSate.ing) {
                setTimeout(function () {
                    clientAsyncData.sourceData.getAll(op);
                }, 100);// 如果还在加载100ms后再检测
            }
            else if (clientAsyncData.sourceData.states[op.code] == loadSate.yes) {
                var data = learun.storage.get("sourceData_" + op.code).data || [];

                if (!!data) {
                    op.callback(data, op);
                } else {
                    op.callback({}, op);
                }
            }
        },
        load: function (code) {
            var data = learun.storage.get("sourceData_" + code) || {};
            var ver = data.ver || "";
            learun.httpget(config.webapi + "learun/adms/datasource/map", { code: code, ver: ver }, function (res) {
                if (res.code == 200) {
                    if (res.data.ver) {
                        learun.storage.set("sourceData_" + code, res.data);
                    }
                    clientAsyncData.sourceData.states[code] = loadSate.yes;
                }
                else {
                    clientAsyncData.sourceData.states[code] = loadSate.fail;
                }
            });
        },
        find: function (key, keyId, data) {
            var res = {};
            for (var i = 0, l = data.length; i < l; i++) {
                if (data[i][keyId] == key) {
                    res = data[i];
                    break;
                }
            }
            return res;
        }
    };
    // 获取单据编码
    learun.getRuleCode = function (code, callback) {
        learun.httpget(config.webapi + "learun/adms/coderule/code", code, function (res) {
            if (res.code === 200) {
                callback(res.data);
            }
            else {
                callback('');
            }
        });
    }

    // 初始化页面
    var tabdata = [
        {
            page: 'workspace',
            text: '工作区',
            icon: 'icon-appfill',
            fillicon: 'icon-app'
        },
        {
            page: 'my',
            text: '我的',
            icon: 'icon-people',
            fillicon: 'icon-peoplefill'
        }
    ];
    learun.init(function () {
        // 处理 Cordova 暂停并恢复事件
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        learun.tab.init(tabdata);

        var logininfo = learun.storage.get('logininfo');
        if (logininfo) {// 有登录的token
            learun.httpget(config.webapi + "learun/adms/user/info", logininfo.dataVersion, (res) => {
                if (res.code === 200) {
                    learun.storage.set('userinfo', res.data);
                    learun.tab.go('workspace');
                    learun.splashscreen.hide();
                    learun.clientdata.init();
                }
                else {
                    learun.storage.set('logininfo',null);
                    learun.nav.go({ path: 'login', isBack: false, isHead: false });
                    learun.splashscreen.hide();
                }                
            });
        }
        else {
            learun.nav.go({ path: 'login', isBack: false, isHead: false });
            learun.splashscreen.hide();
        }
    });

    function onPause() {
        // TODO: 此应用程序已挂起。在此处保存应用程序状态。
    };

    function onResume() {
        // TODO: 此应用程序已重新激活。在此处还原应用程序状态。
    };

})(window.jQuery, window.lrmui);