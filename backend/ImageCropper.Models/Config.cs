namespace ImageCropper.Models
{
    public class Config
    {
        public int Id { get; set; }
        public float ScaleDown { get; set; }
        public string LogoPosition { get; set; } = "bottom-right";
        public byte[]? LogoImage { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
