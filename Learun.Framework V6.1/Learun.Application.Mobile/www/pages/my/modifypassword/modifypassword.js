(function () {
    var page = {
        isScroll: true,
        init: function ($page) {
            $page.find('#savepassword').on('tap', function () {
                if (!$('#modifypasswordform').lrformValid()) {
                    return false;
                }
                var formdata = $('#modifypasswordform').lrformGet();
                if (formdata.newpassword1 === formdata.newpassword) {

                    var req = {
                        newpassword: $.md5(formdata.newpassword),
                        oldpassword: $.md5(formdata.oldpassword)
                    };
                    learun.layer.loading(true);
                    // 访问后台修改密码
                    learun.httppost(config.webapi + "learun/adms/user/modifypw", req, (res) => {
                        learun.layer.loading(false);
                        setTimeout(function () {
                            learun.layer.toast(res.info);
                        }, 100);
                        if (res.code === 200) {// 表单数据保存成功，发起流程
                            learun.storage.set('logininfo', null);
                            learun.nav.go({ path: 'login', isBack: false, isHead: false });
                        }
                    });
                }
                else {
                    learun.layer.toast('二次输入密码不同');
                }
            });
        }
    };
    return page;
})();