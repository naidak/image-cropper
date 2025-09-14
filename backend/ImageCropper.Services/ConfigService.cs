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
        public Task<Config?> GetConfigByIdAsync(int id) => _repo.GetByIdAsync(id);
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
                Id = config.Id,
                ScaleDown = config.ScaleDown,
                LogoPosition = config.LogoPosition,
                LogoImage = config.LogoImage != null
                    ? $"data:image/png;base64,{Convert.ToBase64String(config.LogoImage)}"
                    : null
            };
        }

        public async Task UpdateLogoConfigAsync(int id, LogoConfigRequest request)
        {
            var config = await _repo.GetByIdAsync(id);
            if (config == null)
                throw new ArgumentException($"Configuration with id {id} not found.");

            if (request.ScaleDown > 0.25f)
                throw new ArgumentException("ScaleDown cannot be greater than 0.25");

            config.ScaleDown = request.ScaleDown;
            config.LogoPosition = request.LogoPosition;

            if (!string.IsNullOrEmpty(request.LogoImage))
                config.LogoImage = Convert.FromBase64String(request.LogoImage.Split(',')[1]);

            await _repo.UpdateAsync(config);
        }
        public async Task DeleteLogoAsync(int id)
        {
            await _repo.DeleteLogoAsync(id);
        }
    }
}
