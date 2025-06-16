namespace backend.Models
{
    public class LogoStats
    {
        public int Id { get; set; }

        public int? graphicid { get; set; }

        public int? userid { get; set; }

        public DateTime created_at { get; set; }

        public DateTime updated_at { get; set; }

        public User? user { get; set; }

        public Graphics? graphic { get; set; }
    }
}
