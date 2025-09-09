using ImageCropper.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageCropper.Data.ConfigRepository
{
    public class ConfigRepository : IConfigRepository
    {
        private readonly AppDbContext _db;
        public ConfigRepository(AppDbContext db) => _db = db;

        public async Task<Config?> GetLastAsync()
            => await _db.Configs.OrderByDescending(c => c.CreatedAt).FirstOrDefaultAsync();

        public async Task<Config?> GetByIdAsync(int id)
            => await _db.Configs.FindAsync(id);

        public async Task AddAsync(Config cfg)
        {
            _db.Configs.Add(cfg);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Config cfg)
        {
            _db.Configs.Update(cfg);
            await _db.SaveChangesAsync();
        }

        public async Task SaveConfigAsync(Config config)
        {
            
            var existing = await _db.Configs.FirstOrDefaultAsync();
            if (existing != null)
            {
                existing.ScaleDown = config.ScaleDown;
                existing.LogoPosition = config.LogoPosition;
                existing.LogoImage = config.LogoImage;
            }
            else
            {
                await _db.Configs.AddAsync(config);
            }

            await _db.SaveChangesAsync();
        }
    }
}
