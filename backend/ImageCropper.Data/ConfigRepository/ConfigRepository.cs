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

        public async Task<Config?> GetByIdAsync(int id)
            => await _db.Configs.FindAsync(id);

        public async Task SaveConfigAsync(Config config)
        {
            var existing = await _db.Configs.FirstOrDefaultAsync();
            if (existing != null)
            {
                // Copy all relevant fields from the new config
                existing.ScaleDown = config.ScaleDown;
                existing.LogoPosition = config.LogoPosition;

                // Only update LogoImage if it is not null (so delete works properly)
                if (config.LogoImage != null && config.LogoImage.Length > 0)
                    existing.LogoImage = config.LogoImage;

                _db.Configs.Update(existing);
            }
            else
            {
                await _db.Configs.AddAsync(config);
            }

            await _db.SaveChangesAsync();
        }

        public async Task<Config?> GetConfigAsync() => await _db.Configs.FirstOrDefaultAsync();

        public async Task UpdateAsync(Config config)
        {
            _db.Configs.Update(config);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteLogoAsync(int id)
        {
            var config = await GetByIdAsync(id);
            if (config == null)
                throw new ArgumentException($"Config with id {id} not found.");

            config.LogoImage = null;
            _db.Configs.Update(config);
            await _db.SaveChangesAsync();
        }
    }
}
