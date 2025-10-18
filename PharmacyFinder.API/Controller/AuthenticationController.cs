using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;
using PharmacyFinder.API.Data;    
using PharmacyFinder.API.Models;
using System.ComponentModel.DataAnnotations;


namespace PharmacyFinder.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthenticationController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto dto)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            if (!dto.Email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("invaild email format");
            }

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email is already registered.");

            CreatePasswordHash(dto.Password, out byte[] hash, out byte[] salt);

            var user = new User
            {
                UserName = dto.UserName,
                Email = dto.Email,
                PasswordHash = Convert.ToBase64String(hash) + "." + Convert.ToBase64String(salt),
                Role = dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return Unauthorized("Invalid credentials.");

            var parts = user.PasswordHash.Split('.');
            if (parts.Length != 2) return Unauthorized("Invalid password format.");

            var hash = Convert.FromBase64String(parts[0]);
            var salt = Convert.FromBase64String(parts[1]);

            if (!VerifyPasswordHash(dto.Password, hash, salt))
                return Unauthorized("Invalid credentials.");

            var token = CreateToken(user);

            return Ok(new { token, role = user.Role, username = user.UserName });
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured.")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured."),
                audience: _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured."),
                claims: claims,
                expires: DateTime.UtcNow.AddHours(double.Parse(_configuration["Jwt:ExpiryHours"] ?? "1")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA512();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(storedHash);
        }
    }

    public class UserRegisterDto
    {
        [Required (ErrorMessage ="User Name Required")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "email Required")]
       
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "password Required")]
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer"; 
    }

    public class UserLoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
