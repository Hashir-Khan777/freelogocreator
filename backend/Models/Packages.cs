namespace backend.Models
{
    public class Packages
    {
        public int Id { get; set; }

        public int amount { get; set; }

        public string name { get; set; } = string.Empty;

        public string logolimit { get; set; } = string.Empty;

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}
