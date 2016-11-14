using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Net.Http.Formatting;
using Microsoft.ApplicationBlocks.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppAnalytics
{
    public class AppController : ApiController
    {

        #region Default API Methods
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return id.ToString();
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
        #endregion

        #region AppController Methods

        public bool AddApp(string AppID)
        {

            return true;
        }
        [HttpGet]
        public bool CheckDBConnection()
        {
            SQLCheck sqlHelpher = new SQLCheck();
            return sqlHelpher.ConnectionCheck();
            
        }
        [HttpGet]
        public bool AddAppID(string AppName, string AndroidID, string IOSID)
        {
            DBManager dbManager = new DBManager();
            return dbManager.InsertAppID(AppName, AndroidID, IOSID);
        }
        [HttpGet]
        public bool BulkImport()
        {
            BulkImportFromExcel bulkImport = new BulkImportFromExcel();
            bulkImport.importData();
            return true;
        }
        [HttpGet]
        public HttpResponseMessage GetAppData(string AppID)
        {
            string JsonData = (new DBManager()).GetAppData(AppID);
            var response = new HttpResponseMessage()
            {
                Content = new StringContent(JsonData,Encoding.UTF8, "application/json")
            };
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            return response;
            
        }
        [HttpGet]
        public HttpResponseMessage GetAppInfo(string AppID)
        {
            string JsonData = (new DBManager()).GetAppInfo(AppID);
            var response = new HttpResponseMessage()
            {
                Content = new StringContent(JsonData, Encoding.UTF8, "application/json")
            };
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            return response;

        }
        [HttpGet]
        public bool SyncData()
        {
            
            return (new AppCore()).syncData();

        }
        #endregion
    }
}