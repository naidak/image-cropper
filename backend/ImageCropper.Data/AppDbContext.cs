using ImageCropper.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ImageCropper.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

        public DbSet<Config> Configs { get; set; } = null!;
    }
}
