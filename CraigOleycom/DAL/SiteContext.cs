using CraigOleycom.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace CraigOleycom.DAL
{
    public class SiteContext : DbContext
    {
        public SiteContext()
            : base("SiteContext")
        {

        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<Configuration> Configurations { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}