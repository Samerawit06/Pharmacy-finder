
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PharmacyFinder.API.Models
{
    public class Pharmacy
    {
        [Key]
        public int Id { get; set; }

        [Required (ErrorMessage ="Enter the pharmacy name")]
        public string Name { get; set; }=string.Empty;

        [Required(ErrorMessage = "Enter the address")]
        public string Address { get; set; } = string.Empty;
        [Required(ErrorMessage = "Enter the Contact number")]
        public string Contact { get; set; } = string.Empty;

        [Required(ErrorMessage = "Enter the LicenseNumber")]
        public string LicenseNumber { get; set; } = string.Empty;

        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int OperatingHours { get; set; }
        public bool IsApproved { get; set; } = false;

        
        [Required]
        public int OwnerId { get; set; }

        [JsonIgnore]
        [ForeignKey("OwnerId")]
        public User? Owner { get; set; }

        [JsonIgnore]
        public ICollection<Medicine>? Medicines { get; set; }
    }
}
