using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/graphics")]
    [ApiController]
    public class GraphicsController : ControllerBase
    {
        private readonly AppDbContext db;

        public GraphicsController(AppDbContext context)
        {
            db = context;
        }

        [HttpPost]
        public IActionResult Add([FromBody] Graphics graphics)
        {
            db.Graphics.Add(graphics);
            db.SaveChanges();

            return Ok(new { message = "Graphic added successfully", data = graphics });
        }

        [HttpGet]
        public IActionResult Get()
        {
            List<Graphics> all_graphics = db.Graphics.ToList();

            return Ok(new { data = all_graphics });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            Graphics? graphic = db.Graphics.FirstOrDefault(x => x.Id == id);

            if (graphic != null)
            {
                return Ok(new { data = graphic });
            }
            else
            {
                return NotFound(new { message = "Graphic not found" });
            }
        }

        [HttpPut]
        public IActionResult Update([FromBody] Graphics graphics)
        {
            db.Graphics.Update(graphics);
            db.SaveChanges();

            return Ok(new { message = "Graphic updated successfully", data = graphics });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Graphics? graphic = db.Graphics.FirstOrDefault(x => x.Id == id);

            if (graphic != null)
            {
                db.Graphics.Remove(graphic);
                db.SaveChanges();
                return Ok(new { message = "Graphic deleted successfully", data = graphic });
            }
            else
            {
                return NotFound(new { message = "Graphic not found" });
            }
        }
    }
}
