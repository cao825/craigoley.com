using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CraigOleycom.Models
{
    public class Project
    {
        public int ID { get; set; }
        public string name { get; set; }
        public string short_description { get; set; }
        public string description { get; set; }
        public string img_url { get; set; }
        public string repo_url { get; set; }
        public string target_url { get; set; }
        public IEnumerable<Technology> technologies { get; set; }
    }
}