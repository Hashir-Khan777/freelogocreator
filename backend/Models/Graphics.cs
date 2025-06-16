namespace backend.Models
{
    public class Graphics
    {
        public int Id { get; set; }

        public string graphic { get; set; } = string.Empty;

        public string backGraphic { get; set; } = string.Empty;

        public string title { get; set; } = string.Empty;

        public string description { get; set; } = string.Empty;

        public string tags { get; set; } = string.Empty;

        public int category_id { get; set; }

        public Categories? category { get; set; }

        public List<LogoStats>? logostats { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}
