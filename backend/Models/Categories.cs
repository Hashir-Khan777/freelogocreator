namespace backend.Models
{
    public class Categories
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public List<Graphics>? graphics { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }
    }
}
