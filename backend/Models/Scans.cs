namespace backend.Models
{
    public class Scans
    {
        public int Id { get; set; }

        public int? qrcodeid { get; set; }

        public int? userid { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        public User? user { get; set; }

        public QRCode? qrcode { get; set; }
    }
}
