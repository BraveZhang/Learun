using Learun.Util;
using System;
using System.IO;
using System.Text;
using System.Windows.Forms;
using Yahoo.Yui.Compressor;

namespace Learun.Dev.Tool
{
    public partial class 力软开发小工具 : Form
    {
        public 力软开发小工具()
        {
            InitializeComponent();
        }

        private static JavaScriptCompressor javaScriptCompressor = new JavaScriptCompressor();
        private static CssCompressor cssCompressor = new CssCompressor();


        /// <summary>
        /// 同步bin文件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void button1_Click(object sender, EventArgs e)
        {
            string formPath = Config.GetValue("FormPath") + "\\Learun.Framework.Module\\";//来源文件目录
            string toPath = Config.GetValue("ToPath");    //目标文件目录
            string[] filePaths = DirFileHelper.GetFileNames(formPath,"*",true);

            textBox1.Clear();
            textBox1.AppendText("开始复制文件\r\n");
            int num = 0;

            foreach (string filePath in filePaths)
            {
                if (filePath.IndexOf("\\bin\\Release") != -1)
                {
                    textBox1.AppendText(num + ":" + filePath + "\r\n");
                    string path = toPath + filePath.Replace(formPath, "");
                    FileInfo fi = new FileInfo(path);
                    if (!Directory.Exists( fi.DirectoryName))
                        Directory.CreateDirectory(fi.DirectoryName);
                    System.IO.File.Copy(filePath, path, true);
                    num++;
                }
            }
            textBox1.AppendText("结束复制文件\r\n");
        }

        private void button2_Click(object sender, EventArgs e)
        {
            string formPath = Config.GetValue("FormPath") + "\\Learun.Application.Web\\";//来源文件目录
            string toPath = Config.GetValue("ToPathWeb");    //目标文件目录
            textBox1.Clear();
            textBox1.AppendText("开始复制文件\r\n");
            string[] filePaths = DirFileHelper.GetFileNames(formPath, "*", true);

            int num = 0;

            foreach (string filePath in filePaths)
            {
                if (filePath.IndexOf("\\bin\\") == -1 && filePath.IndexOf("\\obj\\") == -1 && filePath.IndexOf("Learun.Application.Web.csproj") == -1)
                {
                    textBox1.AppendText(num + ":" + filePath + "\r\n");
                    string path = toPath + filePath.Replace(formPath, "");
                    if (filePath.IndexOf("\\LR_Content\\") != -1)
                    {
                        string content = File.ReadAllText(filePath, Encoding.UTF8);
                        FileInfo fi = new FileInfo(path);
                        if (fi.Extension == ".js")
                        {
                            if (!string.IsNullOrEmpty(content))
                            {
                                content = javaScriptCompressor.Compress(content);
                            }
                            DirFileHelper.CreateFileContent(path, content);
                        }
                        else if (fi.Extension == ".css")
                        {
                            if (!string.IsNullOrEmpty(content))
                            {
                                content = cssCompressor.Compress(content);
                            }
                            DirFileHelper.CreateFileContent(path, content);
                        }
                        else
                        {
                            if (!Directory.Exists(fi.DirectoryName))
                                Directory.CreateDirectory(fi.DirectoryName);
                            System.IO.File.Copy(filePath, path, true);
                        }
                       
                    }
                    else
                    {
                        FileInfo fi = new FileInfo(path);
                        if (!Directory.Exists(fi.DirectoryName))
                            Directory.CreateDirectory(fi.DirectoryName);
                        System.IO.File.Copy(filePath, path, true);
                    }
                    num++;
                }
            }
            textBox1.AppendText("结束复制文件\r\n");

        }
    }
}
