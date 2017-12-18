using System;
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
        /// <param name="ip">服务端IP地址</param>
        /// <param name="port">服务端端口号</param>
        /// <param name="errorCallback">发生错误时的回调</param>
        public static void Init(string uid, string ip, int port, Action<string> errorCallback)
        {
            Instance.InstanceInit(uid, ip, port, errorCallback);
        }

        /// <summary>
        /// 发送追踪数据
        /// </summary>
        /// <param name="data"></param>
        public static bool SendData(ITrackData data)
        {
            return Instance.InstanceSendData(data);
        }
        #endregion

        private string m_uid;
        private TcpClient m_client;
        private bool m_connected;

        private void InstanceInit(string uid, string ip, int port, Action<string> errorCallback = null)
        {
            m_uid = uid;
            m_client = new TcpClient();
            m_client.Init(ip, port, errorCallback, succ =>
            {
                m_connected = succ;
                if (!m_connected)
                {
                    errorCallback?.Invoke("连接失败");
                }
            });
        }

        private bool InstanceSendData(ITrackData data)
        {
            if (!m_connected || m_client == null || !m_client.isReady)
            {
                // 网络异常
                return false;
            }
            var finalData = new TrackDataToSend()
            {
                uid = m_uid,
                sendTime = (int)(DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0)).TotalSeconds,
                data = data
            };
            m_client.SendData(JsonConvert.SerializeObject(finalData));
            return true;
        }
    }
}
