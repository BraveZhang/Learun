using Dapper;
using Learun.DataBase.Repository;
using Learun.Util;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Learun.Application.TwoDevelopment.LR_CodeDemo
{
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创 建：超级管理员
    /// 日 期：2018-05-23 13:06
    /// 描 述：存储过程测试
    /// </summary>
    public class ProductService : RepositoryFactory
    {
        #region 获取数据

        /// <summary>
        /// 获取页面显示列表数据
        /// <summary>
        /// <param name="query">查询参数</param>
        /// <returns></returns>
        public IEnumerable<productEntity> GetPageList(Pagination pagination, productEntity query)
        {
            try
            {
                var dp = new DynamicParameters(query);
                dp.Add("opCode",null,System.Data.DbType.Int32);
                dp.Add("opPwd",null,System.Data.DbType.String);
                dp.Add("actionIn", "0",System.Data.DbType.String);
                dp.Add("stationNo",null,System.Data.DbType.String);
                dp.Add("custKind",null,System.Data.DbType.String);
                dp.Add("reserve",null,System.Data.DbType.String);
                dp.Add("pageSize", pagination.rows, System.Data.DbType.Int32);
                dp.Add("pageNo", -1, System.Data.DbType.Int32);
                pagination.records = int.Parse(this.BaseRepository().ExecuteByProc<String>("LearunFramework_Base_2017..spGetProduct", dp));
                dp.Add("pageNo", pagination.page, System.Data.DbType.Int32);
                dp.Add("errorInfo", "", System.Data.DbType.String,System.Data.ParameterDirection.Output);
                return this.BaseRepository().QueryByProc<productEntity>("LearunFramework_Base_2017..spGetProduct", dp);
            }
            catch (Exception ex)
            {
                if (ex is ExceptionEx)
                {
                    throw;
                }
                else
                {
                    throw ExceptionEx.ThrowServiceException(ex);
                }
            }
        }

        /// <summary>
        /// 获取product表实体数据
        /// <param name="keyValue">主键</param>
        /// <summary>
        /// <returns></returns>
        public productEntity GetproductEntity(string keyValue)
        {
            try
            {
                productEntity query = new productEntity();
                query.productId = keyValue;
                var dp = new DynamicParameters(query);
                dp.Add("opCode",null,System.Data.DbType.Int32);
                dp.Add("opPwd",null,System.Data.DbType.String);
                dp.Add("actionIn", "0",System.Data.DbType.String);
                dp.Add("stationNo",null,System.Data.DbType.String);
                dp.Add("custKind",null,System.Data.DbType.String);
                dp.Add("reserve",null,System.Data.DbType.String);
                dp.Add("pageSize", 1, System.Data.DbType.Int32);
                dp.Add("pageNo", 0, System.Data.DbType.Int32);
                dp.Add("errorInfo", "", System.Data.DbType.String, System.Data.ParameterDirection.Output);
                return this.BaseRepository().ExecuteByProc<productEntity>("LearunFramework_Base_2017..spGetProduct", dp);
            }
            catch (Exception ex)
            {
                if (ex is ExceptionEx)
                {
                    throw;
                }
                else
                {
                    throw ExceptionEx.ThrowServiceException(ex);
                }
            }
        }

        #endregion

        #region 提交数据

        /// <summary>
        /// 删除实体数据
        /// <param name="keyValue">主键</param>
        /// <summary>
        /// <returns></returns>
        public void DeleteEntity(string keyValue)
        {
            try
            {
                productEntity query = new productEntity();
                query.productId = keyValue;
                var dp = new DynamicParameters(query);
                dp.Add("opCode",null,System.Data.DbType.Int32);
                dp.Add("opPwd",null,System.Data.DbType.String);
                dp.Add("actionIn", "40103", System.Data.DbType.String);
                dp.Add("stationNo",null,System.Data.DbType.String);
                dp.Add("errorInfo", "", System.Data.DbType.String, System.Data.ParameterDirection.Output);
                this.BaseRepository().ExecuteByProc("LearunFramework_Base_2017..spSetProduct", dp);
            }
            catch (Exception ex)
            {
                if (ex is ExceptionEx)
                {
                    throw;
                }
                else
                {
                    throw ExceptionEx.ThrowServiceException(ex);
                }
            }
        }

        /// <summary>
        /// 保存实体数据（新增、修改）
        /// <param name="keyValue">主键</param>
        /// <summary>
        /// <returns></returns>
        public void SaveEntity(string keyValue, productEntity entity)
        {
            try
            {
                if (!string.IsNullOrEmpty(keyValue))
                {
                    entity.Modify(keyValue);
                    var dp = new DynamicParameters(entity);
                dp.Add("opCode",null,System.Data.DbType.Int32);
                dp.Add("opPwd",null,System.Data.DbType.String);
                dp.Add("actionIn", "40102", System.Data.DbType.String);
                dp.Add("stationNo",null,System.Data.DbType.String);
                dp.Add("errorInfo", "", System.Data.DbType.String, System.Data.ParameterDirection.Output);
                    this.BaseRepository().ExecuteByProc("LearunFramework_Base_2017..spSetProduct", dp);
                }
                else
                {
                    entity.Create();
                    var dp = new DynamicParameters(entity);
                    dp.Add("opCode",null,System.Data.DbType.Int32);
                    dp.Add("opPwd",null,System.Data.DbType.String);
                    dp.Add("actionIn", "40101", System.Data.DbType.String);
                    dp.Add("stationNo",null,System.Data.DbType.String);
                    dp.Add("errorInfo", "", System.Data.DbType.String, System.Data.ParameterDirection.Output);
                    this.BaseRepository().ExecuteByProc("LearunFramework_Base_2017..spSetProduct", dp);
                }
            }
            catch (Exception ex)
            {
                if (ex is ExceptionEx)
                {
                    throw;
                }
                else
                {
                    throw ExceptionEx.ThrowServiceException(ex);
                }
            }
        }

        #endregion

    }
}
