/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.03.16
 * 描 述：经典风格皮肤	
 */
var bootstrap = function ($, learun) {
    "use strict";
    // 菜单操作
    var meuns = {
        init: function () {
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
                                $secondMenuItem.append($threeMenus);
                            }
                            $secondMenus.append($secondMenuItem);
                        }
                    }
                    if (secondMenuHad) {
                        $firstMenuItem.append($secondMenus);
                    }
                    $firstmenus.append($firstMenuItem);
                }
            }
            $('#lr_frame_menu').html($firstmenus);
        },
        bind: function () {
            $("#lr_frame_menu").mCustomScrollbar({ // 优化滚动条
                theme: "minimal-dark"
            });
            $("#lr_frame_menu .lr-first-menu-list > li").hover(function (e) {// 一级菜单选中的时候判断二级菜单的位置
                $('#lr_frame_menu').width(4000);
                var $secondMenu = $(this).find('.lr-second-menu-list');
                var length = $secondMenu.find('li').length;
                if (length > 0) {
                    $secondMenu.css('top', '0px');
                    var secondMenuTop = $(this).offset().top + $secondMenu.height() + 23;
                    var bodyHeight = $(window).height();
                    if (secondMenuTop > bodyHeight) {
                        $secondMenu.css('top', '-' + (secondMenuTop - bodyHeight) + 'px');
                    }
                }
            }, function (e) {
                $('#lr_frame_menu').width(80);
            });

            $("#lr_frame_menu .lr-second-menu-list > li.lr-meun-had").hover(function (e) {// 二级菜单选中的时候判断三级菜单的位置
                var $ul = $(this).find('.lr-three-menu-list');
                $ul.css('top', '-9px');
                var ulTop = $(this).offset().top + $ul.height() + 23;
                var bodyHeight = $(window).height();
                if (ulTop > bodyHeight) {
                    $ul.css('top', '-' + (ulTop - bodyHeight) + 'px');
                }
            });

            // 添加点击事件
            $('#lr_frame_menu .lr-menu-item').on('click', function () {
                var $obj = $(this);
                var id = $obj.attr('id');
                var _module = learun.clientdata.get(['modulesMap', id]);
                switch (_module.F_Target) {
                    case 'iframe':// 窗口
                        if (learun.validator.isNotNull(_module.F_UrlAddress).code) {
                            learun.frameTab.open(_module);
                        }
                        else {

                        }
                        break;
                }
            });
        }
    };
    meuns.init();
};