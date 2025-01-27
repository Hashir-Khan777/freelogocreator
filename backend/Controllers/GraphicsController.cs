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
            if (db.Graphics.Count() > 0)
            {
                graphics.Id = db.Graphics.Max(x => x.Id) + 1;
            }
            else
            {
                graphics.Id = 1;
            }
            graphics.created_at = DateTime.UtcNow;
            graphics.updated_at = DateTime.UtcNow;

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

        [HttpPost("search/{query}")]
        public IActionResult Search(string query)
        {
            List<Graphics>? graphics = db.Graphics.Where(g => g.title.ToLower().Contains(query.ToLower()) || g.description.ToLower().Contains(query.ToLower())).ToList();

            if (graphics != null)
            {
                return Ok(new { data = graphics });
            }
            else
            {
                return NotFound(new { message = "Graphics not found" });
            }
        }

        [HttpGet("postall")]
        public async Task<IActionResult> PostAll()
        {
            string svgDirectory = @"D:\Zini Technology Projects\freelogocreator\backend\svgs";

            if (string.IsNullOrEmpty(svgDirectory) || !Directory.Exists(svgDirectory))
            {
                return BadRequest("Invalid directory path.");
            }

            var svgFiles = Directory.GetFiles(svgDirectory, "*.svg");
            Random rnd = new Random();

            var graphicsList = new List<Graphics>();
            foreach (var file in svgFiles)
            {
                int cat_id = rnd.Next(1, 11);
                Categories? category = db.Categories.FirstOrDefault(c => c.Id == cat_id);
                string svgContent = await System.IO.File.ReadAllTextAsync(file);
                string title = $"{category?.Name} Path.GetFileNameWithoutExtension(file)";
                string description = $"Description for {title}";

                graphicsList.Add(new Graphics
                {
                    graphic = svgContent,
                    title = title,
                    description = description,
                    category_id = cat_id,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow
                });
            }

            db.Graphics.AddRange(graphicsList);

            db.SaveChanges();

            return Ok($"{graphicsList.Count} SVG files have been added to the database.");
        }
    }
}
