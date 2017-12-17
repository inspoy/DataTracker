using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public static void Init(string uid)
        {
            Instance.InstanceInit(uid);
        }

        /// <summary>
        /// 发送追踪数据
        /// </summary>
        /// <param name="data"></param>
        public static void SendData(ITrackData data)
        {
            Instance.InstanceSendData(data);
        }
        #endregion

        private void InstanceInit(string uid)
        {

        }

        private void InstanceSendData(ITrackData data)
        {

        }
    }
}
