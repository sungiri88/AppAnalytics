using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;

namespace AppAnalytics
{
    public class SQLCheck
    {
        public bool ConnectionCheck()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["AppDB"].ConnectionString;
            using(SqlConnection con = new SqlConnection(connectionString))
            {
                try
                {
                    con.Open();
                    con.Close();
                }
                catch(Exception E)
                {
                    return false;
                }
            }
            return true;
        }


    }
}