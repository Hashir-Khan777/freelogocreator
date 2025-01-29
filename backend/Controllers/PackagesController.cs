using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/packages")]
    [ApiController]
    public class PackagesController : ControllerBase
    {
        private readonly AppDbContext db;

        public PackagesController(AppDbContext context)
        {
            db = context;
        }

        [HttpPost]
        public IActionResult Add([FromBody] Packages package)
        {
            if (db.Packages.Count() > 0)
            {
                package.Id = db.Packages.Max(x => x.Id) + 1;
            }
            else
            {
                package.Id = 1;
            }
            package.created_at = DateTime.UtcNow;
            package.updated_at = DateTime.UtcNow;

            db.Packages.Add(package);
            db.SaveChanges();

            return Ok(new { message = "Package added successfully", data = package });
        }

        [HttpGet]
        public IActionResult Get()
        {
            List<Packages> all_package = db.Packages.OrderByDescending(x => x.Id).ToList();

            return Ok(new { data = all_package });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            Packages? package = db.Packages.FirstOrDefault(x => x.Id == id);

            if (package != null)
            {
                return Ok(new { data = package });
            }
            else
            {
                return NotFound(new { message = "Package not found" });
            }
        }

        [HttpPut]
        public IActionResult Update([FromBody] Packages package)
        {
            package.created_at = DateTime.UtcNow;
            package.updated_at = DateTime.UtcNow;
            db.Packages.Update(package);
            db.SaveChanges();

            return Ok(new { message = "Package updated successfully", data = package });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Packages? package = db.Packages.FirstOrDefault(x => x.Id == id);

            if (package != null)
            {
                db.Packages.Remove(package);
                db.SaveChanges();
                return Ok(new { message = "Package deleted successfully", data = package });
            }
            else
            {
                return NotFound(new { message = "Package not found" });
            }
        }
    }
}
