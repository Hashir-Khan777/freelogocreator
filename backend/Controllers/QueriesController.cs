using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/queries")]
    [ApiController]
    public class QueriesController : ControllerBase
    {
        private readonly AppDbContext db;

        public QueriesController(AppDbContext context)
        {
            db = context;
        }

        [HttpPost]
        public IActionResult Add([FromBody] Queries query)
        {
            if (db.Queries.Count() > 0)
            {
                query.Id = db.Queries.Max(x => x.Id) + 1;
            }
            else
            {
                query.Id = 1;
            }
            query.created_at = DateTime.UtcNow;
            query.updated_at = DateTime.UtcNow;

            db.Queries.Add(query);
            db.SaveChanges();

            return Ok(new { message = "Query added successfully", data = query });
        }

        [HttpGet]
        public IActionResult Get()
        {
            List<Queries> all_queries = db.Queries.OrderByDescending(x => x.Id).ToList();

            return Ok(new { data = all_queries });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            Queries? query = db.Queries.FirstOrDefault(x => x.Id == id);

            if (query != null)
            {
                return Ok(new { data = query });
            }
            else
            {
                return NotFound(new { message = "Query not found" });
            }
        }

        [HttpPut]
        public IActionResult Update([FromBody] Queries query)
        {
            query.created_at = DateTime.UtcNow;
            query.updated_at = DateTime.UtcNow;
            db.Queries.Update(query);
            db.SaveChanges();

            return Ok(new { message = "Query updated successfully", data = query });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Queries? query = db.Queries.FirstOrDefault(x => x.Id == id);

            if (query != null)
            {
                db.Queries.Remove(query);
                db.SaveChanges();
                return Ok(new { message = "Query deleted successfully", data = query });
            }
            else
            {
                return NotFound(new { message = "Query not found" });
            }
        }
    }
}
