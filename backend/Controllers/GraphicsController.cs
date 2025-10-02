using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace backend.Controllers
{
    [Route("api/graphics")]
    [ApiController]
    public class GraphicsController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly EmailService _emailService;

        public GraphicsController(AppDbContext context, EmailService emailService)
        {
            db = context;
            _emailService = emailService;
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

        [HttpGet("all/{page}")]
        public IActionResult Get(int page)
        {
            List<Graphics> all_graphics = db.Graphics.OrderByDescending(x => x.Id).Take(30 * page).ToList();

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
            graphics.created_at = DateTime.UtcNow;
            graphics.updated_at = DateTime.UtcNow;
            db.Graphics.Update(graphics);
            db.SaveChanges();

            return Ok(new { message = "Graphic updated successfully", data = graphics });
        }

        [HttpPost("stats")]
        public IActionResult AddStats([FromBody] LogoStats logostats)
        {
            logostats.created_at = DateTime.UtcNow;
            logostats.updated_at = DateTime.UtcNow;
            db.LogoStats.Update(logostats);
            db.SaveChanges();

            return Ok(new { message = "Graphic updated successfully", data = logostats });
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

        [HttpPost("save")]
        public async Task<IActionResult> SaveLogo([FromBody] SavedLogos savedLogo)
        {
            var prevuser = db.Users.FirstOrDefault(x => x.Id == savedLogo.user_id);
            if (db.SavedLogos.Count() > 0)
            {
                savedLogo.Id = db.SavedLogos.Max(x => x.Id) + 1;
            }
            else
            {
                savedLogo.Id = 1;
            }
            savedLogo.created_at = DateTime.UtcNow;
            savedLogo.updated_at = DateTime.UtcNow;
            db.SavedLogos.Add(savedLogo);
            db.SaveChanges();
            await _emailService.SendEmailAsync(prevuser.email, "Logo Saved", $"<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n    <title>Logo Saved</title>\r\n    <style>\r\n      body {{\r\n        margin: 0;\r\n        padding: 0;\r\n        background-color: #f4f4f4;\r\n        font-family: Arial, sans-serif;\r\n      }}\r\n\r\n      .wrapper {{\r\n        width: 100%;\r\n        background-color: #f4f4f4;\r\n        padding: 20px 0;\r\n      }}\r\n\r\n      .container {{\r\n        max-width: 600px;\r\n        margin: auto;\r\n        background-color: #ffffff;\r\n        border-radius: 10px;\r\n        overflow: hidden;\r\n      }}\r\n\r\n      .header {{\r\n        background-color: #202a44;\r\n        color: #ffffff;\r\n        padding: 20px;\r\n        text-align: center;\r\n      }}\r\n\r\n      .header h1 {{\r\n        margin: 0;\r\n        font-size: 22px;\r\n      }}\r\n\r\n      .logo {{\r\n        margin-top: 10px;\r\n      }}\r\n\r\n      .logo img {{\r\n        width: 80px;\r\n        height: auto;\r\n      }}\r\n\r\n      .content {{\r\n        padding: 30px;\r\n        color: #333333;\r\n        text-align: center;\r\n      }}\r\n\r\n      .content h2 {{\r\n        color: #202a44;\r\n        margin-top: 0;\r\n      }}\r\n\r\n      .qr-preview {{\r\n        margin: 20px auto;\r\n      }}\r\n\r\n      .qr-preview img {{\r\n        width: 180px;\r\n        height: auto;\r\n        border: 1px solid #ddd;\r\n        border-radius: 8px;\r\n        padding: 10px;\r\n        background-color: #fafafa;\r\n      }}\r\n\r\n      .btn {{\r\n        display: inline-block;\r\n        margin-top: 20px;\r\n        text-decoration: none;\r\n        padding: 12px 25px;\r\n        border-radius: 5px;\r\n        color: #ffffff;\r\n        background-color: #00b894;\r\n        font-weight: bold;\r\n      }}\r\n\r\n      .footer {{\r\n        background-color: #f1f1f1;\r\n        text-align: center;\r\n        padding: 15px;\r\n        font-size: 12px;\r\n        color: #888888;\r\n      }}\r\n\r\n      .footer a {{\r\n        color: #888888;\r\n        text-decoration: none;\r\n      }}\r\n\r\n      @media only screen and (max-width: 600px) {{\r\n        .container {{\r\n          width: 100% !important;\r\n          border-radius: 0;\r\n        }}\r\n\r\n        .content {{\r\n          padding: 20px;\r\n        }}\r\n\r\n        .btn {{\r\n          width: 100%;\r\n          box-sizing: border-box;\r\n        }}\r\n      }}\r\n    </style>\r\n  </head>\r\n  <body>\r\n    <div class=\"wrapper\">\r\n      <div class=\"container\">\r\n        <!-- Header with Logo -->\r\n        <div class=\"header\">\r\n          <div class=\"logo\">\r\n            <img\r\n              src=\"https://www.smartqrcodeandlogo.com/assets/imgs/theme/logo-maker-logo0-removebg.png\"\r\n              alt=\"Logo Maker Website Logo\"\r\n            />\r\n          </div>\r\n          <h1>Logo Successfully Saved!</h1>\r\n        </div>\r\n\r\n        <!-- Content -->\r\n        <div class=\"content\">\r\n          <h2>Hello {prevuser.name},</h2>\r\n          <p>\r\n            Your Logo has been successfully saved using\r\n            <strong>Logo Maker Website</strong>.\r\n          </p>\r\n\r\n          <!-- QR Code Preview -->\r\n          <div class=\"qr-preview\">\r\n            <div dangerouslySetInnerHTML={{ __html: {savedLogo.logo} }} />\r\n          </div>\r\n\r\n          <p>Click below to generate more logos like this.</p>\r\n\r\n          <a href=\"https://www.smartqrcodeandlogo.com/logo\" class=\"btn\"\r\n            >Generate Logo</a\r\n          >\r\n\r\n          <p style=\"margin-top: 30px\">\r\n            Want to customize a Qr Code for your Logo?\r\n          </p>\r\n          <a\r\n            href=\"https://www.smartqrcodeandlogo.com/qrcode\"\r\n            style=\"text-decoration: none; color: #0984e3; font-weight: bold\"\r\n            >Try Our Qr Code Maker →</a\r\n          >\r\n        </div>\r\n\r\n        <!-- Footer -->\r\n        <div class=\"footer\">\r\n          © 2025 Logo Maker Website •\r\n          <a href=\"https://www.smartqrcodeandlogo.com/\">logomaker.com</a>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </body>\r\n</html>\r\n");
            return Ok(new { message = "Logo saved successfully" });
        }
    }
}
