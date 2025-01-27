using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/logs")]
    [ApiController]
    public class LogController : ControllerBase
    {
        private readonly AppDbContext db;

        public LogController(AppDbContext context)
        {
            db = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            List<Logs> all_logs = db.Logs.ToList();

            return Ok(new { data = all_logs });
        }
    }
}
