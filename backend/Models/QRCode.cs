namespace backend.Models
{
    public class QRCode
    {
        public int Id { get; set; }

        public string text { get; set; } = string.Empty;

        public string image { get; set; } = string.Empty;

        public int scans { get; set; } = 0;

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}
