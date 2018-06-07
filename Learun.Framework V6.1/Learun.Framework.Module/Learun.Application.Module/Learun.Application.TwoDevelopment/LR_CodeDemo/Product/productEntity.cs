using Learun.Util;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Learun.Application.TwoDevelopment.LR_CodeDemo
{
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创 建：超级管理员
    /// 日 期：2018-05-23 13:06
    /// 描 述：存储过程测试
    /// </summary>
    public class productEntity 
    {
        #region 实体成员
        /// <summary>
        /// productId
        /// </summary>
        [Column("PRODUCTID")]
        public string productId { get; set; }
        /// <summary>
        /// productName
        /// </summary>
        [Column("PRODUCTNAME")]
        public string productName { get; set; }
        /// <summary>
        /// productKind
        /// </summary>
        [Column("PRODUCTKIND")]
        public string productKind { get; set; }
        /// <summary>
        /// beginDate
        /// </summary>
        [Column("BEGINDATE")]
        public int? beginDate { get; set; }
        /// <summary>
        /// endDate
        /// </summary>
        [Column("ENDDATE")]
        public int? endDate { get; set; }
        /// <summary>
        /// productCycle
        /// </summary>
        [Column("PRODUCTCYCLE")]
        public int? productCycle { get; set; }
        /// <summary>
        /// allocateCycle
        /// </summary>
        [Column("ALLOCATECYCLE")]
        public int? allocateCycle { get; set; }
        /// <summary>
        /// allocateDate
        /// </summary>
        [Column("ALLOCATEDATE")]
        public int? allocateDate { get; set; }
        /// <summary>
        /// maxProfit
        /// </summary>
        [Column("MAXPROFIT")]
        public decimal? maxProfit { get; set; }
        /// <summary>
        /// minProfit
        /// </summary>
        [Column("MINPROFIT")]
        public decimal? minProfit { get; set; }
        /// <summary>
        /// maxAmount
        /// </summary>
        [Column("MAXAMOUNT")]
        public decimal? maxAmount { get; set; }
        /// <summary>
        /// minAmount
        /// </summary>
        [Column("MINAMOUNT")]
        public decimal? minAmount { get; set; }
        /// <summary>
        /// factAmount
        /// </summary>
        [Column("FACTAMOUNT")]
        public decimal? factAmount { get; set; }
        /// <summary>
        /// deptNo
        /// </summary>
        [Column("DEPTNO")]
        public int? deptNo { get; set; }
        /// <summary>
        /// productManager
        /// </summary>
        [Column("PRODUCTMANAGER")]
        public int? productManager { get; set; }
        /// <summary>
        /// accountId
        /// </summary>
        [Column("ACCOUNTID")]
        public int? accountId { get; set; }
        /// <summary>
        /// seriesId
        /// </summary>
        [Column("SERIESID")]
        public int? seriesId { get; set; }
        /// <summary>
        /// investWay
        /// </summary>
        [Column("INVESTWAY")]
        public string investWay { get; set; }
        /// <summary>
        /// productTag
        /// </summary>
        [Column("PRODUCTTAG")]
        public string productTag { get; set; }
        /// <summary>
        /// productStatus
        /// </summary>
        [Column("PRODUCTSTATUS")]
        public string productStatus { get; set; }
        #endregion

        #region 扩展操作
        /// <summary>
        /// 新增调用
        /// </summary>
        public void Create()
        {
            this.productId = Guid.NewGuid().ToString();
        }
        /// <summary>
        /// 编辑调用
        /// </summary>
        /// <param name="keyValue"></param>
        public void Modify(string keyValue)
        {
            this.productId = keyValue;
        }
        #endregion
        #region 扩展字段
        #endregion
    }
}

