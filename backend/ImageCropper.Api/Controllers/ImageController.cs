using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Drawing;
using System.Drawing;
using ImageCropper.Services.Image;
using ImageCropper.Models;

[ApiController]
[Route("api/image")]
public class ImageController : ControllerBase
{
    private readonly IImageService _imageService;
    public ImageController(IImageService imageService)
    {
        _imageService = imageService;
    }
    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] ImageGenerateRequest request)
    {
        var croppedBytes = await _imageService.GenerateCroppedImageAsync(request);
        return File(croppedBytes, "image/png");
    }

    [HttpPost("preview")]
    public async Task<IActionResult> Preview([FromBody] ImageGenerateRequest request)
    {
        var previewBytes = await _imageService.GeneratePreviewAsync(request);
        return File(previewBytes, "image/png");
    }
}