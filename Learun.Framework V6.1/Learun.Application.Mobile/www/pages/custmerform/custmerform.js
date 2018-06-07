(function () {
    var formId = '';
    var appscheme =null;
    var formscheme;
    var loadFormScheme = function(){
    };

    var page = {
        isScroll: false,
        listView:null,
        init: function ($page, pageparam) {
            // 获取参数
            formId = pageparam.formId;
            appscheme = JSON.parse(pageparam.scheme);



            // 获取自定义表单模板
            learun.custmerform.loadScheme([formId], function (scheme) {
                formscheme = scheme;
                $page.find('#custmerformfn_addbtn').on('tap', function () {
                    learun.nav.go({ path: 'custmerform/edit', title: '新增', type: 'right', param: { formscheme: formscheme, formId: formId } });
                });
                initList($page, formscheme);
            });
           
        }
    };

    var mainTablePk = "";
    var mainTable = "";
    var mainCompontId = "";
    function initList($page, formscheme) {
        var formSchemeObj = JSON.parse(formscheme[formId]);
        for (var i = 0, l = formSchemeObj.dbTable.length; i < l; i++) {
            var tabledata = formSchemeObj.dbTable[i];
            if (tabledata.relationName == "") {
                mainTable = tabledata.name;
                mainTablePk = tabledata.field;
            }
        }
        var compontMap = {};
        var tableMap = {};
        var tableIndex = 0;

        for (var i = 0, l = formSchemeObj.data.length; i < l; i++) {
            var componts = formSchemeObj.data[i].componts;
            for (var j = 0, jl = componts.length; j < jl; j++) {
                var item = componts[j];
                // 设置表对应标号
                if (!!item.table && tableMap[item.table] == undefined) {
                    tableMap[item.table] = tableIndex;
                    tableIndex++;
                }

                if (mainTable == item.table && mainTablePk == item.field) {
                    mainCompontId = item.field + tableMap[item.table];
                }
                compontMap[item.id] = item;
            }
        }

        page.listView = $page.find('#custmerformfn').lrpagination({
            lclass: "lr-list lr-custmer-list",
            rows: 10,                            // 每页行数
            getData: function (param, callback) {// 获取数据 param 分页参数,callback 异步回调
                var getParam = {
                    pagination: {
                        rows: param.rows,
                        page: param.page,
                        sidx: mainCompontId.toLowerCase(),
                        sord: 'ASC'
                    },
                    queryJson: '{}',
                    formId: formId
                }
                learun.httpget(config.webapi + "learun/adms/custmer/pagelist", getParam, (res) => {
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
            renderData: function (_index, _item, $item) {// 渲染数据模板
                var title = appscheme.title.split(',');

                var content0 = compontMap[appscheme.content[0]];
                var content1 = compontMap[appscheme.content[1]];
                var content2 = compontMap[appscheme.content[2]];

                var _html = '<div class="lr-list-item">\
                                <div class="title" >\
                                </div >\
                                <div class="content">\
                                    <div class="one"><div><span class="lr-tag"></span>'+ content0.title + '</div><div class="text"></div></div>\
                                    <div class="two"><div><span class="lr-tag"></span>'+ content1.title + '</div><div class="text"></div></div>\
                                    <div class="three"><div><span class="lr-tag"></span>'+ content2.title +'</div><div class="text"></div></div>\
                                </div>\
                            </div>';
                $item.append(_html);

                var _$title = $item.find('.title');
                var _$one = $item.find('.one>.text');
                var _$two = $item.find('.two>.text');
                var _$three = $item.find('.three>.text');

                getText(content0, _item[(content0.field + tableMap[content0.table]).toLowerCase()] || '', _$one);
                getText(content1, _item[(content1.field + tableMap[content1.table]).toLowerCase()] || '', _$two);
                getText(content2, _item[(content2.field + tableMap[content2.table]).toLowerCase()] || '', _$three);
                
                var titleText = '';
                $.each(title, function (_index, _jitem) {
                    var _citem = compontMap[_jitem];
                    var $span = $('<span></span>');
                    getText(_citem, _item[(_citem.field + tableMap[_citem.table]).toLowerCase()] || '', $span);
                    _$title.append($span);
                });
                return '';
            },
            click: function (item, $item) {// 列表行点击事件
                learun.nav.go({ path: 'custmerform/edit', title: '新增', type: 'right', param: { formscheme: formscheme, formId: formId, keyvalue: item[mainCompontId.toLowerCase()] } });
            }
        });

        function getText(conpontItem, value, $div) {
            if (!conpontItem)
            { return; }
            switch (conpontItem.type) {
                case 'checkbox':
                    var v = value.split(',');
                    $.each(v, function (_index, _item) {
                        if (conpontItem.dataSource == "0") {
                            learun.clientdata.get('dataItem', {
                                key: _item,
                                code: conpontItem.itemCode,
                                callback: function (_data) {
                                    $div.append(_data.text);
                                }
                            });
                        }
                        else {
                            var vlist = conpontItem.dataSourceId.split(',');
                            learun.clientdata.get('sourceData', {
                                key: _item,
                                code: vlist[2],
                                callback: function (_data) {
                                    $div.append(_data[vlist[1]]);
                                }
                            });
                        }
                    });
                    break;
                case 'radio':
                case 'select':
                    if (conpontItem.dataSource == "0") {
                        learun.clientdata.get('dataItem', {
                            key: value,
                            code: conpontItem.itemCode,
                            callback: function (_data) {
                                $div.append(_data.text);
                            }
                        });
                    }
                    else {
                        var vlist = conpontItem.dataSourceId.split(',');
                        learun.clientdata.get('sourceData', {
                            key: value,
                            code: vlist[2],
                            callback: function (_data) {
                                $div.append(_data[vlist[1]]);
                            }
                        });
                    }
                    break;
                case 'organize':
                case 'currentInfo':
                    learun.clientdata.get(conpontItem.dataType, {
                        key: value,
                        callback: function (_data) {
                            $div.append(_data.name);
                        }
                    });
                    break;
                case 'datetime':
                    if (conpontItem.dateformat == '0') {
                        $div.append(learun.date.format(value, 'yyyy-MM-dd'));
                    }
                    else {
                        $div.append(learun.date.format(value, 'yyyy-MM-dd hh:mm'));
                    }
                    break;
                default:
                    $div.append(value);
                    break;
            }
        }
    }

    return page;
})();