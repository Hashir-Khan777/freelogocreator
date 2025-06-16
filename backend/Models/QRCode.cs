namespace backend.Models
{
    public class QRCode
    {
        public int Id { get; set; }

        public string text { get; set; } = string.Empty;

        public string note { get; set; } = string.Empty;

        public string image { get; set; } = string.Empty;

        public string color { get; set; } = string.Empty;

        public string logo { get; set; } = string.Empty;

        public int user_id { get; set; }

        public bool deleted { get; set; } = false;

        public int scans { get; set; } = 0;

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        public User? user { get; set; }

        public List<Scans>? qrscans { get; set; }
    }
}
