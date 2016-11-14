using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Net;
using System.Configuration;
using System.Text;
using System.IO;
using System.Threading.Tasks;

namespace AppAnalytics
{
    public class Android
    {
        public string GetAPIResponse(string DeviceID)
        {
            string APIurl = ConfigurationManager.AppSettings["AndroidAPI"] + DeviceID + ".json";
            string responseFromServer = string.Empty;
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(APIurl);
            webRequest.Method = "GET";
            webRequest.Headers.Add("X-Apptweak-Key", ConfigurationManager.AppSettings["Header"]);
            System.Net.ServicePointManager.ServerCertificateValidationCallback =
                ((sender, certificate, chain, sslPolicyErrors) => true);
            using (WebResponse webResponse = webRequest.GetResponse())
            {
                var httpResponse = (HttpWebResponse)webResponse;
                using (StreamReader reader = new StreamReader(webResponse.GetResponseStream()))
                {
                    responseFromServer = reader.ReadToEnd();
                }
            }
            return responseFromServer;
        }
        public DataTable GetMasterAppData(string JSONString, string appID)
        {
            JToken token = JObject.Parse(JSONString);
            var ReviewArray = token.SelectToken("content.reviews") as JArray;
            List<MasterAppData> MasterAppDataList = new List<MasterAppData>();
            foreach (JToken item in ReviewArray)
            {
                string _reviewDate = (string)item["date"];
                string _date = _reviewDate.Trim().Split(new char[0])[0].ToString();
                string reviewDate = DateTime.Parse(_date).ToShortDateString();
                string author = (string)item["author"]["name"];
                string title = (string)item["title"];
                string review = (string)item["body"];
                string version = (string)item["version"];
                int rating = (int)item["rating"];
                MasterAppDataList.Add(new MasterAppData
                {
                    AppID = int.Parse(appID),
                    AppDevice = "Android",
                    Author = author,
                    Title = title,
                    Review = review,
                    Version = version,
                    Rating = rating,
                    ReviewDate = DateTime.Parse(reviewDate)
                });
            }
            return MasterAppDataList.ToDataTable();

        }
        public AppInformation GetAppInformation(string JSONString)
        {
            JToken token = JObject.Parse(JSONString);
            AppInformation appInfo = new AppInformation();
            appInfo.DeviceID = (string)token.SelectToken("content.application_id");
            var VersionArray = token.SelectToken("content.store_info.versions") as JArray;
            appInfo.Version = VersionArray.Select(v => (string)v["version"]).First();
            string _releaseDate = VersionArray.Select(v => (string)v["release_date"]).First();
            string _date = _releaseDate.Trim().Split(new char[0])[0].ToString();
            appInfo.ReleaseDate = DateTime.Parse(_date).ToShortDateString();
            appInfo.DevelopedBy = (string)token.SelectToken("content.developer.name");
            appInfo.Email = (string)token.SelectToken("content.developer.email");
            decimal _Rating = (decimal)token.SelectToken("content.ratings.average");
            appInfo.Rating = Math.Round(_Rating, 3);
            appInfo.ReviewCount = (int)token.SelectToken("content.ratings.count");
            appInfo.OneStarCount = (int)token.SelectToken("content.ratings.star_count.1");
            appInfo.TwoStarCount = (int)token.SelectToken("content.ratings.star_count.2");
            appInfo.ThreeStarCount = (int)token.SelectToken("content.ratings.star_count.3");
            appInfo.FourStarCount = (int)token.SelectToken("content.ratings.star_count.4");
            appInfo.FiveStarCount = (int)token.SelectToken("content.ratings.star_count.5");
            return appInfo;
        }
    }
}