
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using NetDimension.NanUI.DataServiceResource;
using NetDimension.NanUI.ResourceHandler;
using CP77Tools.Tasks;
using WolvenKit.Common.Tools.DDS;
using CP2077Tools;
using System.IO;
using WolvenKit.Common.Services;
using CP77.CR2W.Archive;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Cyberpunk2077Tools.Service
{
    // api.app.local/api
    class apiService : DataService
    {

        public string[] archivePath;

        //public Archive ar;

        // api.app.local/api/hi
        public ResourceResponse Hi(ResourceRequest request)
        {
            return Text("Hello NanUI!");
        }
<<<<<<< HEAD

        public ResourceResponse closeApp(ResourceRequest request)
        {

            System.Environment.Exit(0);   //这是最彻底的退出方式，不管什么线程都被强制退出，把程序结束的很干净，退出时有可能会抛出异常  
            return Json(new { code = "00", msg = "关闭完成" });
        }
=======
>>>>>>> 212c22f8632843257f56aeb8d4a3440f3163b6d0
        // 选择文件 获取列表
        public ResourceResponse SelectFile(ResourceRequest request)
        {

            string[] file = request.UploadFiles;  //选择的文件路径

            if (file != null)
            {
                archivePath = file;
                //var fileList = getGameFileList(file[0]); // 获取 archive文件中的文件列表
                //return Json(new { code = "00", filePath = file, fileList = fileList });
                return Json(new { code = "00", filePath = file });

                //var fileList = new JObject {  };
                //return Json(new { code = "00", filePath = file, fileList = fileList });
            }
            else
            {
                return Json(new { code = "99", msg = "文件路径为空" });
            }
        }

        // 导出文件
        public ResourceResponse ExtractSelectedFile(ResourceRequest request)
        {

            var PFileData = ((JObject)JsonConvert.DeserializeObject(request.StringContent)).ToObject<PostFileData>();   //接收并转换传递过来的文件格式

            string outpath = PFileData.ExtractFolder;

            if (outpath == null) outpath = ""; 

            foreach (var FileHash in PFileData.FileHashList)
            {
                ExtractFileToFolder(PFileData.FilePath, outpath, FileHash, false);
            }
            return Json(new { code = "00", msg = "文件导出完成" });
        }
        // 导出所有文件
        public ResourceResponse ExtractAllFile(ResourceRequest request)
        {

            var PFileData = ((JObject)JsonConvert.DeserializeObject(request.StringContent)).ToObject<PostFileData>();   //接收并转换传递过来的文件格式

            string outpath = PFileData.ExtractFolder;

            if (outpath == null) outpath = "";

            foreach (var File in PFileData.FileList)
            {
                ExtractFileToFolder(File, outpath, 0x00, true);
            }

            return Json(new { code = "00", msg = "完毕" });
        }

        // 获取 .archive 文件中的所有文件列表
        private List<FileListType> getGameFileList(string filePath)
        {
            //DirectoryInfo outDir;
            var inputFileInfo = new FileInfo(filePath);
            var inputDirInfo = new DirectoryInfo(filePath);

            var tobeprocessedarchives = inputFileInfo.Exists
                    ? new List<FileInfo> { inputFileInfo } :
                    inputDirInfo.GetFiles().Where(_ => _.Extension == ".archive");

            List<FileListType> FileList = new List<FileListType>();
            foreach (var processedarchive in tobeprocessedarchives)
            {
                var ar = new Archive(processedarchive.FullName);
                foreach (var entry in ar.Files)
                {
                    FileListType FLT = new FileListType();
                    FLT.FileValue = entry.Value.NameStr;
                    FLT.FileHash = entry.Value.NameHash64;
                    FLT.FileType = Logtype.Normal;
                    FileList.Add(FLT);

                }
            }

            return FileList;
        }

        // 提取文件到文件夹
        private void ExtractFileToFolder(string file, string outpath, ulong hash, bool allFile)
        {
            // get outdirectory
            DirectoryInfo outDir;

            //var inputDirInfo = new DirectoryInfo(file);
            FileInfo inputFileInfo = new FileInfo(file);

            if (outpath == null || outpath == "" )
            {
                outpath = inputFileInfo.DirectoryName;
            }

            outDir = new DirectoryInfo(outpath);
            if (!outDir.Exists)
            {
                outDir = Directory.CreateDirectory(outpath);
            }

            outDir = Directory.CreateDirectory(Path.Combine(
                   outDir.FullName,
                   inputFileInfo.Name.Replace(".archive", "")));

            var ar = new Archive(file);

            if (ar == null) return;

            if (allFile)
            {
                ar.ExtractAll(outDir, null, null);
            }
            else
            {
                ar.ExtractSingle(hash, outDir); // 提取单个文件到指定目录
            }
        }

    }


    public class FileListType
    {
        public string FileValue { get; set; }
        public Logtype FileType { get; set; }
        public ulong FileHash { get; set; }
    }

    public class PostFileData
    {
        public List<ulong> FileHashList { get; set; }
        public List<string> FileList { get; set; }
        public string ExtractFolder { get; set; }
        public string FilePath { get; set; }
    }
}
