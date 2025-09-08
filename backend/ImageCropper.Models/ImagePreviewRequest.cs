using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ImageCropper.Models
{
    public class ImagePreviewRequest
    {
        public IFormFile Image { get; set; } = null!;
        public List<System.Drawing.PointF> CropCoordinates { get; set; } = new(); // polygon, min 3 points
    }
}
