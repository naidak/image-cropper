using ImageCropper.Models;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageCropper.Services.Image
{
    public interface IImageService
    {
        public Task<byte[]> GeneratePreviewAsync(ImageGenerateRequest request);
        public Task<byte[]> GenerateCroppedImageAsync(ImageGenerateRequest request);
        public Task SaveConfig(LogoConfigRequest request);
    }
}
