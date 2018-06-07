using Learun.Application.Organization;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Learun.Application.IMServer
{
    /// <summary>
    /// 版 本 Learun-ADMS V6.1.6.0 力软敏捷开发框架
    /// Copyright (c) 2013-2017 上海力软信息技术有限公司
    /// 创建人：力软-框架开发组
    /// 日 期：2017.04.01
    /// 描 述：即使通信服务(可供客户端调用的方法开头用小写)
    /// </summary>
    [HubName("ChatsHub")]
    public class Chats : Hub
    {
        private DepartmentIBLL departmentIBLL = new DepartmentBLL();
        private UserIBLL userIBLL = new UserBLL();
        
        #region 重载Hub方法
        /// <summary>
        /// 建立连接
        /// </summary>
        /// <returns></returns>
        public override Task OnConnected()
        {
            return base.OnConnected();
        }
        /// <summary>
        /// 断开连接
        /// </summary>
        /// <param name="stopCalled">是否是客户端主动断开：true是,false超时断开</param>
        /// <returns></returns>
        public override Task OnDisconnected(bool stopCalled)
        {
            return base.OnDisconnected(stopCalled);
        }
        /// <summary>
        /// 重新建立连接
        /// </summary>
        /// <returns></returns>
        public override Task OnReconnected()
        {
            return base.OnReconnected();
        }
        #endregion

        #region 客户端操作
        /// <summary>
        /// 添加在线用户
        /// </summary>
        public void AddOnline()
        {
            string clientId = Context.ConnectionId;
            string userId = GetUserId();

            Groups.Add(clientId, userId);
        }
        /// <summary>
        /// 移除在线用户
        /// </summary>
        public void RemoveOnline()
        {
            string clientId = Context.ConnectionId;
            string userId = GetUserId();

            Groups.Remove(clientId, userId);
        }
        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="msg"></param>
        public void SendMsg(string toUserId, string msg)
        {
            string dateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            string userId = GetUserId();
            //imcontentbll.AddOneToOne(toUser, userId, userName, message);
            //Clients.Group(toUserId).RevMessage(userId, message, dateTime);
        }
        #endregion

        #region 获取联系人信息（联系人列表，群列表，最近联系人列表）
        /// <summary>
        /// 获取用户列表
        /// </summary>
        /// <param name="departmentId">部门主键</param>
        /// <returns></returns>
        public async Task<IEnumerable<UserEntity>> GetUserList(string departmentId)
        {

            Task<IEnumerable<UserEntity>> t = Task.Factory.StartNew<IEnumerable<UserEntity>>(() => userIBLL.GetListByDepartmentId(departmentId));
            return await t;
        }
        #endregion

        #region 一般公用方法
        /// <summary>
        /// 获取登录用户Id
        /// </summary>
        /// <returns></returns>
        private string GetUserId()
        {
            string userId = "";
            if (Context.QueryString["userId"] != null)
            {
                userId = Context.QueryString["userId"];
            }
            return userId;
        }
        #endregion
    }
}
