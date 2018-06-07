using Learun.Application.WorkFlow;
using Learun.Util;
using Nancy;
using System.Collections.Generic;

namespace Learun.Application.WebApi.Modules
{
    public class WorkFlowApi : BaseApi
    {
        /// <summary>
        /// 注册接口
        /// </summary>
        public WorkFlowApi()
            : base("/learun/adms/workflow")
        {
            Get["/bootstraper"] = GetBootstraper;
            Get["/taskinfo"] = Taskinfo;
            Get["/processinfo"] = ProcessInfo;


            Get["/mylist"] = GetMyProcess;// 获取数据字典详细列表
            Get["/mytask"] = GetMyTaskList;
            Get["/mytaskmaked"] = GetMyMakeTaskList;

            Post["/create"] = Create;
            Post["/audit"] = Audit;


        }

        private WfEngineIBLL wfEngineIBLL = new WfEngineBLL();
        private WfProcessInstanceIBLL wfProcessInstanceIBLL = new WfProcessInstanceBLL();
        private WfTaskIBLL wfTaskIBLL = new WfTaskBLL();
        private WfSchemeIBLL wfSchemeIBLL = new WfSchemeBLL();


        /// <summary>
        /// 获取我的流程实例信息
        /// </summary>
        /// <param name="_"></param>
        /// <returns></returns>
        private Response GetMyProcess(dynamic _)
        {
            QueryModel parameter = this.GetReqData<QueryModel>();

            IEnumerable<WfProcessInstanceEntity> list = new List<WfProcessInstanceEntity>();
            list = wfProcessInstanceIBLL.GetMyPageList(this.userInfo.userId, parameter.pagination, parameter.queryJson);
            var jsonData = new
            {
                rows = list,
                total = parameter.pagination.total,
                page = parameter.pagination.page,
                records = parameter.pagination.records,
            };
            return Success(jsonData);
        }


        /// <summary>
        /// 获取我的任务列表
        /// </summary>
        /// <param name="_"></param>
        /// <returns></returns>
        private Response GetMyTaskList(dynamic _)
        {
            QueryModel parameter = this.GetReqData<QueryModel>();

            IEnumerable<WfProcessInstanceEntity> list = new List<WfProcessInstanceEntity>();
            list = wfTaskIBLL.GetActiveList(this.userInfo, parameter.pagination, parameter.queryJson);
            var jsonData = new
            {
                rows = list,
                total = parameter.pagination.total,
                page = parameter.pagination.page,
                records = parameter.pagination.records,
            };
            return Success(jsonData);
        }

        /// <summary>
        /// 获取我已处理的任务列表
        /// </summary>
        /// <param name="_"></param>
        /// <returns></returns>
        private Response GetMyMakeTaskList(dynamic _)
        {
            QueryModel parameter = this.GetReqData<QueryModel>();

            IEnumerable<WfProcessInstanceEntity> list = new List<WfProcessInstanceEntity>();
            list = wfTaskIBLL.GetHasList(this.userInfo.userId, parameter.pagination, parameter.queryJson);
            var jsonData = new
            {
                rows = list,
                total = parameter.pagination.total,
                page = parameter.pagination.page,
                records = parameter.pagination.records,
            };
            return Success(jsonData);
        }


        /// <summary>
        /// 初始化流程模板->获取开始节点数据
        /// </summary>
        /// <param name="_"></param>
        /// <returns></returns>
        private Response GetBootstraper(dynamic _)
        {
            WfParameter wfParameter = this.GetReqData<WfParameter>();
            wfParameter.companyId = this.userInfo.companyId;
            wfParameter.departmentId = this.userInfo.departmentId;
            wfParameter.userId = this.userInfo.userId;
            wfParameter.userName = this.userInfo.realName;

            WfResult<WfContent> res = wfEngineIBLL.Bootstraper(wfParameter);
            return this.Success<WfResult<WfContent>>(res);
        }
        /// <summary>
        /// 获取流程实例信息
        /// </summary>
        /// <param name="_"></param>
        /// <returns></returns>
        private Response ProcessInfo(dynamic _)
        {
            WfParameter wfParameter = this.GetReqData<WfParameter>();
            wfParameter.companyId = this.userInfo.companyId;
            wfParameter.departmentId = this.userInfo.departmentId;
            wfParameter.userId = this.userInfo.userId;
            wfParameter.userName = this.userInfo.realName;

            WfResult<WfContent> res = wfEngineIBLL.GetProcessInfo(wfParameter);
            return this.Success<WfResult<WfContent>>(res);
        }

        /// <summary>
        /// 获取流程审核节点的信息
        /// </summary>
        /// <param name="_"></param>
        /// <returns></returns>
        private Response Taskinfo(dynamic _)
        {
            WfParameter wfParameter = this.GetReqData<WfParameter>();
            wfParameter.companyId = this.userInfo.companyId;
            wfParameter.departmentId = this.userInfo.departmentId;
            wfParameter.userId = this.userInfo.userId;
            wfParameter.userName = this.userInfo.realName;

            WfResult<WfContent> res = wfEngineIBLL.GetTaskInfo(wfParameter);
            return this.Success<WfResult<WfContent>>(res);
        }

        #region 提交信息
        /// <summary>
        /// 创建流程实例
        /// </summary>
        /// <param name="_"></param>
        /// <returns></returns>
        private Response Create(dynamic _)
        {
            WfParameter wfParameter = this.GetReqData<WfParameter>();
            wfParameter.companyId = this.userInfo.companyId;
            wfParameter.departmentId = this.userInfo.departmentId;
            wfParameter.userId = this.userInfo.userId;
            wfParameter.userName = this.userInfo.realName;

            WfResult res = wfEngineIBLL.Create(wfParameter);
            return this.Success<WfResult>(res);
        }
        /// <summary>
        /// 审核流程实例
        /// </summary>
        /// <param name="_"></param>
        /// <returns></returns>
        private Response Audit(dynamic _)
        {
            WfParameter wfParameter = this.GetReqData<WfParameter>();
            wfParameter.companyId = this.userInfo.companyId;
            wfParameter.departmentId = this.userInfo.departmentId;
            wfParameter.userId = this.userInfo.userId;
            wfParameter.userName = this.userInfo.realName;

            WfResult res = wfEngineIBLL.Audit(wfParameter);
            return this.Success<WfResult>(res);
        }
        #endregion
        /// <summary>
        /// 查询条件对象
        /// </summary>
        private class QueryModel
        {
            public Pagination pagination { get; set; }
            public string queryJson { get; set; }
        }
    }
}