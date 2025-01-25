namespace backend.Models
{
    public class Subscription
    {
        public int Id { get; set; }

        public int package_id { get; set; }

        public int user_id { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        public Packages? package { get; set; }

        public User? user { get; set; }
    }
}
