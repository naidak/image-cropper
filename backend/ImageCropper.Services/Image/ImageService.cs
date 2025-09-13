using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using ImageCropper.Services.Image;
using ImageCropper.Models;
using Microsoft.AspNetCore.Mvc;
using ImageCropper.Data;

public class ImageService: IImageService
{
    private readonly AppDbContext _db;
    public ImageService(AppDbContext db) => _db = db;
    public async Task<byte[]> GeneratePreviewAsync(ImageGenerateRequest request)
    {
        var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(',')[1]);

        using var image = SixLabors.ImageSharp.Image.Load(imageBytes);

        var rect = new SixLabors.ImageSharp.Rectangle(
            request.Crop.X,
            request.Crop.Y,
            request.Crop.Width,
            request.Crop.Height
        );

        var cropped = image.Clone(ctx => ctx.Crop(rect));

        int previewWidth = Math.Max(1, (int)(image.Size.Width * 0.05));
        int previewHeight = Math.Max(1, (int)(image.Size.Height * 0.05));

        cropped.Mutate(x => x.Resize(previewWidth, previewHeight));

        using var ms = new MemoryStream();
        await cropped.SaveAsPngAsync(ms);
        ms.Position = 0;

        return ms.ToArray();
    }


    public async Task<byte[]> GenerateCroppedImageAsync(ImageGenerateRequest request)
    {
        // 1. Load cropped image
        var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(',')[1]);
        using var image = SixLabors.ImageSharp.Image.Load<Rgba32>(imageBytes);

        var rect = new SixLabors.ImageSharp.Rectangle(
            request.Crop.X,
            request.Crop.Y,
            request.Crop.Width,
            request.Crop.Height
        );

        var cropped = image.Clone(ctx => ctx.Crop(rect));

        var config = _db.Configs.FirstOrDefault();

        if (config != null)
        {
            // 2. Load logo from config
            using var logo = SixLabors.ImageSharp.Image.Load<Rgba32>(config.LogoImage);

            // 3. Scale logo
            int logoWidth = (int)(logo.Width * config.ScaleDown);
            int logoHeight = (int)(logo.Height * config.ScaleDown);
            logo.Mutate(x => x.Resize(logoWidth, logoHeight));

            // 4. Determine position
            int xPos = config.LogoPosition switch
            {
                "top-left" => 0,
                "top-right" => cropped.Width - logoWidth,
                "bottom-left" => 0,
                "bottom-right" => cropped.Width - logoWidth,
                _ => cropped.Width - logoWidth
            };

            int yPos = config.LogoPosition switch
            {
                "top-left" => 0,
                "top-right" => 0,
                "bottom-left" => cropped.Height - logoHeight,
                "bottom-right" => cropped.Height - logoHeight,
                _ => cropped.Height - logoHeight
            };

            // 5. Overlay logo
            cropped.Mutate(ctx => ctx.DrawImage(logo, new Point(xPos, yPos), 1f));
        }
        // 6. Return as PNG
        using var ms = new MemoryStream();
        await cropped.SaveAsPngAsync(ms);
        ms.Position = 0;
        return ms.ToArray();
    }
}
