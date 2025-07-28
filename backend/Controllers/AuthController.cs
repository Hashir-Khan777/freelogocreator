using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Helpers;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly JwtHelper _jwtHelper;
        public PasswordHasher<object> passwordHasher = new PasswordHasher<object>();
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, JwtHelper jwtHelper, EmailService emailService, IConfiguration configuration)
        {
            db = context;
            _jwtHelper = jwtHelper;
            _emailService = emailService;
            _configuration = configuration;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] User user)
        {
            bool user_exists = db.Users.Any(x => x.email == user.email);

            if (user_exists)
            {
                return BadRequest(new { message = "user already registered" });
            }

            string hashedPassword = passwordHasher.HashPassword(null, user.password);

            user.password = hashedPassword;
            user.role = "user";

            user.created_at = DateTime.UtcNow;
            user.updated_at = DateTime.UtcNow;

            db.Users.Add(user);
            db.SaveChanges();

            var random = new Random();
            int code = random.Next(100000, 1000000);

            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, code.ToString()),
                    new Claim(ClaimTypes.Email, user.email.ToString()),
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            await _emailService.SendEmailAsync(
                user.email,
                "Verification Code",
                $"<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\" />\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n  <title>OTP Verification</title>\r\n  <style>\r\n    body {{\r\n      margin: 0;\r\n      padding: 0;\r\n      background-color: #f4f4f4;\r\n      font-family: Arial, sans-serif;\r\n    }}\r\n\r\n    .wrapper {{\r\n      width: 100%;\r\n      background-color: #f4f4f4;\r\n      padding: 20px 0;\r\n    }}\r\n\r\n    .container {{\r\n      max-width: 600px;\r\n      margin: auto;\r\n      background-color: #ffffff;\r\n      border-radius: 10px;\r\n      overflow: hidden;\r\n    }}\r\n\r\n    .header {{\r\n      background-color: #202A44;\r\n      color: #ffffff;\r\n      padding: 20px;\r\n      text-align: center;\r\n    }}\r\n\r\n    .header h1 {{\r\n      margin: 0;\r\n      font-size: 22px;\r\n    }}\r\n\r\n    .logo {{\r\n      margin-top: 10px;\r\n    }}\r\n\r\n    .logo img {{\r\n      width: 80px;\r\n      height: auto;\r\n    }}\r\n\r\n    .content {{\r\n      padding: 30px;\r\n      color: #333333;\r\n      text-align: center;\r\n    }}\r\n\r\n    .content h2 {{\r\n      color: #202A44;\r\n      margin-top: 0;\r\n    }}\r\n\r\n    .otp-box {{\r\n      display: inline-block;\r\n      background-color: #f0f0f0;\r\n      padding: 15px 25px;\r\n      font-size: 24px;\r\n      font-weight: bold;\r\n      letter-spacing: 5px;\r\n      border-radius: 8px;\r\n      margin: 20px 0;\r\n    }}\r\n\r\n    .footer {{\r\n      background-color: #f1f1f1;\r\n      text-align: center;\r\n      padding: 15px;\r\n      font-size: 12px;\r\n      color: #888888;\r\n    }}\r\n\r\n    .footer a {{\r\n      color: #888888;\r\n      text-decoration: none;\r\n    }}\r\n\r\n    @media only screen and (max-width: 600px) {{\r\n      .container {{\r\n        width: 100% !important;\r\n        border-radius: 0;\r\n      }}\r\n\r\n      .content {{\r\n        padding: 20px;\r\n      }}\r\n\r\n      .otp-box {{\r\n        font-size: 20px;\r\n        padding: 12px 20px;\r\n      }}\r\n    }}\r\n  </style>\r\n</head>\r\n<body>\r\n  <div class=\"wrapper\">\r\n    <div class=\"container\">\r\n\r\n      <!-- Header with Logo -->\r\n      <div class=\"header\">\r\n        <div class=\"logo\">\r\n          <img src=\"http://ec2-3-88-133-167.compute-1.amazonaws.com/assets/imgs/theme/logo-maker-logo0-removebg.png\" alt=\"Logo Maker Website Logo\" />\r\n        </div>\r\n        <h1>OTP Verification</h1>\r\n      </div>\r\n\r\n      <!-- Content -->\r\n      <div class=\"content\">\r\n        <h2>Hello {user.name},</h2>\r\n        <p>To verify your identity and complete your action on <strong>Logo Maker Website</strong>, please use the following One-Time Password (OTP):</p>\r\n\r\n        <div class=\"otp-box\">{code.ToString()}</div>\r\n\r\n        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>\r\n        <p>If you didn’t request this, please ignore this message or contact our support team.</p>\r\n      </div>\r\n\r\n      <!-- Footer -->\r\n      <div class=\"footer\">\r\n        © 2025 Logo Maker Website • <a href=\"https://logomaker.com\">logomaker.com</a>\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n</body>\r\n</html>\r\n"
            );

            return Ok(new { message = "User registered", token = tokenHandler.WriteToken(token)});
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            User? existing_user = db.Users.Where(x => x.email == user.email && x.verified).FirstOrDefault();
            
            if (existing_user != null)
            {
                PasswordVerificationResult result = passwordHasher.VerifyHashedPassword(
                    null,
                    existing_user.password,
                    user.password
                );

                if (result == PasswordVerificationResult.Success)
                {
                    var jwttoken = _jwtHelper.GenerateToken(existing_user.Id, existing_user.role);

                    return Ok(new { message = "User loggedin", data = existing_user, token = jwttoken });
                }
                else
                {
                    return BadRequest(new { message = "Incorrect password" });
                }
            }
            
            return NotFound(new { message = "Please register yourself" });
        }

        [Authorize]
        [HttpPost("emailverification")]
        async public Task<IActionResult> EmailVerification([FromBody] dynamic body)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var code = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var submittedCode = body.GetProperty("code").GetString();

            User? existing_user = db.Users.Where(x => x.email == email).FirstOrDefault();

            if (existing_user != null)
            {
                if (submittedCode == code)
                {
                    existing_user.verified = true;
                    db.Users.Update(existing_user);
                    db.SaveChanges();

                    await _emailService.SendEmailAsync(
                        existing_user.email,
                        "Email Verified",
                        $"<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n  <meta charset=\"UTF-8\" />\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n  <title>Welcome Email</title>\r\n  <style>\r\n    body {{\r\n      margin: 0;\r\n      padding: 0;\r\n      background-color: #f4f4f4;\r\n      font-family: Arial, sans-serif;\r\n    }}\r\n\r\n    .wrapper {{\r\n      width: 100%;\r\n      background-color: #f4f4f4;\r\n      padding: 20px 0;\r\n    }}\r\n\r\n    .container {{\r\n      max-width: 600px;\r\n      margin: auto;\r\n      background-color: #ffffff;\r\n      border-radius: 10px;\r\n      overflow: hidden;\r\n    }}\r\n\r\n    .header {{\r\n      background-color: #202A44;\r\n      color: #ffffff;\r\n      padding: 20px;\r\n      text-align: center;\r\n    }}\r\n\r\n    .header h1 {{\r\n      margin: 0;\r\n      font-size: 24px;\r\n    }}\r\n\r\n    .logo {{\r\n      margin: 15px auto 0;\r\n      text-align: center;\r\n    }}\r\n\r\n    .logo img {{\r\n      width: 80px;\r\n      height: auto;\r\n    }}\r\n\r\n    .hero {{\r\n      text-align: center;\r\n      padding: 20px;\r\n    }}\r\n\r\n    .hero img {{\r\n      width: 100%;\r\n      max-width: 500px;\r\n      border-radius: 5px;\r\n    }}\r\n\r\n    .content {{\r\n      padding: 30px;\r\n      color: #333333;\r\n    }}\r\n\r\n    .content h2 {{\r\n      color: #202A44;\r\n      margin-top: 0;\r\n    }}\r\n\r\n    .content p,\r\n    .content ul {{\r\n      font-size: 16px;\r\n      line-height: 1.5;\r\n    }}\r\n\r\n    .content ul {{\r\n      padding-left: 20px;\r\n    }}\r\n\r\n    .buttons {{\r\n      text-align: center;\r\n      margin-top: 20px;\r\n    }}\r\n\r\n    .btn {{\r\n      display: inline-block;\r\n      text-decoration: none;\r\n      padding: 12px 25px;\r\n      border-radius: 5px;\r\n      color: #ffffff;\r\n      margin: 5px;\r\n      font-weight: bold;\r\n    }}\r\n\r\n    .btn.qr {{\r\n      background-color: #00B894;\r\n    }}\r\n\r\n    .btn.logo {{\r\n      background-color: #0984E3;\r\n    }}\r\n\r\n    .footer {{\r\n      background-color: #f1f1f1;\r\n      text-align: center;\r\n      padding: 20px;\r\n      font-size: 12px;\r\n      color: #888888;\r\n    }}\r\n\r\n    .footer a {{\r\n      color: #888888;\r\n      text-decoration: none;\r\n    }}\r\n\r\n    @media only screen and (max-width: 600px) {{\r\n      .container {{\r\n        width: 100% !important;\r\n        border-radius: 0;\r\n      }}\r\n\r\n      .content {{\r\n        padding: 20px;\r\n      }}\r\n\r\n      .btn {{\r\n        width: 100%;\r\n        box-sizing: border-box;\r\n      }}\r\n    }}\r\n  </style>\r\n</head>\r\n<body>\r\n  <div class=\"wrapper\">\r\n    <div class=\"container\">\r\n\r\n      <!-- Header with Logo -->\r\n      <div class=\"header\">\r\n        <div class=\"logo\">\r\n          <img src=\"http://ec2-3-88-133-167.compute-1.amazonaws.com/assets/imgs/theme/logo-maker-logo0-removebg.png\" alt=\"Logo Maker Website Logo\" />\r\n        </div>\r\n        <h1>Welcome to Logo Maker Website!</h1>\r\n      </div>\r\n      <!-- Content -->\r\n      <div class=\"content\">\r\n        <h2>Hi {existing_user.name},</h2>\r\n        <p>\r\n          Thank you for joining <strong>Logo Maker Website</strong> — the easiest way to generate stylish QR codes and customize professional logos.\r\n        </p>\r\n        <p>\r\n          Whether you're building your brand or just getting started, we’re here to help you create something amazing.\r\n        </p>\r\n        <ul>\r\n          <li>Generate QR codes in seconds</li>\r\n          <li>Customize logos quickly and easily</li>\r\n          <li>Download and reuse your designs anytime</li>\r\n        </ul>\r\n        <p>Ready to begin?</p>\r\n\r\n        <!-- Buttons -->\r\n        <div class=\"buttons\">\r\n          <a href=\"https://logomaker.com/qrcode\" class=\"btn qr\">Generate QR Code</a>\r\n          <a href=\"https://logomaker.com/logo\" class=\"btn logo\">Customize Logo</a>\r\n        </div>\r\n\r\n        <p style=\"margin-top: 30px;\">Need help? We’re just one click away.</p>\r\n        <p><strong>The Logo Maker Website Team</strong></p>\r\n      </div>\r\n\r\n      <!-- Footer -->\r\n      <div class=\"footer\">\r\n        © 2025 Logo Maker Website. All rights reserved. <br />\r\n        <a href=\"https://logomaker.com/unsubscribe\">Unsubscribe</a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</body>\r\n</html>\r\n"
                    );

                    db.Subscriptions.Add(new Subscription
                    {
                        user_id = existing_user.Id,
                        package_id = 1,
                        created_at = DateTime.UtcNow,
                        updated_at = DateTime.UtcNow
                    });
                    db.SaveChanges();

                    return Ok(new { data = existing_user });
                }
                else
                {
                    return BadRequest(new { message = "Code is not correct" });
                }
            }

            return NotFound(new { message = "Please register yourself" });
        }

        [HttpPost("forgetpassword")]
        async public Task<IActionResult> ForgetPassword([FromBody] User user)
        {
            User? existing_user = db.Users.Where(x => x.email == user.email).FirstOrDefault();

            if (existing_user != null)
            {
                await _emailService.SendEmailAsync(
                    existing_user.email,
                    "Reset Password",
                    $"Your reset password link is http://ec2-3-88-133-167.compute-1.amazonaws.com/resetpassword"
                );

                return Ok(new { data = existing_user.email });
            }

            return NotFound(new { message = "Please register yourself" });
        }

        [HttpPost("resetpassword")]
        public IActionResult ResetPassword([FromBody] User user)
        {
            User? existing_user = db.Users.Where(x => x.email == user.email).FirstOrDefault();

            if (existing_user != null)
            {
                string hashedPassword = passwordHasher.HashPassword(null, user.password);

                existing_user.password = hashedPassword;

                db.Users.Update(existing_user);
                db.SaveChanges();

                return Ok(new { message = "Password successfully reset" });
            }

            return NotFound(new { message = "Please register yourself" });
        }

        [HttpGet("users")]
        public IActionResult GetUser()
        {
            List<User> all_users = db.Users.OrderByDescending(x => x.Id).ToList();

            return Ok(new { data = all_users });
        }

        [HttpGet("users/{id}")]
        public IActionResult GetUserById(int id)
        {
            User? user = db.Users.FirstOrDefault(x => x.Id == id);

            if (user != null)
            {
                return Ok(new { data = user });
            }
            else
            {
                return NotFound(new { message = "User not found" });
            }
        }

        public class AuthUser
        {
            public int Id { get; set; }

            public string name { get; set; } = string.Empty;

            public string email { get; set; } = string.Empty;

            public string? password { get; set; } = string.Empty;

            public string image { get; set; } = string.Empty;

            public string role { get; set; } = string.Empty;

            public string ipaddress { get; set; } = string.Empty;

            public bool verified { get; set; } = false;

            public int createdqrcodes { get; set; } = 0;

            public int downloadedlogos { get; set; } = 0;

            public string? sessionId { get; set; } = null;

            public DateTime created_at { get; set; }

            public DateTime updated_at { get; set; }
        }

        [HttpPut("users")]
        public IActionResult UpdateUser([FromBody] AuthUser user)
        {
            try
            {
                var prevuser = db.Users.FirstOrDefault(x => x.Id == user.Id);
                prevuser.name = user.name;
                prevuser.email = user.email;
                prevuser.image = user.image;
                prevuser.role = user.role;
                prevuser.createdqrcodes = user.createdqrcodes;
                prevuser.downloadedlogos = user.downloadedlogos;
                prevuser.updated_at = DateTime.UtcNow;
                if (user.password is not null)
                {
                    string hashedPassword = passwordHasher.HashPassword(null, user.password);

                    prevuser.password = hashedPassword;
                } else
                {
                    prevuser.password = prevuser.password;
                }
                db.Users.Update(prevuser);
                db.SaveChanges();

                return Ok(new { message = "User updated successfully", data = prevuser });
            }
            catch (Exception ex) { 
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("users/{id}")]
        public IActionResult Delete(int id)
        {
            User? user = db.Users.FirstOrDefault(x => x.Id == id);

            if (user != null)
            {
                db.Users.Remove(user);
                db.SaveChanges();
                return Ok(new { message = "User deleted successfully", data = user });
            }
            else
            {
                return NotFound(new { message = "User not found" });
            }
        }
    }
}
