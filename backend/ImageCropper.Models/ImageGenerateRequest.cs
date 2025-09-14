using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using SixLabors.ImageSharp;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageCropper.Models
{
    public class CropData
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }
    public class ImageGenerateRequest
    {
        public string? ImageBase64 { get; set; }
        public CropData? Crop { get; set; }
    }
}
