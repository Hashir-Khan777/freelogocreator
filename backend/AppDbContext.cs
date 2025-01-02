using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Graphics> Graphics { get; set; }
        public DbSet<Categories> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Graphics>()
                .HasOne(g => g.category)
                .WithMany(c => c.graphics)
                .HasForeignKey(g => g.category_id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}