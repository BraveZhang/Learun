(function () {
    var page = {
        isScroll: true,
        init: function ($page) {
            $page.find('#outloginbtn').on('tap', function () {
                learun.layer.confirm('确定要退出账号?', function (_index) {
                    if (_index === '1') {
                        learun.storage.set('logininfo', null);
                        learun.nav.go({ path: 'login', isBack: false, isHead: false });
                    }

                }, '', ['取消', '退出']);
            });

            $page.find('.lr-list-item-icon').on('tap', function () {
                var path ='my/' + $(this).attr('data-value');
                var title = $(this).text();
                learun.nav.go({ path: path, title: title, type: 'right' });
            });

        }
    };
    return page;
})();