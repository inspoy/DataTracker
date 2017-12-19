using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Instech.DataTracker
{
    /// <summary>
    /// 数据追踪器
    /// </summary>
    public class DataTracker
    {
        #region 单例实现
        private static DataTracker sm_instance;
        private static DataTracker Instance
        {
            get
            {
                if (sm_instance == null)
                {
                    sm_instance = new DataTracker();
                }
                return sm_instance;
            }
        }
        private DataTracker() { }
        #endregion
        #region 静态接口方法
        /// <summary>
        /// 初始化
        /// </summary>
        /// <param name="uid">用户唯一ID</param>
        /// <param name="userName">人类可读的用户昵称</param>
        /// <param name="ip">服务端IP地址</param>
        /// <param name="port">服务端端口号</param>
        /// <param name="errorCallback">发生错误时的回调</param>
        public static void Init(string uid, string userName, string ip, int port, Action<string> errorCallback)
        {
            Instance.InstanceInit(uid, userName, ip, port, errorCallback);
        }

        /// <summary>
        /// 发送追踪数据
        /// </summary>
        /// <param name="data"></param>
        /// <param name="callback">调用结果，返回true为成功</param>
        public static void SendData(ITrackData data, Action<bool> callback)
        {
            Instance.InstanceSendData(data, callback);
        }
        #endregion

        private string m_uid;
        private string m_userName;
        private string m_ip;
        private int m_port;
        private Action<string> m_errorCallback;
        private List<TrackDataToSend> m_listRetry = new List<TrackDataToSend>();

        private void InstanceInit(string uid, string userName, string ip, int port, Action<string> errorCallback = null)
        {
            m_uid = uid;
            m_userName = userName;
            m_ip = ip;
            m_port = port;
            m_errorCallback = errorCallback;
        }

        private void InstanceSendData(ITrackData data, Action<bool> callback)
        {
            if (data == null)
            {
                return;
            }
            var client = new TcpClient();
            client.Init(m_ip, m_port, m_errorCallback, succ =>
            {
                if (!succ || client == null || !client.isReady)
                {
                    // 网络异常
                    m_errorCallback?.Invoke("连接失败");
                    callback(false);
                    return;
                }
                var finalData = new TrackDataToSend()
                {
                    uid = m_uid,
                    userName = m_userName,
                    sendTime = (int)(DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0)).TotalSeconds,
                    data = data
                };
                client.SendData(JsonConvert.SerializeObject(finalData), (ret) =>
                {
                    client.Uninit();
                    client = null;
                    callback(ret);
                });
            });
        }
    }
}
