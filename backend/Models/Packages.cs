namespace backend.Models
{
    public class Packages
    {
        public int Id { get; set; }

        public int amount { get; set; }

        public string name { get; set; } = string.Empty;

        public int logolimit { get; set; }

        public int qrlimit { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}
