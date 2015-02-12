using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CraigOleycom.Models
{
    public class Configuration
    {
        public int ID { get; set; }
        public string key { get; set; }
        public string value { get; set; }
        public Configuration parent { get; set; }
    }
}