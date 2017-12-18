using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Instech.DataTracker;

namespace TestMain
{
    class Program
    {
        static void Main(string[] args)
        {
            var serverIp = "127.0.0.1";
            var serverPort = 19;
            DataTracker.Init("123", serverIp, serverPort, msg =>
            {
                Console.WriteLine("Error: " + msg);
            });
            var result = DataTracker.SendData(new TrackDataUserInfo()
            {
                gender = 1,
                age = 16,
                channel = 0
            });
            Console.WriteLine(result ? "发送成功" : "发送失败");
            Console.ReadKey();
        }
    }
}
