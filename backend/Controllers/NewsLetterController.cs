using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace backend.Controllers
{
    [Route("api/newsletter")]
    [ApiController]
    public class NewsLetterController : ControllerBase
    {
        private readonly AppDbContext db;

        public NewsLetterController(AppDbContext context, JwtHelper jwtHelper)
        {
            db = context;
        }

        [HttpPost("subscribe")]
        public IActionResult Subscribe([FromBody] Newsletter obj)
        {
            if (db.Newsletter.Count() > 0)
            {
                obj.Id = db.Newsletter.Max(x => x.Id) + 1;
            }
            else
            {
                obj.Id = 1;
            }
            obj.created_at = DateTime.UtcNow;
            obj.updated_at = DateTime.UtcNow;

            db.Newsletter.Add(obj);
            db.SaveChanges();

            return Ok(new { message = "Subscribed Successfully" });
        }

        [HttpGet("subscribers")]
        public IActionResult GetNewsLetter()
        {
            List<Newsletter> all_letters = db.Newsletter.OrderByDescending(x => x.Id).ToList();

            return Ok(new { data = all_letters });
        }
    }
}
