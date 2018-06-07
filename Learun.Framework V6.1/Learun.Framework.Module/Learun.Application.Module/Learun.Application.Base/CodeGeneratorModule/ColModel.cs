
using System.Collections.Generic;
namespace Learun.Application.BaseModule.CodeGeneratorModule
{
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创建人：力软-框架开发组
    /// 日 期：2017.04.17
    /// 描 述：列表设置
    /// </summary>
    public class ColModel
    {
        /// <summary>
        /// 是否分页
        /// </summary>
        public string isPage { get; set; }
        /// <summary>
        /// 字段设置
        /// </summary>
        public List<ColFieldModel> fields { get; set; }
    }
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创建人：力软-框架开发组
    /// 日 期：2017.04.17
    /// 描 述：列表字段设置
    /// </summary>
    public class ColFieldModel
    {
        /// <summary>
        /// 主键
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 组件主键
        /// </summary>
        public string compontId { get; set; }
        /// <summary>
        /// 字段名称
        /// </summary>
        public string fieldName { get; set; }
        /// <summary>
        /// 字段ID
        /// </summary>
        public string fieldId { get; set; }
        /// <summary>
        /// 对齐方式  left center right
        /// </summary>
        public string align { get; set; }
        /// <summary>
        /// 宽度
        /// </summary>
        public string width { get; set; }

    }
}
