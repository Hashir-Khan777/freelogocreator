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
        public DbSet<Packages> Packages { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Queries> Queries { get; set; }
        public DbSet<Logs> Logs { get; set; }
        public DbSet<Newsletter> Newsletter { get; set; }
        public DbSet<QRCode> QRCode { get; set; }
        public DbSet<Scans> Scans { get; set; }
        public DbSet<LogoStats> LogoStats { get; set; }

        public DbSet<SavedLogos> SavedLogos { get; set; }

        private void AuditChanges()
        {


            var entries = ChangeTracker.Entries()
                                        .Where(e => e.State == EntityState.Added
                                                 || e.State == EntityState.Modified
                                                 || e.State == EntityState.Deleted).ToList();

            foreach (var entry in entries)
            {
                var entityId = entry.Property("Id").CurrentValue;
                var entityTableName = entry.Metadata.GetTableName();
                var auditEntry = new Logs
                {
                    entity_name = entry.Entity.GetType().Name,
                    action_type = entry.State.ToString(),
                    created_at = DateTime.UtcNow
                };

                Logs.Add(auditEntry);
            }
        }

        public override int SaveChanges()
        {
            AuditChanges();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            AuditChanges();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Graphics>()
                .HasOne(g => g.category)
                .WithMany(c => c.graphics)
                .HasForeignKey(g => g.category_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SavedLogos>()
                .HasOne(g => g.user)
                .WithMany(c => c.savedLogos)
                .HasForeignKey(g => g.user_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QRCode>()
                .HasOne(g => g.user)
                .WithMany(c => c.qrCodes)
                .HasForeignKey(g => g.user_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Scans>()
                .HasOne(g => g.qrcode)
                .WithMany(c => c.qrscans)
                .HasForeignKey(g => g.qrcodeid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Scans>()
                .HasOne(g => g.user)
                .WithMany(c => c.scans)
                .HasForeignKey(g => g.userid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LogoStats>()
                .HasOne(g => g.user)
                .WithMany(c => c.logostats)
                .HasForeignKey(g => g.userid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LogoStats>()
                .HasOne(g => g.graphic)
                .WithMany(c => c.logostats)
                .HasForeignKey(g => g.graphicid)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}