using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyFinder.API.Data;
using PharmacyFinder.API.Models;
using System.Linq;

namespace PharmacyFinder.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PharmacyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PharmacyController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetPharmacies()
        {
            var pharmacies = _context.Pharmacies.ToList();
            return Ok(pharmacies);
        }

        [HttpGet("approved")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetApprovedPharmacies()
        {
            var pharmacies = _context.Pharmacies.Where(p => p.IsApproved).ToList();
            return Ok(pharmacies);
        }

     
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult AddPharmacy([FromBody] Pharmacy pharmacy)
        {
           
                var ownerExists = _context.Users.Any(u => u.Id == pharmacy.OwnerId);
                if (!ownerExists)
                {
                    return BadRequest($"Owner with Id {pharmacy.OwnerId} does not exist.");
                }

        pharmacy.IsApproved = false; 
        _context.Pharmacies.Add(pharmacy);
        _context.SaveChanges();
        
        return CreatedAtAction(nameof(GetPharmacies), new { id = pharmacy.Id }, pharmacy);
}
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public IActionResult ApprovePharmacy(int id)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            var pharmacy = _context.Pharmacies.Find(id);
            if (pharmacy == null)
                return NotFound("Pharmacy not found.");

            pharmacy.IsApproved = true;
            _context.SaveChanges();
            return Ok(pharmacy);
        }

       
        [HttpGet("{pharmacyId}/medicines")]
        [Authorize(Roles = "Admin, Owner")]
        public IActionResult GetMedicines(int pharmacyId)
        {
            var medicines = _context.Medicines
                .Where(m => m.PharmacyId == pharmacyId)
                .ToList();
            return Ok(medicines);
        }

        
        [HttpPost("{pharmacyId}/medicines")]
        [Authorize(Roles = "Owner")]
        public IActionResult AddMedicine(int pharmacyId, [FromBody] Medicine medicine)
        {

            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            var pharmacy = _context.Pharmacies.Find(pharmacyId);
            if (pharmacy == null)
                return NotFound("Pharmacy not found.");

            medicine.PharmacyId = pharmacyId;
            _context.Medicines.Add(medicine);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetMedicines), new { pharmacyId = pharmacyId }, medicine);
        }

        [HttpPut("{pharmacyId}/medicines/{medicineId}")]
        [Authorize(Roles = "Owner")]
        public IActionResult UpdateMedicine(int pharmacyId, int medicineId, [FromBody] Medicine updatedMedicine)
        {
            var medicine = _context.Medicines.FirstOrDefault(m => m.Id == medicineId && m.PharmacyId == pharmacyId);
            if (medicine == null)
                return NotFound("Medicine not found.");

            medicine.MedicineName = updatedMedicine.MedicineName;
            medicine.Price = updatedMedicine.Price;
            medicine.Quantity = updatedMedicine.Quantity;

            _context.SaveChanges();
            return Ok(medicine);
        }

        
        [HttpDelete("{pharmacyId}/medicines/{medicineId}")]
        [Authorize(Roles = "Owner")]
        public IActionResult DeleteMedicine(int pharmacyId, int medicineId)
        {
            var medicine = _context.Medicines.FirstOrDefault(m => m.Id == medicineId && m.PharmacyId == pharmacyId);
            if (medicine == null)
                return NotFound("Medicine not found.");

            _context.Medicines.Remove(medicine);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public IActionResult SearchByLocation( [FromQuery] string address)
        {
            if (string.IsNullOrWhiteSpace(address))
            {
                return BadRequest("Address is required");
            }
            var result = _context.Pharmacies
                .Where(p => EF.Functions.Like(p.Address, $"%{address}%"))
            .ToList();

            if (result.Count == 0)
            {
                return NotFound("Address not found");
            }
            return Ok(result);
        }
    }
}
