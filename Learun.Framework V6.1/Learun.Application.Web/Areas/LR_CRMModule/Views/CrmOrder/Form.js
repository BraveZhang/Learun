/*
 * 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架(http://www.learun.cn)
 * Copyright (c) 2013-2017 上海力软信息技术有限公司
 * 创建人：力软-前端开发组
 * 日 期：2017.04.18
 * 描 述：新增表单	
 */

var keyValue = request('keyValue');

var bootstrap = function ($, learun) {
    "use strict";

    // 保存数据
    var acceptClick = function (type) {// 0保存并新增 1保存
        if (!$('.lr-layout-wrap').lrValidform()) {
            return false;
        }
        var formData = $('.lr-layout-wrap').lrGetFormData(keyValue);
        var productData = [];
        var productDataTmp = $('#productgird').jfGridGet('rowdatas');

        for (var i = 0, l = productDataTmp.length; i < l; i++) {
            if (!!productDataTmp[i]['F_ProductName']) {
                productData.push(productDataTmp[i]);
            }
        }

        var postData = {
            crmOrderJson: JSON.stringify(formData),
            crmOrderProductJson: JSON.stringify(productData)
        };

        learun.layerConfirm('注：您确认要保存此操作吗？', function (res, index) {
            if (res) {
                $.lrSaveForm(top.$.rootUrl + '/LR_CRMModule/CrmOrder/SaveForm?keyValue=' + keyValue, postData, function (res) {
                    if (res.code == 200) {
                        if (type == 0) {
                            window.location.href = top.$.rootUrl + '/LR_CRMModule/CrmOrder/Form';
                        }
                        else {
                            learun.frameTab.close('order_add');
                        }
                    }
                });
                top.layer.close(index); //再执行关闭  
            }
        });
    };

    var page = {
        init: function () {
            page.bind();
            page.initData();
        },
        bind: function () {
            // 优化滚动条
            $('.lr-layout-wrap').mCustomScrollbar({ // 优化滚动条
                theme: "minimal-dark"
            });
            // 客户选择
            $('#F_CustomerId').lrselect({
                url: top.$.rootUrl + '/LR_CRMModule/Customer/GetList',
                text: 'F_FullName',
                value: 'F_CustomerId',
                allowSearch: true,
                maxHeight:400
            });
            // 销售人员
            $('#F_SellerId').lrselect({
                url: top.$.rootUrl + '/LR_OrganizationModule/User/GetList?departmentId=2f077ff9-5a6b-46b3-ae60-c5acdc9a48f1',
                text: 'F_RealName',
                value: 'F_UserId',
                allowSearch: true,
                maxHeight: 400
            });
            // 收款方式
            $('#F_PaymentMode').lrDataItemSelect({ code: 'Client_PaymentMode' });

            // 合同附件
            $('#F_ContractFile').lrUploader();


            // 订单产品信息
            $('#productgird').jfGrid({
                headData: [
                    {
                        label: "商品信息", name: "a1", width: 80, align: "center",
                        children: [
                            {
                                label: '商品名称', name: 'F_ProductName', width: 260, align: 'left', editType: 'select',
                                editOp: {
                                    width: 600,
                                    height: 400,
                                    colData: [
                                       { label: "商品编号", name: "F_ItemValue", width: 100, align: "left" },
                                       { label: "商品名称", name: "F_ItemName", width: 450, align: "left" }
                                    ],
                                    url: top.$.rootUrl + '/LR_SystemModule/DataItem/GetDetailList',
                                    param: { itemCode: 'Client_ProductInfo' },
                                    callback: function (selectdata, rownum, row) {
                                        row.F_ProductName = selectdata.F_ItemName;
                                        row.F_ProductCode = selectdata.F_ItemValue;

                                        row.F_Qty = '1';
                                        row.F_Price = '0';
                                        row.F_Amount = '0';
                                        row.F_TaxRate = '0';
                                        row.F_Taxprice = '0';
                                        row.F_Tax = '0';
                                        row.F_TaxAmount = '0';
                                    }
                                }
                            },
                            { label: '商品编号', name: 'F_ProductCode', width: 100, align: 'center',editType:'label' },
                            { label: '单位', name: 'F_UnitId', width: 100, align: 'center', editType: 'input' }
                        ]
                    },
                    {
                        label: "价格信息", name: "a2", width: 80, align: "center",
                        children: [
                           {
                               label: '数量', name: 'F_Qty', width: 80, align: 'center', editType: 'input', statistics: true,
                               editOp: {
                                   callback: function (rownum, row) {
                                       row.F_Amount =parseInt(parseFloat(row.F_Price || '0') * parseFloat(row.F_Qty || '0'));
                                       row.F_TaxAmount = parseInt((parseFloat(row.F_Price || '0') * (1 + parseFloat(row.F_TaxRate || '0') / 100)) * parseFloat(row.F_Qty || '0'));
                                       row.F_Tax = row.F_TaxAmount - row.F_Amount;
                                   }
                               }
                           },
                           {
                               label: '单价', name: 'F_Price', width: 80, align: 'center', editType: 'input',
                               editOp: {
                                   callback: function (rownum, row) {
                                       row.F_Amount = parseInt(parseFloat(row.F_Price || '0') * parseFloat(row.F_Qty || '0'));
                                       row.F_TaxAmount = parseInt(parseFloat(row.F_Price || '0') * (1 + parseFloat(row.F_TaxRate || '0') / 100)) * parseFloat(row.F_Qty || '0');
                                       row.F_Tax = row.F_TaxAmount - row.F_Amount;

                                       row.F_Taxprice = parseInt(parseFloat(row.F_Price || '0') * (1 + parseFloat(row.F_TaxRate || '0') / 100));
                                   }
                               }
                           },
                           { label: '金额', name: 'F_Amount', width: 80, align: 'center', editType: 'label', statistics: true },
                           {
                               label: '税率(%)', name: 'F_TaxRate', width: 80, align: 'center', editType: 'input',
                               editOp: {
                                   callback: function (rownum, row) {
                                       row.F_Amount = parseInt(parseFloat(row.F_Price || '0') * parseFloat(row.F_Qty || '0'));
                                       row.F_TaxAmount = parseInt((parseFloat(row.F_Price || '0') * (1 + parseFloat(row.F_TaxRate || '0') / 100)) * parseFloat(row.F_Qty || '0'));
                                       row.F_Tax = row.F_TaxAmount - row.F_Amount;

                                       row.F_Taxprice = parseInt(parseFloat(row.F_Price || '0') * (1 + parseFloat(row.F_TaxRate || '0') / 100));
                                   }
                               }
                           },
                           { label: '含税单价', name: 'F_Taxprice', width: 80, align: 'center', editType: 'label' },
                           { label: '税额', name: 'F_Tax', width: 80, align: 'center', editType: 'label', statistics: true },
                           { label: '含税金额', name: 'F_TaxAmount', width: 80, align: 'center', editType: 'label', statistics: true },
                        ]
                    },
                    { label: "说明信息", name: "F_Description", width: 200, align: "center", editType: 'input' }
                ],

                //isAutoHeight: true,
                isEidt: true,
                footerrow: true,
                isStatistics: true,
                height: 400,
                isMultiselect:true
            });

            // 保存数据
            $('#savaAndAdd').on('click', function () {
                acceptClick(0);
            });
            $('#save').on('click', function () {
                acceptClick(1);
            });
        },
        initData: function () {
            if (!!keyValue) {
                $.lrSetForm(top.$.rootUrl + '/LR_CRMModule/CrmOrder/GetFormData?keyValue=' + keyValue, function (data) {//
                    $('.lr-layout-wrap').lrSetFormData(data.orderData);
                    $('#productgird').jfGridSet('refreshdata', { rowdatas: data.orderProductData });
                });
            }
        }
    };
    
    page.init();
}