using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageCropper.Models
{
    public class LogoConfigRequest
    {
        public float ScaleDown { get; set; } // max 0.25
        public string? LogoPosition { get; set; } 
        public string? LogoImage { get; set; } 
    }
}
