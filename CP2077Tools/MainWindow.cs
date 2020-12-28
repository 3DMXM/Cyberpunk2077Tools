using System;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Catel.IoC;
using CP77.Common.Services;
using CP77.Common.Tools.FNV1A;
using CP77Tools;
using CP77Tools.Common.Services;
using NetDimension.NanUI;
using NetDimension.NanUI.HostWindow;
using WolvenKit.Common.Services;

namespace CP2077Tools
{
    class MainWindow : Formium
    {
        // 设置窗体样式类型
        //public override HostWindowType WindowType => throw new NotImplementedException();
        public override HostWindowType WindowType => HostWindowType.Borderless; // 窗口样式类型 无边框

        //public override string StartUrl => throw new NotImplementedException();
        //public override string StartUrl => "https://cn.bing.com";  //内嵌的网站
        public override string StartUrl => "http://www.app.local";  //内嵌的网站
        //public override string StartUrl => "https://mod.3dmgame.com";  //内嵌的网站

        public MainWindow()
        {

            Size = new System.Drawing.Size(1280, 720);  // 窗体大小
            MinimumSize = new System.Drawing.Size(1180, 640);   // 窗体最小大小
            StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;    // 设置或获取窗口的启动位置。当WindowType为Kiosk时此设置无效。
            BorderlessWindowProperties.BorderEffect = BorderEffect.RoundCorner; // 无边框效果 沾满整个窗体
            BorderlessWindowProperties.ShadowEffect = ShadowEffect.Shadow;  // 显示光晕
            Title = "赛博朋克2077";

            //DisableSystemMenu = false;

            //Mask = "";
            //Mask.Image = Image.FromFile("wwwroot\\img\\welcome.gif");
            Mask.Image = Image.FromFile("wwwroot\\img\\welcome.png");
            //Mask.AutoHide = false;

            Icon = new System.Drawing.Icon("wwwroot\\img\\2077.ico", 40, 40);

            AllowSystemMenu = false;

            //Subtitle = "第一个NanUI应用程序";
            //StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            //BorderlessWindowProperties.ShadowEffect = ShadowEffect.DropShadow;
            //LoadEnd += BrowserLoadEnd;  // 自定义页面样式

            DocumentTitleChanged += MainWindow_DocumentTitleChanged;    // 页面副标题更改时调用

            Loadhashes();
        }

        private void MainWindow_DocumentTitleChanged(object sender, NetDimension.NanUI.Browser.DocumentTitleChangedEventArgs e)
        {
            Subtitle = e.Title; // 修改标题变更
        }

        // 初始化
        private static async Task Loadhashes()
        {
            //ServiceLocator.Default.RegisterType<ILoggerService, LoggerService>();
            //ServiceLocator.Default.RegisterType<IHashService, HashService>();
            //ServiceLocator.Default.RegisterType<IMainController, MainController>();

            ServiceLocator.Default.RegisterType<ILoggerService, LoggerService>();
            ServiceLocator.Default.RegisterType<IHashService, HashService>();
            ServiceLocator.Default.RegisterType<IAppSettingsService, AppSettingsService>();

            var hashService = ServiceLocator.Default.ResolveType<IHashService>();
            await hashService.ReloadLocally();

            //var logger = ServiceLocator.Default.ResolveType<ILoggerService>();
            //var _maincontroller = ServiceLocator.Default.ResolveType<IMainController>();
            ////var logger = ServiceLocator.Default.ResolveType<ILoggerService>();
            //Stopwatch watch = new Stopwatch();
            //watch.Restart();
            //var hashDictionary = new ConcurrentDictionary<ulong, string>();
            //Parallel.ForEach(File.ReadLines(Constants.ArchiveHashesPath), line =>
            //{
            //    // check line
            //    line = line.Split(',', StringSplitOptions.RemoveEmptyEntries).First();
            //    if (!string.IsNullOrEmpty(line))
            //    {
            //        ulong hash = FNV1A64HashAlgorithm.HashString(line);
            //        hashDictionary.AddOrUpdate(hash, line, (key, val) => val);
            //    }
            //});

            //_maincontroller.Hashdict = hashDictionary.ToDictionary(
            //    entry => entry.Key,
            //    entry => entry.Value);
            //watch.Stop();
            //logger.LogString($"Loaded {hashDictionary.Count} hashes in {watch.ElapsedMilliseconds}ms.", Logtype.Success);
        }
    }

    //public static class Constants
    //{
    //    public static string ResourcesPath => Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "CP2077Tool/Resources");
    //    public static string ArchiveHashesPath =>
    //        Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "CP2077Tool/Resources/archivehashes.txt");
    //    public static string LooseHashesPath =>
    //        Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "CP2077Tool/Resources/archivehashes.csv");
    //    public static string ArchiveHashesZipPath =>
    //        Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "CP2077Tool/Resources/archivehashes.zip");
    //}
}
