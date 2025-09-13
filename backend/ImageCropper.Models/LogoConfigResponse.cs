using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageCropper.Models
{
    public class LogoConfigResponse
    {
        public int Id { get; set; }
        public float ScaleDown { get; set; }
        public string LogoPosition { get; set; }
        public string LogoImage { get; set; }
    }
}
