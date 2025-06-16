using backend.Models;
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

        public QRCodeController(AppDbContext context)
        {
            db = context;
        }

        [HttpPost("generate")]
        public IActionResult GenerateQRCode([FromBody] Models.QRCode data)
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

            db.QRCode.Add(data);
            db.SaveChanges();

            var prevuser = db.Users.FirstOrDefault(x => x.Id == data.user_id);
            prevuser.createdqrcodes = prevuser.createdqrcodes + 1;
            db.Users.Update(prevuser);
            db.SaveChanges();

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
