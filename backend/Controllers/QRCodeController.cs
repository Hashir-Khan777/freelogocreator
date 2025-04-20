using backend.Models;
using Microsoft.AspNetCore.Mvc;
using QRCoder;

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
        public IActionResult GenerateQRCode([FromBody] QRCode data)
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

            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            using (QRCodeData qrCodeData = qrGenerator.CreateQrCode("http://ec2-3-88-133-167.compute-1.amazonaws.com/qr/" + data.Id, QRCodeGenerator.ECCLevel.Q))
            using (PngByteQRCode qrCode = new PngByteQRCode(qrCodeData))
            {
                byte[] qrCodeImage = qrCode.GetGraphic(20);

                data.image = Convert.ToBase64String(qrCodeImage);

                db.QRCode.Add(data);
                db.SaveChanges();

                return Ok(new { message = "Qr code generated", data = data });
            }
        }

        [HttpGet]
        public IActionResult GetAllQRData()
        {
            List<QRCode> qrcodes = db.QRCode.ToList();

            return Ok(new { data = qrcodes });
        }

        [HttpGet("{id}")]
        public IActionResult GetQRData(int id)
        {
            QRCode? qrcode = db.QRCode.FirstOrDefault(x => x.Id == id);

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
        public IActionResult UpdateQRData([FromBody] QRCode qrcode)
        {
            qrcode.created_at = DateTime.UtcNow;
            qrcode.updated_at = DateTime.UtcNow;
            db.QRCode.Update(qrcode);
            db.SaveChanges();

            return Ok(new { message = "QR code updated successfully", data = qrcode });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            QRCode? qrcode = db.QRCode.FirstOrDefault(x => x.Id == id);

            if (qrcode != null)
            {
                db.QRCode.Remove(qrcode);
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
