using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using Microsoft.ApplicationBlocks.Data;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;

namespace AppAnalytics
{
    public class DBManager
    {
        public string connectionString { get; set; }
        public DBManager()
        {
            this.connectionString = ConfigurationManager.ConnectionStrings["AppDB"].ConnectionString;
        }
        public bool InsertAppID(string AppName,string AndroidID,string IOSID)
        {
            string commandText = string.Format("insert into AppDetails(AppName,AndroidID,IOSID) values('{0}','{1}','{2}')", AppName, AndroidID, IOSID);
            int inserted = SqlHelper.ExecuteNonQuery(this.connectionString, CommandType.Text, commandText);
            if (inserted == 1)
                return true;
            else
                return false;
        }
        public bool UpdateMasterAppData(DataTable dt, string DeviceID)
        {
            bool UpdateFlag = false;

            List<SqlParameter> commandParameters = new List<SqlParameter>();
            SqlParameter tableValuedParameter = new SqlParameter("@masterAppTable", dt);
            tableValuedParameter.SqlDbType = SqlDbType.Structured;
            commandParameters.Add(tableValuedParameter);
            try
            {
                
                int recordsUpdated = SqlHelper.ExecuteNonQuery(this.connectionString, CommandType.StoredProcedure, "SP_UpdateMasterAppData", commandParameters.ToArray());
                UpdateActivityLog(DeviceID,recordsUpdated);

            }
            catch (Exception Ex)
            {

            }
            return UpdateFlag;
        }
        public bool UpdateAppInformation(AppInformation appInfo)
        {
            bool UpdateFlag = false;
            List<SqlParameter> commandParameters = new List<SqlParameter>();           
            commandParameters.Add(new SqlParameter("@DeviceID", appInfo.DeviceID));
            commandParameters.Add(new SqlParameter("@Version", appInfo.Version));
            commandParameters.Add(new SqlParameter("@Rating", appInfo.Rating));
            commandParameters.Add(new SqlParameter("@ReviewCount", appInfo.ReviewCount));
            commandParameters.Add(new SqlParameter("@ReleaseDate", appInfo.ReleaseDate));
            commandParameters.Add(new SqlParameter("@DevelopedBy", appInfo.DevelopedBy));
            commandParameters.Add(new SqlParameter("@Email", appInfo.Email));
            commandParameters.Add(new SqlParameter("@OneStarCount", appInfo.OneStarCount));
            commandParameters.Add(new SqlParameter("@TwoStarCount", appInfo.TwoStarCount));
            commandParameters.Add(new SqlParameter("@ThreeStarCount", appInfo.ThreeStarCount));
            commandParameters.Add(new SqlParameter("@FourStarCount", appInfo.FourStarCount));
            commandParameters.Add(new SqlParameter("@FiveStarCount", appInfo.FiveStarCount));
            try
            {
                int i = SqlHelper.ExecuteNonQuery(this.connectionString, CommandType.StoredProcedure, "SP_UpdateAppInformation", commandParameters.ToArray());

            }
            catch (Exception Ex)
            {

            }
            return UpdateFlag;
        }
        public static void UpdateActivityLog(string DeviceID, int RecordsAffected = 0)
        {
            string commandText = string.Format("INSERT INTO ActivityLog(DeviceID,RecordsAffected) VALUES('{0}','{1}')", DeviceID, RecordsAffected.ToString());
            int recordsAffected = SqlHelper.ExecuteNonQuery(ConfigurationManager.ConnectionStrings["AppDB"].ConnectionString, CommandType.Text, commandText);

        }
        public string GetAppData(string AppID)
        {
            string commandText = string.Format("SELECT * FROM  MASTERAPPDATA WHERE APPID = '{0}'", AppID);
            DataSet ds =  SqlHelper.ExecuteDataset(this.connectionString, CommandType.Text, commandText);
            string json = JsonConvert.SerializeObject(ds.Tables[0], Formatting.Indented);
            return json;
        }
        public string GetAppInfo(string AppID)
        {
            string androidID = GetAndroidDeviceID(AppID);
            string appleID = GetAppleDeviceID(AppID);
            string commandText = string.Format("SELECT * FROM  APPINFORMATION WHERE DeviceID in ( '{0}', '{1}')", androidID,appleID);
            DataSet ds = SqlHelper.ExecuteDataset(this.connectionString, CommandType.Text, commandText);
            string json = JsonConvert.SerializeObject(ds.Tables[0], Formatting.Indented);
            return json;
        }
        public bool isSyncRequired(string DeviceID)
        {
            bool requiresSync = true;
            string commandText = string.Format("SELECT top 1 SyncDate FROM ActivityLog WHERE DeviceID ='{0}' order by ID desc", DeviceID);
            SqlDataReader result = SqlHelper.ExecuteReader(this.connectionString, CommandType.Text, commandText);
        
            while(result.Read())
            {
                DateTime LastUpdated = DateTime.Parse(result["SyncDate"].ToString());
                if (LastUpdated.Date == DateTime.Now.Date)
                    requiresSync = false;
            }
            return requiresSync;
        }

        public string GetAppleAppID(string DeviceID)
        {
            string AppID = string.Empty;
            string commandText = string.Format("select top 1 AppID from AppDetails where IOSID='{0}'",DeviceID);
            SqlDataReader result = SqlHelper.ExecuteReader(this.connectionString, CommandType.Text, commandText);
            while (result.Read())
            {
                AppID = result["AppID"].ToString();

                    
            }
            
            return AppID;
        }
        public string GetAndroidAppID(string DeviceID)
        {
            string AppID = string.Empty;
            string commandText = string.Format("select top 1 AppID from AppDetails where AndroidID='{0}'", DeviceID);
            SqlDataReader result = SqlHelper.ExecuteReader(this.connectionString, CommandType.Text, commandText);
            if (result.HasRows)
            {
                while (result.Read())
                {
                    AppID = result["AppID"].ToString();

                }
            }
            return AppID;
        }
        public string GetAndroidDeviceID(string AppID)
        {
            string DeviceID = string.Empty;
            string commandText = string.Format("select top 1 AndroidID from AppDetails where AppID='{0}'", AppID);
            SqlDataReader result = SqlHelper.ExecuteReader(this.connectionString, CommandType.Text, commandText);
            if (result.HasRows)
            {
                while (result.Read())
                {
                    DeviceID = result["AndroidID"].ToString();

                }
            }
            return DeviceID;
        }
        public string GetAppleDeviceID(string AppID)
        {
            string DeviceID = string.Empty;
            string commandText = string.Format("select top 1 IOSID from AppDetails where AppID='{0}'", AppID);
            SqlDataReader result = SqlHelper.ExecuteReader(this.connectionString, CommandType.Text, commandText);
            if (result.HasRows)
            {
                while (result.Read())
                {
                    DeviceID = result["IOSID"].ToString();

                }
            }
            return DeviceID;
        }

    }
}