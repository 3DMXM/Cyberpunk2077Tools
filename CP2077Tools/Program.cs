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

<<<<<<< HEAD

=======
>>>>>>> 212c22f8632843257f56aeb8d4a3440f3163b6d0
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

<<<<<<< HEAD
                //app.UseDebuggingMode();
=======
                app.UseDebuggingMode();
>>>>>>> 212c22f8632843257f56aeb8d4a3440f3163b6d0

                app.UseMainWindow(context => new MainWindow());

            }).Build().Run();

        }
    }
}
