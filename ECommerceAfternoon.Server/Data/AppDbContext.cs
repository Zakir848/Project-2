using ECommerceAfternoon.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAfternoon.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Category> Categories => Set<Category>();
    }
}
