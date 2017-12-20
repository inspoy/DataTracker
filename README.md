# DataTracker

## 前言
由于Unity的Analytics服务的免费版不支持原始数据导出，该工具是为了配合Unity的数据分析服务，收集原始数据，但也仅限于收集，并没有分析的功能，要分析的话需要自行导出数据并使用喜欢的数据可视化工具来分析。

当然服务端要准备好自建的服务器，支持Node.js的任何操作系统均可。

## 为什么不用现成的解决方案
现在有友盟，TalkingData，DataEye等成熟的第三方数据分析服务，不过这些服务都是针对手游的，提供的数据有很大一部分是我们用不到的，而且做这个的目的只是单纯为了获得原始数据来进行更定制化的分析（如果有这个需求），而基本的数据如活跃用户，留存率，关卡进度等，在Unity自带的Analytics服务中就已经提供了良好的交互体验了。

# 用法
接入起来非常简单︿(￣︶￣)︿

## 客户端
编译工程，把`DataTracker.dll`放到Unity工程里。在游戏启动时使用`DataTracker.Init()`
```csharp
DataTracker.Init("123", "Tom", serverIp, serverPort, msg =>
{
    Console.WriteLine("Error: " + msg);
});
```
五个参数
1. `uid` - 用户唯一识别ID，同样的ID将会被视为同一个用户
2. `userName` - 人类可读的用户昵称，可以为空
3. `ip` - 服务端IP地址
4. `port` - 服务端端口号，默认是62849
5. `errorCallback` - 发生错误时的回调，参数是错误信息，建议绑定自己的日志方法（默认的`Debug.LogError()`也OK）

发送数据样例
```csharp
DataTracker.SendData(new TrackDataUserInfo()
{
    gender = 1,
    age = 16,
    channel = 0
}, result =>
{
    Debug.Log(result ? "发送成功" : "发送失败");
});
```
两个参数
1. `data` - 要发送的数据，必须是实现`ITrackData`接口的数据结构
2. `callback` - 发送数据是异步的，当任务执行完毕后会触发这个回调函数，参数是发送是否成功的布尔值

## 服务端
将代码clone到服务器上任意位置，进入`DataServer`工程的目录

安装并配置好MySQL数据库，创建数据库`DataTracker`（名字随意，这是默认值）

打开`conf.ts`（如果没有配置TypeScript的话可以直接修改`conf.js`）配置数据库名称，用户名和密码。

然后执行`node ./`根据提示操作即可~