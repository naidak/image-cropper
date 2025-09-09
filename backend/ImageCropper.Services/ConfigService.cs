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
        public async Task SaveLogoConfigAsync(LogoConfigRequest request)
        {
            if (request.ScaleDown > 0.25f)
                throw new ArgumentException("ScaleDown cannot be greater than 0.25");

            var config = new Config
            {
                ScaleDown = request.ScaleDown,
                LogoPosition = request.LogoPosition,
                LogoImage = Convert.FromBase64String(request.LogoImage.Split(',')[1])
            };

            await _repo.SaveConfigAsync(config);
        }
        public async Task<LogoConfigResponse?> GetLogoConfigAsync()
        {
            var config = await _repo.GetConfigAsync();
            if (config == null) return null;

            return new LogoConfigResponse
            {
                ScaleDown = config.ScaleDown,
                LogoPosition = config.LogoPosition,
                LogoImage = $"data:image/png;base64,{Convert.ToBase64String(config.LogoImage)}"
            };
        }

    }
}
