using ImageCropper.Models;
using ImageCropper.Services;
using ImageCropper.Services.Image;
using Microsoft.AspNetCore.Mvc;

namespace ImageCropper.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly ConfigService _configService;

        public ConfigController(ConfigService configService)
        {
            _configService = configService;
        }
        [HttpPost("save-config")]
        public async Task<IActionResult> SaveConfig([FromBody] LogoConfigRequest request)
        {
            try
            {
                await _configService.SaveLogoConfigAsync(request);
                return Ok("Logo configuration saved successfully.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get-config")]
        public async Task<IActionResult> GetConfig()
        {
            var config = await _configService.GetLogoConfigAsync();
            if (config == null)
                return NotFound("No configuration found");

            return Ok(config);
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateConfig(int id, [FromBody] LogoConfigRequest request)
        {
            try
            {
                await _configService.UpdateLogoConfigAsync(id, request);
                return Ok($"Configuration {id} updated successfully.");
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpDelete("delete-logo/{id}")]
        public async Task<IActionResult> DeleteLogo(int id)
        {
            await _configService.DeleteLogoAsync(id);
            return NoContent();
        }

    }
}
