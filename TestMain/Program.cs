﻿using System;
using Instech.DataTracker;

namespace TestMain
{
    class Program
    {
        static void Main(string[] args)
        {
            var serverIp = "127.0.0.1";
            var serverPort = 62849;
            DataTracker.Init("123\"", Environment.UserName, serverIp, serverPort, msg =>
            {
                Console.WriteLine("Error: " + msg);
            });
            DataTracker.SendData(new TrackDataUserInfo()
            {
                gender = 1,
                age = 16,
                channel = 0
            }, (result) =>
             {
                 Console.WriteLine(result ? "发送成功" : "发送失败");
             });
            Console.ReadKey();
        }
    }
}
