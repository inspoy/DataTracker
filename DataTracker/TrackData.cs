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
        /// <summary>
        /// 用户渠道
        /// </summary>
        public int channel;
    }

    /// <summary>
    /// 准备发送到服务器的最终数据结构
    /// </summary>
    internal class TrackDataToSend
    {
        /// <summary>
        /// 用户唯一ID
        /// </summary>
        public string uid;
        /// <summary>
        /// 人类可读的用户昵称
        /// </summary>
        public string userName;
        /// <summary>
        /// 每次游玩的唯一ID，本次游玩期间保持不变
        /// </summary>
        public string sessionId;
        /// <summary>
        /// 发送时间（Unix时间戳）
        /// </summary>
        public int sendTime;
        /// <summary>
        /// 追踪数据
        /// </summary>
        public ITrackData data;
    }
}
