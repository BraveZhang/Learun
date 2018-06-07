using System.Collections.Generic;

namespace Learun.Application.BaseModule.CodeGeneratorModule
{
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创建人：力软-框架开发组
    /// 日 期：2017.04.17
    /// 描 述：表单数据
    /// </summary>
    public class FormModel
    {
        /// <summary>
        /// 表单高
        /// </summary>
        public int height { get; set; }
        /// <summary>
        /// 表单宽
        /// </summary>
        public int width { get; set; }

        /// <summary>
        /// 工作流关联字段
        /// </summary>
        public string workField { get; set; }
        /// <summary>
        /// 表单选项卡数据
        /// </summary>
        public List<TabModel> tablist { get; set; }
    }
     /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创建人：力软-框架开发组
    /// 日 期：2017.04.17
    /// 描 述：选项卡
    /// </summary>
    public class TabModel
    {
        public string text { get; set; }

        public List<CompontModel> componts { get; set; }
    }
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创建人：力软-框架开发组
    /// 日 期：2017.04.17
    /// 描 述：控件
    /// </summary>
    public class CompontModel
    {
        /// <summary>
        /// 表单主键Id
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 表名
        /// </summary>
        public string tableName { get; set; }
        /// <summary>
        /// 名称
        /// </summary>
        public string fieldName { get; set; }
        /// <summary>
        /// 字段
        /// </summary>
        public string fieldId { get; set; }
        /// <summary>
        /// 类型 text文本框;textarea文本区域;datetime日期框;select下拉框;radio单选框;checkbox多选框;file文件上传;gridtable 编辑表格
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// 字段验证 
        /// </summary>
        public string validator { get; set; }
        /// <summary>
        /// 所占比例 
        /// </summary>
        public string proportion { get; set; }
        /// <summary>
        /// 数据来源 0 数据字典 1 数据源
        /// </summary>
        public string dataSource { get; set; }
        /// <summary>
        /// 数据源主键
        /// </summary>
        public string dataSourceId { get; set; }
        /// <summary>
        /// 数据字典编码
        /// </summary>
        public string dataItemCode { get; set; }
        /// <summary>
        /// 是否只读 1 否 2 是
        /// </summary>
        public string isRead { get; set; }
        /// <summary>
        /// 表格类型设置字段
        /// </summary>
        public List<EditGridModel> fields { get; set; }
    }
     /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创建人：力软-框架开发组
    /// 日 期：2017.04.17
    /// 描 述：编辑表格设置项
    /// </summary>
    public class EditGridModel
    {
        /// <summary>
        /// 显示名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 绑定字段
        /// </summary>
        public string field { get; set; }
        /// <summary>
        /// 显示宽度
        /// </summary>
        public string width { get; set; }
        /// <summary>
        /// 编辑类型 input label select
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// 对齐方式 left center right
        /// </summary>
        public string align { get; set; }
        /// <summary>
        /// 数据源类型 0 数据字典 1 数据源
        /// </summary>
        public string dataSource { get; set; }
        /// <summary>
        /// 数据源主键
        /// </summary>
        public string dataSourceId { get; set; }
        /// <summary>
        /// 数据字典编码
        /// </summary>
        public string dataItemCode { get; set; }
        /// <summary>
        /// 选择框宽
        /// </summary>
        public string dataSourceWidth { get; set; }
        /// <summary>
        /// 选择框高
        /// </summary>
        public string dataSourceHeight { get; set; }
        /// <summary>
        /// 数据对应关系
        /// </summary>
        public List<GirdSelectDataModel> selectData { get; set; }
        /// <summary>
        /// 固定信息隐藏 0 否 1 是
        /// </summary>
        public string fixedInfoHide { get; set; }
    }

    /// <summary>
    /// 编辑表格
    /// </summary>
    public class GirdSelectDataModel
    {
        /// <summary>
        /// 字段ID
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 字段名
        /// </summary>
        public string label { get; set; }
        /// <summary>
        /// 对应字段
        /// </summary>
        public string value { get; set; }
        /// <summary>
        /// 宽度
        /// </summary>
        public string width { get; set; }
        /// <summary>
        /// 对齐方式 left center right
        /// </summary>
        public string align { get; set; }
        /// <summary>
        /// 是否隐藏 0 否 1 是
        /// </summary>
        public string hide { get; set; }
    }

}
