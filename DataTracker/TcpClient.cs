using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Instech.DataTracker
{
    /// <summary>
    /// TCP客户端
    /// </summary>
    internal class TcpClient
    {
        /// <summary>
        /// 连接已就绪
        /// </summary>
        public bool isReady { get => m_isReady && m_socket != null && m_socket.Connected; }
        private bool m_isReady;

        /// <summary>
        /// 总发送字节数
        /// </summary>
        public int totalSendLength { get; private set; }

        private IPEndPoint m_ipEnd;
        private Socket m_socket;
        private Action<string> m_errorCallback;

        /// <summary>
        /// 初始化
        /// </summary>
        /// <param name="ip">服务端IP地址</param>
        /// <param name="port">服务端端口号</param>
        /// <param name="stateCallback">接收连接结果的回调</param>
        /// <param name="errorCallback">发生错误时的回调</param>
        public void Init(
            string ip,
            int port,
            Action<string> errorCallback,
            Action<bool> stateCallback)
        {
            m_ipEnd = new IPEndPoint(IPAddress.Parse(ip), port);
            m_socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            m_errorCallback = errorCallback;
            m_isReady = false;
            totalSendLength = 0;
            m_socket.BeginConnect(m_ipEnd, result =>
            {
                try
                {
                    m_socket.EndConnect(result);
                    m_isReady = true;
                    stateCallback?.Invoke(true);
                }
                catch (Exception)
                {
                    stateCallback?.Invoke(false);
                }
            }, null);
        }

        /// <summary>
        /// 关闭连接
        /// </summary>
        public void Uninit()
        {
            if (m_socket != null)
            {
                if (m_socket.Connected)
                {
                    m_socket.Disconnect(false);
                }
                m_socket.Close();
                m_socket = null;
            }
        }

        /// <summary>
        /// 发送数据
        /// </summary>
        /// <param name="msg"></param>
        public void SendData(string msg)
        {
            if (!isReady || msg == "")
            {
                return;
            }
            try
            {
                // \n\t\n是消息分隔符
                byte[] data = Encoding.UTF8.GetBytes(msg + "\n\t\n");
                m_socket.BeginSend(data, 0, data.Length, SocketFlags.None, result =>
                {
                    // 发送成功
                    m_socket.EndSend(result);
                    totalSendLength += data.Length;
                }, null);
            }
            catch (Exception e)
            {
                // 发送失败
                m_errorCallback?.Invoke($"消息发送失败: [{e.GetType()}]{e.Message}");
            }
        }
    }
}
