using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Reflection;
using System.Data.SqlClient;
using System.Data.OleDb;
using System.Configuration;
using Excel;
using System.IO;
using System.Threading.Tasks;

namespace AppAnalytics
{
    public class AppCore
    {
        public List<MasterAppData> MasterAppDataList { get; set; }
        public bool syncData()
        {
            // 1. Check Activity Log for last sync
            // 2. If Last update is not today, Call the API function to fetch latest data
            // 3. Update the tables viz., AppInformation, MasterAppData and Activity Log

            DBManager dbManager = new DBManager();

            List<string> AppleDeviceIDList = ConfigurationManager.AppSettings["AppleDeviceIDList"].Split(new char[] { ',' }).ToList();
            Apple apple = new Apple();
            Parallel.ForEach(AppleDeviceIDList, AppleDeviceID =>
            {

               if(dbManager.isSyncRequired(AppleDeviceID))
               {
                   string JSONString = apple.GetAPIResponse(AppleDeviceID);
                   string AppID = dbManager.GetAppleAppID(AppleDeviceID);
                   DataTable masterAppDataTable = apple.GetMasterAppData(JSONString,AppID);
                   dbManager.UpdateMasterAppData(masterAppDataTable,AppleDeviceID);
                   AppInformation appInfo = apple.GetAppInformation(JSONString);
                   dbManager.UpdateAppInformation(appInfo);
               }
            });

            List<string> AndroidDeviceIDList = ConfigurationManager.AppSettings["AndroidDeviceIDList"].Split(new char[] { ',' }).ToList();
            Android android = new Android();
            Parallel.ForEach(AndroidDeviceIDList, AndroidDeviceID =>
            {
                if (dbManager.isSyncRequired(AndroidDeviceID))
                {
                    string JSONString = android.GetAPIResponse(AndroidDeviceID);
                    string AppID = dbManager.GetAndroidAppID(AndroidDeviceID);
                    DataTable masterAppDataTable = android.GetMasterAppData(JSONString, AppID);
                    dbManager.UpdateMasterAppData(masterAppDataTable,AndroidDeviceID);
                    AppInformation appInfo = android.GetAppInformation(JSONString);
                    dbManager.UpdateAppInformation(appInfo);
                }
            });

            return true;
        }

    }
 
    public class AppInformation
    {
        public string DeviceID { get; set; }
        public string Version { get; set; }
        public decimal Rating { get; set; }
        public int ReviewCount { get; set; }
        public string DevelopedBy { get; set; }
        public string Email { get; set; }
        public int OneStarCount { get; set; }
        public int TwoStarCount { get; set; }
        public int ThreeStarCount { get; set; }
        public int FourStarCount { get; set; }
        public int FiveStarCount { get; set; }
        public string ReleaseDate { get; set; }
    }

    public class MasterAppData
    {
        public int AppID { get; set; }
        public string AppDevice { get; set; }
        public string Author { get; set; }
        public string Title { get; set; }
        public string Review { get; set; }
        public string Version { get; set; }
        public int Rating { get; set; }
        public DateTime ReviewDate { get; set; }
    }
    public class BulkImportFromExcel
    {
        public bool importData()
        {

            string filePath = @"C:\Users\Umapathy\Desktop\Book3.xlsx";
            string DeviceID = "";
            FileStream stream = File.Open(filePath, FileMode.Open, FileAccess.Read);
            IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
            excelReader.IsFirstRowAsColumnNames = true;
            var MasterAppDataList = new List<MasterAppData>();
            excelReader.Read();
            while(excelReader.Read())
            {
                MasterAppDataList.Add(new MasterAppData
                {
                    AppID = int.Parse(excelReader.GetString(0)),
                    AppDevice = excelReader.GetString(1),
                    Author = excelReader.GetString(3),
                    Title = excelReader.GetString(4),
                    Review = excelReader.GetString(5),
                    Version = excelReader.GetString(7),
                    Rating = int.Parse(excelReader.GetString(6)),
                    ReviewDate = DateTime.Parse(excelReader.GetString(2))
                });
            }
            DataTable dt = MasterAppDataList.ToDataTable();

            DBManager dbManager = new DBManager();
            return dbManager.UpdateMasterAppData(dt,DeviceID);
        }

    }
    
    
}
