/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.03.16
 * 描 述：window窗口皮肤	
 */
var bootstrap = function ($, learun) {
    "use strict";

    var color = ["2e99d4", "fe8977 ", "9dd6d7  ", "b5adab", "8ebdd4", "edd46e", "64cfa7", "FFA300", "708FE3", "D972E3", "56BD4E", "1ABC9C", "2e99d4"];

    // 菜单操作
    var meuns = {
        init: function () {
            var $menuwarp = $('.lr-frame-menu');
            $menuwarp.append('<em></em><div class="lr-second-menu-wrap" id="lr_second_menu_wrap"></div><div class="lr-frame-menu-overlay" id="lr_frame_menu_overlay"></div>');
            this.load();
            this.bind();
        },
        load: function () {
            var modulesTree = learun.clientdata.get(['modulesTree']);
            // 第一级菜单
            var parentId = '0';
            var modules = modulesTree[parentId] || [];
            var $firstmenus = $('<ul class="lr-first-menu-list"></ul>');
            for (var i = 0, l = modules.length; i < l; i++) {
                var item = modules[i];
                if (item.F_IsMenu == 1) {
                    var $applistul = $('<ul></ul>');// 应用列表
                    if (item.F_Target != 'expand') {
                        $applistul.append(meuns.getAppItem(item));
                    }
                    var $firstMenuItem = $('<li></li>');
                    if (!!item.F_Description) {
                        $firstMenuItem.attr('title', item.F_Description);
                    }
                    var menuItemHtml = '<a id="' + item.F_ModuleId + '" href="javascript:void(0);" class="lr-menu-item">';
                    menuItemHtml += '<i class="' + item.F_Icon + ' lr-menu-item-icon"></i>';
                    menuItemHtml += '<span class="lr-menu-item-text">' + item.F_FullName + '</span>';
                    menuItemHtml += '<span class="lr-menu-item-arrow"></span></a>';
                    $firstMenuItem.append(menuItemHtml);
                    // 第二级菜单
                    var secondModules = modulesTree[item.F_ModuleId] || [];
                    var $secondMenus = $('<ul class="lr-second-menu-list"></ul>');
                    var secondMenuHad = false;
                    for (var j = 0, sl = secondModules.length ; j < sl; j++) {
                        var secondItem = secondModules[j];
                        if (secondItem.F_IsMenu == 1) {

                            if (secondItem.F_Target != 'expand') {
                                $applistul.append(meuns.getAppItem(secondItem));
                            }

                            secondMenuHad = true;
                            var $secondMenuItem = $('<li></li>');
                            if (!!secondItem.F_Description) {
                                $secondMenuItem.attr('title', secondItem.F_Description);
                            }
                            var secondItemHtml = '<a id="' + secondItem.F_ModuleId + '" href="javascript:void(0);" class="lr-menu-item" >';
                            secondItemHtml += '<i class="' + secondItem.F_Icon + ' lr-menu-item-icon"></i>';
                            secondItemHtml += '<span class="lr-menu-item-text">' + secondItem.F_FullName + '</span>';
                            secondItemHtml += '</a>';

                            $secondMenuItem.append(secondItemHtml);
                            // 第三级菜单
                            var threeModules = modulesTree[secondItem.F_ModuleId] || [];
                            var $threeMenus = $('<ul class="lr-three-menu-list"></ul>');
                            var threeMenuHad = false;
                            for (var m = 0, tl = threeModules.length ; m < tl; m++) {
                                var threeItem = threeModules[m];
                                if (threeItem.F_IsMenu == 1) {
                                    if (threeItem.F_Target != 'expand') {
                                        $applistul.append(meuns.getAppItem(threeItem));
                                    }

                                    threeMenuHad = true;
                                    var $threeMenuItem = $('<li></li>');
                                    $threeMenuItem.attr('title', threeItem.F_FullName);
                                    var threeItemHtml = '<a id="' + threeItem.F_ModuleId + '" href="javascript:void(0);" class="lr-menu-item" >';
                                    threeItemHtml += '<i class="' + threeItem.F_Icon + ' lr-menu-item-icon"></i>';
                                    threeItemHtml += '<span class="lr-menu-item-text">' + threeItem.F_FullName + '</span>';
                                    threeItemHtml += '</a>';
                                    $threeMenuItem.append(threeItemHtml);
                                    $threeMenus.append($threeMenuItem);
                                }
                            }
                            if (threeMenuHad) {
                                $secondMenuItem.addClass('lr-meun-had');
                                $secondMenuItem.find('a').append('<span class="lr-menu-item-arrow"><i class="fa fa-angle-left"></i></span>');
                                $secondMenuItem.append($threeMenus);
                            }
                            $secondMenus.append($secondMenuItem);
                        }
                    }
                    if (secondMenuHad) {
                        $secondMenus.attr('data-value', item.F_ModuleId);
                        $('#lr_second_menu_wrap').append($secondMenus);
                    }
                    $firstmenus.append($firstMenuItem);
                    if ($applistul.find('li').length > 0) {
                        $("#lr_applist_slidebox").append($applistul);
                        $(".lr-applist-slidebox-slider-content").append('<li><i class="fa fa-circle"></i></li>');
                    }

                }
            }
            $('#lr_frame_menu').html($firstmenus);
            
        },
        bind: function () {
            $("#lr_frame_menu").mCustomScrollbar({ // 优化滚动条
                theme: "minimal-dark"
            });
            $("#lr_second_menu_wrap").mCustomScrollbar({ // 优化滚动条
                theme: "minimal-dark"
            });
            $('#lr_windows_start').on('click', meuns.startMenuClick);
            $('#lr_frame_menu_overlay').on('click', meuns.startMenuClick);
            // 添加点击事件
            $('#lr_frame_menu a').on('click', function () {
                var $obj = $(this);
                var id = $obj.attr('id');
                var _module = learun.clientdata.get(['modulesMap', id]);
                switch (_module.F_Target) {
                    case 'iframe':// 窗口
                        meuns.startMenuClick();
                        setTimeout(function () {
                            if (learun.validator.isNotNull(_module.F_UrlAddress).code) {
                                learun.frameTab.open(_module);
                            }
                            else {

                            }
                        }, 250);
                        break;
                    case 'expand':
                        var $li = $obj.parent();
                        if (!$li.hasClass('active')) {
                            $('#lr_frame_menu li.active').removeClass('active');
                            $li.addClass('active');
                            $('#lr_second_menu_wrap .lr-second-menu-list').hide();
                            $('#lr_second_menu_wrap .lr-second-menu-list[data-value="' + _module.F_ModuleId + '"]').show();
                        }
                        break;
                }
            });

            $('#lr_second_menu_wrap a').on('click', function () {
                var $obj = $(this);
                var id = $obj.attr('id');
                var _module = learun.clientdata.get(['modulesMap', id]);
                switch (_module.F_Target) {
                    case 'iframe':// 窗口
                        meuns.startMenuClick();
                        setTimeout(function () {
                            if (learun.validator.isNotNull(_module.F_UrlAddress).code) {
                                learun.frameTab.open(_module);
                            }
                            else {

                            }
                        }, 250);
                        break;
                    case 'expand':
                        var $ul = $obj.next();
                        if ($ul.is(':visible')) {
                            $ul.slideUp(500, function () {
                                $obj.removeClass('open');
                            });
                        }
                        else {
                            $ul.parents('.lr-second-menu-list').find('.lr-three-menu-list').slideUp(300, function () {
                                $(this).prev().removeClass('open');
                            });
                            $ul.slideDown(300, function () {
                                $obj.addClass('open');
                            });
                        }
                        break;
                }
            });

            $('.lr-first-menu-list>li').eq(0).find('a').trigger('click');


            $(".lr-applist-slidebox-slider-content li").click(function () {
                var $this = $(this);
                if (!$this.hasClass("active")) {
                    var $oldli = $(".lr-applist-slidebox-slider-content li.active");
                    $oldli.removeClass("active");
                    $this.addClass("active");

                    var oldindex = $oldli.index();
                    var index = $(this).index();

                    $("#lr_applist_slidebox ul").eq(oldindex).hide();
                    $("#lr_applist_slidebox ul").eq(index).fadeIn("slow");
                }
            });

            $('#lr_applist_btn').on('click', function () {
                meuns.openApplist();
            });

            $('#lr_applist_slidebox .appItem').on('click', function () {
                var $obj = $(this);
                var id = $obj.attr('data-id');
                var _module = learun.clientdata.get(['modulesMap', id]);
                if (learun.validator.isNotNull(_module.F_UrlAddress).code) {
                    learun.frameTab.open(_module);
                }
            });

            $(".lr-applist-slidebox-slider-content li").eq(0).trigger('click');
            learun.frameTab.leaveFocus();
        },
        startMenuClick: function () {
            var $lr_frame_menu = $('.lr-frame-menu');
            if ($lr_frame_menu.is(':visible')) {
                $lr_frame_menu.slideUp(300);
            }
            else {
                $lr_frame_menu.show();
            }
        },
        getAppItem: function (item) {
            var colorindex = Math.round(Math.random() * 9 + 1);
            var _html = '';
            _html += '<li class="appItem" data-id="' + item.F_ModuleId + '" href="' + item.F_UrlAddress + '">';
            _html += '    <div class="icon" style="background: #' + color[colorindex] + ';">';
            _html += '        <i class="fa ' + item.F_Icon + '"></i>';
            _html += '     </div>';
            _html += '     <div class="icon-text">';
            _html +=      item.F_FullName;
            _html += '     </div>';
            _html += '</li>';
            return _html;
        },
        closeApplist: function () {
            var appBtn = $('#lr_applist_btn');
            if (!appBtn.hasClass('off')) {
                $('#lr_applist_btn').addClass('off');
                $('#lr_applist_content').hide();
            }
        },
        openApplist: function () {
            var appBtn = $('#lr_applist_btn');
            if (appBtn.hasClass('off')) {
                learun.frameTab.leaveFocus();
                $('#lr_applist_btn').removeClass('off');
                $('#lr_applist_content').show();
            }
        }
    };

    learun.frameTab.opencallback = function () {
        meuns.closeApplist();
    };
    learun.frameTab.closecallback = function () {
        if (learun.frameTab.iframeId == '') {
            meuns.openApplist();
        }
    };

    
    meuns.init();
};