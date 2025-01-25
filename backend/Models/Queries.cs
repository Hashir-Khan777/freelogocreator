namespace backend.Models
{
    public class Queries
    {
        public int Id { get; set; }

        public string name { get; set; } = string.Empty;

        public string email { get; set; } = string.Empty;

        public string number { get; set; } = string.Empty;

        public string message { get; set; } = string.Empty;

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        public User? user { get; set; }
    }
}
