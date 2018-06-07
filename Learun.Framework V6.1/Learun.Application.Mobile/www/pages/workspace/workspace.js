(function () {
    var colors = ['bgcblue1', 'bgcblue2', 'bgcyellow', 'bgcorange', 'bgcpink', 'bgccyan', 'bgcpurple'];

    var custmerform = {};

    var page = {
        isScroll: true,
        init: function ($page) {
            learun.layer.loading(true, "正在获取功能列表");


            // 常见任务点击事件
            $page.find('#commonapp .appitem').on('tap', function () {
                var $this = $(this);
                var value = $this.attr('data-value');
                var title = $this.find('span').text();
                learun.nav.go({ path: 'workflow/' + value, title: title, type: 'right' });
            });
            // 常见任务点击事件
            $page.find('#crmapp .appitem').on('tap', function () {
                var $this = $(this);
                var value = $this.attr('data-value');
                var title = $this.find('span').text();
                learun.nav.go({ path: 'crm/' + value, title: title, type: 'right' });
            });

            // 加载功能列表
            learun.httpget(config.webapi + "learun/adms/clinet/module", null, (res) => {
                if (res === null) {
                    return;
                }
                if (res.code === 200) {
                    if (res.data.custmerform.length > 0) {
                        var $this = $('.appbox');
                        $this.append(' <div class="title">自定义功能</div>');
                        var _html = '<div class="applist" id="custmerlist">';
                        $.each(res.data.custmerform, function (_index, _item) {
                            var colorindex = _index % 7;
                            custmerform[_item.F_FormId] = _item.F_Scheme;
                            _html += '<div class="appitem" data-value="' + _item.F_FormId + '" ><div class="' + colors[colorindex] + '" > <i class="iconfont ' + _item.F_Icon + '"></i></div ><span>' + _item.F_Name + '</span></div >';
                        });
                        _html += '</div>';
                        $this.append(_html);

                        $('#custmerlist .appitem').on('tap', function () {
                            var $this = $(this);
                            var value = $this.attr('data-value');
                            var title = $this.find('span').text();
                            learun.nav.go({ path: 'custmerform', title: title, type: 'right', param: { formId: value, scheme: custmerform[value] } });
                        });
                    }


                    if (res.data.wflist.length > 0) {
                        var $this = $('.appbox');
                        $this.append(' <div class="title">任务流程</div>');
                        var _html = '<div class="applist" id="workflowshcemelist">';
                        $.each(res.data.wflist, function (_index, _item) {
                            var colorindex = _index % 7;
                            _html += '<div class="appitem" data-value="' + _item.F_Code+'" ><div class="' + colors[colorindex] + '" > <i class="iconfont icon-news_hot_light"></i></div ><span>' + _item.F_Name + '</span></div >';
                        });
                        _html += '</div>';
                        $this.append(_html);

                        $('#workflowshcemelist .appitem').on('tap', function () {
                            var $this = $(this);
                            var value = $this.attr('data-value');
                            var title = $this.find('span').text();
                            learun.nav.go({ path: 'workflow/taskform', title: title, type: 'right', param: { schemeCode: value, type: 0 } });
                        });
                    }



                }

                learun.layer.loading(false);
            });

        }
    };
    return page;
})();