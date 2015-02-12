namespace CraigOleycom.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Configurations",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        key = c.String(),
                        value = c.String(),
                        parent_ID = c.Int(),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.Configurations", t => t.parent_ID)
                .Index(t => t.parent_ID);
            
            CreateTable(
                "dbo.Projects",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        short_description = c.String(),
                        description = c.String(),
                        img_url = c.String(),
                        repo_url = c.String(),
                        target_url = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.Technologies",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        name = c.String(),
                        img_url = c.String(),
                        target_url = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Configurations", "parent_ID", "dbo.Configurations");
            DropIndex("dbo.Configurations", new[] { "parent_ID" });
            DropTable("dbo.Technologies");
            DropTable("dbo.Projects");
            DropTable("dbo.Configurations");
        }
    }
}
