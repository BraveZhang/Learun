using Learun.Application.Base.CodeGeneratorModule;
using Learun.Application.Base.SystemModule;
using System.Collections.Generic;
using System.Web.Mvc;
using Learun.Util;
using System.Configuration;
using Learun.Application.BaseModule.CodeGeneratorModule;

namespace Learun.Application.Web.Areas.LR_CodeGeneratorModule.Controllers
{
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创建人：力软-框架开发组
    /// 日 期：2017.03.09
    /// 描 述：PC端代码生成器
    /// </summary>
    public class TemplatePCController : MvcControllerBase
    {
        private CodeGenerator codeGenerator = new CodeGenerator();
        private ModuleIBLL moduleIBLL = new ModuleBLL();
        private DatabaseTableIBLL databaseTableIBLL = new DatabaseTableBLL();

        #region 视图功能
        /// <summary>
        /// 管理页面
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 自定义开发模板
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult CustmerCodeIndex()
        {
            ViewBag.rootDirectory = GetRootDirectory();
            ViewBag.mappingDirectory = ConfigurationManager.AppSettings["MappingDirectory"].ToString();
            ViewBag.serviceDirectory = ConfigurationManager.AppSettings["ServiceDirectory"].ToString();
            ViewBag.webDirectory = ConfigurationManager.AppSettings["WebDirectory"].ToString();

            return View();
        }

        /// <summary>
        /// 快速开发模板
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult FastCodeIndex()
        {
            ViewBag.rootDirectory = GetRootDirectory();
            ViewBag.mappingDirectory = ConfigurationManager.AppSettings["MappingDirectory"].ToString();
            ViewBag.serviceDirectory = ConfigurationManager.AppSettings["ServiceDirectory"].ToString();
            ViewBag.webDirectory = ConfigurationManager.AppSettings["WebDirectory"].ToString();
            return View();
        }
        /// <summary>
        /// 快速生成类
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult EntityCodeIndex()
        {
            ViewBag.mappingDirectory = ConfigurationManager.AppSettings["MappingDirectory"].ToString();
            ViewBag.serviceDirectory = ConfigurationManager.AppSettings["ServiceDirectory"].ToString();
            ViewBag.rootDirectory = GetRootDirectory();
            return View();
        }

        /// <summary>
        /// 流程系统表单开发模板
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult WorkflowCodeIndex()
        {
            ViewBag.rootDirectory = GetRootDirectory();
            ViewBag.mappingDirectory = ConfigurationManager.AppSettings["MappingDirectory"].ToString();
            ViewBag.serviceDirectory = ConfigurationManager.AppSettings["ServiceDirectory"].ToString();
            ViewBag.webDirectory = ConfigurationManager.AppSettings["WebDirectory"].ToString();

            return View();
        }


        /// <summary>
        /// 自定义开发模板（存储过程）
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult CustmerCodeProcIndex()
        {
            ViewBag.rootDirectory = GetRootDirectory();
            ViewBag.mappingDirectory = ConfigurationManager.AppSettings["MappingDirectory"].ToString();
            ViewBag.serviceDirectory = ConfigurationManager.AppSettings["ServiceDirectory"].ToString();
            ViewBag.webDirectory = ConfigurationManager.AppSettings["WebDirectory"].ToString();

            return View();
        }

        /// <summary>
        /// 数据表设置
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult DataTableForm()
        {
            return View();
        }
        /// <summary>
        /// 选项卡编辑
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult TabEditIndex()
        {
            return View();
        }
        /// <summary>
        /// 选项卡编辑
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult TabEditForm()
        {
            return View();
        }

        /// <summary>
        /// 表单字段设置
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult FormSetting()
        {
            return View();
        }
        /// <summary>
        /// 表单排版预览
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult PreviewForm()
        {
            return View();
        }
        

        /// <summary>
        /// 导入表字段
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ImportTableForm()
        {
            return View();
        }

        /// <summary>
        /// 查询字段添加
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult QueryFieldForm()
        {
            return View();
        }
        /// <summary>
        /// 列表字段添加
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult ColFieldForm()
        {
            return View();
        }
        /// <summary>
        /// 添加表格
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult AddGridFieldIndex()
        {
            return View();
        }
        /// <summary>
        /// 编辑表格字段设置（主页）
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GridFieldIndex()
        {
            return View();
        }
        /// <summary>
        /// 编辑表格字段设置（表单页）
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GridFieldForm()
        {
            return View();
        }
        /// <summary>
        /// 设置表格选择字段
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GridSelectFieldForm()
        {
            return View();
        }


        #endregion

        #region 自定义开发模板
        /// <summary>
        /// 自定义开发模板代码生成
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult LookCustmerCode(string databaseLinkId, string dbTable, string formData, string queryData, string colData, string baseInfo)
        {
            // 数据
            List<DbTableModel> dbTableObj = dbTable.ToObject<List<DbTableModel>>();
            FormModel formDataObj = formData.ToObject<FormModel>();
            QueryModel queryDataObj = queryData.ToObject<QueryModel>();
            ColModel colDataObj = colData.ToObject<ColModel>();
            BaseModel baseInfoObj = baseInfo.ToObject<BaseModel>();

            // 将表单数据进行一次转化
            Dictionary<string, CompontModel> compontMap = new Dictionary<string, CompontModel>();
            bool haveEditGird = false;
            foreach (var tab in formDataObj.tablist)
            {
                foreach (var compont in tab.componts)
                {
                    if (compont.type == "gridtable")
                    {
                        haveEditGird = true;
                    }
                    compontMap.Add(compont.id, compont);
                }
            }

            // 实体类 映射类
            string entityCode = "";
            string mapCode = "";

            string mainTable = "";

            foreach (var tableOne in dbTableObj)
            {
                bool isMain = false;
                if (string.IsNullOrEmpty(tableOne.relationName))
                {
                    mainTable = tableOne.name;
                    isMain = true;
                }

                // 实体类
                entityCode += codeGenerator.EntityCreate(databaseLinkId, tableOne.name, tableOne.pk, baseInfoObj, colDataObj, isMain);
                // 映射类
                mapCode += codeGenerator.MappingCreate(tableOne.name, tableOne.pk, baseInfoObj);
            }

            // 服务类
            string serviceCode = codeGenerator.ServiceCreate(databaseLinkId, dbTableObj, compontMap, queryDataObj, colDataObj, baseInfoObj);
            // 业务类
            string bllCode = codeGenerator.BllCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            // 业务接口类
            string ibllCode = codeGenerator.IBllCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            // 控制器类
            string controllerCode = codeGenerator.ControllerCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            // 页面类
            string indexCode = codeGenerator.IndexCreate(baseInfoObj, compontMap, queryDataObj);
            // 页面js类
            string indexJsCode = codeGenerator.IndexJSCreate(baseInfoObj, dbTableObj, formDataObj, compontMap, colDataObj, queryDataObj);
            // 表单类
            string formCode = codeGenerator.FormCreate(baseInfoObj, formDataObj, compontMap, haveEditGird);
            // 表单js类
            string formJsCode = codeGenerator.FormJsCreate(baseInfoObj, dbTableObj, formDataObj);
          

            var jsonData = new
            {
                entityCode = entityCode,
                mapCode = mapCode,
                serviceCode = serviceCode,
                bllCode = bllCode,
                ibllCode = ibllCode,
                controllerCode = controllerCode,
                indexCode = indexCode,
                indexJsCode = indexJsCode,
                formCode = formCode,
                formJsCode = formJsCode
            };

            return Success(jsonData);
        }
        /// <summary>
        /// 快速开发代码创建
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult CreateCustmerCode(string databaseLinkId, string dbTable, string formData, string queryData, string colData, string baseInfo, string moduleEntityJson)
        {
            // 数据
            List<DbTableModel> dbTableObj = dbTable.ToObject<List<DbTableModel>>();
            FormModel formDataObj = formData.ToObject<FormModel>();
            QueryModel queryDataObj = queryData.ToObject<QueryModel>();
            ColModel colDataObj = colData.ToObject<ColModel>();
            BaseModel baseInfoObj = baseInfo.ToObject<BaseModel>();


            var moduleEntity = moduleEntityJson.ToObject<ModuleEntity>();
            moduleEntity.F_Target = "iframe";
            moduleEntity.F_UrlAddress = "/" + baseInfoObj.outputArea + "/" + baseInfoObj.name + "/Index";

            List<ModuleButtonEntity> moduleButtonList = new List<ModuleButtonEntity>();
            ModuleButtonEntity addButtonEntity = new ModuleButtonEntity();
            addButtonEntity.Create();
            addButtonEntity.F_EnCode = "lr_add";
            addButtonEntity.F_FullName = "新增";
            moduleButtonList.Add(addButtonEntity);
            ModuleButtonEntity editButtonEntity = new ModuleButtonEntity();
            editButtonEntity.Create();
            editButtonEntity.F_EnCode = "lr_edit";
            editButtonEntity.F_FullName = "编辑";
            moduleButtonList.Add(editButtonEntity);
            ModuleButtonEntity deleteButtonEntity = new ModuleButtonEntity();
            deleteButtonEntity.Create();
            deleteButtonEntity.F_EnCode = "lr_delete";
            deleteButtonEntity.F_FullName = "删除";
            moduleButtonList.Add(deleteButtonEntity);

            List<ModuleColumnEntity> moduleColumnList = new List<ModuleColumnEntity>();
            int num = 0;
            foreach (var col in colDataObj.fields)
            {
                ModuleColumnEntity moduleColumnEntity = new ModuleColumnEntity();
                moduleColumnEntity.Create();
                moduleColumnEntity.F_EnCode = col.fieldId;
                moduleColumnEntity.F_FullName = col.fieldName;
                moduleColumnEntity.F_SortCode = num;
                moduleColumnEntity.F_ParentId = "0";
                num++;
                moduleColumnList.Add(moduleColumnEntity);
            }
            var moduleEntityTemp = moduleIBLL.GetModuleByUrl(moduleEntity.F_UrlAddress);
            if (moduleEntityTemp == null)
            {
                moduleIBLL.SaveEntity("", moduleEntity, moduleButtonList, moduleColumnList);
            }

            string codeContent = "";
            // 将表单数据进行一次转化
            Dictionary<string, CompontModel> compontMap = new Dictionary<string, CompontModel>();
            bool haveEditGird = false;
            foreach (var tab in formDataObj.tablist)
            {
                foreach (var compont in tab.componts)
                {
                    if (compont.type == "gridtable")
                    {
                        haveEditGird = true;
                    }
                    compontMap.Add(compont.id, compont);
                }
            }


            // 实体类 映射类

            string mainTable = "";

            foreach (var tableOne in dbTableObj)
            {
                bool isMain = false;
                if (string.IsNullOrEmpty(tableOne.relationName))
                {
                    mainTable = tableOne.name;
                    isMain = true;
                }
                // 实体类
                codeContent = codeGenerator.EntityCreate(databaseLinkId, tableOne.name, tableOne.pk, baseInfoObj, colDataObj, isMain);
                codeGenerator.CreateEntityCodeFile(baseInfoObj, tableOne.name, codeContent);
                // 映射类
                codeContent = codeGenerator.MappingCreate(tableOne.name, tableOne.pk, baseInfoObj);
                codeGenerator.CreateMapCodeFile(baseInfoObj, tableOne.name, codeContent);
            }

            // 服务类
            codeContent = codeGenerator.ServiceCreate(databaseLinkId, dbTableObj, compontMap, queryDataObj, colDataObj, baseInfoObj);
            codeGenerator.CreateSerivceCodeFile(baseInfoObj, codeContent);
            // 业务类
            codeContent = codeGenerator.BllCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            codeGenerator.CreateBLLCodeFile(baseInfoObj, codeContent);
            // 业务接口类
            codeContent = codeGenerator.IBllCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            codeGenerator.CreateIBLLCodeFile(baseInfoObj, codeContent);
            // 控制器类
            codeContent = codeGenerator.ControllerCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            codeGenerator.CreateControllerCodeFile(baseInfoObj, codeContent);
            // 页面类
            codeContent = codeGenerator.IndexCreate(baseInfoObj, compontMap, queryDataObj);
            codeGenerator.CreateIndexCodeFile(baseInfoObj, codeContent);
            // 页面js类
            codeContent = codeGenerator.IndexJSCreate(baseInfoObj, dbTableObj, formDataObj, compontMap, colDataObj, queryDataObj);
            codeGenerator.CreateIndexJSCodeFile(baseInfoObj, codeContent);
            // 表单类
            codeContent = codeGenerator.FormCreate(baseInfoObj, formDataObj, compontMap, haveEditGird);
            codeGenerator.CreateFormCodeFile(baseInfoObj, codeContent);
            // 表单js类
            codeContent = codeGenerator.FormJsCreate(baseInfoObj, dbTableObj, formDataObj);
            codeGenerator.CreateFormJSCodeFile(baseInfoObj, codeContent);

            return Success("创建成功");
        }
        #endregion

        #region 快速开发模板
        /// <summary>
        /// 快速开发代码查看
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult LookFastCode(CodeBaseConfigModel codeBaseConfigModel)
        {
            string entityCode = "";
            string mapCode = "";
            codeBaseConfigModel.backProject = ConfigurationManager.AppSettings["BackProject"].ToString();
            // 实体类
            entityCode += codeGenerator.EntityCreate(codeBaseConfigModel, codeBaseConfigModel.tableName);
            // 映射类
            mapCode += codeGenerator.MappingCreate(codeBaseConfigModel, codeBaseConfigModel.tableName);
            // 服务类
            string serviceCode = codeGenerator.ServiceCreate(codeBaseConfigModel);
            // 业务类
            string bllCode = codeGenerator.BllCreate(codeBaseConfigModel);
            // 业务接口类
            string ibllCode = codeGenerator.IBllCreate(codeBaseConfigModel);
            // 控制器类
            string controllerCode = codeGenerator.ControllerCreate(codeBaseConfigModel);
            // 页面类
            string indexCode = codeGenerator.IndexCreate(codeBaseConfigModel);
            // 页面js类
            string indexJsCode = codeGenerator.IndexJSCreate(codeBaseConfigModel);
            // 表单类
            string formCode = codeGenerator.FormCreate(codeBaseConfigModel);
            // 表单js类
            string formJsCode = codeGenerator.FormJsCreate(codeBaseConfigModel);
          
            var jsonData = new
            {
                entityCode = entityCode,
                mapCode = mapCode,
                serviceCode = serviceCode,
                bllCode = bllCode,
                ibllCode = ibllCode,
                controllerCode = controllerCode,
                indexCode = indexCode,
                indexJsCode = indexJsCode,
                formCode = formCode,
                formJsCode = formJsCode
            };

            return Success(jsonData);
        }
        /// <summary>
        /// 快速开发代码创建
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult CreateFastCode(CodeBaseConfigModel codeBaseConfigModel)
        {
            string codeContent = "";
            codeBaseConfigModel.backProject = ConfigurationManager.AppSettings["BackProject"].ToString();
            // 实体类
            codeContent = codeGenerator.EntityCreate(codeBaseConfigModel, codeBaseConfigModel.tableName);
            codeGenerator.CreateEntityCodeFile(codeBaseConfigModel, codeBaseConfigModel.tableName, codeContent);
            // 映射类
            codeContent = codeGenerator.MappingCreate(codeBaseConfigModel, codeBaseConfigModel.tableName);
            codeGenerator.CreateMapCodeFile(codeBaseConfigModel, codeBaseConfigModel.tableName, codeContent);
            // 服务类
            codeContent = codeGenerator.ServiceCreate(codeBaseConfigModel);
            codeGenerator.CreateSerivceCodeFile(codeBaseConfigModel, codeContent);
            // 业务接口类
            codeContent = codeGenerator.IBllCreate(codeBaseConfigModel);
            codeGenerator.CreateIBLLCodeFile(codeBaseConfigModel, codeContent);
            // 业务类
            codeContent = codeGenerator.BllCreate(codeBaseConfigModel);
            codeGenerator.CreateBLLCodeFile(codeBaseConfigModel, codeContent);
            // 控制器类
            codeContent = codeGenerator.ControllerCreate(codeBaseConfigModel);
            codeGenerator.CreateControllerCodeFile(codeBaseConfigModel, codeContent);
            // 页面类
            codeContent = codeGenerator.IndexCreate(codeBaseConfigModel);
            codeGenerator.CreateIndexCodeFile(codeBaseConfigModel, codeContent);
            // 页面js类
            codeContent = codeGenerator.IndexJSCreate(codeBaseConfigModel);
            codeGenerator.CreateIndexJSCodeFile(codeBaseConfigModel, codeContent);
            // 表单类
            codeContent = codeGenerator.FormCreate(codeBaseConfigModel);
            codeGenerator.CreateFormCodeFile(codeBaseConfigModel, codeContent);
            // 表单js类
            codeContent = codeGenerator.FormJsCreate(codeBaseConfigModel);
            codeGenerator.CreateFormJSCodeFile(codeBaseConfigModel, codeContent);

            var moduleEntity = codeBaseConfigModel.moduleEntityJson.ToObject<ModuleEntity>();
            moduleEntity.F_Target = "iframe";
            moduleEntity.F_UrlAddress = "/" + codeBaseConfigModel.area + "/" + codeBaseConfigModel.name + "/Index";

            List<ModuleButtonEntity> moduleButtonList = new List<ModuleButtonEntity>();
            ModuleButtonEntity addButtonEntity = new ModuleButtonEntity();
            addButtonEntity.Create();
            addButtonEntity.F_ActionAddress = "/" + codeBaseConfigModel.area + "/" + codeBaseConfigModel.name + "/Form";
            addButtonEntity.F_EnCode = "lr_add";
            addButtonEntity.F_FullName = "新增";
            moduleButtonList.Add(addButtonEntity);
            ModuleButtonEntity editButtonEntity = new ModuleButtonEntity();
            editButtonEntity.Create();
            editButtonEntity.F_ActionAddress = "/" + codeBaseConfigModel.area + "/" + codeBaseConfigModel.name + "/Form";
            editButtonEntity.F_EnCode = "lr_edit";
            editButtonEntity.F_FullName = "编辑";
            moduleButtonList.Add(editButtonEntity);
            ModuleButtonEntity deleteButtonEntity = new ModuleButtonEntity();
            deleteButtonEntity.Create();
            deleteButtonEntity.F_ActionAddress = "/" + codeBaseConfigModel.area + "/" + codeBaseConfigModel.name + "/DeleteForm";
            deleteButtonEntity.F_EnCode = "lr_delete";
            deleteButtonEntity.F_FullName = "删除";
            moduleButtonList.Add(deleteButtonEntity);

            List<ModuleColumnEntity> moduleColumnList = new List<ModuleColumnEntity>();
            int num = 0;
            IEnumerable<DatabaseTableFieldModel> fieldList = databaseTableIBLL.GetTableFiledList(codeBaseConfigModel.databaseLinkId, codeBaseConfigModel.tableName);
            foreach (var fileditem in fieldList)
            {
                ModuleColumnEntity moduleColumnEntity = new ModuleColumnEntity();
                moduleColumnEntity.Create();
                moduleColumnEntity.F_EnCode = fileditem.f_column;
                moduleColumnEntity.F_FullName = fileditem.f_remark;
                moduleColumnEntity.F_SortCode = num;
                moduleColumnEntity.F_ParentId = "0";
                num++;
                moduleColumnList.Add(moduleColumnEntity);
            }
            moduleIBLL.SaveEntity("", moduleEntity, moduleButtonList, moduleColumnList);

            return Success("创建成功");
        }
        #endregion

        #region 快速生成实体类和映射类
        /// <summary>
        /// 快速开发代码查看
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult LookEntityCode(CodeBaseConfigModel codeBaseConfigModel)
        {
            string entityCode = "";
            string mapCode = "";
            codeBaseConfigModel.backProject = ConfigurationManager.AppSettings["BackProject"].ToString();
            string[] tableNameList = codeBaseConfigModel.tableNames.Split(',');
            foreach (string tableName in tableNameList)
            {
                // 实体类
                entityCode += codeGenerator.EntityCreate(codeBaseConfigModel, tableName);
                // 映射类
                mapCode += codeGenerator.MappingCreate(codeBaseConfigModel, tableName);
            }
            var jsonData = new
            {
                entityCode = entityCode,
                mapCode = mapCode
            };

            return Success(jsonData);
        }
        /// <summary>
        /// 快速开发代码创建
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult CreateEntityCode(CodeBaseConfigModel codeBaseConfigModel)
        {
            string codeContent = "";
            codeBaseConfigModel.backProject = ConfigurationManager.AppSettings["BackProject"].ToString();
            string[] tableNameList = codeBaseConfigModel.tableNames.Split(',');
            foreach (string tableName in tableNameList)
            {
                // 实体类
                codeContent = codeGenerator.EntityCreate(codeBaseConfigModel, tableName);
                codeGenerator.CreateEntityCodeFile(codeBaseConfigModel, tableName, codeContent);
                // 映射类
                codeContent = codeGenerator.MappingCreate(codeBaseConfigModel, tableName);
                codeGenerator.CreateMapCodeFile(codeBaseConfigModel, tableName, codeContent);
            }
            return Success("创建成功");
        }
        #endregion

        #region  流程系统表单模板
        /// <summary>
        /// 流程系统表单代码生成
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult LookWorkflowCode(string databaseLinkId, string dbTable, string formData, string queryData, string colData, string baseInfo)
        {
            // 数据
            List<DbTableModel> dbTableObj = dbTable.ToObject<List<DbTableModel>>();
            FormModel formDataObj = formData.ToObject<FormModel>();
            QueryModel queryDataObj = queryData.ToObject<QueryModel>();
            ColModel colDataObj = colData.ToObject<ColModel>();
            BaseModel baseInfoObj = baseInfo.ToObject<BaseModel>();

            // 将表单数据进行一次转化
            Dictionary<string, CompontModel> compontMap = new Dictionary<string, CompontModel>();
            bool haveEditGird = false;
            foreach (var tab in formDataObj.tablist)
            {
                foreach (var compont in tab.componts)
                {
                    if (compont.type == "gridtable")
                    {
                        haveEditGird = true;
                    }
                    compontMap.Add(compont.id, compont);
                }
            }

            // 实体类 映射类
            string entityCode = "";
            string mapCode = "";

            string mainTable = "";

            foreach (var tableOne in dbTableObj)
            {
                bool isMain = false;
                if (string.IsNullOrEmpty(tableOne.relationName))
                {
                    mainTable = tableOne.name;
                    isMain = true;
                }

                // 实体类
                entityCode += codeGenerator.WfEntityCreate(databaseLinkId, tableOne.name, tableOne.pk, baseInfoObj, colDataObj, isMain, formDataObj.workField);
                // 映射类
                mapCode += codeGenerator.MappingCreate(tableOne.name, tableOne.pk, baseInfoObj);
            }

            // 服务类
            string serviceCode = codeGenerator.WfServiceCreate(databaseLinkId, dbTableObj, compontMap, queryDataObj, colDataObj, baseInfoObj, formDataObj.workField);
            // 业务类
            string bllCode = codeGenerator.WfBllCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            // 业务接口类
            string ibllCode = codeGenerator.WfIBllCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            // 控制器类
            string controllerCode = codeGenerator.WfControllerCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            // 页面类
            string indexCode = codeGenerator.IndexCreate(baseInfoObj, compontMap, queryDataObj);
            // 页面js类
            string indexJsCode = codeGenerator.WfIndexJSCreate(baseInfoObj, dbTableObj, formDataObj, compontMap, colDataObj, queryDataObj);
            // 表单类
            string formCode = codeGenerator.FormCreate(baseInfoObj, formDataObj, compontMap, haveEditGird);
            // 表单js类
            string formJsCode = codeGenerator.WfFormJsCreate(baseInfoObj, dbTableObj, formDataObj);


            var jsonData = new
            {
                entityCode = entityCode,
                mapCode = mapCode,
                serviceCode = serviceCode,
                bllCode = bllCode,
                ibllCode = ibllCode,
                controllerCode = controllerCode,
                indexCode = indexCode,
                indexJsCode = indexJsCode,
                formCode = formCode,
                formJsCode = formJsCode
            };

            return Success(jsonData);
        }
        /// <summary>
        /// 流程系统表单代码创建
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult CreateWorkflowCode(string databaseLinkId, string dbTable, string formData, string queryData, string colData, string baseInfo, string moduleEntityJson)
        {
            // 数据
            List<DbTableModel> dbTableObj = dbTable.ToObject<List<DbTableModel>>();
            FormModel formDataObj = formData.ToObject<FormModel>();
            QueryModel queryDataObj = queryData.ToObject<QueryModel>();
            ColModel colDataObj = colData.ToObject<ColModel>();
            BaseModel baseInfoObj = baseInfo.ToObject<BaseModel>();


            var moduleEntity = moduleEntityJson.ToObject<ModuleEntity>();
            moduleEntity.F_Target = "iframe";
            moduleEntity.F_UrlAddress = "/" + baseInfoObj.outputArea + "/" + baseInfoObj.name + "/Index";

            List<ModuleButtonEntity> moduleButtonList = new List<ModuleButtonEntity>();
            ModuleButtonEntity addButtonEntity = new ModuleButtonEntity();
            addButtonEntity.Create();
            addButtonEntity.F_EnCode = "lr_add";
            addButtonEntity.F_FullName = "新增";
            moduleButtonList.Add(addButtonEntity);
            ModuleButtonEntity editButtonEntity = new ModuleButtonEntity();
            editButtonEntity.Create();
            editButtonEntity.F_EnCode = "lr_edit";
            editButtonEntity.F_FullName = "编辑";
            moduleButtonList.Add(editButtonEntity);
            ModuleButtonEntity deleteButtonEntity = new ModuleButtonEntity();
            deleteButtonEntity.Create();
            deleteButtonEntity.F_EnCode = "lr_delete";
            deleteButtonEntity.F_FullName = "删除";
            moduleButtonList.Add(deleteButtonEntity);

            List<ModuleColumnEntity> moduleColumnList = new List<ModuleColumnEntity>();
            int num = 0;
            foreach (var col in colDataObj.fields)
            {
                ModuleColumnEntity moduleColumnEntity = new ModuleColumnEntity();
                moduleColumnEntity.Create();
                moduleColumnEntity.F_EnCode = col.fieldId;
                moduleColumnEntity.F_FullName = col.fieldName;
                moduleColumnEntity.F_SortCode = num;
                moduleColumnEntity.F_ParentId = "0";
                num++;
                moduleColumnList.Add(moduleColumnEntity);
            }
            var moduleEntityTemp = moduleIBLL.GetModuleByUrl(moduleEntity.F_UrlAddress);
            if (moduleEntityTemp == null)
            {
                moduleIBLL.SaveEntity("", moduleEntity, moduleButtonList, moduleColumnList);
            }

            string codeContent = "";
            // 将表单数据进行一次转化
            Dictionary<string, CompontModel> compontMap = new Dictionary<string, CompontModel>();
            bool haveEditGird = false;
            foreach (var tab in formDataObj.tablist)
            {
                foreach (var compont in tab.componts)
                {
                    if (compont.type == "gridtable")
                    {
                        haveEditGird = true;
                    }
                    compontMap.Add(compont.id, compont);
                }
            }


            // 实体类 映射类

            string mainTable = "";

            foreach (var tableOne in dbTableObj)
            {
                bool isMain = false;
                if (string.IsNullOrEmpty(tableOne.relationName))
                {
                    mainTable = tableOne.name;
                    isMain = true;
                }
                // 实体类
                codeContent = codeGenerator.WfEntityCreate(databaseLinkId, tableOne.name, tableOne.pk, baseInfoObj, colDataObj, isMain, formDataObj.workField);
                codeGenerator.CreateEntityCodeFile(baseInfoObj, tableOne.name, codeContent);
                // 映射类
                codeContent = codeGenerator.MappingCreate(tableOne.name, tableOne.pk, baseInfoObj);
                codeGenerator.CreateMapCodeFile(baseInfoObj, tableOne.name, codeContent);
            }

            // 服务类
            codeContent = codeGenerator.WfServiceCreate(databaseLinkId, dbTableObj, compontMap, queryDataObj, colDataObj, baseInfoObj, formDataObj.workField);
            codeGenerator.CreateSerivceCodeFile(baseInfoObj, codeContent);
            // 业务类
            codeContent = codeGenerator.WfBllCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            codeGenerator.CreateBLLCodeFile(baseInfoObj, codeContent);
            // 业务接口类
            codeContent = codeGenerator.WfIBllCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            codeGenerator.CreateIBLLCodeFile(baseInfoObj, codeContent);
            // 控制器类
            codeContent = codeGenerator.WfControllerCreate(baseInfoObj, dbTableObj, compontMap, colDataObj);
            codeGenerator.CreateControllerCodeFile(baseInfoObj, codeContent);
            // 页面类
            codeContent = codeGenerator.IndexCreate(baseInfoObj, compontMap, queryDataObj);
            codeGenerator.CreateIndexCodeFile(baseInfoObj, codeContent);
            // 页面js类
            codeContent = codeGenerator.WfIndexJSCreate(baseInfoObj, dbTableObj, formDataObj, compontMap, colDataObj, queryDataObj);
            codeGenerator.CreateIndexJSCodeFile(baseInfoObj, codeContent);
            // 表单类
            codeContent = codeGenerator.FormCreate(baseInfoObj, formDataObj, compontMap, haveEditGird);
            codeGenerator.CreateFormCodeFile(baseInfoObj, codeContent);
            // 表单js类
            codeContent = codeGenerator.WfFormJsCreate(baseInfoObj, dbTableObj, formDataObj);
            codeGenerator.CreateFormJSCodeFile(baseInfoObj, codeContent);

            return Success("创建成功");
        }

        #endregion

        #region 自定义开发模板（存储过程）
        /// <summary>
        /// 自定义开发模板代码生成（存储过程）
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult LookCustmerProcCode(string databaseLinkId, string dbTable,string dbTablePk, string formData, string queryData, string colData, string baseInfo)
        {
            // 数据
            FormModel formDataObj = formData.ToObject<FormModel>();
            QueryModel queryDataObj = queryData.ToObject<QueryModel>();
            ColModel colDataObj = colData.ToObject<ColModel>();
            BaseModel baseInfoObj = baseInfo.ToObject<BaseModel>();

            // 将表单数据进行一次转化
            Dictionary<string, CompontModel> compontMap = new Dictionary<string, CompontModel>();
            bool haveEditGird = false;
            foreach (var tab in formDataObj.tablist)
            {
                foreach (var compont in tab.componts)
                {
                    if (compont.type == "gridtable")
                    {
                        haveEditGird = true;
                    }
                    compontMap.Add(compont.id, compont);
                }
            }

            // 实体类
            string entityCode = codeGenerator.EntityCreate(databaseLinkId, dbTable, dbTablePk, baseInfoObj, colDataObj, true);
            // 映射类
            string mapCode = codeGenerator.MappingCreate(dbTable, dbTablePk, baseInfoObj);



            //// 服务类
            string serviceCode = codeGenerator.ServiceProcCreate(databaseLinkId, dbTable, dbTablePk, compontMap, queryDataObj, colDataObj, baseInfoObj);
            //// 业务类
            string bllCode = codeGenerator.BllProcCreate(baseInfoObj, dbTable, compontMap, colDataObj);
            //// 业务接口类
            string ibllCode = codeGenerator.IBllProcCreate(baseInfoObj, dbTable, compontMap, colDataObj);
            //// 控制器类
            string controllerCode = codeGenerator.ControllerProcCreate(baseInfoObj, dbTable, compontMap, colDataObj);
            //// 页面类
            string indexCode = codeGenerator.IndexCreate(baseInfoObj, compontMap, queryDataObj);
            //// 页面js类
            string indexJsCode = codeGenerator.IndexJSProcCreate(baseInfoObj, dbTablePk, formDataObj, compontMap, colDataObj, queryDataObj);
            //// 表单类
            string formCode = codeGenerator.FormCreate(baseInfoObj, formDataObj, compontMap, haveEditGird);
            //// 表单js类
            string formJsCode = codeGenerator.FormJsProcCreate(baseInfoObj, formDataObj);


            var jsonData = new
            {
                entityCode = entityCode,
                mapCode = mapCode,
                serviceCode = serviceCode,
                bllCode = bllCode,
                ibllCode = ibllCode,
                controllerCode = controllerCode,
                indexCode = indexCode,
                indexJsCode = indexJsCode,
                formCode = formCode,
                formJsCode = formJsCode
            };

            return Success(jsonData);
        }
        /// <summary>
        /// 快速开发代码创建（存储过程）
        /// </summary>
        /// <param name="codeBaseConfigModel">配置信息</param>
        /// <returns></returns>
        [HttpPost]
        [AjaxOnly]
        public ActionResult CreateCustmerProcCode(string databaseLinkId, string dbTable, string dbTablePk, string formData, string queryData, string colData, string baseInfo, string moduleEntityJson)
        {
            // 数据
            FormModel formDataObj = formData.ToObject<FormModel>();
            QueryModel queryDataObj = queryData.ToObject<QueryModel>();
            ColModel colDataObj = colData.ToObject<ColModel>();
            BaseModel baseInfoObj = baseInfo.ToObject<BaseModel>();


            var moduleEntity = moduleEntityJson.ToObject<ModuleEntity>();
            moduleEntity.F_Target = "iframe";
            moduleEntity.F_UrlAddress = "/" + baseInfoObj.outputArea + "/" + baseInfoObj.name + "/Index";

            List<ModuleButtonEntity> moduleButtonList = new List<ModuleButtonEntity>();
            ModuleButtonEntity addButtonEntity = new ModuleButtonEntity();
            addButtonEntity.Create();
            addButtonEntity.F_EnCode = "lr_add";
            addButtonEntity.F_FullName = "新增";
            moduleButtonList.Add(addButtonEntity);
            ModuleButtonEntity editButtonEntity = new ModuleButtonEntity();
            editButtonEntity.Create();
            editButtonEntity.F_EnCode = "lr_edit";
            editButtonEntity.F_FullName = "编辑";
            moduleButtonList.Add(editButtonEntity);
            ModuleButtonEntity deleteButtonEntity = new ModuleButtonEntity();
            deleteButtonEntity.Create();
            deleteButtonEntity.F_EnCode = "lr_delete";
            deleteButtonEntity.F_FullName = "删除";
            moduleButtonList.Add(deleteButtonEntity);

            List<ModuleColumnEntity> moduleColumnList = new List<ModuleColumnEntity>();
            int num = 0;
            foreach (var col in colDataObj.fields)
            {
                ModuleColumnEntity moduleColumnEntity = new ModuleColumnEntity();
                moduleColumnEntity.Create();
                moduleColumnEntity.F_EnCode = col.fieldId;
                moduleColumnEntity.F_FullName = col.fieldName;
                moduleColumnEntity.F_SortCode = num;
                moduleColumnEntity.F_ParentId = "0";
                num++;
                moduleColumnList.Add(moduleColumnEntity);
            }
            var moduleEntityTemp = moduleIBLL.GetModuleByUrl(moduleEntity.F_UrlAddress);
            if (moduleEntityTemp == null)
            {
                moduleIBLL.SaveEntity("", moduleEntity, moduleButtonList, moduleColumnList);
            }

            string codeContent = "";
            // 将表单数据进行一次转化
            Dictionary<string, CompontModel> compontMap = new Dictionary<string, CompontModel>();
            bool haveEditGird = false;
            foreach (var tab in formDataObj.tablist)
            {
                foreach (var compont in tab.componts)
                {
                    if (compont.type == "gridtable")
                    {
                        haveEditGird = true;
                    }
                    compontMap.Add(compont.id, compont);
                }
            }


            // 实体类 映射类

            // 实体类
            codeContent = codeGenerator.EntityCreate(databaseLinkId, dbTable, dbTablePk, baseInfoObj, colDataObj, true);
            codeGenerator.CreateEntityCodeFile(baseInfoObj, dbTable, codeContent);
            // 映射类
            codeContent = codeGenerator.MappingCreate(dbTable, dbTablePk, baseInfoObj);
            codeGenerator.CreateMapCodeFile(baseInfoObj, dbTable, codeContent);

            // 服务类
            codeContent = codeGenerator.ServiceProcCreate(databaseLinkId, dbTable, dbTablePk, compontMap, queryDataObj, colDataObj, baseInfoObj);
            codeGenerator.CreateSerivceCodeFile(baseInfoObj, codeContent);
            // 业务类
            codeContent = codeGenerator.BllProcCreate(baseInfoObj, dbTable, compontMap, colDataObj);
            codeGenerator.CreateBLLCodeFile(baseInfoObj, codeContent);
            // 业务接口类
            codeContent = codeGenerator.IBllProcCreate(baseInfoObj, dbTable, compontMap, colDataObj);
            codeGenerator.CreateIBLLCodeFile(baseInfoObj, codeContent);
            // 控制器类
            codeContent = codeGenerator.ControllerProcCreate(baseInfoObj, dbTable, compontMap, colDataObj);
            codeGenerator.CreateControllerCodeFile(baseInfoObj, codeContent);
            // 页面类
            codeContent = codeGenerator.IndexCreate(baseInfoObj, compontMap, queryDataObj);
            codeGenerator.CreateIndexCodeFile(baseInfoObj, codeContent);
            // 页面js类
            codeContent = codeGenerator.IndexJSProcCreate(baseInfoObj, dbTablePk, formDataObj, compontMap, colDataObj, queryDataObj);
            codeGenerator.CreateIndexJSCodeFile(baseInfoObj, codeContent);
            // 表单类
            codeContent = codeGenerator.FormCreate(baseInfoObj, formDataObj, compontMap, haveEditGird);
            codeGenerator.CreateFormCodeFile(baseInfoObj, codeContent);
            // 表单js类
            codeContent = codeGenerator.FormJsProcCreate(baseInfoObj, formDataObj);
            codeGenerator.CreateFormJSCodeFile(baseInfoObj, codeContent);

            return Success("创建成功");
        }
        #endregion


        #region 私有方法
        /// <summary>
        /// 获取项目根目录
        /// </summary>
        /// <returns></returns>
        private string GetRootDirectory() {
            string rootDirectory = Server.MapPath("~/Web.config"); ;
            for (int i = 0; i < 2; i++) {
                rootDirectory = rootDirectory.Substring(0, rootDirectory.LastIndexOf('\\')); 
            }
            return rootDirectory;
        }
        #endregion
    }
}