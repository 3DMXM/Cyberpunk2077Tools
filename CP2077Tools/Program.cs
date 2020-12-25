using NetDimension.NanUI;
using NetDimension.NanUI.DataServiceResource;
using NetDimension.NanUI.EmbeddedFileResource;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CP2077Tools
{
    static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {

#if NETCOREAPP3_1
            Application.SetHighDpiMode(HighDpiMode.PerMonitorV2);
#endif

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            //Application.Run(new Form1());

            WinFormium.CreateRuntimeBuilder(env =>
            {
                env.CustomCefSettings(settings =>
                {

                });

                env.CustomCefCommandLineArguments(commandLine =>
                {

                });
            }, app =>
            {

                app.UseEmbeddedFileResource("http", "www.app.local", "wwwroot");

                app.UseDataServiceResource("http", "api.app.local");

                app.UseDebuggingMode();

                app.UseMainWindow(context => new MainWindow());

            }).Build().Run();

        }
    }
}
