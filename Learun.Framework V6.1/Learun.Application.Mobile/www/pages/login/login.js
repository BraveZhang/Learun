(function () {
    var page = {
        init: function ($page) {
            $page.find('#loginBtn').on('tap', function () {
                var account = $('#account').val();
                var password = $('#password').val();
                
                if (account === "") {
                    learun.layer.warning('用户名不能为空！', function () { }, '力软提示', '关闭');
                } else if (password === "") {
                    learun.layer.warning('密码不能为空！', function () { }, '力软提示', '关闭');
                } else {
                    var data = {
                        username: account,
                        password: $.md5(password)
                    }
                    var postdata = {
                        token: '',
                        loginMark: learun.deviceId,// 正式请换用设备号
                        data: JSON.stringify(data)
                    }
                    var path = config.webapi;
                    learun.layer.loading(true, "正在登录，请稍后");
                    learun.http.post(path + "learun/adms/user/login", postdata, (res) => {
                        learun.layer.loading(false);
                        if (res.code === 200) {
                            var logininfo = {
                                account: account,
                                token: res.data.baseinfo.token,
                                date: learun.date.format(new Date(),'yyyy-MM-dd hh:mm:ss')
                            };
                            learun.storage.set('logininfo', logininfo);
                            learun.storage.set('userinfo', res.data);
                            learun.clientdata.init();
                            learun.tab.go('workspace');
                        } else {
                            learun.layer.warning(res.info, function () { }, '力软提示', '关闭');
                        }
                    });
                } 
            });


        }
    };
    return page;
})();
