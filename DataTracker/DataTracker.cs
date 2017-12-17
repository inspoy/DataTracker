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

        /// <summary>
        /// 初始化
        /// </summary>
        public static void Init()
        {
            Instance.InstanceInit();
        }

        private void InstanceInit()
        {

        }
    }
}
