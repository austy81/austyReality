using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace AustyReality.Models
{
    public class OsmRealityContext : DbContext
    {
        public OsmRealityContext()
                : base("dbContext")
            {
                Database.SetInitializer<OsmRealityContext>(new RealityDbInitializer());
                this.Configuration.ProxyCreationEnabled = false; 
            }
            public DbSet<Reality> Realities { get; set; }
            public DbSet<RealityImage> RealityImages { get; set; }
            public DbSet<RealityUser> Users { get; set; }
    
    }
}
