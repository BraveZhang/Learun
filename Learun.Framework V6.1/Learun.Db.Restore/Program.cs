using Learun.Cache.Base;
using Learun.Cache.Factory;
using Learun.DataBase.Repository;
using System;
using System.Threading;

namespace Learun.Db.Restore
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("开启数据库还原服务！");
            var db = new RepositoryFactory();
            while (true)
            {
                try
                {
                    // 数据库还原
                    string strSql = " ALTER DATABASE LearunFramework_Base_61 SET OFFLINE WITH ROLLBACK IMMEDIATE ";
                    strSql += " RESTORE DATABASE LearunFramework_Base_61 FROM DISK = 'D:\\database61.bak' WITH  NOUNLOAD, REPLACE, STATS = 10 ";
                    strSql += " ALTER database LearunFramework_Base_61 set online ";

                    db.BaseRepository().ExecuteBySql(strSql);

                    // 缓存还原
                    ICache cache = CacheFactory.CaChe();
                    for (int i = 0; i < 16; i++)
                    {
                        cache.RemoveAll(i);
                    }

                    Console.WriteLine("成功还原一次！【" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "】");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("失败！【" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "】:" + ex.ToString());
                }
                Thread.Sleep(6000 * 60 * 2);
            }
        }
    }
}
