using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

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

    }
}
