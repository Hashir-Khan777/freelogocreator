using System.Text.Json.Serialization;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string name { get; set; } = string.Empty;

        public string email { get; set; } = string.Empty;

        public string password { get; set; } = string.Empty;

        public string image { get; set; } = string.Empty;

        public string role { get; set; } = string.Empty;

        public string ipaddress { get; set; } = string.Empty;

        public bool verified { get; set; } = false;

        public int createdqrcodes { get; set; } = 0;

        public int downloadedlogos { get; set; } = 0;

        public string? sessionId { get; set; } = null;

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        [JsonIgnore]
        public List<QRCode>? qrCodes { get; set; }

        public List<Scans>? scans { get; set; }

        public List<LogoStats>? logostats { get; set; }
    }
}
