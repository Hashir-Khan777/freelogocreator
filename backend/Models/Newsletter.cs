namespace backend.Models
{
    public class Newsletter
    {
        public int Id { get; set; }

        public string email { get; set; } = string.Empty;

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}
