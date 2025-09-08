using ImageCropper.Data.ConfigRepository;
using ImageCropper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageCropper.Services
{
    public class ConfigService
    {
        private readonly IConfigRepository _repo;
        public ConfigService(IConfigRepository repo) => _repo = repo;

        public Task<Config?> GetLastConfigAsync() => _repo.GetLastAsync();
        public Task<Config?> GetConfigByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task AddConfigAsync(Config cfg) => _repo.AddAsync(cfg);
        public Task UpdateConfigAsync(Config cfg) => _repo.UpdateAsync(cfg);
    }
}
