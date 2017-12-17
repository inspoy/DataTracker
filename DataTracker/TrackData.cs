using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Instech.DataTracker
{
    /// <summary>
    /// 追踪数据的数据结构
    /// </summary>
    public interface ITrackData
    {
        string EventName { get; }
    }

    /// <summary>
    /// 用户信息
    /// </summary>
    public class TrackDataUserInfo : ITrackData
    {
        public string EventName => "UserInfo";
        
        /// <summary>
        /// 性别：0-未指定 1-男 2-女
        /// </summary>
        public int gender;
        /// <summary>
        /// 年龄
        /// </summary>
        public int age;
    }
}
