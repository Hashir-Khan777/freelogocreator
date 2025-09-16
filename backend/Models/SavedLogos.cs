namespace backend.Models
{
    public class SavedLogos
    {
        public int Id { get; set; }

        public int user_id { get; set; }

        public string logo { get; set; } = string.Empty;

        public User? user { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}
