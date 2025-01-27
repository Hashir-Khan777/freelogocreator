using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController: ControllerBase
    {
        private readonly AppDbContext db;

        public CategoriesController(AppDbContext context)
        {
            db = context;
        }

        [HttpPost]
        public IActionResult Add([FromBody] Categories category)
        {
            if (db.Categories.Count() > 0)
            {
                category.Id = db.Categories.Max(x => x.Id) + 1;
            }
            else
            {
                category.Id = 1;
            }
            category.created_at = DateTime.UtcNow;
            category.updated_at = DateTime.UtcNow;

            db.Categories.Add(new Categories { Name = category.Name, created_at = category.created_at, updated_at = category.updated_at });
            db.SaveChanges();

            return Ok(new { message = "Category added successfully", data = category });
        }

        [HttpGet]
        public IActionResult Get()
        {
            List<Categories> all_categories = db.Categories.ToList();

            return Ok(new { data = all_categories });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            Categories? category = db.Categories.FirstOrDefault(x => x.Id == id);

            if (category != null)
            {
                return Ok(new { data = category });
            }
            else
            {
                return NotFound(new { message = "Category not found" });
            }
        }

        [HttpGet("graphics/{id}")]
        public IActionResult GetGraphicsByCategoryId(int id)
        {
            List<Graphics> graphics = db.Graphics.Where(x => x.category_id == id).ToList();

            if (graphics != null)
            {
                return Ok(new { data = graphics });
            }
            else
            {
                return NotFound(new { message = "Category not found" });
            }
        }

        [HttpPut]
        public IActionResult Update([FromBody] Categories category)
        {
            db.Categories.Update(category);
            db.SaveChanges();

            return Ok(new { message = "Category updated successfully", data = category });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Categories? category = db.Categories.FirstOrDefault(x => x.Id == id);

            if (category != null)
            {
                db.Categories.Remove(category);
                db.SaveChanges();
                return Ok(new { message = "Category deleted successfully", data = category });
            }
            else
            {
                return NotFound(new { message = "Category not found" });
            }
        }
    }
}
