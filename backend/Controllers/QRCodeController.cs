using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System.Drawing;

namespace backend.Controllers
{
    [Route("api/qrcode")]
    [ApiController]
    public class QRCodeController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly EmailService _emailService;

        public QRCodeController(AppDbContext context, EmailService emailService)
        {
            db = context;
            _emailService = emailService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateQRCode([FromBody] Models.QRCode data)
        {
            if (db.QRCode.Count() > 0)
            {
                data.Id = db.QRCode.Max(x => x.Id) + 1;
            }
            else
            {
                data.Id = 1;
            }
            data.created_at = DateTime.UtcNow;
            data.updated_at = DateTime.UtcNow;

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode("http://ec2-3-88-133-167.compute-1.amazonaws.com/qr/" + data.Id, QRCodeGenerator.ECCLevel.Q);
            QRCoder.QRCode qrCode = new QRCoder.QRCode(qrCodeData);

            Color darkColor = ColorTranslator.FromHtml(data.color);
            Color lightColor = Color.Transparent;

            Bitmap qrCodeImage;

            if (!String.IsNullOrEmpty(data.logo))
            {
                var base64Data = data.logo.Contains(",") ? data.logo.Split(',')[1] : data.logo;
                byte[] imageBytes = Convert.FromBase64String(base64Data);
                using var logo_ms = new MemoryStream(imageBytes);
                using var bitmapLogo = new Bitmap(logo_ms);

                qrCodeImage = qrCode.GetGraphic(lightColor: lightColor, darkColor: darkColor, pixelsPerModule: 20, drawQuietZones: true, icon: bitmapLogo);
            } else
            {
                qrCodeImage = qrCode.GetGraphic(lightColor: lightColor, darkColor: darkColor, pixelsPerModule: 20, drawQuietZones: true);
            }

            byte[] qrCodeBytes;

            using (MemoryStream ms = new MemoryStream())
            {
                qrCodeImage.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                qrCodeBytes = ms.ToArray();
            }

            data.image = Convert.ToBase64String(qrCodeBytes);
            data.deleted = false;

            db.QRCode.Add(data);
            db.SaveChanges();

            var prevuser = db.Users.FirstOrDefault(x => x.Id == data.user_id);
            prevuser.createdqrcodes = prevuser.createdqrcodes + 1;
            db.Users.Update(prevuser);
            db.SaveChanges();

            await _emailService.SendEmailAsync(prevuser.email, "QR Code Generated", $"<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\" />\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n  <title>QR Code Generated</title>\r\n  <style>\r\n    body {{\r\n      margin: 0;\r\n      padding: 0;\r\n      background-color: #f4f4f4;\r\n      font-family: Arial, sans-serif;\r\n    }}\r\n\r\n    .wrapper {{\r\n      width: 100%;\r\n      background-color: #f4f4f4;\r\n      padding: 20px 0;\r\n    }}\r\n\r\n    .container {{\r\n      max-width: 600px;\r\n      margin: auto;\r\n      background-color: #ffffff;\r\n      border-radius: 10px;\r\n      overflow: hidden;\r\n    }}\r\n\r\n    .header {{\r\n      background-color: #202A44;\r\n      color: #ffffff;\r\n      padding: 20px;\r\n      text-align: center;\r\n    }}\r\n\r\n    .header h1 {{\r\n      margin: 0;\r\n      font-size: 22px;\r\n    }}\r\n\r\n    .logo {{\r\n      margin-top: 10px;\r\n    }}\r\n\r\n    .logo img {{\r\n      width: 80px;\r\n      height: auto;\r\n    }}\r\n\r\n    .content {{\r\n      padding: 30px;\r\n      color: #333333;\r\n      text-align: center;\r\n    }}\r\n\r\n    .content h2 {{\r\n      color: #202A44;\r\n      margin-top: 0;\r\n    }}\r\n\r\n    .qr-preview {{\r\n      margin: 20px auto;\r\n    }}\r\n\r\n    .qr-preview img {{\r\n      width: 180px;\r\n      height: auto;\r\n      border: 1px solid #ddd;\r\n      border-radius: 8px;\r\n      padding: 10px;\r\n      background-color: #fafafa;\r\n    }}\r\n\r\n    .btn {{\r\n      display: inline-block;\r\n      margin-top: 20px;\r\n      text-decoration: none;\r\n      padding: 12px 25px;\r\n      border-radius: 5px;\r\n      color: #ffffff;\r\n      background-color: #00B894;\r\n      font-weight: bold;\r\n    }}\r\n\r\n    .footer {{\r\n      background-color: #f1f1f1;\r\n      text-align: center;\r\n      padding: 15px;\r\n      font-size: 12px;\r\n      color: #888888;\r\n    }}\r\n\r\n    .footer a {{\r\n      color: #888888;\r\n      text-decoration: none;\r\n    }}\r\n\r\n    @media only screen and (max-width: 600px) {{\r\n      .container {{\r\n        width: 100% !important;\r\n        border-radius: 0;\r\n      }}\r\n\r\n      .content {{\r\n        padding: 20px;\r\n      }}\r\n\r\n      .btn {{\r\n        width: 100%;\r\n        box-sizing: border-box;\r\n      }}\r\n    }}\r\n  </style>\r\n</head>\r\n<body>\r\n  <div class=\"wrapper\">\r\n    <div class=\"container\">\r\n\r\n      <!-- Header with Logo -->\r\n      <div class=\"header\">\r\n        <div class=\"logo\">\r\n          <img src=\"assets/imgs/theme/logo-maker-logo0-removebg.png\" alt=\"Logo Maker Website Logo\" />\r\n        </div>\r\n        <h1>QR Code Successfully Generated!</h1>\r\n      </div>\r\n\r\n      <!-- Content -->\r\n      <div class=\"content\">\r\n        <h2>Hello {prevuser.name},</h2>\r\n        <p>Your QR code has been successfully generated using <strong>Logo Maker Website</strong>.</p>\r\n\r\n        <!-- QR Code Preview -->\r\n        <div class=\"qr-preview\">\r\n          <img src=\"{$"data:image/png;base64,{data.image}"}\" alt=\"Your QR Code\">\r\n        </div>\r\n\r\n        <p>Click below to view or download your QR code.</p>\r\n\r\n        <a href=\"https://www.smartqrcodeandlogo.com/qrcode\" class=\"btn\">Download QR Code</a>\r\n\r\n        <p style=\"margin-top: 30px;\">\r\n          Want to customize a logo for your QR code?  \r\n        </p>\r\n        <a href=\"https://www.smartqrcodeandlogo.com/logo\" style=\"text-decoration: none; color: #0984E3; font-weight: bold;\">Try Our Logo Tool →</a>\r\n      </div>\r\n\r\n      <!-- Footer -->\r\n      <div class=\"footer\">\r\n        © 2025 Logo Maker Website • <a href=\"https://www.smartqrcodeandlogo.com/\">logomaker.com</a>\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n</body>\r\n</html>\r\n");

            return Ok(new { message = "Qr code generated", data = data });
        }

        [HttpGet]
        public IActionResult GetAllQRData()
        {
            List<Models.QRCode> qrcodes = db.QRCode.ToList();

            return Ok(new { data = qrcodes });
        }

        [HttpGet("user/{id}")]
        public IActionResult GetAllQRDataByUser(int id)
        {
            List<Models.QRCode> qrcodes = db.QRCode.Where(x => x.user_id == id).ToList();

            return Ok(new { data = qrcodes });
        }

        [HttpGet("restore/{id}")]
        public IActionResult RestoreQRData(int id)
        {
            Models.QRCode? qrcode = db.QRCode.FirstOrDefault(x => x.Id == id);
            qrcode.deleted = false;

            db.QRCode.Update(qrcode);
            db.SaveChanges();

            return Ok(new { data = qrcode });
        }

        [HttpGet("{id}")]
        public IActionResult GetQRData(int id)
        {
            Models.QRCode? qrcode = db.QRCode.FirstOrDefault(x => x.Id == id);

            if (qrcode != null)
            {
                return Ok(new { data = qrcode });
            }
            else
            {
                return NotFound(new { message = "QR code not found" });
            }
        }

        [HttpPut]
        public IActionResult UpdateQRData([FromBody] Models.QRCode qrcode)
        {
            qrcode.created_at = DateTime.UtcNow;
            qrcode.updated_at = DateTime.UtcNow;
            db.QRCode.Update(qrcode);
            db.SaveChanges();

            return Ok(new { message = "QR code updated successfully", data = qrcode });
        }

        [HttpPost("scan")]
        public IActionResult AddScan([FromBody] Scans scan)
        {
            scan.created_at = DateTime.UtcNow;
            scan.updated_at = DateTime.UtcNow;
            db.Scans.Update(scan);
            db.SaveChanges();

            return Ok(new { message = "scan added successfully", data = scan });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Models.QRCode? qrcode = db.QRCode.FirstOrDefault(x => x.Id == id);

            if (qrcode != null)
            {
                qrcode.deleted = true;
                db.QRCode.Update(qrcode);
                db.SaveChanges();
                return Ok(new { message = "QR code deleted successfully", data = qrcode });
            }
            else
            {
                return NotFound(new { message = "QR code not found" });
            }
        }
    }
}
