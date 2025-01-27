namespace backend.Models
{
    public class Logs
    {
        public int Id { get; set; }

        public string entity_name { get; set; } = string.Empty;

        public string action_type { get; set; } = string.Empty;

        public DateTime created_at { get; set; }
    }
}