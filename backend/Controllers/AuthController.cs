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
                $"Hello {user.name},\n\nUse this One-Time Password (OTP) to verify your Logo Maker account.\n{code.ToString()},\n\nThis OTP is valid for 1 hour. If you did not request this code, please ignore this email or contact support."
            );

            return Ok(new { message = "User registered", token = tokenHandler.WriteToken(token)});
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            User? existing_user = db.Users.Where(x => x.email == user.email).FirstOrDefault();
            
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

                    await _emailService.SendEmailAsync(
                        existing_user.email,
                        "Email Verified",
                        $"Welcome {existing_user.name},\n\nYour email has been verified."
                    );

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

        [HttpPut("users")]
        public IActionResult UpdateUser([FromBody] User user)
        {
            try
            {
                var prevuser = db.Users.FirstOrDefault(x => x.Id == user.Id);
                prevuser.name = user.name;
                prevuser.email = user.email;
                prevuser.image = user.image;
                prevuser.role = user.role;
                prevuser.updated_at = DateTime.UtcNow;
                if (user.password is not null)
                {
                    string hashedPassword = passwordHasher.HashPassword(null, user.password);

                    prevuser.password = hashedPassword;
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
