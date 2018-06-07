using Learun.Util;
using System.Collections.Generic;

namespace Learun.Application.TwoDevelopment.LR_CodeDemo
{
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创 建：超级管理员
    /// 日 期：2018-05-23 13:06
    /// 描 述：存储过程测试
    /// </summary>
    public interface ProductIBLL
    {
        #region 获取数据

        /// <summary>
        /// 获取页面显示列表数据
        /// <summary>
        /// <param name="query">查询参数</param>
        /// <returns></returns>
        IEnumerable<productEntity> GetPageList(Pagination pagination, productEntity query);
        /// <summary>
        /// 获取product表实体数据
        /// <param name="keyValue">主键</param>
        /// <summary>
        /// <returns></returns>
        productEntity GetproductEntity(string keyValue);
        #endregion

        #region 提交数据

        /// <summary>
        /// 删除实体数据
        /// <param name="keyValue">主键</param>
        /// <summary>
        /// <returns></returns>
        void DeleteEntity(string keyValue);
        /// <summary>
        /// 保存实体数据（新增、修改）
        /// <param name="keyValue">主键</param>
        /// <summary>
        /// <returns></returns>
        void SaveEntity(string keyValue, productEntity entity);
        #endregion

    }
}
