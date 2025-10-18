using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyFinder.API.Data;
using PharmacyFinder.API.Models;
using System.Net;
using System.Security.Claims;
using Tesseract;
using Tesseract.Interop;
using System.IO;

namespace PharmacyFinder.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class MedicineController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicineController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("User ID not found in token.");

            return int.Parse(userIdClaim);
        }

        [HttpPost("pharmacy/{pharmacyId}")]
        [Authorize(Roles = "Owner")]
        public IActionResult AddMedicine(int pharmacyId, [FromBody] Medicine medicine)
        {
            
            var userId = GetCurrentUserId();
            var pharmacy = _context.Pharmacies.Find(pharmacyId);
            if (pharmacy == null) return NotFound("Pharmacy not found.");
            if (pharmacy.OwnerId != userId) return Forbid("You do not own this pharmacy.");

            medicine.PharmacyId = pharmacyId;
            _context.Medicines.Add(medicine);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMedicines), new { pharmacyId }, medicine);
        }

        [HttpGet("pharmacy/{pharmacyId}")]
        [Authorize(Roles = "Admin,Owner")]
        public IActionResult GetMedicines(int pharmacyId)
        {
            var medicines = _context.Medicines
                .Where(m => m.PharmacyId == pharmacyId)
                .ToList();
            return Ok(medicines);
        }

        [HttpPut("pharmacy/{pharmacyId}/medicine/{medicineId}")]
        [Authorize(Roles = "Owner")]
        public IActionResult UpdateMedicine(int pharmacyId, int medicineId, [FromBody] Medicine updatedMedicine)
        {
         
            var medicine = _context.Medicines.FirstOrDefault(m => m.Id == medicineId && m.PharmacyId == pharmacyId);
            if (medicine == null)
                return NotFound("Medicine not found.");

            var pharmacy = _context.Pharmacies.Find(pharmacyId);
            var userId = GetCurrentUserId();
            if (pharmacy?.OwnerId != userId)
                return Forbid("You do not own this pharmacy.");

            medicine.MedicineName = updatedMedicine.MedicineName;
            medicine.Price = updatedMedicine.Price;
            medicine.Quantity = updatedMedicine.Quantity;

            _context.SaveChanges();
            return Ok(medicine);
        }

        [HttpDelete("pharmacy/{pharmacyId}/medicine/{medicineId}")]
        [Authorize(Roles = "Owner")]
        public IActionResult DeleteMedicine(int pharmacyId, int medicineId)
        {
            var medicine = _context.Medicines.FirstOrDefault(m => m.Id == medicineId && m.PharmacyId == pharmacyId);
            if (medicine == null)
                return NotFound("Medicine not found.");

            var pharmacy = _context.Pharmacies.Find(pharmacyId);
            var userId = GetCurrentUserId();
            if (pharmacy?.OwnerId != userId)
                return Forbid("You do not own this pharmacy.");

            _context.Medicines.Remove(medicine);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpGet("Search")]
        public IActionResult SearchMedicine(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Enter the name of the medicine");
            }
            var result = _context.Medicines.Where(p => EF.Functions.Like(p.MedicineName, $"%{name}%"))
            .ToList();

            if (result.Count == 0) {
                return NotFound("Medicine not found");
            }
            return Ok(result);
        }

        //[HttpPost("UploadImage")]
        //public IActionResult UploadImage(IFormFile image)
        //{
        //    if (image == null || image.Length == 0)
        //    {
        //        return BadRequest("Enter the image of prescription");
        //    }


        //    string extractedText;

            
        //    using (var ms = new MemoryStream())
        //    {
        //        image.CopyTo(ms);
        //        var imageBytes = ms.ToArray();


        //        var tessDataPath = Path.Combine(Directory.GetCurrentDirectory(), "tessdata");
        //        using var engine = new TesseractEngine(tessDataPath, "eng", EngineMode.Default);

        //        using var pix = Pix.LoadFromMemory(imageBytes);  // Correct method
        //        using var page = engine.Process(pix);
        //        extractedText = page.GetText();
        //    }


        //    var result = _context.Medicines.Where(p => EF.Functions.Like(p.MedicineName, $"%{image}%")).Select(m => new
        //    {
        //        pharmacyName = m.Pharmacy.Name,
        //        address = m.Pharmacy.Address,
        //        price = m.Price
        //    }).ToList();

        //    if (result.Count == 0) {
        //        return NotFound("Medicne not available");
        //            }
        //    return Ok(result);
        //}
        
    }
}
