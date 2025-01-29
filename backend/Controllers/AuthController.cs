using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext db;
        private readonly JwtHelper _jwtHelper;
        public PasswordHasher<object> passwordHasher = new PasswordHasher<object>();

        public AuthController(AppDbContext context, JwtHelper jwtHelper)
        {
            db = context;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("signup")]
        public IActionResult SignUp([FromBody] User user)
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

            var jwttoken = _jwtHelper.GenerateToken(user.Id, user.role);

            return Ok(new { message = "User registered", data = user, token = jwttoken });
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

        [HttpPost("forgetpassword")]
        public IActionResult ForgetPassword([FromBody] User user)
        {
            User? existing_user = db.Users.Where(x => x.email == user.email).FirstOrDefault();

            if (existing_user != null)
            {
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
