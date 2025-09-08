using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Drawing;
using SixLabors.ImageSharp.Drawing.Processing;
using ImageCropper.Services.Image;
using ImageCropper.Models;

public class ImageService: IImageService
{
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

        
        // Resize na 5% od cropanog dijela
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
        var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(',')[1]);

        using var image = SixLabors.ImageSharp.Image.Load(imageBytes);

        var rect = new SixLabors.ImageSharp.Rectangle(
            request.Crop.X,
            request.Crop.Y,
            request.Crop.Width,
            request.Crop.Height
        );

        var cropped = image.Clone(ctx => ctx.Crop(rect));

        using var ms = new MemoryStream();
        await cropped.SaveAsPngAsync(ms);
        ms.Position = 0;

       return ms.ToArray();
    }

}
