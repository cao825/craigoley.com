using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CraigOleycom.Models
{
    public class Project
    {
        public int ID { get; set; }
        public string name { get; set; }
        [Display(Name = "Short Description")]
        public string short_description { get; set; }
        [Display(Name = "Description")]
        public string description { get; set; }
        public string img_url { get; set; }
        [Display(Name = "Repository URL")]
        public string repo_url { get; set; }
        [Display(Name = "Link")]
        public string target_url { get; set; }
        public IEnumerable<Technology> technologies { get; set; }
    }
}