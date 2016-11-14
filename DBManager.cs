using System;
using System.Configuration;

namespace AppAnalytics
{
    public class DBManager
    {
        public string connectionString { get; set; }
        public DBManager()
        {
            this.connectionString = ConfigurationManager.ConnectionStrings["AppDB"].ConnectionString;
        }
        public InsertAppID(string appID)
        {

        }
    }
}
