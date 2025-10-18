using Microsoft.EntityFrameworkCore;
using PharmacyFinder.API.Models;

namespace PharmacyFinder.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Pharmacy> Pharmacies { get; set; } = null!;
        public DbSet<Medicine> Medicines { get; set; } = null!;

         protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Medicine>()
                .Property(m => m.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}
