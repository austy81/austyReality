using System.Data.Entity;

namespace AustyReality.Models
{
    public class RealityDbContext : DbContext
    {
        public RealityDbContext()
                : base("RealityDbContext")
            {
                Database.SetInitializer(new RealityDbInitializer());
                Configuration.ProxyCreationEnabled = false; 
            }
            public DbSet<Reality> Realities { get; set; }
            public DbSet<RealityImage> RealityImages { get; set; }
            public DbSet<RealityUser> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Reality>().Property(reality => reality.Latitude).HasPrecision(18,7);
            modelBuilder.Entity<Reality>().Property(reality => reality.Longitude).HasPrecision(18,7);
        }
    }


}
