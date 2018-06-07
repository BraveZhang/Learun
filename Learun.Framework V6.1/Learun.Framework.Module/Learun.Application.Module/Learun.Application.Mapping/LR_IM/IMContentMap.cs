using Learun.Application.IM;
using System.Data.Entity.ModelConfiguration;

namespace Learun.Application.Mapping.LR_IM
{
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创建人：力软-框架开发组
    /// 日 期：2017.04.17
    /// 描 述：即时通讯消息内容
    /// </summary>
    public class IMContentMap : EntityTypeConfiguration<IMContentEntity>
    {
        public IMContentMap()
        {
            #region 表、主键
            //表
            this.ToTable("LR_IM_CONTENT");
            //主键
            this.HasKey(t => t.F_ContentId);
            #endregion

            #region 配置关系
            #endregion
        }
    }
}
