using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PharmacyFinder.API.Models
{
    public class Medicine
    {
       
        public int Id { get; set; }
        [Required]
        public string MedicineName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
       
       [JsonIgnore]
        public int PharmacyId { get; set; }
    
        [JsonIgnore]
      public Pharmacy? Pharmacy { get; set; }


        
    }
    
}
